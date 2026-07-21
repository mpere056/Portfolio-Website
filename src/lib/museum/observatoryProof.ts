export const MUSEUM_OBSERVATORY_PROOF_ASPECT = 852 / 790;

export const MUSEUM_OBSERVATORY_PROOF_ASSETS = {
  crop: '/images/art-direction/museum-observatory-proof.webp',
} as const;

export type ObservatoryProofMedium =
  | 'sampled-shader'
  | 'procedural-shader'
  | 'procedural-geometry'
  | 'stable-fallback';

export const MUSEUM_OBSERVATORY_PROOF_LAYERS = [
  {
    id: 'observatory:structure',
    medium: 'sampled-shader',
    temporalJob: 'preserve the architectural silhouette while rotating three isolated optical assemblies',
  },
  {
    id: 'observatory:refraction',
    medium: 'sampled-shader',
    temporalJob: 'migrate nacre light and refract the central lens without wobbling the building',
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
    temporalJob: 'move sparse near and far signal matter on a clock independent from the optics',
  },
  {
    id: 'observatory:attention',
    medium: 'procedural-shader',
    temporalJob: 'increase local refraction, light, current speed, and optical articulation near attention',
  },
  {
    id: 'observatory:fallback',
    medium: 'stable-fallback',
    temporalJob: 'preserve the approved crop for reduced motion and renderer failure',
  },
] as const satisfies readonly {
  id: string;
  medium: ObservatoryProofMedium;
  temporalJob: string;
}[];

