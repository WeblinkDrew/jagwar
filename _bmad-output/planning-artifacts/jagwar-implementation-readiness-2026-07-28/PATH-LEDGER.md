---
title: Jagwar Epic 1 and First Discovery Slice Path Ledger
status: exact-first-slice-ledger-ready-for-protected-file-approval
created: 2026-07-28
updated: 2026-07-28
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# Epic 1 and First Discovery Slice Path Ledger

Every `NEW` path is absent from the pinned baseline. Every `PROTECTED` path exists in it and requires its exact Core Change Request plus Andrew's confirmation before editing. `MAINTAINER-NEW` files are generated or finalized by the maintainer; agents must not run `db:gen`. The immediate approval batch is limited to persistence/API/package registration. Worker environment, navigation, localization, and native project changes remain separate later batches.

## Focused capability packages — NEW

| Path | Owner/purpose |
| --- | --- |
| `packages/leads/package.json` | `@onlook/leads` public package manifest. |
| `packages/leads/tsconfig.json` | Package TypeScript configuration following `@onlook/ai`, including `src` and `test`. |
| `packages/leads/eslint.config.js` | Existing `@onlook/eslint/base` package lint configuration. |
| `packages/leads/src/index.ts` | Public entry point only. |
| `packages/leads/src/candidate.ts` | `CandidateV1`, verified/unknown facts, provenance, mapper-facing contract. |
| `packages/leads/src/discovery.ts` | Discovery query/run/snapshot/provider-port contracts. |
| `packages/leads/src/identity.ts` | Pure normalized Candidate/Lead dedupe identity contract. |
| `packages/leads/src/qualification.ts` | Qualification evidence/status/ranking contracts and pure rules. |
| `packages/leads/src/phone.ts` | Independent phone-enrichment status and normalized evidence contract. |
| `packages/leads/test/candidate.test.ts` | Strict schema, mapper, provenance, dedupe tests. |
| `packages/leads/test/discovery.test.ts` | Run state and provider-contract tests. |
| `packages/leads/test/identity.test.ts` | Stable identity, fallback, normalization, and collision tests. |
| `packages/leads/test/qualification.test.ts` | Evidence/unknown/ranking tests. |
| `packages/leads/test/phone.test.ts` | Independent skipped/unknown/failed/succeeded phone-state tests. |
| `packages/business-policy/package.json` | `@onlook/business-policy` manifest. |
| `packages/business-policy/tsconfig.json` | Package TypeScript configuration including `src` and `test`. |
| `packages/business-policy/eslint.config.js` | Existing `@onlook/eslint/base` package lint configuration. |
| `packages/business-policy/src/index.ts` | Public entry point. |
| `packages/business-policy/src/release.ts` | Closed policy kinds, release envelope, canonical validation/hash. |
| `packages/business-policy/src/fixtures.ts` | Deterministic non-production qualification fixture releases only. |
| `packages/business-policy/test/release.test.ts` | Immutability, invalid payload, safe-diff/hash tests. |
| `packages/business-policy/test/fixtures.test.ts` | Stable fixture identity and production-mutation exclusion tests. |
| `packages/durable-operation/package.json` | `@onlook/durable-operation` manifest. |
| `packages/durable-operation/tsconfig.json` | Package TypeScript configuration including `src` and `test`. |
| `packages/durable-operation/eslint.config.js` | Existing `@onlook/eslint/base` package lint configuration. |
| `packages/durable-operation/src/index.ts` | Public entry point. |
| `packages/durable-operation/src/operation.ts` | Closed operation/idempotency transition rules. |
| `packages/durable-operation/src/attempt.ts` | Lease/fence/cancel/reconcile transition rules. |
| `packages/durable-operation/src/cost.ts` | Non-enforcing estimate/actual observation contract and identity. |
| `packages/durable-operation/test/operation.test.ts` | Admission/terminal/retry/cancel tests. |
| `packages/durable-operation/test/attempt.test.ts` | Fence/redelivery/unknown-outcome tests. |
| `packages/durable-operation/test/cost.test.ts` | Replay/no-provider/retry/estimate-versus-actual accounting tests. |

Later files/packages `packages/leads/src/project-context.ts`, `packages/leads/test/project-context.test.ts`, `packages/outreach`, `packages/activation`, and `packages/business-migration` are architecture allocations, not proposed first-discovery-slice files.

## Persistence — NEW / MAINTAINER-NEW

| Path | Class | Owner/purpose |
| --- | --- | --- |
| `packages/db/src/schema/leads/index.ts` | NEW | Public schema-group entry. |
| `packages/db/src/schema/leads/candidate.ts` | NEW | Candidate snapshots and normalized fact revisions. |
| `packages/db/src/schema/leads/discovery.ts` | NEW | Discovery query/run/snapshot persistence. |
| `packages/db/src/schema/leads/fact.ts` | NEW | Append-only Lead fact revisions and minimized provenance. |
| `packages/db/src/schema/leads/qualification.ts` | NEW | Evidence and policy-version result persistence. |
| `packages/db/src/schema/leads/lead.ts` | NEW | Minimum owner-scoped Lead identity/upsert for 3.1a/2.6b. |
| `packages/db/src/schema/business-policy/index.ts` | NEW | Policy schema-group entry. |
| `packages/db/src/schema/business-policy/release.ts` | NEW | Immutable policy releases. |
| `packages/db/src/schema/durable-operation/index.ts` | NEW | Operation schema-group entry. |
| `packages/db/src/schema/durable-operation/operation.ts` | NEW | Durable operation, input hash, status, cancellation, and reconciliation identity. |
| `packages/db/src/schema/durable-operation/attempt.ts` | NEW | Attempt, lease, fence, retry, and provider-outcome records. |
| `packages/db/src/schema/durable-operation/nonce.ts` | NEW | Signed internal-consumer replay protection. |
| `packages/db/src/schema/durable-operation/cost-observation.ts` | NEW | Physically separate non-enforcing costs. |
| `apps/backend/supabase/migrations/0020_<generated-slug>.sql` | MAINTAINER-NEW | Maintainer-generated additive tables, constraints, and indexes; record the emitted exact filename before review. |
| `apps/backend/supabase/migrations/meta/0020_snapshot.json` | MAINTAINER-NEW | Maintainer-generated Drizzle snapshot; never hand-edit. |
| `apps/backend/supabase/migrations/0021_jagwar_durable_operation_infrastructure.sql` | NEW | Hand-reviewed PGMQ/Cron/Vault/least-privilege grants after preflight. |
| `packages/db/test/jagwar-ownership.test.ts` | NEW | Same-owner relationship and mapper tests. |
| `apps/backend/supabase/tests/database/jagwar-commercial-foundation.test.sql` | NEW | pgTAP structure, same-owner constraints, and RLS verification run by `supabase test db`. |
| `apps/backend/supabase/tests/database/jagwar-durable-operation.test.sql` | NEW | pgTAP queue-role, transactional enqueue, lease/fence, and cost-isolation verification after preflight. |

## Web server/API — NEW

| Path | Owner/purpose |
| --- | --- |
| `apps/web/client/src/server/api/routers/business/index.ts` | One thin business router aggregate. |
| `apps/web/client/src/server/api/routers/business/leads.ts` | Authenticated discovery/read/replay/Lead-upsert procedures. |
| `apps/web/client/src/server/services/leads/candidate-mapper.ts` | Provider DTO to canonical Candidate mapper. |
| `apps/web/client/src/server/services/leads/discovery-provider.ts` | Server-only provider port. |
| `apps/web/client/src/server/services/leads/fake-discovery-provider.ts` | Deterministic non-production provider. |
| `apps/web/client/src/server/services/leads/discovery.ts` | Admission/replay/application orchestration. |
| `apps/web/client/src/server/services/leads/lead-upsert.ts` | Owner-scoped idempotent Candidate/manual Lead identity operation. |
| `apps/web/client/src/server/services/business-policy/releases.ts` | Validator selection and fixture-release lookup. |
| `apps/web/client/src/server/services/durable-operation/admit.ts` | Transactional operation admission/enqueue. |
| `apps/web/client/src/server/services/durable-operation/claim.ts` | Restricted claim/lease/fence behavior. |
| `apps/web/client/src/server/services/durable-operation/worker.ts` | Bounded allowlisted dispatch loop. |
| `apps/web/client/src/server/services/durable-operation/cost-observation.ts` | Single observational cost write API. |
| `apps/web/client/src/server/services/durable-operation/handlers/discovery.ts` | Discovery operation handler. |
| `apps/web/client/src/app/api/internal/operations/route.ts` | Signed authenticated bounded Cron target. |
| `apps/web/client/src/app/api/internal/operations/_lib/authenticate.ts` | Timestamp, signature, key-rotation, nonce, and allowlist verification. |
| `apps/web/client/src/server/services/leads/discovery.test.ts` | Durable fake lifecycle/replay tests. |
| `apps/web/client/src/server/services/leads/lead-upsert.test.ts` | Deduplication, concurrency, cross-user tests. |
| `apps/web/client/src/server/services/durable-operation/worker.test.ts` | Lease/retry/cancel/recovery/replay tests. |
| `apps/web/client/src/app/api/internal/operations/_lib/authenticate.test.ts` | Signature, rotation, nonce, stale-time, and allowlist tests. |
| `apps/web/client/src/app/api/internal/operations/route.test.ts` | Authentication failure, bounded-batch, timeout, and truthful response tests. |

## Route-local UI — NEW

| Path | Owner/purpose |
| --- | --- |
| `apps/web/client/src/app/(commercial)/layout.tsx` | Server auth/subscription boundary composed from existing public helpers. |
| `apps/web/client/src/app/(commercial)/leads/page.tsx` | Server entry for Find Leads. |
| `apps/web/client/src/app/(commercial)/leads/_components/find-leads.tsx` | Small client interaction boundary. |
| `apps/web/client/src/app/(commercial)/leads/_components/discovery-run-state.tsx` | Truthful queued/running/zero/failure/canceled/replay states. |
| `apps/web/client/src/app/(commercial)/leads/_components/candidate-table.tsx` | Accessible list-first selection/results. |
| `apps/web/client/src/app/(commercial)/leads/_hooks/use-discovery-run.ts` | tRPC polling/mutation presentation hook only. |
| `apps/web/client/src/app/(commercial)/leads/_components/find-leads.stories.tsx` | Existing Storybook/Vitest-browser interaction and accessibility coverage. |
| `apps/web/client/src/app/(commercial)/leads/_components/candidate-table.stories.tsx` | Existing Storybook/Vitest-browser keyboard selection and equivalent-result coverage. |

## Protected original files — PROTECTED

| Path | Request | Earliest consumer |
| --- | --- | --- |
| `packages/db/src/schema/index.ts` | CCR-001 | Story 1.1 schema registration. |
| `apps/backend/supabase/migrations/meta/_journal.json` | CCR-003 | Maintainer migration generation. |
| `apps/web/client/src/server/api/routers/index.ts` | CCR-004 | Business router export. |
| `apps/web/client/src/server/api/root.ts` | CCR-005 | Business router registration. |
| `apps/web/client/package.json` | CCR-006 | Workspace capability dependencies. |
| `bun.lock` | CCR-007 | Pinned-Bun-generated workspace entries after package manifests are approved, starting from the verified OD-15-resolved lock. |
| `apps/web/client/src/env.ts` | CCR-008 | Server-only internal-consumer signing secret. |
| `apps/web/client/.env.example` | CCR-009 | Secret-name documentation without value. |
| `apps/web/client/src/utils/constants/index.ts` | CCR-010 | Commercial route constants. |
| `apps/web/client/src/app/projects/_components/top-bar.tsx` | CCR-011 | Minimal native navigation entry after real route. |
| `apps/web/client/messages/en.json` | CCR-012 | English messages. |
| `apps/web/client/messages/es.json` | CCR-013 | Spanish messages. |
| `apps/web/client/messages/ja.json` | CCR-014 | Japanese messages. |
| `apps/web/client/messages/ko.json` | CCR-015 | Korean messages. |
| `apps/web/client/messages/zh.json` | CCR-016 | Chinese messages. |
| `apps/web/client/messages/en.d.json.ts` | CCR-017 | Maintainer-controlled type regeneration. |
| `apps/web/client/src/server/api/routers/project/project.ts` | CCR-018 | Later Story 4.1 canonical project transaction extraction/owner derivation. |

## Explicitly not proposed

- No edit to `package.json`, `packages/db/package.json`, Supabase `config.toml`, root/app layouts, `@onlook/ui` tokens/icons/globals/primitives, existing tests, AI files, editor files, `packages/models/src/project/create.ts`, `use-start-project.tsx`, publishing/domain files, Stripe/billing files, Docker/CI, or generated build output.
- No new dependency, asset, icon set, stylesheet, legacy route/layout, or donor folder.
- No `JagwarBusinessContextV1` implementation in the discovery slice; its mapped public PROMPT seam remains a later Story 4.1/4.2 gate.
- The unavailable private upstream `apps/admin` is intentionally absent under approved CCR-019–022. A target-native Jagwar operator surface may be proposed separately only after OD-13 maps its role, authorization, service/UI seams, protected paths, and regression boundary against the accessible application.
