\set ON_ERROR_STOP on

do $$
begin
    if exists (
        select 1 from pg_available_extensions
        where name = 'pgmq' and installed_version is not null
    ) then
        raise exception 'Local preflight requires pgmq to be absent initially so cleanup cannot remove shared state';
    end if;
    if exists (select 1 from pg_roles where rolname = 'jagwar_preflight_worker')
       or exists (select 1 from pg_namespace where nspname = 'jagwar_preflight_private') then
        raise exception 'Stale local preflight objects exist';
    end if;
end;
$$;

create extension if not exists pgmq;
create schema jagwar_preflight_private;
revoke all on schema jagwar_preflight_private from public, anon, authenticated;

create table jagwar_preflight_private.unrelated_business_record (
    id bigint primary key,
    protected_value text not null
);
insert into jagwar_preflight_private.unrelated_business_record values (1, 'protected');
select pgmq.create('jagwar_preflight');

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

select name, default_version, installed_version
from pg_available_extensions
where name in ('pgmq', 'pg_cron', 'pg_net', 'supabase_vault')
order by name;

select c.relname, c.relpersistence
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'pgmq'
  and c.relname in ('q_jagwar_preflight', 'a_jagwar_preflight')
order by c.relname;

select pgmq.send('jagwar_preflight', '{"operationId":"preflight-local-1","kind":"preflight","payloadVersion":1,"traceId":"local-queue"}'::jsonb);
select msg_id, read_ct, message from pgmq.read('jagwar_preflight', 2, 1);
select count(*) as immediately_visible from pgmq.read('jagwar_preflight', 2, 1);
select pg_sleep(3);
select msg_id, read_ct, message from pgmq.read('jagwar_preflight', 60, 1);
select pgmq.archive('jagwar_preflight', 1);
select count(*) as active_count from pgmq.q_jagwar_preflight;
select count(*) as archive_count from pgmq.a_jagwar_preflight;

select pgmq.send('jagwar_preflight', '{"operationId":"preflight-local-worker","kind":"preflight","payloadVersion":1,"traceId":"local-worker"}'::jsonb);
