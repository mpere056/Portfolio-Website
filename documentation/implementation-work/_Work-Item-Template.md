# WI-PACKAGE-ID-00: Work Item Title

## Properties

| Field | Value |
| --- | --- |
| State | inbox / backlog / planned / ready / in-progress / in-review / blocked / paused / done / canceled |
| Priority | urgent / high / normal / low |
| Package | `PACKAGE-ID` |
| Capabilities | `CAP-XXX-000` |
| Requirements | `V-00` or Platform |
| Outcome | `O-00` |
| Milestone | Named demonstrable checkpoint |
| Owner | Mark / Codex / shared |
| Branch/worktree | Name or `not created` |
| Created | YYYY-MM-DD |
| Last update | YYYY-MM-DD |

## Acceptance

One concise observable statement that determines whether this work item is done.

## Resume Packet

### Current Truth

- State in one sentence:
- Works now:
- Incomplete or stubbed:
- Safe exposure:

### Known-Good Point

- Commit:
- Branch/worktree:
- Verification command:
- Verification result:
- Route/preview:
- Feature flags:
- Browser/test data:

### Restart Here

- Next exact action:
- First files/symbols:
- Expected observable result:
- Only after that:

### Context That Must Survive

- Decisions and rejected alternatives:
- Assumptions still unproven:
- Relevant plan sections:
- Evidence:
- Known failures or traps:
- Uncommitted/external work:

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package / decision / feedback / external | ID or link | open / resolved | Concrete condition |

## Implementation Checklist

- [ ] Small step with observable result.
- [ ] Deterministic verification where relevant.
- [ ] Failure, fallback, and safe-exposure behavior.
- [ ] Content and creative review where relevant.
- [ ] Capability, evidence, dashboard, and resume records updated.

The checklist supports the work item; checking every box does not automatically make it done.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| Absolute or repository-relative path | Starting context | unchanged / edited / planned |

## Open Questions

- Question, decision owner, and whether it blocks work.

## Updates

### YYYY-MM-DD - Work item created

- State: inbox -> planned
- Changed: bounded scope and acceptance
- Verified: not yet
- Remaining: all implementation
- Decision: none
- Next: one exact action
- Commit: uncommitted

## Completion Summary

Complete this only for `done` or `canceled` items.

- Final result:
- Capability states changed:
- Evidence IDs:
- Remaining work moved to:
- Final commit/deployment:
- Closed by and date:
