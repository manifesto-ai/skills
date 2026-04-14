# @manifesto-ai/compiler

> MEL (Manifesto Expression Language) compiler. Lexer -> Parser -> Analyzer -> Generator -> Lowering.

## Role

Compiles MEL source to `DomainSchema`. Also exposes evaluation, lowering, rendering, and bundler integration helpers.

## Dependencies

- Peer: `@manifesto-ai/core`, `zod`
- Optional peers and integrations: `vite`, `webpack`, `openai`, `@anthropic-ai/sdk`, `@manifesto-ai/codegen`

## Public API

### Compile API

```typescript
compileMelDomain(melText: string, options?): CompileMelDomainResult
compileMelPatch(melText: string, options): CompileMelPatchResult
compile(source: string, options?): CompileResult
parseSource(source: string): ParseResult
check(source: string): Diagnostic[]
extractSchemaGraph(schema: DomainSchema): SchemaGraph
```

### Pipeline

```text
MEL text -> Lexer -> Parser -> Analyzer -> Generator -> Lowering
```

### Bundler integrations

- `@manifesto-ai/compiler/vite`
- `@manifesto-ai/compiler/webpack`
- `@manifesto-ai/compiler/rollup`
- `@manifesto-ai/compiler/esbuild`
- `@manifesto-ai/compiler/rspack`
- `@manifesto-ai/compiler/node-loader`
- `@manifesto-ai/compiler/loader` (Node loader compatibility path)

## Notes

- Prefer MEL source plus the compiler API surface shown here.
- For normal integrations, you usually only need compile output or bundler wiring, not compiler internals.
- `extractSchemaGraph(schema)` is the current compiler surface for projected static runtime introspection.
- The current full compiler contract is `SPEC-v1.0.0`.
- `available when` is the coarse action gate; `dispatchable when` is the fine bound-intent gate.
- Expression-level collection builtins currently include `filter`, `map`, `find`, `every`, and `some`.
- The current compiler contract also admits bounded lowering-only MEL sugar for `absDiff`, `clamp`, `idiv`, `streak`, `match`, `argmax`, and `argmin`.
- Current schema-position support includes `Record<string, T>` and `T | null`.
- Exact emitted typing lives in `state.fieldTypes`, `action.inputType`, and `action.params`. `state.fields` and `action.input` remain compatibility/coarse introspection seams.
- `dispatchable when` is input-bound and does not project into `SchemaGraph`.
