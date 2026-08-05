# CodeSandbox BYOK Specification

## Purpose

Define workspace-owned CodeSandbox credential lifecycle and fail-closed editable-project access. This capability depends on workspace Owner authority and is a prerequisite for website creation and subscribed editing.

## Requirements

### Requirement: Every workspace supplies its own credential

Each workspace MUST supply its own CodeSandbox API key. Only an Owner MUST create, replace, validate, or remove it. Jagwar MUST NOT fall back to a Jagwar-owned CodeSandbox key, and provider compute cost MUST belong to the workspace.

#### Scenario: Owner stores a valid key

- GIVEN an Owner submits a CodeSandbox key over an authorized server boundary
- WHEN provider validation succeeds
- THEN the workspace MUST gain credential readiness without exposing the raw key to clients

#### Scenario: Member submits a key

- GIVEN a Member submits a CodeSandbox credential
- WHEN the request is authorized
- THEN it MUST be denied without validating or storing the credential

### Requirement: Invalid credential state fails closed

A missing, invalid, revoked, or quota-exhausted key MUST block creation and opening of editable projects. The user MUST receive tailored settings and documentation guidance that does not disclose the raw credential or provider-sensitive evidence.

#### Scenario: Revoked key is used to open a project

- GIVEN the workspace key is revoked
- WHEN a member opens an editable project
- THEN access MUST be blocked
- AND the response MUST direct the Owner toward credential remediation

#### Scenario: Provider validation is unavailable

- GIVEN credential validity cannot be established safely
- WHEN project access requires it
- THEN the system MUST fail closed rather than use a fallback key

### Requirement: Credential persistence is server-only and auditable

This capability MUST own encrypted or equivalently protected server-side credential state, validation status, version, workspace ownership, and lifecycle timestamps. Raw keys MUST NOT be returned to clients, logs, notifications, analytics, or audit records. Credential changes MUST retain actor and outcome evidence.

#### Scenario: Concurrent replacements occur

- GIVEN two Owner requests replace the same credential version
- WHEN both commit
- THEN at most one MUST become current
- AND no operation admitted after replacement MAY silently use the stale version
