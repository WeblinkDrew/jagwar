# Jagwar Foundation - Development Guide

## Prerequisites

- Bun `1.3.1` (the root `packageManager` authority)
- Node.js `20.16.0` or newer where supporting tooling requires Node
- Docker for the local Supabase stack
- Provider credentials validated by `apps/web/client/src/env.ts`

## Resolved target dependency

Jagwar intentionally omits the unavailable private upstream `apps/admin` application under approved OD-15 CCR-019 through CCR-022. Pinned Bun 1.3.1 now completes a frozen install. Do not reintroduce that upstream dependency during synchronization without an explicit decision and regression plan.

## Standard commands

Run commands from the repository root unless noted:

| Task | Command | Notes |
| --- | --- | --- |
| Install | `bun install --frozen-lockfile` | Verified with pinned Bun 1.3.1 after OD-15 resolution |
| Typecheck active web client | `bun run typecheck` | Root filters `@onlook/web-client` |
| Unit tests | `bun test` | Repository guidance; prefer targeted filters while iterating |
| Lint | `bun run lint` | Runs workspace lint scripts |
| Build web client | `bun run build` | Requires environment validation and dependencies |
| Start Supabase | `bun run backend:start` | Docker required |
| Apply local schema | `bun run db:push` | Approved local development only |
| Seed local data | `bun run db:seed` | Non-production data only |
| Docs typecheck | `bun --filter @onlook/docs typecheck` | Does not start a dev server |

Do not run the development server in automation. Do not run `db:gen`; it is reserved for the maintainer.

## Environment configuration

Use the interactive root `bun run setup:env` flow after dependencies are available. The web env schema distinguishes server-only keys from `NEXT_PUBLIC_*` browser variables. Key integrations include Supabase, CodeSandbox, Freestyle, Stripe, AI providers, Resend, GitHub, Firecrawl, Exa, Langfuse, PostHog, and optional n8n hooks. Never expose server keys to client code.

## Implementation conventions

- Preserve Server Component defaults and add client boundaries only when needed.
- Use tRPC procedures with Zod validation and session-derived identity.
- Verify project/child-resource access before database or provider operations.
- Use `@onlook/*` public entry points; avoid private cross-package imports.
- Use `@onlook/ui` and `next-intl` for shared primitives and user-facing strings.
- Construct MobX stores with stable `useState` initialization and follow editor cleanup conventions.
- Keep schema changes additive/reversible and supply deterministic tests.
- Never edit a file present at baseline `423e2e9` without an approved per-file Core Change Request.

## Suggested verification order

With dependencies frozen:

1. targeted unit tests for changed packages/features;
2. package or web-client typecheck;
3. relevant lint target;
4. full `bun test` when practical;
5. approved local migration/RLS tests for schema work;
6. build/Storybook/contract checks appropriate to the change.

The OD-15 correction verified frozen install and web typecheck. It did not start services or generate schema.
