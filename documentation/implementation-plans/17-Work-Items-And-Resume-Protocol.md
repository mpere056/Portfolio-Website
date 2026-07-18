# Work Items And Resume Protocol

Last updated: 2026-07-17

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `WIP` |
| Status | Active continuation control |
| Upstream | Roadmap, work packages, capability ledger, decisions, and tracking model |
| Downstream | Active implementation sessions, handoffs, reviews, evidence, and dashboard |
| Primary output | Small work items that can be paused and resumed without reconstructing context |

## Purpose

The plans describe a large multi-year direction, but implementation happens in interrupted sessions. The system must preserve not only what a feature is, but exactly where work stopped and how to restart it safely.

This protocol borrows a few useful project-management principles without recreating a project-management product:

- Explicit workflow states for bounded work items.
- Manually chosen high-level project status rather than inferred completion.
- Milestones as coherent stages.
- Chronological updates with visible staleness.
- Stable IDs and searchable history.

Linear documents similar concepts in its [issue workflow](https://linear.app/docs/configuring-workflows), [project status](https://linear.app/docs/project-status), [project updates](https://linear.app/docs/initiative-and-project-updates), and [milestones](https://linear.app/docs/project-milestones). This repository uses only the parts that help one person and Codex continue complex work; it does not adopt cycles, velocity, estimates, or completion percentages.

## Work Hierarchy

| Level | Purpose | Example |
| --- | --- | --- |
| Outcome | Visitor or platform result | `O-02` Quiet global AI |
| Package | Dependency-aware delivery boundary | `AI-04` Archive cards and destination flow |
| Capability | Stable part of the product | `CAP-AI-006` Structured archive cards |
| Milestone | Coherent checkpoint worth reviewing | One validated card opens an exact in-page destination |
| Work item | Restartable implementation slice | Validate card payload and unknown-destination fallback |
| Checklist | Small steps inside one work item | Add schema, fixtures, tests, and consumer adapter |

Do not create separate work items for trivial edits that cannot be meaningfully paused. Do split work when one item has multiple independent acceptance paths, owners, blockers, or review moments.

## Work Item IDs

Use:

```text
WI-{PACKAGE-ID}-{SEQUENCE}
```

Examples:

- `WI-ARC-02-01`
- `WI-EXP-03-02`
- `WI-PRJ-04-07`

Sequence numbers are two digits within a package and never reused. Renamed or moved work keeps its original ID and records the new package relationship.

## Workflow States

| State | Meaning | Required next information |
| --- | --- | --- |
| `inbox` | Captured but not yet validated or placed | Triage decision |
| `backlog` | Valid work with no current commitment | Promotion condition |
| `planned` | Scope and package are understood, but dependencies remain | Blocking dependencies |
| `ready` | Dependencies and acceptance are clear enough to begin | First exact action |
| `in-progress` | Actively changing implementation or content | Current checkpoint and fresh resume packet |
| `in-review` | Implementation stopped while evidence or human review is pending | Reviewer and review question |
| `blocked` | A named condition prevents meaningful progress | Blocker owner and restart trigger |
| `paused` | Intentionally stopped despite being valid and resumable | Reason and resume condition |
| `done` | Acceptance passed and evidence is registered | Completion update and resulting capability state |
| `canceled` | Intentionally will not be completed | Reason, replacement, or decision reference |

Status is manual. Tests, merges, or checklist completion do not automatically move an item to `done`.

## Priority

Use priority only to choose between otherwise valid work:

| Priority | Meaning |
| --- | --- |
| `urgent` | Production breakage, security/privacy risk, or immediate external commitment |
| `high` | Critical-path work or a blocker for several other items |
| `normal` | Valuable planned work with no exceptional urgency |
| `low` | Useful polish, exploration, or non-blocking cleanup |

Priority is not effort, importance to Mark's identity, or a promise date.

## Milestones

A milestone is a named, reviewable checkpoint, not a bucket of arbitrary tasks.

Good milestones:

- Stable IDs validate across one content type.
- First Note can be completed and safely skipped on return.
- One AI archive card opens an exact destination and handles an invalid destination.
- One flagship project reaches Signal through Understand in preview.

Poor milestones:

- Frontend work.
- Halfway done.
- Finish most AI tasks.
- Reach 80 percent.

Each active package should have one current milestone and optionally one next milestone. A milestone completes only when its named behavior is demonstrated and recorded.

## Work-In-Progress Limits

The default limit is:

- One primary package in active implementation.
- One primary `in-progress` work item.
- At most one additional `in-progress` item when it is genuinely independent and useful during a blocker or long-running operation.
- Any number of `in-review` items only when their reviewer and next action are explicit.

If a third implementation item seems necessary, first pause, finish, split, or reclassify existing work. The goal is not rigid process; it is preventing a landscape of features that are all started and none are restartable.

## The Resume Packet

Every `in-progress`, `in-review`, `blocked`, or `paused` work item keeps this block near the top of its file.

### Current Truth

- One-sentence state of the work.
- What works now.
- What is incomplete or intentionally stubbed.
- Current safe exposure: local, flagged preview, live, or unreachable.

### Known-Good Point

- Last known-good commit.
- Branch or worktree.
- Last verification command and result.
- Route, preview, feature flags, browser, and test data needed to reproduce it.

### Restart Here

- One exact next action, small enough to begin immediately.
- First files or symbols to inspect.
- Expected observable result of that action.
- Follow-up actions only after the first action succeeds.

### Context That Must Survive

- Decisions and rejected alternatives.
- Assumptions not yet proven.
- Relevant package, capability, requirement, and evidence IDs.
- Blockers, review questions, or feedback needed.
- Known failures and misleading paths to avoid.
- Uncommitted or external work that is not present in the known-good commit.

The next action cannot be `continue implementation`, `finish feature`, or `review code`. It must identify a concrete edit, decision, test, or inspection and its expected result.

## Chronological Updates

Append an update when:

- Work begins or resumes.
- The known-good point changes.
- A meaningful checkpoint lands.
- Scope is split or expanded.
- A decision changes direction.
- Work becomes blocked, paused, review-ready, done, or canceled.
- A handoff or long gap is likely.

Use this format:

```markdown
### YYYY-MM-DD - Short takeaway

- State: in-progress -> in-review
- Changed: concise durable change
- Verified: command, route, or evidence ID
- Remaining: named gaps
- Decision: decision ID or none
- Next: one exact action
- Commit: hash or `uncommitted`
```

Updates are append-only. Correct an old update with a new one rather than silently rewriting history. The resume packet itself remains current and may be edited.

## Restart Procedure

When returning to unfinished work:

1. Open `documentation/implementation-work/README.md` and select the named work item.
2. Read its current resume packet before opening implementation files.
3. Confirm repository status and do not disturb unrelated changes.
4. Verify the branch and known-good commit still exist.
5. Run the recorded verification command or inspect the recorded route.
6. Compare actual behavior with `Current Truth`.
7. If they differ, update the packet before implementing anything.
8. Perform the single `Restart Here` action.
9. Refresh the packet and append an update before stopping.

If the packet is stale or wrong, restoring trustworthy context becomes the first work item. Do not guess forward from an unreliable handoff.

## Split, Pause, And Cancel Rules

### Split

Split a work item when:

- It has more than one independently demonstrable outcome.
- A part can proceed while another is blocked.
- Different review types are obscuring current state.
- The next action remains broad after one attempt to clarify it.

The original item records the child IDs and whether it remains active.

### Pause

Pause when the work is valid but not currently worth WIP. Record:

- Why it stopped.
- Current truth and known-good point.
- Exact resume condition.
- Whether its branch should remain or be safely closed.

### Cancel

Cancel when the intended outcome is rejected, duplicated, superseded, or no longer useful. Preserve the reason and link any replacement. Never use `done` for abandoned work.

## Review And Completion

A work item can move to `done` only when:

- Its acceptance statement is satisfied.
- Verification and relevant creative review are recorded.
- Its capability dimension states are reconciled.
- Known gaps are moved to new work items or explicitly accepted.
- The resume packet is replaced by a completion summary.
- Evidence IDs and resulting milestone state are recorded.
- The dashboard no longer presents it as active.

## Staleness

- `in-progress` with no update for 7 days: review freshness at the next session.
- `in-progress` with no update for 14 days: mark stale on the dashboard and verify before editing.
- `in-review` with no reviewer action for 14 days: return to `ready`, pause, or name a new review action.
- `blocked` with no condition change for 30 days: keep blocked only if still relevant; otherwise pause, split, or cancel.
- `paused` items are not stale when their resume condition remains accurate, but review them at milestone boundaries.

Dates are attention signals, not deadlines.

## Structural Reconciliation

Run `npm exec vitest run tests/planningIntegrity.test.ts` whenever a package starts or closes, an active work item moves, evidence is accepted, or dashboard counts change.

The automated check must confirm:

- Package IDs and states are unique and use the accepted vocabulary.
- Dashboard package counts equal the package registry exactly.
- Active work-item files and active registry rows have one-to-one parity.
- Each active item references an existing package and reports the same state in its file and registry row.
- Capability package references resolve to package IDs.
- Every evidence reference in the capability ledger is explicitly registered.
- Every registered evidence row points to an existing durable file containing that evidence ID.

Automation proves structural agreement, not factual or creative truth. The package owner still reviews claims, content, named gaps, and evidence sufficiency.

## Completion Criteria

- Every active implementation effort has one work-item ID and file.
- Every unfinished active item has a current resume packet and exact next action.
- Chronological updates explain meaningful state changes.
- Dashboard `Now`, `Next`, `Review`, and `Blocked` entries resolve to work-item files.
- Capability state and work-item state agree.
- Package counts, active work-item parity, package references, and evidence registration pass the structural reconciliation test.
- No percentage or velocity metric is required to understand current progress.
- A fresh Codex session can resume an item using repository records rather than chat history.
