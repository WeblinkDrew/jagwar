# Tasks: Establish Workspace Authority

Planning-only roadmap. OpenSpec is authoritative. Nothing in this file authorizes apply, implementation, tests, migrations, manifests, CCRs, commits, verify/sync/archive, provider activation, editor work, or changes outside this artifact.

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | 2,590–3,470 across 9 implementation slices |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 contracts → PR 2 schema → PR 3 migration/RLS → PR 4 actor decisions → PR 5 resource/revalidation → PR 6 invitation/activation → PR 7 membership concurrency → PR 8 audit/system actors → PR 9 transport/composition |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

Auto-forecast produced a High-risk recommendation for 9 chained PR slices because the aggregate 2,590–3,470 changed-line forecast far exceeds the 400-line review budget. An explicit owner delivery decision is still required before any future `sdd-apply`; no delivery decision is requested or made during this planning-only tasks phase.

Each PR is an autonomous Strict-TDD slice with its own start, finish, verification, evidence, and rollback boundary. No slice may exceed 400 changed lines (additions plus deletions, including tests and its manifest). If a candidate exceeds 400, split it only at an independently safe contract or runtime boundary and obtain a separately reviewed manifest; do not split a transaction invariant. If a candidate is below 250, combine it only with an adjacent responsibility sharing the same invariant and only after forecast review.

## Global Preconditions and Governance

All slices are blocked by explicit owner approval and the applicable unresolved decisions in **Parent-owned decisions and review gates** below. In particular, implementation must not invent audit retention/support access, bootstrap or inherited mapping, invitation delivery/normalization, Data API exposure, database isolation/operation-result/trigger choices, package allocation, or chain strategy.

Before **each** slice begins, `architecture/slices/workspace-authority-0N-<name>.json` must be reviewed and accepted. It must list every governed candidate path, with exact path, `workspace-authority` capability, owning runtime, role, and `new`/`protected-original` classification against baseline `423e2e924366419e418ee049093872d535eea41a`; the resulting diff must match it exactly. No wildcard or directory-only declaration is sufficient.

Before editing **each** protected baseline path, prepare the exact candidate resulting file without changing the working-tree path, compute its exact resulting SHA-256, create a new per-file CCR naming that exact path and hash, obtain an approved entry in `architecture/core-change-approvals.json`, and reference that CCR from the reviewed slice manifest. Exact hashes cannot truthfully be supplied until candidate patches exist, so every protected edit remains blocked. Existing CCRs, intent approval, a prior hash, a wildcard, or approval for another file grants no authority. The same rule applies to protected rollback content and its resulting hash.

Agents must not edit generated migration output or `bun.lock`, and must not run `db:gen`. A maintainer owns migration generation and review through the repository-approved Drizzle/Supabase workflow. If dependency reconciliation would alter `bun.lock`, stop for an explicit maintainer/governance decision; do not generate or hand-edit it. Do not touch unrelated dirty/generated/editor/BMAD/Story 1.3b files.

## Implementation Roadmap

### Slice 1 — Architecture allocation and pure authority contracts

**Objective:** Allocate only `packages/workspace-authority` in `architecture/policy.json`, then establish a runtime-neutral public package contract for exactly `Owner`/`Member`, sanitized decisions, correlation/freshness, human/system actors, resource-ownership ports, lifecycle outcomes, and audit-safe evidence. No database, Next.js, tRPC, Supabase, provider, UI, or consumer edge is included.

**Dependencies:** D1, D6, R1. **Forecast:** 280–380 changed lines. **Manifest:** `architecture/slices/workspace-authority-01-contracts.json`, exactly covering `architecture/policy.json` and candidate paths under `packages/workspace-authority/{package.json,src/index.ts,src/contracts.ts,src/decisions.ts,test/*.test.ts}` with actual classifications/runtime/roles.

- [ ] RED: add focused contract tests proving only `Owner` and `Member` are representable; decisions are exhaustive and plain/sanitized; correlation is bounded; forged authority fields cannot enter trusted types; system actors are named/action-scoped; and public exports expose no persistence/app internals. Record the focused failing command/output before any production/package-policy change. <!-- sdd-owner: implementation -->
- [ ] GREEN: make the smallest policy allocation and pure package implementation needed to pass through the sole `@onlook/workspace-authority` entry point; add no deep exports or consumer dependency. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: add adversarial serialization, unknown-role, oversized-correlation, secret-shaped metadata, denied/conflict, and package-boundary cases; prove no Next/tRPC/Supabase/Drizzle/UI/provider/app-private import exists. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, remove duplicate contract shapes and keep intentional exports minimal; do not create a generic Jagwar/shared package. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted `bun test packages/workspace-authority/test`, then `bun test`, `bun run typecheck`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, and `git diff --check`; completion evidence is RED output, passing outputs, exact manifest-to-diff match, dependency-direction review, and a 280–380-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back this slice by removing the unconsumed package and reverting only its policy allocation; no runtime or durable data exists. Any protected rollback first needs its own hash-bound CCR. <!-- sdd-owner: implementation -->

### Slice 2 — Workspace and membership schema model

**Objective:** Add capability-owned Drizzle definitions for workspace and membership identity/state/version/tombstones plus demonstrated lookup indexes and schema-level tests, without repurposing inherited `ProjectRole`, user-project membership, or project invitations.

**Dependencies:** Slice 1, D3, R2. **Forecast:** 300–400 changed lines. **Manifest:** `architecture/slices/workspace-authority-02-schema.json`, exactly covering candidate `packages/db/src/schema/workspace-authority/{index.ts,workspace.ts,membership.ts}` and tests, plus protected `packages/db/src/schema/index.ts` with its new per-file CCR.

- [ ] RED: add schema tests that fail for roles beyond Owner/Member, duplicate current `(workspace, subject)` identity, missing workspace ownership/version fields, hard-deleted removal history, absent active-membership/Owner lookup indexes, and inherited project-role coupling; preserve the failing evidence before schema/export edits. <!-- sdd-owner: implementation -->
- [ ] GREEN: add the smallest additive workspace/membership schema and public schema export satisfying durable identity, active/removed membership, monotonic versions, tombstones, and demonstrated access paths; do not select bootstrap mapping or mutate inherited project tables. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: cover inactive workspace, removed/reactivated identity, duplicate subjects across different workspaces, exact role constraints, and index metadata; prove local businesses remain downstream workspace-owned records rather than subscriber identities. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, keep persistence names capability-local and avoid leaking schema shapes into the pure package contract. <!-- sdd-owner: implementation -->
- [ ] Verify with the focused schema test path discovered in `packages/db`, `bun test`, `bun run typecheck`, `bun scripts/architecture/check.ts --changed`, structure gate, and `git diff --check`; completion evidence includes RED/pass logs, approved exact hash for `packages/db/src/schema/index.ts`, manifest match, and a 300–400-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back authored schema/export changes only while no migration or data depends on them; preserve inherited project/user behavior, and use a newly approved rollback hash for the protected export. <!-- sdd-owner: implementation -->

### Slice 3 — Maintainer migration, RLS/grants/indexes, and adversarial SQL tests

**Objective:** Review a maintainer-generated migration candidate for workspace/membership and add database isolation tests proving Supabase Auth, application authority, RLS, grants, and privileged access remain distinct. Agents neither generate nor edit migration output.

**Dependencies:** Slice 2, D4, D7, M1, R3. **Forecast:** 300–400 changed lines, counting the maintainer-produced migration and authored SQL tests. **Manifest:** `architecture/slices/workspace-authority-03-rls.json`, exactly naming the maintainer-generated `apps/backend/supabase/migrations/<tool-generated-name>` candidate and candidate `apps/backend/supabase/tests/<exact-authority-test-path>` plus any discovered config path; no migration filename is invented in planning.

- [ ] RED: before accepting migration SQL, add/run the approved focused database tests and retain failures for anon, authenticated non-member, Member, Owner, removed member, stale JWT Owner claim, cross-workspace rows, grants/Data API exposure, and service-role access that still requires application checks. <!-- sdd-owner: implementation -->
- [ ] GREEN: review the maintainer-generated candidate and make only authored schema corrections followed by maintainer regeneration as needed; achieve RLS-on-before-grants, ownership-aware policies, no direct browser writes, required lookup indexes, and no blanket privileged bypass or new `SECURITY DEFINER`. Agents must not alter generated SQL. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: test cross-workspace direct/list access, UPDATE `USING` plus `WITH CHECK` where an approved update policy exists, stale claims, revoked/removed membership, service role, exposed views/functions/grants, policy query plans/`EXPLAIN` for material lookups, and advisors through version-verified commands. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, simplify authored schema/policy sources only; require maintainer regeneration after any schema correction and retain invoker/grant boundaries. <!-- sdd-owner: implementation -->
- [ ] Verify with the exact Supabase/database commands discovered from installed-tool `--help` and current docs, plus targeted DB tests, `bun test`, `bun run typecheck`, architecture changed check, structure gate, and `git diff --check`; record versions, commands, advisor output, RED/pass evidence, manifest match, and a 300–400-line diff. Do not run `db:gen`. <!-- sdd-owner: implementation -->
- [ ] Roll back by disabling new entry access and using an additive/forward migration approved and generated by a maintainer; never weaken RLS, restore removed access, or destructively erase authority history. <!-- sdd-owner: implementation -->

### Slice 4 — Human actor resolution and role decisions

**Objective:** Implement the Next-server repository/composition seam for fresh human actor resolution and `requireMember`/`requireOwner`, using server-verified subject input and current membership rather than JWT/client/selection state; no transport is added.

**Dependencies:** Slice 3, R4. **Forecast:** 280–380 changed lines. **Manifest:** `architecture/slices/workspace-authority-04-actors.json`, exactly covering candidate `apps/web/client/src/server/services/workspace-authority/{index.ts,repository.ts,actors.ts,authorization.ts}` and focused tests.

- [ ] RED: add failing service tests for active Owner/Member, missing/removed/inactive membership, forged role/version/actor fields, stale JWT metadata, multi-workspace selection as non-authority, bounded server correlation, and sanitized indistinguishable denials. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest injected repository and server-only actor/role decisions using authenticated subject plus requested workspace; do not add global workspace/role state to `trpc.ts` or use Supabase admin/service role as an authority shortcut. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: prove Owner satisfies Member, Member fails Owner without state change, stale client selection cannot deny another valid membership or restore a removed one, and outputs contain no token/credential/unrelated membership data. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, preserve the one-way boundary from server service to pure contract and DB public entry; remove ad hoc role branches and private `@onlook/*/src/*` imports. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted `bun test apps/web/client/src/server/services/workspace-authority`, `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, architecture changed check, structure gate, and `git diff --check`; completion evidence includes RED/pass logs, sanitized snapshots, manifest match, and a 280–380-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by removing the uncomposed service modules; leave schema/data/RLS intact and expose no fallback to JWT, client selection, or inherited project roles. <!-- sdd-owner: implementation -->

### Slice 5 — Resource isolation and pre-effect revalidation

**Objective:** Add capability-owned resolver ports and authority checks for list/direct/indirect/mixed-batch access plus freshness revalidation immediately before sensitive commit, credential release, balance mutation, protected disclosure, or provider dispatch.

**Dependencies:** Slice 4, D7, R5. **Forecast:** 280–380 changed lines. **Manifest:** `architecture/slices/workspace-authority-05-resource-revalidation.json`, exactly covering candidate authority service/contract test paths and any contract file changed; protected files, if discovered, need individual CCRs.

- [ ] RED: add failing tests for list scoping/count/cursors, direct existing-vs-nonexistent equivalence, indirect mismatches, stale IDs, mixed-workspace all-or-nothing mutation batches, removed/demoted actors after initial admission, and same-operation retry after revocation; assert zero provider/credential/balance/downstream mutation before allow. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest ownership-resolver port, exact workspace equality checks, sanitized outcomes, freshness evidence, and current-membership revalidation; keep resource queries and business eligibility with each downstream owner. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: cover deduped batches, malicious pagination/filter input, changed-but-still-eligible conflict, removed-member denial, already-committed truthful evidence, and retry with stable operation identity but freshly resolved authority. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, consolidate access-shape decision rules without creating a central registry or importing downstream persistence internals. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted authority service/contract tests, `bun test`, `bun run typecheck`, web lint, architecture changed check, structure gate, and `git diff --check`; completion evidence includes mock effect counters at zero on denial, RED/pass logs, manifest match, and a 280–380-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by disabling resolver/revalidation consumers while preserving current actor resolution; never replace it with authentication-only or stale snapshot authorization. <!-- sdd-owner: implementation -->

### Slice 6 — Invitation acceptance, activation, and approved bootstrap

**Objective:** Add hashed-token invitation lifecycle, identity-bound one-time acceptance, exactly-once membership activation, retry-safe outcomes, and only the separately approved idempotent initial-workspace/Owner bootstrap shape. Invitation delivery remains outside authority ownership.

**Dependencies:** Slices 3–5, D2, D3, R6. **Forecast:** 300–400 changed lines. **Manifest:** `architecture/slices/workspace-authority-06-invitations.json`, exactly covering candidate `packages/db/src/schema/workspace-authority/invitation.ts`, schema export changes if any, `apps/web/client/src/server/services/workspace-authority/memberships.ts`, and focused tests; every protected export requires a new per-file CCR/hash.

- [ ] RED: add failing tests for zero pre-acceptance authority, normalized intended-identity binding per approved rule, raw-token exclusion/hash lookup, expiry/revocation, wrong subject, duplicate/replayed acceptance, concurrent acceptance, exactly one active membership, audit requirement, and approved bootstrap idempotency without inferred project ownership. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest transactional invite/accept/activate flow and approved bootstrap operation with versioned outcomes and one-time token consumption; do not implement an email provider or bulk inherited user/project mapping. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: cover token collisions/replay, revoked/expired races, existing removed membership reactivation as an explicit transition, duplicate operation IDs, audit failure, and Owner-assigned exact V1 roles. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, keep delivery adapters outside the capability and keep raw tokens/emails out of logs, audit metadata, and public decisions. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted invitation/membership/schema tests, `bun test`, `bun run typecheck`, web lint, approved DB tests where touched, architecture changed check, structure gate, and `git diff --check`; completion evidence includes RED/pass and concurrency logs, manifest/CCR match, and a 300–400-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by disabling invite/bootstrap entry points while retaining consumed invitations, memberships, versions, operation outcomes, and audit evidence; do not reactivate removed users or infer inherited ownership. <!-- sdd-owner: implementation -->

### Slice 7 — Versioned membership changes and final-Owner concurrency

**Objective:** Implement Owner-attributed role change, removal, leave, and explicit reactivation under workspace-row serialization, optimistic versions, atomic success evidence, and the specification’s final-active-Owner invariant.

**Dependencies:** Slice 6, D7, R7. **Forecast:** 320–400 changed lines. **Manifest:** `architecture/slices/workspace-authority-07-membership-concurrency.json`, exactly covering candidate membership orchestration/repository/tests and any schema path changed; protected paths need per-file candidate hashes and CCRs.

- [ ] RED: add failing transaction/concurrency tests for same-version competing writes, stale target/workspace versions, Owner attribution, final Owner demote/remove/leave, concurrent apparent transfers, role validity, no partial mutation, and durable denied/conflict evidence. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest transaction that locks workspace authority, re-resolves acting Owner, locks targets, compares versions, enforces final Owner, updates/tombstones state, increments versions, and appends success evidence atomically. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: run deterministic race cases for concurrent promotion/removal/leave/reactivation, retry after known commit, audit-write failure, and changed authority between read and commit; select isolation/operation-result/constraint-trigger behavior only from approved D7 evidence. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, keep the final-Owner invariant cohesive; do not split transaction logic merely to reduce file size or add `SECURITY DEFINER` to bypass permissions. <!-- sdd-owner: implementation -->
- [ ] Verify with focused concurrency/database tests, `bun test`, `bun run typecheck`, web lint, database advisors when supported, architecture changed check, structure gate, pre-push gate, and `git diff --check`; completion evidence includes reproducible race results, RED/pass logs, manifest match, and a 320–400-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by disabling membership mutations while preserving the last valid Owner, tombstones, versions, operation outcomes, and audits; any data correction is a separately reviewed forward operation. <!-- sdd-owner: implementation -->

### Slice 8 — Durable bounded audit and named system actors

**Objective:** Complete append-only/superseding authority audit, durable operation outcomes, bounded reason/action/target/result vocabularies, and allowlisted workspace/action-scoped system actors without creating a generic event store.

**Dependencies:** Slice 7, D1, D5, D7, R8. **Forecast:** 280–380 changed lines. **Manifest:** `architecture/slices/workspace-authority-08-audit-system.json`, exactly covering candidate `packages/db/src/schema/workspace-authority/audit.ts`, `apps/web/client/src/server/services/workspace-authority/audit.ts`, system-actor modules, exports, and focused tests; protected exports need separate CCRs.

- [ ] RED: add failing tests for required evidence fields, success/denial/conflict, safe cross-workspace probes, Owner-only decisions, operation retries, append-only/superseding history, bounded metadata/correlation, forbidden secrets/payloads/preset Markdown, and system actors that cannot impersonate Owner or exceed action/workspace scope. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest append-only audit writer, durable operation result, allowlisted system actor factory, and D1-approved sanitized Owner projection; do not invent retention, legal hold, support/security/legal access, or downstream domain events. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: cover audit outage before mutation, known commit followed by audit uncertainty without replay, correction chains, oversized/unknown vocabularies, webhook/scheduler scope misuse, and cross-workspace projection attempts. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, keep structured metadata small and persistence-neutral evidence public; keep provider payloads and domain events with downstream owners. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted audit/system/database tests, `bun test`, `bun run typecheck`, web lint, architecture changed check, structure gate, and `git diff --check`; completion evidence includes secret-exclusion fixtures, append-only DB proof, RED/pass logs, manifest/CCR match, and a 280–380-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by disabling new audit reads/system entry points while preserving all evidence and operation outcomes; never UPDATE/DELETE history or relax actor scope. <!-- sdd-owner: implementation -->

### Slice 9 — Thin transport and composition

**Objective:** Add only Zod-validated tRPC transport and narrow server composition/public dependency edges for approved authority operations. Keep `trpc.ts`, editor, CREATE, project sharing, and all downstream capability behavior untouched.

**Dependencies:** Slices 1–8, D1–D7, R9. **Forecast:** 250–350 changed lines. **Manifest:** `architecture/slices/workspace-authority-09-transport.json`, exactly covering candidate `apps/web/client/src/server/api/routers/workspace-authority/index.ts`, protected `apps/web/client/src/server/api/root.ts`, `apps/web/client/src/server/api/routers/index.ts`, `apps/web/client/package.json`, and every other actual path. Each protected path requires its own new exact-hash CCR; `bun.lock` is excluded from agent edits.

- [ ] RED: add failing transport/composition tests for Zod input bounds, server-derived subject/correlation, plain serializable allowed/denied/conflict mapping, no role/actor authority from input, Owner-only membership endpoints, sanitized errors, and zero downstream/provider effect before authority. <!-- sdd-owner: implementation -->
- [ ] GREEN: implement the smallest thin router and additive composition/export/dependency edits using `protectedProcedure` only as authentication input and the server service as authority; do not change global tRPC context or expose persistence. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE: test malformed IDs/operation keys, forged Owner payloads, removed members, stale versions, cross-workspace identifiers, duplicate retries, serialization, and inherited regression discovery targets for project membership/invitations, Projects, editor, AI CREATE, publishing, settings, Stripe, export, and Git. <!-- sdd-owner: implementation -->
- [ ] REFACTOR: while green, keep transport declarative and thin, preserve intentional public entries, and remove any duplicated authorization/business logic from the router. <!-- sdd-owner: implementation -->
- [ ] Verify with targeted router/service tests, `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, architecture changed check, structure gate, pre-push gate, and `git diff --check`; completion evidence includes RED/pass logs, inherited-regression evidence, all exact CCR/hash matches, no `bun.lock` diff, manifest match, and a 250–350-line diff. <!-- sdd-owner: implementation -->
- [ ] Roll back by removing/disabling router entry points and dependency composition while preserving authority data/audit; each protected rollback needs a new exact resulting hash and approval. <!-- sdd-owner: implementation -->

## Acceptance and Downstream Readiness Mapping

| Specification acceptance | Delivering slices/evidence |
| --- | --- |
| Durable workspace/current membership; resources resolve one owner; leads/clients never become subscribers; inherited project/user behavior unchanged | 2–5 schema and actor/resource evidence; 9 inherited regression evidence |
| Exactly Owner/Member; Member normal workflows; Owner-only administration/settings/integrations/analytics | 1, 4, 9 contract/service/transport role tests |
| Invitation, acceptance, activation, role change, removal/leave, final Owner | 6–7 lifecycle, idempotency, and race evidence |
| Optimistic authority versions and typed allowed/denied/conflict outcomes | 1, 5–8 contract, revalidation, transaction, and audit evidence |
| Client workspace selection is non-authoritative | 4 actor-forgery/multi-workspace tests |
| Narrow server-derived human and named system actors | 1, 4, 8 contract/service/scope evidence |
| Stable public contracts without deep imports or persistence leakage | 1, 4–5, 9 architecture and contract tests |
| List/direct/indirect/stale/mixed-batch isolation and sanitized denials | 3, 5, 9 RLS/service/transport adversarial evidence |
| Removed/demoted actor denial and pre-effect revalidation/retry truth | 5, 7–8 revalidation/concurrency/operation evidence |
| Durable bounded append-only/superseding audit | 6–8 lifecycle and audit persistence evidence, subject to D1 |
| Supabase Auth vs application authority vs RLS; narrow privileged access | 3–5 and 8 SQL/service/system-actor evidence |
| Planning/protected-change governance | R1–R9 manifest reviews, per-file CCR approvals, slice diff forecasts/gates |
| Inherited Onlook/editor/CREATE behavior preserved additively | 2 and 9 regression evidence; no editor or `trpc.ts` edit |

Downstream readiness is contract-only; these slices must not implement downstream behavior:

- **Commercial:** current human/system actor, workspace scope, Member admission, Owner billing/hosting-add-on admission, operation correlation, and pre-reservation/commit revalidation; commercial still owns subscriptions, distinct lead/AI/SMS balances, top-ups, ledger, and add-ons.
- **Lead pipeline:** Member authorization and list/direct/indirect/batch scoping with actor evidence; leads still own business identity, fixed stage/outcome history, corrections, and project relations.
- **CodeSandbox BYOK:** Owner credential lifecycle admission and Member just-in-time pre-lease revalidation; BYOK owns encryption, versions, validation, and no-fallback behavior.
- **DataForSEO:** Member/workspace admission and pre-dispatch/snapshot revalidation; discovery/commercial/leads own inputs, immutable runs, metering, provider evidence, and imports.
- **Website presets/creation:** preserve exactly V1 Jagwar-managed and workspace-uploaded Inspiration and Style `DESIGN.md` presets, one validated Markdown file per upload, Owner create/replace/delete, Member selection, Inspiration code only in fenced blocks, and no archive/asset/Git ingestion. Authority owns only role, isolation, concurrency evidence, and audit; website owns content validation, prompt composition, lead-backed creation, preset versions, and the narrow inherited CREATE adapter.
- **Telnyx:** Owner template/sensitive-setup admission, Member confirmed-send actor, named event actor, and pre-dispatch revalidation; SMS/commercial own compliance, consent, previews, sender/provider state, and debits.
- **Inbox:** active Owner/Member list/direct/reply admission, conversation workspace checks, removed-member denial, and outbound actor evidence; Inbox/SMS own messages, conversations, unread/notification state, and reply gates.
- **Hosting:** Member project/site admission, Owner domain/sensitive-settings admission, named lifecycle actors, and pre-effect checks; hosting/commercial own add-ons, domains, grace, notices, suspension, retention, and deletion.
- **Owner analytics:** current Owner-only workspace scope; analytics derives measures from committed downstream source identities and current commercial balances, never from authority audit as a substitute.

Editor/CREATE and all inherited Onlook behavior remain untouched. No second generator, editor wrapper, project-role repurposing, fixed-template change, AI CREATE change, publishing/settings/export/Git change, or downstream provider behavior belongs in these slices.

## Parent-owned Decisions and Review Gates

These actions are prerequisites/lifecycle gates, not implementation work. They remain visibly unresolved until an owner records an explicit decision.

- [ ] D1: Approve or revise audit retention/legal-hold policy, exact sanitized Owner-visible projection, privileged support/security/legal access, and the delivery/chain strategy; no implementation may infer durations or blanket roles. <!-- sdd-owner: parent -->
- [ ] D2: Approve invitation delivery ownership and exact V1 authenticated-identity/email normalization and binding rules; token storage remains hash-only regardless. <!-- sdd-owner: parent -->
- [ ] D3: Approve the explicit idempotent initial workspace/Owner bootstrap contract and separately decide whether any inherited user/project mapping exists; no project-role inference or bulk backfill is assumed. <!-- sdd-owner: parent -->
- [ ] D4: Decide whether direct authenticated Data API reads are required at launch and approve exact exposed-schema grants/policies; direct browser writes remain prohibited unless separately specified. <!-- sdd-owner: parent -->
- [ ] D5: Approve system-actor allowlist/operations and compliance/security constraints for audit visibility; system actors never receive Owner role. <!-- sdd-owner: parent -->
- [ ] D6: Approve the `packages/workspace-authority` allocation and dependency direction in `architecture/policy.json`; planning alone does not permit the package. <!-- sdd-owner: parent -->
- [ ] D7: After documented concurrency/tooling evidence exists, approve exact database isolation level, operation-result storage shape, and whether a reviewed constraint trigger is necessary; do not assume `SECURITY DEFINER`. <!-- sdd-owner: parent -->
- [ ] M1: A maintainer verifies current Supabase/CLI documentation and installed `--help`, generates the migration candidate through the repository-approved workflow, and records its exact path; agents do not run `db:gen` or edit generated migration output. <!-- sdd-owner: parent -->
- [ ] R1: Review and accept `architecture/slices/workspace-authority-01-contracts.json`, including every governed path/classification/runtime/capability and the focused-package policy allocation, before Slice 1 edits. <!-- sdd-owner: parent -->
- [ ] R2: Review and accept `architecture/slices/workspace-authority-02-schema.json` and the new exact-hash CCR for every protected path, including `packages/db/src/schema/index.ts`, before Slice 2 edits. <!-- sdd-owner: parent -->
- [ ] R3: Review and accept `architecture/slices/workspace-authority-03-rls.json`, the exact maintainer-generated migration path, database-test path, and any per-file CCR before Slice 3 edits/tests. <!-- sdd-owner: parent -->
- [ ] R4: Review and accept `architecture/slices/workspace-authority-04-actors.json` with every exact service/test path and any required CCR before Slice 4 edits. <!-- sdd-owner: parent -->
- [ ] R5: Review and accept `architecture/slices/workspace-authority-05-resource-revalidation.json` with every exact contract/service/test path and any required CCR before Slice 5 edits. <!-- sdd-owner: parent -->
- [ ] R6: Review and accept `architecture/slices/workspace-authority-06-invitations.json` with every exact schema/service/test path and per-file CCR before Slice 6 edits. <!-- sdd-owner: parent -->
- [ ] R7: Review and accept `architecture/slices/workspace-authority-07-membership-concurrency.json` with every exact service/schema/test path and per-file CCR before Slice 7 edits. <!-- sdd-owner: parent -->
- [ ] R8: Review and accept `architecture/slices/workspace-authority-08-audit-system.json` with every exact schema/service/test path and per-file CCR before Slice 8 edits. <!-- sdd-owner: parent -->
- [ ] R9: Review and accept `architecture/slices/workspace-authority-09-transport.json` and separate exact-resulting-SHA-256 CCRs for `apps/web/client/src/server/api/root.ts`, `apps/web/client/src/server/api/routers/index.ts`, `apps/web/client/package.json`, and every other protected path before Slice 9 edits; confirm `bun.lock` remains untouched or stop for separate maintainer governance. <!-- sdd-owner: parent -->
- [ ] After each slice, complete a neutral bounded slice review confirming Strict-TDD evidence, 250–400 changed lines, exact manifest/diff agreement, CCR/hash agreement, focused gate results, rollback safety, no downstream scope, and no editor/CREATE/inherited Onlook regression before authorizing the next slice; this roadmap does not prescribe review-lineage reuse or start a review transaction. <!-- sdd-owner: parent -->

## Planning-only Stop

No task above is authorized for execution until explicit owner approval and all applicable decision, manifest, CCR, maintainer, and governance prerequisites are complete. This tasks phase ends here: no apply, implementation, tests, manifests, CCRs, migrations, verify, sync, archive, commits, or runtime edits are authorized.
