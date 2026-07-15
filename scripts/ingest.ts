/*
 One-off/cron ingestion of MDX content into Supabase pgvector.
*/
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { config as loadEnv } from 'dotenv'
import {
  createEmbeddingRequest,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from '../src/lib/embeddingPolicy'
import { classifyContentPath, deriveContentIdentity } from '../src/lib/contentIds'

// Load env from .env.local (Next-style) and .env (fallback)
const envLocal = path.join(process.cwd(), '.env.local')
const envFile = path.join(process.cwd(), '.env')
if (fsSync.existsSync(envLocal)) loadEnv({ path: envLocal })
if (fsSync.existsSync(envFile)) loadEnv({ path: envFile })

const SUPA_URL = process.env.SUPA_URL || process.env.NEXT_PUBLIC_SUPA_URL
const SUPA_SERVICE_KEY = process.env.SUPA_SERVICE_KEY
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

if (!SUPA_URL || !SUPA_SERVICE_KEY) throw new Error('Missing SUPA_URL or SUPA_SERVICE_KEY')
if (!GOOGLE_API_KEY) throw new Error('Missing GOOGLE_API_KEY')

const supa = createClient(SUPA_URL, SUPA_SERVICE_KEY, { auth: { persistSession: false }})
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')
const CHUNK_WORDS = 400
const OVERLAP_WORDS = 50

function toPlainText(md: string): Promise<string> {
  return remark().use(strip).process(md).then(v => String(v))
}

function deriveCanonicalId(filePath: string, frontmatter: Record<string, unknown>): string {
  const classification = classifyContentPath(filePath)
  if (!classification) throw new Error(`Unsupported content path: ${filePath}`)
  return deriveContentIdentity(classification, frontmatter, filePath).nodeId
}

function extractFrontmatter(raw: string): { front: Record<string, any>, body: string } {
  // naive frontmatter extractor to avoid adding a parser dependency (gray-matter already exists but we keep Edge slim here)
  // ingest runs in Node, so we could use gray-matter; using it for correctness
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const matter = require('gray-matter')
  const parsed = matter(raw)
  return { front: parsed.data || {}, body: parsed.content || '' }
}

function chunkWords(text: string, size = CHUNK_WORDS, overlap = OVERLAP_WORDS): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const out: string[] = []
  for (let i = 0; i < words.length; i += size - overlap) {
    out.push(words.slice(i, i + size).join(' '))
  }
  return out
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL }) as any
  if (typeof model.batchEmbedContents === 'function') {
    const res = await model.batchEmbedContents({
      requests: texts.map(createEmbeddingRequest)
    })
    const vectors = res.embeddings.map((e: any) => e.values as number[])
    assertEmbeddingDimensions(vectors)
    return vectors
  }
  const out: number[][] = []
  for (const t of texts) {
    const res = await model.embedContent(createEmbeddingRequest(t))
    out.push(res.embedding.values as number[])
  }
  assertEmbeddingDimensions(out)
  return out
}

function deriveLegacyIngestionId(filePath: string, frontmatter: Record<string, unknown>) {
  if (typeof frontmatter.slug === 'string' && frontmatter.slug.trim()) return frontmatter.slug.trim()
  return path.basename(filePath).replace(/\.mdx?$/i, '')
}

function assertEmbeddingDimensions(vectors: number[][]) {
  const invalid = vectors.findIndex(vector => vector.length !== EMBEDDING_DIMENSIONS)
  if (invalid !== -1) {
    throw new Error(`Embedding ${invalid} has ${vectors[invalid].length} dimensions; expected ${EMBEDDING_DIMENSIONS}`)
  }
}

async function removeExistingForIds(ids: string[]) {
  const { error } = await supa.from('docs').delete().in('slug', [...new Set(ids)])
  if (error) throw error
}

async function ingestFile(absPath: string, relPath: string) {
  const raw = await fs.readFile(absPath, 'utf8')
  const { front, body } = extractFrontmatter(raw)

  // merge useful frontmatter fields into text so they are retrievable
  const fmPieces: string[] = []
  for (const key of ['name', 'headline', 'summary', 'more-info', 'year']) {
    const v = front[key]
    if (!v) continue
    if (Array.isArray(v)) fmPieces.push(v.join('\n'))
    else fmPieces.push(String(v))
  }

  const plain = await toPlainText([fmPieces.join('\n'), body].filter(Boolean).join('\n\n'))
  const slug = deriveCanonicalId(relPath, front)
  const legacySlug = deriveLegacyIngestionId(relPath, front)

  const slices = chunkWords(plain)
  const vectors = await embedBatch(slices)

  // Generate every vector before replacing the stored slug so API failures cannot erase good rows.
  await removeExistingForIds([slug, legacySlug])
  const rows = slices.map((content, i) => ({
      slug,
      heading: content.slice(0, 80),
      content,
      tokens: content.split(/\s+/).length,
      embedding: vectors[i]
  }))
  const { error } = await supa.from('docs').insert(rows)
  if (error) throw error
  // eslint-disable-next-line no-console
  console.log(`ingested: ${slug} (${slices.length} chunks)`) 
}

async function main() {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true })
  const filePaths: string[] = []
  for (const dirent of entries) {
    const full = path.join(CONTENT_DIR, dirent.name)
    if (dirent.isDirectory()) {
      const inner = await fs.readdir(full)
      for (const name of inner) {
        if (name.endsWith('.md') || name.endsWith('.mdx')) filePaths.push(path.join(dirent.name, name))
      }
    } else if (dirent.isFile() && (dirent.name.endsWith('.md') || dirent.name.endsWith('.mdx'))) {
      filePaths.push(dirent.name)
    }
  }

  for (const relPath of filePaths) {
    const abs = path.join(CONTENT_DIR, relPath)
    await ingestFile(abs, relPath)
  }
  // eslint-disable-next-line no-console
  console.log('ingest complete')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


