---
title: PRD — Jagwar Business Workflows on the Onlook Foundation
status: final
created: 2026-07-28
updated: 2026-07-28
inputDocuments:
  - 00-course-correction.md
  - 01-product-brief.md
  - /Users/andrewsimic/Developer/Telio/_bmad-output/planning-artifacts/prds/prd-Telio-2026-06-25/prd.md
  - /Users/andrewsimic/Developer/Telio/_bmad-output/session-changelog-find-leads-2026-06.md
---

# PRD — Jagwar Business Workflows on the Onlook Foundation

## 0. Document purpose

This PRD defines the portable Jagwar business workflows to build into an Onlook-based product. It specifies capabilities and business invariants rather than the legacy Telio implementation. Target architecture decisions belong to the receiving project's architecture work; provider examples are evidence and are not mandates unless explicitly accepted there.

**Naming authority:** Jagwar is the current product name. Telio is the former/donor name and is permitted only for exact historical paths, artifacts, identifiers, and migration provenance. All new product-facing and target implementation work uses Jagwar according to `NAMING-AUTHORITY.md`.

## 1. Vision

Jagwar turns an AI website builder into a commercial operating system for people selling websites. Users discover local businesses, identify the best opportunities, create personalized Onlook projects, publish proof, contact the prospect, and track the deal from one connected product.

Onlook remains authoritative for editing, AI code changes, projects, previews, publishing, custom domains, and the overall visual system. Jagwar owns the lead, qualification, pipeline, outreach, activation, usage, and commercial workflow surrounding those projects.

## 2. Target users and journeys

### 2.1 Primary user

An aspiring freelancer or solo agency operator who needs a repeatable way to find and close website clients. They may not be a developer and should not need to understand infrastructure, scraping vendors, DNS internals, or message-provider terminology.

### 2.2 Secondary operator

The product operator who manages provider connections, qualification policy, outreach templates, usage limits, activation targets, and operational failures.

### 2.3 Non-users for the first migration

- The local business receiving the pitch; it is a prospect, not the account holder.
- A large sales team requiring shared sequences, roles, territory assignment, or campaign analytics.
- A cold-email operator requiring mailbox acquisition, warmup, rotation, or deliverability infrastructure.

### 2.4 User journeys

#### UJ-1: Marcus completes his first prospecting cycle

Marcus signs up, searches for five plumbers near his city, sees which businesses have no or weak websites, adds five to his pipeline, creates Onlook projects for two, publishes one, and sends that exact preview to the corresponding prospect. His activation progress becomes 5/5, 2/2, 1/1. If discovery fails, he sees an explicit retryable failure rather than an empty list.

#### UJ-2: Marcus resumes an earlier search without paying twice

Marcus refreshes the app or returns the next day, opens a saved search run, and sees the original candidate snapshot without another provider request or charge. Candidates already added to his pipeline are visibly linked and cannot be duplicated.

#### UJ-3: Marcus qualifies and organizes a prospect

Marcus opens a lead, sees verified contact facts, website qualification, phone-intelligence status, source provenance, related Onlook project, publication, and outreach history. He can move the lead through New, Contacted, Interested, Negotiating, Converted, or Lost.

#### UJ-4: Marcus sends personalized previews to several leads

Marcus selects multiple eligible leads. The system verifies each lead has its own published project, an allowed recipient, any required opt-in, and an approved message template. It creates one durable send per lead. Some may send while others are blocked or fail; results remain independent and retry-safe.

#### UJ-5: The operator resolves a provider or policy issue

The operator reviews provider health and failures, rotates or reconnects an allowed credential, adjusts non-financial policy values, or activates an approved outreach template. Changes affect subsequent operations with an audit trail and do not expose plaintext secrets.

## 3. Glossary

- **Jagwar** — the current product and the only product name for new target work.
- **Telio** — the former product/donor name, retained only for exact legacy provenance and migration references.
- **Account** — the target platform identity that owns or participates in one or more Workspaces.
- **Workspace** — an abstract business ownership scope for Leads, search history, projects, outreach, usage, and configuration. Before implementation it must be mapped explicitly to Onlook's current user/project-membership/team authority; the term must not be used to invent a parallel membership system.
- **Lead** — a local business saved into the commercial pipeline.
- **Candidate** — a business returned by a Discovery Run but not necessarily added as a Lead.
- **Discovery Search** — the user's normalized query and requested result count.
- **Discovery Run** — one execution of a Discovery Search, including provider usage, lifecycle, errors, and a saved Candidate Snapshot.
- **Candidate Snapshot** — the immutable or append-only saved results associated with a Discovery Run, reopenable without another provider request.
- **Qualification** — Jagwar's evidence-backed assessment of a Candidate's website opportunity and contact viability.
- **Website Status** — exactly one of `missing-site`, `weak-site`, or `has-site`.
- **Pipeline Stage** — exactly one of `New`, `Contacted`, `Interested`, `Negotiating`, `Converted`, or `Lost`.
- **Project Link** — association between a Lead and the authoritative Onlook project being prepared for that Lead.
- **Publication** — the authoritative Onlook deployment/version and public URL selected for outreach.
- **Outreach Connector** — a channel adapter that declares its capabilities and compliance preconditions and sends normalized requests.
- **Outreach Send** — one durable attempt to deliver one Lead's Publication to that Lead through one Connector.
- **Activation Projection** — authoritative per-Workspace counts of qualifying Leads, created prospect Projects, and successfully completed Sends.
- **Usage Ledger** — append-only, idempotent record of cost-driving operations and their units.
- **Operator** — privileged product administrator; not a normal customer role.

## 4. Functional requirements

### 4.1 Workspace and authority

#### FR-WA-1: Resolve one target-native ownership and isolation authority

Before persistence work, the target architecture shall decide whether Jagwar records are owned by an Onlook user, an Onlook project-membership scope, or a native team/workspace scope. The system shall then associate every Jagwar business record with that single authenticated authority. It shall not introduce a browser-chosen scope identifier or a second conflicting membership model.

**Acceptance consequences:**

- The server derives the active workspace from authenticated context.
- A request cannot gain access by changing a workspace, account, lead, or project ID in the payload or URL.
- Cross-workspace reads and mutations fail closed.

#### FR-WA-2: Maintain one authoritative project per project identity

Jagwar business records may reference Onlook projects but shall not create a second canonical site document, source tree, or editor controller.

#### FR-WA-3: Record authoritative server-side operations

Creation, qualification, pipeline movement, sending, charging, entitlement, and activation shall be admitted by server-side application operations. React components shall request operations and render results; they shall not become business authority.

#### FR-WA-4: Follow Onlook's repository and composition structure

Jagwar implementation shall follow the pinned target's Bun-workspace modular-monorepo conventions: runnable surfaces in the appropriate `apps/*` application, reusable capabilities in focused `packages/*`, shared configuration in `tooling/*`, public package entry points, provider/adapter and manager/service patterns where used, schema-first boundaries, and route-local feature colocation.

Donor Jagwar behavior may be rewritten when that produces a cleaner Onlook-native module. Donor folder structure, import conventions, framework layers, and compatibility shims are not preservation requirements.

#### FR-WA-5: Preserve existing Onlook capabilities through extension-first changes

Jagwar shall enhance the pinned Onlook baseline without deprecating, disabling, replacing, renaming, moving, or semantically weakening its existing editor, AI, project, source, preview, publishing, authentication, billing, UI, provider, tool, mode, package, route, script, or development capability.

New Jagwar-owned files are preferred. Before every change to a file present in the pinned Onlook baseline, the implementation session shall submit a per-file Core Change Request and receive Andrew's explicit confirmation for the exact path, purpose, and proposed diff. An export, import, registration, configuration, dependency, generated-file, or lockfile change counts as an original-file change.

#### FR-WA-6: Feed business facts into AI through an additive context boundary

Authorized Lead facts, qualification evidence, explicit unknowns, provenance, brand/business details, rights-cleared asset references, voice/design direction, and generation guidance shall be assembled by a new validated Jagwar-owned context module and supplied as read-only input through an existing Onlook composition/extension seam. The context shall not gain project mutation, save, publish, authorization, or billing authority.

Existing Onlook prompts, agents, tools, registries, streams, managers, apply behavior, and modes remain unchanged by default. If no safe seam exists, implementation stops for a per-file Core Change Request rather than quietly patching AI core behavior.

#### FR-WA-7: Apply Jagwar naming authority to all new target work

All new product-facing text and product-specific target repositories, worktrees, branches, packages, modules, contracts, schemas, services, routes, tests, fixtures, events, configuration, billing products, and release artifacts shall use **Jagwar**, unless an Onlook-native capability name is more appropriate than any product prefix. No new target artifact shall use **Telio** as the current product or namespace.

Exact legacy Telio paths and identifiers remain unchanged where required for provenance or compatibility. Runtime or persisted identifier renames require an explicit mapping, compatibility, rollback, and data-migration plan; branding does not authorize destructive legacy renames.

### 4.2 Lead discovery

#### FR-LD-1: Search with one query and requested count

A user can enter one natural local-business query such as “plumbers in St. Charles, IL,” select an allowed count, and start discovery.

**Acceptance consequences:**

- The surface contains one primary query field, one count control, and one primary action.
- Empty or whitespace-only queries are rejected before provider usage.
- Requested counts are bounded by entitlement and abuse policy.
- A submitted search receives a durable run identity.

#### FR-LD-2: Represent run lifecycle truthfully

A Discovery Run shall expose `queued`, `running`, `succeeded`, `failed`, or `canceled` lifecycle states with timestamps, provider identity, usage units, and a typed failure category.

**Acceptance consequences:**

- A successful zero-result run is distinct from a failed run.
- A provider timeout/unavailable result is retryable without pretending no businesses exist.
- Retries use an idempotency key and cannot create duplicate charges or duplicate candidate snapshots.
- Cancellation is allowed only when the durable executor can prevent further provider work; it releases unused reservations and preserves work/cost already incurred.

#### FR-LD-3: Save and replay candidate snapshots

Every successful Discovery Run shall save the returned Candidate Snapshot so it can be reopened without a provider call.

**Acceptance consequences:**

- Refreshing or reopening a past search returns the saved candidates.
- Replaying a saved run does not consume new discovery allowance.
- Each candidate indicates whether it is already linked to a Lead.

#### FR-LD-4: Normalize candidate facts

Provider responses shall be normalized into one versioned Candidate contract before use by ranking, UI, persistence, generation, or outreach.

Required facts, when available:

- business name;
- address;
- phone;
- email;
- current website URL;
- review count and rating;
- business category;
- structured opening hours where sourced;
- service/category tags where sourced;
- coordinates;
- external source identity/place identity;
- discovery provider and timestamp;
- non-authoritative photo references for discovery context.

Unknown facts shall be explicit null or absent according to the versioned contract and shall never be fabricated.

#### FR-LD-5: Deduplicate candidates and leads

The system shall use stable provider identity when available and a documented deterministic fallback when it is not. Adding the same Candidate repeatedly shall return or link the existing Lead rather than silently duplicating it.

#### FR-LD-6: Display discovery context responsibly

The result surface may display remote map/place imagery for candidate context only. It shall not copy, cache, publish, or use that imagery in generated projects without a separate verified rights basis.

### 4.3 Qualification

#### FR-QL-1: Produce Jagwar-owned website status

Qualification shall classify web presence into exactly:

- `missing-site`: an authoritative listing/source with website-field coverage confirms no website is listed;
- `weak-site`: a website exists but fails at least one active baseline rule;
- `has-site`: a website exists and passes the active baseline rules.

Provider-supplied labels may be evidence but shall not be final authority. A null URL from a provider that does not cover websites is unknown, not `missing-site`.

#### FR-QL-2: Preserve evidence and policy identity

Every qualification shall record the evidence observed, inspection time, policy/rule-set version, outcome, and failure status. A failed inspection shall be unknown/failed, not automatically weak.

#### FR-QL-3: Rank opportunities predictably

The default discovery and pipeline ordering shall prioritize `missing-site`, then `weak-site`, then `has-site`, with deterministic tie-breaking. Ranking shall explain the primary reason without presenting unsupported claims.

#### FR-QL-4: Add phone intelligence independently

Where a phone exists, the system may resolve normalized line type and provider status. Lookup failure shall not fail the whole Discovery Run, and unknown shall not be treated as mobile/WhatsApp eligible.

### 4.4 Lead pipeline

#### FR-CRM-1: Add selected candidates to the pipeline

Users can add one or many Candidates to the Workspace pipeline. Each selected Candidate becomes or links to exactly one Lead.

#### FR-CRM-2: Add a lead manually

Users can create a Lead not returned by discovery, with required business name and enough contact/location context to identify it. Manual records shall be marked with manual provenance.

#### FR-CRM-3: Maintain the six-stage pipeline

Each Lead has exactly one Pipeline Stage: `New`, `Contacted`, `Interested`, `Negotiating`, `Converted`, or `Lost`.

**Acceptance consequences:**

- Manual moves are permitted according to policy and persist immediately after server confirmation.
- Keyboard-accessible movement is available wherever drag-and-drop exists.
- A failed stage mutation restores the prior UI state and explains the failure.

#### FR-CRM-4: Present a complete lead workspace

Lead details shall show facts, qualification, source provenance, project association, publication, outreach eligibility, send history, and activity history without requiring the user to correlate separate records manually.

#### FR-CRM-5: Advance New after successful outreach

The first qualifying successful Outreach Send shall move a `New` Lead to `Contacted`. Leads already beyond `New` shall not be moved backward or overwritten by the automation.

#### FR-CRM-6: Protect suppression and deletion semantics

Blocking, suppressing, archiving, or deleting a Lead shall have explicit consequences for future discovery, outreach, activity history, and linked projects. Material history shall not be silently erased.

**Acceptance consequences:**

- Suppression blocks matching future outreach but remains active through dedupe and re-discovery.
- Archive removes the Lead from normal active views without removing dedupe identity, Project Links, Publications, Sends, usage, consent/suppression, or audit history.
- Product deletion is a policy-governed request: directly identifying data is removed or redacted when allowed, while the minimum suppression, financial, security, and legal audit evidence is retained for approved periods.
- Linked Onlook project deletion/archive is never implied by deleting or archiving a Lead; it requires its own target-native authorized operation.

### 4.5 Lead-to-Onlook project workflow

#### FR-PRJ-1: Create or associate a prospect project

From a Lead, the user can create a new Onlook project or associate an existing authorized project.

**Acceptance consequences:**

- Repeated requests with the same idempotency key return the same association.
- The user cannot link a project outside their authorized workspace.
- The Lead records project identity, association state, and timestamps, not a copied project document.

#### FR-PRJ-2: Produce a personalized, editable first draft from verified context

Project creation shall use verified Lead facts and qualification evidence to produce a prospect-specific, editable Onlook first draft. At minimum the rendered/source result shall contain the correct business name and every selected available factual contact/service field, shall omit unavailable facts, and shall keep generated marketing copy distinguishable from verified facts/provenance. A blank or generic unseeded project does not satisfy this requirement.

#### FR-PRJ-3: Open the authoritative editor

The Lead workflow shall navigate into Onlook's existing editor for the associated project. Jagwar shall not wrap it in a second editor authority.

#### FR-PRJ-4: Resolve an outreach-safe publication

Before outreach, the system shall resolve the exact Onlook Publication intended for the Lead: public URL, deployment/version identity, published timestamp, and current availability.

**Acceptance consequences:**

- Editor preview or private development URLs are not assumed to be production-safe.
- A missing, failed, stale, private, or unauthorized publication blocks sending with a repair action.
- Republishing updates the current association without rewriting past send history.

### 4.6 Outreach

#### FR-OR-1: Use capability-declaring connectors

Every channel implementation shall conform to a versioned Outreach Connector contract and declare at least:

- channel and connector identity;
- supported recipient forms;
- whether approved templates are required;
- whether opt-in is required;
- whether delivery receipts are available;
- whether idempotent provider keys are supported;
- supported message/content limits.

#### FR-OR-2: Send one personalized publication to one lead

An Outreach Send shall bind exactly one Workspace, Lead, Project Link, Publication, recipient, connector, message/template version, and idempotency key.

#### FR-OR-3: Fan out multi-select sends independently

Selecting multiple Leads shall create one independently validated and tracked send per Lead. It shall not create one shared blast or assume all selected Leads use the same project, recipient, or eligibility state.

#### FR-OR-4: Enforce compliance before dispatch

Before contacting a provider, the system shall evaluate the selected connector's declared requirements against recorded consent/opt-in, suppression, approved-template availability, recipient validity, and publication eligibility.

**Acceptance consequences:**

- A blocked send creates no provider request and no success charge.
- The user receives a typed, actionable block reason.
- Compliance cannot be bypassed by browser payload fields.

#### FR-OR-5: Maintain durable send lifecycle

Each send shall progress through a closed lifecycle such as `queued`, `dispatching`, `accepted`, `delivered`, `failed`, `blocked`, or `canceled`. `accepted` means the provider accepted the request; it does not claim recipient delivery. Provider callbacks and retries shall be idempotent and ordered.

#### FR-OR-6: Preserve send history

Past sends shall retain the publication URL/version, template/message version, recipient snapshot, connector, provider reference, timestamps, failure reason, and metering outcome used at the time. A later republish shall not rewrite historical send evidence.

#### FR-OR-7: Support managed WhatsApp onboarding

The product shall provide a guided WhatsApp connection/setup flow suitable for the selected provider, show connection and template status truthfully, and prevent sends until required setup is complete.

#### FR-OR-8: Respect suppression and withdrawal

Opt-out, withdrawal, block, invalid-recipient, and policy-suppression states shall stop future sends for the affected scope and remain auditable.

#### FR-OR-9: Record and manage consent evidence

Authorized users can record channel-specific consent/opt-in evidence using an allowed policy basis, see its status and source, and record withdrawal or correction. Evidence shall include scope, source/basis, effective time, recorder, and an evidence reference where required. The product shall not treat a public phone number or browser checkbox alone as proof unless the active legal/policy release explicitly permits that basis.

### 4.7 Activation

#### FR-ACT-1: Calculate 5+2+1 from authoritative records

The system shall calculate activation from committed, Workspace-scoped records:

- at least 5 activation-eligible Leads added;
- at least 2 prospect Projects successfully created/associated;
- at least 1 Outreach Send successfully sent according to policy.

An activation-eligible Lead is a unique committed Lead in the ownership scope that is not a duplicate, archived, or deleted; website qualification is not required to count the “find five” milestone. Queued, failed, blocked, canceled, duplicated, deleted, or cross-scope records shall not falsely increase activation.

#### FR-ACT-2: Show progress consistently

All activation surfaces shall render the same count, target, and completion verdict from one server-authoritative projection. Targets may be operationally configurable but shall not drift across UI and enforcement.

#### FR-ACT-3: Gate continued usage after value is reachable

The free experience shall permit a fair path to the configured activation cycle. Subscription or top-up gates apply to continued or higher-volume use according to entitlement policy.

### 4.8 Billing, usage, and abuse controls

#### FR-BIL-1: Resolve entitlement from stored provider state

Paid entitlement, when Jagwar commercialization is approved, shall be derived from normalized, server-stored billing-provider state through **one** target billing authority. The target must preserve and later extend or reconcile Onlook's existing user-scoped subscription/usage system and shall not introduce a parallel Jagwar subscription truth. Client claims, query parameters, cached UI state, and plan labels shall not grant access.

#### FR-BIL-2: Maintain an idempotent usage ledger

Every cost-driving operation shall have an idempotency key, action type, quantity, unit, Workspace, related domain identity, status, timestamps, and provider-cost evidence when available.

#### FR-BIL-3: Keep discovery usage distinct from AI credits

Discovery shall be metered by provider-relevant units such as requested/returned candidates and enrichment calls. It shall not be reduced to a generic AI-credit charge or a search-button counter.

#### FR-BIL-4: Meter outreach and generation at authoritative completion points

Charges or reservations shall occur at explicit lifecycle boundaries, reverse or release correctly on failed/blocked work, and never double-charge retries or callbacks.

#### FR-BIL-5: Apply configurable commercial limits safely

The system shall enforce per-plan and per-period limits, rate limits, velocity controls, trial anti-abuse rules, and administrative suspensions. Limit checks and debits that protect money or COGS shall be atomic.

#### FR-BIL-6: Allocate recurring allowances idempotently

Trial and recurring allocations shall be tied to a billing period or provider event and shall not duplicate when jobs or webhooks are retried.

#### FR-BIL-7: Decide Jagwar pricing only after measured target costs

During the workflow rebuild, the system shall collect non-enforcing internal cost telemetry for discovery, qualification, project/AI generation, sandbox/VM usage, hosting/deployment, storage/egress, and outreach. Final Jagwar plans, prices, included allowances, top-ups/overages, trial gates, checkout products, and customer-facing enforcement shall remain uncommitted until a representative end-to-end target environment supplies cost distributions and Andrew approves the commercial model.

Existing Onlook billing behavior remains available throughout. Cost measurement may not silently become a customer charge or product gate.

### 4.9 Operator controls

#### FR-OPS-1: View provider and job health

Operators can inspect discovery, qualification, outreach, and billing integration health without exposing raw secrets or customer message content unnecessarily.

#### FR-OPS-2: Manage allowed provider connections

Operators can connect, rotate, disable, or test provider credentials where the target architecture supports runtime management. Environment/deployment-bound secrets shall not be falsely presented as runtime-rotatable.

#### FR-OPS-3: Manage policies with audit history

Operators can manage qualification rules, approved outreach templates, activation targets, plan limits, and non-secret routing policy. Every material change records actor, previous value or version, new value or version, and timestamp.

#### FR-OPS-4: Avoid arbitrary runtime authority

The operator UI shall not provide arbitrary code execution, raw SQL, unrestricted prompt execution, or unvalidated provider payload editing.

## 5. Information architecture

Required logical surfaces:

- Home / activation overview;
- Find Leads;
- saved Discovery Runs;
- Pipeline;
- Lead detail/activity;
- Projects/Sites enriched with Lead status;
- Outreach/WhatsApp connection and history;
- Usage and billing;
- operator-only integrations, policies, and job health.

Exact route paths and navigation placement are target-architecture decisions. They should be composed into Onlook's existing application shell rather than reproducing the legacy Telio route tree.

## 6. Non-functional requirements

### NFR-1: Security and isolation

- Server-authenticated Workspace authority for every data and mutation boundary.
- Encryption for provider secrets at rest and in transit.
- No plaintext credentials in browser state, logs, jobs, analytics, or persisted send requests.
- Least-privilege operator access and audit history.

### NFR-2: Reliability and idempotency

- Discovery, project creation, outreach, billing webhooks, usage debits, activation projection, and callbacks must tolerate retries.
- Typed terminal outcomes; no infinite spinners.
- Partial multi-send results remain independently inspectable and retryable.

### NFR-3: Performance

- Initial dashboard shell should become interactive without waiting for external discovery/outreach providers.
- Discovery acknowledges quickly and reports durable progress.
- Saved runs and pipeline reads should not call discovery providers.
- Large pipelines must support pagination, virtualization, or bounded rendering before performance degrades.

### NFR-4: Accessibility

- WCAG 2.2 AA target.
- Keyboard operation for navigation, selection, pipeline movement, dialogs, sheets, menus, and retry actions.
- Status changes announced through appropriate live regions without excessive chatter.
- Focus restoration after modal/sheet close and after async mutations.
- Color is not the only signal for website status, pipeline stage, eligibility, or failure.

### NFR-5: Privacy and compliance

- Data minimization and documented retention for discovered contact information.
- Suppression/withdrawal enforcement and auditability.
- No automatic reuse of restricted third-party photos in generated/published projects.
- Legal review before enabling cold outreach in each jurisdiction/channel.

### NFR-6: Observability

- Correlation IDs across user operation, durable job, provider call, usage entry, and domain result.
- Metrics by provider and typed outcome, without secrets or excessive personal data.
- Operator-visible retry/backoff and dead-letter state where applicable.

### NFR-7: UI coherence

- Use Onlook's design tokens, typography, icon set, primitives, motion, responsive behavior, and state patterns.
- Avoid importing legacy Telio layout markup or CSS.
- Jagwar workflows must appear native to the Onlook product.

### NFR-8: Onlook maintainability and upgrade compatibility

- New code follows neighboring Onlook package manifests, public exports, TypeScript/lint/test conventions, dependency direction, and route feature colocation.
- Existing Onlook baseline tests and behaviors remain passing; Jagwar-only tests cannot substitute for regression proof.
- Each original-file change has an approved Core Change Request, minimal diff, focused tests, upstream-sync impact, and rollback evidence.
- No duplicate package, generic dumping folder, cross-repository relative import, parallel framework, or donor compatibility layer is introduced merely to avoid a clean rewrite.

## 7. MVP scope

### In scope

- Target-native auth/workspace integration.
- Interactive lead discovery, normalization, qualification, ranking, saved runs, and candidate selection.
- Manual leads and six-stage pipeline.
- Lead details with project/publication/outreach activity.
- Lead → Onlook project creation/association and editor navigation.
- Exact publication resolution.
- WhatsApp connection, compliance gate, single send, multi-select fan-out, delivery status, and history.
- Activation, non-enforcing cost/usage telemetry, preservation of existing Onlook billing behavior, and essential operator controls.

### Deferred

- Replacing CodeSandbox or Freestyle.
- Migrating custom domains.
- Cold email, shared campaigns, sequences, open/click/reply analytics.
- iMessage production connector.
- Advanced agency/team workflows beyond target-native workspace support.
- Automated prospect replies or AI sales agents.
- Final Jagwar pricing, checkout products, plans, allowances, top-ups/overages, trial gates, and customer-facing Jagwar entitlement enforcement until representative target costs and the commercial model are approved.

## 8. Success and release criteria

The first release is acceptable when:

1. A new user can complete the entire 5+2+1 journey in a real browser.
2. Reopening a saved search incurs no provider call and creates no duplicates.
3. A Lead opens a genuinely personalized editable Onlook project—never a blank/generic result—and sends its exact published URL.
4. Compliance blocks happen before provider dispatch and before successful charge.
5. Retried jobs, callbacks, webhooks, and UI actions do not duplicate leads, projects, sends, usage, or activation.
6. Cross-workspace access tests fail closed.
7. Every new surface passes an Onlook visual-consistency review and WCAG interaction review.
8. New code follows the approved Onlook-native module map; all existing Onlook capabilities still pass their baseline regression surface.
9. Every original Onlook file edit has an approved per-file Core Change Request, and AI business facts enter through an additive validated context boundary.

## 9. Deferred open decisions

These do not block product documentation but must be resolved before their stories enter implementation:

- Which discovery provider and commercial plan will be used at launch?
- Which WhatsApp/BSP onboarding model is legally and operationally acceptable?
- What evidence and thresholds define `weak-site` for the first policy version?
- What opt-in basis is required by target market and message category?
- What constitutes a qualifying Send for activation: provider acceptance or confirmed delivery?
- What are retention and deletion periods for candidate snapshots and contact data?
- What are final plan allowances, top-up prices, dunning/grace behavior, and trial verification requirements?

## 10. Assumptions

- Onlook's existing identity/ownership, editor, project, AI, and publishing foundations remain available; the exact user/project-membership/team mapping is resolved against the pinned target commit.
- The receiving implementation can add Jagwar business modules without forking a second application shell.
- The legacy Telio repository remains accessible as evidence during migration.
- Hosting optimization occurs after the business workflow migration unless existing hosting becomes an immediate blocker.
