---
title: Testing and Acceptance Strategy
status: final
created: 2026-07-28
updated: 2026-07-28
---

# Testing and Acceptance Strategy

## 1. Test principles

- Test business rules below the browser whenever possible.
- Use provider contract suites so replacements cannot silently change normalized semantics.
- Use target-native database/authorization integration tests for isolation; mocks cannot prove RLS or access control.
- Make async and money-affecting tests deterministic with injected clocks, IDs, provider fakes, and idempotency keys.
- Keep a small, high-value Playwright suite for real user journeys.
- Run visual and interaction review against the current Onlook application, not legacy Telio screenshots.
- Never use real customer data, production sends, production billing mutation, or uncontrolled provider costs in automated tests.
- Preserve the pinned Onlook baseline test matrix. A Jagwar story cannot pass by deprecating or weakening an existing Onlook capability.

### Repository and protected-core gate

- Every new file maps to the approved `apps/*`, focused `packages/*`, route-local feature, schema/adapter, manager/service, or public-seam module plan.
- Package manifests, entry points, imports, dependency direction, schemas, tests, and tooling match neighboring Onlook packages/features.
- No generic Jagwar dumping folder, donor compatibility layer, cross-package private import, or parallel framework is introduced.
- Diff the target against the pinned baseline. Every modified original Onlook file must map to an approved per-file Core Change Request with the exact purpose/diff limits.
- Run affected existing Onlook editor, AI mode/tool/provider, project/source, preview, publish/domain, auth, billing, route, package-export, script, and UI regression tests.
- A changed original file without approval or a deprecated baseline capability is an automatic release failure.

### Naming authority gate

- Scan new and modified target artifacts case-insensitively for `telio`.
- Every remaining match must be classified as an exact legacy path, historical identifier, donor artifact, or migration-provenance reference.
- New product-facing text and product-specific target identifiers use `Jagwar` with exact spelling.
- New capability modules may use an Onlook-native capability name without a product prefix; they may not use Telio as a new namespace.
- Historical identifiers are not destructively renamed merely to pass the scan; approved mappings and compatibility tests prove any intentional migration.

## 2. Contract and pure-domain tests

### Candidate normalization

- Full provider record normalizes exactly.
- Every optional/unknown fact remains null/absent.
- Malformed email/URL/coordinates/rating/review count behavior is explicit.
- Unknown provider fields are rejected or ignored according to closed-schema policy.
- Provider capability metadata does not reshape Candidate output.

### Deduplication

- Stable provider identity wins when present.
- Fallback key is deterministic and versioned.
- Repeated Candidate confirmation returns the existing Lead.
- Concurrent confirmation cannot create two Leads.
- Same business in different Workspaces remains isolated.

### Qualification

- Confirmed website-field coverage plus explicit absence → missing-site; null without coverage evidence → unknown.
- Each weak-site rule has pass/fail/unknown coverage.
- All pass → has-site.
- Inspection failure → failed/unknown, never weak by default.
- Policy version and evidence are retained.
- Ranking is stable: missing, weak, has; deterministic within groups.

### Outreach compliance

- Suppressed recipient blocks first.
- Invalid recipient blocks.
- Required opt-in missing blocks.
- Required approved template missing blocks.
- Publication unavailable blocks.
- Connector inactive blocks.
- Connector that does not require a condition does not enforce it accidentally.
- Blocked result has no provider/usage side effect in integration tests.
- Consent evidence can be recorded, corrected, withdrawn, and audited; a public phone number alone never becomes opt-in.
- Consent withdrawn after quote/enqueue but before dispatch blocks the provider call and releases the reservation.

### Activation

- Counts use qualifying unique records.
- Threshold equality completes a milestone.
- Over-target counts remain complete.
- Duplicate events/rows do not overcount.
- Failed/blocked sends do not count.
- Projection failure does not become zero.
- Rebuild matches incremental projection.

### Billing and usage

- During rebuild, cost observations cover provider/VM/hosting/storage/outreach units but create no customer charge, allowance debit, or entitlement.
- After OD-14 approval, stored subscription state exclusively determines Jagwar entitlement.
- No subscription and invalid/unknown statuses fail safely.
- Duplicate webhook does not duplicate transition or allocation.
- Out-of-order event handling is deterministic.
- Reservation/commit/release/reversal is idempotent.
- Saved Discovery Run replay incurs zero new discovery units.
- Retry/callback does not double-debit.

### Additive AI business context

- `JagwarBusinessContextV1` validates verified facts, provenance, explicit unknowns, qualification evidence, design direction, and generated guidance.
- Unknown facts are omitted from project copy; generated guidance cannot masquerade as verified evidence.
- Context input alone has no save/apply/publish/auth/billing capability.
- Existing Onlook Ask/Build modes, tools, providers, streams, managers, and source-apply behavior produce their baseline results when Jagwar context is absent.
- If a protected AI/editor file changes, its approved Core Change Request and focused baseline regression are mandatory.

## 3. Provider contract suites

### Discovery provider

Every adapter must pass the same suite for:

- authentication/secret not exposed;
- timeout and cancellation;
- success and zero results;
- provider error normalization;
- malformed payload behavior;
- maximum count behavior;
- Candidate normalization and null discipline;
- provider request correlation/idempotency where supported.

### Phone intelligence provider

- Valid mobile/landline/VoIP/unknown examples.
- Missing/malformed phone rejected before provider use.
- Failure does not fail the parent Discovery Run.

### Outreach connector

- Capabilities validate.
- Request contains exact Publication URL and template version.
- Persisted request contains Connector Account identity; its credential reference is resolved only by the server-only connector factory.
- Provider idempotency key is forwarded when supported.
- Provider acceptance and recipient delivery normalize into distinct closed states.
- Secrets/raw provider errors never cross the boundary.
- Callback verification and event normalization.

## 4. Persistence and authorization integration tests

Run using the target stack's real authorization/persistence behavior in an isolated environment.

Required proofs:

- Ownership Scope A cannot read/update/delete Ownership Scope B Searches, Runs, Candidates, Leads, Qualifications, Project Links, Publications, Consent, Sends, Usage, or configuration, using the target-native mapping approved under OD-2.
- Missing workspace context fails closed.
- Operator access is explicit and cannot be forged by customer role metadata.
- Candidate confirmation is atomic/idempotent under concurrency.
- Pipeline stage write has version/conflict behavior.
- Provider acceptance/delivery reconciliation, stage advance, activation projection, and each applicable usage settlement remain exactly once.
- Suppression applied before dispatch prevents a queued job where policy requires re-check.
- Cancellation before external dispatch prevents the provider call and releases reservation; provider-accepted work cannot be relabeled canceled.
- Subscription webhook event ordering and uniqueness are enforced.
- Immutable/history records cannot be silently updated by normal application roles.

## 5. Component and interaction tests

### Find Leads

- Exactly one primary query input and count control.
- Initial state has no fake results.
- Loading, empty success, provider failure, partial enrichment, saved replay, and limit states are distinct.
- Ranking, result count, select-all, already-added state, and batch payload.
- Map/list selection synchronization and accessible list equivalence.
- Saved run open does not invoke provider action.
- Dialog/sheet focus restoration and keyboard operation.

### Pipeline and Lead detail

- All six stages render.
- Drag, keyboard, and menu movement call the same action.
- Failure restores prior state.
- Primary action changes correctly based on project/publication/outreach state.
- Unknown facts do not render invented placeholders.
- Suppressed Lead cannot open an enabled Send action.

### Outreach

- Connection state and approval/action-required states.
- Quote shows exact Lead, Publication, recipient, template, eligibility, and usage.
- Single send shows queued then durable status.
- Batch preview reconciles eligible/blocked totals.
- Batch result preserves independent outcomes.
- Provider failure and retry do not enable duplicate confirmation.
- Consent evidence creation, correction, withdrawal, and current eligibility are operable without editing raw records.

### Activation and billing

- Same projection shown across overview/widget.
- Unavailable is not zero.
- Before OD-14, no invented Jagwar plan, price, upgrade/top-up action, allowance, or customer-facing gate renders.
- After OD-14, server denial produces only the approved upgrade/top-up/wait/reduce action.
- After OD-14, plan and pending change are distinguishable; checkout/portal return is verified server-side and query parameters cannot grant entitlement.
- After OD-14, initial allocation makes the approved 5+2+1 cycle reachable before the continued-volume gate.

## 6. Playwright acceptance journeys

### P0-1: First complete 5+2+1 cycle

1. Create an isolated test Workspace and user.
2. Run a deterministic five-result discovery.
3. Confirm all five Leads.
4. Create two Onlook test projects through the prospect-seeding path; verify both editable previews contain their exact fixture business names and selected available facts, omit unavailable facts, and are neither blank nor generic.
5. Publish one through the target publication test path.
6. Use the product workflow to record required channel consent evidence; establish approved template and connection through test adapters/fixtures.
7. Send through a non-production connector/provider sandbox.
8. Verify Pipeline New→Contacted, activation 5/5 2/2 1/1, and the exact expected discovery, qualification, project, and outreach reservations/usage settlements with no duplicates, plus complete Send history.

### P0-2: Retry and refresh recovery

1. Start discovery and refresh during running state.
2. Reconnect to the same Run.
3. Replay saved results without another provider call.
4. Double-submit Candidate confirmation, project creation, and send.
5. Verify exactly one Lead per Candidate, one Project Link, one provider send, one usage settlement, and one activation increment.

### P0-3: Cross-Workspace attack path

Attempt direct IDs, altered URLs, nested batch payloads, project links, send IDs, and saved-run IDs from another Workspace. Verify no data or existence-sensitive details leak and no mutation occurs.

### P0-4: Compliance block

Attempt sends with missing opt-in, suppression, missing approved template, invalid recipient, unavailable Publication, and inactive connector. Verify provider fake receives zero calls and usage/activation remain unchanged.

### P0-5: Stale quote and cancellation safety

Quote and enqueue an eligible Send, then withdraw consent before the worker dispatches. Verify the worker re-reads current evidence, makes zero provider calls, records the block, and releases the reservation. Separately cancel queued discovery and outreach work; verify no later provider call. Attempt to cancel a provider-accepted Send and verify its accepted truth is preserved.

### P0-6: Partial batch

Select eligible, suppressed, missing-publication, and provider-failure Leads. Verify independent preview/outcome, only eligible dispatches, and retry affects only allowed failed items.

### P1-1: Cost telemetry without premature billing

Run representative discovery, qualification, project/AI, sandbox/VM, publication/hosting, storage/egress, and outreach fixtures. Reconcile actual operations, retries, failures, concurrency, latency, and cost observations. Verify the observations create no Jagwar charge, allowance debit, entitlement, checkout action, or customer gate and do not change existing Onlook billing behavior.

### P1-2: Republish after historical send

Send Publication A, republish as B, send again, and verify the two history rows preserve distinct Publication identities/URLs.

### P2-1: Approved checkout, allocation, and fair gate

Run only after OD-14 and the exact commercial release are approved. Open checkout and the billing portal through server-created test sessions; verify altered browser price/customer/return parameters cannot grant entitlement. Replay the same subscription/allocation events and prove one allocation. On a legitimate new test account, complete up to 5+2+1 before the continued-volume gate can deny the promised cycle.

### P1-4: Retention and end-to-end correlation

Run approved retention against aged fixtures and verify eligible personal data expires while minimal suppression/audit evidence remains according to policy. Trace one discovery and one Send across request, durable operation, provider fake, domain record, reservation/settlement, and audit event using safe correlation identities.

## 7. Real-provider acceptance

Run only through controlled, explicitly configured non-production credentials:

- one bounded live discovery query with expected normalization and cost record;
- one phone lookup against a designated test number;
- one WhatsApp/BSP test or approved internal recipient, only after legal/provider setup;
- provider callback replay and signature verification;
- no customer prospects or unsolicited real recipients.

Capture provider name/version/endpoint, timestamp, request correlation, normalized output, cost units, and safe logs.

## 8. Migration tests

- Dry-run makes zero target mutations when configured as dry-run.
- Repeating import is idempotent.
- Per-category source/accepted/skipped/failed/duplicate/unresolved counts reconcile.
- Source→target ID map is stable.
- Suppression survives and blocks target send.
- Historical sends remain non-replayable.
- Subscription state matches provider truth.
- Unresolved project/publication is not guessed.
- No donor editor document becomes target project authority.
- Rollback/export procedure restores the pre-import target state where applicable.

## 9. UI quality gate

Review new surfaces beside the current Onlook UI in supported browsers and viewports:

- exact token usage and no hard-coded near-equivalents;
- typography family, size, weight, and line height;
- icon family, stroke, optical size, and alignment;
- spacing, density, radii, borders, and shadows;
- hover, pressed, focus, selected, disabled, destructive, and read-only states;
- loading, empty, failure, retry, partial, success, and limit treatments;
- motion and reduced motion;
- keyboard traversal and focus return;
- screen-reader names and status announcements;
- mobile/tablet adaptations;
- zero Kiranism/legacy Telio visual residue.

## 10. Release evidence

The release bundle should record:

- exact target commit and lockfile;
- migration versions and reconciliation output;
- provider adapter/config versions;
- policy release versions;
- automated test commands and results;
- Playwright artifacts for P0 journeys;
- visual/accessibility review results;
- approved Onlook-native module map, baseline capability matrix/results, and a target diff whose every original-file modification links to an explicit per-file approval;
- additive AI-context contract results and proof that existing AI/editor behavior remains available;
- pre-commercialization cost report; when billing ships, the approved OD-14 commercial model and post-approval billing evidence;
- naming-authority scan and approved inventory of every retained legacy Telio match;
- approved numeric performance budgets and measured percentile results for shell interaction, operation acknowledgment/progress, and provider timeout/retry behavior;
- retention/deletion enforcement evidence and end-to-end correlation samples with secret/PII redaction;
- known limitations and deferred infrastructure work;
- rollback/recovery steps.
