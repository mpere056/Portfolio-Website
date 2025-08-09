import { supa } from './db'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const DEBUG = process.env.DEBUG_RAG === '1' || process.env.NODE_ENV !== 'production'

export interface RetrievedContextResult {
  context: string
  slugs: string[]
}

export async function fetchContext(query: string, topK = 4): Promise<RetrievedContextResult> {
  const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' }) as any
  if (DEBUG) console.log('[RAG] embed query start', { length: query.length })
  const embRes = await embedModel.embedContent({ content: { parts: [{ text: query }] } })
  const queryEmbedding = (embRes as any).embedding?.values as number[]
  if (DEBUG) console.log('[RAG] embed query done', { dims: queryEmbedding?.length })

  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    if (DEBUG) console.warn('[RAG] missing query embedding')
    return { context: '', slugs: [] }
  }

  if (DEBUG) console.log('[RAG] supabase.rpc(match_docs)')
  const { data, error } = await supa.rpc('match_docs', {
    query_embedding: queryEmbedding,
    match_count: 12
  })
  if (error) {
    if (DEBUG) console.error('[RAG] match_docs error', error)
    throw error
  }

  const rows = (data as any) as Array<{ slug: string; content: string; similarity?: number }>
  if (DEBUG) console.log('[RAG] retrieved rows', { count: rows?.length, slugs: rows?.slice(0, 6)?.map(r => r.slug) })
  const top = (rows || []).slice(0, Math.max(0, Math.min(topK, rows?.length || 0)))
  const context = top.map(r => r.content).join('\n\n')
  const slugs = Array.from(new Set(top.map(r => r.slug).filter(Boolean)))

  if (DEBUG) console.log('[RAG] selected context', { chars: context.length, slugs })
  return { context, slugs }
}


