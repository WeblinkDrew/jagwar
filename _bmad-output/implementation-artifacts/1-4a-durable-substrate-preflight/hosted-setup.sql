-- Disposable Story 1.4a hosted preflight. Run only on the approved non-production project.
-- The runner replaces __HMAC_SECRET__ in memory and never writes the resulting SQL to disk or logs.

do $$
begin
    if exists (
        select 1 from pg_available_extensions
        where name in ('pgmq', 'pg_cron', 'pg_net') and installed_version is not null
    ) then
        raise exception 'Preflight requires pgmq, pg_cron, and pg_net to be absent initially so cleanup cannot remove shared state';
    end if;
    if not exists (
        select 1 from pg_available_extensions
        where name = 'supabase_vault' and installed_version = '0.3.1'
    ) then
        raise exception 'Expected baseline Vault 0.3.1 is unavailable';
    end if;
    if exists (select 1 from pg_roles where rolname = 'jagwar_preflight_worker')
       or exists (select 1 from pg_namespace where nspname = 'jagwar_preflight_private') then
        raise exception 'Stale preflight objects exist; inspect them before cleanup or rerun';
    end if;
end;
$$;

create extension if not exists pgmq;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create schema jagwar_preflight_private;
revoke all on schema jagwar_preflight_private from public, anon, authenticated;

create table jagwar_preflight_private.nonces (
    nonce text primary key,
    signed_at timestamptz not null,
    claimed_at timestamptz not null default clock_timestamp(),
    completed_at timestamptz
);

create table jagwar_preflight_private.work_log (
    id bigint generated always as identity primary key,
    nonce text not null references jagwar_preflight_private.nonces (nonce),
    trace_id text not null,
    executed_at timestamptz not null default clock_timestamp(),
    unique (nonce)
);

create table jagwar_preflight_private.unrelated_business_record (
    id bigint primary key,
    protected_value text not null
);
insert into jagwar_preflight_private.unrelated_business_record values (1, 'protected');

select pgmq.create('jagwar_preflight');

create function public.jagwar_preflight_claim_nonce(request_nonce text, signed_at_epoch bigint)
returns boolean
language sql
security definer
set search_path = pg_catalog, jagwar_preflight_private
as $$
    insert into jagwar_preflight_private.nonces (nonce, signed_at)
    values (request_nonce, to_timestamp(signed_at_epoch))
    on conflict do nothing
    returning true
$$;
alter function public.jagwar_preflight_claim_nonce(text, bigint) owner to postgres;
revoke all on function public.jagwar_preflight_claim_nonce(text, bigint) from public;
grant execute on function public.jagwar_preflight_claim_nonce(text, bigint) to anon;

create function public.jagwar_preflight_record_work(request_nonce text, request_trace_id text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, jagwar_preflight_private
as $$
begin
    insert into jagwar_preflight_private.work_log (nonce, trace_id)
    values (request_nonce, request_trace_id);
    update jagwar_preflight_private.nonces
    set completed_at = clock_timestamp()
    where nonce = request_nonce;
    return true;
end;
$$;
alter function public.jagwar_preflight_record_work(text, text) owner to postgres;
revoke all on function public.jagwar_preflight_record_work(text, text) from public;
grant execute on function public.jagwar_preflight_record_work(text, text) to anon;

create role jagwar_preflight_worker login noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
revoke all on schema pgmq, vault, jagwar_preflight_private from jagwar_preflight_worker;
grant usage on schema jagwar_preflight_private to jagwar_preflight_worker;

create function jagwar_preflight_private.claim_one()
returns jsonb
language sql
security definer
set search_path = pg_catalog, pgmq
as $$
    select jsonb_build_object('msgId', msg_id, 'readCount', read_ct, 'message', message)
    from pgmq.read('jagwar_preflight', 60, 1)
$$;
alter function jagwar_preflight_private.claim_one() owner to postgres;
revoke all on function jagwar_preflight_private.claim_one() from public;
grant execute on function jagwar_preflight_private.claim_one() to jagwar_preflight_worker;

create function jagwar_preflight_private.complete_one(message_id bigint)
returns boolean
language sql
security definer
set search_path = pg_catalog, pgmq
as $$
    select pgmq.archive('jagwar_preflight', message_id)
$$;
alter function jagwar_preflight_private.complete_one(bigint) owner to postgres;
revoke all on function jagwar_preflight_private.complete_one(bigint) from public;
grant execute on function jagwar_preflight_private.complete_one(bigint) to jagwar_preflight_worker;

create function jagwar_preflight_private.worker_assertions()
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, jagwar_preflight_private
as $$
declare
    claimed jsonb;
    denied_queue boolean := false;
    denied_business boolean := false;
    denied_vault boolean := false;
    denied_escalation boolean := false;
begin
    claimed := jagwar_preflight_private.claim_one();
    perform jagwar_preflight_private.complete_one((claimed ->> 'msgId')::bigint);
    begin perform 1 from pgmq.q_jagwar_preflight limit 1;
    exception when insufficient_privilege then denied_queue := true; end;
    begin perform 1 from jagwar_preflight_private.unrelated_business_record limit 1;
    exception when insufficient_privilege then denied_business := true; end;
    begin perform 1 from vault.decrypted_secrets limit 1;
    exception when insufficient_privilege then denied_vault := true; end;
    begin execute 'set role postgres';
    exception when insufficient_privilege then denied_escalation := true; end;
    return jsonb_build_object(
        'claimComplete', claimed is not null,
        'directQueueDenied', denied_queue,
        'businessTableDenied', denied_business,
        'vaultDenied', denied_vault,
        'roleEscalationDenied', denied_escalation
    );
end;
$$;
revoke all on function jagwar_preflight_private.worker_assertions() from public;
grant execute on function jagwar_preflight_private.worker_assertions() to jagwar_preflight_worker;

select vault.create_secret('__HMAC_SECRET__', 'jagwar-preflight-hmac-20260728', 'Disposable Story 1.4a signing credential');

create function jagwar_preflight_private.dispatch_signed(request_url text, request_body jsonb)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, jagwar_preflight_private, vault, net, extensions
as $$
declare
    secret_value text;
    timestamp_value bigint := extract(epoch from clock_timestamp())::bigint;
    nonce_value text := replace(gen_random_uuid()::text, '-', '');
    body_value text := request_body::text;
    signature_value text;
begin
    select decrypted_secret into strict secret_value
    from vault.decrypted_secrets
    where name = 'jagwar-preflight-hmac-20260728';
    signature_value := encode(extensions.hmac(
        timestamp_value::text || '.' || nonce_value || '.' || body_value,
        secret_value,
        'sha256'
    ), 'hex');
    return net.http_post(
        url := request_url,
        body := request_body,
        headers := jsonb_build_object(
            'content-type', 'application/json',
            'x-jagwar-timestamp', timestamp_value::text,
            'x-jagwar-nonce', nonce_value,
            'x-jagwar-signature', signature_value
        ),
        timeout_milliseconds := 9000
    );
end;
$$;
alter function jagwar_preflight_private.dispatch_signed(text, jsonb) owner to postgres;
revoke all on function jagwar_preflight_private.dispatch_signed(text, jsonb) from public, anon, authenticated;

-- The runner assigns a random password in memory, connects through the hosted
-- transaction pooler as jagwar_preflight_worker.[PROJECT_REF], and calls
-- worker_assertions() through that real authenticated session.
