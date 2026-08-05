---
title: OD-15 Jagwar Target Resolution — Core Change Requests
status: approved-and-implemented
created: 2026-07-28
updated: 2026-07-28
writableTarget: /Users/andrewsimic/Developer/Jagwar
branch: bmad/jagwar-foundation-bootstrap
head: a03802a8e85e5c10cd620fb0e654af7cd70ea605
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# OD-15 Jagwar Target Resolution — Core Change Requests

## Approval and implementation record

Andrew approved this resolution in conversation on 2026-07-28 after the read-only Onlook reference checkout confirmed that the normal web application runs with an empty, uninitialized `apps/admin` gitlink. CCR-019 through CCR-022 were then implemented exactly within their approved bounds.

Verification in the writable target:

- pinned Bun 1.3.1 regenerated the lock with the audited 24 additions and 328 deletions;
- `bunx bun@1.3.1 install --frozen-lockfile` installed 2,326 packages successfully;
- `bun run typecheck` passed for `@onlook/web-client`;
- `bun run test` ran 43 passing `@onlook/scripts` tests, while the pre-existing `@onlook/backend` test command failed because `supabase/functions/api` is absent;
- `bun run build` reached the existing environment validator and stopped only because required local secrets/URLs were not configured;
- the target contains no `apps/admin`, `@onlook/admin`, private admin URL, or Next 15.5.7 lock entry.

## Approved decision

Approve the Jagwar fork as intentionally not shipping the unavailable private upstream `apps/admin` application. Remove only its submodule registration, gitlink, root development script, and generated lock records. Preserve the accessible Onlook web, backend, editor, AI, project, publishing, authentication, billing, UI, package, and development authorities.

This is a narrow target-fork exception to the earlier instruction not to remove `apps/admin` merely as an install bypass. It is justified only because:

1. the exact pinned repository still returns `Repository not found` to the authenticated account;
2. the Jagwar customer workflow does not call or import `@onlook/admin`;
3. Andrew has selected a future target-native Jagwar operator surface as the fallback; and
4. the target must support a reproducible clean install and deployment.

This decision does not authorize an admin replacement yet. A future Jagwar operator surface must reuse the same authentication, database, authorization, subscription, entitlement, allowance, usage, and server-service authorities; it must not create parallel ledgers or client-authoritative controls.

## Verified evidence

- The pinned gitlink is `apps/admin` at `3dd1caaab9137203156e59fd48a72d0ef82b942d`.
- `https://github.com/onlook-dev/admin.git` still returns `Repository not found`.
- No accessible source exists to audit, build, test, preserve, or lawfully adapt.
- Root `package.json` discovers applications with `apps/*`; it does not explicitly require the missing path in `workspaces`.
- The only root-script reference is `dev:admin`.
- A disposable archive generated with pinned Bun 1.3.1 and no admin gitlink completed successfully.
- Its lock diff was 24 additions and 328 deletions. It removed the admin workspace/alias and its Next 15.5.7 resolution. The existing web-client manifest and regenerated workspace entry remain on Next 16.0.7, React 19.2.0, and React DOM 19.2.0.
- A subsequent clean `bunx bun@1.3.1 install --frozen-lockfile` against that generated lock installed 2,326 packages successfully.
- The disposable archive's existing root `bun run typecheck` completed successfully for `@onlook/web-client`.
- The target working-tree lockfile was not modified during the audit.

## CCR-019 — `.gitmodules`

### Current responsibility

The protected baseline file registers the single private `apps/admin` submodule and its upstream URL.

### Purpose and exact minimal diff

Delete the file because its only stanza is inaccessible and Jagwar will not ship that upstream application:

```diff
-[submodule "apps/admin"]
-\tpath = apps/admin
-\turl = https://github.com/onlook-dev/admin.git
```

### Alternatives

- Obtain legitimate access to the exact pinned repository: still acceptable and would avoid this change, but access is unavailable.
- Clone a different repository: rejected because it would not prove the pinned source or capability.
- Leave a broken submodule declaration: rejected because clean checkout/setup remains misleading and incomplete.
- Point the submodule at an invented replacement: rejected because it would silently substitute an unaudited capability.

### Risks

- Future upstream merges may reintroduce the submodule declaration.
- Jagwar cannot claim parity with the unavailable private admin application.

### Tests

- `.gitmodules` is absent after the approved change.
- `git submodule status` has no `apps/admin` entry.
- No remaining tracked file names the unavailable admin repository URL.
- Existing accessible submodules, if any are added later, require their own declaration and review.

### Rollback

Restore this exact baseline file only after legitimate access to the pinned admin source exists, together with CCR-020 through CCR-022 rollback.

### Decision

- **Approved and implemented by Andrew on 2026-07-28.**
- Approval is limited to deleting this three-line file.

## CCR-020 — `apps/admin` gitlink

### Current responsibility

The protected baseline tree entry is a Git submodule link at commit `3dd1caaab9137203156e59fd48a72d0ef82b942d`. No source content is available in the Jagwar checkout.

### Purpose and exact minimal diff

Remove only the mode-`160000` `apps/admin` gitlink from the Jagwar target index. Do not add a placeholder package or substitute repository at this path.

### Alternatives

- Keep the empty unresolved gitlink: rejected because it preserves broken setup state.
- Add a fake `@onlook/admin` manifest: rejected because it would imply a preserved capability that does not exist.
- Build Jagwar's operator surface now: deferred; it is a separate OD-13 feature and must use Jagwar naming and existing authorities.

### Risks

- The private upstream admin capability remains unavailable and untested.
- Upstream merges may conflict at the removed gitlink.

### Tests

- `git ls-files -s apps/admin` returns no entry.
- The target contains no empty placeholder or copied private source.
- Web, backend, editor, AI, publishing, auth, and billing regression checks remain independent of the removed path.

### Rollback

Restore the exact mode-`160000` gitlink and pinned commit only when the exact source is accessible, together with the `.gitmodules`, root script, and lock records.

### Decision

- **Approved and implemented by Andrew on 2026-07-28.**
- Approval is limited to removing this one gitlink.

## CCR-021 — `package.json`

### Current responsibility

The protected root manifest owns Bun workspaces and repository-wide scripts. Its `apps/*` workspace pattern already tolerates the absence of a specific application directory.

### Purpose and exact minimal diff

Remove only the unusable development script:

```diff
-        "dev:admin": "bun --filter @onlook/admin dev",
```

Do not change workspace globs, package manager, build/start/test/typecheck scripts, metadata, dependencies, or any other line.

### Alternatives

- Leave a permanently failing script: rejected because it advertises a capability the Jagwar target cannot provide.
- Redirect the script before a Jagwar operator app exists: rejected because that creates a misleading alias.

### Risks

- Anyone expecting the private upstream admin command will no longer have it in Jagwar.

### Tests

- Parse the manifest.
- Confirm all remaining root scripts are byte-for-byte unchanged.
- Confirm root `build`, `start`, `test`, and `typecheck` still select their established packages.
- Search for remaining `@onlook/admin` references outside historical planning/provenance.

### Rollback

Restore the one script only with the accessible pinned admin workspace and its lock records.

### Decision

- **Approved and implemented by Andrew on 2026-07-28.**
- Approval is limited to removing the one script shown above.

## CCR-022 — `bun.lock`

### Current responsibility

The protected lockfile is the single reproducible dependency authority for the Bun workspace.

### Purpose and bounded generated diff

After CCR-019 through CCR-021, regenerate only with repository-pinned Bun 1.3.1. Accept the generated lock only if all of the following hold:

1. `workspaces["apps/admin"]` and `@onlook/admin@workspace:apps/admin` are removed;
2. packages reachable only from the removed admin workspace are removed;
3. shared resolution keys may be re-anchored only when removal of the admin-specific version changes Bun's deduplication winner;
4. no remaining workspace manifest changes;
5. the web client remains on its manifest-pinned Next 16.0.7, React 19.2.0, React DOM 19.2.0, and `@types/react` 19.2.2;
6. no new external dependency is introduced; and
7. the complete generated diff receives a dependency/reachability review before acceptance.

The reproducible disposable result currently measures 24 additions and 328 deletions. This request does not pre-approve a different diff.

### Alternatives

- Hand-edit the lock: prohibited.
- Use a non-frozen install in CI or production: rejected as unreproducible.
- Maintain a second deployment lockfile: rejected because it creates another dependency authority.
- Accept arbitrary generator churn: rejected.

### Risks

- Bun deduplication re-anchors shared packages after Next 15.5.7 disappears.
- A remaining workspace with a permissive range could resolve differently even though its manifest is unchanged.
- Platform-specific optional packages make the generated diff larger than the two explicit admin records.

### Tests

- Review every generated hunk against remaining workspace manifests and dependency reachability.
- `bunx bun@1.3.1 install --frozen-lockfile` passes from a clean archive/checkout.
- Run focused workspace dependency inspection.
- Run the root typecheck and applicable tests without starting the development server.
- Build the web deployment artifact with its required non-production environment.
- Confirm no `apps/admin`, `@onlook/admin`, Next 15.5.7, or matching Next 15 platform resolution remains.
- Confirm the target diff contains no package-manifest change except CCR-021.

### Rollback

Restore the baseline lock together with the gitlink, `.gitmodules`, and `dev:admin` script after legitimate pinned-source access is restored.

### Decision

- **Approved and implemented by Andrew on 2026-07-28.**
- Approval is limited to the pinned-Bun generated result satisfying all seven bounds above and the recorded test gate.

## Explicit approval record

Andrew approved the requested scope in conversation after reviewing the proposal summarized by:

> Approve OD-15 target resolution and CCR-019, CCR-020, CCR-021, and CCR-022 exactly as written. Jagwar will not ship the unavailable upstream admin submodule; a Jagwar-native operator surface may be built later under OD-13.

This approval does not approve production deployment, an operator-panel implementation, unrelated dependency changes, or any other protected baseline edit.
