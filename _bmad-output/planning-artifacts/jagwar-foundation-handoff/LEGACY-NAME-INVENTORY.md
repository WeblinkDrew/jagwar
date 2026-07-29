---
title: Legacy Telio Name Inventory
status: approved-provenance-inventory
created: 2026-07-28
updated: 2026-07-28
currentProductName: Jagwar
---

# Legacy Telio Name Inventory

Every `Telio` reference retained in this handoff belongs to one of these approved provenance categories.

| Category | Approved examples | Treatment |
| --- | --- | --- |
| Physical donor repository | `/Users/andrewsimic/Developer/Telio` | Keep exact until a separately approved filesystem migration. |
| Historical BMAD paths/files | `prd-Telio-*`, `brief-Telio-*`, `ux-Telio-*`, legacy story filenames such as `9-4-telio-owned-*` | Keep exact so sources remain resolvable. |
| Legacy architecture/product prose | “legacy Telio editor,” “donor Telio code,” “legacy Telio pricing” | Keep only when clearly qualified as legacy/donor/history. |
| Migration provenance | source-to-target maps, retained identifiers, old database/provider/deployment names | Keep exact until mapped or migrated through an approved compatibility plan. |
| Append-only BMAD memory | earlier `.memlog.md` decisions recorded before the rename | Do not rewrite; the later Jagwar naming decision supersedes them prospectively. |
| Naming-policy examples | `NAMING-AUTHORITY.md`, validation and bootstrap rules explaining that Telio is retired | Keep as the rule's subject, never as the current name. |

No product-facing current-name use is approved. No new target type, package, module, schema, route, event, configuration, billing product, environment variable, fixture, or release artifact may be added to this inventory merely for convenience.

The implementation session must create its own target-diff inventory using these categories and fail the naming gate for every unclassified match.
