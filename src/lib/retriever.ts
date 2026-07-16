import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  createEmbeddingRequest,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from './embeddingPolicy'
import { findNearestRagDocuments } from './ragStore'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const DEBUG = process.env.DEBUG_RAG === '1' || process.env.NODE_ENV !== 'production'

export interface RetrievedContextResult {
  context: string
  slugs: string[]
}

export async function fetchContext(query: string, topK = 4): Promise<RetrievedContextResult> {
  const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL }) as any
  if (DEBUG) console.log('[RAG] embed query start', { length: query.length })
  const embRes = await embedModel.embedContent(createEmbeddingRequest(query))
  const queryEmbedding = (embRes as any).embedding?.values as number[]
  if (DEBUG) console.log('[RAG] embed query done', { dims: queryEmbedding?.length })

  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    if (DEBUG) console.warn('[RAG] missing query embedding')
    return { context: '', slugs: [] }
  }

  if (queryEmbedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Expected ${EMBEDDING_DIMENSIONS} embedding dimensions, received ${queryEmbedding.length}`)
  }

  if (DEBUG) console.log('[RAG] firestore vector query')
  const rows = await findNearestRagDocuments(queryEmbedding, 12)
  if (DEBUG) {
    console.log('[RAG] retrieved rows', {
      count: rows.length,
      slugs: rows.slice(0, 6).map(row => row.contentId),
    })
  }
  const top = (rows || []).slice(0, Math.max(0, Math.min(topK, rows?.length || 0)))
  const context = top.map(r => r.content).join('\n\n')
  const slugs = Array.from(new Set(top.map(r => r.contentId).filter(Boolean)))

  if (DEBUG) console.log('[RAG] selected context', { chars: context.length, slugs })
  return { context, slugs }
}


