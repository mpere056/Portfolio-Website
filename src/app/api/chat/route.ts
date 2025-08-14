import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { fetchContext } from '@/lib/retriever'

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
});

const SYSTEM = (ctx: string) => `
You are Mark Perera's portfolio assistant.
Answer in first person and ground responses strictly in the provided context. If the context is insufficient, say so briefly.

CONTEXT:
${ctx}
`

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response('Google API key not found. Please set the GOOGLE_API_KEY environment variable.', { status: 500 });
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const DEBUG = process.env.DEBUG_RAG === '1' || process.env.NODE_ENV !== 'production'

  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  try {
    const userText: string | undefined = messages?.[messages.length - 1]?.content
    let ctx = ''
    try {
      if (userText) {
        const { context, slugs } = await fetchContext(userText, 4)
        ctx = context
        if (DEBUG) console.log('[RAG] ctx chars', ctx.length, 'slugs', slugs)
      }
    } catch (e) {
      // Retrieval failed; proceed without context
      if (DEBUG) console.error('[RAG] retrieval error', e)
      ctx = ''
    }

    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-2.5-flash' })
      .generateContentStream({
        ...buildGoogleGenAIPrompt(messages),
        system_instruction: { role: 'system', parts: [{ text: SYSTEM(ctx) }] }
      } as any);

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
