---
story_id: 1.1
story_key: 1-1-map-jagwar-records-to-onlook-workspace-authority
baseline_commit: 423e2e924366419e418ee049093872d535eea41a
created: 2026-07-29
status: done
---

# Story 1.1: Enforce authenticated-user ownership and independent project membership

Status: done

## Story

As an authenticated Jagwar user,
I want every commercial record scoped by my server-verified identity and every linked Onlook project checked through current project membership,
so that another user cannot read, infer, mutate, or attach my business data and Jagwar does not invent a competing workspace authority.

## Acceptance Criteria

1. **One first-release ownership authority**
   - Given an authenticated Jagwar request,
   - when an owned commercial record is created, read, listed, updated, or deleted,
   - then its ownership scope is the server-derived Supabase `user.id` available as `ctx.user.id`, persisted as non-null `user_id`,
   - and browser-supplied `userId`, `ownerId`, `workspaceId`, or `ownershipScopeId` values are never accepted as authority.

2. **No invented workspace aggregate**
   - Given the pinned Onlook baseline has account identity and project membership but no general team/workspace aggregate governing Jagwar records,
   - when first-release modules are designed,
   - then they use authenticated-user ownership and do not create an abstract `Workspace`, parallel tenancy layer, or client-selected scope,
   - and a future shared-workspace change remains an explicit architecture migration rather than an implicit schema assumption.

3. **Fail-closed resource authorization**
   - Given direct IDs, URL IDs, list filters/cursors, nested resources, or batches,
   - when the resource is absent or belongs to another user,
   - then the operation fails before protected work with the same safe code, message, and response shape,
   - and it discloses no record existence, count, relationship, provider state, cost, project state, or partial batch result.

4. **Relational ownership cannot drift**
   - Given a future owned root table and its owned children,
   - when that capability's schema is introduced in its owning story,
   - then the root has a unique `(user_id, id)` key and database-enforced immutable `user_id`, children carry non-null `user_id` and `parent_id` and reference the parent through a composite `(user_id, parent_id)` foreign key, relationship writes are atomic, and owner reassignment or cross-owner attachment fails through direct Drizzle as well as the Data API.

5. **Project access remains an independent authority**
   - Given a Jagwar record is associated with an Onlook project,
   - when a user creates, resolves, mutates, publishes from, or sends from that association,
   - then both the Jagwar record's `user_id` and a current `(user_id, project_id)` row in Onlook's `user_projects` authority are required, and a persisted Project Link binds that pair through a composite foreign key or equivalently atomic database invariant,
   - and project membership alone never grants access to another user's Jagwar records; revoked membership fails on the next operation.

6. **Application authorization plus database defense**
   - Given server code uses the direct Drizzle connection, durable handlers use an authenticated restricted-worker boundary, and the Data API may have different enforcement behavior,
   - when a commercial capability is implemented,
   - then request queries explicitly include the authenticated ownership predicate and project membership where applicable, while a worker derives ownership from its atomically claimed operation and uses a restricted database role,
   - and its schema adds RLS `USING` and `WITH CHECK` policies as defense in depth without treating `TO authenticated` alone as authorization.

7. **Reusable conformance gate, not speculative infrastructure**
   - Given later stories own the real discovery, Lead, consent, publication-link, outreach, operation, cost, and billing schemas,
   - when this story is completed,
   - then the ownership contract, module destinations, protected-core classification, and mandatory conformance matrix are recorded for those stories,
   - and no placeholder table, empty router, generic authorization package, duplicate ledger, or speculative future schema is created merely to prove this mapping.

8. **Protected-core and baseline preservation**
   - Given every file in baseline `423e2e924366419e418ee049093872d535eea41a` is protected,
   - when Story 1.1 is executed,
   - then no protected original is edited without its own approved Core Change Request, no generated file or lockfile is changed, and existing authentication, project, editor, AI, publication, billing, and UI behavior remains unchanged.

## Tasks / Subtasks

- [x] Confirm the native authority chain against the pinned baseline (AC: 1, 2, 5, 6)
  - [x] Record `supabase.auth.getUser()` → `protectedProcedure` → `ctx.user.id` as the only first-release commercial ownership principal.
  - [x] Record `user_projects(user_id, project_id)` and `verifyProjectAccess` as the independent project-membership authority.
  - [x] Prove that `protectedProcedure` authenticates the caller but does not authorize access to a specific record.
  - [x] Prove that `adminProcedure` is not Jagwar operator authority; keep operator access blocked on OD-13.
- [x] Adopt the owned-resource contract in every later commercial slice (AC: 1, 3, 4, 6)
  - [x] Omit ownership identifiers from browser input schemas. If a compatibility boundary cannot omit one, reject a mismatch and never use it to select authority.
  - [x] Require explicit `user_id = ctx.user.id` predicates for single, list, nested, cursor, and batch access through the direct Drizzle client.
  - [x] Add composite ownership keys and foreign keys when each real schema is introduced; do not create speculative tables in Story 1.1.
  - [x] Add matching authenticated RLS policies with both `USING` and `WITH CHECK` where the operation requires them.
- [x] Adopt the independent project-link contract in Stories 4.2–4.5 and 5.3–5.4 (AC: 5)
  - [x] Resolve the owned Jagwar record without revealing foreign-record existence.
  - [x] Verify current Onlook project membership in the same server operation before association or effects.
  - [x] Revalidate both authorities immediately before publication-dependent outreach dispatch.
- [x] Attach the conformance suite to each real resource's owning story (AC: 3–7)
  - [x] Cover anonymous, owner, foreign owner, missing ID, spoofed owner, URL/direct ID, list/cursor, batch, nested-resource, and no-side-effect cases.
  - [x] Cover owner-plus-member, owner-with-revoked-membership, unrelated membership, and shared-project/non-shared-business-data cases.
  - [x] Cover schema constraints, RLS, direct-Drizzle predicates, atomic failure, and indistinguishable missing/foreign responses.
  - [x] Require a rejected case to prove zero provider, queue, project, publication, usage, or cost side effects.
- [x] Enforce the governed path and protected-core ledger before implementation (AC: 7, 8)
  - [x] Create each runtime module only in the capability-owning app/package listed below; do not organize runtime code by story number.
  - [x] Re-check each proposed path against the pinned baseline immediately before creation or edit.
  - [x] Consume approved CCRs only when the first real capability requires them; do not edit protected aggregators or manifests to scaffold an empty module.
  - [x] Audit every copied/adapted asset or dependency; Story 1.1 requires none and has a zero-copy license disposition.
- [x] Record deterministic evidence and handoff gates (AC: 3–8)
  - [x] Run the existing project-access regression test and record the exact result.
  - [x] Run architecture validation, relevant type checks, and `git diff --check` without modifying generated artifacts.
  - [x] Record all affected files accurately and distinguish new files from protected originals.

### Review Findings

- [x] [Review][Patch] Add the authenticated internal-worker ownership branch required by AD-3 [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:118]
- [x] [Review][Patch] Require Project Links to bind `(user_id, project_id)` atomically to `user_projects` and cover revocation races [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:44]
- [x] [Review][Patch] Add database enforcement and direct-Drizzle proof that root `user_id` cannot be reassigned [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:39]
- [x] [Review][Patch] Reconcile the module map with the approved `schema/leads/*` paths and protected router aggregation seams [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:130]
- [x] [Review][Patch] Add an explicit owning-story attachment registry for the mandatory conformance matrix [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:83]
- [x] [Review][Patch] State that the adopted course correction supersedes the canonical epic's obsolete Workspace/team-role wording [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:235]
- [x] [Review][Patch] Define explicit Data API grant revocation or intentional-exposure controls and matching boundary tests [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:185]
- [x] [Review][Patch] Correct the protected migration journal path to `apps/backend/supabase/migrations/meta/_journal.json` [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:161]
- [x] [Review][Patch] Require owned-child `parent_id` to be non-null so composite ownership foreign keys cannot be bypassed [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:42]
- [x] [Review][Patch] Specify distinct-ID normalization and all-ID validation for atomic batches [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:174]
- [x] [Review][Patch] Require every `SECURITY DEFINER` function to reproduce ownership and membership predicates internally [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:186]
- [x] [Review][Patch] Synchronize the generated and machine-readable `last_updated` timestamps [_bmad-output/implementation-artifacts/sprint-status.yaml:2]
- [x] [Review][Patch] Keep the global/versioned Story 1.3 policy authority distinct from customer-owned commercial resources [_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md:160]

## Completion Boundary

Story 1.1 is an architecture and authorization contract gate. It is complete when the native authorities are proven, the governed runtime boundaries below are accepted, and the attachment registry assigns every conformance requirement to its owning stories. It does **not** claim that not-yet-created commercial tables have already passed runtime tests or freeze speculative leaf filenames. Each later slice must implement and pass its registered contract cases for its real resource before that slice can be marked done.

## Dev Notes

### Authority map

| Concern | Native authority | Jagwar rule |
| --- | --- | --- |
| Authenticated principal | Supabase Auth user returned by server `getUser()` and exposed by `protectedProcedure` as `ctx.user` | `ctx.user.id` is first-release `ownershipScopeId`; never trust a browser-selected owner. |
| Authenticated internal worker | Signed, replay-protected internal consumer plus atomically claimed durable operation and restricted worker database role | Derive `user_id` from the claimed operation; never accept an owner from queue payload or handler input. |
| User persistence | Existing Supabase-auth-to-`users` identity chain | Reference the existing user UUID; do not add a second account or workspace identity. |
| Project membership | Existing `user_projects` composite `(user_id, project_id)` membership | Require current membership independently whenever a commercial action touches a project. |
| Project authorization | Existing `verifyProjectAccess` fail-closed helper pattern | Resolve, authorize, then act; preserve indistinguishable missing/unauthorized errors. |
| Commercial record ownership | New columns, constraints, repository predicates, and RLS introduced with each owning slice | Non-null `user_id`, server-derived writes, owner-scoped reads/mutations, composite child ownership. |
| Operator authorization | OD-13, unresolved | Do not use `adminProcedure`, email checks, or client state as a substitute. |
| Shared workspace/team | No approved first-release aggregate in the pinned baseline | Deferred. Do not create an abstract Workspace authority. |

### Runtime flow

```text
browser input (no owner scope)
  -> protectedProcedure authenticates Supabase user
  -> service/repository receives ctx.user.id
  -> owned query includes user_id + resource id/filter
  -> when project-related, verify current user_projects membership
  -> perform one atomic mutation/effect
  -> RLS remains a second boundary for Data API/database access

signed internal consumer (no owner scope in payload)
  -> authenticate signature, timestamp, nonce, and operation kind
  -> atomically claim durable operation with restricted worker role
  -> derive user_id from the claimed operation row
  -> reapply owned-resource and current project-membership predicates
  -> perform one fenced atomic mutation/effect
```

Authentication is necessary but not sufficient. The pinned baseline's direct Drizzle client can operate outside end-user RLS, so application queries must carry their own ownership and membership predicates. Conversely, application checks do not remove the requirement for RLS on commercial tables that may become API-visible.

### Onlook-native module map

Runtime code is grouped by product capability and owning runtime, not by Epic or Story number.

| Capability / owning story | Owning runtime and intended new paths | Ownership integration |
| --- | --- | --- |
| Ownership proof used by later slices | `packages/db/test/jagwar-ownership.test.ts`; `apps/backend/supabase/tests/database/jagwar-commercial-foundation.test.sql` | Add tests only when real owned tables exist; no dummy probe table. |
| Business policy (Story 1.3) | `packages/business-policy/*`; `packages/db/src/schema/business-policy/*`; `apps/web/client/src/server/services/business-policy/*` | Global/versioned policy authority exception: 1.3a permits deterministic fixture provenance and no runtime mutation; 1.3b requires an authenticated, audited, least-privileged operator only after OD-13. Do not add customer `user_id` scope by default. |
| Discovery (Epic 2) | `packages/db/src/schema/leads/*`; `apps/web/client/src/server/services/leads/*`; `apps/web/client/src/server/api/routers/business/*`; route-local Find Leads modules under the owning app route | Discovery runs/candidates carry `user_id`; repositories take server context, not browser ownership. |
| Lead and pipeline (Epic 3) | `packages/db/src/schema/leads/*`; `apps/web/client/src/server/services/leads/*`; `apps/web/client/src/server/api/routers/business/*`; route-local pipeline UI | Lead is the owned aggregate root; child activity, consent, evidence, and suppression rows preserve composite ownership. |
| Project handoff (Epic 4) | `packages/leads/src/project-context.ts`; `apps/web/client/src/server/services/leads/*`; focused tests beside those owners | Require Lead ownership and an atomic current-`user_projects` invariant; do not change Onlook project/editor authority. |
| Outreach (Epic 5) | `packages/outreach/*`; `packages/db/src/schema/outreach/*`; `apps/web/client/src/server/services/outreach/*`; bounded durable-operation handlers | Consent and exact Publication resolution remain owned; revalidate owner and membership immediately before dispatch. |
| Operation and cost telemetry (Stories 1.4b, 6.3) | `packages/durable-operation/*`; `packages/db/src/schema/durable-operation/*`; `apps/web/client/src/server/services/durable-operation/*` | Operational rows carry the same owner/trace boundary; no second job or usage ledger. |
| Billing (Epic 6 after OD-14) | Existing Onlook billing authority plus approved additive Jagwar reconciliation | Ownership does not authorize a second subscription, entitlement, allowance, or usage authority. |

The table fixes capability ownership and runtime boundaries. Exact leaf filenames not already fixed by the approved path ledger are finalized in the owning story after inspecting route and package neighbors; they must remain inside these boundaries and pass the architecture checker.

### Proposed path classification for Story 1.1

| Path | Classification | Story 1.1 disposition |
| --- | --- | --- |
| `_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md` | New planning artifact | Create; this is the mapping and conformance contract. |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Existing Jagwar implementation artifact, not pinned baseline | Update only this story's status and timestamp. |
| `apps/web/client/src/utils/supabase/server.ts` | Protected original | Read/reuse; no edit. |
| `apps/web/client/src/server/api/trpc.ts` | Protected original | Read/reuse `ctx.user`; no edit. |
| `packages/db/src/schema/supabase/user.ts` | Protected original | Read/reuse identity authority; no edit. |
| `packages/db/src/schema/user/user.ts` | Protected original | Read/reuse identity authority; no edit. |
| `packages/db/src/schema/user/user-project.ts` | Protected original | Read/reuse project membership; no edit. |
| `apps/web/client/src/server/api/routers/project/helper.ts` | Protected original | Reuse authorization pattern; no edit. |
| `apps/web/client/src/server/api/routers/project/helper.test.ts` | Protected original | Run as regression evidence; no edit. |
| `apps/backend/supabase/migrations/0006_rls.sql` | Protected original | Read as existing RLS evidence; no edit. |
| `packages/db/src/schema/index.ts` | Protected original; CCR-001 approved for a bounded future export diff | Defer until the first real schema consumer; do not scaffold exports now. |
| `apps/backend/supabase/migrations/meta/_journal.json` | Protected generated original; CCR-003 maintainer-only | Never edit manually and do not run `db:gen`. |
| `apps/web/client/src/server/api/routers/business/index.ts` | Future new capability router | Create only with the first real business endpoint; aggregator registration remains separately governed. |
| `apps/web/client/src/server/api/routers/index.ts` | Protected original; CCR-004 approved for one future business-router export | Defer until the first real endpoint exists; do not register an empty router. |
| `apps/web/client/src/server/api/root.ts` | Protected original; CCR-005 approved for one future business-router registration | Defer until the first real endpoint exists; preserve every existing router key. |
| `packages/db/test/jagwar-ownership.test.ts` | Future new focused conformance test | Create when a real owned schema exists. |
| `apps/backend/supabase/tests/database/jagwar-commercial-foundation.test.sql` | Future new database conformance test | Create when real migrations/policies exist. |

No dependency, icon, asset, style, package manifest, lockfile, generated file, AI core, editor, billing, publication, or project lifecycle change is proposed by Story 1.1. License disposition: original planning text only; no copied code or third-party asset.

### Input and repository contract

- Public input schemas describe user intent and resource IDs only. Ownership is injected after authentication.
- Repository/service functions that access owned data receive an explicit server-derived `userId`; they do not read arbitrary scope from payloads or global browser state.
- Single-resource predicates include both `id` and `user_id`. List predicates, counts, search, sort, and cursors remain within the same `user_id` scope.
- A foreign cursor or nested parent behaves like a missing one. Do not return foreign counts, titles, project IDs, provider statuses, or relationship hints.
- Normalize duplicate batch identifiers, authorize every distinct requested ID, and fail the whole batch atomically if any distinct ID is missing or foreign. Do not process the caller-owned subset or leak which identifier failed.
- Child creation and relationship changes require non-null `user_id` and `parent_id`, validate the owned parent in the same transaction, and are backed by composite foreign keys.
- Do not implement owner reassignment in the first release. Each owned root must reject `user_id` changes at the database boundary, such as with a narrowly scoped `BEFORE UPDATE OF user_id` trigger, including through privileged direct Drizzle. A future transfer feature requires a separate authority model and migration.
- Persisted Project Links bind `(user_id, project_id)` to `user_projects` through a composite foreign key or equivalently transactionally serialized invariant. Membership revocation removes or invalidates the link atomically, and every project-dependent effect revalidates current membership immediately before dispatch.
- Side effects start only after all ownership, membership, policy, consent, entitlement, and idempotency checks required by that operation have passed.

### Supabase and PostgreSQL requirements

- Use the server client for server components, actions, and routes; never pass it into client code.
- Use `getUser()`-verified identity for authorization decisions. Do not derive authorization from browser claims or mutable user metadata.
- RLS policies for owned tables target the appropriate role and include `auth.uid() = user_id` in `USING` and, for inserts/updates, `WITH CHECK` as applicable.
- `TO authenticated` selects a database role; it does not prove row ownership.
- Default new Jagwar tables to no Data API exposure. For tables created in exposed `public`, explicitly revoke object and default privileges from `anon` and `authenticated` and prove Data API denial. If a later story intentionally exposes a table, it must add minimum explicit grants, RLS, and a real API-boundary test.
- Keep `SECURITY DEFINER` functions exceptional. When required, use a fixed safe `search_path`, controlled ownership, explicit execute grants, revoke execution from `PUBLIC`, and reproduce the applicable `auth.uid()` ownership/current-membership checks or restricted-worker claimed-operation predicate inside the function.
- The existing `0006_rls.sql` is evidence of Onlook's native membership model, not a template to copy wholesale; later migrations must include complete insert/update checks and focused tests.

### Mandatory conformance matrix for each owned resource

| Case | Expected proof |
| --- | --- |
| Anonymous | Rejected before repository or protected work. |
| Create | Stored `user_id` equals `ctx.user.id`; spoofed ownership input is absent or rejected. |
| Owner direct ID / URL ID | Authorized operation succeeds. |
| Foreign direct ID / URL ID | Same safe result as missing; no existence leak. |
| List, count, search, cursor | Results and pagination remain within owner scope; foreign cursor is safe. |
| Batch | Duplicate IDs are normalized; every distinct ID is authorized; a mixed-owner/missing batch fails atomically with zero partial change and no failed-ID disclosure. |
| Nested child | Non-null parent and child ownership both match; null-parent, orphan, and cross-owner attachment fail. |
| Project association | Owned business record plus current caller membership is required; the persisted link has the composite membership FK or equivalent atomic invariant. |
| Revoked membership | The next project-related action fails before project/publication/provider work. |
| Shared project | Membership does not expose another user's commercial records. |
| Database constraints | Root unique `(user_id,id)`, database-enforced immutable owner, non-null child keys, child composite foreign keys, and Project Link membership invariant reject drift. |
| RLS | User A cannot read/write User B rows; inserts and owner changes fail. |
| Direct Drizzle | Explicit owner predicates work even when the connection bypasses end-user RLS, and a privileged owner-reassignment attempt is rejected by the database. |
| Internal worker | Invalid signature/replay/kind fails before claim; a valid worker derives owner from the claimed operation and cannot act on a payload-supplied or foreign owner. |
| Data API boundary | Non-exposed tables deny `anon` and `authenticated`; intentionally exposed tables have minimum grants, RLS, and an API-boundary test. |
| Privileged function | Every `SECURITY DEFINER` function denies foreign ownership/membership and cannot be executed by `PUBLIC`. |
| Side effects | Every rejected case records zero provider, queue, project, publication, usage, and cost effects. |
| Regression | Existing Onlook authentication, project membership, editor, AI, publication, and billing behavior remains intact. |

### Owning-story conformance attachment registry

This registry is the mechanical attachment for later story execution. A listed story may not reach `done` until its real resources implement every mandatory matrix row that applies; project- or worker-related rows become mandatory whenever that slice uses those boundaries.

| Owning stories | Owned resources / boundary | Required additions beyond the universal matrix |
| --- | --- | --- |
| 1.3 | Global immutable business-policy releases and activation history | Non-customer-owned exception: 1.3a proves fixture provenance, immutability, and no runtime mutation; 1.3b proves authenticated operator actor/audit/least privilege only after OD-13. Apply the universal customer-ownership matrix only if an owning story explicitly introduces a separate user-owned policy record. |
| 1.4b, 2.2, 2.3, 6.3 | Durable operations, discovery runs, snapshots, cost observations | Internal worker, batch/replay, direct-Drizzle, side-effect, and Data API boundary proofs. |
| 2.1–2.6 | Candidates, discovery evidence, qualification, phone evidence | Owner create/read/list/cursor/batch, nested evidence, immutable owner, and zero-provider-cost rejection proofs. |
| 3.1–3.5 | Leads, pipeline state, activity, consent, suppression | Root/child composite ownership, immutable owner, nested/batch, RLS, direct-Drizzle, and no-outreach-side-effect proofs. |
| 4.2–4.5 | Lead-to-project links and publication snapshots | Owned Lead plus atomic current membership invariant, revoked/shared-project cases, and zero-project/publication effects. |
| 5.2–5.6 | Managed connector/credential metadata, compliance evaluations, sends, recipients, provider events | Owner-scoped connector metadata and secret isolation; owner plus current membership before dispatch; privileged-function/worker checks, replay, partial-batch denial, and zero-provider effects. |
| 6.1–6.9 | Activation, usage, entitlement reconciliation, commercial overview | Owner-scoped projections and counts, billing-authority separation, direct-Drizzle/RLS, and zero-usage/cost effects. |
| 7.1–7.5 | Operator/provider state, policy changes, donor imports, certification evidence | Explicit operator authority once OD-13 resolves, owner-preserving import, batch atomicity, RLS/Data API, and retained end-to-end matrix evidence. |

### Verification commands

Run only the commands relevant to files actually introduced by the implementing slice:

```bash
bun test apps/web/client/src/server/api/routers/project/helper.test.ts
bun test packages/db/test/jagwar-ownership.test.ts
bunx supabase test db --workdir apps/backend --local
bun --filter @onlook/db typecheck
bun run typecheck
bun scripts/architecture/check.ts --changed
bun test scripts/architecture/check.test.ts
git diff --check
```

The future test paths and Supabase command become required only when their real schemas/tests exist. Do not run the development server or `db:gen`.

### Known traps to avoid

- Do not copy the existing project-create input pattern that accepts a browser `userId`; Story 4.1 owns correction of that protected path under its approved request.
- Do not create `packages/auth`, `packages/common`, `packages/jagwar`, or a generic `workspace` module for this contract.
- Do not expose private package source paths such as `@onlook/db/src/*`; new code uses public package entry points.
- Do not equate project membership with ownership of Leads or other business data.
- Do not use `adminProcedure` as an operator-role shortcut while OD-13 remains unresolved.
- Do not add final pricing, plans, entitlements, allowances, or usage enforcement under the ownership story.

### Prior-story and Git intelligence

- The adopted 2026-07-28 course correction section 4.2 and Architecture AD-2 supersede the canonical epic's obsolete Workspace A/B and assumed team-role wording for Story 1.1. Later story generation must use this story's authenticated-user ownership plus independent project-membership contract until an explicit shared-workspace migration is approved.
- Story 1.4a showed that authorization evidence must exercise the real principal and boundary, rejected cases must prove no protected work, and evidence must be deterministic and retained. Apply those lessons to ownership tests.
- Baseline commit `423e2e924366419e418ee049093872d535eea41a` introduced project-membership authorization across tRPC resources after an IDOR review. Its governing pattern is resolve resource, verify current membership, and return a merged not-found/unauthorized result to prevent enumeration.
- Writable target at story creation: `/Users/andrewsimic/Developer/Jagwar`; branch `bmad/jagwar-foundation-bootstrap`; HEAD `47225e1660e23f7fb4dc3e5f35957255b43e096c`; origin `https://github.com/WeblinkDrew/jagwar.git`; upstream `https://github.com/onlook-dev/onlook.git` with push disabled.
- Preserve all pre-existing dirty and untracked work. This story authoring pass changes only its new artifact and sprint tracking.

### References

- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/02-prd.md`]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/04-ux-and-information-architecture.md`]
- [Source: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md`, Story 1.1 and ownership acceptance criteria]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md`]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md`]
- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/PATH-LEDGER.md`]
- [Source: `_bmad-output/planning-artifacts/jagwar-implementation-readiness-2026-07-28/FIRST-SLICE-CORE-CHANGE-REQUESTS.md`]
- [Source: `docs/architecture-governance.md`]
- [Source: `AGENTS.md`]
- [Source: `apps/web/client/src/server/api/trpc.ts`]
- [Source: `packages/db/src/schema/user/user-project.ts`]
- [Source: `apps/web/client/src/server/api/routers/project/helper.ts`]
- [Source: `apps/web/client/src/server/api/routers/project/helper.test.ts`]
- [Source: `apps/backend/supabase/migrations/0006_rls.sql`]
- [Supabase server-side authorization and `getUser`](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api)
- [Drizzle ORM indexes and composite foreign keys](https://orm.drizzle.team/docs/indexes-constraints)

## Dev Agent Record

### Agent Model Used

GPT-5.6 Codex

### Debug Log References

- Story creation confirmed the pinned authority chain, existing RLS migration, protected-core classification, dependency-safe sprint order, and Supabase's current database/API guidance.
- No runtime source, baseline file, database, external provider, dependency, lockfile, generated file, or deployment was changed while authoring this story.
- Implementation plan: verify each native authority directly in the protected baseline, exercise the existing fail-closed project helper, validate the governed path/CCR ledger, and retain Story 1.1 as a contract-only gate without speculative runtime scaffolding.
- Verified `supabase.auth.getUser()` in `createTRPCContext`, the authentication-only behavior of `protectedProcedure`, the lack of an operator-role authorization check in `adminProcedure`, the composite `user_projects` authority, and `verifyProjectAccess` membership filtering without editing those protected originals.
- `bun test apps/web/client/src/server/api/routers/project/helper.test.ts`: 19 passed, 0 failed, 20 expectations.
- `bun test`: 1,076 passed, 1 skipped, 0 failed, 2,291 expectations across 59 files.
- `bun run typecheck`: `@onlook/web-client` exited successfully.
- `bun scripts/architecture/check.ts --changed`: 0 errors, 0 warnings.
- `bun test scripts/architecture/check.test.ts`: 3 passed, 0 failed, 4 expectations.
- `git diff --check`: passed with no output.
- Fresh-context adversarial review: 12 original findings and 1 follow-up regression resolved; final independent verification found no remaining issue.
- Final post-review validation: 1,076 passed, 1 skipped, 0 failed; web-client typecheck passed; architecture check reported 0 errors and 0 warnings; architecture tests passed 3/3; `git diff --check` passed.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Corrected the traceability title into the approved first-release rule: authenticated-user ownership plus independent project membership, without inventing a Workspace aggregate.
- Mapped later runtime code by capability and owning runtime rather than story-number folders.
- Attached the mandatory conformance matrix through an explicit owning-story registry and deferred runtime tests until their real schemas exist.
- Confirmed all eight acceptance criteria at the contract gate: server-derived ownership, independent current project membership, fail-closed response rules, composite relational ownership, explicit direct-Drizzle predicates, complete RLS requirements, deferred capability-owned conformance tests, and protected-baseline preservation.
- No placeholder schema, router, package, duplicate workspace authority, asset, dependency, generated artifact, or protected-core edit was introduced.
- Current official Supabase Auth, RLS, and Data API guidance remains consistent with the recorded contract: `getUser()` is suitable for authorization identity, grants and RLS are separate controls, and ownership policies require row predicates beyond `TO authenticated`.
- ✅ Resolved 12 fresh-context review findings plus one follow-up regression: internal-worker authority, Project Link atomicity, database owner immutability, governed paths, owning-story attachment, course-correction precedence, Data API controls, migration journal path, non-null parent keys, duplicate-safe batches, privileged-function checks, sprint timestamp consistency, and global policy-authority separation.
- Story moved to `done` only after every review finding passed read-only re-verification and the complete validation gate passed after the final patch.

### File List

- `_bmad-output/implementation-artifacts/1-1-map-jagwar-records-to-onlook-workspace-authority.md` (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated by story creation and implementation status tracking)

## Change Log

- 2026-07-29: Created Story 1.1 as the governed ownership and module-placement gate for later Jagwar commercial slices.
- 2026-07-29: Verified the native authority chain, adopted the later-slice ownership/project-link conformance contract, confirmed protected-core preservation, and recorded deterministic validation evidence.
- 2026-07-29: Addressed fresh-context code review findings - 12 original contract items and 1 follow-up regression resolved.
- 2026-07-29: Completed Story 1.1 after final review verification and full regression validation.
