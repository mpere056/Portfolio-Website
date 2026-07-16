# Implementation Work Registry

Last reconciled: 2026-07-16

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

Phase 1 remains fully accepted. Phase 2 now has seven complete packages through `aeb3152`, including the First Note, graph/retrieval foundation, quiet global AI shell, and contextual trusted sources. `EXP-04` is ready for the non-linear guided tour.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-EXP-04-01` | ready | `EXP-04` | Persistence, destination registry, role-safe graph candidates, and global route shell are accepted | Define authored role profiles and pure any-order recommendation state | 2026-07-16 |
| Next | Environmental response system | pending | `EXP-05` | `EXP-02` and `KG-05` are accepted | Build three-rule controlled prototype after tour acceptance | 2026-07-16 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-EXP-04-01` | Build The Non-Linear Guided Tour | ready | high | `EXP-04` | `CAP-EXP-007`, `CAP-EXP-008` | `active/WI-EXP-04-01.md` | 2026-07-16 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-AI-03-01` | done | `AI-03` | Identifier-only request context, public graph retrieval, native structured sources, and canonical source links accepted | `EV-AI-03-01` | 2026-07-16 |
| `WI-AI-02-01` | done | `AI-02` | Quiet lazy global shell, route context, clear/close/error, optional audio, and `/chat` compatibility accepted | `EV-AI-02-01`, `EV-AI-02-02` | 2026-07-16 |
| `WI-KG-06-01` | done | `KG-06` | Public graph metadata, bounded retrieval context, source descriptors, legacy compatibility, and 42-chunk backfill accepted | `EV-KG-06-01`, `EV-KG-06-02` | 2026-07-16 |
| `WI-KG-05-01` | done | `KG-05` | Deterministic visibility-safe bounded graph queries and destination render adapters accepted | `EV-KG-05-01` | 2026-07-16 |
| `WI-EXP-03-01` | done | `EXP-03` | One-time wake, audio-independent reveal, return restore, reset, and keyboard flow accepted behind flags | `EV-EXP-03-01`, `EV-EXP-03-02` | 2026-07-16 |
| `WI-EXP-02-01` | done | `EXP-02` | Atomic five-stage controller, AI ownership, persistence, hints, cleanup, and dormant React boundary accepted | `EV-EXP-02-01`, `EV-EXP-02-02` | 2026-07-16 |
| `WI-QA-01-01` | done | `QA-01` | Destination, graph, persistence, AI context, and fallback foundations cooperate in one automated flow | `EV-QA-01-01` | 2026-07-16 |
| `WI-EXP-01-01` | done | `EXP-01` | Versioned per-origin exploration hydration, migration, semantic checkpoints, and reset accepted | `EV-EXP-01-01` | 2026-07-16 |
| `WI-KG-01-01` | done | `KG-01` | Recursive shared loader and nested ingestion parity accepted | `EV-KG-01-01` | 2026-07-16 |
| `WI-AI-01-01` | done | `AI-01` | Nested source-owned route and object context accepted | `EV-AI-01-01` | 2026-07-16 |

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
