# Workspace Authority Specification

## Purpose

Define shared workspace identity, Owner and Member authority, member administration, sensitive settings, and actor audit. This capability is a prerequisite for commercial entitlements and all workspace-scoped capabilities.

## Requirements

### Requirement: Workspace roles are server authoritative

The system MUST support exactly Owner and Member workspace roles for V1. The server MUST derive role and membership from authoritative workspace state for every protected operation; client visibility, route access, or submitted role claims MUST NOT grant authority.

#### Scenario: Member uses a normal workflow

- GIVEN an active Member belongs to the workspace
- WHEN the Member performs an allowed lead, project, or Inbox workflow
- THEN the server MUST authorize the operation in that workspace and record the Member as actor

#### Scenario: Client claims Owner authority

- GIVEN a Member submits an Owner-only request with a client-supplied Owner claim
- WHEN the server authorizes it
- THEN the server MUST deny it without changing workspace state

### Requirement: Owners control membership and sensitive settings

Only Owners MUST be permitted to manage billing, members, workspace CodeSandbox credentials, SMS templates, workspace presets, and other sensitive integrations. Members MAY select available presets and MAY read and reply in Inbox.

#### Scenario: Owner changes a sensitive setting

- GIVEN an authenticated Owner belongs to the target workspace
- WHEN the Owner submits a valid sensitive-setting change
- THEN the system MUST persist it for that workspace and append actor audit evidence

#### Scenario: Concurrent member administration conflicts

- GIVEN two Owner requests mutate the same membership version
- WHEN both attempt to commit
- THEN the system MUST accept at most one against that version
- AND MUST reject the stale mutation without silently overwriting authority

### Requirement: Workspace data is isolated and durably owned

Workspace identity and membership records MUST be authoritative persistence owned by this capability. Every dependent record and authorization decision MUST be scoped to one workspace. Cross-workspace identifiers MUST NOT permit reading or mutating another workspace's balances, leads, searches, projects, presets, conversations, or integrations.

#### Scenario: Member references another workspace resource

- GIVEN a Member belongs to workspace A but submits an identifier owned by workspace B
- WHEN the request is evaluated
- THEN the server MUST deny access without disclosing workspace B's sensitive data

### Requirement: Authority changes are auditable and effective promptly

Membership invites, role changes, removals, and sensitive-setting changes MUST retain workspace, actor, target, action, result, and timestamp evidence without raw credentials. Removed members MUST lose authority on subsequent server authorization.

#### Scenario: Removed member retries an operation

- GIVEN an Owner removed a Member successfully
- WHEN the removed Member retries a previously visible operation
- THEN the server MUST deny it even if the client still displays the old workspace state
