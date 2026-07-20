export const READING_SCENE_LAYERS = [
  'reading-matte',
  'project-material',
  'page-fragment',
  'margin-trace',
  'reading-content',
] as const;

export interface ReadingSceneFrame {
  progress: number;
  disturbance: number;
  trace: number;
}

export function getReadingSceneFrame(progress: number, reducedMotion = false): ReadingSceneFrame {
  const bounded = Math.min(1, Math.max(0, progress));
  return {
    progress: bounded,
    disturbance: reducedMotion ? 0 : Math.sin(bounded * Math.PI) * 0.72,
    trace: reducedMotion ? 0.22 : 0.18 + bounded * 0.82,
  };
}
