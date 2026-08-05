# Editable Runtime Specification

## Purpose

Define provider-neutral source and editable-runtime behavior while preserving the inherited editor, Git, creation, and transfer model.

## ADDED Requirements

### Requirement: Provider-neutral identities separate product, source, and runtime authority

The system MUST represent workspace, project, branch, source generation and revision, runtime resource, provider kind, provider resource ID, migration state, preview endpoint, task and port metadata, and rollback mapping as distinct identities. Exactly one source authority and one runtime authority MUST be active for a branch at a time. Provider IDs MUST remain adapter-owned and MUST NOT replace project, branch, source, or public route identities.

#### Scenario: Runtime provider is replaced

- GIVEN a branch has verified source and runtime mappings for legacy and replacement providers
- WHEN its active runtime authority changes atomically
- THEN its workspace, project, branch, source, and public product identities MUST remain unchanged
- AND the prior mapping MUST remain available for rollback

#### Scenario: Authority is ambiguous

- GIVEN reconciliation finds two active source authorities or cannot identify one
- WHEN an edit, build, or cutover is requested
- THEN the operation MUST fail closed until one authority is reconciled

### Requirement: Authoritative source preserves complete repositories

The authoritative source MUST contain all project files and complete `.git` metadata needed for status, history, commits, notes, remotes, restore, and transfer. A filtered IndexedDB mirror, temporary build runtime, generated artifact, backup, or deployment MUST NOT become sole source authority. Source generations and revisions MUST be immutable references even when the active branch advances.

#### Scenario: Temporary build succeeds

- GIVEN an isolated build runtime produces an artifact
- WHEN build cleanup runs
- THEN the authoritative source and complete `.git` MUST remain independently recoverable
- AND the build runtime MUST NOT be recorded as sole authority

#### Scenario: Filtered mirror omits Git metadata

- GIVEN an editor mirror excludes `.git`
- WHEN source authority is evaluated
- THEN that mirror MUST be rejected as a complete migration source

### Requirement: Runtime providers negotiate bounded capabilities

The Provider/factory/file architecture MUST expose provider-neutral capability negotiation for creation from the fixed starting behavior, public Git import, full-project and branch forks, publish forks, files, watches, commands, terminal, named tasks, health, ports, sessions, lifecycle, durability, export, and Git. Unsupported or degraded capabilities MUST be explicit and MUST fail safely rather than masquerade as parity.

#### Scenario: Provider lacks recursive rename events

- GIVEN a branch requires recursive watch parity
- WHEN a provider reports no reliable rename capability
- THEN migration readiness MUST fail with a capability-specific result
- AND legacy editing MUST remain available

#### Scenario: Provider reports an unknown capability result

- GIVEN capability negotiation times out or returns an unknown version
- WHEN runtime creation is requested
- THEN the request MUST fail closed or remain on the verified provider

### Requirement: Files and watches preserve source fidelity

Runtime providers MUST preserve text, binary, and symlink content and metadata required by the source contract. File operations MUST support create, read, write, move, rename, delete, and recursive directory behavior. Recursive watches MUST emit reconcilable add, change, remove, and rename semantics without silently losing or duplicating source changes.

#### Scenario: Binary and symlink tree is copied

- GIVEN a source revision contains text, binary, and symlink entries
- WHEN it is imported or forked
- THEN hashes, link targets, paths, and relevant modes MUST match the source revision

#### Scenario: Watch delivery is interrupted

- GIVEN watch events may have been lost during disconnect
- WHEN the session reconnects
- THEN the provider MUST supply or permit a full reconciliation against authoritative source
- AND uncertain events MUST NOT be treated as synchronized

### Requirement: Commands, terminals, and tasks preserve editor outcomes

Runtime providers MUST support bounded foreground, background, and resumable commands, authenticated terminal sessions, and named tasks including `dev`. Task identity, command state, exit status, logs, health, and restart or resume outcomes MUST be provider-neutral and reconcilable. CPU, memory, storage, process, timeout, and concurrency limits MUST terminate fork bombs and runaway tasks safely.

#### Scenario: Dev task resumes after reconnect

- GIVEN the named `dev` task was healthy before a client disconnect
- WHEN an authorized editor session reconnects
- THEN it MUST resume or deterministically recreate the task and expose its current health and ports

#### Scenario: Command exceeds a limit

- GIVEN untrusted code exhausts a process or time limit
- WHEN enforcement triggers
- THEN the command MUST be terminated without affecting another tenant
- AND the result and redacted diagnostics MUST be reconcilable

### Requirement: Ports and sessions provide stable authorized routing

Providers MUST expose provider-neutral port metadata and stable preview routing for authorized browser and server sessions. Preview endpoint resolution MUST resist enumeration, MUST NOT expose provider credentials, and MUST preserve editor iframe access while enforcing workspace and branch authority.

#### Scenario: Authorized preview port becomes healthy

- GIVEN an authorized branch's `dev` task exposes a declared port
- WHEN health succeeds
- THEN the editor MUST receive a stable preview endpoint without learning provider credentials

#### Scenario: Cross-tenant route is guessed

- GIVEN an actor guesses another workspace's runtime or route identity
- WHEN access is attempted
- THEN access MUST be denied with no confirmation that the target exists

### Requirement: Runtime lifecycle is recoverable and evidence-based

Runtime providers MUST support keep-active, reconnect, sleep or hibernate, restore, and shutdown semantics with explicit health. Durable recovery MUST use backups or mounted durable storage with exact workspace, project, branch, source revision, runtime, provider, backup version, creation time, expiry or TTL, integrity hash, and restore status. Partial, corrupt, expired, or ambiguous recovery MUST fail closed and remain reconcilable.

#### Scenario: Valid backup restores a sleeping runtime

- GIVEN a backup matches the branch's authoritative source revision and is within its TTL
- WHEN restore completes and integrity verification passes
- THEN the runtime MAY become active without changing source authority

#### Scenario: Restore partially fails

- GIVEN some files restore but integrity or `.git` verification fails
- WHEN reconciliation runs
- THEN the runtime MUST remain non-authoritative and unavailable for cutover
- AND the failed backup and legacy rollback mapping MUST be retained

### Requirement: Git and export outcomes remain complete and customer-controlled

The provider-neutral contract MUST preserve Git status, history, commits, notes, remotes, restore, full source download, directory export, and customer-controlled transfer outcomes across create, import, branch fork, full-project fork, and publish-fork flows. The system MUST NOT claim unsupported push or transfer behavior beyond the verified inherited contract.

#### Scenario: Branch is exported after migration

- GIVEN an authorized user requests export for a migrated branch
- WHEN export completes
- THEN source files and the customer-controlled Git outcome MUST match the authoritative revision and inherited export contract

#### Scenario: Git evidence differs

- GIVEN source file hashes match but history, notes, remotes, or restore evidence differs
- WHEN parity is evaluated
- THEN Git parity MUST fail and cutover MUST remain blocked

### Requirement: Untrusted execution is isolated and bounded

Each runtime MUST isolate tenant filesystem, processes, network, egress, secrets, logs, backups, and provider resources. Egress and secret release MUST follow explicit policy; malicious Git inputs and dependencies MUST be treated as untrusted. Logs and denials MUST be redacted, audit-safe, and attributed to an authorized actor or named system actor.

#### Scenario: Untrusted dependency probes another tenant

- GIVEN code in one runtime attempts cross-tenant filesystem, network, backup, or secret access
- WHEN isolation policy evaluates the attempt
- THEN access MUST be denied and contained
- AND diagnostics MUST reveal no other tenant identity or secret

#### Scenario: Background cleanup executes

- GIVEN lifecycle cleanup is due without a user request
- WHEN it executes
- THEN it MUST run as a named system actor with bounded authority and auditable redacted outcome
