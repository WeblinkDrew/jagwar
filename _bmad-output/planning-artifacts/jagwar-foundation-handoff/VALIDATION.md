---
title: Handoff Validation and Review Resolution
status: final
created: 2026-07-28
updated: 2026-07-28
---

# Validation and Review Resolution

## Review method

The package received two independent adversarial reviews after initial drafting:

- requirements/acceptance traceability review;
- architecture-neutrality and Onlook-adoption-boundary review.

The initial draft was judged strong as a product specification but not implementation-ready. That distinction is now explicit throughout the package.

## Material findings resolved

| Finding | Resolution |
| --- | --- |
| Blank or generic Onlook project could satisfy project creation | FR-PRJ-2, the project contract, Stories 4.1/4.2, P0-1, and release certification now require a prospect-specific editable draft containing the exact business name and selected available facts, omitting unknowns and preserving provenance. |
| Compliance consumed consent fixtures but offered no lifecycle | FR-OR-9 and Story 3.5 now require record/correct/withdraw behavior and append-only evidence; P0-1 creates evidence through the product workflow. |
| Consent could become stale after quote/enqueue | Domain rules, contracts, Story 5.4, and P0-5 require an immediate authoritative re-read before every provider call and reservation release when blocked. |
| Onlook ownership may not be a general Workspace | OD-2 and the pre-story gate require mapping the pinned target's actual user/project-membership/team authority before Story 1.1; `Workspace` is conceptual vocabulary only. |
| Jagwar could introduce a second billing/usage authority | README, PRD, domain invariants, contracts, OD-10, and Epic 6 require extension/reconciliation of exactly one target-native authority. |
| No durable async foundation story | Story 1.4, integration-contract Section 13, OD-11, and cancellation/recovery acceptance now define one target-native durable-operation boundary. |
| Provider acceptance was conflated with delivery | The lifecycle is now `accepted` versus `delivered`; delivery requires verified callback/query evidence. |
| Credential reference crossed the connector payload ambiguously | Persisted jobs carry Connector Account identity; only a server-only factory resolves the credential reference and constructs the connector. |
| Forward dependencies in the original story order | The backlog now states that numbering is traceability, moves policy authority and durable operations into Epic 1, places Candidate confirmation in Story 2.6, moves the commercial overview after activation/billing, and requires a dependency-safe sprint plan after the architecture gate. |
| Allowance allocation and fair activation gate lacked acceptance | Stories 6.4 and 6.8 cover real billing self-service, idempotent allocation, and making 5+2+1 reachable before continued-volume gating. |
| “One Usage entry” contradicted multiple cost units | P0-1 now reconciles the exact expected set of reservations and settlements across discovery, qualification, project, and outreach actions. |
| Cancellation/archive/delete/NFR evidence was vague | Discovery/outreach cancellation semantics, retention enforcement, end-to-end correlation, and architecture-pinned numeric performance budgets are now explicit stories and tests. |
| “Use Onlook” did not make repository structure enforceable | FR-WA-4, NFR-8, Story 1.5, testing gates, and the governance document now require Bun-workspace boundaries, focused packages, public entry points, route-local feature colocation, and neighboring Onlook practices. Donor behavior may be rewritten cleanly. |
| Existing Onlook features could be silently deprecated during integration | FR-WA-5 and release certification now require a baseline capability matrix and forbid deprecation, disabling, replacement, rename, movement, or semantic weakening of existing Onlook behavior. |
| Sensitive AI integration could become broad prompt/tool/manager edits | FR-WA-6 and `JagwarBusinessContextV1` require additive validated read-only context. Original AI/editor files remain protected and require explicit per-file confirmation if no public seam exists. |
| The package lacked a concrete approval boundary for original Onlook files | `CORE-CHANGE-REQUEST-TEMPLATE.md` and OD-13 define per-file approval, minimal diff, alternatives, risk, baseline tests, upstream-sync impact, and rollback. Story approval never implies core-file approval. |
| Billing stories committed too early to plans and enforcement | Epic 6 now measures non-enforcing end-to-end cost evidence first, requires an owner-approved commercial model, and only then permits plan/checkout/allowance/gate implementation through Onlook's single billing authority. |
| The handoff still used the former product name for new target work | Jagwar is now the current naming authority across titles, requirements, stories, contracts, bootstrap instructions, and status metadata. `NAMING-AUTHORITY.md` restricts Telio to exact donor/historical/migration provenance and adds a release scan. |

## Remaining intentional blockers

The writable-target review resolved OD-1, OD-2, OD-3, and OD-10; mapped OD-12's additive native project path subject to executable fixture proof; and completed OD-13 for accessible customer modules while leaving operator role/placement gated. Story 1.4a subsequently proved OD-11's pinned durable substrate and numeric operating budgets. The approved Correct Course sequence resolves the backlog's forward dependencies without weakening parent acceptance criteria.

Implementation remains gated by exact per-file Core Change Request approval, the OD-12 personalized editable fixture proof, and each story's provider/policy/legal decision. OD-11's environment proof is complete. OD-15 is resolved by the approved target-fork removal and verified frozen install; Jagwar does not claim parity with the unavailable private upstream admin application. OD-13 may approve a target-native Jagwar operator surface only if it reuses existing Onlook authorities. OD-14 intentionally blocks final Jagwar pricing and customer-facing billing enforcement until representative cost evidence exists.

These are target discovery and product decisions, not requests to cut over production. Hosting, sandbox, and custom-domain optimization remain deferred.

## Package integrity checks

- Every declared document is present in the handoff folder.
- Functional, non-functional, and UX requirements are mapped into the backlog.
- Every numbered story has explicit Given/When/Then acceptance criteria.
- No placeholder tokens or unfinished planning markers remain.
- Onlook remains read-only and no Jagwar production source was changed to create this package.
- The package contains an explicit Onlook-native structural map requirement, no-deprecation gate, per-original-file approval template, additive AI-context contract, and cost-before-pricing sequence.
- Jagwar is used for current product/target work; every remaining Telio reference is required legacy provenance or append-only historical memory.
