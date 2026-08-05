---
story_id: 1.3b
story_key: 1-3b-authorized-runtime-policy-operation
title: Authorized Runtime Policy Operation
status: ready-for-dev
created: 2026-07-29
updated: 2026-07-29
pinned_onlook_baseline: 423e2e924366419e418ee049093872d535eea41a
depends_on:
  - Story 1.3a
  - OD-13 operator authority approval
paired_scope:
  - Story 7.2
---

# Story 1.3b: Authorized Runtime Policy Operation

Status: ready-for-dev

> **Protected-core stop:** This story is ready as an implementation context. Andrew approved the OD-13 role and placement defaults, but that approval does not authorize protected baseline edits. Before changing any protected UPDATE path listed below, obtain its exact hash-bound Core Change Request. Agents must not run `db:gen`, edit generated migration metadata, or edit `bun.lock`.

## Story

As a product operator,
I want to review, activate, supersede, and roll back validated business policies through a restricted Jagwar surface,
so that qualification, outreach, activation, and limits remain reproducible without granting arbitrary administrative authority.

## Acceptance Criteria

1. **Only the approved operator can access the surface**

   **Given** an anonymous user, an ordinary authenticated customer, a project owner/admin, a subscriber, a revoked operator, or Andrew's active operator membership  
   **When** `/operator` or any business-policy operator procedure is requested  
   **Then** only the authenticated Supabase `user.id` with an active server-side operator membership proceeds  
   **And** email, browser state, `user_metadata`, subscription, project role, route visibility, or `adminProcedure` grants no authority.

2. **Authorization is fresh, server-derived, and fail-closed**

   **Given** a missing session, missing/revoked membership, unknown role/action, authorization lookup failure, or browser-supplied actor identity  
   **When** a policy read or mutation is attempted  
   **Then** access is denied before policy data is read or changed, without leaking membership or release existence  
   **And** every sensitive transaction locks and rechecks the membership so revocation and mutation have deterministic commit order.

3. **Policy review is strict and non-mutating**

   **Given** an authorized operator submits a typed policy draft  
   **When** review runs  
   **Then** the server selects the exact public `(kind, schemaVersion)` validator, validates strictly, canonicalizes the payload, computes its SHA-256 identity and a bounded safe diff against the active release, and returns safe review evidence  
   **And** review persists no draft and exposes no raw SQL, executable code, secrets, unrestricted prompts, unvalidated provider payloads, or generic database/JSON console.

4. **Activation is immediate, immutable, and atomic**

   **Given** a valid reviewed payload, its expected active release ID, and an active operator membership  
   **When** activation runs  
   **Then** one short transaction reauthorizes the operator, serializes by policy kind, re-reads the current release, revalidates the payload, creates one immutable production release, and appends one audit event  
   **And** actor UUID, server time, schema version, canonical payload/hash, safe diff, supersession, correlation ID, and validation evidence are retained.

5. **Concurrent changes never silently overwrite**

   **Given** two activations, supersessions, rollbacks, or retries start from the same expected release  
   **When** they execute concurrently  
   **Then** at most one becomes the deterministic active release for that policy kind  
   **And** every stale competing request receives a typed conflict requiring refresh rather than last-write-wins behavior.

6. **Supersession and rollback preserve history**

   **Given** an active release must be replaced or restored to historical validated content  
   **When** an authorized operator confirms the change against the expected active release  
   **Then** the system creates a new immutable release that supersedes the current release  
   **And** historical releases, audit events, policy snapshots, and already-admitted operations remain unchanged and traceable to their original release.

7. **Invalid or unavailable policy authority has no effects**

   **Given** an unknown kind/version, unregistered validator, invalid/dangerous/oversized payload, non-production fixture, hash mismatch, stale predecessor, audit failure, or database failure  
   **When** review, activation, supersession, rollback, or operation admission runs  
   **Then** a typed safe error is returned and no release or successful-change audit event commits  
   **And** there is no fixture, browser constant, environment value, implicit latest row, provider call, usage write, billing mutation, or other fallback effect.

8. **Audit history is append-only and safe**

   **Given** operator bootstrap/revocation or a policy activation/supersession/rollback commits  
   **When** audit history is inspected  
   **Then** it records the server-derived actor/bootstrap type, closed action/outcome, prior/new release references, kind, schema version, payload hash, safe diff, correlation ID, and database timestamp  
   **And** runtime roles cannot update/delete audit history or read raw credentials, authorization headers, unrestricted payloads, provider data, or unnecessary customer data from it.

9. **The operator experience is target-native and accessible**

   **Given** the approved direct `/operator` route  
   **When** an operator reviews validation, diff, release history, confirmation, success, denial, or conflict states  
   **Then** the route uses the existing app shell, `@onlook/ui`, Tailwind, dark theme, and `next-intl` messages without recreating `apps/admin`  
   **And** keyboard order, focus, labels, error association, status announcements, high zoom, responsive layout, non-color cues, and reduced motion meet WCAG 2.2 AA.

10. **Existing Onlook and Story 1.3a behavior is preserved**

    **Given** the operator slice is implemented  
    **When** focused and full regressions run  
    **Then** existing authentication, customer routes, projects/editor, AI, publishing/domains, subscription/billing/usage, tRPC routers, locale parity, and package behavior remain unchanged  
    **And** the Story 1.3a policy contract/fixture tests remain green with no new production mutation or authorization inside `@onlook/business-policy`.

## Tasks / Subtasks

- [ ] Confirm governance and exact implementation boundary (AC: 1-10)
  - [ ] Treat `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/OD-13-OPERATOR-AUTHORITY.md` as the approved role, placement, service, persistence, audit, and regression decision.
  - [ ] Add `architecture/slices/1.3b.json` before runtime editing; declare every governed path with capability `business-policy-operator`, owning runtime, role, and exact new/protected classification.
  - [ ] Prepare and obtain one exact Core Change Request for every protected UPDATE path before editing it. Planning prose and Andrew's default approval are not protected-file approval.
  - [ ] Preserve all unrelated modified/untracked work; never broaden the slice to clean existing architecture advisories or the unrelated `.gitignore` CCR error.

- [ ] Add the operator membership and audit persistence authority (AC: 1, 2, 8)
  - [ ] Add `packages/db/src/schema/operator/index.ts` with one `operator_memberships` row per existing `users.id` (already bound to Supabase Auth UUID), closed `operator` role, grant provenance, and nullable revocation fields.
  - [ ] Add append-only `operator_audit_events` with closed actions/outcomes and safe typed evidence; retain historical actor UUID as evidence without cascading audit deletion.
  - [ ] Enable RLS, create no public `anon`/`authenticated` access policy, explicitly revoke Data API table privileges, and keep direct-server authorization mandatory because Drizzle does not inherit the request user's RLS context.
  - [ ] Add database constraints and reviewed trigger/privilege enforcement so audit and release rows cannot be updated or deleted by runtime roles.
  - [ ] Add a maintainer-run bootstrap/revocation runbook: verify Andrew's exact confirmed Supabase user UUID, insert the initial membership plus audit atomically, never commit the UUID, never look it up by email, and never seed it at application startup.
  - [ ] Do not add membership-management UI/API in this story.

- [ ] Add immutable production policy persistence (AC: 3-8)
  - [ ] Add `packages/db/src/schema/business-policy/index.ts` and `release.ts` for the existing closed kinds, exact schema version, canonical payload/hash, logical identity, actor, server effective time, validation evidence, safe diff, and supersession lineage.
  - [ ] Enforce unique `(kind, schema_version, payload_hash)` identity, immutable history, valid predecessor relationships, production origin, and deterministic `(effective_at, release_id)` active selection.
  - [ ] Keep schemas independent of `@onlook/business-policy`; persistence mappers belong in the web service and must round-trip the public contract exactly.
  - [ ] The maintainer—not an agent—runs `db:gen`, records the exact emitted migration/snapshot/journal paths, reviews the generated diff, then adds any separately reviewed grants/RLS/append-only/advisory-lock SQL that Drizzle cannot express.

- [ ] Implement the least-privileged operator boundary (AC: 1, 2)
  - [ ] Add `apps/web/client/src/server/services/operator/authorization.ts` with a fresh active-membership lookup and closed permission check using the normal server Drizzle client.
  - [ ] Compose operator procedures from `protectedProcedure` in the new business router; do not edit or use `adminProcedure`, do not construct a service-role Supabase client, and do not infer privilege from email or metadata claims.
  - [ ] Make the `/operator` Server Component layout use the same authorization service for presentation, while keeping each tRPC procedure independently authoritative.
  - [ ] Use `UNAUTHORIZED` for missing identity and a non-enumerating `FORBIDDEN`/not-found result for an authenticated non-operator according to the approved route/API contract.

- [ ] Compose and operate production policy releases (AC: 3-8)
  - [ ] Add `apps/web/client/src/server/services/business-policy/registry.ts` as the application composition root for capability-owned production validator bindings. An unregistered kind/version is unavailable and fails closed.
  - [ ] Add `releases.ts` with list/history, non-persistent preview, activate, supersede, rollback-as-new-release, and required-active-release lookup.
  - [ ] Reuse only public `@onlook/business-policy` exports for strict validation, canonicalization/hash, release construction, safe diff, and snapshot assertions. Do not duplicate or weaken the 1.3a contract.
  - [ ] Reject every 1.3a `scope: non-production` fixture and the fixture-only schema/version from runtime activation.
  - [ ] Generate IDs, actor, UTC time, safe diff, and correlation evidence on the server. Inputs may carry intent, payload, exact kind/schema version, idempotency key, and expected active release only.
  - [ ] Keep transactions free of network calls; lock/recheck membership, serialize by kind, compare expected active release, insert release and audit atomically, and return typed conflicts/errors.
  - [ ] Cap request/payload/diff sizes and rate-limit operator mutations using existing local primitives; add no new dependency.

- [ ] Expose the thin operator transport and UI (AC: 1, 3-10)
  - [ ] Add `apps/web/client/src/server/api/routers/business/index.ts` and `policy.ts` with strict Zod inputs and thin calls into authorization/application services.
  - [ ] Add `apps/web/client/src/app/operator/layout.tsx`, `page.tsx`, and the smallest cohesive route-local `policy-console.tsx` client boundary. Split only if responsibilities prove independent; do not pre-create generic component/service folders.
  - [ ] Provide typed policy editors only for production validators actually registered. Do not ship an arbitrary JSON, SQL, prompt, provider-payload, credential, or database console.
  - [ ] Show kind, schema version, validation issues, canonical hash, bounded safe diff, actor/time, active/supersession state, history, and explicit activate/supersede/rollback confirmation.
  - [ ] Add identical operator-policy message keys to every locale catalog and regenerate the typed English declaration only through the maintainer workflow.
  - [ ] Do not modify the current top bar, route constants, root/app/project layouts, shared UI primitives/tokens/icons/styles, or existing navigation for this direct-route slice.

- [ ] Prove authorization, concurrency, immutability, accessibility, and regressions (AC: 1-10)
  - [ ] Add real boundary tests for anonymous, ordinary authenticated, project-admin, subscriber-only, revoked, forged-actor, and authorized UUID cases; unauthorized cases must prove zero policy reads/writes.
  - [ ] Add PostgreSQL integration/pgTAP tests for membership/revocation, RLS/Data API denial, append-only triggers, constraints, concurrent same-kind activation, stale predecessor conflict, all-or-nothing release/audit, rollback lineage, and runtime UPDATE/DELETE rejection. Mocked Drizzle tests are not sufficient proof.
  - [ ] Fault-inject after authorization, release insertion, and audit staging to prove transaction rollback leaves no orphan history.
  - [ ] Prove missing/ambiguous/corrupt active release, unsupported validator, invalid/dangerous/oversized payload, and audit failure all prevent operation/provider/usage/billing effects.
  - [ ] Add Storybook/Vitest-browser interaction and accessibility coverage for loading, denial, empty/unavailable, valid review, invalid review, confirmation, pending, conflict, success, history, keyboard/focus, responsive, high-zoom, and reduced-motion states.
  - [ ] Run the focused commands and full regression matrix below; record real results and do not inherit 1.3a results as new evidence.

## Dev Notes

### Approved OD-13 boundary

- Runtime/application owner: the existing Next.js app at direct route `/operator`.
- Initial operator: Andrew only, bootstrapped operationally by exact Supabase `user.id` into the server-side membership table.
- Authentication and authorization are separate. Existing `createTRPCContext()` calls `supabase.auth.getUser()`; `protectedProcedure` proves a user/email exists. Neither a verified email nor `adminProcedure` proves operator permission.
- Current `adminProcedure` is especially unsuitable: it gives any authenticated user with an email a service-role client that bypasses RLS. This story leaves it untouched and unused.
- The operator membership and audit history are global product-operation authorities, not customer-owned business rows. Do not add a fictional Workspace or customer `user_id` scope to policy releases.
- Project roles and billing subscriptions remain separate authorities. This story cannot mutate or reinterpret project access, products, prices, subscriptions, rate limits, usage records, checkout, allowances, or entitlement.
- V1 has no persisted drafts, scheduled activation, runtime operator management, or global navigation. Preview is in-memory; activation is immediate; rollback is a new release; `/operator` is a guarded direct route.

### Current files that protected updates must preserve

| File | Current state | Minimal story change | Preserve |
| --- | --- | --- | --- |
| `packages/db/src/schema/index.ts` | Eight public schema-group exports. | Append only `./business-policy` and `./operator`. | Existing export names/order/behavior and every current schema. |
| `apps/web/client/src/server/api/routers/index.ts` | Public barrel for existing routers. | Append only `./business`. | Every existing router export. |
| `apps/web/client/src/server/api/root.ts` | Registers current application routers and separately imports `branchRouter`. | Import/register one `businessRouter`. | Router names, AppRouter shape outside the additive member, existing caller behavior. |
| `apps/web/client/package.json` | Pinned existing web dependencies/scripts. | Add only workspace `@onlook/business-policy: "*"`. | Scripts, external versions, and all other dependencies. |
| `apps/web/client/messages/{en,es,ja,ko,zh}.json` | Same root message shape for existing product UI. | Append the same operator-policy namespace with translated values. | Existing keys/values, locale parity, valid JSON. |
| `apps/web/client/messages/en.d.json.ts` | Auto-generated next-intl declaration. | Maintainer regeneration only. | Never hand-edit or claim agent ownership. |
| migration journal/snapshot and `bun.lock` | Generated baseline authorities. | Maintainer-generated exact additions only after schema/package approval. | No unrelated migration, workspace, or dependency re-resolution. |

Protected candidates CCR-001/003/004/005/006/007 and CCR-012-017 in planning prose are not authorization unless the exact resulting path/hash is present in `architecture/core-change-approvals.json`. The current registry contains only CCR-019 through CCR-025. A new/superseding request is required where scope or hash is missing.

### Architecture and dependency guardrails

- `@onlook/business-policy` remains a pure stable contract package. It must not import React, Next, tRPC, Supabase, Drizzle, database clients, provider SDKs, secrets, or application modules.
- The database schema must not import `@onlook/business-policy`; persist primitives/JSON with strict constraints and map in the application service.
- Import workspace packages only through public entry points; never add private `@onlook/*/src/*` imports.
- Dependency direction: `/operator` UI -> `business.policy` tRPC -> operator authorization/business-policy service -> public capability contract and public DB authority.
- New server modules must stay server-only. The client component receives serializable safe projections and cannot import DB/auth/service modules.
- Do not add a generic Jagwar/shared/common package or story-number runtime directory.
- Add no external dependency and make no root manifest, environment, navigation, shared UI, AI/editor, project, publishing, billing, provider, or `trpc.ts` change.
- A story implementation must leave the feature working end-to-end. UI success requires committed release plus audit; a displayed success after partial/failed persistence is a defect even if isolated UI ACs appear satisfied.

### Existing Story 1.3a contract to reuse

- Public closed kinds: `qualification`, `discovery`, `outreach`, `activation`, `commercial`, and `retention`.
- Exact `(kind, schemaVersion)` validator registry; duplicate/missing bindings fail closed.
- Strict Zod validators only: no stripping, passthrough, coercion, transformation, lazy opacity, fake validators, or payload substitution.
- Canonical JSON and Web Crypto SHA-256; reject unsupported JSON, negative zero, non-finite values, sparse/cyclic data, accessors, symbols, hidden properties, invalid Unicode, and non-plain objects without executing caller code.
- Dangerous key families for credentials, authorization, bearer/JWT/token/key, SQL/code/script, and raw/provider payloads are rejected.
- Safe diff uses validated canonical pointers and hashes/metadata, never raw secret-like values.
- Release and snapshot objects are defensively cloned and deeply frozen. Snapshot matching requires exact release and evaluated-input evidence.
- Import from `@onlook/business-policy`; do not duplicate or deep-import any implementation.
- The deterministic qualification fixture is non-production, synthetic, and non-promotable. It does not resolve OD-5 or supply a production operator policy.

### Testing requirements and commands

Run focused tests first, then the complete applicable gate:

```bash
bun test packages/business-policy/test/release.test.ts packages/business-policy/test/fixtures.test.ts
bun test packages/db/test/operator-policy.test.ts
bun test apps/web/client/src/server/services/operator/authorization.test.ts
bun test apps/web/client/src/server/services/business-policy/releases.test.ts
bun test apps/web/client/src/server/api/routers/business/policy.test.ts
bun --filter @onlook/business-policy typecheck
bun --filter @onlook/business-policy lint
bun run typecheck
bun --filter @onlook/web-client lint
bun test
(cd apps/web/client && bunx vitest run --project storybook)
bun scripts/architecture/check.ts --changed
bun test scripts/architecture/check.test.ts scripts/architecture/placement.test.ts
git diff --check
```

- Use the approved isolated local/hosted Supabase workflow for real database tests; never run the dev server.
- Run Supabase database advisors through the installed CLI only after checking `--help` and its version, or use the configured MCP equivalent. Do not guess unsupported commands.
- No standalone Playwright acceptance harness is currently established. Storybook browser tests plus manual real-browser verification are required unless an approved harness exists by implementation time.
- Do not claim RLS, constraints, locks, append-only enforcement, or transaction atomicity from mocked repository tests.

### Previous story and Git intelligence

- Story 1.3a finished the reusable contract and 60 focused tests but intentionally excluded persistence, operator authorization, runtime mutation, and UI. Its package files remain untracked in the current worktree rather than committed history; verify the actual working tree and preserve it.
- Story 1.1 established global policy releases as a non-customer-owned exception and forbids inventing user ownership for them.
- Story 1.4a established deterministic rejection/no-work evidence and rejected fallback architecture. Story 1.4b still owns the durable operation core; this story supplies exact active policy lookup/snapshot behavior without inventing a second job system.
- Recent commits established the pinned-baseline hash ratchet, exact slice-manifest enforcement, and the accepted retirement of inaccessible `apps/admin`. Preserve those decisions.
- Full 1.3a evidence recorded 1,143 passing tests with one skipped, but implementation must run current tests and report current results. The local Bun executable previously reported 1.3.14 while the repository target pins Bun 1.3.1; distinguish local evidence from the target pin.

### Current technology constraints

- Preserve the locked/current project stack: Next 16.0.7, React 19.2.0, tRPC 11.6.0, Drizzle 0.44.7, Supabase JS/Auth 2.76.1, `@supabase/ssr` 0.6.1, and Zod 4.1.x. Add no dependency or upgrade.
- Next App Router pages/layouts are Server Components by default. Add `use client` only to the smallest interactive console boundary and pass only serializable safe data.
- Continue the existing server/browser Supabase split. Do not authorize from `getSession()` cookie data, user-editable metadata, or stale custom claims; this design queries membership fresh.
- Supabase service keys bypass RLS and never belong in the browser or operator authorization path. Public tables receive RLS and least grants even when newer Data API settings do not auto-expose them.
- Zod `z.object()` strips unknown keys by default; use the existing strict policy validators and strict transport envelopes.
- A transaction at default isolation does not by itself prevent competing activation decisions. Use a per-kind transaction advisory/row lock plus expected-active comparison and database uniqueness.
- Supabase now restricts custom objects in `auth`, `storage`, and `realtime`; new Jagwar tables/functions belong in the application-owned schema, not those managed schemas.
- The approved default does not add MFA. Before production policy activation, require Supabase AAL2 after MFA is enabled or record explicit owner risk acceptance; do not claim ordinary login is compromise-resistant.

### Project Structure Notes

- The slice owns three boundaries: reusable policy contract (existing package), server/database policy operation, and route-local operator presentation. No boundary imports backward.
- Direct `/operator` avoids protected navigation/top-bar/constants work. A future discoverable navigation entry belongs to its owning story and separate CCR.
- Keep `policy-console.tsx` cohesive initially. Split editor/history components only if their independent responsibilities or dependencies justify it; do not create empty scaffolding.
- Generated migration/snapshot/journal/typed-message/lock outputs are maintainer-controlled and absent from the initial agent File List until actually generated and approved.

### References

- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/OD-13-OPERATOR-AUTHORITY.md`]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md` §4.3, Phase 6, and gate register]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md` Stories 1.3 and 7.2]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/02-prd.md` FR-OPS-3/4 and NFR-1/4/6/7/8]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/04-ux-and-information-architecture.md` §§10-13]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/08-testing-and-acceptance.md` §§1, 4, 5, 9, 10]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md` AD-1, AD-3, AD-4, AD-5, AD-13, AD-15]
- [Source: `_bmad-output/implementation-artifacts/1-3a-immutable-policy-contract-and-deterministic-fixture-releases.md`]
- [Source: `architecture/core-change-approvals.json`]
- [Source: `architecture/policy.json`]
- [Source: `docs/architecture-governance.md`]
- [Source: `docs/file-placement.md`]
- [Source: Supabase official Auth user, RLS, secure-data, and changelog documentation]
- [Source: Next.js official Server/Client Components documentation]
- [Source: tRPC 11 official procedures/middleware documentation]
- [Source: Drizzle official transactions and index/constraint documentation]
- [Source: PostgreSQL official constraints, transaction isolation, locking, and INSERT conflict documentation]
- [Source: Zod 4 official API/changelog documentation]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-29 context validation: `bun scripts/architecture/check.ts --changed` reported one unrelated protected `.gitignore` error plus two existing cohesive-file advisories for `packages/business-policy/src/release.ts` and its test. No 1.3b runtime code existed.
- 2026-07-29 previous-story verification: focused Story 1.3a contract suites passed 60/60 with 288 assertions under installed Bun 1.3.14; the repository target remains pinned to Bun 1.3.1.
- 2026-07-29 story-document verification: `git diff --check` passed; no runtime, generated, migration, or lockfile content was changed.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Andrew approved the OD-13 defaults: existing web app, direct `/operator` surface, Andrew as the initial Supabase-ID-backed operator, server-side membership, and append-only audit history.
- Story context deliberately excludes runtime operator management, persisted drafts, scheduling, global navigation, service-role authority, and any parallel admin/auth/billing/project/job system.
- Protected baseline edits, generated database/message/lock outputs, and production activation remain gated exactly as documented; no implementation completion is claimed.

### File List

- `_bmad-output/implementation-artifacts/1-3b-authorized-runtime-policy-operation.md` (new story context)

## Change Log

- 2026-07-29: Created Story 1.3b after Andrew approved the simplified OD-13 operator defaults; set context status to ready-for-dev with explicit protected-core and production-policy stop conditions.
