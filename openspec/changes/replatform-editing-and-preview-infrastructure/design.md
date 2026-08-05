# Design: Replatform Editing and Preview Infrastructure

## Status and authority

Planning-only design for `replatform-editing-and-preview-infrastructure`. OpenSpec is authoritative. This design authorizes no tasks, runtime code, migration, provider resource, schema generation, architecture manifest, Core Change Request (CCR), test, generated output, `bun.lock` edit, commit, apply/verify/sync/archive action, provider disconnect, or retirement.

The proposal and all ten corrected specification artifacts are inputs: 49 requirement headings and 100 scenarios. `reconfirm-jagwar-product-contract` remains product authority; the repository remains inherited implementation authority. Cloudflare is a proposed target, **not current Jagwar behavior**.

A `packages/coding-agent` workspace is not present in the observed repository. The nearest existing reusable infrastructure seam is `packages/code-provider`; therefore this design extends `@onlook/code-provider` and keeps agent/editor callers on that public seam rather than inventing a `coding-agent` package. Scope necessarily crosses the web server, browser editor, persistence, publishing, and hosting boundaries enumerated below.

## Design section inventory

1. Observed repository behavior
2. Existing gaps or unsafe assumptions
3. Proposed architecture
4. Identity, authority, and lifecycle model
5. Editable-runtime contracts and state machines
6. Cloudflare Sandbox durability decision
7. Staged dual-provider migration
8. Static publication lane
9. Dynamic publication lane
10. Exceptional Node-compatible fallback
11. Publishing, routing, domains, and hosting lifecycle
12. Security and threat model
13. Data flow, failures, reconciliation, and observability
14. File-change and governance plan
15. Verification strategy and rollout gates
16. Decisions, alternatives, and unresolved items
17. Preserved capabilities and narrow supersessions
18. Requirement traceability (49/49)
19. Compatibility evidence still required

# Observed repository behavior

## Provider, factory, and runtime boundary

- `packages/code-provider/src/types.ts` defines abstract `Provider`, `ProviderFileWatcher`, `ProviderTerminal`, `ProviderTask`, and `ProviderBackgroundCommand`. Its surface covers files, watch, terminal, task, foreground/background command, Git status, browser session, initialize/setup/reload/reconnect/ping, static create/import, pause/stop/list, and destroy.
- `packages/code-provider/src/index.ts` is the public factory. `createCodeProviderClient`, `getStaticCodeProvider`, and `newProviderInstance` select `CodeProvider.CodeSandbox` or `CodeProvider.NodeFs`; options are provider-shaped (`codesandbox`, `nodefs`). The singleton comment does not supply durable identity or concurrency semantics.
- `packages/code-provider/src/providers/codesandbox/index.ts` is functional for server resume and browser `connectToSandbox`, browser session creation, files, recursive watches, terminals, named tasks, foreground/background commands, Git status, setup, hibernate, shutdown, and account-wide listing. `CodesandboxProvider.reconnect` is a TODO.
- `packages/code-provider/src/providers/nodefs/index.ts` returns empty or successful no-op values for most operations and throws for Git import. It is an incomplete placeholder and is not parity evidence.
- `packages/constants/src/csb.ts` fixes `SandboxTemplates.BLANK = xzsy8c`, `SandboxTemplates.EMPTY_NEXTJS = pt_EphPmsurimGCQdiB44wa7s`, port `3000`, task `dev`, domain `csb.app`, and `getSandboxPreviewUrl(sandboxId, port) => https://{sandboxId}-{port}.csb.app`.
- There is no Cloudflare Sandbox SDK, mount, backup, R2, wildcard Worker, OpenNext, Workers for Platforms, or container adapter in the repository.

## Product identity and creation/fork callers

- `packages/db/src/schema/project/branch.ts` requires branch `sandboxId`; `packages/db/src/mappers/project/branch.ts` maps it to `branch.sandbox.id`. `packages/db/src/schema/project/project.ts` retains nullable legacy `sandboxId`. Branch sandbox identity therefore currently combines provider resource, editable runtime, initial source location, and preview addressing.
- `apps/web/client/src/components/store/create/manager.ts` forks the fixed `EMPTY_NEXTJS` template for CREATE and calls `sandbox.createFromGitHub` for public Git import.
- `apps/web/client/src/hooks/use-create-blank-project.ts` and `apps/web/client/src/app/projects/_components/top-bar.tsx` fork fixed templates and create project records.
- `apps/web/client/src/app/projects/import/github/_hooks/use-repo-import.ts` imports a public clone URL through `sandbox.createFromGitHub`, then creates the project.
- `apps/web/client/src/app/projects/import/local/_context/index.tsx` forks the `BLANK` template, creates a browser CodeSandbox provider, uploads local files, runs setup, and then creates the project. This is not a direct durable-source import.
- `apps/web/client/src/server/api/routers/project/sandbox.ts` owns `sandboxRouter.create`, `fork`, `createFromGitHub`, `start`, `hibernate`, `delete`, and `list`. Creation and fork use `CodesandboxProvider.createProject`; import uses `createProjectFromGit`; previews use `getSandboxPreviewUrl`. `list` receives account-wide resources and filters them against accessible sandbox IDs.
- `apps/web/client/src/server/api/routers/project/branch.ts` forks a branch by cloning its `sandboxId`; `createBlank` clones `EMPTY_NEXTJS`; both synthesize CSB preview URLs and frame records.
- `apps/web/client/src/server/api/routers/project/fork.ts` (`forkAllBranches`) clones every source branch sandbox and remaps project/canvas/frame records.
- `apps/web/client/src/server/api/routers/publish/helpers/fork.ts` (`forkBuildSandbox`) creates a separate deployment fork from the branch `sandboxId`.

## Editor, source mirror, sessions, files, tasks, and preview

- `apps/web/client/src/components/store/editor/engine.ts` defines the protected inherited `EditorEngine` composition root. It composes `BranchManager` with the existing canvas, AST, chat/CREATE, element, frame, screenshot, history, and editing managers. It must not be wrapped or replaced.
- `apps/web/client/src/components/store/editor/branch/manager.ts` defines `BranchManager`; each branch owns one `SandboxManager`, `HistoryManager`, `ErrorManager`, and IndexedDB-backed `CodeFileSystem`. It calls the existing branch fork/create APIs.
- `apps/web/client/src/components/store/editor/sandbox/index.ts` defines `SandboxManager`; it creates `SessionManager`, `GitManager`, `CodeProviderSync`, router detection, preload injection, file/export methods, and teardown.
- `apps/web/client/src/components/store/editor/sandbox/session.ts` defines browser `SessionManager`. It always constructs `CodeProvider.CodeSandbox`, asks server `sandbox.start` for a browser session, creates task and terminal sessions, restarts `dev`, runs commands, hibernates, pings, and reconnects by trying the provider TODO then destroying/recreating it.
- Server CodeSandbox sessions are resumed in `CodesandboxProvider.initialize`; browser sessions are minted by `sandboxRouter.start` through `CodesandboxProvider.createSession` and consumed by `connectToSandbox`.
- `apps/web/client/src/services/sync-engine/sync-engine.ts` defines `CodeProviderSync`. On start it pulls provider files into `CodeFileSystem`, watches both directions, hashes content, interprets a two-path `change` as a likely rename, and recursively fills newly observed directories. Its key is `{sandboxId}:{fs.rootPath}`.
- `CodeProviderSync.DEFAULT_EXCLUDES` excludes `node_modules`, `.git`, `.next`, `dist`, `build`, and `.turbo`; `SandboxManager` adds `EXCLUDED_SYNC_PATHS`. Consequently IndexedDB is a filtered editable mirror. The sandbox/provider filesystem containing complete `.git` is the observed initial source authority; IndexedDB is not complete source authority.
- `packages/code-provider/src/providers/codesandbox/index.ts` maps CSB watch events (`add|change|remove`), terminal/task/background-command objects, and `git.status`. `apps/web/client/src/components/store/editor/sandbox/terminal.ts` consumes task/terminal objects; the named `dev` task is expected to resume/restart.
- `apps/web/client/src/components/store/editor/sandbox/preload-script.ts` copies and injects the preload script into the detected Next layout for iframe communication.
- `apps/web/client/src/app/project/[id]/_components/canvas/frame/view.tsx` defines `IFrameView`, establishes Penpal with `WindowMessenger`, exposes DOM mutation/inspection and screenshot RPC methods, and registers the iframe with `FramesManager`. `use-frame-reload.ts` bounds Penpal reconnect time; `use-sandbox-timeout.ts` triggers sandbox reconnect UX.
- Screenshot persistence is initiated by `apps/web/client/src/components/store/editor/screenshot/index.tsx`; editor HMR/iframe reload, preload mutation, RPC, DOM editing, browser/server session, screenshot, and reconnect behavior together form the inherited parity baseline.
- `apps/web/client/src/components/store/editor/git/git.ts` implements Git status, init/config, commit/history/notes/restore through provider commands; `SandboxManager.downloadFiles` downloads `./` as export. No explicit push workflow was observed and this design does not claim one.

## Publishing, Freestyle, routes, domains, and cleanup

- `packages/db/src/schema/domain/deployment.ts` persists an internal deployment ID, project, requester, build sandbox ID, URL list, type/status/progress/log/error, build command/flags, and `envVars`. It does not persist source generation/revision, provider kind/resource deployment ID, artifact hash, activation, active pointer, or rollback target.
- `apps/web/client/src/server/api/routers/publish/helpers/deploy.ts` creates deployment rows and `deployFreestyle`; the latter converts files and calls `HostingProviderFactory.create(HostingProvider.FREESTYLE)`.
- `apps/web/client/src/server/api/routers/domain/hosting-factory.ts` supports only Freestyle. `domain/adapters/freestyle.ts` calls `FreestyleSandboxes.deployWeb` and returns `deploymentId`, but the calling publish flow discards that provider deployment ID.
- `apps/web/client/src/server/api/routers/publish/helpers/publish.ts` forks a build sandbox, runs `PublishManager`, extracts sandbox environment, merges it with requested environment, and calls Freestyle.
- `apps/web/client/src/server/api/routers/publish/manager.ts` mutates only the disposable publish fork: adds Next build configuration, edits its `.gitignore`, builds, expects `.next/standalone/server.js`, copies public/static/lockfile material, and serializes files. This is observed compatibility baseline, not provider-neutral normative behavior.
- `apps/web/client/src/server/api/routers/publish/deployment.ts` records request/run/cancel status. Cancel updates the database but does not cancel provider work. `publish/helpers/unpublish.ts` deploys an empty file set to the route; there is no durable rollback state machine or provider cleanup proof.
- `packages/db/src/schema/domain/preview.ts` owns stable preview-domain records. `domain/custom/{domain.ts,project-custom-domain.ts,verification.ts}` own custom-domain and verification rows. `apps/web/client/src/server/api/routers/domain/verify/**` performs DNS and Freestyle verification; `domain/custom.ts` marks local records cancelled. Provider attachment persistence, certificate lifecycle, provider detach/cleanup, atomic rollback, and reconciliation are incomplete.
- Existing hibernate/shutdown routes exist, but build forks and provider resources do not have a complete durable cleanup/retention contract. CodeSandbox remains the account/lifecycle baseline; Freestyle remains the public-route baseline.

# Existing gaps or unsafe assumptions

1. `sandboxId` conflates product, source, runtime, port, and provider identity; provider URLs leak into frame state.
2. Provider options and factory selection are provider-shaped; there is no versioned capability negotiation or explicit degraded/unknown result.
3. NodeFS no-ops can look successful and must never be accepted as parity.
4. The filtered IndexedDB mirror omits `.git` and generated trees; it cannot migrate complete source. Sync rename inference and interrupted watch delivery are not durable evidence.
5. CodeSandbox `reconnect` is unimplemented; client recreation does not reconcile source, task, port, watch, browser/server session, or RPC authority.
6. Sandbox/process state is assumed available after resume, but no source-revision-bound durable recovery contract exists.
7. File fidelity lacks explicit mode, symlink, binary, normalization, case-collision, and atomic rename rules.
8. Commands/tasks/terminals lack provider-neutral identities, explicit limits, durable status, idempotency, and audit-safe errors.
9. Publication success is inferred from orchestration completion; provider deployment ID, artifact, activation, active pointer, and rollback are absent.
10. Build and runtime environment values are merged, and sandbox-derived values can reach deployment; explicit policy separation is absent.
11. Cancel does not cancel provider execution; unpublish is an empty deployment; no cleanup, rollback, certificate cleanup, or unknown-outcome reconciliation is complete.
12. Source inspection alone cannot classify arbitrary edited Next.js projects as static or dynamic compatible.
13. Provider account listing and guessed IDs create enumeration risk unless every dispatch remains server-authorized and tenant-scoped.
14. Commercial compute funding and credential ownership are unresolved; provider readiness must not imply paid-operation admission.
15. Legacy resource deletion on an unknown/partial provider result would destroy rollback evidence.

# Proposed architecture

## Architecture spine: capability-owned ports with explicit composition

Extend the existing `@onlook/code-provider` Provider/factory intentionally. Do not add a parallel provider framework, editor, source store, Git model, project model, generator, or publisher. Product capabilities own identities and transitions; adapters translate external APIs. Server composition roots inject adapters through focused public contracts. Browser code receives only authorized provider-neutral session and endpoint descriptors.

```text
Browser editor (existing EditorEngine / BranchManager / SandboxManager)
  -> editor session facade
  -> server orchestration composition roots
       -> workspace authority + commercial admission
       -> project/branch public contract
       -> authoritative-source contract
       -> editable-runtime contract (@onlook/code-provider public exports)
       -> Git/export contract
       -> publishing contract
            -> static-preview | dynamic-hosting | approved-fallback
            -> hosting-lifecycle
       -> provider adapter registry
            -> CodeSandbox | Cloudflare Sandbox
            -> Freestyle | R2/Worker | OpenNext/WfP | approved fallback
       -> append-only evidence/audit
Analytics <- projections/events only
```

## Ownership and dependency rules

| Capability | Owns | May depend on | Must not own/read |
| --- | --- | --- | --- |
| Editable runtime | capability descriptors; runtime, session, task, terminal, port, watch, backup transitions | source identity, authority decision, injected adapters | projects, entitlements, publish activation |
| Project/branch | product relationships and active source/runtime pointer references | public source/runtime results | provider IDs or adapter interpretation |
| Git/export | repository evidence, history/notes/remotes/restore/export outcomes | authoritative source snapshot, runtime execution port | project persistence via direct query |
| Editor | existing iframe/preload/Penpal/HMR/screenshot/session behavior | provider-neutral editor-session contract | provider credentials/IDs or second source store |
| Publishing | build intent, exact revision, artifact/deployment candidate, activation/result/rollback | source contract, commercial admission, lane contracts | domains/lifecycle internals or direct provider state |
| Static preview | classifier evidence, immutable artifacts, wildcard routing, static active pointer | publishing intents, object/route adapters | source authority |
| Dynamic hosting | compatibility evidence, dynamic deployment behavior and active mapping | publishing intents, Worker adapter | fallback selection or domains lifecycle |
| Hosting lifecycle | route/domain verification, suspension, grace, retention, archive/reactivate/delete/retire coordination | active publication contract, provider domain adapters | source mutation |
| Workspace authority | human/system actor, membership and resource authority | authentication | provider execution |
| Commercial | entitlement, admission, metering, compute funding/credential policy | workspace identity | provider readiness as authority |
| Provider adapters | provider resource translation, capability probe, idempotent dispatch/reconcile | owned public ports | product/commercial/publishing authority |
| Analytics | derived product/operational projections | emitted facts | workflow authority or corrective writes |

Rules: imports use package/application public entrypoints; no `@onlook/*/src/*`; no sibling-internal imports; no cross-capability DB reads; no application-private imports from packages; no client import of server credentials; provider IDs occur only in adapter mapping records and adapter inputs. Existing protected composition roots (`EditorEngine`, `BranchManager`, `SandboxManager`, tRPC root/router exports, DB schema exports, code-provider exports) are extended only by exact approved candidate patches.

## Public capability contracts (conceptual)

- `RuntimeProviderCatalog`: versioned `probe`, `create`, `importRepository`, `fork`, `connect`, `reconcile`, `sleep`, `restore`, `shutdown`; every response is `supported | unsupported | degraded | unknown`, includes capability version and safe reason code.
- `SourceAuthority`: `snapshot`, `advance(expectedRevision)`, `copy`, `verify`, `restore`; returns immutable generation/revision and complete-tree/Git evidence.
- `RuntimeSession`: authorized browser/server session descriptor, expiry, runtime generation, resumability, task/watch/port cursors; never credentials.
- `FilePort`: stat/list/read/write/create/move/delete with bytes, path, type, link target, relevant mode, expected revision, idempotency key, and normalized hash.
- `WatchPort`: start from source revision/cursor; emits ordered add/change/remove/rename or explicit gap; a gap forces full reconciliation.
- `ExecutionPort`: bounded command/task/terminal operations with actor, limit policy, idempotency key, status and redacted diagnostics.
- `GitExportPort`: status/history/commit/note/remote/restore/full and directory export evidence; no unverified push claim.
- `PublishingPort`: build intent, artifact/deployment target, activation, cancellation, unpublish, rollback and result.
- `HostingLane`: classify/prove, build/deploy, verify, activate, reconcile, rollback, clean.
- `DomainLifecycle`: request/verify/attach/activate/suspend/detach/certificate-clean/reconcile.

# Identity, authority, and lifecycle model

Conceptual only; no migration or concrete schema is authorized.

## Identities, cardinalities, ownership, and versioning

| Identity | Cardinality and owner | Version/concurrency rule |
| --- | --- | --- |
| Workspace | Root tenant; workspace authority | Stable opaque ID; membership version revalidated |
| Project | Many per workspace; project capability | Stable product ID; never provider-derived |
| Branch | Many per project; project/branch capability | Stable ID; one active source pointer and one active runtime pointer |
| Source generation | Many per branch over destructive imports/rewrites; source capability | Immutable lineage ID |
| Source revision | Many ordered revisions per generation | Immutable; content root + complete Git root; compare-and-swap branch head |
| Runtime resource | Many per branch/provider over time; editable runtime | Provider-neutral ID; runtime generation increments on recreate |
| Provider kind | Catalog value (`codesandbox`, proposed `cloudflare-sandbox`, etc.) | Versioned capability profile |
| Provider resource ID | One or more mappings per runtime/deployment | Adapter-owned, encrypted/opaque at client boundaries |
| Migration state | One current state per branch/project plus immutable attempts | Optimistic version; stage monotonic except explicit rollback/reconcile |
| Preview endpoint | Many endpoints per runtime/port generation | Opaque endpoint ID; endpoint target can rotate; authorization/expiry versioned |
| Port | Many per runtime; unique `(runtime generation, port number, protocol)` | readiness version and health evidence |
| Task | Many per runtime generation; logical named task may map to attempts | stable logical task ID + attempt ID; CAS state |
| Backup | Many per runtime/source revision | immutable backup ID and manifest; never source authority |
| Build intent | Many per branch revision | immutable input identity; idempotency key unique per policy/revision |
| Artifact | Zero or many per build | immutable artifact ID, manifest/provenance/content hash |
| Deployment | Zero or many per build/artifact | provider-neutral deployment ID + adapter mappings |
| Route | Stable preview/custom route identity; hosting lifecycle | one active publication pointer; versioned CAS |
| Domain | Many per workspace/project subject to product policy | durable ownership/verification/provider/cert state |
| Active pointer | One each for branch source, branch runtime, and public route | atomic compare-and-swap with expected version and verified rollback target |
| Rollback target | At least one verified target before cutover/activation | immutable reference; retained while required |
| Evidence | Many records per operation/revision/stage | append-only, immutable hash/provenance/time/actor; corrections append |

Every mutating intent carries an idempotency key scoped as `workspace + operation kind + logical target + client/system request ID`; provider dispatch additionally stores provider request key and attempt. Optimistic concurrency uses `expectedVersion` on source/runtime/route/domain/credential pointers. A response timeout produces `unknown`, never a retry that assumes failure.

## Authoritative pointers

- Branch source pointer references exactly one immutable source revision.
- Branch runtime pointer references exactly one runtime resource and the source revision loaded into it.
- Stable route pointer references exactly one verified artifact/deployment version.
- Pointers may be `known-active`, `switching`, `ambiguous`, or `blocked`; `ambiguous` blocks writes, builds, publishes, and deletion until reconciliation.
- Provider resources, backups, build sandboxes, IndexedDB, artifacts, and deployments are replicas/derivatives, never implicit source authority.

## Core lifecycle states

- Source: `capturing -> verifying -> authoritative | rejected | unknown`; revision advance: `requested -> applied -> verified -> committed`, with conflict/unknown requiring reconcile.
- Runtime/fork: `requested -> provisioning -> loading-source -> verifying -> ready -> active -> sleeping -> restoring -> ready`, terminal `failed | shut-down`; `unknown` is reconcilable and non-authoritative.
- Session: `requested -> authorized -> connecting -> connected -> disconnected -> reconciling -> connected | denied | expired`.
- Task/terminal: `requested -> starting -> running -> stopping -> exited`; `lost/unknown` reconciles by provider identity; resumable logical tasks may create a new attempt.
- Port: `declared -> probing -> ready -> unhealthy -> closed`; endpoint issuance only from ready + authorized.
- Watch: `starting -> live -> gap -> reconciling -> live | failed`; no cursor continuity means full-tree comparison.
- Backup: `requested -> creating -> verifying -> valid -> restoring -> restored`; alternatives `partial | corrupt | expired | deleted | unknown`.
- Build/artifact/deployment: `requested -> admitted -> building -> verifying -> candidate -> activating -> active`; failure/unknown never changes prior active pointer.
- Domain: `requested -> ownership-pending -> dns-pending -> certificate-pending -> attach-pending -> active -> suspended -> detach-pending -> detached`; any provider ambiguity enters `reconciling` while old verified route stays authoritative.
- Migration: `not-started -> baseline-captured -> copying -> parity-testing -> ready -> switching -> cutover -> rollback-proven -> expanded`; `blocked | ambiguous | rolled-back` are explicit.

# Editable-runtime contracts and state machines

## Capability negotiation and adapters

The existing Provider/factory evolves additively into versioned focused subcontracts while retaining a compatibility facade for existing callers. CodeSandbox and proposed Cloudflare Sandbox adapters coexist in the registry. Selection occurs server-side from current branch authority and commercial policy, never from browser input. NodeFS advertises unsupported/degraded for every unimplemented capability; no empty/no-op response may satisfy a readiness gate.

Required capability profile: fixed-start creation, public Git import, complete project/branch/publish fork, source load/export, bytes/symlink/mode fidelity, atomic rename or reconcilable emulation, recursive watch/cursor/gap, foreground/background/resumable command, authenticated terminal, named task (`dev`), browser/server session, health, port discovery/readiness, sleep/restore/shutdown, durability method, complete Git operations, full/directory export, quotas, provider API/version.

## File and source fidelity

Canonical evidence walks every entry in bytewise normalized path order and records entry type, encoded path, content hash or symlink target hash, relevant executable mode, and normalization policy. It rejects path traversal, absolute paths, NULs, unsupported device entries, case/Unicode collisions, symlink escape, and limits overflow. Source and `.git` roots are separately hashed; only explicitly documented metadata normalization may differ.

A rename is one logical operation with old/new path and expected revision. Native atomic rename is preferred. An adapter lacking it must expose `degraded` and may emulate copy+verify+delete only under a journal that survives partial failure; watch consumers receive one logical rename or a gap, never guessed parity. Writes are conditional on the active source/runtime revision and produce a new source revision only after provider write, durable-source commit, and verification converge.

## Commands, terminals, tasks, ports, watches, and sessions

- Limits are policy references, not adapter defaults: CPU, memory, storage, PIDs/children, wall time, idle time, output bytes, concurrent commands/terminals/tasks, open files, network/egress, and provider quotas.
- Terminal creation revalidates actor/membership/branch immediately before dispatch; terminal tokens are short-lived, audience-bound, single-workspace, and never provider credentials.
- Logical `dev` task survives reconnect; if provider process state is absent, reconciliation creates a new attempt from the authoritative revision, reruns approved setup, waits for declared port health, then reissues the endpoint.
- Background commands are durable intents with bounded logs and status. Unknown provider completion is inspected before retry.
- Port readiness requires process/task association, TCP/HTTP health as appropriate, bounded consecutive successes, and runtime generation match. A stale endpoint cannot route to a new tenant/runtime accidentally.
- Watch gaps, reconnects, backup restore, runtime recreation, and authority switches trigger a full source/provider/IndexedDB reconciliation. IndexedDB is refreshed only after authoritative source and active runtime agree.
- Browser and server sessions bind workspace/project/branch/runtime generation/source revision/capability version/expiry. Reconnect re-resolves active mappings and recreates only non-resumable pieces.

## Editor, iframe, RPC, Git, and export

`EditorEngine`, `BranchManager`, and `SandboxManager` remain composition roots. `SessionManager` receives a provider-neutral session facade; frame URLs receive an opaque preview endpoint. Existing preload copy/injection, layout detection, iframe origin policy, Penpal channel/methods, DOM edit flows, HMR behavior, screenshot capture, timeout and reload behavior remain unchanged unless parity evidence authorizes an additive correction.

Git/export reads the authoritative complete repository or a verified runtime loaded from its exact revision. Parity includes status, commit graph and objects required by the inherited flow, notes, remotes, restore, full download and directory export. Customer transfer remains preserved at the verified inherited level; no push support is invented.

# Cloudflare Sandbox durability decision

## Decision: durable source is authoritative; sandbox state is disposable

Cloudflare Sandbox filesystem and process state are **not assumed durable after sleep, eviction, restart, or provider incident**. The provider-neutral authoritative source is a server-controlled, tenant-isolated, versioned complete repository store containing all files and complete `.git`. Runtime sandboxes are checked-out execution replicas. This prevents a sandbox, backup, mounted volume, build fork, IndexedDB mirror, artifact, or deployment from becoming sole authority.

The physical authoritative-source technology and operational owner require separate approval; this design binds semantics, not a provider. A Cloudflare backup and/or mounted durable storage may accelerate recovery only after spike proof. If neither passes, restore always starts from authoritative source.

## Backup contract

Backup identity binds: opaque backup ID; workspace/project/branch; source generation/revision; runtime resource and generation; provider kind/resource mapping; backup format/version; capability version; creation and completion times; TTL/expiry; file count/bytes; full-tree root; complete `.git` root; manifest hash; encryption/key version; creator system actor; status and restore attempts.

Creation is permitted at a verified clean source/runtime boundary, before sleep, and at policy checkpoints. Dirty runtime state must first become an authorized source revision or be labelled an uncommitted recovery snapshot that cannot become authority. Creation uses idempotency key `backup:{runtime}:{sourceRevision}:{policyEpoch}`. Upload/creation completion is followed by independent manifest/hash verification; only then state is `valid`. TTL never shortens source or migration-evidence retention.

Restore preconditions: active branch/source authority matches the bound revision (or an explicit rollback intent selects it), backup is valid/unexpired, provider/capability format is supported, membership/system-actor authority and commercial admission pass. Restore occurs into a non-authoritative runtime generation, verifies source and `.git` roots, then recreates processes rather than assuming process snapshots survive. Corrupt, partial, expired, wrong-revision, or unknown backups remain evidence and trigger restore from authoritative source or legacy mapping; they do not activate.

After file restore, reconciliation reruns bounded setup if required; creates a new `dev` task attempt; rediscovers and health-checks ports; starts watches from a fresh cursor; refreshes IndexedDB after source/runtime agreement; mints new browser/server sessions and preview endpoint; re-establishes preload/Penpal/HMR/screenshot checks. Partial process/watch/port rehydration keeps runtime non-ready. Unknown backup deletion never deletes source or evidence.

## Spike validation required before implementation

Cloudflare Sandbox SDK lifecycle, supported files/symlinks/modes, command/terminal streaming, task persistence, port exposure, sleep/eviction behavior, backup create/list/restore/delete semantics, TTL, consistency, integrity metadata, backup binding to sandbox versions, durable mount availability/semantics, mount isolation, concurrent writers, quotas, region behavior, API idempotency, and failure responses are unverified. No implementation may claim these semantics until executable spikes and approved provider documentation evidence pass.

# Staged dual-provider migration

The following is the exact user-authorized 16-stage order. Each stage has preconditions, evidence, commit point, rollback, and reconciliation. A stage may be split into Strict-TDD delivery slices but not reordered. Unknown success never deletes or supersedes evidence.

| # | Stage | Preconditions and evidence | Commit point | Rollback and reconciliation |
| ---: | --- | --- | --- | --- |
| 1 | Revise product-contract infrastructure authority | Approved four narrow supersessions; preserved-capability ledger | Planning authority records the revised infrastructure boundary | Revert planning only; runtime unchanged |
| 2 | Provider-neutral source/resource identities | Workspace/commercial dependencies; contracts prove source, runtime, provider mapping, pointer, CAS, idempotency, and unknown-state separation | Inactive provider-neutral identities and mappings exist while all active pointers remain legacy | Remove unused additive records/contracts; no provider switch |
| 3 | Cloudflare Sandbox parity behind the existing provider boundary | Approved commercial policy; SDK spikes; capability negotiation; fixed-template/create/import/fork, files, commands, terminal, `dev`, ports, sessions, and durability probes through `@onlook/code-provider` | Cloudflare adapter is eligible only for shadow resources behind the existing Provider/factory seam | Destroy only verified disposable test resources; retain evidence; CodeSandbox remains active |
| 4 | Migration tooling copies full source and `.git` | Exact legacy source revision frozen/captured; destination is non-authoritative | Verified destination generation/revision exists with full-tree and complete `.git` roots | Keep legacy authoritative; quarantine partial destination; reconcile unknown copy by durable identities and hashes |
| 5 | Verify file hashes, Git, build, tasks, terminal, watches, preview, iframe/RPC, and export | Stage 4; same source revision and capability versions | Immutable branch-scoped evidence passes file and `.git` hashes, build, tasks, terminal, commands, watches, preview, iframe/preload/Penpal RPC, DOM edit, HMR, screenshot, reconnect, Git, and export | Any missing/different check fails parity; rerun as a new evidence record, never overwrite |
| 6 | Retain CodeSandbox mapping | Recoverable CodeSandbox resource/session/source mapping for every migrating branch | Retention hold and CodeSandbox rollback reference commit | Missing mapping blocks later stages; reconciliation discovers or verifies mappings without deletion |
| 7 | Atomic per-branch/project authority switch | Current-revision evidence; actor/membership/entitlement revalidation; verified CodeSandbox rollback mapping | One CAS changes branch source/runtime authority; a project switch transacts an explicit complete branch set or aborts | CAS restores CodeSandbox authority; ambiguous timeout blocks writes and reconciles pointer/provider hashes |
| 8 | Provider-neutral publishing artifact/target contracts | Exact authoritative source revision; publishing/lifecycle ownership; runtime cutover need not be global | Build intent, artifact/deployment target, activation, result, and rollback records can coexist with Freestyle | Keep inherited publisher active; abandon only verified inactive additive candidates |
| 9 | Persist Freestyle deployment identities | Recoverable provider deployment IDs and workspace/project/branch/source/public-route relationships | Verified Freestyle baseline mappings persist with immutable evidence | Missing/ambiguous ID blocks route cutover without disrupting the resolving preview |
| 10 | Static R2 preview publication | Stage 8 contracts and stage 9 baseline; exact-revision isolated static proof; R2 artifact, wildcard Worker, security, limits, activation, and rollback evidence | A verified immutable R2 artifact and static route target become an activation candidate only | Prior Freestyle publication remains active; remove only verified inactive disposable objects/resources |
| 11 | OpenNext dynamic publication | Stage 8 contracts and stage 9 baseline; exact-revision isolated OpenNext/Workers or Workers for Platforms build/runtime proof, isolation, limits, routing, and rollback evidence | A verified immutable dynamic deployment becomes an activation candidate only | Prior publication remains active; unknown provider/route results reconcile before retry or cleanup |
| 12 | Container fallback only if demonstrated and separately approved | Exact revision demonstrably fails stages 10 and 11 for named features; separate architecture, commercial, security, hosting-lifecycle, and operations approval | A governed fallback deployment may become a candidate; selection is never automatic | Without complete evidence/approval, publication fails closed and provisions nothing; prior route remains active |
| 13 | Preview-route migration | Stage 5 parity, stages 8–12 applicable lane evidence, stage 9 Freestyle identity, stable-identity continuity, and rollback probe | Atomic stable preview-route pointer/mapping changes to one verified candidate | CAS back to Freestyle/previous route; ambiguous timeout preserves the last provable route and blocks further mutation |
| 14 | Custom domains last | Source, runtime, editor, publishing, preview-route continuity, DNS/certificate/provider attachment, and exercised rollback all pass | Per-domain atomic route/provider attachment activation | Keep old route/certificate authoritative until the new state is verified; reverse attachment under the domain state machine |
| 15 | Disconnect legacy only after parity and rollback proof | All scoped branches/projects/domains pass; rollback has been exercised; no unresolved edits/publishes or ambiguous pointers | Disable new CodeSandbox/Freestyle work only for the explicitly migrated scope; mappings/resources/evidence remain retained | Re-enable legacy admission and restore verified pointers; reconcile in-flight edits/publishes; disconnect never retires |
| 16 | Retire legacy only through a later owner-approved lifecycle | New owner-approved retirement SDD; retention/export/customer notice/operations criteria; no required rollback dependencies | Explicit provider/resource retirement commits under that later lifecycle | Retirement-specific recovery applies; this design grants no retirement authority |

Stage 5 evidence must use exact source and `.git` hashes plus build/tasks/terminal/commands/watch rename and gap behavior/preview port/iframe/preload/Penpal RPC/DOM editing/HMR/screenshots/browser+server reconnect/export. Stage 7 is per branch by default; a project-wide switch lists every branch and commits atomically or not at all. Writes are paused only for a bounded final reconcile/CAS window; divergent in-flight writes create a conflict revision and block switch. Legacy mappings and immutable evidence survive rollback, cleanup, unknown results, and ordinary deletion until the later owner-approved stage 16 lifecycle says otherwise.

Rollout cohorts and expansion are an internal delivery gate, not a migration stage: after an exercised rollback and accepted incident/reconciliation evidence, rollout policy may expand from fixtures to staff/test workspaces and then small branch-scoped cohorts. Any regression stops expansion and rolls back the affected cohort without changing or reordering stages 1–16.

# Static publication lane

## Compatibility classifier and matrix

Source inspection is a hint generator only. Classification proof is an isolated, network/secret/compute-bounded build and delivery test of the exact source revision under the declared builder and environment policy.

| Feature/input | Static lane decision |
| --- | --- |
| Server Actions | Unsupported unless proof shows eliminated/non-request-time behavior under an explicitly accepted toolchain version |
| Route handlers/internal APIs | Unsupported when reachable or required at request time |
| Middleware/proxy | Unsupported unless build and isolated delivery prove equivalent precomputed behavior; ambiguity fails |
| Cookies/headers | Request-time reads fail static |
| Dynamic rendering | Fails static |
| ISR/revalidation | Fails unless represented as approved build-time-only generation with no request-time regeneration |
| Runtime env | Fails; only allowlisted build values may be embedded and inspected |
| Image optimization | Server optimizer fails; prebuilt/passthrough assets require exact proof |
| Node APIs | Runtime use fails; build-only use is bounded and recorded |
| Native dependencies | Build/runtime portability must be proven; unknown ABI fails |
| Arbitrary imports/edits | Invalidate prior evidence and require a new exact-revision proof |

## Immutable artifact and R2 layout

A verified artifact has immutable manifest and provenance: artifact ID; workspace/project/branch; source generation/revision; build intent; builder image/toolchain/dependency-lock identities; environment-policy hash; timestamps; file entries with path/content type/encoding/hash/size/cache policy; fallback/error declarations; source-map policy; total counts/bytes; manifest hash; signature/attestation; verification results. Build output cannot mutate source or `.git`.

Exact conceptual R2 keys (opaque tenant IDs are route-independent):

```text
v1/tenants/{workspaceOpaque}/projects/{projectOpaque}/branches/{branchOpaque}/artifacts/{artifactId}/manifest.json
v1/tenants/{workspaceOpaque}/projects/{projectOpaque}/branches/{branchOpaque}/artifacts/{artifactId}/objects/{sha256}/{percentEncodedCanonicalPath}
v1/tenants/{workspaceOpaque}/projects/{projectOpaque}/branches/{branchOpaque}/artifacts/{artifactId}/evidence/{evidenceId}.json
```

No mutable `latest` object and no Pages-per-site project. Source, `.git`, secrets, disallowed source maps, provider credentials, and build logs are excluded. Bucket access is service-only and tenant-prefix constrained.

## One wildcard Worker algorithm

1. Accept only governed methods (`GET`, `HEAD`, optional `OPTIONS`); apply request/body/header/rate/bot limits.
2. Normalize host/path once; reject invalid encodings, traversal, ambiguity, and oversized input.
3. Resolve host through a non-enumerable route ID mapping; absent and unauthorized mappings return the same sanitized response.
4. Read one versioned active pointer `(routeId, pointerVersion) -> artifactId`; reject suspended/deleting/ambiguous routes.
5. Resolve canonical manifest path: exact file, declared directory index, then only an explicitly declared SPA fallback; never cross artifact/tenant.
6. Fetch object by tenant-isolated immutable key and verify expected metadata/hash policy; corruption returns controlled error and emits redacted evidence.
7. Set manifest-declared content type, safe headers, ETag based on artifact+object hash, and cache policy; `HEAD` omits body.
8. Cache key includes route ID, pointer version, artifact ID, canonical path, method/encoding variant. Activation CAS increments pointer version; new requests cannot reuse old-version cache. Old cache expires/purges by bounded policy and is harmless because keys differ.

Activation is a CAS from artifact A to verified B with expected route-pointer version and retained rollback A. Rollback is the same operation in reverse. Pointer timeout enters `ambiguous`; reconciler reads durable pointer before retry. Content types come from verified manifest with safe fallback to octet-stream. Missing/corrupt/oversized files and controlled 404/5xx pages never fall through to another artifact. Large files are rejected at build or served only under an approved streaming/range policy with byte limits; no partial cross-object response.

## Environment, retention, and abuse

Build-time values are allowlisted, per-intent, short-lived and redacted. Runtime/server secrets are unavailable. Artifact scanning blocks secret patterns, disallowed source maps, unexpected executables and manifest drift. Retention states are `candidate/active/rollback-held/archived/reactivating/deleting/deletion-partial/deleted`; active and rollback-held versions cannot delete. Reactivation re-verifies hashes and policy. Product deletion never deletes source or migration evidence. Route enumeration, hotlink floods, cache busting, bot traffic, large-range abuse and malformed paths are rate-limited and audited without tenant disclosure.

# Dynamic publication lane

OpenNext on Cloudflare Workers or Workers for Platforms is an option only after an exact-revision isolated build **and runtime** proof. The proof records toolchain/runtime versions and exercises every used Next feature: SSR/RSC, routing, Server Actions, handlers/internal APIs, middleware/proxy, cookies/headers, dynamic rendering, ISR/cache behavior, image handling, assets, Node compatibility, native dependencies, streaming, errors, environment and provider bindings.

Bindings/assets/cache/environment are explicit allowlists. Build values and runtime secrets are separate, versioned, scoped to deployment, server-only and redacted. Tenant isolation covers code bundle, assets, namespaces/bindings, cache keys, logs, deployment and routes. Whether isolation uses Workers for Platforms dispatch namespaces or another approved model is unresolved pending proof; no shared binding may permit tenant-selected cross-tenant identifiers.

Each dynamic deployment is immutable and versioned. Stable routing resolves one active deployment pointer by route ID; activation and rollback use CAS with a retained verified target. Unknown activation reads provider deployment and route state before retry. Safe failure retains prior active publication. Limits cover CPU, memory, duration, requests, concurrency, storage, subrequests, egress and provider quotas. Durable redacted telemetry covers build/deploy/activation/request health/errors/cleanup, and reconcilers repair partial state without inferring success.

# Exceptional Node-compatible fallback

Fallback is not a third automatic classifier result. Selection requires immutable evidence that the exact revision failed both approved static and dynamic lanes for named incompatible features, plus separate architecture, commercial, security and operations approval.

Its separate lifecycle must define provider and operator, tenant isolation, capacity pools, cold start/sleep/wake bounds, stable routing, health, build/runtime secrets, egress, durable source-independent storage, backup integrity, retention, activation/rollback, custom domains/certificates, observability, incident ownership, cleanup and reconciliation. Inactive stored sites consume no continuously running container. Capacity is pooled/on-demand, not one always-on container per site. Wake timeout, corrupt restore, unknown route, provider failure or limit breach returns controlled failure or retains the verified prior route; it never routes to an arbitrary version.

Provider choice and operational model are unresolved pending evidence and explicit approval. No fallback resource may be provisioned under this design.

# Publishing, routing, domains, and hosting lifecycle

## Provider-neutral publication model

A build intent binds exact workspace/project/branch/source generation/revision, lane request, environment-policy references, builder policy, actor, idempotency key and status. A build produces zero or one verified artifact candidate; deployment targets bind artifact/source, lane, provider mapping, environment/binding policy and status. Activation intent binds stable route, candidate, expected pointer version and rollback target. Publish result is `succeeded | failed | cancelled | incomplete | unknown` and references actual active pointer evidence; provider creation alone cannot mark success.

Before route migration, recover and persist existing Freestyle deployment IDs returned by `FreestyleAdapter.deploy`, plus workspace/project/branch/source/public-route/lifecycle relationships. Existing rows without recoverable IDs remain `legacy-identity-unknown` and block cutover while the preview stays live. `forkBuildSandbox` and `PublishManager` standalone mutation remain observed baseline only. Disposable build mutation must never update authoritative source or `.git`.

Build environment and runtime environment are separate policy references. Sandbox environment extraction cannot be forwarded wholesale. Each value has allowed phase, lane, scope, version and redaction policy; client-visible static values pass artifact inspection, and server secrets are injected only into authorized runtime bindings.

## Lifecycle operations

- Republish: idempotent intent for a new exact revision; previous active remains until activation CAS; retry returns prior committed result.
- Cancel: requests cancellation, signals provider where supported, waits/reconciles actual build/deploy state, never changes active route merely because local status changed.
- Unpublish: CAS route to a governed neutral/suspended state only after authority checks; provider cleanup follows and can remain partial without false reporting.
- Rollback: CAS to verified retained artifact/deployment; revalidate source relationship, route and entitlement; preserve failed candidate/evidence.
- Cleanup: deletes only verified inactive disposable resources outside holds. Active, rollback, source, `.git`, legacy mappings and migration evidence are protected.

## Stable previews and custom domains

Stable preview identity is a route product identity independent of hostname provider. Until continuity and rollback are proven, Freestyle continues resolving. Static R2 publication is stage 10, OpenNext dynamic publication is stage 11, separately approved fallback is stage 12, preview-route migration is stage 13, and custom domains are last at stage 14.

Domain durable state binds workspace/project, canonical domain, ownership evidence/version/expiry, DNS expectations/observations, certificate order/status/expiry, provider attachment mapping, route pointer, suspension state, idempotency key, rollback attachment and reconciliation evidence. Verification and attachment are server-side and tenant-isolated. Activation order is verify ownership -> verify DNS -> provision/validate certificate -> attach candidate provider route -> probe externally -> atomic route authority switch. Old attachment/certificate stays authoritative until the switch is proven. Detach and certificate cleanup occur only after rollback window and verified inactive state; unknown cleanup remains retryable. Current local cancellation does not prove provider detach.

Hosting lifecycle owns inherited suspension, 14-day grace, neutral suspension result, 90-day retention, archive, reactivation, deletion and retirement coordination. These transitions remain independent of publish and provider cleanup. Reactivation preserves stable identity. Retirement is never ordinary cleanup.

# Security and threat model

## Trust boundaries and actors

Trust boundaries: browser <-> Next server; server <-> authoritative persistence/source; server <-> untrusted sandbox/build runtime; runtime <-> internet/egress; server/Worker <-> R2/cache; routing Worker <-> public internet; server <-> hosting/domain providers; one workspace <-> every other workspace. No provider credential crosses to browser, iframe, source, artifact, log, analytics or audit.

Human actors are authenticated Owner/Member as resolved by workspace authority. Named system actors are `runtime-reconciler`, `source-copier`, `backup-manager`, `parity-runner`, `migration-controller`, `build-runner`, `publishing-reconciler`, `route-activator`, `domain-controller`, `hosting-lifecycle-controller`, and `cleanup-controller`; each is intent/workspace scoped, least-privileged, time-bounded and auditable.

Sensitive boundaries revalidate membership/resource ownership and commercial admission immediately before provider dispatch, credential/secret release, terminal/command access, cutover, activation, domain mutation and destructive work. Removed members lose existing session, terminal, endpoint and RPC access on reconnect and server authorization checks; tokens are revoked/expire quickly.

## Abuse cases and controls

| Abuse case | Required control |
| --- | --- |
| Malicious source/dependency/Git hooks or supply-chain package | isolated no-trust build/runtime; pinned builder; hooks disabled unless explicitly required; bounded network/egress; provenance and dependency evidence |
| Tenant FS/process/network escape | provider isolation proof, workspace-scoped resources, deny cross-runtime mounts/network, containment tests |
| Fork bomb/runaway tasks/terminal abuse | PID/CPU/memory/time/output/concurrency quotas, kill tree, admission and rate limits |
| Secret exfiltration | server-only vault/bindings, phase allowlists, egress policy, redaction, no client/provider credentials |
| Backup/source/artifact/R2/cache confusion | tenant-prefixed authorization, opaque IDs, manifest/hash checks, encryption, cache key includes tenant/route/version |
| Route enumeration/hotlink/bot abuse | opaque route map, uniform sanitized denial, rate/bot limits, no tenant IDs in public errors |
| Cross-workspace supplied IDs | server derives relationship; direct object lookup always includes workspace authority; existence not disclosed |
| Terminal/session theft | short-lived audience-bound tokens, membership revalidation, runtime generation binding, origin policy |
| Domain takeover/cert confusion | repeated ownership/DNS proof, provider attachment CAS, old route retained, cert cleanup evidence |
| Provider error/log leakage | structured reason codes and centralized redaction before persistence/client response; raw provider payload restricted/retained only under security policy |
| Publish/cache poisoning | immutable artifact/deployment, signed manifest, controlled content types/headers, atomic pointer, no mutable object overwrite |
| Backup bomb/large files | count/size/decompression/path limits before extraction; quarantine on failure |

Client/public denials use sanitized codes such as `NOT_AUTHORIZED`, `NOT_READY`, `LIMIT_EXCEEDED`, `COMPATIBILITY_UNPROVEN`, and `RECONCILIATION_REQUIRED`, without provider ID, credential, tenant identity, source excerpt or existence signal. Audit records include actor/system actor, workspace, action, target class, policy/capability versions, idempotency key, outcome and time, with secrets and sensitive source redacted.

# Data flow, failures, reconciliation, and observability

## Editable open/reconnect flow

1. Server derives actor/workspace/project/branch and revalidates membership/commercial admission.
2. Project/branch contract resolves source and runtime pointers; ambiguous authority stops.
3. Runtime orchestrator negotiates active adapter capability and reconciles runtime generation to exact source revision, restoring from valid backup or authoritative source.
4. It recreates/resumes `dev`, watches and ports; health proof precedes endpoint issuance.
5. Browser receives provider-neutral session/endpoint descriptors and existing editor initializes sync/preload/iframe/Penpal.
6. Sync compares authoritative source, runtime and filtered IndexedDB; a watch gap causes full reconcile.
7. Evidence records versions and outcomes; adapter internals remain server-side.

## Publish flow

1. Workspace and commercial gates admit immutable build intent for exact revision.
2. Classifier uses scan hints then isolated proof: static first, approved dynamic second, separately governed fallback only when authorized.
3. Lane creates and verifies immutable artifact/deployment candidate without source mutation.
4. Publishing creates activation intent with current route pointer and rollback target.
5. Route activation CAS commits exactly one candidate; only verified pointer state marks publish success.
6. Provider timeout becomes unknown; named reconciler inspects intent/provider/route state before retry.
7. Lifecycle cleanup acts later on verified inactive resources.

## Reconciliation invariant

Reconcilers are idempotent state inspectors, not blind retry loops. They compare authoritative intent/pointers, provider mappings, source/artifact hashes and external route health; append evidence; then converge to a known state or remain blocked. Unknown/partial outcomes never trigger evidence, source, mapping, active target, rollback target, domain attachment or certificate deletion.

Observability records correlation/intent IDs, workspace-safe target class, state transition, latency, capability/provider version, limit use, safe reason code and reconciler result. Metrics and analytics are projections only. Alert conditions include ambiguous authority, source/Git mismatch, watch gap backlog, failed restore, activation ambiguity, route mismatch, domain/certificate ambiguity, cleanup age, cross-tenant denial spike and quota exhaustion.

# File-change and governance plan

This is a future impact plan, not authorization. New contracts stay centered on the existing `packages/code-provider` package because no `packages/coding-agent` exists. Server orchestration stays capability-local under `apps/web/client/src/server/services/<capability>/`; transport remains under existing tRPC capability routers; conceptual persistence would be capability-local under `packages/db/src/schema/<capability>/`; provider-specific Worker projects/resources remain unresolved and require separate approved runtime placement.

## Candidate path groups

- `packages/code-provider/src/{types.ts,index.ts,providers.ts}`: additive provider-neutral identities/capability result/factory facade.
- `packages/code-provider/src/providers/codesandbox/**`: adapt existing behavior and explicit capability profile; preserve compatibility.
- `packages/code-provider/src/providers/nodefs/**`: advertise unsupported/degraded rather than no-op parity.
- Future focused Cloudflare adapter under `packages/code-provider/src/providers/cloudflare-sandbox/**` only after SDK spikes and package placement approval.
- `apps/web/client/src/server/services/{editable-runtime,source-authority,provider-migration,publishing,static-preview,dynamic-hosting,hosting-lifecycle}/**`: server orchestration and composition; exact package allocation and persistence design require future SDD.
- Existing browser composition candidates: `apps/web/client/src/components/store/editor/{engine.ts,branch/manager.ts,sandbox/index.ts,sandbox/session.ts,sandbox/preload-script.ts}`, `apps/web/client/src/services/sync-engine/sync-engine.ts`, and frame `view.tsx`/reload/timeout modules—only narrow facade wiring and parity-preserving changes.
- Existing creation/fork candidates: `components/store/create/manager.ts`, local/Git import hooks, `server/api/routers/project/{sandbox.ts,branch.ts,fork.ts}`.
- Existing publishing/domain candidates: `server/api/routers/publish/**`, `server/api/routers/domain/**`.
- Existing persistence/export candidates: `packages/db/src/schema/project/{branch.ts,project.ts}`, `packages/db/src/schema/domain/{deployment.ts,preview.ts,custom/**}`, their mappers/exports, and web tRPC composition exports.
- `packages/constants/src/csb.ts` remains legacy adapter compatibility; fixed starting behavior moves behind a provider-neutral template policy without erasing legacy constants before retirement.

## Exact future manifest and protected-file gate

Every implementation slice must first create exactly one reviewed `architecture/slices/<slice>.json` declaring every actual path, capability, owning runtime, role, and `new`/`protected-original` classification. This design creates none. The candidate groups above must be narrowed to exact paths per 250–400 changed-line slice; no wildcard in a manifest or CCR is valid.

Every inherited file listed below is a protected-file candidate if changed and requires its **own new CCR** naming that exact path and exact candidate resulting SHA-256, approved in `architecture/core-change-approvals.json`, and referenced by that slice's reviewed manifest:

- `packages/code-provider/src/types.ts`
- `packages/code-provider/src/index.ts`
- `packages/code-provider/src/providers.ts`
- `packages/code-provider/src/providers/codesandbox/index.ts`
- `packages/code-provider/src/providers/nodefs/index.ts`
- `packages/constants/src/csb.ts`
- `packages/db/src/schema/project/branch.ts`
- `packages/db/src/schema/project/project.ts`
- `packages/db/src/mappers/project/branch.ts`
- `packages/db/src/schema/domain/deployment.ts`
- `packages/db/src/schema/domain/preview.ts`
- `packages/db/src/schema/domain/custom/domain.ts`
- `packages/db/src/schema/domain/custom/project-custom-domain.ts`
- `packages/db/src/schema/domain/custom/verification.ts`
- `apps/web/client/src/components/store/editor/engine.ts`
- `apps/web/client/src/components/store/editor/branch/manager.ts`
- `apps/web/client/src/components/store/editor/sandbox/index.ts`
- `apps/web/client/src/components/store/editor/sandbox/session.ts`
- `apps/web/client/src/components/store/editor/sandbox/preload-script.ts`
- `apps/web/client/src/services/sync-engine/sync-engine.ts`
- `apps/web/client/src/app/project/[id]/_components/canvas/frame/view.tsx`
- `apps/web/client/src/app/project/[id]/_components/canvas/frame/use-frame-reload.ts`
- `apps/web/client/src/app/project/[id]/_components/canvas/frame/use-sandbox-timeout.ts`
- `apps/web/client/src/components/store/create/manager.ts`
- `apps/web/client/src/app/projects/import/local/_context/index.tsx`
- `apps/web/client/src/app/projects/import/github/_hooks/use-repo-import.ts`
- `apps/web/client/src/server/api/routers/project/sandbox.ts`
- `apps/web/client/src/server/api/routers/project/branch.ts`
- `apps/web/client/src/server/api/routers/project/fork.ts`
- every changed file under `apps/web/client/src/server/api/routers/publish/**` and `apps/web/client/src/server/api/routers/domain/**`, enumerated individually in its candidate slice
- protected DB/package/tRPC aggregate export and package manifest files actually changed, enumerated individually.

Hashes cannot truthfully exist before exact candidate patches exist, so no hash is supplied and every such edit is blocked now. Additional inherited paths discovered in a candidate diff are equally protected. No `db:gen`, generated database output, generated artifact, or `bun.lock` edit is allowed; database generation is maintainer-owned. Existing dirty work remains untouched.

# Verification strategy and rollout gates

Future delivery uses dependency-ordered cohesive 250–400 changed-line Strict-TDD slices: RED -> GREEN -> TRIANGULATE -> REFACTOR. Auto-forecast and chain only eligible next slices below 400 lines; split before exceeding the limit. Suggested dependency slices are contracts/negative capability results; identity/CAS/idempotency; source hash/fidelity; CodeSandbox profile; Cloudflare spikes/adapter pieces; durability/reconcile; browser facade; parity harness; migration pointers; publishing intents; Freestyle baseline capture; static classifier/artifact; wildcard routing; dynamic proof; lifecycle/domain. These are forecasts, not tasks.

Tests/gates must include contract tests shared by adapters; property tests for path/hash/idempotency/CAS; failure injection for timeout/partial/unknown; provider integration spikes; source and `.git` fixtures; watch/rename/gap; command/task/terminal/port limits; reconnect and membership removal; iframe/preload/Penpal/DOM/HMR/screenshot browser evidence; Git/export; artifact/R2/router isolation/cache; OpenNext feature matrix; domain/DNS/cert reconciliation; rollback exercises; security abuse tests; and inherited regression tests.

Per future slice, appropriate commands include focused Bun tests, `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, Storybook browser tests where relevant, `bun scripts/architecture/check.ts --changed`, structure/pre-push gates, and `git diff --check`. No runtime or architecture pass is claimed by this design. The current protected `.gitignore` `.atl/` error blocks an architecture-pass claim; package-size findings are warnings only.

Rollout begins with isolated fixtures, then staff/test workspaces, then small branch-scoped cohorts. Expansion requires source/Git parity, all editor checks, publish/route continuity, exercised rollback, reconciler health, security limits, and accepted operations evidence. Custom domains are last; disconnect follows parity and rollback; retirement is separate.

# Decisions, alternatives, and unresolved items

## Decisions and alternatives

| Decision | Selected | Rejected alternative and reason |
| --- | --- | --- |
| Migration style | Staged dual-provider, branch-scoped CAS | Big-bang replacement cannot preserve evidence or reversible authority |
| Runtime framework | Extend `@onlook/code-provider` with focused contracts | Parallel framework/editor/source/Git/project model would split authority |
| Source durability | Independent authoritative complete repository; sandboxes disposable | Sandbox, backup, mount, build sandbox, or IndexedDB as sole authority risks loss |
| Static delivery | Immutable R2 artifacts + one wildcard Worker | Pages-per-site causes per-site control-plane lifecycle and route sprawl |
| Hosting lanes | Evidence-gated static + dynamic + separately approved fallback | Static-only breaks dynamic sites; automatic fallback hides cost/security incompatibility |
| Fallback operation | Governed on-demand/pool with sleep/wake | One continuously running container per stored site is prohibited and uneconomic |
| Activation | Atomic versioned pointer with retained rollback | Treating provider creation/HTTP response as success permits split-brain |
| Custom domains | Last, reversible, old attachment retained until proof | Early migration risks takeover, certificate ambiguity and broken public identity |

## Unresolved blockers

Implementation-dependent decisions remain unresolved: Cloudflare Sandbox SDK API/version/limits/regions; file/symlink/mode/watch/terminal/task/port parity; backup and mount durability semantics; authoritative-source physical provider and operations; R2 limits/consistency/key exposure/encryption/retention; Worker cache purge/bounds/bot controls; wildcard/custom hostname and certificate APIs; OpenNext supported Next versions and feature matrix; Workers for Platforms isolation/binding/commercial model; egress controls; observability/log retention; provider quotas and incident operations; exceptional fallback provider/capacity model; Freestyle deployment discovery and continuity; custom-domain DNS/cert/provider detach semantics; compute funding/BYOK/credential ownership; metering/pricing; Owner migration-status and failure UX; customer notice/operations; retention/retirement policy.

Each blocks its dependent implementation slice or provider activation, not planning. Cloudflare semantics must be proved by spike and approved evidence before a contract is marked supported.

# Preserved capabilities and narrow supersessions

Preserved: Projects; project/branch creation and relationships; fixed starting behavior; editor; CREATE/generator/presets/prompts/leads/versions; source and complete Git; status/history/commits/notes/remotes/restore; export/customer-controlled transfer; live preview; iframe/preload/Penpal/DOM editing/HMR/screenshots/reconnect; tasks/commands/terminals/watches; authenticated editor/project routes; stable mutable public preview and republish; custom domains; suspension/14-day grace/90-day retention/reactivation/deletion; rollback; settings/Stripe/UI foundations; existing-site outcomes.

Only four narrow infrastructure bindings are superseded: (1) CodeSandbox-specific BYOK/funding/credential binding, without deciding replacement policy; (2) CodeSandbox provider identity behind fixed starting-template behavior; (3) Freestyle preview hostname as product identity; (4) Freestyle publishing implementation. No other product behavior is superseded.

# Requirement traceability (49/49)

| # | Requirement heading | Design component/decision | Evidence or gate |
| ---: | --- | --- | --- |
| 1 | Inherited creation toolchain is preserved | Existing creation callers; extend Provider; preserved-capability ledger | CREATE/fixed-start/import/fork parity; no second generator/editor |
| 2 | Static classification requires an isolated build proof | Static compatibility matrix | Exact-revision isolated build/delivery proof; scan hints insufficient |
| 3 | Static builds produce immutable verifiable artifacts | Artifact manifest/provenance | Hash, manifest, source immutability, partial-upload reconcile |
| 4 | R2 layout and cache behavior isolate tenants and versions | Exact R2 keys/cache key | Cross-tenant/path and pointer-change tests |
| 5 | One wildcard routing Worker resolves stable mutable routes | Worker algorithm + route CAS | Route continuity, enumeration denial, rollback proof |
| 6 | Static delivery is deterministic and bounded | Manifest delivery policy | Content type/fallback/error/large-file/method/abuse tests |
| 7 | Build environments exclude runtime secrets | Phase-separated environment policies | Secret/source-map artifact scan and redacted failures |
| 8 | Artifact lifecycle preserves rollback and source independence | Artifact lifecycle states | Active/rollback deletion denial; partial cleanup reconcile |
| 9 | Inherited Onlook behavior is preserved additively | Spine + preserved/superseded ledger | Full parity and separate retirement gate |
| 10 | Dependency sequencing does not authorize implementation | Planning status + staged order + TDD | 250–400 RED/GREEN/TRIANGULATE/REFACTOR; authorization gate |
| 11 | Delivery preserves repository governance | Manifest/CCR section | Exact path/candidate hash only after patch; known `.gitignore` blocker |
| 12 | Provider-neutral identities separate product, source, and runtime authority | Identity model + active pointers | CAS/ambiguity tests; provider IDs adapter-only |
| 13 | Authoritative source preserves complete repositories | Durable-source decision | Full-tree and `.git` roots; reject IndexedDB/build/backup sole authority |
| 14 | Runtime providers negotiate bounded capabilities | Versioned capability profile | Unsupported/degraded/unknown fail closed; NodeFS cannot pass |
| 15 | Files and watches preserve source fidelity | Fidelity + watch state | Binary/symlink/mode/hash/rename/gap reconciliation |
| 16 | Commands, terminals, and tasks preserve editor outcomes | ExecutionPort and limits | `dev` resume/recreate, terminal auth, runaway termination |
| 17 | Ports and sessions provide stable authorized routing | Port/session lifecycle | Health before endpoint; cross-tenant route denial |
| 18 | Runtime lifecycle is recoverable and evidence-based | Durability/backup design | Revision-bound restore integrity and partial-failure gate |
| 19 | Git and export outcomes remain complete and customer-controlled | GitExportPort | History/notes/remotes/restore/export parity; no push claim |
| 20 | Untrusted execution is isolated and bounded | Threat model | FS/process/network/egress/secret/backup isolation and named cleanup actor |
| 21 | Every workspace supplies its own credential | Commercial-owned funding/credential boundary | Owner-only when policy requires; unresolved policy blocks dispatch |
| 22 | Invalid credential state fails closed | Dispatch revalidation | Missing/revoked/quota/unverifiable/binding failure tests |
| 23 | Credential persistence is server-only and auditable | Server trust boundary + versioned credential reference | Concurrent CAS; removed-member pre-release denial; no raw secret evidence |
| 24 | Migration follows the authorized stage order | Exact 16-stage table | Per-stage prerequisite gate; domains last; retirement separate |
| 25 | Parity evidence is exact and branch-scoped | Stage 5 immutable evidence | Exact revision and capability versions; every editor/runtime/Git/export check |
| 26 | Source copy and reconciliation never discard evidence | Stages 4–6 + reconciliation invariant | Full source/Git hash; unknown/partial retained |
| 27 | Cutover is atomic, singular, and reversible | Branch/project CAS | One active pointer; stale/ambiguous/missing rollback blocks |
| 28 | Rollback is exercised before rollout expansion | Rollback proof before internal cohort expansion and before stage 15 disconnect | Runtime/source/artifact/route rollback exercise and Git/export/domain proof; cohort expansion is not a migration stage |
| 29 | Inherited publishing and previews remain intact | Provider-neutral publish + stable route | Same identity republish; Freestyle continuity until proof |
| 30 | Publishing owns intent and activation records | Publication model | Durable intent/deployment/activation/result; provider creation insufficient |
| 31 | Legacy Freestyle identity and mutation baseline are captured | Stage 9 + observed publish fork | Persist recoverable deployment IDs; missing IDs block cutover |
| 32 | Publish lanes fail closed and preserve source | Lane selector | Static/dynamic proof; no automatic fallback; build fork non-authoritative |
| 33 | Publish lifecycle operations are deterministic | Republish/cancel/unpublish/rollback/cleanup states | Idempotency and unknown-outcome reconciliation |
| 34 | Preview and custom-domain migration preserve continuity | Stages 13–14 + domain model | Stable route CAS; DNS/cert/provider ambiguity retains old authority |
| 35 | Hosting lifecycle boundaries remain independent and safe | Hosting lifecycle owner | 14-day/90-day outcomes; retirement not cleanup |
| 36 | Authorization is server-derived and revalidated at sensitive boundaries | Trust boundaries/actors | Removed-member and named-system-actor tests at dispatch/terminal/activation/delete |
| 37 | Commercial authority gates funded operations | Commercial ownership | Admission before cost; unresolved funding blocks implementation/operation |
| 38 | Tenant data and execution are isolated end to end | Threat model and key/routing design | Cross-tenant ID/cache/R2/FS/process/route tests |
| 39 | Diagnostics and denials are sanitized and auditable | Safe codes/redaction/evidence | Credential-bearing provider error and enumeration tests |
| 40 | Capability ownership remains singular | Ownership table | Boundary review; analytics projection repair |
| 41 | Dependencies use focused public contracts | Dependency rules | No deep import/cross-DB/provider-ID lint and architecture review |
| 42 | The inherited editor remains the only editor model | Preserve EditorEngine/BranchManager/SandboxManager | Existing model opens replacement runtime; no parallel state |
| 43 | Interactive preview behavior requires parity evidence | Editor parity gate | iframe/preload/RPC/DOM/HMR/screenshot/browser/server/reconnect matrix |
| 44 | Reconnect reconciles sessions rather than inferring success | Reconnect flow/state machine | Active mapping resolution, task/port/watch/session reconcile, removed-member denial |
| 45 | Dynamic hosting requires exact compatibility evidence | OpenNext/WfP proof | Exact feature/binding/assets/cache/env/runtime matrix; ambiguity blocks |
| 46 | Dynamic deployments isolate tenants and versions | Dynamic immutable deployment/pointer | Cache/binding/secret isolation and atomic rollback |
| 47 | Dynamic limits and observability are reconcilable | Limits/telemetry/reconciler | Activation timeout and runtime-limit failure injection |
| 48 | Node-compatible fallback is exceptional and separately governed | Fallback selection decision | Both standard lanes fail + separate approval; no auto provisioning |
| 49 | Approved fallback has a complete lifecycle contract | Fallback lifecycle checklist | Sleep/wake/health/storage/domain/rollback/cleanup/corruption tests |

Traceability count: **49 requirement headings mapped / 49 total; 0 orphan requirements.** Scenario-level verification is represented by the evidence gates above and the 100-scenario input suite remains normative.

# Compatibility evidence still required

- CodeSandbox baseline recordings for every creation/import/fork/publish-fork path, source and complete `.git`, files/modes/symlinks, watch rename/gap, commands/background work, terminals, `dev`, ports, browser/server sessions, iframe/preload/Penpal/DOM/HMR/screenshot/reconnect, Git/export, hibernate/shutdown, account listing and cleanup.
- Cloudflare Sandbox executable spike evidence for all SDK, backup, mount, process, port, session, limit, idempotency and failure semantics listed in the durability section.
- Exact-revision static matrix across Server Actions, handlers/APIs, middleware/proxy, cookies/headers, dynamic rendering, ISR, env, image optimization, Node APIs, native dependencies and arbitrary edits.
- R2 and wildcard Worker evidence for consistency, object limits, range/large-file behavior, cache key/invalidation, route enumeration, bot controls, rollback and partial deletion.
- OpenNext/Workers or Workers for Platforms evidence for supported Next versions/features, bindings, assets, cache, tenant isolation, stable routing, rollback, limits and observability.
- Freestyle provider deployment-ID recovery, route continuity, cancellation/unpublish/cleanup, domain attachment/certificate and rollback evidence.
- Commercial approval for funding, credentials, admission, metering and quotas; security approval for egress/secrets/log retention; operations approval for incident response, retention, custom domains and any fallback.
- Owner-facing migration/failure UX and notice decisions.
- Exact future candidate patches, per-slice manifests, per-protected-file candidate SHA-256 CCRs, and all Strict-TDD/architecture verification evidence. Until these exist, implementation and lifecycle remain blocked.
