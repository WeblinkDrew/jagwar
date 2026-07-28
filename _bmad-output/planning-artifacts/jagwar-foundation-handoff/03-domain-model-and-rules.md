---
title: Domain Model and Business Rules — Jagwar Business Workflows
status: final
created: 2026-07-28
updated: 2026-07-28
architectureBinding: conceptual
---

# Domain Model and Business Rules

## 1. Modeling principles

- Model business meaning independently of the database and provider SDK.
- Use opaque server-assigned identities for durable records.
- Bind every record to the target platform's authenticated Workspace authority.
- Validate all external/provider/browser values before persistence or side effects.
- Unknown facts remain unknown; never replace missing data with plausible content.
- Keep provider capability differences in capability metadata, not by changing the normalized domain shape.
- Make lifecycle transitions explicit, durable, and idempotent.
- Historical outreach and usage evidence is append-only or revisioned; current display projections may be rebuilt.
- Reference Onlook projects and publications by identity. Do not copy their canonical documents into Jagwar business records.
- Preserve business meaning, not donor implementation structure. Target code is rewritten or adapted into Onlook's focused package and route-local feature boundaries.
- Existing Onlook capabilities remain intact; Jagwar adds records and behavior around them rather than deprecating them.

## 2. Relationship map

```text
Workspace
 ├── Discovery Search
 │    └── Discovery Run
 │         └── Candidate Snapshot [1..N]
 │              └── optional Lead link
 ├── Lead
 │    ├── Qualification [versioned]
 │    ├── Project Link [0..N, one current]
 │    │    └── Publication Reference [0..N, one current]
 │    ├── Consent/Suppression [0..N]
 │    ├── Outreach Send [0..N]
 │    └── Activity [0..N]
 ├── Connector Account [0..N]
 ├── Subscription [0..1 current + history]
 ├── Usage Ledger Entry [0..N]
 └── Activation Projection [1 current, rebuildable]
```

## 3. Conceptual entities

### 3.1 Ownership Scope (called Workspace elsewhere in this pack)

Required meaning:

- `workspaceId`: placeholder name for the architecture-decided Onlook user, project-membership, or team/workspace ownership scope;
- membership and role derive from authenticated target context;
- lifecycle state: active, suspended, scheduled for deletion, or deleted according to target policy.

Business rules:

- OD-2 must map this scope against the pinned Onlook commit before Story 1.1; do not assume Onlook already has a general Workspace authority.
- Browser-supplied `workspaceId` is never sufficient authorization.
- Records from different Workspaces may not be combined in one lead, search, project association, send, charge, or activation result.
- If Onlook supports shared teams, role permissions must be mapped intentionally; do not assume one user equals one workspace.

### 3.2 Discovery Search

Represents a reusable user intent, not a provider request.

Suggested fields:

- `id`, `workspaceId`;
- `queryOriginal`, `queryNormalized`;
- `requestedCount`;
- `createdBy`, `createdAt`;
- optional label/pin/archive metadata.

Rules:

- Normalization trims and collapses whitespace while preserving the human-readable original.
- A repeat search may create a new Run under the same or a new Search according to product UX; it must never overwrite an old result snapshot silently.

### 3.3 Discovery Run

Represents one cost-bearing execution.

Suggested fields:

- `id`, `workspaceId`, `searchId`;
- `idempotencyKey`;
- `status`: queued, running, succeeded, failed, canceled;
- `providerId`, `providerRequestRef`;
- `requestedCount`, `returnedCount`;
- typed `failureCode`, safe `failureMessage`, `retriable`;
- `usageUnits` and optional provider-cost evidence;
- `startedAt`, `completedAt`, `createdAt`;
- `supersedesRunId` or retry lineage where useful.

Rules:

- Same Workspace + same operation + same idempotency key returns the same result or a conflict; it does not start another provider request.
- `succeeded + returnedCount=0` is a valid empty outcome.
- Failed/canceled Runs never masquerade as empty success.
- Snapshot records are readable after completion without calling the provider.

### 3.4 Candidate Snapshot

Represents normalized business evidence as observed during one Run.

Suggested fields:

- `id`, `workspaceId`, `runId`;
- `providerCandidateId` or place identity;
- `dedupeKey` and dedupe-key version;
- `businessName`, `address`;
- `phone`, `email`, `websiteUrl`;
- `reviewCount`, `rating`, `googleCategory`;
- structured `openingHours` and `serviceTags` where sourced;
- `latitude`, `longitude`;
- `photoRefs` as discovery-context references only;
- `sourceProvider`, `sourceObservedAt`;
- `leadId` when confirmed into the pipeline;
- normalized payload version.

Rules:

- Nullable facts remain null.
- A photo reference carries no publication right by default.
- Replaying the Run reads this snapshot and incurs no new discovery usage.
- Snapshot linkage to a Lead is stable and prevents duplicate pipeline creation.

### 3.5 Lead

The durable prospect record.

Suggested fields:

- `id`, `workspaceId`;
- source: discovery candidate, manual, import, or integration;
- stable source/external identity when available;
- business facts from the normalized Candidate plus explicit override/provenance if the user corrects them;
- `pipelineStage`;
- `blockedAt`, `archivedAt`, `deletedAt` as policy requires;
- `createdBy`, `createdAt`, `updatedAt`.

Business facts:

- business name;
- address and coordinates;
- phone and phone-intelligence state;
- email;
- website URL;
- review count/rating;
- category;
- opening hours and service/category tags where sourced;
- source provenance.

Rules:

- Exactly one current Pipeline Stage.
- Corrections should preserve what changed, by whom, and whether the corrected value is user-confirmed.
- Unknown remains null; generated site copy cannot flow backward into verified Lead facts automatically.
- Suppression/withdrawal prevents future outreach regardless of pipeline stage.

### 3.6 Qualification

Versioned evidence-based assessment.

Suggested fields:

- `id`, `workspaceId`, `leadId` or `candidateId`;
- `policyId`, `policyVersion`;
- `status`: pending, succeeded, failed, stale;
- `websiteStatus`: missing-site, weak-site, has-site, only when succeeded;
- structured rule outcomes and observed evidence;
- primary reason suitable for the user;
- inspection URL, timestamps, safe failure data.

Rules:

- A failed or blocked inspection has no authoritative Website Status.
- A null website URL is `missing-site` only when source capability/evidence confirms an authoritative listing had no website; missing provider coverage remains unknown.
- Requalification appends a new result or revision; it does not rewrite past send evidence.
- Ranking uses a specific qualification result/policy identity.

### 3.7 Phone Intelligence

Suggested state:

- normalized phone;
- lookup status: not-requested, pending, succeeded, failed, unavailable;
- line type: mobile, landline, fixed-voip, toll-free, other, unknown;
- provider and observed timestamp.

Rules:

- Missing phone skips lookup without failing discovery.
- Lookup failure is independent of website qualification.
- `unknown` does not imply WhatsApp eligibility.

### 3.8 Project Link

Association to the target builder's authority.

Suggested fields:

- `id`, `workspaceId`, `leadId`;
- `projectId` from Onlook;
- `status`: creating, active, failed, archived, unlinked;
- `generationRunId` or creation source when applicable;
- `isCurrent` or current-link selection;
- `createdBy`, `createdAt`, `updatedAt`.

Rules:

- Project authorization is checked against Onlook/workspace authority before link or open.
- The record stores identity and business association, not project source files or a second site document.
- Repeated create requests are idempotent.
- A Lead may have alternatives/history, but exactly one project is selected for current outreach at a time.

### 3.9 Publication Reference

Immutable snapshot of the published output used for a send.

Suggested fields:

- `id`, `workspaceId`, `projectLinkId`;
- Onlook deployment/publication identity;
- public URL and optional custom-domain identity;
- publication version/commit identity if available;
- status and availability check;
- `publishedAt`, `observedAt`;
- `isCurrent` for convenience.

Rules:

- A send binds a Publication Reference, not just the current project URL string.
- Later republishing may change `isCurrent` but never rewrites a past send's publication snapshot.
- Development previews, authenticated previews, or expired URLs are not outreach-eligible unless policy explicitly permits them.

### 3.10 Connector Account

Represents a configured outreach channel within a Workspace.

Suggested fields:

- `id`, `workspaceId`, `connectorType`, `channel`;
- `status`: disconnected, connecting, pending-approval, active, degraded, suspended;
- secret reference/token reference, never plaintext;
- provider account/sender identities;
- capabilities snapshot/version;
- last health check and safe failure summary.

Rules:

- Secrets are resolved only inside the server-side connector composition boundary.
- A request or job stores a Connector Account identity, not secret contents or a transport-ready credential reference; only the server-side connector factory resolves the account's secret reference.
- Disabled/suspended accounts block new sends but retain history.

### 3.11 Consent and Suppression

Suggested fields:

- `id`, `workspaceId`, `leadId`;
- channel and recipient scope;
- status: opted-in, opted-out, suppressed, unknown;
- legal/policy basis and source;
- evidence reference;
- effective and recorded timestamps;
- actor/system source.

Rules:

- The most restrictive applicable current state wins.
- Suppression, consent, connector status, template approval, recipient validity, and Publication eligibility are re-read and revalidated immediately before every provider call; a quote/enqueue verdict is never sufficient for later dispatch.
- Lack of evidence is `unknown`, not consent.
- Recording, correction, expiry, and withdrawal append evidence; they do not rewrite the historical basis used by a past send.
- A public number, imported note, or browser checkbox does not itself prove opt-in unless the active policy explicitly recognizes its evidence source and required fields.

### 3.12 Outreach Template

Suggested fields:

- internal identity/version;
- connector/channel;
- provider template identity/version;
- approval status and locale;
- variable schema;
- active/superseded timestamps.

Rules:

- Only approved active versions satisfy a connector requiring approval.
- Each send stores the exact selected version and rendered non-secret variables.

### 3.13 Outreach Send

Suggested fields:

- `id`, `workspaceId`, `leadId`;
- `projectLinkId`, `publicationReferenceId`;
- `connectorAccountId`, `channel`;
- normalized recipient snapshot;
- `templateVersionId`, rendered message metadata;
- `idempotencyKey`, parent batch identity where applicable;
- `status`: queued, blocked, dispatching, accepted, delivered, failed, canceled;
- provider send/reference ID;
- typed block/failure reason and retryability;
- usage/charge identity;
- lifecycle timestamps.

Rules:

- Exactly one Lead and one Publication Reference per send.
- Compliance is evaluated before provider dispatch.
- Provider callbacks are deduplicated and may only apply valid forward/terminal transitions.
- A policy-defined qualifying provider outcome may advance New → Contacted exactly once; the activation projection derives from that durable outcome rather than receiving an independent mutation.

### 3.14 Activation Projection

Suggested fields:

- `workspaceId`;
- `leadCount`, `projectCount`, `sendCount`;
- target values;
- per-milestone completion and `cycleComplete`;
- source watermark/rebuild metadata;
- `updatedAt`.

Rules:

- Rebuildable from authoritative committed records.
- Counts are unique domain outcomes, not raw button clicks or duplicate events.
- Errors do not fold to zero; unavailable data surfaces an unavailable state.

### 3.15 Subscription and Usage Ledger

Subscription meaning:

- provider customer/subscription identities;
- normalized status such as trialing, active, past-due, canceled;
- current plan/tier and cadence;
- current period and pending changes;
- last applied provider event identity/timestamp.

Usage entry meaning:

- `id`, `workspaceId`, `idempotencyKey`;
- action type and quantity/unit;
- reservation, debit, release, reversal, or grant;
- related discovery/project/send identity;
- provider cost evidence where available;
- status and timestamps.

Rules:

- Stored billing-provider state, not the browser, determines entitlement.
- Monetary/allowance effects are idempotent and atomic with the guarded operation where necessary.
- Discovery units remain distinguishable from AI/generation and outreach units.

### 3.16 Operator Policy Release

Versioned operational configuration such as:

- qualification rule set;
- discovery count options and plan limits;
- connector routing;
- approved outreach templates;
- activation targets;
- rate/velocity controls;
- retention policy.

Rules:

- Material policy is versioned and auditable.
- Historical operations retain the policy/version they used.
- Provider secrets are not embedded inside policy payloads.

## 4. State machines

### Discovery Run

```text
queued → running → succeeded
              ├→ failed
              └→ canceled
```

No transition leaves a terminal state except an explicit new retry Run linked by lineage.

### Pipeline

Manual movement may use any allowed product transition, but automation only performs:

```text
New --successful qualifying send--> Contacted
```

It never rewinds later stages.

### Project Link

```text
creating → active
        └→ failed
active → archived | unlinked
```

### Outreach Send

```text
queued → blocked
      └→ dispatching → accepted → delivered
                    └→ failed
queued/dispatching → canceled (only when the executor proves no provider call has begun)
```

Provider callbacks cannot change `blocked`, `failed`, `delivered`, or `canceled` arbitrarily. Exact allowed transitions must be defined in implementation.

## 5. Cross-entity invariants

1. All related identities belong to the same authorized Workspace.
2. Candidate→Lead confirmation is idempotent.
3. Lead→Project creation/link is idempotent.
4. Send→provider dispatch is idempotent.
5. The policy-defined qualifying send outcome→pipeline advance, usage, and activation are exactly once.
6. A blocked send causes no provider call and no success usage debit.
7. Every send references the exact Publication used.
8. Historical send records are not rewritten by republish, template replacement, recipient edits, or pipeline movement.
9. Missing facts are never invented by provider adapters, qualification, UI presenters, or project generation; a blank/generic project is not a valid prospect-project outcome.
10. There is one billing/subscription/entitlement/usage authority. Jagwar records extend or reconcile the chosen Onlook authority rather than competing with it.
11. Place/map imagery is discovery context only until rights are separately established.
12. Current projections may be recomputed; immutable evidence and ledgers are not silently rewritten.
13. `JagwarBusinessContextV1` is read-only AI input: verified facts/provenance and generated guidance remain distinct, and the context cannot mutate, save, publish, authorize, or charge.
14. Internal cost observations are not customer charges or entitlements. Pricing and enforcement require a later approved commercial release.
15. Every target implementation concept has one Onlook-native package/feature owner; no donor-structure compatibility layer or duplicate generic module becomes authority.

## 6. Event vocabulary

Events are integration signals, not an excuse to duplicate authority. Suggested meanings:

- `discovery.run.started|succeeded|failed|canceled`
- `lead.confirmed|created|updated|stage_changed|suppressed`
- `qualification.completed|failed|stale`
- `project.link.created|failed|selected`
- `publication.resolved|unavailable`
- `outreach.send.queued|blocked|accepted|delivered|failed|canceled`
- `activation.changed|completed`
- `usage.reserved|debited|released|reversed|granted`
- `subscription.changed`

Each event requires a stable event identity, Workspace, aggregate identity, version/order information where needed, timestamp, actor/system origin, and trace/correlation identity.
