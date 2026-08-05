# SMS Orchestration Specification

## Purpose

Define Telnyx sender lifecycle, lookup and compliance boundaries, templates, confirmed individual and bounded bulk sends, SMS metering, and audit. This capability depends on workspace authority, active SMS entitlement and ledger, and lead identity; its accepted events feed Inbox and analytics.

## Requirements

### Requirement: V1 outbound is US regular SMS through Jagwar Telnyx

V1 MUST support US-only regular SMS through a Jagwar-owned Telnyx account, with one dedicated US sender per workspace. WhatsApp and Blue Send MUST NOT be included. Telnyx registration details and provider limits MUST remain configurable launch blockers.

#### Scenario: Workspace sender is approved

- GIVEN registration and sender approval are complete for a workspace
- WHEN an eligible US SMS is confirmed
- THEN the server MAY send it through that workspace's dedicated sender subject to all other gates

### Requirement: Outbound fails closed on provider and compliance state

Telnyx lookup MUST determine mobile versus landline; Jagwar MUST NOT infer line type. Consent and compliance authority MUST come from Telnyx or another external non-AI authority. Pending registration or sender approval, rejection, landline status, opt-out, unknown required authority, or provider unavailability MUST block outbound without usage debit.

#### Scenario: Approval is pending

- GIVEN a workspace sender is pending approval
- WHEN a user confirms an outbound send
- THEN the server MUST block sending while preserving setup, leads, templates, and previews

#### Scenario: Recipient has opted out

- GIVEN an authoritative opt-out signal exists
- WHEN any outbound send is requested for that recipient
- THEN the system MUST reject it before provider invocation and metering

### Requirement: Templates use fixed validated fields

The system MUST provide default SMS templates, and Owners MUST manage workspace templates. Templates MUST allow only fixed validated personalization fields. Final default template content MUST remain a launch blocker until approved.

#### Scenario: Template uses an unsupported field

- GIVEN an Owner submits a template with an unsupported personalization field
- WHEN validation runs
- THEN the template MUST be rejected without replacing the current version

### Requirement: Every send requires preview and explicit confirmation

Individual and bounded bulk sends MUST present the rendered message preview, recipient count, usage estimate, and explicit confirmation before sending. Automatic unattended campaigns MUST be prohibited. Provider limits MUST cap bulk size and MUST fail closed when unavailable.

#### Scenario: User confirms a valid bounded send

- GIVEN every recipient is eligible, the preview and estimate are current, and sufficient SMS balance exists
- WHEN an authorized user explicitly confirms
- THEN the server MUST submit the bounded messages and record the acting member

#### Scenario: Preview becomes stale

- GIVEN recipient eligibility, rendered content, estimate, or balance changed after preview
- WHEN confirmation is submitted
- THEN the server MUST reject or require a refreshed preview rather than send stale content

### Requirement: Sending and metering are idempotent and concurrency-safe

Each outbound message MUST have a stable operation identity. A provider-accepted message MUST consume SMS allowance exactly once, monthly before top-up, and MUST retain lead, workspace, sender, recipient, acting member, provider message identity, status, and timestamps. Retries or concurrent confirmations MUST NOT duplicate sends or debits; ambiguous provider outcomes MUST remain reconcilable and MUST NOT be reported as safely unsent.

#### Scenario: Confirmation is retried after provider acceptance

- GIVEN Telnyx accepted a message for an operation identity
- WHEN the client retries confirmation
- THEN the system MUST return the recorded outcome without a second send or debit

### Requirement: Provider events are authenticated and durable

Inbound, delivery, rejection, and opt-out events MUST be authenticated as provider-originated, deduplicated, durably persisted by their owning messaging or Inbox capability, and correlated where possible without trusting client input. Raw provider credentials MUST remain server-only.

#### Scenario: Duplicate delivery webhook arrives

- GIVEN a delivery event was already recorded
- WHEN Telnyx redelivers it
- THEN status and analytics MUST NOT be counted twice
