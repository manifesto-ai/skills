# Agent: Reflective Loop

A domain pattern for an agent that tracks its own prediction accuracy, decides between exploration and exploitation, and self-revises its strategy when confidence drops.

Useful as a starting point for any agent that must operate under resource constraints (limited queries, turns, or API calls) while adapting its policy based on observed outcomes.

## Patterns covered

- EMA-based signal tracking without loops
- Confidence gate with cooldown
- Budget-constrained explore vs exploit selection
- Multi-candidate strategy selection
- Predict → act → observe → revise cycle

## Domain

```mel
domain AgentReflective {

  // --- Types ---

  type Candidate = { id: string, value: number }

  // --- State ---

  state {
    phase: string = "setup"

    // Resource budgets
    actionsRemaining: number = 20
    queriesRemaining: number = 10
    actionsTaken: number = 0
    queriesAsked: number = 0

    // Best candidates (written by host each turn)
    bestExploitId: string = ""
    bestExploitValue: number = 0
    bestExploreId: string = ""
    bestExploreValue: number = 0

    // Prediction record (written before each action)
    predictedSignal: number = 0
    predictedGain: number = 0

    // EMA-based accuracy tracking
    errorEMA: number = 0
    calibrationEMA: number = 0
    observedCount: number = 0

    // Confidence and revision controls
    confidenceThreshold: number = 0.72
    minRevisionDelta: number = 0.01
    exploitThreshold: number = 0.55
    revisionCooldownTurns: number = 3
    revisionCooldownRemaining: number = 0
    lowConfidenceStreak: number = 0
    revisionCount: number = 0
    lastRevisionReason: string = ""
    policyMode: string = "default"

    // Strategy preview values (written by host before revision check)
    currentPolicyPreviewValue: number = 0
    aggressiveExploitPreviewValue: number = 0
    broadenExplorePreviewValue: number = 0
  }

  // --- Computed: resources ---

  computed canAct = and(eq(phase, "active"), gt(actionsRemaining, 0))
  computed canQuery = and(eq(phase, "active"), gt(queriesRemaining, 0))

  // --- Computed: explore vs exploit ---

  computed forceExploit = gte(bestExploitValue, exploitThreshold)
  computed exploreCandidate = neq(bestExploreId, "")
  computed exploreOutvaluesExploit = gt(bestExploreValue, bestExploitValue)

  computed preferExplore = and(
    canQuery,
    exploreCandidate,
    exploreOutvaluesExploit,
    not(forceExploit)
  )
  computed preferExploit = or(forceExploit, not(preferExplore))

  // --- Computed: model confidence ---

  computed modelConfidenceRaw = sub(1, div(add(errorEMA, calibrationEMA), 2))
  computed modelConfidence = cond(gt(modelConfidenceRaw, 0), modelConfidenceRaw, 0)
  computed confident = gte(modelConfidence, confidenceThreshold)
  computed needsRevision = not(confident)
  computed canRevise = and(needsRevision, eq(revisionCooldownRemaining, 0))
  computed sustainedLowConfidence = gte(lowConfidenceStreak, 2)

  // --- Computed: strategy candidates ---

  computed aggressiveDelta = sub(aggressiveExploitPreviewValue, currentPolicyPreviewValue)
  computed broadenDelta = sub(broadenExplorePreviewValue, currentPolicyPreviewValue)

  computed aggressiveCandidate = gt(aggressiveDelta, minRevisionDelta)
  computed broadenCandidate = gt(broadenDelta, minRevisionDelta)

  computed nextStrategyKind = cond(
    and(aggressiveCandidate, or(not(broadenCandidate), gte(aggressiveDelta, broadenDelta))),
    "aggressive_exploit",
    cond(broadenCandidate, "broaden_explore", "")
  )
  computed nextStrategyDelta = cond(
    eq(nextStrategyKind, "aggressive_exploit"), aggressiveDelta,
    cond(eq(nextStrategyKind, "broaden_explore"), broadenDelta, 0)
  )
  computed nextExploitThreshold = cond(
    eq(nextStrategyKind, "aggressive_exploit"),
    cond(gt(exploitThreshold, 0.45), sub(exploitThreshold, 0.05), 0.4),
    exploitThreshold
  )

  computed revisionReady = and(
    canRevise,
    sustainedLowConfidence,
    neq(nextStrategyKind, "")
  )
  computed shouldRevise = and(eq(phase, "active"), revisionReady)

  // --- Actions ---

  action start(totalActions: number, totalQueries: number) {
    onceIntent {
      patch actionsRemaining = totalActions
      patch queriesRemaining = totalQueries
      patch phase = "active"
    }
  }

  // Host calls this each turn to write the current best candidates.
  action updateCandidates(
    exploitId: string,
    exploitValue: number,
    exploreId: string,
    exploreValue: number
  ) available when eq(phase, "active") {
    onceIntent {
      patch bestExploitId = exploitId
      patch bestExploitValue = exploitValue
      patch bestExploreId = exploreId
      patch bestExploreValue = exploreValue
    }
  }

  // Record what the agent expects before acting — used to measure accuracy later.
  action recordPrediction(
    expectedSignal: number,
    expectedGain: number
  ) available when eq(phase, "active") {
    onceIntent {
      patch predictedSignal = expectedSignal
      patch predictedGain = expectedGain
    }
  }

  // Exploitation: act on the best known candidate.
  action exploit(targetId: string)
    available when canAct
    dispatchable when neq(bestExploitId, "") {
    onceIntent {
      patch actionsRemaining = sub(actionsRemaining, 1)
      patch actionsTaken = add(actionsTaken, 1)
    }
  }

  // Exploration: ask a query to reduce uncertainty.
  action explore(queryId: string)
    available when canQuery
    dispatchable when neq(bestExploreId, "") {
    onceIntent {
      patch queriesRemaining = sub(queriesRemaining, 1)
      patch queriesAsked = add(queriesAsked, 1)
    }
  }

  // After observing the outcome, update accuracy EMAs.
  // alpha = 0.25 (effective window ~4 turns).
  action recordObservation(
    actualSignal: number,
    actualGain: number
  ) available when eq(phase, "active") {
    onceIntent {
      patch errorEMA = cond(
        eq(observedCount, 0),
        abs(sub(actualSignal, predictedSignal)),
        div(add(mul(errorEMA, 3), abs(sub(actualSignal, predictedSignal))), 4)
      )
      patch calibrationEMA = cond(
        eq(observedCount, 0),
        abs(sub(actualGain, predictedGain)),
        div(add(mul(calibrationEMA, 3), abs(sub(actualGain, predictedGain))), 4)
      )
      patch observedCount = add(observedCount, 1)
      patch revisionCooldownRemaining = cond(
        gt(revisionCooldownRemaining, 0),
        sub(revisionCooldownRemaining, 1),
        0
      )
    }
  }

  // Update the low-confidence streak counter.
  action updateConfidenceStreak(isLowConfidence: boolean)
    available when eq(phase, "active") {
    onceIntent {
      patch lowConfidenceStreak = cond(isLowConfidence, add(lowConfidenceStreak, 1), 0)
    }
  }

  // Host writes preview values before calling applyRevision.
  action recordStrategyPreviews(
    currentValue: number,
    aggressiveValue: number,
    broadenValue: number
  ) available when eq(phase, "active") {
    onceIntent {
      patch currentPolicyPreviewValue = currentValue
      patch aggressiveExploitPreviewValue = aggressiveValue
      patch broadenExplorePreviewValue = broadenValue
    }
  }

  // Self-revise strategy when confidence has been low and a better policy is available.
  action applyRevision(reason: string)
    available when eq(phase, "active") {
    when not(shouldRevise) {
      fail "NO_REVISION_REQUESTED"
    }
    onceIntent {
      patch exploitThreshold = nextExploitThreshold
      patch policyMode = nextStrategyKind
      patch lastRevisionReason = reason
      patch revisionCount = add(revisionCount, 1)
      patch revisionCooldownRemaining = revisionCooldownTurns
      patch lowConfidenceStreak = 0
    }
  }

  action finish(result: string) {
    onceIntent {
      patch phase = result
    }
  }
}
```

## Turn cycle

Each turn the host follows this sequence:

1. `updateCandidates` — write current best exploit and explore candidates
2. Read `preferExplore` / `preferExploit` from snapshot to decide action family
3. `recordPrediction` — write expected signal and gain before acting
4. `exploit` or `explore`
5. Execute the action in the world, observe outcome
6. `recordObservation` — update EMAs with actual signal and gain
7. `updateConfidenceStreak` — pass `not(confident)` from snapshot
8. If `shouldRevise` is true:
   - `recordStrategyPreviews` — write simulation results for each candidate strategy
   - `applyRevision` — commit the winning strategy

## Notes

- All EMA updates use alpha = 0.25 (window ~4). Adjust by changing the multiplier: `mul(ema, window - 1)` / `window`.
- Under the current compiler contract, prefer `absDiff(a, b)` over manually writing `abs(sub(a, b))` or `cond(gt(a,b), sub(a,b), sub(b,a))`.
- Prefer `clamp(x, lo, hi)` and `streak(prev, cond)` when they express the intent more directly than the lowered form.
- For fixed strategy choice, prefer parser-free `match(key, [k, v], ..., default)` and fixed-candidate `argmax()` / `argmin()` over long hand-written `cond(eq(...))` or pairwise comparison chains.
- `shouldRevise` is a computed — the host reads it from the snapshot, never decides independently. Host executes, Core decides.
- `revisionCooldownRemaining` decrements inside `recordObservation` so the cooldown is turn-accurate without a separate action.
- Add `dispatchable when` to `exploit` / `explore` to encode per-target preconditions (e.g. checking target state before acting).
- If you extend this domain to track candidates as a collection (e.g. `candidates: Array<Candidate>`), use `findById`/`existsById` in expressions and `updateById`/`removeById` on patch RHS. See `mel-patterns.md` Entity Primitives section.
