export const MUSEUM_OBSERVATORY_PROOF_ASPECT = 852 / 790;

export const MUSEUM_OBSERVATORY_FLOW_TIMING = {
  leadCrossingSeconds: 2.4,
  coreCrossingSeconds: 1.8,
  copperCrossingSeconds: 4.2,
  ivoryCrossingSeconds: 5.4,
  archCrossingSeconds: 7,
} as const;

export interface MuseumObservatoryFlowTuning {
  color: string;
  horizontalSizing: number;
  verticalSizing: number;
  wispDensity: number;
  wispSpeed: number;
  wispIntensity: number;
  flowSpeed: number;
  flowStrength: number;
  fogIntensity: number;
  fogScale: number;
  fogFallSpeed: number;
  decay: number;
  falloffStart: number;
}

export type MuseumObservatoryFlowFamilyId =
  | 'cyan-lead'
  | 'gold-companion'
  | 'copper-canopy'
  | 'ivory-undertow'
  | 'nacre-arch'
  | 'spectral-thread';

export type MuseumObservatoryFlowComposition = Record<
  MuseumObservatoryFlowFamilyId,
  MuseumObservatoryFlowTuning
>;

export interface MuseumObservatoryFlowFamily {
  id: MuseumObservatoryFlowFamilyId;
  label: string;
  origin: readonly [number, number];
  rotation: number;
  crop: readonly [number, number, number, number];
  filamentCount: number;
  filamentSpread: number;
  filamentWidth: number;
  filamentWave: number;
  horizontalContribution: number;
  verticalContribution: number;
  opacity: number;
  timeOffset: number;
  order: number;
}

export const MUSEUM_OBSERVATORY_FLOW_CONTROLS: MuseumObservatoryFlowTuning = {
  color: '#ff79c6',
  horizontalSizing: 0.5,
  verticalSizing: 2,
  wispDensity: 1,
  wispSpeed: 15,
  wispIntensity: 5,
  flowSpeed: 0.35,
  flowStrength: 0.25,
  fogIntensity: 0.45,
  fogScale: 0.3,
  fogFallSpeed: 0.6,
  decay: 1.1,
  falloffStart: 1.2,
};

export const MUSEUM_OBSERVATORY_FLOW_COMPOSITION_CONTROLS: MuseumObservatoryFlowComposition = {
  'cyan-lead': {
    color: '#61edf0',
    horizontalSizing: 0.22,
    verticalSizing: 4.25,
    wispDensity: 1.35,
    wispSpeed: 17,
    wispIntensity: 6.2,
    flowSpeed: 1.18,
    flowStrength: 0.84,
    fogIntensity: 0.16,
    fogScale: 0.34,
    fogFallSpeed: 0.72,
    decay: 2.2,
    falloffStart: 2.05,
  },
  'gold-companion': {
    color: '#f3c96b',
    horizontalSizing: 0.16,
    verticalSizing: 3.9,
    wispDensity: 0.88,
    wispSpeed: 12.5,
    wispIntensity: 4.6,
    flowSpeed: 0.92,
    flowStrength: 0.74,
    fogIntensity: 0.08,
    fogScale: 0.4,
    fogFallSpeed: 0.48,
    decay: 1.95,
    falloffStart: 1.72,
  },
  'copper-canopy': {
    color: '#e77d4f',
    horizontalSizing: 0.14,
    verticalSizing: 4.8,
    wispDensity: 1.05,
    wispSpeed: 10.5,
    wispIntensity: 4.8,
    flowSpeed: 0.72,
    flowStrength: 0.76,
    fogIntensity: 0.09,
    fogScale: 0.28,
    fogFallSpeed: 0.44,
    decay: 1.9,
    falloffStart: 1.62,
  },
  'ivory-undertow': {
    color: '#bfe4dc',
    horizontalSizing: 0.13,
    verticalSizing: 4.35,
    wispDensity: 0.95,
    wispSpeed: 9.5,
    wispIntensity: 4.1,
    flowSpeed: 0.66,
    flowStrength: 0.7,
    fogIntensity: 0.07,
    fogScale: 0.31,
    fogFallSpeed: 0.4,
    decay: 1.82,
    falloffStart: 1.48,
  },
  'nacre-arch': {
    color: '#a8c9c3',
    horizontalSizing: 0.1,
    verticalSizing: 4.7,
    wispDensity: 0.72,
    wispSpeed: 7.5,
    wispIntensity: 3.25,
    flowSpeed: 0.52,
    flowStrength: 0.52,
    fogIntensity: 0.06,
    fogScale: 0.37,
    fogFallSpeed: 0.32,
    decay: 1.62,
    falloffStart: 1.3,
  },
  'spectral-thread': {
    color: '#ead9ae',
    horizontalSizing: 0.08,
    verticalSizing: 5,
    wispDensity: 0.55,
    wispSpeed: 19,
    wispIntensity: 3,
    flowSpeed: 1.35,
    flowStrength: 0.72,
    fogIntensity: 0.03,
    fogScale: 0.5,
    fogFallSpeed: 0.8,
    decay: 1.5,
    falloffStart: 1.15,
  },
};

export const MUSEUM_OBSERVATORY_FLOW_FAMILIES = [
  {
    id: 'copper-canopy',
    label: 'Copper canopy',
    origin: [0.94, 0.24],
    rotation: 1.57,
    crop: [0, 0.12, 1, 0.33],
    filamentCount: 9,
    filamentSpread: 1.05,
    filamentWidth: 0.15,
    filamentWave: 2.7,
    horizontalContribution: 0.025,
    verticalContribution: 1,
    opacity: 0.6,
    timeOffset: 3.7,
    order: 4.35,
  },
  {
    id: 'nacre-arch',
    label: 'Nacre arch',
    origin: [0.9, 0.17],
    rotation: 1.69,
    crop: [0.08, 0.05, 0.95, 0.27],
    filamentCount: 4,
    filamentSpread: 1.28,
    filamentWidth: 0.14,
    filamentWave: 4.2,
    horizontalContribution: 0.015,
    verticalContribution: 1,
    opacity: 0.32,
    timeOffset: 8.4,
    order: 4.45,
  },
  {
    id: 'ivory-undertow',
    label: 'Ivory undertow',
    origin: [0.76, 0.59],
    rotation: 1.93,
    crop: [0.02, 0.27, 0.82, 0.86],
    filamentCount: 10,
    filamentSpread: 1.12,
    filamentWidth: 0.16,
    filamentWave: 4.1,
    horizontalContribution: 0.025,
    verticalContribution: 1,
    opacity: 0.66,
    timeOffset: 5.2,
    order: 4.55,
  },
  {
    id: 'cyan-lead',
    label: 'Cyan lead',
    origin: [0.65, 0.43],
    rotation: 1.25,
    crop: [0, 0.13, 0.72, 0.63],
    filamentCount: 10,
    filamentSpread: 1.18,
    filamentWidth: 0.18,
    filamentWave: 3.35,
    horizontalContribution: 0.035,
    verticalContribution: 1,
    opacity: 0.78,
    timeOffset: 0.8,
    order: 7.2,
  },
  {
    id: 'gold-companion',
    label: 'Gold companion',
    origin: [0.67, 0.45],
    rotation: 1.34,
    crop: [0.04, 0.16, 0.73, 0.64],
    filamentCount: 5,
    filamentSpread: 1.36,
    filamentWidth: 0.15,
    filamentWave: 3.1,
    horizontalContribution: 0.02,
    verticalContribution: 1,
    opacity: 0.58,
    timeOffset: 6.1,
    order: 7.25,
  },
  {
    id: 'spectral-thread',
    label: 'Spectral thread',
    origin: [0.98, 0.37],
    rotation: 1.57,
    crop: [0, 0.29, 1, 0.49],
    filamentCount: 3,
    filamentSpread: 1.54,
    filamentWidth: 0.13,
    filamentWave: 2.45,
    horizontalContribution: 0.01,
    verticalContribution: 1,
    opacity: 0.36,
    timeOffset: 10.7,
    order: 7.3,
  },
] as const satisfies readonly MuseumObservatoryFlowFamily[];

export const MUSEUM_OBSERVATORY_PERFORMANCE = {
  renderDpr: 0.9,
  idleFps: 24,
  attentionFps: 36,
  fogOctaves: 5,
  orbDetail: 3,
  particles: {
    far: 220,
    middle: 300,
    near: 180,
  },
  bounds: {
    rearFlow: [0, 0.2, 1, 1],
    portal: [0.02, 0.03, 0.51, 0.52],
    observatory: [0.38, 0.22, 1, 1],
    city: [0.49, 0.03, 1, 0.58],
    frontFlow: [0, 0.27, 1, 1],
    diagram: [0.42, 0.27, 1, 0.93],
  },
} as const;

export const MUSEUM_OBSERVATORY_PROOF_ASSETS = {
  field: '/images/art-direction/museum-observatory-proof/field.webp',
  observatory: '/images/art-direction/museum-observatory-proof/observatory.webp',
  city: '/images/art-direction/museum-observatory-proof/city.webp',
  portal: '/images/art-direction/museum-observatory-proof/portal.webp',
  fallback: '/images/art-direction/museum-observatory-proof/fallback.webp',
} as const;

export type ObservatoryProofMedium =
  | 'sampled-shader'
  | 'procedural-shader'
  | 'procedural-geometry'
  | 'stable-fallback';

export const MUSEUM_OBSERVATORY_PROOF_LAYERS = [
  {
    id: 'observatory:field',
    medium: 'sampled-shader',
    temporalJob: 'hold the particle-free terrain while procedural caustics and two haze depths cross it',
  },
  {
    id: 'observatory:lattice',
    medium: 'sampled-shader',
    temporalJob: 'preserve the architectural silhouette while nacre light migrates through its isolated optical assembly',
  },
  {
    id: 'observatory:refraction',
    medium: 'sampled-shader',
    temporalJob: 'migrate nacre light through the fixed lattice without wobbling the building',
  },
  {
    id: 'observatory:orb',
    medium: 'procedural-geometry',
    temporalJob: 'rotate a true three-dimensional pearl instrument continuously beneath its independent optical diagram',
  },
  {
    id: 'observatory:city',
    medium: 'sampled-shader',
    temporalJob: 'ease selected skyscraper windows between off, dim, and lit states while excluding the foreground dome, podium, and steps',
  },
  {
    id: 'observatory:portal',
    medium: 'sampled-shader',
    temporalJob: 'keep the device body fixed while its aperture refracts, scans, and emits wavefronts',
  },
  {
    id: 'observatory:laser-flow-composition',
    medium: 'procedural-shader',
    temporalJob: 'shape six cropped native LaserFlow families into independently phased braided filaments with traveling pressure, segmented wisps, five-octave fog, and local attention',
  },
  {
    id: 'observatory:atmosphere',
    medium: 'procedural-shader',
    temporalJob: 'advect two haze depths across and behind the fixed structure',
  },
  {
    id: 'observatory:diagram',
    medium: 'procedural-shader',
    temporalJob: 'draw changing apertures, diffraction rings, and measured spokes around real pivots',
  },
  {
    id: 'observatory:particles',
    medium: 'procedural-geometry',
    temporalJob: 'replace every baked particle with near, middle, and far signal matter on independent clocks',
  },
  {
    id: 'observatory:attention',
    medium: 'procedural-shader',
    temporalJob: 'increase local refraction, light, current speed, and optical articulation near attention',
  },
  {
    id: 'observatory:fallback',
    medium: 'stable-fallback',
    temporalJob: 'preserve a particle-free, low-emission checksum for reduced motion and renderer failure',
  },
] as const satisfies readonly {
  id: string;
  medium: ObservatoryProofMedium;
  temporalJob: string;
}[];
