# Tasks: Establish Lead Pipeline

## Planning status

This is a planning-only roadmap. It authorizes no implementation, tests, manifests, Core Change Requests (CCRs), migrations, generated edits, provider activation, apply/verify/sync/archive work, or commits. All nine future slices remain blocked by the parent-owned gates below. **Tasks authorized for execution: 0.**

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | 3,220 across nine future slices, including tests and manifests (aggregate expected range: 2,650–3,500) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 contracts/rules → PR 2 schema → PR 3 migration/RLS/DB tests → PR 4 durable primitives → PR 5 discovery/reads → PR 6 corrections/value → PR 7 website relationships → PR 8 SMS/events/fixtures → PR 9 transport/composition |
| Delivery strategy | auto-forecast |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

The delivery owner must approve the chain strategy and all blocking policy/runtime decisions before any future `sdd-apply`. Each PR is an autonomous, dependency-ordered work unit with its own RED evidence, GREEN boundary, focused verification, completion evidence, and non-destructive rollback.

## Governance protocol for every future slice

- Every slice is blocked until its exact candidate diff is known and one reviewed manifest at `architecture/slices/lead-pipeline-0N-*.json` names **every** governed path with `capability`, `owningRuntime`, `role`, and baseline-accurate `classification`. No wildcard, proposed tree, or this roadmap is a declaration.
- Before **each** edit to a protected inherited file, prepare a new per-file CCR naming that exact path and the SHA-256 of the exact candidate resulting content; obtain approval in `architecture/core-change-approvals.json`; and reference that CCR from the reviewed manifest. No truthful resulting hash exists before the exact candidate exists. Prior or closed review lineage, intent hashes, and another file's approval do not authorize an edit.
- Use neutral, bounded review for each slice and candidate. Do not presume reuse of any prior review lineage.
- Generated migration output under `apps/backend/supabase/migrations/` is maintainer-owned. Agents must not run `db:gen`, generate or edit migration output, edit `bun.lock`, or reconcile a dependency change that modifies `bun.lock`; stop for maintainer/governance action instead.
- Do not touch editor/CREATE, inherited project lifecycle, Onlook behavior, BMAD/Telio, workspace-authority implementation, unrelated dirty/generated files, or unmanifested paths. V1 has no manual lead creation, merge, split, project reassignment, inherited-project backfill, or second generator.
- Production composition must remain hard fail-closed until the approved workspace-authority runtime supplies current actor, Member/Owner, exact resource authorization, revalidation, named system actor, and audit evidence. Never substitute project roles, client-selected workspace, JWT claims, user ownership, `protectedProcedure`, or service-role bypass.

## Future implementation roadmap

### Slice 01 — Pure contracts and rules

**Objective:** establish runtime-neutral `@onlook/leads` contracts and deterministic identity, fixed-pipeline, exact-money, correction, and automatic-transition decisions without a runtime consumer.

**Dependencies:** approved fingerprint/provider policy shape, bounds schema, and ISO currency policy interface may be represented only as fail-closed injected ports; no production policy values may be guessed.

**Exact forecast:** **360 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-01-contracts-rules.json`.

**Candidate paths/discovery targets:** `packages/leads/package.json`, `packages/leads/src/index.ts`, `packages/leads/src/contracts.ts`, `packages/leads/src/pipeline.ts`, `packages/leads/src/identity.ts`, `packages/leads/src/money.ts`, and focused tests under `packages/leads/test/`. The reviewed manifest must reduce this candidate set to every exact resulting path and classify each path before edits.

- [ ] Establish retained RED evidence in exact manifest-listed `packages/leads/test/*.test.ts` for fixed vocabularies; serializable allowed/denied/conflict/replay results; provider-first identity with fingerprint disagreement; missing-policy failure; exact decimal strings including zero; Closed/outcome/value pairing; manual reopening; automatic non-regression; bounded metadata; and absence of UI, transport, persistence, provider, app-private, or deep imports. No production file may be edited before the manifest review and any required per-file CCR approval. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN implementation through the sole public entry `packages/leads/src/index.ts`: opaque IDs and command/result/event ports, pure identity decisions, fixed stage decisions, exact-money canonicalization, and explicit policy-unavailable outcomes; do not add a runtime consumer or policy guess. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE same source IDs across workspaces, provider/fingerprint collision, semantic idempotency-key mismatch, custom stages/outcomes, same-state correction, Won→Lost clearing, Closed reopening, lowercase/unsupported/excess-scale currency, scientific notation/binary-number input, secret-shaped metadata, and website/SMS replay and out-of-order decisions. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep contracts persistence-neutral, dependency direction one-way, one intentional package entry, and no generic/shared abstraction; retain the failing-first commit or equivalent review evidence. <!-- sdd-owner: implementation -->
- [ ] Run focused verification `bun test packages/leads/test`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, and `git diff --check`; completion evidence is passing contract tests plus architecture proof that `@onlook/leads` has no forbidden dependencies. Rollback boundary: remove the unconsumed package and Slice 01 manifest only; no runtime/data exists. <!-- sdd-owner: implementation -->

### Slice 02 — Canonical identity and current-projection schema

**Objective:** add the declarative business, provider/fingerprint binding, and lead current-projection schema with workspace-scoped uniqueness and exact state/value checks, but no migration or API activation.

**Dependencies:** Slice 01; approved exact schema path inventory; approved policy representation for versioned fingerprint and currency references.

**Exact forecast:** **340 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-02-identity-current-schema.json`.

**Candidate paths/discovery targets:** `packages/db/src/schema/lead-pipeline/index.ts`, `business.ts`, `identity.ts`, `lead.ts`, exact schema-test path discovered from `packages/db/package.json` and existing test conventions, and protected `packages/db/src/schema/index.ts` only if the exact candidate requires export composition.

- [ ] Establish retained RED schema evidence for one business→one lead per workspace, provider and fingerprint active uniqueness within but not across workspaces, fixed stages, Closed/outcome/value checks, non-negative exact numeric amount, paired currency/policy version, monotonic version representation, workspace-leading indexes, and local businesses having no auth/subscriber/member foreign-identity semantics. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN additive Drizzle schema under `packages/db/src/schema/lead-pipeline/`; edit protected `packages/db/src/schema/index.ts` only after its exact candidate SHA-256 has a new approved per-file CCR referenced by the reviewed Slice 02 manifest. Do not generate a migration. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE duplicate provider/fingerprint inserts, provider/fingerprint disagreement representation, same real-world/provider ID in separate workspaces, invalid stage/outcome/value rows, very large exact values, zero, and mutable display-field changes that must not alter identity. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep persistence grouped by lead-pipeline ownership, workspace predicates/indexes explicit, and schema independent of app-private or provider code. <!-- sdd-owner: implementation -->
- [ ] Run focused verification `bun test packages/db/test/lead-pipeline-schema.test.ts` after the manifest confirms that exact test path, `bun run typecheck`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, and `git diff --check`; completion evidence is reviewable declarative state and passing schema tests with no migration generated. Rollback boundary: remove only additive schema/test/export candidate changes under their approved CCR; no deployed database state exists. <!-- sdd-owner: implementation -->

### Slice 03 — Maintainer migration, RLS, grants, indexes, and DB tests

**Objective:** have a maintainer produce the exact migration candidate and prove database constraints, ownership-aware RLS, grants, immutability, and query paths without agent-generated SQL.

**Dependencies:** Slice 02; completed workspace-authority persistence/RLS contract; owner decision on Data API exposure; selected DB test workflow; maintainer migration generation; exact generated candidate available before manifest review.

**Exact forecast:** **390 changed lines**, including maintainer-generated migration, DB tests, and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-03-migration-rls-db-tests.json`.

**Candidate paths/discovery targets:** the maintainer-supplied exact path under `apps/backend/supabase/migrations/`, and exact SQL test paths selected after inspecting `apps/backend/supabase/config.toml`, `apps/backend/package.json`, and installed `supabase --help`/`supabase test db --help`. Placeholders are forbidden in the reviewed manifest.

- [ ] Retain RED DB evidence, before migration incorporation, for anon/unauthenticated/non-member/removed-member/stale-claim denial; Member/Owner allowed shapes; cross-workspace direct/list/count/cursor/indirect/mixed-batch isolation; exact numeric/check/uniqueness failures; immutable history-role privileges; Data API grants; view/function safety; and workspace-leading query plans. <!-- sdd-owner: implementation -->
- [ ] Incorporate only the maintainer-generated exact migration candidate after its exact path and all DB test paths are reviewed in Slice 03; agents must not run `db:gen`, edit generated SQL, add `SECURITY DEFINER` shortcuts, or change `bun.lock`. GREEN is the smallest RLS/grant/index/constraint state supported by workspace authority and the approved Data API decision. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE concurrent provider/fingerprint creation, cross-workspace duplicates, stale JWT versus current membership, UPDATE requiring SELECT plus `USING`/`WITH CHECK` where applicable, service-role use still requiring application checks, guessed nonexistent IDs, project indirect access, and query plans for identity/list/history/operation/relationship/outbox targets. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green by removing speculative indexes or privileges and retaining only evidence-backed policies; no hand-edit of generated output is permitted, so required SQL changes return to the maintainer generation workflow. <!-- sdd-owner: implementation -->
- [ ] Discover and record the installed CLI syntax with `supabase --version`, `supabase --help`, and `supabase test db --help`, then run the reviewed exact DB-test command, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, and `git diff --check`; completion evidence includes command/version output, adversarial DB results, reviewed grants/RLS, and query-plan evidence. Rollback boundary: disable admission and use an owner-approved forward migration; never destructively erase canonical/history evidence. <!-- sdd-owner: implementation -->

### Slice 04 — Durable operations, history, and outbox primitives

**Objective:** implement repository transaction primitives for operation claims, optimistic projection mutation, append-only/superseding history, committed events/outbox, and recovery without transport.

**Dependencies:** Slices 01–03; owner-selected transaction isolation, lock order, bounded retries, durable operation-result format, metadata bounds, and event dispatcher ownership contract.

**Exact forecast:** **380 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-04-durable-primitives.json`.

**Candidate paths/discovery targets:** `packages/db/src/schema/lead-pipeline/history.ts`, `operation.ts`, `event.ts`, exact schema export only if needed, and `apps/web/client/src/server/services/lead-pipeline/repository.ts` with colocated focused tests; every actual split/combined path must be exact in the manifest.

- [ ] Establish retained RED evidence that operation scope `(workspace, kind, operationId)` distinguishes replay from semantic mismatch; CAS admits at most one expected version; projection/history/event/final operation result commit all-or-none; prohibited metadata is excluded; unknown commit is recovered by operation ID; and outbox dispatch failure never reruns the domain mutation. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN transaction boundary with consistent lock/CAS order, durable semantic request hash/result, full prior/result history, stable committed event IDs, and dispatcher-neutral outbox state; fail before mutation when required audit/result persistence is unavailable. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE two incompatible corrections, equivalent and mismatched operation reuse, concurrent identity claims, serialization/deadlock retry exhaustion, cross-workspace operation IDs, stale versions, post-commit dispatch failure, event replay, supersession, and secret/raw-payload rejection. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep repository mechanics capability-local and injected, avoid a generic event store, and document the tested isolation/retry boundary rather than guessing a trigger or privileged helper. <!-- sdd-owner: implementation -->
- [ ] Run focused manifest-listed repository tests with `bun test apps/web/client/src/server/services/lead-pipeline/repository.test.ts`, relevant DB tests, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, and `git diff --check`; completion evidence is atomicity/concurrency/recovery output and an undispatched event that remains durable. Rollback boundary: disable command admission/dispatch while preserving operations, history, events, and projections. <!-- sdd-owner: implementation -->

### Slice 05 — Authorized discovery create-or-resolve and scoped reads

**Objective:** implement discovery-only create-or-resolve plus direct/list/history/Inbox/project read contracts behind mandatory workspace authority and approved discovery/commercial attestations.

**Dependencies:** Slices 01–04; workspace-authority runtime; approved fingerprint/provider and bounds policies; discovery displayed-result attestation; commercial reservation/finalization/reconciliation saga; exact resource-owner ports.

**Exact forecast:** **390 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-05-discovery-and-reads.json`.

**Candidate paths/discovery targets:** `apps/web/client/src/server/services/lead-pipeline/index.ts`, `policies.ts`, `identity.ts`, `reads.ts`, and colocated tests; public shapes remain in `packages/leads/src/contracts.ts` only if an exact candidate requires a protected-by-governance follow-up declaration.

- [ ] Establish retained RED evidence that production construction fails closed without workspace authority/policy; only eligible discovery attestation creates; provider-first and independently checked fingerprint candidates resolve/create/conflict correctly; `created`/`existing`/`replay` return a stable import-decision ID; manual/website/SMS/Inbox creation is denied; and direct/list/history/indirect/batch reads are sanitized and workspace-scoped. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN authorized service for fresh Member resolution, discovery attestation validation, transactional create-or-resolve, stable commercial decision identity, and bounded keyset/scoped reads; lead pipeline must not call provider or commercial internals and must not claim a distributed transaction. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE simultaneous imports by provider and fingerprint, disagreement/collision, source replay, crash after lead commit before charge finalization, removed Member before commit, cross-workspace/nonexistent IDs, forged actor/workspace/source claims, cursor/count leakage, conversation/project indirect mismatch, and all-or-nothing mixed batches. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep service composition explicit, authority/policy ports mandatory, discovery and commercial ownership external, and reads persistence-neutral. <!-- sdd-owner: implementation -->
- [ ] Run focused manifest-listed identity/read tests with `bun test apps/web/client/src/server/services/lead-pipeline/identity.test.ts apps/web/client/src/server/services/lead-pipeline/reads.test.ts`, relevant DB tests, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, and `git diff --check`; completion evidence includes stable created/existing/replay identities, saga crash recovery, sanitized access results, and proof of zero effects while authority is unavailable. Rollback boundary: disable discovery admission and reads while preserving committed identities/decisions/history. <!-- sdd-owner: implementation -->

### Slice 06 — Manual correction, outcome, value, and concurrency

**Objective:** add authorized optimistic corrections for fixed stages, reopening, Closed outcomes, and exact Won value while preserving complete history.

**Dependencies:** Slices 01–05; workspace-authority runtime; approved reason/metadata bounds and ISO 4217 version/scales.

**Exact forecast:** **340 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-06-corrections-outcomes-value.json`.

**Candidate paths/discovery targets:** `apps/web/client/src/server/services/lead-pipeline/commands.ts`, focused `commands.test.ts`, and exact `packages/leads` rule/test paths only if the candidate extends rather than duplicates Slice 01 rules.

- [ ] Establish retained RED evidence for the complete manual transition matrix, same-stage outcome/value correction, backward movement/reopening, required bounded reason, exact version, Closed/Won/Lost invariants, value clear/replace, zero/exact decimals, and atomic history/version/event effects. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN current Member/Owner correction command with pre-commit revalidation, one CAS version increment per changed projection, prior/result evidence, exact decimal/currency policy validation, and typed denial/conflict/replay; automatic actors receive no correction privilege. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE two same-version corrections, removed Member before commit, Won→Lost clearing, Lost→Won absent/value pair, Closed→Contacted clearing, invalid/custom state, absent/oversized reason, huge/negative/scientific/lowercase/excess-scale values, replay/mismatched keys, and separate-currency exposure without aggregation. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to share pure decisions through `@onlook/leads`, keep transaction orchestration app-local, and avoid floating arithmetic or persistence leakage. <!-- sdd-owner: implementation -->
- [ ] Run `bun test apps/web/client/src/server/services/lead-pipeline/commands.test.ts packages/leads/test`, relevant DB concurrency tests, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, and `git diff --check`; completion evidence is exact matrix/concurrency output and preserved prior value/outcome history. Rollback boundary: disable correction entry while retaining every committed projection/version/history/event. <!-- sdd-owner: implementation -->

### Slice 07 — Website attempts and project relationships

**Objective:** add durable pending/failed/superseded/succeeded website attempts, same-workspace project attachment, one-project ownership, and non-regressing Website building transition without touching inherited CREATE/project lifecycle.

**Dependencies:** Slices 01–06; approved project ownership and successful-creation evidence seam; workspace-authority revalidation; website owner reconciliation contract.

**Exact forecast:** **370 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-07-website-attempts-projects.json`.

**Candidate paths/discovery targets:** `packages/db/src/schema/lead-pipeline/website.ts`, `apps/web/client/src/server/services/lead-pipeline/website.ts`, and colocated focused tests. Inherited project schema/router/editor/CREATE paths are excluded.

- [ ] Establish retained RED evidence for replay-safe begin/fail/supersede/succeed attempts; ambiguity remaining pending; atomic same-workspace project proof, relationship, attempt success, history/event/operation result; New lead→Website building only; multiple projects per lead; and one project never attaching to two leads. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN website-owned evidence consumer and injected project-ownership port; do not invoke, wrap, alter, or infer inherited CREATE, project creation, editor, CodeSandbox, publishing, hosting, deletion, or project-role behavior. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE repeated begin/attach, two concurrent attachments, project offered to another lead or workspace, success after Contacted/Closed, failure then late success, ambiguous timeout, multiple distinct successful attempts, project archival/deletion/recreation, and missing existing lead. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep attempt/relationship ownership in lead pipeline and all website/project success semantics behind the narrow approved port; no reassignment, merge, split, backfill, or cascade is introduced. <!-- sdd-owner: implementation -->
- [ ] Run `bun test apps/web/client/src/server/services/lead-pipeline/website.test.ts`, relevant package/DB tests, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, and `git diff --check`; completion evidence includes replay/concurrency traces and inherited-path diff evidence showing no editor/CREATE/project lifecycle changes. Rollback boundary: disable new attempts/attachments while preserving pending reconciliation and truthful relationships/events. <!-- sdd-owner: implementation -->

### Slice 08 — SMS accepted events and downstream fixtures

**Objective:** consume only authenticated durable accepted-outbound-SMS facts, apply replay/order-safe Contacted transitions, and publish persistence-neutral fixtures for downstream readiness.

**Dependencies:** Slices 01–07; approved SMS accepted-event authentication, named system action, schema/version, and reconciliation identity; event dispatcher ownership decision; workspace-authority system actor contract.

**Exact forecast:** **350 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-08-sms-events-fixtures.json`.

**Candidate paths/discovery targets:** `apps/web/client/src/server/services/lead-pipeline/sms.ts`, `events.ts`, focused tests/fixtures under that capability, and public contract fixtures under `packages/leads/test/` when shared across discovery, website, SMS, Inbox, hosting, commercial, and analytics.

- [ ] Establish retained RED evidence that only authenticated accepted facts can transition New lead/Website building→Contacted; preview/confirmation/reservation/debit/invocation/delivery/reply/rejection/timeout and unauthenticated facts do not; equivalent replay deduplicates; semantic mismatch conflicts; and bounded facts exclude Telnyx payload/status, body, recipient details, credentials, and tokens. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN SMS fact application plus dispatcher-neutral committed event fixtures carrying stable workspace/aggregate/event/schema/operation/version/time/authority/supersession identities; keep Telnyx mapping, webhook authentication, reconciliation, messaging, and commercial effects owned by SMS. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE accepted fact after manual Closed, out-of-order website/SMS events, timeout then accepted reconciliation under the same source operation, duplicate delivery, cross-workspace source ID, forged system actor, dispatch retry/dead-letter behavior, event gaps, and consumer replay by event ID. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep event envelopes bounded and persistence-neutral, avoid a generic event bus, and preserve at-least-once delivery separately from domain truth. <!-- sdd-owner: implementation -->
- [ ] Run `bun test apps/web/client/src/server/services/lead-pipeline/sms.test.ts apps/web/client/src/server/services/lead-pipeline/events.test.ts packages/leads/test`, relevant DB tests, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, and `git diff --check`; completion evidence includes auth/replay/order fixtures for all seven consumers and durable outbox recovery. Rollback boundary: stop accepted-event admission and dispatch while retaining committed accepted facts, state, operations, and outbox reconciliation. <!-- sdd-owner: implementation -->

### Slice 09 — Thin transport and protected composition hardening

**Objective:** add thin validated Member-facing transport and explicit server composition/export seams that remain unavailable without workspace authority, then run bounded integration/regression gates.

**Dependencies:** Slices 01–08; all parent policy/runtime/integration decisions approved; delivery-chain approval; exact protected candidate content and CCRs; dependency reconciliation that does not require an agent `bun.lock` edit.

**Exact forecast:** **300 changed lines**, including tests and manifest.

**Candidate manifest:** `architecture/slices/lead-pipeline-09-transport-composition.json`.

**Candidate paths/discovery targets:** `apps/web/client/src/server/api/routers/lead-pipeline/index.ts`, `index.test.ts`, protected `apps/web/client/src/server/api/routers/index.ts`, protected `apps/web/client/src/server/api/root.ts`, and protected `apps/web/client/package.json` if `@onlook/leads` must be declared. Avoid `trpc.ts`, root `package.json`, `packages/db/src/index.ts`, inherited project paths, and all editor/CREATE paths absent separately proven necessity.

- [ ] Establish retained RED transport/composition evidence for Zod validation, plain serializable results, current actor/resource checks in the service rather than authentication-only transport, sanitized failures, unavailable production composition without workspace authority/policies, and no public/manual implicit creation route. <!-- sdd-owner: implementation -->
- [ ] Make the smallest GREEN thin router and explicit service composition. Before each protected edit, obtain a distinct approved per-file CCR for its exact path and exact candidate resulting SHA-256 and reference it from Slice 09; stop if package reconciliation would modify `bun.lock`. <!-- sdd-owner: implementation -->
- [ ] TRIANGULATE malformed/custom-stage/value inputs, removed Member, cross-workspace/nonexistent direct and indirect IDs, mixed batches, service-role misuse, missing policy/runtime, consumer fixtures, Data API decision, dispatcher failure, and inherited Projects/editor/CREATE/project-role regression boundaries. <!-- sdd-owner: implementation -->
- [ ] REFACTOR only while green to keep transport declarative, composition explicit, public package imports stable, server/client boundaries intact, and protected diffs minimal; do not refactor inherited Onlook code to fit new conventions. <!-- sdd-owner: implementation -->
- [ ] Run focused router tests, then `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, `bun scripts/ci/local.ts --mode pre-push`, and `git diff --check`; completion evidence includes exact CCR/hash matches, manifest/diff parity, fail-closed composition, consumer contract results, and no generated/lockfile/editor/CREATE/project-lifecycle diff. Rollback boundary: remove/disable transport and composition entrypoints under newly approved rollback CCRs while preserving all durable lead evidence and reconciliation. <!-- sdd-owner: implementation -->

## Normative requirement traceability

| # | Normative requirement | Primary slice(s) | Required evidence |
| ---: | --- | --- | --- |
| R1 | Authoritative workspace-scoped business/lead identity | 1, 2, 5 | Provider/fingerprint resolution, collision conflict, cross-workspace independence, no subscriber identity |
| R2 | Discovery-only V1 creation | 1, 5, 9 | Eligible attestation creates; manual and implicit downstream creation denied |
| R3 | Exact V1 stages/outcomes | 1, 2, 6 | Vocabulary/check constraints and Closed/Won/Lost matrix |
| R4 | Versioned projection and durable bounded history | 2, 4, 6 | Prior/result evidence, monotonic version, allowlisted metadata, supersession |
| R5 | Atomic optimistic typed mutations | 4–8 | CAS races, all-or-none commit, allowed/denied/conflict/replay recovery |
| R6 | Member/Owner history-preserving corrections | 1, 6 | Reopening/backward/same-state matrix, reason bound, removed-member denial |
| R7 | Successful monotonic website trigger | 1, 7 | Truthful success only, New→Website building, no lifecycle regression |
| R8 | Durable authenticated SMS accepted trigger | 1, 8 | Accepted-only auth fixture, timeout reconciliation, no Telnyx interpretation |
| R9 | Workspace-scoped order-independent idempotency | 1, 4, 5, 7, 8 | Replay/mismatch/cross-workspace/out-of-order cases |
| R10 | Durable bounded attempts/project relationships | 2, 7 | Attempt states/retries, multiple projects, one project owner, no reassignment |
| R11 | Exact analytics-only Won value | 1, 2, 6 | Decimal string/numeric, zero, pair/scale/version checks, no conversion/payment |
| R12 | Server authority and all access shapes | 3, 5–9 | Member/Owner, removal, direct/list/indirect/batch, sanitized denial/revalidation |
| R13 | Supabase Auth/application authority/RLS separation | 3, 5, 9 | RLS/grants plus mandatory app checks; no JWT/project-role/service-role substitute |
| R14 | Narrow public consumer contracts | 1, 5, 7–9 | Persistence-neutral discovery/website/SMS/Inbox/hosting/commercial/analytics fixtures |
| R15 | Capability ownership/dependency direction | 1, 5, 7–9 | Architecture checker, public imports, no sibling internals/table access |
| R16 | Retention/privacy/legal evidence | 4, 8 | Append/supersede/tombstone contracts and fail-closed unresolved retention tests |
| R17 | Workspace authority runtime prerequisite | 5–9 | Production factory unavailable and zero effect without approved authority runtime |
| R18 | Additive preservation of inherited Onlook | 7, 9 | No editor/CREATE/project lifecycle/backfill diff and regression gates |
| R19 | Strict-TDD/protected governance | 1–9 | Nine exact reviewed manifests, retained RED, per-file candidate-hash CCRs, no generated/lockfile edits |

The 19 requirements and their 65 specification scenarios must be enumerated by exact scenario title in the relevant slice test plan before that slice manifest is approved; this table is the roadmap-level coverage index, not permission to omit any scenario.

## Downstream readiness map

| Consumer | Earliest lead slice | Lead-side evidence | Still blocked on consumer-owned work |
| --- | ---: | --- | --- |
| Discovery/DataForSEO | 5 | Authorized eligible create-or-resolve, stable created/existing/replay/conflict import decision | Displayed-result/provider attestation, fingerprint policy, provider execution, reconciliation |
| Website creation | 7 | Replay-safe attempt and authenticated successful project attachment | Presets/prompts/BYOK/commercial gates, inherited CREATE invocation, project ownership/success evidence |
| SMS | 8 | Authenticated accepted-fact application and replay/order behavior | Compliance, sender state, Telnyx mapping/webhook auth, reservation/debit, reconciliation |
| Inbox | 5/8 | Scoped conversation→lead read shape and fixture | Conversation ownership relationship, messages/unread/notification/reply implementation |
| Hosting/project | 7/8 | Scoped durable project relationship read and fixture | Site/domain/grace/retention lifecycle; no pipeline mutation |
| Commercial | 5/8 | Immutable import/lead/attempt/source operation identities | Entitlement, balance, reservation/finalization ledger and saga reconciliation |
| Analytics | 4/8 | Stable committed events, lead versions, supersession, exact separated currencies | Projection/checkpoint/reconciliation/staleness/activation/presentation |

No downstream capability is production-ready until workspace authority exists and its own native SDD, authorization, and owner prerequisites are complete. Lead pipeline must not import consumer internals or permit ad hoc lead-table access.

## Parent-owned decisions and lifecycle gates

These actions are grouped separately and are prerequisites, not implementation work.

- [ ] Approve exact fingerprint fields, normalization/transliteration rules, provider namespace/ID allowlist, policy versioning, and collision-review owner; keep fallback creation unavailable until approved. <!-- sdd-owner: parent -->
- [ ] Approve exact bounds and allowlisted schemas for operation/source IDs, display fields, correction reasons, metadata, batch size, event payloads, and retained normalization evidence. <!-- sdd-owner: parent -->
- [ ] Approve the active ISO 4217 policy version, supported active codes, scales, and policy release authority. <!-- sdd-owner: parent -->
- [ ] Approve retention/deletion periods, legal holds, anonymized fields, Owner-visible history, and privileged support/security/legal access; keep automated deletion fail-closed meanwhile. <!-- sdd-owner: parent -->
- [ ] Complete and approve workspace-authority runtime/package/persistence/RLS/composition and evidence; reject temporary inherited project/JWT/client/service-role authority. <!-- sdd-owner: parent -->
- [ ] Approve discovery displayed-result eligibility attestation and the commercial reservation/finalization/reconciliation saga, including ownership of unresolved charge recovery. <!-- sdd-owner: parent -->
- [ ] Approve the narrow inherited project-to-workspace ownership and website successful-creation evidence seam, with no editor/CREATE/project lifecycle modification. <!-- sdd-owner: parent -->
- [ ] Approve SMS accepted-event authentication, named system action, bounded schema/version, operation identity, and reconciliation contract; retain Telnyx mapping in SMS ownership. <!-- sdd-owner: parent -->
- [ ] Select transaction isolation, lock/serialization approach, bounded retry policy, and durable operation-result details from concurrency evidence; do not assume triggers or `SECURITY DEFINER`. <!-- sdd-owner: parent -->
- [ ] Decide Data API exposure and grants; default to server-mediated reads, no anon access, and no direct browser writes. <!-- sdd-owner: parent -->
- [ ] Confirm lead-event dispatcher, retry, dead-letter, and reconciliation ownership without creating a generic event bus. <!-- sdd-owner: parent -->
- [ ] Approve maintainer migration production, each exact slice manifest, and each new per-file candidate-resulting-hash CCR through bounded slice review before the associated edit. <!-- sdd-owner: parent -->
- [ ] Explicitly approve nine-PR delivery and choose `stacked-to-main`, `feature-branch-chain`, or a documented size exception before any future `sdd-apply`; current chain strategy remains `pending`. <!-- sdd-owner: parent -->
- [ ] After all nine separately authorized slices, evaluate the recorded implementation evidence and explicitly authorize any native verify phase; SDD completion itself starts no review transaction and creates no verify/sync/archive authority. <!-- sdd-owner: parent -->

## Planning-only stop

Stop here. Do not create manifests, CCRs, hashes, migrations, tests, runtime files, or execute verification commands from this roadmap. Native proposal/spec/design are complete; implementation/apply/verify/sync/archive remain blocked. **Zero tasks are authorized for execution until the parent-owned decisions and per-slice approvals explicitly release them.**
