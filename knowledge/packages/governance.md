# @manifesto-ai/governance

> Legitimacy decorator runtime for approval, proposal flow, and governed execution.

## Role

Governance owns the legitimacy layer on top of a lineage-composed manifesto:

- `withGovernance(withLineage(createManifesto(...), ...), config).activate()`
- `proposeAsync()` as the governed state-change verb
- authority evaluation, actor bindings, and decision records
- `approve()` / `reject()` for pending resolution
- `@manifesto-ai/governance/provider` for lower-level protocol seams

## Dependencies

- `@manifesto-ai/sdk`
- `@manifesto-ai/lineage`
- peer: `@manifesto-ai/core`

## Public API

### `withGovernance(lineageManifesto, config)`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";
import { createInMemoryLineageStore, withLineage } from "@manifesto-ai/lineage";
import { withGovernance } from "@manifesto-ai/governance";

const governed = withGovernance(
  withLineage(createManifesto<CounterDomain>(schema, effects), {
    store: createInMemoryLineageStore(),
  }),
  {
    bindings,
    execution: {
      projectionId: "counter",
      deriveActor(intent) {
        return { actorId: "agent:demo", kind: "agent" };
      },
      deriveSource(intent) {
        return { kind: "agent", eventId: intent.intentId };
      },
    },
  },
).activate();
```

`GovernanceConfig<T>` includes:

- `bindings`
- optional `governanceStore`
- optional `evaluator`
- optional `eventSink`
- optional `now`
- required `execution`

## Activated runtime

`GovernanceInstance<T>` is the lineage runtime with `commitAsync` removed and governed verbs added:

- `proposeAsync`
- `approve`
- `reject`
- `getProposal`
- `getProposals`
- `bindActor`
- `getActorBinding`
- `getDecisionRecord`

Lineage query methods such as `restore`, `getWorld`, `getWorldSnapshot`, `getLatestHead`, and `getBranches` remain available.

Inherited base-runtime surface still includes:

- `getSnapshot`
- `getCanonicalSnapshot`
- `getSchemaGraph`
- `simulate`
- `getAvailableActions`
- `isActionAvailable`
- `isIntentDispatchable`
- `getIntentBlockers`
- action metadata
- `subscribe`, `on`, `MEL`, `schema`, `dispose`

## Runtime meaning

- `proposeAsync(intent)` submits governed work for authority judgment.
- With auto-approve or satisfied policy, the proposal can complete immediately.
- With HITL or tribunal policies, the proposal may remain `evaluating` until `approve()` or `reject()` resolves it.

Governed runtimes intentionally do not expose `dispatchAsync` or `commitAsync`.

Inherited legality queries keep the same base-SDK meaning:

- availability is checked before dispatchability
- `getIntentBlockers()` reports only the first failing layer
- unavailable intents do not evaluate `dispatchable`

## Snapshot semantics

- `getSnapshot()` remains the projected runtime read
- `getCanonicalSnapshot()` remains the current visible canonical substrate
- `getWorldSnapshot(worldId)` remains the stored sealed canonical snapshot inherited from lineage
- `getSchemaGraph()` remains available for projected static graph inspection
- `simulate()` remains available for non-committing dry-run previews
- `restore(...)` remains the normalized resume path inherited from lineage

## Notes

- Governance requires a manifesto already composed with `withLineage()`.
- Governance does not create lineage on behalf of the caller.
- `@manifesto-ai/governance/provider` is for services, evaluators, stores, and protocol tests. It is not the primary application entry story.
