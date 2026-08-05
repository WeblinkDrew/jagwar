# Proposal: Establish Workspace Authority

## Change

`establish-workspace-authority`

## Status and authority

Planning-only downstream proposal. The OpenSpec umbrella `reconfirm-jagwar-product-contract` is canonical product and planning authority; the current repository is implementation authority. The umbrella's native proposal, twelve specifications, design, and planning roadmap are complete, while umbrella apply, verify, sync, and archive remain blocked by design.

The user-authorized sequence for this change is planning only: proposal → specifications → design → tasks. It does **not** authorize runtime implementation, database changes, migrations, provider activation, apply/verify/sync/archive activity, protected Onlook baseline edits, generated-file or `bun.lock` changes, commits, editor work, unrelated dirty-file changes, or Story 1.3b work.

## Intent

Establish the planning boundary for the first downstream foundation: one authoritative workspace identity and one server-derived actor authority model shared by all later Jagwar capabilities. Today the repository is implementation authority but does not yet provide the umbrella contract's durable, capability-owned workspace and membership foundation. Allowing each later capability to infer ownership, trust client-selected workspace or role state, or invent independent membership checks would create cross-workspace disclosure risk, inconsistent Owner-only behavior, stale-member access, incomplete audits, and expensive rework.

The desired product outcome is that an authenticated Jagwar user can act only within a workspace in which they have current membership, as exactly an Owner or Member, and every protected operation can consume a stable server-owned authorization contract. Workspace authority must make normal Member workflows possible while reserving membership administration and sensitive settings/integrations for Owners. It must fail closed under cross-workspace identifiers, removal, stale role state, or concurrent authority changes without relying on client visibility as security.

## Scope

### 1. Authoritative workspace identity

- Define a durable workspace as the ownership boundary for Jagwar product records and operations.
- Define authoritative relationships between authenticated Supabase user identity, workspace identity, and current membership.
- Treat local businesses as workspace-owned leads or clients, never as Jagwar subscriber identities merely because they are discovered, contacted, hosted, or marked Won.
- Require dependent resources to carry or resolve one authoritative workspace owner. A user-supplied workspace or resource identifier is input to authorization, never proof of ownership.
- Preserve inherited user/project behavior until a later capability explicitly contracts the narrow relationship between an inherited resource and authoritative workspace ownership.

### 2. Owner and Member roles

- Support exactly `Owner` and `Member` in V1; no custom roles or client-defined permission sets.
- Owners administer memberships and sensitive workspace settings/integrations.
- Members perform ordinary authorized workspace workflows, including later selection of available website presets and reading/replying in Inbox, subject to each owning capability's additional gates.
- Owner authority must be checked server-side at the operation boundary. Hidden controls, route access, cached UI state, request claims, and Supabase authentication alone do not grant Owner authority.
- Workspace authority owns the role and membership decision; it does not own capability-specific eligibility such as subscription, balance, provider readiness, consent, pipeline state, or hosting lifecycle.

### 3. Membership lifecycle

- Plan durable membership states and transitions sufficient for invitation/acceptance where adopted, activation, Owner/Member role change, removal, and auditable failed or conflicted administration.
- Every membership mutation must be workspace-scoped, attributable to a current authorized Owner, and concurrency-safe.
- Stale administrative writes must not silently overwrite a newer membership or role decision. A version or equivalent optimistic authority token must support explicit conflict outcomes.
- A removed member must lose authority on every subsequent server authorization even when an existing browser session or UI still shows the workspace.
- Planning must preserve a valid administration path for each workspace and must not permit concurrency races to leave authority in an unowned or ambiguous state. Exact final-Owner transfer/removal rules remain a specification decision called out in the proposal question round.

### 4. Server-derived actor context

- Authenticate through the established server boundary, then resolve fresh authoritative membership and role for the requested workspace.
- Produce a narrow actor context suitable for downstream services: authenticated subject, workspace identity, membership identity, current role, authority version or equivalent freshness evidence, and audit-safe request/operation correlation.
- Never accept a client-supplied role, membership status, actor identity, or workspace ownership assertion as authority.
- Keep actor context server-only except for intentionally sanitized presentation data. It must not expose Supabase secrets, service credentials, raw tokens, or unrelated membership data.
- Distinguish human actors from explicit system actors for future webhook, scheduler, reconciliation, lifecycle, and projection work. System authority must be narrow, named, and auditable rather than impersonating an Owner.

### 5. Server-enforced workspace and resource authorization

- Require protected capability boundaries to authorize both current workspace membership and target resource ownership before reads, writes, provider calls, or sensitive data disclosure.
- Define public decisions for `require workspace member`, `require workspace Owner`, and `authorize workspace-owned resource`, with typed fail-closed outcomes that do not reveal another workspace's sensitive existence or state.
- Treat tRPC `protectedProcedure` or equivalent authentication as necessary but insufficient; capability services must consume workspace authority rather than duplicate ad hoc checks.
- Revalidate authority at security-critical commit or external-effect boundaries when membership or role could have changed after an earlier read. Long-running and retried operations must not rely indefinitely on an old actor snapshot.
- Deny mismatched workspace/resource references before invoking providers, mutating balances, opening protected credentials, or returning sensitive records.

### 6. Cross-workspace isolation

- Every downstream workspace-owned record—including balances, leads, search runs, projects and their authority links, presets, conversations, integrations, hosting state, and analytics—must be inaccessible through another workspace's actor context.
- Authorization must constrain list queries as well as direct-by-ID operations; random or guessed identifiers do not weaken isolation.
- Denials must be sanitized to avoid leaking sensitive cross-workspace resource, member, integration, or billing details.
- Future specifications and implementation slices must cover adversarial cross-workspace references, mixed-workspace batches, stale identifiers, and indirect relationships.

### 7. Owner-only sensitive settings and integrations

Workspace authority must publish the Owner-only decision consumed by the owning capability. Sensitive areas forecast by the umbrella include:

- membership administration and workspace-level authority changes;
- billing and commercial administration;
- workspace CodeSandbox credential lifecycle;
- workspace SMS template administration and other Telnyx-sensitive setup;
- workspace-uploaded website preset creation, replacement, and deletion;
- hosting/domain settings and other sensitive integrations where the downstream specification requires Owner authority; and
- Owner-only analytics.

Workspace authority owns authorization and actor auditing for these decisions. It does not own credentials, billing records, templates, presets, domains, provider calls, analytics derivation, or their business behavior.

### 8. Concurrent authority changes and removed members

- Membership and role mutations must detect stale versions and return an explicit conflict without partial or last-write-wins authority corruption.
- Authorization must use current authoritative state, not JWT role claims or a browser cache. A valid Supabase session for a removed user is not current workspace membership.
- A request admitted before an authority change must be rechecked before an irreversible sensitive commit or provider dispatch when the operation spans that change. Capability designs will define the exact revalidation point while consuming the authority-version contract.
- Retries must resolve current authority and retain the same operation identity; prior visibility or a prior successful read cannot bootstrap later permission.
- Audit must distinguish denied stale authority, successful mutations, conflicts, and system-driven operations.

### 9. Durable actor auditing

- Retain audit evidence for membership invitations/acceptance where adopted, role changes, removals, Owner-only sensitive-setting decisions, cross-workspace denials where safe, and relevant authorization conflicts.
- Audit evidence must include workspace, actor or named system actor, target identity, action, result, timestamp, operation/request identity, and authority version or equivalent evidence needed to explain the decision.
- Audit records must not contain raw credentials, session tokens, provider secrets, unrestricted provider payloads, uploaded preset contents, or unnecessary personal data.
- Audit evidence is append-only or explicitly superseding; corrections must not erase the authority history needed by support, security, compliance, and later analytics.
- Workspace authority supplies actor evidence to downstream owners but does not become a generic event store or take ownership of their domain events.

### 10. Supabase and RLS boundaries

- Supabase Auth establishes authenticated subject identity; workspace authorization comes from authoritative application-owned membership state, not `user_metadata`, client claims, UI state, or `TO authenticated` alone.
- Workspace and membership persistence belong to the workspace-authority capability. Any table in an exposed schema must have RLS enabled and ownership-aware policies; authentication-only policies are insufficient.
- Server authorization remains mandatory even with RLS. RLS is defense in depth and a direct-data-access boundary, not a replacement for capability orchestration.
- Authorization data used in decisions must be current. Stale JWT `app_metadata` must not be the sole authority for prompt removal or role-change guarantees.
- Privileged/service-role access remains server-only and narrowly scoped. It must not be exposed to browsers or used as a blanket reason to bypass workspace checks.
- Any future view, function, trigger, storage policy, or privileged database code requires a specific security review. `SECURITY DEFINER` must not be introduced merely to bypass permission errors; exposed views/functions must preserve invoker and grant boundaries.
- This proposal selects no tables, columns, policies, migration filenames, or generation output. Those choices belong to later specification/design and approved implementation slices; `db:gen` remains maintainer-only.

## Public contracts for downstream capabilities

Later design must define stable, capability-owned public contracts without exposing workspace-authority persistence internals. At minimum, downstream planning must be able to depend on:

- authoritative resolution of workspace, current membership, role, and actor context from authenticated server identity;
- Member and Owner authorization decisions with typed denial/conflict outcomes;
- workspace-owned resource authorization that binds a resource to the same authoritative workspace;
- authority freshness/version evidence and a revalidation operation for long-running or externally effectful workflows;
- membership lifecycle commands and conflict outcomes for workspace administration;
- audit-safe human/system actor attribution and operation correlation; and
- sanitized workspace/readiness projections for presentation that carry no independent authority.

These contracts must be consumed through intentional public entry points. Downstream packages and services must not deep-import workspace-authority internals, query its tables ad hoc as a substitute for the contract, or import application-private code from a reusable package.

## Forecast of downstream capability support

This foundation must later support, without taking over their behavior:

1. **Commercial entitlements and usage:** workspace-scoped subscriptions, distinct shared lead/AI/SMS balances, top-ups, hosting add-ons, and acting-member/system audit.
2. **Lead identity and pipeline:** authoritative workspace lead identity, fixed stage/outcome history, lead/project relations, and authorized corrections.
3. **CodeSandbox BYOK:** Owner-only credential lifecycle and current actor admission while the raw credential remains server-only.
4. **DataForSEO discovery:** workspace-owned immutable search runs, lead metering/import isolation, and server-only provider execution.
5. **Website creation and `DESIGN.md` presets:** authorization and actor audit around preset administration/selection and lead-backed creation, while generation behavior remains with the website capability and inherited CREATE path.
6. **Telnyx SMS:** Owner-only template/sensitive setup authority plus Member send actor context, subject to external compliance and commercial gates.
7. **Inbox:** active Owner/Member read and reply authority, cross-workspace conversation isolation, removed-member denial, and outbound actor evidence.
8. **Publishing and hosting lifecycle:** workspace/project authorization, Owner-only sensitive domain/hosting administration, system-actor lifecycle operations, and retention audit.
9. **Owner analytics:** Owner-only reads derived from authoritative downstream events and current balances.

Dashboard navigation may consume sanitized workspace state later, but it must never become the authorization boundary.

## Required V1 preset contract context

The downstream website capability must preserve both Jagwar-managed and workspace-uploaded Inspiration and Style `DESIGN.md` presets in V1. Each workspace upload is one validated Markdown file. Only Owners may create, replace, or delete workspace uploads; Members may select available presets. Inspiration reference code is accepted only inside fenced code blocks. Archive, asset, and Git ingestion are excluded.

Workspace authority owns only the Owner/Member authorization, workspace isolation, concurrency, and actor-audit contracts used by preset administration and selection. It does not validate preset semantics, compose prompts, create websites, alter the fixed CodeSandbox template, or change the inherited editor/AI CREATE behavior.

## Scope boundaries and non-goals

This change does not:

- implement workspace, membership, audit, Supabase, RLS, router, service, package, or UI code;
- choose a database schema, migration workflow, RLS SQL, API shape, module tree, or protected composition seam;
- create implementation slice manifests, CCRs, tests, runtime artifacts, or runtime authorization;
- define commercial policy, balances, lead identity, provider behavior, website generation, preset validation, messaging compliance, Inbox behavior, hosting lifecycle, or analytics derivation;
- add custom roles, client-owned authority, client portal identities, or a generic Jagwar service/package;
- wrap, restructure, or otherwise touch the editor, or introduce a second website generator;
- refactor inherited Onlook architecture merely to satisfy new Jagwar conventions;
- edit generated files, `bun.lock`, unrelated dirty files, `.gitignore`, `.atl`, or Story 1.3b; or
- apply, verify, sync, archive, activate a provider, or authorize a commit.

## Affected areas forecast

Future separately approved work is expected to consider additive capability-owned seams under:

- Next-server workspace-authority orchestration;
- thin validated workspace/member transport;
- workspace-authority persistence and RLS;
- stable public authority/actor contracts where cross-capability reuse is demonstrated;
- audit persistence and system-actor entry boundaries; and
- the narrow composition points required for dependent services.

Actual paths require inventory during design. New runtime paths must follow repository placement rules. Protected Onlook paths may be edited only after a reviewed path plan and exact approval; no such edit is approved here.

## Risks and mitigations

- **Cross-workspace data exposure:** Bind actor and resource to the same authoritative workspace in server checks and ownership-aware RLS; test direct, list, indirect, and mixed-batch references later.
- **Authentication mistaken for authorization:** Require fresh membership/role resolution beyond Supabase session validity and beyond `protectedProcedure`.
- **Removed-member or stale-role access:** Re-resolve current authority and revalidate before sensitive commit/provider dispatch; never rely solely on JWT role metadata or cached actor state.
- **Concurrent administration corrupts authority:** Use versioned or equivalent optimistic concurrency with explicit conflict outcomes and preserve a valid Owner administration path.
- **Audit leaks secrets or becomes a dumping ground:** Record bounded actor/action/result evidence only; keep provider and capability payloads with their owners.
- **RLS gives false confidence:** Require server checks plus ownership-aware policies; narrowly govern service-role and privileged database code.
- **Foundation overreach:** Publish small authority contracts and leave commercial, lead, provider, website, messaging, hosting, and analytics rules with their owning capabilities.
- **Inherited regression:** Prefer additive adjacent modules; do not wrap the editor, replace inherited flows, or clean the Onlook baseline.
- **Oversized implementation:** Require dependency-ordered Strict-TDD slices of 250–400 changed lines rather than one authority rollout.
- **Governance status misstatement:** The known deferred `.gitignore`/`.atl` governance error remains non-blocking for planning, but architecture must not be claimed passing. Existing `packages` and `business-policy` size findings remain warnings, not proof of a violation or permission for unrelated cleanup.

## Rollback

This proposal changes no runtime or data. Before later artifacts or implementation exist, rollback is to remove or supersede this planning artifact with an explicit OpenSpec change that identifies revised authority rules. It must not silently fall back to historical BMAD/Telio assumptions.

Every future implementation slice must define a reversible rollout. Disabling new entry points must preserve authoritative workspace/membership state and audit history. Authority rollback must never silently restore removed-member access, erase membership decisions, weaken cross-workspace isolation, or rewrite audit evidence. Protected-path rollback requires its own exact approved resulting hash.

## Future delivery and review contract

Future implementation is dependency-ordered and must be split into cohesive **250–400 changed-line Strict-TDD slices**. Each slice must begin with the relevant failing test, make the smallest passing change, and refactor only while green. Before any governed implementation edit, the slice requires one reviewed `architecture/slices/<slice>.json` manifest declaring every governed path and its correct classification.

Before any protected inherited baseline file is edited, a new per-file Core Change Request must name the exact path and exact resulting SHA-256, be approved in `architecture/core-change-approvals.json`, and be referenced by the reviewed slice manifest. A planning artifact, dependency sequence, prior CCR, wildcard, or intent-only approval is insufficient.

This proposal forecasts chained review because the authority capability will likely require multiple slices under the 400-line review budget. It remains planning-only and grants no permission to begin those slices.

## Success criteria

This proposal succeeds when:

- workspace identity, current membership, and exactly Owner/Member roles are established as server-authoritative product boundaries;
- the intended membership lifecycle, removed-member behavior, concurrent mutation handling, and durable actor audit are bounded for later specification;
- cross-workspace and resource authorization fail closed without leaking sensitive data;
- Owner-only sensitive settings/integrations and normal Member workflows are clearly separated;
- Supabase Auth, server authorization, RLS, and privileged-access responsibilities are distinct and defense in depth;
- downstream commercial, lead, BYOK, discovery, website/preset, SMS, Inbox, hosting, and analytics capabilities have stable authority contracts to plan against without workspace authority owning their behavior;
- the exact required V1 `DESIGN.md` preset context is preserved;
- inherited Onlook architecture and behavior, especially the editor and CREATE toolchain, remain untouched;
- future delivery is constrained to reviewed 250–400-line Strict-TDD slices with manifests and exact hash-bound CCRs before protected edits; and
- the authorized proposal → specifications → design → tasks sequence remains planning-only, with no runtime edits, apply/verify/sync/archive activity, or implementation authorization.

## Proposal question round

Auto mode prevents pausing this delegated phase for an interactive round. These product questions are recorded for user review because answering them will improve the later specification by making lifecycle and security tradeoffs explicit. The user may accept the assumptions, correct the framing, or request a second round before `sdd-spec`:

1. **Final Owner lifecycle:** Must a workspace always retain at least one active Owner, with ownership transfer required before the final Owner can be demoted, removed, or leave? **Assumption:** yes; no operation may leave an active workspace without an Owner.
2. **Invitation state:** Should invited-but-unaccepted users have zero workspace data access until acceptance binds the invitation to the authenticated identity? **Assumption:** yes; invitations confer no membership authority before explicit acceptance.
3. **In-flight revocation:** For sensitive or provider-effectful operations started before removal/demotion, should authority be revalidated immediately before irreversible commit or dispatch? **Assumption:** yes; stale authority fails closed, while already committed external effects remain auditable and reconcilable rather than being misreported as undone.
4. **Workspace switching:** May one authenticated user belong to multiple workspaces and explicitly select an active workspace, with every request still independently authorizing the submitted workspace/resource? **Assumption:** yes; selection is convenience state only and never authority.
5. **Audit access and retention:** Should Owner-facing audit reads expose only sanitized workspace events while security/legal retention and support access are governed separately? **Assumption:** yes; this proposal requires durable evidence but leaves exact retention durations and privileged support access to later compliance/security decisions.
