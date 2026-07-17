# WI-EXP-05-01: Build The Environmental Response Prototype

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `EXP-05` |
| Capabilities | `CAP-EXP-009`, `CAP-EXP-010`, `CAP-EXP-011` |
| Requirements | `V-02`, `V-12`, `V-22` |
| Outcome | `O-01` |
| Milestone | Three reviewed interaction rules cooperate in one controlled graph-backed instrument |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

One feature-flagged controlled instrument demonstrates proximity reveal, object handling, and a reviewed graph relationship becoming semantic light; a persisted continuous stimulation preference scales visual response, while sound-off and reduced-motion states remain understandable.

## Resume Packet

### Current Truth

- State in one sentence: Dependencies and interaction rules are accepted; implementation is beginning from a pure state model and reviewed KG-05 edges.
- Works now: `EXP-02` depth primitives, `KG-05` bounded semantic edges, shared exploration persistence, and Development/Preview flags.
- Incomplete or stubbed: Environmental reducer, graph-to-scene adapter, controlled instrument, stimulation consumer, tests, and browser review.
- Safe exposure: `semanticLighting` remains false until the prototype and fallback tests pass; Production remains false after acceptance.

### Known-Good Point

- Commit: `4c80518` plus `73acc50`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm exec -- vitest run tests/guidedTour.test.ts tests/experienceStore.test.ts && npm exec -- tsc --noEmit`.
- Verification result: 15 focused tour/store cases and strict typecheck pass; browser flow accepted.
- Route/preview: Local Home and Projects.
- Feature flags: First Note, guided tour, and global AI on in Development/Preview; Production off.
- Browser/test data: Returning local visitor with completed First Note and recruiter tour role.

### Restart Here

- Next exact action: Implement a pure discovery-physics reducer and stimulation profile with three deterministic rule tests.
- First files/symbols: `src/lib/experience/environment.ts`, `tests/environment.test.ts`, `getSemanticLightingEdges`.
- Expected observable result: Proximity, handling, relationship review, reduced motion, and malformed signal behavior are deterministic without React.
- Only after that: Mount one lazy client instrument and review its visible pointer/keyboard flow.

### Context That Must Survive

- Decisions and rejected alternatives: This is not a constellation page or a new navigation mode; it is one bounded relationship instrument. Do not invent links outside the reviewed graph.
- Assumptions still unproven: The compact global placement will feel unobtrusive beside tour, AI, and audio controls.
- Relevant plan sections: `02-Experience-Foundation.md` Discovery Physics Prototype and Stimulation Control; `03-Knowledge-Graph-And-Content.md`; `08-Platform-Quality-And-Rollout.md`.
- Evidence: `KG-05.md`, `EXP-02.md`, `EXP-04.md`.
- Known failures or traps: Do not rerender the existing WebGL scene on slider movement; never silently enable sound; color cannot be the only relationship explanation.
- Uncommitted/external work: Preserve `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/`.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `EXP-02` | resolved | Reuse atomic interaction semantics; do not alter depth grammar. |
| Package | `KG-05` | resolved | Consume at most three public reviewed semantic edges. |
| Feedback | Musical identity | open/later | Do not author a motif or audible interaction layer in this prototype. |

## Implementation Checklist

- [ ] Pure three-rule environmental reducer and bounded signal validation.
- [ ] Graph-backed server adapter with relationship copy and canonical destinations.
- [ ] Pointer and keyboard controlled instrument with text-equivalent meaning.
- [ ] Persisted continuous stimulation profile and reduced-motion mapping.
- [ ] Focused tests, typecheck, lint, build, and browser flow.
- [ ] Capability, evidence, dashboard, registry, and resume records updated.

