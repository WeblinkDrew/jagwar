---
title: Jagwar Business Workflow Handoff Index
status: product-handoff-complete-implementation-gated
created: 2026-07-28
updated: 2026-07-28
---

# Handoff Index

## One-sentence direction

Build Jagwar's find → qualify → pipeline → personalized project → publish → outreach → deal workflow as native Onlook product capabilities, while preserving one Onlook project/editor authority and one target-native ownership and commercial authority.

**Name:** Jagwar is current. Telio is former/donor and is retained only for exact historical or migration provenance. `NAMING-AUTHORITY.md` governs every new artifact.

## Authority hierarchy

1. The pinned writable Onlook target supplies repository structure, engineering practices, identity, authorization primitives, application composition, project/source/editor/AI/publishing authority, design tokens, and existing billing/usage foundations.
2. This package supplies architecture-neutral Jagwar product behavior, business invariants, acceptance criteria, and donor interpretation.
3. The donor Telio repository supplies evidence and tests only; its UI, editor, auth, database, job, billing, and deployment architecture do not transfer automatically.
4. Phase-blocking decision records resolve any mismatch before implementation. The receiving session must not invent a second authority to make a story appear implementable.

## Documents by question

| Question | Authority |
| --- | --- |
| Why did the foundation change? | `00-course-correction.md` |
| Which product name and identifiers are authoritative? | `NAMING-AUTHORITY.md` |
| Why does Telio still appear in some exact references? | `LEGACY-NAME-INVENTORY.md` |
| What product are we building and for whom? | `01-product-brief.md` |
| What must the product do? | `02-prd.md` |
| What do the records and state transitions mean? | `03-domain-model-and-rules.md` |
| What surfaces and interactions are required? | `04-ux-and-information-architecture.md` |
| What boundaries must providers/application services preserve? | `05-integration-contracts.md` |
| What are the epics, stories, and testable outcomes? | `06-epics-and-stories.md` |
| What donor work can be re-expressed or must be excluded? | `07-donor-inventory-and-migration.md` |
| How is completion proven? | `08-testing-and-acceptance.md` |
| Which decisions block implementation? | `09-risks-and-open-decisions.md` |
| What did independent review find? | `VALIDATION.md` |
| What repository/AI/core-file rules govern implementation and when is pricing decided? | `11-onlook-extension-governance-and-billing-sequence.md` |
| What must be approved before changing an original Onlook file? | `CORE-CHANGE-REQUEST-TEMPLATE.md` |
| What should the next session receive? | `10-new-session-bootstrap-prompt.md` |

## Hard implementation gate

This is a complete product handoff, not a claim that target architecture is resolved. Before persistent implementation, the receiving session must pin a writable Onlook commit and resolve:

- OD-2: native ownership/account/project-membership authority;
- OD-3: persistence and authorization/RLS placement;
- OD-10: the single billing/subscription/entitlement/allocation/usage authority;
- OD-11: the single durable async execution authority;
- OD-12: the native prospect-specific editable project-seeding path.
- OD-13: the additive Onlook package/feature module map and protected-core change protocol.
- OD-14: final pricing only after representative cost telemetry and an approved commercial model.

The backlog is then reordered into a dependency-safe sprint plan. New Jagwar-owned files follow that map. Every proposed edit to a file in the pinned Onlook baseline requires its own explicit approval before the edit occurs. No cutover approval is requested by this package.

## Release proof in one line

Five activation-eligible Leads, two genuinely personalized editable Onlook projects, and one compliant exact-Publication Send—plus isolation, idempotency, consent, usage reconciliation, accessibility, and Onlook-native UI evidence.
