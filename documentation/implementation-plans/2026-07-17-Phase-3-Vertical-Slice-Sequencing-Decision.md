# Phase 3 Vertical-Slice Sequencing Decision

Date: 2026-07-17
Status: approved after `PRJ-01` implementation
Requirements: `V-01`, `V-03`, `V-04`, `V-10`, `V-14`, `V-15`, `V-17`, `V-18`, `V-19`
Packages: `PRJ-02`, `PRJ-03`, `AI-04`, `LPS-06`, `PRJ-04`, `QA-02`

## Context

`PRJ-01` proved that all nine projects can derive one canonical exhibit definition from authored project content and registered destinations. It also established three lazy flagship manifests, Signal/Approach-only stage truth, a graph-backed server adapter, and a semantic fallback shell without replacing the current `/projects` client.

That implementation exposed two planning risks:

- Requiring portfolio-wide lifecycle classification before the first flagship would turn one vertical slice into a nine-project content gate.
- Treating route/history integration as one late package would leave the selected flagship without a bounded museum-to-subdomain path, while pulling all generalized route work into `PRJ-04` would make the slice too broad.

## Decision

Phase 3 uses six bounded convergence packages in this order:

1. `PRJ-02` gives LifeInbox and Sudoku Together equal deterministic feasibility spikes and records one selection.
2. `PRJ-03` integrates the accepted registry into a feature-flagged museum Signal/Approach path while preserving the legacy route as rollback.
3. `LPS-06` records only the selected flagship's reviewed lifecycle and minimum current/final state needed for truthful Approach and Understand copy.
4. `AI-04` produces validated archive cards in two internal increments: card contract/validation first, selected-destination transition second.
5. `PRJ-04` converges the selected interaction, museum entry, selected-project subdomain handoff, one exploded layer, evidence, state, AI card, persistence, and fallbacks.
6. `QA-02` accepts or rejects the complete slice through deterministic, browser, visual, performance, stimulation, creative, and live Preview gates.

`PRJ-02` and `PRJ-03` are both dependency-ready after `PRJ-01`, but the one-active-code-package WIP rule still applies. Candidate selection runs first so identity and navigation work can test the selected product's needs without beginning two flagship implementations.

## Living-State Boundary

`LPS-06` is a narrow selected-project state seed, not a shortcut around review:

- Mark confirms one lifecycle value after `PRJ-02` selects the candidate.
- The record uses the accepted `LPS-01` schema and contains only lifecycle-required public sections.
- Unknown facts remain absent rather than inferred from Git activity or repository age.
- Portfolio-wide classification remains `LPS-02`; all three full flagship records remain `LPS-03`.

This removes broad editorial work from the first-slice critical path without allowing the selected exhibit to make stale or invented current-state claims.

## Route And State Boundary

`PRJ-04` may implement the minimum selected-project journey using existing canonical destination IDs and subdomains:

- `/projects` owns Signal and Approach.
- Handle may remain in the museum when lightweight.
- Enter normally performs a full-document transition to the selected canonical subdomain.
- The handoff carries only validated requested depth, return destination, and an authored scenario key when needed.
- Detailed puzzle edits, capture text, camera state, and other transient demo state are never cross-origin URL state.

`PRJ-08` still owns generalized `/projects/[slug]` routes, all-project metadata/canonical rules, compatibility redirects, reusable URL/history encoding, and cross-subdomain continuity across the full museum.

## AI Card Boundary

`AI-04` does not allow the model to author routes or arbitrary state. The server returns source node IDs, a registered destination ID, and bounded safe state; the client re-resolves and validates all fields before rendering or navigating.

The first accepted card must open an exact selected-flagship state. Expanded archive composition and `/chat` migration remain `AI-05` scope.

## Legacy Migration Boundary

`ProjectsClient`, `ProjectCard`, `ProjectSection`, existing models, audio, and scroll behavior remain the rollback path during `PRJ-03` and early `PRJ-04`.

The new path must:

- Load `loadMuseumExhibits()` on the server.
- Render through the `museumV2` flag.
- Preserve exact current project anchors.
- Use the semantic fallback when registry, graph, 3D, or project modules fail.
- Avoid loading every flagship interaction bundle from the lobby.
- Remove or archive legacy orchestration only after `QA-02` and a separate production promotion decision.

## Consequences

- The first flagship remains a true vertical slice without requiring nine-project editorial completion.
- Route responsibilities are split between the minimum selected journey and later generalized integration.
- AI card work can proceed without inventing a second destination format.
- The legacy project page remains a reliable rollback while new museum behavior earns promotion.
- Phase 4 begins from learned, accepted infrastructure rather than re-defining the registry already delivered by `PRJ-01`.

## Revisit Conditions

Revisit this decision only if:

- Both candidate spikes fail the truthful-product or feasibility gates.
- The selected product cannot support a useful synthetic local demonstration.
- A cross-subdomain transition demonstrably damages the selected experience enough to justify a documented in-place exception.
- `QA-02` finds that the shared shell forces project interactions into an identical visual or behavioral pattern.
