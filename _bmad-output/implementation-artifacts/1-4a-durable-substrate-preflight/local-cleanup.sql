\set ON_ERROR_STOP on

drop schema if exists jagwar_preflight_private cascade;
select pgmq.drop_queue('jagwar_preflight');
drop role if exists jagwar_preflight_worker;
drop extension if exists pgmq;
drop schema if exists pgmq;
