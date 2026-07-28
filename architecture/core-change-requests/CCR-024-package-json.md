---
title: CCR-024 — Add architecture-check convenience scripts
status: pending-andrew-confirmation
path: package.json
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# CCR-024 — `package.json`

## Current responsibility

The protected root manifest owns Bun workspaces and repository-wide development commands. CCR-021 already approves the current removal of the inaccessible `dev:admin` command and no other manifest change.

## Proposed change

Append only these commands to the existing `scripts` object:

```diff
+        "architecture:check": "bun scripts/architecture/check.ts --changed",
+        "architecture:report": "bun scripts/architecture/check.ts --report",
```

Place commas as required for valid JSON. Do not change workspace globs, dependencies, package-manager metadata, or any existing command.

## Why a new file is insufficient

The checker is directly runnable without this change, and CI calls it directly. Root commands make the contract discoverable and consistent with existing `lint`, `typecheck`, and `test` workflows.

## Risk and compatibility

- No dependency or lockfile change.
- No build, test, lint, database, application, or runtime behavior change.
- Commands use repository-pinned Bun and new Jagwar-owned source only.

## Verification and rollback

- Parse `package.json`.
- Run both commands.
- Confirm `bun.lock` remains byte-for-byte unchanged.
- Roll back by removing only the two commands.

## Decision

Pending Andrew's explicit per-file confirmation. Approval must be limited to the exact two script entries above.
