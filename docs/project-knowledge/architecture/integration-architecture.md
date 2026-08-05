# Jagwar Foundation - Integration Architecture

## High-level flow

```text
Browser / Next.js UI
  |-- Supabase Auth cookies ----------------------> Supabase Auth
  |-- tRPC / route handlers ----------------------> Next.js server
  |                                                   |-- Drizzle --> Supabase PostgreSQL
  |                                                   |-- Storage --> Supabase Storage
  |                                                   |-- Stripe --> billing provider/webhook
  |                                                   |-- CodeSandbox --> source sandbox
  |                                                   |-- Freestyle --> deployed publication
  |                                                   |-- OpenRouter/AI SDK --> AI stream/tools
  |                                                   `-- GitHub/Resend/Firecrawl/etc.
  |<-- Supabase realtime project topics ----------- conversation/message broadcasts
  `-- iframe + injected preload <-----------------> edited application DOM
```

## Integration points

| From | To | Type | Contract |
| --- | --- | --- | --- |
| Browser | Next.js/tRPC | HTTPS + SuperJSON | typed queries/mutations and route handlers |
| Next.js | Supabase Auth | SSR client/cookies | current authenticated user |
| Next.js | PostgreSQL | Drizzle/Postgres | server-authoritative domain reads/writes |
| Browser/server | Supabase Storage | Supabase SDK | preview/file assets |
| Browser | Supabase Realtime | project topic broadcast | collaborative chat updates |
| Editor | CodeSandbox | provider adapter | files, commands, sessions, branches, previews |
| Preload | Editor | Penpal/RPC | DOM inspection and manipulation inside iframe |
| Chat route | AI providers | AI SDK | model stream, tool calls, telemetry |
| Publish router | CodeSandbox + Freestyle | provider/hosting adapters | build fork, serialize, deploy URLs |
| Stripe | Webhook route | signed HTTPS event | subscription and allowance reconciliation |
| Server | Resend | API | invitation email |
| Server | GitHub | Octokit | repositories and app installation |

## Core lifecycle sequences

### Personalized project creation

1. A server-authoritative Jagwar workflow validates business facts and produces `JagwarBusinessContextV1` plus a deterministic rendered prompt.
2. The existing project-create transaction establishes the native project, branch, sandbox, canvas, frame, membership, conversation, and creation request.
3. The rendered business context uses `CreateRequestContextType.PROMPT`; structured facts/provenance remain separately linked.
4. When editor prerequisites are ready, `useStartProject` sends the prompt using the existing `ChatType.CREATE` flow.
5. The resulting source remains editable through the normal Onlook editor and AI lifecycle.

### Publication

1. An authorized member creates a pending deployment for a project/type/sandbox.
2. `deployment.run` forks a build sandbox and records progress.
3. `PublishManager` prepares/builds/serializes the project.
4. Freestyle deploys the files to preview or custom-domain URLs.
5. The deployment record transitions to completed or failed.

### Billing/usage

1. Stripe checkout/provider changes occur through the subscription router.
2. Signed webhooks reconcile the subscription and rate-limit tables.
3. Chat usage checks the single usage authority and records idempotent usage by trace ID.
4. Jagwar internal cost events remain observational and never answer entitlement questions.

## Extension boundaries

- Preserve Supabase authentication and project membership as the caller/scope authority.
- Preserve project IDs and branches as source/editor authority.
- Preserve deployment/domain records and Freestyle path as publication authority.
- Preserve Stripe/subscription/rate-limit/usage records as billing and allowance authority.
- Use the project-creation prompt seam for business context; do not register new AI tools or change core prompts by default.
- Select an approved durable-operation substrate before implementing discovery/outreach work that needs retries, leases, or recovery.
