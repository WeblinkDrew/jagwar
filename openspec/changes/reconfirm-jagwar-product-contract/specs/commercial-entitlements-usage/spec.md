# Commercial Entitlements and Usage Specification

## Purpose

Define paid workspace entitlements, distinct shared balances, bundled top-ups, hosting add-ons, and auditable usage. This capability depends on workspace identity and actor authority and is a prerequisite for every provider-funded operation and hosting lifecycle.

## Requirements

### Requirement: Paid entitlement controls funded operations

The system MUST derive provider-funded lead discovery, AI generation, SMS sending, Jagwar-managed hosting, and provider-funded editing or publishing authority from server-held workspace subscription state. Workspace setup, membership, and integration configuration MAY occur before payment. Plan prices and monthly quantities MUST remain configurable launch-blocking policy inputs and MUST NOT receive fabricated defaults.

#### Scenario: Active paid workspace performs an entitled operation

- GIVEN a workspace has an active paid Starter, Pro, or Scale subscription and sufficient operation-specific balance
- WHEN an authorized member requests a provider-funded operation
- THEN the server MUST authorize it under the active entitlement and record the acting member

#### Scenario: Subscription becomes inactive

- GIVEN a workspace subscription is inactive
- WHEN a member requests provider-funded editing, generation, discovery, SMS sending, hosting activation, or publishing
- THEN the server MUST block the operation immediately without provider cost or balance mutation
- AND any separate public-site grace behavior MUST be governed by the publishing and hosting lifecycle capability

### Requirement: Balances remain distinct, shared, and non-negative

The system MUST maintain separate workspace-scoped lead, Jagwar AI credit, and SMS balances, each split into monthly allowance and non-expiring top-up balance. It MUST consume the applicable monthly allowance before top-up balance, MUST reset only monthly allowances on the configured billing boundary, MUST impose no artificial daily cap, and MUST never allow a balance to become negative.

#### Scenario: Usage consumes monthly allowance first

- GIVEN a workspace has sufficient monthly and top-up units for an operation
- WHEN usage is committed
- THEN the system MUST debit only the applicable balance
- AND MUST consume monthly units before top-up units

#### Scenario: Concurrent requests compete for the last units

- GIVEN two authorized requests concurrently require more units than remain
- WHEN the server commits their usage
- THEN at most the affordable request MUST succeed
- AND the other MUST fail without provider invocation or negative balance

### Requirement: Bundled top-ups are atomic and locked during inactivity

A top-up purchase MUST add its configured fixed quantities to all three distinct top-up balances as one atomic commercial event. The configured price and quantities MUST remain launch blockers until supplied. Top-up units MUST NOT expire and MUST remain preserved but unusable while the subscription is inactive.

#### Scenario: Replayed payment event is idempotent

- GIVEN a top-up payment event has already been applied
- WHEN the same provider event is delivered again
- THEN the system MUST NOT add any balance twice
- AND MUST retain one auditable purchase record

#### Scenario: Subscription reactivates

- GIVEN preserved top-up units were locked during inactivity
- WHEN paid entitlement becomes active again
- THEN the system MUST make the preserved units available without recreating or resetting them

### Requirement: Hosting add-ons remain site-specific

The system MUST model Jagwar-managed hosting as a recurring per-site add-on distinct from the base subscription. Its price MUST be configurable and launch-blocking until confirmed. Duplicate or concurrent activation for the same site MUST NOT create multiple active add-ons.

#### Scenario: Owner activates hosting for one site

- GIVEN an Owner has active paid entitlement and a confirmed hosting add-on price
- WHEN the Owner confirms hosting for an eligible site
- THEN the system MUST establish exactly one recurring add-on linked to that site

### Requirement: Usage and billing evidence is durable and safe

The commercial capability MUST own authoritative subscription, allowance, top-up, hosting-add-on, and usage-ledger records. Every committed debit, credit, reset, lock, unlock, and provider-funded denial MUST be attributable to workspace, operation identity, acting member or system actor, quantity, balance source, and timestamp. Raw provider secrets MUST NOT appear in client responses or audit evidence.

#### Scenario: Operation retry uses the same idempotency identity

- GIVEN usage was committed for an operation identity
- WHEN that operation is retried
- THEN the system MUST return the prior metering outcome without a second debit

#### Scenario: Ledger persistence fails

- GIVEN a funded operation cannot atomically persist its usage evidence
- WHEN authorization is attempted
- THEN the system MUST fail closed without invoking the provider or exposing a successful outcome
