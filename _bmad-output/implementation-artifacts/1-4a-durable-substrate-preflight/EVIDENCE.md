# Story 1.4a qualifying evidence — 2026-07-29

Qualifying run window: `2026-07-29T01:15:35Z`–`2026-07-29T01:46:51Z`. Evidence is redacted; no credential, database password, JWT, Vault plaintext, complete signed header, provider token, or raw sensitive payload is retained.

## Immutable inputs

| Item | Redacted actual result | Pass |
| --- | --- | --- |
| Writable target | `/Users/andrewsimic/Developer/Jagwar` | yes |
| Branch / HEAD / origin branch | `bmad/jagwar-foundation-bootstrap` / `47225e1660e23f7fb4dc3e5f35957255b43e096c` / same | yes |
| Pinned Onlook baseline | `423e2e924366419e418ee049093872d535eea41a` | yes |
| Remotes | origin `WeblinkDrew/jagwar`; upstream fetch `onlook-dev/onlook`; upstream push `DISABLED` | yes |
| Bun | repository `1.3.1`; shell `1.3.14`; Vercel builder `1.3.12` | yes, divergence recorded |
| Supabase CLI / Docker / Vercel CLI | `2.53.6` / `29.2.1` / `56.5.0` | yes |
| Hosted Supabase | ref `moknfpotrlbqktpqxlqf`; `WeblinkDrew's Project`; `ACTIVE_HEALTHY`; `us-west-2`; build `17.6.1.147` | yes |
| Vercel | project `prj_Zxw4O78qxbRtf2RNGmb2P7Y440la`; Pro; custom environment `preflight` type `preview`; Node.js project runtime `24.x`; route runtime `nodejs`; route `maxDuration=10`; actual compute `iad1` | yes |

## Evidence matrix

Each row names the retained command/SQL authority, expected outcome, redacted actual outcome, and final cleanup assertion.

| UTC | Proof | Environment and exact command/SQL | Expected | Redacted actual | Cleanup | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| `2026-07-29T01:15:35Z` | PostgreSQL and extension inventory | hosted MCP `execute_sql`: `select current_setting('server_version'), version()` plus `pg_available_extensions` query in `RUNBOOK.md` | exact available and installed versions | PostgreSQL `17.6`; hosted installed during exercise: `pgmq 1.5.1`, `pg_cron 1.6.4`, `pg_net 0.20.4`, Vault `0.3.1`; Vault alone installed before/after | hosted `pgmq`, `pg_cron`, `pg_net` absent; Vault `0.3.1` retained | yes |
| `2026-07-29T01:16:00Z` | Local inventory | `docker exec ... psql < local-proof.sql` | exact local versions distinct from hosted | PostgreSQL `17.6`; exercised `pgmq 1.5.1`; baseline `pg_net 0.19.5` and Vault `0.3.1`; available `pg_cron 1.6.4` | preflight role/schema/queue/`pgmq` absent; baseline extensions retained | yes |
| `2026-07-29T01:15:35Z` | Hosted logged queue lifecycle | exact PGMQ statements retained in setup/runbook; send → `read(...,2,1)` → immediate read → wait 3s → read → archive | logged queue, invisible during VT, redelivery increments count, archive succeeds | relations `relpersistence=p`, `is_unlogged=false`; `read_ct 1→2`; immediate count `0`; final active/archive `0/1` | queue dropped; `pgmq` schema/extension absent | yes |
| `2026-07-29T01:16:00Z` | Local logged queue lifecycle | `local-proof.sql` | same local lifecycle | permanent queue/archive tables; `read_ct 1→2`; immediate count `0`; archive `true`; active/archive `0/1` | queue, schema, extension absent | yes |
| `2026-07-29T01:19:00Z` | Hosted worker login and allow/deny matrix | pooler TLS `psql` as `jagwar_preflight_worker.<PROJECT_REF>`; `select current_user, session_user, worker_assertions()` | actual worker session; claim/complete only; queue/business/Vault/escalation denied | current/session user both worker; `claimComplete=true`; `directQueueDenied=true`; `businessTableDenied=true`; `vaultDenied=true`; `roleEscalationDenied=true` | login role and functions absent | yes |
| `2026-07-29T01:18:00Z` | Local worker login and allow/deny matrix | local TCP `psql` as worker; same assertion call | same local result | current/session user both worker; all five booleans `true` | login role and functions absent | yes |
| `2026-07-29T01:20:00Z` | Hosted Data API isolation | HTTPS GET `/rest/v1/jagwar_preflight_absent?select=*`, publishable key, `Accept-Profile: pgmq` | schema rejected at actual boundary | HTTP `406`, `PGRST106`; only `public, graphql_public` exposed | exposure unchanged; `pgmq` absent | yes |
| `2026-07-29T01:20:00Z` | Local Data API isolation | same request against local API | local schema rejected | HTTP `406`, `PGRST106`; only `public, storage` exposed | exposure unchanged; `pgmq` absent | yes |
| `2026-07-29T01:35:52Z` | Local/unit signature matrix | `bun test .../signature.test.ts` | valid plus missing, malformed, stale, future, tamper, invalid, replay; nonce invariant | `9 pass`, `0 fail`, including future-skew and `600 > 60+5+5` invariant | no external state | yes |
| `2026-07-29T01:36:00Z` | Deployed negative signature matrix | retained algorithm; requests signed over timestamp, nonce, exact body | all negative cases reject before nonce/work | missing `401`; malformed `401`; stale `401`; future +30s `401`; tamper `401`; invalid `401`; database counts afterward `0 nonce / 0 work` | nonce/work tables removed | yes |
| `2026-07-29T01:37:05Z` | Valid and replay | same route/algorithm | valid once; replay rejected before second work | valid `200` in actual `iad1`; replay `409`; database `1 nonce / 1 work` | rows/table removed | yes |
| `2026-07-29T01:40:17Z` | Rotation | Vault `update_secret` in memory; redeploy `--target=preflight`; current and retired signed requests | current accepted; retired rejected with no work | current `200`; retired `401 invalid_signature`; current work `1`, retired work `0` | Vault row/deployment removed; no bypass credential created | yes |
| `2026-07-29T01:40:48Z` | `pg_net` timeout envelope | `dispatch_signed(... workMs=1800)` with `timeout_milliseconds=9000` | caller survives work beyond old 2s default and records one result | request `1`; HTTP `200`; `timed_out=false`; correlated work at `01:40:51Z` | response extension/schema removed | yes |
| `2026-07-29T01:41:23Z` | Cron → `pg_net` → HTTPS | `cron.schedule(...,'10 seconds', dispatch_signed(...))`; unschedule after 12s | at least one successful correlated run, then no schedule | two bounded runs, `succeeded` in `0.009s` / `0.004s`; HTTP request IDs `2/3` both `200`; two work rows; unschedule `true` | `cron` schema/extension absent | yes |
| `2026-07-29T01:42:49Z` | Retry visibility | claim VT `60`; `pgmq.set_vt(...,5)`; immediate read; wait 6s; read/archive | retry unavailable before selected delay and returns afterward | immediate count `0`; `read_ct 1→2`; archive `true` | queue dropped | yes |
| `2026-07-29T01:42:00Z` | Bounded load and region | 20 signed calls, ten waves of two, `workMs=1800` | all `200`; actual concurrency 2; p95 below 6s; compute `iad1` | 20/20 `200`; wall `25.537s`; route min/p50/p95/max `2.006/2.184/2.367/2.392s`; client p95 `2.640s`; IDs `sfo1::iad1` | deployments removed | yes |
| `2026-07-29T01:46:51Z` | External cleanup | exact deletion/restore steps in `RUNBOOK.md` | no disposable Vercel or database state | Vercel: no deployments, custom environments, targets, bypass, or aliases; SSO restored to `all_except_custom_domains`. Hosted: zero preflight schemas/roles/secrets; diagnostic extensions absent; Vault retained. Local: `0 roles / 0 schemas / pgmq absent` | final state equals baseline/approved linkage | yes |

## Safety incident disposition

Earlier non-qualifying attempts remain part of the audit trail. Vercel CLI 54.7.0 twice classified an explicitly requested built-in Preview deployment as Production; both builds failed before readiness and were deleted. A prior automation-bypass value had also been displayed and immediately rotated/revoked. These attempts do not satisfy AC 7.

The qualifying run used Vercel CLI 56.5.0, a dedicated `preflight` custom environment whose API type and OIDC claim were `preview`/`preflight`, no automation-bypass credential, an in-memory HMAC value, a route that required `VERCEL_TARGET_ENV=preflight`, and a complete cleanup. `RUNBOOK.md` turns every discovered failure mode into a mandatory fail-closed gate.

## Final disposition

The qualifying run satisfies AC 1–7 with the corrected budgets in `RUNBOOK.md`. OD-11 may be treated as proven for Story 1.4b only with that retained kit, its `SECURITY DEFINER` hardening, actual worker-login model, explicit retry `set_vt`, and revised numeric budgets. Any broader budget or different transport requires new evidence or an AD-6 amendment.
