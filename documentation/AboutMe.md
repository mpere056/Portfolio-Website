# **Specification · About Me Page**

> Historical page specification. Preserve it as implementation history, but use `Comprehensive-Website-Vision.md`, `implementation-plans/06-About-And-Memory-Depth.md`, and the information-architecture decision for current work. In particular, About remains one chronological route with validated event depth; repeated chat CTAs and older framework assumptions are superseded.

*(plus quick-outline for the Projects page)*

---

## 0 Purpose & UX Goals

| Goal              | Detail                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Narrative**     | Give hiring managers a clear, engaging story-arc of Mark’s life, skills, and impact.                                |
| **Interactivity** | Keep users engaged via scroll-snapping sections, inline animations, and “peek-into-project” jumps.                  |
| **Conversion**    | End with an unmistakable **Contact Me** CTA that copies contact details and nudges toward the AI Chat / Projects page. |
| **Performance**   | 60 fps on mid-range mobile; lazy-load heavy media; accessibility compliant.                                         |

---

## 1 Route & Shell

```
/about  (App Router ≥ Next.js 14)
```

* Rendered inside the global layout; no 3-D canvas inheritance from Hero-Cube to keep bundle light.
* `<motion.div ref={scrollRef} class="h-screen overflow-y-scroll snap-y"> … </motion.div>`

---

## 2 Data Model

```ts
// /content/about/1994-born.md
export interface TimelineEntry {
  id: string           // "born"
  from: string         // "1994-08"
  to?: string          // same format; undefined == present
  headline: string     // "Born in Sri Lanka → Canada"
  summary: string      // 1-line card text
  body: MDX            // rich markdown w/ JSX
  media?: {
    type: 'image' | 'video' | '3d'
    src: string        // public/ or remote url
    poster?: string
  }
  projectSlug?: string // deep-link to /projects#story-app
}
```

* Parsed at **build-time** using `next-mdx-remote` or `@next/mdx`.
* Order = chronological ascending; UI reverses for downward scrolling.

---

## 3 Content Draft (MDX Titles & Bullets)

| Year    | Headline                                     | Notes for MDX body                                                      |
| ------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| 1994    | Born 🇱🇰, landed in 🇨🇦                    | Short anecdote about migration + first piano memories.                  |
| 2004    | **Orléans Outstanding Youth Award**          | Add image of certificate; speaks to community impact.                   |
| 2010    | Black-belt + Bronze Medallion                | GIF montage (taekwondo kick, pool lane).                                |
| 2012    | ARCT Diploma 🎹                              | 10-sec piano clip autoplay muted.                                       |
| 2016    | First lines of code → “portal to creativity” | Code GIF + quote from cover letter.                                     |
| 2019    | **Discord utilities** go viral               | Embed Discord screencast (loop). `projectSlug:"discord-utils"`          |
| 2020-22 | CRA empathy training                         | Floating call-center illustration; tooltip “honed conflict-resolution”. |
| 2023    | \$100k GPT-4 mobile-app offer                | Lottie confetti; button “See prototype” links to Projects.              |
| 2024    | B.Sc. Comp Sci 🎓                            | Scroll-triggered mortarboard drop animation.                            |
| 2025    | AI LifeNavigator launch + ARG plan           | Mini 3-D Ottawa map; blinking markers.                                  |
| 2025    | Today                                        | “Coder · Pianist · World-builder” rotating tagline; CTA hires.          |

*(Adjust/expand as more milestones appear.)*

---

## 4 Component-Level Breakdown

### 4.1 `TimelineContainer`

* **Props:** `entries<TimelineEntry[]>`
* CSS: `relative snap-y snap-mandatory overflow-y-scroll h-screen`
* Handles **lazy-render** (`React.lazy`) once section is within 1.25 × viewport.

### 4.2 `TimelineEntry`

| Sub-part         | Tech                                                                                           | Motion                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Card**         | Tailwind card, 80 vw on mobile, 60 vw on ≥ md                                                  | `initial:{opacity:0,y:40}` → `whileInView:{opacity:1,y:0}` |
| **Media**        | `<Image>` (next/image) or inline `<Canvas>` (for 3-D)                                          | Hover tilt (`Motion.one` rotateX/rotateY).                 |
| **Project Peek** | If `projectSlug`, show “Peek” chip → on click `router.push('/projects#'+slug)` + smooth scroll | chip pulses gently with `animate: {scale:[1,1.1,1]}`       |

### 4.3 `HireMeDrawer`

* Trigger button sits after last entry; `position:sticky bottom-12`
* On click → `<motion.dialog>` slides up.
* **Clipboard copy** (`navigator.clipboard.writeText`) with Radix Toast “Copied!”

```json
[
 { label:"Email", value:"marknperera@hotmail.com" },
 { label:"Discord", value:"nipun" },
 { label:"X / Twitter", value:"@nipun056" }
]
```

* Secondary buttons: **Open AI Chat** (`router.push('/chat?prompt=Why%20hire%20Mark')`) and **See Projects**.

---

## 5 Styling & Theming

* **Colour Tokens:**

  * bg-base `#0e0e17`, accent `#8be9fd`, text-primary `#f8f8f2`, highlight `#ff79c6`.
* **Fonts:** `inter` (body) + `jetbrains mono` (code snippets).
* **Dark-only design**; media-prefers-color-scheme → consider lighter alt palette.
* `prefers-reduced-motion`: disable parallax & large transforms.

---

## 6 Interaction & Motion Specs

| Action           | Behaviour                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| Scroll-snap      | Each entry takes 100 vh minus 10 rem padding; wheel/trackpad snaps.          |
| Parallax BG      | Subtle bg gradient shifts (HSL rotate) using `Motion.one` `scrollYProgress`. |
| Inline 3-D       | On hover laptop-pointer devices only; on touch → gyro rotate fallback.       |
| Keyboard Nav     | `<PageUp/PageDown>` or arrow keys scroll to prev/next snap section.          |
| Accessible Names | `aria-label` for every media element; alt text for images.                   |

---

## 7 Performance & Lazy-Loading

* `next/dynamic(() => import('./InlineCanvas'), { ssr:false, loading:()=>null })`
* Video: `preload="metadata"` + compressed `webm`.
* IntersectionObserver threshold = 0.15 to start preloading next media.

---

## 8 Testing & QA

| Layer           | Test                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Unit**        | Snapshot of TimelineEntry render; clipboard function returns correct value.                       |
| **Integration** | Vitest: navigating with router keeps URL hash sync.                                               |
| **E2E**         | Playwright: scroll through all entries on iPhone-12 viewport, ensure HireMeDrawer copies discord. |
| **Perf**        | Lighthouse mobile > 90; total JS < 300 KB first load.                                             |

---

## 9 Extension Hooks

* **Internationalisation** via `next-intl` (future).
* Add “Filter timeline by theme” (Music / Tech / Awards).
* Real-time badge: pulls last GitHub commit datetime through `/api/gh-activity`.

---


### Deliverables

* `/content/about/*.mdx` files populated per section above.
* Components in **components/** folder as specified.
* Ready for incremental adoption; compile, run `npm run dev`, navigate to `/about` — timeline live.

This documentation should be enough for any teammate to pick up and implement the page end-to-end.
