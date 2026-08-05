# Security, Privacy, and Data-Integrity Review

## Verdict

**CONDITIONAL — sound authority model, but not implementation-ready for durable provider work or outreach.**

The spine makes the right high-level choices: server-derived user ownership, explicit project membership, PostgreSQL as durable authority, minimal queue messages, fenced/idempotent effects, immutable publication snapshots, and strict separation of cost observations from Onlook billing. Before Story 1.4 or any provider-backed slice, the architecture must bind those principles to database constraints, database-role privileges, and an authenticated worker protocol. Before any real outreach, it must add a mandatory send-time consent/suppression gate and a credential/retention design.

This review does not approve any protected-file change or production provider use.

## Blocking findings

### S1 — Send-time consent and suppression are not an explicit architecture invariant

**Severity:** Critical for outreach

AD-7 governs dispatch and AD-13 says the browser is not authoritative, but no rule requires the worker to re-read consent, revocation, suppression, channel/address, policy release, and Publication Reference immediately before the provider call. Admission-time validation is insufficient: consent can be revoked, a suppression can be added, membership can be removed, or the selected publication can cease to be eligible while an operation waits or retries.

Required architecture amendment:

- Treat consent evidence, revocation, and suppression changes as append-only evidence with server actor, source, occurrence time, effective time, policy/version, content hash, and provenance.
- Immediately before dispatch, load the operation by its persisted owner; revalidate current consent scope and recipient/channel/address, effective suppression, compliance policy version, current project membership, and the immutable Publication Reference's relationship to the Lead and deployment.
- Commit an immutable send-authorization decision and the atomic dispatch-start marker in one transaction. The decision must reference the exact evidence and policy release examined; it must not copy secrets or raw provider payloads.
- Serialize competing recipient/channel decisions with a database guard so a concurrent suppression/revocation cannot be missed before dispatch starts. Define dispatch start as the cutoff: after it commits, a provider result is reconciled rather than mislabeled canceled.
- A retry must make a fresh eligibility decision unless it is reconciling an already-started provider request under the same idempotency key.

Minimum proof: deterministic tests for revoke-before-claim, suppress-during-retry, wrong-address consent, expired/out-of-scope consent, concurrent suppression versus dispatch start, stale publication, removed project membership, and duplicate delivery reconciliation. All must fail closed without calling the provider.

### S2 — Cross-user isolation needs database-enforced same-owner relationships and an explicit RLS/bypass model

**Severity:** High

AD-2, AD-3, and AD-12 require owner checks, but random IDs plus application filters are not enough where the web server and worker use direct PostgreSQL credentials that may bypass RLS. A missed predicate or an ID from another account could compose a Lead, operation, Project Link, consent record, or send across users.

Required architecture amendment:

- Every root and child business row carries non-null `user_id` derived from the authenticated session or loaded operation; no public mutation accepts an authoritative owner value.
- Enforce same-owner references with composite candidate keys and foreign keys such as `(user_id, id)`, including operation-to-aggregate, Lead-to-Project Link, Lead-to-consent/suppression, Publication Reference-to-send, and cost-observation-to-operation.
- Define which PostgreSQL role each path uses: migration owner, web application, internal worker, Supabase `authenticated`, `anon`, and service/admin. State explicitly which roles bypass RLS.
- Add owner-scoped RLS policies as defense in depth and revoke direct mutation from browser-facing roles unless the intended path explicitly requires it. Application and worker authorization checks remain mandatory even if RLS is present.
- Use fail-closed access helpers and return indistinguishable not-found/forbidden responses. Provider IDs, project IDs, deployment IDs, and operation IDs are never authorization tokens.
- Specify deletion behavior for every cross-owner relationship; avoid cascades that erase audit/consent evidence accidentally.

Minimum proof: matrix tests across two users for reads, mutations, guessed IDs, child inserts, joins, operation claim, Project Link creation, Publication Reference creation, and send dispatch through both tRPC and any enabled Supabase Data API path.

### S3 — The queue/worker trust boundary and PGMQ privileges are incomplete

**Severity:** High

The minimal queue payload in AD-6 is strong, but an internet-reachable internal route protected only by an unspecified secret and broad database privileges can become a cost-amplification or cross-user execution endpoint. PGMQ functions/schema access also must not be exposed to `anon`, `authenticated`, or ordinary browser RPC.

Required architecture amendment:

- Cron calls a body-independent, bounded claim endpoint over TLS with a dedicated, high-entropy bearer credential sourced from Supabase Vault on the caller and server-only validated environment on the receiver. Compare without timing leakage, never log the credential, support controlled rotation, reject all other methods/content, and bound request frequency and batch size.
- The request must not choose an operation, owner, kind, provider, or payload. The authenticated worker claims from the one allowlisted queue and derives every authority from the persisted operation.
- Pin the queue name and allowed operation-kind/payload-version registry. Unknown or disabled kinds go to a terminal operator-visible state without executing an adapter.
- Revoke PGMQ schema/function access from public/browser roles; grant only the least-privileged admission and worker database roles the exact send/read/delete/archive capabilities they require. Keep provider credentials out of PGMQ, operation payloads, traces, errors, and archives.
- Prevent overlapping Cron invocations from exceeding concurrency/cost bounds. An authenticated trigger is permission to attempt a bounded claim, not permission to execute caller-selected work.
- Record secret-rotation, queue-role, and Cron configuration checks in the Story 1.4 preflight; do not treat extension availability alone as readiness.

Minimum proof: unauthorized/replayed/malformed calls perform no claim; browser roles cannot call queue functions; unknown kinds cannot dispatch; overlapping consumers remain within concurrency bounds; logs contain no credential or queue payload beyond approved identifiers.

### S4 — Fencing is stated but the external-effect commit protocol is not yet strong enough

**Severity:** High

Visibility timeouts and a persisted lease can diverge. A slow worker may perform an external effect after its lease expires while a second worker starts the same operation. A stable provider idempotency key helps only where the provider implements and durably honors it.

Required architecture amendment:

- Enforce a unique admission key such as `(user_id, operation_kind, idempotency_key)` and immutable operation identity at the database layer.
- Issue a monotonically increasing fencing token on every successful claim. Every attempt/status/result/cost mutation uses compare-and-set against the current token; stale workers cannot commit.
- Choose a queue visibility timeout longer than the bounded handler deadline and define lease renewal or explicit non-renewable handling. Abort before provider dispatch if the remaining lease cannot cover the call budget.
- Persist an atomic dispatch-start record containing fence, provider adapter/version, stable provider idempotency key, and request hash before the call. Persist provider receipt/result under a uniqueness constraint. Never repeat a non-idempotent call until reconciliation establishes that the first did not occur.
- Define adapter-specific reconciliation as a prerequisite for enabling a real provider. If a provider supplies neither idempotency nor reliable lookup, it is not eligible for automated retry.
- Archive/delete the PGMQ message only after the terminal database transition commits. Poison messages have a bounded attempt ceiling and operator-visible dead-letter state without sensitive payloads.

Minimum proof: crash before call, crash after call/before commit, lease expiry during call, two consumers, stale-fence mutation, provider timeout with eventual receipt, cancellation before and after dispatch start, and redelivery after archive failure.

## Required hardening findings

### S5 — Project and Publication Reference authorization must be revalidated at every authority transition

**Severity:** High

AD-9 and AD-10 identify the correct native records, but the rule should require live, server-side relationship checks rather than trusting a previously valid Project Link or a user-provided URL.

Required controls:

- Project association verifies the business-row owner, current `user_projects` membership, and canonical Onlook project in one server-authoritative flow. The worker repeats membership checks before project creation/resume and before marking personalized-draft evidence complete.
- Publication Reference creation loads a completed deployment through the canonical project relationship; verifies its project equals the authorized Project Link's project; and derives deployment ID, type, public URL, publish time, and version from Onlook records. None are accepted from the browser.
- Send-time validation rechecks owner and current project membership and uses only the snapshotted exact public URL. Past sends remain immutable, but an unsent reference must become ineligible if authorization is removed.
- Canonicalize and validate the deployment URL as an approved HTTPS publication URL. Never fetch or follow a user-supplied URL as part of authorization.

### S6 — Evidence, raw provider data, and retention need a data-classification contract

**Severity:** High before real discovery/outreach data

AD-8 permits policy-approved raw provider evidence and AD-12 says evidence is append-only, while retention remains deferred. This leaves access, minimization, correction, erasure, archive expiry, and the conflict between immutable audit evidence and privacy deletion undefined.

Required controls:

- Default to not retaining raw provider payloads. When evidence is necessary, validate an allowlisted evidence schema, redact unnecessary personal/sensitive fields, cap size, record source/license/terms/provenance, encrypt or tokenize sensitive fields where warranted, and store it outside facts, queue messages, telemetry, and UI state.
- Make authoritative evidence append-only through privileges and database controls, not convention alone. Corrections and revocations append superseding records; mutable projections point to the active version. Hashes detect accidental mutation but are not a substitute for authorization.
- Establish retention classes for candidate snapshots, raw provider evidence, operation payload/results, dead letters, queue archives, logs/traces, consent/revocation/suppression evidence, publication snapshots, and cost observations. Each class needs owner, purpose, expiry/deletion action, legal hold behavior, and restore/backup treatment.
- Until OD-9 is approved, real-person discovery and real outreach data remain blocked or operate under an explicitly approved short-lived non-production policy. Deterministic fixtures contain no real personal data.
- Deletion/erasure must propagate to derived projections and provider copies while preserving only the minimal separately governed proof that must remain. Do not silently cascade-delete consent/suppression or send evidence.

### S7 — Connector credentials and secrets need a dedicated authority before a real adapter

**Severity:** High before real providers

The general secret convention is correct but does not define storage for per-user OAuth tokens/API credentials, access scope, rotation, revocation, or audit. A connector row must never become a secret store by accident.

Required controls:

- Persist only an opaque credential reference and safe connector metadata in domain rows. Store secret material in the approved server-side vault/secret authority, encrypted and inaccessible to browser and general query paths.
- Load credentials only inside the adapter after the operation and owner are authorized; never include them in DTOs, queue messages, policy payloads, logs, traces, errors, cost observations, or provider evidence.
- Bind a credential reference to owner, provider, environment, scope, status, creation/rotation/revocation times, and audit actor. Revalidate active state at dispatch.
- Redact provider request/response logging by default and allowlist safe diagnostics. A UI can display status and a fingerprint, never a recoverable credential.
- Add incident-safe revoke/rotate procedures and tests before enabling any real adapter.

### S8 — Cost observations need physical as well as semantic separation from billing

**Severity:** Medium

AD-11 correctly makes cost telemetry observational. Preserve that boundary in schema and APIs so a later convenience query cannot turn telemetry into entitlement or charges.

Required controls:

- Store cost observations in an operation-owned append-only table/module with no trigger, mutation path, or write-through to `usage_records`, `rate_limits`, subscriptions, prices, checkout, or Stripe.
- Do not expose a public/client mutation. Only the authorized worker/application service can append an observation for an operation with the same owner and fence.
- Record currency, unit, quantity, estimate/actual status, pricing-source/version and effective time, retry/attempt lineage, and correction/supersession rather than overwriting history.
- Keep observations free of Lead/contact content, publication URLs, credentials, provider payloads, and customer-facing descriptions. Use opaque operation/trace linkage.
- Regression tests must prove cost-observation writes cannot grant access, debit allowance, trigger billing, or gate the UI.

### S9 — External facts rendered into the AI prompt remain untrusted input

**Severity:** Medium

`JagwarBusinessContextV1` separates facts from guidance, but discovered page/provider text can contain prompt-injection instructions, markup, tracking URLs, or oversized content. Schema validity does not make it trustworthy.

Required controls:

- The context validator accepts only bounded, typed, provenance-linked business facts and explicit unknowns. It rejects executable content and does not pass arbitrary raw page/provider text into the PROMPT context.
- The renderer uses deterministic field labels and unambiguous delimiters, treats all external content as data rather than instructions, caps field and aggregate sizes, and keeps rights-cleared asset references distinct.
- Generated guidance is visibly and structurally non-evidence. It cannot promote itself into verified facts, change project/publication authorization, or carry save/apply/publish/billing authority.
- Add adversarial fixtures containing instruction-like business names/descriptions, markup, URLs, Unicode controls, and oversized values; verify exact facts remain bounded and unknowns are omitted rather than invented.

## Security acceptance gate

The architecture can move from **CONDITIONAL** to **READY FOR NON-PRODUCTION IMPLEMENTATION** when the spine or a binding companion specifies:

1. The send-time eligibility transaction and immutable decision evidence from S1.
2. Composite same-owner constraints, role/RLS matrix, and two-user isolation tests from S2.
3. Internal-worker authentication, PGMQ privilege grants/revocations, allowlisted kinds, and concurrency limits from S3.
4. The fenced dispatch/reconciliation protocol and adapter eligibility rule from S4.
5. Project/publication live authorization checks from S5.
6. An interim data-minimization/retention policy and a credential authority before any real provider is enabled.
7. Physical non-authority guarantees for cost observations.

Production outreach remains separately blocked by the handoff's legal/commercial decisions, explicit runbook approval, and completion of the consent/suppression, credential, retention, and provider-specific reconciliation evidence above.
