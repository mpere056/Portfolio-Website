# Project Subdomains

This app supports project microsites on subdomains of `marknperera.ca`.

## Current Routes

| Subdomain | Project |
| --- | --- |
| `lifeinbox.marknperera.ca` | AI Life Navigator |
| `sudokutogether.marknperera.ca` | Discord Multiplayer Sudoku Activity |

## How It Works

- `middleware.ts` detects known project subdomains on `marknperera.ca`.
- Matching hosts are internally rewritten to `/sites/[subdomain]`.
- `/sites/[subdomain]` loads the existing MDX project data and renders a standalone microsite page.
- `lifeinbox` and `sudokutogether` currently have bespoke layouts.
- Each site has a blog index at `/blog` and post pages at `/blog/[slug]`.
- Blog posts live in `src/content/sites/[subdomain]/blog/*.mdx`.
- The main portfolio routes continue to live at `marknperera.ca`.

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
http://localhost:3000/sites/sudokutogether
http://localhost:3000/sites/lifeinbox/blog
http://localhost:3000/sites/sudokutogether/blog
```
