export const PIANO_CLEARING_PERFORMANCE = {
  maxDpr: 1.25,
  grassInstances: 220000,
  pianoParticles: 9000,
  horizonTrees: 58,
  valleyRocks: 5,
  wildflowers: 160,
  atmosphericMotes: 180,
  cloudGroups: 5,
  bridgeArches: 5,
  trainCars: 3,
  realtimeShadows: false,
  postProcessing: false,
} as const;

export const PIANO_CLEARING_CAMERA = {
  position: [0.8, 4.8, 18.2] as const,
  target: [-1.8, 1.15, -28] as const,
  fov: 46,
  maxPointerTravel: 0.08,
} as const;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function pianoClearingRiverCenterX(z: number): number {
  const nearProgress = clamp01((z + 32) / 42);
  const bend = Math.sin((z + 6) * 0.13) * (0.28 + nearProgress * 0.52);
  return 0.7 - nearProgress * 8.2 + bend;
}

export function pianoClearingRiverWidth(z: number): number {
  const nearProgress = clamp01((z + 34) / 44);
  return 1.55 + nearProgress * 2.55;
}

export function pianoClearingTerrainHeight(x: number, z: number): number {
  const broad = Math.sin(x * 0.076) * 0.2 + Math.cos(z * 0.088) * 0.15;
  const riverCenter = pianoClearingRiverCenterX(z);
  const riverWidth = pianoClearingRiverWidth(z);
  const riverDistance = x - riverCenter;
  const nearProgress = clamp01((z + 32) / 42);
  const ravineRadius = 7.2 + nearProgress * 2.8;
  const ravine = Math.exp(-(riverDistance * riverDistance) / (ravineRadius * ravineRadius)) * 6.1;
  const riverBed = Math.exp(-(riverDistance * riverDistance) / ((riverWidth * 0.92) ** 2)) * 0.48;
  const nearField = clamp01((z + 12) / 19);
  const rightBank = clamp01((x - riverCenter - riverWidth * 0.55) / 11);
  const leftBank = clamp01((riverCenter - riverWidth - x) / 13);
  const foregroundLift = nearField * (rightBank * 2.45 + leftBank * 0.7);
  const farTerrace = clamp01((-z - 21) / 14) * 0.45;
  const pianoShelf = Math.exp(-(((x - 5.2) ** 2) / 28 + ((z - 4.2) ** 2) / 12)) * 0.09;
  return 2.45 + broad + foregroundLift + farTerrace - ravine - riverBed - pianoShelf;
}

export function pianoClearingTreeAllowed(x: number, z: number): boolean {
  const riverCenter = pianoClearingRiverCenterX(z);
  const riverClearance = pianoClearingRiverWidth(z) + 5.4;
  const height = pianoClearingTerrainHeight(x, z);
  const sampleRadius = 0.45;
  const slopeX = Math.abs(
    pianoClearingTerrainHeight(x + sampleRadius, z)
    - pianoClearingTerrainHeight(x - sampleRadius, z),
  );
  const slopeZ = Math.abs(
    pianoClearingTerrainHeight(x, z + sampleRadius)
    - pianoClearingTerrainHeight(x, z - sampleRadius),
  );

  return (
    Math.abs(x - riverCenter) > riverClearance
    && height > -0.9
    && slopeX + slopeZ < 0.76
  );
}
