# Jagwar Foundation - UI and Component Inventory

## UI authority

`@onlook/ui` is the shared primitive and design-token authority. The web application imports its global stylesheet in the root layout and composes primitives in route-local components. New Jagwar screens should reuse these public subpath exports and colocate workflow-specific compositions with their routes.

## Shared primitive categories

| Category | Representative exports |
| --- | --- |
| Actions and forms | button, input, input-group, textarea, checkbox, radio-group, select, switch, slider, form, label |
| Overlays | dialog, alert-dialog, drawer, sheet, popover, hover-card, tooltip, context-menu, dropdown-menu |
| Navigation | breadcrumb, navigation-menu, menubar, tabs, pagination, sidebar, command |
| Structure/display | card, table, badge, alert, avatar, separator, scroll-area, resizable, collapsible, accordion, aspect-ratio |
| Feedback | progress, progress-with-interval, skeleton, sonner toaster, shine-border, motion-card |
| Editor-specific | color picker, draftable input, node icon, hotkey label, icon catalog |
| AI-specific | conversation, response, reasoning, tool display, context window, code block, web preview |
| Utilities/hooks | `cn`, truncation helpers, media/mobile/reduced-motion/resize/pointer hooks |

The package currently contains roughly 50 top-level component files, dedicated AI elements, a color-picker subsystem, 3,600+ lines of icon definitions, tokens, Tailwind config, and global CSS.

## Visual language

- Tailwind 4 utilities are backed by CSS variables and package tokens.
- `globals.css` defines semantic background, foreground, border, icon, destructive, positive, and brand variables plus typography and motion keyframes.
- `tokens.ts` exports the programmatic color scale and font-size map.
- `tailwind.config.ts` maps semantic variables and shared scales into utility classes.
- The application root uses Inter and forces the dark theme through `next-themes`.
- Focus, disabled, hover, active, motion, and responsive behavior are implemented inside the existing primitives and should be inherited rather than restyled ad hoc.

## Feature compositions

| Feature | Owning location | Examples |
| --- | --- | --- |
| Project selector/import | `app/projects/_components` | cards, carousel, templates, import verification, project settings |
| Editor shell | `app/project/[id]/_components` | canvas, panels, top/bottom/editor bars, overlays, terminal |
| Publishing | `app/project/[id]/_components/top-bar/publish` | deployment status, preview URL, custom domain |
| Chat | `app/project/[id]/_components/right-panel/chat-tab` | input, context pills, queue, streamed messages, code/tool display |
| Membership | `app/project/[id]/_components/members` | invite, members, suggestions |
| Account/billing | `src/components/ui` | auth redirect, pricing, settings, subscription, domains |
| Marketing | `app/_components` and feature routes | landing sections, hero, mockups, SEO pages |

## State ownership

The editor feature is a client boundary. A stable `EditorEngine` MobX instance composes domain managers and stores. Existing guidance requires `useState(() => new Store())`, ref-based active-store tracking, and deferred cleanup to avoid route races. Do not create a second editor controller for Jagwar workflows. Workflow state that does not belong to the editor should remain route-local or server-authoritative.

## Jagwar UI extension rules

1. Use `@onlook/ui` public exports, tokens, icons, and utilities.
2. Compose new feature UI under the owning App Router route.
3. Default to Server Components; add a client boundary only for interactions, state, browser APIs, or client-only libraries.
4. Use `next-intl` message catalogs for user-facing text.
5. Preserve dark theme, keyboard/focus behavior, reduced motion, responsive behavior, and primitive semantics.
6. Keep entitlement, consent, send eligibility, and workspace/project access server-authoritative.
7. Do not copy donor dashboard shells, CSS tokens, or icon packs.

## Protected-core note

The package manifest, exports, global CSS, tokens, icon catalog, root layout, and all baseline primitives are protected original files. A new route can import existing public subpaths without core edits; adding a new shared primitive or export may require one or more per-file Core Change Requests.
