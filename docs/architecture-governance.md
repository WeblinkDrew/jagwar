# Jagwar Architecture Governance

Jagwar is a fork of Onlook pinned at `423e2e924366419e418ee049093872d535eea41a`. Inherited source and dependency patterns are grandfathered exactly as they existed at that commit. The architecture contract does not characterize upstream choices as Jagwar debt and does not require cleanup.

## Enforcement model

The checker evaluates:

- every new Jagwar-authored source file;
- import text added to a protected baseline file under an approved Core Change Request;
- new workspace dependency edges;
- every protected baseline path whose content differs from the pinned commit.
- every governed path changed from the pinned Onlook baseline, which must be declared by an exact slice manifest.

Existing Onlook imports, package cycles, file sizes, and directory depth remain informational unless Jagwar expands them.

## Blocking invariants

- A protected baseline file must match the content hash recorded by an approved per-file Core Change Request.
- A new package must not import application-private code.
- New code must use workspace public entry points instead of `@onlook/*/src/*` paths.
- New workspace imports must be declared in the importing package manifest.
- New workspace edges must not create dependency cycles.
- New editor state must not depend on route-local UI contracts.
- New client modules must not import known server-only modules.
- Jagwar pure capability packages remain free of UI, transport, persistence, provider, and application dependencies.
- Every governed changed path is declared in `architecture/slices/*.json` with its capability, owning runtime, role, and correct new/Jagwar-owned/protected classification.
- Runtime code does not use generic dumping directories, generic Jagwar packages, or BMAD story-number folders.
- New workspace packages are limited to focused capability packages already allocated by the approved architecture plan.

## Advisory signals

Authored files over 400 lines and source paths deeper than 12 segments receive warnings. These are review prompts, not automatic design failures. Generated files, declarative catalogs, cohesive algorithms, and fixtures may legitimately exceed them.

## Local commands

For the fastest edit/commit loop, run:

```bash
bun scripts/ci/local.ts --mode structure
```

Before pushing a story branch, run:

```bash
bun scripts/ci/local.ts --mode pre-push
```

To reproduce the slower complete local test gate, run:

```bash
bun scripts/ci/local.ts --mode full
```

The underlying focused commands remain available:

```bash
bun scripts/architecture/check.ts --changed
bun scripts/architecture/check.ts --report
bun test scripts/architecture/check.test.ts scripts/architecture/placement.test.ts
```

`--changed` and `--all` enforce the same pinned-baseline ratchet. `--report` prints findings without failing on architectural errors.

## File placement and slice manifests

Use `docs/file-placement.md` before creating a new runtime path. Each implementation slice adds one JSON manifest under `architecture/slices/`. The manifest is the reviewed path plan; CI compares the real Git diff with the accumulated declarations and rejects undeclared or misclassified governed paths.

The manifest does not authorize a protected-file edit. A protected declaration must identify its exact Core Change Request, and the resulting content must still match the approved hash registry.

## Repository-owned Git hooks

Enable the versioned hooks once per clone:

```bash
bun scripts/ci/install-hooks.ts
```

The pre-commit hook runs the sub-second structure gate. The pre-push hook runs architecture tests, web-client type checking, and Git diff validation. Hooks provide fast feedback but are not a security boundary; required GitHub checks remain the authoritative merge gate.

## Adding an exception

Do not suppress a finding inline. First decide whether the dependency belongs at a different boundary or needs a stable public contract. If an exception is still required:

1. State its owner and architectural reason.
2. Keep the exception narrower than a directory-wide waiver.
3. Add a review or removal condition.
4. Obtain a Core Change Request when a protected baseline file is involved.
5. Update the machine-readable policy in the same reviewed change.

## Protected-core changes

`architecture/core-change-approvals.json` is the machine-readable approval registry. An approved entry binds an exact protected path to its approved content hash. Changing that file again requires a new approval and a new resulting hash; an earlier approval cannot silently authorize broader edits.
