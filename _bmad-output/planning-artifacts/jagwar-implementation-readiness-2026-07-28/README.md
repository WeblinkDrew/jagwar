---
title: Jagwar Initial Implementation-Readiness Deliverable
status: not-ready-gated
created: 2026-07-28
updated: 2026-07-28
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
implementationAuthorized: false
---

# Jagwar Initial Implementation-Readiness Deliverable

## Verdict

**NOT READY for product implementation.** Planning, deterministic contract tests, and explicitly bounded non-production proofs may continue only behind the gates below. No protected Onlook file is approved by this review. Andrew approved the Correct Course proposal and dependency-safe sequence on 2026-07-28; story entry gates still prevent implementation kickoff.

## 1. Repository and baseline identity

| Repository | Path | Branch | HEAD | Status at audit |
| --- | --- | --- | --- | --- |
| Writable Jagwar target | `/Users/andrewsimic/Developer/Jagwar` | `bmad/jagwar-foundation-bootstrap` | `a03802a8e85e5c10cd620fb0e654af7cd70ea605` | Baseline-descendant; planning outputs added as new/untracked files; no protected tracked file modified. |
| Legacy donor | `/Users/andrewsimic/Developer/Telio` | `main` | `0135dc6f4a830706b2eddec07577b2503c1ae699` | Ahead of origin and heavily dirty; read-only evidence. |
| Onlook reference | `/Users/andrewsimic/Developer/Onlook/onlook` | `main` | `423e2e924366419e418ee049093872d535eea41a` | Exact pinned baseline; pre-existing modified preload script, untracked analysis docs, missing admin submodule; read-only. |

Target remotes:

- `origin`: `https://github.com/WeblinkDrew/jagwar.git` (fetch/push)
- `upstream`: `https://github.com/onlook-dev/onlook.git` (fetch), push disabled

The pinned baseline is the immediate ancestor of target HEAD. The protected baseline is `423e2e924366419e418ee049093872d535eea41a`.

## 2. Target authority map

| Concern | Pinned target authority | Jagwar extension rule |
| --- | --- | --- |
| Identity/account | Supabase Auth and `users` | First-release business ownership is server-derived `ctx.user.id`; no abstract Workspace table. |
| Project collaboration | `user_projects`, invitations, project verifiers | Lead/project association additionally verifies current membership; business ownership and project membership are distinct checks. |
| Persistence | `@onlook/db` Drizzle schema + Supabase PostgreSQL migrations | Add owner-scoped schema groups, explicit same-owner constraints, server predicates, and RLS defense in depth. |
| Authorization | protected tRPC context plus resource-specific verifiers | Browser owner IDs are ignored/rejected; direct Drizzle traffic never relies on RLS alone. |
| Server operations | tRPC/Next handlers; creation/deployment status rows | One durable operation aggregate owns domain state; route requests only admit/read work. |
| Durable transport | No baseline general job system | Selected: logged PGMQ queue, triggered by `pg_cron`/`pg_net` into a signed bounded Next consumer, subject to Story 1.4 preflight. |
| Project/editor/source | projects, branches, canvases, frames, CodeSandbox, `EditorEngine` | Store only Project Links; delegate the canonical project transaction and open the existing editor. |
| AI composition | project-create `PROMPT` context to `useStartProject` and `ChatType.CREATE` | Render validated `JagwarBusinessContextV1` into the existing PROMPT seam; do not edit AI core. |
| Publication | deployments, preview/custom domains, Freestyle/`PublishManager` | Add immutable Publication References to exact authorized completed artifacts; never replace deployment/domain authority. |
| Billing/usage | Stripe, products, prices, subscriptions, rate limits, usage records, webhook | Preserve as the only commercial authority; observational costs are physically separate and non-enforcing. |
| UI | `@onlook/ui`, tokens, icons, global styles, route-local composition, `next-intl` | Add route-local commercial slices; preserve Onlook focus, motion, responsive, dark-theme, and WCAG behavior. |
| Admin/operator | OD-13 role/authorization map plus an approved target-native surface using existing authorities | The private upstream admin is intentionally absent from Jagwar. A focused target-native Jagwar operator route is permitted after explicit role, service/UI seam, protected-path, and regression approval. |

Detailed maps: [project documentation](../../../docs/index.md) and [reviewed architecture spine](../architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md).

## 3. Decision register attached to backlog gates

| Decision | Disposition | Backlog gate |
| --- | --- | --- |
| OD-2 ownership | **Resolved:** authenticated Supabase user owns business rows; project membership is checked separately. | Story 1.1 must use `user_id`, same-owner constraints, and cross-user denial tests. |
| OD-3 persistence | **Resolved:** additive Drizzle/Supabase schema; protected server boundaries; explicit authorization + RLS defense. | Migrate per vertical slice; no client owner input. |
| OD-10 commercial authority | **Resolved:** existing Onlook Stripe/subscription/rate-limit/usage records only. | Cost observations may not answer entitlement or mutate billing. |
| OD-11 durable execution | **Selected, not proven:** logged PGMQ + Cron/pg_net/Vault + signed bounded Next consumer; durable operation row is domain truth. | Story 1.4a preflight blocks 1.4b, provider discovery, and outreach. |
| OD-12 project seeding | **Mapped, not proven:** `JagwarBusinessContextV1` -> existing PROMPT -> native CREATE flow. | Protected project transaction extraction and Story 4.1 fixture proof block 4.2+. |
| OD-13 module/protected map | **Resolved design:** customer modules remain mapped; Andrew approved the Supabase-ID-backed `/operator` authority and path/regression map on 2026-07-29. | Follow [OD-13-OPERATOR-AUTHORITY.md](./OD-13-OPERATOR-AUTHORITY.md); exact protected-file CCRs remain mandatory before edits. |
| OD-15 target dependency | **Resolved:** CCR-019–022 remove the inaccessible private upstream admin registration, gitlink, root script, and generated lock records. | Pinned Bun frozen install and web typecheck pass. Jagwar does not claim upstream private-admin parity; future operator work stays under OD-13. |

OD-4/5/6/7/9 remain story-specific provider, policy, legal, success-predicate, and retention gates. OD-14 remains deliberately deferred until representative cost evidence and Andrew's commercial approval.

## 4. Epic 1 and first discovery vertical

The exact new/protected classification is in [PATH-LEDGER.md](./PATH-LEDGER.md). Ownership is:

- `@onlook/leads`: Candidate, discovery, qualification, dedupe, provider ports, and `JagwarBusinessContextV1` pure contracts.
- `@onlook/business-policy`: closed policy kinds, immutable release envelope, canonical validation/hash.
- `@onlook/durable-operation`: operation, attempt, lease, cancellation, idempotency, and reconciliation state machines only.
- `@onlook/db`: additive persistence groups and same-owner relationships.
- `apps/web/client/src/server/services/<capability>`: server orchestration and provider adapters.
- `apps/web/client/src/app/(commercial)/leads`: route-local Find Leads UI/hooks/tests.
- `apps/web/client/src/app/api/internal/operations/route.ts`: signed bounded queue consumer.
- Supabase migrations: schema/RLS and separate PGMQ/Cron/role grants.

The first vertical uses a deterministic fake provider until OD-4 selects a production provider. Safe order: Story 1.5 gate -> OD-13 customer authority -> Story 1.4a -> Story 1.1 -> Story 1.3a -> Story 1.4b + Story 6.3a -> Stories 2.1, 2.2, 2.3, 2.6a -> Story 3.1a -> Story 2.6b. OD-15 is complete.

## 5. Dependencies and providers

- Preserve CodeSandbox, Freestyle, Supabase, Stripe, AI providers, and existing Onlook integrations.
- Add no new external JavaScript runtime dependency during the initial slice; proposed packages are workspace-local and use already pinned Zod/utility conventions.
- Use PGMQ/pg_cron/pg_net/Vault only after recording target-provided versions, privileges, Data API isolation, signed request rotation/replay defense, deployment runtime limits, and numeric execution budgets.
- If that preflight fails, amend architecture; do not add Redis, another queue, `waitUntil`, detached promises, or an in-memory worker.
- Discovery and phone providers remain behind ports; deterministic fakes prove contracts without authorizing production use.
- WhatsApp/BSP, real sends, retention, and activation success remain later decisions.
- The approved OD-15 divergence is part of the target baseline: do not reintroduce the private upstream admin dependency during upgrades without a new decision and regression plan.

## 6. Baseline capability regression matrix

| Capability | Focused proof | Release proof |
| --- | --- | --- |
| Auth and isolation | protected/anonymous procedures, cross-user IDs, same-owner constraints, project membership | No existence leak; RLS and direct-DB paths agree. |
| Project lifecycle | project helper tests; duplicate/idempotent prospect fixtures | Existing create/import/fork/delete/branch/canvas/frame/conversation unchanged. |
| Editor/source/preview | open/edit/save/preview existing and fixture projects | MobX lifecycle, CodeSandbox, source apply, responsive preview unchanged. |
| AI Ask/Create/Edit | existing AI prompt/context/tool/stream/apply tests plus PROMPT-seam fixture | No prompt/tool/agent/registry/mode change; personalized editable proof passes. |
| Publishing/domains | deployment/domain authorization and state tests | Freestyle/custom domains unchanged; exact immutable Publication proof passes. |
| Billing/usage | subscription/usage/webhook tests; cost-observation no-side-effect test | No observation writes usage, allowance, entitlement, checkout, or charge. |
| UI/i18n | route/component/accessibility tests; message completeness | Onlook tokens/icons/focus/motion/responsive/dark behavior; real-browser comparison. |
| Packages/scripts | public entry-point tests, typecheck, lint | Pinned-Bun frozen install, focused package tests/typecheck, and applicable build with required environment. |
| Admin/operator | Approved `/operator` surface with fresh server membership; protected edits still gated | Target-native role/revocation, direct-route/API denial, append-only audit, concurrency, and baseline regression. |

OD-15 implementation verification recorded a passing pinned-Bun frozen install and web typecheck. The root test command still has a pre-existing backend-path failure, and build requires the repository's configured environment values; neither failure is caused by the admin removal.

## 7. Proposed Core Change Requests

The proposed per-file requests are in [CORE-CHANGE-REQUESTS.md](./CORE-CHANGE-REQUESTS.md). Every decision is `pending`; inclusion does not approve a file. Notably:

- no AI prompt, agent, tool, registry, stream, manager, mode, context-type, or apply file is proposed;
- no root `package.json`, UI token/icon/global-style file, existing test, or Supabase `config.toml` edit is currently proposed;
- generated `en.d.json.ts`, migration snapshot/journal, and `bun.lock` changes are maintainer-controlled and separately gated.

## 8. Test and migration plan

1. Pure contracts: strict Candidate/fact/provenance/policy/operation/context schemas; mapper round trips; canonical hashes; dedupe; invalid/oversize input.
2. Authorization: session-derived user; cross-user direct/nested/batch denial; project membership; worker owner derivation; restricted role.
3. Durable operations: transactional admission/enqueue, duplicate input hash, lease fence, retry ceiling/backoff, cancellation-before-dispatch, crash recovery, redelivery archive, callback inbox, unknown-outcome reconciliation.
4. Discovery: deterministic fake queued/running/succeeded/failed/canceled; zero-result success; replay makes no provider call or cost observation; partial qualification/phone failure.
5. UI: validation, durable state rendering, accessible selection/list equivalence, focus restore, live announcements, responsive/reduced motion, no fake initial results.
6. Project fixture: two distinct Leads create/edit two native projects containing exact selected facts and omitting unknowns; provenance remains separate.
7. Publication/send: exact immutable Publication, workflow-created consent, locked immediate revalidation, zero provider call on stale evidence, callback/retry idempotency.
8. 5+2+1: five unique eligible Leads, two personalized projects, one exact Publication/Send; retry/replay/concurrency creates no duplicate business, cost, usage, or activation record.
9. Migration: maintainer-generated additive Drizzle migration + snapshot/journal; separate hand-authored PGMQ/Cron/least-privilege SQL; apply only to local non-production, verify constraints/RLS/rollback, never run `db:gen` as an agent.
10. Verification proceeds with pinned-Bun frozen install, focused `bun test`, `bun run typecheck`, applicable lint/build, local migration/RLS tests, and the relevant declared-target matrix per slice. Private upstream admin parity is not a Jagwar release claim.

Production migration, deployment, real send, billing mutation, and customer cutover require separate approved runbooks.

## 9. Additive AI business context

`JagwarBusinessContextV1` is a new read-only validated artifact holding Lead ID, selected verified fact-revision/provenance references, explicit unknowns, qualification evidence, business/brand details, rights-cleared asset references, voice/design direction, and generated guidance as separate fields. A canonical bounded renderer treats external text as untrusted and emits one existing project-create PROMPT. It records context version/hash, selected revisions, and prompt hash.

It exposes no save, apply, publish, project-mutation, authentication, billing, entitlement, usage, or send authority. The existing `packages/models/src/project/create.ts`, pending request, `useStartProject`, `ChatType.CREATE`, and AI core remain unchanged.

## 10. Pre-commercial cost telemetry

Use a physically separate operation-linked `cost_observation` table and one write API. Record provider, action, normalized unit/quantity, estimate/actual phase, amount/currency or provider units, outcome, attempt/retry, latency/concurrency, and trace. Enforce uniqueness by operation/provider/action/unit/phase/attempt and make actual supersede estimate in reports.

Instrument discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, and outreach before representative work. Saved replay and no-provider paths must be distinguishable. Observations cannot touch `usage_records`, grant entitlement, reserve/debit allowance, charge, create checkout, or gate a customer. OD-14 follows representative distributions and margin analysis.

## 11. BMAD and sprint sequence

- Established-project documentation: [docs index](../../../docs/index.md)
- Architecture + independent reviews: [architecture workspace](../architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md)
- Readiness result: [NOT READY report](../implementation-readiness-report-2026-07-28.md)
- Correct Course: [approved](../sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md)
- Sprint tracker: [all backlog](../../implementation-artifacts/sprint-status.yaml)
- Dependency order: [adopted planning sequence](../../implementation-artifacts/dependency-safe-sprint-sequence.md)

Required workflow order is now: resolve the adopted sequence's first-slice stop gates -> rerun Implementation Readiness -> create only the first unblocked story. Current sprint artifacts are traceability aids, not an implementation kickoff.

## License, assets, and naming audit

The target/reference license is unchanged Apache-2.0 and no root NOTICE file exists. Preserve the license, relevant copyright/patent/trademark/attribution notices, and prominent modification notices when distributing adapted files. This pass copied no donor/reference source, dependency, asset, icon, or style and added no runtime dependency. Future adaptations require per-slice license/source/asset/icon/style evidence.

The legacy-name inventory found no unqualified retired product name outside the approved handoff provenance. All new artifacts use Jagwar or capability-native names.
