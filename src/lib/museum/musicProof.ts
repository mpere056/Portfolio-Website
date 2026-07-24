export const MUSEUM_MUSIC_PROOF_ASPECT = 16 / 9;

export const MUSEUM_MUSIC_PROOF_SYSTEMS = [
  {
    id: 'music:piano-surface',
    medium: 'procedural-point-field',
    temporalJob: 'reconstruct the piano from living matter with register-specific breath and traveling pressure',
  },
  {
    id: 'music:instrument-body',
    medium: 'three-dimensional-model',
    temporalJob: 'hold the recognizable grand-piano form beneath its responsive particulate surface',
  },
  {
    id: 'music:currents',
    medium: 'procedural-line-field',
    temporalJob: 'carry independently timed bass, middle, and treble resonance through the chamber',
  },
  {
    id: 'music:resonators',
    medium: 'procedural-geometry',
    temporalJob: 'translate each register into a separate orbit, bloom, and local attention response',
  },
  {
    id: 'music:atmosphere',
    medium: 'procedural-point-field',
    temporalJob: 'keep quiet notation matter crossing the scene without becoming a star-field backdrop',
  },
  {
    id: 'music:fallback',
    medium: 'stable-fallback',
    temporalJob: 'preserve the chamber composition when motion is reduced or WebGL is unavailable',
  },
] as const;

export const MUSEUM_MUSIC_PROOF_PERFORMANCE = {
  dpr: 0.9,
  pianoPointCount: 6400,
  atmospherePointCount: 220,
  currentCount: 5,
  currentSegments: 72,
} as const;

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function getMusicRegisterAttention(
  pointerX: number,
  registerCenter: number,
  radius: number,
  active: boolean,
) {
  if (!active || radius <= 0) return 0;
  const proximity = clampUnit(1 - Math.abs(pointerX - registerCenter) / radius);
  return proximity * proximity * (3 - 2 * proximity);
}

export function getMusicCurrentEnergy(base: number, attention: number) {
  return Math.max(0, base) * (1 + clampUnit(attention) * 0.72);
}
