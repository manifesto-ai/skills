# @manifesto-ai/studio-core

> Analysis and projection layer for Manifesto domains and overlays.

## Role

`@manifesto-ai/studio-core` is the projection-first analysis package behind Studio surfaces.

Use it when you want to:

- inspect a `DomainSchema` without activating a runtime inside your app code
- attach overlays such as canonical snapshot, trace, lineage, or governance input
- compute findings, graph summaries, availability projections, blocker explanations, or replay summaries
- project observed runs into grouped transition graphs

Prefer SDK when you need a live activated runtime and dispatch. Prefer `studio-core` when you need offline analysis, deterministic inspection, or reusable projections for tools.

## Public surface

Primary entry point:

```typescript
import { createStudioSession } from '@manifesto-ai/studio-core';

const session = createStudioSession({ schema, snapshot, trace, lineage, governance });
```

Main session projections:

- `getGraph()`
- `getFindings()`
- `getActionAvailability()`
- `explainActionBlocker()`
- `inspectSnapshot()`
- `analyzeTrace()`
- `getLineageState()`
- `getGovernanceState()`

Additional projection helpers:

- `projectTransitionGraph(records, preset, { currentSnapshot })`
- `summarizeProjectionSignature(snapshot, preset)`

## Input model

Required input:

- `schema: DomainSchema`

Optional overlays:

- `snapshot`: canonical snapshot
- `trace`: trace graph
- `lineage`: lineage export or JSON-style lineage input
- `governance`: governance export or JSON-style governance input

Transition graph input:

- `ObservationRecord[]`
- `ProjectionPreset`
- optional canonical `currentSnapshot`

## Notes

- `studio-core` is not a runtime. It does not activate, dispatch, subscribe, or execute effects.
- Snapshot analysis in `studio-core` expects the canonical substrate shape used by `runtime.getCanonicalSnapshot()`.
- Schema-only sessions are valid. Overlay-driven projections degrade or report not-provided when the relevant overlay is absent.
- `transition-graph` is an explicit observation projection. It is not inferred from trace replay automatically.
- `studio-cli` and `studio-mcp` are consumer surfaces built on top of `studio-core` via `studio-node`.
