# Technical Design: Authorized Runtime Policy Operation

## Status and decision

**Status: BLOCKED before implementation.** The repository inspection found normative contradictions and missing authorities that prevent an implementable design from satisfying the accepted specification without inventing scope. The architecture below is the intended boundary and transaction design, but implementation must not start until the blockers in **Unresolved blockers** are resolved in the authoritative requirements and exact protected-file approvals exist.

This one corrective design rerun records two explicit user decisions:

1. resolve the blockers through prerequisite governed SDD changes rather than weakening Story 1.3b or proceeding around them; and
2. after all prerequisites and governance gates are complete, use chained review slices targeting 250–400 authored lines while preserving atomic end-to-end behavior.

These decisions select a resolution process, not the unresolved product semantics. They do not choose production policy schema contents, release identity semantics, first-activation semantics, audit-failure retention, a rate-limit design, AAL2 versus owner risk acceptance, generated outputs, or protected approvals.

This phase is planning only. It does not authorize runtime edits, generated output, database generation, lockfile changes, production activation, CCR creation/approval, or commits.

## Repository evidence and constraints

- Story 1.3a's public entry point is `packages/business-policy/src/index.ts`, exporting only `fixtures.ts` and `release.ts`.
- Its public contract provides the six closed kinds, registry construction, strict validation, canonical JSON, SHA-256 hashing, release construction, snapshot assertions, and a non-production qualification fixture.
- It provides **no production schemas or production validator bindings** and **no public safe-diff computation function**. The only concrete schema/version is `qualification@fixture-1`, explicitly `scope: non-production`.
- The web app's tRPC context derives the authenticated user with `supabase.auth.getUser()`. `protectedProcedure` is the correct authentication base, but its email requirement is not operator authority. `adminProcedure` creates a service-role client and is prohibited for this capability.
- `@onlook/db` publicly exports schema and `DrizzleDb`; existing internals deep-import the client, but new code must use public package exports and an injected `ctx.db`/server database dependency rather than adding another private import.
- Database schemas live under `packages/db/src/schema`; Drizzle output is configured to `apps/backend/supabase/migrations`. The repository has no established pgTAP/database-test suite at the inspected paths.
- No existing local operator/application request-rate limiter was found. Subscription `rate_limits` are billing/usage authority and cannot be reused or reinterpreted for this story.
- The current approval registry contains CCR-019 through CCR-026 only. None authorizes a protected path required by this change.

## Architecture and capability ownership

The capability is **`business-policy-operator`**, owned jointly by the existing Next.js server runtime, application-owned PostgreSQL schema, and route-local `/operator` presentation.

```text
/operator Server Component and route-local client console
    -> business.policy tRPC boundary
        -> operator authorization + business-policy release orchestration
            -> public @onlook/business-policy contract
            -> public @onlook/db schema/types and injected Drizzle database
                -> application-owned PostgreSQL tables/constraints/privileges
```

Ownership rules:

- `@onlook/business-policy` remains the stable, runtime-neutral Story 1.3a contract. It must not gain authorization, persistence, application, provider, or UI responsibilities as part of 1.3b.
- `packages/db` owns primitive persistence declarations only and must not import `@onlook/business-policy`.
- `apps/web/client/src/server/services/operator` owns fresh UUID membership authorization.
- `apps/web/client/src/server/services/business-policy` is the application composition root, public-contract mapper, and transaction orchestrator.
- The tRPC router validates strict envelopes and maps safe typed service results; it does not implement policy or SQL logic.
- `/operator` owns presentation only. Its client component receives or fetches safe serializable projections and never imports DB/auth/server service modules.
- No service-role Supabase client, `adminProcedure`, project role, subscription, email, metadata, browser actor, environment fallback, or navigation visibility participates in authority.

## Persistence model and constraints

The following is contingent on resolution of the rollback/identity and initial-release blockers.

### `operator_memberships`

One row per operator authority:

- `user_id uuid PRIMARY KEY`, referencing existing `users.id`; use `ON DELETE RESTRICT` so active or revoked authority evidence is not silently cascaded away.
- `role text NOT NULL CHECK (role = 'operator')` (a database enum is unnecessary for one closed value).
- `grant_type text NOT NULL` with a closed bootstrap/provenance vocabulary.
- `granted_at timestamptz NOT NULL DEFAULT clock_timestamp()`.
- `granted_by_actor_id uuid NULL` and `grant_correlation_id uuid NOT NULL`.
- `revoked_at timestamptz NULL`, `revoked_by_actor_id uuid NULL`, `revocation_correlation_id uuid NULL`.
- A check requires all revocation fields to be null together or populated together, and requires `revoked_at >= granted_at`.

An active membership is exactly `role = 'operator' AND revoked_at IS NULL`. Authorization queries require exactly one row; zero, duplicate/ambiguous data, unknown role/action, and database failure fail closed.

### `business_policy_releases`

- `release_id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.
- `kind text NOT NULL` constrained to the six Story 1.3a kinds.
- `schema_version text NOT NULL` with bounded identifier checks.
- `canonical_payload text NOT NULL`, `payload jsonb NOT NULL`, and `payload_hash char(64) NOT NULL` with lowercase SHA-256 check.
- `logical_identity text NOT NULL` and the required unique `(kind, schema_version, payload_hash)` constraint **only if the rollback contradiction is resolved in its favor**.
- `origin_type text NOT NULL`, constrained to the closed production operator action vocabulary; production rows have no `scope` choice.
- `actor_id uuid NOT NULL` retained as historical evidence without a cascading FK.
- `effective_at timestamptz NOT NULL DEFAULT clock_timestamp()`; application uses the database-returned timestamp when constructing and round-tripping the public release.
- `validator_id text NOT NULL`, `validation_evidence jsonb NOT NULL`, and `safe_diff jsonb NOT NULL`, all bounded by application checks and database JSON type/shape/size checks where practical.
- `supersedes_release_id uuid NULL REFERENCES business_policy_releases(release_id) ON DELETE RESTRICT`.
- `correlation_id uuid NOT NULL UNIQUE` and a bounded `idempotency_key text NOT NULL` retained as request evidence, not as browser-derived actor authority.
- Index `(kind, effective_at DESC, release_id DESC)` for deterministic active lookup and `(kind, supersedes_release_id)` for lineage/history.

Cross-row lineage (predecessor exists, same kind, current active predecessor, no self-reference) is checked in the serialized transaction and reinforced by a reviewed database trigger. Runtime roles cannot update or delete rows. A generated-column/check or trigger verifies `canonical_payload = payload::canonical representation` only if the exact canonicalization can be proven identical to Story 1.3a; otherwise application round-trip validation plus immutable storage is used rather than inventing a conflicting PostgreSQL canonicalizer.

### `operator_audit_events`

- `event_id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.
- `action text NOT NULL` closed to `bootstrap`, `revoke`, `activate`, `supersede`, and `rollback`.
- `outcome text NOT NULL` closed to committed outcomes defined by the corrected requirements.
- Exactly one actor source: `actor_id uuid` or a closed `bootstrap_type`; check prevents neither/both.
- Nullable `membership_user_id`, `prior_release_id`, and `new_release_id` as action-appropriate evidence, with non-cascading references where safe.
- Nullable closed `kind`, bounded `schema_version`, SHA-256 `payload_hash`, bounded `safe_diff jsonb`, `correlation_id uuid NOT NULL`, and `occurred_at timestamptz NOT NULL DEFAULT clock_timestamp()`.
- Action-specific checks require policy evidence for policy changes and membership evidence for bootstrap/revocation.

Audit projections never include canonical/raw payloads, credentials, authorization headers, prompts, provider data, or customer data. Runtime roles receive no UPDATE/DELETE privilege; a reviewed append-only trigger rejects UPDATE/DELETE even for the normal application runtime role. Bootstrap/revocation runbook transactions insert/update membership and append their audit event atomically.

### Database defense in depth

All three tables are in application-owned `public` because that is the repository's current Drizzle schema workflow. Each table enables RLS, has no `anon` or `authenticated` policy, and explicitly revokes all table/sequence privileges from `anon` and `authenticated`. Grants to the normal server database role are limited to required SELECT/INSERT and membership lock/update behavior; release/audit UPDATE/DELETE remain denied. Because the direct Drizzle connection does not carry request-user RLS context, application authorization remains mandatory.

RLS, grants/revokes, immutable triggers, lineage trigger, and advisory-lock support that Drizzle cannot represent are maintainer-reviewed SQL appended to the generated migration, never agent-authored generated metadata.

## Authorization and operation contracts

### Authorization service

`authorization.ts` exposes server-only functions over an injected `DrizzleDb`/transaction and server-derived `user.id`:

- `authorizeOperator(db, actorId, action)` performs the fresh pre-policy lookup.
- `lockAndAuthorizeOperator(tx, actorId, action)` selects the membership `FOR UPDATE` and rechecks active role inside every transaction that reads sensitive policy data or mutates policy state.

The action is a closed union (`review`, `history`, `activate`, `supersede`, `rollback`, `admit`). Unknown actions are impossible at typed call sites and rejected at runtime boundaries. No input contract accepts actor UUID/email/role. Missing authenticated identity maps to `UNAUTHORIZED`; authenticated denial or lookup ambiguity/failure maps to a single non-enumerating `FORBIDDEN` result before policy queries.

To order revocation races, both the maintainer revocation transaction and policy transaction lock the same membership row first. Commit order therefore decides authority deterministically.

### Registry and mapping

`registry.ts` is the sole production composition root. It must bind each supported `(kind, schemaVersion)` to an actual public production schema/validator export and construct the Story 1.3a registry once. It rejects duplicate, fixture-only, `scope: non-production`, missing, ambiguous, or unknown bindings. It exports safe editor descriptors derived from those bindings, not a generic JSON editor contract.

Database mappers in `releases.ts` reconstruct a public `PolicyRelease`, revalidate it through public Story 1.3a APIs, and compare every persisted primitive (kind/version/canonical payload/hash/identity/actor/time/diff/lineage/validation). Any mismatch is `CORRUPT_POLICY_AUTHORITY`; no row becomes active or admissible.

### Typed service results/errors

The service owns a discriminated, safe error union; raw SQL/database errors are logged only through existing server observability and never returned:

- `OPERATOR_UNAUTHORIZED`
- `OPERATOR_FORBIDDEN`
- `POLICY_BINDING_UNAVAILABLE`
- `POLICY_ACTIVE_RELEASE_MISSING`
- `POLICY_ACTIVE_RELEASE_AMBIGUOUS`
- `POLICY_AUTHORITY_CORRUPT`
- `POLICY_PAYLOAD_INVALID` (bounded issue list/path/message)
- `POLICY_PAYLOAD_TOO_LARGE`
- `POLICY_DIFF_TOO_LARGE`
- `POLICY_HASH_MISMATCH`
- `POLICY_DUPLICATE_IDENTITY`
- `POLICY_STALE_ACTIVE_RELEASE` (refresh required; no existence details beyond the authorized operator's refresh instruction)
- `POLICY_RATE_LIMITED`
- `POLICY_PERSISTENCE_FAILED`

Success projections contain only release identity, safe evidence, actor/time, lineage, and bounded diff. Transport maps missing identity to tRPC `UNAUTHORIZED`, authority denial to `FORBIDDEN`, stale state to `CONFLICT`, rate limit to `TOO_MANY_REQUESTS`, validation to `BAD_REQUEST`, and unavailable/corrupt/database failures to safe closed errors.

## Review and mutation data flow

### Authorized reads/review

1. `protectedProcedure` establishes the server-authenticated user; the router discards any forged actor fields through strict Zod input.
2. Start a short read transaction, lock/recheck membership before any policy table query, and then read history/current state.
3. Select the exact registered production validator. Unknown/unavailable bindings stop with no fallback.
4. Enforce request and canonical payload byte limits before expensive work.
5. Strictly validate through the Story 1.3a registry, canonicalize, and hash.
6. Reconstruct and validate the exact active release. Missing, ambiguous, or corrupt state returns a typed empty/unavailable state.
7. Compute a bounded safe diff using the required public Story 1.3a algorithm once that API exists. Return safe evidence only; persist nothing.

### Activate/supersede/rollback transaction

Preflight may validate for fast feedback, but it is never authoritative. The confirmed mutation does all authoritative work in one network-free transaction:

1. `SELECT ... FOR UPDATE` the actor's membership and fail closed.
2. Acquire `pg_advisory_xact_lock(namespace, kindOrdinal)` using a fixed collision-free six-kind integer mapping (not a hashed string).
3. Recheck any existing local mutation rate-limit authority atomically; no subscription/billing tables are used.
4. Query deterministic active authority and validate its integrity; compare it exactly with `expectedActiveReleaseId` (including the corrected initial-release representation).
5. Re-select the exact production binding; revalidate, canonicalize, hash, and recompute bounded safe diff inside the transaction. For rollback, load the selected historical row only after authorization, then revalidate its content exactly as a new submission.
6. Compare any client review hash with the newly computed hash. The server generates release ID, correlation ID, actor, origin/action, and uses a database-returned UTC effective time.
7. Construct the Story 1.3a public release, round-trip it through persistence mapping, and insert exactly one immutable release.
8. Insert exactly one matching successful audit event.
9. Return success only after commit. Any validation, stale predecessor, uniqueness, audit, trigger, database, or commit failure rolls back both rows and causes no provider, operation, usage, billing, entitlement, or job effect.

Same-kind transactions serialize at step 2. The first valid predecessor comparison may commit; later contenders observe a changed active release and return `POLICY_STALE_ACTIVE_RELEASE`. Different kinds can proceed concurrently. There are no network calls or provider effects in the transaction.

`requiredActiveRelease` for later operation admission uses the same exact active reconstruction and Story 1.3a snapshot assertions. Missing/ambiguous/corrupt authority denies admission; 1.3b does not implement or modify the Story 7.2/job/provider caller.

## Transport and UI boundaries

`businessRouter` composes a `policyRouter` with procedures for `bindings`, `history`, `review`, `activate`, `supersede`, and `rollback`. Every procedure derives the actor from `ctx.user.id`, independently authorizes, uses `z.strictObject`, rejects unknown fields, and applies byte/count bounds before policy access. Router code only maps service results and tRPC errors.

`/operator/layout.tsx` is a Server Component presentation guard using `supabase.auth.getUser()` plus the same authorization service; it renders/redirects a non-enumerating denial without querying policy rows. This guard is not procedure authority. `page.tsx` supplies only safe initial presentation data. `policy-console.tsx` is the smallest necessary `"use client"` boundary, uses `api.business.policy`, and does not import server modules.

The console uses existing `@onlook/ui`, Tailwind, root dark theme, and semantic HTML. It exposes only registered schema-specific fields; no free-form arbitrary JSON/SQL/prompt/provider/credential console. It presents kind/version, associated validation issues, canonical hash, bounded hash-only diff, actor/database time, active/lineage/history, and explicit action-specific confirmation. Success is announced only after transaction commit.

Accessibility strategy:

- source-order keyboard flow and visible focus; no positive `tabIndex`;
- programmatic labels/descriptions and `aria-describedby` for field issues;
- `role="status"`/`aria-live="polite"` for pending/success and `role="alert"` for denial/failure/conflict;
- move focus to the error summary/conflict recovery target after submission, and return focus to the invoking control when confirmation closes;
- text/icon/shape cues in addition to color;
- responsive single-column reflow without horizontal page scrolling at high zoom;
- no essential animation and `motion-reduce` behavior for any transition;
- confirmation names the action, kind, current release, proposed hash, and irreversible append-only effect.

All five locale catalogs receive the identical `operator.policy` key tree with real translations. Existing keys are untouched. `en.d.json.ts` is regenerated only by the maintainer's approved next-intl workflow.

## Strict TDD and PostgreSQL evidence plan

Implementation is red-green-refactor at each boundary; no production file precedes its failing focused test.

1. **Contract gap tests:** first add tests demonstrating production binding and safe-diff requirements after the authoritative Story 1.3a resolution. Existing 1.3a tests remain unchanged and green.
2. **Schema/PostgreSQL RED:** against an isolated local Supabase/PostgreSQL instance, add pgTAP/integration tests for FK/check/unique/lineage constraints, exact role values, membership revocation, RLS and explicit Data API denial as `anon`/`authenticated`, append-only triggers, normal-runtime UPDATE/DELETE rejection, and audit safety. Do not claim these from mocked Drizzle tests.
3. **Concurrency RED:** use two independent PostgreSQL connections and barriers to race same-kind mutations, mutation vs revocation, and different kinds. Assert one same-predecessor winner, stale typed loser, deterministic commit order, no deadlock, and parallel different-kind progress.
4. **Atomicity RED:** transaction-level fault hooks available only to tests inject failure after membership authorization, release insertion, and audit staging. Query with a fresh connection after rollback to prove no orphan release/success audit. Also force audit constraint/trigger and commit failures.
5. **Service RED:** authorization/service tests use recording fakes for ordering and safe error mapping, proving every unauthorized identity performs zero policy queries/writes and forged actor data is ignored. These complement, never replace, PostgreSQL tests.
6. **Router RED:** test strict envelopes, independent authorization, safe serialization/error mapping, request bounds, and all anonymous/customer/project-admin/subscriber/revoked/authorized cases.
7. **UI RED:** Storybook/Vitest-browser stories and play tests cover loading, denial, empty/unavailable, valid/invalid review, confirmation, pending, conflict, success, failure, history, keyboard/focus, labels/errors/status announcements, narrow/high-zoom layout, non-color cues, and reduced motion. Manual real-browser WCAG verification is recorded because no standalone acceptance harness is established.
8. **Regression:** run the story's focused commands before full tests/typecheck/lint/architecture/structure/pre-push/diff checks. Record current outputs and Supabase/CLI versions. Check CLI `--help` and version before advisors; do not run the dev server or guess commands.

The real database harness location is proposed as `apps/backend/supabase/tests/operator_policy.test.sql`, invoked by a documented existing/maintainer-approved isolated Supabase test command. Since no harness currently exists, its exact invocation is a blocker to claiming pgTAP acceptance; a Bun integration driver in `packages/db/test/operator-policy.test.ts` may orchestrate concurrency/fault scenarios with real PostgreSQL but must not replace SQL privilege/RLS tests.

## Maintainer-only generation and operational workflow

After source schemas and exact CCRs are approved:

1. Maintainer verifies pinned Bun and Supabase/Drizzle CLI versions and reads command `--help`.
2. Maintainer runs the repository-approved `db:gen` workflow; the agent does not run it.
3. Maintainer records every emitted migration SQL, snapshot, and `meta/_journal.json` path; reviews for unrelated drift.
4. Maintainer adds/reviews the least-privilege RLS/revoke/grant, immutable trigger, lineage trigger, and advisory-lock SQL not expressible by Drizzle, then runs real PostgreSQL tests and database advisors.
5. Maintainer regenerates `apps/web/client/messages/en.d.json.ts` through the approved next-intl workflow and verifies five-catalog key parity.
6. If the workspace dependency changes `bun.lock`, only the maintainer produces/reviews the pinned-Bun result. No unrelated resolution is accepted.
7. Bootstrap/revocation follows `docs/runbooks/operator-policy-authority.md`: independently verify Andrew's exact UUID, pass it directly as an uncommitted parameter (never email lookup), lock membership, atomically change membership and append audit, verify result, and retain correlation evidence. The UUID is never committed or seeded/startup-managed.
8. Production mutation remains operationally blocked until AAL2 is required after MFA is available or owner risk acceptance is explicitly recorded outside runtime code.

## Proposed changed paths and governance classification

All paths must appear in `architecture/slices/1.3b.json` before runtime editing with capability `business-policy-operator`, owning runtime, role, and classification.

### New/Jagwar-owned paths

| Path | Classification | Role |
| --- | --- | --- |
| `architecture/slices/1.3b.json` | new | exact governed-path plan |
| `packages/db/src/schema/operator/index.ts` | new | membership and audit schema declarations |
| `packages/db/src/schema/business-policy/index.ts` | new | persistence public seam |
| `packages/db/src/schema/business-policy/release.ts` | new | immutable release declaration/constraints |
| `packages/db/test/operator-policy.test.ts` | new | real PostgreSQL integration/concurrency driver |
| `apps/backend/supabase/tests/operator_policy.test.sql` | new | pgTAP/RLS/privilege/trigger evidence |
| `apps/web/client/src/server/services/operator/authorization.ts` | new | fresh and lock-aware authorization |
| `apps/web/client/src/server/services/operator/authorization.test.ts` | new | authorization ordering/zero-access tests |
| `apps/web/client/src/server/services/business-policy/registry.ts` | new | production validator composition root |
| `apps/web/client/src/server/services/business-policy/releases.ts` | new | mapping, review, history, mutation transaction, typed errors |
| `apps/web/client/src/server/services/business-policy/releases.test.ts` | new | service behavior/fault/error tests |
| `apps/web/client/src/server/api/routers/business/index.ts` | new | business router composition |
| `apps/web/client/src/server/api/routers/business/policy.ts` | new | strict thin policy procedures |
| `apps/web/client/src/server/api/routers/business/policy.test.ts` | new | boundary authorization/envelope tests |
| `apps/web/client/src/app/operator/layout.tsx` | new | Server Component presentation guard |
| `apps/web/client/src/app/operator/page.tsx` | new | direct operator page |
| `apps/web/client/src/app/operator/policy-console.tsx` | new | minimal route-local client presentation |
| `apps/web/client/src/stories/OperatorPolicyConsole.stories.tsx` | new | interaction/accessibility browser states |
| `docs/runbooks/operator-policy-authority.md` | new | maintainer bootstrap/revocation/AAL2-risk runbook |

`policy-console.tsx` remains cohesive initially; split editor/history modules only if implementation proves independently changing responsibilities, and then update the manifest before editing.

### Protected original paths requiring exact approved resulting hashes

No current registry entry authorizes any row below. Candidate labels are historical planning references only, **not approvals**.

| Protected path | Historical candidate | Exact prerequisite |
| --- | --- | --- |
| `packages/db/src/schema/index.ts` | CCR-001 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/src/server/api/routers/index.ts` | CCR-004 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/src/server/api/root.ts` | CCR-005 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/package.json` | CCR-006 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/messages/en.json` | CCR-012 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/messages/es.json` | CCR-013 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/messages/ja.json` | CCR-014 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/messages/ko.json` | CCR-015 | new/superseding approved entry for this exact path and resulting SHA-256 |
| `apps/web/client/messages/zh.json` | CCR-016 | new/superseding approved entry for this exact path and resulting SHA-256 |

### Maintainer-generated protected paths

These are not agent-owned changes and cannot be named fully until generation emits them:

- new `apps/backend/supabase/migrations/<generated-name>.sql`;
- new `apps/backend/supabase/migrations/meta/<generated-number>_snapshot.json`;
- protected `apps/backend/supabase/migrations/meta/_journal.json` (historical candidate CCR-003; exact resulting-hash approval absent);
- protected generated `apps/web/client/messages/en.d.json.ts` (historical candidate CCR-017; exact resulting-hash approval absent);
- protected `bun.lock` if changed (historical candidate CCR-007; existing CCR-022 binds a different OD-15 hash/scope and does not authorize 1.3b).

The maintainer must add the exact emitted paths to the slice declaration and obtain required path/hash approvals before retaining generated changes. No design can prestate unknown generated filenames/hashes, and no candidate CCR is self-created or approved here.

## Dependency-ordered prerequisite governed SDD changes

Each prerequisite below is a separate proposed governed SDD change with its own proposal, specification, design, tasks, verification, path manifest, and approvals as applicable. The names are stable routing names, not created artifacts in this phase. A prerequisite may remain blocked until its named semantic owner decides the unresolved content; no downstream change may infer that decision.

| Order | Proposed stable change name | Owned capability | Depends on | Exact required outcome | Blocker resolved |
| --- | --- | --- | --- | --- | --- |
| 1 | `define-policy-release-lineage-and-initial-activation-semantics` | `business-policy` contract governance | none | Produce an authoritative, internally consistent contract for content identity versus release/event identity, rollback-as-new-release, duplicate-content handling, deterministic lineage, the first production release/expected-predecessor representation, and which failed or denied attempts are durably audited. It must update the normative requirements that currently conflict; this design does not choose the answers. | 1, 4, 6 |
| 2 | `add-production-business-policy-validator-contracts` | `business-policy` | prerequisite 1 for release/version semantics and separately approved product policy definitions | Define and expose the approved strict production schema version, validator, validator identifier, and inferred typed payload contract for each of the six closed kinds through the public `@onlook/business-policy` entry point. Fixture-only contracts remain non-production; route-local editor composition remains owned by 1.3b. Actual policy fields, limits, and values require product authority and are intentionally unspecified here. | 2 |
| 3 | `add-public-business-policy-safe-diff-computation` | `business-policy` | prerequisite 1 for identity/evidence semantics | Add a public deterministic bounded safe-diff computation contract compatible with Story 1.3a canonicalization and dangerous-key rules, with contract tests proving it emits hash/metadata evidence only. It must not add persistence or operator authority. | 3 |
| 4 | `establish-operator-policy-mutation-rate-limit-authority` | `business-policy-operator` | prerequisite 1 for closed mutation actions | Specify and implement or identify a durable, multi-instance-safe, capability-local mutation limiter with a closed action/key/window/limit contract and atomic consumption behavior. It must not reuse subscription, billing, entitlement, or usage authority and must add no external dependency unless separately authorized by changed requirements. | 5 |
| 5 | `establish-operator-policy-postgres-verification-harness` | `database-verification` for `business-policy-operator` | none; must complete before database implementation evidence | Establish the approved isolated local/hosted Supabase/PostgreSQL test command, test database lifecycle, pgTAP availability or equivalent real-SQL harness, least-privileged role credentials, two-connection concurrency orchestration, fault-injection seam, advisor invocation, and CI/maintainer evidence procedure. It must prove real PostgreSQL guarantees rather than mocks. | 7 |
| 6 | `decide-operator-production-authentication-assurance` | `operator-authority` governance | none; must complete before production activation, and before implementation only if the decision changes runtime requirements | Record the authoritative choice to require available Supabase AAL2 or explicitly accept ordinary-login risk, including the operational enablement gate. It must not be interpreted as MFA implementation or as risk acceptance unless the owner actually records that choice. | 9 |
| 7 | `align-1-3b-with-governed-prerequisite-contracts` | `business-policy-operator` SDD governance | prerequisites 1–5; prerequisite 6 if it changes runtime requirements | Apply only the approved prerequisite outcomes to the 1.3b proposal/specification/design, remove contradictions without weakening its safety outcomes, refresh exact affected paths and line forecast, and rerun the proposal/spec/design gates before tasks or implementation. | closes the specification-level effects of 1–7 |

Dependency rules:

- Prerequisite 1 is the semantic foundation for release persistence and must complete before production validator versioning, safe-diff evidence finalization, rate-limit mutation keys, or 1.3b data-model finalization.
- Prerequisites 2–5 may proceed in parallel only after their stated dependencies are satisfied; each remains separately reviewable and governed.
- Prerequisite 6 is an independent owner decision. Review/history design remains membership-authorized, but production activation stays operationally blocked until this gate is satisfied.
- Prerequisite 7 is the convergence gate. Story 1.3b tasks and runtime implementation remain prohibited until its revised proposal/spec/design pass and the architecture below is revalidated against those exact outputs.
- Exact CCRs are a subsequent governance gate, not an SDD prerequisite that this design can manufacture. After the converged design determines exact protected patches, the maintainer must obtain path-and-resulting-hash approvals and separately govern generated paths. Missing approvals continue to resolve blocker 8 only when actually present in `architecture/core-change-approvals.json`.

## Changed-line forecast and review slices

This change is **certain to exceed the 400 changed-line review budget**. Forecast excluding generated migration/snapshot/lock output:

- schemas, SQL tests, integration harness, runbook: 650–950 lines;
- authorization/registry/release services and tests: 850–1,250 lines;
- transport and tests: 250–400 lines;
- route UI, Storybook/accessibility tests: 500–800 lines;
- five locale additions, manifest, protected composition edits: 180–350 lines;
- **authored total: approximately 2,430–3,750 changed lines**, plus maintainer-generated output.

After all prerequisite changes and gates complete, the user-selected delivery approach is chained review slices (not independently deployable scope reductions):

1. converged 1.3b design, slice manifest, and confirmed exact protected-approval gate;
2. PostgreSQL schema sources + RED database tests + maintainer generation/security SQL;
3. authorization/registry/mappers + RED service tests;
4. serialized mutation algorithm + concurrency/fault tests;
5. thin router + boundary tests;
6. route-local UI/locales + browser accessibility tests;
7. protected registrations, generated declarations/lock as applicable, full regression and operational gate.

Each chained review targets 250–400 authored lines. If a cohesive invariant-bearing change cannot fit that target, implementation stops for explicit review reforecast rather than splitting an atomic transaction, weakening evidence, or hiding overflow. Database atomicity, release/audit commit, and end-to-end authorization are not weakened or split into partial product behavior; the route/router remains unregistered until the complete backend authority is ready. Implementation must not silently proceed merely because review slicing is possible.

## Rollout and rollback

- Apply and verify the additive database authority first; do not bootstrap membership or expose routes yet.
- Complete services, transport, UI, locales, real PostgreSQL evidence, and exact approvals before registering `businessRouter` and using `/operator` operationally.
- Maintainer bootstraps Andrew by exact UUID only after verification; no app startup seed.
- Keep production activation disabled operationally until AAL2 or explicit owner risk acceptance. Review/history still require active membership.
- Delivery rollback removes/disables additive route/router bindings through separately approved hashes but retains immutable releases/audit. Database retirement is a later maintainer-reviewed migration and must never rewrite/delete history.
- Product rollback is always a new validated release and is itself blocked by the identity contradiction below until corrected.

## Unresolved blockers

1. **Rollback contradicts required uniqueness.** The spec requires unique `(kind, schema_version, payload_hash)` and rejects duplicate logical identity, while also requiring rollback to create a new release containing historical validated content. That new row necessarily duplicates the historical tuple. Both cannot hold. The authority must choose a model (for example, content identity separate from release/event identity with non-unique reuse), but this design will not invent it.
2. **No production validators exist.** Actual Story 1.3a exports only a fixture validator. 1.3b requires exact public production validators for all six kinds and prohibits adding/changing production responsibility in that package. Typed editors, production registry, review, and activation cannot be implemented until an authoritative upstream change supplies the schemas/versions or explicitly changes scope.
3. **No public safe-diff computation exists.** Story 1.3a validates caller-supplied safe-diff evidence but does not compute a diff. 1.3b requires reuse of the public computation and prohibits duplication. An upstream public contract addition or corrected requirement is necessary.
4. **No initial production-release path is defined.** Review/required lookup treats no active release as unavailable, while activation requires an expected active release ID and mutation comparison. No allowed workflow can create the first production release. The specification must define an explicit null predecessor/bootstrap release contract without fallback, or provide a separately governed initial-release workflow.
5. **Required existing rate limiter is absent.** Repository search found no local request/mutation limiter suitable for operator operations; billing `rate_limits` are explicitly out of scope. The authority must allocate a capability-local implementation/persistence model or identify an exact existing primitive. Adding an invented in-memory limiter would be non-durable, multi-instance-unsafe, and fail the requirement.
6. **Audit failure/outcome semantics are underdefined.** The spec asks for closed actions/outcomes but also requires failed database/audit transactions to commit no successful-change event. It must clarify which denied/failed attempts, if any, are durably audited and how that can occur without violating atomic/no-effect rules.
7. **Real PostgreSQL harness command is absent.** A test location can be designed, but acceptance requires the maintainer to approve/document the isolated Supabase/pgTAP invocation and role credentials; no mock substitute is acceptable.
8. **Protected and generated approvals are absent.** None of the exact path/resulting-hash CCRs required for 1.3b exists in `architecture/core-change-approvals.json`. Unknown generated paths/hashes can only be recorded after maintainer generation.
9. **Authentication assurance operational gate is unresolved.** Production activation cannot be enabled until AAL2 is required or explicit owner risk acceptance is recorded. The design does not implement MFA or imply ordinary login is compromise-resistant.

The selected resolution is the prerequisite governed SDD sequence above. Until those changes produce approved outcomes and the exact protected/generated governance gates are satisfied, every blocker remains open. These are implementation blockers, not opportunities to weaken requirements, promote fixtures, create generic editors, use service-role authority, or absorb Story 7.2.
