# Lead Pipeline Specification

## Purpose

Define authoritative workspace lead identity, fixed pipeline state, website relationships, outcomes, and corrections. This capability depends on workspace authority and is a prerequisite for discovery import, website creation, messaging, Inbox, and analytics.

## Requirements

### Requirement: V1 pipeline is fixed and workspace-owned

The system MUST persist workspace-owned leads with the fixed stages New lead, Website building, Contacted, and Closed. Closed MUST include exactly one Won or Lost outcome. Custom stages MUST NOT be supported in V1.

#### Scenario: Lead is imported

- GIVEN an eligible business is imported into a workspace
- WHEN lead creation commits
- THEN one authoritative lead MUST begin in New lead unless a separately recorded triggering action atomically establishes a later stage

#### Scenario: Closed lead lacks an outcome

- GIVEN a request moves a lead to Closed without Won or Lost
- WHEN the server validates it
- THEN the request MUST be rejected without changing the stage

### Requirement: Automatic transitions follow successful actions

Successful start of website work MUST move the lead to Website building. Successful first SMS send MUST move it to Contacted. Website lifecycle MUST remain independent of pipeline stage so later manual stage changes do not destroy website state.

#### Scenario: First website creation succeeds

- GIVEN a lead is in New lead
- WHEN its first lead-backed website is successfully created
- THEN the lead MUST move to Website building
- AND the website relationship MUST persist independently

#### Scenario: SMS provider rejects the first send

- GIVEN a lead has never had a successful SMS send
- WHEN an attempted send fails before acceptance
- THEN the lead MUST NOT automatically move to Contacted

### Requirement: Authorized users may correct state without erasing history

Authorized workspace members MUST be able to manually correct pipeline stage and Won/Lost outcome. Every automatic and manual transition MUST retain actor, source action, prior state, resulting state, and timestamp audit evidence. Concurrent stale transitions MUST NOT silently overwrite a newer state.

#### Scenario: Member corrects an automatic transition

- GIVEN a successful action automatically changed a lead stage
- WHEN an authorized member submits a valid correction against the current version
- THEN the corrected state MUST become current
- AND both transitions MUST remain auditable

### Requirement: Won value is optional and external

A Won lead MAY record an amount and currency for workspace analytics. Jagwar MUST NOT process or settle the operator-to-client website sale.

#### Scenario: Owner records a deal value

- GIVEN a lead is Won
- WHEN an authorized member records a valid amount and currency
- THEN the values MUST be retained for analytics without creating a Jagwar payment transaction
