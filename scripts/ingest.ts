/*
 One-off/cron ingestion of MDX content into Cloud Firestore vector documents.
*/
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { FieldValue } from '@google-cloud/firestore'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { config as loadEnv } from 'dotenv'
import { glob } from 'glob'
import {
  createEmbeddingRequest,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from '../src/lib/embeddingPolicy'
import { classifyContentPath, deriveContentIdentity } from '../src/lib/contentIds'
import {
  createRagDocumentId,
  getFirestore,
  RAG_COLLECTION,
} from '../src/lib/ragStore'

const envLocal = path.join(process.cwd(), '.env.local')
const envFile = path.join(process.cwd(), '.env')
if (fsSync.existsSync(envLocal)) loadEnv({ path: envLocal })
if (fsSync.existsSync(envFile)) loadEnv({ path: envFile })

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
if (!GOOGLE_API_KEY) throw new Error('Missing GOOGLE_API_KEY')

const firestore = getFirestore()
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')
const CHUNK_WORDS = 400
const OVERLAP_WORDS = 50

function toPlainText(md: string): Promise<string> {
  return remark().use(strip).process(md).then(value => String(value))
}

function deriveCanonicalId(filePath: string, frontmatter: Record<string, unknown>): string {
  const classification = classifyContentPath(filePath)
  if (!classification) throw new Error(`Unsupported content path: ${filePath}`)
  return deriveContentIdentity(classification, frontmatter, filePath).nodeId
}

function extractFrontmatter(raw: string): { front: Record<string, unknown>; body: string } {
  const matter = require('gray-matter')
  const parsed = matter(raw)
  return { front: parsed.data || {}, body: parsed.content || '' }
}

function chunkWords(text: string, size = CHUNK_WORDS, overlap = OVERLAP_WORDS): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const output: string[] = []
  for (let index = 0; index < words.length; index += size - overlap) {
    output.push(words.slice(index, index + size).join(' '))
  }
  return output
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL }) as any
  if (typeof model.batchEmbedContents === 'function') {
    const response = await model.batchEmbedContents({
      requests: texts.map(createEmbeddingRequest),
    })
    const vectors = response.embeddings.map((embedding: any) => embedding.values as number[])
    assertEmbeddingDimensions(vectors)
    return vectors
  }

  const output: number[][] = []
  for (const text of texts) {
    const response = await model.embedContent(createEmbeddingRequest(text))
    output.push(response.embedding.values as number[])
  }
  assertEmbeddingDimensions(output)
  return output
}

function deriveLegacyIngestionId(filePath: string, frontmatter: Record<string, unknown>) {
  if (typeof frontmatter.slug === 'string' && frontmatter.slug.trim()) {
    return frontmatter.slug.trim()
  }
  return path.basename(filePath).replace(/\.mdx?$/i, '')
}

function assertEmbeddingDimensions(vectors: number[][]) {
  const invalid = vectors.findIndex(vector => vector.length !== EMBEDDING_DIMENSIONS)
  if (invalid !== -1) {
    throw new Error(
      `Embedding ${invalid} has ${vectors[invalid].length} dimensions; expected ${EMBEDDING_DIMENSIONS}`,
    )
  }
}

async function replaceContentDocuments(
  contentId: string,
  legacyContentId: string,
  sourcePath: string,
  slices: string[],
  vectors: number[][],
) {
  const collection = firestore.collection(RAG_COLLECTION)
  const ids = [...new Set([contentId, legacyContentId])]
  const existing = await collection.where('contentId', 'in', ids).get()
  const batch = firestore.batch()

  existing.docs.forEach(document => batch.delete(document.ref))
  slices.forEach((content, chunkIndex) => {
    const reference = collection.doc(createRagDocumentId(contentId, chunkIndex))
    batch.set(reference, {
      contentId,
      heading: content.slice(0, 80),
      content,
      tokens: content.split(/\s+/).length,
      chunkIndex,
      sourcePath: sourcePath.replace(/\\/g, '/'),
      embedding: FieldValue.vector(vectors[chunkIndex]),
    })
  })

  await batch.commit()
}

async function ingestFile(absolutePath: string, relativePath: string) {
  const raw = await fs.readFile(absolutePath, 'utf8')
  const { front, body } = extractFrontmatter(raw)
  const frontmatterText: string[] = []

  for (const key of ['name', 'headline', 'summary', 'more-info', 'year']) {
    const value = front[key]
    if (!value) continue
    frontmatterText.push(Array.isArray(value) ? value.join('\n') : String(value))
  }

  const plain = await toPlainText([frontmatterText.join('\n'), body].filter(Boolean).join('\n\n'))
  const contentId = deriveCanonicalId(relativePath, front)
  const legacyContentId = deriveLegacyIngestionId(relativePath, front)
  const slices = chunkWords(plain)
  const vectors = await embedBatch(slices)

  // Every vector exists before the atomic Firestore batch replaces prior chunks.
  await replaceContentDocuments(
    contentId,
    legacyContentId,
    relativePath,
    slices,
    vectors,
  )
  console.log(`ingested: ${contentId} (${slices.length} chunks)`)
}

async function main() {
  const filePaths = (await glob(['**/*.md', '**/*.mdx'], { cwd: CONTENT_DIR, nodir: true }))
    .map(filePath => filePath.replace(/\\/g, '/'))
    .sort((left, right) => left.localeCompare(right))

  for (const relativePath of filePaths) {
    await ingestFile(path.join(CONTENT_DIR, relativePath), relativePath)
  }
  console.log('ingest complete')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
