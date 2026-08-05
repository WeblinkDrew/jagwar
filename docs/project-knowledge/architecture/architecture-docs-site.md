# Jagwar Foundation - Documentation Site Architecture

## Purpose

`docs` is a Next.js 16/Fumadocs workspace that renders Onlook-origin developer and product documentation. It also serves as the BMAD `project_knowledge` directory, so the new root-level project-analysis files coexist with—not replace—the application under `docs/src` and content under `docs/content`.

## Runtime

- Next.js `16.0.7`, React `19.2.0`
- Fumadocs Core/UI/MDX
- `@onlook/ui`
- Tailwind CSS 4
- generated sitemap after builds

## Structure

| Path | Purpose |
| --- | --- |
| `docs/content/docs` | MDX product/developer/self-hosting/tutorial content |
| `docs/src/app` | Documentation routes, search API, layouts |
| `docs/src/lib/source.ts` | Fumadocs source adapter |
| `docs/public` | Documentation images, favicon, and generated sitemap assets |
| `docs/*.md` | New BMAD project-knowledge documents from this scan |

## Constraints

The documentation workspace is part of the protected baseline. This scan adds new root-level Markdown/JSON files only. It does not change the docs application, content navigation, generated sitemap files, dependencies, or styling. If these project-knowledge files should become navigable public documentation later, the exact protected content/meta changes require approval.
