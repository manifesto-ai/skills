# @manifesto-ai/studio-cli

> Terminal surface for Studio projections and Manifesto domain inspection.

## Role

`@manifesto-ai/studio-cli` is the shell-facing inspection and debugging surface built on `@manifesto-ai/studio-node` and `@manifesto-ai/studio-core`.

Use it when you want to:

- inspect findings or graph structure without embedding Studio APIs
- explain runtime availability from a canonical snapshot
- replay trace overlays from the terminal or CI
- inspect lineage or governance overlays as standalone JSON inputs
- project observed runs into a grouped transition graph

Prefer SDK when you are embedding a live runtime inside an application. Prefer `studio-cli` when you want one-off inspection, CI checks, or repeatable shell automation.

## Surface

Primary commands:

- `analyze`, `check`
- `graph`
- `explain`
- `availability`
- `snapshot`
- `trace`
- `lineage`
- `governance`
- `transition-graph`

Typical commands:

```bash
studio-cli analyze path/to/domain.mel
studio-cli snapshot path/to/domain.mel --snapshot path/to/canonical-snapshot.json
studio-cli trace path/to/trace.json --schema path/to/domain.json
studio-cli transition-graph   --observations path/to/observations.json   --preset path/to/projection-preset.json   --snapshot path/to/canonical-snapshot.json
```

`graph` additionally supports `--format summary|full|dot|json`. Most other commands follow `--output text|json`.

## Input model

Choose one primary input:

- `--mel <file>`: compile a MEL file directly
- `--schema <file>`: load a compiled `DomainSchema` JSON file
- `--bundle <file>`: load a Studio bundle with schema and optional overlays

Optional overlays:

- `--snapshot <file>`: canonical snapshot JSON
- `--trace <file>`: trace graph JSON
- `--lineage <file>`: lineage JSON
- `--governance <file>`: governance JSON

Transition graph inputs:

- `--observations <file>`: `ObservationRecord[]` JSON
- `--preset <file>`: `ProjectionPreset` JSON
- optional `--snapshot <file>` to mark the current projected node

## Notes

- Snapshot tooling in `studio-cli` expects the canonical substrate from `runtime.getCanonicalSnapshot()` when a snapshot file is required.
- `availability`, `snapshot`, and `explain` usually want a canonical snapshot file, not the projected app-facing read from `getSnapshot()`.
- `trace` takes the trace path as its positional input.
- For JSON interchange, lineage and governance inputs are safest as arrays or plain keyed objects rather than serialized JS `Map` internals.
- `transition-graph` is not inferred from trace. Feed explicit observation records plus a projection preset.
- In the Studio repo, runnable example inputs currently live under `packages/studio-cli/examples/`.
