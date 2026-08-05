# Workspace Authority Specification

## Purpose

Define the authoritative workspace, membership, actor, authorization, and audit contracts that all workspace-scoped Jagwar capabilities consume while preserving the OpenSpec product contract and inherited Onlook behavior.

## Requirements

### Requirement: Workspace identity and current membership are authoritative

The system MUST treat a durable workspace as the ownership boundary for Jagwar product records and operations. It MUST bind an authenticated Supabase subject to a workspace only through current application-owned membership state, and every dependent resource MUST carry or resolve exactly one authoritative workspace owner. A submitted workspace or resource identifier MUST be treated only as authorization input, never as proof of ownership. Discovered, contacted, hosted, or Won local businesses MUST remain workspace-owned leads or clients and MUST NOT thereby become Jagwar subscriber identities. Existing inherited user and project behavior MUST remain unchanged until a separate capability contract defines its narrow workspace-ownership relationship.

#### Scenario: Authenticated user addresses a workspace

- GIVEN an authenticated subject submits workspace A and a resource identifier as request inputs
- WHEN the protected operation is authorized
- THEN the server MUST establish current membership in workspace A from authoritative application state
- AND MUST independently establish that the resource belongs to workspace A

#### Scenario: Discovered business becomes Won

- GIVEN a local business is owned by a workspace as a lead
- WHEN that lead is contacted, hosted, or marked Won
- THEN the business MUST remain a lead or client
- AND MUST NOT gain a Jagwar subscriber identity merely from that lifecycle

### Requirement: V1 roles are exactly Owner and Member

The system MUST support exactly the `Owner` and `Member` workspace roles in V1 and MUST NOT support custom roles or client-defined permission sets. Active Owners and Members MUST be allowed to perform normal workflows when the owning capability's additional gates pass. Only current Owners MUST administer membership, workspace authority, billing, sensitive workspace settings and integrations, workspace CodeSandbox credentials, SMS templates, workspace-uploaded presets, sensitive hosting or domain settings, and Owner analytics.

#### Scenario: Member performs a normal workflow

- GIVEN a subject has current active Member status in workspace A
- WHEN the subject performs an otherwise eligible lead, preset-selection, project, Inbox read, or Inbox reply workflow in workspace A
- THEN workspace authority MUST return an allowed Member decision
- AND the owning capability MUST remain responsible for its additional eligibility gates

#### Scenario: Member attempts an Owner-only operation

- GIVEN a subject has current active Member status
- WHEN the subject directly requests membership administration, a sensitive integration change, or Owner analytics
- THEN the server MUST deny the operation regardless of route visibility or client claims
- AND MUST leave the protected state unchanged

### Requirement: Membership lifecycle is explicit and preserves a final Owner

The system MUST support workspace-scoped invitation, acceptance, activation, Owner/Member role change, removal, and failed or conflicted administration outcomes. An invitation MUST grant no workspace authority before explicit acceptance binds it to the authenticated subject and activation establishes current membership. Every membership mutation MUST be attributable to a current Owner. An active workspace MUST always retain at least one active Owner; its final Owner MUST NOT be demoted, removed, or allowed to leave until another active Owner is established.

#### Scenario: Invitee has not accepted

- GIVEN an Owner has invited a subject to workspace A
- WHEN that subject requests workspace A data before accepting and becoming active
- THEN the server MUST deny workspace membership authority
- AND MUST NOT expose workspace A data

#### Scenario: Invitation is accepted and activated

- GIVEN a valid invitation identifies the intended authenticated subject and workspace A
- WHEN that subject explicitly accepts and activation succeeds
- THEN exactly one current membership MUST become active with an Owner-assigned V1 role
- AND the invitation, acceptance, activation, actor, and outcome MUST remain auditable

#### Scenario: Final Owner is removed

- GIVEN workspace A has exactly one active Owner
- WHEN any request attempts to demote, remove, or end that Owner's membership without first establishing another active Owner
- THEN the request MUST be denied without changing authority
- AND workspace A MUST retain its active Owner

### Requirement: Membership mutations use optimistic authority concurrency

Every membership and workspace-authority mutation MUST require the current authority version or equivalent optimistic token and MUST produce a typed conceptual outcome of `allowed`, `denied`, or `conflict`. A stale mutation MUST return `conflict`; it MUST NOT partially apply or silently overwrite a newer decision. Concurrent mutations MUST preserve role validity and the final-Owner invariant.

#### Scenario: Two Owners change one membership concurrently

- GIVEN two authorized Owner requests use the same current membership version
- WHEN both attempt different role or removal mutations
- THEN at most one mutation MUST commit against that version
- AND every stale request MUST return a conflict with no partial authority change

#### Scenario: Concurrent final-Owner changes race

- GIVEN concurrent requests could each appear to preserve an Owner when evaluated in isolation
- WHEN their commits are resolved
- THEN the resulting authoritative state MUST still contain at least one active Owner
- AND any request that cannot preserve that invariant MUST fail or conflict

### Requirement: Active workspace selection is non-authoritative convenience state

One authenticated subject MAY hold current memberships in multiple workspaces and MAY select an active workspace for presentation. Active selection, remembered navigation, and sanitized workspace projections MUST carry no independent authority. Every request MUST independently authorize its submitted workspace and resources against current membership.

#### Scenario: User switches between two memberships

- GIVEN a subject is an active Member of workspaces A and B and selects workspace A in the client
- WHEN the subject submits an otherwise valid request for workspace B
- THEN the server MUST authorize workspace B from current membership and resource ownership
- AND MUST NOT use the client selection as proof for or against access

#### Scenario: Stale selection names a removed workspace

- GIVEN the client still selects workspace A after the subject was removed from it
- WHEN the next protected request addresses workspace A
- THEN the server MUST deny it despite the remembered selection and valid Supabase session

### Requirement: Actor contexts are server-derived, narrow, and typed

After Supabase authentication, the server MUST derive a human actor context from current authoritative state containing only the authenticated subject, workspace identity, membership identity, current role, authority freshness evidence, and audit-safe request and operation correlation. The system MUST NOT accept client-supplied actor identity, role, membership status, authority version, or ownership assertions as authority. Sanitized presentation data MAY be exposed but MUST NOT include raw tokens, Supabase secrets, service credentials, or unrelated memberships. Explicit system actor contexts MUST be narrow, named, operation-scoped, and auditable and MUST NOT impersonate an Owner.

#### Scenario: Client forges an Owner context

- GIVEN a Member submits forged Owner, membership, and authority-version fields
- WHEN the server derives the actor context
- THEN those authority claims MUST be ignored
- AND the resulting decision MUST use the current server-derived Member context

#### Scenario: Lifecycle worker acts without a human session

- GIVEN an authorized lifecycle operation is assigned to a named system actor
- WHEN the system actor performs its narrowly permitted action
- THEN the audit evidence MUST identify that system actor and operation
- AND MUST NOT attribute the action to an Owner or grant unrelated workspace powers

### Requirement: Public authority decisions are stable and fail closed

Workspace authority MUST expose stable conceptual contracts for resolving current actor context, requiring a workspace Member, requiring a workspace Owner, authorizing a workspace-owned resource, revalidating authority freshness, administering memberships, and supplying audit-safe actor evidence. Decision results MUST be typed as allowed, sanitized denied, or conflict where applicable and MUST carry sufficient authority freshness and operation correlation for consumers. Downstream capabilities MUST consume intentional public contracts and MUST NOT deep-import internals, query workspace-authority persistence ad hoc as an authorization substitute, depend on its storage representation, or import application-private code into reusable packages.

#### Scenario: Downstream service authorizes a resource

- GIVEN a capability receives authenticated server identity, workspace input, resource ownership evidence, and an operation identity
- WHEN it invokes the public workspace authority contract
- THEN it MUST receive a typed fail-closed decision and audit-safe actor evidence
- AND the result MUST NOT expose persistence details or secrets

#### Scenario: Authority dependency changes internally

- GIVEN workspace authority changes its private persistence representation without changing public behavior
- WHEN a downstream capability uses the stable public contract
- THEN the downstream capability MUST remain decoupled from that representation

### Requirement: Workspace and resource authorization isolates every access shape

Before any protected read, write, provider call, balance mutation, credential access, or sensitive disclosure, the server MUST authorize both current membership and target resource ownership in the same workspace. Authentication or a protected transport procedure alone MUST NOT be sufficient. Authorization MUST constrain list queries, direct identifiers, indirect relationships, stale identifiers, and every element of mixed batches. A mixed-workspace batch MUST NOT use one authorized item to authorize another, and unauthorized results MUST NOT be disclosed through partial details.

#### Scenario: Direct cross-workspace identifier is guessed

- GIVEN a Member of workspace A submits a valid identifier for a resource in workspace B
- WHEN a direct read or mutation is evaluated
- THEN the server MUST deny it before protected data, credentials, provider activity, or mutation occurs

#### Scenario: List query attempts cross-workspace enumeration

- GIVEN a Member of workspace A supplies filters or pagination inputs that could include workspace B records
- WHEN the list is evaluated
- THEN every returned record MUST be owned by workspace A
- AND counts, cursors, and metadata MUST NOT reveal workspace B records

#### Scenario: Indirect relationship crosses workspaces

- GIVEN a workspace A operation references a lead, project, conversation, integration, or preset indirectly linked to workspace B
- WHEN ownership is resolved through that relationship
- THEN authorization MUST fail closed before any sensitive effect

#### Scenario: Batch mixes workspace ownership

- GIVEN one batch contains resources from workspaces A and B under a workspace A actor context
- WHEN the batch is authorized
- THEN no workspace B item MUST be read, mutated, metered, or dispatched
- AND the outcome MUST NOT reveal sensitive workspace B item details

### Requirement: Denials are sanitized and auditable where safe

Authorization denial responses MUST reveal no sensitive existence, ownership, member, integration, billing, or resource state from another workspace. Audit evidence MAY distinguish the internal reason when safe and access-controlled, while the consumer-facing outcome MUST remain bounded and non-enumerating.

#### Scenario: Attacker compares existing and nonexistent identifiers

- GIVEN a workspace A Member probes one workspace B identifier and one nonexistent identifier
- WHEN both requests are denied
- THEN the public outcomes MUST NOT enable inference of which target exists
- AND safe internal evidence SHOULD retain enough correlation to investigate the probes

### Requirement: Removed or demoted authority is revalidated before irreversible effects

Every authorization MUST use current authoritative membership and role rather than prior visibility, browser state, or stale token claims. A removed member MUST be denied on the next authorization. An operation admitted earlier MUST revalidate current authority and relevant role immediately before an irreversible sensitive commit or external dispatch when authority could have changed. A retry MUST retain the same operation identity but MUST resolve current authority anew. An already committed external effect MUST remain auditable and reconcilable and MUST NOT be represented as undone.

#### Scenario: Member is removed after an initial read

- GIVEN a Member passed an initial check and was removed before provider dispatch
- WHEN the operation revalidates at the dispatch boundary
- THEN dispatch MUST be denied with no new irreversible effect
- AND the stale-authority denial MUST be correlated to the operation

#### Scenario: Retry follows removal

- GIVEN an earlier attempt was authorized but did not irreversibly commit and the actor was subsequently removed
- WHEN the same operation identity is retried
- THEN current authority MUST be resolved again
- AND the retry MUST be denied rather than bootstrap from the earlier authorization

#### Scenario: Effect committed before revocation

- GIVEN an external effect committed before a later removal
- WHEN revocation is processed
- THEN the system MUST retain truthful correlated evidence of the committed effect
- AND MUST NOT report that revocation retroactively undid it

### Requirement: Authority auditing is durable, bounded, and history-preserving

Workspace authority MUST retain audit evidence for invitations, acceptance, activation, role changes, removals, authority conflicts, safe cross-workspace denials, Owner-only authorization decisions, and system operations. Evidence MUST include workspace, human actor or named system actor, target identity, action, typed result, timestamp, operation and request correlation, and authority freshness evidence. Audit records MUST be append-only or explicitly superseding; corrections MUST preserve prior evidence. They MUST NOT contain credentials, session or raw JWT tokens, provider secrets, unrestricted provider payloads, uploaded preset contents, or unnecessary personal data. Workspace authority MUST supply actor evidence without becoming a generic event store or taking ownership of downstream domain events.

#### Scenario: Stale Owner mutation conflicts

- GIVEN an Owner submits a stale membership mutation
- WHEN the system returns a conflict
- THEN durable evidence MUST record the actor, workspace, target, action, conflict result, operation correlation, and evaluated authority version
- AND MUST NOT record secrets or erase the successful competing decision

#### Scenario: Audit correction is required

- GIVEN retained audit evidence needs a correction
- WHEN an authorized correction is recorded
- THEN it MUST explicitly supersede or append to the earlier evidence
- AND the original authority history MUST remain traceable

#### Scenario: Owner reads workspace audit projection

- GIVEN a current Owner requests workspace audit information
- WHEN access is authorized
- THEN only a sanitized workspace-scoped projection MUST be returned
- AND exact retention durations and privileged support or legal access MUST remain governed by later compliance and security policy

### Requirement: Supabase authentication, application authorization, and RLS are distinct controls

Supabase Auth MUST establish subject identity, while application-owned current membership MUST establish workspace authority. Authorization MUST NOT rely on `user_metadata`, client claims, UI state, `TO authenticated` alone, or stale JWT `app_metadata` as the sole source for prompt removal or role-change guarantees. Every table in any exposed schema MUST have RLS enabled, and workspace-owned tables MUST have ownership-aware policies; server authorization MUST remain mandatory as the primary capability boundary and RLS MUST provide defense in depth for direct data access.

#### Scenario: JWT retains a stale Owner claim

- GIVEN a valid Supabase session contains a stale role claim after demotion or removal
- WHEN an Owner-only operation is requested
- THEN current application membership MUST control the decision
- AND the stale JWT claim MUST NOT restore Owner or Member authority

#### Scenario: Authenticated role reaches an exposed table

- GIVEN an authenticated database role attempts to access another workspace's row through an exposed schema
- WHEN RLS evaluates the access
- THEN an ownership-aware policy MUST deny it
- AND application services MUST still perform their own workspace authorization

### Requirement: Privileged access is narrow and never client authority

Privileged or service-role access MUST remain server-only, narrowly scoped to named operations, and auditable. It MUST NOT be exposed to a browser or used as blanket justification to bypass workspace checks. Future views, functions, triggers, storage policies, and privileged database code MUST receive specific security review; exposed views and functions MUST preserve invoker and grant boundaries, and privileged execution MUST NOT be introduced merely to bypass a permission error.

#### Scenario: Service credential can bypass RLS

- GIVEN a server operation can use privileged database access
- WHEN it handles a workspace-owned target
- THEN the operation MUST still enforce its named workspace and actor authorization contract
- AND the service credential MUST NOT appear in client output or audit evidence

### Requirement: Downstream capabilities retain their own policy and data ownership

Workspace authority MUST provide workspace, Member/Owner, resource, freshness, system-actor, and actor-audit contracts without taking ownership of downstream policy or records. Commercial capability MUST own subscriptions, separate lead/AI/SMS balances, hosting add-ons, and usage; lead capability MUST own lead identity and fixed pipeline history; CodeSandbox BYOK MUST own protected credentials; DataForSEO discovery MUST own search execution and snapshots; website capability MUST own creation and presets; SMS and Inbox MUST own messaging behavior and records; hosting MUST own site, domain, retention, and lifecycle behavior; analytics MUST derive Owner-only measures from authoritative downstream records.

#### Scenario: Metered lead operation is requested

- GIVEN a current Member requests a workspace-owned DataForSEO operation
- WHEN the operation is evaluated
- THEN workspace authority MUST establish actor and workspace authorization
- AND commercial, discovery, and lead capabilities MUST independently enforce entitlement, metering, provider, snapshot, and lead rules

#### Scenario: Sensitive integration is changed

- GIVEN a current Owner requests a CodeSandbox credential, SMS template, billing, domain, hosting, or workspace-preset administration operation
- WHEN workspace authority allows the Owner decision
- THEN the owning capability MUST remain responsible for validation, concurrency, secrets, provider behavior, and domain persistence

#### Scenario: Owner requests analytics

- GIVEN a current Owner requests workspace analytics
- WHEN workspace authority authorizes the read
- THEN analytics MUST derive only that workspace's committed downstream records and balances
- AND workspace authority MUST NOT fabricate or own those measures

### Requirement: V1 DESIGN.md preset authority is exact and bounded

V1 MUST support Jagwar-managed and workspace-uploaded Inspiration and Style `DESIGN.md` presets. Each workspace upload MUST be one validated Markdown file. Only Owners MUST create, replace, or delete workspace uploads, while active Members MAY select available presets. Inspiration reference code MUST be accepted only inside fenced code blocks. Archive, asset, and Git ingestion MUST NOT be supported. Workspace authority MUST own only authorization, isolation, concurrency evidence, and actor audit for preset operations; preset validation, content, prompt composition, website creation, and generation behavior MUST remain owned by the website capability.

#### Scenario: Member selects an available preset

- GIVEN an active Member is authorized in workspace A and a preset is available to workspace A
- WHEN the Member selects it for an eligible website workflow
- THEN workspace authority MUST allow Member selection
- AND the website capability MUST enforce preset and creation semantics

#### Scenario: Owner uploads an archive or unfenced Inspiration code

- GIVEN a current Owner is authorized to manage workspace presets
- WHEN the Owner submits an archive, assets, Git source, multiple files, or Inspiration code outside fenced blocks
- THEN the website capability MUST reject the upload without replacement
- AND Owner authority alone MUST NOT bypass content rules

### Requirement: Inherited Onlook behavior is preserved additively

Workspace authority MUST be introduced through additive, minimal capability boundaries. It MUST NOT wrap, restructure, redesign, or otherwise touch the editor through this change; introduce a second website generator; replace inherited project creation, fixed CodeSandbox template, AI CREATE, publishing, settings, source export, or customer-controlled Git behavior; or infer authority from inherited behavior without a separately approved narrow contract.

#### Scenario: Authority planning proposes an editor wrapper

- GIVEN a proposed authority integration would wrap or restructure an inherited editor or project route
- WHEN it is reviewed against this specification
- THEN it MUST be rejected or moved to a separately approved narrow product-contract change
- AND existing Onlook behavior MUST remain intact

### Requirement: Future delivery obeys planning and protected-change governance

Any future implementation MUST be divided into dependency-ordered cohesive Strict-TDD slices of 250–400 changed lines, beginning with relevant failing tests and making the smallest passing change before refactoring while green. Before a governed implementation edit, the slice MUST have one reviewed `architecture/slices/<slice>.json` manifest declaring every governed path and correct classification. Before each protected inherited baseline file edit, a per-file Core Change Request MUST name that exact path and exact resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the reviewed slice manifest. A planning artifact, dependency sequence, prior approval, wildcard, or intent-only approval MUST NOT authorize implementation.

#### Scenario: Slice has no reviewed manifest

- GIVEN a future authority slice is otherwise planned and within the changed-line budget
- WHEN a governed file edit is proposed without its reviewed architecture slice manifest
- THEN the edit MUST remain blocked

#### Scenario: Protected file approval lacks the resulting hash

- GIVEN a future slice proposes a protected inherited file edit
- WHEN its approval omits that file's exact resulting SHA-256 or names a wildcard
- THEN the protected edit MUST remain blocked even if the capability and path intent were previously approved
