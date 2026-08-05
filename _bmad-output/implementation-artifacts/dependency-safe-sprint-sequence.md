---
title: Jagwar Dependency-Safe Sprint Sequence
status: adopted-course-corrected
created: 2026-07-28
updated: 2026-07-28
sourceBacklog: ../planning-artifacts/jagwar-foundation-handoff/06-epics-and-stories.md
sourceReadiness: ../planning-artifacts/implementation-readiness-report-2026-07-28.md
sourceChangeProposal: ../planning-artifacts/sprint-change-proposal-2026-07-28-jagwar-dependency-sequencing.md
implementationAuthorization: false
---

# Jagwar Dependency-Safe Sprint Sequence

## ADOPTED PLANNING SEQUENCE

Andrew approved the Correct Course proposal on 2026-07-28. This companion now orders the 42 authoritative parent stories by dependency while preserving every original story ID for traceability. It does not mark a story ready for development, approve a protected Onlook-file edit, resolve a remaining phase-blocking decision, or authorize large-scale implementation. All parent stories remain `backlog` in `sprint-status.yaml` because no story file has passed its attached entry gates.

The suffixes below are adopted planning subdivisions from the approved Correct Course proposal. They do not add scope and cannot weaken their parent story's acceptance criteria.

## Global stop gates

| Gate | Blocks | Exit evidence |
| --- | --- | --- |
| Governance / Story 1.5 | Every implementation slice | Exact per-slice new/protected path ledger; Jagwar naming audit; Apache-2.0 dependency/source/asset/icon/style audit; baseline regression commands; Andrew-approved CCR for each protected original. |
| OD-13 operator authority | 1.3b, 7.1, 7.2, operator-surface release | Actual role, authorization boundary, approved surface placement, service/UI seams, protected paths, and regression boundary are mapped. A target-native surface must reuse existing authorities. |
| Story 1.4a / OD-11 preflight | Durable core, provider-backed discovery and outreach | Pinned Queue/Cron/Vault/worker/auth/lease/retry/cancel/recovery/observability substrate and numeric budgets pass. Failure stops for an architecture amendment; it does not authorize another queue. |
| Protected project seam / Story 4.1 | Story 4.2 and later project creation | Andrew approves the exact project Core Change Request and the native personalized editable fixture proof passes. |
| Exact Publication proof | Story 4.5 and outreach | A completed authorized deployment supplies revalidatable immutable artifact/version evidence; a mutable URL alone is insufficient. |
| Outreach OD-6, OD-7, OD-9 | Production connector/send/activation/retention behavior | Provider and legal basis, success predicate, and retention/deletion policy are explicitly approved. Deterministic fakes may prove contracts only. |
| Pre-commercial 5+2+1 and cost cohort | OD-14 and all Jagwar commercialization | Five unique eligible Leads, two personalized editable Projects, one exact Publication and one compliant Send pass with reconciled costs and baseline regression. |
| OD-14 commercial approval | Stories 6.5–6.8, 6.9b, 7.4c | Representative cost/margin analysis and Andrew's explicit prices/plans/allowances/gates approval. |

**OD-13 update (2026-07-29):** Andrew approved the target-native `/operator` placement, Supabase-ID-backed server membership, append-only audit authority, exact service/UI/persistence path map, and regression boundary in `../planning-artifacts/jagwar-implementation-readiness-2026-07-28/OD-13-OPERATOR-AUTHORITY.md`. The role/placement gate is closed; the separate governance gate still blocks every protected path until its exact hash-bound CCR is approved.

## Proposed sprint order

### Gate 0 — Repository, ownership, and operation substrate

1. **1.5** — approve the exact module/protected-path ledger, naming/license audit, and per-file CCRs.
2. **OD-13 customer authority** — retain the completed accessible-web module map and the approved OD-15 target divergence; keep operator authority on its later target-native track.
3. **1.4a + 7.5a** — run the pinned durable-substrate preflight and approve measurable browser/provider/worker budgets.
4. **1.1** — establish server-derived authenticated-user ownership plus independent `user_projects` membership checks.
5. **1.3a** — establish immutable policy contracts and deterministic non-production policy fixtures; no runtime operator authority.
6. **1.4b + 6.3a** — establish one durable-operation core and its non-enforcing operation-linked cost-observation API.

**Stop:** no provider-backed or cost-bearing work begins unless 1.4a passes. Cost telemetry must exist before the first such operation, and it must have no entitlement, allowance, checkout, charge, or customer-gating authority.

### Sprint 1 — First vertical discovery slice

7. **2.1** — normalized Candidate/provider contract and deterministic fake.
8. **2.2** — bounded durable fake discovery with truthful lifecycle and cost observations.
9. **2.3** — saved Candidate snapshots and zero-provider replay.
10. **2.4 + 2.5 fixture slices** — deterministic qualification and phone-enrichment evidence; production paths remain behind provider/policy decisions.
11. **2.6a** — native Find Leads query/results/replay/select UI without Pipeline mutation.
12. **3.1a** — shared idempotent user-owned Lead identity and Candidate-to-Lead upsert.
13. **2.6b** — Add selected Candidates to Pipeline through 3.1a.
14. **3.1b** — manual Lead creation through the same identity/upsert rules.
15. **1.2** — add approved native navigation only after the real route and authorization exist.

**Stop:** 2.6b cannot precede 3.1a. A result-selection UI is not permission to invent client-authoritative Lead creation.

### Sprint 2 — Core CRM

16. **3.2** — six-stage accessible Pipeline.
17. **3.4** — suppression, archive, and activity truth.
18. **3.3a** — core Lead facts/provenance/qualification/activity UI.
19. **3.5** — consent-evidence lifecycle after the applicable legal/policy basis; otherwise contract proof only.

**Stop:** 3.3a contains only authorities that exist. Project/Publication and outreach panels wait for 3.3b and 3.3c with their owning vertical slices.

### Sprint 3 — Native personalized project and exact Publication

20. **4.1** — prove the target-native prospect-seeding path after the exact protected project-seam approval.
21. **4.2a → 4.2b → 4.2c → 4.2d** — idempotent Project Link, validated `JagwarBusinessContextV1` evidence, native creation/reconciliation, and real-browser personalized editable output.
22. **4.3** — associate an existing authorized Onlook project.
23. **4.4** — open the authoritative Onlook editor.
24. **4.5** — prove and snapshot the exact immutable Publication.
25. **3.3b** — add the real Project/Publication panel to the Lead route.

**Stop:** Story 4.1 must pass before 4.2. Blank/generic projects, unknown-fact invention, mutable-URL-only evidence, direct dashboard file writes, or a second project/editor authority fail the gate.

### Sprint 4 — Compliant exact-Publication outreach

26. **5.1** — deterministic Outreach Connector contract.
27. **OD-6 + OD-9** — approve provider/onboarding, consent/legal basis, market scope, and retention.
28. **5.2** — managed connection through the selected provider model.
29. **5.3** — server-authoritative recipient/consent/template/Publication compliance quote.
30. **OD-7** — approve the successful-Send predicate used by settlement, Pipeline, and activation.
31. **5.4** — one durable Send of one exact Publication, re-reading consent and every eligibility input immediately before provider dispatch.
32. **5.5** — independent per-Lead fan-out only after single-send proof passes.
33. **5.6** — signed callback reconciliation and immutable history.
34. **3.3c** — add the real eligibility/history panel to the Lead route.

**Stop:** no production outreach, automated blast, shared publication assumption, or provider call on stale/insufficient consent. A deterministic connector fake proves contracts but does not authorize real dispatch.

### Sprint 5 — Activation, cost evidence, and pre-commercial certification

35. **6.1** — authoritative 5+2+1 projection using the OD-7 predicate.
36. **6.2 + 6.9a** — consistent progress and pre-commercial overview without invented Jagwar offers or allowances.
37. **6.3b + 7.5b** — complete cost and safe correlation instrumentation for discovery, qualification, project/AI, sandbox/VM, hosting/deployment, storage/egress, and outreach.
38. **7.5c** — retention/deletion proof after OD-9.
39. **7.4a + 6.3c** — certify the non-production 5+2+1 journey and reconcile the representative cost cohort.
40. **6.4 / OD-14 decision** — perform cost/margin analysis and request Andrew's explicit commercial decision.

**Stop:** 7.4a is evidence, not a customer cutover or commercialization approval. Stories 6.5–6.8 stay blocked until OD-14 is explicitly approved.

### Sprint 6 — Operator-surface release track

41. **OD-13 operator placement — resolved 2026-07-29:** approved direct `/operator` route, server-side Supabase-ID membership, append-only audit, service/UI/persistence paths, and regression scope; exact protected-file CCRs remain separate.
42. **1.3b + 7.1 + 7.2** — actual authorized policy, provider, and durable-operation controls through the chosen surface.
43. **7.5d + 7.4b** — maintainability/declared-target proof and target-native operator-surface release certification.

**Stop:** no operator UI or privilege is inferred from a helper name. A target-native route is permitted only after explicit authorization mapping and may not create parallel identity, billing, project, job, policy, credential, or audit authority. Private-admin parity still requires the pinned source.

### Sprint 7 — Post-commercial track, only after OD-14

44. **6.5 → 6.6 → 6.7 → 6.8 → 6.9b** — extend the single Onlook commercial authority for approved entitlement, checkout, usage, allocations/fair gate, and commercial overview.
45. **7.4c** — post-commercial billing and entitlement certification.

**Stop:** preserve existing Onlook billing. No second ledger, unapproved price, checkout product, top-up, overage, allowance, trial gate, customer charge, or enforcement may appear before OD-14.

### Sprint 8 — Later migration/cutover track

46. **7.3a → 7.3b → 7.3c → 7.3d → 7.3e** — offline migration framework and bounded domain units after target schemas stabilize.
47. **7.4d** — migration/cutover certification only under a separately approved production-data runbook.
48. **7.6** — retain focused native Publication/hosting regression; infrastructure replacement remains deferred.

## Parallel-safe lanes

Parallel work is safe only inside an already-open gate and only when paths and authorities do not overlap.

| Window | Lane A | Lane B | Lane C | Join condition |
| --- | --- | --- | --- | --- |
| Gate 0 after customer authority map | 1.4a substrate proof | 7.5a measurable budgets | 1.5 per-slice path/CCR evidence | All evidence approved before 1.4b or protected edits. |
| Sprint 1 after 2.1 | 2.2/2.3 durable fake and replay | 2.4 deterministic qualification fixture | 2.5 deterministic phone fixture | Normalized Candidate contract and telemetry correlation remain identical. |
| Sprint 2 after 3.1a | 3.2 Pipeline | 3.4 restrictions/activity | 3.3a Lead facts UI | Same user-owned Lead aggregate and server mutations; no later-panel placeholders. |
| Sprint 3 after 4.1 | 4.2b context validation/renderer | 4.3 existing-project association | Publication identity investigation for 4.5 | 4.2a/c/d remain sequential; 4.5 requires immutable identity proof. |
| Sprint 4 before real dispatch | 5.1 connector fake tests | 3.5 consent evidence contract | 5.3 pure compliance decision tests | OD-6/7/9 and Publication/durable-operation gates converge before 5.4. |
| Sprint 5 | 6.1 activation projection | 6.3b cost adapters | 7.5b/c privacy/correlation evidence | 7.4a runs only after all three reconcile on the same committed cohort. |
| Post-certification | Operator track | Commercial analysis/approved track | Offline migration design | Each keeps its own approval/runbook gate; none implies another is authorized. |

## Parent-ID traceability and status rule

All 42 authoritative stories remain represented exactly once in `sprint-status.yaml`: Epic 1 (1.1–1.5), Epic 2 (2.1–2.6), Epic 3 (3.1–3.5), Epic 4 (4.1–4.5), Epic 5 (5.1–5.6), Epic 6 (6.1–6.9), and Epic 7 (7.1–7.6). The suffix slices above are approved scheduling units only. Until a story file is created after all attached gates pass, every epic and story stays `backlog`.

## Approval boundary

Andrew approved this sequence through the Correct Course workflow on 2026-07-28. Separate explicit confirmation is still required for each protected original Onlook file. Production deployment, real unsolicited sends, billing mutation, customer-data migration, and cutover remain separately governed.
