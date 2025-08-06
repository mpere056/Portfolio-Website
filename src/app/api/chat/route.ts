import {
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

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

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response('Google API key not found. Please set the GOOGLE_API_KEY environment variable.', { status: 500 });
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  try {
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-2.5-flash' })
      .generateContentStream(buildGoogleGenAIPrompt(messages));

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
