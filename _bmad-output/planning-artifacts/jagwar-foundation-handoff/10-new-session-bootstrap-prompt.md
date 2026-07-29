---
title: New Session Bootstrap Prompt
status: ready-to-copy-product-handoff-implementation-gated
created: 2026-07-28
updated: 2026-07-28
---

# New Session Bootstrap Prompt

Copy the block below into the implementation session.

---

## Project: Jagwar on the Onlook Foundation — Business Workflow Rebuild

We are adopting Onlook as Jagwar's new application, editor, AI, project, design-system, and publishing foundation. We are not transplanting Onlook into the legacy Telio repository. We are rebuilding Jagwar's differentiated commercial workflow—lead discovery, qualification, CRM, project handoff, outreach, activation, usage, billing, and operator controls—inside a writable Onlook-derived target.

**Naming authority:** The product is now named **Jagwar**. **Telio** is the retired/donor name. Read `NAMING-AUTHORITY.md` before planning files. Use Jagwar for all new product-facing and product-specific target work; retain Telio only for exact legacy paths, artifacts, identifiers, and migration provenance.

### Required handoff pack

Read every file completely in:

`/Users/andrewsimic/Developer/Jagwar/_bmad-output/planning-artifacts/jagwar-foundation-handoff`

Start with `README.md` and follow its reading order. This repository-local pack is the portable product authority for the rebuild. The Telio copy is donor evidence, not the active planning location.

### Repositories

Writable Jagwar target:

`/Users/andrewsimic/Developer/Jagwar`

Legacy Telio donor repository:

`/Users/andrewsimic/Developer/Telio`

Onlook read-only reference:

`/Users/andrewsimic/Developer/Onlook/onlook`

Do not modify either reference source. Keep the Onlook reference checkout read-only. Perform Jagwar work only in the writable target, and report its exact path, branch, HEAD, remotes, and status before implementation.

The donor Telio root `project-context.md` and July GrapesJS successor authorities describe the architecture being abandoned. They remain donor/history evidence and must not override this handoff or the pinned Onlook target's instructions, structure, and practices.

### Mandatory first actions

1. Verify the donor, reference, and writable-target branches, HEADs, and statuses.
2. Read every applicable `AGENTS.md`, root instruction, contribution, architecture, development, license, and notice file in the target/reference scope.
3. Reconfirm Apache-2.0 obligations and audit copied/adapted dependencies/assets/icons; preserve required notices and attribution.
4. Read the entire handoff pack.
5. Apply `NAMING-AUTHORITY.md`; produce a legacy-name inventory and reject new target artifacts that use Telio as the current product/namespace.
6. Map Onlook's native account/workspace, project, editor, AI, database, server-operation, job, billing, UI primitive, and publication authorities.
7. Pin the exact Onlook commit and produce the target-side architecture mapping for the handoff contracts before copying donor implementation.
8. Resolve OD-2, OD-3, OD-10, OD-11, OD-12, and OD-13 and attach the decisions to the backlog. Do not implement target work while the Onlook-native module map and protected-core inventory are missing.
9. Treat every file present in the pinned Onlook baseline as protected. Before each proposed original-file edit, complete `CORE-CHANGE-REQUEST-TEMPLATE.md`, show the exact path/purpose/minimal diff/alternatives/risks/tests/rollback, and obtain Andrew's explicit confirmation for that file before editing it.
10. Convert `06-epics-and-stories.md` into a dependency-safe sprint order for that pinned target. Epic/story numbering is traceability, not an instruction to ignore prerequisites.

### Hard boundaries

Preserve Onlook's:

- design tokens, typography, icons, component composition, motion, focus, responsive behavior, and professional visual language;
- authentication and account/team/workspace authority;
- project/source/editor authority;
- AI editing and project lifecycle;
- publishing and custom-domain path for now;
- current CodeSandbox and Freestyle integrations until a later infrastructure epic.
- exactly one target-native billing, subscription, entitlement, allowance, and usage authority, extending or reconciling Onlook's existing records.
- the Bun-workspace modular-monorepo shape, focused `@onlook/*` package boundaries, public entry points, schema/adapter and manager/service practices, and route-local feature colocation.
- every existing Onlook capability. Jagwar enhances Onlook; it does not deprecate, disable, replace, rename, move, or weaken existing editor, AI, project, publishing, auth, billing, UI, package, route, tool, mode, provider, or development behavior.

Do not introduce:

- GrapesJS, Puck, Craft, or the legacy Telio editor/document/revision authority;
- the old Kiranism/Prodexa/Telio dashboard shell or CSS tokens;
- a second canonical Site/project document or editor controller;
- a second billing/usage ledger, ad hoc durable-job system, or abstract Workspace authority that conflicts with the pinned Onlook architecture;
- donor Telio folder structure, cross-package private imports, generic dumping packages, compatibility layers, parallel frameworks, or microservices merely to avoid a clean Onlook-native rewrite;
- unapproved edits to any original Onlook file, including one-line exports/imports/registrations, root `package.json`, `bun.lock`, config, generated files, tests, AI/editor files, or dependency changes;
- Clerk/Neon/Cloudflare conventions merely because donor code used them;
- client-authoritative workspace, entitlement, consent, usage, or send decisions;
- raw provider payloads or secrets in UI/domain state;
- campaign blasts, cold-email infrastructure, or automated real outreach beyond approved scope;
- production deployment, real unsolicited sends, billing mutation, destructive migration, or customer-data cutover without an explicitly approved runbook.
- new `Telio`-named product strings, packages, types, modules, schemas, routes, events, configuration, billing products, or release artifacts; exact legacy references are the only exception.

### Donor-use rule

The donor repository proves business behavior and edge cases. Before adapting any module, classify it using `07-donor-inventory-and-migration.md` as concept reuse, bounded adaptation, target-native replacement, evidence only, or investigate. Preserve contract tests and invariants where useful; do not copy old route/layout/database/job architecture blindly.

You are explicitly allowed to rewrite donor Telio implementations when a rewrite is cleaner in Onlook. Reuse is not a goal by itself. Each capability must live where an Onlook maintainer would expect it: runnable code in the appropriate app, reusable behavior in a focused package with a public entry point, and route-specific UI/hooks/tests colocated with the owning feature.

### AI core protection

Feed Lead/business facts, brand details, rights-cleared asset references, voice/design direction, evidence, and explicit unknowns through a new validated `JagwarBusinessContextV1` module or context artifact using an existing public composition seam. Keep verified facts/provenance separate from generated guidance and give the context no save/apply/publish/auth/billing authority. Do not modify established Onlook prompts, agents, tools, registries, streams, managers, modes, or source-apply behavior by default. If no seam exists, stop for the exact per-file Core Change Request; this is one of the few places where asking Andrew for confirmation is mandatory.

### Billing sequence

Do not choose or implement final Jagwar prices, plans, checkout products, allowances, top-ups/overages, trial gates, or customer-facing enforcement during the initial workflow rebuild. Preserve existing Onlook billing. Add non-enforcing internal cost telemetry for discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, and outreach. After the complete workflow runs under representative loads, resolve OD-14 with a cost/margin analysis and Andrew's explicit commercial approval; only then implement Jagwar billing through the single Onlook authority.

### Product loop

The target journey is:

`Find → Qualify → Add to Pipeline → Create/Open Onlook Project → Publish → Send Exact Publication → Track Deal`

The first complete release must prove 5+2+1:

- 5 qualifying Leads confirmed;
- 2 prospect Onlook Projects created/associated;
- 1 compliant successful Send of an exact Publication.

Both prospect projects must be real personalized editable drafts, not blank projects or generic starters. Each must contain its fixture Lead's exact business name and selected available facts, omit unknown facts, and preserve provenance separately from generated copy. The compliant Send must use consent evidence created through the product workflow and must revalidate that evidence immediately before provider dispatch.

### Working style

You have authorization to inspect and implement within the writable target and to create non-production tests/fixtures. Do not repeatedly ask for permission for ordinary in-scope work. Preserve dirty work and unrelated changes. Use reversible migrations, target-native patterns, deterministic tests, and frequent concise progress updates. Stop only for a real authority/security/legal/production-data blocker or a product decision listed as phase-blocking in `09-risks-and-open-decisions.md`.

### Initial deliverable

Before the first large implementation change, return:

1. exact writable target path/branch/HEAD/status;
2. target architecture map for identity/workspace, persistence, server operations/jobs, projects/publications, billing, and UI primitives;
3. Onlook-native file/module plan for Epic 1 and the first vertical discovery slice, including new-file versus protected-original classification;
4. dependency/provider decisions and unresolved blockers;
5. baseline Onlook capability regression matrix, proposed Core Change Requests, and test/migration plan tied to the handoff acceptance criteria;
6. additive AI business-context seam and pre-commercialization cost-telemetry plan.

The initial deliverable is an implementation-readiness review, not a cutover request. Once the phase-blocking decisions are explicit, proceed through the resulting dependency-safe story plan without redesigning the product from scratch.

---
