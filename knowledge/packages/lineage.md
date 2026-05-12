# @manifesto-ai/lineage

> Seal-aware continuity decorator for Manifesto v5 apps.

## Role

Lineage owns continuity around the SDK action-candidate runtime:

- `withLineage(createManifesto(...), config).activate()`
- lineage-mode `action.<name>.submit(input)` semantics
- head/branch continuity and lineage queries
- `restore(...)` on the active runtime
- sealed canonical snapshot lookup
- `@manifesto-ai/lineage/provider` for lower-level persistence seams

## Dependencies

- `@manifesto-ai/sdk`
- peer: `@manifesto-ai/core`

## Public API

### `withLineage(manifesto, config)`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";
import { createInMemoryLineageStore, withLineage } from "@manifesto-ai/lineage";

const app = withLineage(
  createManifesto<CounterDomain>(schema, effects),
  { store: createInMemoryLineageStore() },
).activate();

const result = await app.action.increment.submit();
```

`LineageConfig` is one of:

```typescript
type LineageConfig =
  | { readonly service: LineageService; readonly branchId?: BranchId }
  | { readonly store: LineageStore; readonly branchId?: BranchId };
```

Lineage decorates a composable manifesto, not an already activated app.

## Activated Runtime

Lineage-mode apps expose the common SDK v5 root grammar:

- `snapshot`
- `context`
- `injectContext`
- `updateContext`
- `with`
- `action`
- `state`
- `computed`
- `observe`
- `inspect`
- `dispose`

Lineage also exposes continuity APIs:

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

## Runtime Meaning

On a lineage runtime, `action.<name>.submit(input)` means:

1. preserve SDK admission ordering
2. execute the submitted candidate
3. prepare and commit the lineage seal
4. publish only the snapshot that legitimately becomes the new visible head

If seal commit fails, the Promise rejects and the new snapshot does not become visible.

## Reports And Failures

```typescript
const result = await app.with({ report: "full" }).action.increment.submit();
```

- successful lineage submissions include continuity refs and optional write-report data
- rejected submissions include the first failing admission layer
- failed lineage outcomes are derived from the terminal Snapshot's semantic state
- canonical `namespaces.host.lastError` is Host-owned diagnostic state and is not by itself the lineage terminal outcome

## Snapshot Semantics

- `snapshot()` is the projected runtime read.
- `inspect.canonicalSnapshot()` is the current visible canonical substrate.
- `getWorldSnapshot(worldId)` is the stored sealed canonical snapshot for a specific world.
- `restore(...)` is the normalized runtime resume path.

Lower-level sealed-store inspection exists, but it is not the primary integration path for consumer agents.

## Notes

- Lineage owns continuity, not semantic computation or authority policy.
- The canonical write ingress is `action.<name>.submit(input)`.
- `@manifesto-ai/lineage/provider` is for `LineageService`, `LineageStore`, and lower-level tooling. It is not the primary app-facing entry.
