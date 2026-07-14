export const EMBEDDING_MODEL = 'gemini-embedding-2';
export const EMBEDDING_DIMENSIONS = 768;

export function createEmbeddingRequest(text: string) {
  return {
    content: { parts: [{ text }] },
    outputDimensionality: EMBEDDING_DIMENSIONS,
  };
}
