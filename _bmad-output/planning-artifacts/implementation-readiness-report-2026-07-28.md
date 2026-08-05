---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
assessmentStatus: NOT_READY
filesIncluded:
  prd:
    - _bmad-output/planning-artifacts/jagwar-foundation-handoff/02-prd.md
  architecture:
    - _bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md
  epics:
    - _bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md
  ux:
    - _bmad-output/planning-artifacts/jagwar-foundation-handoff/04-ux-and-information-architecture.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-28
**Project:** Jagwar

## Document Discovery

### Authoritative Files Selected

- PRD: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/02-prd.md` (33,677 bytes; modified 2026-07-28 09:48:28)
- Architecture: `_bmad-output/planning-artifacts/architecture/architecture-Jagwar-2026-07-28-readiness/ARCHITECTURE-SPINE.md` (28,976 bytes; modified 2026-07-28 13:20:00)
- Epics and Stories: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md` (59,558 bytes; modified 2026-07-28 09:48:39)
- UX and Information Architecture: `_bmad-output/planning-artifacts/jagwar-foundation-handoff/04-ux-and-information-architecture.md` (13,607 bytes; modified 2026-07-28 09:46:51)

No qualifying whole-versus-sharded duplicates were found. All four required document types are present.

## PRD Analysis

### Functional Requirements

#### Workspace and authority

- **FR-WA-1 — Resolve one target-native ownership and isolation authority.** Before persistence work, the target architecture shall decide whether Jagwar records are owned by an Onlook user, an Onlook project-membership scope, or a native team/workspace scope. The system shall then associate every Jagwar business record with that single authenticated authority. It shall not introduce a browser-chosen scope identifier or a second conflicting membership model. The server derives the active workspace from authenticated context; changing a workspace, account, lead, or project ID cannot grant access; cross-workspace reads and mutations fail closed.
- **FR-WA-2 — Maintain one authoritative project per project identity.** Jagwar business records may reference Onlook projects but shall not create a second canonical site document, source tree, or editor controller.
- **FR-WA-3 — Record authoritative server-side operations.** Creation, qualification, pipeline movement, sending, charging, entitlement, and activation shall be admitted by server-side application operations. React components shall request operations and render results; they shall not become business authority.
- **FR-WA-4 — Follow Onlook's repository and composition structure.** Jagwar implementation shall follow the pinned target's Bun-workspace modular-monorepo conventions: runnable surfaces in the appropriate `apps/*` application, reusable capabilities in focused `packages/*`, shared configuration in `tooling/*`, public package entry points, provider/adapter and manager/service patterns where used, schema-first boundaries, and route-local feature colocation. Donor behavior may be rewritten for a cleaner Onlook-native module; donor folder structure, import conventions, framework layers, and compatibility shims are not preservation requirements.
- **FR-WA-5 — Preserve existing Onlook capabilities through extension-first changes.** Jagwar shall enhance the pinned Onlook baseline without deprecating, disabling, replacing, renaming, moving, or semantically weakening any existing editor, AI, project, source, preview, publishing, authentication, billing, UI, provider, tool, mode, package, route, script, or development capability. New Jagwar-owned files are preferred. Every edit to a file present in the pinned baseline—including exports, imports, registrations, configuration, dependencies, generated files, or lockfiles—requires a per-file Core Change Request and Andrew's explicit confirmation.
- **FR-WA-6 — Feed business facts into AI through an additive context boundary.** Authorized Lead facts, qualification evidence, explicit unknowns, provenance, brand/business details, rights-cleared asset references, voice/design direction, and generation guidance shall be assembled by a new validated Jagwar-owned context module and supplied as read-only input through an existing Onlook composition/extension seam. It has no project mutation, save, publish, authorization, or billing authority. Existing prompts, agents, tools, registries, streams, managers, apply behavior, and modes remain unchanged by default; if no safe seam exists, implementation stops for a per-file Core Change Request.
- **FR-WA-7 — Apply Jagwar naming authority to all new target work.** New product-facing text and product-specific repositories, worktrees, branches, packages, modules, contracts, schemas, services, routes, tests, fixtures, events, configuration, billing products, and release artifacts use Jagwar unless an Onlook-native capability name is more appropriate. Telio is allowed only in exact legacy provenance or compatibility. Runtime or persisted identifier renames require explicit mapping, compatibility, rollback, and data-migration plans.

#### Lead discovery

- **FR-LD-1 — Search with one query and requested count.** A user can enter one natural local-business query, select an allowed count, and start discovery. There is one primary query field, count control, and primary action; blank queries are rejected before provider usage; count is bounded by entitlement and abuse policy; every submission gets a durable run identity.
- **FR-LD-2 — Represent run lifecycle truthfully.** A Discovery Run exposes `queued`, `running`, `succeeded`, `failed`, or `canceled` with timestamps, provider identity, usage units, and typed failure category. Successful zero results differ from failure; provider timeout/unavailable is retryable; retries use idempotency and cannot duplicate charges or snapshots; cancellation is allowed only when the durable executor can stop further provider work, releases unused reservations, and preserves incurred work/cost.
- **FR-LD-3 — Save and replay candidate snapshots.** Every successful Discovery Run saves its Candidate Snapshot for reopening without a provider call. Refresh/reopen returns saved candidates, replay consumes no new allowance, and candidates show existing Lead linkage.
- **FR-LD-4 — Normalize candidate facts.** Provider responses are normalized into one versioned Candidate contract before ranking, UI, persistence, generation, or outreach. When available it contains business name, address, phone, email, website URL, reviews/rating, category, sourced hours and service/category tags, coordinates, source/place identity, discovery provider/timestamp, and non-authoritative photo references. Unknown facts are explicit null/absent and never fabricated.
- **FR-LD-5 — Deduplicate candidates and leads.** Use stable provider identity when available and a documented deterministic fallback otherwise. Re-adding a Candidate returns or links the existing Lead rather than silently duplicating it.
- **FR-LD-6 — Display discovery context responsibly.** Remote map/place imagery may be displayed for discovery context only; it may not be copied, cached, published, or used in generated projects without separately verified rights.

#### Qualification

- **FR-QL-1 — Produce Jagwar-owned website status.** Classification is exactly `missing-site`, `weak-site`, or `has-site`. Missing-site requires an authoritative source with website-field coverage confirming none is listed; weak-site requires an existing website failing an active baseline rule; has-site requires passing active rules. Provider labels are evidence, not final authority, and a null URL from a source without website coverage is unknown.
- **FR-QL-2 — Preserve evidence and policy identity.** Every qualification records observed evidence, inspection time, policy/rule-set version, outcome, and failure status. Failed inspection is unknown/failed, not automatically weak.
- **FR-QL-3 — Rank opportunities predictably.** Default ordering is missing-site, weak-site, then has-site, with deterministic tie-breaking and an explainable primary reason without unsupported claims.
- **FR-QL-4 — Add phone intelligence independently.** When a phone exists, line type and provider status may be resolved. Lookup failure does not fail Discovery, and unknown is not mobile/WhatsApp eligible.

#### Lead pipeline

- **FR-CRM-1 — Add selected candidates to the pipeline.** Users can add one or many Candidates; each becomes or links to exactly one Lead in the ownership scope.
- **FR-CRM-2 — Add a lead manually.** Users can create a manually provenanced Lead with business name and enough contact/location context to identify it.
- **FR-CRM-3 — Maintain the six-stage pipeline.** Every Lead has exactly one of `New`, `Contacted`, `Interested`, `Negotiating`, `Converted`, or `Lost`. Policy-permitted manual moves persist after server confirmation; keyboard movement accompanies drag-and-drop; failed mutation restores prior UI state and explains failure.
- **FR-CRM-4 — Present a complete lead workspace.** Lead details show facts, qualification, provenance, project association, publication, outreach eligibility, send history, and activity history without manual correlation.
- **FR-CRM-5 — Advance New after successful outreach.** The first qualifying successful Send moves a New Lead to Contacted, but never moves a later-stage Lead backward or overwrites it.
- **FR-CRM-6 — Protect suppression and deletion semantics.** Block, suppress, archive, and delete have explicit consequences for discovery, outreach, activity, and linked projects; material history is not silently erased. Suppression survives dedupe/re-discovery and blocks matching outreach. Archive hides active view but retains dedupe identity, Project Links, Publications, Sends, usage, consent/suppression, and audit history. Product deletion removes/redacts identifying data when allowed while retaining minimum approved legal, financial, security, and suppression evidence. Lead deletion/archive never implies project deletion/archive.

#### Lead-to-Onlook project workflow

- **FR-PRJ-1 — Create or associate a prospect project.** From a Lead, users create a new Onlook project or associate an existing authorized project. Repeated idempotent requests return the same association; unauthorized projects cannot be linked; the Lead records project identity, association state, and timestamps—not a copied project document.
- **FR-PRJ-2 — Produce a personalized, editable first draft from verified context.** Project creation uses verified Lead facts and qualification evidence. The rendered/source result contains the exact business name and every selected available factual contact/service field, omits unavailable facts, and distinguishes generated copy from verified facts/provenance. A blank or generic unseeded project fails the requirement.
- **FR-PRJ-3 — Open the authoritative editor.** Lead workflow navigates to the existing Onlook editor and never creates a second editor authority.
- **FR-PRJ-4 — Resolve an outreach-safe publication.** Before outreach, resolve the exact Onlook Publication: public URL, deployment/version identity, published time, and current availability. Preview/private development URLs are not presumed safe; missing, failed, stale, private, or unauthorized publication blocks send with repair guidance; republishing updates the current association without rewriting send history.

#### Outreach

- **FR-OR-1 — Use capability-declaring connectors.** Each channel implements a versioned connector contract declaring channel/connector identity, recipient forms, template and opt-in requirements, receipt support, provider idempotency support, and message/content limits.
- **FR-OR-2 — Send one personalized publication to one lead.** One Send binds exactly one ownership scope, Lead, Project Link, Publication, recipient, connector, message/template version, and idempotency key.
- **FR-OR-3 — Fan out multi-select sends independently.** Multi-select creates one independently validated/tracked Send per Lead; it is not a shared blast and does not assume common project, recipient, or eligibility.
- **FR-OR-4 — Enforce compliance before dispatch.** Before any provider contact, evaluate connector requirements against recorded consent/opt-in, suppression, approved-template availability, recipient validity, and publication eligibility. Blocked sends create neither provider request nor success charge, return typed actionable reasons, and cannot be bypassed by browser payload.
- **FR-OR-5 — Maintain durable send lifecycle.** Each Send progresses through a closed lifecycle such as `queued`, `dispatching`, `accepted`, `delivered`, `failed`, `blocked`, or `canceled`; accepted means provider acceptance, not recipient delivery. Callbacks and retries are idempotent and ordered.
- **FR-OR-6 — Preserve send history.** Historical sends retain the publication URL/version, template/message version, recipient snapshot, connector, provider reference, timestamps, failure reason, and metering outcome used at the time. Republishing cannot rewrite the evidence.
- **FR-OR-7 — Support managed WhatsApp onboarding.** Provide a guided provider-appropriate connection/setup flow, truthfully show connection/template status, and block sending until setup is complete.
- **FR-OR-8 — Respect suppression and withdrawal.** Opt-out, withdrawal, block, invalid-recipient, and policy-suppression states stop future sends for the affected scope and remain auditable.
- **FR-OR-9 — Record and manage consent evidence.** Authorized users can record channel-specific consent using an allowed policy basis, view status/source, and record withdrawal/correction. Evidence includes scope, source/basis, effective time, recorder, and required reference. A public phone number or browser checkbox alone is not proof unless the active release policy explicitly allows it.

#### Activation

- **FR-ACT-1 — Calculate 5+2+1 from authoritative records.** Activation is calculated from committed, ownership-scoped records: five unique eligible Leads, two successfully created/associated prospect Projects, and one policy-successful Send. Leads need not be website-qualified for the five count, but duplicates, archived/deleted records and queued, failed, blocked, canceled, or cross-scope work do not count.
- **FR-ACT-2 — Show progress consistently.** All surfaces use one server-authoritative projection for count, target, and verdict; configurable targets cannot drift across UI/enforcement.
- **FR-ACT-3 — Gate continued usage after value is reachable.** Free use permits a fair configured activation cycle; later subscription/top-up gates apply to continued or higher-volume use under entitlement policy.

#### Billing, usage, and abuse controls

- **FR-BIL-1 — Resolve entitlement from stored provider state.** After commercialization approval, entitlement is derived from normalized server-stored provider state through the single target billing authority. Existing Onlook user-scoped subscription/usage is preserved and later extended or reconciled; no parallel Jagwar subscription truth. Client claims, URL parameters, cached UI, and plan labels cannot grant access.
- **FR-BIL-2 — Maintain an idempotent usage ledger.** Every cost-driving operation has an idempotency key, action type, quantity, unit, ownership scope, related domain identity, status, timestamps, and available provider-cost evidence.
- **FR-BIL-3 — Keep discovery usage distinct from AI credits.** Discovery is measured in provider-relevant units such as requested/returned candidates and enrichments, not generic AI credits or button presses.
- **FR-BIL-4 — Meter outreach and generation at authoritative completion points.** Charges/reservations occur at explicit lifecycle boundaries, reverse or release correctly for failed/blocked work, and never double-charge retries/callbacks.
- **FR-BIL-5 — Apply configurable commercial limits safely.** Enforce plan/period limits, rate/velocity controls, trial anti-abuse, and administrative suspensions. Money/COGS checks and debits are atomic.
- **FR-BIL-6 — Allocate recurring allowances idempotently.** Trial and recurring allocations bind to a billing period/provider event and do not duplicate on retry.
- **FR-BIL-7 — Decide Jagwar pricing only after measured target costs.** During rebuild, collect non-enforcing internal telemetry for discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, and outreach. Plans, prices, allowances, overages/top-ups, trial gates, checkout products, and customer enforcement remain uncommitted until representative end-to-end cost distributions exist and Andrew approves. Existing Onlook billing remains; measurement cannot silently charge or gate.

#### Operator controls

- **FR-OPS-1 — View provider and job health.** Operators can inspect discovery, qualification, outreach, and billing integration health without unnecessarily exposing secrets or message content.
- **FR-OPS-2 — Manage allowed provider connections.** Operators can connect, rotate, disable, or test credentials where target architecture supports runtime management; environment/deployment secrets are not falsely presented as runtime-rotatable.
- **FR-OPS-3 — Manage policies with audit history.** Operators can manage qualification rules, approved templates, activation targets, plan limits, and non-secret routing policy, with actor, previous/new version or value, and timestamp for every material change.
- **FR-OPS-4 — Avoid arbitrary runtime authority.** Operator UI provides no arbitrary code execution, raw SQL, unrestricted prompt execution, or unvalidated provider-payload editing.

**Total functional requirements: 50.**

### Non-Functional Requirements

- **NFR-1 — Security and isolation.** Server-authenticated ownership authority at every data/mutation boundary; encryption for provider secrets at rest and in transit; no plaintext credentials in browser state, logs, jobs, analytics, or persisted send requests; least-privilege operator access with audit history.
- **NFR-2 — Reliability and idempotency.** Discovery, project creation, outreach, billing webhooks, usage debits, activation projection, and callbacks tolerate retry; terminal outcomes are typed with no infinite spinners; partial multi-send results remain independently inspectable and retryable.
- **NFR-3 — Performance.** Dashboard becomes interactive without external providers; discovery acknowledges quickly and reports durable progress; saved runs and pipeline reads do not call discovery providers; large pipelines use pagination, virtualization, or bounded rendering before degradation.
- **NFR-4 — Accessibility.** WCAG 2.2 AA; keyboard operation for navigation, selection, pipeline movement, dialogs, sheets, menus, and retries; appropriately restrained live-region announcements; focus restoration after closures/mutations; color never acts as the sole state signal.
- **NFR-5 — Privacy and compliance.** Data minimization and documented retention for discovered contacts; suppression/withdrawal enforcement and auditability; no automatic restricted-photo reuse in generated/published projects; legal review before cold outreach per jurisdiction/channel.
- **NFR-6 — Observability.** Correlation IDs span user operation, durable job, provider call, usage entry, and domain result; metrics by provider/typed outcome omit secrets and excessive personal data; operators can see retry/backoff/dead-letter state where applicable.
- **NFR-7 — UI coherence.** Use Onlook tokens, typography, icons, primitives, motion, responsive behavior, and state patterns; import no legacy layout/CSS; Jagwar workflows appear native.
- **NFR-8 — Onlook maintainability and upgrade compatibility.** Follow neighboring package manifests, public exports, TypeScript/lint/test conventions, dependency direction, and route colocation. Baseline tests/behaviors remain passing; Jagwar tests are not substitute regression proof. Every original-file change has approved CCR, minimal diff, focused tests, upstream-sync impact, and rollback evidence. No duplicate package, dumping folder, cross-repository import, parallel framework, or donor compatibility layer.

**Total non-functional requirements: 8.**

### Additional Requirements

- Required logical surfaces are Home/activation, Find Leads, saved Discovery Runs, Pipeline, Lead details/activity, Projects/Sites enriched with Lead status, Outreach/WhatsApp connection/history, Usage/billing, and operator-only integrations/policies/job health. Exact routes are architecture decisions and must compose into Onlook's shell.
- MVP includes target-native identity integration; discovery through saved candidate selection; manual leads/six-stage pipeline; lead/project/publication/outreach activity; lead-to-Onlook creation/association/editor navigation; safe publication resolution; compliant WhatsApp single/multi-send; activation; non-enforcing cost telemetry; preserved billing; essential operator controls.
- Deferred: replacing CodeSandbox/Freestyle; custom-domain migration; cold email/campaign analytics; iMessage production connector; advanced agency/team workflows; automated prospect replies/AI sellers; all final Jagwar commercial configuration until measured costs and approval.
- Release requires the real-browser 5+2+1 journey; no-cost replay/no duplicates; exact personalized editable project and exact published URL; pre-dispatch/pre-charge compliance; retry-safe jobs/callbacks/webhooks/UI; fail-closed isolation; native visual/WCAG review; approved module map plus baseline regression; approved per-file CCRs and additive AI context.
- Phase decisions still required before affected stories: discovery provider/plan, WhatsApp onboarding/legal model, first weak-site policy, opt-in basis, acceptance-versus-delivery activation semantics, retention/deletion periods, and later commercial terms.
- Assumptions: the pinned Onlook identity/project/editor/AI/publishing foundations remain; Jagwar can add modules without a second shell; donor remains evidence only; hosting optimization follows workflow migration unless immediately blocking.

### PRD Completeness Assessment

The PRD is unusually strong on authority boundaries, lifecycle truth, idempotency, compliance, baseline preservation, and observable acceptance outcomes. Its 50 FRs and eight NFRs establish a usable traceability baseline. It deliberately leaves provider, policy, operator-authority, retention, send-success semantics, and commercialization choices unresolved; those are not drafting defects, but they are entry gates for the affected implementation stories. The readiness assessment must therefore distinguish complete product intent from implementation-approved decisions and exact protected-core integration paths.

## Epic Coverage Validation

### Coverage Matrix

| FR | PRD Requirement | Epic / primary story coverage | Status |
| --- | --- | --- | --- |
| FR-WA-1 | Target-native ownership/isolation authority | Epic 1 / 1.1 | Covered |
| FR-WA-2 | One authoritative project identity | Epics 1, 4 / 1.2, 4.1–4.4 | Covered |
| FR-WA-3 | Server-authoritative operations | Epic 1 / 1.1, 1.2 | Covered |
| FR-WA-4 | Onlook repository/composition structure | Epics 1, 4 / 1.5, 4.1 | Covered |
| FR-WA-5 | Preserve baseline; approve core changes | Epics 1, 4 / 1.2, 1.5, 4.1 | Covered |
| FR-WA-6 | Additive validated AI context | Epics 1, 4 / 4.1, 4.2 | Covered |
| FR-WA-7 | Jagwar naming authority | Epic 1 / 1.5 | Covered |
| FR-LD-1 | One-query/count discovery | Epic 2 / 2.2, 2.6 | Covered |
| FR-LD-2 | Truthful durable run lifecycle | Epics 1, 2 / 1.4, 2.2, 2.6 | Covered |
| FR-LD-3 | Saved replayable snapshots | Epic 2 / 2.3, 2.6 | Covered |
| FR-LD-4 | Versioned Candidate contract | Epic 2 / 2.1, 2.6 | Covered |
| FR-LD-5 | Candidate/Lead dedupe | Epic 2 / 2.1, 2.3, 2.6 | Covered |
| FR-LD-6 | Lawful discovery-context imagery | Epic 2 / 2.6 | Covered |
| FR-QL-1 | Owned three-state website status | Epic 2 / 2.4 | Covered |
| FR-QL-2 | Evidence and policy identity | Epic 2 / 2.4 | Covered |
| FR-QL-3 | Deterministic explainable ranking | Epic 2 / 2.4, 2.6 | Covered |
| FR-QL-4 | Independent phone intelligence | Epic 2 / 2.5 | Covered |
| FR-CRM-1 | Add Candidates idempotently | Epics 2, 3 / 2.6 | Covered |
| FR-CRM-2 | Manual Leads | Epic 3 / 3.1 | Covered |
| FR-CRM-3 | Six-stage Pipeline | Epic 3 / 3.2 | Covered |
| FR-CRM-4 | Complete Lead workspace | Epic 3 / 3.3 | Covered |
| FR-CRM-5 | New to Contacted after success | Epics 3, 5 / 5.4 | Covered |
| FR-CRM-6 | Suppression/archive/delete semantics | Epics 3, 7 / 3.4, 7.3 | Covered |
| FR-PRJ-1 | Create/associate authorized project | Epic 4 / 4.1–4.3 | Covered |
| FR-PRJ-2 | Personalized editable verified draft | Epic 4 / 4.1, 4.2 | Covered |
| FR-PRJ-3 | Authoritative editor | Epic 4 / 4.4 | Covered |
| FR-PRJ-4 | Outreach-safe Publication | Epics 4, 7 / 4.5, 7.6 | Covered |
| FR-OR-1 | Capability-declaring connectors | Epic 5 / 5.1 | Covered |
| FR-OR-2 | One Lead/Publication per Send | Epic 5 / 5.4 | Covered |
| FR-OR-3 | Independent fan-out | Epic 5 / 5.5 | Covered |
| FR-OR-4 | Pre-dispatch compliance | Epics 3, 5 / 3.5, 5.3, 5.5 | Covered |
| FR-OR-5 | Durable Send lifecycle | Epics 1, 5 / 1.4, 5.4–5.6 | Covered |
| FR-OR-6 | Historical Send evidence | Epic 5 / 5.6 | Covered |
| FR-OR-7 | Managed WhatsApp setup | Epic 5 / 5.2 | Covered |
| FR-OR-8 | Suppression/withdrawal | Epics 3, 5 / 3.4, 3.5, 5.3 | Covered |
| FR-OR-9 | Consent evidence lifecycle | Epics 3, 5 / 3.5, 5.3 | Covered |
| FR-ACT-1 | Authoritative 5+2+1 | Epics 5, 6 / 5.4, 6.1 | Covered |
| FR-ACT-2 | Consistent activation projection | Epic 6 / 6.1, 6.2, 6.9 | Covered |
| FR-ACT-3 | Fair value-before-volume gate | Epic 6 / 6.2, 6.8 | Covered |
| FR-BIL-1 | One stored billing authority | Epic 6 / 6.5, 6.6 | Covered |
| FR-BIL-2 | Idempotent usage ledger | Epics 1, 5, 6 / 1.4, 5.6, 6.3, 6.7 | Covered |
| FR-BIL-3 | Discovery-specific units | Epic 6 / 6.3, 6.7 | Covered |
| FR-BIL-4 | Authoritative metering points | Epics 5, 6 / 5.4, 6.3, 6.7 | Covered |
| FR-BIL-5 | Safe limits and abuse controls | Epic 6 / 6.6–6.8 | Covered |
| FR-BIL-6 | Idempotent allocations | Epic 6 / 6.8 | Covered |
| FR-BIL-7 | Measured-cost commercial approval | Epic 6 / 6.3, 6.4, 6.8 | Covered |
| FR-OPS-1 | Provider/job health | Epic 7 / 7.1 | Covered |
| FR-OPS-2 | Safe provider connection management | Epics 5, 7 / 5.2, 7.1 | Covered |
| FR-OPS-3 | Versioned audited policies | Epics 1, 7 / 1.3, 7.2 | Covered |
| FR-OPS-4 | No arbitrary runtime authority | Epics 1, 7 / 1.3, 7.2 | Covered |

### Missing Requirements

No PRD functional requirement is absent from the epic-level coverage map or story coverage map. No epic FR identifier lacks a corresponding PRD FR. NFR and UX identifiers in the backlog are deliberate additional traceability dimensions, not orphaned functional requirements.

This result establishes **claimed specification coverage**, not implementation readiness: story dependencies, unresolved decisions, exact integration paths, and verifiable acceptance criteria are assessed in later steps.

### Coverage Statistics

- Total PRD FRs: **50**
- FRs covered in epics: **50**
- Missing PRD FRs: **0**
- Coverage: **100%**

## UX Alignment Assessment

### UX Document Status

**Found and complete for planning purposes.** The selected UX authority is `_bmad-output/planning-artifacts/jagwar-foundation-handoff/04-ux-and-information-architecture.md`. It defines visual authority, navigation, Home, discovery, Pipeline, Lead detail, project handoff, outreach, billing/usage, operator surfaces, accessibility/focus, responsive behavior, and a real-browser UI gate.

### UX ↔ PRD Alignment

- The UX follows the PRD's complete journey: Find → qualify/select → Pipeline → Lead detail → native Onlook project/editor → exact Publication → compliant Send → activation/usage.
- Discovery distinguishes initial, validation, queued/running, zero-result success, provider failure, partial enrichment, saved replay, and limit states, matching FR-LD-1–3 and NFR-2–3.
- Candidate presentation and accessible map/list equivalence match normalized evidence, ranking, imagery-rights, and accessibility requirements.
- Pipeline and Lead details cover the six stages, equivalent keyboard/non-drag movement, rollback, provenance, project/publication state, consent/suppression, and activity.
- Outreach exposes the exact Lead, recipient, Publication, template, consent/suppression, and usage impact and treats fan-out as independent Sends, matching FR-OR-1–9.
- Billing explicitly preserves existing Onlook behavior and rejects invented Jagwar commercial offers during measurement, matching FR-BIL-1 and FR-BIL-7.
- UI acceptance retains Onlook visual language and expressly excludes the retired donor shell/CSS, matching NFR-7–8 and naming authority.

No standalone UX requirement conflicts with the PRD. The backlog's UX-DR-1–10 collectively trace the UX authority into stories.

### UX ↔ Architecture Alignment

- AD-13 provides the required route-local Server Component default, `@onlook/ui`, `next-intl`, keyboard/focus/reduced-motion contract, responsive preservation, and server-authoritative client boundary.
- AD-2/3 and AD-12 support fail-closed ownership and truthful projections behind all client surfaces.
- AD-6/7 support durable progress, cancel/retry semantics, independent outcomes, and explicit terminal states rather than UI-owned work.
- AD-8 supports explicit verified/unknown facts and provenance; AD-9 supplies the additive project-context boundary; AD-10/10A support exact Publication and consent revalidation shown by outreach UX.
- AD-11 supports non-enforcing cost telemetry while the existing Onlook billing authority remains unchanged.
- The structural seed locates Find Leads, Pipeline, and Outreach as route-local vertical slices and keeps operator/provider orchestration on authenticated server boundaries.

### Alignment Issues and Warnings

1. **Navigation integration is designed but not approved.** The architecture identifies protected route constants, top-bar, message catalogs, manifests, and router registrations. Until Andrew approves each per-file CCR, the UX has no approved entry in the native shell. A route-group name alone does not confer auth or subscription protection; implementation must prove reuse of the existing server boundary.
2. **Numeric responsiveness budgets are absent.** PRD/UX require quick acknowledgment and interactive shell behavior, while the architecture deliberately leaves consumer batch, concurrency, visibility, lease, timeout, and measured percentile targets to Story 1.4/7.5 preflight. UX readiness is conditional on those values.
3. **Operator UX remains gated by OD-13, not OD-15.** OD-13 must define actual roles and composition seams for an Andrew-approved target-native Jagwar operator route that reuses existing authorities. `adminProcedure` is not adequate authorization evidence.
4. **Project-ready UX is gated by executable proof.** AD-9 maps the PROMPT seam, but Story 4.1 must prove a deterministic fixture creates an authorized editable personalized draft before project creation/handoff UI can claim success.
5. **Durable progress UX is gated by substrate preflight.** PGMQ/Cron/pg_net/Vault versions, queue isolation, worker role, signed request behavior, deployment duration, and observability are not yet proven against the pinned environment.
6. **Map and discovery imagery remain conditional.** The UX permits a list-first experience and treats a map as optional. Provider selection and imagery rights must be resolved before any map/thumbnail implementation that introduces cost or data-use obligations.
7. **Commercial UI remains intentionally partial.** Existing Onlook billing may be shown, and internal cost observations may be operator-visible, but Jagwar plans, checkout, top-ups, allowances, and gates cannot be designed as committed customer UX before representative cost evidence and OD-14 approval.

The UX specification is aligned, but these are implementation gates rather than reasons to redesign the experience.

## Epic Quality Review

### Epic Structure Assessment

| Epic | User-value assessment | Independence assessment |
| --- | --- | --- |
| 1 — Secure commercial workspace | The title describes user safety, but Stories 1.1, 1.3, 1.4, and 1.5 are architecture/governance enablers; only 1.2 exposes direct user value. | It is a prerequisite bundle rather than a standalone usable outcome. Its legitimate gates should be represented as pre-implementation decisions/spikes and inserted immediately before the slices they enable. |
| 2 — Find and qualify opportunities | Clear user outcome and independently valuable saved discovery. | Not independent as written: Story 2.6 creates Leads and therefore depends on Epic 3's Lead creation/persistence behavior. |
| 3 — Organize prospects | Clear user outcome through manual Leads, Pipeline, and restrictions. | Core CRM can stand on Epics 1–2, but Story 3.3 promises project/publication/outreach context supplied only by Epics 4–5. |
| 4 — Lead to Onlook project/publication | Clear differentiated user outcome. | Story 4.1 is a technical proof/gate. The user-value stories are valid only after that proof and protected project-path approval. |
| 5 — Compliant personalized outreach | Clear user outcome and correct per-Lead fan-out. | Depends legitimately on CRM, consent, project/publication, connector/provider policy, durable operation, and the pre-commercial telemetry foundation. |
| 6 — Activation, costs, commercialization | Combines two different outcomes: user activation and later commercial approval/enforcement. | Numbering is unsafe: 6.3 telemetry must precede cost-bearing work in Epics 2/4/5. Story 6.4 requires representative complete journeys, while 7.4 currently claims certification of all FRs, including post-6.4 commercial work. |
| 7 — Operate, migrate, release | Provides operator/release value, but also combines administration, migration, certification, NFR proof, and infrastructure deferral. | Operator stories are blocked by OD-13/15. Migration waits for stable target contracts. Release criteria currently mix workflow release and post-commercialization scope. |

### Story-by-Story Dependency and Quality Check

| Story | Assessment |
| --- | --- |
| 1.1 | Enabler, not independently visible value. OD-2 is architecturally resolved to authenticated `user.id`, but schema/authorization proof and protected DB exports remain gated. The conditional team-role AC should be replaced by the actual first-release user ownership plus `user_projects` rule. |
| 1.2 | User-visible and testable; blocked on separately approved navigation, routes, message, manifest, and router CCRs. |
| 1.3 | Technical/operator enabler. Runtime policy mutation is blocked by OD-13/15; deterministic non-production fixture releases are the only currently authorized first-slice substitute. |
| 1.4 | Necessary technical gate; preflight values and target-facility proof are missing, so it cannot yet be completed. |
| 1.5 | Governance gate, not a normal story. The module map exists, but approvals and baseline proof remain missing. |
| 2.1 | Well-bounded contract enabler with strong validation ACs; can use deterministic adapters before a launch provider is chosen. |
| 2.2 | Strong vertical operation story, but depends on 1.1, 1.4, 2.1, an active fixture policy, and cost-observation plumbing from 6.3. |
| 2.3 | Independently testable after 2.2; acceptance appropriately covers no provider call/debit and existing Lead linkage. |
| 2.4 | Good evidence semantics; blocked for production by OD-5 weak-site policy and requires 1.3 policy authority. |
| 2.5 | Well-sized, but launch provider/capability is unresolved; deterministic fake can prove independence. |
| 2.6 | **Forward dependency:** its batch confirmation creates/links Leads, whose first persistence story is 3.1. Split the Find UI/result workflow from Add-to-Pipeline, or execute a generalized Lead upsert story before 2.6. |
| 3.1 | Good first Lead persistence slice; should precede the Add-to-Pipeline half of 2.6 and own only the Lead tables it needs. |
| 3.2 | Good user story after 3.1; BDD covers keyboard equivalence and exact rollback. |
| 3.3 | **Forward dependency:** a “complete” workspace requires Project Link, Publication, eligibility, and Send history from Epics 4–5. Split core Lead facts/activity from progressively added project/outreach panels. |
| 3.4 | Good after 3.1; future-send enforcement remains a later integration assertion, not completion evidence for this story alone. |
| 3.5 | Valuable and well specified, but release-policy/legal basis and connector requirement semantics must be fixed before production use. |
| 4.1 | Technical executable spike/gate, not a user story. It is correctly fail-closed and must precede 4.2; no code-trace-only completion. |
| 4.2 | Meaningful but oversized: canonical transaction delegation, context rendering, durable lifecycle, idempotency, native generation, and browser content proof should be planned as one vertical outcome with explicit sub-tasks/checkpoints, not treated as a small coding unit. |
| 4.3 | Clear and testable after Lead ownership and project membership checks exist. |
| 4.4 | Clear and small after a link exists; preserves the native editor. |
| 4.5 | Clear safety outcome, but exact immutable deployment identity availability must be proven before it is implementation-ready. |
| 5.1 | Technical connector enabler, appropriately contract-tested; provider-neutral fake can precede OD-6 launch selection. |
| 5.2 | Blocked by OD-6 provider/onboarding/legal decision; cannot truthfully specify supported connection states before that choice. |
| 5.3 | Strong server compliance story; depends on 3.5, 4.5, 5.1, selected policy basis, and current connector state. |
| 5.4 | Strong vertical story; depends on 1.4 and 5.3, cost telemetry, and OD-7's qualifying success predicate. |
| 5.5 | Correct independent fan-out after 5.4; ACs reject blast semantics and preserve partial outcomes. |
| 5.6 | Strong callback/history story after provider dispatch; ordered/idempotent transition rules are testable. |
| 6.1 | Correct projection concept, but “qualifying Leads” should be replaced with the PRD's exact “activation-eligible Leads” definition; successful-Send predicate is blocked by OD-7. |
| 6.2 | Good UX story after 6.1; navigation/widget integration still requires CCRs. |
| 6.3 | Correct pre-commercial story but incorrectly located late. Its minimal observation schema/write path must precede the first representative discovery/generation/deployment/outreach operation. |
| 6.4 | Correct commercial decision gate; requires representative journeys and cost distributions. It must consume a distinct pre-commercial certification, not wait on a release test that itself claims post-commercial FRs. |
| 6.5 | Explicitly and correctly blocked by 6.4 plus OD-14/Andrew approval and billing-core CCRs. |
| 6.6 | Properly follows 6.5; server-created provider sessions are testable. |
| 6.7 | Properly follows approved billing and operation metering; remains post-commercial. |
| 6.8 | Properly follows approved billing/limits but cannot be part of the initial workflow-rebuild release. |
| 6.9 | Activation overview can follow 6.1; any Jagwar entitlement/allowance portion is post-6.5 and should be conditional rather than a hidden forward dependency. |
| 7.1 | Blocked by OD-13/15 for operator authorization/UI placement; provider runtime-rotation semantics are also provider-specific. |
| 7.2 | Blocked by OD-13/15; safe policy model can be tested without exposing runtime operator mutation. |
| 7.3 | Too broad for one implementation story across all data classes. It belongs after target schemas stabilize and should be split by migration unit with shared dry-run/reconciliation contract. |
| 7.4 | Epic-sized certification story. Its “all functional requirements” AC conflicts with deferred commercialization and blocked operator work. Split pre-commercial 5+2+1 certification from later full commercial/operator release certification. |
| 7.5 | Epic-sized NFR certification; numeric budgets and retention policy are absent, so acceptance is not yet measurable. Split performance, trace/privacy, retention, and maintainability evidence. |
| 7.6 | A valid architecture constraint but primarily a governance/deferral assertion; record it as a release constraint and retain focused Publication regression tests. |

### 🔴 Critical Violations

1. **Forward dependency in Story 2.6.** Find Leads completion creates/links Leads before the backlog establishes the Lead aggregate in 3.1. Remediation: move an idempotent Candidate-to-Lead upsert slice ahead of 2.6 or split 2.6 and make Add to Pipeline a CRM story.
2. **Forward dependency in Story 3.3.** The complete Lead workspace depends on Project/Publication/Outreach records introduced by Epics 4–5. Remediation: deliver a core Lead workspace first and add route-colocated panels with their owning later stories.
3. **Circular/ambiguous release evidence.** Story 6.4 needs representative complete 5+2+1 journeys; Story 7.4 is the only explicit certification but claims “all functional requirements,” including Stories 6.5–6.8 that cannot begin before 6.4/OD-14. Remediation: create a pre-commercial workflow certification gate (5+2+1 plus costs, no Jagwar billing enforcement), then commercial approval, then post-commercial billing certification.
4. **Epic 1 is predominantly a technical milestone.** The work is required by governance, but presenting architecture, policy, queue, and module-map gates as one user-value epic obscures dependency safety. Remediation: classify 1.1/1.3/1.4/1.5 as explicit readiness/enabler gates and attach each to the first vertical slice that consumes it; keep 1.2 as the user-facing shell integration story.
5. **Story 7.4 cannot define one releasable scope.** OD-13/15 block operator functionality and Jagwar commercialization is deliberately deferred. “All FRs” therefore makes the initial release impossible or tempts premature scope bypass. Remediation: name separate Workflow Rebuild, Operator, and Commercialization release gates.

### 🟠 Major Issues

1. **Numbering is not dependency order.** At minimum: 1.5/module governance and approvals → 1.4 substrate preflight → 6.3 telemetry foundation → Lead aggregate before 2.6 add → Story 4.1 proof before 4.2 → pre-commercial certification before 6.4 → 6.5–6.8 only after OD-14.
2. **Multiple epic-sized stories.** 4.2, 7.3, 7.4, and 7.5 need explicit sub-slices or separate stories while retaining end-to-end acceptance at the parent gate.
3. **Phase-blocking decisions remain embedded as placeholders.** OD-5/6/7/9/13/15 and OD-14 prevent affected stories from being independently completable; the backlog must annotate those gates directly.
4. **Protected-core changes are prerequisites, not implementation detail.** Registration, manifests, lockfile, env, messages, navigation, DB exports, and project extraction cannot be completed without explicit per-file approval.
5. **Database timing is unspecified.** Do not create all structural-seed tables in Story 1.1/1.5. Add policy tables with the fixture-policy slice, operation/cost tables with durable-operation/telemetry, discovery tables with discovery, Lead tables with Candidate-to-Lead, and outreach tables with the first connector/send slice.
6. **Some acceptance terms are not yet measurable.** Story 7.5 lacks numeric budgets; 6.1/5.4 lack the OD-7 Send predicate; 4.5 lacks proven immutable artifact/version availability; 5.2 lacks a selected provider model.
7. **Story 1.1 retains an abstract team-role branch despite AD-2.** Replace it for the first release with authenticated user ownership, explicit project membership, and separately unresolved operator authority.

### 🟡 Minor Concerns

1. Use `user`/`user_id` in target-facing acceptance criteria where the architecture has resolved ownership; retain “Workspace” only as quoted/conceptual handoff vocabulary.
2. Replace subjective terms such as “useful evidence,” “native,” and “quickly” with fixture assertions, visual comparison criteria, and approved numeric budgets where each story becomes executable.
3. Record deterministic fakes/non-production provider modes explicitly in the affected story prerequisites so contract readiness is not mistaken for production authorization.

### Best-Practices Conclusion

Traceability and BDD coverage are strong, but the backlog is **not dependency-safe as numbered** and several entries are gates, spikes, or certification programs rather than independently completable user stories. The required remediation is sequencing and story-boundary correction—not a product redesign.

## Summary and Recommendations

### Overall Readiness Status

**NOT READY for implementation beyond approved planning, deterministic contract tests, and explicitly bounded non-production proofs.**

Product intent and architecture direction are strong: all 50 FRs are covered; UX aligns with the PRD; OD-2, OD-3, and OD-10 have target-native decisions; the AI and publication authorities are preserved; and the architecture defines a plausible single durable-operation substrate. Readiness still fails because several acceptance predicates are undecided, exact protected-core approvals are absent, and target substrate/project proofs have not run. The approved Correct Course resolves the dependency order. Missing pinned admin source is now a scoped limitation on private-admin/full-workspace evidence rather than a blocker for the accessible customer workflow.

### Open-Decision Readiness

| Decision | Readiness finding | Backlog consequence |
| --- | --- | --- |
| OD-2 ownership | **Resolved/adopted:** authenticated Supabase `user.id` owns first-release business rows; `user_projects` independently authorizes project association. No Workspace/team aggregate. | Update Story 1.1 target wording and test cross-user plus project-membership access. |
| OD-3 persistence/authorization | **Resolved/adopted:** additive Drizzle schemas in Supabase PostgreSQL, protected tRPC/internal-worker boundaries, explicit owner predicates and same-owner constraints, RLS defense in depth. | Migrate per vertical slice; no browser `userId`; do not rely on RLS alone. |
| OD-10 commercial authority | **Resolved/adopted:** existing products/prices/subscriptions/rate-limits/usage/Stripe webhooks remain the only commercial authority. | Story 6.3 writes only non-enforcing cost observations; 6.5–6.8 wait for OD-14 approval. |
| OD-11 durable operations | **Architecturally selected, operationally blocked:** logged PGMQ transport + Cron/pg_net/Vault authenticated bounded Next consumer; durable operation row is authority. | Story 1.4 cannot start until pinned target versions, Vault, queue isolation, worker role, auth replay defense, region/runtime/timeout, concurrency, lease, retry, cancellation, recovery, and observability are proven. |
| OD-12 project/AI path | **Mapped, not proven:** validated `JagwarBusinessContextV1` renders into existing `CreateRequestContextType.PROMPT` → `project_create_requests` → `useStartProject` → `ChatType.CREATE`. | Protected canonical project-transaction extraction must be approved; Story 4.1 fixture proof blocks 4.2+. No AI-core edit is proposed. |
| OD-13 module/operator ownership | **Partially resolved:** customer capability packages/routes/services are mapped; operator role, mutation placement, UI, credential, and dead-letter ownership are not. | Story 1.3 runtime mutation and Epic 7 operator work remain blocked until a surface and authorization model are approved. Do not infer authority from `adminProcedure` or create parallel systems. |
| OD-15 target dependency | **Resolved:** Andrew-approved CCR-019–022 remove the unavailable private admin registration, gitlink, root script, and lock records. | Pinned-Bun frozen install and web typecheck pass. Jagwar does not claim private-admin parity; target-native operator work requires OD-13 approval. |

### Path Classification and Core-Change Gaps

The architecture correctly separates proposed new capability areas—`packages/leads`, `packages/business-policy`, `packages/durable-operation`, `packages/outreach`, `packages/activation`, `packages/business-migration`, capability-named DB schema folders, route-local `app/(commercial)` features, authenticated internal-operation route, and exact capability service folders—from protected baseline integration seams.

The protected-file ledger currently names these per-file CCR candidates:

- `packages/db/src/schema/index.ts`
- `packages/db/package.json`
- `apps/web/client/src/server/api/routers/index.ts`
- `apps/web/client/src/server/api/root.ts`
- `apps/web/client/package.json`
- `bun.lock`
- `apps/web/client/src/env.ts`
- `apps/web/client/.env.example`
- `apps/web/client/src/utils/constants/index.ts`
- `apps/web/client/src/app/projects/_components/top-bar.tsx`
- `apps/web/client/messages/en.json`
- `apps/web/client/messages/es.json`
- `apps/web/client/messages/ja.json`
- `apps/web/client/messages/ko.json`
- `apps/web/client/messages/zh.json`
- `apps/web/client/messages/en.d.json.ts` (maintainer-controlled regeneration only)
- `apps/web/client/src/server/api/routers/project/project.ts`

No path is approved by inclusion in this list. Readiness still lacks:

1. file-level names/classification for every **new** schema, migration, route, service, package manifest/entry point, adapter, fixture, and test—not just directory-level structural seeds;
2. a determination whether `apps/backend/supabase/config.toml` or any protected backend/deployment/CI/test file changes for Queue/Cron/secret wiring;
3. any future target-native operator paths identified by OD-13;
4. completed per-file CCRs with exact minimal diffs, alternatives, risks, focused/baseline tests, rollback, and Andrew's explicit confirmation;
5. an Apache-2.0 dependency/source/asset/icon/style audit for any material selected for adaptation. No donor/provider asset or source has been authorized for copying by this review.

### Baseline Capability Regression Matrix

| Baseline capability | Required proof before affected release | Current state |
| --- | --- | --- |
| Supabase auth/session and fail-closed access | Authenticated/unauthenticated route and cross-user/resource tests | Not run in this discovery pass; not blocked by OD-15 |
| Project creation/membership/branch/canvas/frame/conversation | Existing focused tests plus duplicate/idempotent prospect fixture | Native path mapped; protected extraction and fixture proof pending |
| Editor source/preview/MobX lifecycle | Open/edit/save/preview existing and personalized projects | Pending; no editor-core change proposed |
| AI Ask/Create/Edit, tools, providers, streaming/apply | Existing mode/tool/provider regression and Jagwar prompt-seam fixture | Pending; additive seam mapped only |
| CodeSandbox sessions/source operations | Existing sandbox helper/provider tests and personalized project lifecycle | Pending; integration retained |
| Publishing, Freestyle, deployments, custom domains | Existing publish/domain tests plus exact immutable Publication proof | Pending; immutable identity availability unresolved |
| Stripe subscriptions, rate limits, usage, webhooks | Existing billing/usage tests; cost observation must prove zero entitlement/debit side effects | Pending; billing changes prohibited before OD-14 |
| `@onlook/ui`, tokens, icons, i18n, responsive/focus/motion | Component tests, accessibility checks, real-browser Onlook comparison | Pending; message/navigation CCRs unapproved |
| Package exports, Bun scripts, typecheck/lint/tests | Pinned-Bun frozen install plus focused declared-workspace suites and typecheck/build | Frozen install and web typecheck pass; environment-backed build and remaining suites retain their own prerequisites |
| Admin/operator capabilities | Target-native chosen-surface build/tests plus role/permission regression | OD-13 blocked |

### Additive AI Business-Context Readiness

The safe seam is explicit and does not require changing prompts, agents, tools, registries, streams, managers, modes, `MessageContextType`, or source-apply behavior. `JagwarBusinessContextV1` must remain a new validated read-only module containing selected verified fact-revision identities/provenance, explicit unknowns, qualification evidence, business/brand details, rights-cleared asset references, voice/design direction, and generated guidance as separate fields. Its canonical bounded renderer treats provider/user text as untrusted data, rejects oversize input, and records context/hash/fact-selection/rendered-prompt evidence. It has no save, apply, publish, project-mutation, auth, billing, entitlement, usage, or send interface.

Readiness gates are the protected project transaction extraction and a deterministic Story 4.1 proof showing an authorized editable source/preview with the exact fixture business name and selected facts, omission of unknown facts, and provenance separate from generated copy. Blank/generic output is failure.

### Pre-Commercial Cost-Telemetry Readiness

The selected plan is an operation-linked `cost_observation` model with a single write API under the durable-operation boundary. Each observation records provider, action, normalized unit/quantity, estimate-or-actual phase, amount/currency or provider unit cost, lifecycle outcome, attempt/retry lineage, latency/concurrency context, and trace correlation. A unique operation/provider/action/unit/phase/attempt key prevents double counting; actual supersedes estimate in reports. Saved replay and zero-provider-work paths remain distinguishable from cost-incurring failure.

This path must never write `usage_records`, decide entitlement, reserve/debit allowance, charge, create checkout, or gate a customer. It must be instrumented before representative discovery, qualification, generation, sandbox, deployment, storage/egress, and outreach loads—not deferred until Epic 6 numbering. Commercialization remains blocked until distributions and margin scenarios are analyzed and Andrew approves OD-14.

### 5+2+1 Acceptance and Migration Gaps

- The release suite needs a clean non-production user scope with five unique activation-eligible fixture Leads, two independently personalized editable Onlook projects, one completed exact Publication, consent evidence created through the product workflow, and one compliant Send revalidated immediately before an approved non-production provider dispatch.
- Both project fixtures must assert exact business names and selected available facts in editable source/preview, explicit omission of unknowns, and separate provenance/guidance evidence.
- The single Send must assert exact immutable Publication identity/URL, allowed recipient, current consent/suppression/template/connector state, zero provider call on stale evidence, and the OD-7-approved success predicate.
- Retry, concurrent duplicate, refresh/replay, timeout, unknown outcome, cancellation, partial fan-out, callback replay/order, direct-ID cross-user, and denial paths must prove no duplicate Lead/Project/Send/cost/usage/activation or cross-owner effect.
- Activation must be rebuilt from committed Lead/Project-Link/Send tables and report unavailable/stale—not fabricated zeros.
- Donor migration is later, offline, dry-run-first, idempotent, checksummed, counted, owner-mapped, reversible, and non-dispatching. It must classify each input, preserve suppression/legal history, refuse guessed project/publication linkage, and split data classes into bounded migration units. Production data cutover remains a separate approved runbook.

### Critical Issues Requiring Immediate Action

1. Complete one exact file-level new/protected path ledger and obtain per-file CCR approvals; no protected edit is authorized yet.
2. Run Story 1.4's pinned Supabase/deployment preflight and record actual versions and execution budgets before durable provider work.
3. Run Story 4.1's deterministic native prospect-seeding proof after the minimal project-router CCR is explicitly approved.
4. Resolve the phase decisions required by the first vertical slice: discovery provider/fake boundary, weak-site fixture policy, and measurable performance budgets. Preserve OD-6/7/9 gates for outreach/release.
5. Instrument non-enforcing cost observations before representative work; preserve the single Onlook billing authority and defer customer commercialization.
6. Resolve OD-13 before operator implementation by choosing the actual authorized target-native surface.

### Recommended Dependency-Safe Next Steps

1. Close first-slice repository governance: exact accessible-web path classification, license/naming inventory, CCR approvals, and focused baseline test commands. Preserve the approved OD-15 fork divergence and frozen-install regression.
2. Execute the Story 1.4 infrastructure preflight; amend AD-6 rather than introduce another queue if the pinned substrate cannot satisfy it.
3. Establish only the first-slice foundations: user-owned schema/authorization contract, deterministic policy fixture, operation/idempotency state, and observational cost write path.
4. Build the pure Candidate/provider contract, then durable fake discovery, saved replay, and normalization/qualification contracts.
5. Introduce idempotent Lead upsert before the Find Leads “Add to Pipeline” action; deliver route-local discovery UI only after its server slice is real.
6. Complete core Pipeline/Lead facts UI; add project and outreach panels with their owning later epics rather than placeholders that claim completeness.
7. After explicit project CCR approval, execute Story 4.1; only a passing personalized editable fixture unblocks Story 4.2.
8. Resolve OD-6/7/9 before production-facing outreach; then build consent, exact Publication, connector compliance, one durable Send, and independent fan-out.
9. Certify the pre-commercial 5+2+1 journey and collect representative cost distributions. Resolve OD-14 afterward; implement Stories 6.5–6.8 only if Andrew approves the commercial model.
10. Keep operator controls, donor cutover, production sends, billing mutation, deployment, and customer-data migration behind their separate authority/runbook gates.

### Final Note

The original assessment identified **22 issues requiring attention**: five critical epic/dependency violations, seven major story/readiness issues, three minor specification concerns, and seven UX/architecture implementation warnings. The approved Correct Course proposal resolves dependency/story order, and the approved CCR-019–022 change resolves OD-15 for the Jagwar target. Protected-file approvals for the first slice, infrastructure proof, project-seeding proof, operator authorization, provider/legal decisions, and release evidence remain outstanding. Rerun Implementation Readiness after the first-slice governance and preflight gates close rather than treating this amended report as a pass.

**Assessment date:** 2026-07-28  
**Assessor:** BMAD Implementation Readiness workflow (Product Manager role)
