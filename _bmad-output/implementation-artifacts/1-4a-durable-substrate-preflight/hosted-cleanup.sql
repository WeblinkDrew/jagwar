do $$
declare
    job_record record;
begin
    for job_record in
        select jobid from cron.job where jobname like 'jagwar-story-1-4a-%'
    loop
        perform cron.unschedule(job_record.jobid);
    end loop;
end;
$$;

drop function if exists public.jagwar_preflight_record_work(text, text);
drop function if exists public.jagwar_preflight_claim_nonce(text, bigint);
drop schema if exists jagwar_preflight_private cascade;
select pgmq.drop_queue('jagwar_preflight');

delete from vault.secrets where name like 'jagwar-preflight-%';

drop role if exists jagwar_preflight_worker;
drop extension if exists pgmq;
drop extension if exists pg_cron;
drop extension if exists pg_net;
drop schema if exists pgmq;
drop schema if exists cron cascade;
drop schema if exists net cascade;
