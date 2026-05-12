# @manifesto-ai/governance

> Legitimacy decorator runtime for approval, proposal flow, and governed settlement.

## Role

Governance owns legitimacy on top of a lineage-composed manifesto:

- `withGovernance(withLineage(createManifesto(...), ...), config).activate()`
- governance-mode `action.<name>.submit(input)` semantics
- proposal creation and durable proposal references
- settlement observation through `pending.waitForSettlement()` and `app.waitForSettlement(ref)`
- authority evaluation, actor bindings, and decision records
- `approve()` / `reject()` for pending resolution
- `@manifesto-ai/governance/provider` for lower-level protocol seams

## Dependencies

- `@manifesto-ai/sdk`
- `@manifesto-ai/lineage`
- peer: `@manifesto-ai/core`

## Public API

### `withGovernance(lineageManifesto, config)`

```typescript
import { createManifesto } from "@manifesto-ai/sdk";
import { createInMemoryLineageStore, withLineage } from "@manifesto-ai/lineage";
import { withGovernance } from "@manifesto-ai/governance";

const app = withGovernance(
  withLineage(createManifesto<CounterDomain>(schema, effects), {
    store: createInMemoryLineageStore(),
  }),
  {
    bindings,
    execution: {
      projectionId: "counter",
      deriveActor(candidate) {
        return { actorId: "agent:demo", kind: "agent", meta: { action: candidate.action } };
      },
      deriveSource(candidate) {
        return { kind: "agent", eventId: `action:${String(candidate.action)}` };
      },
    },
  },
).activate();

const pending = await app.action.increment.submit();
if (pending.ok) {
  const settlement = await pending.waitForSettlement();
}
```

`GovernanceConfig<T>` includes:

- `bindings`
- optional `governanceStore`
- optional `evaluator`
- optional `eventSink`
- optional `now`
- required `execution`

Governance only accepts a manifesto that has already been composed with `withLineage()`. It does not create lineage on behalf of the caller.

## Activated Runtime

Governance-mode apps expose the common SDK v5 root grammar and governance control methods:

- `approve`
- `reject`
- `getProposal`
- `getProposals`
- `bindActor`
- `getActorBinding`
- `getDecisionRecord`
- `waitForSettlement`

Lineage query methods such as `restore`, `getWorld`, `getWorldSnapshot`, `getLatestHead`, and `getBranches` remain available through the lineage composition.

## Runtime Meaning

- `action.<name>.submit(input)` submits governed work for authority judgment.
- The initial admitted result is pending and carries a durable `ProposalRef`.
- `pending.waitForSettlement()` observes the proposal created by that result.
- `app.waitForSettlement(ref)` re-attaches to an existing durable proposal ref.
- With auto-approve or satisfied policy, the proposal can settle quickly, but it still exists as a proposal record.
- With HITL or tribunal policies, the proposal may remain pending until `approve()` or `reject()` resolves it.

Governance-mode `submit()` creates or enters the proposal path. It never directly executes base or lineage lower-authority write verbs.

## Settlement Results

Settlement statuses include:

- `settled`
- `rejected`
- `superseded`
- `expired`
- `cancelled`
- `settlement_failed`

For settled execution, `before` and `after` are projected snapshots anchored on the proposal's base world and result world. Host-owned namespace diagnostics remain canonical-substrate debugging data.

## Notes

- The canonical governed write ingress is `action.<name>.submit(input)`.
- `waitForSettlement()` observes or resumes settlement. It does not fabricate authority decisions, worlds, or visible publication.
- `approve()` and `reject()` are governance control methods, not action submission verbs.
- `@manifesto-ai/governance/provider` is for services, evaluators, stores, and protocol tests. It is not the primary application entry story.
