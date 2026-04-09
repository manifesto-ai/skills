# Manifesto Runtime Map

Use this file to choose the right public seam quickly.

## Mental model

- Core computes meaning.
- Host executes requirements and applies patches.
- SDK exposes the base runtime for direct dispatch plus legality queries.
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

## Legality model

Current legality is split across two layers:

- `available` is the coarse action-family gate
- `dispatchable` is the fine bound-intent gate

SDK, lineage, and governance runtimes all expose the same read surface for this split:

- `isActionAvailable()`
- `getAvailableActions()`
- `isIntentDispatchable()`
- `getIntentBlockers()`
- `explainIntent()`
- `why()`
- `whyNot()`

Ordering is stable across all of them:

- availability is checked first
- current-snapshot explanation reads short-circuit on unavailable intents before input validation or dispatchability
- once available, explanation reads validate input before dispatchability
- `getIntentBlockers()` reports only the first failing layer
- `whyNot()` returns blockers for blocked intents and `null` for admitted intents

## Snapshot boundary

For application code, prefer the SDK projected snapshot from `getSnapshot()`. Escalate to `getCanonicalSnapshot()` only when you need substrate-level fields such as `pendingRequirements`, `currentAction`, or canonical metadata.

For projected runtime introspection, use `getSchemaGraph()` for static structure, `simulate()` for a non-committing dry-run preview, and `explainIntent()` / `whyNot()` when you need a current-snapshot admission explanation. Those helpers stay on the SDK-derived runtime surface, including lineage and governance decorators.

Practical rule:

- app/UI/agent reasoning: `getSnapshot()`
- lineage restore / sealing / deep runtime tooling: `getCanonicalSnapshot()`
- projected structure or dry-run preview on a live runtime: `getSchemaGraph()`, `simulate()`, `explainIntent()`, `whyNot()`
- multi-step trajectory exploration without committing: `createSimulationSession()` from `@manifesto-ai/sdk/extensions`
- arbitrary-snapshot legality explanation after activation: `getExtensionKernel(app).explainIntentFor(snapshot, intent)`

## Dry-run vs. simulation sessions

`simulate()` on the live runtime is a **single-step** dry-run. It uses the current runtime snapshot, applies one intent, and returns the projected result without committing.

`createSimulationSession(app)` from `@manifesto-ai/sdk/extensions` is a **multi-step** stateful trajectory. Each `next()` call advances the session from a canonical snapshot and records the step in an immutable `trajectory`. Use this when reasoning about sequences of actions, branching futures, or multi-turn agent planning.

Neither commits to the live runtime.

## Quick reminders

- Effects are declarations from Core and IO adapters in Host handlers.
- Snapshot is the only medium between turns and layers.
- Only three patch ops exist: `set`, `unset`, `merge`.
- For schema-graph traversal, ref lookup is canonical; string node ids are debug convenience only.
