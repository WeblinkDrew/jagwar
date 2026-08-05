# Umbrella Architecture Design: Reconfirm Jagwar Product Contract

## Status and authority

This is a planning-roadmap artifact for `reconfirm-jagwar-product-contract`. It refines the proposal and twelve capability specifications; it authorizes no runtime implementation, provider activation, protected edit, migration, generated or lockfile change, commit, Story 1.3b work, or execution of a future `tasks.md`. Each capability requires a separate native SDD and implementation authorization.

The proposal and specs are product authority. Current code is implementation authority. Historical BMAD/Telio material is not product authority.

## Architecture decision

Use **runtime-first, capability-owned additive modules**:

```text
browser route/UI
  -> validated tRPC boundary
    -> Next-server capability orchestrator
      -> capability-owned persistence + injected provider adapter
        -> external provider
```

Stable pure contracts may use an approved focused package; packages never import application-private code. Route entries and tRPC routers remain thin. Cross-capability work is coordinated through explicit service contracts, not sibling internals or shared dumping directories.

Current seams grounding this design:

- `apps/web/client/src/server/api/root.ts` is the tRPC composition root.
- `apps/web/client/src/server/api/routers/**` currently owns transport, while future orchestration belongs in `src/server/services/<capability>/`.
- `packages/db/src/schema/**` is the persistence schema boundary; current models are user/project-centric and do not yet provide authoritative workspaces or leads.
- `apps/web/client/src/app/projects/page.tsx` preserves the Projects surface; `components/ui/settings-modal/non-project.tsx` is the inherited settings seam.
- `components/store/create/manager.ts`, `packages/ai/src/prompt/provider.ts`, and project/sandbox routers form the inherited creation/CREATE path.
- `packages/code-provider` is the inherited provider abstraction; current server sandbox paths still use inherited CodeSandbox authority.
- Existing subscription, Stripe, publish/deployment/domain, export, and Git paths are inherited extension seams.
- There is no current `packages/coding-agent`; this umbrella does not invent one or move inherited `packages/ai`. A downstream website-creation SDD must prove any focused package boundary and otherwise keep controlled composition server-local.
- `packages/business-policy` is an existing Jagwar-owned pure policy-release contract seam. Reuse or extension requires its own capability SDD and must not become Story 1.3b implementation.

## Invariants

1. Every durable product record is owned by exactly one workspace and one named capability.
2. Authentication is not authorization: every protected operation re-resolves membership, role, resource ownership, entitlement, and current policy on the server.
3. Client visibility, route state, submitted roles, balance displays, previews, and provider status are never authority.
4. Provider-funded operations fail before invocation when entitlement, policy, balance reservation, credential, or compliance authority is unavailable.
5. Raw provider secrets never cross into browser bundles, responses, logs, notifications, analytics, prompt content, or ordinary audit records.
6. Distinct lead, AI, and SMS balances never merge or become negative; monthly units are consumed before non-expiring top-up units.
7. Immutable evidence remains immutable: usage ledger entries, completed displayed search snapshots, provider events, pipeline transition history, activation, and lifecycle milestones are appended or superseded, not rewritten away.
8. Provider retries and concurrent requests share stable operation identities and cannot duplicate costs, sends, leads, projects, notifications, or analytics.
9. Projects, editor, fixed template, CREATE, publishing, settings, Stripe, UI, authenticated project/editor routes, export, and Git remain inherited. Jagwar composes gates and inputs around their public seams; it does not refactor or replace them.
10. New UI is dashboard-only where specified and maintains English, Spanish, Japanese, Korean, and Chinese key parity.
11. Deferred commercial/provider/content values are explicit configuration prerequisites. Missing or unapproved values make the dependent operation unavailable; no fallback value is inferred.

## Capability ownership and module boundaries

Future paths are placement boundaries, not authorized path manifests.

| Capability spec | Owning runtime/product capability | Owned boundary and exclusions |
| --- | --- | --- |
| Product contract governance | OpenSpec planning; optional pure policy contracts through already-approved public package seams | Product invariants, launch-blocker vocabulary, non-goals, locale/governance gates. Owns no runtime workflow and does not execute Story 1.3b. |
| Workspace authority | Next server `workspace-authority`; DB `workspace-authority`; thin workspace/member transport | Workspace identity, Owner/Member membership, optimistic authority versions, authority-change audit, authoritative actor context. Does not own project roles, billing, or provider credentials. |
| Commercial entitlements and usage | Next server `commercial-entitlements`; DB `commercial-entitlements`; inherited Stripe adapter seam | Subscription state, three balance accounts, append-only ledger, monthly resets, atomic bundled top-ups, per-site add-on entitlement, billing/provider event identity. Extends Stripe; does not replace checkout/settings UI. |
| Dashboard experience | Browser routes/components under dashboard-owned surfaces plus thin server reads | Safe landing, dashboard-only sidebar, Leads tabs, additive settings entries, locale parity. Does not wrap editor/project routes or enforce authority. |
| Lead pipeline | Next server `lead-pipeline`; DB `lead-pipeline`; thin lead transport | Workspace lead identity, fixed stage/outcome, versioned transitions, optional amount/currency, lead-project relationship contract. Does not process sales or own search snapshots/messages. |
| Discovery/search/import | Next server `discovery`; DB `discovery`; server-only DataForSEO adapter | Bounded normalized requests, fresh-run state, immutable displayed snapshot, restricted provider evidence, display metering coordination, source-run link. Lead creation is delegated to lead-pipeline. |
| CodeSandbox BYOK | Next server `codesandbox-byok`; protected credential persistence/vault reference; CodeSandbox adapter | Owner-only credential lifecycle, encrypted secret/reference, validation version/status, just-in-time credential lease, fail-closed access decision. Does not alter fixed template or provide Jagwar fallback keys. |
| Website creation/presets | Next server `website-creation`; DB `website-creation`; narrow inherited CREATE adapter | V1 requires both workspace-uploaded Inspiration and Style `DESIGN.md` presets, alongside managed presets. Owns preset versions, validation, creation intent, controlled business/design guidance, prompt precedence, and media provenance. Delegates project creation to inherited flow, project/lead relation to lead-pipeline, AI debit to commercial, and credential admission to BYOK. |
| SMS orchestration | Next server `sms-orchestration`; DB `sms-orchestration`; server-only Telnyx adapter/webhook boundary | Sender/registration state, lookup/compliance authority, template versions, preview token, confirmation, outbound operation/provider identity, delivery/opt-out evidence. No unattended campaigns, WhatsApp, or Blue Send. |
| Lead Inbox | Next server `lead-inbox`; DB `lead-inbox`; thin Inbox transport and dashboard UI | Conversations, lead/participant linkage, inbound messages, unread cursors/state, notification evidence, actor/provider source. Replies delegate outbound admission and sending to SMS orchestration. |
| Publishing/hosting lifecycle | Next server `hosting-lifecycle`; DB `hosting-lifecycle`; scheduler/worker boundary; narrow inherited publish/domain adapters | Site add-on projection, hosting/domain lifecycle, grace deadlines, notice milestones, neutral suspension, retention/deletion orchestration. Does not replace inherited preview, publish, export, or Git behavior. |
| Owner analytics | Next server `owner-analytics`; DB projection/checkpoint ownership; dashboard presentation | Owner-only projections derived from authoritative source identities, activation milestone, derivation version/staleness, currency-separated values. Does not accept client counters or own source events. |

All server services may depend on workspace actor contracts. Provider adapters depend on server-only typed environment access through `@/env`; they must not be imported by client modules. Reusable packages expose only intentional public entry points.

## Dependency map and safe sequence

```text
G  Product-contract governance (applies to every node)
|
A  Workspace authority                         [safe first prerequisite]
|\
| +-- L  Lead identity + pipeline              [safe second-wave prerequisite]
| +-- C  Commercial entitlement + ledger       [safe second-wave prerequisite]
| +-- B  CodeSandbox BYOK                      [safe second-wave prerequisite]
| +-- D  Dashboard reads/navigation (after A+C read contracts)
|
C + L ---- S  Discovery/search/import
A + C + L + B ---- W  Website creation/presets -> inherited CREATE seam
A + C + L ---- M  SMS orchestration
A + L + M ---- I  Lead Inbox (reply path also requires C through M)
A + C + inherited project ownership ---- H  Publishing/hosting lifecycle
C + L + S + W + M + I + H ---- N  Owner analytics
```

Safe first work is **A**, followed by **L**, **C**, and **B** as independently reviewed capability SDDs. L and C may proceed in parallel after A because neither should import the other's internals. B may proceed after Owner authority. Provider-facing S/W/M, Inbox, hosting cancellation enforcement, dashboard integration, and analytics must wait for their named contracts. Hosting add-on state in C precedes H cancellation enforcement. Analytics is last because it consumes every authoritative source.

## End-to-end data flow

1. The server authenticates the user, resolves workspace membership/role, and creates an actor context without trusting request role claims.
2. A capability validates bounded input and resolves an approved immutable policy/configuration version.
3. A funded operation asks commercial entitlement to atomically admit/reserve the operation by workspace, balance kind, quantity, actor, and idempotency key.
4. The capability validates current provider credential/compliance state, then invokes a server-only adapter with a provider idempotency identity where available.
5. Owned outcome evidence and final ledger effect commit exactly once. Definite pre-acceptance failure releases a reservation; ambiguous external outcomes remain pending/reconcilable and are never reported as safely unsent or successfully completed.
6. Capability events expose stable source identities to dependent owners: lead transitions, Inbox, hosting lifecycle, and analytics consume contracts, not source-table internals.

Specific flows:

- **Discovery:** create run intent -> reserve affordable lead units -> invoke DataForSEO once -> deduplicate provider businesses within run -> atomically finalize only the capped displayed snapshot and matching debit. Reopen reads the immutable snapshot only. Restricted undisplayed evidence, if retained, is never importable or user-visible.
- **Import:** validate displayed result -> resolve workspace business identity -> create-or-return one lead under a uniqueness constraint -> retain source-run link; no second debit.
- **Website:** create immutable confirmation identity -> validate one source/preset/notes and BYOK -> reserve AI credits -> compose untrusted guidance below system/security instructions -> call inherited project/CREATE seam once -> atomically finalize lead-project relationship, creation evidence, debit, and successful automatic transition, or remain recoverably pending without false success.
- **SMS/Inbox:** issue short-lived preview identity bound to template/version, rendered content, recipients, estimate, and eligibility snapshot -> revalidate all gates on confirmation -> reserve SMS -> invoke Telnyx -> record accepted identity/debit once. Authenticated provider events deduplicate before updating delivery, opt-out, Inbox, unread, notifications, or analytics.
- **Hosting:** subscription/add-on events move each site through active -> grace -> suspended -> retention -> deletion states. Milestone uniqueness is `(site, lifecycle episode, milestone)`. Reactivation cancels pending suspension without changing public identity.

## Persistence and consistency contracts

This design deliberately does not choose columns, SQL, migration filenames, or generation output. Each capability SDD must specify schema and access patterns before an approved database slice.

- Workspace authority owns workspace/membership rows and authority audit. Every dependent table carries workspace ownership; exposed tables require RLS plus ownership policies, while server checks remain mandatory defense in depth.
- Commercial owns an append-only metering ledger and balance materialization. Unique operation identity plus row locking/serializable equivalent enforces monthly-first, non-negative debit. Top-up credit is one atomic event affecting three distinct accounts.
- Discovery owns run state and completed displayed snapshots. Completion is insert/finalize-once; completed snapshot content is not updated.
- Lead-pipeline owns canonical workspace business identity and a current version plus append-only transitions. Identity should prefer stable provider identity and use a documented normalized fallback; exact normalization belongs in its SDD.
- Website creation owns immutable intents and versioned presets; replacement changes an active version pointer with optimistic concurrency. Uploaded markdown remains data, never executable authority.
- BYOK stores encrypted ciphertext or a secrets-manager reference, key version, validation status, and audit-safe metadata only. Decryption is server-only and scoped to the operation.
- SMS and Inbox use unique provider event/message identities. Outbound, inbound, status, unread, and notification effects are independently idempotent.
- Hosting lifecycle owns deadlines, episodes, notices, holds, and deletion job outcomes. Each source capability exposes an idempotent deletion contract; hosting lifecycle does not directly assume ownership of all tables. Legal billing/audit retention is separated from recoverable product data.
- Analytics uses idempotent projections/checkpoints keyed by source event identity and derivation version. Current balances are read from commercial authority; unavailable sources are marked stale/unavailable. Won values remain grouped by currency absent approved conversion policy.

For cross-database/external-provider work, use reservation plus durable operation/outbox/inbox state rather than claiming a distributed transaction. Webhooks must be signature-authenticated before persistence; replay identity is mandatory. Database designs must include indexes for ownership, idempotency, lifecycle deadlines, and provider correlation based on demonstrated queries. No migration is designed here, and `db:gen` remains maintainer-only.

## Trust and secret boundaries

- **Browser:** publishable Supabase variables only; may submit bounded intent and display sanitized readiness/status. No `process.env`, raw provider payload, balance mutation, role claim, or credential.
- **Next server/tRPC:** Zod validation, fresh session, workspace authorization, policy/entitlement checks, orchestration, and sanitized errors. `protectedProcedure` authentication alone is insufficient.
- **Database/Supabase:** authoritative ownership and concurrency. RLS is required for exposed schemas; policies must include workspace ownership, not merely `TO authenticated`. Service-role/admin access stays server-only and narrowly scoped.
- **Provider adapters/workers:** DataForSEO, Jagwar Telnyx, Stripe, hosting/domain, email, and AI credentials come only from typed server environment. Workspace CodeSandbox secrets come from protected storage. Provider webhooks enter through authenticated public boundaries and enqueue/deduplicate durable events before effects.
- **Prompt boundary:** system/security instructions and approved policy are trusted; business data, notes, `DESIGN.md`, listing media, and reference code are labeled bounded untrusted context. Inspiration and Style are mutually exclusive; secrets are never prompt inputs.

Server-only secrets include Supabase service role/database URL, Stripe secret/webhook secret, DataForSEO credentials, Telnyx API/signing credentials, hosting/domain/email keys, AI provider keys, encryption keys, and every workspace CodeSandbox raw key. Only intentionally publishable `NEXT_PUBLIC_*` values may reach clients.

## Configurable launch blockers

A versioned approved policy/configuration release must supply, as applicable: plan prices and monthly lead/AI/SMS quantities; top-up price and all three quantities; AI cost conversion; per-site hosting price; DataForSEO result-count/radius choices; managed preset content; default SMS templates; Telnyx registration details/provider limits; and operational provider/account/domain/legal readiness. Missing, invalid, ambiguous, or unapproved configuration returns a typed unavailable state before provider invocation. Feature flags may hide entry points but cannot substitute authority or defaults.

## Additive composition and protected baseline

Prefer new capability-owned route, service, schema, test, and adapter files. Existing Projects, editor, CREATE, sandbox, settings modal, subscription/Stripe, publishing/domain, locale catalogs, router composition roots, project relations, UI, export, and Git files are protected inherited seams. They may receive only the smallest separately specified composition hook after exact approval; no dashboard wrapper around editor, second generator, alternate publisher, or baseline cleanup is permitted.

A future capability SDD must inventory callers before selecting a protected seam and first consider an additive adjacent module. No existing CCR authorizes these future changes.

## Downstream SDD and slice gates

Each node above becomes its own change with specification, design, tasks, and explicit dependency evidence. Implementation then decomposes into cohesive **250–400 changed-line** slices, normally in this order: failing contract/unit test; pure rule or persistence contract; server orchestration; adapter/transport; UI/locales; integration hardening. A slice must remain buildable, capability-local, and independently reviewable; do not split a transaction invariant across unsafe intermediate states or combine unrelated capabilities to hit a line target.

Before any slice edit:

1. Create exactly one reviewed `architecture/slices/<slice>.json` declaring version, unique slice, capability, owning runtime, and every governed changed path with role and correct `new`, Jagwar-owned, or `protected-original` classification.
2. For every `protected-original` path, obtain a new per-file Core Change Request that names that exact path and exact resulting SHA-256; put its request ID in the path declaration and ensure it is approved in `architecture/core-change-approvals.json` before editing. Wildcards, intent-only approval, or reuse of an earlier resulting hash for new content do not qualify.
3. Keep the actual diff equal to the accumulated manifest path plan. Undeclared governed paths, private workspace deep imports, undeclared/cyclic workspace edges, generated output, `bun.lock`, and unapproved protected hashes block the slice.
4. Follow strict red-green-refactor. Any database change follows the repository's declarative/approved workflow, RLS review, transaction/idempotency tests, and maintainer-only generation rule.
5. Run focused tests plus `git diff --check`, architecture changed check, structure gate, typecheck/lint, applicable Storybook locale/UI tests, and pre-push gate before handoff.

This umbrella `design.md` and eventual umbrella `tasks.md` remain roadmap documents. They are not slice manifests, CCRs, task execution approval, runtime authorization, or permission to resume Story 1.3b.

## Decisions and rejected alternatives

- **Choose workspace-first authority.** Reject retrofitting workspace rules independently in each provider capability; that would create inconsistent authorization and audit.
- **Choose capability-owned records and contracts.** Reject one generic Jagwar package/service/schema or analytics-owned source events.
- **Choose reservations and durable reconciliation around providers.** Reject holding database transactions across network calls or treating timeout as definite failure.
- **Choose immutable snapshots and append-only evidence.** Reject mutable search results, decrement-only counters without ledgers, and client-reported analytics.
- **Choose a narrow controlled-guidance adapter into inherited CREATE.** Reject a second generator, full prompt editing, or untrusted markdown as system instructions.
- **Choose BYOK fail-closed.** Reject Jagwar credential fallback and client-held raw keys.
- **Choose additive inherited seams.** Reject replacing Stripe, Projects, settings, editor, publishing, UI, export, or Git to simplify Jagwar implementation.
- **Choose owner-separated deletion orchestration.** Reject one lifecycle module directly deleting every capability's internals.
- **Choose event-derived analytics.** Reject dual-write client counters and cross-currency totals without conversion policy.

## Risk, rollout, and rollback principles

Major risks are cross-workspace access, ledger overspend, provider ambiguity, duplicate external effects, prompt injection, credential leakage, inherited regressions, premature deletion, and misleading analytics. Downstream SDDs must include concurrency/adversarial tests, provider-disabled modes, sanitized diagnostics, and observable reconciliation queues.

Roll out foundations before entry points; keep provider capabilities disabled until configuration and operational readiness gates pass. Enable by workspace/capability without changing historical records. Rollback disables new admissions and provider dispatch while preserving ledger entries, immutable snapshots, leads/transitions, creation intents, messages, grace deadlines, notices, and audit/legal evidence. Never compensate by deleting evidence or crediting/debiting silently; use explicit reversal records. Protected-path rollback follows a separately approved exact hash.

## Verification strategy for downstream SDDs

Every capability design must define:

- contract tests for role/resource isolation and typed fail-closed states;
- transactional tests for last-unit concurrency, version conflicts, uniqueness, replay, and partial failure;
- adapter tests proving no invocation before all gates and safe handling of timeout/ambiguous acceptance;
- webhook signature, replay, ordering, and reconciliation tests;
- RLS/authorization tests for cross-workspace identifiers and removed members;
- prompt/preset adversarial tests and secret-exclusion assertions;
- lifecycle clock tests for grace, milestone email uniqueness, reactivation, holds, retryable deletion, and neutral suspension;
- analytics reconciliation, stale-source, activation race, semantic count, and currency-separation tests;
- inherited regression tests for Projects/editor/CREATE/publishing/settings/Stripe/UI/export/Git and five-locale parity where touched;
- the repository architecture, structure, type, lint, test, Storybook, pre-push, and diff gates applicable to the slice.

No verification commands were run in this planning-only design phase; only the authorized design artifact was created.
