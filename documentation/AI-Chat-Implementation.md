## AI Chat — Implementation Plan (Gemini + Supabase RAG)

### Objectives
- **Answer portfolio questions with facts from MDX** in `src/content/projects` and `src/content/about` using retrieval-augmented generation.
- **Keep the existing UI** (`src/components/ChatUI.tsx`) and **stream responses** from the Edge route `src/app/api/chat/route.ts`.

### High-level architecture
- **Storage**: Supabase Postgres with `pgvector` and the `docs` table + `match_docs` RPC (already created).
- **Ingest**: One-off script to parse and chunk MDX, create embeddings with Google, and insert into Supabase.
- **Retrieval**: Edge-safe helper that embeds the user query, calls `match_docs`, then applies MMR to pick diverse, relevant chunks.
- **Generation**: Gemini 2.5 Flash with a concise system prompt that a) uses retrieved context, b) speaks in first person, and c) cites project slugs in parentheses.

---

### 1) Data ingestion (one-time + whenever MDX changes)
- **New file**: `scripts/ingest.ts`.
  - Read all `*.mdx` under `src/content/projects` and `src/content/about`.
  - Extract frontmatter and body:
    - **slug**: use frontmatter `slug` if present (e.g., projects). If absent (e.g., about timeline), derive from filename (e.g., `2013-programming.mdx` → `2013-programming`) or prefix with `about-` if you want to visually distinguish.
    - **heading**: prefer frontmatter `headline` or `name`; fallback to the first ~80 characters of the plain text.
    - **content**: convert MDX to plain text (strip markdown; include frontmatter fields like `summary`/`more-info` inline).
  - **Chunking**: ~400-word chunks with ~50-word overlap (tunable). Track a `tokens`/word-count for reference.
  - **Embeddings**: Google embeddings model (use `textembedding-gecko` or `text-embedding-004` if required by your API key/version).
  - **Upsert strategy**: before inserting for a given `slug`, delete existing rows for that `slug` to keep the index clean, then insert all chunks.
  - **Environment**: uses `SUPA_URL`, `SUPA_SERVICE_KEY`, `GOOGLE_API_KEY`. The service key is only used here (never in Edge/client).
  - **Run**: add a package script to execute the ingest via a TS runner (e.g., `tsx`), then run it locally whenever content changes or as a CI job.

Dependencies to add for ingest:
- `@supabase/supabase-js` (server/client library)
- `remark` and `strip-markdown` (MDX → plain text)
- a TS runner (e.g., `tsx`) for running `scripts/ingest.ts` without a build step

---

### 2) Shared helpers (Edge-safe)
- **New file**: `src/lib/db.ts`
  - Export a Supabase client constructed with `NEXT_PUBLIC_SUPA_URL` and `NEXT_PUBLIC_SUPA_ANON_KEY`.
- **New file**: `src/lib/retriever.ts`
  - Export `fetchContext(query: string, topK = 4)` that:
    - Creates a query embedding via Google.
    - Calls `supa.rpc('match_docs', { query_embedding, match_count: 12 })`.
    - Applies MMR to select diverse top `topK` chunks.
    - Returns the concatenated context string (and optionally a set of contributing `slugs` for analytics/UI).

Notes:
- Use a minimal MMR implementation or a light utility to avoid bloating the Edge bundle. If using a third-party helper, ensure it’s Edge-compatible.

---

### 3) Chat route upgrade (RAG + persona)
- **File**: `src/app/api/chat/route.ts` (already streaming Gemini).
- Update POST handler to:
  - Extract the user’s latest message and call `fetchContext`.
  - Build a short `SYSTEM` message that:
    - Introduces you as Mark’s portfolio assistant in first person.
    - Explains you ground answers in retrieved context.
    - Instructs: when referencing projects/timeline items, **cite the related slug in parentheses** (e.g., `(story-app)`).
    - If the answer isn’t grounded by context, say you don’t have enough information.
  - Convert chat history to Gemini format, attach `system_instruction`, and stream.
  - On retrieval failure, gracefully fall back to non-RAG streaming with a brief disclaimer.

Environment required at runtime:
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_SUPA_URL`, `NEXT_PUBLIC_SUPA_ANON_KEY`

---

### 4) UI adjustments (optional but recommended)
- **File**: `src/components/ChatUI.tsx`
  - Add the example prompt: “How does this AI chatbot work?”
  - Add a subtle hint beneath the input: “Answers may cite sources like (story-app).”
  - Optionally style any trailing `(slug)` tokens in assistant messages as small source chips and link to `/projects/[slug]` when it exists.

No breaking UI changes required; `useChat()` already targets `/api/chat`.

---

### 5) Content grounding additions
- Create a short MDX that explicitly describes your AI stack so “How does this chatbot work?” can be grounded and cited, e.g. `src/content/projects/ai-stack.mdx` with slug `ai-stack` (or place under `about/`).
- Ensure project/timeline MDX frontmatter includes informative `headline`/`summary` so retrieval captures key facts.

---

### 6) Environment & scripts
- Ensure `.env.local` contains:
  - `GOOGLE_API_KEY`
  - `NEXT_PUBLIC_SUPA_URL`
  - `NEXT_PUBLIC_SUPA_ANON_KEY`
  - `SUPA_SERVICE_KEY` (ingest only)
- Add a package script to run ingestion (e.g., `pnpm run ingest`).
- Optional CI: a GitHub Action that re-runs ingestion when files under `src/content/**` change.

---

### 7) Security & performance
- Service key is used only in `scripts/ingest.ts` (local/CI). The Edge route uses the anon key and read-only RPC.
- Retrieval is capped (`match_count: 5`, `topK: 4`) to keep prompts compact and latency low.
- Consider trimming the final concatenated context to a fixed character/token budget if needed.

---

### 8) Testing—what “good” looks like
- “What are your most impressive projects?”
  - Summarizes highlights from `projects` MDX; cites relevant slugs (e.g., `(story-app)`, `(discord-sync-messaging)`).
- “What was your experience with the app you got a $100k offer with?”
  - Pulls from `story-app` MDX; cites `(story-app)`.
- “Tell me about your journey into coding.”
  - Synthesizes timeline MDX from `about/`; cites one or more timeline slugs derived from filenames (e.g., `(2013-programming)`).
- “How does this AI chatbot work, what technology did you use to build it?”
  - Explains Supabase pgvector retrieval + Gemini streaming; cites `(ai-stack)`.

Acceptance criteria:
- Answers are grounded and coherent; include at least one `(slug)` when appropriate.
- Latency acceptable for Edge (~0.5–1.5s to first token after warm start).
- No service key used in Edge/client; no PII leakage.

---

### 9) Rollout
1) Add dependencies and scripts as noted above.
2) Implement `scripts/ingest.ts`, `src/lib/db.ts`, and `src/lib/retriever.ts`.
3) Upgrade the chat route to include `SYSTEM` + RAG.
4) Add the `ai-stack` MDX.
5) Run ingestion locally, verify rows in Supabase (`docs` table populated; RPC returns results for test queries).
6) Test locally with the four prompts and verify citations.
7) Deploy to Vercel; set env vars; retest.

---

### 10) Stretch enhancements (later)
- Display a dedicated “Sources” section below each assistant reply using the collected `slugs` from retrieval.
- Cache top query embeddings in Supabase to reduce repeated embedding calls for common prompts.
- Add telemetry for retrieved slugs and response quality to iteratively tune chunk size/topK.
