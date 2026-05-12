# Manifesto Normative Summary (LLM)

This is a compact summary of high-salience rules for the installed skill.

## Core boundaries

- Core computes meaning; Host executes effects; Lineage preserves continuity; Governance governs legitimacy.
- Core is pure and deterministic: same input, same output.
- Snapshot is the sole communication medium between layers.
- State changes are expressed as patches plus system transitions, not hidden mutable state.

## Patch semantics

- Only three patch ops exist: `set`, `unset`, `merge`.
- Core returns domain `patches`, optional `namespaceDelta`, and a `systemDelta`.
- Patch application creates a new snapshot and increments version exactly once.

## Error handling

- Errors are values in snapshot state.
- Core must not throw business-logic errors.
- Effect handlers should report failures through patches or terminal results, not opaque side channels.

## Platform namespaces

- Platform/runtime/compiler bookkeeping lives under `snapshot.namespaces`, not domain state.
- `$`-prefixed names are reserved and must not be authored as domain identifiers.
- Domain schemas must not define `$`-prefixed identifiers.

## MEL guard rules

- Use `when`, `once`, or `onceIntent` to make patches, effects, `fail`, and `stop` re-entry safe.
- `onceIntent` lowers to Core's generic `causalGuard` primitive in the current v5 contract.
- Do not model guard state as `$mel` domain data.

## MEL current-contract notes

- `len()` works on strings, arrays, and records/objects.
- `match()` is parser-free function form only: `match(key, [k, v], ..., default)`.
- `argmax()` / `argmin()` are fixed-candidate only; do not treat them as runtime-array reducers.
- `absDiff()`, `clamp()`, `idiv()`, and `streak()` are bounded lowering-only MEL sugar over existing arithmetic and conditional forms.

## Current implementation note

- `@manifesto-ai/sdk` owns the activation-first base runtime.
- `@manifesto-ai/lineage` and `@manifesto-ai/governance` are the active governed composition packages.
- For governed work, prefer `createManifesto() -> withLineage() -> withGovernance() -> activate()`.
- `snapshot()` is the projected app-facing read and `inspect.canonicalSnapshot()` is the explicit substrate read.
- `inspect.graph()` is projected static introspection and `action.<name>.preview(input)` is a non-committing projected dry-run.
- SDK-derived runtimes expose current-snapshot admission reads through `action.<name>.available()` and `action.<name>.check(input)`.
- `@manifesto-ai/sdk/extensions` is the arbitrary-snapshot read-only seam; use `explainIntentFor()` there when you need a legality explanation for a caller-provided canonical snapshot.
- Ref-based graph lookup is canonical; string node ids are debug convenience only.

## Guidance for LLM use

- Do not infer behavior not stated in the installed knowledge or current public package APIs.
- Prefer the installed package notes over repo archaeology for normal integrations.
- If something conflicts with the installed knowledge, prefer the current public seams: SDK, Lineage, Governance.
