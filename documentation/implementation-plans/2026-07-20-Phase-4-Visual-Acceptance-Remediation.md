# Phase 4 Visual Acceptance Remediation

Date: 2026-07-20
Package: `ART-11`
Work item: `WI-ART-11-01`
Status: local candidate; Production verification and Mark acceptance remain

## Why Acceptance Reopened

The first Phase 4 production promotion proved routes, fallbacks, lifecycle policy, and renderer safety, but it did not prove that the dynamics were perceptible or that the Project Museum worked as one composed world. Mark's production screenshots showed two concrete failures:

- the Museum introduction and signal ecology occupied separate vertical regions, so seeing all nine projects required page scrolling;
- the standalone Dreamlife, LifeInbox, and Sudoku Together landing surfaces still used a flattened artwork treatment, leaving the new route-specific dynamics effectively invisible.

`EV-ART-11-02` remains valid deployment evidence but is not creative acceptance evidence.

## Corrective Composition

### Project Museum

- Treat the desktop lobby as one `100svh` instrument with no document scroll.
- Place the title as an edge inscription over the ecology instead of a separate hero section.
- Keep all nine project signals inside the visible field with non-overlapping hit regions.
- Make pointer proximity alter aperture, membrane, particles, signal intensity, and reviewed graph filaments immediately.
- Open increasing depth as a contained overlay. The outer museum remains fixed; only legitimately longer depth material may scroll vertically inside the chamber.
- Never allow horizontal chamber scrolling.

### Project Worlds

- Replace the subdomain hero's single flattened artwork treatment with one route-owned `ProjectWorldScene` layer system.
- Dreamlife uses refracted fragments, orbit paths, and future-prism displacement.
- LifeInbox uses a receiving vessel, converging return paths, and independently gathering particles.
- Sudoku Together uses an addressable grid, moving row/column focus, and synchronization paths.
- Pointer position drives independent layer displacement and semantic focus; ambient SVG/particle motion continues only when visible and motion is allowed.
- Reduced-motion and hidden-page states settle every continuous layer while preserving the complete still composition.

## Acceptance Matrix

| Surface | Automated proof | Browser proof | Creative gate |
| --- | --- | --- | --- |
| Project Museum lobby | scene model and SSR signal assertions | document height equals viewport height; nine signals visible; zero overlapping hit regions | Mark reviews deployed density, legibility, and exploration feel |
| Museum response | bounded frame and proximity tests | hovered signal changes aperture, energy, drift, and graph response | Mark confirms response is clearly perceptible but not noisy |
| Museum depth | route/stage tests | fixed outer document; contained vertical overflow; no horizontal scrollbar | Mark reviews increasing-depth transition |
| Dreamlife world | route marker and deterministic frame tests | pointer changes refraction variables | Mark reviews future-prism identity |
| LifeInbox world | route marker and deterministic frame tests | pointer changes vessel/material variables | Mark reviews receiving-system identity |
| Sudoku world | route marker, row/column, and deterministic frame tests | pointer changes addressed grid cell and layer variables | Mark reviews shared-puzzle identity |

## Resume Point

The local candidate passes content validation, TypeScript, zero-error lint, all 48 test files/193 tests, the 35-page production build, and desktop browser geometry/interaction checks. Next: commit and deploy the exact candidate, repeat the public matrix, then request Mark's visual acceptance. Do not mark Phase 4 creatively complete from deployment health alone.
