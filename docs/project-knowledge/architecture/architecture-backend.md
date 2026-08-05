# Jagwar Foundation - Backend Architecture

## Executive summary

`apps/backend` is a Supabase project used for local development and self-hosting. It owns service configuration and the committed PostgreSQL migration history. The active application server remains the Next.js/tRPC process in `apps/web/client`; this folder is not a parallel business-API service.

## Components

| Component | Location | Responsibility |
| --- | --- | --- |
| Supabase config | `apps/backend/supabase/config.toml` | Local ports, Auth redirects/providers, storage bucket, analytics |
| SQL migrations | `apps/backend/supabase/migrations` | Tables, constraints, RLS enablement/policies, triggers, buckets |
| Auth | Supabase Auth | GitHub/Google OAuth and session issuance |
| PostgreSQL | Supabase database | Durable application records used through Drizzle |
| Storage | Supabase Storage | Preview images and file-transfer assets |
| Realtime | Supabase Realtime | Project chat broadcasts from conversation/message triggers |

## Persistence flow

Drizzle schema files in `packages/db` are the application schema authority. Migration SQL in this app materializes that schema and adds backend-specific policies, functions, triggers, and storage configuration. `SUPABASE_DATABASE_URL` connects the server-side Drizzle client. Browser/server Supabase clients use the public URL and anon key for Auth, Storage, and Realtime; the service-role key is server-only.

## Authorization and RLS

`0006_rls.sql` defines `user_has_project_access` and `user_has_canvas_access` security-definer helpers. Policies cover the foundational project, canvas, frame, user, membership, settings, and invitation tables with owner/admin distinctions. Realtime migration `0007` broadcasts conversation/message changes on `topic:<project-id>`.

Application authorization remains required because most product queries run through the direct Drizzle connection. Later migrations enable RLS on additional tables but do not provide a complete uniform policy catalog in the scanned history.

## Development lifecycle

- `bun --filter @onlook/backend start` starts the local Supabase stack.
- `bun --filter @onlook/backend stop` stops it.
- `bun run db:push` applies approved local schema updates through the root script.
- `bun run db:seed` loads test data.
- `db:gen` is maintainer-only and must not be run by agents.

The approved OD-15 target resolution removes the unavailable private upstream admin dependency. Pinned Bun frozen installation now succeeds; future upstream synchronization must preserve or explicitly revisit that divergence.

## Extension rules

- Keep Jagwar domain persistence in the existing PostgreSQL/Drizzle authority.
- Add reversible migrations and explicit RLS decisions.
- Never introduce Clerk, Neon, or donor infrastructure conventions by default.
- Do not expose service-role clients, provider secrets, or raw payloads to browser code.
- Treat production migration, data cutover, and destructive reset as separate runbook-governed operations.
