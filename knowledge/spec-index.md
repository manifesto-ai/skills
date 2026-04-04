# Knowledge Index

Use this file to choose the right installed knowledge note. For normal integrations, stay inside these installed files instead of reaching for repo-internal docs.

## Start here

- Runtime seam choice: `architecture.md`
- Common mistakes and debugging smells: `antipatterns.md`
- Patch and snapshot mutation rules: `patch-rules.md`
- Effect handler behavior: `effect-patterns.md`

## Package notes

- Base runtime API: `packages/sdk.md`
- Continuity and sealing: `packages/lineage.md`
- Legitimacy and approval: `packages/governance.md`
- Core semantics: `packages/core.md`
- Host execution model: `packages/host.md`
- MEL compiler entrypoints: `packages/compiler.md`
- Code generation surface: `packages/codegen.md`
- Studio CLI inspection surface: `packages/studio-cli.md`
- Studio core analysis surface: `packages/studio-core.md`

## MEL notes

- Practical generation patterns: `mel-patterns.md`
- Builtins and syntax quick reference: `mel-reference.md`

## Quick routing

| Need to understand... | Load |
|----------------------|------|
| Which runtime verb to use | `architecture.md`, `packages/sdk.md`, `packages/lineage.md`, `packages/governance.md` |
| When to use projected vs canonical snapshot | `architecture.md`, `packages/sdk.md`, `packages/lineage.md`, `packages/governance.md`, `packages/studio-cli.md` |
| How to write effect handlers | `effect-patterns.md`, `packages/sdk.md`, `packages/host.md` |
| How to inspect or debug a domain from the terminal | `packages/studio-cli.md` |
| How to use Studio projections in code | `packages/studio-core.md` |
| How to debug runtime state from a canonical snapshot | `packages/sdk.md`, `packages/studio-cli.md`, `packages/studio-core.md` |
| How to write MEL safely | `mel-patterns.md`, `mel-reference.md`, `antipatterns.md` |
| How patches and re-entry work | `patch-rules.md`, `antipatterns.md` |
