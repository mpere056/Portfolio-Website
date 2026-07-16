# Implementation Work Registry

Last reconciled: 2026-07-16

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

The supported stack, free-tier Firestore retrieval, canonical content identities, and first shared-contract increment are implemented. Information-architecture review reopened `ARC-02` for one bounded graph/discovery contract correction; `ARC-03` is paused behind it with route scope already approved.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-ARC-02-02` | ready | `ARC-02` | Initial shared contracts pass 19 tests/build; omissions are documented before runtime adoption | Expand graph-node identity and add `easter_egg_found`, then rerun gates | 2026-07-16 |
| Next | `WI-ARC-03-01` | paused | `ARC-03` | Information architecture approved; current routes remain the visitor-safe baseline | Resume route-classified destination inventory after `ARC-02` returns to complete | 2026-07-16 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-ARC-02-02` | Reconcile Graph And Discovery Contracts | ready | high | `ARC-02` | `CAP-ARC-002` | `active/WI-ARC-02-02.md` | 2026-07-16 |
| `WI-ARC-03-01` | Build The Destination Registry | paused | high | `ARC-03` | `CAP-ARC-003` | `active/WI-ARC-03-01.md` | 2026-07-16 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-ARC-02-01` | done | `ARC-02` | Initial shared depth, destination, discovery, AI-context, card, and project-experience increment accepted; package later reopened by `WI-ARC-02-02` | `EV-ARC-02-01` | 2026-07-16 |
| `WI-ARC-01-01` | done | `ARC-01` | Canonical IDs accepted in inventory, Firestore ingestion, Preview, and Production | `EV-ARC-01-01`, `EV-BAS-08-03` through `EV-BAS-08-05` | 2026-07-16 |
| `WI-BAS-08-01` | done | `BAS-08` | Free-tier Firestore retrieval and grounded chat live on all public domains | `EV-BAS-08-01` through `EV-BAS-08-05` | 2026-07-16 |
| `WI-BAS-05-01` | done | `BAS-05` | Supported implementation reconciled against target capabilities | `EV-BAS-05-01` through `EV-BAS-05-03` | 2026-07-14 |
| `WI-BAS-07-01` | done | `BAS-07` | Next.js 16/React 19 and repaired AI runtime live on all production domains | `EV-BAS-07-01` through `EV-BAS-07-09` | 2026-07-14 |
| `WI-BAS-06-01` | done | `BAS-06` | Node.js 24 bridge live on all production domains | `EV-BAS-06-01` through `EV-BAS-06-05` | 2026-07-14 |
| `WI-BAS-04-01` | done | `BAS-04` | Node.js 24 bridge and separate Next.js 16 migration accepted | `EV-BAS-04-01` through `EV-BAS-04-04` | 2026-07-14 |
| `WI-BAS-02-01` | done | `BAS-02` | Content and route inventory accepted | `EV-BAS-02-01` through `EV-BAS-02-03` | 2026-07-14 |

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
