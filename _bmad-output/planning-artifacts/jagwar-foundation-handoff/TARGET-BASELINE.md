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

## Dependency bootstrap finding and approved fork divergence

The pinned upstream baseline declared `apps/admin` at commit `3dd1caaab9137203156e59fd48a72d0ef82b942d` from the inaccessible private repository `https://github.com/onlook-dev/admin.git`. The read-only Onlook reference checkout confirms its normal web application runs while that gitlink is empty and no `@onlook/admin` workspace link exists.

Andrew approved CCR-019 through CCR-022 on 2026-07-28. The writable Jagwar target intentionally removes the upstream `.gitmodules` registration, `apps/admin` gitlink, root `dev:admin` script, and generated lock records. Jagwar does not ship or claim parity with the unavailable private application. Pinned Bun 1.3.1 now completes a frozen install of the declared Jagwar workspace, and the existing web typecheck passes. Future upstream synchronization must preserve or deliberately revisit this recorded fork divergence.
