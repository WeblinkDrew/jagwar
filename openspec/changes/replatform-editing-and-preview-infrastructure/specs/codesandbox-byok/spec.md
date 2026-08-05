# Delta for CodeSandbox BYOK

## MODIFIED Requirements

### Requirement: Every workspace supplies its own credential

Each workspace MUST use the server-selected compute funding and credential binding authorized by commercial policy for its active editing provider. Only an Owner MAY manage a workspace-supplied credential; a Member MUST NOT manage it. The system MUST NOT infer either Jagwar-funded compute or a replacement BYOK model, and dependent provider operations MUST remain blocked until that policy is approved and configured. Provider credentials MUST NOT be exposed to clients.

(Previously: Every workspace supplied its own CodeSandbox API key, only Owners managed it, and provider compute cost belonged to the workspace.)

#### Scenario: Owner stores a valid workspace-supplied credential

- GIVEN approved commercial policy requires a workspace-supplied credential
- WHEN an Owner submits a valid credential over an authorized server boundary and provider validation succeeds
- THEN the workspace MUST gain readiness for the bound provider without exposing the raw credential to clients

#### Scenario: Member submits a credential

- GIVEN a Member submits a provider credential
- WHEN authorization is evaluated
- THEN it MUST be denied without validating or storing the credential

#### Scenario: Funding policy is unresolved

- GIVEN replacement compute funding and credential policy is not approved and configured
- WHEN an operation depends on replacement compute
- THEN the operation MUST fail closed
- AND the system MUST NOT assume Jagwar funding or a new BYOK requirement

### Requirement: Invalid credential state fails closed

A missing, invalid, revoked, quota-exhausted, unbound, or unverifiable credential required by the approved provider policy MUST block dependent editable-project operations. The user MUST receive tailored settings or documentation guidance that does not disclose raw credentials, provider-sensitive evidence, or another workspace's identity. The system MUST NOT use a fallback credential unless commercial policy explicitly authorizes that exact binding.

(Previously: A missing, invalid, revoked, or quota-exhausted CodeSandbox key blocked creation and opening, with no fallback key.)

#### Scenario: Revoked credential is used to open a project

- GIVEN the workspace's required provider credential is revoked
- WHEN a member opens an editable project that requires it
- THEN access MUST be blocked
- AND the response MUST direct the Owner toward credential remediation

#### Scenario: Provider validation is unavailable

- GIVEN credential validity cannot be established safely
- WHEN project access requires it
- THEN the system MUST fail closed rather than use an unapproved fallback credential

#### Scenario: Credential is bound to another workspace or provider

- GIVEN a credential binding does not match the authorized workspace and selected provider
- WHEN provider dispatch is attempted
- THEN dispatch MUST be denied with a sanitized response

### Requirement: Credential persistence is server-only and auditable

This capability MUST own protected server-side credential state, validation status, version, workspace and provider binding, funding-policy reference, and lifecycle timestamps. Raw credentials MUST NOT be returned to clients, logs, notifications, analytics, or audit records. Credential release MUST revalidate actor, workspace membership, entitlement, provider binding, and current credential version immediately before provider dispatch. Changes and dispatch outcomes MUST retain redacted actor and outcome evidence.

(Previously: This capability owned encrypted CodeSandbox credential state, validation status, version, workspace ownership, timestamps, and actor/outcome evidence.)

#### Scenario: Concurrent replacements occur

- GIVEN two Owner requests replace the same credential version
- WHEN both commit
- THEN at most one MUST become current
- AND no operation admitted after replacement MAY silently use the stale version

#### Scenario: Member is removed before credential release

- GIVEN an actor was authorized when work was requested but is no longer a workspace member
- WHEN the server is about to release a provider credential or dispatch provider work
- THEN authority MUST be revalidated and the operation MUST be denied
- AND no credential or provider resource identity MUST be disclosed
