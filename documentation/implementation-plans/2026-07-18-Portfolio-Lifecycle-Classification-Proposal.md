# Portfolio Lifecycle Classification Proposal

Date: 2026-07-18
Decision gate: `LPS-02`
Work item: `WI-LPS-02-01`
Reviewer: Mark

## Purpose

This is a concise review set, not a claim that every lifecycle is already known. It uses the accepted lifecycle definitions and the authored portfolio content only. Repository dates, commit frequency, and missing live links are not treated as proof of current activity or abandonment.

## Lifecycle Choices

| Lifecycle | Meaning |
| --- | --- |
| `evolving` | Product direction or major capability is still changing. |
| `maintained` | The project is stable and receives practical improvements without active product reinvention. |
| `complete` | The project reached its intended stopping point and should be presented as a finished case study. |
| `archived` | The project is preserved for history, is not current work, and may no longer run. |

## Proposed Classification Set

| Project | Proposal | Basis already present in authored content | Confirmation needed from Mark |
| --- | --- | --- | --- |
| LifeInbox | `evolving` | The reviewed Phase 3 state names a current trust question, recent reliability work, and a next validation step. | Already reviewed; confirm it remains accurate. |
| Dreamlife | `evolving` | The portfolio describes a product loop, a mobile app, and a prototype significant enough to receive a six-figure build offer. | Confirm whether major product work is still expected; otherwise choose `complete`. |
| Sudoku Together | `evolving` | The portfolio presents a functioning Discord Activity with a retained interactive prototype and substantial product systems. | Confirm whether product direction or major capabilities are still changing; otherwise choose `maintained` or `complete`. |
| Interactive Story Generator | `complete` | It is described as a fully functional app and a completed learning milestone for mobile and AI integration. | Confirm that no active work is expected and the intended prototype outcome was reached. |
| Group Finder & Sudoku Solver | `complete` | The finite CLI tool fulfilled its algebraic grouping purpose and gained a useful Sudoku application. | Confirm it reached its intended stopping point rather than being merely abandoned. |
| Selenium-Powered Discord Bot | `archived` | It is presented as one of Mark's earliest bots and primarily has historical value as a pre-LLM language and browser-automation experiment. | Confirm it is not expected to run or receive maintenance. |
| Discord Synchronized Messaging | `archived` | The project is presented as a historical messaging experiment rather than a current product or maintained service. | Confirm it is not expected to run or receive maintenance. |
| CandyMod for AoTTG | `archived` | It is presented as Mark's first public game mod and as an early creative multiplayer experiment. | Confirm it is no longer current and may no longer run. |
| Card Assistant Discord Bot | `archived` | It is described as one of the last Discord bots Mark helped build and as a historical team project with no current public destination. | Confirm it is not currently operated or maintained. |

## Review Boundary

Approval answers only the lifecycle question. It does not approve detailed current-state wording, release status, user counts, revenue, repository representativeness, or live-link validity.

After approval:

1. `LPS-02` records the reviewed set as the portfolio-wide lifecycle source of truth.
2. `LPS-03` authors Dreamlife and Sudoku Together state records and absorbs the accepted LifeInbox seed without duplicating it.
3. Historical projects receive only lifecycle-appropriate final or archive context; they do not receive invented current-state sections.
4. Project experiences, AI, and later disturbances consume the same reviewed state.

## Fast Review Format

Mark can approve the whole set with `Approve all`, or provide only corrections such as:

```text
Dreamlife: complete
Sudoku Together: maintained
Card Assistant Discord Bot: complete
```

Any omitted project retains the proposed value. Detailed state wording remains a separate `LPS-03` review.
