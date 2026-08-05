# Proposal: Replatform Editing and Preview Infrastructure

## Change

`replatform-editing-and-preview-infrastructure`

## Status

Planning-only proposal. It authorizes this proposal artifact and later native planning phases only; it does not authorize provider replacement, implementation, apply/verify/sync/archive activity, runtime code, migrations, manifests, Core Change Requests (CCRs), tests, generated output, lockfile changes, provider resources, commits, or retirement of CodeSandbox or Freestyle.

This proposal cannot claim an architecture pass while the known deferred protected `.gitignore` `.atl/` governance error remains unresolved. Existing package-size findings remain warnings rather than architecture failures.

## Intent

Establish the product and migration boundaries for moving Jagwar's inherited editing and preview infrastructure away from provider-specific CodeSandbox and Freestyle assumptions without changing the product behavior those providers currently protect.

The current implementation couples editable runtime identity, source authority, preview addressing, and publishing behavior to CodeSandbox and Freestyle. That coupling makes provider migration unsafe: provider identity is embedded in branch and URL assumptions, no provider-neutral source or deployment identities exist, reconnect and cleanup are incomplete, and the publishing path lacks durable artifact, source-revision, deployment, activation, and rollback identities. A direct replacement would risk source loss, editor regressions, broken public URLs, cross-tenant exposure, and irreversible cutover.

The intended outcome is a staged, evidence-driven replatform that introduces provider-neutral contracts before migration, proves parity per project and branch, preserves stable public preview behavior, and permits atomic reversible authority cutover. Existing CodeSandbox and Freestyle systems remain the parity baseline, migration source, comparison authority, and rollback providers until separately approved retirement.

## Authority and narrow supersession

`reconfirm-jagwar-product-contract` remains canonical product and planning authority. The current repository remains implementation and inherited-behavior authority. Completed plans for `establish-workspace-authority`, `establish-lead-pipeline`, and `establish-commercial-entitlements-usage` remain authoritative dependencies. BMAD, Telio, informal handoffs, and implementation artifacts are evidence only and are not delivery authority.

Product-contract governance permits this proposal to seek narrowly additive supersession of the following provider-specific requirements and scenarios:

1. **`codesandbox-byok`**
   - Supersede the CodeSandbox-specific form of `Every workspace supplies its own credential`, including the Owner-valid-key and Member-submits-key scenarios.
   - Supersede the CodeSandbox-specific form of `Invalid credential state fails closed`, including revoked-key and validation-unavailable scenarios.
   - Supersede the CodeSandbox-specific form of `Credential persistence is server-only and auditable`, including concurrent replacement behavior.
   - Reconcile CEU-016 without weakening server authority, workspace isolation, secret handling, auditability, or fail-closed admission.
   - The replacement compute funding and credential model is an explicit unresolved commercial decision. This proposal infers neither Jagwar-funded compute nor a new BYOK requirement.
2. **`website-creation-presets`**
   - Narrowly supersede only the provider and fixed-template infrastructure identity within `Inherited creation toolchain is preserved`, scenario `Website is generated`.
   - Preserve CREATE, editor, generator, preset, prompt, and product outcomes. Template behavior remains stable unless template versioning is separately governed.
3. **`publishing-hosting-lifecycle`**
   - Narrowly supersede only Freestyle hostname/provider implementation within `Inherited publishing and previews remain intact`, scenario `Subscribed user republishes a preview`.
   - Preserve stable mutable public preview identity, republish behavior, lifecycle, domains, rollback, export, and existing-site outcomes.
4. **`product-contract-governance`**
   - Remains the required authority mechanism for every narrow additive supersession.

No other product-contract requirement is superseded by this proposal.

## Observed baseline

The repository does not currently implement Cloudflare as an editing or publishing provider:

- `@onlook/code-provider` exposes a Provider/factory shape, but only CodeSandbox is functionally supported; NodeFS is an incomplete/no-op placeholder.
- Branch `sandboxId` is the current provider and source-runtime identity. CodeSandbox template and preview-hostname assumptions are hard-coded, including provider-specific URL parsing.
- A sandbox is initial source authority and contains the complete `.git`; IndexedDB is a filtered editable mirror that excludes `.git`.
- Existing creation paths include blank/fixed-template creation, public Git import, local upload through a blank sandbox, branch/project forks, and a separate publishing fork.
- Existing editor/runtime behavior includes browser and server sessions, recursive watches, file synchronization, terminals, resumable `dev` tasks, commands, preview iframes, preload mutation, Penpal RPC, HMR, screenshots, reconnect-by-recreate, and hibernate/shutdown routes.
- Existing source and transfer behavior includes Git status, history, commits, notes, restore, and directory download/export. No explicit Git push or customer-transfer workflow was found.
- Reconnect and cleanup are incomplete. There are no provider-neutral port, capability, source, or deployment identities.
- Publishing does not persist a provider deployment ID, source revision, artifact hash, or rollback target. Freestyle cancellation, unpublish, and custom-domain lifecycle assumptions remain coupled to inherited behavior.
- Cloudflare Sandbox SDK, R2, OpenNext, Workers, and Containers are not implemented.

These observations are migration constraints, not authorization to modify the referenced implementation.

## Scope

### In scope for planning

- Define a staged migration from CodeSandbox to Cloudflare Sandbox SDK behind or by extending the existing provider/file architecture.
- Require provider-neutral editable-runtime resource and source identities before migrating authority away from `sandboxId`.
- Define parity evidence for each project and branch across source, complete `.git`, file operations, hashes, builds, tasks, terminals, recursive watches, previews, iframe/preload behavior, Penpal RPC, HMR, screenshots, reconnect, lifecycle controls, Git behavior, and export.
- Prove static Next.js compatibility in isolation before proposing an immutable R2 artifact pipeline, one wildcard routing Worker, and an atomic active-version pointer.
- Permit compatible dynamic/SSR publishing to be evaluated through OpenNext on Cloudflare Workers or Workers for Platforms, with explicit compatibility evidence.
- Fail closed when static or OpenNext compatibility cannot be proven. A container or other Node-compatible fallback is never selected automatically; it requires demonstrated incompatibility and a separately governed hosting lifecycle. One always-on container per stored site is prohibited.
- Preserve stable mutable public preview identity throughout migration. Existing Freestyle routes must continue resolving or use a proven reversible continuity mechanism until separate retirement authority.
- Define atomic, reversible authority cutover with CodeSandbox/Freestyle comparison and rollback retained throughout migration.
- Move custom domains only after source, runtime, preview, publishing, rollback, and route-continuity parity is proven.
- Retain provider mappings, source/deployment relationships, historical evidence, and rollback capability until a separately approved retirement lifecycle defines retirement and retention boundaries.

### Product behavior to preserve

Future delivery must preserve:

- project, branch, source, and Git relationships;
- editor and CREATE outcomes;
- version history and restore behavior;
- source export and customer-controlled transfer outcomes;
- live preview, iframe/preload mutation, RPC, HMR, terminal, task, command, watch, and reconnect behavior;
- stable mutable public preview identity and republishing;
- publishing, custom-domain, suspension, retention, reactivation, deletion, and rollback outcomes; and
- existing-site availability throughout reversible migration.

Provider identity is infrastructure, not product behavior. Whether Owners need migration status or operational notices remains an explicit UX and operations decision; no provider branding or migration UI is inferred here.

### Security and authority scope

Future specifications and designs must fail closed and define controls for:

- untrusted source code and dependencies;
- tenant filesystem, process, network, egress, cache, secret, backup, artifact, R2, source, domain, and deployment isolation;
- CPU, memory, storage, process, fork-bomb, runaway-task, timeout, and concurrency limits;
- terminal and command authorization;
- preview and routing enumeration resistance;
- malicious Git repositories and software supply-chain input;
- audit-safe, redacted logs and evidence;
- removed-member and revalidated workspace authority;
- named system actors for background build, publish, routing, lifecycle, and cleanup work; and
- sanitized denials that do not disclose cross-workspace identities or provider secrets.

Authentication remains owned by workspace authority. Commercial entitlement and admission remain owned by commercial capabilities. Replacement compute funding and credential policy cannot be implemented until the explicit commercial decision is made.

## Capability ownership and dependency direction

Future planning must preserve these ownership boundaries:

- **Editable runtime:** provider-neutral sandbox, source, port, capability, task, terminal, watch, and runtime lifecycle contracts.
- **Project and branch:** product relationships to runtime/source identities; no ownership of provider interpretation.
- **Git and export:** repository history, transfer, download, and export outcomes.
- **Editor:** preview iframe, preload mutation, Penpal RPC, HMR, and editor-facing session behavior.
- **Publishing:** build intent, source revision, artifact identity, activation intent, rollback target, and publish result.
- **Static preview:** immutable R2 artifact versions, wildcard routing, active-version resolution, and static delivery evidence.
- **Dynamic hosting:** OpenNext/Workers compatibility evidence and runtime-specific deployment behavior.
- **Hosting lifecycle:** domains, suspension, retention, reactivation, deletion, and provider retirement coordination.
- **Workspace authority:** authenticated actor and membership authority.
- **Commercial capabilities:** entitlement, admission, metering, and the unresolved compute funding/credential policy.
- **Provider adapters:** translation of provider resources, errors, URLs, ports, tasks, and lifecycle state into owned contracts.
- **Analytics:** projections and operational/product reporting, not source-of-truth workflow state.

Dependencies must flow through focused public contracts. Deep imports, sibling-internal coupling, cross-capability persistence reads, and provider identifiers leaking into product-owned contracts are prohibited. Runtime and deployment composition roots must keep provider adapters replaceable without moving product authority into infrastructure modules.

## Migration principles

1. Introduce provider-neutral identities and contracts before any source, runtime, preview, or deployment authority migration.
2. Keep CodeSandbox/Freestyle operational as baseline, source, comparison, and rollback providers.
3. Copy and reconcile source without treating a temporary build sandbox or filtered IndexedDB mirror as sole authority; preserve complete `.git` evidence.
4. Establish deterministic per-branch/project parity evidence, including source hashes and runtime/editor/publishing capabilities.
5. Prove static compatibility separately from dynamic/SSR compatibility.
6. Create immutable, content-addressable or equivalently verifiable artifacts before activation.
7. Cut over authority atomically through a reversible pointer or mapping; never infer success from resource creation alone.
8. Preserve public route continuity and migrate custom domains last.
9. Exercise rollback and reconcile active authority before expanding rollout.
10. Retain legacy mappings and evidence until separately approved retirement; no big-bang migration or silent provider retirement is allowed.

## Explicit non-goals

- Implementing or activating Cloudflare Sandbox, R2, OpenNext, Workers, Workers for Platforms, or Containers.
- Replacing providers, creating provider resources, or moving source/deployment authority through this proposal.
- Selecting a replacement compute funding or credential model.
- Building a second editor, generator, CREATE path, Git implementation, export path, or publishing product.
- Changing project, branch, preset, prompt, editor, preview, republish, domain, export, customer-transfer, cancellation, retention, or existing-site outcomes.
- Automatically assigning incompatible sites to containers.
- Maintaining one always-on container per stored site.
- Treating a temporary build sandbox, IndexedDB mirror, generated artifact, or deployment as sole source authority.
- Migrating custom domains before all preceding parity and rollback gates pass.
- Retiring CodeSandbox/Freestyle, deleting mappings, or discarding historical migration/rollback evidence.
- Introducing deep imports, cross-capability persistence reads, or provider identity as a product contract.
- Creating specs, design, tasks, implementation slices, manifests, CCRs, tests, migrations, generated output, lockfile changes, commits, or apply/verify/sync/archive artifacts in this phase.

## Affected areas

Later, separately authorized planning and delivery may affect:

- code-provider contracts, factories, adapters, and provider-specific URL/port/task interpretation;
- project and branch resource/source relationships currently represented by `sandboxId`;
- source synchronization, complete Git preservation, forks, reconnect, cleanup, hibernation, and shutdown;
- editor session, terminal, command, watch, iframe, preload, RPC, HMR, screenshot, and export integrations;
- build intent, artifact persistence, deployment identity, activation, route resolution, and rollback records;
- static preview delivery through R2 and wildcard routing;
- compatible dynamic/SSR deployment through OpenNext and Workers;
- separately approved incompatibility fallback lifecycles;
- public preview continuity, custom domains, cancellation, unpublish, suspension, retention, reactivation, and deletion;
- workspace authority, commercial admission, audit actors, analytics projections, and security controls; and
- architecture governance for every future implementation slice.

This is an impact map only and grants no edit authorization.

## Delivery governance

Future implementation requires dependency-ordered, cohesive 250–400 changed-line Strict-TDD slices. Slices should be auto-forecast and chained while each remains below 400 changed lines; work must be split before it exceeds that bound.

Before every governed slice, delivery requires one exact reviewed architecture manifest covering that slice. Before every protected inherited edit, delivery additionally requires a new per-file CCR bound to the exact path and exact candidate SHA-256. Truthful hashes may be produced only after the exact candidate patches exist; this proposal supplies none.

Generated migrations remain maintainer-owned. Agents must not run or edit `db:gen`, generated database output, generated artifacts, or `bun.lock`. Existing user work must be preserved. Legacy rollback remains operational until separate retirement authority.

The deferred protected `.gitignore` `.atl/` governance error prevents any claim that architecture currently passes. Package-size warnings remain warnings and must not be misrepresented as either passes or blockers.

## Risks and mitigations

- **Source or Git loss:** Preserve complete `.git`, provider/source mappings, immutable comparison evidence, and an authoritative source-reconciliation process; never promote the filtered IndexedDB mirror or temporary build runtime to sole authority.
- **Editor parity regression:** Require per-branch/project proof for tasks, terminals, commands, watches, previews, iframe/preload mutation, RPC, HMR, screenshots, reconnect, lifecycle routes, Git, and export before cutover.
- **Broken public preview identity:** Keep existing Freestyle routes resolving or provide a proven reversible continuity mechanism; migrate custom domains last.
- **Irreversible or split-brain cutover:** Use one explicit active authority, atomic pointer changes, idempotent reconciliation, rollback exercises, and retained legacy mappings.
- **Static/dynamic incompatibility:** Prove compatibility in isolation and fail closed when evidence is absent. Require separate approval for any container fallback.
- **Cross-tenant compromise by untrusted code:** Enforce filesystem, process, network, egress, secret, artifact, route, cache, backup, and domain isolation with bounded resources and sanitized logs.
- **Commercial authority gap:** Block dependent delivery until compute funding, credentials, entitlement, and metering policy are explicitly decided; infer neither Jagwar funding nor BYOK.
- **Provider leakage into product contracts:** Keep provider interpretation in adapters and expose provider-neutral capability, source, runtime, artifact, deployment, and rollback identities.
- **Lifecycle inconsistency:** Keep publishing activation separate from hosting suspension/retention/deletion and require deterministic reconciliation across provider failures.
- **Premature legacy retirement:** Retain providers, mappings, evidence, and rollback until separately approved retirement criteria and retention boundaries exist.
- **Governance bypass:** Require exact manifests and candidate-hash CCRs per governed slice; do not treat this proposal as implementation permission or an architecture pass.

## Rollback strategy

### Planning rollback

If this proposal's direction is rejected, supersede or remove its planning artifact without changing runtime behavior. The canonical product contract and current provider behavior remain in force. Any later planning based on this proposal must pause and be reconciled explicitly rather than silently reverting authority.

### Future delivery rollback

Every migration slice must preserve the last verified CodeSandbox/Freestyle authority, mappings, source/deployment evidence, and route continuity. Rollback must atomically restore the prior active runtime, artifact, deployment, or route pointer; reconcile in-flight writes and publishes; preserve audit history; and prove that projects, complete Git history, exports, public previews, and domains resolve to the intended version.

A failed compatibility proof, incomplete parity result, ambiguous authority state, missing mapping, failed continuity check, or unavailable rollback target must stop cutover. Legacy resources and evidence cannot be deleted by rollback or ordinary cleanup. Their retirement and eventual retention boundary require a separately approved lifecycle change.

## Success criteria

This proposal succeeds when:

- planning recognizes `reconfirm-jagwar-product-contract` as product authority and the repository as inherited implementation authority;
- only the enumerated CodeSandbox BYOK, fixed provider/template identity, Freestyle hostname/provider, and publishing implementation details are eligible for narrow governance-controlled supersession;
- provider-neutral resource, source, capability, artifact, deployment, activation, and rollback identities are required before authority migration;
- CodeSandbox and Freestyle remain operational baseline, migration source, comparison authority, and rollback providers until separately approved retirement;
- source, complete `.git`, editor, CREATE, Git, version, export, transfer, runtime, preview, RPC, publishing, custom-domain, rollback, and existing-site outcomes are explicitly protected;
- stable public preview identity is preserved through continued Freestyle resolution or a proven reversible continuity mechanism;
- static and OpenNext compatibility require isolated evidence, unsupported cases fail closed, and container fallback is neither automatic nor always-on-per-site;
- per-project/branch parity, atomic reversible cutover, rollback proof, and custom-domains-last sequencing gate future rollout;
- security requirements cover untrusted execution, tenant isolation, resource limits, terminal authority, route enumeration, supply chain, redacted audit, membership revalidation, and named system actors;
- capability ownership and dependency direction prohibit deep imports, provider leakage, and cross-capability persistence reads;
- compute funding and credential policy plus Owner-facing migration-status UX remain explicit unresolved decisions rather than inferred behavior;
- future delivery is constrained to dependency-ordered 250–400 changed-line Strict-TDD slices with exact reviewed manifests and per-file exact-candidate-hash CCRs where protected edits are required;
- no architecture pass is claimed while the protected `.gitignore` `.atl/` error remains deferred, and package-size warnings remain accurately classified; and
- this phase creates only this proposal and does not authorize or produce any later planning, implementation, provider, generated, governance, commit, or lifecycle artifact.

## Resolved proposal assumptions and open decisions

The auto-mode proposal round is resolved using the supplied authority and conservative assumptions:

1. Replacement compute funding and credentials remain a commercial decision; no Jagwar-funded or new BYOK model is inferred.
2. Stable public preview identity is preserved, with existing Freestyle routes resolving or covered by proven reversible continuity until retirement authority exists.
3. Unproven static/OpenNext compatibility fails closed; container fallback requires evidence and separate lifecycle approval.
4. Provider identity is not product behavior. Owner-facing migration status remains an explicit UX/operations decision.
5. Legacy mappings, evidence, and rollback remain until a separate retirement lifecycle defines any retirement or retention boundary.

These decisions are sufficient to finalize this planning proposal. Commercial compute policy and Owner-facing migration UX remain downstream decision gates and do not authorize implementation.
