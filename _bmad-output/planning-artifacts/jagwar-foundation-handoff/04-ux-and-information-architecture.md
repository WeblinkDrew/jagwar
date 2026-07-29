---
title: UX and Information Architecture — Jagwar Workflows in Onlook
status: final
created: 2026-07-28
updated: 2026-07-28
visualAuthority: Onlook
---

# UX and Information Architecture

## 1. Visual authority

The target must look like Onlook. Before implementing a surface, the receiving session must inventory and reuse Onlook's:

- semantic color and surface tokens;
- typography and font loading;
- icon package and icon sizing;
- buttons, menus, tooltips, popovers, dialogs, sheets, tabs, cards, inputs, tables, skeletons, toasts, and empty states;
- layout widths, border radii, shadows, separators, density, and responsive rules;
- focus rings, hover/pressed/selected states, keyboard conventions, motion, and reduced-motion behavior;
- loading, saving, error, conflict, disabled, and read-only treatments.

Do not port the Kiranism dashboard, legacy Telio CSS variables, old editor shell, or old route markup. Historical Telio UX is useful only for required actions and state coverage.

UI implementation follows Onlook's route-local vertical-slice organization. New Jagwar surfaces colocate private components, hooks, tests, and utilities with the owning route/feature and reuse `@onlook/ui`. They do not create a parallel global dashboard framework or reorganize existing Onlook features. Any required edit to an original Onlook route, layout, navigation, component, icon registry, or shared primitive needs its own approved Core Change Request before the edit.

## 2. Navigation model

Integrate Jagwar workflows into the existing Onlook application shell. The target route names are deliberately not prescribed, but users need clear access to:

- Projects/Sites — Onlook's existing primary workspace;
- Find Leads — prospect discovery;
- Pipeline — lead and deal management;
- Outreach — WhatsApp connection, eligibility, and send history;
- Usage/Billing — plan, allowance, usage, and upgrades;
- Operator — restricted integrations, policies, and health.

Home should connect projects and commercial progress rather than becoming a separate dashboard universe.

## 3. Home / commercial overview

Purpose: answer “what should I do next?” and connect Onlook projects to Jagwar's commercial loop.

Required content:

- 5+2+1 progress with counts and targets;
- one recommended next action;
- recent Leads requiring attention;
- recent prospect Projects and their publication state;
- recent outreach outcomes;
- compact usage/allowance summary;
- provider or connection problems only when they affect the user.

Behavior:

- Counts come from one authoritative projection.
- If counts are unavailable, show an unavailable/retry state rather than `0`.
- A milestone completion is noticeable but restrained and respects reduced motion.
- Every card/action has a useful destination; no decorative dead-end metrics.

## 4. Find Leads

### Desktop composition

Use an Onlook-native workspace layout. Recommended content relationship:

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Find local businesses  [query________________] [count] [Find leads] │
├────────────────────────────────┬─────────────────────────────────────┤
│ result controls + result list  │ map / geographic context            │
│                                │                                     │
│ selectable candidate cards    │ markers and active candidate        │
│                                │                                     │
│ [Add N to pipeline]            │                                     │
└────────────────────────────────┴─────────────────────────────────────┘
```

Required behavior:

- One search field and one requested-count control; no target-criteria filter maze.
- Search-first initial state with no fake/sample result data.
- Results rank missing/weak sites first.
- Grid/list choice is optional; consistency with Onlook matters more than preserving the donor toggle.
- Candidate selection, select-all over eligible visible results, and clear already-added state.
- Map/list hover or selection synchronization where a map is used.
- Saved runs available without crowding the primary search action.
- Batch add appears as a contextual action and does not shift the list unexpectedly.

### Required states

| State | Product treatment |
| --- | --- |
| Initial | Explain what to search and why; primary query receives focus naturally. |
| Validating | Inline validation; no provider call. |
| Queued/running | Skeletons/progress with cancel or leave-page behavior defined. |
| Success with results | Count, ranking, eligibility, selection, and map/list context. |
| Success with zero | “No businesses found” with query-adjustment guidance. |
| Provider unavailable/timeout | Explicit provider problem with Retry; never rendered as zero results. |
| Partial enrichment | Results remain usable; affected facts show unavailable/pending state. |
| Saved run | Original snapshot plus observed date and already-added links; no new charge. |
| Entitlement limit | Explain allowance and next option before starting a cost-bearing request. |

### Candidate presentation

Show only useful decision information:

- business name and category;
- location/address;
- website status and concise reason;
- rating/review count where sourced;
- phone/contact viability state where available;
- already in pipeline indicator;
- discovery-context thumbnail where legally allowed;
- accessible selection control.

Avoid presenting provider jargon, raw scores without explanation, or absolute claims such as “bad website” when evidence is incomplete.

## 5. Pipeline

Purpose: manage prospect status and next action.

Required stages:

```text
New → Contacted → Interested → Negotiating → Converted → Lost
```

Required behavior:

- Kanban on wide screens if it matches Onlook patterns; accessible list/table alternative for small screens and keyboard users.
- Cards show business name, opportunity status, project/publication state, outreach state, and next action without becoming dense mini-dashboards.
- Drag/move uses optimistic UI only if failure restores exact prior state.
- Keyboard movement and non-drag menu actions reach the same server operation.
- Multi-select supports contextually valid actions, especially create projects or send eligible publications.
- Manual Add Lead is separate from live discovery.

## 6. Lead detail

Use the Onlook-native detail pattern: routed detail page, side panel, or sheet based on existing composition.

Information groups:

1. **Opportunity:** website status, qualification reason, evidence age, recheck action.
2. **Business facts:** name, address, phone, email, category, rating/reviews, provenance.
3. **Project:** associated Onlook project, creation state, open editor action.
4. **Publication:** current public URL, availability, publish/republish/open action.
5. **Outreach:** eligibility, recipient, opt-in/suppression, template, Send action.
6. **Activity:** discovery, pipeline, project, publication, send, and user changes.

Primary action changes with state:

- no project → Create personalized project;
- project exists, unpublished → Open project / Publish;
- publication eligible, not contacted → Send preview;
- contacted → View activity / advance opportunity.

## 7. Lead-to-project handoff

The handoff should feel like a native Onlook project-creation entry point.

Required states:

- choose/create project;
- generating/seeding business context;
- project ready;
- project creation failed with retry;
- project association conflict or unauthorized project;
- project archived/deleted/unavailable.

When ready, navigate directly into Onlook's existing editor. Do not introduce an intermediate Jagwar editor shell.

The ready state must show a prospect-specific editable first draft. In acceptance fixtures, the preview contains the exact business name and selected available contact/service facts, omits unavailable facts, and never treats a blank project or generic starter as success.

## 8. Outreach

### Connection/setup

Show channel connection state truthfully:

- disconnected;
- setup in progress;
- pending provider/business/template approval;
- active;
- degraded or action required;
- suspended.

Hide provider complexity when possible, but do not claim sending is ready until all required steps pass.

### Single send

The send surface must show:

- Lead and recipient;
- exact project/publication URL;
- channel/connector;
- selected approved template and variable preview;
- consent/opt-in/suppression state;
- usage/allowance impact before confirmation;
- actionable blockers.

The confirmation action creates a durable send. Do not leave the dialog in an ambiguous spinner; show queued and then update from durable state.

### Consent evidence

Lead details and outreach blockers must provide a target-native flow to record qualifying channel-specific evidence, inspect its basis/source/time, and withdraw or correct it. Public contact information is never displayed as consent. A stale quote that becomes blocked before dispatch must update clearly and explain that no message was sent and unused allowance was released.

### Multi-select fan-out

Before confirmation, summarize:

- total selected;
- eligible now;
- blocked and why;
- missing publication;
- missing/invalid recipient;
- usage impact.

After confirmation, show independent per-Lead results. One failed/blocked Lead must not erase the successes or make the whole batch unknowable.

### Send history

Present channel, publication, template, recipient, timestamps, lifecycle, provider reference where safe, and failure/block reason. Historical rows remain tied to the publication used at the time.

## 9. Billing and usage

During the workflow rebuild this surface may expose internal/operator cost telemetry and preserve existing Onlook billing behavior, but it must not present invented Jagwar prices, plans, allowances, upgrade promises, top-ups, or customer gates. The final customer billing experience is designed only after representative system costs and the commercial model are approved.

Required content:

- current existing Onlook plan and normalized subscription state, when applicable;
- renewal/period timing and pending plan changes;
- remaining allowances by meaningful unit;
- discovery usage separated from generation/AI and outreach;
- recent usage entries and reversals/refunds where relevant;
- server-created checkout and billing-portal actions only after the final Jagwar commercial model is approved;
- upgrade/top-up actions only when supported by that approved commercial policy;
- truthful verification/refresh state after returning from the billing provider.

Never imply that a disabled button is the entitlement authority. Server operations enforce plans and return typed denial reasons.

## 10. Operator surfaces

Restricted to privileged operators and visually consistent with Onlook.

Required modules:

- provider/connector health;
- secret-reference connection and rotation where supported;
- discovery and qualification policy versions;
- outreach template approval/status;
- activation targets and plan limits;
- durable-job failures, retries, and dead-letter state;
- audit history.

Avoid raw database consoles, arbitrary JSON mutation, or arbitrary code execution.

## 11. Accessibility and focus requirements

- WCAG 2.2 AA target.
- All controls have accessible names independent of tooltips.
- Search, selection, maps, cards, Kanban moves, menus, dialogs, and sheets are keyboard operable.
- Result selection and batch counts announce changes without repeating the whole page.
- Async status uses `aria-live` selectively; failures receive focus only when doing so will not disrupt a current text action.
- Opening a Lead or Send surface moves focus to its heading or first meaningful control.
- Closing restores focus to the invoking card/action.
- Escape closes only the topmost dismissible layer and never silently cancels a committed job.
- Website status, send status, and pipeline stage use text/icon/shape in addition to color.
- Map markers have an equivalent accessible result-list representation; the map is never the only way to select a Candidate.
- Respect `prefers-reduced-motion`.

## 12. Responsive behavior

- Desktop: list/map and Kanban can use wide workspace layouts.
- Tablet: allow collapsible map/detail panels and horizontally managed pipeline.
- Mobile: prioritize search, list, lead details, pipeline actions, and outreach status; the map becomes a toggled view rather than shrinking alongside the list.
- The Onlook editor retains its own responsive policy; Jagwar business screens must not impose dashboard wrappers around it.

## 13. UI acceptance gate

Every completed surface must be reviewed against the current Onlook application in a real browser for:

- token and typography parity;
- icon family and stroke/size parity;
- spacing and density parity;
- loading/empty/error parity;
- focus, hover, pressed, disabled, and selected states;
- motion and reduced motion;
- responsive behavior;
- absence of legacy Telio/Kiranism visual residue.
