# @manifesto-ai/sdk

> Activation-first application runtime entry point. Canonical package for the v5 action-candidate surface.

## Role

SDK owns the base public app-facing surface:

- `createManifesto()`
- the activation boundary via `activate()`
- projected reads through `snapshot()`, `state`, and `computed`
- action candidates through `action.<name>`
- action admission, dry-run, and law-aware submission
- observation through `observe.state()` and `observe.event()`
- tooling reads through `inspect`
- SDK error types
- `@manifesto-ai/sdk/extensions` for safe arbitrary-canonical-snapshot read-only helpers
- `@manifesto-ai/sdk/provider` for decorator/provider authoring seams

The SDK does not own lineage continuity or governance legitimacy. Compose those with `@manifesto-ai/lineage` and `@manifesto-ai/governance`.

## Dependencies

- `@manifesto-ai/core`
- `@manifesto-ai/host`
- `@manifesto-ai/compiler`

## Public API

### `createManifesto(schemaInput, effects, options?)`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";

const app = createManifesto<CounterDomain>(domainSchema, effects, {
  context: { locale: "ko-KR" },
}).activate();
```

`schemaInput` may be either:

- a compiled `DomainSchema`
- a MEL source string, which SDK compiles internally before activation

`createManifesto()` returns a composable manifesto. Runtime verbs and reads do not exist until `activate()`.

### Activated app

```typescript
const app = createManifesto<CounterDomain>(domainSchema, effects).activate();

app.snapshot();
app.context();
app.injectContext({ locale: "en-US" });
const requestApp = app.with({ context: { locale: "ko-KR" }, report: "full" });

app.action.increment.info();
app.action.increment.available();
app.action.increment.check();
app.action.increment.preview();
await app.action.increment.submit();

await requestApp.action.add.submit(3);

app.state.count.value();
app.computed.double.observe((next, prev) => {
  console.log(prev, next);
});
app.observe.state((snapshot) => snapshot.state.count, (next, prev) => {
  console.log(prev, next);
});
app.inspect.graph();
app.inspect.availableActions();
app.inspect.canonicalSnapshot();
```

Canonical root surface:

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

Action handle surface:

- `info`
- `available`
- `check`
- `preview`
- `submit`
- `bind`

### Admission

`check(input)` reports the first failing admission layer:

1. coarse action-family availability
2. input validation
3. fine bound-candidate dispatchability

`available()` is a current-snapshot read, not a durable capability grant. `submit()` re-checks admission against the then-current runtime state.

### Preview And Submit

```typescript
const preview = app.action.add.preview(3);
const result = await app.with({ report: "full" }).action.add.submit(3);
```

Rules:

- `preview(input)` is non-committing and uses the selected runtime view.
- `submit(input)` is the only canonical app-facing write ingress.
- `preview()` and `submit()` do not accept inline option bags. Select `context`, `report`, or diagnostics through `createManifesto(..., { context })`, `injectContext()`, `updateContext()`, or `with(view)` before calling the action.
- Base, Lineage, and Governance modes share the same call grammar but own different result types and write laws.

### Bound Actions

```typescript
const bound = app.action.add.bind(3);

bound.check();
bound.preview();
await bound.submit();
const protocolIntent = bound.intent();
```

`BoundAction.intent()` is an advanced protocol escape hatch. It may return `null` when the candidate input is invalid. Normal app code should prefer `submit()`.

For scalar action parameters, keep scalar call sites scalar:

```typescript
await app.action.toggleTodo.submit("todo-1");
```

If the public input should be `{ id }`, define an object-shaped MEL input type and submit that object.

### Snapshot Boundary

- `snapshot()` returns the projected app-facing read model.
- `inspect.canonicalSnapshot()` returns the full canonical substrate for restore, seal-aware tooling, and deep debugging.
- Projected snapshots expose domain `state`, `computed`, semantic `system.lastError`, and selected metadata.
- Canonical snapshots include `namespaces`, `input`, `system.pendingRequirements`, `system.currentAction`, and full metadata.

### Inspect Surface

- `inspect.graph()` returns projected static graph structure.
- `inspect.action(name)` returns static action metadata and annotations.
- `inspect.availableActions()` returns currently available action metadata.
- `inspect.schemaHash()` reads the current schema hash.
- `inspect.canonicalSnapshot()` reads the current canonical substrate.

## Effect Handler Contract

```typescript
type EffectContext<TDomain = ManifestoDomainShape> = {
  readonly snapshot: Readonly<ProjectedSnapshot<TDomain>>;
};

type EffectHandler = (
  params: unknown,
  ctx: EffectContext,
) => Promise<readonly Patch[]>;
```

Effect handlers return concrete patches. They do not return semantic values to Core.

## Submission Results And Errors

- Base submissions settle through the base SDK result envelope.
- Lineage submissions add continuity and write-report details from `@manifesto-ai/lineage`.
- Governance submissions initially return a durable proposal ref and expose settlement through `pending.waitForSettlement()` or `app.waitForSettlement(ref)`.
- Use `snapshot().system.lastError` for semantic failure state.
- Use canonical `namespaces.host.lastError` only for Host-owned deep-debug diagnostics.
- `ManifestoError`, `ReservedEffectError`, `DisposedError`, `CompileError`, and `SubmissionFailedError` are SDK-owned operational errors.

## Governed Composition Direction

```text
createManifesto() -> withLineage() -> withGovernance() -> activate()
```

Those runtime contracts live in the owning `@manifesto-ai/lineage` and `@manifesto-ai/governance` packages.

## Extension Seam

Use `@manifesto-ai/sdk/extensions` when a tool or helper needs read-only analysis over a caller-provided canonical snapshot, or multi-step trajectory simulation without committing runtime state.

```typescript
import { createSimulationSession, getExtensionKernel } from "@manifesto-ai/sdk/extensions";

const ext = getExtensionKernel(app);
const canonical = app.inspect.canonicalSnapshot();
const projected = ext.projectSnapshot(canonical);

let session = createSimulationSession(app);
session = session.next(app.action.increment.bind().intent()!);
```

Rules:

- Extension helpers are post-activation.
- They do not enter the active runtime law boundary.
- `createSimulationSession(app)` is immutable; each `next()` returns a new session.
- Use action handles and bound candidates on the app surface first; drop to extension helpers only for tooling-style analysis.
