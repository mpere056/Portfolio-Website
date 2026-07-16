import { describe, it, expect, vi, beforeEach } from 'vitest'

const googleMocks = vi.hoisted(() => ({
  embedContent: vi.fn(),
  getGenerativeModel: vi.fn(),
}))

// Mock env before importing module under test
process.env.GOOGLE_API_KEY = 'test-key'

const ragStoreMocks = vi.hoisted(() => ({
  findNearestRagDocuments: vi.fn(),
}))

vi.mock('@/lib/ragStore', () => ragStoreMocks)

// Mock Google SDK
vi.mock('@google/generative-ai', async () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel(params: unknown) {
        return googleMocks.getGenerativeModel(params)
      }
    }
  }
})

describe('fetchContext', () => {
  beforeEach(() => {
    vi.resetModules()
    googleMocks.embedContent.mockReset().mockResolvedValue({
      embedding: { values: Array.from({ length: 768 }, (_, i) => (i % 2 ? 0.02 : 0.01)) },
    })
    googleMocks.getGenerativeModel.mockReset().mockReturnValue({
      embedContent: googleMocks.embedContent,
    })
    ragStoreMocks.findNearestRagDocuments.mockReset().mockResolvedValue([])
  })

  it('returns empty when Firestore yields no rows', async () => {
    const { fetchContext } = await import('@/lib/retriever')
    const res = await fetchContext('hello world', 4)
    expect(res.context).toBe('')
    expect(res.slugs).toEqual([])
    expect(res.sources).toEqual([])
    expect(googleMocks.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-embedding-2' })
    expect(googleMocks.embedContent).toHaveBeenCalledWith({
      content: { parts: [{ text: 'hello world' }] },
      outputDimensionality: 768,
    })
  })

  it('returns concatenated context and unique slugs', async () => {
    ragStoreMocks.findNearestRagDocuments.mockResolvedValue([
      { contentId: 'project:story-app', content: 'AI-powered interactive story generator' },
      { contentId: 'project:discord-sync-messaging', content: 'Multi-bot relay and high FPS text animations' },
      { contentId: 'project:story-app', content: 'More details about story-app' },
    ])
    const { fetchContext } = await import('@/lib/retriever')
    const res = await fetchContext('projects', 2)
    expect(res.context).toMatch(/interactive story|relay/i)
    expect(res.slugs).toEqual(['project:story-app', 'project:discord-sync-messaging'])
    expect(res.sources.map(source => source.nodeId)).toEqual([
      'project:story-app',
      'project:discord-sync-messaging',
    ])
  })

  it('lets validated graph context nudge results by at most two positions', async () => {
    ragStoreMocks.findNearestRagDocuments.mockResolvedValue([
      { contentId: 'project:story-app', nodeId: 'project:story-app', content: 'Direct result', relatedNodeIds: [] },
      { contentId: 'project:lifeinbox', nodeId: 'project:lifeinbox', content: 'Another result', relatedNodeIds: [] },
      { contentId: 'project:discord-bot', nodeId: 'project:discord-bot', content: 'Third result', relatedNodeIds: [] },
      { contentId: 'project:dreamlife', nodeId: 'project:dreamlife', content: 'Current object result', relatedNodeIds: [] },
    ])
    const { fetchContext } = await import('@/lib/retriever')
    const result = await fetchContext('product work', 3, { nodeId: 'project:dreamlife' })
    expect(result.slugs).toEqual([
      'project:story-app',
      'project:dreamlife',
      'project:lifeinbox',
    ])
    expect(result.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        nodeId: 'project:dreamlife',
        destination: expect.objectContaining({ id: 'destination:museum-project-dreamlife' }),
      }),
    ]))
  })

  it('ignores unknown client context identifiers and preserves vector order', async () => {
    ragStoreMocks.findNearestRagDocuments.mockResolvedValue([
      { contentId: 'project:lifeinbox', content: 'First', relatedNodeIds: [] },
      { contentId: 'project:dreamlife', content: 'Second', relatedNodeIds: [] },
    ])
    const { fetchContext } = await import('@/lib/retriever')
    const result = await fetchContext('projects', 2, { nodeId: 'project:not-public' })
    expect(result.slugs).toEqual(['project:lifeinbox', 'project:dreamlife'])
  })

  it('rejects an unexpected embedding shape before querying Firestore', async () => {
    googleMocks.embedContent.mockResolvedValueOnce({
      embedding: { values: Array.from({ length: 3072 }, () => 0.01) },
    })

    const { fetchContext } = await import('@/lib/retriever')
    await expect(fetchContext('dimension guard')).rejects.toThrow(
      'Expected 768 embedding dimensions, received 3072',
    )
    expect(ragStoreMocks.findNearestRagDocuments).not.toHaveBeenCalled()
  })
})


