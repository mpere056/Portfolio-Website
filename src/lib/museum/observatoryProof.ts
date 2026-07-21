export const MUSEUM_OBSERVATORY_PROOF_ASPECT = 852 / 790;

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
    temporalJob: 'migrate nacre light and refract the central lens without wobbling the building',
  },
  {
    id: 'observatory:city',
    medium: 'sampled-shader',
    temporalJob: 'send illumination through different crystal towers on independent delayed cycles',
  },
  {
    id: 'observatory:portal',
    medium: 'sampled-shader',
    temporalJob: 'keep the device body fixed while its aperture refracts, scans, and emits wavefronts',
  },
  {
    id: 'observatory:currents',
    medium: 'procedural-shader',
    temporalJob: 'carry unequal cyan and gold packets through the lattice instead of oscillating a raster ribbon',
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
