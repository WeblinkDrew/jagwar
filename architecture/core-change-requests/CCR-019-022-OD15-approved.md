---
title: OD-15 approved protected-file state
status: approved
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
approvedHead: a03802a8e85e5c10cd620fb0e654af7cd70ea605
---

# CCR-019 through CCR-022 — Approved OD-15 state

Andrew approved CCR-019 through CCR-022 on 2026-07-28 to remove only the inaccessible private upstream `apps/admin` application from the Jagwar fork.

| Request | Protected path | Approved state |
| --- | --- | --- |
| CCR-019 | `.gitmodules` | Deleted because its only entry registered the inaccessible `apps/admin` submodule. |
| CCR-020 | `apps/admin` | Deleted mode-`160000` gitlink without adding a placeholder or replacement. |
| CCR-021 | `package.json` | Remove only the `dev:admin` script. |
| CCR-022 | `bun.lock` | Pinned-Bun 1.3.1 generated result caused only by removing the admin workspace and its exclusive resolution records. |

The full approval rationale, alternatives, risks, tests, rollback, and conversational confirmation remain in the Jagwar foundation/readiness record. The machine-readable registry binds the approved file states to exact content hashes so these requests cannot authorize later unrelated edits.

This approval does not authorize an admin replacement, production deployment, dependency changes, additional manifest scripts, or any other protected baseline modification.
