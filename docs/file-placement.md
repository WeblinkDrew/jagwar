# Jagwar File Placement

Use this decision order before creating a runtime file. The goal is predictable ownership, not a universal folder template.

## Placement order

1. **Runtime:** browser UI, Next server, database, repository tooling, or reusable package.
2. **Capability:** discovery, Leads, business policy, durable operation, projects, outreach, activation, billing, or migration.
3. **Reuse:** keep one-route behavior with its route; create a package only for a stable contract or demonstrated cross-boundary reuse.
4. **Composition:** name the route, tRPC router, package entry point, operation dispatcher, or other public seam that assembles the behavior.
5. **Dependency direction:** presentation and transport may depend on orchestration and stable contracts; packages must not import application-private code.

## Expected locations

| Responsibility                         | Expected location                                           |
| -------------------------------------- | ----------------------------------------------------------- |
| Route-specific UI                      | `apps/web/client/src/app/<route>/_components/`              |
| Route-specific hooks and state         | Beside the owning route feature                             |
| Server orchestration                   | `apps/web/client/src/server/services/<capability>/`         |
| tRPC transport boundary                | `apps/web/client/src/server/api/routers/<capability>/`      |
| Stable reusable rules/contracts        | `packages/<focused-capability>/src/`                        |
| Package public contract tests          | `packages/<focused-capability>/test/`                       |
| Persistence schema                     | `packages/db/src/schema/<capability>/`                      |
| Supabase migrations and database tests | `apps/backend/supabase/`                                    |
| Shared visual primitives               | Existing `@onlook/ui`, only after reuse is demonstrated     |
| Repository architecture/CI tooling     | `scripts/architecture/`, `scripts/ci/`, and `architecture/` |

## Rejected placements

- A package named `common`, `shared`, or `jagwar` that collects unrelated behavior.
- A `misc`, `stuff`, `junk`, or `dump` directory.
- Runtime folders named after an Epic or Story number.
- A package created for one route-local consumer without a stable cross-boundary contract.
- A reusable package importing `apps/*`, route-local aliases, UI, transport, persistence, or provider implementations.
- A route entry point that owns durable domain state or provider policy.

## Per-slice declaration

Before implementation, add `architecture/slices/<slice>.json`:

```json
{
    "version": 1,
    "slice": "1.3a",
    "capability": "business-policy",
    "owningRuntime": "package-and-database",
    "paths": [
        {
            "path": "packages/business-policy/src/release.ts",
            "classification": "new",
            "role": "immutable policy release contract"
        }
    ]
}
```

Use `new` for every Jagwar-owned path absent from the pinned Onlook baseline and `protected-original` for a path present in that baseline. Every protected declaration also needs `coreChangeRequest`; the declaration itself never grants approval.

## Verification loop

```bash
# While editing or before committing
bun scripts/ci/local.ts --mode structure

# Before pushing
bun scripts/ci/local.ts --mode pre-push

# Complete local suite when needed
bun scripts/ci/local.ts --mode full
```

The structure skill designs the slice. The manifest records the agreed paths. The deterministic checker enforces the diff. GitHub repeats the same structure command in a clean environment.
