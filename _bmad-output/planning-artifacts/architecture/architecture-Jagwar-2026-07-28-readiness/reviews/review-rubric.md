# Architecture Reviewer Gate — Good-Spine Rubric Walker

**Reviewed artifact:** `../ARCHITECTURE-SPINE.md`  
**Review date:** 2026-07-28  
**Intent:** Finalize-gate semantic review; the spine was not edited  
**Verdict:** **REVISE — not ready to finalize.** The spine is mechanically clean and establishes a strong Onlook-native extension model, but it omits two safety-critical initiative invariants and leaves two source capabilities without a governing decision or explicit deferral.

**Post-review disposition:** The finalized spine resolved the review's safety invariants. Approved CCR-019 through CCR-022 retire the unavailable private upstream admin dependency from Jagwar and verify frozen installation. OD-13 still blocks operator implementation until explicit roles, authorization, target-native surface placement, protected paths, and regressions are approved.

## Gate evidence

- Deterministic lint: **pass**, zero findings (`lint_spine.py`; run with a workspace-local UV cache because the default user cache is sandbox-restricted).
- Brownfield fit was checked against the pinned-target paths named by the spine and the handoff requirements. The selected modular-monolith shape, Supabase/Drizzle authority, protected-core rule, native project/publication/billing seams, and public package boundaries ratify the inspected Onlook code rather than replacing it.
- No parent architecture spine was inherited, so there are no inherited AD conflicts to reconcile.
- The handoff is the driving specification. Its requirements and Stories 1.1–7.6 therefore count as source capability coverage for this rubric.

## Critical findings

### R-1 — Mandatory send-time compliance revalidation is not an invariant

**Evidence:** AD-7 fixes lease/idempotency/cancellation behavior, AD-10 fixes immutable publication identity, and AD-13 says the client cannot decide compliance. None requires the durable handler to re-read and revalidate consent evidence, withdrawal/suppression, connector readiness, approved template, recipient, exact Publication eligibility, and any applicable reservation immediately before the provider call. Story 5.4 explicitly requires that recheck after quote/enqueue and immediately before dispatch. Story 5.3's quote-time evaluation is not equivalent.

**Why this fails the rubric:** Two handler implementations can comply with every current AD yet choose incompatible check times: one may trust an enqueue-time quote while another rechecks at dispatch. The first can send after consent withdrawal, suppression, template revocation, connector failure, or Publication invalidation. This is a real legal/safety divergence and a first-release acceptance condition.

**Disposition:** **Autofix before finalize.** Add an enforceable AD that binds all outreach handlers: after lease acquisition and before the atomic dispatch-start marker, re-read authoritative state and evaluate the connector-declared compliance contract; any blocked input commits a typed non-dispatch outcome, performs no provider call, and releases an unused reservation. The send snapshot must bind the exact authoritative inputs that passed this check. Do not make browser claims or a stale quote authoritative.

### R-2 — Operator/admin authorization has no owner, boundary, or blocker

**Evidence:** The initiative includes operator controls and Stories 7.1–7.2, but the Capability Map and Structural Seed place no operator surface or authorization service. AD-5 says a web policy service activates releases without defining who may activate them or their scope. The pinned target's `adminProcedure` is not an operator-role check: it accepts any authenticated user with email and swaps in a service-role Supabase client that bypasses RLS. Separately, the actual `apps/admin` source is unavailable under OD-15.

**Why this fails the rubric:** Independent units can place global controls in the user web app, assume the unavailable admin app, or treat `adminProcedure` as authorization. Those choices are mutually incompatible, and the unsafe choice gives an ordinary authenticated user service-role-backed policy/provider authority.

**Disposition:** **Discuss/block before finalize.** Either (a) identify the pinned native operator identity/role and the exact runnable surface, then bind least-privileged authorization, scope, audit, and protected seams in an AD, or (b) explicitly block Stories 7.1–7.2 on OD-15/native-admin inspection. State expressly that service-role client access is not operator authorization. Do not silently choose a new admin authority.

## High findings

### R-3 — Donor import/migration is a silent initiative capability

**Evidence:** Story 7.3 requires an explicit donor-data migration contract. The Capability Map, Structural Seed, invariants, Deferred section, and Open Questions contain no migration/import owner or rule. AD-14 blocks production cutover without a runbook but does not govern how import code classifies, stages, maps, rejects, retries, audits, or rolls back donor records.

**Why this fails the rubric:** A migration unit can choose direct table writes while another chooses staged adapters, and both remain compliant with the current spine. That is exactly the cross-unit divergence an initiative spine must prevent, particularly given the no-donor-architecture boundary.

**Disposition:** **Autofix before finalize.** Add a migration invariant and map it to an explicit focused owner/surface. Require a versioned import contract, donor classification per the handoff, dry-run and deterministic fixtures, explicit unresolved mappings, idempotent/reversible application through target-native services, no donor IDs as current authority, and a separately approved production cutover runbook. If placement depends on inaccessible source, defer Story 7.3 with that revisit condition rather than leaving it silent.

### R-4 — Accessibility and responsive interaction requirements are not decided or deferred

**Evidence:** AD-13 requires Server Components, route colocation, `@onlook/ui`, `next-intl`, and server authority, but it does not bind WCAG 2.2 AA, keyboard-equivalent map/Kanban interactions, focus restoration, selective async announcements, or responsive alternatives. These are explicit NFR-4 and UX-DR-4/5/9 requirements in the handoff. Reusing primitives does not settle feature-level interaction behavior.

**Why this fails the rubric:** Separate route slices can implement inaccessible map-only selection, pointer-only stage movement, or inconsistent focus/announcement behavior while satisfying AD-13. This is a missing owned dimension, not presentation detail that compliant code necessarily reveals.

**Disposition:** **Autofix before finalize.** Extend AD-13 or add a UI interaction AD that makes WCAG 2.2 AA and the named equivalent-interaction/focus/responsive rules binding. Performance budgets may remain story-owned, but the spine should explicitly defer their numeric thresholds to measured Story 7.5 evidence so NFR-3 is not silent.

## Medium / low tail

No additional medium or low findings are required once R-1 through R-4 are addressed. One existing conditional must remain visible: AD-6 cannot be treated as implementation-ready until the target records actual `pgmq` and `pg_cron` availability/versions. The spine already expresses this correctly as a blocking preflight rather than inventing a fallback.

## Good-spine checklist

| Check | Result | Notes |
| --- | --- | --- |
| Fixes the real divergence points for the level below and misses none | **Fail** | Send-time compliance and operator authorization are load-bearing omissions; migration and accessibility are silent. |
| Every AD Rule is enforceable and prevents its stated divergence | **Pass with caution** | Current Rules are testable enough for the initiative altitude. AD-5's activation rule becomes safe only after R-2 establishes actor authorization. |
| Nothing under Deferred could let two units diverge | **Pass** | Provider/commercial/team/infrastructure deferrals name gates or revisit conditions and preserve their authority boundaries. |
| Named technology is verified-current | **Conditional pass** | Locked brownfield versions are pinned. PGMQ/pg_cron upstream versions are recorded, while target-provided versions correctly remain a blocking preflight. |
| Ratifies rather than contradicts the brownfield codebase | **Pass** | Native identity, DB, project, AI, deployment, billing, UI, and Bun/package seams are preserved. The proposed operator design must not infer authorization from `adminProcedure`. |
| Covers the driving specification's capabilities | **Fail** | Story 7.3 migration and Stories 7.1–7.2 operator controls lack architecture placement; send compliance and accessibility are only partially covered. |
| Does not weaken an inherited parent spine | **N/A** | No parent spine was identified. |
| Every initiative-owned dimension is decided, deferred, or open | **Fail** | Operator authorization, migration/import, and accessible interaction are silent. The broader deployment/provider/job envelope is otherwise covered by AD-6, AD-7, AD-14, and AD-15. |

## Strengths to preserve during revision

- AD-1 makes protected-core governance enforceable per exact baseline path.
- AD-2 and AD-3 resolve ownership/persistence without inventing a Workspace aggregate or relying on browser tenancy/RLS alone.
- AD-6 and AD-7 establish one durable transport and one operation truth with leases, fencing, idempotency, cancellation, reconciliation, and terminal visibility.
- AD-9 uses the existing PROMPT composition seam and explicitly blocks later project work on executable personalized-draft proof.
- AD-10 and AD-11 preserve native publication and commercial authorities while separating immutable send evidence and non-enforcing cost observations.
- AD-14 and AD-15 correctly preserve the operational topology and keep the unavailable pinned admin source visible as a release blocker.
