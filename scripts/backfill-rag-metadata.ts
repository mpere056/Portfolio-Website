import { loadKnowledgeGraph } from '../src/lib/content/graph';
import {
  createRagGraphMetadataIndex,
  type RagGraphMetadata,
} from '../src/lib/content/ragMetadata';
import { RAG_COLLECTION } from '../src/lib/ragStore';
import { isNodeId } from '../src/lib/portfolioContracts';

interface FirestoreDocument {
  name: string;
  fields?: Record<string, {
    stringValue?: string;
    integerValue?: string;
    arrayValue?: { values?: Array<{ stringValue?: string }> };
  }>;
}

interface FirestoreListResponse {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
}

const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || process.env.GCLOUD_PROJECT?.trim();
const accessToken = process.env.FIRESTORE_ACCESS_TOKEN?.trim();

if (!projectId || !accessToken) {
  throw new Error('Missing FIREBASE_PROJECT_ID/GCLOUD_PROJECT or FIRESTORE_ACCESS_TOKEN');
}

function headers() {
  return {
    authorization: `Bearer ${accessToken}`,
    'content-type': 'application/json',
  };
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firestore REST request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

async function listDocuments() {
  const documents: FirestoreDocument[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${RAG_COLLECTION}`,
    );
    url.searchParams.set('pageSize', '300');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const payload = await readJson<FirestoreListResponse>(await fetch(url, { headers: headers() }));
    documents.push(...(payload.documents ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken);
  return documents;
}

function metadataFields(metadata: RagGraphMetadata) {
  return {
    nodeId: { stringValue: metadata.nodeId },
    nodeType: { stringValue: metadata.nodeType },
    ...(metadata.projectId ? { projectId: { stringValue: metadata.projectId } } : {}),
    relatedNodeIds: {
      arrayValue: {
        values: metadata.relatedNodeIds.map(nodeId => ({ stringValue: nodeId })),
      },
    },
    visibility: { stringValue: metadata.visibility },
  };
}

async function commitMetadata(updates: Array<{ document: FirestoreDocument; metadata: RagGraphMetadata }>) {
  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`,
  );
  await readJson(await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      writes: updates.map(({ document, metadata }) => ({
        update: {
          name: document.name,
          fields: metadataFields(metadata),
        },
        updateMask: {
          fieldPaths: ['nodeId', 'nodeType', 'projectId', 'relatedNodeIds', 'visibility'],
        },
      })),
    }),
  }));
}

async function deleteDocuments(documents: readonly FirestoreDocument[]) {
  if (!documents.length) return;
  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`,
  );
  await readJson(await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ writes: documents.map(document => ({ delete: document.name })) }),
  }));
}

function chunkKey(document: FirestoreDocument) {
  const sourcePath = document.fields?.sourcePath?.stringValue;
  const chunkIndex = document.fields?.chunkIndex?.integerValue;
  return sourcePath && chunkIndex !== undefined ? `${sourcePath}:${chunkIndex}` : undefined;
}

function documentId(document: FirestoreDocument) {
  return document.name.split('/').at(-1) ?? '';
}

function canonicalDocumentIdForRawArtifact(document: FirestoreDocument) {
  const match = documentId(document).match(/^(.*)--(\d+)$/);
  return match ? `${encodeURIComponent(match[1])}--${match[2]}` : undefined;
}

async function main() {
  const graph = await loadKnowledgeGraph();
  if (graph.issues.length) throw new Error(`Knowledge graph has ${graph.issues.length} validation issues`);
  const metadataIndex = createRagGraphMetadataIndex(graph);
  const documents = await listDocuments();
  const updates: Array<{ document: FirestoreDocument; metadata: RagGraphMetadata }> = [];
  const skippedDocuments: FirestoreDocument[] = [];

  for (const document of documents) {
    const contentId = document.fields?.contentId?.stringValue;
    const metadata = contentId && isNodeId(contentId) ? metadataIndex.get(contentId) : undefined;
    if (!metadata) {
      skippedDocuments.push(document);
      continue;
    }
    updates.push({ document, metadata });
  }

  if (updates.length) await commitMetadata(updates);

  const canonicalChunkKeys = new Set(updates.map(({ document }) => chunkKey(document)).filter(Boolean));
  const staleDuplicates = skippedDocuments.filter(document => {
    const key = chunkKey(document);
    return Boolean(key && canonicalChunkKeys.has(key));
  });
  const canonicalDocumentIds = new Set(updates.map(({ document }) => documentId(document)));
  const metadataFieldsOnly = new Set(['nodeId', 'nodeType', 'projectId', 'relatedNodeIds', 'visibility']);
  const metadataArtifacts = skippedDocuments.filter(document => {
    const fields = Object.keys(document.fields ?? {});
    const canonicalTwin = canonicalDocumentIdForRawArtifact(document);
    return !document.fields?.contentId
      && fields.length > 0
      && fields.every(field => metadataFieldsOnly.has(field))
      && Boolean(canonicalTwin && canonicalDocumentIds.has(canonicalTwin));
  });
  const cleanupCandidates = [...new Set([...staleDuplicates, ...metadataArtifacts])];
  const unmatchedSkipped = skippedDocuments.filter(document => !cleanupCandidates.includes(document));
  const skippedContentIds = [...new Set(
    unmatchedSkipped.map(document => document.fields?.contentId?.stringValue ?? '(missing)'),
  )].sort();
  if (process.env.DELETE_STALE_RAG_DUPLICATES === '1') {
    if (unmatchedSkipped.length) {
      throw new Error(`Refusing stale cleanup: ${unmatchedSkipped.length} skipped documents are not mirrored`);
    }
    await deleteDocuments(cleanupCandidates);
  }

  const verifiedDocuments = await listDocuments();
  const unidentifiedDocuments = verifiedDocuments.filter(document => (
    !document.fields?.contentId?.stringValue
  ));
  if (unidentifiedDocuments.length) {
    throw new Error(`RAG metadata verification found ${unidentifiedDocuments.length} unidentified documents`);
  }
  const missingMetadata = verifiedDocuments.filter(document => {
    const contentId = document.fields?.contentId?.stringValue;
    if (!contentId || !isNodeId(contentId) || !metadataIndex.has(contentId)) return false;
    return document.fields?.nodeId?.stringValue !== contentId
      || !document.fields?.nodeType?.stringValue
      || document.fields?.visibility?.stringValue !== 'public'
      || !document.fields?.relatedNodeIds?.arrayValue;
  });
  if (missingMetadata.length) {
    const returnedFields = Object.keys(missingMetadata[0]?.fields ?? {}).sort().join(', ');
    throw new Error(
      `RAG metadata verification failed for ${missingMetadata.length} documents; returned fields: ${returnedFields}`,
    );
  }

  console.log(
    `RAG metadata backfill complete: ${updates.length} updated, ${updates.length} verified, `
    + `${staleDuplicates.length} mirrored stale, ${metadataArtifacts.length} metadata artifacts, `
    + `${unmatchedSkipped.length} unmatched skipped, ${verifiedDocuments.length} documents remain.`,
  );
  if (process.env.REPORT_SKIPPED_RAG_IDS === '1' && skippedContentIds.length) {
    console.log(`Skipped content IDs: ${skippedContentIds.join(', ')}`);
    const skippedDocumentIds = unmatchedSkipped.map(documentId).slice(0, 5);
    const canonicalDocumentIds = updates.map(({ document }) => documentId(document)).slice(0, 5);
    console.log(`Skipped document ID sample: ${skippedDocumentIds.join(', ')}`);
    console.log(`Canonical document ID sample: ${canonicalDocumentIds.join(', ')}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
