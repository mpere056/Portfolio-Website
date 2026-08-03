import * as THREE from 'three';

export const MUSIC_LIQUID_PROOF = {
  center: [10.8, 6.4] as const,
  axes: [15.5, 7.2] as const,
  rotation: -0.18,
  edgeSoftness: 0.24,
  travelSpeed: 0.55,
  pressureWidth: 0.22,
  recoveryTail: 0.34,
  attentionRadius: 0.32,
  attentionDamping: 5.2,
  pianoReflectionScale: 0.48,
  riverResponseDamping: 0.52,
  maxAddedDrawCalls: 4,
  preferredAddedDrawCalls: 3,
  maxLookupTextureSize: 256,
  maxCompressedAssetBytes: 1_000_000,
  fullScreenPasses: 0,
  cpuGrassUpdatesPerFrame: 0,
} as const;

export const MUSIC_LIQUID_LANDSCAPES = [
  {
    id: 'tidal-meadow',
    title: 'Tidal Meadow',
    note: 'A breathing basin of slow nacre currents.',
  },
  {
    id: 'nacre-terraces',
    title: 'Nacre Terraces',
    note: 'Pearlescent shelves rise like remembered chords.',
  },
  {
    id: 'resonant-archipelago',
    title: 'Resonant Archipelago',
    note: 'Separated liquid islands answer across open grass.',
  },
  {
    id: 'glass-delta',
    title: 'Glass Delta',
    note: 'Branching currents route light through the clearing.',
  },
  {
    id: 'harmonic-dunes',
    title: 'Harmonic Dunes',
    note: 'Soft fluid hills inhale and reform without sound.',
  },
] as const;

export type MusicLiquidLandscapeId = typeof MUSIC_LIQUID_LANDSCAPES[number]['id'];

export function musicLiquidLandscapeIndex(id: MusicLiquidLandscapeId): number {
  return MUSIC_LIQUID_LANDSCAPES.findIndex(landscape => landscape.id === id);
}

export type MusicLiquidQuality = 'full' | 'balanced' | 'calm' | 'reduced' | 'failure';

export type MusicLiquidCapability = {
  reducedMotion: boolean;
  webglAvailable: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

export function musicLiquidInitialQuality({
  reducedMotion,
  webglAvailable,
  hardwareConcurrency,
  deviceMemory,
}: MusicLiquidCapability): MusicLiquidQuality {
  if (!webglAvailable) return 'failure';
  if (reducedMotion) return 'reduced';
  if (
    (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4)
    || (typeof deviceMemory === 'number' && deviceMemory <= 4)
  ) return 'balanced';
  return 'full';
}

export function musicLiquidMotionScale(quality: MusicLiquidQuality): number {
  if (quality === 'failure' || quality === 'reduced') return 0;
  if (quality === 'calm') return 0.2;
  if (quality === 'balanced') return 0.68;
  return 1;
}

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

export function musicLiquidLocalAttention(
  pointerX: number,
  pointerY: number,
  sampleX: number,
  sampleY: number,
  attention: number,
): number {
  const distance = Math.hypot(pointerX - sampleX, pointerY - sampleY);
  return THREE.MathUtils.clamp(
    attention * (1 - THREE.MathUtils.smoothstep(
      distance,
      MUSIC_LIQUID_PROOF.attentionRadius * 0.12,
      MUSIC_LIQUID_PROOF.attentionRadius,
    )),
    0,
    1,
  );
}
