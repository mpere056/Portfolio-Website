# Stable Content ID Decision

Date: 2026-07-14
Status: Confirmed and in implementation
Package: `ARC-01`
Capability: `CAP-ARC-001`

## Decision

Portfolio content uses canonical namespaced IDs that are independent from display labels, array positions, filenames, and routes:

| Content | Canonical format | Example |
| --- | --- | --- |
| Project | `project:{id}` | `project:dreamlife` |
| Timeline event | `timeline:{id}` | `timeline:piano-start` |
| Miscellaneous knowledge | `misc:{id}` | `misc:music-info` |
| Project post | `post:{site}:{id}` | `post:lifeinbox:local-first-capture-needs-trust` |

Every segment is lowercase ASCII kebab-case. Cross-namespace reuse is valid, so `project:dreamlife` and `timeline:dreamlife` identify different nodes.

## Rename Policy

- A published canonical ID remains stable when its label, filename, route, or project branding changes.
- A genuine identity replacement adds an explicit one-way alias from the legacy value to a canonical ID.
- Alias targets must already be valid canonical IDs; aliases cannot point to another alias.
- Unknown IDs resolve to no result rather than being guessed or normalized silently.
- An alias remains while persisted state, inbound links, retrieval rows, or external consumers may still use it. Removal requires migration evidence and a reviewed release.
- Client-provided IDs are always resolved and validated before data or navigation is returned.

## Current Migration Boundary

The initial implementation provides the ID constructors, validators, alias resolution, inventory integration, and tests. It does not silently rewrite authored content.

Remaining corpus work is explicit:

- One miscellaneous record still uses a filename fallback because the user's separately edited `ai-productivity-system.mdx` remains outside this commit.
- The existing retrieval corpus still contains 36 bare legacy IDs and must be re-indexed; the ingestion migration removes canonical and legacy rows together only after replacement vectors exist.
- Three nested project blog posts are not traversed by the current AI ingestion script.
- Destination, experience, discovery, and relationship IDs remain owned by `ARC-02` and `ARC-03` after content identity stabilizes.

## Alternatives Rejected

- Bare global slugs, because `dreamlife` already exists in more than one content namespace.
- Filename-derived identity, because files and chronology labels can change.
- Route-derived identity, because canonical routes and subdomains will evolve.
- Automatic lowercase or slug normalization, because silent transformations can merge distinct published identifiers.

## Consequences

- Loaders, graph compilation, retrieval, destinations, persistence, and AI context can converge on one content identity contract.
- Existing route slugs remain presentation and routing fields; they do not become the only graph identity.
- The format is expensive to change after persistence and deep links ship, so future namespaces require an explicit decision and migration.

## Implementation

- `src/lib/contentIds.ts`
- `src/lib/contentInventory.ts`
- `tests/contentIds.test.ts`
- `tests/contentInventory.test.ts`

This decision is reversible only through an explicit versioned migration once canonical IDs reach production consumers.
