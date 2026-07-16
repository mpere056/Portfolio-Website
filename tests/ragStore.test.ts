import { describe, expect, it, vi } from 'vitest'
import {
  createRagDocumentId,
  queryNearestRagDocuments,
  readFirebaseServerConfig,
  RAG_COLLECTION,
} from '@/lib/ragStore'

describe('Firestore RAG store', () => {
  it('creates deterministic Firestore-safe chunk IDs from canonical content IDs', () => {
    expect(createRagDocumentId('post:dreamlife:building-a-life-design-loop', 2))
      .toBe('post%3Adreamlife%3Abuilding-a-life-design-loop--2')
  })

  it('normalizes the multiline private key from managed environment variables', () => {
    expect(readFirebaseServerConfig({
      FIREBASE_PROJECT_ID: 'mark-portfolio-ai',
      FIREBASE_CLIENT_EMAIL: 'portfolio@example.iam.gserviceaccount.com',
      FIREBASE_PRIVATE_KEY: 'line-one\\nline-two',
    })).toEqual({
      projectId: 'mark-portfolio-ai',
      clientEmail: 'portfolio@example.iam.gserviceaccount.com',
      privateKey: 'line-one\nline-two',
    })
  })

  it('fails closed when server credentials are incomplete', () => {
    expect(() => readFirebaseServerConfig({
      FIREBASE_PROJECT_ID: 'mark-portfolio-ai',
    })).toThrow(/Missing FIREBASE_PROJECT_ID/)
  })

  it('queries the committed 768-dimensional vector field and maps documents', async () => {
    const get = vi.fn().mockResolvedValue({
      docs: [{
        data: () => ({
          contentId: 'project:dreamlife',
          heading: 'DreamLife',
          content: 'A life-design product.',
          tokens: 4,
          chunkIndex: 0,
          sourcePath: 'projects/dreamlife.mdx',
          nodeId: 'project:dreamlife',
          nodeType: 'project',
          projectId: 'project:dreamlife',
          relatedNodeIds: ['skill:ai-product-design', 'not-a-node'],
          visibility: 'public',
          distance: 0.125,
        }),
      }],
    })
    const findNearest = vi.fn().mockReturnValue({ get })
    const collection = vi.fn().mockReturnValue({ findNearest })

    const rows = await queryNearestRagDocuments(
      { collection },
      Array.from({ length: 768 }, () => 0.01),
      12,
    )

    expect(collection).toHaveBeenCalledWith(RAG_COLLECTION)
    expect(findNearest).toHaveBeenCalledWith(expect.objectContaining({
      vectorField: 'embedding',
      limit: 12,
      distanceMeasure: 'EUCLIDEAN',
      distanceResultField: 'distance',
    }))
    expect(rows).toEqual([expect.objectContaining({
      contentId: 'project:dreamlife',
      content: 'A life-design product.',
      distance: 0.125,
      nodeId: 'project:dreamlife',
      nodeType: 'project',
      projectId: 'project:dreamlife',
      relatedNodeIds: ['skill:ai-product-design'],
      visibility: 'public',
    })])
  })

  it('keeps legacy documents usable while deriving their canonical node ID', async () => {
    const collection = vi.fn().mockReturnValue({
      findNearest: () => ({
        get: async () => ({
          docs: [{ data: () => ({
            contentId: 'project:lifeinbox',
            content: 'Legacy content without graph metadata.',
          }) }],
        }),
      }),
    })
    const [row] = await queryNearestRagDocuments({ collection }, [0.1], 1)
    expect(row).toEqual(expect.objectContaining({
      contentId: 'project:lifeinbox',
      nodeId: 'project:lifeinbox',
      relatedNodeIds: [],
    }))
  })
})
