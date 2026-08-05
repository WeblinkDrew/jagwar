# Delta for Product Contract Governance

## MODIFIED Requirements

### Requirement: Inherited Onlook behavior is preserved additively

Future capabilities MUST preserve inherited Projects, fixed-starting-template behavior, project and branch creation, editor, AI CREATE toolchain, generator, presets, leads, versions, source and complete Git, publishing and republishing, settings modal, Stripe foundation, UI system, authenticated editor and project routes, live preview, iframe/preload mutation, Penpal RPC, DOM editing, screenshots, HMR, reconnect, tasks, terminals, watches, source export, customer-controlled transfer, stable preview domains, custom domains, lifecycle, rollback, and existing-site outcomes except where a separately approved capability specification authorizes a narrow additive extension. This change narrowly supersedes only CodeSandbox BYOK credential/provider binding, CodeSandbox provider/template infrastructure identity while preserving fixed-starting behavior, Freestyle preview hostname binding, and Freestyle publishing implementation. CodeSandbox and Freestyle MUST remain operational parity baseline, migration source, comparison authority, and rollback path until verified parity, reversible cutover and rollback evidence, and later separate retirement approval. The editor MUST NOT be wrapped or redesigned, and Jagwar MUST NOT introduce a second generator, editor, source, Git, project, or publisher model.

(Previously: Inherited fixed CodeSandbox template, creation, editor, CREATE, publishing, settings, Stripe, UI, routes, export, and Git behavior were preserved except for separately approved narrow additive extensions.)

#### Scenario: A downstream capability needs inherited behavior to change

- GIVEN a proposed implementation would alter inherited behavior outside the four authorized infrastructure supersessions
- WHEN its capability SDD is reviewed
- THEN the change MUST be rejected unless a separate product-contract specification explicitly authorizes it and delivery governance is satisfied

#### Scenario: Replacement parity is not verified

- GIVEN a replacement provider exists but any required parity, reversible cutover, or rollback evidence is incomplete
- WHEN legacy shutdown or retirement is requested
- THEN CodeSandbox and Freestyle MUST remain operational and the request MUST be denied

### Requirement: Dependency sequencing does not authorize implementation

This change MUST remain planning-only until separately authorized delivery. Any future implementation MUST begin with prerequisite-aware capability SDD and MUST be partitioned into dependency-ordered cohesive 250–400 changed-line Strict-TDD RED→GREEN→TRIANGULATE→REFACTOR slices. Eligible follow-on slices SHOULD be auto-forecast and chained only while each remains below 400 changed lines; work MUST split before exceeding that bound. Workspace authority MUST precede dependent operations, commercial authority MUST precede funded provider operations, provider-neutral identity MUST precede migration, parity MUST precede cutover, and rollback proof MUST precede rollout expansion. Planning dependencies MUST NOT authorize runtime edits, resources, migrations, manifests, CCRs, tests, generated changes, lockfile changes, commits, apply, verify, sync, archive, or provider retirement.

(Previously: Each implementation effort required capability SDD, 250–400 changed-line slices, prerequisite ordering, and normal authorization gates.)

#### Scenario: Specification is approved

- GIVEN this specification phase is complete
- WHEN implementation authorization is evaluated
- THEN design and tasks MAY be recommended next
- AND no code, provider, migration, manifest, CCR, test, commit, or lifecycle action MUST be inferred as authorized

#### Scenario: Forecast exceeds 400 changed lines

- GIVEN a future cohesive slice is forecast to exceed 400 changed lines
- WHEN delivery is planned
- THEN it MUST be split before implementation while preserving dependency order and Strict-TDD progression

### Requirement: Delivery preserves repository governance

Before every governed future slice, delivery MUST have exactly one reviewed architecture manifest that declares that slice's governed paths. Before every protected inherited file edit, delivery MUST additionally obtain a new per-file CCR bound to the exact path and exact candidate resulting SHA-256. A truthful candidate hash MUST be recorded only after the exact candidate patch exists. Generated migrations MUST remain maintainer-owned; agents MUST NOT run or edit `db:gen`, generated database output, generated artifacts, or `bun.lock`, and MUST preserve unrelated dirty work. The deferred protected `.gitignore` `.atl/` error MUST block any architecture-pass claim until resolved; package-size findings MUST remain warnings rather than passes or blockers.

(Previously: Future implementation required Bun, preservation of dirty work, slice manifests, exact resulting hash-bound CCRs for protected paths, no generated or lockfile edits, and maintainer-only database generation.)

#### Scenario: Planned slice requires a protected path

- GIVEN a future governed slice has one reviewed manifest but a protected file lacks a new CCR for its exact path and candidate resulting SHA-256
- WHEN implementation is evaluated
- THEN that file edit MUST remain blocked

#### Scenario: Candidate patch does not yet exist

- GIVEN a CCR is being prepared before the exact candidate patch exists
- WHEN a resulting hash is requested
- THEN no hash MUST be claimed as truthful

#### Scenario: Architecture check reports only known findings

- GIVEN the protected `.gitignore` `.atl/` governance error remains deferred and package-size findings are present
- WHEN architecture status is reported
- THEN architecture MUST NOT be reported as passing
- AND package-size findings MUST be reported only as warnings
