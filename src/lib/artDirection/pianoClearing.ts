export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 7200,
  pianoParticles: 9000,
  horizonTrees: 46,
  valleyRocks: 5,
  wildflowers: 160,
  atmosphericMotes: 180,
  cloudGroups: 5,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [0.6, 6, 17.8] as const,
  target: [-0.8, 2.7, -19.5] as const,
  fov: 35,
  maxPointerTravel: 0.1,
} as const;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function pianoClearingRiverCenterX(z: number): number {
  const nearProgress = clamp01((z + 32) / 42);
  const bend = Math.sin((z + 4) * 0.18) * (0.35 + nearProgress * 0.55);
  return 1.15 - nearProgress * 9.4 + bend;
}

export function pianoClearingRiverWidth(z: number): number {
  const nearProgress = clamp01((z + 34) / 44);
  return 1.4 + nearProgress * 2.65;
}

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const broad = Math.sin(x * 0.095) * 0.16 + Math.cos(z * 0.105) * 0.12;
  const riverCenter = pianoClearingRiverCenterX(z);
  const riverWidth = pianoClearingRiverWidth(z);
  const riverDistance = x - riverCenter;
  const ravineRadius = riverWidth * 2.55;
  const ravine = Math.exp(-(riverDistance * riverDistance) / (ravineRadius * ravineRadius)) * 6.45;
  const riverBed = Math.exp(-(riverDistance * riverDistance) / ((riverWidth * 0.9) ** 2)) * 0.34;
  const nearField = clamp01((z + 9) / 16);
  const rightBank = clamp01((x - riverCenter - riverWidth * 0.65) / 12);
  const foregroundLift = nearField * rightBank * 2.6;
  const farTerrace = clamp01((-z - 19) / 15) * 0.65;
  const pianoShelf = Math.exp(-(((x - 5.2) ** 2) / 28 + ((z - 4.2) ** 2) / 12)) * 0.09;
  return 2.35 + broad + foregroundLift + farTerrace - ravine - riverBed - pianoShelf;
}
