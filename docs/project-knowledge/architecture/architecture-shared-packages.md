# Jagwar Foundation - Shared Package Architecture

## Executive summary

The monorepo separates reusable behavior into focused `@onlook/*` workspaces. Packages expose public entry points and are consumed by the web application, preload runtime, server, and docs site. Jagwar additions should follow these boundaries and avoid cross-package private imports or a generic dumping package.

## Package map

| Package | Authority |
| --- | --- |
| `@onlook/ai` | Model initialization, prompts, message-context hydration, streaming agents, tools, fast apply |
| `@onlook/code-provider` | Provider abstraction and CodeSandbox/NodeFS adapters for project source and commands |
| `@onlook/constants` | Shared runtime and editor constants |
| `@onlook/db` | Drizzle schema, defaults, mappers, database types, seed support |
| `@onlook/email` | Email client helpers and templates, including project invitations |
| `@onlook/file-system` | Browser file-system abstraction and hooks |
| `@onlook/fonts` | Font discovery, parsing, and code manipulation |
| `@onlook/git` / `@onlook/github` | Git operations and GitHub integration helpers |
| `@onlook/growth` | “Built with Onlook” injection and growth helpers |
| `@onlook/image-server` | Server-only image compression and processing |
| `@onlook/models` | Shared serializable domain and transport models |
| `@onlook/parser` | JSX/TSX parsing, AST transforms, preload/config transforms |
| `@onlook/penpal` | Typed iframe/preload RPC bridge |
| `@onlook/rpc` | tRPC configuration and editor-control router types |
| `@onlook/stripe` | Stripe client, catalog constants, subscription functions, billing types |
| `@onlook/types` | Adapter/design-token utility types |
| `@onlook/ui` | Design tokens, CSS, icons, primitives, AI elements, shared hooks |
| `@onlook/utility` | General reusable helpers with tests |

## Provider and manager patterns

- `@onlook/code-provider` defines an abstract `Provider` with serializable operation inputs and adapters for CodeSandbox and NodeFS.
- Publishing uses `PublishManager` over a provider and a hosting adapter factory for Freestyle.
- Database mappers isolate persisted rows from shared application models.
- AI context classes and tool classes centralize formatting/schema behavior behind public exports.
- Route-specific orchestration remains in `apps/web/client`, close to the owning tRPC router or feature.

## Public-entry-point rule

Consumers should import package exports such as `@onlook/db`, `@onlook/ui/button`, or `@onlook/code-provider`. Existing private imports such as `@onlook/db/src/client` are inherited exceptions, not permission to expand that pattern. If a required symbol is not public, prefer a Core Change Request for the smallest public export rather than a new private dependency.

## Candidate Jagwar package placement

A reusable business-context contract can live in a new focused package or an appropriately focused new folder within an existing public-contract package only after ownership is decided. It should contain:

- the versioned `JagwarBusinessContextV1` Zod schema;
- fact, unknown, provenance, and rights-cleared asset-reference contracts;
- a deterministic renderer into the existing project-creation `PROMPT` context;
- pure validation/formatting tests.

It must not import editor stores, Supabase clients, Stripe, publishing managers, or provider secrets. Application-specific collection and persistence should remain in the owning web feature/server layer.

## Testing

Package tests are concentrated in AI, parser, fonts, utility, image server, growth, UI, and scripts. New focused packages should provide Bun-compatible deterministic unit tests and expose only the intended public surface.
