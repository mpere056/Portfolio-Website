import { describe, it, expect, vi, beforeEach } from 'vitest'

const googleMocks = vi.hoisted(() => ({
  embedContent: vi.fn(),
  getGenerativeModel: vi.fn(),
}))

// Mock env before importing module under test
process.env.GOOGLE_API_KEY = 'test-key'
process.env.NEXT_PUBLIC_SUPA_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPA_ANON_KEY = 'anon'

// Mock supabase client used by retriever
vi.mock('@/lib/db', () => {
  const rpc = vi.fn()
  return { supa: { rpc } }
})

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
  })

  it('returns empty when supabase yields no rows', async () => {
    const { supa } = await import('@/lib/db') as any
    supa.rpc.mockResolvedValue({ data: [], error: null })
    const { fetchContext } = await import('@/lib/retriever')
    const res = await fetchContext('hello world', 4)
    expect(res.context).toBe('')
    expect(res.slugs).toEqual([])
    expect(googleMocks.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-embedding-2' })
    expect(googleMocks.embedContent).toHaveBeenCalledWith({
      content: { parts: [{ text: 'hello world' }] },
      outputDimensionality: 768,
    })
  })

  it('returns concatenated context and unique slugs', async () => {
    const { supa } = await import('@/lib/db') as any
    supa.rpc.mockResolvedValue({ data: [
      { slug: 'story-app', content: 'AI-powered interactive story generator' },
      { slug: 'discord-sync-messaging', content: 'Multi-bot relay and high FPS text animations' },
      { slug: 'story-app', content: 'More details about story-app' },
    ], error: null })
    const { fetchContext } = await import('@/lib/retriever')
    const res = await fetchContext('projects', 2)
    expect(res.context).toMatch(/interactive story|relay/i)
    expect(res.slugs).toEqual(['story-app', 'discord-sync-messaging'])
  })

  it('rejects an unexpected embedding shape before querying pgvector', async () => {
    const { supa } = await import('@/lib/db') as any
    supa.rpc.mockClear()
    googleMocks.embedContent.mockResolvedValueOnce({
      embedding: { values: Array.from({ length: 3072 }, () => 0.01) },
    })

    const { fetchContext } = await import('@/lib/retriever')
    await expect(fetchContext('dimension guard')).rejects.toThrow(
      'Expected 768 embedding dimensions, received 3072',
    )
    expect(supa.rpc).not.toHaveBeenCalled()
  })
})


