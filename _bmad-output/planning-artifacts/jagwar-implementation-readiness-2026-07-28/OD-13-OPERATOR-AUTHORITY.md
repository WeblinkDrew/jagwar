---
title: OD-13 Target-Native Operator Authority
status: approved-design-protected-edits-still-gated
created: 2026-07-29
updated: 2026-07-29
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
approvedBy: Andrew
binds:
  - Story 1.3b
  - Story 7.1
  - Story 7.2
  - Story 7.4b
---

# OD-13 — Target-Native Operator Authority

## Decision

Andrew approved the following defaults on 2026-07-29:

- Jagwar operator work lives at `/operator` inside the existing `apps/web/client` application. It does not recreate the retired private `apps/admin` application.
- Andrew is the only initial operator.
- Operator identity is the authenticated Supabase `user.id`, stored in a server-side database membership. Email, browser state, `user_metadata`, customer subscription, project role, route visibility, and `adminProcedure` confer no operator authority.
- Every operator request rechecks an active membership row. Revocation therefore takes effect without relying on a refreshed JWT claim.
- Policy changes require explicit authorization and append-only audit history.
- The surface reuses the existing Supabase identity, `@onlook/db`, tRPC, `@onlook/business-policy`, project-access, billing, durable-operation, credential, and audit boundaries. It creates no parallel identity, billing, project, job, policy, credential, or customer authority.

This resolves OD-13's operator role and placement choice. It does **not** approve any protected baseline edit. Each protected path still requires its exact hash-bound Core Change Request before modification.

## Runtime and capability ownership

| Concern | Owner | Boundary |
| --- | --- | --- |
| Operator route and presentation | `apps/web/client/src/app/operator/**` | Server Component guard with the smallest client interaction boundary; `@onlook/ui`, Tailwind, and `next-intl` only. |
| Operator transport | `apps/web/client/src/server/api/routers/business/**` | Thin policy tRPC procedures; authentication and membership authorization precede every read or mutation. |
| Operator authorization | `apps/web/client/src/server/services/operator/**` | Fresh database-backed membership check and closed permission map using the normal Drizzle context; never a service-role client. |
| Policy orchestration | `apps/web/client/src/server/services/business-policy/**` | Review, activate, supersede, rollback, active selection, concurrency, and safe application errors. |
| Stable policy contract | `@onlook/business-policy` | Existing public validator/release/canonical-hash/safe-diff/snapshot API; remains free of UI, tRPC, Supabase, Drizzle, and application imports. |
| Persistence | `packages/db/src/schema/operator/**` and `packages/db/src/schema/business-policy/**` | Operator membership/audit plus immutable releases. |
| Database materialization | `apps/backend/supabase/migrations/**` | Maintainer-generated schema followed by reviewed grants, RLS, append-only enforcement, and bootstrap evidence. Agents do not run `db:gen`. |

Dependency direction is route/UI -> business-policy tRPC -> operator authorization and business-policy service -> public `@onlook/business-policy` contract plus `@onlook/db`. Reusable packages never import application-private code.

## Authorization model

`operator_memberships` is the single operator authorization source:

- `user_id uuid primary key` references the existing application `users.id`, which is already bound to Supabase Auth identity.
- `role` is closed to `operator`; Andrew is the only initial member.
- grant and revocation timestamps/actors are retained; an active membership has no revocation timestamp.
- permissions are a closed server map. The initial operator may access the surface and read/review/activate/supersede/rollback business policies. Future capabilities must add permissions explicitly rather than inheriting a wildcard administrator power.
- ordinary authenticated users, project owners/admins, subscribers, and service-role transport helpers remain unauthorized unless they also have an active operator membership.

Andrew's exact Supabase UUID is never committed. A maintainer uses a reviewed one-shot server/database runbook to verify the user exists and bootstrap the first operator together with an audit event. Runtime self-promotion, email lookup, startup seeding, environment fallback, and browser-supplied actor IDs are forbidden. Runtime membership management is out of scope; emergency recovery or revocation is a separate server-only runbook.

The route layout checks membership for presentation. Every tRPC procedure checks it again. Each sensitive mutation locks and rechecks membership inside the same transaction as the policy change so revocation and mutation have deterministic commit order.

## Policy lifecycle

- V1 review is non-persistent: the server validates a submitted typed draft with the exact public `(kind, schemaVersion)` validator, canonicalizes it, computes the payload hash and bounded safe diff, and returns only safe review evidence.
- Activation immediately creates an immutable production release. Scheduled activation and a generic JSON/SQL/prompt/provider console are out of scope.
- V1 activation is immediate and serialized per policy kind. The active release is the deterministic latest effective server-created production release ordered by `(effective_at, release_id)`; client time never participates and future scheduling is out of scope.
- Activation, supersession, and rollback lock the operator membership, acquire the per-kind transaction lock, re-read and compare the expected active release, revalidate the payload, insert the immutable release, and append the audit event in one transaction.
- Concurrent mutations from the same predecessor allow at most one winner. The loser receives a typed conflict and must refresh; there is no last-write-wins behavior.
- Rollback creates a new immutable release from the selected historical validated payload and supersedes the current release. It never mutates history or treats an old row as newly active without a new release.
- `(kind, schema_version, payload_hash)` remains unique. Idempotent retry may return the identical proven result, but a conflicting request cannot silently reuse it.
- Operation admission resolves the deterministic active production release and snapshots the exact release ID, schema version, payload hash, and evaluated input. Missing, ambiguous, invalid, or non-production policy authority fails closed with no fixture/browser/unserialized-latest fallback.

The deterministic Story 1.3a fixtures remain non-production and cannot be promoted. Production activation for a policy kind remains disabled until its capability-owned production validator and applicable policy/legal decision are approved.

## Audit contract

`operator_audit_events` is the single append-only operator audit history for this surface. Each committed operator grant/revocation or policy activation/supersession/rollback records:

- server-derived actor UUID or explicit bootstrap actor type;
- closed action and target types;
- previous and new release references where applicable;
- policy kind, schema version, canonical payload hash, bounded safe diff, correlation/request ID, outcome, and database timestamp;
- no raw credentials, authorization headers, unrestricted payloads, SQL/code, provider payloads, or unnecessary customer data.

Authority mutation and its audit event commit atomically. Runtime roles expose no audit UPDATE/DELETE API, and the database migration supplies privilege/trigger enforcement against history mutation. Validation failures return structured safe errors and do not create a misleading successful-change event.

## Target path plan

### New Jagwar-owned paths

- `architecture/slices/1.3b.json`
- `packages/db/src/schema/operator/index.ts` (membership and append-only audit tables)
- `packages/db/src/schema/business-policy/index.ts`
- `packages/db/src/schema/business-policy/release.ts`
- `packages/db/test/operator-policy.test.ts`
- `apps/backend/supabase/tests/database/jagwar-operator-policy.test.sql`
- `apps/web/client/src/server/services/operator/authorization.ts` and focused tests
- `apps/web/client/src/server/services/business-policy/registry.ts`
- `apps/web/client/src/server/services/business-policy/releases.ts` and focused tests
- `apps/web/client/src/server/api/routers/business/index.ts`
- `apps/web/client/src/server/api/routers/business/policy.ts` and focused tests
- `apps/web/client/src/app/operator/layout.tsx`
- `apps/web/client/src/app/operator/page.tsx`
- `apps/web/client/src/app/operator/_components/policy-console.tsx`
- `apps/web/client/src/app/operator/_components/policy-console.stories.tsx`

No root layout, top bar, route constant, editor, AI, project, publishing, billing, provider, environment, or existing `trpc.ts` edit is required for the direct guarded `/operator` slice.

### Protected or maintainer-controlled paths

- `packages/db/src/schema/index.ts`: append only the `operator` and `business-policy` schema exports.
- `apps/web/client/src/server/api/routers/index.ts`: append only the business router export.
- `apps/web/client/src/server/api/root.ts`: register only the business router.
- `apps/web/client/package.json`: add only the existing workspace dependency `@onlook/business-policy`.
- `apps/web/client/messages/en.json`, `es.json`, `ja.json`, `ko.json`, and `zh.json`: append the same operator-policy message shape with locale-appropriate values.
- `apps/web/client/messages/en.d.json.ts`: maintainer-regenerated only; never hand-edit.
- `bun.lock`: maintainer-generated workspace link only; no unrelated resolution.
- the emitted migration SQL, snapshot, and `meta/_journal.json`: maintainer-generated exact paths are recorded before review; agents do not run `db:gen`.

Every protected path above requires a separate pending Core Change Request containing its exact minimal diff, resulting hash, regression proof, and rollback. Inclusion in this map is not approval.

## Regression boundary

Before Story 1.3b completes, prove:

1. anonymous, ordinary authenticated, project-admin, subscriber-only, revoked, and forged-actor requests cannot enumerate or mutate operator/policy state;
2. authorization occurs before any service-role construction or policy query; `adminProcedure` is unused;
3. membership revocation versus activation, concurrent activation/supersession/rollback, idempotent retry, stale predecessor, and transaction fault injection preserve one deterministic active release and atomic audit;
4. releases and audit history are immutable through runtime roles, and operation snapshots keep their original release after supersession;
5. invalid/dangerous/oversized input produces structured errors and no release, audit-success, provider, usage, billing, or other effect;
6. direct `/operator` access and every tRPC procedure enforce the same membership authority; UI hiding is not authorization;
7. operator UI meets WCAG 2.2 AA keyboard, focus, labeling, error association, responsive, high-zoom, non-color, and reduced-motion requirements;
8. existing authentication, projects/editor, AI, publishing/domains, subscription/billing/usage, customer routes, package exports, and Story 1.3a's public contract/fixture tests remain unchanged;
9. the architecture slice declares every governed path and all applicable exact CCRs are present before protected edits.

## Deferred hardening and scope limits

- The approved default does not itself add MFA. Before production policy activation or operator grant/revoke, require Supabase AAL2 after MFA is enabled or record an explicit risk acceptance; ordinary login alone must not be described as compromise-resistant.
- Rate-limit operator mutations and cap policy payload/safe-diff sizes at the router and service boundaries.
- Runtime management of additional operators, shared team authority, global operator navigation, provider credentials/health, durable-job operations, and release certification remain their owning stories. The membership and audit authorities may be reused, but new permissions require explicit review.
- No production deployment, provider call, billing mutation, customer-data cutover, or generated database/lockfile edit is authorized by this decision.

## Approval record

Andrew approved the defaults in conversation on 2026-07-29: existing Jagwar web application, `/operator` surface, Andrew as the only initial operator, server-side authorization keyed by Supabase user ID, and append-only audit history.

Reconfirmation is required if implementation changes the route/application owner, trusts email/JWT user metadata/client state, introduces service-role-based authorization, adds a parallel authority, persists generic executable/unvalidated payloads, widens protected paths, or weakens the regression boundary.
