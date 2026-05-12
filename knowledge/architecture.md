# Manifesto Runtime Map

Use this file to choose the right public seam quickly.

## Mental model

- Core computes meaning.
- Host executes requirements and applies patches.
- SDK exposes the activation-first action-candidate app surface.
- Lineage decorates the base runtime with continuity and sealing.
- Governance decorates a lineage runtime with legitimacy and approval.

## Runtime ladder

```typescript
createManifesto(schema, effects).activate()
  -> action.<name>.submit(input)
```

Use this when you want the shortest path: compile/activate/submit/read.

```text
Lineage runtime
  createManifesto(schema, effects)
    -> withLineage(...)
    -> activate()
    -> action.<name>.submit(input)
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
    -> action.<name>.submit(input)
    -> authority decision
    -> settlement observation
    -> seal into lineage
    -> visible governed history advances
```

Use this when actions need legitimacy, approval, or proposal records.

Governed runtimes return a pending proposal result from `submit()`. Settlement is observed through `pending.waitForSettlement()` or `app.waitForSettlement(ref)`.

## Legality model

Current admission is split across three ordered layers:

- `available` is the coarse action-family gate
- input validation checks the submitted candidate input
- `dispatchable` is the fine bound-intent gate

`available()` reads are current-snapshot observations, not durable capability grants. `submit()` still re-checks admission against the then-current runtime state.

SDK, lineage, and governance runtimes all expose the same action handle surface for this split:

- `action.<name>.available()`
- `action.<name>.check(input)`
- `action.<name>.preview(input)`
- `action.<name>.bind(input)`
- `inspect.availableActions()`
- `inspect.action(name)`

Ordering is stable across all of them:

- availability is checked first
- unavailable candidates short-circuit before input validation or dispatchability
- once available, `check()` validates input before dispatchability
- `check()` reports the first failing admission layer

## Snapshot boundary

For application code, prefer the SDK projected snapshot from `snapshot()`. Escalate to `inspect.canonicalSnapshot()` only when you need substrate-level fields such as `pendingRequirements`, `currentAction`, namespaces, or canonical metadata.

For projected runtime introspection, use `inspect.graph()` for static structure, `action.<name>.preview(input)` for a non-committing dry-run preview, and `action.<name>.check(input)` when you need a current-snapshot admission explanation. Those helpers stay on the SDK-derived runtime surface, including lineage and governance decorators.

Practical rule:

- app/UI/agent reasoning: `snapshot()`
- lineage restore / sealing / deep runtime tooling: `inspect.canonicalSnapshot()`
- projected structure or dry-run preview on a live runtime: `inspect.graph()`, `action.<name>.preview(input)`, `action.<name>.check(input)`
- multi-step trajectory exploration without committing: `createSimulationSession()` from `@manifesto-ai/sdk/extensions`
- arbitrary-snapshot legality explanation after activation: `getExtensionKernel(app).explainIntentFor(snapshot, intent)`

## Dry-run vs. simulation sessions

`action.<name>.preview(input)` on the live runtime is a **single-step** dry-run. It uses the selected execution view, evaluates one candidate, and returns the projected result without committing.

`createSimulationSession(app)` from `@manifesto-ai/sdk/extensions` is a **multi-step** stateful trajectory. Each `next()` call advances the session from a canonical snapshot and records the step in an immutable `trajectory`. Use this when reasoning about sequences of actions, branching futures, or multi-turn agent planning.

Neither commits to the live runtime.

## Quick reminders

- Effects are declarations from Core and IO adapters in Host handlers.
- Snapshot is the only medium between turns and layers.
- Only three patch ops exist: `set`, `unset`, `merge`.
- For schema-graph traversal, use `inspect.graph()` and action/state/computed handles instead of string paths in app-facing code.
