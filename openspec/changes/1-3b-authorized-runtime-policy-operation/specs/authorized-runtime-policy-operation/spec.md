# Authorized Runtime Policy Operation Specification

## Purpose

Define the restricted authority, immutable policy-release behavior, audit evidence, and direct operator experience required to review, immediately activate, supersede, and roll back production business policies without granting general administration authority or weakening the Story 1.3a policy contract.

## Requirements

### Requirement: Operator authority is explicit and server-derived

The system MUST authorize operator access only when the authenticated Supabase `users.id` has a fresh, active server-side membership with the closed `operator` role. Authentication, email, browser state, user-editable metadata, subscription state, project role, route visibility, and existing administrative procedures MUST NOT grant operator authority. Initial membership MUST be limited to Andrew's exact confirmed Supabase UUID until a separately governed membership change occurs.

#### Scenario: Active approved operator proceeds

- GIVEN Andrew is authenticated and his exact Supabase UUID has an active operator membership
- WHEN he requests `/operator` or a business-policy operator procedure
- THEN the request proceeds to the independently authorized operation

#### Scenario: Other identities have no authority

- GIVEN the requester is anonymous, an ordinary customer, a project owner or administrator, a subscriber, or an authenticated user without active operator membership
- WHEN the requester accesses `/operator` or any business-policy operator procedure
- THEN access is denied
- AND no listed identity, product, project, browser, or administrative attribute substitutes for operator membership

#### Scenario: Browser identity is ignored for authorization

- GIVEN a request supplies an actor UUID, email, metadata, role, or other authority claim from the browser
- WHEN authorization runs
- THEN authority and actor identity are derived from the authenticated server context and fresh membership data
- AND the supplied claim cannot elevate or replace that identity

### Requirement: Authorization fails closed and does not enumerate authority

The system MUST deny policy reads and mutations before accessing policy data when identity or authority is missing, revoked, unknown, ambiguous, or unavailable. Denial results MUST NOT disclose whether a membership or policy release exists. Every sensitive policy transaction MUST lock and recheck the operator membership so revocation and mutation have deterministic commit order.

#### Scenario: Missing or revoked membership is denied before policy access

- GIVEN the session is missing, the membership is missing or revoked, or the requested role or action is unknown
- WHEN a policy read or mutation is requested
- THEN the request is denied before any policy release is read or changed
- AND the response does not enumerate membership or release existence

#### Scenario: Authorization lookup failure fails closed

- GIVEN the fresh membership lookup fails or returns an ambiguous result
- WHEN a policy request is attempted
- THEN a typed safe denial is returned
- AND no policy read, release write, audit success event, provider call, usage write, or billing mutation occurs

#### Scenario: Revocation and mutation have deterministic order

- GIVEN operator revocation races with a sensitive policy mutation
- WHEN the operations execute concurrently
- THEN the mutation locks and rechecks membership within its transaction
- AND the database commit order deterministically decides whether the mutation remains authorized

### Requirement: Membership administration remains operational and auditable

Operator bootstrap and revocation MUST be maintainer-run operations tied directly to an existing Supabase Auth `users.id`; they MUST atomically record the membership change and corresponding audit evidence. The UUID MUST NOT be inferred from email, committed, seeded at application startup, or exposed through a runtime membership-management UI or API.

#### Scenario: Initial bootstrap uses the confirmed UUID

- GIVEN a maintainer has independently confirmed Andrew's exact Supabase UUID
- WHEN the initial membership is bootstrapped
- THEN one active operator membership and one bootstrap audit event commit atomically
- AND the UUID is used directly rather than discovered by email

#### Scenario: Revocation is retained as evidence

- GIVEN an active membership is revoked operationally
- WHEN revocation commits
- THEN its revocation state and a revocation audit event are retained
- AND subsequent authorization checks deny that membership

#### Scenario: Runtime membership management is unavailable

- GIVEN any operator or customer uses the application
- WHEN they seek to create, grant, revoke, or enumerate operator memberships
- THEN no runtime membership-management UI or API is available

### Requirement: Production policy bindings are closed and reuse Story 1.3a

The system MUST support only the Story 1.3a public production policy kinds `qualification`, `discovery`, `outreach`, `activation`, `commercial`, and `retention`, each bound to its exact production schema version and exact public validator. Missing, duplicate, unknown, fixture-only, non-production, or ambiguous bindings MUST fail closed. Validation, canonicalization, SHA-256 identity, release construction, safe diff, and snapshot assertions MUST reuse public `@onlook/business-policy` behavior without duplication, deep import, weakening, or adding production mutation or authorization responsibility to that package.

#### Scenario: Registered production binding is selected exactly

- GIVEN a supported kind and its exact production schema version
- WHEN review or mutation validation runs
- THEN the corresponding public Story 1.3a validator is selected exactly

#### Scenario: Unsupported binding fails closed

- GIVEN a kind or schema version is unknown, missing, duplicated, ambiguous, fixture-only, or marked non-production
- WHEN review, activation, supersession, rollback, or operation admission is attempted
- THEN a typed safe unavailable error is returned
- AND no fallback validator, fixture, environment value, browser constant, implicit latest row, or payload substitution is used

#### Scenario: Existing contract responsibility is preserved

- GIVEN runtime policy operation is available
- WHEN the `@onlook/business-policy` package is inspected and tested
- THEN it retains its pure public contract behavior
- AND it has no production persistence, mutation, operator authorization, application, database, provider, or UI responsibility

### Requirement: Policy review is strict, bounded, safe, and non-persistent

An authorized review MUST strictly validate the typed payload, canonicalize it, compute its SHA-256 identity, and return bounded validation evidence and a bounded safe diff against the exact active release. Review MUST persist no draft and MUST expose no raw SQL, executable code, credentials, authorization material, unrestricted prompts, unvalidated provider payloads, raw secret-like values, or generic database or JSON capability.

#### Scenario: Valid draft produces safe evidence

- GIVEN an authorized operator submits a size-bounded typed payload for a registered production binding
- WHEN review succeeds
- THEN the response contains the exact kind and schema version, canonical hash, bounded validation evidence, and bounded safe diff against the active release
- AND no draft or release is persisted

#### Scenario: Dangerous or oversized review has no effects

- GIVEN a payload is invalid, dangerous, unsupported, or exceeds a request, payload, or diff bound
- WHEN review runs
- THEN a typed safe error is returned
- AND no draft, release, successful-change audit, provider call, usage write, or billing mutation occurs

#### Scenario: No active production release is unavailable

- GIVEN the selected policy kind has no valid active production release
- WHEN review or required-active-release lookup needs that release
- THEN the system presents a typed empty or unavailable state
- AND it does not fall back to a fixture, environment value, browser value, or implicit latest row

### Requirement: Production releases are immutable and deterministic

Each production release MUST retain its closed kind, exact schema version, canonical payload and SHA-256 hash, unique logical identity, server-derived actor UUID, database/server effective time, bounded safe diff, validation evidence, correlation evidence, and supersession lineage. Release identity MUST be unique by `(kind, schema_version, payload_hash)`. Active selection MUST be deterministic by `(effective_at, release_id)`, and predecessor relationships MUST remain valid. Runtime roles MUST NOT update or delete release history.

#### Scenario: Persisted release retains complete evidence

- GIVEN a policy mutation commits
- WHEN its release is read from history
- THEN all required identity, payload, actor, time, validation, diff, correlation, and lineage evidence is present
- AND its active ordering is deterministic

#### Scenario: Duplicate logical identity is rejected

- GIVEN a release already exists for a kind, schema version, and payload hash
- WHEN another release attempts the same logical identity
- THEN the duplicate is rejected with a typed safe result
- AND existing release and audit history remain unchanged

#### Scenario: Runtime history mutation is rejected

- GIVEN a runtime role attempts to update or delete a production release
- WHEN database authority is enforced
- THEN the operation is rejected
- AND the historical row remains unchanged

### Requirement: Activation is immediate, revalidated, and atomic

Given a valid payload and expected active release, activation MUST execute as one short, network-free transaction that reauthorizes and locks membership, serializes mutation by policy kind, rereads and compares the expected active release, strictly revalidates and canonicalizes the payload, and atomically inserts exactly one immutable release and one successful audit event. Operator mutation requests MUST be size-bounded and rate-limited with the existing local rate-limiting authority.

#### Scenario: Valid activation commits one complete change

- GIVEN an active operator submits a valid production payload and the current expected active release ID
- WHEN activation is confirmed
- THEN exactly one new release and exactly one activation audit event commit atomically
- AND the new release is immediately eligible for deterministic active selection

#### Scenario: Payload is changed after review

- GIVEN a payload was reviewed but differs when activation is requested
- WHEN activation revalidates and canonicalizes the submitted payload
- THEN activation uses only the newly validated canonical payload and hash
- AND any mismatch or invalidity returns a typed safe failure with no committed release or successful-change audit

#### Scenario: Audit persistence fails

- GIVEN release insertion succeeds within a transaction but audit insertion fails
- WHEN the transaction completes
- THEN the transaction rolls back
- AND neither the release nor a successful-change audit event is committed

#### Scenario: Mutation exceeds bounds or rate limit

- GIVEN a mutation request exceeds an established size bound or the operator exceeds the applicable existing local rate limit
- WHEN the request is evaluated
- THEN a typed safe failure is returned
- AND no release or successful-change audit commits

### Requirement: Concurrent policy changes never silently overwrite

Mutations for the same policy kind MUST be serialized and MUST compare the caller's expected active release with the current deterministic active release. Competing activations, supersessions, rollbacks, or retries from the same expected release MUST produce at most one winning active release; every stale competitor MUST receive a typed refresh-required conflict.

#### Scenario: Same-predecessor mutations race

- GIVEN two authorized mutations for the same kind use the same expected active release
- WHEN they execute concurrently
- THEN at most one mutation commits a new active release
- AND each stale competitor receives a typed refresh-required conflict

#### Scenario: Stale request does not become last-write-wins

- GIVEN the active release changed after an operator reviewed a mutation
- WHEN the operator submits the old expected active release ID
- THEN no new release or successful-change audit is committed
- AND the response identifies a safe typed conflict requiring refresh

### Requirement: Supersession and rollback preserve all history

Supersession and rollback MUST create a new immutable production release that supersedes the current release and MUST apply the same authorization, confirmation, expected-active comparison, serialization, validation, canonicalization, atomic audit, bounds, and rate-limit rules as activation. Rollback MUST restore validated historical content as a new release rather than mutating history. Historical releases, audit events, policy snapshots, and already-admitted operations MUST remain unchanged and traceable to their original release.

#### Scenario: Supersession creates a new linked release

- GIVEN an authorized operator confirms replacement content against the current expected release
- WHEN supersession succeeds
- THEN a new immutable release supersedes the prior active release
- AND the prior release and its evidence remain unchanged

#### Scenario: Rollback creates a new release from historical content

- GIVEN an authorized operator selects validated historical content and confirms against the current expected release
- WHEN rollback succeeds
- THEN a new immutable release containing that validated content supersedes the current release
- AND neither the selected historical release nor the current predecessor is rewritten

#### Scenario: Already-admitted operation remains pinned

- GIVEN an operation was admitted with an exact policy release and evaluated-input snapshot
- WHEN that policy is later superseded or rolled back
- THEN the admitted operation and snapshot continue to reference their original release
- AND their evidence is not recomputed against the new active release

### Requirement: Invalid or unavailable policy authority has zero prohibited effects

Unknown kinds or versions, missing or ambiguous validators, non-production fixtures, invalid, dangerous, or oversized payloads, canonical hash mismatches, corrupt or ambiguous active state, stale predecessors, audit failures, database failures, and failed snapshot assertions MUST return typed safe errors and MUST NOT commit a release or successful-change audit. Such failures MUST NOT trigger a fixture, environment, browser, latest-row, provider, usage, billing, entitlement, or other fallback effect.

#### Scenario: Hash or predecessor evidence is invalid

- GIVEN the submitted canonical hash does not match the strictly canonicalized payload or its expected predecessor is stale or invalid
- WHEN a mutation is attempted
- THEN a typed safe error or refresh-required conflict is returned as applicable
- AND no release or successful-change audit commits

#### Scenario: Database failure leaves no partial authority

- GIVEN a database constraint, lock, insert, or commit operation fails
- WHEN a policy mutation executes
- THEN a typed safe failure is returned
- AND no orphan release, orphan successful-change audit, provider call, usage write, or billing mutation remains

#### Scenario: Operation admission lacks exact authority

- GIVEN active release selection is missing, ambiguous, corrupt, unsupported, or fails exact snapshot assertions
- WHEN an operation seeks admission under that policy
- THEN admission is denied with safe evidence
- AND no fixture, environment, latest-row, provider, usage, billing, or job-system fallback occurs

### Requirement: Audit history is append-only, complete, and safe

Bootstrap, revocation, activation, supersession, rollback, and their applicable outcomes MUST record append-only audit evidence containing server-derived actor identity or bootstrap type, a closed action and outcome, prior and new release references where applicable, kind, schema version, payload hash, bounded safe diff, correlation ID, and database timestamp. Runtime roles MUST NOT update or delete audit history. Audit projections MUST exclude credentials, authorization headers, unrestricted payloads, provider data, raw secret-like values, and unnecessary customer data.

#### Scenario: Successful policy change is traceable

- GIVEN activation, supersession, or rollback commits
- WHEN its audit history is inspected
- THEN one corresponding audit event contains the required safe actor, action, outcome, release, policy, diff, correlation, and database-time evidence

#### Scenario: Bootstrap and revocation are traceable

- GIVEN membership bootstrap or revocation commits
- WHEN audit history is inspected
- THEN the event identifies the server-derived actor or bootstrap type and the closed action, outcome, correlation, and database time without exposing prohibited data

#### Scenario: Runtime audit mutation is rejected

- GIVEN a runtime role attempts to update or delete an audit event
- WHEN database authority is enforced
- THEN the operation is rejected
- AND the audit event remains unchanged

### Requirement: Database access is least-privileged and defense-in-depth

Application-owned operator, release, and audit data MUST deny public Data API access, MUST be protected by row-level security without public `anon` or `authenticated` access policies, and MUST enforce applicable constraints and append-only behavior independently of application checks. Direct-server authorization MUST remain mandatory. The operator path MUST NOT use a Supabase service-role client or use the existing `adminProcedure`; policy persistence MUST NOT import the Story 1.3a contract package.

#### Scenario: Data API role attempts direct access

- GIVEN an `anon` or `authenticated` Data API role attempts to read or mutate operator membership, release, or audit authority directly
- WHEN database privileges and row-level security are applied
- THEN access is denied

#### Scenario: Application bypass attempt lacks authorization

- GIVEN a direct server database client does not carry the request user's row-level security context
- WHEN an operator operation is requested
- THEN fresh direct-server membership authorization is still required
- AND database reachability alone grants no operator authority

#### Scenario: Privileged fallback is unavailable

- GIVEN normal operator authorization or persistence fails
- WHEN the system evaluates alternatives
- THEN it does not use a service-role client, `adminProcedure`, or package-level persistence to bypass the failure

### Requirement: Transport and route authority remain independently enforced

The `business.policy` transport MUST accept strict, bounded typed envelopes and expose only safe serializable projections. Every procedure MUST independently authorize the request; route rendering or visibility MUST NOT grant procedure authority. The direct `/operator` route MAY use the same authorization authority for presentation, but unauthorized users MUST remain unable to read or mutate policy data through either boundary.

#### Scenario: Route visibility does not authorize a procedure

- GIVEN a requester can navigate to or render some part of `/operator`
- WHEN a business-policy procedure is called
- THEN the procedure performs its own fresh operator authorization
- AND route state is not treated as proof of authority

#### Scenario: Transport rejects unknown input

- GIVEN a request envelope contains unknown, malformed, forged-actor, or oversized fields
- WHEN the procedure validates the request
- THEN it returns a typed safe error
- AND no policy read or mutation occurs

### Requirement: Operator experience is target-native, typed, localized, and accessible

The direct `/operator` experience MUST use the existing application shell, `@onlook/ui`, Tailwind, dark theme, and `next-intl`, and MUST provide typed editors only for registered production policy validators. It MUST present kind, schema version, validation issues, canonical hash, bounded safe diff, actor and time, active and supersession state, history, explicit confirmation, and loading, denial, empty or unavailable, invalid review, pending, conflict, success, and failure states. All supported locale catalogs MUST preserve message-key parity. Keyboard order, visible focus, labels, error association, status announcements, high zoom, responsive layout, non-color cues, and reduced-motion behavior MUST meet WCAG 2.2 AA.

#### Scenario: Operator reviews and confirms a valid change

- GIVEN an authorized operator uses a registered typed policy editor
- WHEN review succeeds and confirmation is requested
- THEN the page presents the required policy identity, validation, hash, safe diff, actor/time, active/history, and confirmation evidence
- AND success is displayed only after both release and audit commit

#### Scenario: Denial and conflict are accessible

- GIVEN authorization is denied or a mutation returns a stale conflict
- WHEN the route presents the result
- THEN the state is conveyed through text and assistive-technology announcements rather than color alone
- AND focus is moved or retained predictably for recovery

#### Scenario: Interaction remains operable under accessibility conditions

- GIVEN a user navigates by keyboard, uses high zoom or a narrow viewport, prefers reduced motion, or relies on associated labels and errors
- WHEN they use each operator state
- THEN content and controls remain perceivable, ordered, operable, and understandable at WCAG 2.2 AA

#### Scenario: Locale catalogs remain in parity

- GIVEN any supported application locale is selected
- WHEN `/operator` renders its states
- THEN the operator-policy message namespace has the same keys in every locale
- AND the existing localization behavior remains intact

### Requirement: Scope remains limited to policy operation

This change MUST NOT introduce persisted drafts, scheduled activation, runtime membership management, global navigation or shared-shell changes, recreate or reuse `apps/admin`, or provide arbitrary JSON, SQL, prompt, provider-payload, credential, database, or generic administration consoles. It MUST NOT alter project access, customer/workspace ownership, products, prices, subscriptions, checkout, rate limits, allowances, usage, billing, entitlements, AI/editor, publishing, providers, or job systems. It MUST NOT add an external dependency, dependency upgrade, generic shared/common package, story-number runtime directory, root manifest or environment change, service-role authority, MFA implementation, or changes to existing administrative procedures.

#### Scenario: Operator cannot administer unrelated product authority

- GIVEN an authorized operator uses `/operator`
- WHEN they inspect available actions
- THEN only review, history, immediate activation, supersession, and rollback for registered production policies are available
- AND no customer, project, billing, provider, job, credential, or membership administration is exposed

#### Scenario: Preview remains in memory

- GIVEN an authorized operator reviews a draft without confirming activation
- WHEN the review completes or the route session ends
- THEN no persisted draft or scheduled release exists

#### Scenario: Direct route remains undiscoverable by this change

- GIVEN the change is delivered
- WHEN existing global navigation, top bars, route constants, root/app/project layouts, shared UI primitives, tokens, icons, and styles are inspected
- THEN this change has not modified them to advertise or host `/operator`

### Requirement: Existing product behavior remains unchanged

The system MUST preserve existing authentication, customer routes, projects/editor, AI, publishing/domains, subscription/billing/usage, tRPC router behavior outside the additive policy surface, locale behavior, package behavior, and all Story 1.3a contract and fixture behavior. The change MUST NOT promote non-production fixtures or invent a parallel administration, authorization, billing, project, provider, or job architecture.

#### Scenario: Existing product regression matrix remains green

- GIVEN the operator slice is present
- WHEN focused Story 1.3a tests and the complete applicable product regression matrix execute
- THEN existing behavior remains unchanged
- AND current results are recorded rather than inherited from prior story evidence

#### Scenario: Non-production fixture remains non-promotable

- GIVEN the deterministic Story 1.3a qualification fixture exists
- WHEN runtime production bindings and policy history are inspected
- THEN the fixture remains synthetic, non-production, and unavailable for activation or fallback

### Requirement: Database guarantees receive real PostgreSQL evidence

Authorization persistence, row-level security, Data API denial, constraints, immutable releases, append-only audit, membership locking, same-kind concurrency, stale expected-release conflict, atomic release/audit writes, rollback lineage, and runtime update/delete rejection MUST be verified against real PostgreSQL. Mocked database-client tests MUST NOT be treated as sufficient evidence for those guarantees.

#### Scenario: PostgreSQL boundary suite executes

- GIVEN the change is evaluated for acceptance
- WHEN the real PostgreSQL integration or pgTAP suite runs
- THEN it demonstrates membership and revocation behavior, privileges and RLS, constraints, append-only enforcement, concurrency, conflicts, atomicity, lineage, and runtime mutation denial

#### Scenario: Fault injection proves rollback

- GIVEN failures are injected after authorization, release insertion, or audit staging
- WHEN each mutation transaction terminates
- THEN no orphan release or successful-change audit remains
- AND no downstream provider, usage, or billing effect occurs

### Requirement: Delivery governance is independently authorized

Before runtime editing, every governed path MUST be declared for the `business-policy-operator` capability with owning runtime, role, and exact new or protected classification. Every protected baseline update MUST have its own exact resulting path-and-hash-bound Core Change Request approval; proposal text, planning candidates, or unrelated approvals MUST NOT substitute. Agents MUST NOT create or self-approve such approvals or proceed past a missing exact approval.

#### Scenario: Protected update lacks exact approval

- GIVEN a required protected path does not have an exact resulting path-and-hash-bound approval
- WHEN implementation reaches that path
- THEN work on that path stops
- AND no proposal, planning candidate, or approval for a different path or hash is treated as authorization

#### Scenario: Governed path is undeclared

- GIVEN an implementation path is not declared in the required architecture slice
- WHEN runtime editing is considered
- THEN the path is not edited until its exact capability ownership and classification are declared

### Requirement: Generated authorities remain maintainer-only

Database migration files, snapshots, journal metadata, the generated English typed-message declaration, `bun.lock`, and dependency-resolution output MUST be produced and reviewed only through their approved maintainer workflows. Agents MUST NOT run database generation, hand-edit generated migration metadata or typed-message declarations, edit lockfiles, or claim ownership of generated outputs. Separately reviewed grants, RLS, append-only, or advisory-lock SQL MUST be added by the maintainer when generation cannot express it.

#### Scenario: Database schema needs generated artifacts

- GIVEN approved schema source changes require migration, snapshot, or journal output
- WHEN generation is needed
- THEN a maintainer runs and reviews the approved generation workflow
- AND an agent neither runs generation nor hand-edits its metadata

#### Scenario: Locale or package change affects generated output

- GIVEN approved locale or package changes would alter typed messages or dependency resolution
- WHEN generated declarations or lock output are required
- THEN the maintainer produces and reviews them
- AND agents do not edit `en.d.json.ts`, `bun.lock`, or equivalent resolution output

### Requirement: Production activation acknowledges authentication assurance limits

This change MUST NOT claim that ordinary login is compromise-resistant and MUST NOT claim to implement MFA or AAL2. Before production policy activation is enabled operationally, Supabase AAL2 MUST be required after MFA becomes available, or the owner MUST explicitly record acceptance of the ordinary-login risk. Operator review and history access remain governed by active membership unless separately changed by authoritative requirements.

#### Scenario: Production activation is enabled with AAL2

- GIVEN Supabase MFA and AAL2 are available and required for the operator
- WHEN production activation is enabled operationally
- THEN activation may proceed under the operator authorization and mutation requirements
- AND the authentication assurance is not overstated

#### Scenario: Owner accepts ordinary-login risk

- GIVEN AAL2 is not required or unavailable
- WHEN production activation is proposed
- THEN activation remains operationally blocked until the owner explicitly records acceptance of the ordinary-login risk
- AND the system does not represent ordinary login as compromise-resistant
