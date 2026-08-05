---
title: CCR-026 — Rewrite AGENTS.md as concise LLM rules
status: approved
path: AGENTS.md
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
proposedContentSha256: 59a2aff547a51adeb4485f3e0da51c13f0c987fb658f72fab34202a65d4f3eb0
---

# CCR-026 — `AGENTS.md`

## Current responsibility

The protected root agent guide governs automated changes across the repository. Its current prose contains the correct project-specific constraints, but mixes hard requirements, recommendations, examples, and operational notes without explicit enforcement levels. It also contains an incomplete type-safety bullet.

## Proposed change

Replace `AGENTS.md` with the exact 195-line document below. The rewrite preserves the repository-specific constraints while making them scannable through `REJECT`, `REQUIRE`, and `PREFER` sections. It adds references for deeper architecture material and scopes the strict response format to explicit code-review requests.

```markdown
# Jagwar Agent Rules

Rules for automated agents working in this repository. Keep changes minimal, safe, and reviewable.

## References

Load only when relevant:

- Architecture governance: `docs/architecture-governance.md`
- File placement: `docs/file-placement.md`
- Architecture approvals: `architecture/core-change-approvals.json`
- Root workspace configuration: `package.json`
- Web client configuration: `apps/web/client/tsconfig.json`

## Repository Map

- Monorepo: Bun workspaces
- Web app: `apps/web/client` — Next.js App Router + TailwindCSS
- API routers: `apps/web/client/src/server/api/routers/**`
- API composition root: `apps/web/client/src/server/api/root.ts`
- Shared packages: `packages/*`

## All Changes

REJECT if:

- Generated output, lockfiles, `.next`, or `node_modules` are edited
- Scope expands beyond the requested capability without approval
- Existing abstractions are replaced by one-off frameworks without justification
- A protected Onlook baseline file is changed without an exact approved Core Change Request
- A new governed path lacks its required `architecture/slices/*.json` declaration

REQUIRE:

- Small, targeted diffs
- Existing repository patterns before new abstractions
- Client/server runtime boundaries to remain explicit
- Errors, failed checks, and intentional exceptions to be reported

PREFER:

- Capability-local or route-local modules
- Narrow searches and focused file reads
- Colocation of behavior with its owning capability

## Tooling

REJECT if:

- npm, Yarn, or pnpm is used
- The local development server is started in automation
- `db:gen` is run; it is maintainer-only

REQUIRE:

- Bun for installs and scripts
- `bun run db:push` for approved local database updates

## Architecture

For new features, packages, runtimes, or substantial refactors:

REJECT if:

- Generic dumping directories or generic Jagwar packages are introduced
- Private `@onlook/*/src/*` imports are added
- A package imports application-private code
- A workspace dependency is undeclared or creates a cycle
- Client modules import server-only modules
- The inherited Onlook baseline is refactored only to satisfy new Jagwar conventions

REQUIRE:

- Read `docs/architecture-governance.md`
- Use `structure-modular-codebase` when available
- Name the owning runtime and product/domain capability before creating files
- Read `docs/file-placement.md` before adding a runtime path
- Obtain a new exact Core Change Request before editing a protected baseline file
- Run `bun scripts/architecture/check.ts --changed` before handoff

## TypeScript and Imports

REJECT if:

- `any` is used without explicit necessity and justification
- Client code imports `process` or reads `process.env`
- Server-only modules are imported into client components
- New Node API usage is added to client code outside existing approved editor exceptions

REQUIRE:

- Preserve type safety
- Use `@/*` or `~/*` for web-client source imports
- Split shared code by runtime when client/server boundaries differ

## Next.js and React

REJECT if:

- A component using events, state, effects, browser APIs, or client-only libraries lacks a client boundary
- `mobx-react-lite` `observer` runs outside a client boundary
- A Server Component is converted to a Client Component without necessity

REQUIRE:

- Default to Server Components
- Add `"use client"` only at the necessary feature boundary
- Keep client providers behind a client boundary

## tRPC

REJECT if:

- Router input is not validated with Zod
- A new router is not exported from `apps/web/client/src/server/api/root.ts`
- Non-serializable values are returned

REQUIRE:

- Routers under `apps/web/client/src/server/api/routers/**`
- `publicProcedure` or `protectedProcedure` from `src/server/api/trpc.ts`
- Plain objects or arrays for SuperJSON serialization

## Supabase and Environment

REJECT if:

- A server Supabase client reaches client code
- Browser variables lack the `NEXT_PUBLIC_*` prefix
- Environment variables bypass `apps/web/client/src/env.ts`

REQUIRE:

- Server client: `apps/web/client/src/utils/supabase/server.ts`
- Browser client: `apps/web/client/src/utils/supabase/client/index.ts`
- Typed environment access through `@/env`
- `apps/web/client/next.config.ts` must import `./src/env`

## MobX Stores

REJECT if:

- `useMemo` creates a store instance
- Synchronous route cleanup introduces a store race
- Store dependencies create an effect loop

REQUIRE:

- Create stores with `useState(() => new Store())`
- Keep the active store in `useRef`
- Use the established asynchronous `setTimeout(() => storeRef.current?.clear(), 0)` cleanup pattern

## UI and Internationalization

REJECT if:

- User-facing text is hardcoded instead of added to `apps/web/client/messages/*`
- Existing stable translation keys are broken unnecessarily

PREFER:

- TailwindCSS-first styling
- Existing `@onlook/ui` and local components
- Semantic markup
- Existing dark-theme behavior through `ThemeProvider`

## Verification

Run checks appropriate to the changed scope:

- Unit tests: `bun test`
- Type checking: `bun run typecheck`
- Architecture: `bun scripts/architecture/check.ts --changed`
- Fast structure gate: `bun scripts/ci/local.ts --mode structure`
- Pre-push gate: `bun scripts/ci/local.ts --mode pre-push`

REQUIRE:

- Report commands run and their outcomes
- Report architectural warnings and intentional exceptions
- Do not claim completion when required checks fail

## Code Review Response

When explicitly asked for a code review, the first line must be exactly:

`STATUS: PASSED`

or

`STATUS: FAILED`

For failures, list each blocking finding as:

`file:line - rule violated - issue`
```

## Exact content binding

- Proposed line count: `195`
- Proposed SHA-256: `59a2aff547a51adeb4485f3e0da51c13f0c987fb658f72fab34202a65d4f3eb0`
- Approval applies only to the exact replacement shown above.
- Any content change requires a new hash and renewed approval.

## Why a new file is insufficient

`AGENTS.md` is automatically loaded as the root repository instruction surface. Moving all rules elsewhere would either remove essential always-on constraints or require agents to know which document to load before the repository can tell them.

## Risk and compatibility

- No runtime, dependency, API, generated artifact, or product behavior changes.
- Existing Bun, architecture, Next.js, tRPC, Supabase, environment, MobX, UI, i18n, and verification constraints remain represented.
- The incomplete `Respect type safety and` bullet is replaced by an enforceable type-safety rule.
- The rewrite adds no blanket language/framework prohibitions copied from generic examples.
- Code-review status formatting applies only when a code review is explicitly requested.

## Verification and rollback

- Confirm the applied file hashes to the approved SHA-256.
- Run `bun scripts/architecture/check.ts --changed` after adding the approval registry entry.
- Inspect Markdown rendering and referenced paths.
- Roll back by restoring the CCR-023-approved content and registry binding.

## Decision

Andrew explicitly approved CCR-026 on 2026-07-29, limited to the exact `AGENTS.md` replacement above and recorded SHA-256 `59a2aff547a51adeb4485f3e0da51c13f0c987fb658f72fab34202a65d4f3eb0`.
