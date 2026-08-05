# Jagwar Foundation - Data Models

## Persistence boundary

The canonical application schema is declared in `packages/db/src/schema` with Drizzle and materialized in Supabase PostgreSQL by SQL migrations in `apps/backend/supabase/migrations`. Mappers convert database rows to models from `@onlook/models`. Most application reads and writes use the server-side Drizzle connection; Supabase clients own authentication, storage, and realtime concerns.

## Entity catalog

| Domain | Tables | Relationships and role |
| --- | --- | --- |
| Identity | `auth.users`, `users`, `user_settings` | App user IDs reference Supabase Auth IDs; settings are one-to-one |
| Collaboration | `user_projects`, `project_invitations` | Many-to-many project membership with `ProjectRole`; email/token invitations |
| Project | `projects`, `branches`, `project_settings`, `project_create_requests` | Project metadata; source/sandbox branches; settings; creation-context status |
| Canvas | `canvas`, `frames`, `user_canvases` | Project canvas, branch-linked preview frames, per-user viewport state |
| Chat | `conversations`, `messages` | Project conversations and typed AI UI-message persistence |
| Publication | `deployments`, `preview_domains`, `custom_domains`, `project_custom_domains`, `custom_domain_verification` | Execution records, assigned preview names, verified domain ownership, project bindings |
| Billing | `products`, `prices`, `subscriptions`, `rate_limits`, `usage_records`, `legacy_subscriptions` | Stripe catalog mapping, user subscription, allowance windows, idempotent usage events, legacy redemption |
| Feedback | `feedbacks` | Product feedback records |

## Canonical relationship paths

```text
auth.users 1---1 users
users *---* projects          through user_projects(role)
projects 1---* branches       branches carry sandboxId
projects 1---1 canvas
canvas   1---* frames         frames point to branches and preview URLs
projects 1---* conversations  1---* messages
projects 1---* deployments
projects *---* custom_domains through project_custom_domains
users    1---* subscriptions  *---1 products/prices
users    1---* rate_limits
users    1---* usage_records
```

## Project authority

`projects` is the canonical project aggregate identifier. It stores metadata and preview-image references, not the project source document. Source authority is represented by `branches`, each with Git metadata and a non-null sandbox ID. Canvas/frame records describe editor presentation and preview navigation. Jagwar workflow records should reference the existing project and branch identifiers rather than create another site/project aggregate.

## Publication authority

The baseline does not have a separate immutable `Publication` table. A `deployment` records a requested publish/unpublish execution and its status, progress, build information, environment variables, and URLs. Preview/custom domain tables determine addressing. If the commercial workflow requires sending an exact immutable publication, readiness planning must define whether an additive publication snapshot/identity record is required without displacing deployment/domain authority.

## Billing and usage authority

- Stripe IDs are stored on users, products, prices, and subscriptions.
- Stripe webhooks create/update/cancel subscriptions and replenish or carry over `rate_limits`.
- `usage_records` records user, usage type, timestamp, and optional trace ID; `(user_id, trace_id)` is unique for idempotency.
- The usage router decrements paid rate-limit rows transactionally and calculates free-plan windows from usage records.
- The chat route currently checks and increments message usage.

Jagwar cost telemetry should use a clearly non-enforcing operational-cost model or telemetry sink and correlate to existing user/project/operation IDs. It must not answer entitlement questions, decrement allowances, create a second customer balance, or influence checkout before the later commercial decision.

## Authorization model

All Drizzle tables call `enableRLS()` in schema declarations, and migrations enable RLS. `0006_rls.sql` creates explicit policies for projects, canvas, user-project membership, user-canvas state, frames, users, settings, and invitations, including role-aware helper functions. Later tables are RLS-enabled, but the scanned migrations do not define equivalent policies for every later table. Because server tRPC uses a direct PostgreSQL connection, resource checks in router/helper code are a critical enforcement layer.

The practical rule is defense in depth:

1. authenticate at the route/procedure boundary;
2. derive the caller identity from the session, never a client-supplied user ID;
3. resolve child resources to the owning project;
4. verify membership and, where required, role;
5. keep service-role Supabase access server-only and exceptional;
6. add RLS/migration coverage when new data can be reached through Supabase APIs.

## Migration strategy

- Author new Drizzle schema files and corresponding reversible SQL migration changes only after protected-file approvals required for registration/export paths.
- Do not run `db:gen`; repository instructions reserve it for the maintainer.
- Use `bun run db:push` only for approved local development updates.
- Prefer additive nullable columns or new tables, backfill separately, validate, then tighten constraints.
- Include rollback and compatibility for persisted identifiers.
- Do not mutate production data or perform cutover without an approved runbook.

## Data-model readiness gaps

- There is no native workspace/organization entity; introducing one is a phase decision, not a routine schema addition.
- Membership checks are generally role-agnostic in application helpers even though role data and some RLS rules exist.
- Publication exactness and immutable send linkage require an explicit target-native model decision.
- No durable job-attempt, lease, or retry model exists.
- OD-15 frozen dependency installation is resolved; migration/test claims still require their own database environment and baseline evidence.
