# Implementation Work Registry

Last reconciled: 2026-07-14

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

The technical, content, runtime, framework, and target-state audit baselines are complete. `ARC-01` is implementing canonical content identities before shared experience contracts or visitor features begin.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-ARC-01-01` | in-progress | `ARC-01` | Shared inventory/ingestion IDs, safe legacy replacement, 38 authored IDs, 13 tests, and build pass | Commit and preview before managed retrieval re-index | 2026-07-14 |
| Next | Uncreated | planned | `ARC-02` | Waits for accepted content identity | Define shared depth, destination, discovery, AI context, and project contracts | 2026-07-14 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-ARC-01-01` | Establish Stable Content Identities | in-progress | high | `ARC-01` | `CAP-ARC-001` | `active/WI-ARC-01-01.md` | 2026-07-14 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-BAS-05-01` | done | `BAS-05` | Supported implementation reconciled against target capabilities | `EV-BAS-05-01` through `EV-BAS-05-03` | 2026-07-14 |
| `WI-BAS-07-01` | done | `BAS-07` | Next.js 16/React 19 and repaired AI runtime live on all production domains | `EV-BAS-07-01` through `EV-BAS-07-09` | 2026-07-14 |
| `WI-BAS-06-01` | done | `BAS-06` | Node.js 24 bridge live on all production domains | `EV-BAS-06-01` through `EV-BAS-06-05` | 2026-07-14 |
| `WI-BAS-04-01` | done | `BAS-04` | Node.js 24 bridge and separate Next.js 16 migration accepted | `EV-BAS-04-01` through `EV-BAS-04-04` | 2026-07-14 |
| `WI-BAS-02-01` | done | `BAS-02` | Content and route inventory accepted | `EV-BAS-02-01` through `EV-BAS-02-03` | 2026-07-14 |
| `WI-BAS-01-01` | done | `BAS-01` | Technical baseline accepted | `EV-BAS-01-01` through `EV-BAS-01-04` | 2026-07-14 |

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
