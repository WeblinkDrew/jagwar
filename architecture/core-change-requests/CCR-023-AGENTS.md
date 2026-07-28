---
title: CCR-023 — Add the Jagwar Architecture Change Protocol
status: pending-andrew-confirmation
path: AGENTS.md
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# CCR-023 — `AGENTS.md`

## Current responsibility

The protected root agent guide governs automated code changes across the repository, including runtime boundaries, package management, generated artifacts, Next.js, tRPC, MobX, UI, and verification.

## Proposed change

Add one concise `Architecture Change Protocol` section after `Agent Priorities`:

```markdown
### Architecture Change Protocol

- For new features, packages, runtimes, or substantial refactors, use the
  `structure-modular-codebase` workflow when available and read
  `docs/architecture-governance.md`.
- Name the owning runtime and product/domain capability before creating files.
- Prefer capability-local or route-local modules; do not create generic dumping
  packages or add private `@onlook/*/src/*` imports.
- Treat the pinned Onlook baseline as inherited and grandfathered. Do not
  refactor it merely to satisfy new Jagwar conventions.
- Before editing any protected baseline file, stop for its exact approved Core
  Change Request.
- Run `bun scripts/architecture/check.ts --changed` before handoff and report
  architectural warnings or intentional exceptions.
```

No existing instruction is removed, reordered, or weakened.

## Why a new file is insufficient

The governance document and checker can be added independently, but agents automatically receive the root guide. Without this small link, architecture review depends on the user remembering to invoke a global skill that may not exist on another machine.

## Risk and compatibility

- No runtime, dependency, API, generated artifact, or product behavior changes.
- The new instructions strengthen the existing minimal-diff and protected-core rules.
- Contributors without the global skill can follow the repository governance document and checker directly.

## Verification and rollback

- Confirm the diff adds only the shown section.
- Run the architecture checker and inspect Markdown rendering.
- Roll back by removing only the section.

## Decision

Pending Andrew's explicit per-file confirmation. Approval must be limited to the exact section above.
