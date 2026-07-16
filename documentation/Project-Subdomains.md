# Project Subdomains

Status: current operations plus approved target architecture.

This app supports project sites on subdomains of `marknperera.ca`. They are evolving from standalone microsite pages into canonical flagship project worlds connected to the main portfolio museum.

## Current Routes

| Subdomain | Project |
| --- | --- |
| `dreamlife.marknperera.ca` | Dreamlife |
| `lifeinbox.marknperera.ca` | LifeInbox |
| `sudokutogether.marknperera.ca` | Discord Multiplayer Sudoku Activity |

## How It Works

- `proxy.ts` detects known project subdomains on `marknperera.ca`.
- Matching hosts are internally rewritten to `/sites/[subdomain]`.
- `/sites/[subdomain]` loads the existing MDX project data and renders a standalone microsite page.
- `dreamlife`, `lifeinbox`, and `sudokutogether` currently have bespoke layouts.
- Each site has a blog index at `/blog` and post pages at `/blog/[slug]`.
- Blog posts live in `src/content/sites/[subdomain]/blog/*.mdx`.
- The main portfolio routes continue to live at `marknperera.ca`.
- Dreamlife is the life-design app that generated the six-figure build offer.
- LifeInbox is a separate local-first Android organizer project.

## Target Role

- `/projects` on the main domain is the museum lobby.
- Signal, Approach, and lightweight Handle normally occur in the museum.
- Subdomains normally own substantial Enter and Understand states, project identity/current state, product demonstrations, exploded systems, evidence, and canonical project writing.
- `/projects/[slug]` is the planned stable direct-entry family. Flagship entries transition or redirect to their canonical subdomain.
- Existing `/projects#slug` links remain compatibility inputs until destination aliases and redirects are verified.
- Every project site must return to its exact museum exhibit rather than only the generic portfolio homepage.
- Add `/experience/[id]` or a case-study route only after the state earns independent loading, sharing, browser history, or search value.

## Cross-Subdomain State

Detailed `localStorage` state is separate on each origin. Near-term continuity uses a small non-sensitive cookie scoped to `.marknperera.ca` for approved global preferences, plus validated destination and return parameters. Do not assume apex-domain local storage is readable on project subdomains.

The authoritative policy is `implementation-plans/2026-07-16-Information-Architecture-And-Routing-Decision.md`.

## Deployment Checklist

1. Add each project subdomain to the hosting project.
2. Add the matching CNAME record in Hostinger DNS.
3. Keep `marknperera.ca` and `www.marknperera.ca` pointed at the main portfolio deployment.
4. Add or edit subdomains in `src/lib/projectSites.ts`.
5. Deploy the app after changes to `src/lib/projectSites.ts` or `src/content/projects`.

## Local Testing

The microsites can be tested directly by path:

```bash
http://localhost:3000/sites/lifeinbox
http://localhost:3000/sites/dreamlife
http://localhost:3000/sites/sudokutogether
http://localhost:3000/sites/lifeinbox/blog
http://localhost:3000/sites/dreamlife/blog
http://localhost:3000/sites/sudokutogether/blog
```
