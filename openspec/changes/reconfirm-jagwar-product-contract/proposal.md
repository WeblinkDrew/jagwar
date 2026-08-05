# Proposal: Reconfirm Jagwar Product Contract

## Change

`reconfirm-jagwar-product-contract`

## Status

Planning-only umbrella proposal. It establishes the owner-confirmed product truth that all later Jagwar specifications, designs, tasks, and implementation slices must follow. This change authorizes its native planning artifacts—`proposal.md`, capability specifications, `design.md`, and `tasks.md`—but does not authorize runtime implementation, apply/verify/sync/archive activity, protected-core edits, generated-file or lockfile changes, provider activation, commits, or work on blocked Story 1.3b. In particular, `tasks.md` is a dependency and planning roadmap, not executable authorization.

## Intent

Reconfirm a single, current product contract for Jagwar before further delivery work is planned. Historical BMAD and Telio materials contain useful evidence but no longer form product authority where they conflict with this proposal. The current repository remains implementation authority, while this contract becomes the product-planning baseline for future capability SDDs.

This reset is needed because prior materials leave important product boundaries fragmented or inconsistent: who buys Jagwar, what a subscription funds, how balances and top-ups behave, when discovery is charged, which website-generation paths are permitted, whether workspace presets belong in V1, which messaging provider and channel are in scope, how hosting survives cancellation, and which inherited Onlook behavior must remain untouched. Continuing from those mixed assumptions would create avoidable rework, contradictory acceptance criteria, unsafe provider behavior, and oversized cross-capability changes.

The intended outcome is a coherent end-to-end lead-to-client SaaS for solo entrepreneurial operators. An operator discovers businesses without proper websites, imports a business into a workspace pipeline, explicitly creates and edits a personalized website using the inherited Onlook toolchain, contacts the lead by SMS, and records conversion. The local business is the operator's prospect or client, not a Jagwar subscriber.

## Product contract

### 1. Customer, workspace, and commercial model

- Jagwar serves solo entrepreneurial operators working from a shared workspace. The local businesses they discover and contact are leads or clients, not Jagwar accounts.
- Commercial plans are Starter, Pro, and Scale, billed monthly with no free trial.
- Each plan carries three separate monthly quantities: lead allowance, Jagwar AI credits, and SMS allowance.
- Users may configure their workspace, members, and integrations before payment. Provider-funded lead discovery, AI generation, SMS sending, and Jagwar-managed hosting remain blocked until an active paid entitlement exists.
- Stripe is inherited and extended rather than replaced. It must support subscriptions, bundled top-ups, and recurring per-site hosting add-ons.
- Members are unlimited and share workspace balances. Usage is workspace-scoped and records the acting member for audit.
- Monthly allowances reset monthly. Jagwar adds no artificial daily cap, although provider limits continue to apply.
- A top-up is one bundled purchase that adds fixed quantities to each of the three distinct balances. Top-ups never expire, are consumed only after the corresponding monthly allowance, and are preserved but locked while the subscription is inactive.
- The operator and client settle website sales outside Jagwar. A Won lead may optionally record amount and currency for workspace analytics; Jagwar does not process the sale.

### 2. Roles and server-enforced authority

- Workspace roles are Owner and Member.
- Owners manage billing, members, the workspace CodeSandbox credential, SMS templates, and other sensitive integrations.
- Members may use normal workspace workflows and may read and reply in Inbox.
- Permissions, balance checks, deduplication, provider access, and sensitive settings are enforced by the server. Client visibility is never an authorization boundary.

### 3. App shell and navigation

- An active subscriber without a valid return route lands on the Jagwar dashboard.
- Add a compact left sidebar only to Jagwar dashboard surfaces, styled with inherited Onlook UI. It must not wrap, restructure, or otherwise touch the editor.
- The dashboard primarily preserves the current Projects experience.
- Primary navigation is Dashboard/Projects, Leads, Inbox, and Settings.
- Leads contains Pipeline, Discover, and Recent Searches tabs.
- Settings opens the inherited settings modal and extends it additively.
- All new Jagwar UI maintains full key parity across the inherited English, Spanish, Japanese, Korean, and Chinese catalogs.

### 4. Discovery, search snapshots, metering, and import

- DataForSEO uses a Jagwar-owned server account. Credentials and provider payload handling remain server-only.
- Search exposes the full searchable DataForSEO category catalog and accepts up to ten categories and ten city, postal, or address-plus-radius locations per logical search.
- The default result policy finds businesses with no standalone website: no URL or only a social/directory URL. Operators may deliberately broaden that policy.
- Every intentional new search invokes DataForSEO, including a search identical to an earlier one.
- Each completed search is saved as an immutable, workspace-owned run snapshot. Reopening a snapshot performs no provider request and creates no additional provider or lead charge.
- A run retains its normalized request, result snapshot, provider task ID, API version, provider cost, provider status, and timestamps.
- Fresh-run lead usage is charged once for each unique business displayed in that run. Overlap within the same run is deduplicated; a business displayed again by a later fresh search is charged again.
- Requested display/result count is capped by available lead balance. The balance never becomes negative, and the UI supplies clear upgrade or top-up guidance when the requested count is unavailable.
- Existing workspace leads remain visible in search results as `Already in pipeline` and cannot be imported twice.
- Operators may import one eligible result, a selection, or all eligible results. Workspace-scoped server deduplication is authoritative.

### 5. Lead pipeline and analytics

- The fixed V1 pipeline is New lead → Website building → Contacted → Closed, with Closed requiring Won or Lost.
- Starting website work automatically moves a lead to Website building. Sending the first SMS automatically moves it to Contacted. Users may manually correct stage state.
- Website lifecycle is independent from pipeline stage because outreach may occur before or after website work.
- Owner analytics include discovered and imported leads, websites created, SMS sent/delivered/replied, Won/Lost outcomes, optional deal value, and current balances.
- The activation milestone is successful creation of the first lead-backed website.

### 6. Website creation, presets, and inherited editor toolchain

- Website generation starts only through explicit `Create Website` action for a lead.
- Each creation chooses exactly one source: Inspiration, Style, or Let Jagwar Decide.
- An Inspiration `DESIGN.md` combines design guidance with concrete reference code. The AI adapts the reference rather than copying it verbatim.
- A Style `DESIGN.md` contains guidance only and no implementation code.
- Let Jagwar Decide creates a controlled prompt from the business profile.
- Operators may add bounded notes but may not edit the full generation prompt.
- The preset catalog includes Jagwar-managed presets and V1 workspace-uploaded Inspiration and Style presets.
- Each workspace upload is one validated `DESIGN.md`. Inspiration code is accepted only inside fenced code blocks. Archives, assets, and Git ingestion are excluded.
- Only Owners create, replace, or delete workspace presets. Members may select them.
- Uploaded markdown is untrusted input and cannot override system or security instructions. Inspiration and Style remain mutually exclusive for a generation.
- Preserve Onlook's fixed CodeSandbox template, project creation flow, editor, and AI CREATE toolchain. Controlled business and design guidance feeds the existing generation prompt; Jagwar must not build a second generator.
- Listing photos may be used only with operator review and retained provenance.

### 7. Workspace CodeSandbox BYOK

- Every workspace supplies its own CodeSandbox API key. Only the Owner manages it, and the raw credential remains server-only.
- A missing, invalid, revoked, or quota-exhausted key blocks creation and opening of editable projects, with tailored settings and documentation guidance.
- Jagwar never falls back to a Jagwar-owned CodeSandbox key. Provider compute cost belongs to the workspace.

### 8. SMS and Inbox

- V1 messaging is US-only regular SMS through a Jagwar-owned Telnyx account. Blue Send is a separate near-term post-V1 capability; WhatsApp is not part of this contract.
- Telnyx lookup determines mobile versus landline. Jagwar never infers line type.
- Each workspace receives one dedicated US sender.
- Workspace setup, leads, templates, previews, and other non-send workflows remain available while registration or sender approval is pending; sending remains blocked.
- Consent and compliance decisions come from Telnyx or another external non-AI authority. Jagwar never infers consent and fails closed on rejection or opt-out signals.
- Jagwar provides default SMS templates. Owners manage workspace templates, which support only fixed validated personalization fields.
- Individual and bounded bulk sends require a rendered preview, recipient count, usage estimate, and explicit confirmation. Automatic unattended campaigns are prohibited.
- Inbox links replies to leads. All active members may read and reply, with unread state, notifications, and outbound actor audit.

### 9. Publishing, hosting, export, and cancellation

- Preserve existing Onlook publishing behavior rather than replacing it.
- A public project preview uses a freestyle hostname, gains no new protection or client portal, and remains a stable mutable preview updated by republishing. Editor and project URLs remain authenticated.
- Jagwar-managed hosting is a recurring per-site add-on with a preview subdomain and optional custom domain.
- Users retain full source export and customer-controlled Git transfer.
- Externally hosted projects remain editable while the workspace is subscribed. Managed migration of external hosting is not included in V1.
- Cancellation begins a 14-day hosting grace period with a persistent in-product banner and Owner emails at grace start and 7, 3, and 1 days remaining. After grace, the public site shows a neutral unavailable page.
- Recoverable projects, leads, searches, conversations, and suspended-site data are retained for 90 days after expiry, then deleted after notice. Legally required billing and audit records may remain separately.
- Top-up balances are preserved but locked throughout subscription inactivity.

## Capability scope and downstream decomposition

This proposal is an umbrella product contract, not an executable implementation unit. The remaining native phases for this change may create capability specifications, an umbrella design, and a planning-only `tasks.md` that records dependencies, sequencing, decision gates, and the required downstream change decomposition. Those artifacts refine the product contract and roadmap only; they do not grant permission to edit runtime code or execute their tasks.

Downstream implementation work must be decomposed into prerequisite-aware capability SDDs before any code is changed. At minimum, planning must separate:

1. subscription entitlements, shared monthly balances, bundled top-ups, hosting add-ons, and usage audit;
2. workspace roles, member administration, and sensitive integration authority;
3. dashboard-only shell, route behavior, settings extensions, and locale parity;
4. DataForSEO search inputs, provider adapter, immutable snapshots, display metering, and import deduplication;
5. pipeline state, automatic transitions, correction rules, and conversion analytics;
6. controlled website-creation inputs, managed/workspace presets, untrusted markdown handling, and prompt composition into the inherited CREATE path;
7. workspace CodeSandbox BYOK lifecycle and fail-closed project access;
8. Telnyx registration/sender lifecycle, lookup/compliance boundaries, SMS templates, confirmed send orchestration, and usage;
9. lead-linked Inbox, replies, unread/notification behavior, and actor audit;
10. publishing/hosting entitlements, domains, grace communication, suspension, retention, deletion, export, and Git transfer; and
11. owner analytics and activation measurement.

Each capability requires its own specification and design with explicit contracts, dependencies, failure states, persistence ownership, security boundaries, and acceptance criteria. Prerequisites must be delivered before dependents—for example, entitlement and actor-audit foundations before metered provider operations; lead identity and pipeline persistence before discovery import, website creation, Inbox, or analytics; and subscription/hosting entitlement state before cancellation enforcement.

Implementation must then be partitioned into cohesive 250–400 changed-line review slices. Each slice must follow strict TDD, declare governed paths in `architecture/slices/*.json`, remain buildable and reviewable, and obtain exact hash-bound Core Change Request approval before any protected baseline edit. No team or agent should implement this umbrella proposal directly as one cross-capability change.

## Preserved inherited behavior and governance

- The current repository is implementation authority. The inherited Onlook baseline at `423e2e924366419e418ee049093872d535eea41a` is grandfathered and must not be refactored merely to conform to new Jagwar conventions.
- Product changes are additive and minimally invasive. Existing Projects, fixed CodeSandbox template, project creation, editor, AI CREATE toolchain, publishing, settings modal, Stripe foundation, UI system, authenticated editor/project routes, export, and customer-controlled Git behavior remain in place except where a later capability specification authorizes a narrow extension.
- The editor must not be wrapped or redesigned by the dashboard shell work, and no second website generator may be introduced.
- New modules follow explicit runtime and capability boundaries: route-local presentation, server orchestration under capability services, thin validated transport, capability-owned persistence, and focused public contracts where reuse is demonstrated.
- Raw provider credentials and secrets remain server-only. Client state or UI visibility never grants authority.
- Bun is the only package manager/runtime tooling path. Generated artifacts and `bun.lock` are not edited by agents, `db:gen` remains maintainer-only, unrelated dirty work is preserved, and no commits are created by this change.
- Every governed implementation path requires a slice manifest. Every protected baseline edit additionally requires an exact resulting hash-bound CCR; this proposal grants none.
- Story 1.3b remains blocked and is neither modified nor implemented by this change.

## Explicit V1 non-goals

- automatic unattended SMS or outreach campaigns;
- client portal accounts or new protection around public previews;
- custom pipeline stages;
- scheduled policies or non-global policy variants;
- managed migration of externally hosted projects;
- WhatsApp;
- Blue Send, which remains a separate near-term post-V1 capability;
- a second website-generation/editor/publishing toolchain;
- full prompt editing by operators;
- archive, asset, or Git ingestion for workspace presets;
- Jagwar processing of operator-to-client website sale payments;
- Jagwar-funded fallback CodeSandbox compute; and
- implementation of Story 1.3b through this product-contract reset.

Workspace-uploaded Inspiration and Style `DESIGN.md` presets are explicitly required in V1 and must not be reclassified as a non-goal.

## Dependencies and deferred launch blockers

The following commercial or provider decisions remain intentionally deferred and must be resolved before the dependent capability can launch:

- Starter, Pro, and Scale prices and monthly lead/AI/SMS quantities;
- bundled top-up price and the fixed lead/AI/SMS quantities it grants;
- AI provider cost-to-Jagwar-credit conversion;
- recurring per-site hosting add-on price;
- exact DataForSEO result-count choices and radius options;
- final Jagwar-managed preset content;
- final default SMS templates; and
- Telnyx registration details and provider limits.

These are launch blockers, not permission to leave contracts ambiguous. Downstream specs must model configurable values, fail-closed unavailable states, and provider limits without inventing final commercial numbers. Provider credentials, Stripe/Telnyx/DataForSEO/CodeSandbox account readiness, domain/hosting infrastructure, and legal/compliance review are operational dependencies to be made explicit in the relevant capability SDDs.

## Affected areas

Future capability work is expected to affect, through separate approved SDDs and slices:

- workspace identity, roles, member administration, and actor audit;
- subscription, checkout, billing, entitlements, allowances, top-ups, and hosting add-ons;
- DataForSEO integration, search persistence, usage metering, and lead import;
- lead and pipeline persistence, website relationships, outcomes, and analytics;
- dashboard route surfaces, navigation, inherited settings modal, and all five locale catalogs;
- controlled prompt assembly, preset validation/storage, project creation, and CodeSandbox credential handling;
- Telnyx registration, lookup, sender assignment, compliance signals, templates, sends, delivery/reply events, and Inbox;
- publishing, domains, hosting state, grace notifications, suspension, retention, deletion, source export, and Git transfer; and
- architecture slice declarations, exact CCR approvals where required, focused tests, and regression gates.

This list identifies planning impact only. It does not authorize edits to any runtime or protected path.

## Risks and mitigations

- **Conflicting historical authority:** Treat this owner-confirmed contract as product authority and older BMAD/Telio documents only as evidence. Require downstream artifacts to cite this change and identify any requested deviation explicitly.
- **Umbrella implementation and review failure:** Prohibit direct implementation; require prerequisite capability SDDs and cohesive 250–400-line review slices.
- **Commercial ambiguity:** Keep exact prices, quantities, and conversion rates configurable and blocked for launch rather than inventing values.
- **Cross-balance accounting errors:** Preserve distinct lead, AI, and SMS ledgers, monthly-first consumption, non-expiring top-ups, inactivity locking, non-negative enforcement, and actor audit.
- **Provider cost or credential leakage:** Keep provider calls and raw secrets server-only, enforce paid entitlements and available balances before funded operations, and fail closed without workspace CodeSandbox BYOK.
- **Duplicate leads or incorrect discovery charges:** Use immutable run snapshots, workspace-scoped identity, within-run display deduplication, snapshot reopen without charge, and server-authoritative import dedupe.
- **Unsafe generated content:** Treat uploaded markdown and listing media as untrusted, validate bounded formats, preserve provenance, and feed controlled guidance only into the inherited CREATE toolchain.
- **Messaging compliance harm:** Never infer line type or consent, stop on opt-out/rejection signals, and require preview, estimate, and explicit confirmation for every individual or bounded bulk send.
- **Inherited-product regression:** Keep dashboard shell work away from the editor and extend Projects, settings, Stripe, publishing, and UI behavior additively under exact governance controls.
- **Cancellation data loss or unexpected public exposure:** Specify deterministic grace, unavailable, retention, notice, and deletion states while separating legally retained records.
- **Localization drift:** Require full English, Spanish, Japanese, Korean, and Chinese key parity in each user-facing slice.

## Rollback strategy

### Planning rollback

If the owner revises this contract, supersede this proposal with an explicit product-contract change that identifies every altered rule and its downstream artifacts. Do not silently revert to historical BMAD or Telio assumptions. Capability SDDs based on a superseded rule must pause until reconciled.

### Future delivery rollback

Each downstream capability design must define its own reversible rollout, data compatibility, provider disablement, and customer-state preservation strategy. Additive feature flags or entitlement gates may disable new entry points, but rollback must not corrupt usage ledgers, immutable search snapshots, lead/conversation history, hosting grace state, audit evidence, or legally retained records. Protected or generated changes require their normal maintainer-governed rollback path.

This planning change alters no runtime behavior. Before implementation exists, rollback consists of removing or superseding its proposal, specifications, design, and planning roadmap while preserving an explicit record of the product-contract revision.

## Success criteria

This proposal succeeds when:

- one owner-confirmed contract unambiguously defines Jagwar's customer, end-to-end workflow, commercial model, roles, discovery, website creation, messaging, hosting, cancellation, localization, and analytics boundaries;
- downstream planning treats this proposal as product authority and historical BMAD/Telio documents only as non-authoritative evidence;
- required V1 workspace Inspiration and Style uploads are retained, while all explicit non-goals remain excluded;
- inherited Onlook Projects, editor, CREATE, CodeSandbox template, publishing, settings, Stripe, UI, export, and Git behavior are preserved except for separately approved additive extensions;
- deferred prices, quantities, conversion rates, content, and provider limits are tracked as launch blockers without fabricated defaults;
- every implementation effort begins with a prerequisite capability SDD and is divided into cohesive 250–400 changed-line review slices rather than implementing this umbrella proposal;
- all future provider-funded operations enforce paid entitlement, server authority, available balance, and safe credential handling;
- future UI work maintains full locale parity and keeps the dashboard shell isolated from the editor;
- exact slice manifests and hash-bound CCRs govern any later implementation paths; and
- this change may create only its authorized proposal, specifications, design, and planning-roadmap `tasks.md`; it creates no runtime code, executable authorization, commits, generated files, lockfile edits, or Story 1.3b implementation.

## Non-blocking downstream open decisions

The owner has completed product elicitation, confirmed the canonical baseline, selected auto mode, and requested the planning artifacts. This proposal is therefore finalized for routing to `sdd-spec` and is not awaiting another proposal question round or owner approval. The following details remain non-blocking inputs for the relevant downstream capability specifications and may be resolved there without changing the canonical truth:

1. During the 14-day hosting grace period, determine whether authenticated editing and republishing remain available or only the already-published public site remains online while provider-funded editing/publishing operations are blocked.
2. When a fresh discovery run has more provider matches than the available lead balance permits displaying, determine whether the immutable snapshot retains only the capped displayed set or also retains undisplayed provider matches in a server-only provider-audit record.
3. While Telnyx registration or sender approval is pending, define whether Inbox exposes only historical conversations or may show inbound messages to an already-assigned number when Telnyx delivers them.
4. In the planning roadmap, order the foundation capabilities—workspace identity/authority, subscription and usage ledgers, and lead identity/pipeline persistence—according to their actual contract dependencies.

Until the relevant specification resolves these details, the planning assumptions are: inactive subscriptions block provider-funded operations immediately while the separate hosting grace keeps the published site available; only businesses actually displayed are lead-metered; imports do not create a second lead charge; compliance and sender state always fail closed for outbound messaging; and foundation SDDs precede every provider-facing workflow. These open decisions do not block `sdd-spec`.
