import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatMocks = vi.hoisted(() => ({
  fetchContext: vi.fn(),
  generateContentStream: vi.fn(),
  getGenerativeModel: vi.fn(),
  googleStream: vi.fn(),
  streamDataAppend: vi.fn(),
  streamDataClose: vi.fn(),
}))

process.env.GOOGLE_API_KEY = 'test-key'

vi.mock('@/lib/retriever', () => ({
  fetchContext: chatMocks.fetchContext,
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel(params: unknown) {
      return chatMocks.getGenerativeModel(params)
    }
  },
}))

vi.mock('ai', () => ({
  GoogleGenerativeAIStream: chatMocks.googleStream,
  StreamData: class {
    stream = new ReadableStream({ start: controller => controller.close() });
    append(value: unknown) {
      chatMocks.streamDataAppend(value);
    }
    close() {
      chatMocks.streamDataClose();
      return Promise.resolve();
    }
  },
  StreamingTextResponse: class extends Response {
    constructor(stream: ReadableStream) {
      super(stream)
    }
  },
}))

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.resetModules()
    chatMocks.fetchContext.mockReset().mockResolvedValue({
      context: 'DreamLife is a mobile life-planning product.',
      slugs: ['dreamlife'],
      sources: [{
        nodeId: 'project:dreamlife',
        nodeType: 'project',
        title: 'Dreamlife',
        summary: 'A mobile life-planning product.',
      }],
    })
    chatMocks.generateContentStream.mockReset().mockResolvedValue({ stream: true })
    chatMocks.getGenerativeModel.mockReset().mockReturnValue({
      generateContentStream: chatMocks.generateContentStream,
    })
    chatMocks.streamDataAppend.mockReset()
    chatMocks.streamDataClose.mockReset()
    chatMocks.googleStream.mockReset().mockImplementation((_stream, callbacks) => {
      void callbacks?.onFinal?.('DreamLife answer')
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('DreamLife answer'))
          controller.close()
        },
      })
    })
  })

  it('uses the supported Flash alias and grounds the streamed response', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const response = await POST(new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is DreamLife?' }],
      }),
    }))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('DreamLife answer')
    expect(chatMocks.fetchContext).toHaveBeenCalledWith('What is DreamLife?', 4)
    expect(chatMocks.streamDataAppend).toHaveBeenCalledWith({
      type: 'portfolio-sources',
      sources: [expect.objectContaining({ nodeId: 'project:dreamlife' })],
    })
    expect(chatMocks.getGenerativeModel).toHaveBeenCalledWith({
      model: 'gemini-flash-latest',
    })
    expect(chatMocks.generateContentStream).toHaveBeenCalledWith(expect.objectContaining({
      contents: [{ role: 'user', parts: [{ text: 'What is DreamLife?' }] }],
      system_instruction: expect.objectContaining({
        parts: [expect.objectContaining({
          text: expect.stringContaining('DreamLife is a mobile life-planning product.'),
        })],
      }),
    }))
  })

  it('passes accepted public identifiers to retrieval and ignores malformed context', async () => {
    const { POST } = await import('@/app/api/chat/route')
    await POST(new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is DreamLife?' }],
        context: { nodeId: 'project:dreamlife' },
      }),
    }))
    expect(chatMocks.fetchContext).toHaveBeenLastCalledWith(
      'What is DreamLife?',
      4,
      { nodeId: 'project:dreamlife' },
    )

    chatMocks.fetchContext.mockClear()
    await POST(new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is DreamLife?' }],
        context: { nodeId: 'not-a-node', title: 'Injected title' },
      }),
    }))
    expect(chatMocks.fetchContext).toHaveBeenLastCalledWith('What is DreamLife?', 4)
  })

  it('falls back to Flash Lite when the primary model is temporarily unavailable', async () => {
    chatMocks.generateContentStream
      .mockRejectedValueOnce(Object.assign(new Error('high demand'), { status: 503 }))
      .mockResolvedValueOnce({ stream: true })

    const { POST } = await import('@/app/api/chat/route')
    const response = await POST(new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is DreamLife?' }],
      }),
    }))

    expect(response.status).toBe(200)
    expect(chatMocks.getGenerativeModel.mock.calls).toEqual([
      [{ model: 'gemini-flash-latest' }],
      [{ model: 'gemini-flash-lite-latest' }],
    ])
  })
})
