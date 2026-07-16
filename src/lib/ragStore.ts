import { Firestore } from '@google-cloud/firestore'

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
    return {
      contentId: asString(data.contentId),
      heading: asString(data.heading),
      content: asString(data.content),
      tokens: asNumber(data.tokens),
      chunkIndex: asNumber(data.chunkIndex),
      sourcePath: asString(data.sourcePath),
      distance: asNumber(data.distance),
    }
  })
}

export function findNearestRagDocuments(
  queryVector: number[],
  limit = 12,
): Promise<RagDocument[]> {
  return queryNearestRagDocuments(getFirestore(), queryVector, limit)
}
