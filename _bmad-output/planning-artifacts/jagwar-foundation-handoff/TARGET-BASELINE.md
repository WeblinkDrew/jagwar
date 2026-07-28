---
title: Jagwar Writable Target Baseline
status: pinned
created: 2026-07-28
updated: 2026-07-28
---

# Jagwar Writable Target Baseline

## Repository identity

- Writable target: `/Users/andrewsimic/Developer/Jagwar`
- GitHub fork: `https://github.com/WeblinkDrew/jagwar`
- Fork remote: `origin`
- Onlook source: `https://github.com/onlook-dev/onlook.git`
- Source remote: `upstream`
- Bootstrap branch: `bmad/jagwar-foundation-bootstrap`
- Pinned Onlook commit: `423e2e924366419e418ee049093872d535eea41a`
- Upstream comparison: target `HEAD` exactly matched `upstream/main` when pinned
- License at the pinned baseline: Apache License 2.0 in `LICENSE.md`
- Workspace/runtime baseline: Bun workspaces with `bun@1.3.1`

## Protection policy

Every Git-tracked file present at the pinned commit is an original Onlook baseline file and is protected. Before editing one, complete `CORE-CHANGE-REQUEST-TEMPLATE.md` for that exact path and obtain Andrew's explicit confirmation.

New Jagwar-owned files may be added without per-file confirmation when they follow Onlook's package, feature-colocation, schema, adapter, manager/service, public-export, and testing conventions. Adding a new file does not authorize an unapproved baseline-file export, registration, dependency, configuration, or lockfile change.

The local `upstream` push URL is set to `DISABLED`. Fetching from upstream remains available; publishing Jagwar work uses `origin`.

## Bootstrap state

At pin time, no original Onlook tracked file differed from the pinned commit. BMAD installation and Jagwar planning artifacts were added as untracked bootstrap paths on `bmad/jagwar-foundation-bootstrap`.

The separate checkout at `/Users/andrewsimic/Developer/Onlook/onlook` remains read-only reference material and is not the Jagwar implementation target.

## Dependency bootstrap finding

The pinned `.gitmodules` declares `apps/admin` at commit `3dd1caaab9137203156e59fd48a72d0ef82b942d` from `https://github.com/onlook-dev/admin.git`. That repository is unavailable to the authenticated account and also cannot be resolved publicly. The existing Onlook reference checkout does not contain the submodule content.

Because the root workspace includes `apps/*` and the committed `bun.lock` contains `@onlook/admin`, both the system Bun and the repository-declared Bun `1.3.1` reject `bun install --frozen-lockfile` while the submodule is absent. The lockfile and root workspace configuration were not changed. Resolve OD-15 by obtaining legitimate access to the pinned submodule or by adopting an upstream-authorized public resolution before dependency installation or baseline test claims.
