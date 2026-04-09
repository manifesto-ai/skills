---
name: manifesto
description: Use when building with Manifesto runtimes, MEL flows, or SDK/Studio/Lineage/Governance seams. Focus on consumer-facing integration guidance, domain inspection, and runtime debugging.
---

# Manifesto Skills

You are integrating or extending a Manifesto-based system. Prefer the current public seams and keep your reasoning inside the installed skill knowledge by default.

## Scope Note

This skills pack is for agents using Manifesto, not for editing Manifesto internals by default.

- `@manifesto-ai/sdk` owns the base activation-first app path: `createManifesto(schema, effects) -> activate() -> dispatchAsync(intent)`.
- SDK-derived runtimes expose the current legality surface: coarse `isActionAvailable()` / `getAvailableActions()`, fine `isIntentDispatchable()` / `getIntentBlockers()`, and current-snapshot explanation reads via `explainIntent()` / `why()` / `whyNot()`.
- projected static introspection and dry-run also live on the activated SDK surface via `getSchemaGraph()` and `simulate()`.
- `@manifesto-ai/sdk/extensions` is the arbitrary-snapshot read-only seam for helpers such as `explainIntentFor()` and multi-step simulation sessions.
- `@manifesto-ai/lineage` and `@manifesto-ai/governance` are the active governed composition packages. The public governed direction is `createManifesto() -> withLineage() -> withGovernance() -> activate()`.
- The current compiler contract includes `dispatchable when`, expression-level collection builtins such as `filter()` / `map()`, and schema-position support for `Record<string, T>` and `T | null`.
- `getSnapshot()` is the normal app-facing read model. `getCanonicalSnapshot()` is the explicit substrate read for restore, seal-aware tooling, and deep debugging.
- `@manifesto-ai/studio-cli` is the terminal inspection surface for findings, canonical snapshot debugging, trace replay, and transition graph projection.
- `@manifesto-ai/studio-core` is the projection-first analysis layer for offline findings, graph inspection, and overlay-aware tooling.
- The installed skill should be enough for normal app, tool, and experiment integrations. Do not assume repo-internal docs are available.

## Absolute Rules

1. **Core is pure.** No IO, no `Date.now()`, no side effects, no randomness. `compute()` is a pure function.
2. **Snapshot is the only medium.** All communication between computations happens through Snapshot. No hidden channels, no return values from effects.
3. **Three patch ops only.** `set`, `unset`, `merge` (shallow). No other mutation operations exist.
4. **Effects are declarations.** Core declares requirements; Host executes them. Core never performs IO.
5. **Errors are values.** Errors live in Snapshot state, never thrown. Core must not throw for business logic.
6. **Flows terminate.** No unbounded loops in Flow. Host controls iteration. All guards required for re-entry safety.
7. **`$` is reserved.** `$host`, `$mel`, `$system` are platform namespaces. Never use `$` in domain identifiers.

## Installed Knowledge Rule

Prefer the installed knowledge files and the current public package seams. Do not assume repo-internal design documents are present.

## Task-Specific Knowledge

Load these before writing code in each area:

| Task | Knowledge File |
|------|---------------|
| Building an agent domain with EMA tracking, explore/exploit, and self-revision | `@knowledge/examples/agent-reflective-loop.md` |
| Understanding base vs lineage vs governance runtime seams | `@knowledge/architecture.md` |
| Writing MEL domain code | `@knowledge/mel-patterns.md` |
| MEL complete function reference | `@knowledge/mel-reference.md` |
| Implementing effect handlers | `@knowledge/effect-patterns.md` |
| Working with state/patches | `@knowledge/patch-rules.md` |
| Reviewing or debugging | `@knowledge/antipatterns.md` |
| Choosing the right installed knowledge file | `@knowledge/spec-index.md` |
| Inspecting or debugging a domain from the terminal | `@knowledge/packages/studio-cli.md` |
| Understanding Studio projections and offline analysis | `@knowledge/packages/studio-core.md` |

## Package API Reference

Load when working with a specific package API:

| Package | Knowledge File |
|---------|---------------|
| @manifesto-ai/sdk | `@knowledge/packages/sdk.md` |
| @manifesto-ai/lineage | `@knowledge/packages/lineage.md` |
| @manifesto-ai/governance | `@knowledge/packages/governance.md` |
| @manifesto-ai/core | `@knowledge/packages/core.md` |
| @manifesto-ai/host | `@knowledge/packages/host.md` |
| @manifesto-ai/compiler | `@knowledge/packages/compiler.md` |
| @manifesto-ai/codegen | `@knowledge/packages/codegen.md` |
| @manifesto-ai/studio-cli | `@knowledge/packages/studio-cli.md` |
| @manifesto-ai/studio-core | `@knowledge/packages/studio-core.md` |

## Self-Check

Before submitting any code change, verify:

- [ ] Determinism preserved? (same input -> same output)
- [ ] Snapshot is sole communication medium?
- [ ] All mutations via patches?
- [ ] No forbidden imports across package boundaries?
- [ ] Flow guards present for re-entry safety?
