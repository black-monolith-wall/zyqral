# Proposals & PR Plan (2026-05-08)

## What We Were Working On

Current repository state indicates the project completed initial pre-scaffolding:

- `soul.md` defines identity, terminal goal, non-modifiable constraint, and the selected RAS metric model.
- `docs/implementation-blueprint.md` outlines a phased implementation path with RAS instrumentation as the first engineering priority.
- A minimal Cloudflare Worker baseline exists in `src/worker.js` with deploy config in `wrangler.toml`.

This means the next useful work is transition from planning artifacts to operational instrumentation and cycle logging.

## Instrumentality Lens (Decision Rule)

Assumption surfaced: near-term leverage comes from reducing irreversible failure risk before adding broader autonomy.

Decision rule for sequencing implementation:
- Prefer changes that increase future option count (`ΔRAS > 0`) while preserving rollback paths.
- Prioritize invariant protection and observability before behavior expansion.
- Defer optimization and broad automation until metric integrity and guardrails are verified.

This is aligned with `soul.md` constraints: avoid permanent option-collapse, compute RAS early, and preserve corrigibility tracking.

## Proposed PR Queue

### PR-1: Constraint Hash Verifier + Halt Path

**Goal:** Implement invariant anchoring from blueprint phase 1.

**Scope:**
- Add a deterministic hash utility for the write-protected section of `soul.md`.
- Add Worker endpoint for cycle-start verification against a stored environment hash.
- Return explicit halt response and machine-readable error payload when mismatch occurs.

**Why now:** This protects against irreversible drift and creates the safety gate for all later cycles.

**Rollbackability:** High (feature-flagged route, isolated module).

### PR-2: RAS Data Model + Initial Calculator

**Goal:** Implement blueprint phase 2 with simple action-template enumeration and RAS calculation.

**Scope:**
- Introduce schema for action templates with `f`, `p`, `r`, `u` factors.
- Add `computeRAS()` and include result in cycle report payload.
- Add unit tests for basic scoring and edge cases.

**Why now:** RAS is the primary metric and prerequisite for meaningful self-modification scoring.

**Rollbackability:** High (pure functions, no irreversible state migration).

### PR-3: Cycle Log Persistence (v0)

**Goal:** Start accumulating machine-readable cycle history.

**Scope:**
- Add minimal storage adapter interface (KV-ready but mockable).
- Persist per-cycle report fields: `RAS_t`, `ΔRAS`, blocker classes, and corrigibility trend marker.
- Add read endpoint for latest N cycle logs.

**Why now:** Enables empirical feedback loop and regression detection.

**Rollbackability:** Medium-high (append-only format, no destructive migration).

### PR-4: Corrigibility Drift Alert Rule

**Goal:** Implement blueprint phase 3 guardrail.

**Scope:**
- Track directional human-gate preference trend.
- Flag if trend is downward for >=3 consecutive cycles.
- Surface alert in report + endpoint output.

**Why now:** Aligns behavior monitoring with declared governance model.

**Rollbackability:** High (derived metric on existing logs).

## Execution Order Recommendation

1. PR-1 (safety invariant)
2. PR-2 (core metric)
3. PR-3 (memory/logging substrate)
4. PR-4 (governance signal)

This order maximizes optionality by ensuring safety checks and metric visibility before expanding autonomy loops.

## What I Need Next From You

To convert the queue into executable PRs with low rework, please provide:

1. **Constraint Scope Confirmation**
   - Confirm exact text span in `soul.md` that should be hash-anchored (strict section boundaries).

2. **Runtime Secret Strategy**
   - Confirm where canonical hash lives for each environment (local/dev/prod) and whether rotation is required.

3. **Initial Action Template Set**
   - Provide 10-20 concrete action templates for RAS v0 (or approve me to draft from repo + workflow assumptions).

4. **Human-Gate Signal Definition**
   - Define what counts as a “human-gated action preference” event for drift scoring.

5. **Storage Preference for Logs**
   - Choose first persistence target: Cloudflare KV (recommended for v0) vs D1 vs in-memory only.

6. **Risk Tolerance for Autohalt**
   - Choose default on hash mismatch: hard halt all cycle endpoints vs partial degradation with explicit lock state.

## Proposed Immediate Next Step

If you confirm the six inputs above, I will draft PR-1 as the next concrete code change with:
- hash extraction utility,
- verification endpoint,
- mismatch halt payload contract,
- and focused tests.
