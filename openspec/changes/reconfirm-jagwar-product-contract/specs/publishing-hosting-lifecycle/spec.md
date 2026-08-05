# Publishing and Hosting Lifecycle Specification

## Purpose

Define preservation of inherited publishing, managed hosting add-ons, domains, cancellation grace, suspension, retention, deletion, export, and Git transfer. This capability depends on workspace authority, subscription and per-site hosting entitlement, and project ownership.

## Requirements

### Requirement: Inherited publishing and previews remain intact

The system MUST preserve existing Onlook publishing behavior. A public project preview MUST use a freestyle hostname, MUST remain a stable mutable preview updated by republishing, and MUST gain no new protection or client portal. Editor and project URLs MUST remain authenticated.

#### Scenario: Subscribed user republishes a preview

- GIVEN the workspace is active and project access gates pass
- WHEN an authorized user republishes through inherited publishing
- THEN the same public preview identity MUST reflect the new publication

### Requirement: Managed hosting is site-specific and domain-capable

Jagwar-managed hosting MUST require an active recurring per-site hosting add-on and MUST provide a preview subdomain with optional custom domain. Hosting price, provider account readiness, and domain infrastructure MUST remain launch blockers until configured. Concurrent activation MUST NOT create duplicate hosting entitlements or conflicting domain ownership.

#### Scenario: Owner configures an available custom domain

- GIVEN the site has active hosting entitlement and domain prerequisites pass
- WHEN the Owner confirms the custom domain
- THEN the domain MUST be linked to that site with auditable ownership state

### Requirement: Inactivity blocks funded operations but preserves public grace

When the subscription becomes inactive, provider-funded editing, generation, creation, and publishing operations MUST block immediately. An already-published Jagwar-hosted site MUST remain publicly available for a separate 14-day grace period. The grace MUST NOT authorize editing or republishing.

#### Scenario: Cancellation starts grace

- GIVEN a hosted site is published when its workspace subscription becomes inactive
- WHEN grace begins
- THEN the existing public site MUST remain available
- AND provider-funded editing and publishing MUST be blocked immediately

#### Scenario: Subscription reactivates during grace

- GIVEN a site is still in grace
- WHEN subscription and hosting entitlement become active again
- THEN suspension MUST be canceled without changing the public site identity

### Requirement: Grace communication is deterministic and idempotent

The system MUST show a persistent in-product grace banner and MUST send Owner emails at grace start and 7, 3, and 1 days remaining. Repeated lifecycle processing MUST NOT send the same site-and-milestone notice more than once, while delivery attempts and outcomes MUST remain auditable.

#### Scenario: Grace scheduler retries a milestone

- GIVEN the 7-day notice was already accepted for delivery
- WHEN lifecycle processing retries that milestone
- THEN the system MUST NOT create a duplicate 7-day Owner email

### Requirement: Expired sites suspend neutrally

After the 14-day grace expires without reactivation, the public site MUST show a neutral unavailable page. Suspension MUST preserve recoverable project and domain state during retention and MUST NOT expose workspace, billing, or cancellation details publicly.

#### Scenario: Grace expires

- GIVEN no qualifying entitlement was restored during grace
- WHEN the grace deadline passes
- THEN the public hostname MUST show the neutral unavailable page

### Requirement: Retention and deletion are explicit

Recoverable projects, leads, searches, conversations, and suspended-site data MUST be retained for 90 days after expiry and then deleted after notice. Legally required billing and audit records MAY remain separately and MUST be access-controlled. Lifecycle transitions, notices, holds, deletion attempts, and outcomes MUST be durable and idempotent.

#### Scenario: Retention deadline passes without legal hold

- GIVEN the 90-day retention period and required notice have completed
- WHEN deletion processing runs
- THEN recoverable product data MUST be deleted once
- AND separately required billing or audit records MAY remain

#### Scenario: Deletion partially fails

- GIVEN deletion cannot complete across all owned records
- WHEN processing fails
- THEN the lifecycle MUST remain incomplete and retryable
- AND the system MUST NOT report full deletion

### Requirement: Export and external hosting remain customer-controlled

Users MUST retain full source export and customer-controlled Git transfer. Externally hosted projects MUST remain editable while subscribed. Managed migration of external hosting MUST NOT be included in V1.

#### Scenario: Subscribed user exports a project

- GIVEN an authorized subscribed user owns an eligible project
- WHEN source export or customer-controlled Git transfer is requested
- THEN inherited export or transfer behavior MUST remain available
