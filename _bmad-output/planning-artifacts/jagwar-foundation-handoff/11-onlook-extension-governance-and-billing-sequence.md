---
title: Onlook Extension Governance and Billing Sequence
status: approved-direction
changeScope: major-implementation-governance
created: 2026-07-28
updated: 2026-07-28
---

# Onlook Extension Governance and Billing Sequence

## 1. Decision

Jagwar is an additive product extension of Onlook. The implementation must preserve Onlook's modular-monorepo structure, package boundaries, feature colocation, public APIs, editor/AI behavior, and development practices. Jagwar may rewrite donor Telio behavior cleanly; it may not force donor file structure or implementation into the target.

No existing Onlook capability is deprecated, disabled, replaced, renamed, moved, or semantically weakened as part of the Jagwar business-workflow rebuild. The default operation is **add a new target-native module and integrate through an existing public seam**.

## 2. Structural authority

The target is a Bun-workspace modular monorepo and modular monolith:

```text
onlook/
├── apps/       runnable applications
├── packages/   reusable capability packages
├── tooling/    shared development configuration
├── docs/       documentation application and content
├── package.json
└── bun.lock
```

Placement rules:

| Kind of work | Required target shape |
| --- | --- |
| Runnable user or operator surface | Existing appropriate `apps/*` application, organized as a route-local feature/vertical slice |
| Reusable business capability | A focused internal package under `packages/*` with its own manifest/configuration, `src/`, public `src/index.ts`, and package-focused tests following neighboring packages |
| Route-specific UI | Colocated under the route's private `_components`, `_hooks`, and feature subfolders; do not scatter it across generic global folders |
| Shared domain contract | Schema-first, runtime-validated package boundary exposed through a public package entry point |
| External provider | Provider/adapter boundary; application code depends on the abstraction rather than one vendor SDK |
| Long-lived behavior | Target-native manager/service pattern when the neighboring Onlook capability uses it |
| Database behavior | Additive schema/repository modules following the current `@onlook/db` and target authorization conventions |
| UI primitives/icons | Reuse `@onlook/ui`; new product features compose existing primitives before proposing another primitive |

The receiving session must inventory the pinned target before naming exact packages. Example Jagwar package names in planning are illustrative, not permission to create a parallel architecture.

## 3. Onlook Core Protection Protocol

### 3.1 Baseline definition

The **Onlook baseline** is every tracked file present in the pinned upstream-derived commit from which the writable Jagwar worktree is created. A file remains an original Onlook file even if it appears easy to edit or has already been copied into a Jagwar fork.

### 3.2 Default rule

New, story-authorized Jagwar-owned files may be created without repeated permission when they follow the approved module map. An original Onlook file may not be edited, deleted, renamed, moved, generated-over, or have its behavior deprecated without Andrew's explicit confirmation for that exact file and proposed change.

This includes, without exception:

- root `package.json`, `bun.lock`, workspace configuration, shared TypeScript/lint/build configuration;
- an existing package's barrel file or export map;
- existing routes, layouts, navigation, components, hooks, managers, services, schemas, migrations, tests, and documentation;
- existing AI prompts, agents, contexts, tools, registries, model/provider configuration, stream/apply logic, and token behavior;
- existing editor, preview/preload, source-mutation, project, publishing, authentication, billing, or database files;
- “small” imports, registrations, feature flags, dependency changes, and compatibility shims.

### 3.3 Per-file confirmation workflow

Before touching an original Onlook file, the implementation session must create a Core Change Request using `CORE-CHANGE-REQUEST-TEMPLATE.md` and present:

1. exact repository, baseline commit, and file path;
2. current responsibility and public consumers;
3. exact intended change;
4. why a new file, package, adapter, route-local feature, configuration layer, or existing extension seam cannot satisfy the need;
5. effect on existing Onlook behavior and upstream-sync compatibility;
6. special AI/editor/auth/billing/data risks;
7. focused regression tests, full baseline test surface, and rollback;
8. the smallest proposed diff or pseudodiff.

Approval is per file and per proposed purpose. Approval for one file does not approve adjacent files, future edits, lockfile updates, generated changes, or scope expansion. If the proposed diff materially changes after approval, confirmation must be obtained again.

### 3.4 No deprecation proof

Every Jagwar story must identify the affected existing Onlook capabilities and prove they still work. Passing Jagwar tests alone is insufficient. Removal, disabling, renamed behavior, broken public exports, altered editor/AI output, or an existing route regression fails the story.

## 4. AI-sensitive additive integration

Onlook's AI system is a protected core capability. Jagwar business facts should reach it through an additive, validated context boundary—not by rewriting established prompts, agents, tools, managers, or edit/apply behavior.

Required shape:

1. A new Jagwar-owned module assembles `JagwarBusinessContextV1` from authorized Lead facts, qualification evidence, brand/business details, rights-cleared asset references, voice/design direction, and explicit unknowns.
2. The context keeps verified facts and provenance separate from generated marketing guidance.
3. It is read-only input to Onlook's existing project/AI flow; it has no project mutation, save, publish, billing, or authorization power.
4. Prefer a new context file/artifact and an existing public registration or composition seam.
5. If no safe seam exists, stop and submit the minimum original-file Core Change Request. Do not quietly patch an agent, global prompt, tool registry, manager, or editor path.
6. Existing Ask/Build modes, tools, providers, streams, project creation, editor behavior, and source-apply semantics must remain available and regression-tested.

The exact file/package placement is decided only after the pinned-target inventory. The invariant is additive context, not a hard-coded donor Telio path.

## 5. Clean rewrite permission

Donor Jagwar code is evidence, not sacred implementation. The receiving team may rewrite lead discovery, qualification, CRM, outreach, activation, metering, and operator behavior when a rewrite produces a cleaner Onlook-native result, provided that:

- the product contract and verified edge cases remain covered;
- the new code follows Onlook's package/feature conventions;
- target schemas and adapters use current Onlook validation and dependency patterns;
- no legacy Telio folder structure, framework convention, compatibility layer, or duplicate authority is carried forward merely to reuse code;
- migration of real data remains explicit, reversible, and separately approved.

## 6. Billing sequence correction

Commercial pricing is intentionally deferred until the rebuilt architecture and its operating costs can be measured. This does not defer cost observability or the one-authority rule.

### During product implementation

- Preserve Onlook's existing Stripe/subscription/usage behavior and public billing flows.
- Do not deprecate or replace existing Onlook billing.
- Identify the single target-native commercial authority and prevent a parallel Jagwar billing truth.
- Instrument non-enforcing, internal cost telemetry for discovery, qualification, project/AI generation, sandbox/VM time, hosting/deployment, storage/egress, and outreach.
- Record actual unit, concurrency, retry, failure, and lifecycle evidence needed for pricing.
- Do not invent final Jagwar plans, checkout products, price IDs, included allowances, top-ups, margin claims, or customer gates.

### Final commercialization phase

After the complete business workflow operates in a representative non-production environment:

1. measure cost distributions for realistic user cohorts and 5+2+1 journeys;
2. model fixed and variable costs, concurrency, provider minimums, retries/failures, support burden, target gross margin, and abuse exposure;
3. decide the user, project, workspace, usage, or hybrid pricing basis;
4. approve plans, prices, allowances, trial rules, caps, overages/top-ups, dunning/grace, and rollout;
5. extend/reconcile Onlook's existing billing authority through approved additive modules and any separately approved original-file changes;
6. implement checkout/portal/entitlement enforcement and prove it through provider sandbox acceptance.

Pricing is therefore a final evidence-based product decision, while architecture compatibility and cost telemetry begin early.

## 7. Change impact

- Epic 1 gains the repository/module-map and core-protection gate.
- Lead-to-project AI context becomes explicitly additive and protected.
- Every story gains baseline Onlook regression and original-file-change accounting.
- Billing implementation and customer-facing gates move behind a completed-system cost baseline and owner-approved commercial model.
- Existing Onlook features are preservation requirements, not migration candidates.

## 8. Success criteria

- A developer can locate each Jagwar capability using the same `apps` versus `packages`, capability ownership, and route-colocation logic as Onlook.
- No donor Telio architecture contaminates the target merely for code reuse.
- Every original Onlook file change has a matching explicit approval record.
- No existing Onlook editor, AI, auth, project, publishing, billing, or UI behavior is deprecated by Jagwar.
- Business context improves generated prospect sites through an additive validated boundary.
- Final pricing is based on measured end-to-end costs rather than legacy Telio assumptions.
