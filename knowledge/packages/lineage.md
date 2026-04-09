# @manifesto-ai/lineage

> Seal-aware continuity decorator runtime for Manifesto.

## Role

Lineage owns the continuity layer around the base SDK runtime:

- `withLineage(createManifesto(...), config).activate()`
- `commitAsync()` as execute-and-seal
- head/branch continuity and lineage queries
- `restore(...)` on the active runtime
- `@manifesto-ai/lineage/provider` for lower-level persistence seams

## Dependencies

- `@manifesto-ai/sdk`
- peer: `@manifesto-ai/core`

## Public API

### `withLineage(manifesto, config)`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";
import { createInMemoryLineageStore, withLineage } from "@manifesto-ai/lineage";

const runtime = withLineage(
  createManifesto<CounterDomain>(schema, effects),
  { store: createInMemoryLineageStore() },
).activate();
```

`LineageConfig` is one of:

```typescript
type LineageConfig =
  | { readonly service: LineageService; readonly branchId?: BranchId }
  | { readonly store: LineageStore; readonly branchId?: BranchId };
```

### Activated runtime

`LineageInstance<T>` is the base SDK runtime with `dispatchAsync` removed and `commitAsync` added:

- `commitAsync`
- `restore`
- `getWorld`
- `getWorldSnapshot`
- `getLineage`
- `getLatestHead`
- `getHeads`
- `getBranches`
- `getActiveBranch`
- `switchActiveBranch`
- `createBranch`

Inherited SDK surface still includes:

- `getSnapshot`
- `getCanonicalSnapshot`
- `getSchemaGraph`
- `simulate`
- `getAvailableActions`
- `isActionAvailable`
- `isIntentDispatchable`
- `getIntentBlockers`
- `explainIntent`
- `why`
- `whyNot`
- action metadata
- `subscribe`, `on`, `MEL`, `schema`, `dispose`

## Runtime meaning

`commitAsync(intent)` means:

1. execute the intent
2. prepare and commit the lineage seal
3. publish only the snapshot that legitimately becomes the new visible head

If seal commit fails, the Promise rejects and the new snapshot does not become visible.

Inherited legality queries keep the same base-SDK meaning:

- availability is checked before dispatchability
- `getIntentBlockers()` reports only the first failing layer
- unavailable intents do not evaluate `dispatchable`
- `explainIntent()` is the canonical current-snapshot explanation read
- `why()` is an alias of `explainIntent()`
- `whyNot()` returns blockers for blocked intents and `null` for admitted intents

## Snapshot semantics

- `getSnapshot()` is the projected runtime read
- `getCanonicalSnapshot()` is the current visible canonical substrate
- `getWorldSnapshot(worldId)` is the stored sealed canonical snapshot for a specific world
- `getSchemaGraph()` remains available for projected static graph inspection
- `simulate()` remains available for non-committing dry-run previews
- `restore(...)` is the normalized runtime resume path

Lower-level sealed-store inspection exists, but it is not the primary integration path for consumer agents.

## Notes

- Lineage decorates a composable manifesto, not an already activated runtime.
- After lineage activation, `dispatchAsync` is intentionally gone.
- `@manifesto-ai/lineage/provider` is for `LineageService`, `LineageStore`, and lower-level tooling. It is not the primary app-facing entry.
