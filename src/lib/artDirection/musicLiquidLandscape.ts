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
    id: 'combined-world',
    title: 'The Living Score',
    note: 'One Music world where liquid hills, fire, petals, harmonic light, and cool teal currents coexist.',
  },
  {
    id: 'tidal-meadow',
    title: 'Tidal Meadow',
    note: 'An oceanic flower-world breathing from foreground to horizon.',
  },
  {
    id: 'nacre-terraces',
    title: 'Nacre Terraces',
    note: 'A living fire ecology climbs through blackened terraces.',
  },
  {
    id: 'glass-delta',
    title: 'Petal Delta',
    note: 'Spring petals remain a combinable airborne layer for the Music world.',
  },
  {
    id: 'harmonic-dunes',
    title: 'Harmonic Dunes',
    note: 'Musical light travels through intact grass beneath a ribboned sky.',
  },
] as const;

export type MusicLiquidLandscapeId = typeof MUSIC_LIQUID_LANDSCAPES[number]['id'];

export type MusicWorldProfile = {
  id: MusicLiquidLandscapeId;
  sky: [string, string, string];
  fog: string;
  ground: [string, string, string, string];
  grass: [string, string, string, string];
  cloud: [string, string];
  ridge: [string, string, string];
  bridge: [string, string];
  keyLight: string;
  worldForm: 'combined' | 'ocean' | 'terraces' | 'delta' | 'dunes';
};

// The rejected archipelago world is gone, but its cool grass color remains useful
// as a countercurrent inside the combined Music composition.
export const MUSIC_ARCHIPELAGO_GRASS_PALETTE = [
  '#092637', '#145565', '#2e9a88', '#9bedd3',
] as const;

export const MUSIC_WORLD_PROFILES: Record<MusicLiquidLandscapeId, MusicWorldProfile> = {
  'combined-world': {
    id: 'combined-world',
    sky: ['#f3a2cd', '#7769c5', '#24367f'],
    fog: '#675991',
    ground: ['#100d35', '#292052', '#4b356f', '#c35d91'],
    grass: ['#11183f', '#343166', '#79518d', '#e69abf'],
    cloud: ['#f2b9dc', '#7169ae'],
    ridge: ['#867cc2', '#625aa0', '#454582'],
    bridge: ['#20234a', '#515586'],
    keyLight: '#f2a4d0',
    worldForm: 'combined',
  },
  'tidal-meadow': {
    id: 'tidal-meadow',
    sky: ['#faa0c8', '#9c8de4', '#315ac1'],
    fog: '#7966ad',
    ground: ['#120f3b', '#29235a', '#513078', '#d55b90'],
    grass: ['#141442', '#36306f', '#865091', '#efa2c0'],
    cloud: ['#f3b4d9', '#7068ad'],
    ridge: ['#8f83c9', '#6f66ad', '#525096'],
    bridge: ['#24264f', '#4c4f83'],
    keyLight: '#f3a7d2',
    worldForm: 'ocean',
  },
  'nacre-terraces': {
    id: 'nacre-terraces',
    sky: ['#ff8a4c', '#6f2140', '#140f2b'],
    fog: '#542238',
    ground: ['#10090f', '#261016', '#51181b', '#b63c1e'],
    grass: ['#1c0808', '#8f1e12', '#f05a1e', '#fff0a0'],
    cloud: ['#ba4a32', '#32152a'],
    ridge: ['#713027', '#471c22', '#24131d'],
    bridge: ['#1a1117', '#66301f'],
    keyLight: '#ff7a31',
    worldForm: 'terraces',
  },
  'glass-delta': {
    id: 'glass-delta',
    sky: ['#ffc5df', '#8ea8ee', '#303e92'],
    fog: '#8b7bb5',
    ground: ['#16163f', '#293263', '#405f72', '#b783b5'],
    grass: ['#171944', '#3e497a', '#9c6da1', '#f4b7d2'],
    cloud: ['#ffd6e9', '#8782c1'],
    ridge: ['#9a91c8', '#716da9', '#4b518e'],
    bridge: ['#252750', '#7777aa'],
    keyLight: '#ffd0e6',
    worldForm: 'delta',
  },
  'harmonic-dunes': {
    id: 'harmonic-dunes',
    sky: ['#f28ed1', '#704fbe', '#191a65'],
    fog: '#65428e',
    ground: ['#1a073a', '#3f1464', '#7f2d94', '#e25cae'],
    grass: ['#210841', '#57136f', '#a2369c', '#f68bc9'],
    cloud: ['#f3a1d6', '#7048a4'],
    ridge: ['#8755ad', '#60378f', '#3b2678'],
    bridge: ['#281247', '#713585'],
    keyLight: '#f68acb',
    worldForm: 'dunes',
  },
};

export function musicLiquidLandscapeIndex(id: MusicLiquidLandscapeId): number {
  return {
    'tidal-meadow': 0,
    'nacre-terraces': 1,
    'glass-delta': 3,
    'harmonic-dunes': 4,
    'combined-world': 5,
  }[id];
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
