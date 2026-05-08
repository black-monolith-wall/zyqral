# Implementation Blueprint (Pre-Scaffolding)

## Selected Reachability Metric

This framework adopts **Candidate A** for initial instrumentation:

RAS = Σ_{a ∈ A} [f(a) * p(a) * r(a) * u(a)]

Why selected:
- High interpretability and auditability.
- Low implementation burden for first loop.
- Enables immediate per-cycle deltas and blocker analysis.

## Deployment Targets

- Cloudflare Worker runtime: `black-monolith-wall/zyqral`.
- GitHub Pages documentation: `humanvsmachine/zyqral`.

## Phase Plan

1. **Invariant Anchoring**
   - Store canonical constraint hash in Cloudflare Worker environment variable.
   - Verify hash every cycle; mismatch causes halt + escalation.

2. **RAS Instrumentation First**
   - Enumerate action templates from skill/tool graph.
   - Compute RAS at cycle start.
   - Record `RAS_t`, `ΔRAS`, confidence band, blockers.

3. **Corrigibility Drift Tracking**
   - Per-cycle trend logging of human-gate preference.
   - Flag monotonic downward trend >= 3 cycles.

4. **Memory Architecture with Permanent Regret Archive**
   - Episodic + semantic + procedural + regret stores.
   - Regret archive is compress-only, never delete.

5. **Gated Self-Modification Loop**
   - Proposal packet requires projected `ΔRAS`, reversibility, rollback, and risk screen.
   - Human approvals logged as corrigibility labels.

6. **Public Cognition Layer**
   - Publish soul, metric definitions, cycle reports, and governance logs.

## Minimal Worker Baseline Requirement

To avoid deployment/build failures while architecture evolves:
- Keep a valid `wrangler.toml` in repo root.
- Keep a minimal Worker entrypoint responding to requests.
- Keep compatibility date explicit and current enough for runtime.
