# @manifesto-ai/codegen

> Plugin-based code generation from `DomainSchema`, with canonical SDK v5 domain facade output.

## Role

Generates deterministic typed artifacts from Manifesto schemas. New integrations should prefer the domain facade plugin because it aligns generated app code with the SDK v5 `action.*` surface and `snapshot.state` ontology.

## Public API

### `generate(opts): Promise<GenerateResult>`

```typescript
import { createDomainPlugin, generate } from "@manifesto-ai/codegen";

await generate({
  schema,
  outDir: "./generated",
  sourceId: "src/domain/todo.mel",
  plugins: [createDomainPlugin()],
});
```

```typescript
interface GenerateOptions {
  schema: DomainSchema;
  outDir: string;
  plugins: readonly CodegenPlugin[];
  sourceId?: string;
  stamp?: boolean;
}
```

### `createDomainPlugin(options?)`

Generates the canonical SDK v5 domain facade for:

- domain state as `snapshot.state`, never the retired data root or platform namespaces
- `computed`
- static `action.*` handles
- SDK-aligned `ActionInput<TDomain, Name>` and `ActionArgs<TDomain, Name>` aliases
- reserved public action-name rejection

### `createCompilerCodegen(options?)`

Builds an explicit emitter for compiler bundler plugins. With no options, it uses `createDomainPlugin()` and emits a canonical `<source>.domain.ts` facade next to the source `.mel` file.

```typescript
import { createCompilerCodegen } from "@manifesto-ai/codegen";
import { melPlugin } from "@manifesto-ai/compiler/vite";

melPlugin({
  codegen: createCompilerCodegen(),
});
```

### Plugin model

```typescript
interface CodegenPlugin {
  name: string;
  generate(ctx: CodegenContext): CodegenOutput | Promise<CodegenOutput>;
}
```

`createTsPlugin()` and `createZodPlugin()` remain available for legacy artifacts, but `createDomainPlugin()` is the canonical v5 output for SDK-facing code.

## Notes

- Keep output deterministic and plugin interactions side-effect free.
- Generated facades must not reintroduce retired data-root verbs, platform namespaces, or `$system` as domain state.
