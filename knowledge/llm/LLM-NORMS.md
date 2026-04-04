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

## Current implementation note

- `@manifesto-ai/sdk` owns the activation-first base runtime.
- `@manifesto-ai/lineage` and `@manifesto-ai/governance` are the active governed composition packages.
- For governed work, prefer `createManifesto() -> withLineage() -> withGovernance() -> activate()`.

## Guidance for LLM use

- Do not infer behavior not stated in the installed knowledge or current public package APIs.
- Prefer the installed package notes over repo archaeology for normal integrations.
- If something conflicts with the installed knowledge, prefer the current public seams: SDK, Lineage, Governance.
