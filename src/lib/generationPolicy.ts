export const GENERATION_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
] as const;

export function canFallbackGenerationModel(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  return status === 404 || status === 429 || status === 503;
}
