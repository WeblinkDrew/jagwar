# Planning Roadmap: Reconfirm Jagwar Product Contract

## Status and authorization boundary

This is a planning/completion roadmap for the umbrella product contract. Its checkboxes record dependency planning only. They grant **no** runtime edits, provider activation, generated-artifact or `bun.lock` edits, commits, Story 1.3b work, `apply`, `verify`, `sync`, or `archive`. This change never routes to apply; every future capability requires a separately authorized native SDD.

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | Many thousands across the umbrella product; necessarily far above 400 lines |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Workspace authority → lead pipeline / commercial entitlements / CodeSandbox BYOK → provider-facing and UI dependents → Inbox/hosting dependents → analytics |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

The umbrella implementation MUST use many dependency-ordered capability changes and cohesive slices. The forecast applies to future capability SDDs only; this planning-only change has no apply route.

## Mandatory contract for every future capability SDD

Each named change below must create its own `openspec/changes/<change>/proposal.md`, capability specs, `design.md`, and `tasks.md`; inventory its concrete runtime seams before proposing edits; and identify dependencies, failure states, persistence ownership, security boundaries, launch blockers, rollout, and rollback. Each future `tasks.md` must forecast changed lines and partition implementation into cohesive **250–400 changed-line** Strict-TDD slices, ordered RED → GREEN → TRIANGULATE → REFACTOR. Every slice must have a clear start, finish, verification, and rollback boundary, remain buildable and independently reviewable, and avoid combining unrelated capabilities merely to meet a size target.

Before any future slice edit, its SDD must require one reviewed `architecture/slices/<slice>.json` manifest containing every governed changed path and correct path classification. Every protected-original path additionally requires a new per-file Core Change Request naming the exact path and exact resulting SHA-256, with its request ID approved in `architecture/core-change-approvals.json` before editing. Wildcards, intent-only approval, undeclared paths, generated output, `bun.lock`, and maintainer-only `db:gen` are prohibited. Future slice verification must select applicable checks from `bun test`, `bun run typecheck`, `bun --filter @onlook/web-client lint`, Storybook browser tests, `bun scripts/architecture/check.ts --changed`, structure/pre-push gates, and `git diff --check`.

## Dependency roadmap — future implementation-owned planning

### Wave 1 — workspace authority first

- [ ] Prepare the separate `establish-workspace-authority` SDD under `openspec/changes/establish-workspace-authority/`, using discovery targets `apps/web/client/src/server/services/workspace-authority/`, `apps/web/client/src/server/api/routers/`, and `packages/db/src/schema/workspace-authority/`; contract server-derived Owner/Member authority, workspace isolation, optimistic membership changes, sensitive-setting authority, RLS, and actor audit before any dependent workspace capability is considered ready. <!-- sdd-owner: implementation -->

### Wave 2 — independent prerequisite capabilities after workspace authority

These changes may be planned and reviewed independently after Wave 1; none may import another Wave 2 capability's internals.

- [ ] Prepare the separate `establish-lead-pipeline` SDD under `openspec/changes/establish-lead-pipeline/`, using discovery targets `apps/web/client/src/server/services/lead-pipeline/`, `apps/web/client/src/server/api/routers/`, and `packages/db/src/schema/lead-pipeline/`; contract workspace business identity, fixed stages/outcomes, versioned correction history, optional amount/currency, lead-project relationships, and idempotent automatic-transition interfaces. <!-- sdd-owner: implementation -->
- [ ] Prepare the separate `establish-commercial-entitlements-usage` SDD under `openspec/changes/establish-commercial-entitlements-usage/`, using the inherited Stripe/subscription seams plus discovery targets `apps/web/client/src/server/services/commercial-entitlements/` and `packages/db/src/schema/commercial-entitlements/`; contract subscription authority, distinct monthly/top-up ledgers, atomic bundled top-ups, reservations/reconciliation, site-specific hosting add-ons, event idempotency, and actor audit without replacing Stripe. <!-- sdd-owner: implementation -->
- [ ] Prepare the separate `establish-codesandbox-byok` SDD under `openspec/changes/establish-codesandbox-byok/`, inventorying `packages/code-provider` and inherited sandbox/project routers before selecting additive seams; contract Owner-only protected credential lifecycle, validation versions, just-in-time server leases, tailored fail-closed project access, and the prohibition on Jagwar-key fallback. <!-- sdd-owner: implementation -->

### Wave 3 — provider-facing and UI dependents

- [ ] After workspace and commercial read contracts exist, prepare `add-dashboard-experience` under `openspec/changes/add-dashboard-experience/`, inventorying `apps/web/client/src/app/projects/page.tsx`, `apps/web/client/src/components/ui/settings-modal/non-project.tsx`, dashboard route/layout seams, and all five locale catalogs; preserve Projects/settings additively, keep the sidebar off editor/project routes, and treat UI as presentation rather than authority. <!-- sdd-owner: implementation -->
- [ ] After workspace, lead-pipeline, and commercial contracts exist, prepare `add-discovery-search-import` under `openspec/changes/add-discovery-search-import/`, targeting a server-only DataForSEO adapter plus `apps/web/client/src/server/services/discovery/` and `packages/db/src/schema/discovery/`; contract bounded policy-driven input, fresh-run invocation, immutable capped displayed snapshots, reservation/finalization, restricted provider evidence, and lead-owned deduplicated import. <!-- sdd-owner: implementation -->
- [ ] After workspace, lead-pipeline, commercial, and CodeSandbox BYOK contracts exist, prepare `add-website-creation-presets` under `openspec/changes/add-website-creation-presets/`, inventorying `apps/web/client/src/components/store/create/manager.ts`, `packages/ai/src/prompt/provider.ts`, inherited project/sandbox routers, and the fixed template; contract one explicit source, Owner-managed versioned `DESIGN.md` presets, and explicitly preserve workspace-uploaded Inspiration and Style `DESIGN.md` presets as required V1 scope—not a non-goal—alongside untrusted-input precedence, media provenance, AI reservation, and a narrow idempotent adapter into inherited CREATE rather than a second generator. <!-- sdd-owner: implementation -->
- [ ] After workspace, lead-pipeline, and commercial contracts exist, prepare `add-sms-orchestration` under `openspec/changes/add-sms-orchestration/`, targeting server-only Telnyx adapter/webhook boundaries, `apps/web/client/src/server/services/sms-orchestration/`, and `packages/db/src/schema/sms-orchestration/`; contract sender/registration state, authoritative lookup/consent/opt-out gates, versioned templates, bounded preview/confirmation, reservations, ambiguous-outcome reconciliation, authenticated event replay protection, and actor audit. <!-- sdd-owner: implementation -->
- [ ] After workspace, commercial hosting-add-on state, and inherited project-ownership contracts exist, prepare `add-publishing-hosting-lifecycle` under `openspec/changes/add-publishing-hosting-lifecycle/`, inventorying inherited publish/deployment/domain/export/Git seams before selecting narrow hooks; contract stable previews, per-site hosting/domains, immediate funded-operation blocking, 14-day public grace, unique notices, neutral suspension, 90-day retention, legal holds, owner-separated deletion, and reversible reactivation. <!-- sdd-owner: implementation -->

### Wave 4 — messaging UI dependent

- [ ] After workspace, lead-pipeline, and SMS event/outbound contracts exist, prepare `add-lead-inbox` under `openspec/changes/add-lead-inbox/`, targeting `apps/web/client/src/server/services/lead-inbox/`, `packages/db/src/schema/lead-inbox/`, thin transport, and dashboard-only Inbox UI; contract lead-linked conversations, authenticated inbound handling during pending outbound approval, replies delegated to SMS authority, idempotent unread/notifications, retention, and five-locale parity. <!-- sdd-owner: implementation -->

### Wave 5 — analytics last

- [ ] Only after commercial, lead-pipeline, discovery, website creation, SMS, Inbox, and hosting source identities are stable, prepare `add-owner-analytics` under `openspec/changes/add-owner-analytics/`, targeting `apps/web/client/src/server/services/owner-analytics/`, capability-owned projections/checkpoints, thin Owner-only transport, and dashboard presentation; contract idempotent event derivation, exactly-once activation, currency-separated Won values, reconciliation/versioning, and honest stale/unavailable states without client counters. <!-- sdd-owner: implementation -->

## Deferred blockers and parent-owned governance gates

The following are launch blockers, not values future SDDs may invent. Capability code must remain unavailable or fail closed until its applicable gate is resolved.

- [ ] Approve the commercial policy release: Starter/Pro/Scale prices and monthly lead/AI/SMS quantities, bundled top-up price and all three quantities, AI-cost-to-credit conversion, and recurring per-site hosting price; record the approved version in the future commercial SDD before launch. <!-- sdd-owner: parent -->
- [ ] Approve provider and content readiness: DataForSEO result-count/radius choices and account limits, Jagwar-managed preset content, default SMS templates, Telnyx registration details/limits, and Stripe/DataForSEO/Telnyx/CodeSandbox account readiness; keep each dependent capability disabled until its evidence is recorded in its own SDD. <!-- sdd-owner: parent -->
- [ ] Approve infrastructure readiness for protected credential storage, webhook authentication, provider reconciliation workers, email delivery, hosting/domain ownership, neutral suspension, retention/deletion scheduling, monitoring, and rollback; record concrete owners and operational evidence in the affected capability SDDs. <!-- sdd-owner: parent -->
- [ ] Complete legal, compliance, privacy, and security gates for SMS consent/opt-out authority, sender registration, listing-photo provenance, secret handling, RLS/cross-workspace isolation, hosting notices, retention/deletion, legal holds, billing/audit retention, and public unavailable-page content before dependent launches. <!-- sdd-owner: parent -->
- [ ] At each dependency boundary, authorize—or decline—the next named capability SDD and its bounded review chain only after prerequisite contracts, blocker evidence, slice forecasts, manifests, and any exact hash-bound CCR approvals are reviewable; never treat this roadmap checkbox as implementation authorization. <!-- sdd-owner: parent -->
- [ ] Reconsider Story 1.3b only after its prerequisite capability contracts are separately completed and every unresolved policy and security blocker relevant to that story is separately resolved; otherwise keep Story 1.3b blocked and outside all roadmap slices. <!-- sdd-owner: parent -->
