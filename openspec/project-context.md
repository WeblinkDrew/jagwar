# Jagwar Project Context

## Repository

- **Project:** Jagwar
- **Repository type:** Bun 1.3.1 TypeScript monorepo forked from Onlook
- **Pinned inherited baseline:** `423e2e924366419e418ee049093872d535eea41a`
- **Workspaces:** `apps/*`, `packages/*`, `tooling/*`, `apps/web/*`, and `docs`
- **Primary runtime:** Next.js 16 App Router in `apps/web/client`, with React 19, tRPC, Zod, Drizzle/Supabase, Tailwind CSS, next-intl, and Storybook/Vitest browser testing
- **Artifact policy:** OpenSpec is authoritative and must remain present. Engram is an optional mirrored backend for this initialization.

## Authoritative Next Input

The next SDD phase should fast-forward the authoritative BMAD story at:

`_bmad-output/implementation-artifacts/1-3b-authorized-runtime-policy-operation.md`

Story key: `1-3b-authorized-runtime-policy-operation` (Story 1.3b, Authorized Runtime Policy Operation). The story is input only; initialization does not implement or modify it.

## Engineering Conventions

- Follow root `AGENTS.md`, `docs/architecture-governance.md`, and `docs/file-placement.md`.
- Use Bun only; do not use npm, Yarn, or pnpm, and do not start a development server in automation.
- Keep diffs small, targeted, capability-local, and type-safe. Do not introduce `any` without explicit necessity and justification.
- Preserve explicit client/server boundaries and use public workspace entry points; never add private `@onlook/*/src/*` imports.
- Place server orchestration under `apps/web/client/src/server/services/<capability>/`, tRPC boundaries under `apps/web/client/src/server/api/routers/<capability>/`, persistence schemas under `packages/db/src/schema/<capability>/`, and stable reusable contracts in focused packages.
- Every governed implementation path requires an `architecture/slices/*.json` declaration. A protected baseline edit additionally requires an exact hash-bound approved Core Change Request.
- Do not edit generated output or `bun.lock`. `db:gen` is maintainer-only.
- Preserve unrelated modified and untracked work.

## SDD and Testing

Strict TDD is enabled: add or identify a failing test first, make the smallest production change to pass, then refactor while keeping checks green.

Default verification commands:

```bash
bun test
bun run typecheck
bun --filter @onlook/web-client lint
(cd apps/web/client && bunx vitest run --project storybook)
bun scripts/architecture/check.ts --changed
bun scripts/ci/local.ts --mode structure
bun scripts/ci/local.ts --mode pre-push
git diff --check
```

Use the story's focused command matrix for Story 1.3b before the complete applicable gates. Report commands and outcomes; do not claim completion if required checks fail.

## Initialization Boundary

This initialization creates only SDD/OpenSpec metadata. It does not launch BMAD skills, implement Story 1.3b, modify runtime code, create a commit, authorize protected-core edits, or clean existing repository state.
