export const MUSEUM_AMBIENT_PROOF_ASPECT = 1402 / 1122;

export const MUSEUM_AMBIENT_PROOF_ASSETS = {
  cleanField: '/images/art-direction/museum-ambient-proof/clean-field.webp',
  coral: '/images/art-direction/museum-ambient-proof/coral-groups.webp',
  coralDeformation: '/images/art-direction/museum-ambient-proof/coral-deformation.webp',
  organism: '/images/art-direction/museum-ambient-proof/organism-body.webp',
  rings: '/images/art-direction/museum-ambient-proof/organism-rings.webp',
  vaporBackground: '/images/art-direction/museum-ambient-proof/vapor-background.webp',
  vaporVertical: '/images/art-direction/museum-ambient-proof/vapor-vertical.webp',
  vaporBasin: '/images/art-direction/museum-ambient-proof/vapor-basin.webp',
  occluderSpores: '/images/art-direction/museum-ambient-proof/occluder-spores.webp',
  occluderShadowA: '/images/art-direction/museum-ambient-proof/occluder-shadow-a.webp',
  occluderShadowB: '/images/art-direction/museum-ambient-proof/occluder-shadow-b.webp',
  fallback: '/images/art-direction/museum-ambient-proof/fallback.webp',
} as const;

export type AmbientProofMedium = 'plate-shader' | 'procedural-shader' | 'procedural-geometry' | 'stable-fallback';

export interface AmbientProofResponseProfile {
  target: readonly [number, number];
  radius: number;
  pointerLag: number;
  attack: number;
  release: number;
}

// Pointer response is deliberately local and asynchronous. Idle motion is owned by
// each shader; these profiles only let a visitor redirect one nearby system.
export const MUSEUM_AMBIENT_PROOF_RESPONSES = {
  field: { target: [0.5, 0.5], radius: 0.13, pointerLag: 2.4, attack: 2.2, release: 0.7 },
  coral: { target: [0.24, 0.38], radius: 0.2, pointerLag: 1.1, attack: 1.5, release: 0.48 },
  organism: { target: [0.42, 0.53], radius: 0.14, pointerLag: 3.8, attack: 3.1, release: 0.82 },
  rings: { target: [0.56, 0.53], radius: 0.1, pointerLag: 6.5, attack: 5.4, release: 1.2 },
  current: { target: [0.73, 0.5], radius: 0.17, pointerLag: 8.2, attack: 6.8, release: 1.7 },
} as const satisfies Record<string, AmbientProofResponseProfile>;

export const MUSEUM_AMBIENT_PROOF_LAYERS = [
  { id: 'proof:field', medium: 'plate-shader', temporalJob: 'moving illumination, fog, and ground caustics over a spatially stable anchor' },
  { id: 'proof:atmosphere', medium: 'procedural-shader', temporalJob: 'advecting density and depth-separated vapor, assisted by authored alpha volumes' },
  { id: 'proof:coral', medium: 'plate-shader', temporalJob: 'idle root-preserving deformation, local tip phases, and traveling bioluminescence' },
  { id: 'proof:organism', medium: 'plate-shader', temporalJob: 'internal refraction, membrane settling, and migrating emission' },
  { id: 'proof:rings', medium: 'plate-shader', temporalJob: 'opposed receiver rotation around isolated pivots' },
  { id: 'proof:current', medium: 'procedural-shader', temporalJob: 'directional filament flow, traveling packets, and expanding receiver rings' },
  { id: 'proof:particles', medium: 'procedural-geometry', temporalJob: 'sparse depth traversal with independent drift and light response' },
  { id: 'proof:illumination', medium: 'procedural-shader', temporalJob: 'independent amber and cyan light passages bound to material regions' },
  { id: 'proof:occlusion', medium: 'plate-shader', temporalJob: 'rare foreground passages and moving translucent shadows independent of pointer input' },
  { id: 'proof:fallback', medium: 'stable-fallback', temporalJob: 'reduced-motion, WebGL failure, and capture checksum only' },
] as const satisfies readonly { id: string; medium: AmbientProofMedium; temporalJob: string }[];

export interface ProofPlateLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
}

export function toProofScenePlacement(layout: ProofPlateLayout) {
  const canvasWidth = 1402;
  const canvasHeight = 1122;
  return {
    position: [
      ((layout.x + layout.width / 2) / canvasWidth * 2 - 1) * MUSEUM_AMBIENT_PROOF_ASPECT,
      1 - ((layout.y + layout.height / 2) / canvasHeight * 2),
      layout.z,
    ] as [number, number, number],
    size: [
      layout.width / canvasWidth * MUSEUM_AMBIENT_PROOF_ASPECT * 2,
      layout.height / canvasHeight * 2,
    ] as [number, number],
  };
}
