# Website Creation and Presets Specification

## Purpose

Define explicit lead-backed website creation, controlled generation inputs, managed and workspace presets, untrusted content handling, and composition into inherited Onlook CREATE. This capability depends on workspace authority, active AI entitlement and balance, lead persistence, and valid workspace CodeSandbox BYOK.

## Requirements

### Requirement: Creation is explicit, lead-backed, and single-source

Website generation MUST begin only after an authorized user explicitly selects `Create Website` for a lead and confirms exactly one source: Inspiration, Style, or Let Jagwar Decide. Operators MAY add bounded notes but MUST NOT edit the full generation prompt.

#### Scenario: Operator confirms one source

- GIVEN an eligible lead, active AI entitlement, sufficient credits, and valid CodeSandbox authority
- WHEN the operator confirms Create Website with exactly one valid source
- THEN the system MUST initiate one lead-backed creation through the inherited project flow

#### Scenario: Sources conflict

- GIVEN a request selects both Inspiration and Style
- WHEN the server validates it
- THEN the request MUST be rejected before credit debit, project creation, or provider invocation

### Requirement: Preset semantics remain distinct

An Inspiration `DESIGN.md` MUST contain design guidance with concrete reference code, and the AI MUST be instructed to adapt rather than copy it verbatim. A Style `DESIGN.md` MUST contain guidance only and no implementation code. Let Jagwar Decide MUST derive controlled guidance from the business profile. Final Jagwar-managed preset content MUST remain a launch blocker until approved.

#### Scenario: Style upload contains code

- GIVEN an Owner uploads a Style preset containing implementation code
- WHEN validation runs
- THEN the upload MUST be rejected without replacing the current preset

### Requirement: Workspace uploads are bounded and Owner-managed

V1 MUST support Jagwar-managed presets and workspace-uploaded Inspiration and Style presets. Each workspace upload MUST be one validated `DESIGN.md`; Inspiration code MUST be accepted only in fenced code blocks. Archives, assets, and Git ingestion MUST be rejected. Only Owners MUST create, replace, or delete workspace presets; Members MAY select available presets.

#### Scenario: Member attempts preset replacement

- GIVEN a Member can select a workspace preset
- WHEN the Member attempts to replace it
- THEN the server MUST deny the mutation while leaving the preset unchanged

#### Scenario: Concurrent replacement races

- GIVEN two Owner requests replace the same preset version
- WHEN they commit concurrently
- THEN at most one replacement MUST succeed
- AND the stale request MUST NOT overwrite it

### Requirement: Untrusted inputs cannot change system authority

Uploaded markdown, operator notes, business data, and listing media MUST be treated as untrusted. They MUST NOT override system or security instructions, expose secrets, or select provider authority. Listing photos MAY be used only after operator review and MUST retain source provenance.

#### Scenario: Markdown contains instruction override text

- GIVEN a preset attempts to override system rules or request secrets
- WHEN prompt guidance is composed
- THEN the content MUST remain bounded untrusted guidance
- AND system and security instructions MUST retain precedence

### Requirement: Inherited creation toolchain is preserved

The system MUST feed controlled business and design guidance into the existing fixed CodeSandbox template, project creation flow, editor, and AI CREATE toolchain. It MUST NOT introduce a second generator, replace the editor, or change inherited publishing through this capability.

#### Scenario: Website is generated

- GIVEN validated controlled guidance is ready
- WHEN generation starts
- THEN it MUST use the inherited CREATE path and fixed template

### Requirement: Metering and persistence commit safely

This capability MUST own preset records and creation-intent evidence; lead/project relationships MUST remain with their owning capabilities, and AI usage MUST remain in the commercial ledger. Repeated or concurrent confirmation of one creation identity MUST create at most one project and one credit debit. If entitlement, credits, BYOK, inherited creation, or required persistence fails, the operation MUST fail without a falsely successful website relationship.

#### Scenario: Confirmation is retried

- GIVEN an earlier request already committed a project for the creation identity
- WHEN it is retried
- THEN the prior outcome MUST be returned without another project or debit
