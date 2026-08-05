# Technology Review — Jagwar Architecture Spine

**Review date:** 2026-07-28  
**Lens:** named-technology currency, pinned-baseline reality, and operational fit  
**Verdict:** **CONDITIONAL FAIL / revision required before AD-6 is implementation-ready.** The inherited Onlook stack and the PGMQ/pg_cron upstream version claims are accurately pinned, and Supabase Queues is a sound candidate substrate. The committed Cron-to-Next.js consumer, however, depends on an unrecorded beta extension (`pg_net`) and an unverified deployment/runtime budget. The existing preflight is therefore insufficient to prove the selected execution path.

**Post-review disposition:** Andrew-approved CCR-019 through CCR-022 resolve OD-15 for the declared Jagwar workspace; pinned-Bun frozen install and web typecheck pass. This does not change the review's AD-6 substrate findings.

## Critical findings

None. The spine already blocks the affected durable-operation implementation on target extension preflight, so the gaps below have not yet become production defects.

## High findings

### H1 — The Cron-to-HTTP path silently depends on `pg_net` and Vault

**Evidence.** AD-6 commits Supabase Cron to triggering an authenticated Next.js HTTP consumer, but the Stack, sources, protected seams, and open-question preflight mention only PGMQ and pg_cron. Supabase's official scheduling pattern requires `pg_cron` **plus `pg_net`**, and recommends Vault for the authentication token. The official `pg_net` documentation marks its API beta, gives `net.http_post` a 2,000 ms default timeout, and states that HTTP request/response records use unlogged tables and can be lost on a crash. The pinned `apps/backend/supabase/config.toml` enables none of `pgmq`, `pg_cron`, or `pg_net` and contains no explicit database major version.

**Impact.** The architecture cannot currently demonstrate that Cron can reach, authenticate to, or observe the bounded consumer in either local or hosted environments. PGMQ retains durable work, but a lost or failed wake-up and an unmonitored HTTP response can delay work indefinitely or create uncontrolled retry/concurrency behavior.

**Required disposition:** **autofix the spine.** Add `pg_net` and Vault to AD-6/Stack/sources/preflight; pin the target-provided `pg_net` version; define secret provisioning/rotation, explicit HTTP timeout, response monitoring, recurring-wake-up retry semantics, and the acceptable delayed-processing SLO. Keep queue data private to PostgreSQL; do not expose `pgmq_public` to browser roles.

**Primary sources:** [Supabase scheduling functions](https://supabase.com/docs/guides/functions/schedule-functions), [Supabase pg_net](https://supabase.com/docs/guides/database/extensions/pg_net), [Supabase Vault](https://supabase.com/docs/guides/database/vault).

### H2 — Next.js supports the route, but the worker's deployment budget is not reality-checked

**Evidence.** A Next.js 16 Route Handler can implement the endpoint, but the repository supplies no `maxDuration`, `preferredRegion`, or explicit worker-deployment authority for the proposed new route. The only Vercel evidence in the pinned tree is integration/config usage, not proof of the target plan, region, function duration, or network reachability from Supabase. Next.js explicitly delegates execution limits to the deployment platform; Vercel terminates functions that exceed the configured/plan limit.

**Impact.** “Bounded batch” is not an enforceable technology fit without a numerical budget. A provider call could outlive the route, the PGMQ visibility window, or the pg_net request timeout, causing concurrent redelivery and reconciliation load despite the intended leases.

**Required disposition:** **discuss, then bind.** Before adopting the Next route as the consumer, record the deployment provider/plan, runtime and region, maximum route duration, batch-size and per-operation timeout budgets, visibility-timeout inequality, and maximum concurrent invocations. Add a non-production Cron→endpoint→PGMQ integration test and forced-timeout/redelivery test. If the current deployment cannot satisfy that budget, amend AD-6 rather than relying on post-response work.

**Primary sources:** [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route), [Next.js route segment `maxDuration`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config), [Vercel function duration](https://vercel.com/docs/functions/configuring-functions/duration).

### H3 — PGMQ is a viable choice, but local/hosted versions and required API behavior remain unproved

**Evidence.** Supabase documents Queues as durable, Postgres-native PGMQ and requires Supabase Postgres `15.6.1.143+`. Logged/basic queues are durable; unlogged queues explicitly sacrifice durability. The spine correctly selects logged queues and lists a preflight, but it records upstream PGMQ `1.11.1` rather than the version actually supplied by the target. The target pins Supabase CLI `2.53.6`, while `config.toml` does not pin a Postgres major/image. OD-15 frozen installation is now resolved; the queue/environment preflight remains independently unproved.

**Impact.** Code written against current upstream signatures or behavior can fail against the older target-provided extension. Hosted and local Supabase can also differ, making a local-only pass insufficient.

**Required disposition:** **retain the blocker and strengthen the preflight.** Record `server_version`, Supabase Postgres image/build, and `pg_available_extension_versions`/installed versions for `pgmq`, `pg_cron`, and `pg_net` in both approved non-production hosted and pinned local environments. Prove logged queue creation, transactional operation+`pgmq.send`, bounded `read` visibility, archive, crash/redelivery, and RLS/non-exposure behavior using only the detected API. Do not install upstream SQL manually to outrun the Supabase-managed extension.

**Primary sources:** [Supabase Queues overview](https://supabase.com/docs/guides/queues), [Supabase Queues quickstart](https://supabase.com/docs/guides/queues/quickstart), [Supabase PGMQ API](https://supabase.com/docs/guides/queues/pgmq), [PGMQ source](https://github.com/pgmq/pgmq), [Supabase CLI source](https://github.com/supabase/cli).

## Medium findings

### M1 — “Exactly once” needs an explicitly transport-scoped interpretation

Supabase and PGMQ promise exactly-once delivery **within a visibility window**, not end-to-end exactly-once provider effects. AD-7's stable idempotency key, fencing, and reconciliation are the right safeguards, but tests and operational language should call the overall contract at-least-once processing with idempotent/reconciled effects. Verify redelivery after worker termination before archive and a provider-success/database-commit-failure scenario.

**Disposition:** autofix terminology/tests; no technology change.  
**Primary source:** [PGMQ visibility timeout](https://github.com/pgmq/pgmq#visibility-timeout-vt).

### M2 — The Stack table is accurate but incomplete for named inherited technology

The pinned baseline and lockfile confirm Bun `1.3.1`, Next.js `16.0.7`, React `19.2.0`, tRPC `11.6.0`, Drizzle `0.44.7`, Zod `4.1.12`, Supabase CLI `2.53.6`, AI SDK `5.0.26`/`5.0.60`, Stripe `18.5.0`, Freestyle `0.0.78`, upstream PGMQ `1.11.1`, and upstream pg_cron `1.6.7`. The table omits named preserved CodeSandbox (`@codesandbox/sdk` locked `1.1.6`), the actual Supabase JS client (`2.76.1`), and required `pg_net`/hosted extension versions. Also label the table “pinned baseline resolutions” so old-but-intentional target versions are not mistaken for current recommendations.

**Disposition:** autofix the Stack table.  
**Primary sources for upstream-current claims:** [PGMQ releases/source](https://github.com/pgmq/pgmq), [pg_cron releases/source](https://github.com/citusdata/pg_cron).

## Confirmed fit

- The architecture ratifies the baseline's Next.js/tRPC/Drizzle/Supabase modular-monolith shape rather than adding a service framework.
- A logged PGMQ queue is aligned with the durability requirement; visibility plus archive supports the intended retry/audit design.
- Calling `pgmq.send` from the same PostgreSQL transaction as the operation row is technically compatible with PGMQ's SQL-function model and avoids an application-level dual-write.
- Cron is suitable as a recurring wake-up mechanism, subject to H1/H2; Supabase recommends no more than eight concurrent Cron jobs and no job longer than ten minutes, while the proposed `pg_net` call itself is asynchronous.
- The spine correctly rejects detached promises/`waitUntil` as the durable authority and keeps the operation row as source of truth.

## Gate recommendation

Do not mark the technology gate passed until H1 and H2 are incorporated and H3's preflight evidence exists. The chosen technology need not be replaced; the missing extensions, deployment constraints, and failure semantics must be made part of the commitment.
