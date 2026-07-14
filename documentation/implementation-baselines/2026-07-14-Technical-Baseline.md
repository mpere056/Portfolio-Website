# Technical Baseline - 2026-07-14

## Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-01` Technical baseline |
| Capability | `CAP-BAS-001` |
| Baseline code commit | `c924104d4785e152245570d1d3c219a579a65cf0` |
| Branch | `main`, aligned with `origin/main` before baseline documentation |
| Operating system | Windows |
| Node.js | `20.20.2` |
| npm | `10.8.2` |
| Next.js | `14.2.3` |
| Build result | Passed |
| Test result | Passed with warnings |

The worktree also contained unrelated pre-existing changes in `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/`. They were not edited, reverted, or staged by `BAS-01`. The build therefore represents the named commit plus those explicitly disclosed local changes.

## Reproduction

The portable Node directory must be prepended to `PATH` so npm child processes can resolve `node`.

```powershell
$env:PATH=(Resolve-Path '.tools\node').Path+';'+$env:PATH
& '.tools\node\npm.cmd' run build
& '.tools\node\npm.cmd' test
```

Without that `PATH` adjustment, direct `npx` child execution reports that `node` is not recognized.

## Resolved Dependency Baseline

| System | Resolved version |
| --- | --- |
| React / React DOM | `18.3.1` |
| React Three Fiber | `8.18.0` |
| Drei | `9.122.0` |
| React Three Postprocessing | `2.19.1` |
| Three.js | `0.164.1` |
| Framer Motion | `11.18.2` |
| Vercel AI SDK | `3.4.33` |
| Google Generative AI | `0.12.0` |
| Supabase JS | `2.54.0` |
| Zustand | `4.5.7` |
| TypeScript | `5.9.2` |
| Vitest | `2.1.9` |
| ESLint | `8.57.1` |

The declared engine remains `>=18.17 <21`. Runtime compatibility and upgrade decisions belong to `BAS-04`.

## Production Build

The production build completed successfully in approximately 46 seconds on this machine.

- Compilation: passed.
- Type checking: passed.
- Static generation: 24 of 24 pages generated.
- Build traces: passed.
- `.next` total size: `239.38 MiB`.
- `.next/static` size: `2.92 MiB`.
- Shared first-load JavaScript: `87.2 kB`.
- Middleware bundle: `26.9 kB`.

### Route Output

| Route | Rendering | Route size | First-load JS |
| --- | --- | ---: | ---: |
| `/` | Static | `89.8 kB` | `445 kB` |
| `/about` | Static | `9.4 kB` | `355 kB` |
| `/chat` | Static | `18 kB` | `367 kB` |
| `/demo` | Static | `7.82 kB` | `325 kB` |
| `/projects` | Static | `12.6 kB` | `396 kB` |
| `/sites/[site]` | SSG | `2.04 kB` | `319 kB` |
| `/sites/[site]/blog` | SSG | `169 B` | `87.3 kB` |
| `/sites/[site]/blog/[slug]` | SSG | `169 B` | `87.3 kB` |
| `/templates` | Static | `6.96 kB` | `94.1 kB` |
| `/templates/saas-1` | Static | `3.83 kB` | `127 kB` |
| Other template routes | Static | `169-329 B` | `87.3-92.6 kB` |
| `/api/chat` | Dynamic | `0 B` | `0 B` |
| `/api/rag/diag` | Dynamic | `0 B` | `0 B` |

The largest generated JavaScript chunk is `655.6 KiB` on disk. Home, Projects, Chat, and About are the first routes that need bundle and runtime investigation before adding more always-loaded experience code.

## Build And Lint Warnings

The build and standalone lint step report the same eight lint warnings:

| Location | Warning |
| --- | --- |
| `src/app/demo/page.tsx:68` | `useMemo` is missing `scaleMultiplier` |
| `src/components/about-addons/target/TargetAddon.tsx:187` | `useCallback` has unnecessary `gameState` dependency |
| `src/components/ChatOrb.tsx:123` | `useMemo` is missing `isThinking` and `tint` |
| `src/components/GlobalAudio.tsx:54` | `useEffect` is missing `isMuted` |
| `src/components/ProjectsAudioVisualizer.tsx:220` | `useEffect` is missing `camera` |
| `src/components/templates/TemplateGym.tsx:130` | Unoptimized `<img>` |
| `src/components/templates/TemplateGym.tsx:182` | Unoptimized `<img>` |
| `src/components/templates/TemplateGym.tsx:262` | Unoptimized `<img>` |

Additional warnings:

- Edge runtime usage disables static generation for the affected page.
- Vitest reports that Vite's CJS Node API build is deprecated.

These warnings do not fail the current build. They are baseline debt, not silently accepted future standards.

## Automated Tests

`npm test` completed successfully.

- Lint: passed with the eight warnings above.
- Test files: `1` passed.
- Tests: `2` passed.
- Test duration: `720 ms`.
- Existing coverage: retrieval behavior for empty Supabase results and concatenated context with unique slugs.

The current automated suite does not cover routes, middleware, project sites, content loaders, 3D interactions, audio, or persistence.

## Static Asset Baseline

| Public category | Files | Total size |
| --- | ---: | ---: |
| Models | 88 | `103.76 MiB` |
| Images | 45 | `91.85 MiB` |
| Audio | 12 | `30.41 MiB` |
| **Total** | **145** | **226.02 MiB** |

### Model Groups

| Group | Files | Total size |
| --- | ---: | ---: |
| `portrait` | 23 | `35.75 MiB` |
| `grand_piano` | 13 | `20.47 MiB` |
| `dino` | 4 | `17.72 MiB` |
| `game_mod` | 11 | `7.62 MiB` |
| `sudoku` | 5 | `4.87 MiB` |
| `ebloxx` | 2 | `4.09 MiB` |
| `discord_sync_messaging` | 5 | `3.89 MiB` |
| `story_app` | 6 | `3.71 MiB` |
| `life_app` | 3 | `1.25 MiB` |
| `life_app_scene` | 2 | `1.09 MiB` |
| `group_finder` | 4 | `1.01 MiB` |
| `discord_bot` | 5 | `0.74 MiB` |
| `kitsune` | 4 | `0.69 MiB` |

The model directory also contains a top-level `0.85 MiB` FBX file.

### Largest Public Files

| Size | File |
| ---: | --- |
| `14.82 MiB` | `public/models/portrait/sitting.blend` |
| `9.47 MiB` | `public/audio/placeholder.mp3` |
| `8.21 MiB` | `public/images/fitness/cardio.jpg` |
| `7.41 MiB` | `public/audio/home_page.mp3` |
| `6.54 MiB` | `public/images/fitness/sour-moha-_cUZkx0wTyM-unsplash.jpg` |
| `6.19 MiB` | `public/models/dino/textures/material_baseColor.jpeg` |
| `6.03 MiB` | `public/models/dino/textures/Skull_baseColor.jpeg` |
| `5.49 MiB` | `public/models/dino/scene.bin` |
| `4.75 MiB` | `public/audio/projects.mp3` |
| `4.70 MiB` | `public/images/pinterest.png` |

Source and duplicate files currently exposed under `public/` include the `14.82 MiB` Blender file, a `0.85 MiB` FBX file, and `4.33 MiB` of audio files marked `(old)`. They should be reviewed before performance budgets are established.

## Asset Reference Integrity

All nine authored project `heroModel` values have corresponding model directories. Four literal project-gallery media references do not currently resolve to files under `public/`:

- `/images/life-navigator.jpg`
- `/images/discord-sync-demo.gif`
- `/images/group-finder-screenshot.png`
- `/images/story-app-screens.png`

The production build does not validate these runtime content paths, so build success does not prove all authored media exists.

## Route And Domain Baseline

Middleware rewrites recognized subdomains to `/sites/{subdomain}` while excluding API, Next.js assets, images, models, and audio.

| Public URL | HTTP | Final behavior | Single-request time |
| --- | ---: | --- | ---: |
| `https://marknperera.ca/` | `200` | Redirects to `https://www.marknperera.ca/` | `2.194 s` |
| `https://lifeinbox.marknperera.ca/` | `200` | LifeInbox title and distinct project content | `0.652 s` |
| `https://sudokutogether.marknperera.ca/` | `200` | Sudoku Together title and distinct project content | `0.755 s` |
| `https://dreamlife.marknperera.ca/` | `200` | Dreamlife title and distinct project content | `0.687 s` |

These are one-time connectivity samples, not latency benchmarks.

## Runtime Configuration Surface

The code references these environment variables:

- `GOOGLE_API_KEY`
- `DEBUG_RAG`
- `NEXT_PUBLIC_SUPA_URL`
- `NEXT_PUBLIC_SUPA_ANON_KEY`
- `SUPA_URL`
- `SUPA_SERVICE_KEY`
- `NODE_ENV`

Values were not read or recorded.

## Measurements Not Yet Reproducible

The current repository has no repeatable browser harness for:

- Home frame time or frame rate.
- Cold and warm 3D model load time.
- JavaScript heap after Home, Projects, About, and AI navigation.
- Global AI idle runtime cost.
- Vercel build duration from deployment records.

These remain explicit gaps for `QA-01` and `QA-04`. They do not block `BAS-01` because the package's required build, routes, warnings, models, tests, and live-domain evidence are complete.

## Baseline Conclusions

- The application is buildable and deployable in its current state.
- The existing automated suite is healthy but very narrow.
- First-load JavaScript is already substantial on the core experiential routes.
- Static media volume is high and includes likely non-deployment source or duplicate files.
- Four authored project media paths are missing without causing build failure.
- Runtime upgrades, warning fixes, asset optimization, and browser performance instrumentation should remain separate focused work rather than being mixed into the first experience feature.
