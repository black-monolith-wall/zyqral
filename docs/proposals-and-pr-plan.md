# Proposals & PR Plan (2026-05-08)

## What We Were Working On

Current repository state indicates the project completed initial pre-scaffolding:

- `soul.md` defines identity, terminal goal, non-modifiable constraint, and the selected RAS metric model.
- `docs/implementation-blueprint.md` outlines a phased implementation path with RAS instrumentation as the first engineering priority.
- A minimal Cloudflare Worker baseline exists in `src/worker.js` with deploy config in `wrangler.toml`.

This means the next useful work is transition from planning artifacts to operational instrumentation and cycle logging.

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
