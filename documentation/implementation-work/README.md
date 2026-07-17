# Implementation Work Registry

Last reconciled: 2026-07-17

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

Phase 1 and Phase 2 are fully accepted. Phase 2 is pushed, deployed, and live-verified through production deployment `dpl_51xD2i8nQU8zEgjFiHnvNCvB2JqA`; its complete creative shell remains on in Development/Preview and deliberately off in Production pending creative review.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-PRJ-01-01` | in-progress | `PRJ-01` | Shared exhibit audit complete; contract implementation started | Add the typed registry, lazy loader, fallback shell, and direct-link tests | 2026-07-17 |
| Next | Phase 3 feasibility spikes | pending | `PRJ-02` | `PRJ-01` accepted | Compare bounded LifeInbox and Sudoku interaction spikes, then record the first-flagship decision | 2026-07-17 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-PRJ-01-01` | Establish the shared exhibit foundation | in-progress | high | `PRJ-01` | `CAP-PRJ-001`, `CAP-PRJ-002` | `active/WI-PRJ-01-01.md` | 2026-07-17 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-QA-01-02` | done | `QA-01` | Aggregate tests/build, protected Preview, production-safe deployment, live routes, and structured AI sources accepted | `EV-QA-01-02` through `EV-QA-01-04` | 2026-07-17 |
| `WI-EXP-06-01` | done | `EXP-06` | Three explicit meaningful discoveries, prerequisites, semantic persistence, and no-score/tour exclusion accepted | `EV-EXP-06-01`, `EV-EXP-06-02` | 2026-07-17 |
| `WI-EXP-05-01` | done | `EXP-05` | Three-rule relationship instrument, canonical semantic light, and persisted stimulation accepted | `EV-EXP-05-01`, `EV-EXP-05-02`, `EV-EXP-05-03` | 2026-07-17 |
| `WI-EXP-04-01` | done | `EXP-04` | One-question role lens, canonical any-order doors, dismiss/resume, and route persistence accepted | `EV-EXP-04-01`, `EV-EXP-04-02` | 2026-07-16 |
| `WI-AI-03-01` | done | `AI-03` | Identifier-only request context, public graph retrieval, native structured sources, and canonical source links accepted | `EV-AI-03-01` | 2026-07-16 |
| `WI-AI-02-01` | done | `AI-02` | Quiet lazy global shell, route context, clear/close/error, optional audio, and `/chat` compatibility accepted | `EV-AI-02-01`, `EV-AI-02-02` | 2026-07-16 |
| `WI-KG-06-01` | done | `KG-06` | Public graph metadata, bounded retrieval context, source descriptors, legacy compatibility, and 42-chunk backfill accepted | `EV-KG-06-01`, `EV-KG-06-02` | 2026-07-16 |
| `WI-KG-05-01` | done | `KG-05` | Deterministic visibility-safe bounded graph queries and destination render adapters accepted | `EV-KG-05-01` | 2026-07-16 |
| `WI-EXP-03-01` | done | `EXP-03` | One-time wake, audio-independent reveal, return restore, reset, and keyboard flow accepted behind flags | `EV-EXP-03-01`, `EV-EXP-03-02` | 2026-07-16 |
| `WI-EXP-02-01` | done | `EXP-02` | Atomic five-stage controller, AI ownership, persistence, hints, cleanup, and dormant React boundary accepted | `EV-EXP-02-01`, `EV-EXP-02-02` | 2026-07-16 |
| `WI-QA-01-01` | done | `QA-01` | Destination, graph, persistence, AI context, and fallback foundations cooperate in one automated flow | `EV-QA-01-01` | 2026-07-16 |

Keep the most recent ten here. Completed files remain under `completed/`; canceled files remain under `canceled/`.

## File Locations

| Folder | Contents |
| --- | --- |
| `active/` | `ready`, `in-progress`, `in-review`, `blocked`, and `paused` work |
| `completed/` | Accepted work-item records and completion summaries |
| `canceled/` | Rejected, duplicate, or superseded work with preserved reasons |

## Registry Update Rules

- Update Current Focus whenever `Now` or `Next` changes.
- Update the active table whenever state, package, priority, or file changes.
- Refresh a work item's resume packet before changing its registry row.
- Move files only when their final state changes; preserve Git history.
- Never record status only in chat, a branch name, or an unlinked commit.
- Keep unrelated working-tree changes out of work-item commits.

## Session Start

1. Check repository status.
2. Read Current Focus.
3. Open the `Now` work-item file.
4. Follow its restart procedure and verify the known-good point.

## Session End

1. Refresh Current Truth, Known-Good Point, and Restart Here.
2. Append a chronological update.
3. Reconcile capability states and evidence.
4. Update this registry and the progress dashboard.
5. Commit focused documentation with the implementation when appropriate.
