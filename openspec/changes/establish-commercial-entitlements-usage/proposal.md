# Proposal: Establish Commercial Entitlements and Usage

## Change

`establish-commercial-entitlements-usage`

## Status and authority

Planning-only native proposal for the Wave 2 commercial foundation. The OpenSpec umbrella `reconfirm-jagwar-product-contract` is canonical product and planning authority; the current repository is implementation authority. The completed `establish-workspace-authority` planning defines the workspace, actor, authorization, isolation, concurrency, audit, Supabase, and RLS contracts this capability must consume. Its runtime is not implemented, so it remains a fail-closed production prerequisite. The completed `establish-lead-pipeline` planning owns stable lead, import, project-relationship, and event identities and transitions; it does not own subscriptions, balances, billing, reservations, or usage.

The authorized sequence for this change is proposal → specification → design → tasks only. This proposal creates no runtime implementation, tests, schema changes, migrations, architecture manifests, Core Change Requests (CCRs), generated output, lockfile changes, commits, provider activation, or apply/verify/sync/archive artifacts. It does not authorize edits to inherited Onlook files, Story 1.3b, BMAD/Telio artifacts, or unrelated dirty work.

## Intent

Establish one authoritative workspace-scoped commercial contract before any Jagwar-funded provider operation or managed-hosting purchase can launch. Today the canonical product plan defines Starter, Pro, and Scale, three shared balances, bundled top-ups, Stripe extension, and per-site hosting add-ons, but the repository has no approved runtime authority for deciding whether a workspace is paid, reserving scarce units under concurrency, explaining a debit, or recovering safely from duplicate and ambiguous provider outcomes.

Without this foundation, discovery, website generation, SMS, publishing, and hosting could each interpret Stripe state differently, overspend the last units, debit twice on retries, invoke a provider before durable accounting, lose top-ups during cancellation, or expose another workspace's billing state. The operational cost would include unreconciled provider spend, customer disputes, support-only corrections, and unsafe launch defaults.

The intended product outcome is that an authorized workspace member can use funded operations only when the workspace has an active paid entitlement and enough applicable shared balance, while an Owner can administer billing, plans, bundled top-ups, and site-specific hosting add-ons. Every credit, reservation, final debit, release, reset, lock, unlock, denial, and reconciliation result must be explainable from durable commercial evidence without treating Stripe/provider state, application entitlement, or ledger state as interchangeable.

## Scope

### 1. Authoritative workspace subscription and entitlement state

- Define one workspace-scoped application subscription authority for the paid Starter, Pro, and Scale plans, derived from authenticated and idempotently processed payment-provider evidence rather than browser state or a client claim.
- Keep plan prices, price identifiers, monthly lead/AI/SMS quantities, top-up price and quantities, AI cost-to-credit conversion, and recurring per-site hosting price configurable and launch-blocking. No value, zero, trial, or fallback may be fabricated when policy is missing, invalid, ambiguous, or unapproved.
- Distinguish at least three truths: Stripe/payment-provider state, Jagwar application entitlement state, and commercial ledger/reservation state. Provider state is external evidence; application entitlement determines admission; the ledger explains units and money-linked commercial effects.
- Preserve and extend inherited Stripe checkout, subscription, payment, and webhook behavior additively rather than replacing it. Later design must inventory the exact inherited seams and callers before selecting any extension.
- Block provider-funded discovery, Jagwar AI generation, SMS sending, managed-hosting activation, and provider-funded editing or publishing immediately when paid entitlement is inactive.
- Continue to allow pre-payment workspace, membership, and integration configuration where the owning capability's policy permits it. Inactivity does not itself erase workspace configuration or membership.
- Keep public-site grace and suspension behavior with the hosting lifecycle owner. Commercial supplies authoritative subscription and site-add-on state; it does not redefine the 14-day public grace, neutral unavailable page, 90-day retention, notices, domain behavior, or deletion workflow.

### 2. Starter, Pro, and Scale paid entitlements

- Support exactly the canonical paid plan families Starter, Pro, and Scale for this V1 contract, billed monthly with no free trial.
- Treat a configured billing boundary as the only monthly allowance reset boundary. There are no daily resets or Jagwar-imposed daily caps; independent provider limits remain enforceable by provider owners.
- Model plan activation, renewal, scheduled or immediate provider-reported changes, cancellation/inactivity, failed or disputed payment outcomes, and reactivation as explicit, auditable application transitions.
- A provider webhook or checkout success page alone must not grant usable units unless the authoritative commercial transition and required ledger evidence commit idempotently.
- Exact plan-change proration, allowance treatment, and effective-time rules are unresolved commercial decisions and must remain explicit launch blockers rather than inferred Stripe defaults.

### 3. Three separate shared balances

- Maintain distinct workspace-scoped balances for leads, Jagwar AI credits, and SMS units. They must never merge, substitute for one another, or be inferred from one total.
- Each balance has a monthly allowance component and a non-expiring top-up component shared by authorized workspace members.
- Consume the applicable monthly allowance first and top-up units second for every finalized debit.
- Reset only the monthly component at the configured billing boundary. A reset must not expire, recreate, or alter top-up units.
- Preserve non-negative balances under atomic concurrency. When operations compete for the final units, at most the affordable reservations may succeed; losers fail before provider invocation and without partial debit.
- Do not add artificial daily caps. Provider throughput, quota, fraud, compliance, or account limits remain separate provider-owner gates and do not alter ledger truth.

### 4. Atomic bundled top-ups

- A top-up is one configured purchase that grants fixed quantities to all three top-up balances as one atomic commercial event.
- The top-up price and all three quantities are mandatory approved configuration. Missing any component makes purchase/admission unavailable; partial bundles and fabricated values are prohibited.
- A successful payment event must either credit all three configured quantities once or credit none. Duplicate checkout completion, payment, and webhook events must resolve to the original result without repeated credit.
- Top-up units never expire. When the base subscription becomes inactive, all preserved top-up units become locked and unusable rather than deleted, refunded, reset, or consumed.
- Reactivation unlocks the preserved top-up units without recreating them or changing their historical credit identities.
- Refund, dispute, chargeback, and administrative correction behavior must use explicit compensating or superseding ledger evidence; no silent balance rewrite is allowed. Exact negative-adjustment and insufficient-remaining-balance policy is an unresolved launch decision.

### 5. Owner administration and Member consumption

- Current workspace Owners alone may administer checkout/billing, plan changes, bundled top-up purchases, payment methods or billing portal access, and managed-hosting add-on activation/cancellation.
- Current authorized Owners and Members may consume funded discovery, AI, SMS, editing, publishing, or other ordinary operations when the owning capability's gates and the applicable commercial reservation pass.
- Commercial consumes server-derived workspace authority; it does not derive workspace membership, role, or ownership itself. Client-selected workspace, submitted role, stale JWT claims, route visibility, Stripe customer identifiers, and service-role access are not authority.
- A removed member or changed authority must be denied on the next check. Long-running operations must revalidate authority at the workspace-defined irreversible boundary before commercial admission or provider dispatch as applicable.
- Human actions must retain the acting member. Webhook, scheduler, expiry, reset, and reconciliation work must use a narrow named system actor and must never impersonate an Owner.

### 6. Site-specific recurring managed-hosting add-ons

- Model managed hosting as a recurring add-on linked to one eligible, workspace-owned site and distinct from the base subscription.
- Enforce exactly one active managed-hosting add-on per eligible site. Concurrent checkout, webhook, retry, or activation attempts must not produce duplicate active add-ons.
- Require current Owner authority, active paid base entitlement, confirmed site eligibility/ownership, and an approved configured hosting price before activation.
- Preserve stable correlation among workspace, site, application add-on, payment-provider subscription item or equivalent provider object, lifecycle episode, and operation/event identities.
- Commercial owns purchase and entitlement state for the add-on. Hosting owns site/domain operation, grace, suspension, notices, retention, deletion, and reactivation effects. Commercial must not infer hosting success from payment state alone.
- Exact cancellation timing, proration, provider-item reuse, and reactivation rules for the add-on remain explicit commercial/hosting decisions for later specification.

### 7. Reservation, finalization, release, and expiry

- Publish a narrow commercial operation contract that reserves the applicable balance before a provider-funded operation. A reservation must include workspace, balance kind, maximum configured units, operation identity, actor evidence, authority/policy evidence, and bounded expiry/reconciliation state.
- Reservation creation and ledger persistence must be atomic. If either fails, the operation must fail closed with no provider call.
- A known successful provider-owned outcome finalizes the reservation exactly once for the authoritative final quantity. A definite pre-acceptance failure releases it exactly once.
- Timeout, process crash, uncertain transaction result, or unknown provider acceptance must remain pending/reconcilable. The system must not release units merely because the caller timed out, and must not report success without authoritative evidence.
- Reservation expiry initiates reconciliation; it is not proof of provider failure. Expiry may release only when the owning capability can prove no chargeable external effect occurred under the same stable identity.
- Finalization for less than a reservation may release the remainder through explicit ledger evidence. Finalization above the reserved maximum is denied unless a separately approved bounded expansion protocol rechecks and atomically secures units before the effect.
- Duplicate, retried, reordered, and delayed commands/events must converge on one durable semantic result. Reuse of an idempotency key with materially different workspace, balance, quantity, actor, or source semantics must conflict without mutation.

### 8. Immutable or superseding commercial ledger

- Commercial owns authoritative subscription transitions, allowance grants/resets, top-up credits, locks/unlocks, reservations, final debits, releases, hosting-add-on transitions, provider-event processing, adjustments, reversals, and reconciliation outcomes.
- Evidence must be append-only or explicitly superseding. Current balance and entitlement may be materialized projections, but they must reconcile to retained ledger and transition evidence.
- Every entry must retain workspace, commercial account/balance kind, operation and provider-event identities, human or named system actor, quantity and source bucket where applicable, policy/configuration version, timestamp, result, and supersession/reversal linkage.
- Audit and ledger metadata must be bounded and must exclude raw provider secrets, webhook signatures, session/JWT tokens, unrestricted Stripe/provider payloads, message bodies, prompts, credentials, and unnecessary personal data.
- Corrections, refunds, disputes, and support remediation use named compensating/superseding entries. Ordinary application roles must not rewrite or hard-delete financial or usage history.

### 9. Payment, webhook, and reconciliation idempotency

- Authenticate provider webhooks before applying commercial effects and deduplicate them by stable provider account/environment plus provider event/object identity and semantic operation identity.
- Checkout/session return routes are presentation and recovery hints, not payment authority. Only verified provider evidence processed through the commercial transition grants credit or entitlement.
- Handle duplicate delivery, retries, reordering, delayed events, partial provider outages, and locally unknown commit outcomes without duplicate credits, debits, subscriptions, or add-ons.
- Keep a durable pending/reconciliation state for provider and application disagreement. Reconciliation must compare provider state, application entitlement projection, ledger/reservations, and owned operation evidence without silently choosing one as universally authoritative.
- Reconciliation actions must be idempotent, actor-attributed, observable, and represented by new evidence. Manual repair requires narrow authorization and must never be an unlogged row edit.
- No provider-funded consumer may invoke its provider when reservation or required ledger persistence fails. A provider call that may already have happened remains unknown/pending until the owning capability proves its outcome.

### 10. Supabase, RLS, isolation, and safe auditing

- Every commercial record and query must carry authoritative workspace ownership. Direct, list, aggregate, indirect site/resource, and mixed-batch access must be constrained to the current workspace.
- Supabase Auth establishes the subject; workspace authority establishes current role and resource access; commercial establishes entitlement and balance admission; ownership-aware RLS supplies defense in depth for exposed schemas.
- `TO authenticated` alone, client claims, `user_metadata`, stale JWT `app_metadata`, and service-role capability must not authorize billing data or balance mutation.
- Prefer server-mediated commercial mutations. Any future direct Data API exposure, view, function, trigger, or privileged code requires explicit grant/RLS/security review. `SECURITY DEFINER` must not be introduced merely to bypass permission errors.
- Existing and nonexistent cross-workspace identifiers must yield sanitized, non-enumerating denials. Responses and logs must not disclose another workspace's subscription, balances, payment customer, add-ons, provider objects, or reconciliation state.
- Removed members and changed Owner authority must take effect from current application state. Privileged provider/webhook/reconciliation paths remain server-only, narrowly named, workspace-bound, and auditable.

## Public contracts for later capability specifications, design, and tasks

Commercial planning must later define intentional persistence-neutral contracts for:

- **DataForSEO discovery/import:** reserve and finalize lead units for the unique businesses actually displayed in each fresh run; consume stable run/result/import identities; do not charge snapshot reopen or a second lead import; leave provider execution, immutable snapshots, eligibility, and lead identity to discovery and lead owners.
- **Lead pipeline:** consume stable workspace lead/import/project/event identities for deduplication and reconciliation without owning business identity, lead creation, stages, outcomes, or transitions.
- **Website and Jagwar AI:** reserve/finalize Jagwar AI credits around the existing lead-backed website/AI operation; respect CodeSandbox BYOK admission where entitlement applies; leave prompts, presets, website success, project relationships, provider calls, and inherited CREATE behavior to their owners.
- **CodeSandbox BYOK:** expose only the commercial admission needed by an eligible workflow. Commercial does not own credentials, validation, provider compute, the fixed template, project access, or fallback behavior.
- **Telnyx SMS:** reserve/finalize SMS units around the SMS owner's authenticated accepted-send semantics and reconciliation; commercial does not interpret Telnyx status, consent, opt-out, templates, delivery, replies, or provider payloads.
- **Inbox replies:** support funded outbound reply admission through the SMS owner while Inbox retains conversations, messages, unread state, and reply UX.
- **Publishing and hosting:** provide active base entitlement and exactly-one site-add-on state plus correlated commercial events; hosting owns site/domain/grace/suspension/retention behavior and inherited publishing remains unchanged.
- **Owner analytics:** expose current balance/readiness projections and stable committed commercial event identities; analytics owns derived projections, checkpoints, staleness, and presentation and must not rewrite ledger truth.

Consumers must use public contracts rather than query commercial tables, mutate balances, interpret Stripe state independently, or import commercial internals. Commercial must not import sibling capability internals.

## Behavior while dependencies are unimplemented

Workspace authority is a hard production prerequisite. Until its approved runtime contracts, persistence, current actor/resource decisions, revalidation, system actors, audit, Supabase, and RLS evidence exist:

- commercial work remains planning-only and exposes no production subscription, balance, top-up, reservation, or add-on API;
- no temporary project-role, user-owned, client-selected, JWT-derived, Stripe-customer-derived, or service-role-only authority substitute is permitted; and
- provider-funded operations and commercial administration remain unavailable/fail closed.

Lead-pipeline runtime is required before commercial coordination that depends on lead/import/project/event identities can launch. Planning may define ports and test fixtures, but it must not fabricate those identities or take over lead ownership.

## Scope boundaries and non-goals

This change does not:

- implement subscription, balance, payment, Stripe, schema, RLS, service, router, worker, UI, migration, test, manifest, or CCR artifacts;
- set or guess plan prices, plan quantities, top-up price/quantities, AI conversion, hosting price, proration, refund, dispute, or allowance-adjustment policy;
- create lead identity, call DataForSEO, execute AI/website generation, manage CodeSandbox credentials, interpret Telnyx/SMS behavior, own Inbox data, run hosting lifecycle, or derive analytics projections;
- process the operator-to-client website sale;
- introduce a free trial, free provider-funded tier, daily cap, merged balance, expiring top-up, negative balance, partial bundled top-up, or Jagwar-funded CodeSandbox fallback;
- replace inherited Stripe checkout/subscription behavior or touch/wrap the editor, CREATE flow, fixed CodeSandbox template, publishing behavior, project lifecycle, source export, or customer-controlled Git;
- create a generic Jagwar/shared package, deep-import sibling internals, or refactor inherited Onlook architecture for convenience;
- edit generated migrations, run `db:gen`, edit `bun.lock`, touch `.gitignore`/`.atl`, clean unrelated dirty work, or implement Story 1.3b; or
- authorize apply, verify, sync, archive, provider activation, or commits.

## Affected areas forecast

Future separately approved work is expected to inspect and potentially extend only the narrowest additive seams for:

- Next-server commercial-entitlements orchestration and reconciliation workers;
- capability-owned subscription, balance, ledger, reservation, provider-event, and hosting-add-on persistence;
- focused public commercial contracts if demonstrated consumers and architecture policy permit them;
- thin validated billing/top-up/add-on transport and Owner-facing inherited billing/settings composition;
- inherited Stripe subscription, checkout, payment, webhook, and billing-portal adapters;
- Supabase RLS, grants, indexes, database tests, and maintainer-governed migrations; and
- consumer-facing contract fixtures for discovery, leads, website/AI, BYOK, SMS, Inbox, hosting, and analytics.

These are planning targets, not approved paths. Design must inventory current callers, public entries, package policy, baseline classifications, and existing unrelated work before selecting an exact tree.

## Rollout, reconciliation, observability, and failure behavior

Future design must roll out in dependency order: pure contracts and configured policy admission; additive persistence and RLS; provider-event/subscription projection; balance and ledger primitives; top-ups; reservation/finalization/release; reconciliation; hosting add-ons; then thin transport and separately approved consumers. Provider-funded entry points stay disabled until workspace authority, configuration, provider credentials/accounts, webhook authentication, and capability-specific evidence contracts are ready.

Required observable states include subscription/provider disagreement, inactive-operation denials, policy unavailable, reservation admitted/denied/pending/expired, last-unit competition, finalization/release replay, aged unknown outcomes, webhook authentication failure/replay/reordering, ledger projection mismatch, reset duplication, locked top-ups, atomic bundle failure, add-on uniqueness conflict, and reconciliation backlog/outcome. Metrics and logs use bounded opaque IDs and result codes, never secrets or unrestricted provider payloads.

Failure must be explicit and fail closed:

- missing/invalid commercial policy: unavailable before checkout, reservation, reset, or provider invocation;
- inactive entitlement or locked top-ups: denied with no reservation, debit, or provider call;
- insufficient or concurrently exhausted units: denied atomically with no negative balance or provider call;
- ledger/reservation persistence failure: no provider invocation;
- provider timeout or unknown acceptance: pending and reconcilable, not released or finalized by assumption;
- duplicate/reordered webhook or operation: replay/converge without duplicate effect;
- semantic idempotency-key mismatch: conflict without mutation;
- workspace authority or RLS uncertainty: unavailable/denied with no privileged fallback;
- add-on/site/provider disagreement: preserve one application active-add-on invariant and enter reconciliation rather than duplicate activation; and
- known committed ledger effect with downstream reporting failure: return/recover the committed result by operation identity rather than debit again.

## Risks and mitigations

- **Overspend and final-unit races:** Use atomic reservation/ledger persistence, non-negative constraints or equivalent transactional enforcement, stable operation identity, and concurrency tests before provider dispatch.
- **Stripe state mistaken for entitlement or balance:** Keep provider evidence, application entitlement projection, and ledger truth distinct and reconcile them explicitly.
- **Duplicate payment or webhook effects:** Authenticate events and enforce provider-event plus semantic-operation idempotency for subscriptions, top-ups, resets, and add-ons.
- **Unknown external outcomes released too early:** Keep timeout and expiry pending until the owning capability proves the chargeable result.
- **Customer value loss during inactivity:** Preserve non-expiring top-ups, lock them while inactive, and unlock the same units on reactivation.
- **Partial bundled purchase:** Credit all three configured top-up quantities atomically or none; fail closed if any configuration or persistence component is unavailable.
- **Cross-workspace billing disclosure or mutation:** Require current server authority, exact workspace/site ownership, sanitized denials, server checks, and ownership-aware RLS.
- **Commercial capability overreach:** Own subscriptions, balances, add-ons, ledger, reservations, and commercial reconciliation only; consume public identities/evidence from provider and product owners.
- **Fabricated launch economics:** Treat every unapproved price, quantity, conversion, and proration/refund rule as a blocker, not a default.
- **Inherited Onlook regression:** Extend Stripe/settings/publishing seams only after caller inventory and exact protected approvals; do not touch editor, CREATE, template, project lifecycle, export, or Git.
- **Governance status misstatement:** The deferred protected `.gitignore` governance error for the existing `.atl/` rule remains non-blocking for planning but prevents any architecture-pass claim. Existing `packages` and `packages/business-policy` size findings remain warnings only and do not justify cleanup.

## Rollback

This proposal changes no runtime or data. Planning rollback is to supersede or remove this artifact through an explicit OpenSpec revision that identifies every changed commercial rule and affected downstream dependency. It must not silently revert to BMAD/Telio assumptions or treat historical Stripe behavior as the full product contract.

Future runtime rollback must stop new checkout/admission/provider dispatch while preserving subscription transitions, top-up credits, allowance periods, reservations, debits, releases, reversals, add-on identities, provider events, reconciliation state, and audit/legal evidence. Pending unknown outcomes remain reconcilable. Rollback must not erase ledger history, unlock inactive funds incorrectly, restore removed-member access, create duplicate provider objects, silently change balances, or reinterpret a committed effect as absent. Corrections use explicit compensating/superseding entries. Protected-path rollback requires its own exact candidate resulting hash and approval; destructive database rollback requires separately approved retention and maintainer workflows.

## Future delivery and review forecast

Future implementation is forecast **High risk** against the 400 changed-line review budget and should use dependency-ordered chained PRs. A later design/tasks phase must refine a set of cohesive **250–400 changed-line Strict-TDD slices**, likely separating: pure commercial contracts/policy gates; subscription and balance schema; maintainer migration/RLS/database tests; payment/provider-event projection; ledger and allowance reset; bundled top-ups; reservation/finalize/release/expiry; reconciliation and unknown outcomes; hosting add-ons; and thin transport/protected composition.

Every future slice must follow **RED → GREEN → TRIANGULATE → REFACTOR**, remain independently reviewable and reversible, and avoid splitting one transactional invariant merely to meet a size target. Auto-forecast recommends a chained PR strategy under 400 changed lines per slice; exact chain shape and count belong to the later tasks phase and owner approval.

Before each governed slice edit, one reviewed `architecture/slices/<slice>.json` must enumerate the exact paths, capability, owning runtime, role, and correct baseline classification. Before each protected inherited file edit, a new per-file CCR must name that exact path and the exact candidate resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the manifest. Truthful hashes exist only after exact candidate patches exist; no wildcard, intent-only approval, prior CCR, or planning artifact authorizes an edit. Generated migrations are maintainer-owned. Agents must not run `db:gen`, edit generated output, or edit `bun.lock`.

## Explicit launch blockers and unresolved commercial decisions

The following must be approved and versioned before the applicable production admission:

1. Starter, Pro, and Scale Stripe price/product identities, monthly prices, and monthly lead/AI/SMS quantities.
2. Bundled top-up price and its fixed lead/AI/SMS quantities.
3. AI provider-cost-to-Jagwar-credit conversion and rounding/final-unit rules.
4. Recurring per-site managed-hosting price and provider item model.
5. Plan upgrade/downgrade effective time, proration, allowance grant/reset/carry treatment, and cancellation/reactivation semantics.
6. Refund, dispute, chargeback, reversal, and insufficient-remaining-balance policy for consumed top-ups or allowances.
7. Reservation expiry windows, maximum reservation duration, final-quantity adjustment rules, and reconciliation ownership/SLOs for each consumer.
8. Stripe account, webhook, price catalog, tax/invoicing, customer mapping, provider credentials, worker/scheduler, monitoring, support, security, privacy, billing-record retention, and legal/compliance readiness.
9. Exact Data API exposure, privileged operations, audit visibility/retention, and manual repair authority.

Until approved, the relevant operation remains unavailable and no default may be inferred from historical code, Stripe configuration, BMAD/Telio material, or provider behavior.

## Success criteria

This proposal succeeds when later specification/design/tasks can establish that:

- one authoritative workspace subscription state controls Starter/Pro/Scale paid admission without fabricated values;
- inactive subscription immediately blocks provider-funded operations while allowed pre-payment configuration remains available and hosting lifecycle retains ownership of public grace;
- lead, Jagwar AI, and SMS balances remain distinct, shared, monthly-first, top-up-second, billing-boundary-reset only, uncapped daily by Jagwar, and never negative;
- bundled top-ups atomically credit all three configured top-up balances once, never expire, lock during inactivity, and unlock unchanged on reactivation;
- Owner-only administration and authorized Member consumption use fresh server-derived human/system actor evidence;
- exactly one active recurring managed-hosting add-on exists per eligible site;
- payments, webhooks, operations, reservations, and reconciliation are idempotent under retries, duplicates, reordering, timeouts, and unknown outcomes;
- no funded provider call occurs unless reservation and required ledger evidence persist successfully;
- immutable or superseding ledger evidence explains every grant, reset, lock, unlock, reservation, debit, release, adjustment, add-on transition, and denial without secrets;
- Stripe/provider state, Jagwar entitlement, ledger state, and capability-owned outcome evidence remain distinct and reconcilable;
- workspace isolation, sanitized denials, removed-member behavior, Supabase/RLS defense in depth, and narrow privileged access are mandatory;
- discovery, leads, website/AI, BYOK, SMS, Inbox, hosting, and analytics receive narrow public contracts without commercial taking over their domains;
- inherited Stripe and Onlook behavior is extended minimally while editor, CREATE, fixed template, publishing behavior, project lifecycle, export, and Git remain untouched; and
- future delivery remains blocked behind completed native planning, dependency readiness, explicit commercial decisions, 250–400-line Strict-TDD slices, exact reviewed manifests, truthful per-file hash-bound CCRs, and maintainer-owned generated migrations.

## Proposal question round

Execution is auto, so this delegated phase cannot pause for an interactive round. These product questions are recorded to improve the later PRD/specification by surfacing business rules, impact, edge cases, and tradeoffs. The owner may accept the assumptions, correct the framing, skip them, or request a second round before or during `sdd-spec`.

1. **Plan changes and monthly allowances:** When an Owner upgrades or downgrades mid-cycle, when does the new plan become effective and how are current-period allowances treated? **Provisional assumption:** no rule is inferred from Stripe; the current approved entitlement remains in force until a versioned commercial transition specifies effective time, proration, and allowance adjustment. The operation is unavailable if that policy is absent.
2. **Refunds, disputes, and consumed top-ups:** If a bundled top-up is refunded or charged back after some units were consumed, may the ledger create debt/negative availability, lock future usage, or require manual resolution? **Provisional assumption:** historical balances never become silently negative or rewritten; an explicit compensating event and restricted reconciliation state block unsafe new spending until an approved policy resolves any shortfall.
3. **Reservation expiry and unknown outcomes:** Who owns proof that an expired discovery/AI/SMS operation did not incur provider cost, and how long may units remain reserved? **Provisional assumption:** the provider-owning capability supplies authoritative outcome evidence; expiry only queues reconciliation and never releases by elapsed time alone. Exact windows and operational SLOs are unresolved launch blockers.
4. **Hosting add-on lifecycle:** Should cancellation/reactivation reuse the same Stripe subscription item and application add-on identity, and when does billing stop relative to hosting grace? **Provisional assumption:** commercial state and hosting lifecycle episode remain correlated but distinct; public grace does not imply an active paid add-on. Exact provider-item reuse, proration, and cancellation timing require joint commercial/hosting approval.
5. **Manual commercial repair and audit access:** Which roles may inspect reconciliation details or apply compensating credits/debits, and what evidence must Owners see? **Provisional assumption:** Owners receive only a sanitized workspace-scoped billing/usage projection; narrowly authorized support/security/finance system operations perform explicit audited repairs. Exact support roles, approval thresholds, retention, and Owner-visible detail remain unresolved compliance/operations decisions.
