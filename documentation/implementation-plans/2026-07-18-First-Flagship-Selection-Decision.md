# First Flagship Selection Decision

Date: 2026-07-18
Status: approved after equal `PRJ-02` feasibility spikes
Selected project: LifeInbox
Deferred validated candidate: Sudoku Together

## Decision

LifeInbox is the first complete Phase 3 flagship slice. Sudoku Together remains a validated candidate for `PRJ-06`; its deterministic board and computer-participant reducer should be retained rather than discarded.

## Equal Rubric

| Criterion | LifeInbox | Sudoku Together |
| --- | --- | --- |
| Visitor value | **strong** - capture appears locally before any illustrative organization, communicating the trust model in two actions | **strong** - one legal visitor move and one labeled computer move communicate shared contribution immediately |
| Product truth | **strong** - the source app documents SQLite capture, dirty sync, enrichment, and reminder handling; the demo clearly separates immediate local behavior from illustrative later behavior | **strong** - the source app documents shared boards, versioned polling, Discord boundaries, and multiplayer UI; the demo explicitly labels the computer as deterministic and local |
| Depth potential | **strong** - the same captured entry leads naturally into privacy, SQLite, dirty sync, Fastify/PostgreSQL, enrichment, reminder, and recovery layers | **acceptable** - a move can reveal SDK, proxy, polling, persistence, and conflict layers, but the portfolio simulation cannot reproduce Discord presence truthfully |
| Asset readiness | **strong** - current authored copy, source README, architecture, tests, and a canonical reminder scenario are sufficient | **acceptable** - board logic and extensive design documentation are ready; authentic Discord context and multiplayer presence assets remain outside the portfolio |
| Implementation risk | **strong** - deterministic local capture and authored transformation have a narrow loading, fallback, and performance boundary | **acceptable** - board validity is bounded, but timing, focus, responsive board behavior, and perceived multiplayer truth add more QA surface |
| Reuse learning | **strong** - teaches the shared distinction between immediate product behavior, later systems, and progressively revealed evidence | **strong** - teaches deterministic shared-state simulation while preserving a highly project-specific board language |

## Tradeoff

Sudoku Together has the fastest single visual interaction. LifeInbox is selected because the first slice must prove the entire museum architecture, not only interaction appeal. Its local-first capture creates a clearer continuous journey through Handle, Enter, Understand, living state, AI cards, evidence, privacy, and fallback behavior.

## Boundaries

- The selected demo uses synthetic browser-local state and never contacts the LifeInbox VPS.
- Organization behavior is authored and labeled illustrative; it does not claim live AI execution.
- The Sudoku spike remains available as test-backed implementation material for its later flagship package.
- This decision does not rank either product overall; it selects the better architectural proving ground for this phase.

