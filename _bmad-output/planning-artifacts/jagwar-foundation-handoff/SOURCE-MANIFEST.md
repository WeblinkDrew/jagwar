---
title: Source Manifest
status: final
created: 2026-07-28
updated: 2026-07-28
---

# Source Manifest

## Interpretation

All legacy Telio sources below are historical or donor evidence. Several planning documents are explicitly archived/superseded in their original repository. This handoff extracts only the business capabilities corroborated by completed story artifacts and current source. It intentionally rejects their retired editor and infrastructure decisions.

Product-owner naming direction supplied 2026-07-28: the current product is **Jagwar**. **Telio** is the former/donor name and remains only where exact historical provenance requires it.

## Primary product evidence

- `/Users/andrewsimic/Developer/Telio/_bmad-output/planning-artifacts/briefs/brief-Telio-2026-06-25/brief.md`
- `/Users/andrewsimic/Developer/Telio/_bmad-output/planning-artifacts/prds/prd-Telio-2026-06-25/prd.md`
- `/Users/andrewsimic/Developer/Telio/_bmad-output/session-changelog-find-leads-2026-06.md`
- `/Users/andrewsimic/Developer/Telio/_bmad-output/planning-artifacts/ux-designs/ux-Telio-2026-06-25/EXPERIENCE.md`

These establish the original find → qualify → generate → publish → send thesis, the corrected one-query Find Leads UX, DataForSEO pivot rationale, saved-search requirement, CRM stages, outreach boundary, activation, and billing concepts. Their old editor/UI/stack decisions are not carried forward.

## Completed story evidence

See the full completed story list in `07-donor-inventory-and-migration.md`. The strongest story groups are Epic 2/9 lead discovery, Epic 5 outreach, Epic 7 activation/billing, workspace isolation/credential vaulting, credit ledger, and lead-to-generation entry.

## Current source evidence

- normalized Lead/Candidate contract: `src/ports/lead-provider.ts`;
- DataForSEO adapter: `src/adapters/dataforseo/dataforseo-lead-provider.ts`;
- provider contract test: `src/ports/contracts/lead-provider.contract.ts`;
- Find Leads behavior: `src/app/dashboard/find-leads/find-leads-presenter.ts`;
- Outreach Connector: `src/ports/outreach-connector.ts`;
- compliance gate: `src/core/outreach/compliance-gate.ts`;
- activation projection/gate: `src/core/activation/projection.ts`, `src/core/activation/gate.ts`;
- entitlement/subscription: `src/core/billing/entitlement.ts`, `src/core/billing/subscription.ts`;
- metered actions: `src/core/metering/credit-costs.ts`;
- Pipeline/outreach/WhatsApp/activation/billing UI evidence under `src/app/dashboard/**`.

## Target/reference evidence

- Onlook reference checkout: `/Users/andrewsimic/Developer/Onlook/onlook`
- Writable Jagwar target: `/Users/andrewsimic/Developer/Jagwar`
- Pinned Onlook baseline: `423e2e924366419e418ee049093872d535eea41a`
- Onlook is Apache-2.0 according to the prior license audit; the receiving session must re-read the repository's current `LICENSE`, notices, dependency licenses, and applicable instructions before copying/adapting.
- The reference checkout remains read-only. Implementation uses the established writable target recorded in `TARGET-BASELINE.md`.
- Product-owner structural direction supplied 2026-07-28: treat Onlook as a Bun-workspace modular monorepo/modular monolith; preserve `apps/*` runnable boundaries, focused `packages/*` capabilities, `tooling/*`, public package entry points, provider/adapter and manager/service patterns, schema-first contracts, and route-local feature colocation.
- Product-owner governance direction supplied 2026-07-28: Jagwar is additive, existing Onlook capabilities are not deprecated, and every original Onlook file change requires explicit per-file confirmation.
- Product-owner commercial direction supplied 2026-07-28: measure target costs during implementation but defer final Jagwar pricing and customer billing gates until the complete architecture is operating and its costs are understood.

## Excluded authority

- Old Jagwar GrapesJS, Puck, Craft, and editor-shell requirements.
- Old Site/Revision/document/publishing authority.
- Old Kiranism/Prodexa visual system.
- Old Cloudflare/Neon/Clerk implementation as a target mandate.
- Old provider pricing, Stripe IDs, deployment URLs, secrets, and environment variables.
- Old sprint trackers and “done” status as evidence that target Onlook work is complete.

## Extraction decisions

- Use Candidate for unconfirmed discovery output and Lead for a durable CRM record.
- Save Candidate Snapshots to prevent refresh loss and repeated provider cost.
- Keep qualification Jagwar-owned and evidence/version backed.
- Associate Leads with Onlook Project identity; never create a second project document.
- Bind each send to an immutable Publication Reference.
- Model multi-select as per-Lead fan-out, not a blast.
- Calculate activation from authoritative rows/outcomes, not event counts alone.
- Keep discovery usage separate from generic AI credits.
- Defer hosting/domain provider change.
