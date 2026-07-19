export const ART_DIRECTION_ASSETS = {
  museum: {
    src: '/images/art-direction/museum-signal-ecology.webp',
    alt: 'An impossible nocturnal ecology of luminous instruments, living diagrams, and project specimens',
  },
  home: {
    src: '/images/art-direction/home-painterly-presence.webp',
    alt: 'A painterly spectral presence emerging from a field of color and notation',
  },
  about: {
    src: '/images/art-direction/about-impossible-artifact.webp',
    alt: 'A translucent impossible instrument containing musical notation and refracted light',
  },
  dreamlife: {
    src: '/images/art-direction/dreamlife-liquid-nacre.webp',
    alt: 'A nacreous blue-violet current folding around a luminous pearl',
  },
  lifeinbox: {
    src: '/images/art-direction/lifeinbox-spectral-vessel.webp',
    alt: 'A spectral receiving vessel shaped by light, vapor, and crystalline signal',
  },
  sudoku: {
    src: '/images/art-direction/sudoku-diagram-organism.webp',
    alt: 'A living diagram organism made from translucent geometry and fine evidence lines',
  },
} as const;

export const MUSEUM_SIGNAL_POSITIONS = {
  lifeinbox: { x: 9, y: 20, align: 'right' },
  'kitsune-karuta': { x: 27, y: 25, align: 'right' },
  dreamlife: { x: 49, y: 12, align: 'right' },
  'story-app': { x: 43, y: 45, align: 'left' },
  'discord-sudoku-activity': { x: 77, y: 39, align: 'left' },
  'group-finder': { x: 17, y: 72, align: 'right' },
  'discord-sync-messaging': { x: 39, y: 70, align: 'right' },
  'discord-bot': { x: 62, y: 72, align: 'left' },
  'game-mod': { x: 89, y: 74, align: 'left' },
} as const;

export type MuseumSignalSlug = keyof typeof MUSEUM_SIGNAL_POSITIONS;

export function getMuseumSignalPosition(slug: string, index: number) {
  return MUSEUM_SIGNAL_POSITIONS[slug as MuseumSignalSlug] ?? {
    x: 12 + ((index * 31) % 76),
    y: 18 + ((index * 23) % 65),
    align: index % 2 ? 'left' : 'right',
  };
}
