---
title: Jagwar Naming Authority
status: approved
created: 2026-07-28
updated: 2026-07-28
currentProductName: Jagwar
formerProductName: Telio
---

# Jagwar Naming Authority

## Authoritative rule

The current product name is **Jagwar**. **Telio** is the former product name and may appear only when an exact historical or migration reference requires it.

## Use Jagwar for all new work

Use **Jagwar** in:

- product/UI copy, page titles, metadata, documentation, prompts presented to users, support text, and commercial language;
- new target repositories, worktrees, branches, packages, modules, types, schemas, services, routes, tests, fixtures, environment-variable names, analytics events, and operational configuration when product-specific naming is necessary;
- new business-domain contracts, including `JagwarBusinessContextV1`;
- pricing, plans, billing products, checkout descriptions, emails, and legal/product policy created after OD-14 approval;
- new BMAD artifacts, story titles, architecture records, release evidence, and handoff documents.

When Onlook convention favors a capability name rather than a product prefix, follow the Onlook convention; do not add `jagwar` to every internal symbol unnecessarily. The hard requirement is that no new target artifact is named **Telio**.

## Telio is permitted only for exact legacy provenance

Retain **Telio** only for:

- the physical donor repository path `/Users/andrewsimic/Developer/Telio` until a separately approved filesystem migration;
- Git branches, commits, database objects, exports, source filenames, story filenames, package identifiers, environment variables, and historical documents that already contain the name;
- citations to legacy architecture, editor, dashboard, pricing, data, tests, and migration sources;
- source-to-target migration maps and compatibility evidence where changing the label would make provenance inaccurate.

Write these references as **legacy Telio**, **former Telio**, or **donor Telio** whenever prose permits. Do not describe the current product as Telio.

## Migration and compatibility

- Do not destructively rename donor repositories, Git history, database objects, secrets, provider accounts, deployed resources, or customer data merely to update branding.
- Inventory legacy identifiers and classify each as retain-for-provenance, map-at-boundary, migrate-with-compatibility, or retire-after-proof.
- Any runtime or persisted identifier migration requires an explicit compatibility, rollback, and data-migration plan.
- Existing historical tests and fixtures may retain exact Telio identifiers while target expectations use Jagwar.
- No new alias layer should make `Telio` a permanent target namespace.

## Naming acceptance gate

Before a Jagwar release or handoff:

1. scan new/modified target artifacts for case-insensitive `telio`;
2. allow each match only when it is recorded as exact legacy provenance;
3. reject product-facing or newly created target identifiers that still use Telio;
4. verify Jagwar spelling exactly as `Jagwar` in product-facing text;
5. verify historical paths and identifiers were not silently rewritten or broken.

This naming correction does not authorize modifying protected original Onlook files. If branding requires an original Onlook file change, the per-file Core Change Request protocol still applies.
