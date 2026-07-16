# Implementation Work Registry

Last reconciled: 2026-07-16

## Purpose

This is the operational entry point for active and unfinished implementation. Plans explain what and why; work-item files preserve where the implementation stopped and how to continue.

Read `../implementation-plans/17-Work-Items-And-Resume-Protocol.md` before creating or updating work items.

## Current Focus

The supported stack, free-tier Firestore retrieval, canonical identities, shared contracts, destinations, typed actions, runtime validation, and state migration are implemented. `EXP-01` is ready to adopt the accepted semantic envelope through a dormant per-origin store.

| Slot | Work item | State | Package | Milestone | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-EXP-01-01` | ready | `EXP-01` | Runtime validators and v0-to-v1 migration pass 37 tests and build without storage coupling | Write memory-storage fixtures for hydration, migration, checkpoint, isolation, and reset | 2026-07-16 |
| Next | `EXP-02` package preparation | pending | `EXP-02` | Depth/action contracts are accepted, but no UI should consume an unaccepted store | Prepare one controlled depth primitive only after `EXP-01` passes | 2026-07-16 |

## Active And Unfinished Items

| Work item | Title | State | Priority | Package | Capabilities | File | Last update |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `WI-EXP-01-01` | Establish The Versioned Exploration Store | ready | high | `EXP-01` | `CAP-EXP-001`, `CAP-EXP-002` | `active/WI-EXP-01-01.md` | 2026-07-16 |

Include `ready`, `in-progress`, `in-review`, `blocked`, and `paused` items. The item file is the source of current truth.

## Planned And Backlog Items

Do not create files for every possible future task. Create a work item when it is close enough to execution to have bounded acceptance, dependencies, and a meaningful next action.

Package-level future work remains in `../implementation-plans/13-Execution-Work-Packages.md` until then.

## Recently Closed

| Work item | Final state | Package | Result | Evidence | Closed |
| --- | --- | --- | --- | --- | --- |
| `WI-ARC-05-01` | done | `ARC-05` | Structured runtime validation and section-isolated semantic-state migration accepted | `EV-ARC-05-01` | 2026-07-16 |
| `WI-ARC-04-01` | done | `ARC-04` | Seven ID-first actions, creators, and exhaustive destination/depth/context integration accepted | `EV-ARC-04-01` | 2026-07-16 |
| `WI-ARC-03-01` | done | `ARC-03` | Reviewed 27-entry destination registry, resolver, safe-state policy, fallbacks, and origin handling accepted | `EV-ARC-03-01` | 2026-07-16 |
| `WI-ARC-02-02` | done | `ARC-02` | Graph-only identities and complete discovery vocabulary restore shared-contract acceptance | `EV-ARC-02-02` | 2026-07-16 |
| `WI-ARC-02-01` | done | `ARC-02` | Initial shared depth, destination, discovery, AI-context, card, and project-experience increment accepted; package later reopened by `WI-ARC-02-02` | `EV-ARC-02-01` | 2026-07-16 |
| `WI-ARC-01-01` | done | `ARC-01` | Canonical IDs accepted in inventory, Firestore ingestion, Preview, and Production | `EV-ARC-01-01`, `EV-BAS-08-03` through `EV-BAS-08-05` | 2026-07-16 |
| `WI-BAS-08-01` | done | `BAS-08` | Free-tier Firestore retrieval and grounded chat live on all public domains | `EV-BAS-08-01` through `EV-BAS-08-05` | 2026-07-16 |
| `WI-BAS-05-01` | done | `BAS-05` | Supported implementation reconciled against target capabilities | `EV-BAS-05-01` through `EV-BAS-05-03` | 2026-07-14 |
| `WI-BAS-07-01` | done | `BAS-07` | Next.js 16/React 19 and repaired AI runtime live on all production domains | `EV-BAS-07-01` through `EV-BAS-07-09` | 2026-07-14 |
| `WI-BAS-06-01` | done | `BAS-06` | Node.js 24 bridge live on all production domains | `EV-BAS-06-01` through `EV-BAS-06-05` | 2026-07-14 |

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
