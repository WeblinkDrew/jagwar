# Design: Establish Workspace Authority

## Status and authority

This is the native design artifact for `establish-workspace-authority`. It refines that change's proposal and workspace-authority specification under the canonical `reconfirm-jagwar-product-contract` umbrella. OpenSpec is authoritative for planning; the current repository is implementation authority.

This design authorizes no runtime implementation, migration, provider activation, protected baseline edit, generated-file or `bun.lock` change, commit, editor work, Story 1.3b work, or apply/verify/sync/archive activity. Future implementation requires a completed tasks phase, separately authorized Strict-TDD slices, reviewed path manifests, and exact approvals described below.

## Repository evidence and current seams

The following paths are **observed current repository seams**, not proposed additions:

- `apps/web/client/src/server/api/trpc.ts` authenticates with server-side Supabase `auth.getUser()` and exposes `protectedProcedure`, but it provides authentication only. It currently injects the database and contains inherited private `@onlook/db/src/client` usage; new authority code must not copy that deep import.
- `apps/web/client/src/server/api/root.ts` is the protected inherited tRPC composition root. `apps/web/client/src/server/api/routers/index.ts` is its router export seam.
- Current project sharing is project-centric: `packages/db/src/schema/user/user-project.ts`, `packages/db/src/schema/project/invitation.ts`, and project member/invitation routers. It uses inherited `ProjectRole`, does not establish a durable workspace, does not enforce exactly workspace Owner/Member, and does not preserve a final workspace Owner. These paths remain inherited behavior and are not silently repurposed.
- `apps/web/client/src/server/api/routers/project/helper.ts` contains useful inherited sanitized project checks, including direct, indirect, and batch access patterns, but project access is not the new workspace authority contract.
- `packages/db/src/schema/index.ts` is the protected schema export seam; `packages/db/src/index.ts` is the package public entry and currently exports schema types. `packages/db/src/client.ts` is not a permitted new cross-workspace import path.
- `packages/db/drizzle.config.ts` points authored schema at `packages/db/src/schema` and migration output at `apps/backend/supabase/migrations`; `db:gen` is maintainer-only. Existing migrations enable RLS on inherited public tables and include inherited privileged functions that are not precedents for adding `SECURITY DEFINER`.
- `apps/web/client/src/utils/supabase/server.ts` uses the publishable key and server cookies. `apps/web/client/src/utils/supabase/admin.ts` holds service-role construction and explicitly bypasses RLS; it must not become a general authority shortcut.
- `architecture/policy.json` currently permits only a fixed set of new workspace packages and does **not** permit `packages/workspace-authority`. Therefore a focused authority contract package cannot be created until an approved architecture-policy slice adds that exact package directory. This is a governance prerequisite, not implied authorization.
- There is no current authoritative workspace schema, workspace-authority service, authority package, workspace router, operation-correlation convention, or database authority test suite observed in the inspected seams.

The following are **proposed paths** and remain candidates until a future reviewed slice manifest confirms them:

```text
packages/workspace-authority/                 # focused pure public contracts/rules only
  src/index.ts                                # sole intentional package entry
  src/contracts.ts
  src/decisions.ts
  test/*.test.ts
packages/db/src/schema/workspace-authority/   # persistence owned by this capability
  index.ts
  workspace.ts
  membership.ts
  invitation.ts
  audit.ts
apps/web/client/src/server/services/workspace-authority/
  index.ts                                    # intentional app-server composition/public seam
  repository.ts
  actors.ts
  authorization.ts
  memberships.ts
  audit.ts
apps/web/client/src/server/api/routers/workspace-authority/
  index.ts                                    # thin Zod/tRPC transport only
apps/backend/supabase/tests/                  # proposed SQL/RLS tests if repository workflow approves
```

Migration filenames cannot be selected here: the repository's Drizzle workflow and maintainer-only generation rule determine them. No generic Jagwar package, generic service bucket, editor wrapper, framework replacement, or second authority implementation is proposed.

## Architecture decision

Use a **focused pure authority contract plus Next-server capability implementation**:

```text
browser / future worker boundary
  -> thin validated route or named system entry
    -> workspace-authority server composition root
      -> capability orchestration
        -> injected authority repository + append-only audit writer
          -> workspace-authority tables

future capability service
  -> @onlook/workspace-authority public types/ports
  -> injected server workspace-authority implementation
  -> its own capability-owned resource resolver and persistence
```

The focused package is justified by demonstrated consumers across commercial, lead, BYOK, discovery, website, SMS, Inbox, hosting, and analytics. It contains only stable types, decision unions, correlation/freshness value rules, and ports. It imports no Next.js, tRPC, Supabase, Drizzle, UI, provider, database, or application-private code. It exposes only `@onlook/workspace-authority`; no `/src/*` or deep subpath is public.

The Next-server service owns authentication-to-actor resolution, persistence adapters, commands, transactions, audit writes, and system-actor composition. Its `index.ts` is the intentional server-only entry for app-local capability services. Reusable packages never import this app-private entry; they depend only on the pure package contract and receive implementations from an application composition root.

Transport depends on the service; the service depends on the pure contract and DB public exports; DB schema does not import the web app or authority package. Downstream capability services depend on authority contracts, never authority tables. Workspace authority may invoke a capability-owned resource-ownership port supplied by the caller, but it must not import the consumer's persistence internals. This prevents a central resource registry and reverse dependencies.

The existing tRPC context is sufficient as an authentication source: routers pass `ctx.user.id`, database capability, headers/correlation input, and validated identifiers into the service. Do not add a global workspace or role to `trpc.ts`; doing so would encourage stale request-wide authority and would require an unnecessary protected edit.

## Capability ownership and public contracts

### Owned by workspace authority

- durable workspace identity and current application membership;
- exactly `Owner` and `Member` roles;
- invitation, acceptance, activation, role change, removal, and leave administration;
- authority freshness and optimistic mutation versions;
- human and named system actor contexts;
- Member/Owner/resource decisions and security-critical revalidation;
- bounded authority audit evidence and sanitized workspace projections.

### Explicitly not owned

Project roles and inherited project sharing; subscriptions and usage; leads and pipeline; credentials; provider calls; discovery runs; preset content/validation; prompts and website generation; messages; domains and hosting lifecycle; analytics derivation; client workspace selection; or generic domain events. Each owner supplies its own resource-ownership resolver and additional business gates.

### Conceptual pure contract

Names may be refined without changing semantics, but the public package must represent these contracts directly:

```ts
type WorkspaceRole = 'Owner' | 'Member';
type Decision<T> =
  | { kind: 'allowed'; value: T; evidence: AuthorityEvidence }
  | { kind: 'denied'; code: 'not_authorized'; correlation: Correlation };
type MutationDecision<T> = Decision<T> | {
  kind: 'conflict'; code: 'authority_changed'; correlation: Correlation;
};

type HumanActor = {
  kind: 'human'; subjectId: string; workspaceId: string;
  membershipId: string; role: WorkspaceRole; freshness: AuthorityFreshness;
  correlation: Correlation;
};
type SystemActor = {
  kind: 'system'; systemName: ApprovedSystemActorName; workspaceId: string;
  permittedAction: AuthorityAction; correlation: Correlation;
};
```

`Correlation` contains server-established `requestId` and stable `operationId`. A client may submit an idempotency/operation key as data, but the boundary validates/bounds it, binds it to authenticated subject + workspace + action, and never treats it as authority. Request IDs are accepted only from trusted infrastructure headers or generated server-side. They are not secrets.

The public operations are:

- `resolveActor(authenticatedSubject, workspaceId, correlation)` — reads current active membership and returns a human actor or sanitized denial;
- `requireMember(actor)` and `requireOwner(actor)` — typed role decisions, with Owner satisfying Member;
- `authorizeResource(actor, resourceRef, ownershipResolver)` — resolves ownership through a capability-owned server port and allows only exact workspace equality;
- `revalidate(priorEvidence, requiredRole)` — re-reads current membership immediately before the named sensitive commit/dispatch and returns current evidence, denial, or authority-change conflict;
- membership commands for invite, accept/activate, role change, removal, and leave, each with expected version and typed allowed/denied/conflict outcomes;
- `auditEvidence(decision)` — an allowlisted, persistence-neutral authority evidence value downstream owners may attach to their own operation records.

No public result exposes table names, SQL errors, invitation tokens, email addresses beyond an explicitly sanitized presentation projection, Supabase user objects, JWTs, service credentials, or internal denial distinctions.

## Persistence and lifecycle model

The schema SDD implementation should model four capability-owned aggregates without selecting exact SQL names here:

1. **Workspace:** durable ID, lifecycle state, monotonic authority version, timestamps. An active workspace must always have an active Owner.
2. **Membership:** durable ID, workspace ID, authenticated Supabase subject ID, exactly Owner/Member, active/removed state, monotonic row version, activation/removal timestamps. A removed row is retained as an authority tombstone and audit target; reactivation is an explicit versioned transition, not an invisible insert. Enforce one current membership identity per `(workspace, subject)`.
3. **Invitation:** workspace, intended normalized identity (V1 email binding where that is the authenticated identity available), assigned role, token **hash** rather than raw token, pending/accepted/revoked/expired state, expiry, version, inviter, and acceptance evidence. Pending invitation grants no membership or RLS authority. Acceptance validates the authenticated subject against the invitation, consumes it once, and activates exactly one membership transactionally.
4. **Authority audit:** append-only identity, workspace, human membership/subject or approved system actor, target kind/opaque ID, allowlisted action and result, bounded internal reason, timestamp, request/operation IDs, evaluated versions, and optional `supersedesAuditId`. Details are structured and size-bounded; arbitrary provider payload JSON is prohibited.

Required indexes derive from access paths: active membership by `(workspace, subject)`, member lists by workspace/state, active Owners by workspace/role, pending invitations by workspace and normalized invitee, invitation token hash, audit by workspace/time and operation identity, and unique membership/invitation constraints needed for retry safety. Exact indexes must be verified with generated queries and `EXPLAIN` where material; indexes are not added speculatively beyond these demonstrated lookups.

## Concurrency and transaction design

Every membership mutation runs in one database transaction and requires the caller's expected target/workspace authority version. The transaction:

1. resolves and locks the workspace authority row;
2. re-resolves the acting Owner as current;
3. locks the target membership/invitation rows;
4. compares expected versions;
5. evaluates role validity and the final-Owner invariant against locked current rows;
6. commits the state transition, increments relevant versions, and appends success evidence atomically.

Locking the workspace authority row serializes all mutations that could affect the final-Owner count. Therefore concurrent demotion/removal/leave or transfer operations cannot each rely on a stale Owner count. At most one write against a version succeeds; stale requests return `conflict` with no partial transition. The database should additionally use a deferred constraint/constraint trigger only if ordinary row locking and transactions cannot enforce the invariant across every write path; any trigger requires separate security review and tests.

Denied and stale/conflicted administration attempts still need durable evidence. Because a transaction that intentionally aborts cannot retain its audit insert, the orchestrator records the bounded denial/conflict in a separate append-only transaction after the failed mutation, correlated to the same operation and evaluated versions. Audit-write failure must be observable and fail closed for authority mutations where the specification requires evidence; it must not cause replay of a mutation already known to have committed. A durable operation result keyed by workspace/action/operation ID is preferred for exactly-once retries.

An actor snapshot never grants indefinite authority. Normal calls resolve current membership. A sensitive capability stores the returned freshness evidence and invokes `revalidate` immediately before credential release, balance mutation, irreversible database commit, provider dispatch, or protected disclosure as appropriate. Revalidation checks the same membership ID is active, its version/role still satisfies the decision, and the workspace remains active. Removal produces denial; changed-but-still-eligible authority produces a conflict requiring the owning capability to restart its decision chain. Retries preserve operation identity but derive a fresh actor. Effects committed before revocation remain truthful and reconcilable.

## Access-shape enforcement and sanitized failures

- **Lists:** first require a current Member/Owner, then issue a capability-owned query with `workspace_id = actor.workspaceId` in the predicate. Counts, cursors, joins, and aggregates use the same scope.
- **Direct IDs:** ownership resolution and workspace equality occur before returning data or invoking effects. Existing cross-workspace and nonexistent IDs map to the same public `not_authorized` outcome.
- **Indirect IDs:** the owner capability resolves the full relationship (for example conversation → lead → workspace) in a scoped query. Missing or mismatched links fail identically.
- **Mixed batches:** deduplicate IDs, resolve every item under the actor workspace, and default to all-or-nothing authorization for mutating/metered/provider batches. No unauthorized item details, per-item existence flags, provider calls, or partial metering are returned. A capability may support a filtered read only when its own specification explicitly permits it and metadata cannot reveal excluded rows.
- **Presentation:** active workspace selection and sanitized workspace lists are convenience projections only. Every operation repeats server authorization.

Internal audit reasons may distinguish missing, removed, role-mismatch, stale, and cross-workspace cases only under access control. Public errors do not reveal workspace, resource, integration, billing, membership, or invitation existence.

## Human and system actor boundaries

Human authority begins only with server-verified Supabase subject identity and current application membership. `user_metadata`, submitted role/status, client workspace selection, and stale JWT `app_metadata` are never decision inputs.

System actors are created only by server composition roots for an allowlisted name and action scope, such as a future authenticated webhook reconciler or hosting lifecycle scheduler. A system actor is bound to one workspace, one operation, and one capability action; it cannot call membership administration unless a later explicit contract authorizes that named operation. It never receives Owner role or impersonates a member. Webhook signature verification, scheduler authentication, and provider-event deduplication remain with the owning boundary before it requests system authority.

## Supabase Auth, application authority, and RLS

These controls remain distinct:

1. **Supabase Auth** verifies the human subject using `auth.getUser()` at the server boundary.
2. **Application authority** uses fresh membership state and is mandatory before all protected capability behavior, including when the database connection or service role can bypass RLS.
3. **RLS** is defense in depth for direct Data API/database access. Every authority table in `public` or another exposed schema has RLS enabled before grants. `TO authenticated` alone is never sufficient.

Initial safest exposure is no browser write grant and no authenticated mutation policy for workspace, membership, invitation, or audit records; mutations flow through the authorized server service. If direct sanitized reads are later required, policies use `(select auth.uid())`, active membership ownership predicates, both `USING` and `WITH CHECK` for updates, and supporting membership indexes. Membership self-read must not accidentally allow enumeration; Owner list access must be workspace-scoped. Audit writes remain server-only and audit reads Owner-only through a sanitized projection.

RLS policy tests must cover anon, authenticated non-member, current Member, current Owner, removed member, stale JWT Owner claim, cross-workspace rows, and service-role behavior. Views use `security_invoker = true` or remain unexposed with revoked grants. Do not add `SECURITY DEFINER` merely to bypass a policy error. If a narrowly necessary private helper is later proposed, it requires explicit search-path, execute-grant, caller/auth checks, privilege, advisor, and adversarial review. Service-role and database credentials remain server-only through typed environment access; privileged code still calls authority contracts and records the named actor/operation.

The schema slice must review Data API exposure separately from RLS grants, run database advisors when the approved toolchain supports them, and test policy query plans/index coverage. Current JWT claims may help presentation only; current membership persistence controls prompt revocation.

## Durable bounded audit and correlation

Authority audit is not a generic event store. It records membership lifecycle, mutation success/denial/conflict, safe cross-workspace probes, Owner-only decisions, revalidation failures, and named system operations. Downstream capabilities retain their domain events and may store the authority evidence reference with them.

Allowlisted action/target/result vocabularies, maximum correlation lengths, restricted reason codes, and a small bounded metadata schema prevent payload dumping. Never record raw invitation tokens, email bodies, JWT/session tokens, credentials, secrets, provider payloads, preset markdown, prompts, message bodies, or unnecessary personal data. Logs use correlation and audit IDs rather than secret-bearing input. Corrections append a superseding record; UPDATE/DELETE is unavailable to normal application roles.

Exact audit retention, legal hold duration, Owner-visible fields, and privileged support/security/legal access are unresolved policy decisions. Implementation must preserve evidence and expose only a sanitized Owner projection until those decisions are approved; it must not invent a retention period or blanket support role.

## Downstream integration contract

Workspace authority supports each umbrella capability without owning its behavior:

- **Commercial entitlements/usage:** supplies current human/system actor, workspace scope, operation correlation, Member admission for ordinary funded operations, Owner admission for billing/hosting-add-on administration, and revalidation before reservation/commit. Commercial owns subscription, separate lead/AI/SMS balances, top-ups, ledger, and hosting add-ons.
- **Lead pipeline:** supplies Member authorization, workspace-scoped direct/list/batch resource checks, and actor evidence for imports, corrections, transitions, and Won/Lost values. Lead capability owns business identity, stages, outcomes, history, and project relationships.
- **CodeSandbox BYOK:** supplies Owner authorization for create/replace/validate/remove and current Member revalidation before a just-in-time credential lease. BYOK owns encryption, versions, provider validation, and the no-fallback rule.
- **DataForSEO discovery:** supplies Member/workspace admission and revalidation before provider dispatch and snapshot disclosure. Discovery/commercial/lead own bounded inputs, immutable runs, metering, provider evidence, and deduplicated import.
- **Website creation and `DESIGN.md` presets:** supplies Owner authorization for workspace-upload create/replace/delete, Member authorization for selecting available presets, workspace isolation, optimistic actor evidence, and revalidation before inherited CREATE effects. Website capability owns preset versions/content/validation, prompt precedence, lead-backed creation, and the narrow inherited adapter.
- **Telnyx SMS:** supplies Owner authority for templates/sensitive setup, Member authority for confirmed sends, system actor evidence for authenticated events, and pre-dispatch revalidation. SMS/commercial own compliance, sender state, previews, sending, provider identity, and debits.
- **Inbox:** supplies active Owner/Member list/direct/reply authority, removed-member denial, conversation workspace checks, and outbound actor evidence. Inbox/SMS own conversations, messages, unread state, notifications, and reply gates.
- **Hosting lifecycle:** supplies Member project/site access, Owner authority for domains and sensitive hosting settings, named lifecycle system actors, and current pre-effect checks. Hosting/commercial own add-ons, domains, grace, notices, suspension, retention, and deletion orchestration.
- **Owner analytics:** supplies current Owner-only read authorization and workspace scope. Analytics derives measures from downstream source identities and current commercial balances; authority audit is not substituted for domain measures.

The exact V1 preset rule is preserved: Jagwar-managed and workspace-uploaded Inspiration and Style `DESIGN.md` presets are required; each upload is one validated Markdown file; only Owners create/replace/delete workspace uploads; Members may select them; Inspiration code is allowed only in fenced blocks; archive, asset, and Git ingestion are excluded. These are website-capability semantics. Workspace authority enforces only actor role, workspace isolation, concurrency evidence, and audit, and it does not touch editor or CREATE behavior.

## Failure modes

- Missing/invalid Supabase subject: unauthenticated denial; no workspace lookup details.
- Missing, removed, inactive, or mismatched membership: sanitized denial and safe correlated evidence.
- Member at Owner boundary: sanitized denial; no protected read, write, secret access, or provider call.
- Unknown/mismatched resource or indirect relation: same non-enumerating denial.
- Stale expected membership/workspace version: typed conflict and no partial mutation.
- Final-Owner race: transaction rejects/conflicts while retaining an active Owner.
- Duplicate invitation acceptance or operation retry: return the committed result or conflict without duplicate membership/audit effect.
- Audit persistence unavailable: fail closed before new authority mutation where atomic evidence is required; after a known commit, surface reconciliation instead of replaying the mutation.
- Database/RLS unavailable or policy ambiguity: fail closed; do not fall back to JWT/client authority or service-role bypass.
- Correlation input malformed/oversized: reject or replace with server-generated bounded identity; never interpolate into secrets or SQL.
- System actor not allowlisted for the exact action: deny before capability effect.

## Rollout, rollback, and observability

Roll out in dependency order: pure contracts and governance, persistence/RLS, human resolution and decisions, membership lifecycle, audit/system boundaries, then thin transport/composition. Keep all dependent capability entry points disabled until their own SDDs consume the contract. Seed/create an initial workspace and Owner only through an explicit idempotent bootstrap operation that proves the authenticated subject and emits audit evidence; bulk backfill from inherited project ownership is not inferred by this change and requires a separate migration decision.

Observe decision counts by bounded result/reason, conflict rate, removed-member denials, final-Owner rejections, audit write failures, RLS denials, operation retries, and revalidation failures. Metrics and logs contain IDs/correlation only, not tokens, emails, provider payloads, or secrets. Alert on audit persistence gaps and repeated cross-workspace probes without exposing probe targets to workspace users.

Rollback disables new invitation/admin/authority entry points while preserving workspace, membership tombstones, versions, operation results, and audit history. It must never restore removed membership, relax RLS, rewrite Owner history, or delete evidence. Schema rollback is forward-compatible or additive; destructive rollback requires a separately reviewed data-retention plan. Any protected-path rollback needs its own exact resulting hash and approval.

## Security and test strategy

Strict TDD begins each implementation slice with focused failing tests. Required coverage includes:

- pure contract exhaustiveness, exact roles, sanitized decision serialization, and bounded correlation;
- human/system actor derivation, forged claims, active selection non-authority, and stale JWT behavior;
- Member/Owner decisions plus list, direct, indirect, nonexistent, cross-workspace, and mixed-batch cases with indistinguishable public denials;
- invitation identity binding, zero pre-acceptance authority, single activation, expiry/revocation, and replay;
- concurrent same-version mutations, role changes, removal/leave, reactivation, duplicate acceptance, and final-Owner races;
- removed-member next-request denial and pre-effect revalidation after removal/demotion, including retry with the same operation ID;
- append-only/superseding audit, required evidence fields, denied/conflict evidence, size bounds, and secret/payload exclusion;
- SQL/RLS tests for roles and grants, exposed-schema tables, stale claims, service-role bypass with mandatory application checks, views/functions, and ownership indexes;
- transport Zod validation, plain serializable results, sanitized tRPC mapping, and proof no provider/downstream mutation occurs before authority;
- downstream contract fixtures for commercial, leads, BYOK, discovery, presets, SMS, Inbox, hosting, and analytics without importing their internals;
- inherited regression checks proving project membership/invitations, Projects, editor, CREATE, publishing, settings, Stripe, export, and Git are untouched unless a later narrow SDD says otherwise.

Applicable slice gates are focused `bun test`, database tests through the approved Supabase workflow, `bun run typecheck`, web lint, `bun scripts/architecture/check.ts --changed`, structure and pre-push gates, and `git diff --check`. No test or verification command is claimed in this planning phase.

## Dependency-ordered implementation slice forecast

Tasks should later turn this forecast into executable RED/GREEN details. Each future slice should remain a cohesive **250–400 changed-line** review unit, including tests and manifest, and should not split a transaction invariant merely to meet the budget.

| Order | Cohesive slice | Forecast | Dependency/finish boundary |
| --- | --- | ---: | --- |
| 1 | Architecture policy allocation plus pure authority contracts and contract tests | 280–380 | Focused package is permitted, runtime-neutral, publicly exported, and no consumer edge exists yet. |
| 2 | Workspace/membership schema model and schema-level tests | 300–400 | Additive Drizzle definitions and public schema export are reviewable; protected export edit remains blocked pending CCR. |
| 3 | Maintainer-produced migration, RLS/grants/indexes, and adversarial SQL tests | 300–400 | Local database proves exposed-schema isolation and concurrency prerequisites; no generated file is agent-edited. |
| 4 | Human actor repository/resolution and Member/Owner decision tests | 280–380 | Fresh server-derived actor decisions work without transport or client state. |
| 5 | Resource authorization, access-shape helpers, freshness, and pre-effect revalidation | 280–380 | Direct/list/indirect/batch and removed-member behavior pass with sanitized outcomes. |
| 6 | Invitation acceptance/activation and idempotent lifecycle commands | 300–400 | Invitees have no premature access; acceptance activates exactly once. |
| 7 | Versioned role/removal/leave commands and final-Owner transaction races | 320–400 | Conflicts and final-Owner invariant pass under concurrency. |
| 8 | Bounded audit persistence, operation outcomes, and named system actors | 280–380 | Required successes/denials/conflicts are durable without secrets; system scope is enforced. |
| 9 | Thin tRPC router and protected composition/public dependency edges | 250–350 | Zod transport is composed additively; package dependency and protected composition edits have exact approvals. |

If a candidate patch exceeds 400 changed lines, split only at an independently safe contract or runtime boundary; if it falls below 250, combine only adjacent responsibilities that share one invariant. Do not combine downstream capability implementation into these slices.

## Architecture governance and protected edits

Every future slice must first have one reviewed `architecture/slices/*.json` declaration naming the exact governed paths, capability, owning runtime, role, and correct classification against baseline `423e2e924366419e418ee049093872d535eea41a`. The actual diff must match the accumulated declarations. Proposed package allocation also requires a reviewed change to `architecture/policy.json`; this design alone does not permit the package.

Likely protected inherited seams include, subject to exact candidate inventory:

- `apps/web/client/package.json` for the declared `@onlook/workspace-authority` dependency;
- `apps/web/client/src/server/api/root.ts` for router composition;
- `apps/web/client/src/server/api/routers/index.ts` for the public router export; and
- `packages/db/src/schema/index.ts` for the capability schema export.

Any other baseline path discovered in a candidate diff is equally protected. Before **each** protected file is edited, a new per-file Core Change Request must name that exact path and exact resulting SHA-256, its approval entry must exist in `architecture/core-change-approvals.json`, and the reviewed slice manifest must reference that CCR. Existing approvals, wildcards, intent-only approvals, or approval of one file cannot authorize another.

A truthful resulting SHA-256 cannot be precomputed until an exact candidate patch exists. Therefore all protected edits remain blocked at design time. No CCR, approval entry, or slice manifest is created by this phase. Generated migration output and `bun.lock` remain outside agent edits; maintainer-generated candidates still require their reviewed path declarations.

## Decisions and rejected alternatives

- Choose current application membership over JWT role claims; reject `user_metadata`, stale `app_metadata`, route state, and `protectedProcedure` as authority.
- Choose a focused pure package plus server implementation; reject generic Jagwar/shared packages, DB-schema types as public domain contracts, and packages importing app-private services.
- Choose capability-owned resource resolvers; reject workspace authority querying every downstream table or consumers querying authority tables ad hoc.
- Choose workspace-row serialization plus optimistic versions; reject last-write-wins and unlocked Owner counts.
- Choose retained removed memberships and append-only evidence; reject hard deletion that loses revocation/version history.
- Choose server-only mutations plus ownership-aware RLS defense in depth; reject authentication-only policies and blanket service-role bypass.
- Choose additive adjacent router/service/schema seams; reject modifying global tRPC context, repurposing project membership, wrapping editor, or replacing inherited flows.

## Open decisions and blockers

1. Exact audit retention, legal holds, sanitized Owner projection, and privileged support/security/legal access require compliance/security policy.
2. Initial workspace bootstrap and any mapping from inherited users/projects require a separate product/migration decision; this design does not infer workspace ownership from project roles.
3. Invitation delivery provider and exact identity-normalization rules require a security/product decision; stored invitation tokens must remain hashed regardless.
4. Whether direct authenticated Data API reads are needed at launch remains open. Default is no direct write grants and server-mediated sanitized reads.
5. Exact database isolation level, operation-result storage shape, and whether a database constraint trigger is necessary must be selected from concurrency tests, not assumed.
6. The focused package requires architecture-policy allocation, and every protected composition/export/dependency edit requires exact candidate hashes and approved CCRs.
7. Supabase version-specific migration, policy, advisor, and test commands must be verified against current documentation/tooling during implementation; no framework or database workflow replacement is selected here.

## Coherence check

This design preserves proposal/spec authority: durable workspace identity; exactly Owner/Member; explicit invitation/acceptance/activation/change/removal; final-Owner safety; server-derived human/system actors; typed resolve/member/owner/resource/revalidate/membership/audit contracts; sanitized list/direct/indirect/batch denials; optimistic concurrency and pre-effect revalidation; durable bounded audit; distinct Auth/application/RLS controls; narrow privileged access; exact downstream capability support; and exact required V1 preset scope. It remains additive, does not touch the editor, leaves downstream semantics with their owners, and keeps implementation blocked behind native tasks, manifests, maintainer database workflow, and per-file hash-bound CCRs.
