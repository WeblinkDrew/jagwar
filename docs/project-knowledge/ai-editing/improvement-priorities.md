# AI Editing Accuracy, Cost, and User Experience Priorities

**Assessment date:** 2026-07-29  
**Scope:** The local Jagwar/Onlook AI editing path  
**Decision order:** correct customer edits first, cost per successful edit second, user experience third

## Executive assessment

The current system has a strong product-grade foundation: a capable planning model streams through the AI SDK, typed tools constrain its actions, exact edit tools handle deterministic changes, Morph or Relace can merge partial edits into a full file, and users have branch-aware history and restore controls.

It is not yet an enterprise-grade correctness system from the customer's point of view. The largest gap is that a tool can write an edit before the product proves that the requested behavior works. Validation is available, but the model is merely instructed to invoke it. Fast-apply output is written directly, the apparent provider fallback does not recover from normal provider exceptions, and checkpoints are created after a completed response rather than immediately before a new edit.

The best investment is therefore a closed edit transaction:

```text
request + relevant context
        ↓
pre-edit checkpoint
        ↓
deterministic edit or bounded fast apply
        ↓
output and scope validation
        ↓
changed-scope checks
        ↓
accept ──────────────── or ── one bounded repair attempt
                                   ↓
                              accept or rollback
```

This raises the rate of correct first-pass edits, reduces expensive follow-up conversations, and gives the user a clear success or recovery state.

## How the current system works

1. Edit conversations use Claude through OpenRouter; create/fix modes use GPT-5. The AI SDK supplies streaming, structured tool calls, a 20-step ceiling, schema repair, and Langfuse-compatible telemetry.
2. The planning model can choose exact search-and-replace tools, whole-file writes, terminal tools, or `fuzzy_edit_file`.
3. Exact search-and-replace runs locally and, for a single replacement, rejects missing or non-unique targets. `replace_all` is also local but currently does not reject a zero-match no-op. Neither path requires a second AI provider call.
4. A fuzzy edit reads the complete target file and sends that file, the proposed snippet, and the instruction to the server. The server prefers Morph's `morph-v3-large` and defines Relace Instant Apply as the alternate provider.
5. The merged fuzzy result is written directly to the project file. There is no mandatory syntax, scope, type, build, or behavioral gate between the provider response and the write.
6. Type checking and terminal-error inspection exist as tools, but completion does not require the model to call or pass them.
7. When the chat finishes, the client creates branch checkpoints. A user can restore an earlier checkpoint, and the restore path first attempts to save the current state.

Relevant implementation evidence includes the [root agent](../../../packages/ai/src/agents/root.ts), [tool registry](../../../packages/ai/src/tools/toolset.ts), [fast-apply clients](../../../packages/ai/src/apply/client.ts), [fuzzy edit tool](../../../packages/ai/src/tools/classes/fuzzy-edit-file.ts), [exact edit tool](../../../packages/ai/src/tools/classes/search-replace-edit.ts), [typecheck tool](../../../packages/ai/src/tools/classes/typecheck.ts), [prompt context builder](../../../packages/ai/src/prompt/provider.ts), and [chat API route](../../../apps/web/client/src/app/api/chat/route.ts).

## What is already enterprise-grade

These are meaningful strengths worth preserving:

- **Reasoning and application are separated.** The primary model decides what should change; exact tools or a smaller specialized apply model perform the mutation.
- **Tools have typed schemas.** Zod-backed tool inputs and AI SDK tool-call repair reduce malformed actions.
- **Deterministic edits are available.** Unique-match search-and-replace is safer and cheaper than asking a second model to reconstruct every change.
- **Context is structured.** Files, selections, errors, images, branches, and agent rules are distinct context types. Older file bodies are reduced to paths instead of being resent indefinitely.
- **Authentication and usage controls exist.** The fast-apply tRPC operation is protected, chat usage is incremented atomically, and failed stream setup can restore a consumed message credit.
- **The interaction streams and is bounded.** Users see progressive work, and the main agent stops after a maximum of 20 steps.
- **Recovery infrastructure exists.** Git-backed, branch-aware checkpoints and restore behavior are already present.
- **Main-model observability exists.** Trace metadata includes user, project, conversation, chat type, and trace identifiers, while model token usage is retained on messages.

The important distinction is that these are good components. Enterprise-grade customer outcomes require them to be enforced as one end-to-end contract.

## Improvements ranked from most important to least important

Impact labels are relative to the three decision criteria. “Cost” means reducing model calls or tokens per successful customer edit, not simply making each individual call cheaper.

| Rank | Improvement | Correct edits | Lower AI cost | Better UX | Why it belongs here |
| ---: | --- | :---: | :---: | :---: | --- |
| 1 | Enforce validation, one bounded repair, then rollback | Critical | High | Very high | This is the only item that turns “the tool wrote files” into an enforced, end-to-end definition of a successful customer edit. Automatic rollback prevents a broken state; one repair avoids unbounded call loops. Fewer failed edits also mean fewer customer retry chats. |
| 2 | Route exact edits locally and reserve fast apply for genuinely fuzzy merges | Very high | Very high | High | Exact edits are more predictable and avoid a Morph/Relace call. The router should choose single replacement, multi-replacement, new-file write, or fuzzy merge from edit shape and confidence. |
| 3 | Validate fast-apply output before writing it | Very high | High | High | Reject empty, truncated, fenced, malformed, unexpectedly large, or protected-attribute-changing output. A cheap local guard prevents bad provider output from becoming a file and avoids repair conversations. |
| 4 | Create a pre-edit checkpoint and stage multi-file changes as a transaction | Very high | Medium | Very high | Current checkpoints are created after a finished response. A pre-edit snapshot protects manual work made since the last chat and makes partial multi-file failure recoverable as one unit. |
| 5 | Make Morph-to-Relace failover real, bounded, and observable | High | Medium | Very high | The current loop rethrows an exception from the preferred provider, so the alternate is normally skipped on the failures where it is most needed. Add per-attempt timeouts, cancellation, retry classification, and a total latency/cost budget. |
| 6 | Plan dependency-aware change scope before editing | High | High | High | Correct UI changes often span a component, types, callers, tests, and styles. A compact manifest of intended files and invariants reduces missed companion edits without loading the whole repository. |
| 7 | Replace “ALWAYS refactor” with a minimal-diff instruction | High | High | High | The current system prompt encourages unrelated refactoring on every request. Minimal coherent changes are easier to validate, consume fewer output/apply tokens, produce smaller diffs, and better match user intent. |
| 8 | Budget context by relevance, freshness, and token cost | High | Very high | High | Send the smallest dependency-complete context. Prefer selections and symbols, load full files only when necessary, refresh files before mutation, and summarize stale conversation state. |
| 9 | Build a golden edit evaluation suite and use it to choose providers | High | High | Medium | Representative React, Next.js, Tailwind, TypeScript, and multi-file tasks should measure exactness, unrelated changes, validation success, latency, and cost. Provider routing should follow evidence, not a fixed default. |
| 10 | Show explicit edit phases, scope, validation, and recovery choices | Medium | Medium | Very high | “Reading,” “editing,” “validating,” “repairing,” and “rolled back” states tell users what is happening. Preview or approval should be reserved for high-risk or wide changes so routine work stays fast. |
| 11 | Measure fast-apply quality and cost per successful edit | Medium | High | Medium | Main-model telemetry exists, but the fast-apply path needs provider, latency, input size, outcome, fallback, validation, repair, and rollback events. Do not put raw source in telemetry. |
| 12 | Add enterprise source-code governance controls | Medium | Low | Medium | Tenant policy, vendor allowlists, retention terms, regional routing, secret scanning/redaction, and a “do not send externally” mode are essential for enterprise adoption, though their direct effect on edit accuracy and call cost is smaller. |

## Details for the highest-priority fixes

### 1. Make successful validation a product invariant

The system prompt currently tells the model to use the typecheck tool, but the runtime does not require it. Convert that suggestion into orchestration:

- Capture the intended scope and acceptance conditions before mutation.
- Run cheap structural guards after every edit.
- Select validation from the changed files: parser/syntax checks first, then typecheck, lint, focused tests, and build only where relevant.
- Compare failures with the pre-edit baseline so unrelated existing errors do not cause endless repair.
- Permit at most one automatic repair pass by default.
- If the gate still fails, restore the pre-edit snapshot and return a structured explanation.

The customer should see “completed” only when the edit is both written and verified.

### 2. Use the cheapest reliable edit mechanism

Recommended routing policy:

| Edit shape | Preferred mechanism | Extra apply-model call |
| --- | --- | :---: |
| One known, unique old block | Exact search-and-replace with a required match | No |
| Several known blocks in one file | Exact multi-edit with required matches | No |
| A genuinely new, reasonably small file | Whole-file write | No separate fast-apply call |
| Partial sketch that must merge into a large existing file | Morph or Relace fast apply | Yes |
| Ambiguous, wide, or destructive change | Clarify or preview first | Avoid until approved |

The router should fall back from exact to fuzzy only when the exact preconditions fail safely. It should never silently broaden an edit.

### 3. Reject obviously unsafe merge output cheaply

Before writing a fast-apply result, verify at minimum:

- The result is non-empty and valid text.
- Markdown fences or conversational prose were not inserted around the code.
- The file parses for supported languages.
- Required protected markers such as `data-oid` were not removed, added, or changed.
- The diff stays within a configurable size and file-risk budget.
- Content outside the expected edit regions has not changed unexpectedly.
- The result still contains required imports, exports, or framework entry points identified before editing.

These checks are local and cheap compared with another model call.

### 4. Protect the user's starting state

Today, checkpoint creation runs after the response finishes. That supports version history, but it is not the same as protecting the exact state immediately before an AI request. The edit transaction should:

1. Commit or snapshot every affected branch before the first mutating tool.
2. Stage edits and retain original contents for all affected files.
3. Validate the complete change set.
4. Commit the accepted state, or restore every staged file together.

This prevents one successful file write followed by one failed file write from leaving the project half-changed.

### 5. Correct and bound provider fallback

The current provider loop catches an error, logs it, and immediately throws it. That prevents the next loop iteration after most HTTP, authentication, timeout, or parsing failures. The corrected policy should:

- Retry the alternate provider only for transient, quota, timeout, malformed-output, or service failures that the alternate could solve.
- Avoid fallback for invalid credentials, prohibited content, invalid input, or client cancellation.
- Give each provider a short timeout and the overall operation a single deadline.
- Cancel the first request before beginning the second.
- Record which provider produced the accepted result and the total cost of both attempts.
- Stop after the alternate attempt; never create an open-ended provider loop.

## Cost controls that do not sacrifice correctness

- Optimize **cost per accepted edit**, not cost per request. A cheap wrong answer followed by two repair chats is expensive.
- Prefer exact local mutations whenever their preconditions are provable.
- Cache stable instructions and project summaries, but reread files immediately before writing to avoid stale edits.
- Send only selected or dependency-relevant code to the main model. Send only the one target file to fast apply.
- Cap main-agent steps, provider attempts, repair attempts, and total wall-clock time as one budget.
- Use evaluation data to route by language, file size, edit type, and provider success rate.
- Track main-model tokens, fast-apply bytes/tokens where available, and all attempts under the same customer edit identifier.

The current product meters edit usage largely as messages rather than actual provider cost. That is suitable for a simple customer quota, but internal cost accounting should include every main-model, tool-call-repair, and fast-apply attempt.

## What “source is sent externally” means here

For `fuzzy_edit_file`, the complete contents of the **target file** are sent to Morph or Relace together with the proposed edit snippet and instruction. This does not mean the entire repository is automatically sent in one fast-apply call. Separately, OpenRouter receives the conversation plus the file, selection, error, image, branch, and agent-rule context attached to the AI request; the latest attached file context can contain complete file bodies.

That matters because a source file can contain proprietary algorithms, unreleased product logic, customer identifiers, internal endpoints, or accidentally committed secrets. The data leaves the Jagwar-controlled runtime so another company can process the request. Enterprise controls should therefore include:

- A documented provider data-processing and retention policy.
- Tenant-level provider opt-in, allowlist, and “local/exact edits only” modes.
- Secret detection and redaction before external calls.
- File/path exclusions for sensitive areas.
- Region and residency controls where required.
- Logs and telemetry that store hashes, sizes, and outcomes rather than raw source.

This is an enterprise trust and procurement issue even though it ranks below correctness and cost in this customer-outcome ordering.

## Recommended delivery sequence

### P0 — Correctness and recovery

Implement ranks 1 through 5 together: mandatory acceptance gating, exact-first routing, output guards, pre-edit transactions, and working bounded failover. These changes create the minimum reliable editing contract.

### P1 — Scope quality and unit economics

Implement ranks 6 through 9: dependency-aware planning, minimal-diff prompting, context budgets, and a golden evaluation suite. Use the resulting evidence to tune provider and validation routing.

### P2 — Transparency and enterprise controls

Implement ranks 10 through 12: visible phases and recovery, unified quality/cost telemetry, and tenant-governed external-source policies.

## Measures of success

Establish a baseline before setting numeric targets, then track:

- Accepted edits that pass validation on the first attempt.
- Customer requests completed without a follow-up correction prompt.
- Unrelated lines changed per accepted edit.
- Automatic repair and rollback rates.
- Main-model calls, repair calls, and fast-apply attempts per accepted edit.
- Input/output tokens and estimated provider cost per accepted edit.
- Morph first-attempt success, Relace first-attempt success, and fallback recovery rate.
- Median and p95 time to an accepted edit.
- User cancellation, manual revert, and retry rates.
- Validation failures by language, tool, provider, and edit shape.

The strongest north-star metric is **customer edit requests accepted without correction per dollar of provider spend**. It combines the three priorities without rewarding cheap but incorrect output or polished UX around unreliable edits.

## Assessment limits

This is a static review of the local implementation, not a live benchmark of Morph, Relace, OpenRouter, Anthropic, or OpenAI quality. No provider calls were made for this assessment. Ranking should be revisited after the golden evaluation suite produces real accuracy, latency, and cost data.
