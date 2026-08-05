# Static Preview Specification

## Purpose

Define compatibility-gated immutable static artifacts and stable public routing without changing source or Git authority.

## ADDED Requirements

### Requirement: Static classification requires an isolated build proof

A site MUST be classified as static only after an isolated, bounded build of the exact source revision succeeds and delivery evidence passes. Source scanning MAY inform the attempt but MUST NOT prove compatibility by itself. Server Actions, route handlers or internal APIs, middleware or proxy behavior, request-time cookies or headers, dynamic rendering, ISR, runtime environment variables, server image optimization, unsupported Node APIs, native dependencies, and arbitrary Git imports or edits MUST fail static classification unless the isolated proof demonstrates an explicitly supported outcome.

#### Scenario: Source scan appears static but build uses runtime headers

- GIVEN source scanning finds no known blocker
- WHEN the isolated build demonstrates request-time header dependence
- THEN static classification MUST fail safely

#### Scenario: Arbitrary Git edit introduces native dependency

- GIVEN a previously static project imports a native dependency in a new revision
- WHEN that exact revision is classified
- THEN prior evidence MUST be invalid and a failing or unsupported build MUST block static activation

### Requirement: Static builds produce immutable verifiable artifacts

Each build intent MUST bind workspace, project, branch, source generation and revision, environment policy, builder identity and version, and build status. A successful build MUST produce an immutable artifact version with manifest, provenance, content hashes, size and file counts, and an activation candidate. Artifact creation MUST NOT mutate source or `.git` and MUST NOT imply activation.

#### Scenario: Build produces an artifact

- GIVEN an authorized exact source revision passes isolated static build checks
- WHEN artifact persistence completes and hashes verify
- THEN an immutable artifact version MAY become an activation candidate
- AND source authority MUST remain unchanged

#### Scenario: Artifact persistence is partial

- GIVEN some artifact objects upload but manifest verification fails
- WHEN build reconciliation runs
- THEN the artifact MUST remain inactive and retryable or cleanable without deleting source

### Requirement: R2 layout and cache behavior isolate tenants and versions

Static artifacts stored in R2 MUST use an unambiguous tenant-isolated key layout containing non-guessable or authorized workspace, project, branch, artifact-version, and path components. Cache keys MUST include route and active artifact identity, MUST prevent cross-tenant reuse, and MUST support deterministic invalidation when the active pointer changes. Source, `.git`, server secrets, and excluded source maps MUST NOT enter the artifact bucket.

#### Scenario: Two tenants publish the same path

- GIVEN two workspaces publish `/index.html`
- WHEN objects and cache entries are resolved
- THEN each MUST resolve only within its own artifact and route identity

#### Scenario: Active version changes

- GIVEN a route cached content from version A
- WHEN activation atomically selects version B
- THEN subsequent resolution MUST not serve A under B's active identity after the defined invalidation boundary

### Requirement: One wildcard routing Worker resolves stable mutable routes

Static previews MUST use one governed wildcard routing Worker rather than a Pages project per site. The stable mutable public route MUST resolve through an atomic active-version pointer to one immutable artifact, support deterministic rollback, resist route enumeration, and preserve the inherited preview identity through continued Freestyle resolution or a proven reversible continuity mapping until retirement is separately approved.

#### Scenario: New artifact activates

- GIVEN artifact B is verified and route A is active
- WHEN the activation pointer changes atomically to B
- THEN the same public preview identity MUST serve B
- AND A MUST remain a valid rollback target under retention policy

#### Scenario: Unknown route is enumerated

- GIVEN a request guesses a workspace or project route
- WHEN no authorized public route mapping exists
- THEN the Worker MUST return a sanitized response without revealing tenant or artifact identities

### Requirement: Static delivery is deterministic and bounded

The delivery contract MUST define content-type handling, directory and framework fallback behavior, controlled error pages, allowed methods, file and response size limits, large-file behavior, cache policy, and bot and abuse controls. Unsupported, missing, oversized, corrupt, or ambiguous objects MUST fail safely and MUST NOT fall through to another tenant or artifact.

#### Scenario: Large file exceeds the delivery limit

- GIVEN an active artifact references a file above the configured safe limit
- WHEN it is requested
- THEN delivery MUST return the governed error outcome without partial cross-object content

#### Scenario: SPA fallback is allowed

- GIVEN the artifact manifest explicitly permits a fallback document
- WHEN a missing navigational path is requested
- THEN the Worker MUST serve only that artifact version's declared fallback with its correct content type

### Requirement: Build environments exclude runtime secrets

Build-time environment values MUST be explicitly allowlisted, scoped to the exact build, redacted from logs, and separated from runtime environment policy. Static client artifacts MUST NOT contain server secrets, provider credentials, unauthorized source maps, or undeclared environment values.

#### Scenario: Build requests a server secret

- GIVEN a static build attempts to read a non-allowlisted runtime secret
- WHEN environment policy is enforced
- THEN the build MUST fail without exposing the secret in output or diagnostics

#### Scenario: Source map may expose secret material

- GIVEN artifact inspection finds an excluded source map or secret pattern
- WHEN activation is evaluated
- THEN activation MUST be blocked and the evidence MUST be redacted

### Requirement: Artifact lifecycle preserves rollback and source independence

Retention, archive, reactivation, and deletion MUST be explicit, idempotent, and distinct from source, Git, project, branch, and domain lifecycle. Active artifacts and required rollback versions MUST NOT be deleted. Partial deletion MUST remain retryable and MUST never delete authoritative source or legacy migration evidence.

#### Scenario: Archived artifact is reactivated

- GIVEN an archived artifact remains within retention and passes integrity checks
- WHEN authorized reactivation selects it atomically
- THEN it MAY become active without rebuilding or changing source authority

#### Scenario: Deletion partially fails

- GIVEN artifact deletion removes only some objects
- WHEN reconciliation runs
- THEN the version MUST remain marked incomplete and non-activatable until reconciled
