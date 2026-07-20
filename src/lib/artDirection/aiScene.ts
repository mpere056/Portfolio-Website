export const AI_SCENE_LAYERS = [
  'quiet-mark',
  'archive-vellum',
  'context-aperture',
  'response-signal',
  'conversation-surface',
] as const;

export interface AISceneFrame {
  aperture: number;
  signal: number;
  context: number;
}

export function getAISceneFrame({
  open,
  activity,
  contextAvailable,
  reducedMotion = false,
}: {
  open: boolean;
  activity: string;
  contextAvailable: boolean;
  reducedMotion?: boolean;
}): AISceneFrame {
  return {
    aperture: open ? (reducedMotion ? 0.72 : 1) : 0,
    signal: activity === 'responding' ? (reducedMotion ? 0.46 : 1) : activity === 'error' ? 0.18 : 0.3,
    context: contextAvailable ? 1 : 0.28,
  };
}
