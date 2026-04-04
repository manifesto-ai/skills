# MEL Quick Reference

This is the installed quick reference for MEL. Use it for normal generation work.

## Quick Summary

### What it covers
- All 50+ builtin functions with signatures and examples
- State & type declarations
- Computed expressions
- Actions & guards (when, once, onceIntent, available when, fail, stop)
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
| Object | `merge`, `keys`, `values`, `entries`, `field` |
| Aggregation | `sum(arr)`, `min(arr)`, `max(arr)` — computed only, no composition |

### Key rules
1. Every function is a call: `add(a, b)` not `a + b`
2. No loops, no variables, no user-defined functions
3. All patches/effects must be inside `when`/`once`/`onceIntent`
4. `$system.*` only in actions, not in computed
5. `merge()` expression ≠ `patch merge` operation
