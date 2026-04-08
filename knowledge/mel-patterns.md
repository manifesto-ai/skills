# MEL Patterns

## Rules

> **R1**: MEL is pure and total. Expressions terminate, are deterministic, and do not perform IO.
> **R2**: Use one pattern per concept. Prefer function calls and guards over clever composition.
> **R3**: Every mutation (`patch`, `effect`, `fail`, `stop`) MUST live inside a guard: `when`, `once`, or `onceIntent`.
> **R4**: Input-aware legality belongs in `dispatchable when`, not `available when`.
> **R5**: `$` is reserved for platform namespaces. Never use `$` in domain identifiers.

## Domain Structure

```mel
domain MyApp {
  state {
    count: number = 0
    selectedId: string | null = null
    items: Record<string, Item> = {}
    addingItem: string | null = null
  }

  computed hasItems = gt(len(keys(items)), 0)

  action increment() { ... }
  action addItem(title: string) { ... }
}
```

Current schema-position guidance:

- `Record<string, T>` is supported
- `T | null` is supported
- `nullable` means present-or-null, not “optional by another name”

## Guard Patterns

Every compute cycle re-evaluates the flow. Guards make patches and effects re-entry safe.

### `onceIntent` — per-intent idempotency

```mel
action submit() {
  onceIntent {
    patch status = "submitting"
    effect api.submit({ data: formData, into: result })
  }
}
```

Use this when you want idempotency without storing a visible marker in domain state.

### `once(marker)` — explicit marker guard

```mel
action addTask(title: string) {
  once(addingTask) when neq(trim(title), "") {
    patch addingTask = $meta.intentId
    patch items[$system.uuid] = {
      id: $system.uuid,
      title: trim(title),
      completed: false
    }
  }
}
```

Rule: the first statement inside `once(marker)` must patch that same marker with `$meta.intentId`.

### `when` — conditional guard

```mel
action setFilter(newFilter: string) {
  when neq(filter, newFilter) {
    patch filter = newFilter
  }
}
```

Conditions must be boolean expressions. Do not rely on truthy/falsy coercion.

## Action Legality Patterns

Use the two legality layers deliberately.

### `available when` — coarse action gate

```mel
action decrement()
  available when gt(count, 0)
{
  onceIntent {
    patch count = sub(count, 1)
  }
}
```

Use `available when` for coarse state-based readiness that does not depend on the bound input.

Rules:

- may read state and computed values
- cannot read bare action parameters
- cannot read direct `$input.*`
- cannot use `$meta.*`, `$system.*`, or effects

### `dispatchable when` — fine bound-intent gate

```mel
action shoot(cellId: string)
  available when canShoot
  dispatchable when eq(at(cells, cellId).status, "unknown")
{
  onceIntent {
    patch cells[cellId].status = "pending"
  }
}
```

Use `dispatchable when` for input-dependent legality that should reject a bound intent before execution.

Rules:

- may read state, computed values, and bare action parameter names
- direct `$input.*` syntax remains forbidden
- `$meta.*`, `$system.*`, and effects remain forbidden
- if both clauses exist, order is fixed: `available when` first, then `dispatchable when`
- coarse availability short-circuits dispatchability

## Expression Syntax

```mel
// Arithmetic
add(a, b)  sub(a, b)  mul(a, b)  div(a, b)  mod(a, b)  neg(a)

// Math
abs(n)  min(a, b)  max(a, b)  floor(n)  ceil(n)  round(n)  sqrt(n)  pow(base, exp)

// Comparison
eq(a, b)  neq(a, b)  gt(a, b)  gte(a, b)  lt(a, b)  lte(a, b)

// Logical
and(a, b)  or(a, b)  not(a)  cond(condition, thenValue, elseValue)

// Null handling
isNull(x)  isNotNull(x)  coalesce(a, b, c)

// String
concat("Hello ", name)  trim(s)  lower(s)  upper(s)  substr(s, 0, 10)  strlen(s)

// Collection
len(arr)  first(arr)  last(arr)  at(arr, index)
filter(arr, pred)  map(arr, expr)  find(arr, pred)  every(arr, pred)  some(arr, pred)

// Entity primitives — Array<T> where T has an .id field
findById(coll, id)          // T | null
existsById(coll, id)        // boolean
updateById(coll, id, patch) // Array<T>  — patch RHS only
removeById(coll, id)        // Array<T>  — patch RHS only

// Aggregation
sum(arr)  min(arr)  max(arr)
```

Current expression guidance:

- `filter`, `map`, `find`, `every`, and `some` are expression-level builtins
- `$item` is valid only inside the predicate/mapper expression they introduce
- `sum()`, `min()`, and `max()` require a direct reference — no inline transformation inside
- Entity primitives require `Array<T>` where `T` has a primitive `.id` field (`string` or `number`)

```mel
computed activeItems = filter(items, eq($item.active, true))
computed total = sum(prices)

// NOT ALLOWED
computed bad = sum(filter(prices, gt($item, 0)))
```

## Entity Primitives

Use these when state holds an `Array<T>` of identifiable items (each with a `.id` field).

```mel
domain TodoList {
  type Task = { id: string, title: string, done: boolean }

  state {
    tasks: Array<Task> = []
    selectedId: string | null = null
  }

  computed selectedTask = findById(tasks, selectedId)          // T | null
  computed hasSelected  = existsById(tasks, selectedId)        // boolean

  action complete(taskId: string)
    dispatchable when existsById(tasks, taskId) {
    onceIntent {
      patch tasks = updateById(tasks, taskId, { done: true })  // patch RHS only
    }
  }

  action remove(taskId: string)
    dispatchable when existsById(tasks, taskId) {
    onceIntent {
      patch tasks = removeById(tasks, taskId)                  // patch RHS only
    }
  }
}
```

Rules:
- `findById` / `existsById` — allowed in computed, guards, `available when`, `dispatchable when`
- `updateById` / `removeById` — **patch RHS only**; forbidden in computed, guards, and conditions
- No nesting: `updateById(removeById(...), ...)` is a compile error
- The `.id` field must be `string` or `number` — nested object ids are rejected
- Compiler lowers these to `find/filter/map/merge` before reaching Core

## Effect Syntax

```mel
effect api.fetchUser({ id: userId, into: userData })

effect array.filter({
  source: tasks,
  where: eq($item.completed, false),
  into: activeTasks
})

effect array.map({
  source: users,
  select: { name: $item.name, active: $item.isActive },
  into: userSummaries
})
```

Effect families such as `array.*`, `record.*`, and IO adapters remain statements, not expressions.

## Forbidden Constructs

### Syntactically forbidden

```mel
let x = 5
const y = 10
function foo() {}
for (...) {}
while (...) {}
str.trim()
throw new Error()
async/await
class Foo {}
```

### Semantically forbidden

```mel
computed filtered = effect array.filter({ source: items, into: result })
computed bad = sum(filter(prices, gt($item, 0)))
action process(x: number) dispatchable when gt($input.x, 0) { ... }
Date.now()
Math.random()
```

Use the expression-level collection builtins in computed logic, and use bare parameter names rather than direct `$input.*` inside `dispatchable when`.

## LLM Generation Checklist

1. Use `functionName(arg1, arg2)` syntax for expressions.
2. Put every `patch`, `effect`, `fail`, and `stop` inside `when`, `once`, or `onceIntent`.
3. Use `onceIntent` when you need per-intent idempotency without a visible marker field.
4. In `once(marker)`, patch the same marker with `$meta.intentId` first.
5. Use `available when` for coarse state-based readiness only.
6. Use `dispatchable when` for input-dependent legality.
7. In `dispatchable when`, use bare action parameter names, not direct `$input.*`.
8. Treat `filter`, `map`, `find`, `every`, and `some` as expression builtins.
9. Treat `effect array.*` and `effect record.*` as statements, never as expressions.
10. Do not nest aggregation around inline transformed expressions.
11. Use `concat()` for strings and `cond()` for inline branching.
12. Do not use `$` in domain identifiers.
13. Keep hidden continuation state out of runtime variables; materialize continuity in snapshot state.
14. Prefer `Record<string, T>` for keyed collections when that models the domain better than array indexing.
15. Use `string | null` and other nullable forms directly rather than empty-string sentinel conventions.
16. For `Array<T>` entity collections: use `findById`/`existsById` freely in expressions; use `updateById`/`removeById` only on patch RHS.
17. Entity primitive `.id` must be a primitive type (`string` or `number`) — nested object ids are a compile error.

## Cross-References

- Runtime seam choice: @knowledge/architecture.md
- Compiler/package overview: @knowledge/packages/compiler.md
- Effect handler implementation: @knowledge/effect-patterns.md
- Common mistakes: @knowledge/antipatterns.md
