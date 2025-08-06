# **Specification · Projects Page**

*(mirrors depth of the About-Me spec so a teammate can build the whole experience end-to-end)*

---

## 0 Purpose & UX Objectives

| Goal             | Detail                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **Showcase**     | Demonstrate breadth & depth of Mark’s technical + creative work with immersive 3-D hooks and rich media.        |
| **Way-finding**  | Let visitors skim top-level carousel, jump directly to what interests them, and return easily.                  |
| **Storytelling** | Pair each project’s “hero object” with concise results-oriented copy and optional interactive demo.             |
| **Conversion**   | Provide at-project CTAs (“See code”, “Live demo”, “Ask AI about this project”) and a sticky **Hire Me** button. |
| **Performance**  | Keep first contentful paint < 2.5 s mobile; lazy-load gltf models and any videos.                              |

---

## 1 Route & Shell

```
/projects     // Next.js App Router page
```

* Shares root layout (`app/layout.tsx`); **independent R3F canvas per project section** to isolate GPU load.
* Full-height scroll container with `snap-y snap-mandatory` for predictable transitions.

---

## 2 Data Model

```ts
// /content/projects/story-app.mdx
export interface ProjectDoc {
  slug: string            // "story-app"
  name: string            // "Interactive Story Generator"
  year: string            // "2023"
  headline: string        // one-liner under carousel card
  summary: string         // short paragraph in details pane
  responsibilities: string[]  // bullets
  results: string[]           // quant or qualitative wins
  tech: string[]              // ["Flutter", "GPT-4", "Firebase"]
  heroModel: () => Promise<GLTF | JSX> // dynamic import; or null for image
  media: {
    type: 'gif' | 'video' | 'image' | 'iframe'
    src: string
    poster?: string         // for video
  }[]
  repoUrl?: string
  liveUrl?: string
}
```

* Authored in MDX so you can embed `<TechChip>` or inline `<a>` tags in copy.
* During `next build` MDX is transformed; heavy `heroModel` stays dynamically imported on client only (`ssr:false`).

---

## 3 Content Draft – Suggested Projects

| slug               | Name                                  | Hero object concept                          | Notable hooks                                   |
| ------------------ | ------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| **story-app**      | Interactive Story Generator           | Pop-up book model; pages flip based on mouse | \$100k build offer proof; QR-code to demo video |
| **life-navigator** | AI Life Design Assistant              | Neon holographic dashboard; BPM-synced pulse | Live Figma link; screencast 30 s                |
| **discord-utils**  | Discord Utilities Suite               | Floating Discord logo shards orbiting        | Animated GIF of rapid message sequencing        |
| **idle-slime**     | Idle Slime Factory (Discord Activity) | Low-poly slime miner + crystals              | Playable iframe embed w/ demo token             |
| **arg-engine**     | Ottawa ARG Engine                     | Mini Ottawa skyline w/ glowing clue beacons  | Trailer video; link to signup form              |
| **piano-vfx**      | Blender Piano Visualizer Pack         | Transparent piano mesh w/ particle trail     | 10-sec MP4; Download Blender file               |

*(Adjust list & assets as portfolio evolves.)*

---

## 4 Top Carousel (Hero Deck)

### 4.1 Behaviour

* Horizontal overflow (`snap-x`), each card width ≈ 80 vw (mobile 90 vw).
* **Motion**: `whileHover:{rotateX:-3, rotateY:3, scale:1.05}` desktop only.
* On click → `scrollIntoView('#'+slug, {behavior:'smooth'})`. Highlight active bullet in sidebar progress bar.

### 4.2 Card Mark-up

```tsx
<motion.article class="relative flex-shrink-0">
   <NextImage ... />   // fallback screenshot or hero model canvas overlay
   <motion.h3 ... />
   <TechChipLoop tech={tech} />
</motion.article>
```

* Preload first 2 images/models only (`priority` prop).

---

## 5 Project Section Template

```
<section id={slug} class="project-block snap-start h-screen flex flex-col md:flex-row items-center">
   <aside class="model-zone relative w-full md:w-1/2 h-1/2 md:h-full">
        <Suspense fallback={<SkeletonCube/>}>
            <ProjectModel slug={slug}/>
        </Suspense>
   </aside>

   <motion.div class="detail-pane w-full md:w-1/2 p-6">
        <ProjectCopy {...data} />
   </motion.div>
</section>
```
// internally calls useGLTF('/models/story-app/scene.gltf')

### 5.1 Interactions

| Action             | Logic                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Mouse Tilt**     | `usePointer()` maps to `rotateX/rotateY` via `easing.lerp`. Disables on `pointerCoarse`.                                                                           |
| **Expand Details** | Click model (or “Learn more” button) toggles Zustand `expandedSlug`. `AnimatePresence` translates model `x:-40vw`, width of detail pane grows to `100%` on mobile. |
| **Collapse**       | Click gray overlay or “Close” in pane; resets state.                                                                                                               |

### 5.2 Detail Pane Content

* Headline + year badge
* Rich MDX summary (accepts `<Link>` to repo/live)
* Results bullet list (green check icons)
* Tech chips (color-coded)
* **Mini CTA Row** — “View Code”, “Launch Demo”, “Ask Mark-Bot” (`router.push('/chat?prompt=Tell%20me%20about%20'+name)`)

---

## 6 Styling & Theme Tokens

| Token          | Value (dark) | Notes                          |
| -------------- | ------------ | ------------------------------ |
| `--bg-surface` | `#0b0b12`    | carousel + sections background |
| `--card-bg`    | `#13131f`    | hover cards, detail pane       |
| `--accent`     | `#66d9ef`    | tech chips                     |
| `--highlight`  | `#ffb86c`    | CTA icons                      |
| `--success`    | `#50fa7b`    | results ticks                  |

Fonts inherit from global (Inter + JetBrains Mono).

---

## 7 Motion & Scroll Effects

| Effect                  | Library                                                             | Spec                                                                    |
| ----------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Scroll progress bar** | Motion One `scrollTimeline`                                         | Right-side 4 px bar fills as user scrolls; section-enter event updates. |
| **Section fade-bg**     | Framer `useScroll` + CSS variable                                   | BG hue rotates 10° every section to separate visually.                  |
| **Model parallax**      | R3F + GSAP fallback                                                 | Model `translateZ` slight oscillation based on `scrollY`.               |
| **Carousel card knit**  | Motion `layout="position"` for natural shuffle when screen resizes. |                                                                         |

---

## 8 Accessibility

* Carousel ARIA role `region` with keyboard navigation (`←/→` keys).
* Models have `aria-label` describing scene (“Rotating holographic dashboard of app interface”).
* Focus-order ensures detail pane content receives focus after expand.
* Colour-contrast meets WCAG AA against bg tokens.

---

## 9 Performance Optimisation

| Asset                     | Optimisation                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **.gltf Models**            | Compress mesh (Draco), use Three.js, serve .gltf + .bin + textures from /public/models; preload via useGLTF.preload(); dispose on unmount.js                                                 |
| **Videos**                | `webm` + `mp4`, served via `<video preload="metadata" muted playsInline loop>`; poster image until in view. |
| **Images**                | Next.js `<Image>` with `blurDataURL`.                                                                       |
| **Code-splitting**        | `dynamic(() => import('../models/ArgEngine'),{ssr:false})` per project.                                     |
| **Intersection prefetch** | Preload next model when 75 % from viewport.                                                                 |

---

## 10 Testing Matrix

| Test Type       | Scenario                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Unit**        | `ProjectModel` renders chosen gltf; `TechChip` displays correct colour.                                                            |
| **Integration** | Clicking carousel card scrolls to matching section; collapse/expand round-trip.                                                   |
| **E2E**         | Playwright mobile + desktop: 1) open site, 2) scroll all projects, 3) open detail, 4) copy GitHub link, 5) lighthouse score ≥ 90. |
| **Visual**      | Chromatic snapshots for each section at 320 px, 768 px, 1280 px widths.                                                           |

---

## 11 Global Elements on Projects Page

* **Sticky Return Button** bottom-right (`⌘K` / `Ctrl K` triggers global command palette).
* **Persistent Hire-Me Floating CTA** — only visible after scrolling past first section, uses `motion.div` slide-in.
* **Analytics Events** — `analytics.track('project_expand', {slug})` and `… 'cta_click'`.

---

## 12 Extension Ideas

* **Live Demo Embeds** – `iframe` sandbox for Story-App, Idle-Slime.
* **Toggle “Code View”** – reveals syntax-highlighted snippet overlay (PrismJS).
* **Badge Earned** – If visitor opens ≥ 4 projects, toast “Explorer badge unlocked” and store in localStorage (arg Easter-egg tie-in).

---

## 13 Folder Structure Additions

```
src/
 ├─ components/
 │    ├─ Carousel.tsx
 │    ├─ ProjectSection.tsx
 │    ├─ TechChip.tsx
 │    └─ ModelLoader.tsx
 ├─ models/           // dynamic imports, each file exports a React component that wraps useGLTF
 │    ├─ StoryBookModel.tsx
 │    └─ HoloDashModel.tsx
 ├─ content/projects/ // MDX docs
 └─ lib/
      └─ scrollStore.ts (zustand)
```

---

## 14 Implementation Roadmap (1-Sprint)

1. **1** – Build Carousel scaffold + dummy data.
2. **2** – Implement ProjectSection layout, zustand state, expand/collapse flows.
3. **3** – Integrate first gltf model, tilt & parallax hooks.
4. **4** – Wire CTAs: code links, AI chat deep-link.
5. **5** – Optimise + test (Lighthouse, Playwright). Push to Vercel preview.

---

Deliver the MDX docs, models, and components per this spec and the Projects page will be launch-ready, fully aligned with the overall portfolio architecture.
