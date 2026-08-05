# Jagwar Project Knowledge Index

**Type:** Bun-workspace monorepo with four logical parts  
**Primary language:** TypeScript  
**Architecture:** Next.js route-local full stack with Supabase/Drizzle, focused packages, provider adapters, and managers  
**Scan date:** 2026-07-28  
**Pinned baseline:** `423e2e924366419e418ee049093872d535eea41a`

## Project overview

Jagwar extends the Onlook foundation with a commercial business workflow while preserving the native editor, AI, project, publication, authentication, billing, design-system, package, and development authorities. This documentation describes the established target architecture and readiness constraints; it is not a cutover or redesign plan.

- [Project overview](./project-overview.md)
- [AI editing improvement priorities](./ai-editing/improvement-priorities.md)
- [Source tree analysis](./reports/source-tree-analysis.md)
- [Machine-readable project parts](./reports/project-parts.json)
- [Project scan report](./reports/project-scan-report.json)

## Architecture by part

### Web application (`apps/web`)

- **Type:** Next.js web application plus preload/control runtimes
- **Stack:** Next.js 16, React 19, tRPC, Supabase, MobX, AI SDK, Tailwind 4
- **Entry:** `apps/web/client/src/app/layout.tsx`
- [Architecture](./architecture/architecture-web-app.md)
- [API contracts](./reference/api-contracts-web-app.md)
- [Data models](./reference/data-models-web-app.md)
- [UI/component inventory](./reference/component-inventory-web-app.md)

### Backend (`apps/backend`)

- **Type:** Supabase backend/infrastructure
- **Stack:** Supabase Auth, PostgreSQL, Storage, Realtime, SQL migrations
- **Entry:** `apps/backend/supabase/config.toml`
- [Architecture](./architecture/architecture-backend.md)

### Shared packages (`packages`)

- **Type:** Focused TypeScript libraries
- **Stack:** AI SDK, Drizzle, Stripe, CodeSandbox, Radix/Tailwind, parser/provider abstractions
- **Entry:** package public `src/index.ts` files and declared subpath exports
- [Architecture](./architecture/architecture-shared-packages.md)

### Documentation site (`docs`)

- **Type:** Next.js/Fumadocs web application
- **Stack:** Fumadocs, Next.js 16, React 19, `@onlook/ui`
- **Entry:** `docs/src/app/layout.tsx`
- [Architecture](./architecture/architecture-docs-site.md)

## Cross-part documentation

- [Integration architecture](./architecture/integration-architecture.md)
- [Development guide](./guides/development-guide.md)
- [Deployment guide](./guides/deployment-guide.md)
- [Contribution guide](./guides/contribution-guide.md)

## Quick authority reference

| Concern | Authority |
| --- | --- |
| Identity/session | Supabase Auth |
| Collaboration scope | `users` + `user_projects` + project invitations |
| Persistence | `@onlook/db` Drizzle schemas + Supabase PostgreSQL migrations |
| Authorization | session-derived tRPC context + project-child access verifiers + selected RLS policies |
| Operations | tRPC/Next handlers; persisted creation/deployment status; no generic durable jobs |
| Project/editor | projects/branches/canvas/frames + CodeSandbox + `EditorEngine` |
| Publication | deployments + preview/custom domains + Freestyle adapter |
| Billing/usage | Stripe + products/prices/subscriptions/rate limits/usage records |
| AI composition | project-create `PROMPT` seam for `JagwarBusinessContextV1`; existing root agent/prompts/tools remain unchanged |
| UI | `@onlook/ui` tokens, CSS, icons, primitives, and route-local compositions |

## Existing repository documentation

- [Root README](../../README.md) - upstream feature and stack overview
- [Agent guide](../../AGENTS.md) - repository coding constraints
- [Contributing](../../CONTRIBUTING.md) - upstream contribution entry point
- [Apache-2.0 license](../../LICENSE.md) - redistribution and attribution terms
- [Existing architecture guide](../content/docs/developers/architecture.mdx) - upstream visual-editor overview
- [Existing local setup guide](../content/docs/developers/running-locally.mdx) - upstream environment setup
- [Jagwar foundation handoff](../../_bmad-output/planning-artifacts/jagwar-foundation-handoff/README.md) - product/planning authority

## Getting started

Read [project-overview.md](./project-overview.md), then the architecture document for the owning part and [integration-architecture.md](./architecture/integration-architecture.md). Before proposing code, classify every path against the pinned baseline and prepare per-file Core Change Requests for protected originals.

OD-15 is resolved for Jagwar under approved CCR-019 through CCR-022: the fork intentionally omits the unavailable private upstream admin dependency, does not claim parity with it, and passes pinned-Bun frozen installation. A future operator surface remains an OD-13 target-native design using existing authorities.

## AI-assisted development guidance

- **Workflow/server feature:** web architecture, API contracts, data models, integration architecture
- **UI feature:** web architecture and component inventory
- **AI creation context:** web architecture and shared-package architecture
- **Persistence/migration:** data models and backend architecture
- **Publishing/outreach:** integration architecture, API contracts, deployment guide
- **Billing/cost telemetry:** data models, API contracts, integration architecture

---

_This Jagwar-only collection is intentionally isolated from Onlook's established documentation application and public product content._
