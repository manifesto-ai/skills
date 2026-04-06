# Manifesto Runtime Map

Use this file to choose the right public seam quickly.

## Mental model

- Core computes meaning.
- Host executes requirements and applies patches.
- SDK exposes the base runtime for direct dispatch.
- Lineage decorates the base runtime with continuity and sealing.
- Governance decorates a lineage runtime with legitimacy and approval.

## Runtime ladder

```typescript
createManifesto(schema, effects).activate()
  -> dispatchAsync(intent)
```

Use this when you want the shortest path: compile/activate/dispatch/read.

```text
Lineage runtime
  createManifesto(schema, effects)
    -> withLineage(...)
    -> activate()
    -> commitAsync(intent)
    -> Host
    -> Core
    -> seal into lineage
    -> visible head advances
```

Use this when execution must also become recorded continuity.

```text
Governed runtime
  createManifesto(schema, effects)
    -> withLineage(...)
    -> withGovernance(...)
    -> activate()
    -> proposeAsync(intent)
    -> authority decision
    -> approved commit
    -> seal into lineage
    -> visible governed history advances
```

Use this when actions need legitimacy, approval, or proposal records.

## Snapshot boundary

For application code, prefer the SDK projected snapshot from `getSnapshot()`. Escalate to `getCanonicalSnapshot()` only when you need substrate-level fields such as `pendingRequirements`, `currentAction`, or canonical metadata.

For projected runtime introspection, use `getSchemaGraph()` for static structure and `simulate()` for a non-committing dry-run preview. Those helpers stay on the SDK-derived runtime surface, including lineage and governance decorators.

Practical rule:

- app/UI/agent reasoning: `getSnapshot()`
- lineage restore / sealing / deep runtime tooling: `getCanonicalSnapshot()`
- projected structure or dry-run preview on a live runtime: `getSchemaGraph()`, `simulate()`

## Quick reminders

- Effects are declarations from Core and IO adapters in Host handlers.
- Snapshot is the only medium between turns and layers.
- Only three patch ops exist: `set`, `unset`, `merge`.
- For schema-graph traversal, ref lookup is canonical; string node ids are debug convenience only.
