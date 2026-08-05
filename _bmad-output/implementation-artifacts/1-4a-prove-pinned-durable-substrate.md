---
story_id: 1.4a
story_key: 1-4a-prove-pinned-durable-substrate
parent_story: 1.4
baseline_commit: a03802a8e85e5c10cd620fb0e654af7cd70ea605
traceability:
  - 7.5a
created: 2026-07-28
status: done
---

# Story 1.4a: Prove the pinned durable substrate

Status: done

## Story

As a product operator,
I want the selected durable-execution substrate proven in Jagwar's real non-production environment,
so that discovery and outreach can survive process and provider failures without a browser request or an unverified job design owning external effects or cost.

## Acceptance Criteria

1. **Pinned database substrate inventory**
   - Given the approved non-production Supabase target,
   - when the preflight runs,
   - then it records the target identity without credentials, PostgreSQL build, and the installed and available exact versions of `pgmq`, `pg_cron`, `pg_net`, and Vault,
   - and distinguishes local CLI evidence from hosted-target evidence.

2. **Logged queue and isolation proof**
   - Given a disposable preflight queue,
   - when the queue is created and exercised,
   - then it is a logged PGMQ queue, send/read/visibility/redelivery/archive behavior is demonstrated, and the queue remains absent from the Data API,
   - and no browser/client role receives direct queue access.

3. **Least-privileged worker proof**
   - Given a disposable restricted worker role and allowlisted preflight functions,
   - when privilege tests run,
   - then the role can perform only the required claim/complete preflight operations,
   - and direct queue-table, unrelated business-table, Vault-secret-listing, role-escalation, and Data API access fail closed.

4. **Vault, Cron-to-HTTPS, and signed-request proof**
   - Given a disposable non-production credential stored in Vault and a matching secret at an approved non-production Next deployment,
   - when Supabase Cron invokes the bounded HTTPS preflight consumer through `pg_net`,
   - then a valid signed request over timestamp, nonce, and body succeeds and is observable end to end,
   - and missing/invalid signatures, stale timestamps, repeated nonces, altered bodies, and the previous secret after rotation are rejected without executing work.

5. **Deployment envelope and numeric budgets**
   - Given the actual deployment used for the consumer proof,
   - when its runtime is measured,
   - then the provider, plan class, Node/Edge runtime, primary region, database region, configured duration ceiling, and measured invocation behavior are recorded,
   - and fixed batch, concurrency, request-timeout, visibility, lease, retry/backoff, attempt-ceiling, nonce-TTL, and total wall-clock budgets are chosen below the verified limits with explicit safety margin.

6. **Failure disposition**
   - Given any required facility or proof is unavailable,
   - when the preflight concludes,
   - then Story 1.4b, provider-backed discovery, and outreach remain blocked,
   - and AD-6 receives a proposed amendment before any alternative queue, detached worker, `waitUntil`, post-response promise, or in-memory job path is introduced.

7. **Safety and reproducibility**
   - Given the preflight is rerun,
   - when disposable resources are created and cleaned up,
   - then it is deterministic, secret-safe, non-production-only, and leaves no external provider, billing, publication, send, customer-data, or production side effect,
   - and all evidence names the exact target branch, HEAD, pinned Onlook baseline, tool versions, commands, timestamps, and redacted results.

## Tasks / Subtasks

- [x] Establish and record the immutable preflight inputs (AC: 1, 5, 7)
  - [x] Confirm target path, branch, HEAD, pinned baseline, Bun package-manager version, Supabase CLI version, Docker availability, and cleanly distinguish pre-existing worktree changes.
  - [x] Identify the approved hosted Supabase project and approved non-production Next deployment by non-secret identifiers; record deployment provider, plan class, regions, and route runtime limits.
  - [x] Assert required credentials/configuration are present without printing secret values; halt if the approved hosted targets are not identifiable.
- [x] Prove the database facilities on local and hosted targets (AC: 1, 2)
  - [x] Start the repository's existing local Supabase stack without editing protected configuration and record the PostgreSQL build and extension inventory.
  - [x] Run the same read-only inventory against the approved hosted non-production target.
  - [x] Exercise a disposable **logged** queue and record send, read, visibility expiry/redelivery, and archive evidence.
  - [x] Prove the queue is not exposed by the Data API and no client/browser role has queue privileges.
- [x] Prove the least-privileged worker boundary (AC: 3)
  - [x] Create only disposable preflight role/functions through a reviewed, reversible non-production script.
  - [x] Assert the explicit allowlist succeeds and the deny matrix fails closed.
  - [x] Drop disposable role/functions and prove cleanup.
- [x] Prove authenticated Cron-to-HTTPS execution (AC: 4)
  - [x] Use a disposable Vault secret and matching non-production deployment secret; never place either value in source, logs, evidence, or UI state.
  - [x] Schedule a bounded `pg_cron` invocation through `pg_net` and correlate Cron run, HTTP request, route receipt, nonce record, and result by trace ID.
  - [x] Test valid, missing, malformed, stale, replayed, body-tampered, rotated-current, and rotated-previous credential cases.
  - [x] Unschedule the job, remove the disposable secret/nonce data, and prove cleanup.
- [x] Measure and adopt fixed operating budgets (AC: 5)
  - [x] Record actual route runtime/provider/plan/region/duration constraints and database-region relationship.
  - [x] Measure no-op and bounded-work invocation timing under the approved non-production target.
  - [x] Select numeric batch, concurrency, request timeout, visibility, lease, retry/backoff, attempt ceiling, nonce TTL, and wall-clock budgets with rationale and safety margin.
- [x] Publish the preflight disposition (AC: 6, 7)
  - [x] Save redacted command/results evidence in the implementation artifact and link each AC to its proof.
  - [x] If every proof passes, mark OD-11 proven for Story 1.4b entry; otherwise keep dependent work blocked and draft the precise AD-6 amendment required by the failed assumption.
  - [x] Run `git diff --check`, relevant repository checks, and confirm no protected baseline file or generated artifact changed during preflight.

### Review Findings

- [x] [Review][Patch] Retain the required timestamped command/SQL evidence matrix and a deterministic, secret-safe rerun harness; narrative summaries and a deleted route do not satisfy AC 7 or the story's evidence contract. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:60]
- [x] [Review][Patch] Treat the accidental production-targeted deployment and displayed automation-bypass credential as failed safety assertions, then rerun through a procedure that prevents both conditions before claiming AC 7 passed. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:209]
- [x] [Review][Patch] Complete the signature proof with future-skew rejection, an explicit freshness-window-to-nonce-TTL invariant, local/unit coverage, and state assertions proving every rejected request executes no protected work. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:148]
- [x] [Review][Patch] Prove the real worker execution principal through the required authorization boundary; the retained record describes a `NOLOGIN` role exercised through temporary administrator membership instead of a reproducible worker connection. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:146]
- [x] [Review][Patch] Configure and test a `pg_net` timeout compatible with the adopted route envelope, or reduce the 8-second route and 5-second request budgets below the recorded 2-second caller default. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:156]
- [x] [Review][Patch] Reconcile batch `5`, concurrency `2`, per-request timeout `5s`, and route wall clock `8s`; the worst-case three execution waves cannot complete inside the route budget. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:208]
- [x] [Review][Patch] Define and prove how the `120s` retry backoff interacts with the `60s` queue visibility window so failed work cannot become claimable before its selected retry time. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:208]
- [x] [Review][Patch] Add mandatory `SECURITY DEFINER` hardening to the approved substrate contract, including fixed safe `search_path`, controlled ownership, explicit execute grants, and revocation from `PUBLIC`. [`_bmad-output/planning-artifacts/jagwar-foundation-handoff/09-risks-and-open-decisions.md`:98]
- [x] [Review][Patch] Record an actual local Data API boundary result in addition to the hosted `PGRST106` result, as required by the final evidence matrix. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:134]
- [x] [Review][Patch] Supply measured bounds and safety rationale for batch size, lease renewal, retry delays, attempt ceiling, and nonce TTL instead of adopting unexplained constants from five short invocations. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:208]
- [x] [Review][Patch] Keep OD-11 and dependent Story 1.4b work blocked until the missing proofs pass review; the authoritative handoff files currently publish completion while Story 1.4a remains under review. [`_bmad-output/planning-artifacts/jagwar-foundation-handoff/09-risks-and-open-decisions.md`:98]
- [x] [Review][Patch] Add Story 1.4b to sprint tracking so the approved split has an explicit backlog successor rather than only the unsplit parent Story 1.4. [`_bmad-output/implementation-artifacts/sprint-status.yaml`:55]
- [x] [Review][Patch] Correct the story File List to include every modified handoff artifact and accurately identify new versus updated files. [`_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`:222]

## Dev Notes

### Scope and stop conditions

- This story proves infrastructure assumptions; it does not implement the durable-operation domain core, discovery, outreach, billing, a production worker, or a fallback transport.
- Run only against local or explicitly approved non-production resources. Never deploy to production, send outreach, mutate billing, publish, migrate customer data, or use real provider effects.
- Do not edit any file present in baseline `423e2e924366419e418ee049093872d535eea41a`. A discovered need for `apps/backend/supabase/config.toml`, `apps/web/client/src/env.ts`, an existing deployment config, or any other protected path requires a new exact-path Core Change Request and Andrew's approval before editing.
- New disposable preflight files must be narrowly named and must not become a parallel job framework. Do not add an external dependency.
- The repository prohibits `db:gen`; CCR-003 is approved for **maintainer execution only** and is unrelated to this preflight.
- Missing approved hosted target identity, deployment linkage, or necessary configuration is a HALT condition. Local success cannot be reported as hosted-target proof.

### Architecture requirements

- AD-6 selects one logged PGMQ transport, with `pg_cron`/`pg_net` invoking a signed bounded Next consumer and Vault holding the database-side credential. The durable operation row—not a queue message—is future domain truth. Queue payloads are limited to `{ operationId, kind, payloadVersion, traceId }`.
- The request signature covers timestamp, nonce, and exact body. Verification must be constant-time where applicable; stale timestamps and nonce replay fail before work. Nonce recording must be atomic.
- `pg_net` is asynchronous and starts requests after transaction commit; its response storage is operational evidence, not durable business truth.
- PGMQ's visibility window prevents concurrent redelivery only for its duration. This does not remove the later need for idempotency, fencing, reconciliation, or at-least-once handling in Story 1.4b.
- Supabase documents that queues are not exposed through the Data API by default. The preflight must prove the target retains that default and must not enable the `pgmq_public` client API.
- The target's actual versions govern. Do not substitute current upstream versions for queried target versions.
- Next.js defaults route handlers to the Node.js runtime when no runtime is set, but deployment limits and regions are provider-dependent. Repository `vercel.json` contains redirects only and does not prove an attached Vercel project, plan, function region, or duration ceiling.

### Current repository observations to verify during execution

- Writable target: `/Users/andrewsimic/Developer/Jagwar`; branch `bmad/jagwar-foundation-bootstrap`; HEAD at story creation `a03802a8e85e5c10cd620fb0e654af7cd70ea605`; pinned baseline `423e2e924366419e418ee049093872d535eea41a`.
- Root declares `bun@1.3.1`; the current shell reported Bun `1.3.14`. Use pinned Bun for reproducibility-sensitive install checks and record both values.
- Existing backend script is `bun run backend:start` → `bun --filter @onlook/backend start` → `supabase start`; existing config is `apps/backend/supabase/config.toml`.
- At story creation, Docker engine `29.2.1` was reachable and Supabase CLI `2.53.6` was installed; the CLI reported a newer release but this story does not authorize upgrading the protected dependency/lock.
- No project-owned `.env`/`.env.local` or `.vercel/project.json` was found, and required Supabase/Vercel shell variables were absent. Treat this as preliminary evidence to reconfirm, not permission to invent target identities or credentials.

### Evidence format

For each proof record: UTC timestamp; environment (`local` or redacted hosted project ref); exact command or SQL; tool/server/extension version; expected result; redacted actual result; pass/fail; cleanup result. Never record access tokens, database passwords, JWTs, anon/service-role keys, Vault plaintext, complete signed headers, or provider payloads. The populated matrix and retained rerun kit are in `_bmad-output/implementation-artifacts/1-4a-durable-substrate-preflight/EVIDENCE.md` and `RUNBOOK.md`.

The final evidence matrix must include:

| Proof | Local | Hosted non-production | Required result |
| --- | --- | --- | --- |
| PostgreSQL build and four facilities | required | required | exact queried versions/availability |
| Logged queue lifecycle | required | required | send/read/redeliver/archive passes |
| Data API isolation | required | required | inaccessible until intentionally exposed; exposure remains disabled |
| Restricted worker allow/deny matrix | required | required | allowlist only |
| Vault create/retrieve/use/cleanup | optional local diagnostic | required | secret usable only by intended database function/role |
| Cron → `pg_net` → HTTPS | optional local diagnostic | required | correlated successful invocation |
| Signature freshness/replay/rotation matrix | unit/local plus deployed | required | valid only; every negative case denied |
| Provider/runtime/plan/regions/duration | not applicable | required | actual values, not inferred defaults |
| Numeric budgets | provisional only | required | measured and adopted below verified ceiling |

### Testing requirements

- Treat every preflight assertion as a test: capture the failing/unavailable state first, make only reversible non-production setup changes, rerun to green, then clean up and rerun the cleanup assertions.
- Queue tests must cover delayed visibility/redelivery and archive, not only enqueue success.
- Authorization tests must connect as the tested role; inspecting grants alone is insufficient.
- Data API isolation must be tested through the actual API boundary with non-secret test credentials, not inferred from schema names.
- Signature tests must cover at least valid, missing, malformed, stale, future-skewed, nonce replay, body tamper, current rotated key, and retired key.
- Observability must correlate database Cron/HTTP evidence and route evidence without logging credentials or raw sensitive payloads.
- No full application dev server is run. Use an approved deployed non-production route for the HTTPS proof or halt.

### Latest technical constraints

- Supabase Queues is PGMQ-backed; current Supabase documentation states PGMQ requires Postgres build `15.6.1.143` or later and that queues are not Data-API exposed by default.
- Supabase Cron uses `pg_cron`; current guidance recommends no more than eight concurrent jobs and no job longer than ten minutes. Jagwar's budgets must be materially tighter and based on its deployment ceiling.
- `pg_net` is beta, asynchronous, begins requests after commit, defaults HTTP timeout to 2,000 ms, and its response rows have limited retention; exact installed version and configured settings must be queried.
- Vault exposes decrypted secrets through a view; grants on that view require explicit least-privilege review. Evidence must never include decrypted content.
- Next.js `runtime`, `preferredRegion`, and `maxDuration` are deployment-sensitive route-segment settings. The deployment provider's actual configured values—not framework defaults—control the budget.

### Project structure notes

- Story output/evidence stays under `_bmad-output/implementation-artifacts/` unless a narrowly scoped new preflight fixture is necessary.
- A future production consumer is mapped to new path `apps/web/client/src/app/api/internal/operations/route.ts`, but creating it in this story is allowed only if needed for the non-production proof and it remains a bounded authenticated preflight surface. Do not register a second API root or edit AI/editor/billing/publication code.
- Future durable contracts belong in focused `@onlook/durable-operation`; they are Story 1.4b scope, not this preflight.

### References

- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md`, Story 1.4]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md`, sections 4.4, 5, and 6]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md`, AD-1, AD-3, AD-6, AD-7, AD-14, and Open Question 2]
- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/PATH-LEDGER.md`]
- [Source: `AGENTS.md`]
- [Supabase Queues](https://supabase.com/docs/guides/queues)
- [Supabase Queues quickstart](https://supabase.com/docs/guides/queues/quickstart)
- [Supabase PGMQ API](https://supabase.com/docs/guides/queues/pgmq)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Supabase `pg_net`](https://supabase.com/docs/guides/database/extensions/pg_net)
- [Supabase Vault](https://supabase.com/docs/guides/database/vault)
- [Next.js route segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Vercel function duration](https://vercel.com/docs/functions/configuring-functions/duration)
- [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region)

## Dev Agent Record

### Agent Model Used

GPT-5.6 Codex

### Debug Log References

- Story creation precheck: Docker reachable; repository has local Supabase configuration but no project-owned environment file, Vercel link metadata, or required Supabase/Vercel shell variables.
- 2026-07-28 preflight input inventory: target `/Users/andrewsimic/Developer/Jagwar`; branch `bmad/jagwar-foundation-bootstrap`; HEAD/baseline `a03802a8e85e5c10cd620fb0e654af7cd70ea605` / `423e2e924366419e418ee049093872d535eea41a`; declared/current Bun `1.3.1` / `1.3.14`; Supabase CLI `2.53.6`; Docker client/server `29.2.1`.
- Initial hosted-target discovery: the repository was not linked to a Supabase project. No project was selected or mutated until Andrew supplied and approved the exact target ref.
- Deployment discovery: Vercel CLI `54.7.0` is authenticated to `andrew-simics-projects`, which reports no projects. The repository has no `.vercel/project.json`; no deployment provider/plan/region/duration can be proven.
- HALT: the approved hosted Supabase target and approved non-production Next deployment are not identifiable, and required configuration is absent. Per the story and AD-6, local-only diagnostics cannot satisfy the preflight and no fallback queue may be introduced.
- 2026-07-28 blocker resolution: Andrew supplied Supabase project ref `moknfpotrlbqktpqxlqf`. Jagwar now has a project-scoped Codex MCP entry for that exact ref and its requested feature set; OAuth completed successfully. No token or secret is stored in the repository config.
- 2026-07-28 Vercel target: created `andrew-simics-projects/jagwar` (`prj_Zxw4O78qxbRtf2RNGmb2P7Y440la`), connected it to GitHub `WeblinkDrew/jagwar`, and set framework `nextjs`, root directory `apps/web/client`, install command `bun install --frozen-lockfile`, and build command `bun run build`. The production branch remains `main`. No deployment was triggered.
- 2026-07-28 Vercel envelope inventory: team plan `pro`; Fluid compute enabled; configured/default function region `iad1`; Node.js `24.x`; no project environment variables; no deployment yet. A deployed route's actual runtime and duration behavior remain unproven.
- 2026-07-28 approved hosted database: Supabase project `moknfpotrlbqktpqxlqf` (`WeblinkDrew's Project`), status `ACTIVE_HEALTHY`, region `us-west-2`, PostgreSQL `17.6`, hosted build `17.6.1.147`. Hosted available versions were `pgmq 1.5.1`, `pg_cron 1.6.4`, `pg_net 0.20.4`, and Vault `0.3.1`; only Vault was installed before the preflight.
- Local database inventory: PostgreSQL `17.6`; available `pgmq 1.5.1`, `pg_cron 1.6.4`, `pg_net 0.19.5`, and Vault `0.3.1`; baseline local state had `pg_net 0.19.5` and Vault installed. Local and hosted observations were recorded separately.
- Logged queue proof: local and hosted `jagwar_preflight` queues reported `is_unlogged=false`; queue and archive relations reported permanent persistence. Send/read made the message invisible during its lease, the read count advanced on redelivery after visibility expiry, archive returned true, and active/archive counts became `0/1`. Both queues were dropped.
- Data API isolation: an actual request using the project's non-secret publishable credential and `Accept-Profile: pgmq` returned HTTP `406`, `PGRST106`, and reported only `public, graphql_public` as exposed. `anon`, `authenticated`, and the test worker had no `pgmq` schema usage and no queue-table `SELECT` or `INSERT` privilege.
- Qualifying worker proof: the retained scripts created a `LOGIN`, `NOINHERIT`, non-superuser, non-creator, non-replicating, non-bypass-RLS role. Actual TLS pooler and local TCP sessions reported both `current_user` and `session_user` as `jagwar_preflight_worker`; claim/complete succeeded while direct queue, unrelated business table, Vault, and role escalation all failed closed. Every `SECURITY DEFINER` function used a fixed safe `search_path`, controlled owner, explicit execute grants, and `PUBLIC` revocation.
- Qualifying signed HTTPS proof: retained constant-time HMAC-SHA256 code and nine local tests cover valid, missing, malformed, stale, future-skewed, altered-body, invalid-signature, replay, and nonce-retention cases. The deployed negative matrix returned only `401` and left `0` nonce / `0` work rows. A valid request returned `200`; its replay returned `409` with exactly one work row. After Vault and deployment rotation, the current credential returned `200`, the retired credential returned `401`, and the retired trace had zero work rows.
- Qualifying Cron and caller-timeout proof: the hosted function passed `timeout_milliseconds=9000` to `pg_net`. An `1800ms` bounded-work request returned HTTP `200`, `timed_out=false`, and one work row after more than the former 2-second default envelope. A disposable ten-second Cron schedule ran twice (`0.009s` and `0.004s` enqueue transactions), correlated to HTTP request IDs `2/3`, two route work rows, and was unscheduled successfully.
- Qualifying deployment proof: Vercel project `prj_Zxw4O78qxbRtf2RNGmb2P7Y440la`, Pro plan, Node.js project runtime `24.x`; the route explicitly used Node and `maxDuration=10`. The final deployment used Vercel CLI `56.5.0` and a disposable custom environment whose API type was `preview`, CLI target was `preflight`, and OIDC claim was `environment:preflight`. Response IDs `sfo1::iad1::*` and build inspection proved actual compute `iad1` against Supabase `us-west-2`.
- Qualifying timing proof: 20 bounded signed invocations ran in ten sequential waves of two with 20/20 HTTP `200`. Route min/p50/p95/max was `2.006s` / `2.184s` / `2.367s` / `2.392s`; client p95 was `2.640s`; total wall time was `25.537s`.
- Corrected Story 1.4b entry budgets: claim batch `2`; concurrency `2`; outbound timeout `2s`; route wall clock `6s`; `pg_net` timeout `9s`; visibility `60s`; operation lease `30s` renewed at `15s`; retry backoff `5s`, `15s`, then `30s` with explicit `pgmq.set_vt`; attempt ceiling `4`; accepted timestamp past/future window `60s/5s`; clock-drift reserve `5s`; nonce TTL `600s`. Batch and concurrency now require one wave, route wall clock is over 2.5x measured p95 and 4s below the route ceiling, caller timeout is 3s above route wall clock, and nonce retention exceeds the complete accepted window by 530s.
- Safety incident and qualifying correction: earlier non-qualifying attempts included failed Vercel Production-classified builds and one displayed automation-bypass value that was immediately rotated/revoked. They remain audit history and do not satisfy AC 7. The qualifying run used a dedicated `preflight` custom environment, Vercel CLI `56.5.0`, no bypass credential, in-memory secrets that were never emitted, a `VERCEL_TARGET_ENV=preflight` route gate, and the retained fail-closed runbook.
- Cleanup proof at `2026-07-29T01:46:51Z`: Vercel reports no deployments, targets, aliases, bypass, or custom environments; Vercel Authentication is restored. Hosted `pgmq`, `pg_cron`, and `pg_net` are absent, Vault `0.3.1` remains installed, and preflight schemas/roles/secrets are zero. Local preflight roles/schemas are zero and `pgmq` is absent. The temporary app route is deleted; the redacted rerun kit remains.
- Completion repository state: writable target `/Users/andrewsimic/Developer/Jagwar`; branch `bmad/jagwar-foundation-bootstrap`; HEAD/origin branch `47225e1660e23f7fb4dc3e5f35957255b43e096c`; pinned upstream baseline `423e2e924366419e418ee049093872d535eea41a`; upstream push remains disabled. HEAD advanced through the separately committed fork-architecture work while the preflight was running; unrelated dirty work was preserved.
- Disposition after review remediation: AC 1–7 pass against the populated matrix in `1-4a-durable-substrate-preflight/EVIDENCE.md`. OD-11 is proven for Story 1.4b only with the retained hardening rules and corrected budgets; no AD-6 amendment or fallback transport is required.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Execution began and completed the repository/tooling inventory. Work stopped at the explicit missing-configuration gate before creating, linking, starting, or mutating any external resource.
- Andrew resolved target selection. Supabase MCP authentication and Vercel project/Git linkage are complete.
- The full local/hosted database, queue, isolation, actual worker-login, Vault, signed HTTPS, future-skew, no-work-on-rejection, Cron, `pg_net` timeout, replay, rotation, bounded-load, retry-visibility, and cleanup proofs passed with retained redacted evidence.
- OD-11 is proven and Story 1.4b may enter implementation review only with the corrected numeric budgets. No Production-classified deployment became ready or live; the qualifying deployment was the disposable `preflight` environment. No provider, billing, publication, outreach, or customer-data side effect occurred.

### File List

- `_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md` (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (new in this worktree; updated by this story)
- `_bmad-output/implementation-artifacts/1-4a-durable-substrate-preflight/` (new retained redacted runbook, evidence, SQL, signature tests, and route template)
- `.codex/config.toml` (new; project-scoped Supabase MCP URL and approval policy, no credentials)
- `_bmad-output/planning-artifacts/jagwar-foundation-handoff/09-risks-and-open-decisions.md` (updated)
- `_bmad-output/planning-artifacts/jagwar-foundation-handoff/HANDOFF-STATUS.json` (updated)
- `_bmad-output/planning-artifacts/jagwar-foundation-handoff/README.md` (updated)
- `_bmad-output/planning-artifacts/jagwar-foundation-handoff/VALIDATION.md` (updated)
- `apps/web/client/src/app/api/internal/preflight/durable-substrate/route.ts` (temporary new-file proof harness; deleted after successful cleanup, no remaining source diff)

## Change Log

- 2026-07-28: Created Story 1.4a from the approved dependency-safe split of parent Story 1.4, with Story 7.5a budget traceability.
- 2026-07-28: Began preflight, recorded repository/tooling evidence, and halted because no approved hosted Supabase or non-production Next target is linked or identifiable.
- 2026-07-28: Configured and authenticated the supplied Supabase MCP target; created and Git-linked the non-production Vercel project without deploying.
- 2026-07-28: Completed and cleaned the pinned durable-substrate preflight; adopted numeric operating budgets, marked OD-11 proven, and advanced the story to review.
- 2026-07-29: Remediated all code-review findings with a retained rerun kit, actual worker-login proof, complete signed-request/no-work matrix, explicit `pg_net` timeout, retry-visibility proof, corrected budgets, a qualifying Vercel `preflight` deployment, and verified cleanup.
