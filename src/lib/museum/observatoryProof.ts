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

export const MUSEUM_OBSERVATORY_FLOW_CONTROLS: MuseumObservatoryFlowTuning = {
  color: '#ffffff',
  horizontalSizing: 1,
  verticalSizing: 1,
  wispDensity: 0.76,
  wispSpeed: 1.08,
  wispIntensity: 1.92,
  flowSpeed: 2.15,
  flowStrength: 1.24,
  fogIntensity: 0.54,
  fogScale: 5.2,
  fogFallSpeed: 0.66,
  decay: 2,
  falloffStart: 1,
};

export const MUSEUM_OBSERVATORY_PERFORMANCE = {
  renderDpr: 0.9,
  idleFps: 24,
  attentionFps: 36,
  fogOctaves: 3,
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
    id: 'observatory:flows-rear',
    medium: 'procedural-shader',
    temporalJob: 'visibly traverse code-generated copper, ivory, and high arch currents behind the instruments on independent clocks',
  },
  {
    id: 'observatory:flows-front',
    medium: 'procedural-shader',
    temporalJob: 'visibly traverse code-generated cyan and gold strands, laser packets, wisps, and a spectral signal across the foreground',
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
