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
    note: 'An oceanic flower-world breathing from foreground to horizon.',
  },
  {
    id: 'nacre-terraces',
    title: 'Nacre Terraces',
    note: 'Monumental pearlescent shelves replace the valley and its sky.',
  },
  {
    id: 'resonant-archipelago',
    title: 'Resonant Archipelago',
    note: 'The ground breaks into a suspended choir of liquid islands.',
  },
  {
    id: 'glass-delta',
    title: 'Glass Delta',
    note: 'Prismatic rivers divide the whole world into luminous deltas.',
  },
  {
    id: 'harmonic-dunes',
    title: 'Harmonic Dunes',
    note: 'Vast wave-shaped landforms inhale beneath a ribboned sky.',
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
  worldForm: 'ocean' | 'terraces' | 'islands' | 'delta' | 'dunes';
};

export const MUSIC_WORLD_PROFILES: Record<MusicLiquidLandscapeId, MusicWorldProfile> = {
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
    sky: ['#ffd3bb', '#d88ab8', '#65438f'],
    fog: '#b47c9f',
    ground: ['#2b102f', '#592445', '#a64d67', '#f1ae8d'],
    grass: ['#321234', '#7c2f56', '#d06b79', '#ffd2a4'],
    cloud: ['#ffd9c2', '#be729d'],
    ridge: ['#d7a1aa', '#b36d8d', '#74466f'],
    bridge: ['#3a203d', '#a45c73'],
    keyLight: '#ffd0a8',
    worldForm: 'terraces',
  },
  'resonant-archipelago': {
    id: 'resonant-archipelago',
    sky: ['#8ef0df', '#517fbd', '#172d69'],
    fog: '#427a91',
    ground: ['#071f38', '#0c4355', '#197c75', '#7be0bf'],
    grass: ['#092637', '#145565', '#2e9a88', '#9bedd3'],
    cloud: ['#a5f1dc', '#447da2'],
    ridge: ['#5ca9a4', '#347b86', '#1f536d'],
    bridge: ['#102d45', '#2e7182'],
    keyLight: '#8ef7dc',
    worldForm: 'islands',
  },
  'glass-delta': {
    id: 'glass-delta',
    sky: ['#ffc078', '#477cca', '#101b4d'],
    fog: '#466d91',
    ground: ['#061a36', '#123d5c', '#167d8f', '#e37b55'],
    grass: ['#071d3b', '#16496c', '#20a8b4', '#ff9f68'],
    cloud: ['#ffd6a0', '#4d7ca9'],
    ridge: ['#507fa4', '#285a83', '#18355e'],
    bridge: ['#102746', '#2f7896'],
    keyLight: '#ffaf67',
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
