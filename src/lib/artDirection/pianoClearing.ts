export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 1100,
  pianoParticles: 8200,
  horizonTrees: 34,
  valleyRocks: 18,
  wildflowers: 120,
  cloudGroups: 4,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [0.8, 4.4, 15.5] as const,
  target: [0, -0.3, -16] as const,
  fov: 39,
  maxPointerTravel: 0.14,
} as const;

export function pianoClearingStreamCenter(x: number): number {
  return -9.5 + Math.sin((x + 4) * 0.13) * 1.65 + Math.sin(x * 0.045) * 0.8;
}

export function pianoClearingStreamWidth(x: number): number {
  return 1.05 + (Math.sin(x * 0.09) * 0.5 + 0.5) * 0.38;
}

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const cliffProgress = Math.max(0, Math.min(1, (2.2 - z) / 8.2));
  const oppositeRise = Math.max(0, Math.min(1, (-z - 11) / 17));
  const broad = Math.sin(x * 0.11) * 0.16 + Math.cos(z * 0.13) * 0.11;
  const elevation = 2.05 - cliffProgress * 4.25 + oppositeRise * 3.15;
  const streamDistance = z - pianoClearingStreamCenter(x);
  const valleyWidth = pianoClearingStreamWidth(x) * 1.9;
  const riverBed = Math.exp(-(streamDistance * streamDistance) / (valleyWidth * valleyWidth)) * 0.32;
  const plateauSoftening = Math.exp(-(((x - 4) ** 2) / 32 + ((z - 3.2) ** 2) / 20)) * 0.1;
  return elevation + broad - riverBed - plateauSoftening;
}
