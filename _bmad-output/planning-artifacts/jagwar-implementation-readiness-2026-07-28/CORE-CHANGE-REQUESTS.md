---
title: Proposed Onlook Core Change Requests
status: pending-andrew-confirmation
created: 2026-07-28
updated: 2026-07-28
writableTarget: /Users/andrewsimic/Developer/Jagwar
branch: bmad/jagwar-foundation-bootstrap
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# Proposed Onlook Core Change Requests

Each request is for one exact baseline file and is **pending**. Andrew's approval of one request does not approve another. Reconfirm if the diff exceeds the stated limit, dependencies/paths change, or tests reveal a broader edit.

The exact immediate batch is recorded in `FIRST-SLICE-CORE-CHANGE-REQUESTS.md`. CCR-002 has been withdrawn because the database schemas can remain independent of capability-package types. CCR-008 onward remain later conditional requests rather than part of the first approval prompt.

The approved and implemented fork-level OD-15 resolution is recorded separately in `OD-15-TARGET-RESOLUTION-CORE-CHANGE-REQUESTS.md` as CCR-019 through CCR-022. Those requests retire only the inaccessible private upstream admin dependency from Jagwar and do not imply approval of any first-slice request.

Common constraints for every request:

- Preserve all existing Onlook behavior and public contracts.
- No donor code, new framework, cross-package private import, AI/editor behavior change, production side effect, or unrelated formatting.
- Focused tests run first; the applicable baseline matrix and rollback proof run before release.
- Rollback is a one-file revert plus disabling/removing only the new Jagwar caller; migrations/data require their separate rollback plan.

## CCR-001 — `packages/db/src/schema/index.ts`

- **Related:** Stories 1.1, 1.3a, 1.4b, 6.3a, 2.1–2.3.
- **Current responsibility:** public aggregate for Drizzle schema groups; affects database public exports.
- **Purpose/minimal diff:** append exports for `./leads`, `./business-policy`, and `./durable-operation`; no existing export reorder/rename.
- **New callers:** new schema files and server services in the path ledger.
- **Alternatives considered:** private imports violate package boundaries; isolated tables without registration are unreachable to Drizzle; a second DB package violates OD-3.
- **Risks:** export collisions, relation initialization, migration/schema drift.
- **Tests:** package typecheck; schema import smoke test; mapper/relationship tests; local migration/RLS test; all existing DB consumers typecheck.
- **Rollback:** remove only the appended exports after rolling back unshipped new callers/schema.
- **Decision:** approved by Andrew on 2026-07-28, exactly as written in the first-slice approval batch.

## CCR-002 — `packages/db/package.json`

- **Status:** withdrawn; no edit proposed.
- **Related:** Story 1.1.
- **Current responsibility:** `@onlook/db` runtime/dev dependency contract.
- **Purpose/minimal diff:** none. Drizzle schemas use database-local literal constraints, and server mappers translate to public capability contracts without making `@onlook/db` depend on those packages.
- **Alternatives considered:** duplicate domain enums risk drift; private source imports are prohibited; moving provider/domain logic into DB violates AD-4.
- **Risks avoided:** dependency cycle and unnecessary lockfile churn.
- **Tests:** dependency-direction check and `@onlook/db` typecheck prove no capability-package import exists.
- **Rollback:** not applicable because no change is proposed.
- **Decision:** withdrawn. A future proposal requires a new Core Change Request rather than reviving this one implicitly.

## CCR-003 — `apps/backend/supabase/migrations/meta/_journal.json`

- **Related:** Stories 1.1/1.4; maintainer migration generation.
- **Current responsibility:** generated Drizzle migration journal.
- **Purpose/minimal diff:** maintainer-generated append for the approved `0020` migration only; agents never hand-edit or run `db:gen`.
- **Alternatives considered:** omitting journal/snapshot breaks migration authority; hand-editing is prohibited; a parallel migration system is rejected.
- **Risks:** generated-state mismatch and migration ordering.
- **Tests:** maintainer verifies generated SQL/snapshot/journal consistency; local fresh apply and rollback/reapply; schema diff review.
- **Rollback:** maintainer removes only the unshipped generated entry together with its new SQL/snapshot.
- **Decision:** approved by Andrew on 2026-07-28; maintainer execution only.

## CCR-004 — `apps/web/client/src/server/api/routers/index.ts`

- **Related:** Stories 1.1/2.2.
- **Current responsibility:** public router export aggregate.
- **Purpose/minimal diff:** append one `export * from './business'`; no existing export change.
- **Alternatives considered:** direct private imports from root bypass the established aggregate; a route handler-only parallel API would split tRPC conventions.
- **Risks:** export name collision or unwanted bundle/server dependency.
- **Tests:** router import/typecheck; no collision; existing router tests.
- **Rollback:** delete the one export after unregistering the new root key.
- **Decision:** approved by Andrew on 2026-07-28, exactly as written in the first-slice approval batch.

## CCR-005 — `apps/web/client/src/server/api/root.ts`

- **Related:** Stories 1.1/2.2.
- **Current responsibility:** canonical tRPC application router and caller type.
- **Purpose/minimal diff:** import `businessRouter` from the aggregate and add one `business: businessRouter` property; no existing key change.
- **Alternatives considered:** an unregistered router is unreachable; a parallel REST API duplicates target transport patterns.
- **Risks:** AppRouter type expansion and route-key collision.
- **Tests:** tRPC caller/typecheck; auth/cross-user business tests; all existing routers remain callable.
- **Rollback:** remove the single import/member after new clients are removed.
- **Decision:** approved by Andrew on 2026-07-28, exactly as written in the first-slice approval batch.

## CCR-006 — `apps/web/client/package.json`

- **Related:** Epic 1 and first discovery slice.
- **Current responsibility:** web-client dependency and script contract.
- **Purpose/minimal diff:** add only approved workspace dependencies `@onlook/leads`, `@onlook/business-policy`, and `@onlook/durable-operation`; no script or external dependency change.
- **Alternatives considered:** relative/private cross-workspace imports are prohibited; duplicating contracts in the app causes drift.
- **Risks:** dependency cycle and lockfile update.
- **Tests:** dependency graph, pinned-Bun frozen install, web typecheck/test/build.
- **Rollback:** remove only added workspace entries and regenerate lock via maintainer.
- **Decision:** approved by Andrew on 2026-07-28, exactly as written in the first-slice approval batch.

## CCR-007 — `bun.lock`

- **Related:** CCR-006 and the three new package manifests.
- **Current responsibility:** frozen Bun resolution for the declared Jagwar workspace after the approved OD-15 target divergence.
- **Purpose/minimal diff:** maintainer-generated entries for `packages/leads`, `packages/business-policy`, and `packages/durable-operation`, plus their three `apps/web/client` workspace links. No dependency upgrade, downgrade, private-admin reintroduction, or unrelated re-resolution is permitted.
- **Alternatives considered:** hand editing is prohibited; skipping the lock update breaks frozen install.
- **Risks:** broad transitive drift or accidental reintroduction of the retired private admin dependency.
- **Tests:** diff contains only the expected new workspace records/links; `bunx bun@1.3.1 install --frozen-lockfile`; focused declared-target verification.
- **Rollback:** restore prior lock and manifests together.
- **Decision:** approved by Andrew on 2026-07-28. OD-15 cleanup is complete, the pinned-Bun frozen install passes, and this request is limited to the three new workspaces and their web links.

## CCR-008 — `apps/web/client/src/env.ts`

- **Related:** Story 1.4a/b.
- **Current responsibility:** typed server/client environment validation.
- **Purpose/minimal diff:** add one server-only signing-secret variable for the internal operations consumer; no `NEXT_PUBLIC_*` exposure.
- **Alternatives considered:** hard-coded/shared browser secret is unsafe; unauthenticated Cron route is prohibited; separate config framework is unnecessary.
- **Risks:** startup validation failure or accidental client exposure.
- **Tests:** env schema accepts valid/rejects missing/short value in required environment; client bundle scan; signature/rotation tests.
- **Rollback:** remove schema field after disabling Cron/consumer and deleting the deployment secret.
- **Decision:** pending after Story 1.4a proves the transport.

## CCR-009 — `apps/web/client/.env.example`

- **Related:** CCR-008.
- **Current responsibility:** example environment-variable inventory.
- **Purpose/minimal diff:** add the approved server-only variable name with empty/non-secret example and rotation note.
- **Alternatives considered:** undocumented required env blocks reproducibility; putting a real value is forbidden.
- **Risks:** misleading requirement before preflight or secret disclosure if populated.
- **Tests:** no credential-like value; setup documentation and env schema agree.
- **Rollback:** remove the example line with CCR-008 rollback.
- **Decision:** pending after Story 1.4a.

## CCR-010 — `apps/web/client/src/utils/constants/index.ts`

- **Related:** Story 1.2.
- **Current responsibility:** shared route constants.
- **Purpose/minimal diff:** append approved commercial route constants (`LEADS`, `PIPELINE`, `OUTREACH`, `USAGE`) without changing existing paths.
- **Alternatives considered:** repeated literals diverge from local pattern; a second route registry is prohibited.
- **Risks:** collision or incorrect public path.
- **Tests:** typecheck, route-link tests, direct-route auth denial, existing constants consumers.
- **Rollback:** remove added constants after new callers/navigation are removed.
- **Decision:** pending Andrew confirmation.

## CCR-011 — `apps/web/client/src/app/projects/_components/top-bar.tsx`

- **Related:** Story 1.2.
- **Current responsibility:** protected Projects top bar, project search/create actions, account controls, native Onlook composition.
- **Purpose/minimal diff:** import one new route-local commercial-navigation component and render one entry at the existing action/navigation seam; no project create/search/state refactor, token/icon/style change, or hard-coded new text.
- **Alternatives considered:** an undiscoverable direct route fails native navigation; a second dashboard shell violates scope; modifying root/editor layouts is broader.
- **Risks:** responsive density, focus/tab order, project search/create regression.
- **Tests:** existing top-bar behavior, keyboard/focus, narrow/wide viewport, translated label, unauthorized destination hidden/denied, visual comparison.
- **Rollback:** remove only the new import/render call.
- **Decision:** pending Andrew confirmation after the real route exists.

## CCR-012 — `apps/web/client/messages/en.json`
## CCR-013 — `apps/web/client/messages/es.json`
## CCR-014 — `apps/web/client/messages/ja.json`
## CCR-015 — `apps/web/client/messages/ko.json`
## CCR-016 — `apps/web/client/messages/zh.json`

For each exact locale file independently:

- **Related:** Stories 1.2/2.6a.
- **Current responsibility:** protected `next-intl` product message catalog.
- **Purpose/minimal diff:** add the same closed `commercial` key tree for navigation, Find Leads inputs, durable states, candidate fields/actions, and safe errors; no existing key rename/removal.
- **Alternatives considered:** hard-coded user text violates repository rules; route-local private catalogs are not loaded by the current request configuration; English-only fallback is not an approved completion state.
- **Risks:** missing/mismatched keys, translation quality, generated type drift.
- **Tests:** message-key parity across all locales, existing `test/messages.test.ts`, render smoke tests, no retired product name.
- **Rollback:** remove only the new subtree from that locale after callers are removed.
- **Decision:** each CCR pending separate Andrew confirmation and approved translation content.

## CCR-017 — `apps/web/client/messages/en.d.json.ts`

- **Related:** CCR-012–016.
- **Current responsibility:** generated typed message declaration included by TypeScript.
- **Purpose/minimal diff:** maintainer-controlled regeneration reflecting only the approved new English keys; never hand-edit.
- **Alternatives considered:** stale types fail typecheck; disabling message type generation weakens baseline behavior.
- **Risks:** generator causes unrelated churn.
- **Tests:** generated diff matches new key tree; message parity test; web typecheck.
- **Rollback:** maintainer regenerates after catalog rollback.
- **Decision:** pending Andrew confirmation and maintainer generation.

## CCR-018 — `apps/web/client/src/server/api/routers/project/project.ts`

- **Related:** OD-12, Story 4.1/4.2; not part of first discovery implementation.
- **Current responsibility:** canonical protected project CRUD/create transaction for project, branch, owner membership, canvas, frame, conversation, and creation request.
- **Purpose/minimal diff:** derive owner from `ctx.user.id` instead of accepting authoritative browser `userId`; extract only the existing transaction body into a new server-only additive service called by both the current mutation and later prospect operation. Preserve input compatibility only where it cannot grant authority; do not change AI/create-request semantics.
- **Alternatives considered:** duplicating the transaction creates a second project lifecycle; calling the client manager from a worker crosses environments; adding an AI context/tool is unnecessary; browser-authoritative owner is unsafe.
- **Risks:** highest sensitivity here—project creation regression, transaction drift, invitation/membership behavior, duplicate sandbox/project reconciliation, public input compatibility.
- **Tests:** existing project helper/router tests; transaction fixture equality; auth owner mismatch; create/import/blank/template regression; duplicate/idempotent prospect fixture; editor opens; existing AI CREATE behavior; two personalized real-browser fixtures.
- **Rollback:** restore the original mutation body/contract and disable the unshipped prospect caller; retain no partial Project Link as active.
- **Decision:** pending Andrew confirmation; required before Story 4.1 executable proof.

## Non-request decisions

No request is proposed for AI/editor core, `packages/models/src/project/create.ts`, `use-start-project.tsx`, publishing/domain/billing files, `@onlook/ui`, root `package.json`, Supabase `config.toml`, Docker/CI, or existing tests. If implementation evidence later proves one is unavoidable, stop and create a new exact per-file request rather than expanding an approved request.
