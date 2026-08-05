---
title: Sprint Change Proposal — Jagwar Dependency-Safe Backlog Sequencing
status: approved
created: 2026-07-28
updated: 2026-07-28
workflow: bmad-correct-course
mode: batch
changeScope: moderate
sourceBacklog: jagwar-foundation-handoff/06-epics-and-stories.md
approvedBy: Andrew
approvedAt: 2026-07-28
od15Amendment: approved-and-implemented-2026-07-28
---

# Sprint Change Proposal — Jagwar Dependency-Safe Backlog Sequencing

## Approval record and boundary

Andrew explicitly approved proceeding with this Correct Course workflow on 2026-07-28. This proposal now governs dependency sequencing and the sprint-sized subdivisions of the existing 42 story IDs. It does not add product scope or weaken any parent acceptance criterion.

Approval authorizes the planning/backlog reconciliation recorded here. It does **not** approve any protected Onlook baseline-file edit, production operation, real unsolicited send, billing mutation, customer-data cutover, or commercial decision. Those retain their separate per-file, runbook, legal/security, or OD-14 approval gates.

### OD-15 approved amendment

After the initial sequencing correction, Andrew approved the exact CCR-019 through CCR-022 target-fork resolution. Jagwar now intentionally omits the inaccessible private upstream `apps/admin` gitlink, its `.gitmodules` registration, root `dev:admin` script, and generated lock records. Pinned Bun 1.3.1 completes a frozen install of the declared Jagwar workspace and the existing web typecheck passes. This amendment changes no product requirement, epic, story ID, customer workflow, or UX contract. It removes OD-15 from the gate register while OD-13 still gates a future target-native operator surface.

## 1. Issue summary

The 2026-07-28 implementation-readiness review found complete requirements traceability—50 of 50 functional requirements are represented in the 42-story backlog—but found that the numbered order is unsafe to execute. The material problems are:

1. Story 2.6 creates or links Leads before Story 3.1 establishes the Lead persistence/upsert behavior.
2. Story 3.3 promises Project, Publication, outreach-eligibility, and Send-history panels before Epics 4 and 5 establish those authorities.
3. Story 6.4 requires representative complete workflow evidence, while Story 7.4 is the only explicit certification and currently includes post-commercial Stories 6.5–6.8, creating a pre-/post-commercial dependency cycle.
4. Stories 1.1, 1.3, 1.4, and 1.5 are mandatory enabler gates presented inside a user-value epic; their actual entry and exit conditions are not attached to the consuming slices.
5. Stories 4.2, 7.3, 7.4, and 7.5 are too large to behave as independently completable sprint stories.
6. OD-13, protected-core approvals, the durable-substrate preflight, and the native personalized-project proof remain phase blockers for their consuming slices. OD-15 was initially scoped to the unavailable private admin dependency and is now resolved by the approved amendment above.

This is a sequencing and story-boundary correction. It is not a product redesign, scope reduction, infrastructure replacement, or permission to implement.

## 2. Evidence and impact analysis

### 2.1 Trigger and evidence

The trigger is the completed implementation-readiness report rather than a failed implementation story. Its story-by-story review identifies the forward dependencies in 2.6 and 3.3, the circular certification dependency, oversized stories, unresolved OD gates, and missing Core Change Request approvals. The reviewed architecture independently establishes the required prerequisites: user ownership, explicit project membership, one PGMQ-based operation substrate subject to preflight, non-enforcing cost observations, the protected native project transaction, and an additive `JagwarBusinessContextV1` prompt seam.

During review, Andrew reported that a fresh Onlook clone ran successfully without the unavailable optional admin source. Read-only inspection confirmed the web runtime has no admin import or workspace link. The later approved CCR-019–022 change removed the dead dependency from Jagwar and proved a pinned-Bun frozen install and web typecheck. It does not establish private-admin parity or operator authorization; Jagwar makes neither claim.

### 2.2 Epic impact

| Epic | Proposed impact | Product scope impact |
| --- | --- | --- |
| Epic 1 | Treat 1.1, 1.3, 1.4, and 1.5 as named readiness/enabler gates; retain 1.2 as the user-facing navigation outcome. | None; makes prerequisites explicit. |
| Epic 2 | Split 2.6 into Find/inspect/select and Add-to-Pipeline slices. | None. |
| Epic 3 | Split 3.1 into shared Lead upsert and manual-entry slices; split 3.3 into progressively composed panels. | None. |
| Epic 4 | Keep 4.1 as an executable gate; divide 4.2 into bounded checkpoints under the same parent acceptance. | None. |
| Epic 5 | Attach OD-6, OD-7, OD-9, durable-operation, Publication, consent, and telemetry gates to the exact consuming stories. | None. |
| Epic 6 | Move the 6.3 telemetry foundation before cost-bearing slices; separate pre-commercial measurement/activation from post-OD-14 billing. | None; preserves deliberate commercialization deferral. |
| Epic 7 | Split migration and NFR programs; replace one all-FR certification with pre-commercial workflow, operator-release, and post-commercial certifications. | None; clarifies release claims. |

No epic becomes obsolete and no new product epic is required. All existing story IDs remain traceable.

### 2.3 Artifact impact

- **PRD:** no requirement change proposed. The MVP and 5+2+1 product loop remain intact.
- **Architecture:** AD-15 records the approved target divergence and requires frozen-install regression during upstream synchronization; OD-13 independently governs the target-native operator surface.
- **UX:** no interaction or visual change proposed. Route composition, state coverage, accessibility, and Onlook visual authority remain intact.
- **Epics/backlog:** approval would require a controlled edit that adds dependency metadata, story subdivisions, and release-gate wording while preserving the 42 parent IDs and their acceptance criteria.
- **Sprint status:** remains unchanged during draft review. After approval only, sprint planning may record the ordered suffix slices.
- **Code/infrastructure:** none changed by this proposal. OD and CCR gates remain stop conditions.

### 2.4 Technical and release impact

The proposal makes the first safe implementation unit smaller: governance and environment proof, then a user-owned durable fake-discovery slice with non-enforcing cost observation. It prevents UI work from manufacturing missing server authorities and prevents pre-commercial certification from claiming customer billing or operator capabilities that remain blocked.

The schedule gains explicit gate time before feature coding and avoids likely rework. Relative effort for the backlog reorganization is **medium**; implementation risk after reorganization is reduced from **high** to **medium**, with residual high risk at the durable-substrate preflight, the project-seeding proof, exact Publication identity, outreach policy/provider decisions, and OD-13 operator authorization. OD-15 is closed for the declared Jagwar target.

## 3. Recommended approach

Use **Direct Adjustment** with a moderate backlog reorganization:

1. retain the seven epics and all 42 parent story IDs;
2. introduce suffix slices only where a parent is too broad or creates a forward dependency;
3. treat enabler stories as explicit gates attached immediately before their first consumer;
4. certify the complete workflow before commercial approval without calling that proof a production release;
5. certify the accessible customer workflow independently of the optional/private admin application, while requiring operator authorization and controls before any operator-surface release;
6. keep donor migration and production cutover behind stable schemas and an approved runbook.

### Alternatives considered

- **Potential rollback:** not applicable. No Jagwar implementation has been accepted under this backlog, so there is no completed feature work to revert.
- **MVP reduction:** rejected. The core 5+2+1 journey, consent evidence, personalized editable drafts, exact Publication, operator controls, and baseline preservation remain required. The correction changes order and certification claims, not product intent.
- **New technical epic:** rejected. That would add numbering without fixing dependency placement. Explicit gates tied to consumers are easier to audit.

## 4. Detailed old → new proposals

The `OLD` blocks summarize the current authoritative story boundary. The `NEW` blocks are the exact proposed planning boundary; the original parent acceptance criteria continue to govern completion.

### 4.1 Story 1.5 — repository-governance gate

**OLD**

> Story 1.5 establishes the module map and protected-core ledger as one Epic 1 story, without making its approval state an explicit entry gate for each affected slice.

**NEW**

> **Gate 1.5 — Approve the slice-specific module and protected-path ledger.** Before any target implementation slice starts, identify every path that slice proposes, classify it as new or protected baseline, complete the Apache-2.0/source/asset/icon/style and Jagwar-naming audit, and obtain Andrew's per-file approval for every protected original. A directory-level structural seed is insufficient. The declared-target inventory excludes the private upstream admin under the approved OD-15 divergence.

**Rationale:** This is governance, not a feature that can be considered implicitly complete because the architecture document exists.

### 4.2 Story 1.1 — resolved first-release ownership

**OLD**

> Map Jagwar records to an abstract Onlook workspace authority, including a conditional branch for team roles.

**NEW**

> **Story 1.1 — Enforce authenticated-user ownership and independent project membership.** First-release business rows are owned by the server-derived Supabase `user.id`; browser-supplied owner/workspace IDs are rejected or ignored. Lead-to-project operations additionally prove current `user_projects` membership. Cross-user reads and mutations fail closed without leaking existence. Shared Workspace/team authority is deferred until a pinned Onlook baseline supplies it; operator authorization is governed separately by OD-13.

**Gate attachments:** AD-2/AD-3 adopted; protected DB export/registration CCRs approved; exact schema paths classified; OD-15 target divergence and frozen-install proof recorded.

### 4.3 Story 1.3 — fixture policy versus runtime operator authority

**OLD**

> One story establishes versioned policy authority and allows an operator to activate policy drafts.

**NEW**

> **1.3a — Immutable policy contract and deterministic fixture releases.** Establish the closed policy kinds, canonical validation/hash, immutable release envelope, operation snapshot linkage, and deterministic non-production fixtures needed by the first discovery slice. No production operator mutation UI or privilege is introduced.
>
> **1.3b — Authorized runtime policy operation.** After OD-13 resolves the actual operator role and placement, add operator create/review/activate/supersede behavior with audited authorization and no arbitrary runtime authority. The target-native Jagwar operator route must reuse the same Supabase identity, billing, project-access, durable-operation, and audit authorities. Complete this together with Story 7.2.

**Rationale:** The first deterministic slice needs reproducible policy input, while runtime admin mutation is not authorized merely because `adminProcedure` exists.

### 4.4 Story 1.4 — preflight before durable-operation implementation

**OLD**

> One story establishes a complete durable-operation authority.

**NEW**

> **1.4a — Prove the pinned durable substrate.** Record the target PostgreSQL build and exact `pgmq`, `pg_cron`, `pg_net`, and Vault availability; prove queue isolation, restricted worker role, signed-request rotation/replay defense, Cron-to-HTTPS reachability, actual Next runtime/provider/region limits, and numeric batch/concurrency/visibility/lease/retry/timeout budgets. If proof fails, amend AD-6 before implementation; do not add a fallback queue.
>
> **1.4b — Implement the durable operation core.** Only after 1.4a, establish the operation/attempt/idempotency state machines, transactional enqueue, lease fencing, cancellation-before-dispatch, unknown-outcome reconciliation, bounded retries/dead letter, callback inbox, and trace contract.

**Gate attachments:** OD-11 is selected but blocked until 1.4a passes; relevant backend/config/env/DB CCRs approved; pinned-Bun frozen-install proof passes for the declared Jagwar workspace.

### 4.5 Story 6.3 — move observational cost foundations forward

**OLD**

> Cost measurement appears late in Epic 6 after discovery, project generation, and outreach stories that incur representative provider cost.

**NEW**

> **6.3a — Establish non-enforcing cost observations.** Immediately after 1.4b, add the operation-linked observation schema and single write API with normalized units, estimate/actual phases, retry lineage, trace, and idempotency. Prove it cannot write `usage_records`, decide entitlement, debit allowance, charge, create checkout, or gate users.
>
> **6.3b — Instrument each representative provider slice.** Complete the discovery, qualification, project/AI, sandbox/VM, deployment/hosting, storage/egress, and outreach observation adapters alongside the first slice that performs that work.
>
> **6.3c — Reconcile the pre-commercial cohort.** Before Story 6.4, verify replay/retry/failure/cancellation accounting, actual-over-estimate reporting, distributions, and correlation across the completed 5+2+1 cohort.

**Rationale:** Measurement must exist before cost-bearing work; it remains observational and does not create a second billing ledger.

### 4.6 Stories 2.1–2.6 and 3.1 — remove the Add-to-Pipeline forward dependency

**OLD**

> Story 2.6 includes result UI, selection, and Candidate-to-Lead creation. Story 3.1 later introduces manual Lead creation/deduplication.

**NEW**

> **2.6a — Find, inspect, replay, and select Candidates.** Deliver the Onlook-native query/count, durable states, saved-run replay, evidence/ranking, accessible result selection, and optional lawful map/list equivalence. This slice does not mutate the Pipeline.
>
> **3.1a — Establish idempotent Lead identity and Candidate-to-Lead upsert.** Own the minimum user-scoped Lead aggregate, stable source/fallback dedupe identity, Candidate provenance linkage, New stage initialization, concurrency behavior, and activation exclusion for duplicates. This is the shared server operation used by discovery and manual entry.
>
> **2.6b — Add selected Candidates to the Pipeline.** Use 3.1a to fan selected Candidates into independent created/existing results without duplicates, cross-user effects, or layout instability.
>
> **3.1b — Add a Lead manually.** Add manual provenance, required identifying input, explicit unknowns, and reuse the same 3.1a identity/upsert rules.

**Required order:** 2.1 → 2.2 → 2.3 → 2.6a; 3.1a must precede 2.6b and 3.1b. Story 2.4 and 2.5 enrich the result contract when their fixture/production gates permit; neither may falsify discovery completion.

### 4.7 Story 3.3 — progressively compose the Lead workspace

**OLD**

> A single “complete Lead workspace” story requires facts, qualification, Project Link, Publication, outreach eligibility/history, and activity before those later authorities exist.

**NEW**

> **3.3a — Core Lead workspace.** Deliver user-owned facts, provenance, qualification/evidence age, current stage/restrictions, and Lead/activity history. Unknown/enrichment-failed facts render truthfully.
>
> **3.3b — Project and Publication panel.** Colocate the panel in the Lead route only after Stories 4.2–4.5 establish Project Link and exact Publication authority; expose state-dependent create/open/publish actions without placeholders.
>
> **3.3c — Outreach eligibility and history panel.** Add consent/suppression, connector/template/recipient eligibility, exact Publication quote, and Send history only after Stories 5.3–5.6 establish those server authorities.

**Rationale:** The route can grow vertically while each panel is owned and tested with its real authority.

### 4.8 Story 4.2 — bounded prospect-project slices

**OLD**

> One story contains canonical project transaction delegation, Project Link lifecycle, context rendering, durable idempotency, native AI generation, reconciliation, and real-browser personalization proof.

**NEW**

> **4.2a — Admit one idempotent prospect-project operation.** Create/reconcile the user-owned Project Link lifecycle and call only the approved extracted native project transaction; no duplicate project, copied project document, or direct dashboard file write.
>
> **4.2b — Assemble generation evidence.** Validate `JagwarBusinessContextV1`, select verified fact revisions/provenance and explicit unknowns, render one bounded existing PROMPT context, and retain context/fact/prompt hashes. The module has no mutation, publish, auth, billing, usage, or send authority.
>
> **4.2c — Run and reconcile native creation.** Use `project_create_requests` → `useStartProject` → `ChatType.CREATE`, preserve native editor/AI behavior, and reconcile retries or ambiguous completion through the Project Link operation.
>
> **4.2d — Prove personalized editable output.** In a real browser, assert exact fixture business name and selected available facts in editable source/preview, omission of unknown claims, separate provenance/guidance evidence, and failure for blank/generic output.

**Gate attachments:** Story 4.1 passes first; Andrew approves the exact `project.ts` CCR; no AI-core edit; exact baseline regressions run; 4.2 is incomplete until 4.2d passes.

### 4.9 Story 4.5 — make immutable publication identity an entry gate

**OLD**

> Resolve and snapshot a ready deployment's identity, URL, version reference when available, status, and publish time.

**NEW**

> Before implementation, prove the pinned Publication/deployment path can identify the exact immutable artifact or version sent. If it cannot, mark the Publication ineligible and submit the smallest architecture/CCR proposal; do not treat a mutable URL alone as exact-send evidence. Once proven, Story 4.5 snapshots and immediately revalidates the completed authorized deployment without replacing native publishing/domain authority.

### 4.10 Stories 5.1–5.6 — attach provider, policy, and success gates

**OLD**

> Connector, WhatsApp setup, compliance, dispatch, fan-out, and callbacks appear sequentially, but phase decisions are listed mainly outside their story entry conditions.

**NEW**

> - **5.1** may use a deterministic connector fake to prove the normalized contract before launch-provider selection.
> - **5.2** cannot enter production implementation until OD-6 selects the BSP/onboarding model and actual connector states.
> - **5.3** requires 3.5, 4.5, 5.1, the OD-6 opt-in/legal basis, and applicable OD-9 retention rules.
> - **5.4** requires 1.4b, 5.3, 6.3a/its outreach instrumentation, and OD-7's explicit activation-success predicate. Consent is re-read under the dispatch lock immediately before the provider call.
> - **5.5** follows a passing single-send slice and preserves per-Lead independence.
> - **5.6** follows real provider callback semantics; a fake may contract-test lifecycle ordering but cannot authorize production dispatch.

### 4.11 Stories 6.1 and 6.9 — remove terminology and commercial forward dependencies

**OLD**

> Story 6.1 says “qualifying Leads,” and Story 6.9 requires allowance/entitlement information even before Jagwar commercialization.

**NEW**

> **6.1 — Build the authoritative activation projection.** Count the PRD-defined **activation-eligible Leads**, successful personalized Project Links, and OD-7-approved successful compliant Sends. Failure/staleness remains unavailable, never fabricated zero.
>
> **6.9a — Pre-commercial overview.** Show 5+2+1 progress, next action, Leads, Projects, Publications, Sends, and existing Onlook billing state where applicable. Do not show invented Jagwar allowances or offers.
>
> **6.9b — Approved commercial summary.** Only after Stories 6.5–6.8, add approved Jagwar plan/allowance and customer-action content through the single Onlook commercial authority.

### 4.12 Story 7.3 — bounded donor migration program

**OLD**

> One story migrates Leads, qualification, Pipeline, project links, Sends, consent/suppression, subscriptions, usage, and audit data with dry-run, idempotency, checksums, and reconciliation.

**NEW**

> **7.3a — Offline migration framework.** Establish immutable export input, classification, dry-run default, checkpoints, checksums, source-target maps, rejected rows, no-dispatch guarantees, and reversible owner-scoped writes.
>
> **7.3b — Lead-domain migration unit.** Migrate Leads, fact/provenance revisions, qualification, Pipeline, consent, and suppression after those target contracts stabilize.
>
> **7.3c — Project/Publication reference unit.** Associate only identities proven through target authority; leave uncertain links pending review.
>
> **7.3d — Send/commercial/audit history unit.** Migrate historical Sends, usage/billing evidence, and audit records only after retention/legal/commercial mappings are approved; never create entitlement or provider effects.
>
> **7.3e — Reconciliation and cutover runbook.** Prove counts, checksums, rollback, backup, ownership, and no partial overwrite before any separately approved production-data cutover.

**Gate attachments:** all owning target schemas stable; OD-9 resolved for personal/contact data; OD-14 resolved before any commercial mapping that affects target authority; production cutover remains separately approved.

### 4.13 Story 7.4 — separate workflow proof, operator release, and commercialization

**OLD**

> One certification story runs the 5+2+1 journey and claims all functional requirements, including operator and post-commercial billing work that cannot precede the cost evidence required by Story 6.4.

**NEW**

> **7.4a — Pre-commercial workflow certification (evidence gate, not customer release).** In a clean non-production user scope, prove 5 unique activation-eligible Leads, 2 prospect-specific editable Onlook projects, 1 exact completed Publication, and 1 compliant successful Send using consent evidence created through the product flow and revalidated immediately before approved non-production dispatch. Prove retry, replay, cancellation, unknown outcome, partial fan-out, callback order, cross-user denial, baseline regression, approved CCR traceability, and complete cost correlation. No Jagwar price, allowance, checkout, charge, or gate is asserted. This evidence unblocks Story 6.4 analysis.
>
> **7.4b — Operator-surface release certification.** After OD-13 and Stories 1.3b, 7.1, 7.2, applicable 7.5 slices, and all essential operator controls pass, certify the target-native operator surface. Existing Onlook billing remains preserved; Jagwar commercialization may still be absent.
>
> **7.4c — Post-commercial certification.** Only after Andrew approves OD-14 and Stories 6.5–6.8 pass, certify the approved Jagwar plan, checkout, entitlement, allowance, settlement, fair-cycle gate, webhook, and denial behavior without regressing existing Onlook billing.
>
> **7.4d — Migration/cutover certification.** If donor data cutover enters scope, certify 7.3 and the separate production runbook; it is not a hidden prerequisite for 7.4a.

**Rationale:** This removes the 6.4 ↔ 7.4 cycle without weakening the actual first customer release or claiming unbuilt commercial/operator behavior.

### 4.14 Story 7.5 — measurable NFR evidence slices

**OLD**

> One story certifies performance, maintainability, end-to-end correlation/privacy, and retention/deletion.

**NEW**

> **7.5a — Approve measurable performance budgets.** Before provider-backed slices, define browser interactivity, request acknowledgment, progress freshness, provider timeout, worker batch/concurrency/visibility/lease, and percentile budgets against the actual deployment environment.
>
> **7.5b — Prove correlation and privacy per vertical slice.** For discovery and outreach first, trace browser admission → operation → provider attempt → domain result → cost/usage outcome without secrets or unnecessary payloads.
>
> **7.5c — Prove retention and deletion.** After OD-9, test expiry/redaction/deletion and minimum suppression/legal evidence retention with scheduled and authorized flows.
>
> **7.5d — Certify maintainability and baseline compatibility.** Check public package entry points, dependency direction, schema validation, colocation, tests, no donor compatibility layer, every approved CCR, and the applicable full Onlook regression matrix.

### 4.15 Story 7.6 — release constraint, not infrastructure work

**OLD**

> A story preserves publishing/custom domains and records hosting limitations for later work.

**NEW**

> Retain Story 7.6 as a standing release constraint and focused Publication regression checklist. It creates no hosting-replacement implementation task in this rebuild; evidence may seed a separately approved later infrastructure epic.

## 5. Dependency-safe execution order

Parent story IDs remain authoritative traceability. Suffixes below are the proposed sprint-sized work units.

### Phase 0 — repository and authority gates

1. **1.5 gate:** exact path ledger, naming/license audit, baseline regression commands, per-file CCR drafts and approvals.
2. **OD-13 customer authority gate:** retain the completed accessible-web module map and keep operator authority separate.
3. **1.4a + 7.5a:** pinned durable-substrate/deployment preflight and measurable budgets.
4. **1.1:** authenticated-user ownership, same-owner constraints, project-membership authorization.
5. **1.3a:** immutable policy contract and deterministic non-production releases.
6. **1.4b + 6.3a:** durable-operation core and non-enforcing cost-observation foundation.

### Phase 1 — first vertical discovery slice

7. **2.1:** canonical Candidate/provider contract and deterministic fake.
8. **2.2:** bounded durable fake discovery with truthful lifecycle and cost observations.
9. **2.3:** saved snapshots and no-provider replay.
10. **2.4/2.5 fixture slices:** deterministic qualification and phone-enrichment evidence; production provider/policy paths remain behind OD-4/OD-5.
11. **2.6a:** native Find Leads results workspace without Pipeline mutation.
12. **3.1a:** idempotent user-owned Lead aggregate/upsert.
13. **2.6b:** Add selected Candidates to Pipeline.
14. **3.1b:** manual Lead entry.
15. **1.2:** add the approved native navigation entry when the real route exists.

### Phase 2 — CRM foundation

16. **3.2:** six-stage Pipeline.
17. **3.4:** suppression/archive/activity truth.
18. **3.3a:** core Lead workspace.
19. **3.5:** consent-evidence lifecycle only after applicable policy/legal basis is fixed; otherwise deterministic contract proof only.

### Phase 3 — native personalized project and publication

20. **4.1:** executable native seeding proof after the exact project CCR approval.
21. **4.2a → 4.2b → 4.2c → 4.2d:** idempotent Project Link, context evidence, native generation, browser proof.
22. **4.3:** authorized existing-project association.
23. **4.4:** open the authoritative editor.
24. **4.5:** exact immutable Publication proof/snapshot.
25. **3.3b:** real Project/Publication panel.

### Phase 4 — compliant outreach

26. **5.1:** deterministic connector contract.
27. **Resolve OD-6 and OD-9** for provider/onboarding, legal basis, and retention.
28. **5.2:** managed connection using the selected model.
29. **5.3:** server-authoritative compliance quote.
30. **Resolve OD-7** success predicate before activation-affecting dispatch.
31. **5.4:** one durable exact-Publication Send with immediate consent revalidation.
32. **5.5:** independent multi-Lead fan-out.
33. **5.6:** signed callback reconciliation and immutable history.
34. **3.3c:** real outreach panel.

### Phase 5 — activation and pre-commercial proof

35. **6.1:** authoritative 5+2+1 projection using the OD-7 predicate.
36. **6.2 + 6.9a:** consistent progress and pre-commercial overview.
37. **6.3b + 7.5b:** complete cost/correlation instrumentation per provider family.
38. **7.5c:** retention/deletion proof after OD-9.
39. **7.4a + 6.3c:** pre-commercial 5+2+1 workflow certification and reconciled representative cost cohort.
40. **6.4:** cost/margin analysis and explicit Andrew OD-14 commercial decision.

### Phase 6 — operator release gate

41. **OD-13 operator placement decision:** choose an Andrew-approved target-native Jagwar operator route; define roles, authorization, service/UI seams, protected paths, and regressions.
42. **1.3b + 7.1 + 7.2:** actual authorized policy/provider/job operations through the chosen surface.
43. **7.5d + 7.4b:** maintainability/declared-target proof and target-native operator-surface release certification.

### Phase 7 — only after commercial approval

44. **6.5 → 6.6 → 6.7 → 6.8 → 6.9b:** reconcile the single Onlook billing authority, approved checkout/self-service, usage, allocations/fair gate, and commercial overview.
45. **7.4c:** post-commercial billing and entitlement certification.

### Phase 8 — later migration/cutover

46. **7.3a → 7.3b → 7.3c → 7.3d → 7.3e:** bounded offline migration units and separately approved cutover runbook.
47. **7.4d:** migration/cutover certification if that release is authorized.
48. **7.6:** continue baseline Publication/hosting regression; infrastructure optimization remains deferred.

## 6. Gate register attached to the backlog

| Gate | Blocks | Exit evidence |
| --- | --- | --- |
| OD-13 operator authority | 1.3b, 7.1, 7.2, 7.4b | Actual role, authorization, approved surface placement, service/UI seams, protected paths, and regression boundary mapped. A target-native surface must reuse existing authorities rather than create a parallel admin system. |
| Protected-core approval | Every story touching a baseline file | One approved CCR per exact file, including minimal diff, alternatives, risks, focused/baseline tests, rollback. |
| OD-11 / 1.4a preflight | 1.4b, 2.2, 5.4–5.6 | Exact versions and queue/Vault/Cron/worker/auth/lease/retry/cancellation/recovery/observability proof. |
| OD-12 / Story 4.1 proof | 4.2+ | Approved project transaction extraction and deterministic personalized editable fixture proof. |
| Exact Publication proof | 4.5, 5.3–5.6 | Authorized completed deployment has immutable artifact/version evidence and revalidation path. |
| OD-4 discovery provider | Production 2.2/2.5 | Approved provider, plan, capabilities, licensing/data-use and cost terms; deterministic fake may precede. |
| OD-5 weak-site policy | Production 2.4/ranking claims | Approved measurable V1 rules and evidence coverage; fixture release may precede. |
| OD-6 outreach/BSP/legal basis | 5.2–5.4 production | Approved provider/onboarding, opt-in basis, template/category and market scope. |
| OD-7 Send success predicate | 5.4 activation settlement, 6.1, 7.4a | Explicit acceptance-versus-delivery decision and lifecycle mapping. |
| OD-9 retention/deletion | 7.3 personal-data units, 7.5c, production data retention | Approved periods, legal basis, deletion/redaction and minimum audit evidence. |
| OD-14 commercialization | 6.5–6.9b, 7.4c | Representative cost/margin analysis plus Andrew's explicit plans/prices/allowances/gates approval. |

## 7. Change checklist record

| Checklist | Status | Finding |
| --- | --- | --- |
| 1.1 trigger story | [x] | Readiness assessment across 2.6, 3.3, 6.4/7.4, Epic 1, 4.2, 7.3–7.5. |
| 1.2 core problem | [x] | Planning/dependency defect, not a product-requirement defect. |
| 1.3 evidence | [x] | 100% FR coverage plus explicit readiness and architecture findings. |
| 2.1–2.5 epic impact | [x] | All seven epics remain; boundaries and order change. |
| 3.1 PRD conflict | [x] | No PRD change required. |
| 3.2 architecture conflict | [x] | AD-15 records the approved target divergence; OD-13 and operational proofs remain gates. |
| 3.3 UX conflict | [x] | No UX change; progressive real-authority panels improve feasibility. |
| 3.4 other artifacts | [x] | Backlog and later sprint status affected only after approval; code/config untouched. |
| 4.1 direct adjustment | [x] Viable | Medium planning effort; medium residual implementation risk. |
| 4.2 rollback | [N/A] | No accepted implementation to revert. |
| 4.3 MVP review | [x] Viable but unnecessary | Scope remains achievable; no requirement reduction recommended. |
| 4.4 path selected | [x] | Direct adjustment with suffix slices and phase gates. |
| 5.1–5.5 proposal components | [x] | Issue, impacts, recommendation, exact changes, and handoff are included. |
| 6.1 review | [x] | Applicable analysis complete; open gates are explicitly recorded. |
| 6.2 accuracy | [x] | Checked against PRD, epics, UX, architecture, project docs, and readiness report. |
| 6.3 explicit approval | [x] | Andrew approved proceeding with the Correct Course workflow on 2026-07-28. |
| 6.4 sprint-status update | [N/A] | No epic/story IDs were added, removed, or renumbered; all 42 parent stories correctly remain `backlog`. |
| 6.5 next-step handoff | [x] | Moderate backlog reconciliation routed to Product Owner/Developer with Architect and QA gate ownership. |

### OD-15 amendment checklist record

| Checklist | Status | Finding |
| --- | --- | --- |
| 1.1–1.3 trigger/evidence | [x] | Exact private repository unavailable; pinned reference web runs with empty admin; no runtime import/link; frozen install originally failed; disposable removal succeeded. |
| 2.1–2.5 epic impact | [x] | No epic, story, order, or product scope changes. OD-13 alone governs future operator work. |
| 3.1 PRD | [x] | Core MVP remains achievable; PRD requirements are unchanged. Jagwar explicitly does not claim private-admin parity. |
| 3.2 architecture | [x] | AD-15 records the approved fork divergence and upstream-sync regression rule. |
| 3.3 UX | [N/A] | No customer or operator UI was implemented or changed. |
| 3.4 other artifacts | [x] | `.gitmodules`, the gitlink, one root script, and the pinned-Bun lock were changed under CCR-019–022; setup/deployment/readiness records were reconciled. |
| 4.1 direct adjustment | [x] Viable | Low implementation effort; accepted upstream-sync risk; restores reproducibility. |
| 4.2 rollback | [x] Viable | Restore the four baseline records only if legitimate pinned source becomes available. |
| 4.3 MVP review | [N/A] | No MVP reduction is required. |
| 4.4 selected path | [x] | Direct target-fork adjustment plus future target-native operator surface under OD-13. |
| 5.1–5.5 proposal/handoff | [x] | Exact CCRs, evidence, tests, rollback, documentation impact, and Developer/Architect handoff are recorded. |
| 6.1–6.2 final review | [x] | Generated lock matched the audited 24-addition/328-deletion result; manifest and docs validate. |
| 6.3 explicit approval | [x] | Andrew said to proceed on 2026-07-28 after reviewing the exact four-file proposal. |
| 6.4 sprint status | [N/A] | No epic/story lifecycle changed. |
| 6.5 next step | [x] | Return to Gate 1.5 first-slice protected-file approvals, then Story 1.4a preflight. |

## 8. Implementation handoff

**Scope classification:** Moderate. The product and architecture remain stable, but the backlog requires PO/Developer reorganization with PM/Architect validation of phase gates.

Following approval:

- **Product Owner:** update the authoritative epic file with the accepted boundaries/dependencies while preserving the 42 parent IDs and full FR/UX traceability.
- **Architect:** validate every OD/CCR gate and amend the architecture only if a preflight disproves an adopted decision.
- **Sprint planner:** create sprint status from the dependency order above; never treat story numbering as execution order.
- **Developer:** begin only the first approved, unblocked slice; preserve all protected-core, non-production, provider, billing, migration, and release boundaries.
- **QA/Test architect:** attach contract, isolation, retry/idempotency, baseline regression, accessibility, browser personalization, exact Publication, consent revalidation, and cost-correlation tests to each slice.
- **Andrew:** explicitly approve this proposal, each protected-file CCR, OD-14 commercial terms, and any production runbook separately.

### Success criteria for the correction

1. No story consumes a domain authority established only by a later story.
2. Every enabler has an observable exit condition and is attached to its first consumer.
3. Every oversized parent has sprint-sized suffix slices while retaining the parent ID and acceptance contract.
4. The 50/50 FR coverage and seven-epic product structure remain unchanged.
5. Pre-commercial 5+2+1 proof can produce cost evidence before OD-14 without claiming operator/customer release or Jagwar billing.
6. The first customer workflow release still requires essential operator authorization and controls.
7. Post-commercial and migration certifications cannot be mistaken for initial workflow proof.
8. No protected file or source authority changes without the required explicit approvals; sprint status changes only through normal story lifecycle.
9. The Jagwar target remains reproducibly installable without claiming or silently substituting the unavailable private upstream admin application.

## 9. Workflow completion record

- **Issue addressed:** unsafe story dependencies plus final target resolution of the unavailable private admin dependency.
- **Change scope:** moderate backlog/readiness reconciliation plus the separately approved CCR-019–022 target-fork change; no product requirement or production change.
- **Artifacts reconciled:** authoritative epic status/sequence pointer, open-decision register, target-baseline note, architecture AD-15, readiness reports, path ledger, sprint sequence, project-doc index, and this proposal.
- **Routed to:** Product Owner/Developer for gated backlog execution; Architect for OD/preflight/CCR gates; QA/Test Architect for per-slice and baseline evidence; Andrew for protected-file, commercial, and production-runbook approvals.
- **Sprint status:** unchanged by design; seven epics and 42 parent stories remain `backlog` until individual story entry gates pass and a story file is created.

## 10. Final disposition

**Approved by Andrew on 2026-07-28.** The dependency-safe sequence is adopted for planning and handoff. Product implementation remains gated per slice; all protected original Onlook files still require their own Core Change Request and Andrew's explicit confirmation.
