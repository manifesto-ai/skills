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
- availability queries and action metadata inspection
- SDK error types
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
- `getActionMetadata`
- `isActionAvailable`
- `MEL`
- `schema`
- `dispose`

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
- single-parameter actions use the parameter value directly
- multi-parameter actions support positional binding
- multi-parameter actions also support a single object argument when field-name binding is clearer

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

Payloads are event-specific through `ManifestoEventMap<T>`.

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
