# MEL Quick Reference

This is the installed quick reference for MEL. Use it for normal generation work.

## Quick Summary

### What it covers
- All 50+ builtin functions with signatures and examples
- State & type declarations
- Computed expressions
- Actions & guards (`when`, `once`, `onceIntent`, `available when`, `dispatchable when`, `fail`, `stop`)
- Patch operations (set, unset, merge)
- Effects (array.*, record.*, I/O)
- System values ($system.uuid, $system.timestamp, $input.*, $item)
- Common patterns (CRUD, form validation, fetch-process-display)

### Function categories
| Category | Functions |
|----------|----------|
| Arithmetic | `add`, `sub`, `mul`, `div`, `mod`, `neg`, `abs`, `floor`, `ceil`, `round`, `sqrt`, `pow`, `min`, `max` |
| Comparison | `eq`, `neq`, `gt`, `gte`, `lt`, `lte` |
| Logic | `and`, `or`, `not`, `cond` (alias: `if`) |
| String | `concat`, `trim`, `lower`, `upper`, `strlen`, `startsWith`, `endsWith`, `strIncludes`, `indexOf`, `replace`, `split`, `substring` |
| Null/Type | `isNull`, `isNotNull`, `coalesce`, `toString`, `toNumber`, `toBoolean` |
| Array | `len`, `first`, `last`, `at`, `slice`, `append`, `includes`, `filter`, `map`, `find`, `every`, `some`, `reverse`, `unique`, `flat` |
| Entity (Array<T> with .id) | `findById`, `existsById`, `updateById`, `removeById` |
| Object | `merge`, `keys`, `values`, `entries`, `field` |
| Aggregation | `sum(arr)`, `min(arr)`, `max(arr)` — computed only, no composition |

### Entity primitives (`Array<T>` with `.id` field)

| Function | Signature | Returns |
|----------|-----------|---------|
| `findById(coll, id)` | `(Array<T>, T.id \| null) → T \| null` | Item where `.id == id`, or `null` |
| `existsById(coll, id)` | `(Array<T>, T.id \| null) → boolean` | `true` if item exists |
| `updateById(coll, id, updates)` | `(Array<T>, T.id \| null, Partial<T>) → Array<T>` | Shallow-merges `updates` into matching item |
| `removeById(coll, id)` | `(Array<T>, T.id \| null) → Array<T>` | Removes matching item |

```mel
// Query — allowed in computed, guard condition, dispatchable when, available when (state/computed args only)
computed selectedTask = findById(tasks, selectedTaskId)
computed taskExists = existsById(tasks, selectedTaskId)

// Transform — patch RHS only, no nesting
patch tasks = updateById(tasks, taskId, { completed: true })
patch tasks = removeById(tasks, taskId)
```

Rules:
- `findById` / `existsById`: allowed everywhere (computed, guards, `available when`, `dispatchable when`)
- `updateById` / `removeById`: **patch RHS only** — forbidden in computed, guards, and conditions
- No nesting: `updateById(removeById(...), ...)` is a compile error
- `.id` values must be unique within the collection

### Key rules
1. Every function is a call: `add(a, b)` not `a + b`
2. No loops, no variables, no user-defined functions
3. All patches/effects must be inside `when`/`once`/`onceIntent`
4. `available when` is the coarse action gate. It cannot read `$input.*` or bare action parameter names.
5. `dispatchable when` is the fine bound-intent gate. It may read bare action parameters, but not direct `$input.*`, `$meta.*`, `$system.*`, or effects.
6. `filter`, `map`, `find`, `every`, and `some` are current expression-level builtins. `effect array.*` remains the effect statement family.
7. `Record<string, T>` and `T | null` are valid current schema-position types.
8. `sum()`, `min()`, and `max()` remain aggregation-only; do not compose them around inline transformed expressions.
9. `merge()` expression ≠ `patch merge` operation
