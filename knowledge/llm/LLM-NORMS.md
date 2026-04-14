# Manifesto Normative Summary (LLM)

This is a compact summary of high-salience rules for the installed skill.

## Core boundaries

- Core computes meaning; Host executes effects; Lineage preserves continuity; Governance governs legitimacy.
- Core is pure and deterministic: same input, same output.
- Snapshot is the sole communication medium between layers.
- State changes are expressed as patches plus system transitions, not hidden mutable state.

## Patch semantics

- Only three patch ops exist: `set`, `unset`, `merge`.
- Core returns domain `patches` plus a `systemDelta`.
- Patch application creates a new snapshot and increments version exactly once.

## Error handling

- Errors are values in snapshot state.
- Core must not throw business-logic errors.
- Effect handlers should report failures through patches or terminal results, not opaque side channels.

## Platform namespaces

- `$host` and `$mel` are platform namespaces, not domain fields.
- Schema hashing excludes platform-owned `$` namespaces.
- Domain schemas must not define `$`-prefixed identifiers.

## MEL guard rules

- `once(marker)` requires the first statement to patch the same marker with `$meta.intentId`.
- `onceIntent` is syntactic sugar for per-intent idempotency using `$mel` guard storage.
- Guard writes for `onceIntent` use `merge` at `$mel.guards.intent`.

## MEL current-contract notes

- `len()` works on strings, arrays, and records/objects.
- `match()` is parser-free function form only: `match(key, [k, v], ..., default)`.
- `argmax()` / `argmin()` are fixed-candidate only; do not treat them as runtime-array reducers.
- `absDiff()`, `clamp()`, `idiv()`, and `streak()` are bounded lowering-only MEL sugar over existing arithmetic and conditional forms.

## Current implementation note

- `@manifesto-ai/sdk` owns the activation-first base runtime.
- `@manifesto-ai/lineage` and `@manifesto-ai/governance` are the active governed composition packages.
- For governed work, prefer `createManifesto() -> withLineage() -> withGovernance() -> activate()`.
- `getSnapshot()` is the projected app-facing read and `getCanonicalSnapshot()` is the explicit substrate read.
- `getSchemaGraph()` is projected static introspection and `simulate()` is a non-committing projected dry-run.
- SDK-derived runtimes also expose current-snapshot explanation reads: `explainIntent()`, `why()`, and `whyNot()`.
- `@manifesto-ai/sdk/extensions` is the arbitrary-snapshot read-only seam; use `explainIntentFor()` there when you need a legality explanation for a caller-provided canonical snapshot.
- Ref-based graph lookup is canonical; string node ids are debug convenience only.

## Guidance for LLM use

- Do not infer behavior not stated in the installed knowledge or current public package APIs.
- Prefer the installed package notes over repo archaeology for normal integrations.
- If something conflicts with the installed knowledge, prefer the current public seams: SDK, Lineage, Governance.
