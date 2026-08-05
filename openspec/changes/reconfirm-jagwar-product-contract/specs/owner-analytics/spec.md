# Owner Analytics Specification

## Purpose

Define Owner-visible workspace analytics and first lead-backed website activation measurement. This capability depends on authoritative workspace, commercial ledger, lead/pipeline, discovery, website, SMS/Inbox, and hosting events.

## Requirements

### Requirement: Owner analytics use authoritative workspace events

The system MUST provide Owners workspace-scoped measures for discovered and imported leads, websites created, SMS sent, delivered, and replied, Won and Lost outcomes, optional deal amount and currency, and current lead, AI, and SMS balances. Measures MUST be derived from authoritative owned records rather than client-reported counters.

#### Scenario: Owner views current analytics

- GIVEN authoritative events exist for one workspace
- WHEN an Owner opens analytics
- THEN the displayed measures MUST include only that workspace's committed records and current balances

#### Scenario: Member requests Owner analytics

- GIVEN a Member lacks Owner authority
- WHEN the Member requests Owner analytics directly
- THEN the server MUST deny the request regardless of UI visibility

### Requirement: Event counting is idempotent and semantically distinct

Provider retries, operation retries, and duplicate delivery events MUST NOT double-count analytics. Discovered leads MUST reflect unique businesses displayed per completed run under discovery semantics; imported leads MUST reflect authoritative lead creation; SMS sent, delivered, and replied MUST remain distinct measures.

#### Scenario: Delivery webhook is replayed

- GIVEN one SMS delivery event was already counted
- WHEN the same provider event is replayed
- THEN delivered count MUST remain unchanged

### Requirement: Activation is the first successful lead-backed website

The activation milestone MUST occur when the workspace successfully creates its first website backed by an authoritative lead. Failed attempts, non-lead inherited projects, duplicate retries, and later websites MUST NOT create additional activation milestones.

#### Scenario: First lead-backed creation succeeds

- GIVEN the workspace has no activation milestone
- WHEN its first lead-backed website creation commits successfully
- THEN exactly one durable activation milestone MUST be recorded

#### Scenario: Concurrent first creations complete

- GIVEN two lead-backed websites complete concurrently before activation exists
- WHEN both outcomes are processed
- THEN the workspace MUST retain exactly one activation milestone with deterministic evidence

### Requirement: Analytics preserve privacy, auditability, and currency meaning

Analytics persistence MUST retain source event identity, workspace ownership, timestamps, and derivation version sufficient for reconciliation. Optional Won amounts MUST retain their recorded currency and MUST NOT be silently aggregated across currencies as one monetary total without an explicit conversion policy. Raw provider credentials and restricted provider payloads MUST NOT be exposed.

#### Scenario: Won outcomes use different currencies

- GIVEN a workspace has Won amounts in multiple currencies and no approved conversion policy
- WHEN analytics are displayed
- THEN values MUST remain separated by currency rather than shown as a misleading combined total

### Requirement: Analytics tolerate unavailable dependencies honestly

When a source capability is unavailable or reconciliation is incomplete, analytics MUST identify the affected measure as unavailable or stale and MUST NOT fabricate a value. Deferred commercial quantities and provider limits MUST NOT be inferred through analytics.

#### Scenario: Current balance cannot be read authoritatively

- GIVEN the commercial ledger is unavailable
- WHEN an Owner requests analytics
- THEN current balances MUST be marked unavailable rather than displayed from stale client state
