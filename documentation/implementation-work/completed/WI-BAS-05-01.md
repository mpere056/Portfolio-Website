# WI-BAS-05-01: Audit Target-State Implementation

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `BAS-05` |
| Capabilities | `CAP-BAS-005` |
| Requirements | `V-01` through `V-24` |
| Outcome | `O-00` |
| Milestone | Existing implementation is reconciled against retained behavior and the approved target capabilities |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

Inspect the supported repository, content corpus, tests, and live routes against the capability ledger. Assign named dimension states to current and next capabilities, distinguish retained legacy behavior from target-compliant behavior, record consequential gaps, and create restartable work items only for the first actionable implementation sequence. Distant, collaboration-gated, feedback-gated, and backlog scope remains explicit rather than being over-planned.

## Resume Packet

### Current Truth

- State in one sentence: The supported implementation is reconciled against the target; `ARC-01` is the only newly active capability and distant work remains intentionally unassessed.
- Works now: The audit records reusable runtime, content, interaction, AI, project, About, quality, and rollout foundations plus their target-state gaps.
- Incomplete or stubbed: No audit gap remains; feature implementation belongs to the named downstream capabilities.
- Safe exposure: The audit changed no visitor behavior or production data.

### Known-Good Point

- Commit: `4144bcc2f252a211ce0c611328ffe6be6d51dd32`
- Verification result: The audited production deployment was Ready; prior framework evidence covered 9 tests, build, retrieval, chat, and seven public routes.
- Inventory: 39 nodes, 35 authored identifiers, 4 filename fallbacks, 20 runtime/retrieval divergences, 3 blog ingestion gaps, and 0 structural errors.
- Evidence: `EV-BAS-05-01` through `EV-BAS-05-03`.

### Restart Here

- Next exact action: Continue `WI-ARC-01-01` from its canonical content-ID utility and candidate test checkpoint.
- First files/symbols: `src/lib/contentIds.ts`, `src/lib/contentInventory.ts`, `scripts/ingest.ts`, and `tests/contentIds.test.ts`.
- Expected observable result: Runtime inventory and ingestion use one stable content identity contract without changing routes.
- Only after that: Complete remaining authored-ID migrations, accept `ARC-01`, and begin `ARC-02`.

### Context That Must Survive

- Legacy behavior is retained evidence, not automatic target acceptance.
- Only current and near-term capabilities received detailed states; distant unknowns remain honest.
- The first dependency sequence is `ARC-01`, `ARC-02`, then `QA-01` and `KG-01` according to confirmed contracts.
- Unrelated worktree changes remain outside implementation commits.

## Implementation Checklist

- [x] Re-read capability-state and evidence rules.
- [x] Inspect architecture and shared-contract capabilities in dependency order.
- [x] Inspect exploration, persistence, graph, AI, project, About, and living-state behavior.
- [x] Inspect quality, stimulation, mobile-boundary, and rollout foundations.
- [x] Link direct evidence and name gaps for current and near-term states.
- [x] Create only the first bounded restartable implementation item.
- [x] Reconcile package, capability, work-item, dashboard, and evidence controls.

## Updates

### 2026-07-14 - Target-state audit became dependency-ready

- State: planned -> ready
- Verified: `CAP-BAS-007` was accepted and no technical baseline dependency remained open.
- Next: Inspect target-state coverage from code, content, tests, and live behavior.

### 2026-07-14 - Target-state audit accepted

- State: ready -> done
- Changed: Reconciled all major runtime surfaces, replaced unknown states for the immediate queue, recorded retained behavior and target gaps, and opened only `WI-ARC-01-01`.
- Verified: Deterministic inventory reproduced 39 nodes and every known identity/ingestion gap; production reference remained covered by accepted `BAS-07` evidence.
- Evidence: `EV-BAS-05-01` through `EV-BAS-05-03`.
- Next: Continue canonical content identities in `ARC-01`.
- Commit: documentation and first `ARC-01` increment pending.

## Completion Summary

Current implementation is understood without being overstated. The immediate architecture, loader, and quality capabilities have inspected named states; the first stable-ID increment is active and restartable.
