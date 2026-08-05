# Delta for Publishing and Hosting Lifecycle

## MODIFIED Requirements

### Requirement: Inherited publishing and previews remain intact

The system MUST preserve existing publishing product behavior through provider-neutral build intent, source revision, artifact or deployment identity, activation intent, rollback target, and publish result contracts. A public project preview MUST retain its stable mutable public identity and update by republishing; provider hostname and implementation MUST NOT be product identity. Existing Freestyle routes MUST continue resolving or use a proven reversible continuity mapping until separately approved retirement. Editor and project URLs MUST remain authenticated, and no new preview protection or client portal MAY be inferred.

(Previously: Publishing used inherited Onlook behavior and a Freestyle hostname while preserving a stable mutable preview updated by republishing.)

#### Scenario: Subscribed user republishes a preview

- GIVEN the workspace is active and project access gates pass
- WHEN an authorized user republishes through the provider-neutral publishing contract
- THEN the same public preview identity MUST reflect the newly activated publication
- AND the prior publication MUST remain available as a governed rollback target

#### Scenario: Freestyle continuity remains required

- GIVEN a legacy preview still resolves through Freestyle and replacement route continuity is not proven
- WHEN provider migration is evaluated
- THEN Freestyle resolution MUST remain operational and MUST NOT be retired

## ADDED Requirements

### Requirement: Publishing owns intent and activation records

Publishing MUST own build intent, exact source revision, environment-policy references, artifact or deployment identity, activation intent, rollback target, and final publish result. Hosting providers MAY own provider resources, while hosting lifecycle MUST own domains, suspension, retention, reactivation, and deletion. Creation of a build, artifact, deployment, or provider response MUST NOT alone mean publication succeeded.

#### Scenario: Deployment exists but activation fails

- GIVEN a provider deployment was created for the requested revision
- WHEN stable-route activation fails
- THEN publish result MUST remain failed or incomplete
- AND the prior active publication MUST remain authoritative

#### Scenario: Publish outcome is unknown

- GIVEN activation times out after dispatch
- WHEN reconciliation runs as a named publishing actor
- THEN it MUST resolve durable intent, deployment, and active-route state before retrying or reporting an outcome

### Requirement: Legacy Freestyle identity and mutation baseline are captured

Before migration, the system MUST persist existing Freestyle deployment IDs and their workspace, project, branch, source, public route, lifecycle, and rollback relationships where recoverable. The current publish-build fork and Next standalone mutation MUST be captured as observed compatibility baseline, not treated as provider-neutral normative behavior. Missing or ambiguous legacy IDs MUST block cutover and remain reconcilable.

#### Scenario: Existing preview has a recoverable deployment ID

- GIVEN an existing Freestyle preview and its provider identity can be verified
- WHEN baseline capture runs
- THEN the deployment ID and source/route relationship MUST be persisted before route migration

#### Scenario: Legacy deployment identity is missing

- GIVEN an existing public preview resolves but its Freestyle deployment ID cannot be established
- WHEN cutover is requested
- THEN cutover MUST be blocked without disrupting the preview

### Requirement: Publish lanes fail closed and preserve source

Each publish intent MUST select static, compatible dynamic, or separately approved exceptional fallback only from exact compatibility evidence. Unproven classification MUST fail closed. Build and runtime environments MUST be separated, server secrets MUST never enter client artifacts, and no lane MAY replace authoritative source, complete `.git`, export, or customer-transfer behavior.

#### Scenario: Static proof fails and dynamic proof is absent

- GIVEN an exact revision fails static compatibility and has no accepted dynamic evidence
- WHEN publish is requested
- THEN publication MUST fail safely without selecting a container automatically

#### Scenario: Publish build mutates its fork

- GIVEN a build lane requires transformation of a disposable publish fork
- WHEN publication completes or fails
- THEN the mutation MUST NOT alter authoritative source or complete `.git`

### Requirement: Publish lifecycle operations are deterministic

Republish, cancel, unpublish, rollback, and cleanup MUST be idempotent, persist requested and actual outcomes, and preserve the last verified active route until an authorized transition commits. Partial or provider-unknown outcomes MUST remain reconcilable. Cleanup MUST NOT delete active versions, required rollback targets, source, Git, legacy mappings, or migration evidence.

#### Scenario: Republish is retried

- GIVEN a publish identity already activated a version
- WHEN the same request is retried
- THEN it MUST return the committed result without creating a conflicting activation

#### Scenario: Unpublish partially fails

- GIVEN provider cleanup succeeds but stable-route removal is unknown
- WHEN unpublish reconciliation runs
- THEN lifecycle MUST remain incomplete and publicly reported state MUST reflect verified route behavior

### Requirement: Preview and custom-domain migration preserve continuity

Deterministic preview domains MUST remain stable across provider changes. Custom-domain ownership, verification, DNS, certificate, provider, route, suspension, and rollback state MUST be durable and tenant-isolated. Custom domains MUST migrate only after source, runtime, editor, publish, preview-route continuity, and rollback gates pass, and each move MUST be reversible.

#### Scenario: Preview provider changes

- GIVEN a replacement publication passes all non-domain gates
- WHEN its stable preview route activates atomically
- THEN the inherited public preview identity MUST continue resolving to exactly one verified version

#### Scenario: Domain certificate state is ambiguous

- GIVEN provider response leaves certificate or route state unknown
- WHEN custom-domain activation is evaluated
- THEN the old verified domain route MUST remain authoritative until reconciliation proves the new state

### Requirement: Hosting lifecycle boundaries remain independent and safe

Suspension, grace, retention, archive, reactivation, deletion, and provider retirement MUST remain distinct transitions with durable ownership and idempotent reconciliation. Existing entitlement, 14-day grace, neutral suspension, 90-day retention, export, and reactivation outcomes MUST remain unchanged. Retirement of CodeSandbox or Freestyle MUST require separate approval and MUST NOT follow from successful migration or ordinary cleanup.

#### Scenario: Subscription reactivates during grace

- GIVEN a site remains within inherited grace and its required entitlements become active
- WHEN reactivation commits
- THEN public identity MUST remain unchanged and the retained verified publication MUST resume according to existing lifecycle behavior

#### Scenario: Deletion is due while rollback evidence is retained

- GIVEN product retention deletion is authorized but migration evidence remains under a separate retirement boundary
- WHEN deletion runs
- THEN product data MUST follow its approved lifecycle
- AND protected provider mappings and rollback evidence MUST not be silently deleted
