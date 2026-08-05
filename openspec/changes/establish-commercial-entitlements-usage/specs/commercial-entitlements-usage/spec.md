# Commercial Entitlements and Usage Specification

## Purpose

Define authoritative workspace-scoped paid entitlements, three distinct shared usage balances, atomic bundled top-ups, site-specific managed-hosting add-ons, durable reservation and ledger evidence, and narrow public contracts for every funded consumer. This capability depends on workspace authority, consumes lead-owned identities where required, extends inherited Stripe behavior additively, and owns commercial state only.

## Requirements

### Requirement: CEU-001 — Paid subscription authority and commercial configuration are workspace-scoped

The system MUST maintain one application subscription authority per workspace for exactly the paid monthly plan families `Starter`, `Pro`, and `Scale`, with no free trial. Usable entitlement MUST be derived from authenticated, idempotently processed payment-provider evidence and MUST NOT be derived from browser state, return-route state, a client claim, a Stripe customer identifier alone, or an unverified provider payload. Plan prices and price identifiers, monthly lead/Jagwar-AI/SMS quantities, bundled top-up price and all three quantities, AI cost-to-credit conversion, and recurring per-site hosting price MUST be approved, versioned, and configurable. A missing, invalid, ambiguous, or unapproved applicable value MUST make the dependent admission unavailable; the system MUST NOT invent a default, zero, trial, historical value, or provider-derived fallback.

#### Scenario: Approved paid plan becomes authoritative

- GIVEN verified provider evidence maps a workspace to an approved Starter, Pro, or Scale policy release
- WHEN the commercial transition and required ledger evidence commit idempotently
- THEN the application entitlement MAY become active for that workspace
- AND the result MUST identify the approved policy version

#### Scenario: Browser claims a paid plan

- GIVEN a browser, checkout return route, or client payload claims that a workspace is paid
- WHEN no verified provider evidence has committed through commercial authority
- THEN the workspace MUST NOT receive usable entitlement or units

#### Scenario: Required commercial value is absent

- GIVEN an applicable price, quantity, identifier, or conversion value is missing, invalid, ambiguous, or unapproved
- WHEN checkout, reset, reservation, top-up, or add-on admission is requested
- THEN the dependent operation MUST be unavailable before any provider invocation or ledger mutation
- AND no fallback value MUST be inferred

#### Scenario: Unsupported or trial plan is presented

- GIVEN provider evidence names a free trial, free tier, or plan family other than Starter, Pro, or Scale
- WHEN application entitlement is evaluated for V1
- THEN paid admission MUST fail closed
- AND no monthly allowance MUST be granted

### Requirement: CEU-002 — Entitlement transitions immediately gate funded operations

The system MUST represent activation, renewal, provider-reported plan change, cancellation or inactivity, failed or disputed payment state, and valid reactivation as explicit auditable application transitions. An inactive base subscription MUST immediately block provider-funded discovery, Jagwar AI generation, SMS sending, managed-hosting activation, and provider-funded editing or publishing. Policy-allowed workspace, membership, and integration setup MAY precede payment and MUST NOT be erased solely by inactivity. Public-site grace and suspension effects MUST remain owned by hosting lifecycle rather than inferred from commercial payment state.

#### Scenario: Active workspace requests funded use

- GIVEN a workspace has active paid entitlement and enough applicable balance
- WHEN a current authorized Member requests an otherwise eligible funded operation
- THEN commercial admission MAY proceed to reservation

#### Scenario: Subscription becomes inactive

- GIVEN a workspace entitlement changes from active to inactive
- WHEN a Member requests a provider-funded operation after that transition
- THEN the operation MUST be denied immediately with no new reservation, debit, or provider call

#### Scenario: Workspace setup precedes payment

- GIVEN a workspace has no active paid entitlement
- WHEN its owning policy permits workspace, membership, or integration configuration
- THEN that non-funded setup MAY proceed under workspace authority
- AND inactivity alone MUST NOT erase the configuration or membership

#### Scenario: Public site enters a separate grace period

- GIVEN base entitlement becomes inactive while a managed site exists
- WHEN public availability is evaluated
- THEN commercial MUST expose authoritative subscription and add-on state
- AND hosting lifecycle MUST independently decide grace, notices, suspension, retention, and deletion

### Requirement: CEU-003 — Three balances remain distinct, shared, monthly-first, and boundary-reset

The system MUST maintain separate workspace-shared balances for `lead`, `Jagwar AI`, and `SMS`; no balance MAY merge with or substitute for another. Each balance MUST have a monthly allowance component and a non-expiring top-up component. Finalized usage MUST consume the applicable monthly component before its top-up component. Only the configured billing boundary MAY reset the monthly component; a reset MUST NOT alter top-up units. Jagwar MUST impose no daily reset or daily usage cap, while provider-owned limits MAY independently deny provider execution without changing ledger truth.

#### Scenario: Monthly units are available

- GIVEN one balance has both monthly and top-up units
- WHEN a debit finalizes within the remaining monthly quantity
- THEN only monthly units MUST be consumed
- AND top-up units MUST remain unchanged

#### Scenario: Usage spans both source buckets

- GIVEN the applicable monthly units are insufficient but monthly plus top-up units are sufficient
- WHEN a debit finalizes
- THEN the remaining monthly units MUST be consumed first
- AND only the required remainder MUST be consumed from the matching top-up balance

#### Scenario: Billing boundary resets allowances

- GIVEN the approved billing boundary is reached for an allowance period
- WHEN the reset commits idempotently
- THEN only the three monthly components MUST reflect the new approved quantities
- AND existing top-up identities and quantities MUST remain unchanged

#### Scenario: Same-day usage exceeds a notional daily amount

- GIVEN entitlement and balance permit usage but a Jagwar daily threshold is not part of approved policy
- WHEN additional same-day use is requested
- THEN commercial MUST NOT deny it as a Jagwar daily cap
- AND a provider owner MAY still enforce its independent quota, fraud, throughput, or compliance gate

### Requirement: CEU-004 — Reservations enforce atomic non-negative concurrency

Every admission that can consume funded units MUST atomically reserve the applicable balance before provider invocation. Available and reserved quantities MUST never permit a finalized or potentially chargeable total below zero. Concurrent operations competing for final units MUST admit at most the affordable set, and a losing operation MUST fail before provider invocation and without a partial debit. Reservation creation and its required ledger evidence MUST commit together or not at all.

#### Scenario: Two operations compete for the final unit

- GIVEN two concurrent operations each require the same final available unit
- WHEN both attempt reservation
- THEN at most one reservation MUST succeed
- AND the loser MUST receive an insufficient-or-concurrently-exhausted result with no provider call

#### Scenario: Multi-unit request is only partly affordable

- GIVEN an operation requests more units than are atomically available
- WHEN reservation is evaluated
- THEN the full requested reservation MUST be denied unless the consumer contract explicitly permits a smaller bounded request before dispatch
- AND no partial hidden debit MUST occur

#### Scenario: Reservation evidence cannot persist

- GIVEN balance reservation or required ledger persistence fails or has an unknown local commit result
- WHEN provider dispatch would otherwise occur
- THEN no provider invocation MUST begin
- AND recovery MUST inspect the stable operation identity before any retry

### Requirement: CEU-005 — Bundled top-ups credit all three balances exactly once

A top-up MUST be one configured purchase that grants fixed quantities to all three distinct top-up balances as one atomic commercial event. The price and every one of the three quantities MUST be present in an approved policy release; partial bundles are prohibited. Verified payment evidence MUST credit all three quantities once or none. Top-up units MUST never expire, MUST be preserved but locked while base entitlement is inactive, and MUST unlock as the same credits on valid reactivation. Refunds, disputes, chargebacks, and corrections MUST use explicit compensating or superseding evidence rather than silent balance rewrites.

#### Scenario: Top-up payment succeeds

- GIVEN an Owner purchased an approved bundle and verified payment evidence is processed
- WHEN the top-up event commits
- THEN the configured lead, Jagwar-AI, and SMS quantities MUST all be credited atomically
- AND one durable bundle identity MUST correlate the three credits

#### Scenario: One bundle quantity is unavailable

- GIVEN a top-up policy lacks any one price or balance quantity
- WHEN purchase or credit admission is attempted
- THEN the entire top-up MUST be unavailable
- AND no balance MAY receive a partial credit

#### Scenario: Duplicate payment evidence arrives

- GIVEN a bundle payment event has already committed
- WHEN checkout completion, payment, or webhook evidence is replayed or reordered
- THEN the original semantic result MUST be returned or recovered
- AND none of the three balances MAY be credited again

#### Scenario: Inactive workspace reactivates

- GIVEN non-expiring top-up units were preserved and locked during inactivity
- WHEN a valid paid reactivation transition commits
- THEN those same historical credits MUST become usable
- AND they MUST NOT be recreated, reset, or assigned new purchase identities

### Requirement: CEU-006 — Owners administer commercial state and authorized Members consume it

Only a current workspace Owner MUST administer checkout or billing, payment methods or billing portal access, plan changes, bundled top-up purchases, and managed-hosting add-on activation or cancellation. Current authorized Owners and Members MAY consume ordinary funded operations when workspace authority, consumer-owned policy, entitlement, balance, credential, compliance, and provider gates pass. Commercial MUST consume server-derived workspace actor and resource evidence and MUST NOT derive membership or role itself. Human actions MUST retain the acting member; webhook, scheduler, reset, expiry, and reconciliation actions MUST use a narrow named system actor and MUST NOT impersonate an Owner.

#### Scenario: Member attempts billing administration

- GIVEN a current Member is not an Owner
- WHEN the Member requests a plan change, top-up purchase, billing portal, or hosting-add-on administration
- THEN the operation MUST be denied without commercial or provider mutation

#### Scenario: Member consumes funded use

- GIVEN a current Member is authorized for the workspace and all owning-capability gates pass
- WHEN the Member requests an ordinary funded operation
- THEN the reservation evidence MUST identify that Member as the human actor

#### Scenario: Reconciliation worker acts

- GIVEN an authenticated reconciliation operation is assigned an approved system actor
- WHEN it evaluates one workspace operation
- THEN evidence MUST identify the named system actor and bounded action
- AND MUST NOT attribute the action to an Owner

#### Scenario: Authority changes before dispatch

- GIVEN a human passed an earlier check but was removed or lost required authority before commercial admission or provider dispatch
- WHEN current authority is revalidated at the workspace-defined irreversible boundary
- THEN the operation MUST be denied with no new provider effect
- AND a retry MUST resolve current authority again under the same operation identity

### Requirement: CEU-007 — Managed-hosting add-ons are recurring, site-specific, and unique

Commercial MUST model managed hosting as a recurring add-on distinct from the base subscription and linked to one eligible workspace-owned site. Exactly one active application add-on MAY exist for an eligible site. Activation MUST require current Owner authority, active paid base entitlement, confirmed site eligibility and workspace ownership, and an approved hosting price. Commercial evidence MUST stably correlate workspace, site, application add-on, provider subscription item or equivalent object, lifecycle episode, and operation and provider-event identities. Commercial MUST own purchase and entitlement state only; hosting MUST own site and domain execution and lifecycle outcomes.

#### Scenario: Owner activates an eligible site

- GIVEN an Owner has active paid entitlement, approved hosting price, and same-workspace site eligibility
- WHEN recurring add-on activation commits
- THEN exactly one active add-on MUST be correlated to that site

#### Scenario: Concurrent activation races

- GIVEN concurrent checkout, webhook, retry, or activation attempts target the same site
- WHEN they are processed
- THEN no more than one application add-on MAY be active
- AND duplicate provider or application evidence MUST reconcile without duplicate entitlement

#### Scenario: Cross-workspace or ineligible site is supplied

- GIVEN an Owner supplies a site owned by another workspace or a site that hosting has not declared eligible
- WHEN activation is authorized
- THEN activation MUST be denied without disclosing the other site's state or creating a provider object

#### Scenario: Payment exists but hosting activation fails

- GIVEN provider payment or subscription-item evidence exists
- WHEN hosting has not established its owned operational outcome
- THEN commercial MUST NOT represent hosting execution as successful
- AND the disagreement MUST remain correlated and reconcilable

### Requirement: CEU-008 — Commercial evidence is immutable or explicitly superseding and secret-safe

Commercial MUST own authoritative subscription transitions, allowance grants and resets, top-up credits, locks and unlocks, reservations, final debits, releases, hosting-add-on transitions, provider-event processing, adjustments, reversals, denials where required, and reconciliation outcomes. Evidence MUST be append-only or explicitly superseding. Materialized entitlement and balance projections MUST reconcile to retained evidence. Every applicable entry MUST retain workspace, balance or commercial account kind, operation and provider-event identities, human or named system actor, quantity and source bucket, policy version, server timestamp, result, and supersession or reversal linkage. Evidence MUST exclude raw provider secrets, webhook signatures, session or JWT tokens, unrestricted Stripe/provider payloads, message bodies, prompts, credentials, and unnecessary personal data.

#### Scenario: Usage finalizes

- GIVEN a reservation reaches an authoritative chargeable outcome
- WHEN finalization commits
- THEN durable evidence MUST explain the exact monthly and top-up quantities consumed, operation, actor, policy, and time

#### Scenario: Historical entry needs correction

- GIVEN a lawful correction, refund, dispute, or support remediation is approved
- WHEN the correction is recorded
- THEN a named compensating or superseding entry MUST preserve linkage to prior evidence
- AND ordinary application roles MUST NOT rewrite or hard-delete the original entry

#### Scenario: Metadata contains prohibited content

- GIVEN ledger or audit input contains a secret, signature, token, unrestricted provider payload, message, prompt, credential, or excessive personal data
- WHEN evidence is validated
- THEN the prohibited content MUST be rejected or excluded
- AND it MUST NOT appear in client output, logs, or durable commercial metadata

### Requirement: CEU-009 — Reservation contracts are bounded, semantic, and persistence-neutral

Commercial MUST publish a narrow persistence-neutral reservation contract carrying authoritative workspace, balance kind, maximum units, stable semantic operation identity, actor evidence, authority and policy evidence, and bounded expiry and reconciliation state. Equivalent retries MUST converge on the same reservation or result. Reuse of an idempotency key with materially different workspace, balance, maximum quantity, actor, consumer source, or operation semantics MUST return a conflict without mutation. The contract MUST NOT expose commercial table structure or allow a consumer to mutate balances directly.

#### Scenario: Equivalent reservation is retried

- GIVEN a reservation exists for an operation and semantic request
- WHEN the equivalent request is retried with the same key
- THEN commercial MUST return the original reservation or terminal result
- AND MUST NOT reserve units twice

#### Scenario: Key is reused for another semantic request

- GIVEN an idempotency key is bound to one workspace and operation semantics
- WHEN it is reused with a different workspace, balance, quantity, actor, or source identity
- THEN commercial MUST return a semantic-conflict result
- AND MUST leave all reservations and balances unchanged

#### Scenario: Consumer attempts direct balance mutation

- GIVEN a funded capability proposes updating commercial persistence or counters directly
- WHEN the dependency is reviewed
- THEN the proposal MUST be rejected
- AND the consumer MUST use the public commercial contract

#### Scenario: Maximum quantity is unbounded

- GIVEN a consumer cannot supply an approved bounded maximum quantity
- WHEN reservation is requested
- THEN admission MUST be unavailable before provider invocation

### Requirement: CEU-010 — Finalize, release, expiry, expansion, and unknown outcomes preserve provider truth

A known successful provider-owner outcome MUST finalize a reservation exactly once for the authoritative final quantity. A definite pre-acceptance failure MUST release it exactly once. A timeout, crash, uncertain transaction, duplicate request, delayed evidence, or unknown provider acceptance MUST remain pending and reconcilable; it MUST NOT be treated as success or definite failure by assumption. Expiry MUST initiate reconciliation and MUST NOT itself prove provider failure. Finalization below the reservation MAY explicitly release the remainder. Finalization above the reserved maximum MUST be denied unless a separately approved bounded expansion protocol rechecks policy and atomically secures additional units before the effect.

#### Scenario: Provider owner proves success

- GIVEN the owning capability supplies authoritative success evidence under the reserved operation identity
- WHEN finalization is requested for an allowed final quantity
- THEN the debit MUST finalize exactly once
- AND equivalent retries MUST return the same result

#### Scenario: Failure occurred before provider acceptance

- GIVEN the provider owner proves no chargeable effect was accepted
- WHEN release is requested
- THEN the reservation MUST be released exactly once through explicit evidence

#### Scenario: Provider call times out

- GIVEN provider invocation may have occurred but acceptance is unknown
- WHEN the caller times out or crashes
- THEN the reservation MUST remain pending and reconcilable
- AND the operation MUST NOT be reported as safely unsent, released, or successful

#### Scenario: Reservation reaches expiry

- GIVEN a reservation reaches its configured expiry without authoritative outcome evidence
- WHEN expiry processing runs
- THEN reconciliation MUST be queued or continued
- AND elapsed time alone MUST NOT release the units

#### Scenario: Final quantity is lower than reserved

- GIVEN authoritative success consumed fewer units than the reservation maximum
- WHEN finalization commits
- THEN the exact final quantity MUST be debited
- AND the remainder MUST be released through explicit correlated evidence

#### Scenario: Final quantity exceeds the reservation

- GIVEN authoritative final quantity exceeds the reserved maximum
- WHEN no approved bounded expansion protocol has atomically secured the difference before the effect
- THEN expansion and finalization above the maximum MUST be denied or held for reconciliation
- AND the balance MUST NOT become negative

### Requirement: CEU-011 — Payment, webhook, operation, and reconciliation processing is idempotent

Provider webhooks MUST be authenticated before commercial effects and deduplicated by stable provider account and environment, provider event or object identity, and semantic operation identity. Checkout and return routes MUST be presentation or recovery hints only. Duplicate, retried, delayed, and reordered events; partial provider outages; and locally unknown commits MUST NOT duplicate credits, debits, subscriptions, resets, or add-ons. Reconciliation MUST compare provider evidence, application entitlement, ledger and reservations, and provider-owner outcome evidence without treating any one as universally authoritative. Every repair MUST be idempotent, actor-attributed, observable, and represented by new evidence.

#### Scenario: Webhook authentication fails

- GIVEN a payment webhook lacks valid provider authentication
- WHEN it reaches the commercial boundary
- THEN no entitlement, credit, debit, add-on, or reconciliation mutation MUST occur

#### Scenario: Event is delivered repeatedly and out of order

- GIVEN provider events are duplicated, delayed, or reordered
- WHEN they are processed
- THEN they MUST converge on one semantic commercial result
- AND no event MAY duplicate a financial or unit effect

#### Scenario: Checkout return precedes webhook evidence

- GIVEN a browser returns from successful checkout before verified evidence commits
- WHEN entitlement is queried
- THEN the return route MUST NOT grant units or active status
- AND the UI MAY expose only a pending or recovery state

#### Scenario: Application and provider disagree

- GIVEN provider evidence, application entitlement, ledger, reservation, or provider-owner outcome disagree
- WHEN reconciliation runs
- THEN the disagreement MUST remain explicit until resolved by approved evidence
- AND repair MUST append or supersede rather than silently rewrite state

#### Scenario: Known commit response was lost

- GIVEN a commercial effect committed but the caller did not receive the response
- WHEN the caller retries by stable operation identity
- THEN the committed result MUST be recovered
- AND the effect MUST NOT be applied again

### Requirement: CEU-012 — Stripe evidence, app entitlement, ledger state, and provider-owner outcomes remain distinct

Inherited Stripe checkout, subscription, payment, billing portal, and webhook behavior MUST be preserved and extended additively rather than replaced. The system MUST distinguish payment-provider evidence, Jagwar application entitlement, commercial ledger and reservation state, and consumer/provider-owner outcome evidence. Stripe state MUST NOT itself prove available units or consumer success; ledger state MUST NOT interpret provider-specific success; provider-owner evidence MUST NOT mutate entitlement outside commercial contracts. Reconciliation MUST preserve stable correlation across these truths.

#### Scenario: Stripe subscription reports active

- GIVEN Stripe reports a subscription active
- WHEN application transition or required ledger evidence has not committed
- THEN funded admission MUST remain unavailable or pending

#### Scenario: Reservation exists without provider outcome

- GIVEN commercial has reserved units but the consumer owner has no authoritative outcome
- WHEN state is inspected
- THEN the reservation MUST remain pending
- AND neither Stripe state nor reservation state MAY fabricate provider success

#### Scenario: Provider owner reports success

- GIVEN a consumer owner reports authoritative success under a stable identity
- WHEN commercial entitlement is inactive or the reservation cannot be matched
- THEN commercial MUST enter denial or reconciliation according to approved evidence
- AND MUST NOT reinterpret provider success as entitlement

#### Scenario: Stripe extension would replace inherited behavior

- GIVEN a proposed commercial change replaces inherited Stripe behavior instead of adding a narrow approved extension
- WHEN reviewed against this specification
- THEN it MUST be rejected or separately authorized

### Requirement: CEU-013 — Server authorization, Supabase, and RLS isolate every commercial access shape

Every commercial record and operation MUST carry authoritative workspace ownership. Supabase Auth MUST establish the human subject; workspace authority MUST establish current actor, role, and resource ownership; commercial MUST establish entitlement and balance admission; ownership-aware RLS MUST provide defense in depth for every commercial table in an exposed schema. `TO authenticated` alone, `user_metadata`, stale JWT `app_metadata`, client claims, Stripe customer identifiers, and service-role capability MUST NOT authorize access or mutation. Direct, list, aggregate, indirect site or resource, and mixed-batch access MUST be workspace-constrained. Existing and nonexistent unauthorized identifiers MUST receive sanitized non-enumerating denials.

#### Scenario: Direct cross-workspace balance is guessed

- GIVEN a workspace A actor submits a workspace B balance, subscription, add-on, or payment-customer identifier
- WHEN direct access is evaluated
- THEN access MUST be denied before disclosure or mutation
- AND the public result MUST not reveal whether the identifier exists

#### Scenario: List or aggregate attempts enumeration

- GIVEN a workspace A actor requests commercial lists, counts, sums, cursors, or aggregates
- WHEN the query is authorized
- THEN every result and metadata value MUST be constrained to workspace A
- AND workspace B state MUST not influence visible output

#### Scenario: Indirect site relationship crosses workspaces

- GIVEN a workspace A add-on request references a site or project indirectly owned by workspace B
- WHEN ownership is resolved
- THEN authorization MUST fail closed before checkout, provider object creation, or disclosure

#### Scenario: Mixed batch contains another workspace

- GIVEN a mutating or metered batch mixes resources from workspaces A and B under workspace A authority
- WHEN admission is evaluated
- THEN no workspace B item MUST be read, reserved, charged, or dispatched
- AND an allowed item MUST NOT authorize another item

#### Scenario: Removed member retains a valid session

- GIVEN a user has a valid Supabase session or stale claim but current workspace membership was removed
- WHEN the next commercial read or operation is requested
- THEN current application authority MUST deny it
- AND the stale session claim MUST NOT restore access

#### Scenario: Privileged path can bypass RLS

- GIVEN a named webhook, reconciliation, or server operation can use privileged database access
- WHEN it processes workspace-owned commercial state
- THEN it MUST still be server-only, narrowly scoped, workspace-bound, and auditable
- AND no credential or bypass capability MUST reach client output

### Requirement: CEU-014 — Discovery and import receive an exact lead-metering contract

For each intentional fresh DataForSEO discovery run, commercial MUST support reservation and finalization of lead units for unique businesses actually displayed in that run, subject to the approved requested count and available balance. Overlap within one run MUST be deduplicated for metering; a business displayed again in a later fresh run MAY be charged again. Reopening an immutable completed snapshot MUST perform no reservation, provider request, or charge. Import MUST use lead-owned stable import decisions and MUST NOT cause a second lead charge. Discovery MUST own DataForSEO invocation, provider evidence, immutable run snapshots, display eligibility, and displayed-result identity; lead pipeline MUST own business and lead identity.

#### Scenario: Fresh run displays unique businesses

- GIVEN an authorized fresh run has reserved an affordable maximum
- WHEN discovery authoritatively commits a displayed set with duplicate provider businesses removed
- THEN commercial MUST finalize only the unique businesses actually displayed
- AND the run and displayed-result identities MUST correlate the debit

#### Scenario: Available balance caps display

- GIVEN the requested display count exceeds atomically available lead units
- WHEN the fresh run is admitted
- THEN the funded displayed count MUST be bounded by the affordable approved request
- AND lead balance MUST not become negative

#### Scenario: Snapshot is reopened

- GIVEN a completed immutable search snapshot already exists
- WHEN an authorized Member reopens it
- THEN commercial MUST create no reservation or debit
- AND discovery MUST make no new DataForSEO request for that reopen

#### Scenario: Existing lead is imported again

- GIVEN lead pipeline returns an existing or replayed stable import decision for a displayed business
- WHEN import metering reconciles
- THEN commercial MUST NOT create a second import charge
- AND commercial MUST NOT alter lead identity or transition state

### Requirement: CEU-015 — Lead-owned identities and transitions remain outside commercial ownership

Commercial MUST consume stable workspace, lead, import, project-attempt, and source-operation identities needed for idempotency and reconciliation. Lead pipeline MUST remain the authority for business and lead identity, create-or-resolve results, fixed pipeline stages and outcomes, corrections, transitions, and lead-to-project relationships. Commercial MUST NOT create leads, merge identities, infer pipeline state, or charge a retry as a new lead when lead evidence identifies replay or an existing lead.

#### Scenario: Commercial needs a lead identity

- GIVEN a funded consumer references a lead operation
- WHEN commercial creates reservation evidence
- THEN it MUST retain the stable lead-owned identity as correlation only
- AND MUST NOT query or mutate lead internals as identity authority

#### Scenario: Lead transition changes

- GIVEN website or SMS evidence changes a lead stage
- WHEN commercial finalizes associated usage
- THEN commercial MUST NOT derive, override, or duplicate the lead transition

#### Scenario: Lead identity is ambiguous

- GIVEN lead pipeline returns an identity conflict rather than a committed lead result
- WHEN commercial reconciliation evaluates a related reservation
- THEN it MUST retain a non-chargeable pending, release, or conflict result according to approved consumer evidence
- AND MUST NOT choose a lead identity

### Requirement: CEU-016 — Website, Jagwar AI, and CodeSandbox BYOK boundaries are exact

Commercial MUST reserve and finalize Jagwar AI credits around an explicit lead-backed website or AI operation using the website owner's stable operation and authoritative final-quantity evidence. Website creation MUST own prompt and preset semantics, media provenance, project success, lead-project coordination, AI/provider invocation, and the narrow composition into inherited CREATE. CodeSandbox BYOK MUST own workspace credential admission, validation, protected storage, just-in-time use, provider compute, and the prohibition on a Jagwar-funded fallback key. Commercial MAY expose only paid admission and applicable balance status and MUST NOT alter the fixed template, project creation, editor, or CREATE toolchain.

#### Scenario: Eligible website operation reserves AI credits

- GIVEN a current Member, active entitlement, sufficient AI balance, approved conversion, eligible lead, and valid BYOK admission
- WHEN the website owner requests bounded AI reservation
- THEN commercial MAY reserve Jagwar AI credits under the website operation identity

#### Scenario: AI conversion is unavailable

- GIVEN provider cost-to-credit conversion or rounding/final-unit policy is absent or unapproved
- WHEN AI reservation or finalization depends on it
- THEN the AI-funded operation MUST be unavailable before provider invocation

#### Scenario: BYOK credential is missing or invalid

- GIVEN commercial entitlement and AI balance are otherwise valid but CodeSandbox BYOK admission fails
- WHEN website or project access is requested
- THEN the BYOK owner MUST deny its operation
- AND commercial MUST NOT provide or authorize a Jagwar-funded fallback credential

#### Scenario: Website operation outcome is unknown

- GIVEN inherited CREATE or an AI provider may have accepted an effect but success is not authoritative
- WHEN commercial receives no final owner evidence
- THEN the reservation MUST remain pending and reconcilable
- AND commercial MUST NOT claim website or project success

### Requirement: CEU-017 — SMS and Inbox replies use SMS-owned accepted-send evidence

Commercial MUST reserve and finalize SMS units around the SMS owner's authenticated, durable accepted-send semantics and stable operation identity. The SMS owner MUST retain Telnyx lookup, consent and compliance authority, opt-out handling, sender and registration state, templates, preview and confirmation, bounded bulk rules, provider invocation, provider-status interpretation, delivery, and reconciliation. Inbox MUST retain conversations, messages, unread state, notifications, and reply UX; funded outbound replies MUST delegate to SMS admission and commercial reservation. Commercial MUST NOT infer acceptance from preview, confirmation, provider call, delivery, inbound reply, or raw Telnyx payload.

#### Scenario: Confirmed send is durably accepted

- GIVEN a Member has passed SMS-owned preview, confirmation, compliance, sender, and recipient gates and commercial has reserved enough SMS units
- WHEN SMS authority supplies authenticated durable accepted-send evidence
- THEN commercial MUST finalize the applicable SMS units exactly once

#### Scenario: Telnyx rejects before acceptance

- GIVEN Telnyx or the SMS owner proves definite pre-acceptance failure
- WHEN the SMS owner releases the operation
- THEN commercial MUST release the reservation exactly once
- AND lead pipeline MUST receive no accepted-send fact from commercial

#### Scenario: Telnyx outcome is unknown

- GIVEN provider invocation timed out or status order is ambiguous
- WHEN the caller cannot prove acceptance or failure
- THEN the SMS reservation MUST remain pending for SMS-owned reconciliation

#### Scenario: Inbox reply is sent

- GIVEN an authorized active Member replies in a lead-linked Inbox conversation
- WHEN outbound reply admission is requested
- THEN Inbox MUST delegate sending and accepted evidence to SMS ownership
- AND commercial MUST meter through the same SMS contract rather than owning message or conversation data

### Requirement: CEU-018 — Publishing, hosting lifecycle, and owner analytics consume narrow commercial evidence

Commercial MUST expose active base entitlement, exactly-one site-add-on projection, correlated committed commercial events, current balances, and readiness states through intentional public contracts. Hosting MUST own site and domain operation, inherited publishing coordination, public preview behavior, grace, notices, suspension, retention, deletion, and reactivation effects. Owner analytics MUST own projections, checkpoints, derivation versions, staleness, activation, and presentation and MUST consume stable committed event identities rather than client counters or commercial table internals. Commercial MUST NOT process operator-to-client website sales.

#### Scenario: Provider-funded publishing is requested while inactive

- GIVEN a workspace subscription is inactive
- WHEN provider-funded editing or publishing is requested
- THEN commercial admission MUST be denied immediately
- AND hosting lifecycle MUST independently preserve any approved public-site grace behavior

#### Scenario: Hosting reads add-on entitlement

- GIVEN hosting evaluates one eligible workspace-owned site
- WHEN it reads the commercial public contract
- THEN it MUST receive base entitlement, site-add-on state, and stable correlation only
- AND it MUST retain ownership of operational lifecycle outcomes

#### Scenario: Owner analytics reads balances

- GIVEN a current Owner requests workspace analytics
- WHEN analytics consumes the commercial read contract
- THEN it MUST receive current workspace-scoped balance and readiness projections with stable source identities
- AND it MUST own staleness, reconciliation, and presentation

#### Scenario: Won website sale is recorded

- GIVEN lead pipeline records a Won amount and currency for analytics
- WHEN commercial processes workspace billing
- THEN it MUST NOT invoice, collect, settle, refund, or otherwise process the operator-to-client sale

### Requirement: CEU-019 — Capability ownership and dependency direction are preserved

Commercial MUST own only subscription and entitlement transitions, three balance accounts, allowance periods and resets, bundled top-ups, reservations and ledger evidence, commercial provider-event processing, managed-hosting purchase and add-on entitlement, and commercial reconciliation. Workspace authority MUST own actor, role, membership, resource authorization, and authority audit; lead pipeline MUST own identity and transitions; provider capabilities MUST own execution and provider-specific evidence; hosting MUST own site lifecycle; analytics MUST own derived projections. Every consumer MUST use intentional public contracts, MUST NOT query sibling persistence or deep-import internals, and commercial MUST NOT import sibling capability internals.

#### Scenario: Consumer proposes querying ledger tables

- GIVEN a consumer proposes direct commercial-table access instead of the public contract
- WHEN dependency direction is reviewed
- THEN the dependency MUST be rejected

#### Scenario: Commercial proposes interpreting provider payloads

- GIVEN DataForSEO, AI, Telnyx, CodeSandbox, or hosting-specific evidence requires domain interpretation
- WHEN ownership is evaluated
- THEN the provider-owning capability MUST interpret it
- AND commercial MUST consume only its bounded public outcome evidence

#### Scenario: Workspace authority is unavailable

- GIVEN commercial planning exists but approved workspace-authority runtime evidence is unavailable
- WHEN any production commercial read, administration, reservation, top-up, or add-on operation is requested
- THEN production composition MUST fail closed
- AND no substitute based on project role, JWT, client selection, Stripe customer, user ownership, or service role MAY be used

### Requirement: CEU-020 — Rollout, failure behavior, reconciliation, and observability are explicit

Commercial rollout MUST be dependency-ordered and MUST keep provider-funded entry points disabled until workspace authority, approved configuration, provider accounts and credentials, webhook authentication, consumer evidence contracts, reconciliation workers, monitoring, support, security, privacy, legal, tax, invoicing, and billing-retention readiness applicable to that entry point are approved. Failures MUST be typed and fail closed. Observable states MUST include policy unavailable, entitlement denial, reservation admitted or denied or pending or expired, final-unit competition, replay, semantic conflict, unknown outcome age, webhook authentication or ordering failure, provider/application disagreement, projection mismatch, reset duplication, locked top-ups, bundle atomicity failure, add-on uniqueness conflict, and reconciliation backlog and outcome. Logs and metrics MUST use bounded opaque identifiers and result codes without secrets or unrestricted payloads.

#### Scenario: Capability is enabled before prerequisites

- GIVEN a funded entry point lacks an approved prerequisite or operational readiness evidence
- WHEN rollout attempts to enable it
- THEN the entry point MUST remain disabled or unavailable

#### Scenario: Ledger projection disagrees with evidence

- GIVEN a materialized balance or entitlement does not reconcile to retained evidence
- WHEN the mismatch is detected
- THEN new unsafe admission MUST be denied or constrained according to approved policy
- AND the mismatch MUST enter observable reconciliation

#### Scenario: Webhook backlog grows

- GIVEN authenticated provider events remain pending beyond their approved operational threshold
- WHEN observability evaluates the backlog
- THEN the system MUST surface bounded actionable status to the responsible operator
- AND MUST NOT expose provider secrets or another workspace's details

#### Scenario: Known committed debit cannot be reported

- GIVEN a debit committed but downstream reporting failed
- WHEN the operation is retried
- THEN commercial MUST recover the committed result by operation identity
- AND MUST NOT debit again

#### Scenario: Privileged manual repair is needed

- GIVEN automated reconciliation cannot resolve a commercial disagreement
- WHEN an approved narrow support, security, or finance operation performs repair
- THEN the repair MUST be actor-attributed, idempotent, and represented by compensating or superseding evidence
- AND an unlogged row edit MUST NOT be permitted

### Requirement: CEU-021 — Unresolved commercial and operational decisions remain launch blockers

The system MUST keep the applicable operation unavailable until approved, versioned decisions exist for: Starter/Pro/Scale identities, prices, and monthly quantities; bundle price and all three quantities; AI conversion, rounding, and final-unit rules; hosting price and provider item model; plan-change effective time, proration, allowance adjustment, carry, cancellation, and reactivation semantics; refund, dispute, chargeback, reversal, and insufficient-remaining-balance handling; reservation windows, maximum duration, bounded expansion, final-quantity adjustment, reconciliation owner, and SLOs; hosting cancellation timing, proration, item reuse, and reactivation; Data API and privileged/manual repair access; audit visibility and retention; and operational, security, privacy, legal, tax, invoicing, provider-account, credential, scheduler, monitoring, support, and compliance readiness. Historical code, Stripe configuration, BMAD/Telio material, provider defaults, and provisional assumptions MUST NOT resolve these decisions.

#### Scenario: Mid-cycle plan change lacks policy

- GIVEN an Owner requests an upgrade or downgrade and effective-time, proration, or allowance rules are unapproved
- WHEN the plan change is admitted
- THEN the change MUST remain unavailable or pending without altering current approved entitlement or allowances

#### Scenario: Refund follows consumed top-up units

- GIVEN a refund, dispute, or chargeback affects a bundle whose units may have been consumed
- WHEN negative-adjustment and shortfall policy is unapproved
- THEN the system MUST retain explicit restricted reconciliation state
- AND MUST NOT silently create a negative balance, erase history, or invent debt treatment

#### Scenario: Reservation duration is unapproved

- GIVEN a consumer lacks approved expiry, maximum duration, reconciliation owner, or SLO
- WHEN production reservation admission is requested
- THEN that consumer's funded operation MUST remain unavailable

#### Scenario: Hosting cancellation semantics are unapproved

- GIVEN add-on cancellation or reactivation requires a decision about timing, proration, provider-item reuse, or billing relative to public grace
- WHEN no joint commercial and hosting approval exists
- THEN the dependent add-on transition MUST remain unavailable or explicitly pending
- AND commercial MUST NOT infer the rule from provider behavior

#### Scenario: Manual repair authority is unapproved

- GIVEN commercial evidence requires a compensating repair
- WHEN exact privileged role, approval threshold, Owner-visible detail, or retention policy is unresolved
- THEN manual repair MUST remain restricted and unavailable except under separately approved authority

#### Scenario: Operational or compliance readiness is absent

- GIVEN Stripe account mapping, webhook credentials, workers, monitoring, tax/invoicing, billing retention, security, privacy, legal, or compliance readiness is missing for an operation
- WHEN launch admission is evaluated
- THEN that operation MUST remain unavailable without fabricated readiness

### Requirement: CEU-022 — Inherited Onlook and Stripe behavior is preserved additively

This change MUST extend inherited Stripe and Onlook behavior only through separately approved narrow additive boundaries. It MUST NOT authorize touching, wrapping, restructuring, replacing, or reinterpreting the editor, AI CREATE flow, fixed CodeSandbox template, inherited publishing behavior, project lifecycle, source export, or customer-controlled Git. It MUST NOT create a second generator or publisher. Existing inherited Projects, settings, authenticated editor and project routes, UI, and Stripe behavior MUST remain intact except where a later capability specification and exact protected approval authorize a minimal extension.

#### Scenario: Commercial integration proposes an editor or CREATE change

- GIVEN a proposed commercial implementation would modify the editor, CREATE flow, or fixed template
- WHEN reviewed against this specification
- THEN it MUST be rejected or moved to a separately approved capability change

#### Scenario: Add-on work proposes replacing publishing

- GIVEN managed-hosting integration proposes a second publisher or replacement of inherited publishing
- WHEN reviewed
- THEN it MUST be rejected
- AND hosting MUST use a separately approved narrow inherited seam

#### Scenario: Existing project behavior is reinterpreted as entitlement

- GIVEN an inherited project, export, Git relationship, or route state exists
- WHEN commercial authority is evaluated
- THEN that inherited state MUST NOT itself grant subscription, balance, or add-on entitlement

### Requirement: CEU-023 — Future delivery follows exact governed Strict-TDD slices

Any future implementation MUST be dependency-ordered into cohesive, independently reversible and reviewable slices of 250–400 changed lines, including tests and the slice manifest. Each slice MUST follow `RED → GREEN → TRIANGULATE → REFACTOR`: retain a relevant failing test first, make the smallest passing change, add adversarial cases, and refactor only while green. A transactional invariant MUST NOT be split merely to satisfy size. Auto-forecast MUST recommend chained delivery whenever aggregate or candidate work risks exceeding 400 changed lines. Before each governed slice edit, exactly one reviewed `architecture/slices/<slice>.json` MUST name every governed path, capability, owning runtime, role, and correct baseline classification. Before each protected inherited file edit, a new per-file CCR MUST name that exact path and exact candidate resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the manifest. A truthful resulting hash MUST NOT be claimed before the exact candidate patch exists. Generated migrations MUST remain maintainer-owned; agents MUST NOT run `db:gen`, edit generated output, edit `bun.lock`, or clean unrelated work.

#### Scenario: Slice forecast exceeds 400 lines

- GIVEN a future candidate slice is forecast above 400 changed lines
- WHEN delivery is planned
- THEN auto-forecast MUST require a dependency-ordered chained split at safe invariant boundaries
- AND implementation MUST not proceed as one oversized slice without explicit governance resolution

#### Scenario: Slice has no exact reviewed manifest

- GIVEN a future commercial slice is otherwise ready
- WHEN any governed path edit is proposed without exactly one reviewed manifest naming it
- THEN the edit MUST remain blocked

#### Scenario: Protected candidate has no exact hash approval

- GIVEN a protected inherited file has an exact candidate patch
- WHEN no new approved per-file CCR names its exact path and resulting SHA-256
- THEN the protected edit MUST remain blocked
- AND a prior CCR, wildcard, intent approval, or planning artifact MUST NOT authorize it

#### Scenario: Hash is requested before candidate content exists

- GIVEN no exact candidate resulting file exists
- WHEN a resulting SHA-256 is requested for approval
- THEN the hash MUST be reported unavailable rather than fabricated

#### Scenario: Migration or lockfile would change

- GIVEN future database or dependency work would generate a migration, generated artifact, or `bun.lock` change
- WHEN an agent reaches that step
- THEN maintainer-owned generation or governance MUST take over
- AND the agent MUST NOT run `db:gen` or edit those files

### Requirement: CEU-024 — Rollback preserves commercial truth and known governance status

Runtime rollback MUST stop new checkout, admission, and provider dispatch while preserving subscription transitions, allowance periods, top-up credits and locks, reservations, debits, releases, reversals, add-on identities, provider events, unknown outcomes, reconciliation state, and audit or legal evidence. Rollback MUST NOT erase ledger history, unlock inactive funds, restore removed-member access, duplicate provider objects, silently alter balances, or reinterpret a committed effect as absent; corrections MUST use explicit compensating or superseding evidence. Protected rollback content MUST require its own exact candidate hash and approval. The known deferred architecture-gate error involving `.gitignore` and `.atl/` MUST prevent an architecture-pass claim but MUST NOT block this planning specification; existing `packages` and `packages/business-policy` size findings MUST remain warnings only and MUST NOT authorize unrelated cleanup.

#### Scenario: Commercial rollout is disabled

- GIVEN rollback disables new commercial entry points
- WHEN existing committed and pending records are inspected
- THEN all commercial truth and reconcilable unknown outcomes MUST remain retained
- AND no new provider dispatch MUST occur

#### Scenario: Protected rollback is proposed

- GIVEN rollback would change a protected inherited file
- WHEN no new CCR approves the exact rollback candidate SHA-256
- THEN the rollback edit MUST remain blocked

#### Scenario: Planning status is reported

- GIVEN this specification phase is complete while the deferred `.gitignore` `.atl/` governance error remains
- WHEN status is reported
- THEN no architecture-pass claim MUST be made
- AND the error MUST be identified as deferred and non-blocking for planning while package-size findings remain warnings only
