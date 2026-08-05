# Design: Establish Commercial Entitlements and Usage

## Status, authority, and planning boundary

This is the native OpenSpec design for `establish-commercial-entitlements-usage`. It refines this change's proposal and the 24-requirement/99-scenario commercial-entitlements specification under the canonical `reconfirm-jagwar-product-contract` umbrella. OpenSpec is planning authority; the current repository is implementation authority.

This design creates no tasks and authorizes no runtime implementation, tests, schema or migration changes, architecture slice manifests, Core Change Requests (CCRs), generated output, `bun.lock` edit, provider activation, commit, apply/verify/sync/archive action, inherited Onlook edit, editor/CREATE/publishing/project/export/Git change, or cleanup of unrelated dirty work. All paths below are tentative discovery targets until an exact candidate patch and exactly one reviewed slice manifest exist for the governed slice.

Workspace-authority planning is complete but its runtime is absent. Production construction of every commercial read, administration command, reservation, dispatch authorization, webhook effect, top-up credit, reset, add-on operation, and reconciliation action therefore remains hard fail-closed until the approved workspace-authority runtime and security evidence exist. Lead-pipeline runtime is also required before a commercial coordination path relies on lead/import/project/event identities.

No architecture-pass claim is made. The known deferred protected `.gitignore` governance error for existing `.atl/` remains non-blocking for planning; `packages` and `packages/business-policy` size findings remain warnings only.

## Observed repository behavior

Everything in this section is observed implementation evidence, not proposed Jagwar behavior.

### Stripe and subscription seams

- `packages/stripe/src/index.ts` publicly exports `client.ts`, `constants.ts`, `functions.ts`, and `types.ts` as `@onlook/stripe`.
- `packages/stripe/src/client.ts` creates Stripe with `STRIPE_SECRET_KEY` and pins API version `2025-08-27.basil`. `apps/web/client/src/env.ts` types `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as optional server variables.
- `packages/stripe/src/functions.ts` owns current Stripe API calls: `createCustomer`, subscription-mode `createCheckoutSession`, `createBillingPortalSession`, immediate `updateSubscription`, scheduled `updateSubscriptionNextPeriod`, `releaseSubscriptionSchedule`, and `getSubscriptionSchedule`.
- Current checkout metadata carries `user_id`, and current Stripe customer binding is stored on `packages/db/src/schema/user/user.ts`. Current provider helpers are user/subscription-oriented, not workspace/commercial-account-oriented.
- `packages/stripe/src/types.ts` exposes only `FREE`/`PRO` products and `ACTIVE`/`CANCELED` subscription status. `packages/stripe/src/constants.ts` contains eleven inherited Pro message tiers and inherited concrete costs/limits plus free-plan limits. Those inherited values are not Starter/Pro/Scale commercial policy and MUST NOT be reused as Jagwar defaults.
- `apps/web/client/src/server/api/routers/subscription/subscription.ts` is a large inherited tRPC boundary that directly performs database queries and Stripe calls. It exposes legacy-subscription lookup, active user subscription read, price lookup, checkout, billing portal, immediate upgrade, scheduled downgrade, and schedule release. Ownership is current user ID, not authoritative workspace Owner authority.
- `apps/web/client/src/components/ui/pricing-modal/pro-card.tsx`, `free-card.tsx`, `use-subscription.tsx`, `apps/web/client/src/components/ui/settings-modal/subscription-tab.tsx`, auth redirect, avatar plans, custom-domain UI, and project breadcrumb/publish UI call the inherited subscription router. These are protected presentation callers; this design does not reinterpret or edit them.
- `apps/web/client/src/app/callback/stripe/success/page.tsx` and `cancel/page.tsx` are presentation-only messages. The success page currently says the subscription is activated, but it performs no authoritative commercial transition. Future Jagwar UI must treat a return as pending/recovery evidence only; changing these protected pages is not selected by this design.
- `apps/web/client/src/utils/subscription.ts` checks user-scoped inherited active or legacy subscription and deep-imports `@onlook/db/src/client`. It is inherited evidence, not a contract to copy or Jagwar workspace authority.

### Webhook seams

- `apps/web/client/src/app/webhook/stripe/route.ts` reads the raw body, verifies `stripe-signature` with `stripe.webhooks.constructEvent`, and dispatches `customer.subscription.created`, `.updated`, and `.deleted`. Missing secret or failed verification returns 400. Other events return 200 without commercial effects.
- `apps/web/client/src/app/webhook/stripe/subscription/create.ts` maps the first subscription item to a price and user, upserts a user subscription, and inserts one rate-limit row in a transaction. The subscription-item upsert reduces one duplicate race, but no durable provider-event inbox keyed by account/environment/event ID was observed; a replay can still attempt another rate-limit insert.
- `update.ts` interprets upgrade/renewal/scheduling, mutates subscription and rate-limit rows, carries inherited credits forward once, and makes a Stripe schedule retrieval during webhook handling. `delete.ts` marks the user subscription canceled. Handlers deep-import `@onlook/db/src/client` and emit analytics/logs.
- `helpers.ts` assumes the first Stripe subscription item and extracts subscription, item, price, customer, and period identities. Current handling does not model bundled one-time top-ups, workspace ownership, multiple commercial item kinds, per-site add-ons, durable event ordering, semantic operation identity, or provider/application/ledger disagreement.
- Webhook signature authentication is an inherited seam to preserve. Existing event interpretation and mutation are not sufficient CEU idempotency or application entitlement authority.

### Database and usage seams

- `packages/db/src/schema/subscription/` owns inherited `products`, `prices`, `subscriptions`, `rate_limits`, `usage_records`, and legacy subscriptions. `packages/db/src/schema/index.ts` is the protected schema export seam; `packages/db/src/index.ts` is the public package entry.
- Current subscription, rate-limit, and usage records are user-scoped. Current `prices` store one `monthlyMessageLimit`; current rate limits are undifferentiated message-credit windows with carry-over; current usage records carry `UsageType` and optional user-scoped trace ID.
- All inspected subscription tables call `.enableRLS()`, but the authored schema does not itself demonstrate the exact grants/policies needed for new workspace commercial tables. Existing generated migrations are implementation evidence only and are maintainer-owned.
- `apps/web/client/src/server/api/routers/usage/index.ts` exposes `get`, `increment`, and `revertIncrement`. It gives users without active inherited subscriptions a free daily/monthly plan, selects one nonzero rate-limit row, then decrements it and inserts a usage record. It is user-scoped, has one generic balance, supports compensating deletion, and has no reservation lifecycle or append-only ledger.
- The current select-then-update decrement does not include `left > 0` in the update predicate or lock the selected row explicitly. Under final-unit contention it is not evidence of the required non-negative guarantee. `revertIncrement` increments a counter and deletes usage history, which conflicts with CEU history-preservation requirements.
- `apps/web/client/src/app/api/chat/route.ts` checks inherited usage, calls `incrementUsage` before `createRootAgentStream` for edit chat, and attempts `revertIncrement` only when stream setup throws. `helpers/usage.ts` swallows increment/revert errors into logs/null in some paths. This is an inherited AI caller and implementation evidence; CEU must not wrap or change it in this change. A later website/AI capability must adopt the commercial public contract through a separately approved seam before it becomes Jagwar-funded.

### Router, service, configuration, and package boundaries

- `apps/web/client/src/server/api/root.ts` composes `subscriptionRouter` and `usageRouter`; `apps/web/client/src/server/api/routers/index.ts` exports them. Both are protected inherited composition seams.
- No `apps/web/client/src/server/services/` directory, commercial-entitlements service, commercial router, commercial worker composition, provider-event inbox, reservation ledger, or workspace commercial schema was observed.
- `architecture/policy.json` does not currently allocate a `packages/commercial-entitlements` workspace package. It does allocate `packages/business-policy`, `packages/leads`, and other focused packages, and prohibits pure capability packages from UI, transport, persistence, provider, and application dependencies.
- Unrelated Jagwar-owned `packages/business-policy` currently exposes a `commercial` policy kind, immutable `PolicyRelease`, `PolicySnapshotReference`, strict validator registry, canonical payload hashing, required-release lookup, and secret/code/raw-payload key rejection. It is useful implementation evidence for mandatory versioned inputs, but no approved CEU payload schema or values were observed. This design neither modifies it nor assumes it is production-ready; any dependency must use its public entry and a separately reviewed exact release schema.
- There is no current `packages/coding-agent`; it has no ownership role in commercial entitlement, Stripe, ledger, or provider execution. This scope explicitly expands beyond that absent package and remains centered on the Next server, focused contracts, database, and existing Stripe adapter seams required by CEU.

## Proposed architecture

### Decision AD-CEU-1 — Evidence-separated commercial authority

Use **workspace-scoped evidence separation with transactional reservations and durable reconciliation**:

```text
human tRPC / authenticated Stripe webhook / scheduled worker
  -> thin boundary authentication + validation
    -> commercial-entitlements server composition root
      -> workspace-authority port (mandatory; no fallback)
      -> approved commercial-policy port (mandatory per operation)
      -> commercial transaction repository
      -> injected Stripe adapter for payment operations

funded consumer owner
  -> its own authority/eligibility/credential/compliance checks
  -> commercial reserve + confirmed reservation receipt
  -> authority revalidation + commercial dispatch authorization
  -> consumer-owned provider dispatch and outcome interpretation
  -> commercial finalize / release / reconcile by stable operation identity
```

Four truths remain separately persisted and correlated:

1. **Payment-provider evidence** — authenticated Stripe account/environment, event, object, customer, subscription/item, checkout/payment evidence and observed provider state.
2. **Jagwar application entitlement** — approved workspace plan/add-on admission projection and explicit transition history.
3. **Commercial ledger/reservations** — allowance/top-up grants, locks, reservations, allocations, debits, releases, resets, reversals, and current projections.
4. **Provider-owner outcome evidence** — discovery displayed results, website/AI result, SMS accepted-send result, hosting lifecycle outcome, or other owning-capability fact.

No truth may substitute for another. Stripe active does not grant units before an application transition and ledger grant commit. A reservation does not prove provider success. Consumer success does not create entitlement. Hosting payment does not prove a hosted site is operational.

### Decision AD-CEU-2 — Ownership and dependency direction

Commercial owns only:

- workspace commercial-account and provider-customer correlation;
- application subscription and entitlement transitions;
- three distinct balance kinds and allowance periods;
- bundled top-up purchase/credit/lock/unlock evidence;
- reservations, bucket allocations, ledger, durable operation results, and commercial reconciliation;
- commercial processing of authenticated payment events;
- managed-hosting purchase/add-on entitlement and provider correlation.

Commercial does not own DataForSEO/AI/CodeSandbox/Telnyx execution or status vocabularies, lead identity/transitions, website generation, prompts, presets, inherited CREATE, editor/project lifecycle, Inbox messages, publishing, hosting lifecycle, domains, or analytics projections. It consumes bounded outcome/ownership ports from those owners and never imports their internals.

Allowed dependency direction is:

```text
browser/worker/webhook/tRPC boundary
  -> app-local commercial service
    -> @onlook/commercial-entitlements pure public contract (if allocated)
    -> @onlook/db public entry + injected repositories/adapters
    -> @onlook/stripe public entry only in server adapter/composition

consumer service -> public commercial contract -> injected commercial implementation
commercial service -> consumer-owned persistence-neutral port supplied at composition
X no sibling table query, no sibling internal import, no package -> app import
```

A focused pure `packages/commercial-entitlements` package is justified by demonstrated consumers across discovery, leads, website/AI, BYOK, SMS, Inbox, hosting, analytics, tRPC, webhook, and workers. It requires an explicit architecture-policy allocation before creation. If allocation is declined, the same public semantics remain app-local under the server service; they must not be placed in `@onlook/stripe`, `@onlook/db`, `packages/coding-agent`, or a generic shared package.

### Decision AD-CEU-3 — Mandatory versioned policy, no defaults

Every policy-dependent command receives a validated immutable `CommercialPolicySnapshot` identifying at least policy release ID, schema version, payload hash, evaluated operation/input identity and version, and effective evidence. The approved payload schema must require, only where applicable:

- Starter/Pro/Scale Stripe product/price identities and monthly prices;
- each plan's lead, Jagwar-AI, and SMS monthly quantities;
- bundle price and all three top-up quantities;
- AI provider-cost conversion, rounding, and final-unit rules;
- recurring site-add-on price and provider item model;
- billing boundary and plan-change/proration/allowance semantics;
- refund/dispute/chargeback/reversal/shortfall semantics;
- reservation maximum, expiry, bounded expansion, final adjustment, owner, and SLO per consumer;
- add-on cancellation/reactivation/item-reuse semantics; and
- operational readiness evidence required by CEU-021.

The design deliberately supplies no values. Missing, invalid, ambiguous, unsupported, non-production, ineffective, or unapproved policy yields typed `policy_unavailable` before checkout, reset, reservation, expansion, provider call, or ledger mutation. Existing Onlook `PRO_PRICES`, free limits, Stripe dashboard values, BMAD/Telio text, provider defaults, and provisional assumptions are never fallbacks.

A later slice may adapt the public `@onlook/business-policy` release/snapshot contracts after reviewing an exact strict CEU validator. It must not edit or depend on unrelated dirty implementation by assumption.

## Public persistence-neutral contracts

Names are conceptual and may be refined without changing semantics. Values are plain serializable data; opaque IDs and strings are bounded by approved policy. No contract exposes SQL/table shapes, Stripe payloads, secrets, credentials, message bodies, prompts, or cross-workspace existence.

```ts
type BalanceKind = 'lead' | 'jagwar_ai' | 'sms';
type PlanFamily = 'starter' | 'pro' | 'scale';
type BucketKind = 'monthly_allowance' | 'top_up';

type CommercialDecision<T> =
  | { kind: 'allowed'; value: T; receipt: OperationReceipt }
  | { kind: 'replay'; value: T; receipt: OperationReceipt }
  | { kind: 'pending'; code: 'provider_evidence' | 'unknown_outcome' | 'reconciliation'; receipt: OperationReceipt }
  | { kind: 'denied'; code: 'not_authorized' | 'inactive_entitlement' | 'insufficient_units' | 'policy_unavailable' | 'not_eligible'; correlationId: string }
  | { kind: 'conflict'; code: 'semantic_mismatch' | 'concurrently_exhausted' | 'state_changed' | 'uniqueness_conflict'; correlationId: string }
  | { kind: 'unavailable'; code: 'authority_unavailable' | 'persistence_unavailable' | 'readiness_unavailable'; correlationId: string };

type ReserveCommand = {
  workspaceId: string;
  balanceKind: BalanceKind;
  maximumUnits: string;             // bounded non-negative integer string, never float
  operationId: string;
  consumerKind: string;
  sourceIdentity: OpaqueSourceIdentity;
  actorEvidence: AuthorityEvidence;
  policy: CommercialPolicySnapshot;
};
```

Core operations:

- `readEntitlement`, `readBalances`, and `readSiteAddOn` return sanitized workspace projections with source event IDs and reconciliation/readiness state.
- `beginCheckout`, `beginTopUpPurchase`, `beginSiteAddOnActivation`, `cancelSiteAddOn`, and `openBillingPortal` require current Owner evidence, approved policy, semantic operation identity, and current resource ownership where applicable. They return provider redirect/intent data only after durable local intent commits.
- `reserve` atomically creates or replays one reservation and source-bucket allocations. It never calls the consumer provider.
- `authorizeDispatch` revalidates current authority, entitlement, policy snapshot compatibility, reservation status, and consumer readiness at the irreversible boundary, then appends dispatch-ready evidence. The provider owner must not dispatch without this confirmed receipt.
- `finalize` accepts authenticated owner outcome evidence and a final quantity at or below the secured maximum; it debits exact reservation allocations once and explicitly releases any remainder.
- `expandBeforeDispatch` may atomically reserve only an approved bounded difference before the effect. There is no post-effect expansion that can make a balance negative.
- `release` accepts owner proof of definite no-chargeable-effect/pre-acceptance failure and releases once.
- `markUnknown`, `expireForReconciliation`, and `reconcile` retain pending outcomes and compare all four truths without inventing success/failure.
- `applyVerifiedPaymentEvent` consumes a signature-authenticated, bounded Stripe event envelope; the Stripe adapter interprets provider semantics while commercial applies only an approved transition.
- `readCommittedCommercialEvents` exposes stable event ID, workspace, event/schema version, aggregate/operation IDs, policy reference, commit time, result, and supersession/reversal references for analytics and lifecycle consumers.

### Exact consumer ports

- **DataForSEO discovery/import:** `reserveLeadDisplay(runId, requestedMaximum, approvedCountPolicy)`; `finalizeDisplayedBusinesses(runId, uniqueDisplayedResultIds, finalCountEvidence)`; `releaseDiscovery(runId, no-effectEvidence)`. Reopening a completed immutable snapshot calls no commercial mutation. Later fresh runs may charge the same business again; within-run duplicate displayed provider businesses are one final unit. Import consumes the lead-owned stable `created/existing/replay/conflict` decision and never creates a second charge. Discovery owns provider execution/snapshots/eligibility.
- **Lead pipeline:** commercial stores lead/import/attempt/source-operation IDs only as bounded correlation. It consumes lead-owned `created/existing/replay/conflict` evidence for charge reconciliation and never creates, merges, queries, or transitions a lead.
- **Website/Jagwar AI:** `reserveAi(operationId, boundedMaximum, leadAndWebsiteEvidence, conversionPolicy)` and `finalizeAi(authoritativeFinalUnitsEvidence)`. Website owns prompts, presets, media, provider calls, inherited CREATE/project success, and lead coordination.
- **CodeSandbox BYOK:** commercial exposes `readPaidAdmission` only. BYOK owns Owner-managed credential storage/validation, just-in-time lease, fixed template, provider compute, and no-Jagwar-key fallback. A valid entitlement cannot override failed BYOK admission.
- **Telnyx SMS:** `reserveSms(sendOperationId, boundedRecipientUnits, smsAdmissionEvidence)` and finalize only from SMS-owned authenticated durable accepted-send evidence. SMS owns consent, lookup, sender/registration, templates, preview/confirmation, provider call/status mapping, delivery, opt-out, replies, and unknown-outcome reconciliation.
- **Inbox replies:** Inbox delegates outbound reply to SMS; commercial sees the same SMS operation contract and no conversation/message content.
- **Publishing/hosting:** commercial exposes base entitlement plus one site-add-on entitlement/correlation. Hosting owns site/project eligibility evidence, publish/domain execution, 14-day grace, notices, neutral suspension, 90-day recoverable retention, deletion, and reactivation effects. Existing publishing remains unchanged.
- **Owner analytics:** `readCommercialProjection` and committed commercial events expose current balances/readiness and stable source IDs. Analytics owns checkpoints, derivation versions, staleness, reconciliation, presentation, and currency-separated Won data; it cannot rewrite commercial truth.

## Persistence and data boundaries

Exact SQL names, columns, migration filenames, generated artifacts, and Data API exposure are deferred to reviewed slices. The capability must preserve these conceptual aggregates:

1. **Commercial account/provider binding:** workspace ID, stable commercial account ID, provider account/environment, customer binding, versions, bounded status; one active customer mapping per approved provider model. Stripe customer ID is correlation, never workspace authority.
2. **Provider event inbox:** provider account/environment + event ID unique, object/type correlation, signature-authenticated receipt time, bounded extracted facts, processing state/result, semantic operation ID, supersession/reconciliation references. Raw payload/signature is not commercial metadata; any separately required restricted retention belongs to a security-approved store.
3. **Application subscription projection and transitions:** workspace, plan family, state, effective period/billing boundary, provider object refs, policy snapshot, monotonic version, explicit pending/active/inactive/restricted-reconciliation transitions. Provider status remains separate evidence.
4. **Allowance periods and balance buckets:** one row per workspace/balance kind/source identity. Monthly rows are tied to a billing period and policy grant; top-up rows are tied to immutable bundle credits. Each tracks granted, reserved, consumed/released/expired-unspendable projection quantities with non-negative checks. Top-up lots have no expiry and are lockable, not deletable.
5. **Bundle purchase and three credit legs:** one bundle identity, provider payment correlation, policy snapshot, and exactly one credit leg for each balance kind. A transaction commits all three legs and projections or none.
6. **Reservation and allocation:** workspace, balance kind, consumer/source/operation semantic hash, maximum, state, expiry/reconciliation policy, actor/authority/policy evidence, and child allocations to exact monthly/top-up bucket IDs in monthly-first order.
7. **Append-only commercial ledger:** grant, reset, lock, unlock, reserve, dispatch-ready, finalize/debit, release/remainder, denial where required, adjustment, reversal, add-on transition, provider-event result, and reconciliation result. Every entry has stable event/operation/provider identities, actor, policy, server time, result, source bucket/quantity where applicable, and supersedes/reverses links.
8. **Durable operation result/reconciliation case:** unique workspace + operation kind + operation ID, semantic request hash, committed result snapshot/references, unknown-commit recovery, disagreement flags, retry/lease state, next attempt, bounded owner/SLO policy reference.
9. **Managed-hosting add-on:** workspace/site/application add-on identity, provider subscription-item correlation, lifecycle episode correlation, commercial state/version, policy, operations/events. A uniqueness constraint or equivalent transactionally enforced invariant permits at most one active-counting application add-on per site.

Current projections are caches of retained evidence, not replaceable truth. Ordinary application roles receive no UPDATE/DELETE privilege over ledger, provider event, transition, operation result, or historical credit/debit records. Corrections append compensating/superseding entries.

## Transaction and concurrency design

### Reservation and final-unit proof

A reservation transaction uses a deterministic lock order: commercial account/entitlement, current allowance bucket, then applicable top-up buckets ordered by stable bucket ID, then operation/reservation projection. An equivalent implementation may use conditional compare-and-swap updates, but concurrency tests must prove the same invariant.

1. Claim `(workspace, consumer kind, operation ID)` and compare a canonical semantic request hash. Equivalent committed/pending semantics replay; changed workspace, balance, maximum, actor binding, consumer, or source conflicts without mutation.
2. Lock and re-read current workspace entitlement, policy compatibility, balance projections, and top-up lock state.
3. Allocate the full bounded maximum from the current monthly allowance first, then matching unlocked top-up lots. Never cross balance kinds. If full allocation is impossible, commit only a bounded denial/operation result where required; no partial hidden reservation.
4. Atomically decrement bucket availability/increment reserved quantities, insert reservation allocations, ledger evidence, and durable operation result.
5. Return a dispatch-eligible receipt only after the commit is confirmed. If the client sees an unknown commit, it must query the operation result; it MUST NOT dispatch while commit status is unknown.

Row checks enforce every granted/available/reserved/consumed component non-negative and conservation per bucket. Since competing transactions lock or conditionally update the same final bucket, at most the affordable set commits; losers observe exhaustion and never dispatch. Finalization moves exact reserved allocations to consumed; release returns them only to the same bucket. If a monthly allocation is released after its allowance period closed, it becomes explicit closed-period released remainder, not spendable current allowance. A new billing period is a new grant/bucket; reset never rewrites top-up lots or old reservation allocations.

### Bundled top-up atomicity

Top-up credit processing claims provider event and bundle semantic identity, locks the commercial account and all three balance projections in fixed `lead -> jagwar_ai -> sms` order, validates the complete approved bundle snapshot, inserts all three immutable credit legs and one bundle ledger event, updates all projections, and commits once. Missing any price/quantity, duplicate semantic evidence, or any write failure credits none. Inactive entitlement preserves the same lots with `locked=true`; reactivation appends unlock evidence without recreating identities.

### Provider dispatch sequencing

Commercial does not hold a database transaction over a network call. The consumer owner executes:

```text
reserve commit confirmed
  -> current authority/resource/policy/readiness revalidation
  -> authorizeDispatch evidence committed
  -> provider owner invokes provider with same stable operation/idempotency identity
  -> owner records authoritative success / definite pre-acceptance failure / unknown
  -> commercial finalize / release / pending reconciliation
```

A removed or demoted actor before dispatch is denied; if no provider call occurred, the owner can submit definite no-effect evidence for release. A provider timeout after invocation remains unknown. A final quantity above the reservation is accepted only if `expandBeforeDispatch` secured an approved bounded difference before the effect. If excess is discovered after effect, commercial records disagreement/reconciliation and never creates a negative balance.

### Checkout and Stripe sequencing

Owner checkout/add-on/top-up commands first commit an application intent with workspace, policy, semantic operation, and expected provider object kind. Only then may the injected Stripe adapter create/reuse a provider object with provider idempotency metadata. Browser return never applies entitlement or units. Verified webhooks or reconciliation supply provider evidence; commercial claims the provider event and applies application transition plus required ledger grants atomically. Unknown provider creation/commit is recovered by local operation and provider idempotency identities before another object is created.

## State transitions and reconciliation

### Application subscription

```text
inactive/pending
  -- verified approved activation + entitlement/allowance evidence commits --> active
active
  -- verified renewal at approved billing boundary --> active + new allowance periods
active
  -- approved provider-reported change --> pending_change or approved effective transition
active
  -- cancellation/failure/dispute/inactivity evidence --> inactive or restricted_reconciliation
inactive/restricted_reconciliation
  -- verified approved reactivation --> active + unlock existing top-ups
any disagreement
  --> restricted_reconciliation (unsafe funded admission denied)
```

Exact provider status mappings, effective times, proration, carry/adjustment, refund/dispute, and reactivation behavior are unresolved policy and cannot be inferred. Inactivity blocks new funded reservations immediately but does not delete workspace configuration or hosting-owned public grace.

### Reservation

```text
reserved -> dispatch_authorized -> outcome_pending
reserved/dispatch_authorized/outcome_pending
  -- authoritative success <= secured maximum --> finalized (+ explicit remainder release)
reserved/dispatch_authorized
  -- proof of no chargeable effect --> released
any nonterminal
  -- time window reached --> reconciliation_required (not automatic release)
any nonterminal
  -- timeout/crash/unknown provider or DB outcome --> reconciliation_required
reconciliation_required
  -- later success --> finalized
  -- later proof of no effect --> released
  -- unresolved --> remains pending with bounded retry/backoff/SLO evidence
```

Terminal finalize/release is replay-safe. Reordered release after finalization or finalize after proven release cannot overwrite truth; it returns the terminal result or opens an explicit disagreement when new authoritative evidence conflicts.

### Provider event

```text
received_unverified -> rejected (no mutation)
verified -> claimed -> applied | duplicate | superseded/no-op | reconciliation_required
```

Signature verification occurs before event persistence as trusted evidence. Event uniqueness is provider account + environment + event ID, supplemented by provider object and semantic operation uniqueness. Reordering is handled by transition preconditions and current provider-object reconciliation; an older event cannot regress a committed newer application state merely by arrival order. If ordering cannot be established from approved evidence, state remains explicit reconciliation rather than guessed.

### Top-up and add-on

- Bundle: `intent -> provider_pending -> credited | failed_before_payment | reconciliation_required`; credited is immutable and locks/unlocks with base entitlement.
- Site add-on: `intent -> provider_pending -> entitled | inactive | reconciliation_required`. The active-counting uniqueness invariant is enforced before provider creation and again when verified evidence applies. Hosting operational state is only correlated evidence; it is never represented as commercial success. Provider payment with failed hosting activation remains an explicit cross-owner reconciliation case.

Reconciliation compares provider event/object evidence, application subscription/add-on projection, ledger/bucket/reservation conservation, and provider-owner outcome. It never silently chooses one as universal truth. Each attempt uses a named workspace-bound system actor, operation lease/identity, bounded retry policy, and a new ledger/reconciliation event. Manual repair is unavailable until exact support/security/finance authority and approval thresholds are approved; it can only append compensating/superseding evidence.

## Webhook authentication and inherited Stripe preservation

The inherited raw-body signature check at `apps/web/client/src/app/webhook/stripe/route.ts` remains the authentication boundary. Proposed evolution is additive: a thin route verifies the event, converts it to a bounded provider envelope, and invokes the commercial service. Existing subscription handlers remain preserved until separately migrated behind parity tests; there is no big-bang replacement.

Likely protected edits to the route/handlers or `@onlook/stripe` must be the smallest adapter hooks and need individual candidate-hash CCRs. New provider event/reconciliation logic belongs in commercial services, not in the route. Unsupported events remain harmless, but required commercial event kinds may not be acknowledged as successfully applied until durable claim/result policy is satisfied; retry response semantics must be selected with Stripe behavior and operational evidence during implementation.

`@onlook/stripe` remains the Stripe API adapter and Stripe-specific type owner. It must not become the Jagwar entitlement or ledger package. Existing user subscription, Pro/free pricing, settings, and checkout callers stay intact until a separately approved compatibility/transition slice proves how workspace commercial state coexists. No existing concrete inherited price or limit is promoted into CEU policy.

## Supabase, RLS, grants, and privileged workers

Controls remain separate:

1. Supabase Auth establishes a human subject.
2. Workspace authority establishes current workspace actor/role/resource ownership and revalidation.
3. Commercial establishes entitlement, balance, reservation, and commercial mutation rules.
4. RLS/grants are database defense in depth.

Safest initial exposure is no `anon` commercial access, no direct browser writes, and server-mediated sanitized reads. Every commercial table in an exposed schema has RLS enabled before grants. A future direct authenticated read must separately approve Data API exposure and grants, use ownership-aware active-membership predicates (not `TO authenticated` alone), and have supporting workspace/membership indexes. `user_metadata`, stale JWT `app_metadata`, Stripe customer IDs, client workspace selection, and route visibility are never predicates of authority.

Cross-workspace access shapes:

- direct queries use workspace + opaque ID;
- lists, counts, sums, readiness, cursors, and aggregates begin with workspace scope;
- indirect site/project/lead/conversation references resolve the full relationship through owner-supplied ports;
- metered/mutating/provider batches are bounded, deduplicated, and all-or-none for authorization; one allowed item never authorizes another;
- existing cross-workspace and nonexistent targets return the same public `not_authorized` result without balance, subscription, customer, provider, add-on, or reconciliation disclosure.

Removed members are re-resolved on every request and revalidated at checkout, balance mutation, protected read, and provider-dispatch boundaries. A valid session or old operation receipt does not restore access.

Service-role/database credentials remain server-only. Webhook, reset, expiry, and reconciliation workers are narrowly named, authenticate at their owning boundary, bind one workspace and permitted action, and retain system-actor evidence. Bypass-RLS capability does not bypass application checks. Views use security-invoker behavior or remain unexposed with grants revoked. `SECURITY DEFINER` is not introduced to fix permission errors; any genuinely necessary private privileged helper requires explicit search path, execute revocation/grants, caller checks, advisors, and adversarial review.

Current Supabase/CLI behavior and documentation must be version-verified during an authorized database slice before selecting commands or SQL features. Generated migrations are maintainer-owned; agents do not run `db:gen` or edit generated SQL.

## Secret-safe audit and observability

Commercial metadata uses allowlisted event/action/result vocabularies, bounded opaque IDs, integer-string quantities, policy references, timestamps, and supersession/reversal links. Reject or exclude raw webhook bodies/signatures, API keys, session/JWT tokens, provider credentials, unrestricted Stripe/Telnyx/DataForSEO/AI payloads, message bodies, prompts, CodeSandbox keys, payment method details, and unnecessary personal data. Logs and metrics carry correlation/event/workspace-safe opaque IDs and bounded result codes only.

Observe at least:

- policy/readiness unavailable by operation kind;
- entitlement transition and provider/application disagreement;
- reservation admitted/denied/replay/conflict/pending/expired and last-unit contention;
- unknown outcome age, reconciliation backlog/attempt/result/SLO breach;
- finalize/release/expansion replay or conflicting evidence;
- webhook auth failure, duplicate, delay, reorder, processing lag, and dead-letter/retry state;
- allowance reset duplicate/gap and bucket/ledger projection mismatch;
- bundle all-or-none failure, top-up lock/unlock, and refund/dispute restriction;
- site add-on uniqueness/provider/hosting disagreement;
- removed-member and cross-workspace denials; and
- privileged action/audit persistence failures.

Unsafe ledger/projection mismatch constrains or denies new admission under approved policy and always enters reconciliation. A known committed result lost to the caller is recovered by operation ID and never applied again.

## Tentative file placement and protected seams

The following is a design target, not a manifest and not permission to create every file:

```text
packages/commercial-entitlements/                 # requires exact policy allocation
  package.json
  src/index.ts                                    # sole public entry
  src/contracts.ts
  src/policy.ts
  src/reservations.ts
  test/*.test.ts

packages/db/src/schema/commercial-entitlements/
  index.ts
  account.ts
  subscription.ts
  balance.ts
  ledger.ts
  reservation.ts
  provider-event.ts
  top-up.ts
  hosting-add-on.ts
  reconciliation.ts

apps/web/client/src/server/services/commercial-entitlements/
  index.ts                                        # server composition/public app-local seam
  repository.ts
  policy.ts
  entitlement.ts
  balances.ts
  reservations.ts
  top-ups.ts
  provider-events.ts
  hosting-add-ons.ts
  reconciliation.ts
  stripe-adapter.ts
  *.test.ts

apps/web/client/src/server/api/routers/commercial-entitlements/
  index.ts                                        # thin Zod/tRPC Owner/read boundary
  index.test.ts

apps/backend/supabase/tests/<reviewed-commercial-path>
apps/backend/supabase/migrations/<maintainer-generated-path>
```

Files may be combined/split by independently changing responsibility and 250–400-line candidate budget. No generic directory/package, deep import, editor/CREATE path, `packages/coding-agent`, or sibling capability internals are proposed.

Likely protected inherited seams, subject to exact candidate proof, include:

- `packages/db/src/schema/index.ts` for schema composition;
- `apps/web/client/package.json` for an approved contract-package dependency;
- `apps/web/client/src/server/api/routers/index.ts` and `apps/web/client/src/server/api/root.ts` for transport composition;
- `apps/web/client/src/app/webhook/stripe/route.ts` and existing subscription handlers for additive webhook delegation;
- selected `packages/stripe/src/*` public adapter files only if a missing Stripe operation cannot be added adjacently;
- selected inherited subscription/settings/callback files only in a later UI/compatibility change, not selected now.

Prefer new adjacent commercial files and injected adapters before any protected edit. `apps/web/client/src/server/api/trpc.ts`, editor, `components/store/create`, `packages/ai`, fixed CodeSandbox template, project creation/lifecycle, publishing, export, and Git are explicitly not selected.

Before every governed slice, exactly one reviewed `architecture/slices/<slice>.json` must name every exact path, capability, owning runtime, role, and correct baseline classification. Before each protected inherited edit, a new per-file CCR must name that exact path and exact candidate resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the manifest. Truthful hashes cannot exist until exact candidate resulting files exist, so no hash, CCR, manifest, or approval is created in this design. A prior approval, wildcard, planning artifact, or another file's hash grants no authority. Protected rollback content needs its own exact candidate hash and approval.

## Rollout, deployment dependencies, and rollback

Rollout order:

1. approved pure contracts and strict commercial-policy validator, with no runtime consumer;
2. additive schema and maintainer-generated migration with constraints/RLS/grants/DB tests;
3. disabled server composition requiring workspace authority and policy ports;
4. authenticated provider-event inbox and application subscription projection;
5. allowance periods, distinct buckets, append-only ledger, and idempotent resets;
6. atomic bundle/top-up lock/unlock;
7. reservation/finalize/release/expiry and dispatch authorization;
8. reconciliation workers and observability;
9. site add-on commercial entitlement;
10. thin Owner/read transport and separately authorized consumer integrations/inherited compatibility.

Provider-funded entry points remain disabled until workspace authority, applicable lead identities, approved commercial release, Stripe account/environment/customer mapping, credentials, webhook authentication, tax/invoicing, provider owner evidence, reconciliation worker/scheduler, monitoring/support, privacy/security/legal/compliance, retention, and rollback evidence are ready for that operation. Feature flags hide/disable entry points but never substitute authority, entitlement, policy, or ledger admission.

Rollback disables new checkout, reservations, dispatch authorization, top-up/add-on activation, and consumer integration while continuing authenticated event capture and reconciliation as operationally required. It preserves provider events, application transitions, allowance periods, top-up lots/locks, reservations, allocations, debits, releases, reversals, add-on identities, unknown outcomes, operation results, and audit/legal evidence. It never unlocks inactive top-ups, restores removed-member access, duplicates provider objects, silently changes balances, deletes history, or treats a committed effect as absent. Corrections are forward compensating/superseding events. Schema rollback is additive/forward unless separately approved retention permits destruction.

## Failure behavior

- authority runtime absent/uncertain: unavailable, no commercial read/mutation/provider call;
- policy/readiness absent/invalid/ambiguous: unavailable before dependent effect;
- inactive entitlement/locked top-up: denied without reservation or provider call;
- insufficient/concurrently exhausted units: atomic denial, no partial allocation or negative balance;
- reservation/ledger persistence failure: no provider dispatch;
- unknown local reservation commit: recover by operation ID before dispatch/retry;
- provider timeout/unknown acceptance: pending reconciliation, no assumed release/success;
- duplicate/reordered event or command: replay/no-op/convergent transition without duplicate effect;
- semantic key mismatch: conflict, no mutation;
- expired reservation: reconciliation, never elapsed-time release;
- final quantity above unsecured maximum: deny/hold reconciliation, never negative;
- bundle component missing/write failure: no purchase admission or credit leg;
- provider/app/ledger/owner disagreement: explicit restricted reconciliation;
- add-on uniqueness race: one application active-counting add-on, duplicate provider evidence reconciled;
- audit/operation-result failure before required mutation: fail closed; known commit followed by response/audit uncertainty is recovered, not replayed;
- RLS/grant/privileged uncertainty: fail closed without service-role shortcut.

## Security and test strategy

Each future slice starts with retained RED evidence, then smallest GREEN, TRIANGULATE adversarial cases, and REFACTOR only while green. Required coverage includes all 99 named specification scenarios plus:

- exact contract serializability, bounded IDs/metadata, secret exclusion, no persistence/provider leakage, and dependency neutrality;
- missing/malformed/unsupported commercial release and proof no inherited values become defaults;
- subscription/event duplicate, reorder, delayed, unknown-commit, unsupported plan/trial, and provider/application disagreement;
- deterministic final-unit and multi-unit races, monthly-first allocations, cross-boundary pending reservations, top-up lock/unlock, reset replay, and conservation/non-negative checks;
- all-or-none three-leg bundle under duplicate payment and partial write failure;
- reservation semantic mismatch, authority removal before dispatch, timeout, expiry, lower final quantity, prohibited excess, bounded pre-dispatch expansion, finalize/release reorder, and recovery after lost response;
- direct/list/aggregate/indirect/mixed-batch cross-workspace denial, existing-vs-nonexistent equivalence, stale JWT, removed member, grants, views/functions, and privileged workers;
- webhook signature failure and durable provider account/environment/event/object/semantic dedupe;
- add-on concurrent activation, cross-workspace/ineligible site, provider object unknown, payment/hosting disagreement, and one-active invariant;
- contract fixtures for DataForSEO, leads, website/AI, BYOK, SMS, Inbox, hosting/publishing, and analytics with zero sibling internal/table access;
- inherited regression proof for current Stripe/subscription/settings/callback callers and no editor/CREATE/fixed-template/project/publishing/export/Git diff.

Applicable implementation gates include focused Bun tests, approved database tests and version-verified Supabase commands, `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, `bun scripts/architecture/check.ts --changed`, structure/pre-push gates, and `git diff --check`. No command is run or claimed by this planning-only phase.

## Dependency-ordered chained slice forecast

Auto-forecast is **High risk** against the 400 changed-line budget. Future tasks should plan approximately 12 autonomous chained PRs totaling roughly 3,500–4,700 changed lines. Every slice, including tests and its exact manifest, targets 250–400 changed lines, follows **RED → GREEN → TRIANGULATE → REFACTOR**, and is independently reversible/reviewable. Do not split one transaction invariant to satisfy size; if a candidate exceeds 400, split only at a safe contract/runtime boundary after another reviewed manifest. Chain strategy remains owner-approved before apply.

| Order | Cohesive future slice | Forecast | Independent finish boundary |
| --- | --- | ---: | --- |
| 1 | Architecture allocation, pure contracts, policy snapshot/validator ports | 300–390 | Runtime-neutral public contract; every missing value fails closed; no consumer |
| 2 | Commercial account, subscription/provider-event schema | 300–400 | Additive declarative provider/application separation; no migration/API |
| 3 | Balance periods/buckets, ledger/reservation schema and conservation tests | 330–400 | Distinct accounts and immutable evidence model reviewable |
| 4 | Maintainer migration, RLS/grants/indexes/adversarial DB tests | 330–400 | Database isolation and constraints proven; agent edits no generated SQL |
| 5 | Durable operation/provider-event inbox and subscription transition reducer | 300–390 | Verified events dedupe and project application entitlement without UI |
| 6 | Allowance grants/resets, distinct projections, monthly-first transaction rules | 300–400 | Boundary-only reset and non-negative bucket conservation proven |
| 7 | Atomic bundled top-up credit and inactivity lock/unlock | 280–380 | Three legs commit once/all-or-none; historical lots preserved |
| 8 | Reservation/finalize/release and final-unit concurrency | 340–400 | No provider dispatch without confirmed reservation; terminal replay safe |
| 9 | Expiry, unknown outcomes, bounded expansion, reconciliation worker | 310–400 | Timeout/reorder/unknown cases converge without assumed release |
| 10 | Managed-hosting add-on intent/uniqueness/provider correlation | 280–380 | Exactly one active-counting add-on; hosting execution remains external |
| 11 | Thin commercial tRPC/read/Owner administration composition | 250–350 | Zod transport and fail-closed authority/policy composition |
| 12 | Additive Stripe webhook/adapter compatibility and public consumer fixtures | 320–400 | Authenticated inherited seam preserved; eight consumer contracts/regressions proven |

No tasks file is created now. Exact line counts, filenames, protected candidate content, migration path, and chain shape belong to the later tasks/candidate-review phases.

## Design-to-requirement and 99-scenario traceability

| Requirement | Scenario count | Design evidence / primary future slices |
| --- | ---: | --- |
| CEU-001 | 4 | Versioned mandatory policy, exact plan union, provider/app separation; 1, 5 |
| CEU-002 | 4 | Explicit entitlement transitions, immediate admission gate, hosting separation; 5, 11 |
| CEU-003 | 4 | Three bucket kinds, monthly-first allocations, period rows, no daily gate; 3, 6 |
| CEU-004 | 3 | Deterministic locks/CAS, full reservation, confirmed commit before dispatch; 3, 8 |
| CEU-005 | 4 | One bundle + three atomic legs, provider dedupe, persistent lock/unlock; 7 |
| CEU-006 | 4 | Owner administration, Member consumption, named system actors, revalidation; 1, 8, 11 |
| CEU-007 | 4 | Site ownership port, active uniqueness, provider/hosting disagreement; 10 |
| CEU-008 | 3 | Append/supersede ledger, complete evidence, allowlisted secret-safe metadata; 3, 5–10 |
| CEU-009 | 4 | Persistence-neutral bounded semantic reservation contract and mismatch conflict; 1, 8 |
| CEU-010 | 6 | Reservation state machine, exact final/remainder, expiry reconciliation, bounded expansion; 8–9 |
| CEU-011 | 5 | Signature first, provider/semantic dedupe, operation recovery, reconciliation; 5, 9, 12 |
| CEU-012 | 4 | Four-truth model and additive `@onlook/stripe`/webhook preservation; 5, 12 |
| CEU-013 | 6 | Workspace predicates for every access shape, RLS/grants, sanitized denials/workers; 4, 11 |
| CEU-014 | 4 | Fresh-run reserve/final display, affordable bound, snapshot no-op, import decision; 1, 8, 12 |
| CEU-015 | 3 | Lead IDs as correlation only, no transition ownership, identity-conflict reconciliation; 1, 9, 12 |
| CEU-016 | 4 | Website/AI owner outcome, approved conversion, BYOK independent gate, unknown pending; 1, 8–9, 12 |
| CEU-017 | 4 | SMS accepted-send-only finalization and Inbox delegation; 1, 8–9, 12 |
| CEU-018 | 4 | Hosting/add-on read contract, analytics event/read contract, sale exclusion; 10, 12 |
| CEU-019 | 3 | Explicit ownership/dependency direction and hard authority prerequisite; 1, 11–12 |
| CEU-020 | 5 | Disabled rollout, typed failures, observability, mismatch and manual repair model; 9–12 |
| CEU-021 | 6 | Explicit unresolved launch-blocker register; 1 and every admission slice |
| CEU-022 | 3 | Protected seam inventory and explicit editor/CREATE/publishing exclusions; 12 |
| CEU-023 | 5 | 250–400 Strict-TDD chain, exact manifests/CCRs, truthful hash timing, maintainer migration; all |
| CEU-024 | 3 | Evidence-preserving rollback and truthful deferred gate status; all |

Counts total **99**. Before any slice manifest is approved, its test plan must enumerate the exact scenario titles assigned from the authoritative specification; this table is a coverage index, not permission to collapse or omit scenarios.

## Decision records and rejected alternatives

- Choose four separately correlated truths; reject Stripe state, app entitlement, ledger, or provider-owner outcome as universal authority.
- Choose workspace commercial authority; reject current user subscription/customer ownership as Jagwar workspace authority.
- Choose a focused pure contract plus app-local implementation; reject putting Jagwar entitlement in `@onlook/stripe`, `@onlook/db`, `packages/coding-agent`, a route, or a generic package.
- Choose mandatory immutable commercial policy snapshots; reject inherited Pro/free values, Stripe catalog, provider defaults, zero, trial, or historical behavior as fallback.
- Choose period/lots plus reservation allocations and append-only ledger; reject mutable counters, delete-on-revert usage, merged balances, or expiring top-ups.
- Choose row locks/conditional conservation and semantic durable results; reject check-then-decrement without a guarded write and reject logs as recovery authority.
- Choose reservation/dispatch/outcome saga; reject network calls inside database transactions and reject provider calls before durable reservation evidence.
- Choose expiry as reconciliation; reject elapsed time as proof of no provider effect.
- Choose pre-effect bounded expansion only; reject post-effect negative balance or hidden overdraft.
- Choose provider-event inbox plus transition preconditions; reject webhook arrival order and checkout return as authority.
- Choose exactly-one application add-on with hosting-owned operation; reject payment as proof of hosting success or commercial ownership of grace/suspension/deletion.
- Choose server application checks plus ownership-aware RLS; reject `TO authenticated`, JWT/client claims, Stripe customer ID, or service role as authority.
- Choose additive inherited Stripe hooks; reject big-bang replacement, editor/CREATE wrapping, second generator/publisher, project reinterpretation, or Onlook cleanup.

## Explicit unresolved decisions and launch blockers

Production remains unavailable for the affected operation until owners approve and version:

1. Starter/Pro/Scale product/price identities, monthly prices, and all three monthly quantities.
2. Bundle price and all three fixed top-up quantities.
3. AI cost conversion, precision, rounding, and final-unit rules.
4. Hosting price, provider item model, cancellation timing, proration, item reuse, and reactivation semantics.
5. Plan change effective time, proration, allowance adjustment/carry, cancellation, failed/disputed state, and reactivation rules.
6. Refund/dispute/chargeback/reversal and consumed-unit shortfall treatment without silent negatives.
7. Per-consumer maximum/expiry duration, bounded expansion, final adjustment, outcome owner, retry/backoff, reconciliation SLO, and dead-letter/manual escalation.
8. Exact Stripe account/environment/customer mapping, tax/invoicing, webhook event set/response semantics, credentials, scheduler/worker, monitoring/support, retention, privacy/security/legal/compliance readiness.
9. Exact Data API exposure/grants, privileged worker and manual repair authority, approval thresholds, audit retention/legal holds, and Owner-visible projection.
10. Workspace-authority production runtime/security evidence; lead-pipeline runtime for lead-dependent correlation; consumer-owner attestation/authentication contracts.
11. Architecture allocation for `packages/commercial-entitlements`, exact slice chain strategy, exact manifests, maintainer migration workflow, and each candidate-hash CCR.

No decision above is filled by this design.

## Coherence and planning verification statement

This design covers CEU-001 through CEU-024 and indexes all 99 scenarios; inventories current Stripe, subscription, database, webhook, router, caller, service, and configuration boundaries; labels observed behavior separately from proposals; preserves Onlook additively; defines ownership, contracts, transactions, state machines, reconciliation, RLS, rollout/rollback, observability, blockers, alternatives, and a dependency-ordered review forecast.

No runtime/test/database/architecture/Supabase/typecheck/lint command was run because the delegated phase is planning-only. Only this authoritative design artifact and its concise Engram mirror are created.
