---
title: Risks and Open Decisions
status: final-with-deferred-decisions
created: 2026-07-28
updated: 2026-07-28
---

# Risks and Open Decisions

## 1. Decisions already made

- The current product name is Jagwar. Telio is the former/donor name and is used only for exact legacy provenance under `NAMING-AUTHORITY.md`.
- Onlook is the target application/editor foundation.
- Onlook's design tokens and UI are the target visual authority.
- The legacy Telio repository is donor evidence, not target architecture.
- Jagwar's portable differentiator is the lead → qualification → project → publication → outreach → deal loop.
- Production hosting/custom-domain optimization is deferred until the workflow works.
- Personalized per-Lead sends are in scope; shared campaign blasts and cold email are deferred.
- Unknown facts are never fabricated.
- Place/map photos remain discovery context unless independent publication rights exist.
- Compliance, entitlement, usage, and workspace access are server authoritative.
- Jagwar follows Onlook's Bun-workspace modular-monorepo, package-boundary, and route-colocation practices; donor implementation may be rewritten cleanly to fit.
- Existing Onlook capabilities are not deprecated by the Jagwar rebuild.
- Every original Onlook file is protected by per-file explicit confirmation before modification.
- Final Jagwar pricing and customer billing gates are deferred until representative target costs are measured; internal cost telemetry starts during implementation.
- OD-11 is proven for Story 1.4b entry: use logged Supabase PGMQ queues behind allowlisted server functions, Supabase Cron through `pg_net`, Vault-held signing credentials, and an authenticated bounded Next.js Node route. Browser and direct Data API queue access remain prohibited.

## 2. Phase-blocking decisions

These must be resolved before the named implementation story starts.

### OD-1: Writable target repository

**Status:** resolved 2026-07-28.

The writable target is `/Users/andrewsimic/Developer/Jagwar`, forked as `WeblinkDrew/jagwar`, on bootstrap branch `bmad/jagwar-foundation-bootstrap`. The pinned Onlook baseline is commit `423e2e924366419e418ee049093872d535eea41a`. See `TARGET-BASELINE.md`. `/Users/andrewsimic/Developer/Onlook/onlook` remains read-only.

### OD-2: Onlook workspace/account mapping

**Needed before:** Story 1.1 and any persistence or authorization implementation.

Determine the native Onlook account/team/workspace authority, role model, and how server procedures derive it in a pinned Onlook commit. Current evidence may be user/project-membership scoped rather than a general Workspace; do not invent a Workspace table or recreate Clerk organizations to satisfy document vocabulary.

### OD-3: Target domain/persistence placement

**Needed before:** any Jagwar record persistence; no later than Story 1.1.

Choose where Jagwar tables/contracts/services live inside Onlook and how target RLS/authorization is enforced. Prefer Onlook's current Supabase/database conventions if they meet isolation requirements.

### OD-4: Interactive discovery provider

**Needed before:** real provider implementation in Story 2.2.

Benchmark DataForSEO and alternatives for latency, stable identity, field coverage, terms, cost, rate limits, and testability. Donor evidence favors DataForSEO over slow Outscraper queues for interactive use.

### OD-5: Weak-site policy V1

**Needed before:** Story 2.4.

Define the first version's evidence and thresholds. Avoid subjective or legally risky claims. Decide how redirects, parked domains, social-only pages, TLS failures, mobile usability, performance, stale content, and blocked inspection affect outcomes.

### OD-6: WhatsApp/BSP operating model

**Needed before:** Story 5.2.

Confirm selected provider, embedded onboarding support, business verification, sender ownership, approved-template mechanics, opt-in/legal basis, pricing, delivery receipts, webhooks, and availability for the target markets.

### OD-7: Activation send definition

**Needed before:** Story 6.1.

Decide whether activation counts provider `accepted` or confirmed `delivered`. Recommended default: count normalized provider acceptance if delivery receipts are not universal, but report delivery separately.

### OD-8: Commercial policy release

**Needed before:** Stories 6.5 through 6.8, and only after OD-14 produces measured evidence and Andrew approves the commercial model.

Confirm plans, allowances, usage units, top-ups, trial verification, rate/velocity limits, allocation timing, rollover, dunning/grace, refunds/reversals, and provider-cost margins. Old Jagwar numbers are historical evidence only.

### OD-9: Data retention and privacy policy

**Needed before:** production discovery and migration.

Define retention for Candidate Snapshots, Leads, provider raw evidence, phone/email, outreach history, suppressed recipients, deleted Workspaces, and operator logs. Obtain appropriate legal review for scraped contact data and outreach markets.

### OD-10: One target-native billing and usage authority

**Needed before:** Story 1.1 data mapping and every Epic 6 story.

Inventory Onlook's existing user-scoped subscription, billing-customer, usage, and allowance records/services. Decide how Jagwar action units extend or reconcile those records without creating a second subscription, entitlement, allocation, or usage truth. Record migration and opening-balance rules.

### OD-11: Durable async execution authority

**Needed before:** Story 1.4, Story 2.2, or any outreach dispatch.

Select the target-native facility for durable enqueue, lease, retry, cancellation, crash recovery, provider reconciliation, outbox/event delivery, dead-letter/operator visibility, trace correlation, and reservation release. Browser requests and in-memory route work are not candidates.

**Resolved 2026-07-29 by the reviewed Story 1.4a preflight.** The approved substrate is logged PGMQ for durable queue state, allowlisted `SECURITY DEFINER` functions for least-privileged worker access, Cron plus `pg_net` for bounded HTTPS invocation, Vault-held HMAC credentials, and a database-backed nonce claim at the authenticated Next.js boundary. Every elevated function must use a fixed safe `search_path`, controlled owner, explicit execute allowlist, and `PUBLIC` revocation. The hosted target proved queue visibility/redelivery/archive behavior, local and hosted Data API isolation, actual worker-login allow/deny behavior, future-skew and no-work-on-rejection controls, credential rotation, a 9-second `pg_net` caller timeout, explicit retry visibility, correlated Cron/HTTP/route evidence, bounded concurrency, and cleanup. Story 1.4b must use the corrected numeric budgets and invariants recorded in `_bmad-output/implementation-artifacts/1-4a-durable-substrate-preflight/RUNBOOK.md`; no alternative queue, detached worker, `waitUntil`, post-response promise, or in-memory job path is approved.

### OD-12: Onlook-native prospect project seeding

**Needed before:** Story 4.1 and project-generation implementation.

Pin the Onlook commit and identify the exact authorized project/source/AI/preview entry points that can turn verified Lead facts into a prospect-specific editable first draft. Prove with a fixture that the result contains the exact business name and selected available facts, omits unknown facts, and is not blank or generic. Do not introduce a second project or editor authority if this path is missing.

### OD-13: Onlook-native module map and protected-core inventory

**Status:** customer modules mapped; operator authority and target-native placement approved by Andrew on 2026-07-29. Protected baseline edits remain separately gated by exact per-file Core Change Requests.

Inventory the pinned target's workspace packages, public exports, route-local features, schemas, managers/services, provider abstractions, tests, and instructions. Assign every proposed Jagwar capability to an existing pattern and a focused new-file/package/feature owner. Record every anticipated edit to a file present in the Onlook baseline separately. New Jagwar-owned files follow the approved map; original files require `CORE-CHANGE-REQUEST-TEMPLATE.md` and Andrew's explicit per-file confirmation before editing.

This decision must also identify protected AI/editor zones and the existing public seam, if any, for additive `JagwarBusinessContextV1` input.

The approved operator design is recorded in `../jagwar-implementation-readiness-2026-07-28/OD-13-OPERATOR-AUTHORITY.md`. Jagwar uses a guarded `/operator` route inside the existing web application, with Andrew as the only initial operator. Authorization is a fresh server-side membership keyed by authenticated Supabase `user.id`; email, browser state, customer/project roles, subscriptions, metadata claims, and `adminProcedure` are not operator authority. Policy changes are transactional and retain append-only audit history. The decision maps runtime/UI/service/persistence owners, protected paths, regression boundaries, bootstrap/revocation, and concurrency behavior without recreating `apps/admin` or a parallel authority.

### OD-14: Evidence-based Jagwar commercial model

**Needed before:** Jagwar checkout products, prices, plans, allowances, top-ups/overages, trial gates, or customer-facing entitlement enforcement.

After the end-to-end workflow runs in a representative environment, reconcile actual discovery, qualification, AI/generation, sandbox/VM, hosting/deployment, storage/egress, outreach, retry/failure, concurrency, and support costs. Model target margin and abuse exposure, then obtain Andrew's approval for the commercial policy. Old Jagwar prices and assumptions do not satisfy this decision.

### OD-15: Retire the inaccessible private admin submodule from Jagwar

**Status:** resolved by Andrew-approved target-fork decision and CCR-019 through CCR-022 on 2026-07-28.

**Decision:** Jagwar does not ship or claim parity with the unavailable private upstream `apps/admin` application. The target removes its `.gitmodules` registration, gitlink, root `dev:admin` script, and generated lock records. The accessible Onlook web/editor application remains the Jagwar foundation.

Pinned Bun 1.3.1 now completes a clean frozen install without the private admin workspace, and the existing web typecheck passes. The original pinned gitlink and inaccessible URL remain migration/upstream provenance only; they are not an active target dependency.

Operator controls remain governed by OD-13. A future target-native Jagwar operator surface must define explicit roles and least-privileged authorization, reuse the same Supabase identity, project access, billing, durable-operation, policy, credential, and audit authorities, and receive every required protected-file approval. It must not recreate an assumed private admin implementation or introduce a parallel authority.

## 3. Non-blocking deferred decisions

- Replace Freestyle with Cloudflare/static-first hosting.
- Replace CodeSandbox with Daytona or another sandbox provider.
- Migrate custom domains.
- Add iMessage connector.
- Build cold email and deliverability infrastructure.
- Add campaign sequencing, replies, open/click tracking.
- Add advanced team/agency features.
- Define advanced lead scoring beyond website need.

## 4. Risk register

| Risk | Severity | Evidence/impact | Mitigation |
| --- | --- | --- | --- |
| Architecture contamination from donor Telio | High | Copying repositories/routes/migrations recreates the foundation being abandoned. | Require target-side design and per-module classification before adaptation. |
| Onlook structural drift | Critical | Generic Jagwar folders, cross-package internals, or donor layering would make the fork hard to navigate and upgrade. | OD-13 module map; focused packages, public entry points, feature colocation, and target baseline review. |
| Unapproved Onlook core modification | Critical | Small export/prompt/registry/config edits can alter sensitive AI/editor behavior or complicate upstream sync. | Per-file Core Change Request, exact owner confirmation, minimal diff, baseline regression, rollback. |
| Existing Onlook capability regression/deprecation | Critical | Jagwar could appear to work while disabling a mode, route, provider, billing flow, or editor behavior. | Explicit no-deprecation acceptance and baseline capability regression matrix for every story. |
| Visual drift from Onlook | High | New dashboard could again look bolted on. | Reuse target primitives/tokens; real-browser comparison and final UI gate. |
| Duplicate provider cost or sends | Critical | Retries, double clicks, callbacks, and job recovery can duplicate external effects. | End-to-end idempotency identities, durable state, provider reconciliation, acceptance tests. |
| Cross-workspace data leak | Critical | Leads/contact info, secrets, sends, and billing are sensitive. | Server-derived workspace authority, target RLS/authorization integration tests, attack-path E2E. |
| Unlawful or provider-noncompliant outreach | Critical | Cold WhatsApp and scraped contact data carry policy/legal risk. | Legal review, connector-driven gates, opt-in/suppression evidence, approved templates, restricted launch. |
| Provider dependency/price changes | High | Discovery/BSP behavior may change. | Capability contracts, operator health, metering, fallback only when semantics are explicit. |
| Qualification false claims | High | Incorrect “weak site” judgments harm credibility. | Versioned evidence, conservative unknown state, inspectable reasons, recheck/staleness. |
| Project/publication mismatch | High | Prospect may receive wrong/private/stale URL. | Same-workspace Project Link and immutable Publication Reference per send. |
| Historical data migration guesses | High | Old Site/user/project identifiers may not map cleanly. | Explicit maps, unresolved state, dry runs, no destructive cutover. |
| Billing drift | Critical | Stale local plan/credits can grant or deny service incorrectly. | Reconcile billing provider truth; idempotent webhook and opening balance process. |
| Premature pricing | High | Plans chosen before target VM/hosting/provider/concurrency costs are known can destroy margin or misprice value. | Capture non-enforcing cost telemetry early; defer OD-14 and customer gates until representative evidence exists. |
| Retired inaccessible upstream admin | Low, accepted fork divergence | Jagwar intentionally does not ship or claim parity with the unavailable private upstream application; upstream merges may reintroduce its gitlink or script. | Keep CCR-019–022 and the frozen-install regression in upgrade reviews. Build any future operator surface under OD-13 using existing authorities. |
| Third-party image rights | High | Place photos may not be reusable on generated sites. | Discovery-only display; rights-bearing asset workflow for publication. |
| Overbuilding infrastructure too early | Medium | Hosting/sandbox rewrite delays core loop. | Preserve Onlook providers until business workflow parity; collect telemetry for later epic. |

## 5. Unsupported claims and features

Until separately proven, do not claim:

- that a phone is WhatsApp-enabled solely because it is mobile;
- that a business consented because its number is public;
- that a website is insecure, abandoned, illegal, or losing revenue based on a weak-site heuristic;
- that provider map/place photos can be published;
- that message delivery occurred when the provider only accepted the request;
- that Onlook/Freestyle/CodeSandbox costs or limits will remain unchanged;
- that legacy Telio Stripe prices, provider keys, or production deployments remain valid.

## 6. Decision-record template

For each open decision, record:

- decision ID and title;
- date and owner;
- context and evidence;
- options considered;
- decision and rationale;
- affected FRs/stories/contracts;
- migration/compatibility impact;
- security/privacy/compliance impact;
- verification and revisit trigger.
