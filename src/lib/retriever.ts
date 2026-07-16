import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  createEmbeddingRequest,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from './embeddingPolicy'
import { findNearestRagDocuments } from './ragStore'
import type { RagDocument } from './ragStore'
import { isNodeId, type NodeId } from './portfolioContracts'
import { loadKnowledgeGraphQueries, type PublicSourceDescriptor } from './content/queries'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const DEBUG = process.env.DEBUG_RAG === '1' || process.env.NODE_ENV !== 'production'

export interface RetrievedContextResult {
  context: string
  slugs: string[]
  sources: PublicSourceDescriptor[]
}

export interface RetrievalContextOptions {
  nodeId?: string
}

export interface ValidatedRetrievalContext {
  nodeId: NodeId
  relatedNodeIds: ReadonlySet<NodeId>
}

let graphQueriesPromise: ReturnType<typeof loadKnowledgeGraphQueries> | undefined

async function resolveRetrievalContext(nodeId: string | undefined) {
  if (!nodeId || !isNodeId(nodeId)) return undefined
  graphQueriesPromise ??= loadKnowledgeGraphQueries()
  const queries = await graphQueriesPromise
  const neighborhood = queries.getAIContextSubgraph(nodeId, {
    maxDepth: 1,
    nodeLimit: 8,
    relationshipLimit: 12,
  })
  if (!neighborhood.centerNode) return undefined
  return {
    nodeId,
    relatedNodeIds: new Set(neighborhood.nodes.map(node => node.id).filter(id => id !== nodeId)),
  } satisfies ValidatedRetrievalContext
}

export function rerankRagDocuments(
  rows: readonly RagDocument[],
  context: ValidatedRetrievalContext | undefined,
) {
  if (!context) return [...rows]
  return rows
    .map((row, index) => {
      const rowNodeId = row.nodeId ?? (isNodeId(row.contentId) ? row.contentId : undefined)
      const exact = rowNodeId === context.nodeId || row.projectId === context.nodeId
      const related = Boolean(
        (rowNodeId && context.relatedNodeIds.has(rowNodeId))
        || row.relatedNodeIds.some(id => id === context.nodeId),
      )
      const boost = exact ? 2 : related ? 1 : 0
      return { row, index, boost, adjustedRank: Math.max(0, index - boost) }
    })
    .sort((left, right) => (
      left.adjustedRank - right.adjustedRank
      || right.boost - left.boost
      || left.index - right.index
    ))
    .map(item => item.row)
}

export async function fetchContext(
  query: string,
  topK = 4,
  options: RetrievalContextOptions = {},
): Promise<RetrievedContextResult> {
  const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL }) as any
  if (DEBUG) console.log('[RAG] embed query start', { length: query.length })
  const embRes = await embedModel.embedContent(createEmbeddingRequest(query))
  const queryEmbedding = (embRes as any).embedding?.values as number[]
  if (DEBUG) console.log('[RAG] embed query done', { dims: queryEmbedding?.length })

  if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
    if (DEBUG) console.warn('[RAG] missing query embedding')
    return { context: '', slugs: [], sources: [] }
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
  const retrievalContext = await resolveRetrievalContext(options.nodeId)
  const rankedRows = rerankRagDocuments(rows || [], retrievalContext)
  const top = rankedRows.slice(0, Math.max(0, Math.min(topK, rankedRows.length)))
  const context = top.map(r => r.content).join('\n\n')
  const slugs = Array.from(new Set(top.map(r => r.contentId).filter(Boolean)))
  let sources: PublicSourceDescriptor[] = []
  if (slugs.length) {
    graphQueriesPromise ??= loadKnowledgeGraphQueries()
    const queries = await graphQueriesPromise
    sources = slugs
      .filter(isNodeId)
      .map(nodeId => queries.getPublicSourceDescriptor(nodeId))
      .filter((source): source is PublicSourceDescriptor => Boolean(source))
  }

  if (DEBUG) console.log('[RAG] selected context', { chars: context.length, slugs })
  return { context, slugs, sources }
}


