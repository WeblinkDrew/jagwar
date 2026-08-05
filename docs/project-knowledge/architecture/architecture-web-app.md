# Jagwar Foundation - Web Application Architecture

## Executive summary

`apps/web` contains the interactive product runtime. `apps/web/client` is the active Next.js App Router application and also hosts the tRPC server, chat route, auth callback, and Stripe webhook. `apps/web/preload` builds the browser-compatible script injected into edited applications. `apps/web/server` is a Fastify/tRPC editor control server described by existing documentation as currently unused.

## Technology stack

| Layer | Technology | Version/source | Role |
| --- | --- | --- | --- |
| Framework | Next.js App Router | `16.0.7` | Routes, Server Components, route handlers, metadata |
| UI runtime | React | `19.2.0` | Component rendering and client boundaries |
| API | tRPC + SuperJSON + Zod | `11.x`, `2.2.1`, `4.1.3` | Typed request boundary and validation |
| Client server-state | TanStack React Query | `5.69.0` | tRPC query/mutation cache |
| Editor state | MobX / `mobx-react-lite` | `4.1.0` | Stateful editor engine and managers |
| Auth/storage | Supabase SSR/client | `@supabase/ssr 0.6.1` | Cookie sessions, auth, storage, realtime |
| AI streaming | AI SDK | application `5.0.26`; package `5.0.60` | Typed UI streams, models, tools, telemetry |
| Styling | Tailwind CSS 4 + `@onlook/ui` | `4.0.15` | Tokens, utilities, Radix-based primitives |
| i18n | `next-intl` | `4.0.2` | Locale provider and message catalogs |
| Sandbox | `@onlook/code-provider` / CodeSandbox SDK | workspace package | Editable project source and commands |
| Hosting | Freestyle | `freestyle-sandboxes 0.0.78` | Published deployment target |

## Request and trust boundaries

1. `src/proxy.ts` refreshes the Supabase cookie session through `updateSession`.
2. `createTRPCContext` resolves the authenticated user with `supabase.auth.getUser()` and provides the Drizzle database handle.
3. `protectedProcedure` rejects missing users or email addresses. It establishes authentication, not resource authorization.
4. Project-scoped routers call `verifyProjectAccess` or a child-resource verifier. These follow relationships back to `user_projects` and deliberately conflate missing and unauthorized resources.
5. `adminProcedure` replaces the request-scoped Supabase client with a service-role client and bypasses RLS; its use must remain exceptional and server-only.
6. Next route handlers such as `/api/chat` and `/webhook/stripe` enforce their own request authentication/signature checks.

The database client is imported from `@onlook/db/src/client`, a private source path, even though repository guidance favors package public entry points. This is inherited baseline behavior, not a pattern to expand.

## Identity and collaboration

Supabase Auth is the session authority. Application profiles live in `users`, keyed one-to-one to `auth.users`. Collaboration is project-centric:

- `user_projects(user_id, project_id, role)` is the membership authority.
- `ProjectRole` currently includes role data used by RLS and invitations.
- `project_invitations` stores inviter, invitee email, role, token, and expiry.
- `verifyProjectAccess` checks membership but does not distinguish roles.
- The member removal router explicitly records that role-gated removal is not yet implemented at the application layer.

No organization, team, or workspace aggregate was found. The current equivalent operating scope is an authenticated user plus the set of projects reachable through `user_projects`.

## Route and component architecture

- Server Components are the default in `src/app`.
- Client boundaries contain interactions, browser APIs, providers, and MobX observers.
- Feature UI is colocated under route `_components` and `_hooks`, especially `app/project/[id]` and `app/projects`.
- The root layout installs tRPC, feature flags, telemetry, forced-dark theme, auth context, internationalization, and toasts.
- Shared primitives come from public `@onlook/ui/*` subpaths; app-specific assemblies remain local.
- User-facing translated strings live in `apps/web/client/messages/*`.

## Project and editor lifecycle

Project creation is a transaction that creates the project, default branch, owner membership, canvas, user-canvas view, desktop frame, conversation, and optional creation request. A branch owns a CodeSandbox sandbox ID; frames point to preview URLs. The client `EditorEngine` composes specialized MobX managers for branches, sandbox sessions, frames, code, AST/layers, styles, text, images, pages, history, Git, chat, themes, fonts, and overlays.

The editor is therefore already the canonical project source/application controller. Jagwar workflow data should associate with project IDs and use public provider/editor seams; it must not introduce a second project document or editor controller.

## AI composition

`/api/chat` authenticates, checks the existing usage authority, optionally increments edit-message usage, then calls `createRootAgentStream`. The root agent selects model, system prompt, and read-only or edit toolset by `ChatType`. `convertToStreamMessages` hydrates user messages from typed metadata contexts before the AI SDK stream runs. Final messages are persisted through the chat tRPC router.

Supported context kinds are file, highlight, image, error, branch, and agent rule. Context formatting is centralized in `@onlook/ai`; tool availability is centralized in the root toolset. These files are protected core.

### Jagwar business-context seam finding

The live-chat `MessageContextType` registry has no public registrar, but it is not necessary for the initial creation flow. Project creation uses a distinct public contract:

1. `CreateRequestContextType.PROMPT` accepts prompt content.
2. `project.create` persists it in `project_create_requests.context`.
3. `useStartProject` retrieves the pending request after the editor, canvas, conversation, and sandbox are ready.
4. It concatenates prompt contexts and sends the result through the existing `ChatType.CREATE` path.

This is an additive AI composition seam. A new Jagwar-owned `JagwarBusinessContextV1` schema can validate facts, unknowns, provenance, rights-cleared asset references, and design/voice guidance, then a pure renderer can serialize it into one bounded `PROMPT` context. The structured artifact should remain stored separately from generated guidance so the rendered prompt is not mistaken for canonical business data.

No change to established AI prompts, agents, tools, registries, streams, modes, or apply behavior is required for this path. Core changes may still be required to make project creation server-authoritative, persist/link the structured artifact, or register a new owning procedure, but those are project/workflow integration requests rather than AI-core requests. The context must remain advisory input with no save, apply, publish, auth, billing, or send authority.

## Server operations and jobs

Three long-running patterns were found:

- Chat uses an HTTP response stream and persists final messages on completion.
- Project creation optionally stores a `project_create_requests` record whose status is client-updatable after a membership check.
- Publishing stores `deployments` and updates progress, but the build, serialization, and Freestyle deploy run inside `deployment.run`.

This is operation-state persistence, not a durable queue. There are no worker, queue, lease, retry-policy, heartbeat, or job-attempt abstractions in the scanned source. The existing `PublishManager` is a domain manager and useful precedent, but should not be generalized into an ad hoc job system.

## Testing strategy

The web application has focused Bun/Vitest tests for authorization helpers, caches, frames, Git, pages, and sandbox helpers, plus Storybook/Chromatic configuration. High-risk additions should use router/helper unit tests, deterministic provider fakes, and feature-colocated component tests. OD-15 frozen-install and web-typecheck verification now pass; the existing backend test command still references an absent `supabase/functions/api` path and is tracked separately.

## Protected-core implications

Every file referenced above that existed at baseline `423e2e9` is protected. New route-local modules and focused package files may be added, but registering routers, exports, schemas, migrations, contexts, or root providers generally requires a per-file Core Change Request before editing the baseline file.
