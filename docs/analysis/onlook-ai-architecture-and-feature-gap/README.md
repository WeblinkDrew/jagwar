# Onlook AI Architecture and the “Elements / Apps” UI Difference

**Repository analyzed:** `onlook-dev/onlook`  
**Local commit:** `423e2e924366419e418ee049093872d535eea41a`  
**Commit date:** July 21, 2026  
**Analysis date:** July 27, 2026

## Executive answer

The local editor is not hiding **Elements** or **Apps** because of a missing environment variable, subscription, build step, or installation.

The screenshot containing those tabs is rendered by a landing-page component named `OnlookInterfaceMockup`. It is a promotional mockup, not a screenshot of the editor implementation in this repository. The mockup statically draws **Elements** and **Apps**, while the real editor registers only these five tabs:

1. Layers
2. Brand
3. Pages
4. Images
5. Branches

The discrepancy is visible directly in the source:

- The promotional mockup hard-codes the **Elements** and **Apps** labels in [`onlook-interface-mockup.tsx`](../../../apps/web/client/src/app/_components/landing-page/onlook-interface-mockup.tsx#L267-L303).
- The actual editor's tab array contains only Layers, Brand, Pages, Images, and Branches in [`design-panel/index.tsx`](../../../apps/web/client/src/app/project/%5Bid%5D/_components/left-panel/design-panel/index.tsx#L17-L58).
- The active editor renders content only for those same five tabs in [`design-panel/index.tsx`](../../../apps/web/client/src/app/project/%5Bid%5D/_components/left-panel/design-panel/index.tsx#L136-L142).

There is therefore nothing to switch on locally. **Elements and Apps are not implemented as active tabs in the current web editor.**

## Evidence that the supplied image is a mockup

The image can be matched exactly to code in the public repository:

- The project name is statically set to `Villainterest`.
- The layer tree starts with `Design Mockup Container`.
- The search field says `Brutalist lair decor`.
- The chat asks about a masonry layout breaking on mobile.
- The next prompt says `Add a villain verification badge system`.
- The left rail contains the static labels Layers, Brand, Pages, Assets, Elements, and Apps.

All of those strings exist in [`onlook-interface-mockup.tsx`](../../../apps/web/client/src/app/_components/landing-page/onlook-interface-mockup.tsx). The component also says explicitly that its chat input is static and contains mock layer data:

```tsx
// For the mockup, the chat input is static (not interactive)
const displayedText = PRESET_SENTENCE;

// Mock data for layers panel
const mockLayers = [ /* ... */ ];
```

The apparent `Website.tsx` tool execution is also display-only. It comes from a local `ToolCallDisplay` React component and is not connected to the editor's real AI tool execution.

## What exists in the real local editor

The real left panel is implemented by:

```text
apps/web/client/src/app/project/[id]/_components/left-panel/design-panel/
├── layers-tab/
├── brand-tab/
├── page-tab/
├── image-tab/
├── branches-tab/
└── index.tsx
```

There is no `elements-tab` or `apps-tab` directory in that editor implementation. There is also no conditional branch, feature flag, account-plan check, or environment-variable check that adds either tab.

The shared enum still contains `COMPONENTS` and `APPS` values in [`packages/models/src/editor/index.ts`](../../../packages/models/src/editor/index.ts#L27-L37). These enum members do **not** create UI by themselves. They are currently unused remnants or placeholders. For a tab to appear, the editor also needs:

1. An entry in the real `tabs` array.
2. A React panel implementation.
3. A render branch for the selected tab.
4. Editor-engine state and operations supporting the panel.
5. Any required database, sandbox, or integration APIs.

The current code has none of those pieces for Elements or Apps.

## Historical context from the repository

Older Electron-era source did contain prototypes named `ComponentsTab` and `AppsTab`, but both buttons were hidden with CSS.

The old Elements/Components prototype:

- Asked the Electron main process to open a directory picker.
- Scanned a selected folder for React component descriptors.
- Displayed component names and source paths.
- Did not provide the polished element library shown in the promotional mockup.

The old Apps prototype:

- Used hard-coded sample entries such as Stripe, MongoDB, Figma, GitHub, Slack, and Notion.
- Described hypothetical MCP integrations.
- Used static “featured,” “installed,” and “category” data.
- Was not a functioning integration marketplace.

This can be inspected without changing the working tree:

```bash
git show 235e7f59^:apps/studio/src/routes/editor/LayersPanel/index.tsx
git show 235e7f59^:apps/studio/src/routes/editor/LayersPanel/ComponentsTab.tsx
git show 235e7f59^:apps/studio/src/routes/editor/LayersPanel/AppsTab/index.tsx
```

When Onlook moved from the Electron application to the current web architecture, those prototypes were not ported as functioning web-editor features. The current promotional mockup preserved the product concept, but the current open-source editor does not implement it.

## Is this an open-source versus hosted-edition restriction?

There is no evidence in this checkout that the tabs are implemented and then withheld from the open-source build.

Specifically:

- The real tab definitions are absent, not gated.
- No Elements or Apps feature flags are declared in [`env.ts`](../../../apps/web/client/src/env.ts).
- The only currently declared client feature flag is collaboration.
- No account plan or subscription check wraps these tabs.
- No corresponding current web-editor panel components exist.

The defensible conclusion is:

> The supplied image is a product/landing-page mockup showing intended or aspirational UI. It is not evidence of two working hosted-only panels.

It is possible that Onlook has unreleased or private work not present in the public repository, but this repository cannot prove that. What it does prove is that the image itself is generated by the public landing-page mockup and that the current public editor cannot render those tabs.

---

# How Onlook’s AI Understands and Changes a Project

## Architectural overview

Onlook does not send the complete repository to an LLM and does not use a vector database for code retrieval. It combines targeted visual context with model-selected tools.

```text
User selects an element in the preview
                │
                ▼
Browser DOM exposes data-oid / instance ID
                │
                ▼
AST index resolves ID → branch + file + JSX range
                │
                ▼
Prompt receives instruction + selected context + project rules
                │
                ▼
OpenRouter model requests read/edit/terminal tools
                │
                ▼
Browser validates and executes tools against the editor engine
                │
                ▼
ZenFS changes sync bidirectionally with CodeSandbox
                │
                ▼
Running Next.js preview reloads; Git checkpoint is created
```

## 1. Mapping a visual element back to source code

Whenever JSX is written through Onlook's `CodeFileSystem`, the file is parsed and stable `data-oid` attributes are maintained or added. The processed JSX is formatted, and an index is built containing:

- OID
- Branch ID
- File path
- Component name
- Opening and closing tag positions
- Exact source snippet

Relevant implementation:

- OID processing and metadata updates: [`packages/file-system/src/code-fs.ts`](../../../packages/file-system/src/code-fs.ts#L46-L128)
- OID generation and conflict handling: [`packages/parser/src/ids.ts`](../../../packages/parser/src/ids.ts)
- Selected-element context generation: [`chat/context.ts`](../../../apps/web/client/src/components/store/editor/chat/context.ts#L223-L280)

When a user clicks an element, Onlook reads the DOM's OID, looks it up in the AST-derived index, and creates a highlight context containing the actual path, source snippet, and line range. This is why the AI can understand “change this card” without relying only on a textual description.

## 2. Context sent to the model

Before sending a message, the browser constructs context appropriate to the chat mode. Supported context types include:

- `file`: complete source for a relevant file
- `highlight`: exact selected JSX and its line range
- `branch`: the branch the selected frame or element belongs to
- `error`: collected browser and terminal errors
- `agent-rule`: project-specific instructions
- `image`: local or newly supplied images

The assembly happens in [`chat/context.ts`](../../../apps/web/client/src/components/store/editor/chat/context.ts#L93-L190). The context is then converted into XML-like prompt sections by [`packages/ai/src/prompt/provider.ts`](../../../packages/ai/src/prompt/provider.ts#L56-L140).

Only the most recent user's file context includes full file content. Older file contexts are reduced to paths and branch identifiers to control token use. The model can retrieve current content again with `read_file`, `grep`, `glob`, or shell tools.

This is targeted context plus tool-based retrieval, not whole-repository retrieval-augmented generation.

## 3. Project-specific AI rules

On every normal chat request, Onlook checks the active project's root for these files:

```text
agents.md
claude.md
AGENTS.md
CLAUDE.md
```

Non-empty matches are attached as `agent-rule` context. See [`chat/context.ts`](../../../apps/web/client/src/components/store/editor/chat/context.ts#L282-L312).

Limitations:

- Only the active sandbox root is checked.
- Nested rule files are not discovered.
- No precedence system exists between nested directories because nested rules are not loaded.
- Rules guide the model but do not constitute a hard execution sandbox.

## 4. Hard-coded system rules

The Edit system prompt identifies the model as an expert React, Next.js, and Tailwind design engineer. It tells the model to:

- Respect existing conventions and libraries.
- Keep files and functions small.
- Use grep/search/terminal for exploration.
- Use typechecking after changes.
- Execute commands rather than telling the user to execute them.
- Never add, remove, edit, or pass through `data-oid` attributes.

See [`packages/ai/src/prompt/constants/system.ts`](../../../packages/ai/src/prompt/constants/system.ts).

Additional prompts specialize behavior:

- Ask mode is advisory and should not modify code.
- Create mode tells the model it is setting up a blank project.
- Error context contains Bun-specific debugging guidance.
- Shell guidance requires Bun rather than npm, pnpm, or Yarn.

## 5. Model selection and streaming loop

The root agent uses the Vercel AI SDK `streamText` loop. Current model selection is:

| Mode | Model |
| --- | --- |
| Edit | `anthropic/claude-sonnet-4.5` through OpenRouter |
| Ask | `anthropic/claude-sonnet-4.5` through OpenRouter |
| Create | `openai/gpt-5` through OpenRouter |
| Fix | `openai/gpt-5` through OpenRouter |
| Invalid tool-call repair | `openai/gpt-5-nano` through OpenRouter |

The agent stops after at most 20 model/tool steps. See [`packages/ai/src/agents/root.ts`](../../../packages/ai/src/agents/root.ts#L20-L118).

The server endpoint:

1. Authenticates the Supabase user.
2. Checks daily/monthly message usage.
3. Starts the model stream.
4. Streams assistant text and tool calls to the browser.
5. Replaces the stored conversation after completion.

See [`apps/web/client/src/app/api/chat/route.ts`](../../../apps/web/client/src/app/api/chat/route.ts).

## 6. Available AI tools

Ask mode receives read-oriented tools. Edit, Create, and Fix receive both read and editing tools.

### Read and diagnostic tools

- List files and directories
- Read a file, with line numbering and truncation for very large files
- Run an allowlisted read-oriented shell command
- Glob for file paths
- Grep file contents
- List project branches
- Read the Tailwind/CSS style guide
- Read Onlook product instructions
- Inspect collected terminal/browser errors
- Run `bunx tsc --noEmit`
- Search the web
- Scrape a URL

### Editing and execution tools

- Exact search-and-replace in one file
- Multiple sequential exact replacements
- Full file creation or overwrite
- Fuzzy model-assisted edit application
- File-management shell commands
- Generic terminal commands
- Restart the dev server or read its logs
- Upload images into a project

The tool grouping is defined in [`packages/ai/src/tools/toolset.ts`](../../../packages/ai/src/tools/toolset.ts#L35-L70).

## 7. Client-side execution

The AI server describes tools to the model but does not directly hold a CodeSandbox filesystem object. When the model emits a tool call:

1. The browser receives it through the AI SDK chat hook.
2. The browser checks which tools are available in the current chat mode.
3. The selected tool's Zod schema validates the model-generated input.
4. A client tool instance executes against the current `EditorEngine`.
5. The result or error is returned to the model.
6. The model may inspect the result and request another tool.

See:

- Chat hook: [`use-chat/index.tsx`](../../../apps/web/client/src/app/project/%5Bid%5D/_hooks/use-chat/index.tsx#L45-L67)
- Tool validation/execution: [`components/tools/tools.ts`](../../../apps/web/client/src/components/tools/tools.ts)

The loop automatically continues when an assistant message finishes with tool calls. There is no per-tool human approval dialog in the current implementation.

## 8. How file changes reach CodeSandbox

AI file tools write into a branch-scoped `CodeFileSystem` backed by browser-side ZenFS. A `CodeProviderSync` instance connects that local filesystem to the branch's CodeSandbox provider.

At startup, the sync engine:

1. Pulls project files from CodeSandbox.
2. Excludes large/generated paths such as `node_modules`, `.git`, `.next`, `dist`, and `build`.
3. Processes JSX and builds the OID metadata index.
4. Establishes CodeSandbox and local filesystem watchers.

After startup, writes, deletes, and renames are synchronized in both directions. See [`services/sync-engine/sync-engine.ts`](../../../apps/web/client/src/services/sync-engine/sync-engine.ts).

The running Next.js task in CodeSandbox sees the synchronized write and refreshes the preview.

## 9. Edit methods

### Exact edit

`search_replace_edit_file` reads a file and requires `old_string` to exist exactly. Unless `replace_all` is enabled, the match must be unique. Ambiguous or missing matches fail without writing the file.

See [`search-replace-edit.ts`](../../../packages/ai/src/tools/classes/search-replace-edit.ts).

### Full write

`write_file` creates a file or overwrites its complete contents. JSX/TSX writes still pass through OID processing and formatting in `CodeFileSystem`.

### Fuzzy edit

`fuzzy_edit_file` sends the original file, an abbreviated model-generated update, and an instruction to the server-side apply service. That service is designed to use Morph or Relace to merge the change into the original source.

Relevant files:

- Client tool: [`fuzzy-edit-file.ts`](../../../packages/ai/src/tools/classes/fuzzy-edit-file.ts)
- Protected API procedure: [`server/api/routers/code.ts`](../../../apps/web/client/src/server/api/routers/code.ts#L9-L42)
- Provider clients: [`packages/ai/src/apply/client.ts`](../../../packages/ai/src/apply/client.ts)

Current implementation issue: `applyCodeChange` builds a preferred-provider/fallback-provider list, but its catch block immediately rethrows. A failure from the first provider therefore prevents the documented second attempt.

## 10. Persistence and rollback

Supabase/Postgres stores the control plane, not the project's complete source tree.

The database stores:

- Users and project memberships
- Project metadata
- Branch metadata and branch-to-CodeSandbox mappings
- Canvases and frames
- Conversations
- Message text/tool parts
- Attached message context
- Token usage
- Git checkpoint IDs

The source of truth for runnable project code is the CodeSandbox attached to each branch, with a browser-side synchronized copy while the editor is open.

The chat message schema is defined in [`packages/db/src/schema/chat/message.ts`](../../../packages/db/src/schema/chat/message.ts). It stores `parts`, `context`, `checkpoints`, and usage as JSONB.

At the end of a completed AI run, Onlook creates a Git commit for every loaded branch and stores the resulting commit OID on the user's message. The user can restore one or more branches to those checkpoints. See:

- Checkpoint creation: [`use-chat/index.tsx`](../../../apps/web/client/src/app/project/%5Bid%5D/_hooks/use-chat/index.tsx#L225-L285)
- Git restore behavior: [`components/store/editor/git/utils.ts`](../../../apps/web/client/src/components/store/editor/git/utils.ts)

## 11. Authorization and operational boundaries

Implemented protections include:

- Supabase authentication on chat and tRPC procedures.
- Daily and monthly message limits.
- Project-membership checks before reading or writing conversations and messages.
- Branch and sandbox ownership checks in server procedures.
- Zod validation of model-generated tool inputs.
- Ask-mode removal of editing tools.
- Branch IDs on file tools, limiting them to branch objects loaded into the current editor engine.
- Git checkpoints for recovery.

Important boundaries:

- Build mode has a generic terminal tool capable of running any Bash command inside the CodeSandbox.
- Tool calls execute automatically in the browser.
- The instruction to typecheck is prompt guidance rather than a mandatory post-edit gate.
- The project-rule mechanism is prompt context, not enforceable policy.
- The main isolation boundary for terminal execution is CodeSandbox.

## 12. Current local database observation

At analysis time, the local Supabase instance contained:

| Table | Row count |
| --- | ---: |
| Projects | 3 |
| Branches | 5 |
| Conversations | 3 |
| Messages | 7 |
| User/project memberships | 3 |

The most recent user message had three context records: `file`, `highlight`, and `branch`. This confirms that the local editor successfully mapped a selected visual element back to its source context.

The corresponding assistant message contained no parts because the model request failed before returning an answer.

## 13. Current local AI configuration problem

The CodeSandbox connection works, but the AI model does not currently authenticate.

The development terminal reports:

```text
OpenRouter 401: Missing Authentication header
```

The local `OPENROUTER_API_KEY` value is a placeholder. The previously supplied `csb_...` credential is a CodeSandbox API token and cannot authenticate OpenRouter.

Required for normal AI chat:

```dotenv
OPENROUTER_API_KEY=<valid OpenRouter API key>
```

Optional capabilities require additional credentials:

| Capability | Environment variable |
| --- | --- |
| Fuzzy code application | `MORPH_API_KEY` and/or `RELACE_API_KEY` |
| Web search | `EXA_API_KEY` |
| URL/branding scrape | `FIRECRAWL_API_KEY` |
| Telemetry/tracing | `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASEURL` |
| Analytics | `NEXT_PUBLIC_POSTHOG_KEY` |

Missing PostHog configuration produces non-fatal warnings. Missing OpenRouter authentication prevents AI replies and tool calls.

## 14. Verification performed

The focused AI package suites were executed locally:

```bash
bun test packages/ai/test/prompt \
  packages/ai/test/contexts \
  packages/ai/test/tools \
  packages/ai/test/stream
```

Result:

```text
292 pass
0 fail
```

These tests cover prompt generation, context formatting, stream conversion, file reading, exact editing, and shared tool helpers. They do not test a live OpenRouter request or implement the missing Elements and Apps features.

---

# What Would Be Required to Add Elements and Apps

## Elements

A meaningful Elements panel would need more than restoring the old hidden button. A complete web implementation would require:

1. A component discovery/indexing service that works against CodeSandbox rather than Electron filesystem IPC.
2. Parsing exports and props for reusable React components.
3. A browser panel for browsing/searching components.
4. Preview thumbnails or renderable component metadata.
5. Drag/drop or click-to-insert behavior integrated with Onlook's AST editing pipeline.
6. Import insertion and relative-path resolution.
7. Prop initialization and required-prop handling.
8. OID creation for inserted JSX.
9. Undo/redo and Git checkpoint integration.
10. Tests for default exports, named exports, aliases, monorepos, server components, and unsupported components.

The old Electron `ComponentsTab` only covered directory selection and listing; it is not a drop-in implementation for the current web editor.

## Apps

The promotional Apps concept appears to describe third-party or MCP-style integrations. A real implementation would require:

1. A formal integration manifest/schema.
2. An integration catalog source.
3. OAuth or API-key connection flows.
4. Encrypted secret storage outside the browser project filesystem.
5. Per-project or per-user installation records.
6. Backend adapters or MCP client/server lifecycle management.
7. Tool discovery and permission scopes.
8. Clear user approval before integrations perform external actions.
9. Uninstall/revoke flows.
10. Auditing, error handling, rate limits, and tenant isolation.

The old Apps prototype used sample arrays and display cards. It did not implement these backend requirements.

## Recommended interpretation

Treat the landing-page screenshot as a product-direction illustration. The current open-source editor is the implementation shown by the actual editor route and its registered panels. Adding Elements is feasible as an incremental code feature; adding Apps is a significantly larger integrations platform rather than a sidebar-only change.
