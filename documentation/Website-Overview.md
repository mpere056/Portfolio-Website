Below is a **bird-eye technical blueprint** for the complete portfolio, from entry cube to AI chat, written so you (or any collaborator) can jump straight into scaffolding.

---

## 1 Core Stack & Tooling

| Layer                   | Choices                                                                              | Rationale                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Framework**           | **Next.js 14 / App Router** (React 18 + server & client components)                  | Fast refresh, file-system routing, built-in API routes, effortless Vercel deploy, SSR/SSG for SEO-critical pages (About). |
| **3-D / WebGL**         | **React-Three-Fiber + drei + three-stdlib**                                          | Declarative Three.js; matches your cube snippet.                                                                          |
| **Animation**           | **@motionone/react (a.k.a. Motion by Framer)** + **Framer Motion 11**                | Motion One for low-level CSS/WAAPI, FM11 for scroll-trigger and layout animations.                                        |
| **Styling**             | **Tailwind CSS (via twin.macro) + CSS variables**                                    | Rapid utility styling, theme tokens, media queries baked-in.                                                              |
| **State / Data**        | **Zustand** (UI state), **MDX** or **YAML** data files for timeline & projects       | Light global store; MDX lets you embed JSX/3-D per timeline node.                                                         |
| **Serverless Back-end** | Vercel Functions (Edge Runtime) + **OpenAI SDK** + **Supabase pgvector**             | Low-latency chat endpoint with RAG on your docs.                                                                          |
| **Misc Dev Ops**        | ESLint + Prettier, Vitest + React-testing-library, Playwright e2e, GitHub Actions CI | Quality gate before Vercel auto-deploy.                                                                                   |

---

## 2 Routing & Page Shell

```
/
 ├─ (home)            – HeroCube.tsx (no scroll)
 ├─ /about            – Timeline.tsx  (scrollable)
 ├─ /projects         – Projects.tsx  (scrollable)
 ├─ /chat             – Chat.tsx      (full height)
 ├─ /api/chat         – ChatHandler.ts (edge function)
 └─ /_app / layout.ts – shared nav, theming, meta
```

* `layout.tsx` sets global `<Canvas>` context **once** with R3F root and framer-motion `<LazyMotion features={domAnimation}>`.
* **Responsive breakpoints** (md, lg, 2xl) driven by Tailwind classes; `useMediaQuery()` for JS fallbacks (e.g., disable hover effects on touch).

---

## 3 Hero Cube Screen (Landing)

| Element           | Implementation notes                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R3F Canvas**    | Wrap your provided `Cubes` component.  Disable `OrbitControls` on mobile (`pointerFine` check).                                                                         |
| **UI Overlay**    | Four Motion-powered `<Button>`s (`About`, `Projects`, `AI Chat`, `Hire Me`) → absolute-positioned around cube; `whileHover` scale + glow; enter page via `router.push`. |
| **Perf**          | Use `<Suspense fallback={null}>` + `useGLTF.preload` to lazy-load nothing else on this page; keep bundle < 150 KB first-visit.                                          |
| **Accessibility** | Provide keyboard focus ring & `onKeyDown={(e)=>e.key==='Enter'&&router.push('/about')}`.                                                                                |

---

## 4 About Me Page

### 4.1 Content Model

```ts
type TimelineEntry = {
  id: string
  year: string
  title: string
  body: MDX
  media?: {
    type: 'image' | 'video' | '3d'
    src: string
  }
  projectSlug?: string  // deep-link to /projects#slug
}
```

Store as `/content/about/*.mdx` → parsed at build time.

### 4.2 UI & Motion

* Vertical `div` with `overflow-y-scroll snap-y snap-mandatory`.
* Each entry is a `motion.section` that fades/slides in (`viewport={{ once:true, amount:0.4 }}`).
* **Graphics hook**: if `media.type==='3d'`, render an inline `<Canvas>` with small R3F scene (e.g., piano model).
* **Hire Me Drawer**: fixed CTA at page end → `motion.dialog` (Headless UI) listing email / Discord / X; click icon copies via `navigator.clipboard.writeText` + toast (`@radix-ui/react-toast`).

---

## 5 Projects Page

### 5.1 Top Carousel

* `react-wrap-balancer` + `framer-motion` `whileHover` tilt for cards.
* On click → `scrollIntoView({behavior:'smooth'})` to project section `#slug`.

### 5.2 Project Section Template

```
<motion.section id={slug} class="h-screen flex flex-col md:flex-row items-center">
   <ProjectModel />   // 3-D object (R3F Canvas with orbit-disabled)
   <motion.div> ...details / media... </motion.div>
</motion.section>
```

* **Model Interactivity**

  * `useMousePosition` converts pointer to rotation quaternion (`lerp` easing).
  * Click toggles `expanded` state via Zustand; `AnimatePresence` shifts model `x:-40vw` and slides in details pane.

### 5.3 Data

```ts
type Project = {
  slug: string
  name: string
  summary: string
  tech: string[]
  media: { type:'gif'|'video'|'interactive'; src:string }
  model: () => Promise<GLTF>
}
```

MDX or JSON; keep heavy media lazy-loaded via `next/dynamic`.

---

## 6 AI Chat Page

| Piece                       | Detail                                                                                                      |                                                                                                                                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI**                      | Chat bubble list (Radix ScrollArea) + input at bottom; streaming tokens with SSE or fetch `ReadableStream`. |                                                                                                                                                                                                                                          |
| **API Route** (`/api/chat`) | → Edge Function (D1 runtime)                                                                                | 1. Embed question (`text-embedding-3-small`). 2. K-NN search in Supabase `pgvector` against your timeline, projects, cover-letter docs. 3. Build prompt “You are Mark’s PA…” 4. Call OpenAI `chat.completions`. 5. Stream response back. |
| **Security**                | Rate-limit by IP (`upstash/ratelimit`) 30 req/min. Hide API key with Vercel env vars.                       |                                                                                                                                                                                                                                          |
| **Free-tier friendly**      | Cache vector search results in `Edge KV` for repeated Q-A.                                                  |                                                                                                                                                                                                                                          |

---

## 7 Global Concerns

* **SEO & Meta** – `next/metadata` with OG images (`@vercel/og`); prerender `/about` & `/projects`.
* **Responsive** – Tailwind’s `sm: md: lg:` plus `useResizeObserver` to down-scale 3-D samples on mobile (lower poly, shadows off).
* **Accessibility** – All interactive elements keyboardable, ARIA labels for buttons, colour-contrast via Tailwind token palette.
* **Performance budget** – 3-D assets ≤ 2 MB gzipped; code-split R3F heavy components with `next/dynamic` `ssr:false`.
* **Analytics** – Vercel Web Analytics (no cookies) + custom event for Hire Me clicks.
* **Testing** – Vitest snapshots for components, Playwright script verifying hire-me copy, chat endpoint happy path.

---

## 8 Folder Structure (suggested)

```
src/
 ├─ components/
 │    ├─ HeroCube.tsx
 │    ├─ NavButton.tsx
 │    ├─ TimelineEntry.tsx
 │    ├─ ProjectCard.tsx
 │    ├─ ProjectModel.tsx
 │    └─ ChatUI.tsx
 ├─ pages/          // (or app/ if using app router)
 ├─ lib/
 │    ├─ embeddings.ts
 │    ├─ clipboard.ts
 │    └─ store.ts        (zustand)
 ├─ content/
 │    ├─ about/*.mdx
 │    └─ projects/*.mdx
 └─ styles/ (tailwind.css, globals.css)
```

---

### Ready to Build

With this skeleton you can:

1. `npx create-next-app -e with-tailwindcss mark-portfolio`
2. Add R3F cube code into `HeroCube.tsx`.
3. Scaffold MDX content & layouts.
4. Wire the `/api/chat` edge route.

Everything else (deploy → Vercel, custom domain, SSL) will be plug-and-play once the repo hooks to Vercel.
