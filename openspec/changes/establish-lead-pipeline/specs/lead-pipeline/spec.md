# Lead Pipeline Specification

## Purpose

Define the authoritative workspace-scoped business and lead identity, fixed V1 pipeline, durable correction history, lead-to-project relationships, and narrow downstream contracts. This capability depends on workspace authority and is a prerequisite for discovery import, website creation, SMS, Inbox, hosting relationships, commercial deduplication, and owner analytics.

The exact normalized-fingerprint fields and transformations, metadata and reason length limits, supported ISO 4217 table version, and compliance retention/deletion periods are policy parameters that MUST be approved and versioned before production admission. Their values are unresolved by this change; implementations MUST fail closed rather than guess when an applicable policy is absent or ambiguous.

## Requirements

### Requirement: Business and lead identity is authoritative and workspace-scoped

The system MUST maintain exactly one canonical business identity and exactly one pipeline lead representation for each resolved business within an authoritative workspace. Resolution MUST first use an exact stable provider-source identity consisting of provider namespace plus provider business identifier. When no approved stable provider identity is available, resolution MUST use the approved, versioned normalized-fingerprint policy. Mutable display names, project titles, client state, or unnormalized phone formatting alone MUST NOT establish identity. Source references and identity supersession evidence MUST be history-preserving. An ambiguous match, disagreement between an incoming provider identity and an existing fallback candidate, or collision between existing identities MUST return a typed `conflict` for review and MUST NOT merge, overwrite, or disclose another lead. The same real-world business MAY exist independently in multiple workspaces and MUST NOT be linked or disclosed across them. A local business MUST remain a prospect or client and MUST NOT become a Jagwar user, member, workspace, subscriber, or billing identity because of any lead lifecycle event.

#### Scenario: Stable provider identity resolves an existing lead

- GIVEN workspace A already has a lead bound to an approved provider namespace and stable business identifier
- WHEN an authorized import resolves the same exact provider identity in workspace A
- THEN the existing canonical lead MUST be returned
- AND no duplicate lead or identity history entry MUST be created

#### Scenario: Approved normalized fallback creates one lead

- GIVEN an eligible business has no approved stable provider identity
- AND workspace A has no lead matching the current approved normalized-fingerprint policy
- WHEN an authorized import creates or resolves the business
- THEN exactly one canonical business and lead MUST be created in workspace A using that policy version
- AND the normalized evidence used for the decision MUST be retained without unnecessary raw personal data

#### Scenario: Identity candidates collide

- GIVEN incoming source evidence matches or disagrees with more than one existing workspace A identity
- WHEN create-or-resolve evaluates the evidence
- THEN it MUST return `conflict`
- AND it MUST NOT silently merge, split, overwrite, or select a lead

#### Scenario: Same business exists in another workspace

- GIVEN workspace B contains a lead for the same provider business or real-world business
- WHEN a workspace A Member imports or probes that business
- THEN workspace A MAY create or resolve its own independent identity
- AND the result MUST NOT reveal or link workspace B's lead, source references, stage, outcome, value, or relationships

#### Scenario: Lead becomes Won

- GIVEN a workspace lead is corrected to Closed with outcome Won
- WHEN the correction commits
- THEN the business MUST remain a workspace prospect or client identity
- AND the system MUST NOT create a Jagwar subscriber, membership, workspace, user, or billing identity for it

### Requirement: V1 lead creation sources are explicit and closed

Only an approved discovery/import create-or-resolve contract MUST create a V1 lead. Every created lead MUST initially commit as `New lead`. Website, SMS, Inbox, hosting, project, analytics, and commercial operations MUST require an existing authorized lead and MUST NOT create one implicitly. Manual lead creation and any other implicit creation source MUST NOT be available unless a later explicit change adds and specifies it.

#### Scenario: Approved discovery import creates a lead

- GIVEN an active Member is authorized for workspace A and selects an eligible displayed discovery business
- WHEN the approved import create-or-resolve operation commits
- THEN exactly one workspace A lead MUST be created in `New lead`
- AND the result MUST identify whether the lead was created or already existed

#### Scenario: Website request names no existing lead

- GIVEN a website creation request has no existing authorized lead
- WHEN the request reaches the lead-pipeline contract
- THEN it MUST be denied without creating a business, lead, attempt, relationship, or transition

#### Scenario: Member attempts manual creation

- GIVEN an active Member submits business details outside the approved discovery/import contract
- WHEN the request is evaluated in V1
- THEN manual lead creation MUST be denied
- AND no provisional or implicit lead identity MUST be persisted

### Requirement: V1 pipeline stages and outcomes are exact

The current stage MUST be exactly one of `New lead`, `Website building`, `Contacted`, or `Closed`. Custom stages, stage reordering, parallel pipelines, and workspace-defined outcome vocabularies MUST NOT be supported. `Closed` MUST have exactly one current outcome, `Won` or `Lost`; every non-Closed stage MUST have no current outcome and no current Won amount or currency.

#### Scenario: Valid Closed outcome commits

- GIVEN an authorized correction targets `Closed` with exactly outcome `Won` or `Lost`
- WHEN all concurrency and value invariants pass
- THEN `Closed` and the selected outcome MUST become current together

#### Scenario: Closed has no valid outcome

- GIVEN a command targets `Closed` with no outcome, both outcomes, or an outcome outside `Won` and `Lost`
- WHEN the command is validated
- THEN it MUST be denied without changing current state or version

#### Scenario: Custom stage is submitted

- GIVEN a workspace submits a custom, reordered, or parallel stage value
- WHEN the command is validated
- THEN it MUST be denied
- AND the fixed V1 vocabulary MUST remain unchanged

### Requirement: Current state is a versioned projection backed by durable history

The system MUST expose a current lead projection with a monotonic version and MUST back it with append-only or explicitly superseding history. Every committed identity decision or correction, automatic transition, manual stage/outcome/value correction, attempt or project relationship result, and required denied or stale mutation evidence MUST retain: workspace and lead identity; human or named system actor; bounded source and action; prior and resulting stage, outcome, and value as applicable; server-established timestamp; stable source operation/event identity; request and operation correlation; expected and resulting version; workspace-authority evidence; and supersession linkage when applicable. Metadata MUST use an allowlisted bounded schema and MUST exclude provider secrets, raw provider payloads, message bodies, prompts, credentials, session or JWT tokens, and unnecessary personal data.

#### Scenario: Automatic transition is explained

- GIVEN an accepted automatic trigger changes a lead stage
- WHEN the transition commits
- THEN the current projection version MUST increase monotonically
- AND durable history MUST identify the prior state, resulting state, trigger evidence, actor, authority, time, and correlation

#### Scenario: Evidence is corrected

- GIVEN retained history requires a lawful correction
- WHEN an authorized correction is recorded
- THEN a new record MUST append or explicitly supersede the prior record
- AND the original evidence MUST remain traceable

#### Scenario: Metadata contains prohibited content

- GIVEN a command supplies a raw provider payload, message body, prompt, secret, credential, token, or oversized metadata
- WHEN the history boundary validates it
- THEN the prohibited metadata MUST be rejected or excluded according to the approved bounded schema
- AND it MUST NOT enter lead history

### Requirement: Mutations are optimistic and return typed outcomes

Every lead identity, current-state, correction, automatic-transition, attempt, and relationship mutation MUST be atomic and MUST return a typed conceptual outcome of `allowed`, `denied`, `conflict`, or `replay`. A state-bearing mutation MUST compare an expected current version. A stale expected version or concurrent incompatible identity/relationship result MUST return `conflict` with no partial projection, history, outcome, value, attempt, relationship, metering identity, or analytics-source mutation. A recognized repeat of a committed operation MUST return `replay` with the same committed semantic result.

#### Scenario: Two corrections race

- GIVEN two authorized commands use the same current lead version
- WHEN both attempt incompatible corrections concurrently
- THEN at most one command MUST commit against that version
- AND the other MUST return `conflict` with no partial mutation

#### Scenario: Stale command arrives

- GIVEN a lead has advanced beyond a command's expected version
- WHEN the stale command is evaluated
- THEN it MUST return `conflict`
- AND current state and related evidence MUST remain unchanged except bounded conflict audit evidence required by policy

#### Scenario: Committed command is retried

- GIVEN an operation already committed with a stable operation identity
- WHEN the same semantically identical operation is retried
- THEN the system MUST return `replay` with the committed result
- AND MUST NOT append a duplicate transition, relationship, charge identity, or analytics event

### Requirement: Members may make history-preserving manual corrections

A current active Owner or Member MUST be allowed to correct an authorized workspace lead to any fixed V1 stage, including moving backward and reopening `Closed`, when the command supplies the current expected version and a non-empty bounded reason. A manual correction MUST preserve the prior state and actor evidence. Moving from `Closed` to a non-Closed stage MUST clear the current outcome and any current Won amount/currency together while preserving them in history. Moving to `Closed` MUST supply exactly `Won` or `Lost`; `Lost` MUST have no current value, and `Won` MAY have a valid paired value. Correcting Won to Lost MUST clear current value; correcting Lost to Won MUST replace absent value with either no value or a newly supplied valid pair. Automatic events MUST NOT receive manual-correction privilege.

#### Scenario: Member reopens a Closed Won lead

- GIVEN an active Member is authorized for a current `Closed`/`Won` lead and supplies its current version and bounded reason
- WHEN the Member corrects it to `Contacted`
- THEN `Contacted` MUST become current with no current outcome or value
- AND the prior Closed/Won/value evidence MUST remain in history

#### Scenario: Member corrects Won to Lost

- GIVEN a lead is `Closed`/`Won` with a current amount and currency
- WHEN an authorized Member corrects the outcome to `Lost` against the current version
- THEN `Closed`/`Lost` MUST become current with no current amount or currency
- AND the prior Won value MUST remain historical

#### Scenario: Correction reason is absent or excessive

- GIVEN a correction has no non-empty reason or exceeds the approved bound
- WHEN the command is validated
- THEN it MUST be denied without changing the lead or its version

#### Scenario: Removed Member retries a correction

- GIVEN a Member prepared a correction and was removed before commit
- WHEN the operation revalidates current authority
- THEN it MUST be denied without changing lead state
- AND prior client visibility or an earlier allowed decision MUST NOT grant continuing authority

### Requirement: Website creation trigger is successful, monotonic, and replay-safe

The website automatic trigger MUST be accepted only from the website capability's public evidence that the first lead-backed creation operation and inherited project result committed successfully. For a current `New lead`, that evidence MUST move the lead to `Website building`; for `Website building`, `Contacted`, or `Closed`, it MUST NOT regress, reopen, change an outcome, or change a value. Preview, intent, generation start, pending, ambiguous, or failed creation evidence MUST NOT transition the lead. Website, editor, project, publication, archival, deletion, recreation, hosting, and domain lifecycle MUST remain independent of pipeline stage.

#### Scenario: First lead-backed website creation commits

- GIVEN an authorized existing lead is `New lead`
- WHEN the website capability submits first successfully committed creation and project evidence
- THEN the project relationship MUST commit idempotently
- AND the lead MUST advance to `Website building`

#### Scenario: Website success arrives after Contacted

- GIVEN a lead is already `Contacted`
- WHEN valid website success evidence arrives out of order
- THEN the truthful project relationship MAY commit
- AND the lead MUST remain `Contacted` without a new regressive transition

#### Scenario: Website result is ambiguous or failed

- GIVEN a lead-backed creation attempt is pending, ambiguous, or failed
- WHEN its evidence is submitted
- THEN no successful project relationship or automatic stage transition MUST be recorded

#### Scenario: Related website is later deleted

- GIVEN a related project was archived, deleted, unpublished, suspended, or otherwise changed after successful creation
- WHEN that lifecycle event is observed
- THEN it MUST NOT regress, close, or otherwise rewrite the lead stage or history

### Requirement: SMS trigger uses durable accepted outbound-send evidence

The SMS automatic trigger MUST be accepted only from the SMS capability's public, authenticated evidence that an outbound send was durably accepted by its authoritative send boundary. It MUST NOT be triggered by preview, user confirmation, lookup, reservation or debit, provider invocation without durable acceptance, delivery receipt, inbound reply, or ambiguous timeout. Exact Telnyx status and reconciliation mapping MUST remain owned by the SMS specification. Accepted evidence MUST move `New lead` or `Website building` to `Contacted`; it MUST leave `Contacted` or `Closed` unchanged and MUST never regress, reopen, or alter Closed outcome/value.

#### Scenario: First outbound send is durably accepted

- GIVEN an existing authorized lead is `New lead` or `Website building`
- WHEN authenticated SMS authority submits durable accepted-send evidence
- THEN the lead MUST advance to `Contacted` exactly once

#### Scenario: Non-authoritative SMS evidence arrives

- GIVEN only preview, confirmation, reservation, debit, delivery, reply, or provider-call evidence exists
- WHEN it is presented as a pipeline trigger
- THEN the trigger MUST be denied without a stage transition

#### Scenario: SMS timeout is ambiguous

- GIVEN provider invocation timed out without authoritative durable acceptance
- WHEN the ambiguous result reaches lead pipeline
- THEN no transition MUST occur
- AND a later authenticated reconciliation event MAY trigger Contacted using the same bounded source operation identity

#### Scenario: Accepted send arrives after manual Closed

- GIVEN a Member already corrected the lead to `Closed` with an outcome
- WHEN accepted-send evidence arrives later
- THEN the lead MUST remain Closed with the same outcome and value
- AND the automatic event MUST NOT reopen it

### Requirement: Trigger and command idempotency is workspace-scoped and order-independent

Every command or automatic trigger MUST use a bounded stable source operation/event identity. Idempotency MUST be scoped by authoritative workspace plus trigger or command kind plus source operation/event identity. Reuse in another workspace MUST NOT expose or alias the first workspace's result. Reuse with materially different payload semantics in the same scope MUST return `conflict`. Processing events out of order MUST preserve truthful non-state relationships while applying only legal monotonic transitions.

#### Scenario: Same event is replayed

- GIVEN a trigger committed in workspace A
- WHEN the same kind and source event identity is delivered again with equivalent semantics
- THEN `replay` MUST return the original semantic result
- AND no duplicate state or history effect MUST occur

#### Scenario: Idempotency identity is reused with different semantics

- GIVEN a workspace and trigger kind already used a source operation identity
- WHEN a different lead, project, accepted-send fact, or command payload reuses it
- THEN the system MUST return `conflict`
- AND MUST NOT mutate either target

#### Scenario: Same source identity is used in two workspaces

- GIVEN workspaces A and B independently receive the same provider event identifier
- WHEN each authorized operation is evaluated
- THEN each workspace MUST have an independent idempotency scope
- AND neither result MUST disclose or link the other workspace

#### Scenario: Older automatic event arrives last

- GIVEN newer valid evidence already advanced a lead to `Contacted`
- WHEN an older website event arrives afterward
- THEN any truthful relationship MAY be retained idempotently
- AND the current stage MUST remain `Contacted`

### Requirement: Website attempts and project relationships are durable and bounded

A lead MAY retain multiple website creation attempts and multiple successfully related projects. Each attempt MUST have one stable workspace-scoped operation identity and an explicit pending, succeeded, failed, or superseded result. Retries of one operation MUST reuse the same attempt and committed result. A project MUST relate to at most one lead in the same workspace. V1 MUST NOT support project reassignment, lead merge, lead split, or retroactive assignment of unrelated inherited projects. A pending, ambiguous, failed, or superseded attempt MUST NOT be represented as a successful project and MUST NOT cause an automatic transition.

#### Scenario: Lead has multiple successful projects

- GIVEN separate authorized website operations for one lead each commit successfully
- WHEN their results are attached
- THEN the lead MAY retain multiple distinct successful project relationships
- AND each project MUST retain its own source attempt evidence

#### Scenario: Retry reuses one attempt

- GIVEN a website operation has an existing pending or committed attempt identity
- WHEN that operation is retried
- THEN the same attempt MUST be resolved
- AND a succeeded result MUST return the same project relationship without duplication

#### Scenario: Project is offered to a second lead

- GIVEN a project is already related to lead A in a workspace
- WHEN an operation attempts to relate it to lead B in that workspace
- THEN the operation MUST return `conflict`
- AND the original relationship MUST remain unchanged

#### Scenario: Cross-workspace project is offered

- GIVEN a workspace A lead command references a project owned by workspace B
- WHEN relationship authorization is evaluated
- THEN it MUST be denied with a sanitized result
- AND neither workspace's lead or project data MUST be disclosed or changed

### Requirement: Won value is exact, validated, and analytics-only

A `Closed`/`Won` lead MAY have an operator-recorded amount only as a canonical exact non-floating decimal amount paired with an uppercase active ISO 4217 currency code. Amount and currency MUST be both present or both absent. The amount MUST be non-negative, including zero, and MUST satisfy the approved currency scale for the applicable versioned ISO 4217 policy; binary floating-point input and excess fractional scale MUST be denied. Only a current authorized Member MAY add, replace, or clear the pair through an optimistic history-preserving correction. Values in different currencies MUST remain separate. Jagwar MUST NOT invoice, authorize, collect, settle, escrow, convert, refund, or otherwise process the operator-to-client sale through this capability.

#### Scenario: Member records an exact Won value

- GIVEN an authorized Member corrects a lead to `Closed`/`Won` with current version
- WHEN the Member supplies canonical amount `0` or another non-negative exact decimal and a supported uppercase currency within its scale
- THEN the pair MAY become current
- AND it MUST be retained as an operator assertion for analytics

#### Scenario: Amount pair is invalid

- GIVEN a command supplies only amount, only currency, lowercase or unsupported currency, negative amount, floating-point-only representation, or excess currency scale
- WHEN the value is validated
- THEN the command MUST be denied without changing current value, outcome, stage, or version

#### Scenario: Member corrects a Won value

- GIVEN a lead is `Closed`/`Won` with a current value
- WHEN an authorized Member submits a valid replacement or clearing correction against the current version
- THEN the new pair or absence MUST become current
- AND the prior pair MUST remain in history

#### Scenario: Analytics reads multiple currencies

- GIVEN a workspace has Won leads in different currencies
- WHEN lead pipeline exposes their values
- THEN it MUST preserve each exact amount and currency separately
- AND MUST NOT produce a converted or combined monetary total

### Requirement: Server authority and workspace isolation govern every access shape

Every create-or-resolve, read, list, history read, correction, transition, value mutation, attempt, relationship, and public-consumer operation MUST derive the authenticated subject, current workspace actor, and resource ownership on the server through workspace authority. Active Owners and Members MAY perform ordinary lead workflows subject to lead rules. Removed or inactive members MUST be denied on the next request. Long-running, retried, or externally effectful workflows MUST revalidate current authority at the owning irreversible boundary. Client-selected workspace, route visibility, inherited project role, prior allowed result, and submitted actor or ownership claims MUST NOT grant authority. Direct, list, indirect, pagination/count, and every mixed-batch element MUST be constrained to the authorized workspace. Existing cross-workspace and nonexistent identifiers MUST produce sanitized non-enumerating denials.

#### Scenario: Authorized Member lists leads

- GIVEN a subject is a current Member of workspace A
- WHEN the Member lists leads with filters, counts, or pagination
- THEN every returned lead and metadata value MUST be constrained to workspace A

#### Scenario: Direct cross-workspace lead is guessed

- GIVEN a workspace A Member submits an existing workspace B lead identifier
- WHEN a direct read or mutation is authorized
- THEN the operation MUST be denied before protected data or mutation
- AND its public result MUST be indistinguishable from an unauthorized nonexistent identifier

#### Scenario: Indirect relationship crosses workspaces

- GIVEN a workspace A request references a project, conversation, source run, or event indirectly owned by workspace B
- WHEN lead ownership is resolved
- THEN authorization MUST fail closed without disclosing the relationship

#### Scenario: Mixed batch contains another workspace

- GIVEN a mutating or metered workspace A batch includes workspace A and workspace B lead identifiers
- WHEN the batch is authorized
- THEN no workspace B item MUST be read, changed, charged, or dispatched
- AND no allowed item MUST authorize an unauthorized item

#### Scenario: Member is removed during a workflow

- GIVEN a Member passed an earlier check but was removed before an irreversible commit or dispatch
- WHEN authority is revalidated
- THEN the operation MUST be denied with no new irreversible effect
- AND a retry with the same operation identity MUST resolve current authority again

### Requirement: Supabase Auth, application authority, and RLS remain distinct

Supabase Auth MUST establish subject identity; current application-owned workspace membership MUST establish actor and workspace authority; ownership-aware RLS MUST provide defense in depth for every lead-pipeline table in an exposed schema. Authentication or `TO authenticated` alone MUST NOT authorize lead data. Authorization MUST NOT rely on `user_metadata`, client claims, UI state, or stale JWT `app_metadata`. Application checks MUST remain mandatory even when a server credential can bypass RLS. Privileged access MUST be server-only, narrowly named, workspace-checked, and audited, and MUST NOT expose credentials or become a blanket bypass.

#### Scenario: JWT contains stale membership

- GIVEN a valid Supabase session contains a stale Owner or Member claim after removal
- WHEN a lead operation is requested
- THEN current application membership MUST deny it
- AND the stale claim MUST NOT restore access

#### Scenario: Authenticated role probes another workspace row

- GIVEN an authenticated database role attempts direct access to another workspace's exposed lead row
- WHEN RLS evaluates the request
- THEN an ownership-aware policy MUST deny it
- AND application services MUST still enforce their own authorization

#### Scenario: Privileged server operation handles a lead

- GIVEN a named server operation can use privileged database access
- WHEN it processes a workspace-owned lead
- THEN it MUST still prove exact workspace and actor or approved system authority
- AND no service credential MUST appear in results, metadata, or history

### Requirement: Public consumer contracts are narrow and authority-preserving

Lead pipeline MUST expose intentional persistence-neutral public contracts and event identities for its consumers:

- discovery/import MUST create-or-resolve an eligible displayed business using source-run and business identity, return created-versus-existing status, and expose a stable import/lead identity so duplicate resolution does not imply a second lead charge;
- website creation MUST authorize an existing lead-backed attempt, attach one successfully committed project result idempotently, and apply the non-regressing website trigger;
- SMS MUST submit one authenticated durable accepted-outbound-send event idempotently while retaining exact Telnyx mapping ownership;
- Inbox MUST resolve an authorized conversation-to-workspace-to-lead relationship and read current lead identity/state without creating or mutating a lead implicitly;
- hosting and project consumers MUST read durable lead-to-project ownership evidence without making lifecycle state a pipeline transition;
- commercial MUST receive stable workspace, import/lead, command, attempt, and source-operation identities needed for idempotent reservation, finalization, and metering while retaining ownership of balances and ledgers; and
- owner analytics MUST receive stable committed identity, transition, correction, outcome/value, attempt, and relationship event identities with lead version and supersession semantics, while retaining ownership of projections, reconciliation, staleness, activation derivation, and currency-separated presentation.

#### Scenario: Duplicate import coordinates metering

- GIVEN discovery retries an eligible import for a business already resolved in the workspace
- WHEN the public contract returns `replay` or existing status
- THEN it MUST return the same stable lead/import identity
- AND lead pipeline MUST NOT represent the retry as a newly created chargeable lead

#### Scenario: Inbox resolves a conversation

- GIVEN an authorized workspace conversation is already related to an existing lead
- WHEN Inbox uses the public read contract
- THEN it MUST receive the scoped current lead identity and state
- AND lead pipeline MUST NOT expose message contents or create a lead

#### Scenario: Hosting observes a project relationship

- GIVEN a hosted site resolves to a project related to a lead
- WHEN hosting reads the public relationship evidence
- THEN it MUST receive only the authorized relationship contract
- AND a hosting lifecycle change MUST NOT mutate pipeline stage

#### Scenario: Owner analytics consumes a corrected transition

- GIVEN one lead event supersedes an earlier correction or value assertion
- WHEN owner analytics consumes public event identities
- THEN it MUST be able to distinguish current version from superseded evidence
- AND lead pipeline MUST preserve currency and workspace boundaries

### Requirement: Capability ownership and dependency direction are preserved

Lead pipeline MUST own business/lead identity, current projection, history, correction rules, attempt identities, and lead-to-project relationships. Discovery MUST own provider execution, snapshots, eligibility, and source evidence; website creation MUST own prompts, presets, BYOK/commercial gates, inherited CREATE invocation, and successful-creation evidence; SMS MUST own consent, compliance, sender state, templates, reservations, provider invocation, accepted-send reconciliation, and exact Telnyx mapping; Inbox MUST own conversations and messages; hosting MUST own site/domain/grace/retention lifecycle; commercial MUST own balances and ledgers; analytics MUST own derived projections. Consumers MUST use public contracts and MUST NOT query lead persistence ad hoc, deep-import lead internals, or cause lead pipeline to import sibling capability internals.

#### Scenario: Consumer depends on persistence internals

- GIVEN a downstream capability proposes querying lead tables or importing an internal module instead of using the public contract
- WHEN the dependency is reviewed
- THEN it MUST be rejected
- AND the owner boundaries MUST remain intact

#### Scenario: Lead pipeline is asked to interpret Telnyx state

- GIVEN provider-specific status evidence requires reconciliation
- WHEN integration ownership is evaluated
- THEN the SMS capability MUST determine whether accepted-send evidence is authoritative
- AND lead pipeline MUST consume only the resulting public evidence

### Requirement: Retention, privacy deletion, and correction preserve lawful evidence

Ordinary correction, closure, project deletion, workspace cancellation, or application-level removal MUST NOT hard-delete or rewrite lead identity, transition, correction, attempt, relationship, operation-result, or authority evidence. Policy- or legally required deletion MUST use explicit tombstone or supersession evidence, minimize or remove personal data as required, and preserve only the minimum lawful identity, security, idempotency, financial-audit, and event-correlation evidence permitted or required by the approved policy. The system MUST NOT invent a universal retention duration or assume that another capability's duration applies. Exact retention periods, legal holds, deletion timing, privileged access, and anonymization fields remain compliance decisions and MUST be approved before production deletion automation.

#### Scenario: Member corrects identity or stage

- GIVEN an ordinary business identity or stage correction is authorized
- WHEN it commits
- THEN the correction MUST append or supersede evidence
- AND it MUST NOT hard-delete the prior truthful record

#### Scenario: Legal deletion policy applies

- GIVEN an approved policy requires deletion or minimization of lead personal data
- WHEN the policy operation executes
- THEN explicit tombstone or supersession evidence MUST describe the lawful action
- AND only the approved minimum lawful or audit evidence MUST remain

#### Scenario: Retention period is unresolved

- GIVEN no approved compliance policy defines the applicable exact retention or deletion period
- WHEN automated deletion would otherwise run
- THEN the system MUST fail closed without inventing a duration
- AND it MUST preserve protected evidence under restricted access pending a decision

### Requirement: Workspace authority runtime is a fail-closed prerequisite

No production lead API, import, migration, read, correction, transition, relationship, provider integration, metering integration, or analytics feed MAY operate until the approved workspace-authority runtime contracts, persistence, current actor and resource decisions, revalidation, and security evidence are available. Test doubles MAY support later isolated development, but production MUST NOT substitute inherited project roles, client-selected workspace, JWT roles, user-owned records, or service-role-only access.

#### Scenario: Lead operation runs before authority exists

- GIVEN workspace-authority planning exists but its approved runtime is unavailable
- WHEN any production lead operation is requested
- THEN the operation MUST fail closed
- AND no lead data, provider action, relationship, metering event, or analytics event MUST be created or disclosed

#### Scenario: Temporary project-role substitute is proposed

- GIVEN an inherited project role or client workspace selection could appear to identify access
- WHEN it is offered as temporary lead authority
- THEN the substitute MUST be rejected
- AND production composition MUST remain blocked

### Requirement: Inherited Onlook behavior is preserved additively

Lead pipeline MUST be introduced only through additive capability boundaries. It MUST NOT wrap, restructure, redesign, or otherwise touch the editor; replace or duplicate inherited AI CREATE or project creation; alter the fixed CodeSandbox template, publishing, settings, source export, or customer-controlled Git behavior; or retroactively reinterpret inherited projects as leads. Any relationship to inherited CREATE or projects MUST use a separately approved narrow public boundary and MUST preserve existing behavior.

#### Scenario: Pipeline integration proposes an editor wrapper

- GIVEN a proposed integration would wrap or modify inherited editor or CREATE behavior
- WHEN reviewed against this specification
- THEN it MUST be rejected or moved to a separately approved narrow change
- AND inherited Onlook behavior MUST remain intact

#### Scenario: Existing inherited project has no lead

- GIVEN an inherited project predates lead pipeline and has no approved relationship
- WHEN lead pipeline is introduced
- THEN the project MUST remain unassigned
- AND no lead identity or transition MUST be inferred from it

### Requirement: Future delivery obeys Strict-TDD and protected-change governance

Any future implementation MUST be divided into dependency-ordered cohesive Strict-TDD slices of 250–400 changed lines. Every slice MUST begin with relevant failing tests, make the smallest passing change, and refactor only while green; a transactional invariant MUST NOT be split merely to meet the budget. Before any governed edit, one reviewed exact `architecture/slices/<slice>.json` manifest MUST name every candidate path and classification. Before each protected inherited file edit, a per-file Core Change Request MUST name that exact path and candidate resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the manifest. Planning artifacts, wildcards, prior approvals, or intent-only hashes MUST NOT authorize implementation. Generated migrations MUST remain maintainer-owned, and agents MUST NOT edit generated output or `bun.lock`.

#### Scenario: Slice is outside the governed size without invariant justification

- GIVEN a future implementation slice is smaller than 250 or larger than 400 changed lines
- WHEN it is reviewed
- THEN it MUST be resized or explicitly blocked where splitting would violate one transactional invariant
- AND implementation MUST NOT proceed merely because planning exists

#### Scenario: Manifest omits a candidate path

- GIVEN a future slice proposes a governed edit not named exactly in its reviewed manifest
- WHEN the edit is attempted
- THEN the edit MUST remain blocked

#### Scenario: Protected edit lacks candidate-resulting-hash approval

- GIVEN a protected inherited file would change
- WHEN no approved per-file CCR names its exact path and candidate resulting SHA-256
- THEN that file edit MUST remain blocked even if a related change was previously approved
