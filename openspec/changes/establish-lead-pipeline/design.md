# Design: Establish Lead Pipeline

## Status and authority

This is the native planning-only design for `establish-lead-pipeline`. It refines this change's proposal and specification under the canonical `reconfirm-jagwar-product-contract` umbrella. OpenSpec is planning authority; the current repository is implementation authority.

This design authorizes no runtime implementation, test, schema edit, migration, manifest, Core Change Request (CCR), generated-file or `bun.lock` edit, provider activation, commit, apply/verify/sync/archive action, editor work, inherited CREATE/project change, or unrelated dirty-file change. Workspace-authority planning is complete, but its runtime is absent. Production composition of every lead operation therefore remains unavailable and hard fail-closed until the approved workspace-authority runtime, persistence, current actor/resource decisions, revalidation, and audit evidence exist.

## High-risk coherence gate

The proposal, specification, umbrella plan, completed workspace-authority plan, and observed repository seams are coherent on the following controlling points:

- Lead pipeline owns workspace-local business identity, one lead projection, fixed V1 stage/outcome rules, exact Won value assertions, durable attempts/project relationships, history, operation results, and public event identities.
- Only approved discovery import can create a V1 lead; manual creation, implicit downstream creation, merge, split, and project reassignment are absent.
- Current state is a monotonic optimistic projection backed by append-only or explicitly superseding evidence. Automatic website and SMS events are monotonic and cannot reopen, regress, or alter Closed outcome/value.
- Current Owner or Member authority is sufficient for ordinary corrections, including reopening, but it must be server-derived and revalidated. Supabase authentication, application authority, and RLS are separate controls.
- Provider and sibling semantics stay with their owners. Lead pipeline consumes DataForSEO identity evidence, website success evidence, SMS accepted-send evidence, Inbox relationship references, and commercial/analytics coordination identities without importing sibling internals.
- Inherited Onlook editor, AI CREATE, project creation, publishing, hosting, export, Git, and project-role behavior remain untouched. Existing projects are not retroactively classified as leads.

The native specification intentionally resolves proposal questions as follows: discovery-only creation; current Members and Owners may reopen with a bounded reason; one lead may have multiple successful projects but each project is related to at most one lead; zero Won amount is valid; exact decimal strings rather than binary floats cross contracts; merge/split/reassignment are not V1. The unresolved policy values listed later remain fail-closed launch blockers rather than design gaps filled by guesses.

## Repository evidence and seam classification

### Observed current repository paths

These paths exist now and ground the design; they are not proposed additions:

- `apps/web/client/src/server/api/trpc.ts` calls server-side Supabase `auth.getUser()` and exposes `protectedProcedure`. It provides authentication, not workspace authorization. It also contains inherited private `@onlook/db/src/client` usage; new lead code must use the `@onlook/db` public entry and must not copy that deep import.
- `apps/web/client/src/server/api/root.ts` is the protected inherited tRPC composition root. `apps/web/client/src/server/api/routers/index.ts` is the protected router export seam. Routers use Zod and return SuperJSON-serializable values.
- No `apps/web/client/src/server/services/lead-pipeline/`, lead router, or lead runtime implementation was observed. Existing router logic generally lives under `apps/web/client/src/server/api/routers/**`; this design follows the repository's new-capability placement rule by keeping new orchestration in a service and transport thin.
- `packages/db/src/index.ts` is the public database package entry and re-exports `./schema`; `packages/db/src/schema/index.ts` is the protected inherited schema composition seam. Capability schemas are grouped under folders such as `project/`, `subscription/`, and `domain/`.
- `packages/db/src/schema/project/project.ts`, `packages/db/src/schema/project/create.ts`, and `packages/db/src/schema/user/user-project.ts` show current project/create/membership persistence. They are project-centric, use inherited `ProjectRole`, and establish neither workspace ownership nor lead identity. They must not be repurposed.
- `apps/web/client/src/server/api/routers/project/helper.ts` demonstrates inherited sanitized direct, indirect, and deduplicated batch access checks. Its project-role authority is not reusable workspace authority, but its non-enumerating behavior and all-items batch discipline are relevant test evidence.
- `packages/db/drizzle.config.ts` uses declarative authored schema under `packages/db/src/schema` and generated migration output under `apps/backend/supabase/migrations`. `db:gen` is maintainer-only. Existing migrations enable RLS, but `apps/backend/supabase/migrations/0006_rls.sql` also contains inherited `SECURITY DEFINER` project helpers and authentication/project-role policies; those are inherited behavior, not a precedent for lead authorization.
- `apps/web/client/src/utils/supabase/server.ts` is the cookie-bound publishable-key server client. `apps/web/client/src/utils/supabase/admin.ts` constructs a server-only service-role client that bypasses RLS. Lead services must not treat either authentication or bypass capability as application authority.
- `architecture/policy.json` already allocates `packages/leads` as an allowed focused pure capability package and prohibits it from importing UI, transport, persistence, provider, Drizzle/Supabase, or application dependencies. No architecture-policy expansion is needed merely to create that package.
- `package.json` declares Bun workspaces and `apps/web/client/package.json` declares workspace dependencies explicitly. A future web-client dependency on `@onlook/leads` would require a protected manifest edit and lockfile reconciliation must be stopped rather than agent-generated if it changes `bun.lock`.
- No authored Supabase SQL test convention or `packages/db` schema-test convention was observed. Future slices must confirm exact test paths and installed-tool commands before their reviewed manifests rather than pretending a convention exists.

### Observed unrelated dirty work

`packages/business-policy/package.json`, `packages/business-policy/src/index.ts`, `src/release.ts`, fixtures, and extensive tests are present as Jagwar-owned repository work. The public code models immutable policy releases, versioned snapshots, strict payload validation, canonical JSON, and secret-shaped-key rejection. It is useful evidence that policy values can be versioned and fail closed, but it is explicitly treated here as unrelated dirty work—not BMAD/Telio delivery authority and not an implementation dependency selected by this design. This phase does not modify it. A future composition may adapt its approved public release contract to the lead policy port only after that dependency and exact release kinds are separately reviewed; lead contracts do not import it now.

No current lead runtime, workspace-authority runtime, `packages/leads`, lead schema, or lead migration was observed. Historical BMAD/Telio, editor, Onlook, generated, lockfile, and unrelated workspace-authority files are not delivery surfaces for this change.

### Proposed candidate paths

These are planning candidates, not approved manifests or permission to create files:

```text
packages/leads/                              # focused runtime-neutral public contract/rules
  package.json
  src/index.ts                               # sole intentional package entry
  src/contracts.ts                           # IDs, commands, results, projections, events, ports
  src/pipeline.ts                            # fixed-state/manual/automatic pure decisions
  src/identity.ts                            # provider/fingerprint decision inputs and conflicts
  src/money.ts                               # canonical exact-decimal and policy-driven validation
  test/*.test.ts

packages/db/src/schema/lead-pipeline/        # capability-owned persistence
  index.ts
  business.ts
  lead.ts
  identity.ts
  history.ts
  operation.ts
  website.ts
  event.ts
packages/db/test/lead-pipeline-*.test.ts     # candidate only; exact convention must be reviewed

apps/web/client/src/server/services/lead-pipeline/
  index.ts                                   # intentional server-only app-local entry/composition
  repository.ts
  policies.ts
  identity.ts
  reads.ts
  commands.ts
  website.ts
  sms.ts
  events.ts
  *.test.ts

apps/web/client/src/server/api/routers/lead-pipeline/
  index.ts                                   # thin Zod/tRPC Member-facing transport
  index.test.ts

apps/backend/supabase/tests/lead-pipeline-*.sql  # candidate only, if approved DB test workflow supports it
apps/backend/supabase/migrations/<generated>     # maintainer-produced exact path only
```

Files should be combined or split by responsibility as a candidate diff is budgeted; this tree is not a mandate to create every file. No path under editor, `components/store/create`, inherited project routers, `packages/ai`, `packages/code-provider`, or CREATE is proposed.

## Architecture decision and dependency direction

Use a **focused pure lead contract package with one Next-server capability owner and capability-owned persistence**:

```text
browser / future authenticated server consumer
  -> thin Zod transport or named server-to-server boundary
    -> lead-pipeline server composition entry
      -> workspace-authority port (hard required)
      -> approved lead-policy port (hard required for policy-dependent actions)
      -> lead repository transaction boundary
        -> lead-pipeline tables and durable event/outbox evidence

future discovery / website / SMS / Inbox / hosting / commercial / analytics service
  -> @onlook/leads public contracts
  -> injected app-local lead implementation
  X no lead table query and no sibling internal import
```

`packages/leads` is the smallest intentional reusable seam because actual approved consumers span discovery, website creation, SMS, Inbox, hosting/project reads, commercial coordination, analytics, Next transport, and potentially reconciliation workers. It contains stable persistence-neutral command/result/event shapes and pure deterministic decisions only. It imports no app, Next.js, tRPC, React, Supabase, Drizzle, provider, UI, database, or sibling capability. It has one public `@onlook/leads` entry and no `/src/*` consumer imports.

The app-local `services/lead-pipeline/index.ts` is the server composition/public entry for consumers inside `apps/web/client`. It wires authority, policy, clock/ID generation, repository transactions, and event publication. Reusable packages never import this app-private service. Transport and app-local sibling composition may import it. The DB schema imports neither app code nor the pure package; persistence adapters translate between schema and public contract types.

Lead pipeline may receive capability-owned verification ports—for example, project ownership evidence or an authenticated SMS authority attestation—but it never imports project, website, SMS, Inbox, commercial, hosting, analytics, or discovery internals. Conversely, consumers do not query lead tables or import lead service internals. No generic package, central event store, global tRPC workspace context, editor wrapper, or project lifecycle hook is introduced.

## Public contract

Names may be refined while preserving semantics. The pure package should expose opaque string IDs, fixed unions, plain serializable values, and injected ports rather than persistence types.

```ts
type LeadStage = 'new_lead' | 'website_building' | 'contacted' | 'closed';
type LeadOutcome = 'won' | 'lost';

type LeadDecision<T> =
  | { kind: 'allowed'; value: T; operation: OperationReceipt }
  | { kind: 'replay'; value: T; operation: OperationReceipt }
  | { kind: 'denied'; code: 'not_authorized' | 'invalid_command' | 'policy_unavailable'; correlationId: string }
  | { kind: 'conflict'; code: 'stale_version' | 'identity_conflict' | 'operation_mismatch' | 'relationship_conflict'; correlationId: string };

type ExactMoney = {
  amount: string;                 // canonical non-negative base-10 decimal, never number
  currency: string;               // approved uppercase active ISO 4217 code
  currencyPolicyVersion: string;
};

type LeadProjection = {
  workspaceId: string;
  businessId: string;
  leadId: string;
  stage: LeadStage;
  outcome?: LeadOutcome;
  wonValue?: ExactMoney;
  version: string;                // serialized monotonic integer
};
```

All commands carry authoritative workspace input, stable bounded operation ID, server request correlation, and the semantic inputs needed to hash the request. State-bearing commands carry `expectedLeadVersion`. Human commands receive a server-derived authority actor from the workspace-authority adapter, not submitted actor fields. Automatic events receive a named, action-scoped system actor or revalidated initiating human evidence as specified by their owning capability.

The intentional operation families are:

1. `createOrResolveDiscoveryLead` — the only V1 creation operation; stable provider identity takes precedence, approved fingerprint fallback is used only when permitted, and the result reports `created` or `existing` with stable lead/import-decision identity.
2. `getLead`, `listLeads`, `getLeadHistory`, `resolveLeadForConversation`, and `getLeadForProject` — scoped persistence-neutral reads with sanitized failure.
3. `correctLead` — manual fixed-stage, outcome, Won value, clearing, backward correction, and reopening with expected version and required bounded reason.
4. `beginWebsiteAttempt`, `recordWebsiteAttemptFailure`, `recordWebsiteAttemptSuperseded`, and `attachSuccessfulProject` — attempt lifecycle plus atomic successful relationship/non-regressing transition.
5. `applyAcceptedSms` — consumes only SMS-owned authenticated durable accepted-send evidence.
6. `getProjectRelationship` and bounded batch variants — hosting/project ownership evidence without lifecycle mutation.
7. `readCommittedEvents` or an injected publisher/outbox dispatcher — stable committed event envelopes for analytics and consumers; dispatch acknowledgment is not domain truth.

Public results never expose table names, SQL/provider errors, fingerprint candidate details, cross-workspace existence, raw business/provider payloads, messages, prompts, credentials, JWT/session data, or authority internals.

## Canonical identity model

### Aggregate and invariants

- A canonical **business** is owned by exactly one workspace and contains only the bounded current business presentation needed by lead workflows. It is not a Supabase user, workspace member, subscriber, billing customer, or client portal identity.
- A **lead** is the one-to-one pipeline projection for that business. Enforce unique `(workspace_id, business_id)` and retain both workspace IDs explicitly so ownership is queryable and RLS/indexable. IDs are globally opaque, but all uniqueness and reads remain workspace-scoped.
- A provider identity is `(workspace_id, provider_namespace, provider_business_id)`. Exact stable identity has first precedence and is unique within the workspace. The same provider ID in another workspace is independent.
- A fallback identity is `(workspace_id, fingerprint_policy_version, fingerprint_hash)`, where the hash is computed from the approved normalized evidence. The exact fields/transforms are not chosen here. If the applicable approved policy is missing, ambiguous, or unsupported, fallback resolution returns `policy_unavailable` with no creation.
- Provider and fallback source references attach to one business and retain source-run/import evidence. Mutable display fields are not identity keys.

### Resolution algorithm

Within one transaction and authoritative workspace scope:

1. Validate the source as an eligible displayed discovery result through a discovery-owned attestation contract; do not accept arbitrary manual business input.
2. Resolve the exact provider identity when supplied. Independently evaluate the approved fingerprint candidate when policy permits, so disagreement is detectable rather than hidden by precedence.
3. If provider and fallback resolve the same business, return it. If provider resolves one business while fallback resolves another, if either key maps ambiguously, or if incoming evidence conflicts with a prior binding, return `identity_conflict` without choosing or exposing candidates.
4. If only one unambiguous identity resolves, attach only new non-conflicting source evidence and return the existing lead. A repeated identical source does not append duplicate history.
5. If none resolves, insert one business, one `New lead` projection, source identities, creation history, operation result, and committed event atomically.
6. Database uniqueness plus transaction retry handles simultaneous imports. A uniqueness loss is re-read and classified as existing/replay only when all semantic evidence agrees; otherwise it is a conflict.

Identity corrections never update an old binding in place. They append a new binding or superseding identity-history record that names the prior evidence. V1 has no user-facing merge, split, rebinding of one canonical business into another, or manual creation. A collision creates reviewable conflict evidence only; resolution tooling is a later explicit change.

Fingerprint history stores policy version, fingerprint hash, allowlisted component presence/normalization result codes, and source reference—not unrestricted raw provider records or unnecessary PII. Provider IDs are bounded identifiers, not provider payloads.

## Persistence model and query contract

Exact SQL names may be refined, but implementation should retain these capability-owned records:

1. **Business projection:** workspace, business ID, bounded display fields, current identity-presentation version, tombstone/privacy state, timestamps.
2. **Provider identity binding:** workspace, provider namespace/ID, business, source reference, created history/event ID, optional superseded-by reference. Active uniqueness prevents two businesses sharing one provider identity in a workspace.
3. **Fingerprint binding:** workspace, policy version/hash, business, bounded normalization evidence, source reference, optional supersession. Active uniqueness prevents duplicate fallback identity under one policy version.
4. **Lead projection:** workspace, lead, business, fixed stage, nullable outcome, nullable exact Postgres `numeric` Won amount, nullable currency, currency-policy version, monotonic `bigint` version, timestamps. Database checks enforce stage/outcome/value pairing and non-negative amount. Drizzle returns exact numeric as a string; no JavaScript number or binary float enters the contract. Currency scale and active-code validation are performed against the approved versioned policy before server-only writes.
5. **Lead history:** immutable event ID, workspace/lead, event kind/action/source, prior and resulting stage/outcome/exact value, human or named-system actor evidence reference, authority freshness, server time, request/operation/source-event IDs, expected/resulting versions, bounded reason/metadata, and optional `supersedes_history_id`. Database roles used by ordinary application paths receive no UPDATE/DELETE.
6. **Durable operation result:** workspace, command/trigger kind, operation ID, semantic request hash, result kind, bounded denial/conflict code, stable semantic result snapshot or committed record/event references, request/actor evidence, timestamps, and reconciliation state. Unique `(workspace, kind, operation_id)` drives replay. A reused key with another semantic hash returns conflict.
7. **Website attempt:** workspace, attempt ID, lead, stable website operation ID, pending/succeeded/failed/superseded state, version, bounded outcome evidence, and event IDs. Pending includes ambiguous external outcomes; ambiguity is not failure.
8. **Lead-project relationship:** workspace, lead, project ID, successful attempt, event/time/evidence. Enforce global unique `project_id` (and workspace-scoped query indexes) so one inherited project can relate to only one lead. The project ownership port must prove the same workspace before insert. There is no reassignment or cascade from project deletion.
9. **Committed lead event/outbox:** stable event ID, workspace, lead/business/attempt/relationship references, event type/schema version, lead version, supersession reference, bounded payload, commit time, and dispatch status/attempt metadata. Domain event immutability is independent from delivery retries.

Likely demonstrated indexes are: leads by `(workspace_id, updated_at, id)` for keyset lists; `(workspace_id, stage, updated_at, id)` for stage filters; provider and fingerprint unique lookup keys; lead history by `(workspace_id, lead_id, created_at, event_id)`; operations by unique scope and reconciliation status; attempts by `(workspace_id, lead_id, created_at)` and unique operation identity; project relationship by unique project plus `(workspace_id, lead_id)`; and outbox by undispatched status/time. Counts, filters, cursors, joins, and indirect reads must all start with workspace predicates. Exact indexes require query-plan evidence; no broad speculative indexes are mandated.

## Fixed state, correction, and exact money rules

The pure state decision receives current projection plus a command/event and returns either no mutation with typed result or one complete next projection/history draft.

- Manual correction may target any fixed V1 stage from any current stage, including the same stage when correcting outcome/value and backward movement/reopening. It requires current Owner/Member evidence, exact expected version, and a non-empty reason within the approved bound.
- Target `closed` requires exactly `won` or `lost`. `lost` has no value. `won` may have no value or one valid pair. Any non-Closed target clears current outcome and value together. Current values are always copied to prior history before clearing/replacing.
- Won value accepts a canonical decimal string such as `0`, `12`, or `12.34`, never a number. Scientific notation, signs other than permitted non-negative form, NaN/Infinity, commas, lowercase/unsupported currency, excess policy scale, or an unpaired amount/currency is denied. The server canonicalizes after parsing into an arbitrary-precision decimal representation and persists Postgres exact `numeric`; it never performs floating arithmetic.
- The approved currency policy version is stored with each value so analytics can reproduce validation. Lead pipeline preserves currencies separately and performs no conversion or combined cross-currency total.
- Every committed correction increments lead version exactly once and appends one history/event record containing the entire prior/result projection. It does not rewrite the transition it corrects.
- Automatic website transition maps only `new_lead` to `website_building`; automatic SMS transition maps `new_lead` or `website_building` to `contacted`. Other current states remain unchanged. A truthful attempt, relationship, or accepted-event result still commits/deduplicates when stage does not change, but no fake transition/version increment is emitted unless the projection changes.

## Atomic commands, durable outcomes, and concurrency

Every operation first resolves fresh authority and validates bounded input, then enters a database transaction. A stable operation key is data and idempotency, never authority.

1. Claim or inspect `(workspace, kind, operation_id)`. Equivalent committed semantics return `replay` with the same stable result. Different semantics return `operation_mismatch` conflict. Concurrent claims serialize through the unique row/constraint.
2. Lock records in a consistent order: operation scope, identity keys/business where applicable, then lead projection, attempt, and project relationship. For current-state mutations, lock the lead and compare `expectedLeadVersion`, or use an equivalent conditional update that proves exactly one row changed.
3. Evaluate all identity, stage, outcome, value, ownership, and policy invariants before writing.
4. Atomically write projection/attempt/relationship changes, history, committed event/outbox, and final operation result. Any invariant or stale failure leaves no partial domain mutation.
5. Domain denial/conflict evidence required by policy is written as a bounded final operation result in the authorized request workspace. A cross-workspace guessed target and nonexistent target produce the same public result and no target details. Authentication failure before an authoritative workspace exists is not admitted as a lead mutation; workspace authority owns that safe denial evidence.

Identity races use unique constraints plus bounded transaction retry under the approved isolation level. If testing proves read/write identity disagreement needs stronger serialization, use serializable transactions or a reviewed transaction-scoped key lock; do not invent an unsafe hash lock or `SECURITY DEFINER` shortcut. Lead-state races are serialized by the lead row/CAS version. Project relationship races are resolved by the unique project constraint. Operation results distinguish a semantic replay from a conflicting key reuse.

A known committed operation whose event dispatch later fails is not rerun. The outbox is retried/reconciled. If a transaction outcome is genuinely unknown, the same operation identity is queried/replayed before any retry. Durable results are the recovery authority, not logs.

## Workspace authority and access shapes

Production construction requires an implementation of the completed workspace-authority public ports:

- resolve current human actor from the authenticated Supabase subject and requested workspace;
- require current Member (Owner satisfies Member);
- authorize exact lead, source-run, conversation, project, event, attempt, or other capability-owned resource ownership through an owner-supplied resolver;
- create narrowly named system actors for authenticated automatic boundaries;
- carry audit-safe actor/freshness/request/operation evidence; and
- revalidate immediately before a sensitive database commit or before an owning capability's external dispatch where authority could have changed.

Until those runtime ports exist, the production lead factory must have no permissive default and should throw/return a typed unavailable state during composition. Test doubles are allowed only in isolated tests. Inherited project roles, `protectedProcedure`, client workspace selection, submitted actor/version claims, JWT role metadata, or service-role access cannot satisfy the dependency.

Access enforcement is shape-specific:

- **List/count/page:** resolve Member first, then query with mandatory `workspace_id = actor.workspaceId`; filters, keyset cursor, count, and aggregate share that predicate. Cursor data is opaque and cannot select another workspace.
- **Direct:** query by both workspace and opaque ID. Existing cross-workspace and nonexistent identifiers map to identical public `not_authorized` denial.
- **Indirect:** the owner-supplied resolver performs the complete scoped relationship, such as conversation → lead or project → relationship → lead. Missing and mismatched chains are indistinguishable publicly.
- **Batch:** deduplicate inputs, bound batch size, and authorize every element. Mutating, metered, or dispatching batches are all-or-nothing; no allowed element authorizes another and no partial existence/status list leaks denied items. A read batch may filter only if a later consumer specification explicitly permits it and count/cursor metadata cannot leak exclusions.

Human correction commits revalidate current Member immediately before transaction mutation. Discovery revalidates before provider dispatch in discovery and again before lead import commit. Website/SMS owners revalidate before their irreversible external boundary; their later authenticated system event is separately authorized and workspace-bound when applied to leads. Removed members are denied on the next operation/revalidation even if an earlier UI/read allowed them.

## Discovery create-or-resolve and commercial coordination

Discovery owns DataForSEO execution, immutable displayed snapshots, displayed-business eligibility, provider/source evidence, and commercial reservation/finalization. Lead pipeline owns only identity resolution and lead creation.

The safe saga is:

1. Discovery authorizes the Member, validates a displayed snapshot item, and uses its own stable import operation identity. Commercial may reserve but must not finalize a new-lead charge merely from intent.
2. Discovery calls `createOrResolveDiscoveryLead` with a bounded discovery attestation containing workspace, source run/result identity, provider identity if approved, normalized input evidence, actor, and operation correlation.
3. Lead pipeline atomically returns `created`, `existing`, `replay`, `denied`, or `conflict`, always with a stable import-decision identity when a semantic result committed.
4. Discovery/commercial finalize a lead charge only for `created`, keyed by that immutable import-decision identity. `existing`/`replay` releases or resolves without a second charge. A conflict is non-chargeable pending review.
5. Crash recovery repeats each owner operation by the same IDs. Lead pipeline does not call commercial internals, mutate balances, or claim an atomic cross-capability/database transaction. Reconciliation can prove whether lead creation committed before finalizing/releasing the commercial reservation.

This contract makes the lead/import decision stable enough for exactly-once commercial behavior without making lead pipeline the metering owner.

## Website attempts and project relationships

`beginWebsiteAttempt` authorizes an existing lead and creates/replays one pending attempt keyed by workspace + website operation ID. It does not invoke inherited project creation, editor, CREATE, AI, CodeSandbox, preset, hosting, or publishing behavior. Website creation owns those actions and their success semantics.

After the external/inherited flow:

- Definite pre-success failure may mark the same attempt `failed` with bounded evidence. A retry of the same operation resolves the same attempt; creating a new attempt requires a new operation identity.
- Ambiguous timeout/outcome remains `pending` and is reconciled by the website owner. It is not represented as failed or succeeded.
- `attachSuccessfulProject` accepts website-owned success evidence and a project-ownership resolver. In one lead transaction it verifies the attempt/lead/workspace, proves the inherited project belongs to the same workspace through the separately approved project-authority seam, inserts the unique relationship, marks the attempt succeeded, applies only the non-regressing website transition, appends history/events, and finalizes the operation result.
- A success arriving after Contacted or Closed may commit the truthful relationship while leaving stage/outcome/value unchanged. Retries return the same relationship/result. A project already attached to another lead conflicts without reassignment.
- Multiple separately identified successful attempts/projects may belong to one lead. Existing inherited projects remain unassigned. Project archive/delete/recreate/publish/host/domain events neither cascade-delete the relationship nor mutate lead state. A later lawful privacy tombstone may minimize the relationship while retaining approved evidence.

The website capability must later establish the narrow public project creation/ownership evidence. This design creates no adapter around editor/CREATE and has no dependency on project lifecycle.

## SMS accepted-event boundary

Lead pipeline consumes only an `AcceptedOutboundSms` public fact produced by the SMS authority after its own authenticated, compliant, durable acceptance decision. The fact includes workspace, lead, SMS operation/event identity, accepted evidence identity/time, bounded schema version, and workspace-authority system/human evidence. It contains no message body, recipient details unnecessary to the lead transition, provider payload, credential, or Telnyx status vocabulary.

Lead pipeline does not interpret Telnyx callbacks, preview, confirmation, lookup, reservation/debit, invocation, delivery, reply, rejection, or timeout. SMS owns exact status mapping, webhook authentication, reconciliation, provider-message identity, and commercial effects.

- Preview/confirmation/reservation/delivery/reply or unauthenticated claims are denied before lead mutation.
- Ambiguous provider timeout emits no accepted fact and causes no lead transition. SMS reconciliation may later issue the accepted fact under the same stable SMS operation identity.
- Equivalent replay returns the committed semantic result. Different lead/acceptance semantics under the key conflict.
- Out-of-order accepted facts can advance New lead/Website building to Contacted but leave Contacted and Closed unchanged. They never reopen or change Closed outcome/value.

## Stable consumer events and readiness contracts

Committed event envelopes use stable UUID/opaque IDs, workspace and aggregate IDs, event/schema version, source operation, lead version, server commit time, authority evidence reference, and optional supersession pointer. Payloads are bounded persistence-neutral snapshots. Delivery is at-least-once; consumer idempotency uses event ID. Event ordering is per lead version where state changed; relationship/attempt events that do not change lead version remain independently ordered by event ID/commit time. Consumers reconcile from authoritative reads when gaps occur.

- **Discovery:** may call only discovery create-or-resolve; gets created/existing/replay/conflict and stable import decision. It cannot manually create or inspect identity candidates.
- **Website creation:** may begin/replay attempts and attach only authenticated successful project evidence. It retains CREATE/preset/BYOK/commercial semantics.
- **SMS:** may submit only authenticated accepted-send facts. It retains Telnyx interpretation and reconciliation.
- **Inbox:** may resolve an already-owned conversation relation to a scoped lead projection through an ownership port/read contract; no message data enters leads and Inbox cannot create a lead.
- **Hosting/project:** may read scoped project relationship evidence. Hosting/project lifecycle cannot invoke a transition.
- **Commercial:** receives immutable lead/import/attempt/source operation IDs sufficient for reservation/finalization dedupe; it retains entitlement, balances, ledgers, and charge policy.
- **Analytics:** consumes identity-created, transition/correction, outcome/value, attempt, and relationship event IDs plus lead version/supersession. It retains projections/checkpoints, staleness, activation derivation, reconciliation, and currency-separated presentation.

No consumer is downstream-ready for production until workspace authority exists. Discovery additionally needs approved fingerprint policy and its own source attestation; website needs project ownership/success evidence; SMS needs accepted-event authentication; Inbox needs a conversation ownership link; commercial needs ledger contracts; analytics needs projection/reconciliation. Lead design does not implement those owners.

## Supabase Auth, application authority, RLS, grants, and privileged access

1. Supabase Auth establishes the human subject through the existing server authentication seam.
2. Workspace authority establishes current workspace membership/role/resource authority and revalidation. It is mandatory even when the database client can bypass RLS.
3. Lead service enforces lead-domain rules and owns transactions.
4. RLS is defense in depth for every lead table in an exposed schema.

Safest initial exposure is no `anon` access, no browser mutation grants, and no direct authenticated write policy. Server-mediated reads are preferred until a separately approved need for direct Data API reads exists. If authenticated direct reads are approved, grants and RLS are reviewed separately: RLS must be enabled before grants, policies must use current application membership ownership rather than `TO authenticated` alone, use `(select auth.uid())` where applicable, and have indexes supporting the membership/workspace predicate. UPDATE requires a SELECT policy and both `USING` and `WITH CHECK`; ordinary roles receive no history/operation/event UPDATE or DELETE.

Views are `security_invoker = true` or unexposed with grants revoked. Do not add `SECURITY DEFINER` to bypass RLS. Any truly necessary private helper requires explicit search path, execute revocation/grant, caller/auth checks, privilege/advisor review, and adversarial tests. Service-role use remains server-only, narrowly named, workspace-checked, and audited; it is never a substitute for workspace authority and no credential enters result/history/log metadata.

Database tests must cover anon, unauthenticated, authenticated non-member, current Member, current Owner, removed member, stale JWT claims, cross-workspace IDs, list/count/cursor leakage, indirect/project relationship access, mixed batches, service-role behavior with mandatory application checks, table grants/Data API exposure, views/functions, and immutable-history privileges. Query plans should be inspected for membership/workspace, list, identity, operation, relationship, and outbox paths. Supabase CLI/docs and command syntax must be verified during implementation; this planning phase does not claim current online documentation verification or run database commands.

## Retention, privacy, legal holds, and tombstones

Ordinary correction, closure, source removal, project deletion, workspace cancellation, or application-level deletion never hard-deletes canonical identity, transition/correction, operation-result, attempt, relationship, authority, or event evidence.

An approved deletion/minimization operation must:

- run as a narrowly authorized human/system operation under an approved compliance policy version;
- append a tombstone/superseding event identifying scope, legal basis/policy reference, actor, time, and replaced records;
- remove or irreversibly minimize only approved personal/display/provider/fingerprint components;
- retain only the minimum lawful opaque identity, workspace isolation, idempotency, security, financial-audit coordination, relationship, and event-correlation evidence permitted or required;
- preserve legal holds and prevent ordinary roles from reversing the tombstone; and
- notify/reconcile consumers by stable superseding event rather than silent mutation.

No duration is selected. Exact retention periods, deletion timing, legal holds, anonymized fields, Owner visibility, and privileged support/security/legal access are unresolved compliance decisions. Automated deletion fails closed and preserves restricted evidence when policy is absent or ambiguous. The umbrella's durations for other capabilities are not silently applied to leads.

## Failure modes and observability

- **Workspace authority unavailable/ambiguous:** hard unavailable/denied; no read, import, mutation, relationship, event, metering signal, or provider action.
- **Lead policy unavailable:** fingerprint creation, metadata/reason validation, money validation, or deletion requiring that policy is unavailable; stable provider resolution may proceed only if all applicable policy-dependent evidence requirements are approved.
- **Identity disagreement/collision:** typed conflict, no merge/selection/disclosure, bounded conflict evidence and review metric.
- **Stale lead/attempt version:** conflict with no partial projection/history/relationship/event; bounded durable conflict result where policy requires it.
- **Duplicate equivalent operation:** replay original result. Different semantics under one key: conflict.
- **Database transaction/uniqueness race:** bounded retry; then typed conflict/unavailable, never duplicate identity.
- **Outbox failure after commit:** retain committed domain result and retry dispatch; never rerun domain mutation.
- **Audit/required operation-result persistence unavailable:** fail before mutation. Unknown post-commit state is reconciled by operation ID before retry.
- **Website/SMS ambiguity:** attempt/event remains pending at its owner; no false relationship or stage change.
- **Cross-workspace/nonexistent probe:** identical public denial; safe internal correlation only.
- **Project already related:** conflict; preserve original relation and no transition.
- **Invalid reason/metadata/money:** denied without version change; prohibited payload is excluded/rejected before persistence.
- **RLS/grant/policy uncertainty:** fail closed; no JWT/client/service-role fallback.

Structured logs and metrics use workspace-safe opaque IDs and correlation only. Observe operation allowed/denied/conflict/replay counts by bounded code; identity collision and policy-unavailable rates; stale-version conflicts; automatic no-op versus transition counts; attempt age/status and ambiguous-pending backlog; project uniqueness conflicts; SMS/website replay and ordering; outbox lag/retry/dead-letter state; authority revalidation failures/removed-member denials; RLS denials; history/operation write failures; and deletion/legal-hold reconciliation. Never log provider payloads, message bodies, prompts, fingerprint raw components, credentials, tokens, or unnecessary PII. Alert on operation-result/audit gaps, repeated workspace probes, and aged reconciliation work.

## Rollout and rollback

Roll out only after workspace authority runtime/security evidence and all applicable policy decisions are approved:

1. pure contracts/rules with no consumers;
2. additive schema and maintainer-generated migration with RLS/grants/index tests;
3. disabled server composition with authority and policy hard dependencies;
4. authorized discovery-only create/resolve and scoped reads;
5. corrections/outcomes/value;
6. website attempt/relationship interface;
7. SMS accepted-event interface and event dispatch;
8. thin human transport and separately authorized consumers.

Feature flags may hide entry points but never substitute authority or policy. Existing inherited projects remain untouched and unassigned. No backfill from project title, user/project role, editor state, chat, hosting, or existing subscriptions is permitted. Any migration/import of historical businesses/projects is a separate owner-approved change.

Rollback disables new lead admissions, correction/automatic command entry, consumer dispatch, and provider-owned calls while preserving businesses, leads, versions, operation results, identity/history, attempts, truthful project relationships, events/outbox, tombstones, and authority evidence. Pending external outcomes remain reconcilable. Rollback never deletes evidence, regresses projection, detaches a truthful project, recreates duplicate identities, restores removed-member access, or silently undoes a charge. Corrections use new superseding records. Schema rollback is additive/forward unless a separately approved retention plan permits destruction. Every protected rollback edit needs its own exact resulting hash and approval.

## Security and test strategy

Strict TDD begins every future slice with retained focused failing evidence, then the smallest GREEN implementation, triangulation, and refactor only while green. Required coverage includes:

- public contract exhaustiveness, fixed vocabularies, serializability, opaque/bounded IDs, dependency neutrality, and no deep/private imports;
- exact manual transition matrix, reopening, outcome/value clearing, no automatic regression, same-state corrections, and version increments;
- exact decimal canonicalization without `number`, zero, currency-scale/version validation, pair invariants, unsupported/lowercase/excess-scale rejection, and currency separation;
- provider-first/fingerprint fallback resolution, missing-policy failure, disagreement/collision, same-workspace uniqueness, cross-workspace independence, source replay, and no merge/split/manual creation;
- transaction races for two corrections, two creates under provider/fingerprint identities, operation-key reuse, project uniqueness, attempt completion, and out-of-order website/SMS events;
- atomic proof that projection, history, relationship, event, operation result, and analytics/metering identity are all committed or none are;
- workspace Member/Owner, removed member, forged claims, list/direct/indirect/nonexistent/cross-workspace/mixed-batch cases, sanitized denials, and zero downstream effect before allow/revalidation;
- website pending/failed/ambiguous/succeeded/retry/multiple-project behavior and lifecycle non-coupling;
- SMS accepted authority, non-authoritative status rejection, timeout reconciliation, replay, out-of-order behavior, and absence of Telnyx internals/message content;
- discovery/commercial saga crash points proving existing/replay does not signal a second charge and created import identity is stable;
- append-only/superseding history, bounded allowlisted metadata/reasons, secret/raw-payload exclusions, operation recovery, outbox replay, privacy tombstone, and unresolved-retention failure;
- RLS/grants/advisor/query-plan tests described above; and
- inherited regression evidence that Projects, project roles/invitations, editor, CREATE, fixed template, sandbox, publishing, settings, Stripe, export, Git, and existing project lifecycle were not touched or reinterpreted.

Applicable gates per future slice are focused Bun tests, approved database tests and version-verified Supabase commands where relevant, `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, pre-push gate for integration slices, and `git diff --check`. `db:gen` is never run by agents.

## Dependency-ordered implementation slice forecast

A later tasks phase should turn this design into executable details. Forecast is **High risk**, 9 cohesive chained Strict-TDD slices totaling approximately 2,650–3,500 changed lines. Each slice, including tests and manifest, targets 250–400 changed lines and must remain independently safe. Do not split a transaction invariant to satisfy the budget.

| Order | Cohesive slice | Forecast | Independent finish boundary |
| --- | --- | ---: | --- |
| 1 | Pure lead contracts, fixed transition/money/identity decisions, and contract tests | 320–390 | `@onlook/leads` is runtime-neutral, policy ports fail closed, and has no runtime consumer yet. |
| 2 | Business/lead/provider/fingerprint/current-projection schema and schema tests | 310–400 | Additive identity/current-state model and constraints are reviewable; no API or migration activation. |
| 3 | Maintainer-generated migration, RLS/grants/indexes, and adversarial DB tests | 310–400 | Local DB proves workspace isolation, exact numeric/check constraints, uniqueness, and privilege boundaries; agents do not edit generated SQL. |
| 4 | Durable operation/history/event repository transaction primitives | 290–390 | Optimistic CAS, operation replay/conflict, append-only evidence, and outbox atomically pass without transport. |
| 5 | Authorized discovery create-or-resolve plus scoped direct/list/history reads | 310–400 | Discovery-only identity creation and commercial decision identity work behind hard workspace/policy ports. |
| 6 | Manual corrections, reopening, Closed outcomes, Won value, and concurrency | 290–390 | Member corrections are exact, history-preserving, atomic, and stale-safe. |
| 7 | Website attempts, successful project relationship, and non-regressing transition | 300–400 | Retries/ambiguity/multiple projects/one-project invariant pass without touching inherited CREATE/project lifecycle. |
| 8 | SMS accepted-event application, event reconciliation, and downstream contract fixtures | 270–380 | Authenticated accepted facts are replay/order-safe and public event fixtures cover Inbox/hosting/commercial/analytics boundaries. |
| 9 | Thin lead tRPC transport, protected composition/dependency exports, and integration hardening | 250–350 | Zod transport and app composition are additive, fail closed, and all exact protected approvals/regression gates pass. |

If a candidate is over 400 lines, split at an independently safe package/schema/service/consumer boundary and obtain another exact manifest; if under 250, combine only adjacent responsibilities sharing one invariant. The migration slice counts maintainer-generated output but agents neither generate nor edit it. No slice includes editor/CREATE/project lifecycle implementation or sibling provider behavior.

## Architecture governance and likely protected paths

Before **every** future slice, exactly one reviewed `architecture/slices/lead-pipeline-0N-<name>.json` must enumerate every governed candidate path, capability, owning runtime, role, and exact classification against baseline `423e2e924366419e418ee049093872d535eea41a`. The actual diff must match the accumulated manifests. Directory wildcards and this proposed tree are not declarations.

Likely protected inherited paths, based only on current inventory, are:

- `packages/db/src/schema/index.ts` for the lead schema export;
- `apps/web/client/package.json` for a declared `@onlook/leads` dependency;
- `apps/web/client/src/server/api/routers/index.ts` for router export; and
- `apps/web/client/src/server/api/root.ts` for router composition.

`packages/db/src/index.ts` currently already exports all schema and may not need modification; avoid it unless an exact candidate proves necessity. `apps/web/client/src/server/api/trpc.ts`, inherited project schema/routers/helpers, editor/CREATE files, and root `package.json` are not selected seams. Any baseline path later discovered in an exact candidate is protected regardless of this list.

Before editing **each** protected file, a new per-file CCR must name that exact path and the exact candidate resulting SHA-256, its approval must be entered in `architecture/core-change-approvals.json`, and the reviewed slice manifest must reference it. Existing approvals, a wildcard, an intent-only hash, one file's approval, or a previous resulting hash cannot authorize new content. Truthful hashes cannot be precomputed until exact future patches exist, so no hash is supplied here and every protected edit remains blocked.

The maintainer-generated migration must have its exact generated path in the reviewed slice manifest. Generated migration content and `bun.lock` remain excluded from agent edits; `db:gen` is maintainer-only. If workspace dependency reconciliation changes `bun.lock`, stop for explicit maintainer/governance action. No manifest, CCR, approval entry, migration, test, or runtime file is created in this phase.

## Decisions and rejected alternatives

- Choose `packages/leads` as a focused stable contract seam because multiple approved runtimes/capabilities consume it; reject a generic Jagwar/shared package and reject app-private imports from reusable packages.
- Choose separate canonical business and one-to-one lead projection; reject project, display name, phone formatting, Supabase user, subscriber, or billing identity as lead identity.
- Choose provider identity plus approved versioned fingerprint evidence and explicit conflict; reject silent merge, candidate ranking, merge/split, and mutable-name matching.
- Choose exact decimal strings at contracts and Postgres exact `numeric`; reject JavaScript number/binary floats and cross-currency aggregation.
- Choose a versioned current projection plus append-only/superseding history, durable operations, and event/outbox; reject a mutable status row as sole evidence and reject client counters.
- Choose row/CAS serialization and database uniqueness with tested transaction isolation; reject last-write-wins, network calls inside lead transactions, and speculative privileged functions.
- Choose a discovery/commercial saga around immutable import-decision identity; reject lead-owned metering or a claimed distributed transaction.
- Choose website-owned success and SMS-owned accepted evidence through narrow public contracts; reject interpreting CREATE/project/Telnyx internals or lifecycle coupling.
- Choose server-mediated application authorization plus RLS defense in depth; reject `protectedProcedure`, JWT/client claims, project roles, or service role as authority.
- Choose additive composition only; reject touching/wrapping editor/CREATE, a second generator, project backfill, or retroactive inherited-project assignment.

## Open decisions and production blockers

1. Approve exact fingerprint fields, normalization/transliteration rules, provider namespace/ID allowlist, policy versioning, and collision-review ownership. Until then fallback creation is unavailable.
2. Approve exact bounds and schemas for operation IDs, source IDs, display fields, correction reasons, metadata, batch size, event payloads, and retained normalization evidence.
3. Approve the active ISO 4217 table/version and currency scale rules. The exact decimal mechanism is selected, but policy-dependent value admission remains unavailable without this release.
4. Approve exact retention/deletion periods, legal-hold rules, anonymized fields, Owner-visible history, and privileged support/security/legal access. No duration is inferred.
5. Complete and approve workspace-authority runtime/package/persistence/RLS/composition. Lead production remains hard fail-closed until then.
6. Approve the discovery displayed-result attestation and commercial reservation/finalization contract, including who reconciles a committed lead with unresolved charge state.
7. Approve the narrow inherited project-to-workspace ownership/success evidence used by website attachment. No inherited project path is modified or inferred here.
8. Approve SMS accepted-event authentication, named system action, schema/version, and reconciliation identity. Exact Telnyx mapping remains in the SMS change.
9. Select transaction isolation, bounded retry policy, durable operation-result storage details, and any stronger identity-key serialization only from concurrency tests. Do not assume a trigger or `SECURITY DEFINER`.
10. Decide whether direct authenticated Data API reads are required. Default is server-mediated reads and no browser writes.
11. Confirm event delivery infrastructure/dispatcher ownership and dead-letter/reconciliation operations without turning lead history into a generic event bus.
12. Approve the 9-slice chain strategy, every exact manifest, maintainer migration workflow, and each per-file candidate-hash CCR before implementation.

## Exact downstream readiness and no-coupling statement

Completion of future lead slices would make only the following contracts ready: discovery create-or-resolve and immutable import decision; website attempt/success attachment; SMS accepted-event application; Inbox scoped lead resolution; hosting/project relationship read; commercial stable dedupe identities; and analytics committed lead events/version/supersession. It would not make any consumer's provider, UI, ledger, message, hosting, or analytics implementation ready.

Workspace authority is an absolute prerequisite. Discovery, website, SMS, Inbox, commercial, hosting, and analytics each retain their listed prerequisites and require separate native SDD/authorization. No editor route, editor store, AI CREATE manager, project creation router, sandbox flow, fixed template, publishing, hosting lifecycle, or existing project-role behavior is touched, wrapped, intercepted, or reinterpreted by this design. There is no second generator and no automatic project-to-lead migration.

## Planning-phase verification statement

The required source artifacts and representative repository seams cited above were read for design. No runtime, test, database, architecture, Supabase, typecheck, lint, or verification command was run because this phase is planning-only and the delegated scope permits only this design artifact and its Engram mirror. No architecture-passing claim is made.
