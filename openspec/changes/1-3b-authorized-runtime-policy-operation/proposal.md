# Proposal: Authorized Runtime Policy Operation

## Change

`1-3b-authorized-runtime-policy-operation`

## Status

Proposed for native SDD planning. This proposal is derived from the authoritative Story 1.3b requirements and does not authorize implementation, protected-core edits, generated-file changes, production activation, or commits.

## Intent

Provide a restricted, server-authorized `/operator` surface through which the approved product operator can review, immediately activate, supersede, and roll back validated production business policies. The result must make qualification, discovery, outreach, activation, commercial, and retention policy changes reproducible and auditable without granting arbitrary administration authority or weakening the immutable Story 1.3a policy contract.

The change introduces the minimum application, persistence, transport, and route-local UI boundaries needed to operate policy releases safely. Authorization remains distinct from authentication, project roles, subscriptions, billing, and existing administrative mechanisms.

## Authoritative requirements and dependencies

- Authoritative source: `_bmad-output/implementation-artifacts/1-3b-authorized-runtime-policy-operation.md`.
- Depends on Story 1.3a and its public `@onlook/business-policy` contract, validators, canonicalization/hash, release construction, safe diff, and snapshot assertions.
- Depends on the approved OD-13 operator-authority decision in `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/OD-13-OPERATOR-AUTHORITY.md`.
- Paired scope remains Story 7.2; this change must not absorb that story's responsibilities.
- The pinned Onlook baseline is `423e2e924366419e418ee049093872d535eea41a`.
- Existing Story 1.3a work and unrelated modified/untracked work must be preserved.

## Proposed scope

### 1. Operator authority and audit persistence

Introduce server-side operator membership tied to an existing Supabase Auth `users.id`, with a closed `operator` role, grant provenance, and revocation state. Introduce append-only audit history for bootstrap, revocation, activation, supersession, and rollback outcomes.

Authorization will use a fresh server-side membership lookup. Sensitive transactions will lock and recheck membership so revocation and policy mutation have deterministic commit order. RLS, explicit Data API privilege denial, database constraints, and reviewed append-only enforcement will provide defense in depth; direct-server authorization remains mandatory because Drizzle does not inherit the request user's RLS context.

Initial operator bootstrap and revocation are maintainer-run operational actions. Andrew's exact confirmed Supabase UUID must be used directly, never inferred from email, committed, seeded at startup, or exposed through a membership-management UI/API.

### 2. Immutable production policy releases

Add application-owned persistence for immutable production releases covering the existing closed policy kinds and exact schema versions. Persist canonical payload/hash, logical identity, actor, database/server time, validation evidence, bounded safe diff, supersession lineage, and correlation evidence.

Release identity must be unique by `(kind, schema_version, payload_hash)`. Active selection must be deterministic by `(effective_at, release_id)`, predecessor relationships must remain valid, and history must not be updated or deleted by runtime roles. Persistence schemas will use database primitives/JSON and must not import `@onlook/business-policy`; exact public-contract mapping belongs in the web application service.

### 3. Least-privileged application boundary

Compose operator procedures from `protectedProcedure`, then independently authorize every policy request through the new operator authorization service. The existing `adminProcedure` must remain untouched and unused, and no service-role Supabase client may be introduced into this path.

Add an application registry that binds production `(kind, schemaVersion)` pairs to the exact public Story 1.3a validators. Missing, duplicate, unknown, fixture-only, or non-production bindings fail closed. Review remains in-memory and non-persistent. Activation, supersession, and rollback-as-new-release execute as short, network-free transactions that:

1. reauthorize and lock the operator membership;
2. serialize changes by policy kind;
3. reread and compare the expected active release;
4. strictly revalidate and canonicalize the payload;
5. insert one immutable release and one audit event atomically; and
6. return typed safe success, conflict, or failure results.

Request, payload, and diff sizes must be bounded, and operator mutations must use existing local rate-limiting primitives without adding dependencies.

### 4. Thin transport and direct operator route

Add a `business.policy` tRPC surface with strict Zod transport envelopes and thin delegation to authorization/application services. Add a guarded direct `/operator` route using the existing app shell, `@onlook/ui`, Tailwind, dark theme, and `next-intl`.

The route will expose typed editors only for registered production validators and present validation evidence, canonical hash, safe diff, actor/time, active and supersession state, history, confirmation, denial, conflict, pending, and success states. It must meet WCAG 2.2 AA expectations for keyboard order, focus, labels, error association, announcements, zoom, responsiveness, non-color cues, and reduced motion.

The Server Component layout may use the same authorization service for presentation, but route visibility never grants authority; each tRPC procedure remains authoritative.

### 5. Verification

Verification must cover real authorization boundaries, fresh revocation, fail-closed behavior, PostgreSQL constraints and privileges, append-only history, concurrency, stale expected-release conflicts, atomic release/audit writes, rollback lineage, fault-injected rollback, strict validation, inaccessible fallback paths, route interaction/accessibility states, locale parity, and existing product regressions.

Database authority, RLS, locking, constraints, and transaction atomicity require real PostgreSQL integration/pgTAP evidence; mocked Drizzle tests are not sufficient. Focused checks run before the full applicable regression matrix from the story. The dev server must not be run, and current results must be recorded rather than inherited from Story 1.3a.

## Acceptance criteria preserved

1. **Approved operator only:** Anonymous users, ordinary customers, project owners/admins, subscribers, and revoked operators cannot access `/operator` or policy procedures. Only an authenticated Supabase `user.id` with active server-side operator membership proceeds. Email, browser state, metadata, subscription, project role, route visibility, and `adminProcedure` grant no authority.
2. **Fresh, server-derived, fail-closed authorization:** Missing sessions, missing/revoked memberships, unknown roles/actions, lookup failures, and browser-supplied actor identities are denied before policy reads or writes without membership/release enumeration. Sensitive transactions lock and recheck membership.
3. **Strict, non-mutating review:** Review selects the exact public `(kind, schemaVersion)` validator, validates strictly, canonicalizes, computes SHA-256 identity, and returns bounded safe diff/evidence without persisting a draft or exposing arbitrary SQL, code, secrets, prompts, provider payloads, or generic database/JSON capabilities.
4. **Immediate, immutable, atomic activation:** A valid payload and expected active release produce one immutable production release and one audit event in a short serialized transaction after reauthorization and revalidation. Actor UUID, server time, schema version, canonical payload/hash, safe diff, supersession, correlation ID, and validation evidence are retained.
5. **No silent concurrent overwrite:** Competing mutations from the same expected release yield at most one deterministic active release; stale requests receive a typed refresh-required conflict rather than last-write-wins behavior.
6. **History-preserving supersession and rollback:** Replacement and restoration create new immutable releases that supersede the current release. Historical releases, audit events, snapshots, and already-admitted operations remain unchanged and traceable.
7. **No effects without valid authority:** Unknown kinds/versions, missing validators, invalid/dangerous/oversized payloads, non-production fixtures, hash mismatches, stale predecessors, audit failures, and database failures return typed safe errors with no committed release or successful-change audit and no fixture/environment/latest-row/provider/usage/billing fallback effect.
8. **Append-only safe audit:** Bootstrap, revocation, activation, supersession, and rollback record server-derived actor/bootstrap type, closed action/outcome, prior/new references, kind, schema version, payload hash, safe diff, correlation ID, and database time. Runtime roles cannot update/delete history or access credentials, authorization headers, unrestricted payloads, provider data, or unnecessary customer data.
9. **Target-native accessible experience:** `/operator` uses the existing target-native shell and UI stack without recreating `apps/admin`, and meets the specified WCAG 2.2 AA interaction and presentation requirements.
10. **Regression preservation:** Existing authentication, customer routes, projects/editor, AI, publishing/domains, subscription/billing/usage, tRPC routers, locales, packages, and Story 1.3a tests remain unchanged in behavior. `@onlook/business-policy` gains no production mutation or authorization responsibility.

## Scope boundaries and non-goals

This first slice does **not** include:

- persisted drafts or scheduled activation;
- runtime operator-membership management UI/API;
- global navigation, top-bar, route-constant, root/app/project layout, shared UI primitive/token/icon/style changes;
- recreation or reuse of `apps/admin`;
- arbitrary JSON, SQL, prompt, provider-payload, credential, database, or generic admin consoles;
- email- or metadata-derived authority, service-role authorization, `adminProcedure` changes, or MFA implementation;
- customer/workspace ownership for global operator memberships or policy releases;
- changes to project access, products, prices, subscriptions, checkout, rate limits, allowances, usage, billing, entitlements, AI/editor, publishing, providers, or job systems;
- a generic shared/common package, story-number runtime directory, external dependency, dependency upgrade, root manifest/environment change, or `trpc.ts` change;
- duplication, deep import, or weakening of Story 1.3a contract behavior;
- promotion of Story 1.3a non-production fixtures;
- cleanup of unrelated architecture advisories, worktree changes, or the unrelated `.gitignore` CCR error.

AAL2 is not added by this story. Before production activation, Supabase AAL2 must be required after MFA becomes available or the owner must explicitly accept the ordinary-login risk; implementation must not claim compromise-resistant authentication otherwise.

## Affected areas

Expected implementation planning areas, subject to slice-manifest and CCR authorization, are:

- new operator and business-policy database schema modules;
- new operator authorization and policy release application services;
- new `business.policy` tRPC router modules;
- new direct `/operator` route and smallest cohesive route-local client console;
- additive database schema/router/package exports and router registration;
- additive, parity-preserving locale namespaces;
- boundary, service, router, database integration/pgTAP, Storybook/browser, accessibility, and regression tests;
- architecture slice declaration `architecture/slices/1.3b.json` before runtime editing;
- maintainer-run bootstrap/revocation documentation and generated-artifact workflow.

Dependency direction must remain `/operator` UI -> `business.policy` tRPC -> operator authorization/business-policy service -> public policy contract and public DB authority. New server modules remain server-only; client code receives only serializable safe projections.

## Protected-core and generated-file stops

This proposal is not a Core Change Request and grants no protected-file permission.

Before any runtime editing, `architecture/slices/1.3b.json` must declare every governed path, capability `business-policy-operator`, owning runtime, role, and exact new/protected classification. Every protected UPDATE path requires its own exact resulting path/hash-bound approval in `architecture/core-change-approvals.json`. Planning candidates CCR-001/003/004/005/006/007 and CCR-012-017 are not authorization; the current CCR-019 through CCR-025 entries do not substitute for missing exact approvals.

Protected candidates include additive updates to:

- `packages/db/src/schema/index.ts`;
- `apps/web/client/src/server/api/routers/index.ts`;
- `apps/web/client/src/server/api/root.ts`;
- `apps/web/client/package.json`;
- `apps/web/client/messages/{en,es,ja,ko,zh}.json`.

The following remain maintainer-only generated authorities:

- database migration files, snapshots, and journal metadata produced by `db:gen`;
- `apps/web/client/messages/en.d.json.ts` generated by the approved typed-message workflow;
- `bun.lock` and any dependency resolution output.

Agents must not run `db:gen`, hand-edit generated migration metadata or typed message declarations, edit `bun.lock`, create or self-approve CCRs, or proceed past a missing exact protected-core approval. The maintainer must generate and review exact outputs, then separately review any grants, RLS, append-only, or advisory-lock SQL Drizzle cannot express.

## Risks and mitigations

- **Privilege escalation or stale authorization:** Use server-derived UUID membership only, fresh checks, transaction rechecks/locks, closed permissions, and non-enumerating errors.
- **Concurrent overwrite or ambiguous active state:** Serialize by kind, require expected active release, enforce database uniqueness/lineage constraints, and return typed conflicts.
- **Partial release/audit persistence:** Keep mutation transactions short and network-free; atomically commit exactly one release and audit event; prove rollback with fault injection.
- **Sensitive-data leakage:** Strictly validate/canonicalize, bound safe diffs, use safe projections/errors/audit evidence, and prohibit generic consoles and raw provider/customer data.
- **Contract drift:** Reuse public Story 1.3a exports only and round-trip exact contracts in application mappers.
- **Database authority misconfiguration:** Apply RLS, explicit privilege revocation, immutable constraints/triggers, and real PostgreSQL verification rather than mock-only claims.
- **Protected-core or generated-file overreach:** Stop on every unapproved protected path and reserve all generated outputs for the maintainer workflow.
- **Authentication-strength overclaim:** Gate production activation on future AAL2 or explicit owner risk acceptance.
- **Regression or accidental scope expansion:** Keep all updates additive and route-local, preserve the locked stack, add no dependency, and run focused plus full regressions.
- **Review-budget pressure:** The implementation spans database, service, transport, UI, locales, governance, and tests and is likely to exceed a 400 changed-line review window. Plan reviewable implementation slices without weakening atomic end-to-end delivery, and keep protected/generated work as explicit maintainer gates.

## Rollback strategy

### Product operation rollback

A production policy rollback never mutates history. An authorized operator selects validated historical content and creates a new immutable release that supersedes the current release, subject to the same fresh authorization, expected-active check, validation, serialization, audit, and atomicity rules as activation.

### Delivery rollback

Before production use, disable or remove the additive `/operator` route/router registration and new runtime bindings through separately authorized changes while retaining immutable release and audit evidence. Do not delete or rewrite historical rows. Database objects and privileges may be retired only through a maintainer-reviewed migration with exact protected/generated approvals. Existing customer, project, billing, provider, and Story 1.3a behavior must remain unaffected throughout rollback.

## Success criteria

The change is successful when:

- all ten acceptance criteria above are demonstrated with current evidence;
- only Andrew's active, exact UUID-backed operator membership can reach policy data or mutate releases, until a separately governed membership change occurs;
- unauthorized, revoked, stale, invalid, unavailable, oversized, failed, and concurrent paths prove zero prohibited effects;
- review is strict, safe, bounded, and non-persistent;
- activation, supersession, and rollback produce immutable, deterministic, atomic release/audit history;
- PostgreSQL integration evidence proves RLS/Data API denial, constraints, append-only enforcement, locks/concurrency, rollback, and runtime UPDATE/DELETE rejection;
- `/operator` is target-native, localized with catalog parity, and WCAG 2.2 AA across required states;
- Story 1.3a contract tests and all applicable product regressions remain green with no fallback architecture or new production authority in the contract package;
- every protected update has an exact hash-bound CCR, every generated output is maintainer-produced/reviewed, and no forbidden or unrelated file is changed;
- no implementation is committed by this planning phase.

## Proposal question round

Interactive questions were not posed because this delegated phase runs in auto mode and the story is authoritative. No answer may broaden or override the story. The following non-blocking confirmations are recorded for maintainer review before implementation planning is finalized:

1. Confirm that production activation remains operationally blocked until either Supabase AAL2 is available and required or explicit owner risk acceptance is recorded, while review/history access continues to follow the story's operator-membership rules.
2. Confirm that a policy kind with no active production release is represented as an unavailable/empty state and never falls back to a fixture, environment value, or implicit latest row.
3. Confirm that the 400 changed-line review budget should be handled through reviewable implementation slices and maintainer gates, without splitting the atomic end-to-end release/audit outcome or moving generated/protected work into agent ownership.

Current proposal assumptions are exactly the story defaults: Andrew-only initial membership by exact Supabase UUID; direct `/operator`; no global navigation; in-memory preview; immediate activation; rollback as a new immutable release; no runtime membership management; and strict reuse of Story 1.3a public contracts. Corrections require updating the authoritative requirements before they alter this proposal.
