# Delta for Website Creation and Presets

## MODIFIED Requirements

### Requirement: Inherited creation toolchain is preserved

The system MUST feed controlled business and design guidance into the existing fixed-starting-template behavior, project creation flow, editor, and AI CREATE toolchain through a provider-neutral runtime contract. The starting template's product behavior MUST remain fixed unless template versioning is separately governed; its provider-specific identifier MUST NOT be a product identity. The system MUST NOT introduce a second generator, replace the editor, or change inherited publishing through this capability.

(Previously: Controlled guidance was fed into the existing fixed CodeSandbox template and inherited project, editor, and CREATE flows.)

#### Scenario: Website is generated

- GIVEN validated controlled guidance is ready
- WHEN generation starts
- THEN it MUST use the inherited CREATE path and fixed starting behavior
- AND provider selection MUST occur behind the provider-neutral runtime contract

#### Scenario: Provider changes without template governance

- GIVEN a replacement editing provider is selected
- WHEN a website is created
- THEN generator, preset, prompt, editor, project, and fixed-starting-template outcomes MUST remain equivalent to the verified baseline
- AND no provider-specific template identifier MAY become a project-owned identity
