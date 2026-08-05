---
title: Jagwar First Discovery Slice — Core Change Approval Batch
status: approved
created: 2026-07-28
updated: 2026-07-28
writableTarget: /Users/andrewsimic/Developer/Jagwar
branch: bmad/jagwar-foundation-bootstrap
head: a03802a8e85e5c10cd620fb0e654af7cd70ea605
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# First Discovery Slice — Core Change Approval Batch

This batch covers only protected Onlook files needed to register the user-owned persistence and business API boundaries for the first discovery slice. Andrew explicitly approved CCR-001, CCR-003, CCR-004, CCR-005, CCR-006, and CCR-007 exactly as written on 2026-07-28. That approval does not extend beyond each request's stated limits.

## Verified lockfile state

- Andrew approved and implemented the separate OD-15 CCR-019 through CCR-022 target-fork resolution.
- `bunx bun@1.3.1 install --frozen-lockfile` now succeeds for the declared Jagwar workspace.
- The existing web typecheck passes.
- CCR-006 and CCR-007 are no longer technically blocked and are approved within the limits below.
- After the three new package manifests exist, the CCR-007 generated diff must contain only those workspaces, their already-pinned tooling links, and the three CCR-006 web dependency links. Hand editing or unrelated resolution churn remains prohibited.

## CCR-001 — `packages/db/src/schema/index.ts`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** Stories 1.1, 1.3a, 1.4b, 6.3a, and the first discovery slice
- **Protected concern:** database public schema aggregate

### Current responsibility

The file exports every Drizzle schema group consumed by `@onlook/db/src/client`. Existing database queries, relations, Drizzle generation, and migrations depend on this aggregate.

### Proposed change

Add exactly three public group exports without changing or reordering existing exports:

```diff
+export * from './business-policy';
+export * from './durable-operation';
+export * from './leads';
```

The corresponding group entry points and schema files are all new paths listed in `PATH-LEDGER.md`. Database schemas will not import `@onlook/leads`, `@onlook/business-policy`, or `@onlook/durable-operation`; CCR-002 is withdrawn.

### Why a new-file-only alternative is insufficient

Drizzle imports the schema aggregate. Leaving new schema groups unexported would make relations/query metadata incomplete and disconnect them from the established database authority. A second database client or private source import would violate the target architecture.

### Compatibility and risk

- Existing exports and table definitions remain unchanged.
- No AI, editor, billing, publishing, UI, or auth behavior changes.
- Risk is limited to export collision, relation initialization, or schema drift.
- No external dependency or lockfile effect.

### Verification and recovery

- Import smoke test for all three new groups.
- `bun --filter @onlook/db typecheck` using the pinned dependency environment.
- Local generated migration review plus pgTAP structure/RLS tests.
- Existing DB consumers typecheck.
- Rollback removes only the three new export lines after unshipped new schemas/callers are removed.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28
- **Approved limits:** only the three additions shown above
- **Reconfirm if:** any existing export changes, another schema group is added, or a capability-package dependency is introduced

## CCR-003 — `apps/backend/supabase/migrations/meta/_journal.json`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** Stories 1.1, 1.3a, 1.4b, and 6.3a
- **Protected concern:** generated Drizzle migration journal

### Current responsibility

The file is the ordered migration journal for the established Supabase/Drizzle schema. It is generated state and must remain consistent with the generated SQL and snapshot.

### Proposed change

Permit the maintainer—not an agent—to run the repository's `db:gen` workflow after the new schemas and CCR-001 are approved. The only allowed diff is one generated `0020` journal entry matching the emitted migration filename, timestamp, and snapshot. No existing entry may change.

### Why a new-file-only alternative is insufficient

Adding generated SQL/snapshot without the corresponding journal entry breaks Drizzle's migration authority. Hand-authored journal content and a parallel migration registry are prohibited.

### Compatibility and risk

- Existing journal entries, SQL, and snapshots remain byte-for-byte unchanged.
- Risk is generator/version mismatch or accidental unrelated schema capture.
- No production database operation is approved by this request.

### Verification and recovery

- Maintainer reviews SQL/snapshot/journal as one generated unit.
- Diff must contain one appended journal record only.
- Fresh local apply, pgTAP tests, rollback/reapply, and schema diff review.
- Rollback removes the unshipped generated SQL/snapshot and its one journal entry together.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28; maintainer execution only
- **Approved limits:** one generated `0020` append after schema approval
- **Reconfirm if:** generation modifies an existing entry, captures unrelated schema, or produces more than one migration

## CCR-004 — `apps/web/client/src/server/api/routers/index.ts`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** Stories 1.1, 2.2, 2.3, 3.1a, and 2.6b
- **Protected concern:** public tRPC router aggregate

### Current responsibility

The file is the public aggregate for web-client tRPC routers. `root.ts` imports router owners through this seam.

### Proposed change

Add exactly one export and change nothing else:

```diff
+export * from './business';
```

`./business/index.ts` and `./business/leads.ts` are new route-owner files.

### Why a new-file-only alternative is insufficient

An unexported router cannot use the established root composition seam. Importing a private leaf from `root.ts` would bypass the repository's router aggregate; creating a parallel REST authority would split transport conventions.

### Compatibility and risk

- Existing router exports and keys remain unchanged.
- No authentication middleware change; procedures use the existing `protectedProcedure` and derive `ctx.user.id`.
- Risk is limited to an export-name collision or accidental server/client import leak.

### Verification and recovery

- Business aggregate import smoke test.
- Router typecheck and collision check.
- Existing router tests plus direct-ID/cross-user business tests.
- Rollback removes the one export after CCR-005 and new callers are removed.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28
- **Approved limits:** the single export shown above
- **Reconfirm if:** another router is exported or an existing export changes

## CCR-005 — `apps/web/client/src/server/api/root.ts`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** Stories 1.1, 2.2, 2.3, 3.1a, and 2.6b
- **Protected concern:** canonical tRPC application router and `AppRouter` type

### Current responsibility

The file composes every public web tRPC router and defines the client-visible `AppRouter` type and server caller factory.

### Proposed change

Add `businessRouter` to the existing aggregate import and one `business` property to `appRouter`:

```diff
 import {
+    businessRouter,
     chatRouter,
     // existing imports unchanged
 } from './routers';

 export const appRouter = createTRPCRouter({
+    business: businessRouter,
     sandbox: sandboxRouter,
     // existing keys unchanged
 });
```

### Why a new-file-only alternative is insufficient

The new router requires registration in the one existing tRPC authority. A parallel API root, route-handler mutation API, or client-direct database path would violate the target's server-operation conventions.

### Compatibility and risk

- All existing keys, callers, and procedures remain unchanged.
- `business` is a new namespaced key, minimizing collision risk.
- No edit to `trpc.ts`, `adminProcedure`, auth context, billing, AI, editor, or publishing.
- Risk is `AppRouter` type expansion or an unexpected import cycle.

### Verification and recovery

- Typecheck the application router and generated client inference.
- Existing router calls remain callable.
- Business procedures prove anonymous denial, server-derived owner identity, cross-user denial, replay, and dedupe behavior.
- Rollback removes the one import member and one router property after new clients are removed.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28
- **Approved limits:** one import member and one `business` property
- **Reconfirm if:** `trpc.ts`, middleware, context, or any existing router key must change

## CCR-006 — `apps/web/client/package.json`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** Epic 1 and first discovery slice
- **Protected concern:** web-client dependency contract

### Current responsibility

The manifest declares every package the Next.js web client may import.

### Proposed change

Add exactly three existing-workspace-style dependencies, with no script or external-package change:

```diff
 "dependencies": {
+  "@onlook/business-policy": "*",
   "@onlook/code-provider": "*",
   // existing entries unchanged
+  "@onlook/durable-operation": "*",
+  "@onlook/leads": "*",
 }
```

### Why a new-file-only alternative is insufficient

The web app must declare focused packages it imports. Relative/private cross-workspace imports, manual symlinks, TS path bypasses, and duplicating contracts in the route are rejected.

### Compatibility and risk

- No external dependency is introduced; new packages use already pinned Zod/tooling.
- Existing scripts and dependencies remain unchanged.
- Risk is a dependency cycle or mandatory lockfile update.

### Verification and recovery

- Workspace dependency graph remains acyclic.
- New package public-entry tests/typechecks pass.
- Web typecheck/build imports only package public entry points.
- Rollback removes the three manifest entries after new imports are removed and the lock is restored by the maintainer.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28
- **Approved limits:** only the three workspace dependency additions shown above
- **Reconfirm if:** an external dependency, script, version other than `*`, or another package is needed

## CCR-007 — `bun.lock`

### Identity

- **Requester:** Codex, for Andrew
- **Related:** CCR-006 and the three new package manifests
- **Protected concern:** complete Bun workspace dependency resolution

### Current responsibility

The lockfile fixes dependency and workspace resolution for the declared Jagwar monorepo after the approved OD-15 target divergence.

### Proposed change

Permit a maintainer-generated diff containing only:

1. workspace records for `packages/business-policy`, `packages/durable-operation`, and `packages/leads`;
2. their already-pinned Zod/TypeScript/ESLint tooling links; and
3. the three `apps/web/client` workspace dependency links from CCR-006.

No reintroduction of `apps/admin`, dependency upgrade/downgrade, checksum churn, platform-package re-resolution, or unrelated workspace change is allowed.

### Why a new-file-only alternative is insufficient

New package manifests and web dependencies must be reproducible from the committed lock. Hand editing, skipping lock updates, manual symlinks, and private path aliases violate the package-manager and public-boundary rules.

### Compatibility and risk

- OD-15's approved generated cleanup is already complete and separately governed by CCR-019 through CCR-022.
- This request begins from that verified clean frozen-install state.
- Any unrelated resolution churn is rejected.

### Verification and recovery

- Generated diff is rejected unless it is limited to the three new workspaces and three web links above.
- `bunx bun@1.3.1 install --frozen-lockfile` must pass afterward.
- Focused package tests/typechecks, web typecheck/build, and applicable baseline tests must pass.
- Rollback restores this lock and CCR-006 together.

### Owner decision

- **Decision:** approved by Andrew on 2026-07-28
- **Approved limits:** only the generated three-workspace and three-web-link additions described above
- **Reconfirm if:** any existing workspace/dependency record changes

## Later protected-file batches — not requested now

- **After Story 1.4a preflight:** CCR-008 `apps/web/client/src/env.ts` and CCR-009 `apps/web/client/.env.example`, with the exact signing/rotation contract proven first.
- **After the real route exists:** CCR-010 through CCR-017 for route constant, native navigation, locale messages, and generated message declarations.
- **At Story 4.1 only:** CCR-018 `apps/web/client/src/server/api/routers/project/project.ts` for the separately approved native project transaction extraction.

## Approval response format

Andrew may approve any approval-ready request individually, for example:

> Approve CCR-001, CCR-003, CCR-004, CCR-005, CCR-006, and CCR-007 exactly as written.

That approval would authorize only those protected-file diffs when their new callers and tests are ready. It would not authorize production operations, database application, `db:gen` by an agent, lockfile churn, worker secrets, navigation, AI/project changes, or later requests.
