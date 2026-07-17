# WI-EXP-06-01: Build The Meaningful Discovery Registry

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `EXP-06` |
| Capabilities | `CAP-EXP-012`, `CAP-EXP-013` |
| Requirements | `V-08`, `V-20` |
| Outcome | `O-01` |
| Milestone | Three different meaningful discoveries persist without tour, score, count, or collection UI |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-17 |
| Last update | 2026-07-17 |

## Acceptance

A reviewed registry defines one personal artifact, one technical lesson, and one relational connection with explicit conditions and public knowledge nodes; each may be discovered through free exploration and persist semantically, while all are absent from tour data and no progress surface exists.

## Resume Packet

### Current Truth

- State in one sentence: The persistence, graph, tour exclusion boundary, and environmental prerequisite are accepted; registry implementation is beginning.
- Works now: Semantic `discoveredIds`, depth recording, public node validation, canonical destinations, and `experience:relationship-instrument` integration point.
- Incomplete or stubbed: Registry, condition evaluator, subtle route layer, reveal cards, persistence tests, tour-exclusion tests, and browser flow.
- Safe exposure: Add a typed `meaningfulDiscoveries` flag for Development/Preview only; Production remains off.

### Known-Good Point

- Commit: `4276e6b`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm exec -- vitest run tests/environment.test.ts tests/experienceStore.test.ts tests/knowledgeGraphQueries.test.ts && npm exec -- tsc --noEmit`.
- Verification result: 19 focused environment/store/graph cases pass; lint and production build pass.
- Route/preview: Local Home, About, and Projects.
- Feature flags: Phase 2 experience features on in Development/Preview; Production off.
- Browser/test data: Returning local visitor with tour state and stimulation `0.2`.

### Restart Here

- Next exact action: Define and validate three registry entries plus a pure availability evaluator.
- First files/symbols: `src/lib/experience/discoveries.ts`, `tests/discoveries.test.ts`, `PersistedDiscoverySlice`.
- Expected observable result: Kind, location, condition, reveal nodes, safety status, and tour exclusion are deterministic; prerequisites unlock only their intended entry.
- Only after that: Mount the subtle route layer and wire the environmental understood signal.

### Context That Must Survive

- Decisions and rejected alternatives: No score, total, badge shelf, collection page, literal checklist, or tour hint. Discovery copy must reveal understanding rather than trivia.
- Assumptions still unproven: The personal hold gesture and cross-insight signal will feel discoverable enough without becoming ordinary navigation.
- Relevant plan sections: `02-Experience-Foundation.md` Meaningful Easter Eggs; `03-Knowledge-Graph-And-Content.md`; `08-Platform-Quality-And-Rollout.md` fallbacks.
- Evidence: `EXP-01.md`, `KG-04.md`, `EXP-04.md`, `EXP-05.md`.
- Known failures or traps: Do not expose private corpus nodes, infer completion from page load, or couple discoveries to tour visits.
- Uncommitted/external work: Preserve `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/`.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `EXP-01` | resolved | Persist semantic IDs only. |
| Package | `KG-04` | resolved | Reveal reviewed public node IDs only. |
| Package | `EXP-04` | resolved | Validate that no discovery ID enters any tour profile. |
| Package | `EXP-05` | resolved | Technical lesson requires an explicitly understood relationship, not mere page load. |

## Implementation Checklist

- [ ] Validated registry with exactly three different discovery kinds.
- [ ] Pure explicit-condition evaluator and no page-load completion.
- [ ] Personal hold/keyboard artifact, technical residue, and relational cross-insight reveal.
- [ ] Semantic persistence with no score/count/collection UI.
- [ ] Tour exclusion, privacy, malformed registry, and reset tests.
- [ ] Browser flow, typecheck, lint, build, evidence, capability, dashboard, and registry reconciliation.

