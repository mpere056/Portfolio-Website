# Implementation Work Registry

Last reconciled: 2026-07-16

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

Phase 1 remains fully accepted. Phase 2 has begun at `4c9b02a`: `QA-01` proves the foundations cooperate in one integrated flow, and `EXP-02` now has an accepted dormant five-stage transition contract while its controller and first consumer remain explicitly incomplete.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-EXP-02-01` | in-progress | `EXP-02` | Pure transitions and the integrated foundation flow pass within 68 tests | Apply accepted transitions through a headless persistence/context controller | 2026-07-16 |
| Next | Controlled consumer increment | pending | `EXP-02` | Controller must synchronize and clean up before UI adoption | Mount one lightweight consumer and add browser coverage | 2026-07-16 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-EXP-02-01` | Establish The First Controlled Depth Primitive | in-progress | high | `EXP-02` | `CAP-EXP-003`, `CAP-EXP-004` | `active/WI-EXP-02-01.md` | 2026-07-16 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-QA-01-01` | done | `QA-01` | Destination, graph, persistence, AI context, and fallback foundations cooperate in one automated flow | `EV-QA-01-01` | 2026-07-16 |
| `WI-EXP-01-01` | done | `EXP-01` | Versioned per-origin exploration hydration, migration, semantic checkpoints, and reset accepted | `EV-EXP-01-01` | 2026-07-16 |
| `WI-KG-04-01` | done | `KG-04` | Initial 49-node, 19-relationship reviewed public subgraph accepted | `EV-KG-04-01` | 2026-07-16 |
| `WI-KG-03-01` | done | `KG-03` | Deterministic graph compiler and mandatory prebuild validation accepted | `EV-KG-03-01` | 2026-07-16 |
| `WI-KG-02-01` | done | `KG-02` | Authored content and extension schemas accepted | `EV-KG-02-01` | 2026-07-16 |
| `WI-KG-01-01` | done | `KG-01` | Recursive shared loader and nested ingestion parity accepted | `EV-KG-01-01` | 2026-07-16 |
| `WI-AI-01-01` | done | `AI-01` | Nested source-owned route and object context accepted | `EV-AI-01-01` | 2026-07-16 |
| `WI-LPS-01-01` | done | `LPS-01` | Lifecycle-specific authored section rules accepted without classifying projects | `EV-LPS-01-01` | 2026-07-16 |
| `WI-BAS-03-01` | done | `BAS-03` | Typed environment-aware feature flag policy accepted | `EV-BAS-03-01` | 2026-07-16 |
| `WI-ARC-05-01` | done | `ARC-05` | Structured runtime validation and section-isolated semantic-state migration accepted | `EV-ARC-05-01` | 2026-07-16 |

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
