# Patch Rules

## Rules

> **R1**: Only three patch operations exist: `set`, `unset`, `merge`.
> **R2**: Domain patch targets use structured `PatchPath` segments rooted at `snapshot.state`.
> **R3**: Domain state changes go through `apply(schema, snapshot, patches)`.
> **R4**: `apply()` returns a new snapshot, recomputes computed values, and increments `meta.version`.
> **R5**: Core Flow may carry dynamic patch targets, but emitted `ComputeResult.patches`, `apply()`, and effect-handler patches are concrete only.

## Current Core Shape

```typescript
type PatchSegment =
  | { kind: "prop"; name: string }
  | { kind: "index"; index: number };

type PatchPath = PatchSegment[];

type Patch =
  | { op: "set"; path: PatchPath; value: unknown }
  | { op: "unset"; path: PatchPath }
  | { op: "merge"; path: PatchPath; value: Record<string, unknown> };
```

Paths are not string literals in the current Core API.

## The Three Operations

### `set`

```typescript
{
  op: "set",
  path: [{ kind: "prop", name: "count" }],
  value: 5,
}
{
  op: "set",
  path: [
    { kind: "prop", name: "todos" },
    { kind: "prop", name: "abc123" },
    { kind: "prop", name: "completed" },
  ],
  value: true,
}
```

### `unset`

```typescript
{
  op: "unset",
  path: [{ kind: "prop", name: "tempFlag" }],
}
{
  op: "unset",
  path: [
    { kind: "prop", name: "todos" },
    { kind: "prop", name: "abc123" },
  ],
}
```

### `merge`

```typescript
{
  op: "merge",
  path: [
    { kind: "prop", name: "user" },
  ],
  value: { lastSeen: "2026-03-28" },
}
```

`merge` is shallow only. Nested objects are replaced, not recursively merged.

If merge target is absent, Core treats it as `{}`. If target is non-object, `apply()` records a validation error.

## MEL Patch Syntax

```mel
// set
patch count = add(count, 1)
patch user.name = trim(newName)
patch items[$runtime.random.uuid] = { id: $runtime.random.uuid, title: title }

// unset
patch tasks[id] unset

// merge (only via effect results or explicit merge op)
```

MEL is lowered into structured Flow targets by the compiler/runtime pipeline. Core resolves dynamic Flow patch targets during `compute()` before emitting concrete `Patch[]`.

## Dynamic Key Pattern

If a key is dynamic, fix it into snapshot state first and then patch through that stored value:

```mel
// Step 1: materialize the identifier
once(creating) {
  patch creating = $runtime.intent.id
  patch newItemId = $runtime.random.uuid
}

// Step 2: patch through the stored key
when isNotNull(newItemId) {
  patch items[newItemId] = { id: newItemId, title: title }
}
```

The important rule is that continuity lives in snapshot state, not in hidden runtime variables.

## Antipatterns

### Direct Mutation

```typescript
// FORBIDDEN
snapshot.state.count = 5;
snapshot.meta.version++;

// CORRECT
const newSnapshot = core.apply(
  schema,
  snapshot,
  [
    {
      op: "set",
      path: [{ kind: "prop", name: "count" }],
      value: 5,
    },
  ],
);
```

### Deep Merge Assumption

```typescript
// WRONG — merge is shallow, nested objects replaced entirely
{
  op: "merge",
  path: [{ kind: "prop", name: "user" }],
  value: { name: "X", settings: { theme: "dark" } },
}

// CORRECT — multiple set patches for nested paths
[
  {
    op: "set",
    path: [{ kind: "prop", name: "user" }, { kind: "prop", name: "name" }],
    value: "X",
  },
  {
    op: "set",
    path: [
      { kind: "prop", name: "user" },
      { kind: "prop", name: "settings" },
      { kind: "prop", name: "theme" },
    ],
    value: "dark",
  },
]
```

### Array Push/Pop/Splice

```typescript
// FORBIDDEN — mutates in place
snapshot.state.todos.push(newTodo);

// CORRECT — set entire new array
const newTodos = [...snapshot.state.todos, newTodo];
[
  {
    op: "set",
    path: [{ kind: "prop", name: "todos" }],
    value: newTodos,
  },
]
```

### String paths in current Core-facing code

```typescript
// Avoid this in current Core APIs
{ op: "set", path: "state.count", value: 1 }
```

### Unguarded Patch in MEL

```mel
// FORBIDDEN — runs every compute cycle
action broken() {
  patch count = add(count, 1)     // Increments forever!
}

// CORRECT — guarded
action increment() {
  onceIntent {
    patch count = add(count, 1)
  }
}
```

## Why

- **Three operations are enough.** Complexity is composed, not built-in.
- **Immutability matters.** Snapshots are durable time-travel points.
- **Structured paths matter.** They preserve validation and typed lowering boundaries.
- **Namespaces are separate.** Platform/tooling state belongs under `snapshot.namespaces`, not domain patch paths.

## Cross-References

- Snapshot structure: `@knowledge/architecture.md`
- Effect handlers return patches: `@knowledge/effect-patterns.md`
- MEL patch syntax: `@knowledge/mel-patterns.md`
