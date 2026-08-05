# Provider Migration Specification

## Purpose

Define staged, evidence-driven, reversible migration of editing and preview authority.

## ADDED Requirements

### Requirement: Migration follows the authorized stage order

Migration MUST proceed in this order: product-contract revision; provider-neutral identities and contracts; Cloudflare editing parity; complete source and `.git` copy; deterministic source hashes, builds, tasks, terminals, watches, preview, RPC, Git, and export evidence; retained legacy mappings; atomic per-branch or project authority cutover; provider-neutral publishing contracts; persistence of existing Freestyle deployment IDs; static and dynamic lanes; optional demonstrated and separately approved fallback; preview-route migration; custom domains last; legacy disconnect only after parity and exercised rollback. Retirement MUST require separate approval.

#### Scenario: A later stage is requested early

- GIVEN any prerequisite stage lacks accepted evidence
- WHEN preview routing, custom-domain migration, or legacy disconnect is requested
- THEN the request MUST fail closed without changing active authority

#### Scenario: Custom domain is last

- GIVEN source, runtime, editor, publishing, route continuity, and rollback evidence all pass
- WHEN custom-domain migration is proposed
- THEN it MAY enter its separately authorized migration stage
- AND it MUST NOT imply legacy retirement

### Requirement: Parity evidence is exact and branch-scoped

For each project and branch, migration evidence MUST bind workspace, project, branch, source generation and revision, legacy and replacement resources, capability versions, full-tree and `.git` hashes, build results, tasks, terminal, commands, watch semantics, preview, iframe/preload, Penpal RPC, DOM editing, HMR, screenshots, reconnect, Git, export, and timestamps. Normative replacement behavior MUST be distinguished from compatibility observations against the inherited baseline.

#### Scenario: Source hashes pass but watches are unproven

- GIVEN source and Git hashes match across providers
- WHEN recursive watch evidence is absent
- THEN parity MUST remain incomplete and cutover MUST be blocked

#### Scenario: Evidence belongs to an older revision

- GIVEN complete evidence exists for a prior source revision
- WHEN the branch authority points to a newer revision
- THEN the older evidence MUST NOT authorize cutover of the newer revision

### Requirement: Source copy and reconciliation never discard evidence

Migration MUST copy authoritative source and complete `.git`, verify exact or explicitly normalized hashes, and retain source, provider mappings, comparison evidence, and failed attempts. Apparent success, resource creation, artifact creation, or route response MUST NOT authorize deletion. Unknown and partial outcomes MUST remain retryable under named system actors.

#### Scenario: Copy reports success but Git hash differs

- GIVEN a provider reports a successful source copy
- WHEN complete `.git` verification differs
- THEN the replacement source MUST remain non-authoritative
- AND neither source nor evidence MAY be deleted

#### Scenario: Copy completion is unknown

- GIVEN provider timeout leaves copy completion unknown
- WHEN a migration reconciler runs as a named system actor
- THEN it MUST inspect durable identities and hashes before retrying or classifying the result

### Requirement: Cutover is atomic, singular, and reversible

A branch or project cutover MUST atomically select one active source/runtime or publish authority and a verified rollback target. Cutover MUST revalidate actor, workspace, entitlement, source revision, parity, route continuity, and rollback availability immediately before mutation. Split-brain, stale evidence, missing mappings, or unavailable rollback MUST block cutover.

#### Scenario: Cutover commits

- GIVEN all gates pass for the current revision
- WHEN the authority pointer commits atomically
- THEN exactly one replacement authority MUST be active
- AND the legacy authority and mapping MUST remain ready for rollback

#### Scenario: Authority outcome is ambiguous

- GIVEN the pointer write times out and its commit state is unknown
- WHEN reconciliation runs
- THEN new writes and publishes MUST be blocked until one active authority is proven

### Requirement: Rollback is exercised before rollout expansion

Rollback MUST atomically restore the last verified runtime, source, artifact, deployment, or route mapping; reconcile in-flight edits and publishes; preserve audit history; and prove complete Git, export, previews, and domains resolve to the intended version. Rollback MUST NOT delete replacement or legacy evidence, and ordinary cleanup MUST NOT retire providers.

#### Scenario: Replacement preview regresses after cutover

- GIVEN replacement authority is active and a parity regression is detected
- WHEN rollback is invoked
- THEN the verified legacy mapping MUST be restored atomically
- AND in-flight state MUST be reconciled before normal operations resume

#### Scenario: Rollback target is unavailable

- GIVEN rollback cannot prove the target resource, source, or route
- WHEN rollout expansion is evaluated
- THEN expansion MUST stop and the state MUST remain an incident requiring reconciliation
