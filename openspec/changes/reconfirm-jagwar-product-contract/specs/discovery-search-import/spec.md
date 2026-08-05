# Discovery, Search Snapshot, and Import Specification

## Purpose

Define server-only DataForSEO discovery, immutable displayed snapshots, lead metering, and deduplicated import. This capability depends on workspace authority, active lead entitlement and ledgers, and authoritative lead identity/pipeline persistence.

## Requirements

### Requirement: Search inputs are bounded and policy-driven

The system MUST expose the searchable DataForSEO category catalog and MUST accept no more than ten categories and ten city, postal, or address-plus-radius locations per logical search. The default policy MUST select businesses with no standalone website, meaning no URL or only a social or directory URL, while allowing an operator to deliberately broaden it. Exact result-count and radius options MUST remain configurable launch blockers and MUST NOT be invented.

#### Scenario: Operator submits a valid default search

- GIVEN active entitlement, sufficient lead balance, and valid configured search options
- WHEN the operator submits bounded categories and locations without broadening the website policy
- THEN the server MUST request only the default no-standalone-website population

#### Scenario: Input exceeds a bound

- GIVEN a request has more than ten categories or locations
- WHEN it is validated
- THEN the system MUST reject it before provider invocation or metering

### Requirement: Every intentional fresh search invokes the provider once

Every confirmed new search MUST invoke DataForSEO even when its normalized request matches an earlier search. Reopening an existing run MUST perform no provider request and MUST incur no provider or lead charge. Provider credentials and raw payload handling MUST remain server-only.

#### Scenario: Identical search is intentionally run again

- GIVEN an earlier completed run has the same normalized request
- WHEN the operator confirms a fresh search
- THEN the server MUST create a distinct run and invoke DataForSEO once

#### Scenario: Snapshot is reopened

- GIVEN a completed immutable run exists
- WHEN a member reopens it
- THEN the stored displayed snapshot MUST be returned without provider invocation or balance debit

### Requirement: Display metering is capped, unique, and atomic

The requested displayed count MUST be capped by available lead balance. A completed fresh run MUST charge exactly once for each unique business displayed in that run, MUST deduplicate overlap within the run, and MUST charge a business again if displayed by a later fresh run. Import MUST NOT create a second lead charge. Concurrent completion or retry MUST NOT double-debit a run or make the balance negative.

#### Scenario: Provider returns more matches than affordable

- GIVEN the provider returns more matching businesses than the workspace can afford to display
- WHEN the run completes
- THEN the user-visible immutable snapshot MUST contain only the capped displayed set
- AND the debit MUST equal the number of unique displayed businesses
- AND the UI MUST provide clear upgrade or top-up guidance

#### Scenario: Completion is retried concurrently

- GIVEN two workers finalize the same provider task and logical run
- WHEN both attempt to persist the snapshot and usage
- THEN exactly one immutable completion and one debit MUST be committed

### Requirement: Snapshots preserve evidence without leaking undisplayed leads

Each completed run MUST persist workspace ownership, normalized request, immutable displayed result snapshot, provider task ID, API version, provider cost, provider status, and timestamps. Server-side provider-response or audit evidence MAY retain undisplayed matches under access controls, but user-visible snapshot and import interfaces MUST NOT expose or make undisplayed businesses available without a new authorized and charged operation.

#### Scenario: Audit evidence includes undisplayed matches

- GIVEN restricted provider evidence contains matches outside the displayed cap
- WHEN a workspace member reopens or imports from the run
- THEN only the immutable displayed set MUST be available

### Requirement: Import is workspace-deduplicated and lead-owned

Search results already represented by a workspace lead MUST be marked `Already in pipeline` and MUST NOT be imported again. Operators MAY import one eligible result, a selection, or all eligible displayed results. The server MUST enforce authoritative workspace-scoped identity and idempotency; lead records MUST be persisted by the lead/pipeline capability, while discovery retains the source-run linkage.

#### Scenario: Two imports race for the same business

- GIVEN an eligible displayed business is not yet a workspace lead
- WHEN concurrent imports request it
- THEN exactly one lead MUST be created
- AND both outcomes MUST resolve to that authoritative lead without duplicate charge

#### Scenario: Provider or persistence fails

- GIVEN DataForSEO fails or snapshot-and-metering persistence cannot commit atomically
- WHEN a fresh search executes
- THEN the system MUST report failure without a completed snapshot or lead debit
