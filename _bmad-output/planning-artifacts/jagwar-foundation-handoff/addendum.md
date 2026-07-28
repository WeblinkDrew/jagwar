---
title: PRD Addendum — Target Architecture and Migration Notes
status: final
created: 2026-07-28
updated: 2026-07-28
---

# PRD Addendum — Target Architecture and Migration Notes

This addendum carries implementation depth intentionally excluded from `02-prd.md`.

## Target stance

- The current product name is Jagwar. Telio is the former/donor name and is retained only for exact legacy provenance under `NAMING-AUTHORITY.md`.
- Start from Onlook's architecture rather than merging Onlook into legacy Telio.
- Reuse Onlook's identity/workspace, project/editor, AI, design-token, UI, and publication authorities.
- Add Jagwar business workflows through target-native modules and server operations.
- Keep provider boundaries replaceable and runtime validated.
- Do not create a second project/site document, editor controller, publishing authority, auth system, or visual system.
- Keep existing Onlook CodeSandbox and Freestyle integrations during this migration.
- Preserve Onlook's modular-monorepo shape: runnable applications in `apps/*`, reusable capabilities in focused `packages/*`, shared configuration in `tooling/*`, public package entry points, and route-local feature colocation.
- Prefer additive Jagwar-owned files and packages. Every file present in the pinned Onlook baseline requires a per-file Core Change Request and Andrew's explicit confirmation before modification.
- Existing Onlook behavior is not deprecated as part of Jagwar. Compatibility with editor, AI, auth, project, publishing, billing, UI, package exports, and development workflows is a release requirement.

## Detailed downstream documents

- Domain entities, state machines, invariants, and event semantics: `03-domain-model-and-rules.md`.
- Onlook-native surfaces, states, accessibility, and responsive behavior: `04-ux-and-information-architecture.md`.
- Provider-neutral application/adapter contracts: `05-integration-contracts.md`.
- Product backlog and acceptance criteria: `06-epics-and-stories.md`; the target session finalizes dependency order only after the architecture gate.
- Donor module classification and recoverable migration: `07-donor-inventory-and-migration.md`.
- Testing, browser acceptance, security, and release evidence: `08-testing-and-acceptance.md`.
- Risks, provider decisions, compliance, commercial policy, and deferrals: `09-risks-and-open-decisions.md`.
- Repository structure, additive AI integration, original-file governance, and pricing sequence: `11-onlook-extension-governance-and-billing-sequence.md`.
- Current versus legacy naming and migration rules: `NAMING-AUTHORITY.md`.

## Rejected alternatives

- Port the Onlook editor into legacy Telio: rejected because it preserves two incompatible application authorities and the unacceptable old shell.
- Copy the entire legacy Telio dashboard into Onlook: rejected because the UI and infrastructure assumptions are precisely what must be replaced.
- Replace CodeSandbox/Freestyle during the same migration: deferred because it expands scope without proving the business workflow.
- Import old Site/editor documents as canonical Onlook projects: rejected because identity and document authority cannot be safely inferred.
- Build shared outreach campaigns first: rejected because the MVP value is personalized proof per Lead and campaign infrastructure introduces separate compliance/deliverability scope.
- Restructure Onlook around donor Telio folders: rejected because Jagwar must fit the established modular-monorepo and feature-colocation model.
- Patch existing AI prompts/tools/managers directly to inject business data: rejected as the default because an additive validated context artifact is safer and more upgrade-compatible.
- Choose final pricing from legacy Telio assumptions before the rebuilt system runs: rejected because VM, hosting, provider, storage, retry, and concurrency costs must be measured in the target architecture.

## Provider evidence, not decisions

- DataForSEO produced sufficiently fast interactive Maps results in the donor implementation; Outscraper's observed queue latency was unsuitable for interactive search.
- Telnyx was implemented as the donor WhatsApp/phone provider.
- Stripe was the donor billing provider.

All must be revalidated against current terms, pricing, APIs, target integration fit, and legal requirements before target production use.

## Implementation-readiness distinction

This addendum does not authorize implementation against an unknown target structure. The product handoff is complete, while implementation remains gated on a pinned writable Onlook commit and explicit decisions for target-native ownership, persistence/authorization, the single commercial authority, durable async work, and personalized project seeding. See `index.md`, `09-risks-and-open-decisions.md`, and `VALIDATION.md`.

The gate also requires a target module map and protected-core inventory. Adding a new story-authorized Jagwar file does not need repeated approval once the map is approved. Editing any original Onlook file does: the next session must submit `CORE-CHANGE-REQUEST-TEMPLATE.md` for the exact path and receive Andrew's explicit confirmation before making that edit.
