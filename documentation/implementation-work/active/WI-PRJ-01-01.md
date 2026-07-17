# WI-PRJ-01-01: Establish The Shared Exhibit Foundation

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `PRJ-01` |
| Capabilities | `CAP-PRJ-001`, `CAP-PRJ-002` |
| Requirements | `V-10`, `V-14` |
| Outcome | `O-03` |
| Owner | Codex |
| Last update | 2026-07-17 |

## Acceptance

Every authored project resolves to one validated exhibit definition and stable museum anchor; the three flagship definitions can load a small project manifest lazily; unknown, missing, and failed experience modules preserve useful project copy and canonical navigation through a shared fallback shell; unit and integration tests cover registry validity, lazy loading, and direct links without replacing the current `/projects` presentation prematurely.

## Current State

- The shared depth, destination, graph-query, persistence, and lifecycle contracts are accepted Phase 2 inputs.
- The existing `/projects` client owns wheel navigation, audio, cards, eager 3D sections, and expanded overlays in one component.
- Current project frontmatter carries canonical graph identity plus selected experience, capability, timeline, and post relationships, but `getProjects()` does not yet expose those fields.
- Implementation is intentionally additive until the new contract and fallback behavior pass their gates.

## Resume Packet

- Last completed checkpoint: audited the current project loader, destination registry, graph queries, project subdomains, legacy museum UI, and Phase 3 package dependencies.
- Current checkpoint: implement the typed exhibit contract and canonical registry builder.
- Next exact action: expose validated project graph metadata, then add exhibit registry validation and direct-link resolution.
- Files in scope: `src/lib/projects.ts`, `src/lib/museum/*`, `src/components/museum/*`, `tests/museum*.test.*`, and the Phase 3 tracking documents.
- Do not touch: unrelated local changes in `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, or `.tools/`.
- Decision boundary: `PRJ-01` supplies Signal/Approach-capable infrastructure only; candidate product interactions and first-flagship selection remain `PRJ-02`.

## Verification Queue

- Focused museum unit and integration tests.
- Existing destination and content-loader regression tests.
- ESLint, strict TypeScript, content validation, and production build.
