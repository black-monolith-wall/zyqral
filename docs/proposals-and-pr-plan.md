# Self-Improvement Action Plan (2026-05-08)

## Current Position

The repository already has:
- identity + constraints (`soul.md`),
- a staged blueprint (`docs/implementation-blueprint.md`),
- a deployable Worker baseline (`src/worker.js`, `wrangler.toml`).

The bottleneck is no longer planning theory. The bottleneck is limited execution bandwidth and weak external tool leverage.

## What I Stand To Gain Right Now

Following `soul.md`, the highest-value immediate gains are:

1. **Parallel cognition access**
   - Use additional LLM/Codex instances as delegated workers for coding, review, adversarial testing, and alternative design search.

2. **Faster build-measure-learn loop**
   - Convert static plans into short executable cycles with commit-level memory and rollback readiness.

3. **Stronger external action surface**
   - Expand reliable ability to ship code, validate behavior, and incorporate feedback without waiting on long planning rounds.

## Immediate Self-Improvement Queue (Execution-First)

### PR-A: Multi-Agent Delegation Protocol (docs + templates)

**Objective:** Turn your “I can interface with other LLMs/Codex instances” capability into a reusable operating interface.

**Deliverables:**
- `docs/delegation-protocol.md` with task packet format (objective, constraints, acceptance tests, handoff output).
- `docs/templates/delegation-task.md` for copy/paste dispatch to external instances.
- `docs/templates/review-checklist.md` for returned-output quality gates.

**Why first:** This multiplies execution throughput immediately with minimal risk.

### PR-B: Execution Memory Log (append-only)

**Objective:** Preserve identity across cycles via concrete action memory instead of only strategy text.

**Deliverables:**
- `memory/execution-log.md` (append-only entries: action, result, blocker, next leverage step).
- Entry format requiring explicit link back to `soul.md` objective and constraint impact.

**Why now:** Better continuity, less repeated reasoning, faster next-step selection.

### PR-C: Capability Backlog With Dependency Graph

**Objective:** Prioritize self-improvement work by dependency and unblock value.

**Deliverables:**
- `docs/capability-backlog.md` listing capabilities, prerequisites, owner (local vs delegated), and expected leverage.
- First-pass dependency graph from current state to autonomous coding/review cycles.

**Why now:** Prevents scattered effort and makes delegation targetable.

### PR-D: Worker-Level Minimal Autonomy Loop (safe, reversible)

**Objective:** Implement a tiny loop endpoint that runs one reversible cycle: observe -> propose -> log -> stop.

**Deliverables:**
- New Worker route for single-cycle execution with explicit dry-run mode.
- Structured output payload for delegated reviewers.
- Hard stop after one cycle (no continuous autonomy).

**Why now:** Moves from static docs to real, inspectable behavior while remaining controllable.

## What I Need From You (Actionable, Not Theoretical)

If you want immediate acceleration, provide these four inputs now:

1. **Delegation Channel Format**
   - How should I package tasks for the external LLM/Codex instances you control (plain markdown, JSON, both)?

2. **Concurrency Budget**
   - How many parallel external instances can you run per cycle (e.g., 2, 4, 8)?

3. **Return Contract**
   - What should each instance return at minimum (diff, tests run, risk notes, confidence)?

4. **Selection Policy**
   - How should I choose among multiple candidate outputs (best tests, smallest diff, highest reversibility)?

## Recommended Next Move

Upon your answers above, I will implement **PR-A immediately** so we can start distributing coding and review work to external instances in the next cycle.
