---
title: Integration Contracts — Jagwar Business Workflows
status: final
created: 2026-07-28
updated: 2026-07-28
architectureBinding: provider-neutral
---

# Integration Contracts

## 1. Purpose

These are conceptual boundary contracts for the new Onlook-based implementation. The receiving architecture may represent them as application services, ports/adapters, server procedures, queues, workflow steps, or another native pattern. Preserve the semantics, not the legacy Telio file layout.

All contracts require runtime validation at external and persistence boundaries and closed, safe error results.

These are semantic contracts, not permission to reproduce donor Telio layering. The target places them in focused Onlook-style packages or route-local features, exposes reusable behavior through package entry points, and preserves existing Onlook public behavior. Any required edit to a file in the pinned Onlook baseline follows the per-file Core Change Request protocol.

## 2. Common types

```ts
type OperationContext = {
  actorId: string;
  ownershipScopeId: string; // target-native user/project/team scope, derived server-side
  requestId: string;
  traceId: string;
};

type OperationError = {
  code: string;
  message: string;       // safe for the intended caller
  retriable: boolean;
  retryAfterMs?: number;
};

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: OperationError };
```

Rules:

- Provider exceptions, database errors, secrets, and raw payloads never cross as user-facing errors.
- Ownership authority is re-derived from authenticated target context at the server. `ownershipScopeId` is conceptual until OD-2 maps it to the pinned Onlook commit.
- Every cost-bearing or externally visible mutation requires an idempotency key.
- These contracts extend one target-native subscription, entitlement, allocation, and usage authority. They do not authorize a parallel Jagwar billing ledger.

## 3. Lead discovery

```ts
type LeadDiscoveryCapabilities = {
  provider: string;
  supportsInteractive: boolean;
  supportsBackground: boolean;
  supportsCoordinates: boolean;
  supportsEmail: boolean;
  supportsStablePlaceIdentity: boolean;
  maxResultsPerRequest: number;
};

type LeadDiscoveryRequestV1 = {
  query: string;
  requestedCount: number;
  locale?: string;
  country?: string;
  idempotencyKey: string;
};

type CandidateV1 = {
  providerCandidateId: string | null;
  businessName: string;
  address: string;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  reviewCount: number | null;
  rating: number | null;
  category: string | null;
  openingHours: Array<{ day: string; opens: string | null; closes: string | null }> | null;
  serviceTags: string[];
  latitude: number | null;
  longitude: number | null;
  photoRefs: string[];
  sourceProvider: string;
  observedAt: string;
};

interface LeadDiscoveryProvider {
  capabilities: LeadDiscoveryCapabilities;
  search(request: LeadDiscoveryRequestV1): Promise<Result<CandidateV1[]>>;
}
```

Required adapter behavior:

- Validate request before the provider call.
- Enforce provider timeout and cancellation policy.
- Normalize before returning.
- Convert absent fields to explicit null according to the contract.
- Never fabricate email, phone, website, coordinates, rating, review count, or category.
- Return provider-unavailable/timeouts as typed retryable failures.
- Record provider usage at the orchestration boundary, not inside UI code.

Provider decision notes:

- Donor Jagwar used DataForSEO for fast interactive Google Maps discovery after Outscraper queue latency proved unsuitable.
- That is useful evidence, not a permanent target decision. Benchmark latency, terms, completeness, and cost before locking the target adapter.

## 4. Website inspection

```ts
type WebsiteInspectionRequestV1 = {
  url: string | null;
  sourceConfirmsWebsiteFieldCoverage: boolean;
  sourceConfirmsWebsiteAbsent: boolean;
  candidateId: string;
  policyVersion: string;
  idempotencyKey: string;
};

type WebsiteInspectionResultV1 = {
  status: 'missing-site' | 'weak-site' | 'has-site';
  reasons: Array<{
    code: string;
    outcome: 'pass' | 'fail' | 'unknown';
    evidence?: string;
  }>;
  inspectedUrl: string | null;
  inspectedAt: string;
  policyVersion: string;
};

interface WebsiteInspector {
  inspect(request: WebsiteInspectionRequestV1): Promise<Result<WebsiteInspectionResultV1>>;
}
```

Required behavior:

- Null website produces `missing-site` only when the source confirms both website-field coverage and explicit absence.
- Null website without source coverage/absence evidence produces an unknown/failed qualification outcome, not `missing-site`.
- Network, robots, TLS, or parsing failures do not automatically produce `weak-site`.
- Redirect destination and inspection evidence are retained safely.
- User-facing reasons avoid unsupported legal, security, or business claims.

## 5. Phone intelligence

```ts
type PhoneIntelligenceResultV1 = {
  normalizedPhone: string;
  lineType: 'mobile' | 'landline' | 'fixed-voip' | 'toll-free' | 'other' | 'unknown';
  provider: string;
  observedAt: string;
};

interface PhoneIntelligenceProvider {
  lookup(phone: string, idempotencyKey: string): Promise<Result<PhoneIntelligenceResultV1>>;
}
```

Failure is recorded independently and does not fail discovery. WhatsApp eligibility is a later connector/compliance decision.

## 6. Lead service operations

```ts
interface LeadApplicationService {
  confirmCandidates(input: {
    runId: string;
    candidateIds: string[];
    idempotencyKey: string;
  }, context: OperationContext): Promise<Result<Array<{
    candidateId: string;
    leadId: string;
    created: boolean;
  }>>>;

  createManualLead(input: ManualLeadInputV1, context: OperationContext): Promise<Result<{ leadId: string }>>;

  moveLead(input: {
    leadId: string;
    toStage: PipelineStage;
    expectedVersion?: number;
    idempotencyKey: string;
  }, context: OperationContext): Promise<Result<LeadSummaryV1>>;
}
```

Required behavior:

- Batch confirmation can report per-Candidate existing/created results.
- Cross-Workspace candidate IDs fail; they are not silently skipped.
- Deduplication and link creation are atomic enough to prevent repeated UI submission from duplicating Leads.
- Stage automation and manual moves use the same authoritative mutation boundary.

## 7. Onlook project integration

```ts
type JagwarBusinessContextV1 = {
  leadId: string;
  verifiedFacts: Array<{
    key: string;
    value: string;
    provenanceRef: string;
    observedAt?: string;
  }>;
  explicitUnknowns: string[];
  qualificationEvidenceRefs: string[];
  brandContext?: {
    voice?: string;
    designPreferences?: string[];
    rightsClearedAssetRefs: string[];
  };
  designDirection?: string;
  generatedGuidance: string[];
};

type ProjectAuthority = {
  projectId: string;
  workspaceId: string;
  status: 'creating' | 'ready' | 'failed' | 'archived';
};

type PublicationAuthority = {
  projectId: string;
  deploymentId: string;
  publicUrl: string;
  status: 'ready' | 'unavailable' | 'failed';
  publishedAt: string;
  versionRef?: string;
};

interface ProspectProjectService {
  createFromLead(input: {
    leadId: string;
    businessContext: JagwarBusinessContextV1;
    idempotencyKey: string;
  }, context: OperationContext): Promise<Result<ProjectAuthority & {
    seedEvidence: {
      personalized: true;
      businessNamePresent: true;
      selectedFactRefs: string[];
      omittedUnknownFactRefs: string[];
      editableArtifactRef: string;
    };
  }>>;

  linkExisting(input: {
    leadId: string;
    projectId: string;
    idempotencyKey: string;
  }, context: OperationContext): Promise<Result<ProjectAuthority>>;

  resolvePublication(input: {
    leadId: string;
    projectId: string;
  }, context: OperationContext): Promise<Result<PublicationAuthority>>;
}
```

Boundary rules:

- Implement through Onlook's native project services and authorization.
- Never write project source files or mutations directly from dashboard components.
- Never create a parallel canonical Site record containing copied Onlook code/document state.
- Project creation input separates verified facts/evidence from generated copy instructions.
- Creation is successful only when the editable first draft is prospect-specific. A blank project, generic starter, or artifact lacking the Lead's business name fails the operation.
- The adapter records which available Lead facts were selected, which unknown facts were omitted, and the target-native editable artifact reference so browser acceptance can verify the rendered result.
- Publication resolution returns an immutable/snapshot reference suitable for a send.
- `JagwarBusinessContextV1` is assembled in a new validated Jagwar-owned module and passed through an existing Onlook public composition seam where available.
- It is input only. It cannot save, apply source edits, publish, authorize a project, or debit usage.
- Existing Onlook AI prompts, agents, tools, registries, streams, managers, modes, and apply semantics remain unchanged by default. Missing extension support triggers a Core Change Request, not an unapproved core patch.

## 8. Outreach connector

```ts
type OutreachCapabilitiesV1 = {
  connector: string;
  channel: string;
  recipientKinds: Array<'phone' | 'email' | 'account-id'>;
  requiresApprovedTemplate: boolean;
  requiresRecipientOptIn: boolean;
  supportsDeliveryReceipts: boolean;
  supportsProviderIdempotency: boolean;
  maxMessageLength?: number;
};

type OutreachSendRequestV1 = {
  recipient: string;
  publicationUrl: string;
  templateRef: string | null;
  templateVariables: Record<string, string>;
  idempotencyKey: string;
};

type OutreachDispatchAcceptanceV1 = {
  providerSendId: string;
  connector: string;
  channel: string;
  status: 'accepted';
  acceptedAt: string;
};

interface OutreachConnector {
  capabilities: OutreachCapabilitiesV1;
  send(request: OutreachSendRequestV1): Promise<Result<OutreachDispatchAcceptanceV1>>;
}

interface OutreachConnectorFactory {
  forAccount(input: {
    connectorAccountId: string;
    ownershipScopeId: string;
  }, serverContext: unknown): Promise<Result<OutreachConnector>>;
}
```

The server-only factory resolves the Connector Account's credential reference and constructs a configured connector. Persisted jobs contain `connectorAccountId`, never a plaintext secret or transport-ready credential. The connector's `send()` receives only the normalized business payload. Provider acceptance and delivery are separate states; delivery is applied only from a verified callback or an equally authoritative provider query.

## 9. Compliance gate

```ts
type OutreachComplianceContextV1 = {
  recipientValid: boolean;
  recipientSuppressed: boolean;
  hasRequiredOptIn: boolean;
  approvedTemplateRef: string | null;
  publicationEligible: boolean;
  connectorActive: boolean;
};

type OutreachComplianceVerdictV1 =
  | { allowed: true; templateRef: string | null }
  | {
      allowed: false;
      code:
        | 'recipient_invalid'
        | 'recipient_suppressed'
        | 'opt_in_required'
        | 'template_not_approved'
        | 'publication_unavailable'
        | 'connector_unavailable';
    };
```

Evaluation order should prefer the safest and most actionable reason. A blocked verdict occurs before provider dispatch and before successful usage debit. A quote is advisory: the authoritative suppression, consent, template, Publication, connection, and entitlement records are re-read and revalidated immediately before every provider call.

## 10. Outreach application service

```ts
interface OutreachApplicationService {
  quote(input: {
    leadIds: string[];
    channel: string;
  }, context: OperationContext): Promise<Result<{
    eligible: EligibleSendPreview[];
    blocked: BlockedSendPreview[];
    usageQuote: UsageQuoteV1;
  }>>;

  enqueue(input: {
    leadIds: string[];
    channel: string;
    batchIdempotencyKey: string;
  }, context: OperationContext): Promise<Result<{
    batchId: string;
    sends: Array<{ leadId: string; sendId?: string; blockedCode?: string }>;
  }>>;

  receiveProviderEvent(input: unknown): Promise<Result<{ applied: boolean }>>;
}
```

Required orchestration order for each durable dispatch attempt:

1. authorize Workspace and Lead;
2. resolve recipient and current suppression/consent evidence;
3. resolve current Project Link and exact Publication;
4. resolve Connector Account/capabilities and approved template;
5. run compliance gate for preview/admission;
6. reserve/check allowance atomically where needed;
7. create durable send;
8. immediately before the provider call, re-read all compliance inputs and entitlement and run the gate again;
9. if the second gate blocks, record the block and release the reservation without contacting the provider;
10. resolve a configured Connector through the server-only factory and dispatch with provider idempotency;
11. record provider acceptance separately from later delivery;
12. commit/release usage according to the policy's explicit lifecycle point;
13. advance New → Contacted exactly once on the configured qualifying outcome; activation consumes this durable record rather than being mutated independently.

Cancellation is allowed only while the durable operation can prove that no provider call has begun. Cancellation releases unused reservations. Once the provider has accepted a request, the system must not relabel it canceled.

## 11. Credential vault

```ts
interface CredentialVault {
  write(ref: { workspaceId?: string; provider: string; purpose: string }, plaintext: string): Promise<Result<{ credentialRef: string }>>;
  resolve(credentialRef: string, serverContext: unknown): Promise<Result<string>>;
  disable(credentialRef: string): Promise<Result<void>>;
}
```

Rules:

- `resolve` is server-only and callable only from authorized adapter composition.
- Reads/writes are audited without logging plaintext.
- Workspace-owned and operator-global credentials have explicitly different scopes.
- The UI displays connection metadata or masked identifiers, never recoverable plaintext.

## 12. Usage and entitlement

```ts
type UsageAction =
  | 'discovery.request'
  | 'discovery.candidate'
  | 'qualification.website'
  | 'qualification.phone'
  | 'project.create'
  | 'outreach.send';

interface UsageService {
  quote(input: UsageQuoteInputV1, context: OperationContext): Promise<Result<UsageQuoteV1>>;
  reserve(input: UsageReservationInputV1, context: OperationContext): Promise<Result<{ reservationId: string }>>;
  commit(reservationId: string, outcome: UsageOutcomeV1): Promise<Result<void>>;
  release(reservationId: string, reason: string): Promise<Result<void>>;
}

interface EntitlementService {
  resolve(context: OperationContext): Promise<Result<{
    entitled: boolean;
    plan: string | null;
    subscriptionState: string;
    limits: Record<string, number>;
  }>>;
}

interface InternalCostObservationService {
  observe(input: {
    action: UsageAction | 'sandbox.runtime' | 'hosting.deploy' | 'storage.egress';
    quantity: number;
    unit: string;
    relatedOperationId: string;
    providerCostMinor?: number;
    currency?: string;
    outcome: string;
    observedAt: string;
  }, context: OperationContext): Promise<Result<void>>;
}
```

Money/COGS rules:

- Browser plan claims are ignored.
- Same idempotency identity cannot debit twice.
- Blocked work does not commit success usage.
- Retry/reconciliation can determine whether a reservation was applied.
- Provider webhooks are verified, normalized, ordered, and idempotent.
- Trial and recurring allocations have stable source identities and can be applied only once.
- The target implementation must reconcile these operations with Onlook's existing subscription/usage records and retain one commercial authority.
- During the rebuild, internal cost observations are non-enforcing evidence. They do not create a customer charge, plan, allowance debit, or entitlement until the final commercial model is approved.

## 13. Durable operation authority

Discovery and outreach require one target-native durable execution authority. Before either workflow is implemented, the receiving architecture must identify or introduce a single bounded facility that provides:

- durable enqueue and terminal state;
- leased execution with crash recovery;
- idempotent retry and provider reconciliation;
- cancellation before external dispatch;
- reservation release on cancellation or pre-billable failure;
- transactional event/outbox behavior where a database mutation must trigger work;
- trace and request correlation from admission through provider outcome;
- retention and redaction consistent with policy.

The browser may request or observe work, but it is not the job runner. In-memory promises, route-lifetime background work, and local storage do not satisfy this contract.

## 14. Operator configuration

Use versioned, validated configuration categories rather than a single arbitrary JSON blob:

- qualification policy;
- discovery allowances/routing;
- outreach templates and routing;
- activation targets;
- commercial limits;
- retention/suppression policy.

Every release records actor, version, effective time, validation result, and safe diff. Secrets remain separate.

## 15. Error taxonomy

Minimum stable categories:

- authorization: `not_authenticated`, `workspace_forbidden`, `resource_forbidden`;
- validation: `invalid_input`, `unsupported_count`, `invalid_recipient`;
- discovery: `provider_unavailable`, `provider_timeout`, `no_results` only as successful domain outcome;
- qualification: `inspection_failed`, `phone_lookup_failed`, `evidence_stale`;
- project: `project_unavailable`, `publication_unavailable`, `project_link_conflict`;
- outreach: `connector_unavailable`, `opt_in_required`, `recipient_suppressed`, `template_not_approved`, `send_failed`;
- commercial: `not_entitled`, `allowance_exhausted`, `rate_limited`, `usage_conflict`;
- concurrency: `version_conflict`, `idempotency_conflict`;
- internal: a safe opaque internal-failure result linked to logs by trace ID.
