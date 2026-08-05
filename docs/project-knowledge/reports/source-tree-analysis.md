# Jagwar Foundation - Source Tree Analysis

## Overview

The repository is a Bun workspace monorepo. Product runtime code is split between apps and focused packages; BMAD planning/bootstrap additions are separate from the pinned Onlook baseline.

## Annotated tree

```text
Jagwar/
├── apps/
│   ├── backend/                       # Supabase config and SQL migrations
│   └── web/
│       ├── client/                    # Active Next.js product and tRPC server
│       │   ├── messages/              # next-intl catalogs
│       │   ├── src/app/               # App Router routes and route-local features
│       │   ├── src/components/        # Editor stores, shared app compositions
│       │   ├── src/server/api/        # tRPC context, root, routers
│       │   ├── src/trpc/              # React/server/request clients
│       │   └── src/utils/             # Supabase, telemetry, integration helpers
│       ├── preload/                   # Browser-compatible iframe injection script
│       └── server/                    # Fastify editor-control server (currently unused)
├── packages/
│   ├── ai/                            # Agent, prompt, context, stream, and tool authority
│   ├── code-provider/                 # CodeSandbox and NodeFS provider adapters
│   ├── db/                            # Drizzle schema, defaults, mappers, seeds
│   ├── models/                        # Shared domain and transport contracts
│   ├── stripe/                        # Stripe provider functions and types
│   ├── ui/                            # Tokens, CSS, icons, primitives, AI elements
│   └── ...                            # Focused parser, Git, email, file, utility packages
├── docs/                              # Fumadocs app plus this BMAD knowledge set
├── tooling/                           # Shared ESLint, Prettier, TypeScript configuration
├── _bmad/                             # Installed BMAD workflows and configuration
├── _bmad-output/                      # Jagwar planning/implementation/test artifacts
├── .agents/skills/                    # Installed repository-local skills
├── package.json                       # Protected root workspace and scripts
├── bun.lock                           # Protected lockfile
├── Dockerfile / docker-compose.yml    # Web container/self-host setup
└── LICENSE.md                         # Apache License 2.0
```

## Critical application directories

### `apps/web/client/src/app`

Owns routes and route-local feature composition. Key product areas are `/projects`, `/project/[id]`, `/invitation/[id]`, `/pricing`, `/api/chat`, `/api/trpc`, auth callbacks, and the Stripe webhook.

### `apps/web/client/src/server/api`

Owns tRPC request context, procedure classes, root registration, and routers. New routers are unreachable until registered in the protected root file.

### `apps/web/client/src/components/store/editor`

Owns the client-side editor engine and its specialist managers. This is protected project/editor behavior, not a general workflow store.

### `packages/db/src/schema`

Owns persistent data definitions grouped by canvas, chat, domain, project, subscription, Supabase, and user.

### `apps/backend/supabase/migrations`

Owns ordered SQL history, including RLS, realtime triggers, storage, branching, publishing, billing, and usage schema changes.

### `packages/ai/src`

Owns model/provider selection, system prompts, context hydration, root-agent streaming, tool classes/toolsets, and apply support. The separate project-create prompt contract is defined in `packages/models/src/project/create.ts` and consumed in the project startup hook.

### `packages/ui`

Owns design tokens, global semantic variables, Tailwind configuration, icons, Radix-based primitives, AI display elements, and shared hooks.

## Entry points

| Part | Entry points |
| --- | --- |
| Web app | `apps/web/client/src/app/layout.tsx`, route `page.tsx`/`route.ts`, `src/proxy.ts` |
| tRPC | `apps/web/client/src/app/api/trpc/[trpc]/route.ts`, `src/server/api/root.ts` |
| Chat | `apps/web/client/src/app/api/chat/route.ts` |
| Editor | `apps/web/client/src/app/project/[id]/page.tsx`, `_components/main.tsx`, editor store index |
| Preload | `apps/web/preload/script/index.ts`, `server/index.ts` |
| Editor server | `apps/web/server/src/index.ts` |
| Database package | `packages/db/src/index.ts` |
| AI package | `packages/ai/src/index.ts` |
| UI package | `packages/ui/src/index.ts` and subpath exports |
| Docs | `docs/src/app/layout.tsx`, catch-all page, search route |

## Organization conventions

- Reusable code belongs in a focused package with a public entry point.
- Feature-specific UI/hooks/tests stay beside their route.
- Server-only modules must not cross into client bundles.
- New product-specific names use Jagwar; inherited `@onlook/*` namespaces and exact baseline paths remain unchanged.
- Do not edit generated assets, lockfiles, build output, or the missing admin workspace.
