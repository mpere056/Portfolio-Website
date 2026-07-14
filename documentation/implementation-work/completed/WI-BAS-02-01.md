# WI-BAS-02-01: Inventory Authored Content And Routes

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `BAS-02` |
| Capabilities | `CAP-BAS-002` |
| Requirements | `V-11`, `V-19` |
| Outcome | `O-00` |
| Milestone | Reviewed content-node and route inventory with current and missing identifiers made explicit |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

A deterministic inventory enumerates all authored project, About, miscellaneous, and subdomain-blog content; reports identifier sources, loader and ingestion coverage, routes, collisions, and missing identifiers; has focused automated tests; and is summarized in a reviewed durable baseline without modifying authored content.

## Resume Packet

### Current Truth

- State in one sentence: The deterministic content and route inventory is complete, tested, reviewed, and recorded with three accepted evidence items.
- Works now: The scanner and CLI classify all 39 nodes, preserve runtime and AI identity, derive destinations, and report structural errors and known gaps in stable order.
- Incomplete or stubbed: Stable-ID policy, shared recursive loading, and validated graph schemas remain downstream packages.
- Safe exposure: Platform tooling and documentation only; no visitor-facing behavior or authored claims change.

### Known-Good Point

- Commit: `a88e2907388e1faf10a271ac1286ed0f910972fc` plus the `BAS-02` implementation commit
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`
- Verification command: Portable-Node `npm run inventory:content`, `npm test`, and `npm run build`.
- Verification result: 39 nodes and 0 structural errors; 2 test files and 5 tests passed; 24 of 24 static pages generated.
- Route/preview: Existing production routes remain unchanged.
- Feature flags: None.
- Browser/test data: Repository-authored public content only.

### Restart Here

- Next exact action: Create `WI-BAS-04-01` and verify the current runtime compatibility constraints before selecting an upgrade path.
- First files/symbols: `package.json`, `package-lock.json`, `next.config.mjs`, Vercel settings, and `BAS-01` runtime evidence.
- Expected observable result: A recorded stay/upgrade decision with compatible version boundaries and isolated verification steps.
- Only after that: Run `BAS-05`, then begin `ARC-01` from this inventory.

### Context That Must Survive

- Decisions and rejected alternatives: Inventory raw authored metadata rather than assigning stable IDs; `ARC-01` owns namespaced ID and rename policy.
- Assumptions still unproven: Miscellaneous files without frontmatter are intentional corpus nodes, and nested blog posts should later join AI ingestion.
- Relevant plan sections: `03-Knowledge-Graph-And-Content.md`, `13-Execution-Work-Packages.md`, and `15-Capability-Coverage-Ledger.md`.
- Evidence: `EV-BAS-02-01` through `EV-BAS-02-03`.
- Known failures or traps: Four miscellaneous files appear to have no frontmatter identifiers; the current ingestion traversal skips nested site blogs.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated and must remain unstaged.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `BAS-01` | resolved | Technical baseline and verification commands exist |
| Package | `ARC-01` | downstream | Do not assign or rename stable IDs inside this inventory package |
| Package | `KG-01` | downstream | Record loader parity gaps without repairing ingestion here |

## Implementation Checklist

- [x] Inspect current content folders, loaders, route consumers, and ingestion traversal.
- [x] Implement deterministic inventory and validation logic.
- [x] Add a read-only report command.
- [x] Add fixture tests and a repository content-integrity test.
- [x] Review and document current identifiers, collisions, routes, and loader gaps.
- [x] Run full tests and production build.
- [x] Reconcile capability, evidence, dashboard, registry, and package state.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `src/content/` | Authored corpus across four candidate categories | inspected |
| `src/lib/projects.ts` | Project runtime loader and slug source | inspected |
| `src/lib/timeline.ts` | About runtime loader and ID source | inspected |
| `src/lib/siteBlogs.ts` | Nested subdomain-blog loader and slug fallback | inspected |
| `scripts/ingest.ts` | Current AI-corpus traversal and slug derivation | inspected |
| `src/lib/projectSites.ts` | Project-subdomain registry and route mapping | inspected |

## Open Questions

- Whether every miscellaneous corpus file should receive a stable authored ID is intentionally deferred to `ARC-01`; `BAS-02` will report the four missing identifiers.

## Updates

### 2026-07-14 - Content inventory started

- State: ready -> in-progress
- Changed: Created the resumable work item and bounded inventory, testing, and documentation scope.
- Verified: Current loaders cover projects, About, and subdomain blogs; current AI ingestion excludes nested blog content.
- Remaining: Inventory utility, CLI, tests, reviewed baseline, evidence, and tracking reconciliation.
- Decision: Report raw identity and coverage; do not assign IDs or fix loader parity in this package.
- Next: Implement deterministic inventory logic and fixture tests.
- Commit: uncommitted

### 2026-07-14 - Content inventory accepted

- State: in-progress -> done
- Changed: Added deterministic inventory/validation tooling, Markdown and JSON CLI output, 3 focused tests, the reviewed baseline, and package evidence.
- Verified: 39 nodes, 0 structural errors, 2 test files/5 tests passing, and 24/24 static pages generated.
- Remaining: Stable IDs (`ARC-01`), recursive loader parity (`KG-01`), and shared schemas (`KG-02`).
- Decision: Preserve all detected gaps as explicit handoffs rather than changing authored content or ingestion in the baseline package.
- Next: Create the `BAS-04` runtime compatibility work item.
- Commit: `BAS-02` implementation commit

## Completion Summary

- Final result: All authored content categories, identities, loaders, retrieval coverage, and destinations are reproducibly inventoried in `documentation/implementation-baselines/2026-07-14-Content-Inventory.md`.
- Capability states changed: `CAP-BAS-002` moved from `unassessed` to `verified`; all dimensions are accepted.
- Evidence IDs: `EV-BAS-02-01`, `EV-BAS-02-02`, `EV-BAS-02-03`.
- Remaining work moved to: `ARC-01`, `KG-01`, and `KG-02`.
- Final commit/deployment: `BAS-02` implementation commit; no deployment required because behavior is read-only tooling and documentation.
- Closed by and date: Codex, 2026-07-14.
