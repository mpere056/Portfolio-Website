import { Firestore } from '@google-cloud/firestore'
import { isNodeId, type NodeId } from './portfolioContracts'

export const RAG_COLLECTION = 'rag_docs'

export function createRagDocumentId(contentId: string, chunkIndex: number): string {
  return `${encodeURIComponent(contentId)}--${chunkIndex}`
}

export interface RagDocument {
  contentId: string
  heading: string
  content: string
  tokens: number
  chunkIndex: number
  sourcePath: string
  distance?: number
  nodeId?: NodeId
  nodeType?: string
  projectId?: NodeId
  relatedNodeIds: readonly NodeId[]
  visibility?: 'public'
}

interface FirestoreVectorSnapshot {
  docs: Array<{ data(): Record<string, unknown> }>
}

interface FirestoreVectorCollection {
  findNearest(options: {
    vectorField: string
    queryVector: number[]
    limit: number
    distanceMeasure: 'EUCLIDEAN'
    distanceResultField: string
  }): { get(): Promise<FirestoreVectorSnapshot> }
}

interface FirestoreVectorClient {
  collection(name: string): FirestoreVectorCollection
}

export interface FirebaseServerConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

type FirebaseServerEnvironment = Readonly<Record<string, string | undefined>>;

export function readFirebaseServerConfig(
  env: FirebaseServerEnvironment = process.env as FirebaseServerEnvironment,
): FirebaseServerConfig {
  const projectId = env.FIREBASE_PROJECT_ID?.trim()
  const clientEmail = env.FIREBASE_CLIENT_EMAIL?.trim()
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY',
    )
  }

  return { projectId, clientEmail, privateKey }
}

let firestore: Firestore | undefined

export function getFirestore(): Firestore {
  if (firestore) return firestore

  const config = readFirebaseServerConfig()
  firestore = new Firestore({
    projectId: config.projectId,
    credentials: {
      client_email: config.clientEmail,
      private_key: config.privateKey,
    },
  })

  return firestore
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function asNodeId(value: unknown): NodeId | undefined {
  return typeof value === 'string' && isNodeId(value) ? value : undefined
}

function asNodeIds(value: unknown): NodeId[] {
  return Array.isArray(value)
    ? value.filter((item): item is NodeId => typeof item === 'string' && isNodeId(item))
    : []
}

export async function queryNearestRagDocuments(
  db: FirestoreVectorClient,
  queryVector: number[],
  limit = 12,
): Promise<RagDocument[]> {
  const snapshot = await db
    .collection(RAG_COLLECTION)
    .findNearest({
      vectorField: 'embedding',
      queryVector,
      limit,
      distanceMeasure: 'EUCLIDEAN',
      distanceResultField: 'distance',
    })
    .get()

  return snapshot.docs.map(document => {
    const data = document.data()
    const contentId = asString(data.contentId)
    const nodeId = asNodeId(data.nodeId) ?? asNodeId(contentId)
    const projectId = asNodeId(data.projectId)
    return {
      contentId,
      heading: asString(data.heading),
      content: asString(data.content),
      tokens: asNumber(data.tokens),
      chunkIndex: asNumber(data.chunkIndex),
      sourcePath: asString(data.sourcePath),
      distance: asNumber(data.distance),
      ...(nodeId ? { nodeId } : {}),
      nodeType: asString(data.nodeType) || undefined,
      ...(projectId ? { projectId } : {}),
      relatedNodeIds: asNodeIds(data.relatedNodeIds),
      ...(data.visibility === 'public' ? { visibility: 'public' as const } : {}),
    }
  })
}

export function findNearestRagDocuments(
  queryVector: number[],
  limit = 12,
): Promise<RagDocument[]> {
  return queryNearestRagDocuments(getFirestore(), queryVector, limit)
}
