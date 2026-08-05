# Jagwar Foundation - API Contracts

## Transport boundaries

The active application exposes typed tRPC over `/api/trpc/[trpc]`, a streaming chat route at `/api/chat`, an email-capture route, auth callback routes, and a Stripe webhook. tRPC serialization uses SuperJSON and procedure inputs use Zod or Drizzle-Zod schemas.

## Authentication classes

| Class | Contract |
| --- | --- |
| `publicProcedure` | No authenticated-user guarantee; callers must not receive protected data |
| `protectedProcedure` | Valid Supabase user with email; resource authorization remains procedure-specific |
| `adminProcedure` | Authenticated user plus Supabase service-role client; bypasses RLS and demands explicit authorization |
| `/api/chat` | Resolves Supabase user directly from request cookies, then enforces usage limits |
| `/webhook/stripe` | Validates `stripe-signature` with the configured endpoint secret |

## Router families

| Router | Representative procedures | Authority |
| --- | --- | --- |
| `user` | get, getById, upsert, delete; settings/canvas subrouters | Session user and profile data |
| `project` | hasAccess, list, get, create, fork, update, delete, screenshot, tags | Project lifecycle and association |
| `branch` | list/create/update/delete/fork/createBlank | Branch/sandbox lifecycle |
| `frame` | get/list/create/update/delete | Canvas preview frames |
| `sandbox` | create/start/hibernate/list/fork/delete/import | Code provider operations scoped to owning projects where known |
| `invitation` / `member` | create/list/accept/delete/suggest/remove | Project collaboration |
| `chat` | conversation/message CRUD, suggestion generation | Project-linked conversation history |
| `domain` | preview/custom/verification operations | Published addresses and ownership verification |
| `publish` | deployment create/get/update/run/cancel, unpublish | Deployment execution and status |
| `subscription` | get, checkout, portal, change/release schedule | Stripe-backed subscription state |
| `usage` | get, increment, revertIncrement | Allowance and message-usage authority |
| `github`, `code`, `image`, `utils` | repository, AI/apply, scrape/search, compression helpers | External/provider integrations |

## Critical contracts

### Project access

`verifyProjectAccess(db, userId, projectId)` resolves the project with a filtered `userProjects` relation and throws the same error for absent and unauthorized projects. Child verifiers resolve conversation, message, branch, canvas, frame, invitation, sandbox, deployment, or domain-verification ownership back to this check.

### Project creation

`project.create` accepts project data, a user ID, sandbox ID/URL, and optional creation context. It transactionally creates all default project/editor records. New callers must not trust a client-supplied user ID; the authenticated session must be the authority. Any change to the baseline input/implementation requires a Core Change Request.

### Chat

`POST /api/chat` expects messages, `ChatType`, conversation ID, and project ID. It checks message allowance, increments edit usage by trace ID, streams the root agent response, and replaces conversation messages on finish. For initial personalized-draft creation, the existing `CreateRequestContextType.PROMPT` pipeline supplies a public composition seam: validate `JagwarBusinessContextV1`, render it to a bounded prompt, persist that prompt in the creation request, and let `useStartProject` send it as `ChatType.CREATE`. This does not require a new live-chat context type and must not grant tool or apply authority.

### Deployment

The client first creates a pending deployment, then calls `deployment.run`. The run verifies access, transitions progress, forks a build sandbox, builds/serializes the project, deploys through Freestyle, destroys the provider, and marks completion/failure. The call is synchronous from the API perspective. `cancel` updates status but no interruptible worker was found.

### Subscription and usage

Subscription mutations scope stored Stripe identifiers to the session user before provider mutation. Usage increments occur transactionally; paid usage decrements the oldest carried-over allowance row, while free usage is counted over rolling windows. Reverts are owner-scoped.

## Contract-extension rules for Jagwar

- Put route-specific procedures under the owning router/feature, validated with Zod.
- Derive identity, collaboration scope, entitlement, consent, and send decisions server-side.
- Return domain objects, not provider secrets or raw payloads.
- Reference existing project, deployment/publication, subscription, and usage IDs.
- Keep provider calls behind adapters/managers and model explicit operation states.
- Add router registration only after approval for the protected root-router file.
- Preserve every existing route and behavior; additive Jagwar routes must not shadow native capabilities.

## Known risks to resolve before workflow implementation

- The native role model and application-level role enforcement are not fully aligned.
- No general durable-operation contract exists for discovery, qualification, or outreach.
- The exact-publication identity required by compliant send is not represented as a standalone immutable entity.
- The live-chat context registry has no public registration contract; use the separate project-creation `PROMPT` context seam for the initial business-context flow.
- OD-15 dependency installation is resolved for the declared Jagwar workspace; remaining executable contract gaps are feature- and environment-specific rather than admin-submodule dependent.
