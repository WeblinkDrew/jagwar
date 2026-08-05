# Platform Authority and Security Specification

## Purpose

Define cross-provider authorization, commercial gates, isolation, and capability ownership for editing and hosting infrastructure.

## ADDED Requirements

### Requirement: Authorization is server-derived and revalidated at sensitive boundaries

Every operation MUST derive actor, named system actor, workspace, project, branch, source, runtime, artifact, route, and domain authority on the server. Membership and resource ownership MUST be revalidated immediately before provider dispatch, cutover, terminal or command access, secret or credential release, publication activation, and destructive lifecycle work. Removed-member access MUST cease immediately, including existing sessions.

#### Scenario: Member is removed before provider dispatch

- GIVEN a member requested authorized runtime work and is removed before dispatch
- WHEN dispatch is about to occur
- THEN the operation MUST be denied without releasing credentials or provider identities

#### Scenario: Background publisher runs

- GIVEN an authorized publish intent is ready for asynchronous execution
- WHEN work begins
- THEN it MUST run as a named system actor with scope limited to that intent and workspace

### Requirement: Commercial authority gates funded operations

Commercial capabilities MUST own entitlement, admission, metering, hosting add-on, and compute funding and credential policy. Editing, build, publish, or hosting operations MUST NOT infer commercial authority from provider readiness. The unresolved replacement compute funding and credential model MUST block dependent implementation and operation but MUST NOT block planning.

#### Scenario: Provider is ready but entitlement is absent

- GIVEN provider capacity exists but commercial admission fails
- WHEN funded work is requested
- THEN dispatch MUST be blocked before provider cost is incurred

#### Scenario: Compute policy remains unresolved during planning

- GIVEN replacement funding and credential ownership are undecided
- WHEN design planning proceeds
- THEN planning MAY describe both contract boundaries
- AND implementation dependent on the decision MUST remain blocked

### Requirement: Tenant data and execution are isolated end to end

Workspace isolation MUST cover filesystem, processes, network, egress, secrets, credentials, terminals, logs, backups, caches, R2 objects, source, artifacts, deployments, routes, and domains. Provider credentials MUST never be delivered to clients. Resource exhaustion, fork bombs, runaway work, malicious Git, and supply-chain inputs MUST be bounded and contained.

#### Scenario: Tenant requests another tenant's artifact

- GIVEN an authenticated actor supplies another workspace's artifact identity
- WHEN authorization runs
- THEN access MUST be denied without revealing whether the artifact exists

#### Scenario: Fork bomb executes

- GIVEN untrusted project code starts uncontrolled child processes
- WHEN process limits are exceeded
- THEN the runtime MUST contain and terminate the workload without affecting another workspace

### Requirement: Diagnostics and denials are sanitized and auditable

Provider errors, command logs, build logs, migration evidence, and lifecycle diagnostics MUST redact secrets, credentials, sensitive source, and cross-workspace identities. Security-significant actions MUST retain actor or named system actor, workspace, action, target class, policy version, outcome, and time without retaining raw secrets. Public and client denials MUST be sanitized.

#### Scenario: Provider error contains a credential

- GIVEN a provider returns an error embedding a credential or secret URL
- WHEN it is logged or returned
- THEN sensitive values MUST be redacted before persistence or client delivery

#### Scenario: Route enumeration is attempted

- GIVEN repeated requests probe guessed preview routes
- WHEN abuse controls deny them
- THEN responses MUST not distinguish absent routes from unauthorized tenant routes
- AND redacted security evidence MUST remain auditable

### Requirement: Capability ownership remains singular

Editable runtime MUST own sandbox, source-runtime, port, capability, task, terminal, watch, and runtime lifecycle contracts. Project and branch MUST own product relationships; Git and export MUST own repository and transfer outcomes; editor MUST own iframe, preload, RPC, HMR, and editor sessions; publishing MUST own build intent, source revision, artifact/deployment intent, activation, rollback, and result; static preview MUST own immutable static versions, wildcard routing, active-version resolution, and static evidence; dynamic hosting MUST own OpenNext/Workers evidence and deployment behavior; hosting lifecycle MUST own domains and lifecycle; workspace authority MUST own authentication and membership; commercial capabilities MUST own admission and funding policy; provider adapters MUST translate provider state; analytics MUST remain projection-only.

#### Scenario: Provider adapter returns a resource

- GIVEN an adapter creates or discovers a provider resource
- WHEN it reports the outcome
- THEN it MUST translate the resource into the owning public contract
- AND MUST NOT become authority for project, commercial, or publishing state

#### Scenario: Analytics projection is stale

- GIVEN analytics differs from an owning workflow record
- WHEN authority is evaluated
- THEN the owning capability record MUST control and analytics MUST be repaired as a projection

### Requirement: Dependencies use focused public contracts

Capabilities MUST communicate through focused public contracts and composition roots. Deep imports, sibling-internal coupling, cross-capability persistence queries, and provider identifiers in product-owned contracts MUST be prohibited. Runtime and deployment composition roots MUST keep adapters replaceable without moving authority into infrastructure modules.

#### Scenario: Publishing needs a source revision

- GIVEN publishing requires the authoritative revision for a build
- WHEN it requests that identity
- THEN it MUST use the source capability's public contract rather than query sibling persistence

#### Scenario: Product record receives a provider ID

- GIVEN a proposed project contract embeds a Cloudflare or CodeSandbox identifier as product identity
- WHEN boundary review runs
- THEN the contract MUST be rejected and replaced with provider-neutral identity plus adapter mapping
