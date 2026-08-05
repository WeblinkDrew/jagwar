# Tasks: Replatform Editing and Preview Infrastructure

## Planning-only stop and authorization boundary

OpenSpec is authoritative. This is a future roadmap only: **all tasks are unchecked; tasks authorized for execution: 0**. Do not implement, apply, verify, sync, archive, create provider resources, disconnect CodeSandbox/Freestyle, retire either provider, run a development server, run `db:gen`, edit generated output, edit `bun.lock`, commit, or disturb existing dirty work. Cloudflare remains proposed behavior, not current Jagwar behavior. Explicit owner approval, prerequisite completion, and every applicable parent gate are required before any slice.

Stages 15–16 are intentionally parent/later-lifecycle gates. This change does not authorize disconnect or retirement.

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | 11,590, the exact sum of current provisional planning arithmetic across 33 independently reviewable slices |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Chain A identities/source/security → B provider parity → C migration/cutover → D publishing/Freestyle → E static → F dynamic → G approved fallback → H routes/domains |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

No single-PR mega-delivery is permitted. Every current slice planning forecast is 250–399 changed lines, includes tests and exactly one separately fixed 20-line architecture manifest, and has an independent finish, verification, and rollback boundary. The 11,590 total is the exact sum of current **provisional planning forecast arithmetic**, not an exact future candidate-sensitive delivery diff. A slice may start a new chain only where shown below; otherwise it stacks on its predecessor. A parent gate stops the chain. Before authorization, replace every provisional CCR/governance reserve with exact candidate arithmetic and reforecast; never split source authority, security, migration, or atomic-cutover invariants merely to meet line count.

### Chain arithmetic

| Chain | Slices / migration stages | Sequence | Exact total |
| --- | --- | --- | ---: |
| A | S01–S05 / stages 1–2 prerequisites | New chain; stack S01 → S02 → S03 → S04 → S05 | 1,700 |
| B | S06–S10 / stage 3 | New chain after B05 and provider gates; stack in order | 1,780 |
| C | S11–S18 / stages 4–7 | New chain after B10; stack in order | 2,720 |
| D | S19–S22 / stages 8–9 | New chain after B18; stack in order | 1,380 |
| E | S23–S26 / stage 10 | New chain after B22 and R2/Worker gates; stack in order | 1,420 |
| F | S27–S28 / stage 11 | New chain after B26 and OpenNext/WfP gates; stack in order | 750 |
| G | S29 / stage 12 only if separately approved | New blocked chain; one cohesive PR | 390 |
| H | S30–S33 / stages 13–14 | New chain after applicable lane review; stack in order | 1,450 |
| **Aggregate** | **33 slices** | `1,700 + 1,780 + 2,720 + 1,380 + 1,420 + 750 + 390 + 1,450` | **11,590** |

## Governance protocol for every future slice

Every slice depends on its matching `Mxx` parent gate. That gate must review **exactly one** `architecture/slices/replatform-editing-preview-xx-*.json` before code. The manifest must enumerate every exact path—never a wildcard—with baseline-accurate classification, capability, owning runtime, and role. Tentative paths below are concrete discovery targets, not preapproved declarations.

For every inherited protected file, prepare the exact candidate outside the protected working-tree path, compute the exact candidate resulting SHA-256 only after that candidate exists, create a **new per-file** CCR naming that exact path/hash, obtain its entry in `architecture/core-change-approvals.json`, and reference it from the reviewed manifest before editing the target. No prior, reused, wildcard, intent-only, or another-file CCR is valid. Protected rollback content needs a new candidate hash and approval. Every applicable slice below labels candidate-sensitive planning lines as a **provisional CCR/governance reserve** because exact protected paths and candidate content are not yet known. Before that slice’s manifest/CCR approval, replace the reserve with exact per-file CCR-document plus approval-entry line arithmetic from the exact candidate set, recompute the complete slice to remain 250–399 lines, and reslice at a cohesive boundary if it cannot. Truthful hashes and exact candidate-sensitive delivery arithmetic are impossible until exact candidate patches exist; the separately listed manifest remains fixed at 20 forecast lines.

Generated migrations are maintainer-owned. Agent-authored schema slices stop after declarative candidates/tests. `P14A`, `P14B`, or `P14C` must provide the applicable exact maintainer-generated path; the later migration-integration manifest must name it exactly before application. Migration-integration slices count maintainer-generated lines in total review size but authorize agents only to retain RED evidence, review/incorporate the handed-off file without editing it, and test it. Agents must not run `db:gen`, create/edit generated SQL or metadata, or forecast those lines as agent-written.

The known protected `.gitignore` `.atl/` error prevents an architecture-pass claim but does not block this planning artifact. Package-size findings are warnings only. Every implementation slice retains RED output, then GREEN, TRIANGULATE, and REFACTOR evidence; runs its focused Bun tests followed as applicable by `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, Storybook browser tests, `bun scripts/architecture/check.ts --changed`, `bun scripts/ci/local.ts --mode structure`, `bun scripts/ci/local.ts --mode pre-push`, and `git diff --check`; and never starts a dev server.

## Exact 16-stage delivery order

1. Parent gate `P01` revises/accepts product-contract infrastructure authority and the four narrow supersessions.
2. S01–S05 establish provider-neutral identities, persistence, complete-source authority, security, CAS, and idempotency while legacy pointers remain active.
3. S06–S10 prove CodeSandbox baseline and Cloudflare Sandbox parity behind existing `@onlook/code-provider`; Cloudflare remains shadow-only.
4. S11 copies full source and `.git` to a non-authoritative destination.
5. S12–S16 verify hashes, Git, build, files/watches/rename, tasks/terminal/commands/ports, editor iframe/preload/Penpal/DOM/HMR/screenshots/reconnect, and export.
6. S17 retains recoverable CodeSandbox mappings and evidence.
7. S18 performs only a separately authorized atomic reversible per-branch/project authority switch.
8. S19–S21 establish provider-neutral publishing intent/artifact/deployment/activation/result/rollback persistence.
9. S22 persists recoverable Freestyle deployment IDs and baseline mutation/route evidence.
10. S23–S26 implement isolated static proof, immutable R2 artifacts, one wildcard Worker, and static lifecycle as inactive candidates.
11. S27–S28 implement exact-revision OpenNext/Workers or WfP proof and dynamic candidates.
12. S29 exists only behind `P10`; fallback is never automatic and requires demonstrated static+dynamic incompatibility.
13. S30 migrates the stable preview route atomically and reversibly.
14. S31–S33 migrate custom domains last, including DNS/cert/provider attachment and lifecycle reconciliation.
15. `P17` alone may consider scoped disconnect after parity and exercised rollback; this roadmap does not authorize it.
16. `P18` requires a later owner-approved retirement SDD; retirement is outside this roadmap.

## Future implementation slices

### Chain A — Stage 2 identities, source authority, and security

#### S01 — Provider-neutral identity, CAS, idempotency, and unknown outcomes

**Depends:** P01, P02, P03, P15, M01. **Paths/discovery:** `packages/code-provider/src/types.ts`, `index.ts`, `providers.ts`, focused tests under `packages/code-provider/test/`. **Forecast:** production 105 + tests 155 + manifest 20 + provisional CCR/governance reserve 36 + evidence docs 4 = **320**. **Finish/rollback:** unconsumed additive contracts; active `sandboxId` behavior unchanged; remove only this slice under newly approved protected rollback hashes.

- [ ] **IMP-S01** (depends: P01,P02,P03,P15,M01) Deliver the provider-neutral workspace/project/branch/source-generation/source-revision/runtime/provider-mapping/endpoint/task/port/rollback identities, expected-version CAS, semantic idempotency, and `supported|unsupported|degraded|unknown` outcomes. RED proves ambiguity, stale CAS, semantic-key mismatch, provider-ID leakage, and NodeFS no-op rejection; GREEN adds the smallest public contracts; TRIANGULATE covers timeouts/concurrency/serialization; REFACTOR minimizes exports. Verify focused package tests and standard gates; retain legacy authority and zero provider effects. <!-- sdd-owner: implementation -->

#### S02 — Identity and migration declarative schema candidates

**Depends:** B01, P02, M02. **Paths/discovery:** `packages/db/src/schema/editable-runtime/{index.ts,source.ts,runtime.ts,migration.ts,evidence.ts}`, exact schema tests, protected `packages/db/src/schema/index.ts` only if proven necessary. **Forecast:** production 125 + tests 165 + manifest 20 + provisional CCR/governance reserve 44 + evidence docs 6 = **360**. **Finish/rollback:** additive declarative candidate only; no migration, active pointer, or provider switch.

- [ ] **IMP-S02** (depends: B01,P02,M02) Deliver schema candidates/tests for immutable source generations/revisions, provider mappings, one versioned source/runtime pointer, migration attempts, operation results, evidence, rollback holds, workspace-leading indexes, and ambiguous states. RED proves cardinality/CAS/idempotency/append-only constraints and cross-workspace separation; GREEN adds only declarative Drizzle state; TRIANGULATE covers competing pointers and unknown attempts; REFACTOR keeps provider IDs adapter-mapped. Stop for maintainer generation; do not run `db:gen`. <!-- sdd-owner: implementation -->

#### S03 — Maintainer-generated identity migration, RLS, and DB evidence

**Depends:** B02, P02, P14A, M03. **Paths/discovery:** exact maintainer-generated `apps/backend/supabase/migrations/<name>` supplied by P14A and exact DB tests under `apps/backend/supabase/`. **Forecast:** maintainer-generated migration 120 + tests 190 + manifest 20 + evidence docs 20 = **350**; **0 agent-written migration lines**. **Finish/rollback:** migration/test evidence only after exact handoff; rollback is an approved forward migration preserving source/mapping/evidence.

- [ ] **IMP-S03** (depends: B02,P02,P14A,M03) Retain RED DB evidence for anon/non-member/removed-member/cross-workspace denial, CAS races, one active pointer, immutable evidence, grants, indexes, and query plans; incorporate but never edit the exact maintainer-generated migration; TRIANGULATE stale claims, service-role application checks, unknown commits, and RLS bypass attempts; REFACTOR only authored tests/schema followed by a new maintainer generation cycle. Use installed-tool `--help` discovery plus focused DB commands and standard gates. <!-- sdd-owner: implementation -->

#### S04 — Provider-neutral authoritative complete-source service

**Depends:** B03, P06, P09, M04. **Paths/discovery:** `apps/web/client/src/server/services/source-authority/{index.ts,repository.ts,hash.ts,reconcile.ts}` and exact colocated tests. **Forecast:** production 130 + tests 180 + manifest 20 + evidence fixtures 10 = **340**. **Finish/rollback:** disabled service behind injected physical-store port; no source copy or authority advance.

- [ ] **IMP-S04** (depends: B03,P06,P09,M04) Implement complete-tree and complete-`.git` source snapshot/verify/advance/restore contracts with bytewise paths, binary/symlink/mode fidelity, normalization, traversal/collision/limit rejection, CAS, and reconcilable unknown results. RED uses malicious repository and full-Git fixtures; GREEN adds the smallest injected store; TRIANGULATE covers conflicting writers, partial objects, hash mismatch, and unavailable physical storage; REFACTOR preserves one cohesive source-authority invariant. <!-- sdd-owner: implementation -->

#### S05 — Server-derived authority, commercial admission, actors, redaction, and observability ports

**Depends:** B04, P02, P03, P09, P16, M05. **Paths/discovery:** `apps/web/client/src/server/services/editable-runtime/{authority.ts,security.ts,observability.ts,actors.ts}` and tests. **Forecast:** production 115 + tests 180 + manifest 20 + evidence fixtures 15 = **330**. **Finish/rollback:** fail-closed injected policy layer with no provider dispatch.

- [ ] **IMP-S05** (depends: B04,P02,P03,P09,P16,M05) Add server-derived actor/resource revalidation, named-system-actor scopes, commercial admission/credential-reference ports, sanitized reason codes, bounded audit/log fields, egress/secret/limit policy references, and removed-member revocation. RED proves zero provider effect and no credential/tenant disclosure; GREEN adds injected fail-closed decisions; TRIANGULATE system-actor abuse, stale membership, forged IDs, secret-bearing errors, and projection-only analytics; REFACTOR preserves focused public boundaries. <!-- sdd-owner: implementation -->

### Chain B — Stage 3 provider parity behind the existing Provider boundary

#### S06 — Capability negotiation and NodeFS fail-safe facade

**Depends:** B05, P04, M06. **Paths/discovery:** `packages/code-provider/src/types.ts`, `index.ts`, `providers.ts`, `providers/nodefs/index.ts`, package contract tests. **Forecast:** production 100 + tests 150 + manifest 20 + provisional CCR/governance reserve 45 + evidence docs 5 = **320**. **Finish/rollback:** existing CodeSandbox selection remains default; NodeFS becomes truthfully unsupported/degraded.

- [ ] **IMP-S06** (depends: B05,P04,M06) Extend the existing Provider/factory with versioned capability negotiation for fixed-start/create/import/fork/files/watch/execution/terminal/task/ports/sessions/lifecycle/durability/Git/export and make NodeFS no-ops fail safe. RED captures compatibility and false-success failures; GREEN adds the facade; TRIANGULATE unknown versions/timeouts/missing capabilities; REFACTOR keeps callers on `@onlook/code-provider` public exports. <!-- sdd-owner: implementation -->

#### S07 — CodeSandbox capability profile and operational baseline

**Depends:** B06, P03, P09, M07. **Paths/discovery:** `packages/code-provider/src/providers/codesandbox/index.ts`, `packages/constants/src/csb.ts`, focused adapter/baseline fixtures. **Forecast:** production 105 + tests 155 + manifest 20 + provisional CCR/governance reserve 45 + evidence docs 5 = **330**. **Finish/rollback:** compatibility profile wraps observed behavior without changing active sessions/templates/routes.

- [ ] **IMP-S07** (depends: B06,P03,P09,M07) Record and expose the CodeSandbox fixed-template/create/import/project+branch+publish fork, files, recursive watch, command/background command, terminal, `dev`, browser/server session, port, Git/export, hibernate/shutdown, listing, and cleanup baseline with safe capability reasons. RED locks inherited outcomes and provider URL assumptions as adapter-only; GREEN adds minimal profile translation; TRIANGULATE failures/quotas/reconnect TODO; REFACTOR preserves legacy compatibility and full operational baseline. <!-- sdd-owner: implementation -->

#### S08 — Cloudflare Sandbox lifecycle, files, fidelity, and watch adapter

**Depends:** B07, P03, P04, P06, M08. **Paths/discovery:** `packages/code-provider/src/providers/cloudflare-sandbox/{index.ts,lifecycle.ts,files.ts,watches.ts}` and contract/integration spike tests. **Forecast:** production 145 + tests 180 + manifest 20 + provisional CCR/governance reserve 25 + evidence docs 10 = **380**. **Finish/rollback:** shadow/test resources only; destroy only verified disposable resources, retain spike evidence, CodeSandbox active.

- [ ] **IMP-S08** (depends: B07,P03,P04,P06,M08) After approved SDK evidence, implement only proved create/import/fork/connect/sleep/restore/shutdown plus byte/symlink/mode/path fidelity, atomic rename or journaled degraded emulation, recursive watch cursor/gap, and safe provider translation. RED contract tests run against approved fakes/spikes; GREEN implements supported semantics only; TRIANGULATE timeout/partial/limit/collision/watch-gap cases; REFACTOR marks every unproved semantic unsupported/unknown. <!-- sdd-owner: implementation -->

#### S09 — Cloudflare commands, terminals, tasks, ports, and sessions

**Depends:** B08, P03, P04, P09, M09. **Paths/discovery:** `packages/code-provider/src/providers/cloudflare-sandbox/{commands.ts,terminals.ts,tasks.ts,ports.ts,sessions.ts}` and tests. **Forecast:** production 150 + tests 185 + manifest 20 + provisional CCR/governance reserve 25 + evidence docs 10 = **390**. **Finish/rollback:** shadow execution only; bounded cleanup preserves evidence and legacy editing.

- [ ] **IMP-S09** (depends: B08,P03,P04,P09,M09) Implement only provider-proved bounded foreground/background commands, authenticated terminals, logical `dev` task attempts, health-bound ports, browser/server sessions, idempotent dispatch, and unknown-result reconciliation. RED proves removed-member denial, fork-bomb/resource termination, stale generation rejection, output redaction, and no endpoint before health; GREEN adds minimal adapter pieces; TRIANGULATE reconnect/lost response/port reuse; REFACTOR keeps credentials server-only. <!-- sdd-owner: implementation -->

#### S10 — Backup, mount, durability, and complete session rehydration

**Depends:** B09, P05, P06, P09, M10. **Paths/discovery:** `apps/web/client/src/server/services/editable-runtime/{backup.ts,restore.ts,rehydrate.ts}` and tests. **Forecast:** production 135 + tests 185 + manifest 20 + evidence fixtures/docs 20 = **360**. **Finish/rollback:** backup/mount remains accelerator only; authoritative source and CodeSandbox rollback retained.

- [ ] **IMP-S10** (depends: B09,P05,P06,P09,M10) Implement the approved durability outcome: revision-bound backup/mount metadata, independent hash verification, TTL, restore into non-authoritative generation, and process/task/watch/port/browser/server/preload/RPC rehydration only after source agreement. RED proves partial/corrupt/expired/wrong-tenant/wrong-revision/unknown restore failure; GREEN adds the smallest selected strategy; TRIANGULATE eviction/concurrent writer/delete ambiguity; REFACTOR retains source-first fallback. <!-- sdd-owner: implementation -->

### Chain C — Stages 4–7 copy, parity, retained mapping, and cutover

#### S11 — Full source and `.git` migration copy

**Depends:** B10, P06, M11. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{copy.ts,reconcile.ts}` plus complete-repository fixtures/tests. **Forecast:** production 120 + tests 185 + manifest 20 + provisional CCR/governance reserve 15 + evidence fixtures 10 = **350**. **Finish/rollback:** destination remains non-authoritative; partial/unknown copies quarantined and retained.

- [ ] **IMP-S11** (depends: B10,P06,M11) Copy one exact legacy source revision and complete `.git` into a new source generation, persist durable attempt identities, verify full-tree/Git roots, and reconcile unknown completion before retry. RED proves IndexedDB/build/backup insufficiency, malicious paths, partial copy, Git mismatch, and no deletion; GREEN adds bounded copier; TRIANGULATE retries/concurrency/normalization; REFACTOR preserves source-copy atomicity. <!-- sdd-owner: implementation -->

#### S12 — File, watch, rename, and build parity evidence

**Depends:** B11, M12. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{file-parity.ts,watch-parity.ts,build-parity.ts}` and fixtures. **Forecast:** production 105 + tests 170 + manifest 20 + provisional CCR/governance reserve 25 + evidence fixtures 10 = **330**. **Finish/rollback:** append-only parity result only; any missing/different check fails.

- [ ] **IMP-S12** (depends: B11,M12) Compare exact source and `.git` roots, text/binary/symlink/modes, create/read/write/move/delete, native/emulated rename, recursive watch add/change/remove/rename/gap, and isolated inherited build outcomes. RED records baseline/replacement differences; GREEN emits immutable branch/revision evidence; TRIANGULATE interrupted delivery and older evidence; REFACTOR never overwrites prior attempts. <!-- sdd-owner: implementation -->

#### S13 — Command, task, terminal, port, and reconnect parity evidence

**Depends:** B12, P09, M13. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{execution-parity.ts,session-parity.ts}` and tests. **Forecast:** production 110 + tests 175 + manifest 20 + provisional CCR/governance reserve 25 + evidence fixtures 10 = **340**. **Finish/rollback:** evidence only; CodeSandbox sessions remain fallback.

- [ ] **IMP-S13** (depends: B12,P09,M13) Verify builds, foreground/background commands, authenticated terminal, logical `dev`, process/task status, port discovery/health, browser/server sessions, reconnect/recreate, limits, logs, and hibernate/shutdown against the same revision/profile versions. RED fails each omitted outcome; GREEN records exact evidence; TRIANGULATE removed-member reconnect, lost task, stale port, timeout, and unknown completion; REFACTOR keeps adapter observations distinct from normative contracts. <!-- sdd-owner: implementation -->

#### S14 — Editor iframe, preload, Penpal, DOM, HMR, screenshot, and reconnect parity

**Depends:** B13, P13, M14. **Paths/discovery:** protected `apps/web/client/src/components/store/editor/sandbox/session.ts`, `sandbox/preload-script.ts`, `apps/web/client/src/app/project/[id]/_components/canvas/frame/view.tsx`, reload/timeout hooks, Storybook/browser parity fixtures. **Forecast:** production 120 + tests 200 + manifest 20 + provisional CCR/governance reserve 40 + evidence fixtures 10 = **390**. **Finish/rollback:** inherited `EditorEngine`, `BranchManager`, and `SandboxManager` remain the sole model; facade can revert to CodeSandbox.

- [ ] **IMP-S14** (depends: B13,P13,M14) Wire only the narrow provider-neutral session/opaque endpoint facade needed to prove iframe origin/access, preload copy/mutation, Penpal methods, DOM inspect/edit, HMR/reload, screenshots, timeout, browser/server session, and reconnect parity. RED Storybook/browser evidence fails on any missing behavior; GREEN makes minimal protected edits after exact CCRs; TRIANGULATE stale mapping/removed member/partial RPC; REFACTOR forbids a second editor/source/Git/project model. <!-- sdd-owner: implementation -->

#### S15 — Git, history, notes, restore, full/directory export parity

**Depends:** B14, M15. **Paths/discovery:** protected `apps/web/client/src/components/store/editor/git/git.ts`, `sandbox/index.ts`, new parity service/tests. **Forecast:** production 100 + tests 165 + manifest 20 + provisional CCR/governance reserve 25 + evidence fixtures 10 = **320**. **Finish/rollback:** inherited Git/export path remains active; no push capability is invented.

- [ ] **IMP-S15** (depends: B14,M15) Verify status, commit graph/objects required by inherited flow, commits, notes, remotes, restore, full download, directory export, create/import/branch/project/publish-fork transfer outcomes against the authoritative revision. RED fails on Git differences despite matching files and on unsupported push claims; GREEN adds the narrow port/evidence; TRIANGULATE malicious repos and partial exports; REFACTOR preserves customer-controlled inherited outcomes. <!-- sdd-owner: implementation -->

#### S16 — Branch-scoped parity decision and preserved-capability ledger

**Depends:** B15, P13, M16. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{parity.ts,evidence.ts}` and tests/fixtures. **Forecast:** production 90 + tests 170 + manifest 20 + evidence docs 20 = **300**. **Finish/rollback:** immutable pass/fail decision only; unknown/missing evidence never promotes.

- [ ] **IMP-S16** (depends: B15,P13,M16) Aggregate exact revision/profile evidence for creation/CREATE/fixed template, source/Git, build/files/watch, execution/terminal/task/port, editor/RPC/HMR/screenshot/reconnect, export, security, and rollback mapping without collapsing partial results. RED proves older/missing/different evidence blocks; GREEN records immutable decision; TRIANGULATE corrections and concurrent revisions; REFACTOR keeps CodeSandbox baseline/comparison/migration source intact. <!-- sdd-owner: implementation -->

#### S17 — Retain CodeSandbox mappings, holds, and rollback evidence

**Depends:** B16, P16, M17. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{legacy-mapping.ts,retention.ts}` and exact persistence/service tests. **Forecast:** production 100 + tests 150 + manifest 20 + provisional CCR/governance reserve 20 + evidence docs 10 = **300**. **Finish/rollback:** mappings become protected rollback evidence; no disconnect, cleanup, or provider mutation.

- [ ] **IMP-S17** (depends: B16,P16,M17) Persist/reconcile recoverable CodeSandbox resource/session/source mappings for every migrating branch, retention holds, provenance, and rollback readiness; treat missing/unknown as blockers. RED proves cleanup/deletion cannot remove active, rollback, source, `.git`, mapping, or evidence; GREEN adds retention/reconciliation; TRIANGULATE stale/account-listing/partial outcomes; REFACTOR keeps unknowns retryable. <!-- sdd-owner: implementation -->

#### S18 — Atomic per-branch/project source and runtime authority cutover

**Depends:** B17, P02, P03, P16, P19, M18. **Paths/discovery:** `apps/web/client/src/server/services/provider-migration/{cutover.ts,rollback.ts}` and concurrency/integration tests; protected project/branch mapper/router seams only if exact candidate proves necessary. **Forecast:** production 145 + tests 195 + manifest 20 + provisional CCR/governance reserve 20 + evidence docs 10 = **390**. **Finish/rollback:** one scoped CAS commit; exercised CAS back to CodeSandbox; ambiguity blocks writes/publishes.

- [ ] **IMP-S18** (depends: B17,P02,P03,P16,P19,M18) Implement the cohesive source/runtime cutover invariant: revalidate actor/membership/commercial admission/current revision/parity/rollback mapping, pause writes for bounded reconcile, atomically switch one branch or all-or-none explicit project branch set, and preserve conflict revisions. RED covers stale/ambiguous/split-brain/in-flight writes and missing rollback; GREEN adds one transaction; TRIANGULATE lost responses and rollback races; REFACTOR never deletes either mapping/evidence. <!-- sdd-owner: implementation -->

### Chain D — Stages 8–9 publishing contracts and Freestyle baseline

#### S19 — Provider-neutral publishing intent and activation contracts

**Depends:** B18, P03, P09, M19. **Paths/discovery:** `apps/web/client/src/server/services/publishing/{index.ts,contracts.ts,lane.ts,reconcile.ts}` and tests. **Forecast:** production 120 + tests 170 + manifest 20 + provisional CCR/governance reserve 20 + evidence docs 10 = **340**. **Finish/rollback:** inactive contracts coexist with inherited publisher; provider creation cannot mark success.

- [ ] **IMP-S19** (depends: B18,P03,P09,M19) Define exact-revision build intent, phase-separated environment policy, immutable artifact/deployment target, activation intent, route expected-version, rollback target, cancellation/unpublish/reconcile, and truthful `succeeded|failed|cancelled|incomplete|unknown` result. RED proves provider response/source mutation/unknown activation cannot imply success; GREEN adds minimal service contracts; TRIANGULATE retries/timeouts; REFACTOR keeps lifecycle/domains separate. <!-- sdd-owner: implementation -->

#### S20 — Publishing declarative schema candidates

**Depends:** B19, M20. **Paths/discovery:** `packages/db/src/schema/publishing/{index.ts,intent.ts,artifact.ts,deployment.ts,activation.ts,route.ts}`, schema tests, protected exports only if required. **Forecast:** production 140 + tests 180 + manifest 20 + provisional CCR/governance reserve 10 + evidence docs 10 = **360**. **Finish/rollback:** declarative candidate only; no generated migration or active-route mutation.

- [ ] **IMP-S20** (depends: B19,M20) Add/test immutable build/artifact/deployment records, provider mappings, activation/result/operation identities, one CAS route pointer, rollback holds, environment-policy references, and unknown/reconciliation state. RED proves uniqueness, source binding, append-only evidence, and tenant isolation; GREEN adds declarative state; TRIANGULATE competing activation/cancel/unpublish; REFACTOR then stop for maintainer generation. <!-- sdd-owner: implementation -->

#### S21 — Maintainer-generated publishing migration, RLS, and DB evidence

**Depends:** B20, P02, P14B, M21. **Paths/discovery:** exact P14B-supplied migration and exact `apps/backend/supabase/` DB tests. **Forecast:** maintainer-generated migration 110 + tests 200 + manifest 20 + evidence docs 20 = **350**; **0 agent-written migration lines**. **Finish/rollback:** forward/additive rollback preserves publication history and active pointers.

- [ ] **IMP-S21** (depends: B20,P02,P14B,M21) Retain RED DB evidence for workspace isolation, one route pointer, activation CAS, immutable source/artifact relations, operation idempotency, active/rollback deletion denial, RLS/grants/indexes/query plans, and unknown commits; incorporate without editing the exact generated handoff; TRIANGULATE direct/list/aggregate/mixed-batch and service-role cases; REFACTOR authored sources only via maintainer regeneration. <!-- sdd-owner: implementation -->

#### S22 — Persist Freestyle deployment IDs and observed mutation baseline

**Depends:** B21, P11, M22. **Paths/discovery:** protected `apps/web/client/src/server/api/routers/domain/adapters/freestyle.ts`, `publish/helpers/deploy.ts`, `publish/helpers/fork.ts`, `publish/manager.ts`, adjacent capture service/tests. **Forecast:** production 110 + tests 165 + manifest 20 + provisional CCR/governance reserve 25 + evidence docs 10 = **330**. **Finish/rollback:** existing previews keep resolving; unknown legacy identity blocks route cutover without unpublish/disconnect.

- [ ] **IMP-S22** (depends: B21,P11,M22) Recover/persist verified Freestyle deployment IDs with workspace/project/branch/source/public-route/lifecycle relations and record disposable publish-fork/Next-standalone mutation as comparison baseline only. RED covers unrecoverable/ambiguous IDs, cancellation/unpublish discrepancies, and discarded provider IDs; GREEN adds narrow capture; TRIANGULATE old rows and response loss; REFACTOR preserves Freestyle operations and rollback. <!-- sdd-owner: implementation -->

### Chain E — Stage 10 static R2 lane

#### S23 — Isolated exact-revision static classifier

**Depends:** B22, P03, P07, P09, M23. **Paths/discovery:** `apps/web/client/src/server/services/static-preview/{classifier.ts,proof.ts}` and bounded feature fixtures/tests. **Forecast:** production 110 + tests 180 + manifest 20 + evidence fixtures 20 = **330**. **Finish/rollback:** evidence-only classifier; failed/unknown proof leaves Freestyle active and provisions nothing.

- [ ] **IMP-S23** (depends: B22,P03,P07,P09,M23) Build isolated proof for Server Actions, handlers/APIs, middleware/proxy, cookies/headers, dynamic rendering, ISR, runtime env, image optimization, Node APIs, native dependencies, arbitrary edits, limits, and delivery behavior. RED proves scans are hints only and prior-revision evidence invalidates; GREEN records exact toolchain/revision outcomes; TRIANGULATE network/secret/time/resource failures; REFACTOR fails closed. <!-- sdd-owner: implementation -->

#### S24 — Immutable artifact provenance and R2 layout

**Depends:** B23, P07, P09, M24. **Paths/discovery:** `apps/web/client/src/server/services/static-preview/{artifact.ts,r2.ts,manifest.ts}` and tests/fixtures; Worker placement remains gated by M24. **Forecast:** production 150 + tests 190 + manifest 20 + evidence docs 20 = **380**. **Finish/rollback:** verified inactive artifact candidate only; source/`.git` unchanged, partial uploads retryable/cleanable.

- [ ] **IMP-S24** (depends: B23,P07,P09,M24) Produce immutable manifests/provenance/content hashes/signature evidence and exact tenant/project/branch/artifact R2 keys with no mutable latest object, source, `.git`, secrets, or excluded source maps. RED proves traversal/collision/partial upload/secret scan/cross-tenant denial; GREEN writes and independently verifies candidates; TRIANGULATE consistency/limits/corruption; REFACTOR preserves source independence. <!-- sdd-owner: implementation -->

#### S25 — One wildcard Worker, route CAS, cache, and delivery security

**Depends:** B24, P07, P09, M25. **Paths/discovery:** exact Worker runtime path approved by M25 plus `apps/web/client/src/server/services/static-preview/routing.ts` and tests. **Forecast:** production 155 + tests 195 + manifest 20 + evidence fixtures/docs 20 = **390**. **Finish/rollback:** inactive route candidate; Freestyle remains authoritative until stage 13.

- [ ] **IMP-S25** (depends: B24,P07,P09,M25) Implement one governed wildcard router with method/header/body/rate/bot limits, single normalization, opaque host mapping, versioned route→artifact CAS, exact-file/index/declared-SPA fallback, safe types/headers/ETag, versioned cache key, bounded invalidation, corruption/large-file policy, and uniform enumeration denial. RED covers cross-tenant/cache/path/range abuse; GREEN adds minimal Worker/router; TRIANGULATE pointer timeout and purge failure; REFACTOR retains rollback target. <!-- sdd-owner: implementation -->

#### S26 — Static activation, rollback, archive/reactivate/delete reconciliation

**Depends:** B25, P07, P09, P16, M26. **Paths/discovery:** `apps/web/client/src/server/services/static-preview/{activation.ts,lifecycle.ts,reconcile.ts,observability.ts}` and tests. **Forecast:** production 110 + tests 170 + manifest 20 + evidence docs 20 = **320**. **Finish/rollback:** lane can produce/verify candidate and exercise isolated rollback; public route still Freestyle.

- [ ] **IMP-S26** (depends: B25,P07,P09,P16,M26) Implement idempotent candidate/active/rollback-held/archived/reactivating/deleting/deletion-partial/deleted transitions, CAS activation/rollback, integrity recheck, cleanup holds, unknown reconciliation, and redacted metrics. RED proves active/rollback/source/evidence deletion denial and partial cleanup; GREEN adds lifecycle; TRIANGULATE lost activation and archive restore; REFACTOR keeps hosting lifecycle separate. <!-- sdd-owner: implementation -->

### Chain F — Stage 11 dynamic OpenNext lane

#### S27 — OpenNext/Workers exact compatibility proof

**Depends:** B26, P03, P08, P09, M27. **Paths/discovery:** `apps/web/client/src/server/services/dynamic-hosting/{classifier.ts,proof.ts,feature-matrix.ts}` and exact fixtures/tests. **Forecast:** production 135 + tests 185 + manifest 20 + evidence docs 20 = **360**. **Finish/rollback:** evidence-only; unsupported/ambiguous features keep prior publication active.

- [ ] **IMP-S27** (depends: B26,P03,P08,P09,M27) Prove exact OpenNext/Workers or WfP versions across SSR/RSC, routes, Server Actions, handlers, middleware, cookies/headers, dynamic/ISR/cache, images/assets, Node/native dependencies, streaming, errors, bindings, build/runtime env separation, and limits. RED fails every unknown feature; GREEN records isolated build+runtime proof; TRIANGULATE upgrades/provider failures; REFACTOR prevents unsupported activation. <!-- sdd-owner: implementation -->

#### S28 — Immutable dynamic deployment, isolation, routing, limits, and reconciliation

**Depends:** B27, P08, P09, P16, M28. **Paths/discovery:** `apps/web/client/src/server/services/dynamic-hosting/{deployment.ts,routing.ts,limits.ts,reconcile.ts,observability.ts}` and tests. **Forecast:** production 155 + tests 195 + manifest 20 + evidence docs 20 = **390**. **Finish/rollback:** inactive dynamic candidate and exercised isolated rollback; Freestyle remains public authority.

- [ ] **IMP-S28** (depends: B27,P08,P09,P16,M28) Create immutable deployment candidates with tenant-isolated code/assets/bindings/cache/secrets/logs/routes, CAS activation/rollback target, CPU/memory/duration/request/concurrency/storage/subrequest/egress/provider limits, and timeout/cleanup reconciliation. RED proves cache/binding cross-tenant denial, secret redaction, lost activation, and limit containment; GREEN adds selected approved model; TRIANGULATE partial deploy/route state; REFACTOR leaves provider specifics in adapters. <!-- sdd-owner: implementation -->

### Chain G — Stage 12 exceptional fallback, blocked by separate approval

#### S29 — Separately approved Node-compatible fallback complete lifecycle

**Depends:** B28, P10, P03, P09, P16, M29. **Paths/discovery:** exact fallback runtime placement/provider approved by P10/M29 plus `apps/web/client/src/server/services/fallback-hosting/**` and tests. **Forecast:** production 145 + tests 195 + manifest 20 + evidence docs 30 = **390**. **Finish/rollback:** no automatic selection; inactive candidate only; no continuously running container per stored site.

- [ ] **IMP-S29** (depends: B28,P10,P03,P09,P16,M29) Only after immutable proof that the exact revision fails static and dynamic for named features, implement the separately approved provider/operator, pooled/on-demand capacity, isolation/limits, bounded sleep/wake/health, stable routing, build/runtime secrets, egress, source-independent durable storage/backup, retention, activation/rollback, custom-domain compatibility, observability, cleanup, and reconciliation. RED proves no approval/no proof/no provisioning, corrupt restore, wake timeout, arbitrary-route prevention, and inactive-site shutdown; GREEN implements the approved lifecycle cohesively; TRIANGULATE incidents/quotas; REFACTOR preserves fail-closed lane selection. <!-- sdd-owner: implementation -->

### Chain H — Stages 13–14 preview continuity and custom domains last

#### S30 — Atomic stable preview-route migration and continuity

**Depends:** B22, P11, P13, P16, P19, M30. **Paths/discovery:** `apps/web/client/src/server/services/hosting-lifecycle/preview-route.ts`, protected `packages/db/src/schema/domain/preview.ts`, exact publish/domain route seams and tests. **Forecast:** production 120 + tests 170 + manifest 20 + provisional CCR/governance reserve 20 + evidence docs 10 = **340**. **Finish/rollback:** one stable preview identity changes by CAS to one verified candidate; rollback restores Freestyle/previous route; ambiguous state preserves last provable route.

- [ ] **IMP-S30** (depends: B22,P11,P13,P16,P19,M30) Migrate only after stage-5 parity and the exactly-one applicable lane evidence selected by P19, persisted Freestyle identity, continuity probe, and rollback proof; revalidate authority/commercial state, atomically switch the stable route pointer, verify externally, and reconcile timeout before retry. RED covers stale pointer, missing lane/Freestyle mapping, split route, republish/cancel/unpublish races, and rollback failure; GREEN adds one CAS path; TRIANGULATE incidents; REFACTOR keeps provider hostname non-product identity. <!-- sdd-owner: implementation -->

#### S31 — Custom-domain declarative state candidates

**Depends:** B30, P12, M31. **Paths/discovery:** `packages/db/src/schema/hosting-lifecycle/{domain.ts,dns.ts,certificate.ts,attachment.ts}`, tests, protected domain schema/export seams only if required. **Forecast:** production 135 + tests 180 + manifest 20 + provisional CCR/governance reserve 25 + evidence docs 10 = **370**. **Finish/rollback:** declarative candidate only; no DNS, certificate, provider attachment, or generated migration.

- [ ] **IMP-S31** (depends: B30,P12,M31) Model canonical tenant-scoped domain, ownership evidence/version/expiry, DNS expected/observed state, certificate order/status/expiry, provider attachment mapping, route pointer, suspension, idempotency, rollback attachment, and reconciliation evidence. RED proves uniqueness, cross-workspace denial, ambiguous state, and old-authority retention; GREEN adds schema candidates; TRIANGULATE renew/detach races; REFACTOR then stop for maintainer generation. <!-- sdd-owner: implementation -->

#### S32 — Maintainer-generated domain migration, RLS, and DB evidence

**Depends:** B31, P02, P12, P14C, M32. **Paths/discovery:** exact P14C-supplied domain migration and exact `apps/backend/supabase/` DB tests. **Forecast:** maintainer-generated migration 100 + tests 210 + manifest 20 + evidence docs 20 = **350**; **0 agent-written migration lines**. **Finish/rollback:** forward migration preserves old domain/cert/route evidence and stable preview identity.

- [ ] **IMP-S32** (depends: B31,P02,P12,P14C,M32) Retain RED DB evidence for tenant isolation, domain uniqueness, ownership/DNS/cert/attachment state transitions, CAS route authority, rollback attachment, RLS/grants/indexes/query plans, and immutable reconciliation; incorporate without editing the exact generated handoff; TRIANGULATE stale claims, mixed-workspace IDs, concurrent attach/detach, and service-role checks; REFACTOR only through maintainer regeneration. <!-- sdd-owner: implementation -->

#### S33 — Custom domains last: DNS, certificates, attachment, lifecycle, cleanup, and observability

**Depends:** B32, P12, P13, P09, P16, P19, M33. **Paths/discovery:** `apps/web/client/src/server/services/hosting-lifecycle/{domains.ts,certificates.ts,lifecycle.ts,reconcile.ts,cleanup.ts,observability.ts}`, exact protected `apps/web/client/src/server/api/routers/domain/**` candidates, tests. **Forecast:** production 145 + tests 190 + manifest 20 + provisional CCR/governance reserve 25 + evidence docs 10 = **390**. **Finish/rollback:** verify ownership → DNS → cert → attach candidate → external probe → atomic authority switch; old route/cert remains until proof; no disconnect/retirement.

- [ ] **IMP-S33** (depends: B32,P12,P13,P09,P16,P19,M33) Deliver reversible custom-domain migration only after every preceding source/runtime/editor/publish/preview/rollback gate: server-side verification, tenant-scoped DNS/cert/provider attachment, atomic switch, suspension/14-day grace/90-day retention/archive/reactivation/deletion separation, idempotent detach/cert cleanup, unknown reconciliation, notices, named actors, and redacted observability. RED covers takeover, cert ambiguity, removed member, partial detach/delete, and protected mapping retention; GREEN adds minimal lifecycle; TRIANGULATE renewal/rollback/incidents; REFACTOR keeps retirement outside cleanup. <!-- sdd-owner: implementation -->

## Requirement heading → design section → task traceability

All 49 requirement headings map to at least one implementation slice or explicit parent gate; all 100 scenarios remain normative test titles/evidence inputs. Requirement/task traceability count: **49/49; 0 orphan requirements; 0 orphan design components**.

| # | Requirement heading | Design section/component | Delivering task(s)/gate(s) |
| ---: | --- | --- | --- |
| 1 | Inherited creation toolchain is preserved | Observed creation callers; Provider spine; preserved ledger | S07, S16; P01 |
| 2 | Static classification requires an isolated build proof | Static compatibility classifier/matrix | S23 |
| 3 | Static builds produce immutable verifiable artifacts | Immutable artifact/provenance | S24 |
| 4 | R2 layout and cache behavior isolate tenants and versions | R2 keys and cache identity | S24–S25; P07 |
| 5 | One wildcard routing Worker resolves stable mutable routes | Wildcard Worker algorithm/route CAS | S25, S30 |
| 6 | Static delivery is deterministic and bounded | Delivery/content/limit/abuse policy | S25; P07 |
| 7 | Build environments exclude runtime secrets | Phase-separated environment policy | S19, S23–S24; P09 |
| 8 | Artifact lifecycle preserves rollback and source independence | Static lifecycle/reconciliation | S26 |
| 9 | Inherited Onlook behavior is preserved additively | Architecture spine and preservation ledger | S07, S16, S22, S33; P01 |
| 10 | Dependency sequencing does not authorize implementation | 16-stage plan and chained TDD | all S01–S33; P01 |
| 11 | Delivery preserves repository governance | Manifest/CCR/generated-file protocol | M01–M33, P14A–P14C, P15 |
| 12 | Provider-neutral identities separate product, source, and runtime authority | Identity/pointer model | S01–S03 |
| 13 | Authoritative source preserves complete repositories | Durable complete-source decision | S04, S11 |
| 14 | Runtime providers negotiate bounded capabilities | Provider capability catalog/facade | S06–S08 |
| 15 | Files and watches preserve source fidelity | FilePort/WatchPort and reconciliation | S08, S12 |
| 16 | Commands, terminals, and tasks preserve editor outcomes | ExecutionPort and limits | S09, S13 |
| 17 | Ports and sessions provide stable authorized routing | Port/session state machines | S09, S13–S14 |
| 18 | Runtime lifecycle is recoverable and evidence-based | Backup/restore/rehydration | S10; P05 |
| 19 | Git and export outcomes remain complete and customer-controlled | GitExportPort | S11, S15 |
| 20 | Untrusted execution is isolated and bounded | Security/threat model | S05, S08–S10; P09 |
| 21 | Every workspace supplies its own credential | Commercial-owned compute/credential policy | S05; P03 |
| 22 | Invalid credential state fails closed | Pre-dispatch credential revalidation | S05, S09; P03 |
| 23 | Credential persistence is server-only and auditable | Server trust boundary/versioned reference | S05; P03 |
| 24 | Migration follows the authorized stage order | Exact 16-stage migration table | S01–S33; P01,P17,P18 |
| 25 | Parity evidence is exact and branch-scoped | Stage-5 evidence model | S12–S16 |
| 26 | Source copy and reconciliation never discard evidence | Stages 4–6/reconciliation invariant | S11, S17 |
| 27 | Cutover is atomic, singular, and reversible | Branch/project CAS | S18 |
| 28 | Rollback is exercised before rollout expansion | Rollback/cohort gate | S18, S26, S28, S30; P16–P17 |
| 29 | Inherited publishing and previews remain intact | Publishing model/stable route | S19, S22, S30 |
| 30 | Publishing owns intent and activation records | Publication model | S19–S21 |
| 31 | Legacy Freestyle identity and mutation baseline are captured | Stage 9 baseline capture | S22; P11 |
| 32 | Publish lanes fail closed and preserve source | Lane selector/source independence | S19, S23, S27, S29 |
| 33 | Publish lifecycle operations are deterministic | Publish/static reconciliation states | S19, S26 |
| 34 | Preview and custom-domain migration preserve continuity | Stages 13–14/domain model | S30–S33; P12 |
| 35 | Hosting lifecycle boundaries remain independent and safe | Hosting lifecycle owner | S31–S33; P17–P18 |
| 36 | Authorization is server-derived and revalidated at sensitive boundaries | Trust boundaries/actors | S05 and all dispatch/cutover/activation slices |
| 37 | Commercial authority gates funded operations | Commercial admission | S05, S08–S10, S19, S23–S29; P03 |
| 38 | Tenant data and execution are isolated end to end | Threat model/R2/dynamic/domain isolation | S05, S08–S10, S24–S29, S31–S33 |
| 39 | Diagnostics and denials are sanitized and auditable | Redaction/evidence/observability | S05 and every provider/lifecycle slice; P09 |
| 40 | Capability ownership remains singular | Ownership/dependency table | S01, S04–S05, S19, S23–S33 |
| 41 | Dependencies use focused public contracts | Public entries/composition roots | S01, S04–S06, S19; all M gates |
| 42 | The inherited editor remains the only editor model | EditorEngine/BranchManager/SandboxManager preservation | S14, S16 |
| 43 | Interactive preview behavior requires parity evidence | Editor parity matrix | S14, S16 |
| 44 | Reconnect reconciles sessions rather than inferring success | Reconnect/rehydration flow | S09–S10, S13–S14 |
| 45 | Dynamic hosting requires exact compatibility evidence | OpenNext/WfP proof | S27; P08 |
| 46 | Dynamic deployments isolate tenants and versions | Immutable dynamic deployment/pointer | S28; P08 |
| 47 | Dynamic limits and observability are reconcilable | Dynamic limits/telemetry/reconciler | S28; P09 |
| 48 | Node-compatible fallback is exceptional and separately governed | Fallback selection decision | S29; P10 |
| 49 | Approved fallback has a complete lifecycle contract | Fallback lifecycle checklist | S29; P10 |

### Design-component coverage

| Design inventory component | Tasks/gates |
| --- | --- |
| 1 Observed repository behavior | S07, S14–S15, S22 |
| 2 Existing gaps/unsafe assumptions | S01–S06, S19–S22 |
| 3 Proposed architecture | S01, S04–S06, S19, S23–S33 |
| 4 Identity/authority/lifecycle model | S01–S05, S17–S21, S31–S33 |
| 5 Editable-runtime contracts/state machines | S06–S10 |
| 6 Cloudflare durability decision | S04, S10; P05–P06 |
| 7 Staged dual-provider migration | S11–S18; P01,P17,P18 |
| 8 Static publication lane | S23–S26 |
| 9 Dynamic publication lane | S27–S28 |
| 10 Exceptional fallback | S29; P10 |
| 11 Publishing/routing/domains/lifecycle | S19–S22, S30–S33 |
| 12 Security/threat model | S05 and all provider/route slices; P09,P16 |
| 13 Data flow/failures/reconciliation/observability | S04–S05, S09–S10, S19, S26, S28–S33 |
| 14 File-change/governance plan | M01–M33; P14A–P14C; P15 |
| 15 Verification/rollout gates | all S/B gates; P16–P17 |
| 16 Decisions/alternatives/unresolved items | P03–P13 |
| 17 Preserved capabilities/narrow supersessions | P01, S07, S16, S22, S33 |
| 18 Requirement traceability | table above, 49/49 |
| 19 Compatibility evidence still required | S07–S16, S22–S29; P04–P13 |

## Parent/owner gates — policy, manifests, CCRs, generated handoff, and bounded reviews

These are parent-owned and grouped after implementation work. Their presence does not authorize implementation.

### Parent policy/lifecycle decisions and maintainer handoffs (21: 18 decisions + 3 handoffs)

- [ ] **P01** (depends: none) Explicitly approve the 16-stage order, four narrow product-contract infrastructure supersessions, preserved-capability ledger, eight-chain/11,590-line provisional planning forecast, and release process; planning alone grants no implementation authority. <!-- sdd-owner: parent -->
- [ ] **P02** (depends: P01) Complete/approve workspace-authority runtime, persistence/RLS, server-derived Owner/Member decisions, removed-member revalidation, named system actors, and audit evidence; all dependent composition otherwise fails closed. <!-- sdd-owner: parent -->
- [ ] **P03** (depends: P01) Approve/version commercial funding, entitlement, metering, quota, provider credential ownership/BYOK, storage/validation/release, and operational credential policy; infer neither Jagwar funding nor replacement BYOK. <!-- sdd-owner: parent -->
- [ ] **P04** (depends: P03) Approve executable Cloudflare Sandbox SDK/version/regions/API idempotency/failure evidence and file/symlink/mode/watch/command/terminal/task/port/session/sleep/eviction/resource-limit semantics before marking any capability supported. <!-- sdd-owner: parent -->
- [ ] **P05** (depends: P04) Approve Cloudflare backup and durable-mount spikes covering create/list/restore/delete, TTL, integrity, version binding, consistency, isolation, concurrent writers, quotas, and failure outcomes; select source-first fallback if unproved. <!-- sdd-owner: parent -->
- [ ] **P06** (depends: P02,P03) Select and approve the physical authoritative complete-repository provider, encryption/keying, backup, retention, regional/incident operations, ownership, SLOs, reconciliation, and recovery; a sandbox/mount/backup cannot silently become authority. <!-- sdd-owner: parent -->
- [ ] **P07** (depends: P03) Approve R2 limits/consistency/encryption/retention/range policy, Worker CPU/request/subrequest limits, cache bounds/purge, wildcard/custom-host APIs, certificate interfaces, route mapping, bot/rate controls, and abuse operations. <!-- sdd-owner: parent -->
- [ ] **P08** (depends: P03) Approve exact OpenNext and Next.js versions/features, Workers versus Workers for Platforms placement, tenant/binding/cache isolation, dispatch model, limits, provider commercial model, secrets, routing, rollback, and support ownership. <!-- sdd-owner: parent -->
- [ ] **P09** (depends: P01) Approve egress/network policy, secret release, redaction, log/audit retention/legal hold/access, source/provider payload handling, observability fields/SLOs/alerts, incident response, and named-system-actor scopes. <!-- sdd-owner: parent -->
- [ ] **P10** (depends: P07,P08,P09) Only after exact static+dynamic incompatibility evidence, separately approve fallback provider/operator, architecture, commercial model, capacity pools, isolation, sleep/wake, storage, domains/certs, retention, cleanup, incident response, and lifecycle; otherwise S29 remains permanently blocked. <!-- sdd-owner: parent -->
- [ ] **P11** (depends: P09) Approve Freestyle deployment-ID discovery feasibility, API/operational owner, historical mapping rules, mutation/cancel/unpublish baseline, continuity probes, and treatment of irrecoverable IDs; no guessed ID may authorize cutover. <!-- sdd-owner: parent -->
- [ ] **P12** (depends: P07,P11) Approve domain migration semantics: ownership/DNS recurrence, custom-host/provider attachment, certificate order/renewal/expiry, atomic switch, rollback window, detach/cleanup, suspension/reactivation, unknown reconciliation, and support ownership. <!-- sdd-owner: parent -->
- [ ] **P13** (depends: P01) Decide Owner migration-status/failure UX, tailored credential guidance, notices/customer communications, provider-branding policy, maintenance/write-pause messaging, domain notices, support escalation, and accessibility/localization scope. <!-- sdd-owner: parent -->
- [ ] **P14A** (depends: B02) For the reviewed S02 identity schema candidate, a maintainer verifies current Supabase/CLI docs and installed `--help`, runs the approved generation workflow, records the exact generated migration path, and hands it off unchanged; agents do not run `db:gen` or edit generated output. <!-- sdd-owner: parent -->
- [ ] **P14B** (depends: B20) For the reviewed S20 publishing schema candidate, a maintainer verifies current Supabase/CLI docs and installed `--help`, runs the approved generation workflow, records the exact generated migration path, and hands it off unchanged; agents do not run `db:gen` or edit generated output. <!-- sdd-owner: parent -->
- [ ] **P14C** (depends: B31) For the reviewed S31 domain schema candidate, a maintainer verifies current Supabase/CLI docs and installed `--help`, runs the approved generation workflow, records the exact generated migration path, and hands it off unchanged; agents do not run `db:gen` or edit generated output. <!-- sdd-owner: parent -->
- [ ] **P15** (depends: P01) Acknowledge the protected `.gitignore` `.atl/` error blocks architecture-pass claims, decide its separate governance path without editing it here, and retain package-size findings as warnings only. <!-- sdd-owner: parent -->
- [ ] **P16** (depends: P09) Approve fixture→staff/test→small branch cohort rollout policy, security/compliance readiness, rollback drills, incident stop conditions, reconciler health/SLO evidence, data retention/holds, and operational ownership; cohorts are not migration stages. <!-- sdd-owner: parent -->
- [ ] **P17** (depends: B33,P16) Stage 15 owner gate: after all scoped parity and rollback exercises and no ambiguous edits/publishes/pointers, separately decide reversible scoped legacy disconnect; this roadmap does not authorize disconnect, deletion, mapping removal, or retirement. <!-- sdd-owner: parent -->
- [ ] **P18** (depends: P17) Stage 16 owner gate: commission and approve a separate retirement SDD covering retention/export/notices/operations/no-rollback-dependency criteria; no retirement task exists in this roadmap. <!-- sdd-owner: parent -->
- [ ] **P19** (depends: P03,P09; modes: editing=B16 | publication=oneOf(B26,B28,allOf(P10,M29,IMP-S29,B29))) Approve and re-evaluate the versioned single selected provider/lane activation-readiness record at each governed use: editing authority uses B16; public preview/domain authority uses exactly one of static B26, dynamic B28, or fallback P10+M29+IMP-S29+B29, never both standard lanes by default. Each use must record its selected mode and require all provider accounts/credentials, commercial admission, budgets/quotas, support/incident contacts, legal/privacy/security/compliance, data residency, retention, and production readiness applicable to that mode. <!-- sdd-owner: parent -->

### Exact manifest and per-protected-file CCR gates (33)

Each gate includes the safe candidate workflow described above and must reject wildcard paths, speculative hashes, reused CCRs, undeclared dirty paths, generated edits, and `bun.lock` changes.

- [ ] **M01** (depends: P01,P15) Review `architecture/slices/replatform-editing-preview-01-identities.json`, all exact S01 paths/classifications/runtime/roles, and a new per-file exact-candidate-hash CCR for each protected code-provider file before S01. <!-- sdd-owner: parent -->
- [ ] **M02** (depends: B01) Review `architecture/slices/replatform-editing-preview-02-identity-schema.json`, exact schema/test/export paths, and every required per-file CCR before S02; name no migration. <!-- sdd-owner: parent -->
- [ ] **M03** (depends: B02,P14A) Review `architecture/slices/replatform-editing-preview-03-identity-migration.json` naming P14A’s exact generated migration and exact DB tests before S03. <!-- sdd-owner: parent -->
- [ ] **M04** (depends: B03,P06) Review `architecture/slices/replatform-editing-preview-04-source-authority.json` with exact service/store-port/test paths before S04. <!-- sdd-owner: parent -->
- [ ] **M05** (depends: B04,P02,P03,P09) Review `architecture/slices/replatform-editing-preview-05-security-admission.json` with exact authority/security/actor/observability/test paths before S05. <!-- sdd-owner: parent -->
- [ ] **M06** (depends: B05,P04) Review `architecture/slices/replatform-editing-preview-06-provider-capabilities.json` and every exact code-provider/NodeFS CCR before S06. <!-- sdd-owner: parent -->
- [ ] **M07** (depends: B06) Review `architecture/slices/replatform-editing-preview-07-codesandbox-baseline.json` and exact CodeSandbox/constants CCRs before S07. <!-- sdd-owner: parent -->
- [ ] **M08** (depends: B07,P04) Review `architecture/slices/replatform-editing-preview-08-cloudflare-files.json` with exact adapter/spike/test paths and any protected export CCR before S08. <!-- sdd-owner: parent -->
- [ ] **M09** (depends: B08,P04,P09) Review `architecture/slices/replatform-editing-preview-09-cloudflare-execution.json` with exact command/terminal/task/port/session paths before S09. <!-- sdd-owner: parent -->
- [ ] **M10** (depends: B09,P05,P06) Review `architecture/slices/replatform-editing-preview-10-durability-rehydrate.json` with exact backup/restore/rehydration/test paths before S10. <!-- sdd-owner: parent -->
- [ ] **M11** (depends: B10,P06) Review `architecture/slices/replatform-editing-preview-11-full-source-copy.json` with exact copier/reconciler/fixture paths and CCRs before S11. <!-- sdd-owner: parent -->
- [ ] **M12** (depends: B11) Review `architecture/slices/replatform-editing-preview-12-file-watch-parity.json` with exact file/watch/build evidence paths before S12. <!-- sdd-owner: parent -->
- [ ] **M13** (depends: B12,P09) Review `architecture/slices/replatform-editing-preview-13-execution-parity.json` with exact execution/session evidence paths before S13. <!-- sdd-owner: parent -->
- [ ] **M14** (depends: B13,P13) Review `architecture/slices/replatform-editing-preview-14-editor-parity.json` and a distinct new exact-hash CCR for every selected editor/frame protected file before S14. <!-- sdd-owner: parent -->
- [ ] **M15** (depends: B14) Review `architecture/slices/replatform-editing-preview-15-git-export-parity.json` and exact Git/SandboxManager CCRs before S15. <!-- sdd-owner: parent -->
- [ ] **M16** (depends: B15) Review `architecture/slices/replatform-editing-preview-16-parity-decision.json` with exact aggregate evidence/test paths before S16. <!-- sdd-owner: parent -->
- [ ] **M17** (depends: B16,P16) Review `architecture/slices/replatform-editing-preview-17-codesandbox-retention.json` with exact mapping/hold/reconciliation paths and any CCR before S17. <!-- sdd-owner: parent -->
- [ ] **M18** (depends: B17,P02,P03,P19) Review `architecture/slices/replatform-editing-preview-18-atomic-cutover.json`, exact concurrency/rollback paths, and a new CCR per selected project/branch protected seam before S18. <!-- sdd-owner: parent -->
- [ ] **M19** (depends: B18,P03,P09) Review `architecture/slices/replatform-editing-preview-19-publishing-contracts.json` with exact publishing contract/service/test paths and CCRs before S19. <!-- sdd-owner: parent -->
- [ ] **M20** (depends: B19) Review `architecture/slices/replatform-editing-preview-20-publishing-schema.json` with exact schema/test/export paths and CCRs before S20; name no migration. <!-- sdd-owner: parent -->
- [ ] **M21** (depends: B20,P14B) Review `architecture/slices/replatform-editing-preview-21-publishing-migration.json` naming the exact generated migration and DB tests before S21. <!-- sdd-owner: parent -->
- [ ] **M22** (depends: B21,P11) Review `architecture/slices/replatform-editing-preview-22-freestyle-baseline.json` and a distinct exact-hash CCR for every selected publish/domain protected path before S22. <!-- sdd-owner: parent -->
- [ ] **M23** (depends: B22,P07,P09) Review `architecture/slices/replatform-editing-preview-23-static-classifier.json` with exact classifier/fixture/test paths before S23. <!-- sdd-owner: parent -->
- [ ] **M24** (depends: B23,P07) Review `architecture/slices/replatform-editing-preview-24-static-artifact-r2.json`, approve exact Worker/service placement, and list exact artifact/R2/test paths before S24. <!-- sdd-owner: parent -->
- [ ] **M25** (depends: B24,P07,P09) Review `architecture/slices/replatform-editing-preview-25-wildcard-worker.json` with exact Worker/router/cache/security/test paths before S25. <!-- sdd-owner: parent -->
- [ ] **M26** (depends: B25,P16) Review `architecture/slices/replatform-editing-preview-26-static-lifecycle.json` with exact activation/lifecycle/reconcile/observability/test paths before S26. <!-- sdd-owner: parent -->
- [ ] **M27** (depends: B26,P08,P09) Review `architecture/slices/replatform-editing-preview-27-opennext-proof.json` with exact classifier/matrix/fixture/test paths before S27. <!-- sdd-owner: parent -->
- [ ] **M28** (depends: B27,P08,P09,P16) Review `architecture/slices/replatform-editing-preview-28-dynamic-deployment.json` with exact deployment/routing/limits/reconcile/test paths before S28. <!-- sdd-owner: parent -->
- [ ] **M29** (depends: B28,P10) Review `architecture/slices/replatform-editing-preview-29-approved-fallback.json` with exact approved provider/runtime/lifecycle/test paths before S29; without P10 it must not be created. <!-- sdd-owner: parent -->
- [ ] **M30** (depends: B22,P11,P16,P19) Review `architecture/slices/replatform-editing-preview-30-preview-route.json` and every exact preview/publish/domain protected CCR before S30; P19 supplies exactly one machine-readable selected-lane evidence branch. <!-- sdd-owner: parent -->
- [ ] **M31** (depends: B30,P12) Review `architecture/slices/replatform-editing-preview-31-domain-schema.json`, exact schema/tests, and every protected domain/export CCR before S31; name no migration. <!-- sdd-owner: parent -->
- [ ] **M32** (depends: B31,P14C) Review `architecture/slices/replatform-editing-preview-32-domain-migration.json` naming the exact generated migration and DB tests before S32. <!-- sdd-owner: parent -->
- [ ] **M33** (depends: B32,P12,P13,P09,P16,P19) Review `architecture/slices/replatform-editing-preview-33-domain-lifecycle.json` and a new exact-hash CCR for every selected protected domain router/helper before S33. <!-- sdd-owner: parent -->

### Post-slice bounded review gates (33)

Each review confirms retained RED→GREEN→TRIANGULATE→REFACTOR evidence, the current planning total and final candidate-sensitive 250–399-line recomputation, exact manifest/diff agreement, every CCR/path/hash agreement, no generated/lockfile/dirty-work violation, focused and standard Bun gate outcomes, reversible finish, retained CodeSandbox/Freestyle baseline/mappings/evidence, and no architecture-pass misstatement.

- [ ] **B01** (depends: IMP-S01) Complete bounded neutral S01 review before releasing M02/S02. <!-- sdd-owner: parent -->
- [ ] **B02** (depends: IMP-S02) Complete bounded neutral S02 review and schema-candidate handoff before P14A/M03. <!-- sdd-owner: parent -->
- [ ] **B03** (depends: IMP-S03) Complete bounded neutral S03 DB/RLS/generated-handoff review before M04. <!-- sdd-owner: parent -->
- [ ] **B04** (depends: IMP-S04) Complete bounded neutral S04 complete-source invariant review before M05. <!-- sdd-owner: parent -->
- [ ] **B05** (depends: IMP-S05) Complete bounded neutral S05 authority/security/observability review before starting Chain B. <!-- sdd-owner: parent -->
- [ ] **B06** (depends: IMP-S06) Complete bounded neutral S06 capability/NodeFS review before M07. <!-- sdd-owner: parent -->
- [ ] **B07** (depends: IMP-S07) Complete bounded neutral S07 CodeSandbox baseline review before M08. <!-- sdd-owner: parent -->
- [ ] **B08** (depends: IMP-S08) Complete bounded neutral S08 Cloudflare files/watch review before M09. <!-- sdd-owner: parent -->
- [ ] **B09** (depends: IMP-S09) Complete bounded neutral S09 execution/session review before M10. <!-- sdd-owner: parent -->
- [ ] **B10** (depends: IMP-S10) Complete bounded neutral S10 durability/rehydration review before starting Chain C. <!-- sdd-owner: parent -->
- [ ] **B11** (depends: IMP-S11) Complete bounded neutral S11 full-source/`.git` copy review before M12. <!-- sdd-owner: parent -->
- [ ] **B12** (depends: IMP-S12) Complete bounded neutral S12 file/watch/build parity review before M13. <!-- sdd-owner: parent -->
- [ ] **B13** (depends: IMP-S13) Complete bounded neutral S13 execution/session parity review before M14. <!-- sdd-owner: parent -->
- [ ] **B14** (depends: IMP-S14) Complete bounded neutral S14 browser/editor parity review before M15. <!-- sdd-owner: parent -->
- [ ] **B15** (depends: IMP-S15) Complete bounded neutral S15 Git/export parity review before M16. <!-- sdd-owner: parent -->
- [ ] **B16** (depends: IMP-S16) Complete bounded neutral S16 branch/revision parity-decision review before M17. <!-- sdd-owner: parent -->
- [ ] **B17** (depends: IMP-S17) Complete bounded neutral S17 CodeSandbox mapping/hold review before M18. <!-- sdd-owner: parent -->
- [ ] **B18** (depends: IMP-S18) Complete bounded neutral S18 cutover/rollback exercise review before starting Chain D. <!-- sdd-owner: parent -->
- [ ] **B19** (depends: IMP-S19) Complete bounded neutral S19 publishing-contract review before M20. <!-- sdd-owner: parent -->
- [ ] **B20** (depends: IMP-S20) Complete bounded neutral S20 schema-candidate review and handoff before P14B/M21. <!-- sdd-owner: parent -->
- [ ] **B21** (depends: IMP-S21) Complete bounded neutral S21 publishing DB/RLS review before M22. <!-- sdd-owner: parent -->
- [ ] **B22** (depends: IMP-S22) Complete bounded neutral S22 Freestyle identity/baseline review before starting static/dynamic chains. <!-- sdd-owner: parent -->
- [ ] **B23** (depends: IMP-S23) Complete bounded neutral S23 isolated static-proof review before M24. <!-- sdd-owner: parent -->
- [ ] **B24** (depends: IMP-S24) Complete bounded neutral S24 artifact/R2 isolation review before M25. <!-- sdd-owner: parent -->
- [ ] **B25** (depends: IMP-S25) Complete bounded neutral S25 wildcard Worker/cache/security review before M26. <!-- sdd-owner: parent -->
- [ ] **B26** (depends: IMP-S26) Complete bounded neutral S26 static lifecycle/rollback review before Chain F or H. <!-- sdd-owner: parent -->
- [ ] **B27** (depends: IMP-S27) Complete bounded neutral S27 OpenNext compatibility review before M28. <!-- sdd-owner: parent -->
- [ ] **B28** (depends: IMP-S28) Complete bounded neutral S28 dynamic isolation/limits/rollback review before optional Chain G or H. <!-- sdd-owner: parent -->
- [ ] **B29** (depends: IMP-S29) Complete bounded neutral S29 fallback lifecycle review before fallback may satisfy M30; no review implies no fallback lane. <!-- sdd-owner: parent -->
- [ ] **B30** (depends: IMP-S30) Complete bounded neutral S30 stable-preview continuity/rollback review before M31. <!-- sdd-owner: parent -->
- [ ] **B31** (depends: IMP-S31) Complete bounded neutral S31 domain-schema review and handoff before P14C/M32. <!-- sdd-owner: parent -->
- [ ] **B32** (depends: IMP-S32) Complete bounded neutral S32 domain DB/RLS review before M33. <!-- sdd-owner: parent -->
- [ ] **B33** (depends: IMP-S33) Complete bounded neutral S33 custom-domain/lifecycle/rollback review; report all unresolved gates and stop before P17. <!-- sdd-owner: parent -->

## Exact roadmap counts and final planning stop

- Implementation task count: **33** (`IMP-S01`–`IMP-S33`).
- Parent gate count: **87** (18 policy/lifecycle decisions + 3 maintainer migration handoffs + 33 per-slice manifest authorization gates + 33 bounded-review gates).
- Slice count: **33**.
- Chain count: **8**.
- Per-chain planning totals: **A 1,700; B 1,780; C 2,720; D 1,380; E 1,420; F 750; G 390; H 1,450**.
- Aggregate changed-line forecast: **11,590**, the exact sum of current provisional planning arithmetic, not an exact candidate-sensitive delivery diff.
- Requirement/task traceability count: **49/49 requirements mapped; 0 orphan requirements; 19/19 design inventory components mapped; 0 orphan components**.

**STOP:** no task is checked. Do not apply, verify, sync, archive, implement, create migrations/manifests/CCRs/tests/generated/provider resources, edit runtime/protected files or `bun.lock`, commit, disconnect providers, or retire providers from this roadmap. Explicit owner approval and resolved parent gates are mandatory; stage 15 disconnect and stage 16 retirement remain outside this change’s authorization.
