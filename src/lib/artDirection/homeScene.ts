import type { FirstNotePhase } from '@/lib/experience/firstNote';

export const HOME_SCENE_LAYERS = [
  'threshold-matte',
  'painted-presence',
  'awakened-fragment',
  'notation-orbit',
  'three-dimensional-instrument',
] as const;

export interface HomeSceneFrame {
  threshold: number;
  fragment: number;
  notation: number;
}

export function getHomeSceneFrame(
  phase: FirstNotePhase,
  reducedMotion: boolean,
): HomeSceneFrame {
  const threshold = phase === 'ready' ? 1 : phase === 'revealing' ? 0.56 : 0;
  return {
    threshold,
    fragment: reducedMotion ? threshold * 0.42 : threshold * 0.86,
    notation: phase === 'waiting' ? 0.08 : threshold * (reducedMotion ? 0.42 : 0.74),
  };
}
