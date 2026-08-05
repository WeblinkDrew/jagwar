# Product Contract Governance Specification

## Purpose

Define cross-capability product boundaries, inherited-behavior preservation, localization, deferred policy inputs, and planning-only delivery governance. Every other specification in this change depends on these constraints.

## Requirements

### Requirement: Jagwar serves operators through shared workspaces

Jagwar MUST treat solo entrepreneurial operators as its subscribers and workspace users. Discovered local businesses MUST remain leads or clients and MUST NOT become Jagwar subscriber accounts merely by being discovered, contacted, hosted, or marked Won.

#### Scenario: Operator imports a business

- GIVEN a subscribed operator discovers a local business
- WHEN the business is imported and later contacted
- THEN the business MUST remain a workspace lead or client
- AND MUST NOT receive a Jagwar subscription account automatically

### Requirement: Inherited Onlook behavior is preserved additively

Future capabilities MUST preserve inherited Projects, the fixed CodeSandbox template, project creation, editor, AI CREATE toolchain, publishing, settings modal, Stripe foundation, UI system, authenticated editor and project routes, source export, and customer-controlled Git behavior except where a separately approved capability specification authorizes a narrow additive extension. The editor MUST NOT be wrapped or redesigned by dashboard shell work, and Jagwar MUST NOT introduce a second website generator.

#### Scenario: A downstream capability needs inherited behavior to change

- GIVEN a proposed implementation would alter an inherited behavior
- WHEN its capability SDD is reviewed
- THEN the change MUST be rejected unless the specification explicitly authorizes the narrow product change and delivery governance is satisfied

### Requirement: Every new Jagwar UI has complete locale parity

Every new user-visible Jagwar key, success state, authorization denial, provider failure, entitlement guidance, lifecycle notice, and security message MUST maintain key parity across inherited English, Spanish, Japanese, Korean, and Chinese catalogs. A user-facing capability MUST NOT be accepted with missing keys in any of the five catalogs.

#### Scenario: Provider failure guidance is introduced

- GIVEN a downstream capability adds a provider-failure message
- WHEN its locale acceptance gate runs
- THEN the same key MUST exist in all five inherited locale catalogs

### Requirement: Deferred inputs remain explicit launch blockers

The system MUST model plan prices and monthly quantities, bundled top-up price and quantities, AI credit conversion, per-site hosting price, DataForSEO result-count and radius choices, managed preset content, default SMS templates, and Telnyx registration details and provider limits as configurable policy inputs. A dependent capability MUST fail closed or remain unavailable until its required input is approved and configured; specifications and implementations MUST NOT invent final values.

#### Scenario: Required commercial policy is absent

- GIVEN a provider-funded capability requires a deferred price, quantity, conversion, content, option, or limit that is not configured
- WHEN launch readiness is evaluated
- THEN the dependent capability MUST be blocked from launch
- AND no fabricated default MUST be substituted

### Requirement: Explicit non-goals remain excluded

V1 MUST NOT add unattended SMS campaigns, client portal accounts, new public-preview protection, custom pipeline stages, scheduled or non-global policy variants, managed external-host migration, WhatsApp, Blue Send, a second generator/editor/publisher, full prompt editing, archive/asset/Git preset ingestion, operator-to-client sale processing, or Jagwar-funded CodeSandbox fallback. V1 MUST include workspace-uploaded Inspiration and Style `DESIGN.md` presets.

#### Scenario: Downstream planning proposes a non-goal

- GIVEN a downstream plan includes an explicit V1 non-goal
- WHEN scope is reviewed against this contract
- THEN that work MUST be removed or proposed as a separately owner-approved product-contract change

### Requirement: Dependency sequencing does not authorize implementation

Each implementation effort MUST begin with its own prerequisite-aware capability SDD and MUST be partitioned into cohesive 250–400 changed-line review slices. Workspace identity and authority MUST precede dependent workspace operations; entitlement and usage audit MUST precede metered provider operations; lead identity and pipeline persistence MUST precede discovery import, website creation, Inbox, or analytics; and subscription/hosting state MUST precede cancellation enforcement. These planning dependencies MUST NOT authorize runtime edits, provider activation, protected baseline edits, generated changes, lockfile changes, commits, Story 1.3b work, or execution of this umbrella proposal.

#### Scenario: A dependency is specified as ready

- GIVEN a planning artifact records that a prerequisite capability should be delivered first
- WHEN implementation authorization is evaluated
- THEN sequencing alone MUST NOT authorize code changes
- AND normal capability SDD, slice-manifest, test, and protected-path approval gates MUST still apply

### Requirement: Delivery preserves repository governance

Future implementation MUST use Bun, MUST preserve unrelated dirty work, MUST declare every governed implementation path in a slice manifest, and MUST obtain an exact resulting hash-bound Core Change Request before editing a protected baseline path. Agents MUST NOT edit generated output or `bun.lock`, and database generation MUST remain maintainer-only.

#### Scenario: Planned slice requires a protected path

- GIVEN a future capability slice requires a protected baseline edit
- WHEN no exact hash-bound approval exists
- THEN implementation MUST remain blocked even if the product capability is approved
