---
story_key: 1-3a-immutable-policy-contract-and-deterministic-fixture-releases
epic: 1
story: 3a
title: Immutable Policy Contract and Deterministic Fixture Releases
baseline_commit: 287485c92ddd3e424f438081b42ebaf3e0d2e3dd
---

# Story 1.3a: Immutable Policy Contract and Deterministic Fixture Releases

Status: done

## Story

As a product operator,
I want immutable, reproducible business-policy contracts and deterministic non-production releases,
so that the first discovery slice can snapshot the exact policy input it evaluated without introducing unapproved production operator authority.

## Acceptance Criteria

1. **Closed policy and validator contract**
   - Given the supported policy domains,
   - when a validator is registered or selected,
   - then `PolicyKind` is a closed contract covering `qualification`, `discovery`, `outreach`, `activation`, `commercial`, and `retention`,
   - and an unknown kind, unsupported schema version, duplicate `(kind, schemaVersion)` registration, or invalid payload fails with specific structured issues and produces no release.

2. **Canonical validated payload and stable hash**
   - Given two JSON payloads that validate to the same policy value but use different object-key insertion order,
   - when they are canonicalized and hashed,
   - then their canonical UTF-8 representation and lowercase SHA-256 hash are identical,
   - array order remains significant, a material validated change changes the hash, and `(kind, schemaVersion, payloadHash)` is the stable logical release identity.

3. **Immutable release envelope and safe metadata**
   - Given a valid policy payload and release metadata,
   - when a release envelope is constructed,
   - then it records an opaque release ID, kind, schema version, canonical payload hash, validated payload, effective UTC time, deterministic actor/origin provenance, validation evidence, safe diff, and optional supersession linkage,
   - and the envelope, nested payload, and diff are runtime-immutable and cannot be altered by retaining or mutating source references.

4. **Dangerous and non-canonical input fails closed**
   - Given a policy payload containing unknown fields, secrets, executable values, SQL/code, raw or unvalidated provider payloads, `undefined`, `BigInt`, `Date`, symbols/functions, non-finite numbers, negative zero, or invalid Unicode,
   - when validation or canonicalization runs,
   - then the input is rejected with a stable error code/path,
   - and no release, hash identity, executable path, or silently stripped policy value is produced.

5. **Operation snapshot linkage is exact and fail-closed**
   - Given an operation evaluates policy,
   - when its policy snapshot reference is validated,
   - then the contract carries the exact `policyReleaseId`, policy kind, schema version, payload hash, and evaluated aggregate/input identity plus version,
   - and a missing/mismatched required release fails with an operator-actionable error and never falls back to browser constants or an implicit active policy.

6. **Deterministic non-production qualification fixtures**
   - Given the first discovery slice requests its fixture policy release,
   - when the fixture is resolved repeatedly,
   - then fixed payload, release ID, timestamp, origin, canonical form, hash, validation evidence, and safe diff are stable across runs,
   - and the release is explicitly marked `non-production`, contains no secret or real-person/provider payload, and exposes no promotion, activation, mutation, or privilege-bearing API.
   - The qualification payload schema in this story is fixture-only. It is not the later Leads-owned production qualification policy and makes no OD-5 weak-site-policy claim.

7. **Pure public package boundary**
   - Given consumers need the policy contract or fixture,
   - when they import it,
   - then `@onlook/business-policy` exposes the intentional public API from `src/index.ts`,
   - and the package imports no application-private code, React/Next, tRPC, Supabase/Drizzle, Stripe, editor state, provider SDK, secrets, Node-only hashing API, or another workspace private `/src/*` path.

8. **Protected baseline and Story 1.3b remain untouched**
   - Given this is the contract/fixture slice,
   - when implementation completes,
   - then all runtime changes are new Jagwar-owned package files declared in the 1.3a slice manifest,
   - no protected baseline, generated artifact, migration, lockfile, database/web integration, operator route/UI, role/privilege, create/review/activate/supersede flow, or runtime policy mutation is changed,
   - and Story 1.3b remains blocked on OD-13 and its separately approved target-native operator surface.

## Tasks / Subtasks

- [x] Declare the dependency-safe 1.3a slice and package boundary (AC: 7, 8)
  - [x] Add `architecture/slices/1.3a.json` first, listing every new package path with capability `business-policy`, reusable-package ownership, classification, and precise role.
  - [x] Add `packages/business-policy/package.json`, `tsconfig.json`, and `eslint.config.js` by following neighboring Onlook package conventions; use existing Zod/tooling only and do not modify the root manifest or lockfile.
  - [x] Add `src/index.ts` as the intentional public entry point; do not create DB, web-service, API, UI, operator, or durable-operation runtime files.

- [x] Specify release/registry/canonicalization behavior with failing tests (AC: 1-5)
  - [x] Add RED tests in `packages/business-policy/test/release.test.ts` for closed kinds, exact validator lookup, duplicate registry rejection, structured invalid-payload errors, canonical golden values, key-order equivalence, array-order significance, hash changes, invalid JSON values/Unicode, safe diff, deep immutability, envelope consistency, and snapshot mismatch/missing-release failure.
  - [x] Confirm the focused tests fail before implementation and record the RED command/result in the Dev Agent Record.
  - [x] Implement the minimum generic contract in `src/release.ts`, using strict Zod validation, RFC 8785-compatible canonical JSON rules, runtime-neutral Web Crypto SHA-256, defensive canonical cloning, and deep freezing.
  - [x] Keep release creation/validation pure: no active-policy lookup, persistence, clock/ID generation, environment read, operator authorization, or side effects.

- [x] Specify deterministic non-production fixtures with failing tests (AC: 4, 6)
  - [x] Add RED tests in `packages/business-policy/test/fixtures.test.ts` for stable fixture identity/hash/canonical form across calls, explicit non-production scope, fixed provenance/time, nested immutability, secret/provider/real-person-data exclusion, missing fixture failure, and absence of production mutation exports.
  - [x] Confirm the focused fixture tests fail before implementation and record the RED command/result.
  - [x] Implement `src/fixtures.ts` with a minimal fixture-only qualification schema and deterministic release data; keep the generic registry open to capability-owned public validators without claiming this fixture schema is production authority.

- [x] Verify acceptance criteria and architecture without expanding scope (AC: 1-8)
  - [x] Run focused package tests, package typecheck, package lint, full `bun test`, repository typecheck, `bun scripts/architecture/check.ts --changed`, architecture checker/placement tests, and `git diff --check`.
  - [x] Run `bun install --frozen-lockfile` only as a non-mutating verification. If the new workspace requires a lock update, record the maintainer-only CCR-007/hash-registry follow-up; do not edit `bun.lock` and do not misreport frozen-install readiness.
  - [x] Confirm the public exports contain no Story 1.3b mutation/authorization functions and every changed governed path is declared by `architecture/slices/1.3a.json`.

### Review Findings

- [x] [Review][Patch] Enforce runtime `PolicyKind` closure and structured registry errors.
- [x] [Review][Patch] Reject validators that strip, coerce, or transform policy input silently.
- [x] [Review][Patch] Reject accessors, symbol keys, non-enumerable data, and array extensions without executing caller code.
- [x] [Review][Patch] Reject compound secret, credential, SQL, code, script, and raw/provider-payload key families.
- [x] [Review][Patch] Strictly validate origin and safe-diff metadata, duplicate paths, and root hash evidence.
- [x] [Review][Patch] Defensively validate and clone custom registry results without freezing caller data.
- [x] [Review][Patch] Strictly validate, compare, clone, and freeze complete snapshot evidence.
- [x] [Review][Patch] Report the requested missing fixture kind accurately.
- [x] [Review][Patch] Reject ambiguous duplicate policy release identifiers.
- [x] [Review][Patch] Reject custom validator payload substitution with canonical input/output evidence.
- [x] [Review][Patch] Reject stripping and passthrough object schemas at registry composition time.
- [x] [Review][Patch] Close normalized dangerous-key families across separators and compound names.
- [x] [Review][Patch] Validate canonical safe-diff pointers and bind every after hash to its payload path.
- [x] [Review][Patch] Reject contradictory safe-diff evidence, including unchanged changes and root removal.
- [x] [Review][Patch] Require exact evaluated-input evidence for every operation snapshot assertion.
- [x] [Review][Patch] Normalize validator exceptions into stable structured contract issues.
- [x] [Review][Patch] Lazily construct and cache deterministic fixture releases.
- [x] [Review][Patch] Enforce the runtime policy-kind closure before fixture lookup.
- [x] [Review][Patch] Support short registry versions with registry-specific validation errors.
- [x] [Review][Patch] Freeze the exported policy-kind vocabulary at runtime.
- [x] [Review][Patch] Reject opaque lazy schemas that cannot prove strict object boundaries.
- [x] [Review][Patch] Require genuine Zod validators and normalize complete safe-parse results.
- [x] [Review][Patch] Reject authorization, bearer, passwd, and JWT credential-key families.

## Dev Notes

### Scope and architecture boundary

- This story implements the approved Correct Course 1.3a slice, not the parent story's operator activation behavior. Story 1.3b plus Story 7.2 owns create/review/activate/supersede behavior only after OD-13 defines the real operator role, authorization, surface placement, service/UI seams, protected paths, and regression boundary.
- Runtime owner: reusable pure capability package `@onlook/business-policy`. Capability: business-policy. Role: stable release, validator-registry, canonicalization/hash, snapshot-link, and deterministic fixture contracts.
- Dependency direction: future Leads/outreach/activation capabilities publish validators into the generic registry contract; future durable-operation code consumes the public policy snapshot reference. This package must not import those future packages or application/private runtime code.
- The fixture-only qualification schema is an explicit temporary non-production proof owned by this slice. The later Leads/qualification owner must publish the production schema and deliberately handle fixture compatibility; 1.3a must not encode approved weak-site thresholds or provider routing.
- Do not add persistence as unreachable leaf files. `packages/db/src/schema/business-policy/*`, the protected DB aggregate, generated migration, and web release service are later integration work after narrowly hash-registered CCRs and maintainer generation exist.

### Canonicalization and contract requirements

- Accept JSON data only. Recursively sort object keys by raw UTF-16 code-unit order, preserve array order, emit no insignificant whitespace, and serialize primitives with ECMAScript JSON rules. Reject lone surrogates, negative zero, non-finite numbers, sparse/unsupported values, and non-plain objects before hashing.
- Hash the exact UTF-8 canonical payload bytes with SHA-256 and encode lowercase hexadecimal. Use the runtime-neutral `crypto.subtle.digest`; do not import `node:crypto`, Bun-only hashing, app-local hash helpers, or a new hashing dependency.
- Validators are selected by exact `(kind, schemaVersion)`. Registry composition rejects duplicate keys rather than allowing last-write-wins. Validation must be strict: unknown payload keys are errors, not stripped data.
- Capability-owned strict validators define semantic constraints for allowed string values. The generic canonicalizer rejects dangerous key families and non-JSON/executable values, but deliberately does not guess whether arbitrary prose is SQL, code, provider data, or a credential through content scanning.
- Release construction takes explicit ID, time, provenance, payload, safe diff, and supersession metadata. It must not invent actor authority, read the current time/environment, or activate anything.
- Safe diff records paths/change classifications and hashes or bounded metadata, never raw secret-like values. Deep-freeze the canonical clone and all nested envelope structures.
- Operation snapshot linkage is a value contract only. It does not implement admission, persistence, an active-policy query, or the durable-operation state machine.

### Protected-core stop conditions

- The machine registry `architecture/core-change-approvals.json` currently contains CCR-019 through CCR-025 only. Planning prose that calls CCR-001/003/006/007 approved does not supply the exact resulting path hashes required by governance.
- Do not edit `packages/db/src/schema/index.ts`, `apps/web/client/package.json`, `bun.lock`, migration journals/snapshots, or any other pinned-baseline path. The bundled planning scopes also cover three capability packages and cannot be partially consumed for 1.3a.
- Do not run `db:gen`. Do not hand-edit or generate a lockfile. If protected registration becomes essential, halt for a new narrow exact-path CCR and resulting approved hash rather than expanding the story.
- Preserve all pre-existing dirty/untracked work. Re-check every proposed path against baseline `423e2e924366419e418ee049093872d535eea41a` before editing.

### Testing requirements

- Use Bun's built-in TypeScript test runner (`bun:test`) and test public behavior through `@onlook/business-policy` or its package public entry point where resolution allows.
- Tests must prove rejected inputs produce no releasable object/hash and must exercise the real public boundary, not only internal helpers.
- Include golden canonical JSON/hash values, not only equality between two calls. Include nested keys, Unicode, array order, source-reference mutation, attempted output mutation, registry collision, hash mismatch, policy metadata mismatch, and missing fixture cases.
- Full-suite or typecheck failures caused by documented pre-existing dirty work must be separated from story-caused failures with evidence; story-caused failures must be fixed.

### Previous-story and Git intelligence

- Story 1.1 established that global/versioned policy releases are not customer-owned commercial rows and that scaffolding must wait for a real consumer. Do not add `user_id`, a fake Workspace, or protected aggregators merely to make a future path visible.
- Story 1.4a established that rejected cases must prove no protected work, deterministic evidence must be retained, and fallback architecture is not acceptable.
- Recent architecture commits established the pinned-baseline ratchet and exact slice-manifest enforcement. The current worktree contains unrelated planning/skill/untracked changes; preserve them and keep the File List story-specific.

### Latest technical constraints

- The repository pins Bun `1.3.1`, TypeScript through `@onlook/typescript`, and Zod `^4.1.3`; do not upgrade or add dependencies. Use `z.strictObject()`/equivalent strict behavior so policy fields are never silently discarded.
- RFC 8785 defines deterministic recursive property ordering, array-order preservation, no inter-token whitespace, and ECMAScript primitive serialization for canonical JSON. Its verified errata warns that negative zero should be rejected before canonicalization because it serializes as zero.
- Bun's test runner natively executes TypeScript and uses the Jest-compatible `bun:test` API already used by the repository.

### Project Structure Notes

- New runtime paths are limited to `packages/business-policy/**`; the package is allocated by `architecture/policy.json` and `PATH-LEDGER.md` as a focused capability package.
- Add exactly one slice manifest at `architecture/slices/1.3a.json`. No current runtime source file needs updating for the package-only slice.
- Future, out-of-scope allocated seams are `packages/db/src/schema/business-policy/*` and `apps/web/client/src/server/services/business-policy/releases.ts`. Their existence in the path ledger is not implementation permission.

### References

- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md` §4.3 and §5]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md` Story 1.3]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md` AD-1, AD-4, AD-5, AD-15]
- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/PATH-LEDGER.md` Focused capability packages]
- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/FIRST-SLICE-CORE-CHANGE-REQUESTS.md` CCR-001, CCR-003, CCR-006, CCR-007]
- [Source: `architecture/core-change-approvals.json`]
- [Source: `architecture/policy.json`]
- [Source: `docs/architecture-governance.md`]
- [Source: `docs/file-placement.md`]
- [Source: `_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md`]
- [Source: `_bmad-output/implementation-artifacts/1-4a-prove-pinned-durable-substrate.md`]
- [Source: RFC 8785 JSON Canonicalization Scheme and verified errata]
- [Source: Zod 4 official strict-object documentation]
- [Source: Bun official test-runner documentation]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Implementation Plan

- Establish the governed package boundary before runtime code.
- Drive the generic release/registry/canonicalization/snapshot contract from public behavioral tests.
- Add only a fixture-scoped qualification validator and immutable synthetic release.
- Verify the entire repository and preserve protected/maintainer-only files unchanged.

### Debug Log References

- 2026-07-29 boundary validation: `bun scripts/architecture/check.ts --changed` reported 0 errors and 0 warnings; `git diff --check` passed.
- 2026-07-29 release RED: `bun test packages/business-policy/test/release.test.ts` failed before implementation because the public contract modules did not exist (0 passed, 1 failed/1 loader error).
- 2026-07-29 release GREEN: focused release contract suite passed 18/18; package typecheck passed.
- 2026-07-29 fixture RED: `bun test packages/business-policy/test/fixtures.test.ts` failed before implementation because the public fixture functions did not exist (0 passed, 1 failed/1 loader error).
- 2026-07-29 fixture GREEN: fixture suite passed 5/5; combined package suite passed 23/23; package lint and typecheck passed.
- 2026-07-29 final regression: focused package suite passed 24/24; full repository suite passed 1,107 with 1 skipped and 0 failed; web-client typecheck, package lint/typecheck, architecture tests (10/10), and `git diff --check` passed.
- 2026-07-29 architecture result: 0 errors and 1 advisory warning for cohesive `packages/business-policy/src/release.ts` at 510 lines. The approved path ledger intentionally assigns the closed kinds, registry, canonical serializer/hash, release envelope, and snapshot linkage to this one invariant-heavy contract file; no split was introduced merely for line count.
- 2026-07-29 frozen-lock verification: `bun install --frozen-lockfile` exited 1 because the new workspace needs a lock update. `bun.lock` remained unchanged at SHA-256 `3eb968f875ad965240e3c2f0b89b350834e0feedf869d050b70775c0fa16d02c`; maintainer-only CCR-007 generation and exact hash-registry approval remain follow-up work.
- 2026-07-29 review remediation RED: expanded public-boundary tests failed 15 cases across the nine accepted review patch groups before fixes.
- 2026-07-29 review remediation GREEN: package tests passed 40/40; package lint/typecheck passed; full repository suite passed 1,123 with 1 skipped and 0 failed; web-client typecheck and `git diff --check` passed.
- 2026-07-29 post-remediation architecture result: 0 errors and 2 advisories for cohesive `release.ts` contract/canonicalization code and its comprehensive public contract test. Both are invariant-heavy artifacts explicitly allocated to this package; the warnings are retained for fresh review rather than hidden by scope-expanding file churn.
- 2026-07-29 round-two remediation RED: 15 focused failures proved the accepted payload-substitution, passthrough-schema, dangerous-key, safe-diff, snapshot, registry-version, fixture-kind, and vocabulary-mutation gaps before implementation.
- 2026-07-29 round-two remediation GREEN: package tests passed 52/52; package lint/typecheck passed; full repository suite passed 1,135 with 1 skipped and 0 failed; web-client typecheck and `git diff --check` passed.
- 2026-07-29 round-two architecture result: the 1.3a slice retains only the two reviewed cohesive-file advisories. The gate's sole error is an unrelated pre-existing `.gitignore` edit (`.atl/`) outside this story; it was preserved and not attributed to 1.3a.
- 2026-07-29 final-review remediation RED: 8 focused failures proved the accepted lazy-schema, fake-validator, and credential-alias gaps before implementation.
- 2026-07-29 final-review remediation GREEN: package tests passed 60/60; package lint/typecheck passed; full repository suite passed 1,143 with 1 skipped and 0 failed; web-client typecheck and `git diff --check` passed.
- 2026-07-29 final architecture result: the gate's only error remains the unrelated protected `.gitignore` edit; the two cohesive contract/test size advisories remain intentional. `bun.lock` remained unchanged at SHA-256 `3eb968f875ad965240e3c2f0b89b350834e0feedf869d050b70775c0fa16d02c`.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Declared the exact package-only 1.3a slice and created the focused public package boundary without touching protected or generated files.
- Implemented the closed validator registry, strict canonical JSON/SHA-256 contract, deeply immutable release envelope and safe diff, and exact fail-closed operation snapshot reference.
- Added a stable, synthetic, deeply frozen non-production qualification fixture release with no activation, promotion, authorization, or mutation API.
- Satisfied all eight acceptance criteria without persistence, web integration, protected-core edits, generated artifacts, or Story 1.3b operator controls.
- Retained one explicit handoff: the maintainer must generate and hash-register the bounded workspace lock update before frozen-install readiness can be claimed.
- Resolved all nine valid round-one review groups with runtime-strict, non-executing, defensive validation and 16 additional regression tests; no Story 1.3b surface or protected path was introduced.
- Resolved all eleven valid round-two review groups with strict schema composition, canonical validator equivalence, path-bound safe-diff evidence, mandatory operation input matching, lazy fixtures, and 12 additional regression tests.
- Resolved all three valid final-review patch groups and documented the capability-validator ownership decision for semantic string constraints. Per user direction, no fourth review was started.

### File List

- `architecture/slices/1.3a.json` (new)
- `packages/business-policy/package.json` (new)
- `packages/business-policy/tsconfig.json` (new)
- `packages/business-policy/eslint.config.js` (new)
- `packages/business-policy/src/index.ts` (new)
- `packages/business-policy/src/release.ts` (new)
- `packages/business-policy/src/fixtures.ts` (new)
- `packages/business-policy/test/release.test.ts` (new)
- `packages/business-policy/test/fixtures.test.ts` (new)

## Change Log

- 2026-07-29: Created dependency-safe Story 1.3a with an explicit package-only contract/fixture boundary and Story 1.3b exclusions.
- 2026-07-29: Implemented and verified immutable business-policy contracts, exact operation snapshots, and deterministic non-production qualification fixtures; moved story to review.
- 2026-07-29: Applied all nine valid round-one adversarial review patch groups and reran focused/full validation.
- 2026-07-29: Applied all eleven valid round-two adversarial review patch groups and reran focused/full validation.
- 2026-07-29: Applied all three valid final-review patch groups, completed verification, and marked Story 1.3a done without starting a fourth review.
