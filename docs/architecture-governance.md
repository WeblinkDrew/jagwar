# Jagwar Architecture Governance

Jagwar is a fork of Onlook pinned at `423e2e924366419e418ee049093872d535eea41a`. Inherited source and dependency patterns are grandfathered exactly as they existed at that commit. The architecture contract does not characterize upstream choices as Jagwar debt and does not require cleanup.

## Enforcement model

The checker evaluates:

- every new Jagwar-authored source file;
- import text added to a protected baseline file under an approved Core Change Request;
- new workspace dependency edges;
- every protected baseline path whose content differs from the pinned commit.

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

## Advisory signals

Authored files over 400 lines and source paths deeper than 12 segments receive warnings. These are review prompts, not automatic design failures. Generated files, declarative catalogs, cohesive algorithms, and fixtures may legitimately exceed them.

## Local commands

Until the pending root-manifest Core Change Request is approved, run:

```bash
bun scripts/architecture/check.ts --changed
bun scripts/architecture/check.ts --report
bun test scripts/architecture/check.test.ts
```

`--changed` and `--all` enforce the same pinned-baseline ratchet. `--report` prints findings without failing on architectural errors.

## Adding an exception

Do not suppress a finding inline. First decide whether the dependency belongs at a different boundary or needs a stable public contract. If an exception is still required:

1. State its owner and architectural reason.
2. Keep the exception narrower than a directory-wide waiver.
3. Add a review or removal condition.
4. Obtain a Core Change Request when a protected baseline file is involved.
5. Update the machine-readable policy in the same reviewed change.

## Protected-core changes

`architecture/core-change-approvals.json` is the machine-readable approval registry. An approved entry binds an exact protected path to its approved content hash. Changing that file again requires a new approval and a new resulting hash; an earlier approval cannot silently authorize broader edits.
