import * as THREE from 'three';

export const MUSIC_LIQUID_PROOF = {
  center: [10.6, 6.1] as const,
  axes: [5.6, 3.05] as const,
  rotation: -0.24,
  edgeSoftness: 0.18,
  travelSpeed: 0.42,
  pressureWidth: 0.22,
  recoveryTail: 0.34,
  maxAddedDrawCalls: 4,
  preferredAddedDrawCalls: 3,
  maxLookupTextureSize: 256,
  maxCompressedAssetBytes: 1_000_000,
  fullScreenPasses: 0,
  cpuGrassUpdatesPerFrame: 0,
} as const;

export type MusicLiquidQuality = 'full' | 'balanced' | 'calm' | 'reduced' | 'failure';

export function musicLiquidTerritoryCoordinates(x: number, z: number) {
  const dx = x - MUSIC_LIQUID_PROOF.center[0];
  const dz = z - MUSIC_LIQUID_PROOF.center[1];
  const cosine = Math.cos(MUSIC_LIQUID_PROOF.rotation);
  const sine = Math.sin(MUSIC_LIQUID_PROOF.rotation);

  return {
    x: (dx * cosine - dz * sine) / MUSIC_LIQUID_PROOF.axes[0],
    y: (dx * sine + dz * cosine) / MUSIC_LIQUID_PROOF.axes[1],
  };
}

export function musicLiquidTerritoryMask(x: number, z: number): number {
  const local = musicLiquidTerritoryCoordinates(x, z);
  const distance = Math.hypot(local.x, local.y);
  return 1 - THREE.MathUtils.smoothstep(
    distance,
    1 - MUSIC_LIQUID_PROOF.edgeSoftness,
    1,
  );
}

export function musicLiquidPressurePhase(time: number): number {
  const cycle = time * MUSIC_LIQUID_PROOF.travelSpeed;
  return cycle - Math.floor(cycle);
}

export function musicLiquidQualityWeight(quality: MusicLiquidQuality): number {
  if (quality === 'failure') return 0;
  if (quality === 'reduced') return 0.46;
  if (quality === 'calm') return 0.68;
  if (quality === 'balanced') return 0.84;
  return 1;
}
