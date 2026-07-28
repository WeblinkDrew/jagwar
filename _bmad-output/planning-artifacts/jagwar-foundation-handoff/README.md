---
title: Jagwar Business Workflows — Onlook Foundation Handoff
status: product-handoff-complete
implementationReadiness: blocked-pending-target-architecture-decisions
created: 2026-07-28
updated: 2026-07-28
targetFoundation: Onlook
currentProductName: Jagwar
formerProductName: Telio
donorRepository: /Users/andrewsimic/Developer/Telio
referenceRepository: /Users/andrewsimic/Developer/Onlook/onlook
targetRepository: /Users/andrewsimic/Developer/Jagwar
architectureBinding: intentionally-neutral
---

# Jagwar Business Workflows — Onlook Foundation Handoff

## Purpose

This folder is the clean product handoff for rebuilding Jagwar's business dashboard and growth workflows on top of the Onlook codebase. It captures what Jagwar must do for lead discovery, qualification, CRM, personalized outreach, activation, billing, tenancy, and operator controls without making the legacy Telio architecture authoritative.

The target implementation should feel native to Onlook. Onlook's application structure, design tokens, authentication, editor, project model, AI workflow, and reusable UI are the starting point. The legacy Telio repository is donor evidence for product behavior and verified edge cases only.

## Authority rules

1. The current product name is **Jagwar**. **Telio** is the former/donor name and is used only for exact legacy paths, artifacts, identifiers, and migration provenance. See `NAMING-AUTHORITY.md`.
2. These documents define the portable Jagwar business capabilities for the new implementation.
3. Onlook defines the target visual language and initial application architecture.
4. Existing donor Telio source may be inspected or selectively adapted only after its behavior is mapped into the target architecture.
5. Do not import the retired Telio editor, GrapesJS work, Puck/Craft work, Kiranism dashboard layout, Cloudflare orchestration, Neon repository layer, Clerk assumptions, or old publishing system merely because donor code exists.
6. Preserve business invariants: tenant isolation, explicit-null lead facts, idempotent jobs and money effects, personalized per-lead sends, compliance gates, durable status, and authoritative server-side entitlement.
7. Production hosting and custom-domain optimization are deliberately deferred. Keep the existing Onlook publishing path working while the business workflows are rebuilt.
8. There must be exactly one billing, subscription, entitlement, and usage authority. Inventory and preserve Onlook's existing system early; extend or reconcile it only after the measured-cost commercial decision. Never create a parallel Jagwar billing truth.
9. Jagwar is extension-first. Follow Onlook's Bun-workspace modular-monorepo, package boundary, public-export, feature-colocation, schema, adapter, manager/service, and test practices; donor Telio code may be rewritten cleanly to fit them.
10. Existing Onlook capabilities are preservation requirements. Do not deprecate, disable, replace, rename, move, or weaken them to add Jagwar.
11. Every file present in the pinned Onlook baseline is protected. Before each original-file edit—including exports, registrations, root workspace files, AI/editor files, and lockfile changes—the implementation session must submit a per-file Core Change Request and receive Andrew's explicit confirmation.
12. Pricing and customer-facing billing gates are deferred until the complete workflow's actual operating costs are measured. Non-enforcing cost telemetry and inventory of Onlook's billing authority begin early; Jagwar commercialization comes last.

## Implementation readiness gate

This package is complete as a product handoff. It is intentionally **not yet implementation-ready**. Before Story 1.1, the receiving session must resolve and attach a versioned target architecture map for:

- whether Jagwar ownership is user-scoped, project-membership-scoped, or team/workspace-scoped in the current Onlook commit;
- how Onlook's existing subscription and usage records are preserved and inventoried now, with any later extension/reconciliation blocked on measured costs and OD-14 approval;
- target persistence and authorization/RLS conventions;
- target-native durable async execution, recovery, and outbox/job ownership;
- the exact Onlook-native path that creates a prospect-specific editable first draft from verified Lead facts;
- an additive module/feature map that follows Onlook's repository structure and identifies every anticipated original-file change separately;
- a protected additive AI-context seam for Jagwar business facts, or an approved per-file Core Change Request if no seam exists.

## Reading order

1. `index.md` — concise map, authority hierarchy, and implementation gate.
2. `TARGET-BASELINE.md` — writable fork, branch, pinned Onlook commit, license, and protected-file boundary.
3. `NAMING-AUTHORITY.md` — Jagwar current-name rule and allowed legacy Telio references.
4. `LEGACY-NAME-INVENTORY.md` — approved categories for every retained Telio reference.
5. `00-course-correction.md` — why the foundation changed and what is preserved.
6. `01-product-brief.md` — product thesis, users, loop, scope, and success.
7. `02-prd.md` — architecture-neutral functional and non-functional requirements.
8. `03-domain-model-and-rules.md` — entities, state machines, invariants, and event meanings.
9. `04-ux-and-information-architecture.md` — required surfaces, workflows, states, and accessibility.
10. `05-integration-contracts.md` — provider-neutral seams for discovery, qualification, outreach, billing, usage, and durable operations.
11. `06-epics-and-stories.md` — product backlog draft and acceptance criteria; dependency order is finalized only after the target architecture gate.
12. `07-donor-inventory-and-migration.md` — what exists in donor Telio, what may be reused, and what must be re-expressed for Jagwar.
13. `08-testing-and-acceptance.md` — automated and browser acceptance gates.
14. `09-risks-and-open-decisions.md` — unresolved product, compliance, target architecture, and vendor decisions.
15. `VALIDATION.md` — review findings, resolutions, and remaining hard gates.
16. `11-onlook-extension-governance-and-billing-sequence.md` — hard repository, original-file, AI-safety, clean-rewrite, and pricing-sequence rules.
17. `CORE-CHANGE-REQUEST-TEMPLATE.md` — mandatory per-original-file approval record.
18. `10-new-session-bootstrap-prompt.md` — copy/paste prompt for the implementation session.
19. `SOURCE-MANIFEST.md` — source evidence and interpretation rules.

## Target product loop

```text
Find local businesses
        ↓
Qualify which ones need a better site
        ↓
Add prospects to the pipeline
        ↓
Generate or open a personalized Onlook project
        ↓
Edit and publish through Onlook
        ↓
Send the exact published preview to the prospect
        ↓
Track contact and deal progress
```

## Hard non-goals for this handoff

- Recreating the legacy Telio dashboard pixel-for-pixel.
- Porting the retired editor or its document authority.
- Replacing Onlook's editor, AI architecture, authentication, or project authority with donor implementations.
- Solving production hosting costs or custom-domain migration before the business loop works.
- Choosing final plans, prices, allowances, top-ups, or customer billing gates before representative end-to-end cost evidence exists.
- Building bulk email infrastructure, mailbox warmup, shared campaign blasts, or reply automation in the first migration.
- Treating scraped facts, provider judgments, or AI output as unquestioned truth.

## Definition of a successful handoff

A new session should be able to read only this folder and then:

- explain the product loop and the difference between discovery, pipeline, project generation, publishing, and outreach;
- identify every target surface and its states;
- implement the work in user-value order without inheriting the old architecture;
- map each UI action to an authoritative application operation;
- preserve compliance, isolation, idempotency, and metering boundaries;
- verify the result through deterministic tests and a real browser journey.
- place new code where an Onlook maintainer would expect it and prove existing Onlook capabilities still pass;
- distinguish a new Jagwar-owned file from a protected original Onlook file and follow the per-file approval protocol.
