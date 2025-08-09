import { describe, it, expect, vi, beforeEach } from 'vitest'

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
      getGenerativeModel() {
        return {
          embedContent: vi.fn().mockResolvedValue({ embedding: { values: Array.from({ length: 768 }, (_, i) => (i % 2 ? 0.02 : 0.01)) } })
        }
      }
    }
  }
})

describe('fetchContext', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns empty when supabase yields no rows', async () => {
    const { supa } = await import('@/lib/db') as any
    supa.rpc.mockResolvedValue({ data: [], error: null })
    const { fetchContext } = await import('@/lib/retriever')
    const res = await fetchContext('hello world', 4)
    expect(res.context).toBe('')
    expect(res.slugs).toEqual([])
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
})


