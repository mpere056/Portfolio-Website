Below is a **step-by-step “starter kit”** that plugs Supabase + pgvector into the Chat UI you already have, uses **Google’s embedding model** for retrieval, and sends the final prompt to **Gemini 2.5-flash**—all inside a Vercel Edge Function.

---

## 0 Folder map

```
/scripts/ingest.ts          ← one-off (or cron) loader
/lib/db.ts              ← Supabase client helper
/lib/retriever.ts       ← similarity + MMR
/api/chat/route.ts
```

---

## 1 Set up Supabase with pgvector

1. **Create a free project** → “Database” tab → Enable **Extensions → pgvector**.
2. Run this SQL in the web console:

```sql
create table docs (
  id uuid primary key default gen_random_uuid(),
  slug text,
  heading text,
  content text,
  tokens int,
  embedding vector(768)   -- 768 dims for Google embeddings
);

-- HNSW index (fast for ≤ 1M vectors)
create index on docs using hnsw (embedding vector_l2_ops);

-- RPC helper for similarity search (qualified column refs to avoid ambiguity)
create or replace function match_docs(query_embedding vector, match_count int default 10)
returns table (
  id uuid, slug text, heading text, content text, similarity float
) language plpgsql as $$
begin
  return query
  select d.id as id,
         d.slug as slug,
         d.heading as heading,
         d.content as content,
         1 - (d.embedding <-> query_embedding) as similarity
  from docs as d
  order by d.embedding <-> query_embedding
  limit match_count;
end; $$;
```

3. Grab **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`** (service key lets your ingest script write; you’ll use the anon key for read-only in Edge).

---

## 2 Ingest your MDX into vectors

```ts
// scripts/ingest.ts
import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import remark from 'remark'
import strip from 'strip-markdown'

const supa = createClient(process.env.SUPA_URL!, process.env.SUPA_SERVICE_KEY!, { auth: { persistSession: false }})
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const CHUNK = 400
const OVERLAP = 50

function chunk(text: string) {
  const words = text.split(/\s+/)
  const chunks = []
  for (let i = 0; i < words.length; i += CHUNK - OVERLAP)
    chunks.push(words.slice(i, i + CHUNK).join(' '))
  return chunks
}

async function embed(texts: string[]) {
  const res = await genAI.embedContent({
    model: 'textembedding-gecko',
    content: texts.map(t => ({ parts: [{ text: t }] }))
  } as any)
  return res.embeddings.map((e: any) => e.values as number[])
}

async function main() {
  const files = await fs.readdir('./content', { recursive: true })
  for (const file of files.filter(f => f.endsWith('.mdx'))) {
    const md = await fs.readFile(path.join('./content', file), 'utf8')
    const plain = String(await remark().use(strip).process(md))
    const slices = chunk(plain)
    const vectors = await embed(slices)
    const slug = file.replace('.mdx','')
    for (let i = 0; i < slices.length; i++) {
      await supa.from('docs').insert({
        slug,
        heading: slices[i].slice(0,80),
        content: slices[i],
        tokens: slices[i].split(/\s+/).length,
        embedding: vectors[i]
      })
    }
  }
  console.log('ingest complete')
}
main()
```

```bash
SUPA_URL=... SUPA_SERVICE_KEY=... GOOGLE_API_KEY=... \
node scripts/ingest.ts
```

*You’ll likely store < 5 000 vectors—well within the free 500 MB.*

---

## 3 Shared helpers

```ts
// src/lib/db.ts
import { createClient } from '@supabase/supabase-js'
export const supa = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_ANON_KEY!,
  { auth: { persistSession: false } }
)
```

```ts
// src/lib/retriever.ts
import { supa } from './db'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mmr from '@langchain/community/retrievers/mmr'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function fetchContext(query: string, topK = 4) {
  const emb = await genAI.embedContent({
    model: 'textembedding-gecko',
    content: [{ parts: [{ text: query }]}]
  } as any)
  const { data } = await supa.rpc('match_docs', {
    query_embedding: emb.embeddings[0].values,
    match_count: 12
  })
  const texts = data?.map((d: any) => d.content) ?? []
  return mmr(query, texts, topK).join('\n\n')
}
```

---

## 4 Edge chat route (Gemini + RAG)

```ts
// src/app/api/chat/route.ts
import { StreamingTextResponse, Message } from 'ai'
import { GoogleGenerativeAI, GoogleGenerativeAIStream } from 'ai'
import { fetchContext } from '@/lib/retriever'

export const runtime = 'edge'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const SYSTEM = (ctx: string) => `
You are Mark Perera’s portfolio assistant.
Answer in first person and cite project slugs in parentheses when relevant.
If asked about your own stack, explain Supabase pgvector + Gemini RAG briefly.

CONTEXT:
${ctx}
`

const toGeminiHistory = (msgs: Message[]) => ({
  contents: msgs.filter(m=>m.role!=='system').map(m=>({
    role: m.role==='user'?'user':'model',
    parts:[{text:m.content}]
  }))
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  const userPrompt = messages[messages.length - 1].content
  const context = await fetchContext(userPrompt)

  const stream = await genAI
    .getGenerativeModel({ model: 'gemini-2.5-flash' })
    .generateContentStream({
      ...toGeminiHistory(messages),
      system_instruction: { role:'system', parts:[{text: SYSTEM(context)}] }
    })

  return new StreamingTextResponse(GoogleGenerativeAIStream(stream))
}
```

---

## 5 Environment variables (`.env.local`)

```
GOOGLE_API_KEY=***
NEXT_PUBLIC_SUPA_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPA_ANON_KEY=***
SUPA_SERVICE_KEY=***            # only for ingest script
```

---

## 6 Deploy steps

1. **Run `pnpm run ingest`** locally or in a GitHub Action to populate vectors.
2. Commit code; push to GitHub.
3. Connect project to Vercel → set env vars.
4. Vercel automatically deploys. `/api/chat` now streams Gemini answers with in-context citations.

---

### Storage format recap

| Column      | Example value                          |
| ----------- | -------------------------------------- |
| `slug`      | `story-app`                            |
| `heading`   | `"AI-driven mobile adventure creator"` |
| `content`   | sliced 400-token plain-text chunk      |
| `embedding` | 768-length `vector`                    |

Each chunk is self-contained, so retrieval grabs only what Gemini needs.

---

#### Testing

*Ask*: **What was your experience with the app you got a \$100k offer with?**
*Expected*: Answer summarises Story-App chunk(s) and ends with “(story-app)”.

*Ask*: **How does this chatbot work?**
*Expected*: Mentions “Supabase pgvector retrieval plus Gemini streaming,” cites “ai-stack” (create a short MDX file describing your stack so the answer is grounded).

---

That’s the complete integration: free Supabase DB, zero-cost Vercel Edge, Google embeddings for retrieval, Gemini for generation, and your existing React chat UI untouched.
