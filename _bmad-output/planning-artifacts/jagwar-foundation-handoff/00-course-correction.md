---
title: Sprint Change Proposal — Adopt Onlook and Rebuild Jagwar Business Workflows
status: approved-direction
changeScope: major
created: 2026-07-28
updated: 2026-07-28
---

# Sprint Change Proposal — Adopt Onlook and Rebuild Jagwar Business Workflows

## Naming correction

The product formerly called Telio is now **Jagwar**. All new product and target implementation work uses Jagwar. Telio remains only for exact donor repository, legacy artifact, historical identifier, and migration-provenance references as defined by `NAMING-AUTHORITY.md`.

## 1. Issue summary

The legacy Telio repository accumulated valuable lead-generation, CRM, outreach, activation, billing, tenancy, and operational behavior alongside repeated editor and dashboard rewrites. Onlook already supplies the application/editor foundation Telio was attempting to construct: a mature code-first website builder, AI editing workflow, authentication, project lifecycle, publishing, custom-domain support, and a coherent visual system.

Continuing to merge Onlook's editor into the legacy Telio shell would preserve too much obsolete structure and create ongoing impedance between two application authorities. The approved direction is therefore to adopt Onlook as the foundation and rebuild only Jagwar's differentiated business workflows into it.

## 2. Change trigger

- The Onlook product overlaps Jagwar's desired builder and AI experience closely enough that recreating those capabilities is wasteful.
- The legacy Telio editor and dashboard presentation are not acceptable target foundations.
- The Jagwar business wedge remains differentiated: find prospects, qualify them, generate personalized sites, send proof, and track the deal.
- Rebuilding a focused dashboard inside Onlook is lower complexity than transplanting the entire Onlook editor into Jagwar.

## 3. Impact analysis

### Product impact

Preserve the business promise and workflow, but change the implementation foundation. Lead discovery, CRM, outreach, activation, billing, and operator functions remain product requirements. Editor-specific Jagwar requirements are superseded by Onlook unless a Jagwar business workflow needs a narrow integration.

### UX impact

Onlook's design tokens, typography, icons, density, layout behavior, loading treatment, focus patterns, and component composition become the visual authority. The prior Kiranism/Prodexa/Telio dashboard shell is donor evidence for information architecture only; it is not a visual reference.

### Data impact

Existing Telio data shapes describe business meaning but do not dictate the target database. The new implementation must model equivalent tenant-scoped concepts and provide an explicit migration/import strategy before any production cutover.

### Integration impact

Onlook project identity replaces legacy Telio Site/editor identity at the integration boundary. A Lead may reference an Onlook project and its current published URL. Outreach sends use that exact project publication; they never create a second site representation.

### Infrastructure impact

Onlook's existing services remain in place initially. Hosting/custom domains and sandbox-provider optimization are deferred until the business workflows function. This prevents an infrastructure rewrite from blocking product migration.

## 4. Recommended approach

Use a staged, non-destructive rebuild:

1. Fork or create a writable working copy of Onlook; keep the reference checkout untouched if it remains the upstream reference.
2. Preserve Onlook's auth, organization/project/editor, AI, design-token, and publishing foundations.
3. Introduce Jagwar business concepts through narrow domain modules and application services rather than copying the old repository structure.
4. Follow Onlook's Bun-workspace modular-monorepo, focused package, public-entry-point, and route-local vertical-slice practices exactly; rewrite donor behavior when needed to achieve that fit.
5. Treat every original Onlook file as protected. Prefer new Jagwar-owned files and existing public seams; require Andrew's explicit per-file confirmation before any original-file edit.
6. Preserve every existing Onlook capability. Jagwar enhances Onlook and does not deprecate its editor, AI, projects, publishing, auth, billing, packages, routes, modes, or tools.
7. Deliver vertical user outcomes: discovery → pipeline → project handoff → outreach → activation → measured-cost commercialization.
8. Import or adapt donor code only after its behavior is covered by target-side contract tests.
9. Keep legacy Telio and any real data recoverable until target-side parity and migration evidence pass.

## 5. Preservation classification

### Preserve as product behavior

- One-query local-business discovery with a requested lead count.
- Saved search runs and replayable candidate snapshots.
- Explicit distinction among no results, provider failure, and in-progress work.
- Normalized lead facts with explicit nulls and provenance.
- Jagwar-owned website qualification: `missing-site`, `weak-site`, or `has-site`.
- Ranking weak/missing-site prospects ahead of businesses with acceptable sites.
- Six-stage CRM pipeline: New → Contacted → Interested → Negotiating → Converted → Lost.
- Personalized per-lead outreach, including multi-select fan-out as independent sends.
- Compliance checks before dispatch and durable delivery status afterward.
- Successful send auto-advancing only a New lead to Contacted.
- The 5+2+1 activation loop and authoritative progress calculation.
- Server-authoritative subscription, usage, credits, caps, and tenant isolation.
- Operator-controlled provider/runtime configuration where appropriate.

### Re-express in Onlook

- Lead-to-site generation becomes Lead-to-Onlook-project creation or project seeding.
- The Websites list becomes an Onlook project view enriched with Jagwar lead/deal metadata.
- Published-site handoff references Onlook deployment identity and URL.
- Dashboard routes, navigation, cards, tables, dialogs, sheets, icons, and states use Onlook's existing UI composition.
- Authentication and tenancy adapt to Onlook's account/team model instead of importing Clerk-specific assumptions.

### Retire from target authority

- GrapesJS, Puck, Craft, or old editor-session authorities.
- The old Kiranism dashboard structure and legacy Telio design tokens.
- Cloudflare/Neon/Clerk implementation requirements that exist only because of the donor stack.
- Old page-document, revision, publishing, and component-registry mechanisms.
- Environment-variable names, migration numbering, route names, and repository class layouts as requirements.

### Defer

- Replacing Freestyle production hosting.
- Replacing CodeSandbox development VMs.
- Custom-domain provider migration.
- Cold email, mailbox warming, shared campaigns, open/click/reply automation.
- iMessage connector productionization.
- Team/agency features beyond the tenancy Onlook already supports.
- Final Jagwar plans, price points, checkout products, allowances, top-ups, and customer-facing usage gates until representative end-to-end operating costs are measured.

Cost telemetry is not deferred. Discovery, qualification, project/AI generation, sandbox/VM, hosting/deployment, storage/egress, and outreach costs must be observed during the rebuild so the later pricing decision is evidence-based.

## 6. Scope classification and handoff

This is a **major** course correction because the application foundation changes. It should not be implemented as edits to the legacy Telio backlog. The receiving session should create a fresh target backlog from `06-epics-and-stories.md`, using the legacy Telio repository as evidence and Onlook as the implementation authority.

## 7. Success criteria

- The target application looks and behaves like Onlook, not the retired Telio dashboard.
- A user can find leads, add them to a pipeline, create/open a personalized Onlook project, publish it, and send that exact publication.
- No target module depends on a legacy Telio editor or document representation.
- Target files follow the same `apps` versus `packages`, package-boundary, and route-colocation logic as Onlook.
- No original Onlook file is changed without a recorded per-file request and Andrew's explicit confirmation.
- Existing Onlook behavior remains available and regression-tested; no capability is deprecated to make Jagwar fit.
- No provider secret, tenant identifier, subscription entitlement, or usage decision is trusted from the browser.
- Failed/retried discovery and outreach operations do not duplicate leads, charges, sends, or activation counts.
- The old repository remains recoverable and is not deleted or destructively migrated during the rebuild.
