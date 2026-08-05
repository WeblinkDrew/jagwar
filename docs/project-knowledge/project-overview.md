# Jagwar Foundation - Project Overview

**Scan date:** 2026-07-28  
**Repository:** `/Users/andrewsimic/Developer/Jagwar`  
**Scan level:** Deep  
**Pinned Onlook baseline:** `423e2e924366419e418ee049093872d535eea41a`

## Executive summary

Jagwar is an additive commercial-workflow rebuild on an Onlook-derived Bun workspace monorepo. The existing system is already a full-stack visual editor: a Next.js application hosts the editor and tRPC API, Supabase provides authentication, storage, realtime, and local backend tooling, Drizzle models application persistence, CodeSandbox provides editable project sandboxes, Freestyle publishes builds, the AI SDK runs project-aware agents, Stripe owns subscription state, and `@onlook/ui` owns the visual primitives and design tokens.

The rebuild must extend these authorities rather than create replacements. In particular, there is no independent workspace aggregate in the scanned baseline: Supabase users and `user_projects` membership are the current account and collaboration authority. There is also no general durable-job runner. Project-creation requests are persisted status records, while deployments execute synchronously inside a tRPC mutation and persist progress in `deployments`.

## Classification

- **Repository type:** Bun-workspace monorepo
- **Primary languages:** TypeScript, TSX, SQL, CSS
- **Primary application:** Next.js 16 App Router in `apps/web/client`
- **Backend:** Supabase local stack and PostgreSQL migrations in `apps/backend`
- **Shared libraries:** focused `@onlook/*` packages in `packages/*`
- **Documentation site:** Fumadocs/Next.js application in `docs`
- **Architecture style:** route-local full stack with focused shared packages, schema/mappers, provider adapters, and manager/service objects

## Logical parts

| Part | Root | Classification | Purpose |
| --- | --- | --- | --- |
| Web application | `apps/web` | Web + runtime libraries | Product routes, editor, tRPC API, chat stream, preload bridge, and optional editor control server |
| Backend | `apps/backend` | Backend/infrastructure | Supabase Auth, PostgreSQL, storage, realtime, migration, and local service lifecycle |
| Shared packages | `packages` | Libraries | AI, database, provider, model, UI, publishing helper, parsing, file, Git, email, and utility boundaries |
| Documentation site | `docs` | Web | Fumadocs content and the generated project-knowledge entry points in this directory |

## Native authority map

| Concern | Canonical authority | Primary seams |
| --- | --- | --- |
| Identity/session | Supabase Auth | `src/utils/supabase/*`, `src/server/api/trpc.ts`, `src/app/auth/*` |
| Account/profile | `users` keyed to `auth.users` | `packages/db/src/schema/user/user.ts`, user router |
| Collaboration scope | `user_projects` membership and `ProjectRole` | project helper, member/invitation routers, RLS helper functions |
| Persistence | Drizzle schema over Supabase PostgreSQL | `packages/db/src/schema`, `packages/db/src/client.ts`, migrations |
| Authorization | authenticated tRPC context plus project-membership checks; selected Supabase RLS policies | `protectedProcedure`, `verifyProjectAccess` family, `0006_rls.sql` |
| Server operations | tRPC mutations and Next route handlers | `src/server/api/routers`, `src/app/api`, `src/app/webhook` |
| Long-running status | `project_create_requests` and `deployments` | create-request router, deployment router/manager |
| Project source/editor | projects, branches, canvases, frames, CodeSandbox provider, MobX `EditorEngine` | project routers, `@onlook/code-provider`, editor stores |
| Publication | deployment records, preview/custom domains, Freestyle hosting adapter | publish/domain routers and `PublishManager` |
| Billing/entitlements | Stripe plus `products`, `prices`, `subscriptions`, `rate_limits`, `usage_records` | `@onlook/stripe`, Stripe webhook, subscription/usage routers |
| AI composition | typed message contexts, prompt hydration, root agent, toolsets | `@onlook/ai`, `@onlook/models/chat`, `/api/chat` |
| UI primitives | `@onlook/ui`, its global CSS/tokens/icons, route-local compositions | `packages/ui`, app root layout, route `_components` |

## Key readiness findings

1. The baseline has no generic workspace table or service. A new abstract `Workspace` would conflict with the native model unless an approved decision establishes how it maps to Supabase users and project membership.
2. The baseline has no durable queue/worker abstraction. `deployments` has useful operation-state semantics, but `deployment.run` performs the build and publish inline and cancellation only updates stored state.
3. The billing and usage authority is already unified and user-scoped. Jagwar cost telemetry must remain non-enforcing and must not become a parallel allowance or entitlement ledger.
4. The live-chat message-context seam is typed and closed, but project creation has a separate public composition seam: `CreateRequestContextType.PROMPT` is persisted in `project_create_requests` and sent through the existing `ChatType.CREATE` path. A validated, provenance-aware `JagwarBusinessContextV1` can be rendered into this prompt seam without changing AI prompts, agents, tools, registries, or apply behavior.
5. The repository uses Apache-2.0. New documentation copies no external assets or code; any future copied/adapted source must retain applicable license and attribution notices.
6. Jagwar intentionally omits the unavailable private upstream `apps/admin` application under approved OD-15 CCR-019 through CCR-022. Frozen installation now succeeds; the fork does not claim private-admin parity.

## Documentation map

- [Architecture - Web application](./architecture/architecture-web-app.md)
- [Architecture - Backend](./architecture/architecture-backend.md)
- [Architecture - Shared packages](./architecture/architecture-shared-packages.md)
- [Architecture - Documentation site](./architecture/architecture-docs-site.md)
- [Integration architecture](./architecture/integration-architecture.md)
- [API contracts](./reference/api-contracts-web-app.md)
- [Data models](./reference/data-models-web-app.md)
- [Component inventory](./reference/component-inventory-web-app.md)
- [Source tree analysis](./reports/source-tree-analysis.md)
- [Development guide](./guides/development-guide.md)
- [AI editing improvement priorities](./ai-editing/improvement-priorities.md)

---

_Generated by the BMAD `document-project` workflow. “Onlook” is retained where it names inherited package namespaces, exact paths, or baseline provenance; new product-specific work is named Jagwar._
