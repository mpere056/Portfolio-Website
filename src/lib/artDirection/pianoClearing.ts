export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 760,
  horizonTrees: 18,
  cloudGroups: 2,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [8.7, 4.8, 11.4] as const,
  target: [0, -0.55, -0.45] as const,
  fov: 34,
  maxPointerTravel: 0.24,
} as const;

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const broad = Math.sin(x * 0.18) * 0.2 + Math.cos(z * 0.22) * 0.16;
  const clearing = Math.exp(-((x * x) / 34 + (z * z) / 22)) * 0.22;
  return broad - clearing;
}
