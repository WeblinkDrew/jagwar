# Editor Runtime Parity Specification

## Purpose

Define compatibility evidence required to preserve the single inherited editor while runtime providers change.

## ADDED Requirements

### Requirement: The inherited editor remains the only editor model

The system MUST preserve the existing editor, source, Git, project, branch, CREATE, generator, preset, lead, and version relationships. Provider adapters MUST satisfy editor-facing public contracts and MUST NOT introduce a second editor, source store, Git model, project model, or provider-specific identity into editor state.

#### Scenario: Replacement provider opens a project

- GIVEN a branch is authorized for replacement runtime use
- WHEN the inherited editor opens it
- THEN the same project, branch, source revision, version, and editor model MUST be used

### Requirement: Interactive preview behavior requires parity evidence

Before runtime cutover, the replacement provider MUST demonstrate preview iframe access, preload injection and mutation, Penpal/editor RPC, DOM inspection and editing, screenshots, HMR, browser and server sessions, and reconnect behavior against the branch's verified baseline. Compatibility evidence MUST record outcomes and versions; proposed Cloudflare behavior MUST NOT be represented as current Jagwar behavior.

#### Scenario: Full editor parity succeeds

- GIVEN source and runtime parity prerequisites pass
- WHEN iframe, preload, RPC, DOM editing, screenshot, HMR, session, and reconnect checks all match accepted baseline outcomes
- THEN editor parity MAY be recorded for that branch and source revision

#### Scenario: RPC succeeds but screenshot fails

- GIVEN most editor checks pass but screenshot evidence is missing or different
- WHEN parity is evaluated
- THEN editor parity MUST fail and CodeSandbox editing MUST remain the rollback path

### Requirement: Reconnect reconciles sessions rather than inferring success

Reconnect MUST revalidate workspace authority, resolve the active runtime, reconcile task, port, watch, browser, server, and RPC session state, and recreate only what cannot safely resume. Unknown or split session outcomes MUST not overwrite authoritative source or claim a healthy preview.

#### Scenario: Reconnect finds stale provider mapping

- GIVEN the client holds a legacy runtime identity after an authority change
- WHEN reconnect occurs
- THEN the server MUST resolve the active provider-neutral mapping and establish one authorized session
- AND the stale mapping MUST remain only as rollback evidence

#### Scenario: Member is removed while disconnected

- GIVEN a member had an editor session and was then removed from the workspace
- WHEN that client reconnects
- THEN session, terminal, preview, and RPC access MUST be denied immediately with a sanitized response
