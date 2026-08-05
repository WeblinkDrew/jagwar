---
title: Jagwar Business Workflows on Onlook — Epic Breakdown
status: product-backlog-approved-with-course-correction
created: 2026-07-28
updated: 2026-07-28
stepsCompleted:
  - requirements-extracted
  - epics-designed
  - stories-created
inputDocuments:
  - 02-prd.md
  - 03-domain-model-and-rules.md
  - 04-ux-and-information-architecture.md
  - 05-integration-contracts.md
  - ../sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md
---

# Jagwar Business Workflows on Onlook — Epic Breakdown

## Overview

This backlog rebuilds Jagwar's differentiated business workflows inside the Onlook product. Epics are grouped by complete user outcomes and may reuse Onlook's existing platform capabilities. The numbering is traceability, not permission to implement blindly: first complete the architecture gate below, then produce a dependency-safe sprint order against a pinned writable Onlook commit. Old Jagwar paths cited in `07-donor-inventory-and-migration.md` are evidence only.

## Approved dependency-sequencing authority

Andrew approved the BMAD Correct Course proposal on 2026-07-28. The parent epics, 42 story IDs, requirements coverage, and acceptance criteria in this file remain authoritative. Their sprint-sized suffix slices, entry gates, certification boundaries, and dependency order are governed by `../sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md` and the adopted implementation sequence.

OD-15 is resolved for the Jagwar target by Andrew-approved CCR-019 through CCR-022: the unavailable private upstream `apps/admin` submodule, root script, and lock records are intentionally retired from this fork. Jagwar does not claim parity with that unavailable application. Runtime operator controls remain gated on OD-13's explicit role/authorization and placement decision; an approved target-native Jagwar operator surface must reuse existing Onlook authorities and cannot become a parallel admin, auth, billing, project, job, or audit system.

## Pre-story target architecture gate

No persistence or production-facing story starts until the receiving session attaches a versioned decision record that identifies:

1. the writable target repository, branch, and pinned Onlook commit;
2. the one ownership/isolation authority actually present there (user, project membership, team, or another native scope);
3. the one subscription, entitlement, allocation, and usage authority, including how existing Onlook records are extended or reconciled;
4. the target persistence and authorization/RLS conventions;
5. one durable async operation authority for discovery and outreach, including lease, retry, cancellation, recovery, reconciliation, outbox/event, and trace behavior;
6. the exact native project/source/AI path that can create a prospect-specific editable first draft from verified Lead facts.
7. an Onlook-native module map assigning each Jagwar capability to a focused package or route-local feature, plus a baseline inventory that distinguishes new Jagwar-owned files from protected original Onlook files;
8. the additive `JagwarBusinessContextV1` seam and every anticipated original-file Core Change Request;
9. the baseline capability/test matrix proving Jagwar will not deprecate existing Onlook behavior.

A blank project, a parallel Jagwar billing ledger, route-lifetime background work, a donor-shaped compatibility layer, a generic dumping package, or a new abstract `Workspace` table created without this mapping fails the gate. No file present in the pinned Onlook baseline may be edited before its exact Core Change Request receives Andrew's explicit confirmation.

## Requirements inventory

### Functional requirements

- **FR-WA-1:** Use the target platform's authenticated identity and Workspace authority for every Jagwar record and operation.
- **FR-WA-2:** Reference Onlook projects without creating a second canonical project/site document.
- **FR-WA-3:** Admit business mutations through server-authoritative application operations.
- **FR-WA-4:** Follow Onlook's modular-monorepo, focused package, public-export, and route-local feature structure.
- **FR-WA-5:** Preserve every existing Onlook capability and require per-original-file confirmation before modification.
- **FR-WA-6:** Supply verified business facts to Onlook AI through an additive validated context boundary.
- **FR-WA-7:** Use Jagwar for all new product/target naming and retain Telio only for exact legacy provenance.
- **FR-LD-1:** Search local businesses with one query and requested count.
- **FR-LD-2:** Represent queued/running/succeeded/failed/canceled discovery lifecycle truthfully.
- **FR-LD-3:** Save and replay Candidate Snapshots without another provider call.
- **FR-LD-4:** Normalize provider facts into one versioned Candidate contract with explicit unknowns.
- **FR-LD-5:** Deduplicate Candidates and Leads.
- **FR-LD-6:** Keep map/place imagery limited to discovery context unless rights are established.
- **FR-QL-1:** Produce Jagwar-owned `missing-site|weak-site|has-site` classification.
- **FR-QL-2:** Retain qualification evidence and policy version.
- **FR-QL-3:** Rank opportunities predictably and explain the primary reason.
- **FR-QL-4:** Resolve phone intelligence independently of discovery success.
- **FR-CRM-1:** Add selected Candidates to the pipeline idempotently.
- **FR-CRM-2:** Create manually sourced Leads.
- **FR-CRM-3:** Maintain six Pipeline Stages.
- **FR-CRM-4:** Present complete Lead facts, qualification, project, publication, outreach, and activity.
- **FR-CRM-5:** Advance New → Contacted after the first qualifying successful send.
- **FR-CRM-6:** Enforce suppression/archive/delete semantics without silently erasing material history.
- **FR-PRJ-1:** Create or associate an authorized Onlook project from a Lead.
- **FR-PRJ-2:** Seed verified business context while separating facts from generated copy.
- **FR-PRJ-3:** Open Onlook's authoritative editor.
- **FR-PRJ-4:** Resolve an exact outreach-safe Publication.
- **FR-OR-1:** Use versioned, capability-declaring Outreach Connectors.
- **FR-OR-2:** Bind one Lead and one exact Publication to each send.
- **FR-OR-3:** Fan out multi-select as independent per-Lead sends.
- **FR-OR-4:** Enforce connector-driven compliance before dispatch.
- **FR-OR-5:** Maintain durable, idempotent send lifecycle.
- **FR-OR-6:** Preserve historical publication/template/recipient/provider evidence.
- **FR-OR-7:** Provide managed WhatsApp setup and status.
- **FR-OR-8:** Enforce suppression and withdrawal.
- **FR-OR-9:** Record, correct, withdraw, and audit consent evidence used by connector-driven compliance.
- **FR-ACT-1:** Calculate 5+2+1 from authoritative committed records.
- **FR-ACT-2:** Show consistent progress from one projection.
- **FR-ACT-3:** Gate continued volume only after the configured value cycle is reachable.
- **FR-BIL-1:** Derive entitlement from normalized stored billing-provider state.
- **FR-BIL-2:** Maintain an idempotent Usage Ledger.
- **FR-BIL-3:** Meter discovery separately from AI/generation credits.
- **FR-BIL-4:** Meter outreach and generation at explicit authoritative lifecycle points.
- **FR-BIL-5:** Enforce commercial limits and abuse controls safely.
- **FR-BIL-6:** Allocate trial/recurring allowances idempotently.
- **FR-BIL-7:** Defer final Jagwar pricing/gates until representative target costs are measured and approved.
- **FR-OPS-1:** Expose safe provider and job health to operators.
- **FR-OPS-2:** Manage allowed provider connections without exposing secrets.
- **FR-OPS-3:** Version and audit qualification, outreach, activation, and commercial policy.
- **FR-OPS-4:** Prevent arbitrary runtime authority in operator tools.

### Non-functional requirements

- **NFR-1:** Strong server-derived Workspace isolation and least privilege.
- **NFR-2:** Idempotent, retry-safe external and money-affecting operations.
- **NFR-3:** Responsive shell and bounded async/provider behavior.
- **NFR-4:** WCAG 2.2 AA interaction and focus target.
- **NFR-5:** Privacy, retention, suppression, and third-party rights controls.
- **NFR-6:** Traceable observability without secrets or unnecessary personal data.
- **NFR-7:** Native Onlook visual and interaction consistency.
- **NFR-8:** Onlook-native maintainability, package discipline, baseline compatibility, and per-core-file change traceability.

### UX design requirements

- **UX-DR-1:** Reuse Onlook tokens, type, icons, primitives, density, motion, and focus patterns.
- **UX-DR-2:** Provide one-query/one-count Find Leads UX with no fake initial results.
- **UX-DR-3:** Distinguish running, empty success, provider failure, partial enrichment, saved replay, and limit states.
- **UX-DR-4:** Provide accessible result selection and an equivalent list for map interactions.
- **UX-DR-5:** Provide accessible Pipeline movement and responsive non-Kanban representation.
- **UX-DR-6:** Use state-dependent Lead actions that connect directly to the Onlook project/publication.
- **UX-DR-7:** Preview outreach eligibility, blockers, exact URL, template, recipient, and usage before sending.
- **UX-DR-8:** Show independent per-Lead outcomes for a fan-out batch.
- **UX-DR-9:** Restore focus correctly across sheets/dialogs and announce async changes selectively.
- **UX-DR-10:** Pass a real-browser comparison against Onlook and contain no legacy Telio/Kiranism visual residue.

## FR coverage map

| Epic | Requirements |
| --- | --- |
| Epic 1 | FR-WA-1..7, NFR-1, NFR-7, NFR-8, UX-DR-1 |
| Epic 2 | FR-LD-1..6, FR-QL-1..4, NFR-2..6, UX-DR-2..4 |
| Epic 3 | FR-CRM-1..6, NFR-1..5, UX-DR-5..6, UX-DR-9 |
| Epic 4 | FR-PRJ-1..4, FR-WA-2..6, NFR-1..3, NFR-8, UX-DR-6 |
| Epic 5 | FR-OR-1..9, FR-CRM-5, NFR-1..6, UX-DR-7..9 |
| Epic 6 | FR-ACT-1..3, FR-BIL-1..7, NFR-1..6, NFR-8 |
| Epic 7 | FR-OPS-1..4, all NFRs, UX-DR-10, migration and release evidence |

### Story coverage map

| Story | Primary requirements |
| --- | --- |
| 1.1 | FR-WA-1, FR-WA-3, NFR-1 |
| 1.2 | FR-WA-2, FR-WA-3, FR-WA-5, NFR-7, UX-DR-1 |
| 1.3 | FR-OPS-3, FR-OPS-4, NFR-1, NFR-6 |
| 1.4 | FR-LD-2, FR-OR-5, FR-BIL-2, NFR-2, NFR-3, NFR-6 |
| 1.5 | FR-WA-4, FR-WA-5, FR-WA-7, NFR-8 |
| 2.1 | FR-LD-4, FR-LD-5, NFR-1, NFR-5 |
| 2.2 | FR-LD-1, FR-LD-2, FR-BIL-2, NFR-2, NFR-3, NFR-6 |
| 2.3 | FR-LD-3, FR-LD-5, FR-BIL-3 |
| 2.4 | FR-QL-1, FR-QL-2, FR-QL-3, NFR-5 |
| 2.5 | FR-QL-4 |
| 2.6 | FR-LD-1, FR-LD-2, FR-LD-3, FR-LD-4, FR-LD-5, FR-LD-6, FR-QL-3, FR-CRM-1, UX-DR-2, UX-DR-3, UX-DR-4, UX-DR-9, NFR-4, NFR-7 |
| 3.1 | FR-CRM-2, FR-LD-5, NFR-1, NFR-2 |
| 3.2 | FR-CRM-3, UX-DR-5, NFR-4 |
| 3.3 | FR-CRM-4, UX-DR-6, UX-DR-9 |
| 3.4 | FR-CRM-6, FR-OR-8, NFR-5 |
| 3.5 | FR-OR-4, FR-OR-8, FR-OR-9, NFR-5, NFR-6 |
| 4.1 | FR-PRJ-1, FR-PRJ-2, FR-WA-2, FR-WA-4, FR-WA-5, FR-WA-6, NFR-2, NFR-8 |
| 4.2 | FR-PRJ-1, FR-PRJ-2, FR-WA-2, FR-WA-6, NFR-2 |
| 4.3 | FR-PRJ-1, FR-WA-1, FR-WA-2 |
| 4.4 | FR-PRJ-3, FR-WA-2, UX-DR-6 |
| 4.5 | FR-PRJ-4, FR-OR-2, FR-OR-6 |
| 5.1 | FR-OR-1, NFR-1, NFR-2 |
| 5.2 | FR-OR-7, FR-OPS-2, UX-DR-7 |
| 5.3 | FR-OR-4, FR-OR-8, FR-OR-9, UX-DR-7, NFR-5 |
| 5.4 | FR-OR-2, FR-OR-5, FR-CRM-5, FR-BIL-4, FR-ACT-1 |
| 5.5 | FR-OR-3, FR-OR-4, FR-OR-5, UX-DR-7, UX-DR-8 |
| 5.6 | FR-OR-5, FR-OR-6, FR-BIL-2, NFR-2, NFR-6 |
| 6.1 | FR-ACT-1, FR-ACT-2 |
| 6.2 | FR-ACT-2, FR-ACT-3, NFR-4, NFR-7 |
| 6.3 | FR-BIL-2, FR-BIL-3, FR-BIL-4, FR-BIL-7, NFR-2, NFR-6, NFR-8 |
| 6.4 | FR-BIL-7, NFR-6, NFR-8 |
| 6.5 | FR-BIL-1, NFR-1, NFR-2, NFR-8 |
| 6.6 | FR-BIL-1, FR-BIL-5, NFR-2, NFR-4, NFR-8 |
| 6.7 | FR-BIL-2, FR-BIL-3, FR-BIL-4, FR-BIL-5, NFR-2, NFR-4, NFR-7 |
| 6.8 | FR-ACT-3, FR-BIL-5, FR-BIL-6, FR-BIL-7, NFR-2 |
| 6.9 | FR-ACT-2, NFR-3, NFR-4, UX-DR-1 |
| 7.1 | FR-OPS-1, FR-OPS-2, NFR-1, NFR-6 |
| 7.2 | FR-OPS-3, FR-OPS-4, NFR-1, NFR-6 |
| 7.3 | FR-WA-1..3, FR-CRM-6, FR-OR-6, FR-OR-8, FR-BIL-1..2, NFR-1..2, NFR-5..6 |
| 7.4 | All functional requirements, NFR-1, NFR-2, NFR-4, NFR-7, UX-DR-10 |
| 7.5 | NFR-3, NFR-5, NFR-6 |
| 7.6 | FR-PRJ-4, NFR-2, NFR-6; explicit infrastructure deferral |

## Epic list

### Epic 1: Enter a secure Jagwar commercial workspace inside Onlook

Users can access Jagwar's commercial workflow as a native part of their authorized Onlook workspace, with coherent navigation and no parallel editor/project authority.

### Epic 2: Find and qualify real local-business opportunities

Users can run bounded discovery, understand durable progress and failures, reopen saved results, and identify the businesses most likely to need a better website.

### Epic 3: Organize prospects and decide the next action

Users can add or create Leads, manage the six-stage Pipeline, inspect complete opportunity context, and control suppression/history safely.

### Epic 4: Turn a Lead into an authoritative Onlook project and published proof

Users can create or associate a prospect project, edit it through Onlook, publish it, and resolve the exact public output that outreach will use.

### Epic 5: Connect WhatsApp and send personalized published proof

Users can complete channel setup, understand eligibility, send one or many personalized previews safely, and track independent delivery outcomes.

### Epic 6: Complete 5+2+1, measure real costs, and commercialize last

Users first see authoritative activation progress while the rebuilt system measures actual cost. Only after representative evidence and owner approval does the product add Jagwar pricing, plan, allowance, checkout, and fair-gate behavior through Onlook's single billing authority.

### Epic 7: Operate, migrate, and release the rebuilt workflow safely

Operators can manage policies and provider health, and the team can prove parity and migrate without inheriting obsolete architecture or losing recoverability.

## Epic 1: Enter a secure Jagwar commercial workspace inside Onlook

### Story 1.1: Map Jagwar records to Onlook workspace authority

As an Onlook workspace member,
I want Jagwar data and actions scoped through my authorized workspace,
So that I cannot see or affect another customer's commercial records.

**Acceptance Criteria:**

**Given** an authenticated actor with access to Workspace A
**When** the actor reads or mutates a Lead, Discovery Run, Project Link, Send, Usage entry, or configuration
**Then** the server derives and verifies Workspace A from authenticated target context
**And** ignores or rejects conflicting browser-supplied workspace identity.

**Given** equivalent resource identifiers in Workspace B
**When** the Workspace A actor attempts direct-ID, URL, batch, or nested-resource access
**Then** no Workspace B data is returned or mutated
**And** the response does not reveal sensitive existence details.

**Given** Onlook supports team roles
**When** Jagwar permissions are mapped
**Then** each action has an explicit minimum role
**And** operator privileges remain separate from customer workspace membership.

### Story 1.2: Add native commercial navigation and route boundaries

As a user,
I want Find Leads, Pipeline, Outreach, and Usage to feel like native Onlook destinations,
So that the commercial workflow is coherent with my projects.

**Acceptance Criteria:**

**Given** the current Onlook shell and primitives have been inventoried
**When** Jagwar navigation destinations are added
**Then** they reuse the current shell, tokens, icon family, responsive behavior, selection state, tooltips, and keyboard behavior
**And** do not import legacy Telio/Kiranism layout or CSS.

**Given** a user lacks access to a destination
**When** navigation is rendered or the route is opened directly
**Then** the destination is hidden or denied according to one permission policy
**And** client navigation visibility is not treated as authorization.

**Given** the user enters the Onlook editor from a Lead
**When** the editor opens
**Then** it is the existing authoritative Onlook editor route/composition
**And** no dashboard wrapper or second editor shell is introduced.

**Given** adding navigation requires an edit to an original Onlook layout, route, registry, or component
**When** the implementation is planned
**Then** that exact path receives its own Core Change Request and Andrew's explicit confirmation before editing
**And** approval is not inferred from this story or from approval of a different file.

### Story 1.3: Establish versioned business-policy authority

As a product operator,
I want controlled policy versions before provider workflows run,
So that qualification, outreach, activation, and limits are reproducible from the first operation.

**Acceptance Criteria:**

**Given** a valid qualification, outreach, activation, commercial, or retention policy draft
**When** an authorized operator activates it
**Then** an immutable version records actor, effective time, validation, and safe diff
**And** subsequent records identify the policy version used.

**Given** an invalid or dangerous configuration
**When** validation runs
**Then** activation is blocked with specific errors
**And** no arbitrary SQL, code, or unvalidated provider-payload execution path exists.

**Given** no active version exists for a policy required by an operation
**When** the operation is admitted
**Then** it fails closed with an operator-actionable error
**And** does not fall back to hard-coded browser behavior.

### Story 1.4: Establish one durable operation authority

As a product operator,
I want discovery and outreach work to survive process and provider failures,
So that external effects and cost are never owned by a browser request.

**Acceptance Criteria:**

**Given** the pinned target architecture
**When** the durable-operation boundary is approved
**Then** exactly one target-native facility owns enqueue, lease, retry, cancellation, recovery, reconciliation, and terminal state
**And** route-lifetime promises, local storage, and a second ad hoc job system are rejected.

**Given** a durable operation creates an external or money-affecting effect
**When** it is retried after a crash or lease expiry
**Then** one idempotency lineage links admission, reservation, provider request, settlement, and audit events
**And** reconciliation can prove whether the effect occurred.

**Given** work is canceled before provider dispatch
**When** cancellation commits
**Then** execution cannot later call the provider and unused reservations release
**And** work already accepted by a provider cannot be relabeled canceled.

### Story 1.5: Establish the Onlook-native Jagwar module map and protected-core ledger

As the product owner,
I want Jagwar additions to follow Onlook's repository structure and protect its original files,
So that the product remains clean, understandable, upgradeable, and behavior-compatible.

**Acceptance Criteria:**

**Given** a pinned writable Onlook baseline
**When** the target inventory is completed
**Then** every proposed Jagwar capability is assigned to the appropriate runnable `apps/*` surface, focused reusable `packages/*` capability, route-local vertical slice, schema/adapter, manager/service, or existing public seam
**And** the plan follows neighboring package manifests, entry points, imports, tests, and configuration rather than donor Telio structure.

**Given** a donor Telio implementation is awkward in the target
**When** reuse is evaluated
**Then** it may be rewritten cleanly while preserving approved behavior and edge-case tests
**And** no compatibility layer, generic dumping package, cross-package internal import, or parallel framework is created merely to reuse code.

**Given** the pinned baseline file inventory
**When** new work is planned
**Then** each path is classified as new Jagwar-owned file or protected original Onlook file
**And** every protected-file proposal uses `CORE-CHANGE-REQUEST-TEMPLATE.md` and receives Andrew's explicit per-file confirmation before modification.

**Given** a new product-facing string or product-specific target artifact
**When** it is named
**Then** it uses Jagwar, or an Onlook-native capability name when a product prefix would be inappropriate
**And** Telio appears only for an inventoried exact legacy path/identifier/provenance reference governed by `NAMING-AUTHORITY.md`.

**Given** a Jagwar story completes
**When** its verification runs
**Then** the affected existing Onlook capability matrix remains passing and no editor, AI mode/tool/provider, project, publication, auth, billing, route, package export, script, or UI behavior is deprecated
**And** the story records new files, approved original-file changes, baseline tests, and rollback evidence.

## Epic 2: Find and qualify real local-business opportunities

### Story 2.1: Define and verify the normalized Candidate boundary

As a product operator,
I want every discovery provider normalized to one Candidate contract,
So that the product does not leak vendor-specific shapes into the user workflow.

**Acceptance Criteria:**

**Given** a provider result containing supported and missing fields
**When** the adapter returns Candidates
**Then** every Candidate validates against the versioned normalized contract
**And** missing facts remain explicit null/absence rather than fabricated values.

**Given** malformed provider values, off-range coordinates/ratings, or invalid email/URL data
**When** normalization occurs
**Then** the adapter applies documented safe normalization or returns a typed provider-data failure
**And** never persists unvalidated raw data as authoritative facts.

**Given** two provider adapters with different capabilities
**When** callers inspect them
**Then** capability differences are declared in metadata
**And** the Candidate contract remains stable.

### Story 2.2: Run bounded, durable discovery

As a user,
I want my local-business search to run reliably even if it takes time,
So that I can leave, retry, or recover without losing what happened.

**Acceptance Criteria:**

**Given** a valid query, allowed count, authorized Workspace, and unique idempotency key
**When** discovery starts
**Then** the system creates one durable Run and acknowledges it quickly
**And** exposes queued/running/succeeded/failed/canceled lifecycle.

**Given** the same request is submitted again with the same idempotency key
**When** the original is in progress or terminal
**Then** the same Run/outcome is returned or an explicit idempotency conflict is raised
**And** no second provider usage or debit occurs.

**Given** the provider returns no matching businesses
**When** the Run completes
**Then** it is `succeeded` with zero results
**And** remains distinct from timeout, unavailable, malformed-response, or internal failure.

**Given** a queued or safely interruptible Run
**When** an authorized user cancels it
**Then** it reaches canceled only after the durable executor prevents further provider work
**And** unused reservations release; work already performed remains truthful and auditable.

### Story 2.3: Save and replay Discovery Runs

As a user,
I want to reopen past results,
So that refreshing the app does not discard unconfirmed prospects or charge me again.

**Acceptance Criteria:**

**Given** a successful Run
**When** results are committed
**Then** the query, provider, observed time, usage, and complete normalized Candidate Snapshot are saved in the Workspace.

**Given** the user opens a saved Run
**When** its results render
**Then** the stored snapshot is used without a provider call or new usage debit
**And** the surface shows when the evidence was observed.

**Given** a Candidate from that snapshot is already a Lead
**When** the Run reopens
**Then** the Candidate shows the existing Lead link/Added state
**And** cannot silently create a duplicate.

### Story 2.4: Inspect website opportunity with versioned evidence

As a user,
I want to know which businesses most need a site,
So that I focus on the strongest opportunities.

**Acceptance Criteria:**

**Given** an authoritative listing source with website-field coverage explicitly confirms no website is listed
**When** the active policy evaluates it
**Then** the result is `missing-site`
**And** the policy version and evidence are recorded.

**Given** a null website value from a source without confirmed website-field coverage
**When** the active policy evaluates it
**Then** the website state remains unknown/failed rather than `missing-site`
**And** the Candidate is not falsely promoted as a missing-site opportunity.

**Given** a reachable website
**When** inspection completes
**Then** the result is `weak-site` or `has-site` based on explicit versioned rules
**And** the user receives a concise evidence-backed primary reason.

**Given** DNS, TLS, robots, timeout, or parsing prevents reliable inspection
**When** qualification ends
**Then** inspection is failed/unknown rather than automatically `weak-site`
**And** discovery results remain usable with the limitation shown.

### Story 2.5: Enrich phone intelligence independently

As a user,
I want to understand phone contact viability,
So that I do not confuse an unknown or landline number with an eligible WhatsApp recipient.

**Acceptance Criteria:**

**Given** a Candidate has a phone number
**When** phone enrichment succeeds
**Then** the normalized number, line type, provider, and observation time are recorded.

**Given** a Candidate lacks a phone or lookup fails
**When** the Run completes
**Then** the Candidate remains available
**And** phone status is skipped/failed/unknown explicitly.

**Given** line type is unknown
**When** outreach eligibility is evaluated later
**Then** unknown is not assumed eligible.

### Story 2.6: Deliver the Onlook-native Find Leads workspace

As a user,
I want a focused search-and-results workspace,
So that I can quickly select high-opportunity businesses.

**Acceptance Criteria:**

**Given** the surface is idle
**When** it first opens
**Then** it shows one query field, one count control, and one primary action
**And** renders no fake/sample result cards.

**Given** discovery succeeds
**When** results render
**Then** missing-site and weak-site Candidates rank ahead of has-site Candidates with deterministic tie order
**And** cards show useful evidence, accessible selection, already-added state, and lawful discovery-context imagery.

**Given** the result set is running, empty, failed, partially enriched, replayed, or limit-blocked
**When** the state changes
**Then** each has a distinct Onlook-native treatment and actionable next step
**And** map interactions have an accessible list equivalent.

**Given** the user selects eligible results
**When** batch confirmation succeeds
**Then** each result becomes or links to exactly one Lead
**And** the UI shows created/existing outcomes without duplicate cards or layout jumps.

## Epic 3: Organize prospects and decide the next action

### Story 3.1: Add manual Leads without duplicates

As a user,
I want prospects from my own research in the Pipeline,
So that I can manage all opportunities consistently.

**Acceptance Criteria:**

**Given** a manually found business
**When** required identifying information is submitted
**Then** a manual-provenance Lead is created in New
**And** unknown fields remain unknown.

**Given** the same manual business is submitted twice or concurrently
**When** normalized identity and dedupe policy run
**Then** one Lead is created or the existing Lead is returned
**And** no duplicate activity or activation credit occurs.

**Given** a browser supplies a conflicting ownership scope
**When** manual creation runs
**Then** the server ignores or rejects it and derives the target-native scope from authenticated context
**And** cannot create data for another customer.

### Story 3.2: Manage the six-stage Pipeline accessibly

As a user,
I want to move prospects through my sales process,
So that I always know each deal's state.

**Acceptance Criteria:**

**Given** a Lead in any valid stage
**When** the user moves it through drag, keyboard, or menu action
**Then** every interaction reaches the same server mutation
**And** the new stage persists with actor/time activity.

**Given** the mutation conflicts or fails
**When** an optimistic UI was shown
**Then** the exact prior state is restored
**And** an actionable error is displayed.

**Given** a small screen or a user who cannot use drag
**When** the Pipeline is used
**Then** an accessible list/table or menu alternative provides equivalent stage operations.

### Story 3.3: Provide a complete Lead workspace

As a user,
I want all prospect context and next actions together,
So that I do not have to reconcile disconnected records.

**Acceptance Criteria:**

**Given** a Lead
**When** its detail surface opens
**Then** it shows facts/provenance, qualification/evidence age, Project Link, Publication, outreach eligibility/history, and activity
**And** restores focus to the invoking control when closed.

**Given** the Lead has no project, an unpublished project, or an eligible Publication
**When** the primary action renders
**Then** it respectively offers Create project, Open/Publish project, or Send preview
**And** never offers a send that cannot resolve exact publication authority.

**Given** a fact is unknown or enrichment failed
**When** it is displayed
**Then** the UI shows unknown/unavailable honestly
**And** does not substitute generated project copy.

### Story 3.4: Preserve suppression, archive, and activity truth

As a user,
I want to stop contact or archive a prospect safely,
So that the system respects my decision without destroying important history.

**Acceptance Criteria:**

**Given** a Lead is suppressed or opted out for a channel
**When** any future send is quoted or dispatched
**Then** it is blocked before provider contact
**And** the current restriction is visible in Lead details.

**Given** a Lead is archived or soft-deleted
**When** normal Pipeline views load
**Then** it is excluded according to policy
**And** discovery dedupe, send history, usage, and audit evidence remain consistent.

**Given** a restricted state changes
**When** authorized action applies it
**Then** actor, source, scope, effective time, and reason/evidence are recorded.

### Story 3.5: Record and withdraw outreach consent evidence

As an authorized user,
I want consent evidence to be explicit and correctable,
So that outreach eligibility never assumes consent from a public contact detail.

**Acceptance Criteria:**

**Given** a recipient supplied consent through an approved source
**When** an authorized user records it
**Then** channel, recipient identity, basis, source, evidence reference, captured time, actor, and applicable policy version are stored
**And** the evidence is independently auditable from Lead notes.

**Given** evidence is wrong, withdrawn, expired, or superseded
**When** it is corrected or withdrawn
**Then** an append-only history preserves the change and current eligibility updates immediately
**And** queued work must re-read that current state before provider dispatch.

**Given** a public phone number but no qualifying consent evidence for a connector that requires opt-in
**When** a send is quoted or dispatched
**Then** it is blocked as `opt_in_required`
**And** no user toggle can bypass the server-side evidence requirement.

## Epic 4: Turn a Lead into an authoritative Onlook project and published proof

### Story 4.1: Prove the Onlook-native prospect-seeding path

As an implementation team,
I want an executable mapping from verified Lead facts to Onlook's editable project authority,
So that the product creates a real personalized first draft without inventing a second project engine.

**Acceptance Criteria:**

**Given** the pinned writable Onlook commit
**When** the project, source, AI/generation, preview, and authorization modules are traced
**Then** a versioned architecture record identifies the exact native entry points, records, async work, and failure/recovery path
**And** rules out direct dashboard file writes and a parallel canonical Site document.

**Given** a fixture Lead with a business name, selected available contact/service facts, and explicit unknown facts
**When** the target-native seeding proof runs
**Then** the resulting editable preview contains the exact business name and selected facts, omits unknown facts, and records provenance separately from generated copy
**And** a blank project or generic starter fails the proof.

**Given** Jagwar business facts are prepared for Onlook AI
**When** the integration boundary is designed
**Then** a new validated `JagwarBusinessContextV1` module provides read-only verified facts, provenance, unknowns, evidence, and generation guidance through an existing public composition seam
**And** it has no save/apply/publish/auth/billing authority and does not change existing prompts, agents, tools, registries, streams, managers, modes, or apply behavior by default.

**Given** no suitable additive public seam exists
**When** integration cannot proceed using new files alone
**Then** work stops and submits the smallest per-file Core Change Request for Andrew's explicit confirmation
**And** no original AI/editor file is edited on the authority of this story alone.

**Given** the proof cannot produce an authorized editable artifact idempotently
**When** the story is evaluated
**Then** Stories 4.2 and later project-creation work remain blocked
**And** the team records the missing target capability instead of creating a replacement editor authority.

### Story 4.2: Create a prospect project from a Lead

As a user,
I want to create an Onlook project for a prospect,
So that I can begin with the business context instead of a blank sales workflow.

**Acceptance Criteria:**

**Given** an authorized Lead with no current Project Link
**When** project creation is requested with an idempotency key
**Then** the system creates exactly one Onlook project through native project services
**And** records a creating→active or failed Project Link.

**Given** project input is prepared
**When** facts and generation guidance are assembled
**Then** verified facts/evidence are clearly separated from generated marketing-copy instructions
**And** no unknown fact is invented.

**Given** the target-native creation completes
**When** the editable preview is opened in a real browser
**Then** it contains the exact Lead business name and the selected available contact/service facts, while unavailable facts are omitted
**And** generated copy remains distinguishable from verified fact provenance; a blank or generic result is a failed creation.

**Given** the same request is retried
**When** the original creation already started or completed
**Then** the same Project Link/result is reconciled
**And** no duplicate project is created.

### Story 4.3: Associate an existing authorized Onlook project

As a user,
I want to link an existing project to a Lead,
So that work I already created can participate in the commercial workflow.

**Acceptance Criteria:**

**Given** a project the actor can access in the same Workspace
**When** it is selected for the Lead
**Then** the association is created and can be selected as current
**And** no project files or canonical document are copied into Jagwar records.

**Given** a project outside the actor's authority or already conflicting with policy
**When** association is attempted
**Then** it fails closed with an actionable safe error.

**Given** a Lead has multiple historical/alternative projects
**When** one is selected for outreach
**Then** exactly one is current
**And** historical associations remain inspectable.

### Story 4.4: Open the authoritative Onlook editor from the Lead

As a user,
I want to move directly from a prospect to its project editor,
So that lead generation and site creation feel like one product.

**Acceptance Criteria:**

**Given** an active Project Link
**When** the user chooses Open project
**Then** the existing Onlook editor opens for that exact project
**And** normal Onlook access, loading, error, and recovery behavior remains intact.

**Given** the project is missing, archived, failed, or unauthorized
**When** Open project is requested
**Then** the Lead surface shows a repair/relink action
**And** does not fall back to a second editor or copied representation.

### Story 4.5: Resolve and snapshot an outreach-safe Publication

As a user,
I want outreach to use the exact public site I published,
So that prospects never receive a private editor preview or the wrong project.

**Acceptance Criteria:**

**Given** an Onlook project has a ready deployment
**When** publication is resolved
**Then** the system records deployment identity, public URL, version reference when available, status, and publish time
**And** marks the current Publication for that Project Link.

**Given** only a development/private/expired/failed URL exists
**When** sending is quoted
**Then** publication is ineligible
**And** the user is directed to publish or repair it.

**Given** the project is republished after a send
**When** current Publication updates
**Then** future sends may use the new Publication
**And** past sends retain their original publication snapshot.

## Epic 5: Connect WhatsApp and send personalized published proof

### Story 5.1: Define and contract-test the Outreach Connector boundary

As a product operator,
I want channel providers behind one normalized connector contract,
So that WhatsApp can launch without binding the whole product to one SDK.

**Acceptance Criteria:**

**Given** any connector implementation
**When** its contract suite runs
**Then** it declares channel, recipient types, template/opt-in requirements, delivery-receipt capability, idempotency capability, and limits
**And** accepts/returns only normalized versioned DTOs.

**Given** a send request is persisted or logged
**When** it is inspected
**Then** it contains a Connector Account identity, never a plaintext secret or transport-ready credential reference
**And** only a server-only connector factory may resolve the account's credential reference.

**Given** a connector throws or returns malformed output
**When** the boundary handles it
**Then** a safe typed result is returned
**And** raw SDK/provider data does not cross into UI/domain contracts.

### Story 5.2: Complete managed WhatsApp connection and approval

As a user,
I want a guided WhatsApp setup,
So that I know when I am actually able to send.

**Acceptance Criteria:**

**Given** no connection exists
**When** the user begins setup
**Then** the product uses the selected provider's supported onboarding flow
**And** records a connection lifecycle without exposing provider secrets.

**Given** business/sender/template approval is pending or action is required
**When** connection status renders
**Then** the user sees the truthful state and next step
**And** cannot send prematurely.

**Given** the provider is active but later degraded/suspended
**When** health updates
**Then** new sends are blocked or warned according to policy
**And** historical sends remain available.

### Story 5.3: Evaluate recipient, consent, template, and publication compliance

As a user,
I want clear outreach eligibility before I send,
So that I can fix issues without accidentally contacting someone improperly.

**Acceptance Criteria:**

**Given** a Lead, Connector capabilities, recipient, suppression/consent state, approved templates, and Publication
**When** compliance is evaluated
**Then** the result is allowed or one typed actionable block reason
**And** connector-declared requirements drive the checks.

**Given** a send is blocked
**When** the quote or enqueue operation ends
**Then** no provider dispatch occurs
**And** no successful send debit or activation credit occurs.

**Given** a browser claims opt-in, template approval, or publication eligibility
**When** the server evaluates compliance
**Then** those claims are ignored unless verified from authoritative stored state.

### Story 5.4: Send one exact published preview

As a user,
I want to send one prospect their exact published website,
So that my outreach includes real proof.

**Acceptance Criteria:**

**Given** an eligible Lead and Publication
**When** the user confirms a send
**Then** one durable Outreach Send binds the Workspace, Lead, Project Link, Publication, recipient, connector, template version, and idempotency key
**And** transitions through queued/dispatching/accepted and later delivered/failed only from authoritative provider evidence.

**Given** consent, suppression, template, Publication, connector, or entitlement changed after quote/enqueue
**When** the durable worker is immediately about to call the provider
**Then** it re-reads and revalidates every authoritative input
**And** a blocked result makes no provider call and releases unused allowance.

**Given** the same UI action/job is retried
**When** provider idempotency and reconciliation run
**Then** no duplicate provider message or success debit occurs.

**Given** the configured qualifying provider outcome commits for a New Lead
**When** stage automation runs
**Then** New advances to Contacted and usage settles exactly once
**And** later-stage Leads are not overwritten; the durable outcome becomes input to the activation projection rather than directly mutating a second activation truth.

**Given** a queued Send has not begun provider dispatch
**When** an authorized user cancels it
**Then** the executor prevents the provider call and releases unused allowance
**And** a Send already accepted by the provider cannot be relabeled canceled.

### Story 5.5: Fan out a multi-Lead personalized send

As a user,
I want to send several prospects their individual published sites,
So that I can work efficiently without creating a generic blast.

**Acceptance Criteria:**

**Given** multiple selected Leads
**When** the user requests a quote
**Then** each is independently classified as eligible or blocked with its exact Publication, recipient, template, and usage impact
**And** totals reconcile to the selection.

**Given** the user confirms eligible sends
**When** the batch enqueues
**Then** one durable send is created per eligible Lead under one batch identity
**And** no shared project URL or recipient is assumed.

**Given** some sends succeed and others block/fail
**When** results display
**Then** each outcome remains inspectable and retryable according to policy
**And** successful sends are not rolled back merely because another Lead failed.

### Story 5.6: Reconcile provider delivery events and preserve history

As a user,
I want trustworthy send history,
So that I know what was sent and what happened afterward.

**Acceptance Criteria:**

**Given** a signed provider callback
**When** it is verified and normalized
**Then** it applies at most once to the matching Send
**And** only valid lifecycle transitions are accepted.

**Given** duplicate, late, out-of-order, unknown, or invalid callbacks
**When** they arrive
**Then** they are ignored/quarantined safely with operator evidence
**And** cannot duplicate usage or activation.

**Given** a historical send
**When** its Lead, project, Publication, recipient, or template later changes
**Then** the history still shows the exact snapshot/provider reference/timestamps used at send time.

## Epic 6: Complete 5+2+1, measure real costs, and commercialize last

### Story 6.1: Build the authoritative activation projection

As a user,
I want my progress based on real completed work,
So that the 5+2+1 milestone is trustworthy.

**Acceptance Criteria:**

**Given** committed Workspace records
**When** activation is calculated
**Then** unique qualifying Leads, successful Project Links, and qualifying successful Sends are counted
**And** queued/failed/blocked/canceled/duplicate/cross-Workspace records do not count.

**Given** target values
**When** evaluation occurs
**Then** each milestone returns count, target, done, and one cycleComplete verdict
**And** the same comparison rule is used by UI and enforcement.

**Given** projection data is unavailable or suspected stale
**When** the service responds
**Then** it exposes unavailable/stale state
**And** does not return fabricated zero counts.

### Story 6.2: Show live 5+2+1 progress and next action

As a new user,
I want progress and a clear next step throughout the product,
So that I can complete my first commercial cycle.

**Acceptance Criteria:**

**Given** activation state changes after Lead, Project, or Send completion
**When** subscribed/polled surfaces refresh
**Then** Home and relevant navigation/widget surfaces show the same updated projection
**And** status changes are accessible and visually native to Onlook.

**Given** a milestone is incomplete
**When** the user views progress
**Then** the recommended action routes to the correct workflow state
**And** does not suggest creating duplicate work.

### Story 6.3: Measure target operating costs without customer billing

As a product operator,
I want trustworthy end-to-end cost observations from the rebuilt system,
So that pricing is based on evidence rather than old architecture assumptions.

**Acceptance Criteria:**

**Given** discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, or outreach work
**When** it executes in the representative target environment
**Then** internal telemetry records normalized unit, quantity, provider, lifecycle outcome, latency/concurrency context, retry lineage, and actual/estimated cost where available
**And** observations correlate to the authoritative operation without logging secrets or unnecessary personal data.

**Given** a saved replay, retry, block, failure, cancellation, or duplicate callback
**When** cost observations reconcile
**Then** actual work/cost remains truthful and duplicate observations do not inflate the cohort model
**And** zero-provider-work paths are distinguishable from provider work that failed after cost was incurred.

**Given** internal cost telemetry exists
**When** a customer operation is admitted
**Then** the telemetry alone creates no charge, allowance debit, plan, entitlement, or customer-facing gate
**And** existing Onlook billing behavior remains unchanged.

### Story 6.4: Approve the Jagwar commercial model from measured evidence

As the product owner,
I want to decide pricing after the complete workflow's costs are measured,
So that plans are sustainable and match the product's real economics.

**Acceptance Criteria:**

**Given** representative complete 5+2+1 journeys and realistic cohort/concurrency scenarios
**When** the commercial analysis is prepared
**Then** it includes discovery, qualification, AI/generation, sandbox/VM, hosting/deployment, storage/egress, outreach, retry/failure, provider minimum, support, abuse, fixed, and variable cost distributions
**And** it distinguishes average, upper-percentile, and worst-reasonable usage.

**Given** candidate user/project/workspace/usage/hybrid pricing models
**When** they are evaluated
**Then** each records target gross margin, included value, allowance/cap behavior, abuse exposure, customer simplicity, and sensitivity to provider price changes
**And** no legacy Telio price or unmeasured assumption is treated as authority.

**Given** the analysis is complete
**When** commercialization is requested
**Then** Andrew explicitly approves the plans, price points, trial, allowances, caps, overages/top-ups, dunning/grace, and rollout
**And** Stories 6.5 through 6.8 remain blocked until that decision is recorded.

### Story 6.5: Reconcile one Onlook billing authority and derive Jagwar entitlement

As a user,
I want access to match the approved plan through Onlook's existing billing foundation,
So that Jagwar does not create a competing subscription system.

**Acceptance Criteria:**

**Given** the approved commercial model and pinned Onlook billing inventory
**When** Jagwar billing integration is designed
**Then** it extends or reconciles exactly one existing subscription/customer/usage authority and preserves all existing Onlook billing behavior
**And** every required original Stripe/model/schema/export/UI file edit has a separately approved Core Change Request.

**Given** verified billing-provider events
**When** they are applied
**Then** subscription state is normalized into a closed target status and approved plan/cadence
**And** duplicate, delayed, and out-of-order events reconcile idempotently.

**Given** browser claims disagree with stored provider-derived state
**When** entitlement is resolved
**Then** stored authoritative state wins
**And** direct protected operations cannot be granted by query parameters, labels, or cached UI.

### Story 6.6: Complete approved checkout and billing self-service

As a user,
I want to upgrade and manage billing through verified provider flows,
So that the approved commercial model is actionable and secure.

**Acceptance Criteria:**

**Given** the commercial model and billing integration are approved
**When** an eligible user chooses upgrade or manage billing
**Then** the server creates checkout or billing-portal sessions from the one target-native authority
**And** the browser cannot override price, plan, customer, ownership scope, return authorization, or entitlement.

**Given** the provider redirects back or emits a webhook
**When** Billing refreshes
**Then** access derives from verified normalized provider state rather than query-string success claims
**And** duplicate, delayed, and out-of-order events remain safe.

**Given** a top-up/overage is not in the approved policy
**When** an allowance is exhausted
**Then** the UI offers only approved upgrade/wait/reduce actions
**And** never renders an invented commercial path.

### Story 6.7: Enforce approved usage and present it truthfully

As a user,
I want usage to reflect real successful work and the approved plan,
So that I can understand limits and trust the product.

**Acceptance Criteria:**

**Given** discovery, qualification, project, or outreach work under an approved plan
**When** usage is measured and settled
**Then** each applicable unit uses one idempotency identity and the approved lifecycle point
**And** saved replay records no new provider unit while retry/callback cannot double-debit.

**Given** work blocks, fails, or cancels before the approved billable point
**When** settlement runs
**Then** reservation releases/reverses correctly and activation does not falsely advance
**And** actual internal provider cost remains observable separately from the customer usage outcome.

**Given** Billing/Usage loads
**When** current plan, allocations, ledger, and pending changes are available
**Then** it distinguishes discovery, generation/AI, sandbox/hosting where customer-visible, and outreach units according to approved policy
**And** denials produce only approved upgrade/top-up/wait/reduce actions.

### Story 6.8: Allocate approved allowances and enforce the fair 5+2+1 gate

As a new customer,
I want the promised first value cycle available before a volume gate,
So that I can prove the workflow before paying for more capacity.

**Acceptance Criteria:**

**Given** a verified trial or recurring allocation source
**When** allocation runs or replays
**Then** its stable source identity can create each allowance exactly once in the one target-native commercial authority
**And** duplicate webhooks/jobs cannot mint additional capacity.

**Given** a legitimate new account under the approved trial-abuse policy
**When** it starts the product loop
**Then** its effective allowances make at least five activation-eligible Leads, two successful prospect Projects, and one qualifying compliant Send reachable
**And** the continued-volume gate cannot block before those available units are consumed or the cycle is completed.

**Given** a limit, administrative suspension, verified abuse signal, or exhausted fair-cycle allowance
**When** admission is evaluated
**Then** the authoritative reason and next action are returned without erasing earned progress
**And** enforcement is consistent across direct operations, jobs, and UI.

### Story 6.9: Show a native commercial overview

As a user,
I want one concise view of progress and next actions,
So that I know how to move toward my first client.

**Acceptance Criteria:**

**Given** authoritative activation, Lead, Project, Send, entitlement, and usage data
**When** the overview loads
**Then** it shows 5+2+1 progress, one recommended next action, recent opportunities/projects/sends, and a compact allowance summary
**And** every item links to an actionable surface.

**Given** one projection is unavailable
**When** the overview renders
**Then** it shows an explicit unavailable/retry state for that data
**And** never silently converts the failure into zero progress.

**Given** a milestone completes
**When** the view updates
**Then** the change is conveyed by text/icon/state as well as color
**And** motion respects reduced-motion preferences.

## Epic 7: Operate, migrate, and release the rebuilt workflow safely

### Story 7.1: Manage provider health and connections safely

As an operator,
I want provider connection and job health in one restricted surface,
So that I can resolve outages without redeploying when the architecture permits it.

**Acceptance Criteria:**

**Given** an authorized operator
**When** the health surface loads
**Then** it shows discovery, inspection, phone, outreach, billing, and durable-job health with safe typed failures and timestamps
**And** does not expose secrets or unnecessary customer content.

**Given** a credential supports runtime rotation
**When** it is connected/rotated/tested/disabled
**Then** plaintext is accepted only at the server vault boundary and is never readable afterward
**And** audit history records the operation without the secret.

**Given** a credential is deployment-bound
**When** operator configuration renders
**Then** it is not falsely offered as runtime-rotatable
**And** the correct operational procedure is shown.

### Story 7.2: Review and safely operate versioned business policies

As an operator,
I want safe review and rollback operations for established policies,
So that qualification, outreach, activation, and limits remain reproducible in production.

**Acceptance Criteria:**

**Given** a valid policy draft
**When** it is activated
**Then** a versioned release records actor, effective time, validation, and safe diff
**And** subsequent operations record the version used.

**Given** an invalid or dangerous configuration
**When** validation runs
**Then** activation is blocked with specific errors
**And** no arbitrary SQL/code/provider payload execution path exists.

**Given** an active policy must be superseded or rolled back
**When** an authorized operator performs the change
**Then** a new effective version is created without mutating historical versions
**And** operations already performed remain traceable to their original policy.

### Story 7.3: Import donor business data through an explicit migration contract

As the product owner,
I want recoverable migration of useful Jagwar data,
So that adopting Onlook does not lose leads, history, usage, or customer ownership.

**Acceptance Criteria:**

**Given** donor data categories
**When** migration mapping is approved
**Then** Leads, qualification, pipeline, project links where resolvable, sends, consent/suppression, subscriptions, usage, and audit data each have keep/transform/archive/exclude treatment
**And** old editor/project documents are not imported as target authority.

**Given** a migration run
**When** it executes
**Then** it is dry-run capable, idempotent, scoped, counted, checksummed where appropriate, and produces reconciliation evidence
**And** failure does not destroy or partially overwrite donor data.

**Given** target project/publication identity cannot be proven
**When** a donor record is mapped
**Then** it remains unlinked/pending review rather than guessed.

### Story 7.4: Certify the end-to-end commercial journey

As the product owner,
I want objective release evidence,
So that the rebuilt workflow is not declared done after isolated screens work.

**Acceptance Criteria:**

**Given** a clean test Workspace and real-browser environment
**When** the 5+2+1 journey runs
**Then** five Leads are discovered/confirmed, two Onlook projects are created/associated, one is published, and one exact publication is sent compliantly
**And** both created projects render prospect-specific editable drafts containing their exact fixture business names and selected available facts; blank/generic drafts fail certification.

**Given** the compliant Send in that journey
**When** eligibility is established and dispatch occurs
**Then** the journey records qualifying consent evidence through the product workflow, snapshots the exact Publication, and revalidates current evidence immediately before the provider call
**And** Pipeline, activation, all reservations/usage settlements, and history reconcile.

**Given** retry, duplicate-submit, refresh, provider timeout, partial batch, callback replay, unauthorized ID, and subscription-denial scenarios
**When** the acceptance suite runs
**Then** there are no duplicate Leads, projects, sends, charges, activation counts, or cross-Workspace effects.

**Given** UI review
**When** each new surface is compared with current Onlook in supported viewports
**Then** tokens, typography, icons, density, focus, state treatment, motion, and responsiveness are native
**And** no legacy Telio/Kiranism shell residue remains.

**Given** the pinned Onlook baseline capability matrix
**When** release certification runs
**Then** existing editor, AI modes/tools/providers, project/source operations, previews, publishing/domains, auth, billing, routes, package exports, scripts, and UI behavior remain available and passing
**And** no Jagwar success is accepted by deprecating or weakening an Onlook capability.

**Given** the target diff from the pinned baseline
**When** change governance is audited
**Then** every original-file edit maps to Andrew's explicit per-file Core Change Request approval and every other addition follows the approved module map
**And** unapproved baseline-file changes block release.

### Story 7.5: Certify performance, privacy, retention, and correlation

As a product owner,
I want measurable non-functional release evidence,
So that a functionally correct workflow is also operable and safe.

**Acceptance Criteria:**

**Given** the pinned target architecture and provider benchmarks
**When** implementation planning begins
**Then** numeric budgets are approved for interactive shell response, bounded request acknowledgment, durable-job progress visibility, and provider timeout/retry behavior
**And** release evidence reports measured percentile results against those budgets rather than the word “fast.”

**Given** new Jagwar packages and route-local features
**When** maintainability review runs
**Then** package manifests, public entry points, dependency direction, schema validation, feature colocation, tests, and tooling match neighboring Onlook practices
**And** no donor compatibility layer, generic dumping folder, or cross-package internal import remains.

**Given** one discovery operation and one outreach operation
**When** each runs from browser admission through terminal outcome
**Then** a safe correlation chain links actor/request, durable job, provider call, domain result, reservation/usage settlement, and audit event
**And** logs contain no secret or unnecessary recipient/provider payload.

**Given** approved retention and deletion policy
**When** scheduled enforcement and an authorized deletion/archive request run
**Then** eligible snapshots, personal data, logs, and credentials are expired/redacted/deleted while suppression and legally required audit evidence retain only the approved minimum
**And** automated evidence proves both deletion and required historical integrity.

### Story 7.6: Keep hosting and domain optimization deferred and observable

As the product owner,
I want the existing Onlook publication path preserved during this migration,
So that infrastructure optimization does not block the commercial workflow.

**Acceptance Criteria:**

**Given** the existing Onlook publishing/custom-domain path works
**When** Jagwar project and outreach integration is implemented
**Then** it consumes that path through Publication resolution
**And** does not rewrite Freestyle/CodeSandbox/hosting in these epics.

**Given** hosting limitations or cost telemetry is observed
**When** evidence is collected
**Then** it is recorded for a later infrastructure epic
**And** no silent architectural cutover occurs.
