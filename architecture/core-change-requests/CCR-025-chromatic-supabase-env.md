---
title: CCR-025 — Supply inherited Chromatic CI public Supabase variables
status: approved
path: .github/workflows/chromatic.yml
pinnedBaseline: 423e2e924366419e418ee049093872d535eea41a
---

# CCR-025 — `.github/workflows/chromatic.yml`

## Current responsibility

The protected inherited workflow runs Chromatic on every push. In the Jagwar fork, the token authenticates and Storybook builds and uploads, but Chromatic fails while extracting stories because the published browser bundle throws `Invalid environment variables`.

GitHub now holds the browser-safe `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` repository variables. Repository variables are available through the `vars` context but are not automatically exported into a runner process.

## Approved change

Map exactly those two repository variables into the existing job environment:

```diff
 jobs:
   chromatic:
     name: Run Chromatic
     runs-on: ubuntu-latest
     env:
       SKIP_ENV_VALIDATION: true
+      NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}
+      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

No trigger, condition, action version, command, token reference, build setting, server credential, or other workflow content changes.

## Purpose and behavior

- Keep inherited Chromatic visual-regression publishing active on every push.
- Make the public Supabase configuration available while Storybook is built so the browser bundle can validate at runtime.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DATABASE_URL`, and every other privileged credential out of Chromatic.
- Fail closed if either repository variable is absent or invalid.

## Why a new file is insufficient

The environment consumed by the protected inherited workflow must be mapped inside that workflow. GitHub repository variables do not automatically become runner environment variables.

## Alternatives considered

- Make Chromatic opt-in: rejected because the required values are browser-safe and preserving the inherited visual-regression check is preferable.
- Hardcode the values in the workflow: rejected because repository configuration belongs in GitHub variables.
- Store the values as GitHub secrets: unnecessary because both values are intentionally shipped to browsers; repository variables accurately classify them as non-sensitive.
- Relax `apps/web/client/src/env.ts`: rejected as a broader protected-core change that weakens application validation.

## Risk and compatibility

- No application, dependency, lockfile, build output, or production behavior changes.
- The values are public by design and GitHub may render repository variables unmasked in logs.
- A missing or invalid value leaves Chromatic failing rather than silently disabling the check.

## Tests

- Confirm both repository variable names exist without printing their values.
- Confirm the protected workflow diff contains only the two mappings shown above.
- Push the exact approved state and require Chromatic, Architecture Contract, Typecheck, Unit Test, and Vercel to pass.

## Rollback

Remove only the two environment mappings. The repository variables may then be deleted independently if no other workflow uses them.

## Decision

Andrew explicitly approved the exact revised CCR-025 scope on 2026-07-29. Approval is limited to the two protected workflow mappings shown above.
