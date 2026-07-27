export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 720,
  pianoParticles: 6200,
  horizonTrees: 22,
  cloudGroups: 3,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [8.8, 5.7, 13.6] as const,
  target: [-0.4, -1.2, -7.4] as const,
  fov: 36,
  maxPointerTravel: 0.18,
} as const;

export function pianoClearingStreamCenter(z: number): number {
  return 1.25 + Math.sin((z + 9) * 0.17) * 2.35;
}

export function pianoClearingStreamWidth(z: number): number {
  const approach = Math.max(0, Math.min(1, (z + 30) / 36));
  return 0.75 + approach * 1.15;
}

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const broad = Math.sin(x * 0.13) * 0.22 + Math.cos(z * 0.16) * 0.16;
  const farDrop = -Math.max(0, Math.min(1, (-z - 1) / 25)) * 1.35;
  const streamDistance = x - pianoClearingStreamCenter(z);
  const valleyWidth = pianoClearingStreamWidth(z) * 1.85;
  const valley = Math.exp(-(streamDistance * streamDistance) / (valleyWidth * valleyWidth)) * 0.92;
  const pianoShelf = Math.exp(-(((x + 2.2) ** 2) / 19 + ((z - 2.1) ** 2) / 13)) * 0.18;
  return broad + farDrop - valley - pianoShelf;
}
