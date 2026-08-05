# Jagwar Foundation - Deployment Guide

## Existing deployment surfaces

There are two distinct deployment concepts:

1. **Onlook/Jagwar application deployment:** root Dockerfile builds the Next.js standalone client; Docker Compose runs it on port 3000 using `apps/web/client/.env` and the external Supabase network.
2. **User project publication:** the tRPC publish flow builds a project from CodeSandbox and deploys serialized output to Freestyle at preview or custom-domain URLs.

These surfaces must remain separate in planning and telemetry.

## Application container

The protected Dockerfile uses `oven/bun:1`, installs with the frozen lockfile, builds `apps/web/client` in standalone mode, exposes port 3000, and defines an HTTP health check. The compose file supplies the app environment and host networking. Production deployment is out of scope for the readiness pass.

## CI/CD

| Workflow | Trigger | Behavior |
| --- | --- | --- |
| CI | pull requests and main pushes | frozen Bun install, root typecheck, Bun tests with coverage; lint job currently commented out |
| Chromatic | push | frozen install and Storybook/Chromatic run |
| Supabase staging push | manual | install and `bun run db:push` against staging database URL |

OD-15 CCR-019 through CCR-022 removed the unavailable private admin dependency from Jagwar. Pinned-Bun frozen installation now succeeds; CI must retain that regression check.

## User publication

Publication uses existing CodeSandbox and Freestyle integrations. A deployment record tracks requestor, project, sandbox, type, state, progress, logs/errors, build settings, environment variables, URLs, and timestamps. Custom-domain verification and project-domain binding are separate persisted authorities.

Jagwar compliant send must reference the exact successfully published artifact/identity chosen by the publication decision. It must not send a mutable preview URL without revalidation.

## Safety gates

- No production deployment, custom-domain cutover, customer-data migration, real send, or billing mutation without an explicit runbook.
- Do not put secrets or raw provider payloads into UI/domain state.
- Preserve CodeSandbox and Freestyle until the later infrastructure epic.
- Use reversible migrations and test against non-production fixtures.
- Record cost telemetry independently from customer entitlements.
