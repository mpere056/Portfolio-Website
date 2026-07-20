export const ABOUT_SCENE_LAYERS = [
  'archive-matte',
  'illuminated-manuscript',
  'chronology-prism',
  'memory-orbits',
  'timeline-content',
] as const;

export interface AboutSceneFrame {
  progress: number;
  refraction: number;
  orbit: number;
}

export function getAboutSceneFrame(
  activeIndex: number,
  entryCount: number,
  reducedMotion = false,
): AboutSceneFrame {
  const finalIndex = Math.max(1, entryCount - 1);
  const progress = Math.min(1, Math.max(0, activeIndex / finalIndex));
  return {
    progress,
    refraction: reducedMotion ? 0 : Math.sin(progress * Math.PI) * 0.78,
    orbit: reducedMotion ? 0.24 : 0.38 + progress * 0.58,
  };
}
