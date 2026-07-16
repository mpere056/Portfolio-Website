import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamData, StreamingTextResponse } from 'ai';
import { fetchContext } from '@/lib/retriever'
import {
  canFallbackGenerationModel,
  GENERATION_MODELS,
} from '@/lib/generationPolicy'
import { parseChatRequest } from '@/lib/ai/request'
import { createSourcePayload } from '@/lib/ai/sources'

// Firestore's server client requires the Node.js runtime.
export const runtime = 'nodejs';

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
Answer in first person and ground responses strictly in the provided context, with a positive attitude (but not overly enthusiastic) and not being too negative. If the context is insufficient, then let them know that information for that isn't in your database, and recommend for them to contact Mark Perera directly, ending the message with the special component tag: [CONTACT_EMAIL]. At the end of that specific sentence, you MUST include the special component tag: [CONTACT_EMAIL] (ex. I'm sorry, I don't have that information in my database. I recommend you contact Mark Perera directly. [CONTACT_EMAIL]).

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

  const parsed = parseChatRequest(await req.json());
  if (!parsed.ok || !parsed.value) {
    return new Response(parsed.error ?? 'Invalid chat request.', { status: 400 });
  }
  const { messages, context } = parsed.value;

  try {
    const userText: string | undefined = messages?.[messages.length - 1]?.content
    let ctx = ''
    let sources: Awaited<ReturnType<typeof fetchContext>>['sources'] = []
    try {
      if (userText) {
        const retrieved = context?.nodeId
          ? await fetchContext(userText, 4, { nodeId: context.nodeId })
          : await fetchContext(userText, 4)
        ctx = retrieved.context
        sources = retrieved.sources
        if (DEBUG) console.log('[RAG] ctx chars', ctx.length, 'slugs', retrieved.slugs)
      }
    } catch (e) {
      // Retrieval failed; proceed without context
      if (DEBUG) console.error('[RAG] retrieval error', e)
      ctx = ''
    }

    const generationRequest = {
      ...buildGoogleGenAIPrompt(messages),
      system_instruction: { role: 'system', parts: [{ text: SYSTEM(ctx) }] },
    } as any;

    let geminiStream: Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>['generateContentStream']>> | undefined;
    for (const [index, model] of GENERATION_MODELS.entries()) {
      try {
        geminiStream = await genAI
          .getGenerativeModel({ model })
          .generateContentStream(generationRequest);
        break;
      } catch (error) {
        const hasFallback = index < GENERATION_MODELS.length - 1;
        if (!hasFallback || !canFallbackGenerationModel(error)) throw error;
        if (DEBUG) console.warn('[AI] generation model unavailable, trying fallback', { model });
      }
    }

    if (!geminiStream) throw new Error('No Gemini generation model was available.');

    // Convert the response into a friendly text-stream
    const data = new StreamData();
    data.append(createSourcePayload(sources));
    const stream = GoogleGenerativeAIStream(geminiStream, {
      onFinal: () => data.close(),
    });

    // Respond with the stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    console.error(error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
