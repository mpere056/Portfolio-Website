export const MUSEUM_ARCHIVE_PROOF_ASPECT = 16 / 9;

export const MUSEUM_ARCHIVE_PROOF_SYSTEMS = [
  {
    id: 'archive:field',
    medium: 'procedural-shader',
    temporalJob: 'slow atmospheric advection, deep-field light, and changing negative space',
  },
  {
    id: 'archive:orbital-core',
    medium: 'procedural-geometry',
    temporalJob: 'multi-axis shells, satellites, refraction, and independently phased interior light',
  },
  {
    id: 'archive:book',
    medium: 'procedural-geometry',
    temporalJob: 'rooted spine with separately flexing page leaves and traveling edge illumination',
  },
  {
    id: 'archive:city',
    medium: 'procedural-geometry',
    temporalJob: 'fixed miniature architecture with unsynchronized interior-light rhythms',
  },
  {
    id: 'archive:doorway',
    medium: 'procedural-geometry',
    temporalJob: 'breathing portal depth, threshold light, and outward-moving mist',
  },
  {
    id: 'archive:currents',
    medium: 'procedural-shader',
    temporalJob: 'depth-split transport from orbital memory into the open book',
  },
  {
    id: 'archive:particles',
    medium: 'procedural-geometry',
    temporalJob: 'independent dust, ink, and nacre matter crossing at three speeds',
  },
  {
    id: 'archive:fallback',
    medium: 'stable-fallback',
    temporalJob: 'reduced-motion and renderer-failure context only',
  },
] as const;

export const MUSEUM_ARCHIVE_PROOF_PERFORMANCE = {
  dpr: 0.85,
  particleCount: 460,
  currentSegments: 88,
  pageSegments: 18,
  towerCount: 18,
} as const;

export function getArchiveLocalAttention(
  pointer: readonly [number, number],
  target: readonly [number, number],
  radius: number,
  active: boolean,
) {
  if (!active) return 0;
  const distance = Math.hypot(pointer[0] - target[0], pointer[1] - target[1]);
  const proximity = Math.min(1, Math.max(0, 1 - distance / radius));
  return proximity * proximity * (3 - 2 * proximity);
}
