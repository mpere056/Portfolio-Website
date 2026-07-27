export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 1560,
  pianoParticles: 9000,
  horizonTrees: 46,
  valleyRocks: 24,
  wildflowers: 160,
  atmosphericMotes: 180,
  cloudGroups: 5,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [0.2, 5.65, 16.8] as const,
  target: [0, 2.85, -21] as const,
  fov: 35,
  maxPointerTravel: 0.1,
} as const;

export function pianoClearingStreamCenter(x: number): number {
  return -7.55 + Math.sin((x + 5) * 0.085) * 0.72;
}

export function pianoClearingStreamWidth(x: number): number {
  return 1.85 + (Math.sin(x * 0.08) * 0.5 + 0.5) * 0.38;
}

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const cliffProgress = Math.max(0, Math.min(1, (3.25 - z) / 5.8));
  const oppositeRise = Math.max(0, Math.min(1, (-z - 12.5) / 7.5));
  const broad = Math.sin(x * 0.1) * 0.13 + Math.cos(z * 0.11) * 0.09;
  const foregroundTilt = Math.max(0, Math.min(1, (z + 1) / 6)) * (x / 18) * 6.75;
  const elevation = 2.45 - cliffProgress * 6.45 + oppositeRise * 5.55;
  const streamDistance = z - pianoClearingStreamCenter(x);
  const valleyWidth = pianoClearingStreamWidth(x) * 2.15;
  const riverBed = Math.exp(-(streamDistance * streamDistance) / (valleyWidth * valleyWidth)) * 0.38;
  const pianoShelf = Math.exp(-(((x - 5.2) ** 2) / 28 + ((z - 4.2) ** 2) / 12)) * 0.09;
  return elevation + broad + foregroundTilt - riverBed - pianoShelf;
}
