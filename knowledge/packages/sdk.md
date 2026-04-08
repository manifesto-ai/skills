# @manifesto-ai/sdk

> Activation-first base runtime entry point. Canonical package for direct-dispatch Manifesto apps.

## Role

SDK owns the base public app-facing surface:

- `createManifesto()`
- the activation boundary via `activate()`
- `dispatchAsync()` on the activated base runtime
- projected and canonical snapshot reads
- projected graph inspection via `getSchemaGraph()`
- non-committing dry-run preview via `simulate()`
- availability queries, dispatchability queries, and action metadata inspection
- SDK error types
- `@manifesto-ai/sdk/extensions` for safe arbitrary-snapshot read-only helpers
- `@manifesto-ai/sdk/provider` for decorator/provider authoring seams

In the current implementation, `createManifesto()` composes Core, Host, and Compiler directly. Governed composition is no longer part of the SDK's root public story.

## Dependencies

- `@manifesto-ai/core`
- `@manifesto-ai/host`
- `@manifesto-ai/compiler`

## Public API

### `createManifesto(schemaInput, effects): ComposableManifesto<T, BaseComposableLaws>`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";

const manifesto = createManifesto(domainSchema, effects);
const runtime = manifesto.activate();
```

`schemaInput` may be either:

- a compiled `DomainSchema`
- a MEL source string, which SDK compiles internally before activation

`createManifesto()` returns a composable manifesto. Runtime verbs do not exist until `activate()`.

### Activated base runtime

```typescript
const runtime = createManifesto<CounterDomain>(domainSchema, effects).activate();

const intent = runtime.createIntent(runtime.MEL.actions.increment);
await runtime.dispatchAsync(intent);

runtime.isActionAvailable("increment");
runtime.getAvailableActions();
runtime.isIntentDispatchable(runtime.MEL.actions.increment);
runtime.getIntentBlockers(runtime.MEL.actions.increment);
runtime.getActionMetadata("increment");
runtime.getSnapshot();
runtime.getCanonicalSnapshot();
runtime.getSchemaGraph();
runtime.simulate(runtime.MEL.actions.increment);
```

Base runtime surface:

- `createIntent`
- `dispatchAsync`
- `subscribe`
- `on`
- `getSnapshot`
- `getCanonicalSnapshot`
- `getSchemaGraph`
- `simulate`
- `getAvailableActions`
- `isIntentDispatchable`
- `getIntentBlockers`
- `getActionMetadata`
- `isActionAvailable`
- `MEL`
- `schema`
- `dispose`

### `getSchemaGraph()` and tracing

`getSchemaGraph()` returns a `SchemaGraph` of the projected static structure. The graph supports directional tracing from any node:

```typescript
const graph = runtime.getSchemaGraph();

// Upstream: what feeds into this node?
const upstream = graph.traceUp(runtime.MEL.state.total);
// or by node id string (debug convenience only):
const upstream2 = graph.traceUp("field:total");

// Downstream: what does this node affect?
const downstream = graph.traceDown(runtime.MEL.state.count);
```

Both return a filtered `SchemaGraph` containing only the relevant subgraph.

Rules:
- `traceUp(ref)` — returns the subgraph of nodes that are upstream dependencies of `ref`
- `traceDown(ref)` — returns the subgraph of nodes that are downstream dependents of `ref`
- Accepts typed refs (`TypedActionRef`, `FieldRef`, `ComputedRef`) or `SchemaGraphNodeId` strings
- Ref-based lookup is canonical; string node ids are debug convenience only

### Dispatchability and `getIntentBlockers()`

```typescript
// Check if a bound intent is dispatchable (availability + dispatchability)
runtime.isIntentDispatchable(runtime.MEL.actions.shoot, "cell-42");

// Get blockers with layer detail
const blockers = runtime.getIntentBlockers(runtime.MEL.actions.shoot, "cell-42");
// blockers: readonly DispatchBlocker[]
```

`DispatchBlocker` shape:

```typescript
type DispatchBlocker = {
  readonly layer: "available" | "dispatchable";
  readonly expression: ExprNode;
  readonly evaluatedResult: unknown;
  readonly description?: string;
};
```

Rules:
- `getIntentBlockers()` reports only the **first failing layer** — if `available` fails, `dispatchable` is not evaluated
- An empty blockers array means the intent is fully dispatchable
- `isIntentDispatchable()` returns `true` only when both layers pass

### `getActionMetadata()` and `TypedActionMetadata`

```typescript
// All actions
const all = runtime.getActionMetadata();

// Single action
const meta = runtime.getActionMetadata("shoot");
// meta.hasDispatchableGate === true if action has a `dispatchable when` clause
```

`TypedActionMetadata` shape:

```typescript
type TypedActionMetadata = {
  readonly name: string;
  readonly params: readonly string[];
  readonly input: DomainSchema["actions"][string]["input"];
  readonly description: string | undefined;
  readonly hasDispatchableGate: boolean;
};
```

`hasDispatchableGate: true` means the action has a `dispatchable when` clause and `isIntentDispatchable()` may return `false` for specific bound inputs.

### `createIntent()` binding forms

```typescript
runtime.createIntent(runtime.MEL.actions.increment);
runtime.createIntent(runtime.MEL.actions.add, 3);
runtime.createIntent(runtime.MEL.actions.addTodo, "Review docs", "todo-1");
runtime.createIntent(runtime.MEL.actions.addTodo, {
  title: "Review docs",
  id: "todo-1",
});
```

Rules:

- zero-parameter actions use `createIntent(action)`
- single-parameter actions accept either the parameter value directly or a single object argument keyed by the declared parameter name
- multi-parameter actions support positional binding
- multi-parameter actions also support a single object argument when field-name binding is clearer
- hand-authored multi-field object inputs without positional metadata should be treated as object-only bindings

### Effect handler contract

```typescript
type EffectContext<T = unknown> = {
  readonly snapshot: Readonly<Snapshot<T>>;
};

type EffectHandler = (
  params: unknown,
  ctx: EffectContext,
) => Promise<readonly Patch[]>;
```

SDK adapts this 2-argument handler to Host's internal effect-handler contract.

### Event channels

```typescript
type ManifestoEvent = "dispatch:completed" | "dispatch:rejected" | "dispatch:failed";
```

`dispatch:rejected` payload includes a `code` field:

```typescript
type RejectionCode = "ACTION_UNAVAILABLE" | "INTENT_NOT_DISPATCHABLE" | "INVALID_INPUT";
```

Use this to distinguish why a dispatch was rejected without re-querying legality. Payloads are otherwise event-specific through `ManifestoEventMap<T>`.

## Errors

- `ManifestoError`
- `ReservedEffectError`
- `DisposedError`
- `CompileError`

## Notes

- `getSnapshot()` is the projected application-facing read model.
- `getCanonicalSnapshot()` is the explicit full substrate read.
- `getSchemaGraph()` exposes projected static graph structure only.
- `simulate()` is a dry-run that uses the full transition contract but does not commit runtime state.
- `isActionAvailable()` is the coarse legality query. `isIntentDispatchable()` and `getIntentBlockers()` are the fine legality/introspection queries.
- Current rejection split is:
  - `ACTION_UNAVAILABLE` for coarse gate failure
  - `INTENT_NOT_DISPATCHABLE` for available-but-blocked bound intents
- `FieldRef` and `ComputedRef` use `name` as the current public identity field.
- Ref-based graph lookup is canonical; string node ids are debug convenience only.
- `createManifesto()` no longer accepts a `ManifestoConfig` object shape.
- Restore input, guard callbacks, and top-level helper surfaces like `dispatchAsync(instance, intent)` are not part of the current SDK contract.

## Governed composition direction

The public governed direction is:

```text
createManifesto() -> withLineage() -> withGovernance() -> activate()
```

Those runtime contracts live in the owning `@manifesto-ai/lineage` and `@manifesto-ai/governance` packages.

## Extension seam

Use `@manifesto-ai/sdk/extensions` when a tool or helper needs arbitrary-snapshot read-only analysis after activation, or multi-step trajectory simulation without committing runtime state.

### `getExtensionKernel(app)`

```typescript
import { getExtensionKernel } from "@manifesto-ai/sdk/extensions";

const ext = getExtensionKernel(runtime);
```

`ExtensionKernel<T>` surface — all methods are synchronous and read-only:

```typescript
interface ExtensionKernel<T> {
  readonly MEL: TypedMEL<T>;
  readonly schema: DomainSchema;
  readonly createIntent: TypedCreateIntent<T>;
  readonly getCanonicalSnapshot: () => CanonicalSnapshot<T["state"]>;
  readonly projectSnapshot: (snapshot: CanonicalSnapshot<T["state"]>) => Snapshot<T["state"]>;
  readonly simulateSync: (snapshot: CanonicalSnapshot<T["state"]>, intent: TypedIntent<T>) => ExtensionSimulateResult<T>;
  readonly getAvailableActionsFor: (snapshot: CanonicalSnapshot<T["state"]>) => readonly (keyof T["actions"])[];
  readonly isActionAvailableFor: (snapshot: CanonicalSnapshot<T["state"]>, actionName: keyof T["actions"]) => boolean;
  readonly isIntentDispatchableFor: (snapshot: CanonicalSnapshot<T["state"]>, intent: TypedIntent<T>) => boolean;
}
```

`ExtensionSimulateResult` differs from SDK `SimulateResult`: it returns the post-step `CanonicalSnapshot` directly and has no `systemDelta` or `changedPaths`.

### `createSimulationSession(app)`

Use this for multi-step trajectory exploration without committing to the live runtime.

```typescript
import { createSimulationSession } from "@manifesto-ai/sdk/extensions";

let session = createSimulationSession(runtime);

// Step forward by action ref with args
session = session.next(runtime.MEL.actions.shoot, "cell-42");
session = session.next(runtime.MEL.actions.reveal, "cell-42");

// Or step forward with a pre-built intent
const intent = runtime.createIntent(runtime.MEL.actions.shoot, "cell-10");
session = session.next(intent);

// Inspect current state
session.snapshot;          // Snapshot<T>  — projected current state
session.canonicalSnapshot; // CanonicalSnapshot<T>  — raw substrate
session.depth;             // number of steps taken
session.trajectory;        // readonly SimulationSessionStep[] — full history
session.availableActions;  // actions available at current state
session.requirements;      // pending requirements
session.status;            // ComputeStatus | "idle" | "computing"
session.isTerminal;        // true when status is "pending" | "halted" | "error"

// Finalize and get the full result
const result = session.finish(); // SimulationSessionResult<T>
```

`SimulationSessionStep` per trajectory entry:

```typescript
type SimulationSessionStep<T> = {
  readonly intent: TypedIntent<T>;
  readonly snapshot: Snapshot<T["state"]>;
  readonly canonicalSnapshot: CanonicalSnapshot<T["state"]>;
  readonly availableActions: readonly SimulationActionRef<T>[];
  readonly requirements: readonly Requirement[];
  readonly status: ComputeStatus;
  readonly isTerminal: boolean;
};
```

Rules:
- `next()` on a terminal session throws `ManifestoError("SIMULATION_SESSION_TERMINAL")`
- Terminal states: `"pending"` (waiting for effects), `"halted"` (stop/fail triggered), `"error"`
- `session` is immutable — each `next()` returns a new `SimulationSession`
- Does **not** commit to or mutate the live runtime
- Use `simulate()` on the runtime for single-step dry-run; use `createSimulationSession()` for multi-step trajectory
