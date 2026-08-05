# Input Reconciliation Review

**Reviewed artifact:** `../ARCHITECTURE-SPINE.md`  
**Load-bearing inputs:** complete `jagwar-foundation-handoff` pack; pinned-baseline project knowledge rooted at `docs/index.md`  
**Verdict:** **major revision required before the spine can close OD-13 or support implementation readiness**

**Post-review disposition:** This review records the pre-correction finding. Andrew's approved CCR-019 through CCR-022 resolution now removes the unavailable private upstream admin dependency from Jagwar and verifies frozen installation. Jagwar does not claim private-admin parity. OD-13 still blocks operator implementation until an explicit role/authorization model and target-native Jagwar operator surface are approved.

The spine correctly lands the central Onlook-native authorities: Supabase user ownership plus `user_projects`, Drizzle/Supabase persistence, protected baseline files, one Onlook commercial authority, PGMQ/Cron durable work, the native project-create `PROMPT` seam, immutable publication references, route-local `@onlook/ui` composition, and the approved OD-15 target divergence. The remaining findings are not requests to restate the product specification. They are constraints for which two independently built downstream units could currently make incompatible or unsafe choices.

## Blocking conflicts and omissions

### R1 — OD-13 is claimed more broadly than the available baseline supports

**Input:** The user requires OD-15's admin-submodule blocker to be resolved and forbids target implementation while the Onlook-native module map and protected-core inventory are missing. The handoff requires operator integrations, policy, credential, and job-health surfaces, least-privilege operator access, and an OD-13 assignment for every Jagwar capability. `apps/admin` is an original workspace member whose pinned source is unavailable.

**Spine:** AD-15 treats OD-15 as blocking frozen install and complete regression claims only. The Structural Seed and Capability Map assign no owner for operator controls, provider/credential administration, audit views, or job/dead-letter operations, and the protected-seam inventory cannot include unknown `apps/admin` files.

**Reconciliation:** The spine cannot yet declare the initiative module map complete. Make OD-15 an implementation-readiness blocker for the unresolved operator/admin portion, obtain and inspect the exact pinned admin source or an upstream-authorized replacement, then decide whether operator surfaces belong in `apps/admin` or an explicitly justified web-client boundary. Until then, label OD-13 partially resolved and prohibit implementation that would prejudge that ownership.

### R2 — Send-time compliance revalidation is absent from the execution invariants

**Input:** Consent/suppression, connector state, approved template, recipient validity, exact Publication availability, and entitlement must be re-read immediately before **every** provider call. Withdrawal after quote/enqueue must yield zero provider calls and release any reservation (Domain 3.11; Integration Contracts 9–10; Validation stale-quote finding; P0-5). Provider acceptance and recipient delivery are distinct truths.

**Spine:** AD-7 fixes leasing, fencing, idempotency, and the dispatch-start boundary, but never requires the authoritative pre-dispatch re-read, block-and-release outcome, callback authenticity/order, or the `accepted` versus `delivered` distinction. AD-10 snapshots a publication but does not require current availability to be checked at dispatch.

**Reconciliation:** Add one outreach-execution invariant fixing the orchestration boundary: transactional admission may quote, but the leased worker must re-authorize owner/resource relationships and re-read all current compliance/entitlement/publication inputs immediately before the atomic dispatch marker; a failed gate records `blocked`, releases the reservation, and makes no provider call. Verified callbacks/provider queries alone may establish delivery, and callbacks must be authenticated, ordered, and idempotent.

### R3 — The raw-provider-evidence rule conflicts with the hard data boundary

**Input:** Raw provider payloads and secrets may not enter UI or domain state. Provider results must be normalized and only policy-approved, minimized evidence/provenance retained; contact-data retention and redaction remain governed by OD-9.

**Spine:** AD-8 says raw provider payloads may be “retained ... as policy-approved evidence outside authoritative facts.” That still permits raw payload persistence in domain/evidence state and is broader than the governing boundary.

**Reconciliation:** Replace that allowance with minimized, versioned provenance/evidence fields. Whole raw payload retention should be prohibited by default; any exceptional diagnostic retention must be separately approved, access-restricted, encrypted, redacted, time-bounded by OD-9, and outside browser/domain projections.

### R4 — Outreach cardinality and historical truth are under-bound

**Input:** Each Send binds exactly one owner, Lead, Project Link, immutable Publication Reference, recipient snapshot, connector account, message/template version, and idempotency key. Multi-select is independent per-Lead fan-out, never a shared campaign blast. Historical sends are not rewritten by republish, recipient edits, template replacement, or stage movement.

**Spine:** AD-7 and AD-10 cover provider idempotency and publication snapshots, but no invariant binds the rest of the send tuple or prohibits a batch-owned/shared send. Shared campaigns/cold-email infrastructure are not listed under Deferred/non-goals.

**Reconciliation:** Bind the one-Lead/one-Publication send aggregate and independent fan-out rule in the spine, including immutable recipient/template/connector/publication snapshots. Explicitly defer campaign blasts, cold-email infrastructure, and automated reply/sequence behavior.

### R5 — `JagwarBusinessContextV1` lost required fields and the no-authority clause

**Input:** The additive context must carry authorized Lead/business facts, qualification evidence, brand details, rights-cleared asset references, voice/design direction, provenance, explicit unknowns, and generated guidance as distinct data. It is read-only input with no save, apply, project mutation, publish, authentication/authorization, billing, or send authority. Structured context remains separately linked from the rendered prompt.

**Spine:** AD-9 names facts/provenance, unknowns, asset references, and guidance, but omits qualification evidence, brand/voice/design fields, an explicit separate structured-artifact owner/link, and the full no-authority list. “The native path performs generation” could let a downstream unit confuse context assembly with mutation authority.

**Reconciliation:** Tighten AD-9 to enumerate the complete validated shape, persist/link the structured artifact separately from its deterministic bounded `PROMPT` rendering, and state that only the existing native project/AI flow owns mutations. The context and renderer have no side-effect or authorization interface.

## Required completeness fixes

### R6 — Operator, credential, and worker-auth boundaries need owners

The handoff defines Connector Accounts, a server-only connector factory, separately scoped workspace/operator credentials, audit without plaintext, provider-health controls, policy release, and dead-letter visibility. The spine has policy and outreach packages but no connector-account/credential-vault application owner or operator surface. AD-6 also says “authenticated” Cron-to-Next without fixing the shared authentication protocol: where the Cron credential is held, how the Next route verifies it, how rotation works, and how secrets stay out of SQL history, queue payloads, and logs. These are cross-unit compatibility decisions and should be fixed after the admin source is available.

### R7 — Governance gates omitted from the consistency contract

Add explicit conventions for:

- classify every donor module before adaptation as concept reuse, bounded adaptation, target-native replacement, evidence only, or investigate;
- scan new/modified target artifacts case-insensitively for `telio`, allowing only inventoried legacy provenance;
- preserve Apache-2.0 license/attribution and prominent modification notices where applicable, and audit copied/adapted dependencies, source, assets, icons, and styling before inclusion;
- do not copy third-party discovery imagery into generated/public projects without independent rights evidence.

AD-1 and the Naming row cover adjacent concerns but not these required acceptance gates.

### R8 — The protected-seam inventory is not complete for the selected queue design

The listed CCR paths cover web env, router registration, messages, package manifests, lockfile, project creation, and DB export. The selected PGMQ/Cron design must also classify any protected `apps/backend/supabase/config.toml`, existing backend policy/helper, deployment/secret configuration, or existing CI/test file it expects to modify. If the design needs only new SQL migrations, say so explicitly and record how Cron's endpoint secret is supplied without embedding it in a migration. Unknown admin paths remain blocked by R1.

### R9 — UI preservation is narrower than the inherited visual/accessibility contract

AD-13 requires public primitives/tokens/icons and Server Component discipline, but the handoff binds WCAG 2.2 AA, keyboard-equivalent map/Kanban operations, focus restoration, selective live regions, reduced motion, color-independent state, supported mobile/tablet behavior, and preservation of Onlook typography, density, motion, focus, and responsive patterns. Add these as inherited UI consistency constraints; otherwise route slices can all satisfy AD-13 while diverging on accessibility and visual behavior.

### R10 — Release and operational proof lacks explicit revisit contracts

The spine should not duplicate test cases, but it must carry the architectural release conditions that affect shared semantics:

- 5+2+1 is derived from committed owner-scoped records: five unique non-duplicate/non-archived/non-deleted Leads, two active personalized editable project links that pass seed evidence, and one compliant qualifying Send under the later OD-7 decision;
- the consent evidence for the first successful Send is created/correctable/withdrawable through product workflow, not a hidden fixture-only authority;
- failures never collapse projections to zero;
- Story 7.5 must approve numeric budgets and measure percentile results for shell interaction, durable acknowledgment/progress, and provider timeout/retry behavior;
- OD-9 must set retention/redaction before production discovery, migration, or live outreach.

AD-12 covers rebuildable projections and AD-14 covers non-production side effects, but these revisit triggers and count semantics are not currently fixed.

### R11 — Cost observations need complete scope and privacy semantics

AD-11 lists a sound non-enforcing record shape, but it does not bind coverage across discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, and outreach, nor require PII-minimized aggregation. Add the full action coverage, actual-versus-estimated source, retry/failure/concurrency correlation, and the rule that cost evidence cannot contain provider secrets or unnecessary personal data. This preserves the input required for OD-14 without creating a second usage/entitlement ledger.

## Baseline/code-map reconciliation

The following spine decisions agree with the pinned code map and should remain:

| Concern | Reconciled result |
| --- | --- |
| Identity/ownership | AD-2 correctly maps conceptual ownership to server-derived Supabase `user.id` and keeps `user_projects` as separate project access authority. |
| Persistence/auth | AD-3 correctly uses `@onlook/db`/Supabase PostgreSQL with explicit application authorization plus RLS defense in depth. |
| Existing async capability | The docs correctly report no generic durable runner; choosing one additive operation substrate does not replace an existing native job authority. |
| Project/AI | AD-9 correctly uses the existing `project_create_requests` `PROMPT` → `useStartProject` → `ChatType.CREATE` seam and protects AI/editor core. |
| Publication | AD-10 correctly extends `deployments`/domains with an immutable send reference instead of creating a second publishing authority. |
| Billing | AD-11 correctly preserves Stripe/products/prices/subscriptions/rate limits/usage records as the sole customer-commercial authority. |
| UI | AD-13 correctly keeps route-local UI inside the existing Next.js application and composes `@onlook/ui`. |
| OD-15 | AD-15 correctly forbids workspace/lockfile workarounds and full baseline claims, but must be strengthened as described in R1. |

## Close condition

The spine is input-reconciled when R1–R5 are repaired as load-bearing rules, R6–R11 are either incorporated or explicitly deferred with a named revisit trigger, and the admin-dependent operator/module map is no longer presented as resolved without the pinned source.
