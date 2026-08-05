# Dynamic Hosting Specification

## Purpose

Define compatibility-gated dynamic/SSR hosting and exceptional Node-compatible fallback without automatic escalation.

## ADDED Requirements

### Requirement: Dynamic hosting requires exact compatibility evidence

OpenNext on Cloudflare Workers or Workers for Platforms MAY be selected only when an isolated build and runtime proof for the exact source revision demonstrates every used Next.js feature as supported. Evidence MUST cover server rendering, routing, assets, bindings, cache behavior, environment policy, limits, and failure behavior. Unknown or unsupported behavior MUST fail closed without changing the active publication.

#### Scenario: OpenNext proof passes

- GIVEN the exact revision's used Next.js features pass isolated build and runtime checks
- WHEN dynamic classification is recorded
- THEN a versioned dynamic deployment MAY become an activation candidate

#### Scenario: Middleware behavior is ambiguous

- GIVEN build succeeds but middleware behavior cannot be proven equivalent
- WHEN activation is evaluated
- THEN activation MUST be blocked and the current publication MUST remain active

### Requirement: Dynamic deployments isolate tenants and versions

Dynamic hosting MUST isolate each tenant's code, assets, bindings, cache, environment values, logs, routes, and provider resources. Stable domains MUST resolve through an atomic active-deployment mapping with verified rollback. Runtime secrets MUST be server-only, versioned, scoped, redacted, and distinct from build-time values.

#### Scenario: Tenant cache keys collide

- GIVEN two deployments generate the same application cache key
- WHEN cache access occurs
- THEN workspace, route, and deployment identity MUST prevent cross-tenant reads or writes

#### Scenario: Dynamic version rolls back

- GIVEN deployment B is active and deployment A is a verified retained target
- WHEN authorized rollback commits
- THEN the stable domain MUST atomically resolve to A without changing project or source identity

### Requirement: Dynamic limits and observability are reconcilable

Dynamic hosting MUST enforce CPU, memory, duration, request, concurrency, storage, egress, and provider limits. Build, deploy, activation, request health, provider errors, and cleanup outcomes MUST be durable, redacted, attributable to an actor or named system actor, and reconcilable after timeout or partial failure.

#### Scenario: Activation response is lost

- GIVEN the provider may have activated a deployment but its response timed out
- WHEN reconciliation runs
- THEN the system MUST inspect durable deployment and route identities before retrying
- AND MUST NOT report success while active authority is unknown

#### Scenario: Runtime exceeds a limit

- GIVEN a tenant request exceeds a governed runtime limit
- WHEN enforcement triggers
- THEN that request MUST fail safely without degrading another tenant or exposing provider details

### Requirement: Node-compatible fallback is exceptional and separately governed

A container or other Node-compatible runtime MUST NOT be selected automatically. It MAY be planned only after static and supported dynamic lanes demonstrate exact incompatibility and a separate hosting lifecycle is approved. Selection evidence MUST identify the incompatible features and exact revision. One continuously running container per stored website MUST NOT be the storage or default hosting model.

#### Scenario: Both standard lanes fail

- GIVEN isolated evidence demonstrates the exact revision cannot use static or approved dynamic hosting
- WHEN no fallback lifecycle has separate approval
- THEN publication MUST fail closed without provisioning a container

#### Scenario: Stored site is inactive

- GIVEN a site has no active hosting need
- WHEN fallback capacity is evaluated
- THEN the system MUST NOT retain one continuously running container merely because the website is stored

### Requirement: Approved fallback has a complete lifecycle contract

Any separately approved fallback MUST define ownership, tenant isolation, limits, sleep and wake, routing, health, build and runtime secrets, durable storage, retention, stable and custom domains, activation, rollback, cleanup, and reconciliation. Unknown wake, route, storage, or deletion outcomes MUST fail safely and remain retryable.

#### Scenario: Sleeping fallback receives traffic

- GIVEN an approved fallback deployment is sleeping and its stable route is active
- WHEN a request arrives
- THEN wake and health policy MUST reach a bounded healthy outcome or return a controlled failure without routing to another version

#### Scenario: Durable storage restore is corrupt

- GIVEN fallback storage restore fails integrity verification
- WHEN activation is evaluated
- THEN the deployment MUST remain inactive and the verified prior route MUST remain available
