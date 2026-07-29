---
title: Donor Inventory and Migration Strategy
status: final
created: 2026-07-28
updated: 2026-07-28
donorRepository: /Users/andrewsimic/Developer/Telio
referenceRepository: /Users/andrewsimic/Developer/Onlook/onlook
---

# Donor Inventory and Migration Strategy

## 1. Interpretation rule

The donor repository proves that many Jagwar business behaviors were implemented and tested. It does not dictate the target architecture, UI, persistence vendor, queue, authentication provider, editor model, or publishing stack.

Donor behavior may be rewritten completely when a rewrite is cleaner within Onlook's modular-monorepo and feature-colocation practices. “Preserve” means preserve verified product meaning, invariants, and evidence—not filenames, directory structure, dependency layering, class names, route shapes, or implementation technique.

No donor module may justify deprecating an Onlook capability or bypassing the protected-core protocol. A target implementation first chooses its Onlook-native package/feature owner, then decides whether any donor logic is worth adapting.

Before adapting donor code, classify it at the smallest useful module level:

- **concept reuse:** preserve rules and acceptance tests, rewrite implementation;
- **adapt:** port a bounded pure module or provider adapter into target conventions;
- **target-native replacement:** use an existing Onlook capability instead;
- **evidence only:** use it to understand edge cases but do not copy it;
- **investigate:** current behavior or ownership must be proven first.

## 2. Verified donor story groups

The following legacy Telio story artifacts are marked `done` and may be used as behavior evidence:

### Workspace and credentials

- `1-6-keep-my-data-private-to-my-workspace-tenant-isolation.md`
- `1-8-vault-my-provider-credentials-securely-per-tenant.md`

### Lead discovery and CRM

- `2-1-lead-data-model-and-leadprovider-dto.md`
- `2-2-add-lead-modal-maps-link-or-manual-entry.md`
- `2-3-async-scrape-job-with-provider-fallback-and-failure-states.md`
- `2-4-enrich-each-lead-and-classify-website-status.md`
- `2-5-leads-pipeline-kanban-board.md`
- `2-6-filter-and-surface-leads-that-need-a-site.md`
- `2-7-lead-detail-slide-over-drawer.md`
- `2-8-pipeline-stage-moves-and-send-auto-advance.md`
- `2-9-emit-lead-milestone-events.md`
- `9-1-dataforseo-live-google-maps-provider-adapter-and-dto-normalization.md`
- `9-2-find-leads-single-search-ux-with-lead-count.md`
- `9-3-telnyx-phone-line-type-lookup-enrichment.md`
- `9-4-telio-owned-website-inspection-orchestration-for-live-discovery.md`
- `9-5-optional-background-provider-routing-for-apify-outscraper.md`
- `9-6-discovery-metering-and-abuse-caps.md`
- `9-7-migration-backfill-for-phone-intelligence-and-discovery-provenance.md`
- `9-8-saved-find-leads-searches-and-replayable-results.md`

### Outreach

- `5-1-outreach-connector-port-typed-dto-capabilities.md`
- `5-2-telnyx-whatsapp-adapter-managed-bsp-onboarding.md`
- `5-3-compliance-gate-approved-template-recipient-opt-in.md`
- `5-4-single-lead-whatsapp-send-async-job-milestone-event.md`
- `5-5-multi-select-fan-out-to-per-lead-queued-jobs.md`

### Activation, billing, and usage

- `3-3-credit-wallet-and-metering-ledger-idempotent-atomic.md`
- `7-1-idempotent-activation-projection-from-lead-site-send-rows.md`
- `7-2-enforce-the-5-2-1-activation-gate-fr-21.md`
- `7-3-onboarding-full-screen-step-flow-welcome-location-profile-results.md`
- `7-4-real-time-activation-tracker-fr-22.md`
- `7-5-stripe-subscription-integration-fr-24.md`
- `7-6-paywall-gate-and-paid-volume-managed-whatsapp-unlock-fr-24-fr-21.md`
- `7-7-credit-allocation-engine-trial-grant-monthly-allocation-capped-rollover-idempotent-reset.md`

### Lead-to-project entry

- `11-8-lead-pipeline-generate-site-entry-launches-wizard.md`

`done` means the donor story was completed in its original context. It does not mean the target Onlook implementation is complete or that every provider credential/current production path remains valid.

## 3. Code classification

### 3.1 Strong candidates for concept reuse or bounded adaptation

| Donor module | Classification | Portable value | Target caution |
| --- | --- | --- | --- |
| `src/ports/lead-provider.ts` | Adapt contract semantics | Normalized Candidate facts, explicit-null discipline, closed website status | Rename Candidate vs Lead deliberately; add stable external identity/provenance and target validation conventions. |
| `src/adapters/dataforseo/dataforseo-lead-provider.ts` + tests | Investigate/adapt | Known interactive provider implementation and response normalization | Recheck current API, terms, pricing, target secret system, timeouts, pagination, stable place IDs. |
| `src/app/dashboard/find-leads/find-leads-presenter.ts` + tests | Adapt pure behavior | Query normalization, opportunity ranking, result identity, coordinates/photo validation | Do not copy UI markup or donor-specific types blindly. |
| `src/ports/outreach-connector.ts` + contract tests | Adapt semantics | Capability-declaring connector, normalized request/result, secret reference | Expand statuses/capabilities and integrate target job/provider patterns. |
| `src/core/outreach/compliance-gate.ts` + tests | Strong pure-logic candidate | Connector-driven opt-in/template gate and typed block reasons | Add suppression, recipient validity, Publication eligibility, jurisdiction/channel policy. |
| `src/core/activation/gate.ts` and `projection.ts` + tests | Strong pure-logic candidate | 5+2+1 target/evaluation vocabulary | Project and Send qualifying definitions must be remapped to Onlook records. |
| `src/core/billing/entitlement.ts` and `subscription.ts` + tests | Adapt semantics | Stored-provider-state entitlement and closed normalized subscription states | Align with Onlook billing/account model and decide past-due grace policy. |
| `src/core/metering/credit-costs.ts` + tests | Evidence only/adapt policy | Inventory of cost-driving operations and free manual operations | Old numeric credit costs and action list are not automatically target pricing. |
| `src/adapters/lead-provider/fallback-lead-provider.ts` + contract tests | Investigate | Provider capability/failure handling patterns | Interactive discovery must not silently change semantics/provider/usage. |
| `src/jobs/select-lead-providers.ts` + tests | Evidence only | Interactive vs background provider routing decision | Re-express through target orchestration, not Cloudflare-specific jobs. |

### 3.2 UI behavior to preserve but presentation to replace

| Donor surface | Preserve behavior | Replace |
| --- | --- | --- |
| `src/app/dashboard/find-leads/**` | One query + count; initial/loading/empty/failure; ranking; selection; saved runs; map/list equivalence | All old layout, CSS, primitives, navigation assumptions. Recompose with Onlook UI. |
| `src/app/dashboard/leads/**` | Manual Lead, Pipeline stages, Lead detail, generate/open/publish/send actions, batch outcomes | Old Kanban/card/dialog/sheet markup and old route composition. |
| `src/app/dashboard/whatsapp/**` | Connection lifecycle and onboarding intent | Old provider-specific UI flow if it does not match the selected target BSP. |
| `src/app/dashboard/activation-*` and `src/components/activation-tracker*` | Count/target/done semantics, unavailable-state requirement | Old visual progress cards/ring/widget. |
| `src/app/dashboard/billing/**` | Plan/usage concepts and pending-plan communication | Old pricing IDs, cards, route structure, Stripe assumptions not revalidated. |
| `src/app/operator/credentials/**` | Need for safe connection/rotation and masked status | Old global-vs-tenant credential taxonomy and environment-specific behavior. |

### 3.3 Rebuild in target architecture

| Donor area | Why not copy |
| --- | --- |
| `src/adapters/neon/**` and numbered SQL migrations | Bound to Neon, old RLS/GUC conventions, old table identities, and old migration history. Translate invariants into target storage/RLS. |
| `src/adapters/clerk/**` and Clerk tenant assumptions | Onlook already has authentication/workspace authority. Do not add a second identity model. |
| Cloudflare Workflows/Queues/Workers/OpenNext wiring | Target has different service and lifecycle conventions. Preserve durable/idempotent semantics only. |
| Old editor, generation wizard, Site/Revision, GrapesJS, Puck, Craft, and related dashboard/editor code | Onlook is the target editor/project/AI authority. These are explicitly retired from target authority. |
| Old dashboard shell, Kiranism/Prodexa component assumptions, theme tokens, sidebar, and editor shell | Visual authority is Onlook. |
| Old publishing/custom-domain implementation | Existing Onlook publishing remains in place for this migration. |

### 3.4 Investigate before reuse

- Whether DataForSEO remains the best interactive provider and exposes stable IDs required for dedupe.
- Whether donor Website Inspector heuristics are sufficiently evidence-backed and legally safe.
- Whether Telnyx WhatsApp/BSP setup and template behavior remain current and contractually available.
- Whether existing Stripe products/prices are test-only, current, or obsolete.
- Which real donor records exist and whether project/publication associations can be proven.
- Whether remote map/place photo display is permitted under current provider/source terms.
- Which donor usage/credit entries represent real commercial commitments.
- Which existing provider secrets require rotation before any target use.

## 4. Source modules by capability

### Discovery

- `src/adapters/dataforseo/dataforseo-lead-provider.ts`
- `src/adapters/outscraper/outscraper-lead-provider.ts`
- `src/ports/lead-provider.ts`
- `src/ports/contracts/lead-provider.contract.ts`
- `src/jobs/select-lead-providers.ts`
- `src/app/dashboard/find-leads/find-leads-presenter.ts`
- `src/app/dashboard/find-leads/find-leads-explorer.tsx`
- `src/app/dashboard/find-leads/find-leads-map.tsx`

### CRM

- `src/app/dashboard/leads/actions.ts`
- `src/app/dashboard/leads/leads-board-presenter.ts`
- `src/app/dashboard/leads/leads-board.tsx`
- `src/app/dashboard/leads/lead-detail-drawer.tsx`
- `src/app/dashboard/leads/lead-stage-moves.ts`
- `src/adapters/neon/lead-stage-rules.ts`
- `src/adapters/lead-repository.ts`

### Outreach

- `src/ports/outreach-connector.ts`
- `src/ports/contracts/outreach-connector.contract.ts`
- `src/core/outreach/compliance-gate.ts`
- `src/adapters/outreach-connector.ts`
- `src/adapters/outreach-send-job.ts`
- `src/adapters/telnyx/telnyx-outreach-connector.ts`
- `src/adapters/neon/neon-outreach-send-store.ts`
- `src/app/dashboard/leads/send-actions.ts`
- `src/app/dashboard/leads/send-dialog.tsx`
- `src/app/dashboard/leads/send-batch-dialog.tsx`
- `src/app/dashboard/whatsapp/**`

### Activation, billing, and credentials

- `src/core/activation/**`
- `src/adapters/activation-projection.ts`
- `src/adapters/activation-gate.ts`
- `src/core/billing/**`
- `src/core/metering/credit-costs.ts`
- `src/adapters/stripe/**`
- `src/adapters/credential-vault.ts`
- `src/adapters/vault/credential-crypto.ts`
- `src/app/dashboard/activation-*`
- `src/app/dashboard/billing/**`

## 5. Data migration categories

| Donor data | Target treatment |
| --- | --- |
| User/Tenant/Clerk identities | Map to target Onlook account/workspace through an explicit owner-approved identity map; never infer by display name. |
| Leads and source facts | Import with provenance, explicit unknowns, old ID mapping, dedupe key, and source timestamps. |
| Discovery Runs/Candidates | Import only if source and lifecycle are trustworthy; otherwise archive as donor evidence. |
| Qualification/phone intelligence | Import as historical results with donor policy/provider identity; mark stale when policy identity is missing. |
| Pipeline stage/activity | Import current stage plus append-only activity where available. |
| Old Site/editor documents | Do not import as canonical Onlook projects. Consider static/archive evidence only. |
| Published URLs/domains | Import as unverified historical references until target Publication/project ownership is proven. |
| Outreach Sends | Import immutable history with channel/provider/publication/recipient snapshots; never replay automatically. |
| Consent/suppression | High-priority import; most restrictive safe state wins when evidence conflicts. |
| Credentials | Do not bulk-copy plaintext or encrypted blobs. Reconnect or rotate into target secret storage. |
| Subscription/billing | Reconcile against the billing provider; do not trust stale local entitlement flags. |
| Credits/usage | Import only with an approved financial reconciliation and idempotent opening-balance strategy. |
| Audit/evidence | Preserve with source identity and checksum/export metadata. |

## 6. Recoverable migration sequence

### Phase 0: Establish writable target and evidence baseline

1. Keep `/Users/andrewsimic/Developer/Onlook/onlook` read-only as the upstream reference.
2. Create a writable fork/worktree/repository for Jagwar-on-Onlook.
3. Record source and target branches, HEADs, dirty status, licenses, and dependency locks.
4. Export a donor schema/data inventory without mutation.

### Phase 1: Target architecture and identity map

1. Read target instructions and map Onlook account/team/project/publication authorities.
2. Define target Jagwar domain placement and server operation conventions.
3. Define exact donor Tenant/User → target Workspace/Account mapping.
4. Do not migrate customer data before this mapping is reviewable.

### Phase 2: New data and contract foundations

Implement only the records needed by the first vertical slice. Add target RLS/authorization and contract tests as each entity appears. Do not pre-create the entire donor schema.

### Phase 3: Vertical product slices

1. Discovery + saved results.
2. Candidate confirmation + Pipeline.
3. Lead → Onlook project/publication.
4. Single compliant send.
5. Activation/usage.
6. Fan-out and operator controls.

### Phase 4: Dry-run import

1. Export donor rows with stable IDs and counts.
2. Transform in a non-production environment.
3. Produce per-category counts: read, accepted, transformed, skipped, failed, duplicate, unresolved.
4. Produce source→target ID mapping and checksums where useful.
5. Re-run to prove idempotency.
6. Verify no provider send, publish, charge, or external side effect occurred.

### Phase 5: Reconciliation and controlled cutover

Only after acceptance evidence:

- reconcile billing and suppression first;
- import business data;
- verify project/publication links manually or deterministically;
- freeze old writers if and when a cutover is separately approved;
- retain rollback/export artifacts;
- do not delete the donor repository or database as part of this story set.

## 7. Target-side acceptance before any destructive decision

- Cross-Workspace isolation passes in the target persistence/auth model.
- Lead/Candidate dedupe is proven under concurrency/retry.
- Imported suppression blocks sends.
- Imported sends cannot replay.
- Billing entitlement matches provider truth.
- Usage/credit opening balances reconcile.
- Unresolved project/publication references remain unresolved rather than guessed.
- A full 5+2+1 journey passes using native Onlook projects and publishing.
- Recovery export and rollback procedure are tested.
