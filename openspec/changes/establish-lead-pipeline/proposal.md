# Proposal: Establish Lead Pipeline

## Change

`establish-lead-pipeline`

## Status and authority

Planning-only native proposal for the Wave 2 lead-pipeline foundation. The OpenSpec umbrella `reconfirm-jagwar-product-contract` is canonical product and planning authority; the current repository is implementation authority. The completed `establish-workspace-authority` proposal, specification, design, and tasks are planned dependency authority, but their runtime APIs, persistence, and authorization decisions do not exist yet.

The authorized sequence for this change is proposal → specification → design → tasks only. This proposal authorizes no runtime implementation, tests, database changes, migrations, manifests, Core Change Requests (CCRs), generated or lockfile edits, apply/verify/sync/archive activity, provider activation, commits, editor work, inherited Onlook changes, or work on unrelated dirty files.

## Intent

Establish one authoritative, workspace-owned business and lead identity plus a durable, explainable pipeline contract before discovery import, website creation, SMS, Inbox, hosting relationships, commercial metering, or owner analytics depend on it.

Today Jagwar has no approved runtime lead authority. If downstream capabilities independently identify businesses, infer stages from project or messaging state, or update a mutable status without durable evidence, they could create duplicate leads, cross-workspace disclosure, stage regression on retries, lost correction history, misleading conversion analytics, and accidental coupling to inherited Onlook project behavior.

The intended product outcome is that an active Owner or Member can work with a local business as a workspace lead or client, understand its current fixed V1 stage, correct mistakes without erasing history, relate one or more website attempts safely, and record a Won/Lost result. The local business never becomes a Jagwar subscriber identity, and Jagwar never processes the operator-to-client sale.

## Scope

### 1. Workspace-owned business and lead identity

- One canonical business identity is scoped to exactly one authoritative workspace. The same real-world business may independently exist in another workspace without linkage or disclosure.
- A lead is the workspace's pipeline representation of that business. Discovery, website, messaging, Inbox, hosting, and analytics must reference the lead authority rather than create competing business identities.
- Local businesses remain prospects or clients. Discovery, contact, website creation, hosting, Closed/Won status, or recorded value must never create a Jagwar user, membership, workspace, subscriber, or billing identity.
- Identity resolution should prefer stable source/provider identity and otherwise use a documented normalized business fingerprint. Exact fields and normalization are deferred to specification and collision evidence.
- Identity resolution must be idempotent within a workspace. Ambiguous collisions must fail into an explicit review/conflict result rather than silently merge or overwrite businesses.
- Identity history must preserve source references and supersession evidence. No downstream capability may infer identity from mutable display names, project titles, phone formatting, or client state alone.

### 2. Fixed V1 pipeline and outcome

The V1 stages are fixed exactly as:

`New lead → Website building → Contacted → Closed`

- Custom stages, reordered stages, parallel pipelines, and workspace-defined outcome vocabularies are excluded.
- `Closed` requires exactly one outcome: `Won` or `Lost`.
- A non-Closed current stage has no current Won/Lost outcome. A correction away from Closed must preserve the prior Closed/outcome transition in history rather than rewrite it.
- Every discovery-created lead initially commits at `New lead`. Website and SMS workflows require an existing lead and may transition it only after that initial creation has committed.
- Website lifecycle, project lifecycle, hosting lifecycle, and pipeline state remain independent. Deleting, archiving, publishing, suspending, retrying, or failing a website must not implicitly rewrite pipeline state.

### 3. Durable transition and correction history

- Current state is a versioned projection backed by append-only or explicitly superseding history; it is not the sole evidence.
- Every automatic transition, manual transition, outcome/value correction, rejected stale mutation where audit policy requires it, and identity correction must retain: workspace and lead identity; human or named system actor; source/action; prior state and outcome; resulting state and outcome; timestamp; stable operation and request correlation; expected/resulting version; and workspace-authority evidence.
- Corrections append or supersede; they never erase the original event. Ordinary application roles must not hard-delete or rewrite transition evidence.
- History metadata must be bounded and must exclude provider secrets, raw payloads, message bodies, prompts, credentials, session tokens, and unnecessary personal data.
- Automatic and manual mutations use optimistic concurrency. A stale expected lead version returns a typed conflict with no partial state, relationship, outcome, or analytics-source mutation.

### 4. Authorized manual corrections

- Current active Owners and Members may submit manual corrections through server-enforced workspace and resource authorization.
- A manual correction may select only a fixed V1 stage and must satisfy the Closed/outcome invariant.
- Manual corrections may intentionally move forward or backward, including reopening an incorrectly Closed lead, only as an explicit correction with actor, reason/source, expected version, and preserved prior history. Automatic events never receive this correction privilege.
- Correcting Won/Lost or optional value/currency is also versioned and history-preserving.
- The later specification must define legal transition validation and whether a bounded reason is mandatory; it must not invent custom stages or erase evidence.

### 5. Idempotent automatic transition interfaces

Lead pipeline will publish narrow, replay-safe interfaces for downstream owners; it will not import their internals.

- **Website creation:** the first successfully committed lead-backed website creation may move `New lead` to `Website building`. Replays return the committed relationship/transition result and do not duplicate a project relation or transition.
- **SMS:** the first outbound SMS accepted by the authoritative send boundary may move `New lead` or `Website building` to `Contacted`. Provider rejection before acceptance causes no transition. Ambiguous timeout remains pending until acceptance is authoritatively reconciled.
- Automatic transitions never regress `Contacted`, any later manually selected state, or `Closed`; never change Won/Lost; and never reopen a lead.
- A trigger must carry a stable source event/operation identity, workspace and lead identity, actor evidence, source record identity, and acceptance/success evidence. Idempotency is scoped to workspace + trigger kind + source operation/event identity.
- The downstream website and SMS capabilities own success/acceptance semantics and provider reconciliation. Lead pipeline owns only deduplicated relationship and transition application from their public evidence.

### 6. Durable lead-to-project relationships and attempts

- Lead pipeline owns a durable workspace-scoped lead↔project relationship contract; it does not own inherited project creation, editor state, generation, publishing, hosting, or deletion.
- A lead may have multiple website creation attempts and, when downstream creation permits, multiple resulting projects. Each attempt has one stable operation identity and explicit pending/succeeded/failed-or-superseded evidence.
- A successfully related project may belong to at most one lead in the same workspace through this capability unless a later owner-approved merge policy says otherwise. Existing unrelated inherited projects are not retroactively assigned.
- Retries of one creation operation must resolve to the same attempt and result. A failed or ambiguously pending attempt must not be represented as a successful project or automatic transition.
- Relationship persistence must not make website lifecycle authoritative for pipeline stage. Later project archival, deletion, recreation, publication, or hosting changes do not regress or close the lead.

### 7. Won amount and currency

- A Won lead may optionally retain an amount and uppercase ISO 4217 currency for owner analytics.
- Amount and currency are supplied and corrected by an authorized workspace Member, versioned with the lead outcome, and treated as operator-recorded analytics data—not provider or payment evidence.
- Amount and currency must be present together or absent together. Cross-currency values remain separate unless a later analytics policy approves conversion.
- Jagwar does not invoice, collect, settle, escrow, refund, or otherwise process the operator-to-client sale through this capability.

### 8. Workspace authority, isolation, and RLS

- Every lead read, list, create-or-resolve, correction, transition, outcome/value mutation, and relationship operation requires current server-derived workspace authority and exact resource ownership.
- The planned workspace-authority contracts provide current actor context, Member/Owner decisions, resource authorization, freshness/revalidation, named system actors, operation correlation, and audit-safe evidence. This proposal does not duplicate or pretend those runtime contracts already exist.
- Removed members are denied on the next request. Long-running, retried, or externally effectful workflows revalidate authority at the owning capability's irreversible boundary; prior UI visibility or a prior allowed result grants no continuing authority.
- Direct, list, indirect, and mixed-batch access must be workspace constrained. Existing and nonexistent cross-workspace identifiers produce sanitized, non-enumerating denials.
- Supabase Auth establishes the subject; application authority establishes workspace access. Server checks remain mandatory, and ownership-aware RLS is defense in depth for exposed schemas. Service-role access remains server-only, narrow, and audited, never a bypass for workspace checks.

### 9. Public dependency contracts

Lead pipeline must expose intentional contracts without leaking persistence representation:

- **DataForSEO discovery/import:** resolve or create one workspace lead from an eligible displayed business and source-run identity; return existing-vs-created status without a second lead charge. Discovery owns provider execution, immutable snapshots, eligibility, and metering coordination.
- **Website creation:** authorize a lead-backed creation attempt, attach its successful inherited project result idempotently, and apply the non-regressing automatic Website building transition. Website creation owns presets, prompts, BYOK/commercial gates, inherited CREATE invocation, and success evidence.
- **SMS/Telnyx:** consume one authenticated accepted-send event idempotently and apply the non-regressing Contacted transition. SMS owns preview/confirmation, compliance, sender state, reservation/debit, provider invocation, and reconciliation.
- **Inbox:** resolve a conversation's lead/workspace relationship and expose current lead identity/state through a scoped read contract. Inbox owns conversations, messages, unread state, notifications, and replies.
- **Hosting/project relationships:** expose lead↔project ownership evidence without making hosting or project lifecycle a pipeline transition. Hosting owns site/add-on/domain/grace/retention behavior.
- **Commercial metering:** expose stable lead/import and source-operation identities needed to prevent duplicate charging, while commercial owns balances, reservations, ledgers, and entitlement.
- **Owner analytics:** expose committed identity, transition, outcome/value, and relationship event identities plus version/supersession semantics. Analytics owns projections, reconciliation, staleness, activation derivation, and currency-separated presentation.

Consumers must use public contracts and must not query lead tables ad hoc as a substitute, deep-import internals, or cause lead pipeline to import sibling capability internals.

## Behavior while workspace authority is unimplemented

Workspace authority is a hard runtime prerequisite. Until its approved runtime contracts, persistence, and security evidence exist:

- this change remains planning-only and exposes no runtime lead API;
- no temporary user-owned, project-role-derived, client-selected, JWT-role-derived, or service-role-only authorization substitute is permitted;
- no lead data migration, import, correction, transition, relationship, or provider-facing integration may launch under this proposal; and
- later design/tasks may define compile-time ports and test doubles, but production composition must remain blocked/fail closed until current workspace actor and resource authorization are available.

## Scope boundaries and non-goals

This change does not:

- implement lead, workspace, database, RLS, service, router, package, UI, migration, test, manifest, or CCR artifacts;
- define DataForSEO search/provider behavior, commercial balances, website generation/presets, CodeSandbox credentials, SMS compliance/provider orchestration, Inbox behavior, hosting lifecycle, or analytics projection internals;
- create Jagwar subscriber identities for local businesses or process website-sale payments;
- support custom pipeline stages/outcomes, unattended campaigns, or automatic reopening/regression;
- infer workspace or lead ownership from inherited users, project roles, projects, route state, or client claims;
- wrap or touch the editor, alter inherited CREATE/project/publishing behavior, change the fixed CodeSandbox template, or introduce a second generator;
- refactor inherited Onlook behavior, edit generated files or `bun.lock`, touch unrelated dirty files, invoke BMAD/Telio work, or authorize implementation/commits.

## Affected areas forecast

Future separately approved work is expected to consider additive capability-owned seams under:

- `apps/web/client/src/server/services/lead-pipeline/` for server orchestration and public app-local composition;
- `apps/web/client/src/server/api/routers/` for thin Zod/tRPC lead transport;
- `packages/db/src/schema/lead-pipeline/` for capability-owned identity, current projection, history, outcomes, attempts, and relationships;
- a focused public contract boundary only if design demonstrates consumers and architecture policy permits it;
- Supabase/RLS tests and maintainer-governed migration workflow; and
- narrow composition/export/dependency seams required by later consumers.

These are discovery targets, not approved paths. Design must inspect current callers and repository placement rules before selecting files.

## Risks and mitigations

- **Identity collision or duplicate import:** Prefer stable source identity, use documented workspace normalization, enforce idempotent create-or-resolve, and return ambiguous matches for review rather than auto-merge.
- **Cross-workspace disclosure:** Require current workspace actor plus exact lead/resource ownership for every access shape, with sanitized denial and ownership-aware RLS.
- **History loss or support ambiguity:** Preserve append-only/superseding identity, transition, correction, relationship, and value evidence with actor/operation/authority correlation.
- **Stage regression from retries or out-of-order events:** Deduplicate source operations, apply automatic transitions monotonically, and use optimistic lead versions.
- **False website/SMS success:** Transition only from authoritative successful creation or accepted-send evidence; keep ambiguous external outcomes pending and reconcilable.
- **Project coupling:** Store durable relationships and attempt identities while keeping project/editor/hosting lifecycle independent from stage.
- **Misleading revenue analytics:** Require Won, paired amount/currency, no cross-currency aggregation by this capability, and clear operator-recorded semantics.
- **Premature dependency implementation:** Fail closed until workspace authority exists; do not create compatibility shortcuts that later become a second authority model.
- **Inherited regression or oversized change:** Prefer additive capability-local seams and future dependency-ordered 250–400-line Strict-TDD slices; no editor wrapper or second generator.

## Rollback

This proposal changes no runtime or data. Planning rollback is to supersede or remove this artifact through an explicit OpenSpec revision that names changed identity, transition, correction, or dependency rules; it must not silently fall back to BMAD/Telio assumptions.

Future delivery rollback must disable new lead admissions and consumer dispatch while preserving canonical identities, current versions, transition/correction history, attempts, project relationships, outcome/value evidence, operation results, and audit/legal evidence. Rollback must not recreate duplicates, regress state, erase corrections, detach truthful successful projects, or restore removed-member access. Data correction uses new superseding records. Every protected rollback file requires its own approved exact resulting hash.

## Future delivery and review forecast

Auto-forecast classifies the future implementation as **High** 400-line-budget risk and recommends a dependency-ordered chained PR delivery. A later design/tasks phase should refine approximately 8–10 cohesive **250–400 changed-line** Strict-TDD slices, likely ordered as:

1. pure lead state/identity/decision contracts and failing contract tests;
2. business/lead identity and current-state schema model;
3. maintainer-produced migration, uniqueness/indexes, RLS, and adversarial database tests;
4. server-authorized create/resolve and workspace-scoped read contracts;
5. versioned manual transitions, Closed outcomes, Won value/currency, and history;
6. lead↔project attempt/relationship idempotency;
7. automatic website/SMS transition interfaces, replay, ordering, and concurrency;
8. thin transport and downstream contract fixtures;
9. composition/protected exports and integration hardening if they cannot safely fit earlier slices.

The exact count, line forecast, and chain shape belong to later design/tasks after repository inventory. Before each future governed edit, one reviewed exact `architecture/slices/<slice>.json` must name every candidate path and classification. Before each protected inherited file edit, a new per-file CCR must name that exact path and candidate resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the manifest. Candidate hashes can be computed only from exact future patches; therefore no manifests, CCRs, or hashes are created now.

Every slice begins RED, makes the smallest GREEN change, triangulates, and refactors only while green. No slice may split a transactional invariant merely to satisfy the budget. Generated migrations remain maintainer-owned, `db:gen` is not run by agents, and `bun.lock` remains untouched.

## Success criteria

This proposal succeeds when later specification/design/tasks can establish that:

- local businesses have one authoritative workspace-scoped lead identity and never become Jagwar subscribers;
- the fixed stages and exact Won/Lost Closed outcome are unambiguous;
- every transition/correction retains actor, source, prior/result state, time, operation correlation, version, and authority evidence;
- active Members can make optimistic, history-preserving corrections while stale writes conflict;
- first successful lead-backed website creation and first accepted SMS send use replay-safe, non-regressing automatic interfaces;
- project relationships and multiple/retried attempts remain durable without coupling website lifecycle to stage;
- optional Won amount/currency is analytics-only and Jagwar does not process the sale;
- server workspace/resource authorization, removed-member behavior, actor audit, cross-workspace isolation, and RLS defense in depth are mandatory dependencies;
- downstream discovery, website, SMS, Inbox, hosting, commercial, and analytics capabilities have narrow public contracts without importing their internals;
- inherited Onlook editor/CREATE/project behavior is preserved additively with no second generator; and
- future work remains blocked behind completed native planning, owner authorization, 250–400-line Strict-TDD slices, reviewed exact manifests, and per-file resulting-hash CCRs.

## Proposal question round

Auto mode prevents pausing this delegated phase for an interactive round. These questions and conservative provisional assumptions are recorded to improve the later PRD/specification by exposing business rules, implications, edge cases, and product tradeoffs. The owner may accept them, correct the framing, or request a second question round before or during `sdd-spec`.

1. **Canonical identity, collisions, and merge:** Which source identifiers and normalized fields define the same business, and may users merge/split duplicates? **Provisional assumption:** identity is workspace-local; prefer stable DataForSEO/provider identity, then a documented normalized fingerprint; never auto-merge ambiguous matches. Merge/split policy, alias retention, and cross-source collision precedence are genuinely unresolved for owner review.
2. **Lead creation sources:** Besides eligible DataForSEO import, may V1 create leads manually or from website/SMS/Inbox flows? **Provisional assumption:** only an approved discovery/import create-or-resolve contract creates a lead; downstream flows require an existing lead and cannot silently create one. Manual creation is unresolved product scope.
3. **Project cardinality and retries:** May one lead own multiple successful website projects, and may a project move between leads? **Provisional assumption:** one lead may retain multiple attempts and successful projects; one project relates to at most one lead in its workspace; retries reuse one attempt; reassignment is blocked absent an explicit history-preserving correction policy. Final cardinality/reassignment remains unresolved.
4. **Transition precedence, correction, and reopening:** Which manual moves are legal, and can Closed be reopened? **Provisional assumption:** automatic transitions are monotonic and never affect Closed or regress manual/later state; an authorized Member may explicitly correct to any fixed stage, including reopening, with expected version, bounded reason/source, and full prior/outcome history. Whether reopening should instead require Owner authority or a narrower reason policy is unresolved.
5. **Exact SMS success boundary and idempotency:** Which Telnyx state counts as accepted, and who creates the idempotency key? **Provisional assumption:** Contacted follows the first durably recorded acceptance by the SMS authority, not preview, confirmation click, lookup, reservation, delivery, or reply; timeout remains pending until reconciliation. The SMS capability supplies a stable bounded operation/provider-event identity, and lead pipeline deduplicates by workspace + trigger + source identity. Exact provider status mapping is unresolved in the SMS specification.
6. **Won value authority:** What amount representation, validation, and correction rules apply? **Provisional assumption:** current Members may record or correct a non-negative amount paired with an uppercase ISO 4217 currency only while the resulting state is Won; analytics keeps currencies separate and treats values as operator assertions. Minor-unit vs decimal representation, zero-value policy, and who may correct values are unresolved.
7. **Retention, deletion, and supersession:** How long must identity/transition evidence survive cancellation, deletion requests, merges, and legal holds? **Provisional assumption:** ordinary corrections and merges never delete history, but no universal lead retention duration is selected. Exact lead retention, privacy deletion, legal-hold, merge tombstone, and audit-retention policy is unresolved, must be owner/compliance approved, and remains fail-closed rather than inheriting another capability's duration.
8. **Workspace authority dependency:** Should lead planning create any interim behavior before workspace authority runtime exists? **Provisional assumption:** no. Planning may define ports and test doubles, but all production lead operations remain unavailable/fail closed; no inherited project-role, JWT, client-selection, or service-role substitute is permitted.
