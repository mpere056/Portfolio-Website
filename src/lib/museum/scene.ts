import { getMuseumSignalPosition } from '../artDirection';

export interface MuseumScenePoint {
  x: number;
  y: number;
}

export interface MuseumSceneFrame {
  pointer: MuseumScenePoint;
  aperture: MuseumScenePoint;
  energy: number;
  drift: MuseumScenePoint;
  apertureStrength: number;
  filamentStrength: number;
  particleCount: number;
  settled: boolean;
}

export interface MuseumSceneLayer {
  id: string;
  role: 'stable' | 'ambient' | 'responsive' | 'stateful' | 'interactive' | 'evidence' | 'utility';
  medium: 'raster' | 'css' | 'canvas' | 'svg' | 'dom';
  driver: string;
  calmBehavior: string;
}

export const MUSEUM_SCENE_LAYERS = [
  { id: 'museum:matte', role: 'stable', medium: 'raster', driver: 'none', calmBehavior: 'Always visible as the approved still checksum.' },
  { id: 'museum:membrane', role: 'responsive', medium: 'css', driver: 'pointer and focused signal', calmBehavior: 'Settles onto the active signal without pointer drift.' },
  { id: 'museum:particles', role: 'ambient', medium: 'canvas', driver: 'stimulation and active signal', calmBehavior: 'Stops completely for reduced motion or hidden scenes.' },
  { id: 'museum:aperture', role: 'stateful', medium: 'css', driver: 'selected project', calmBehavior: 'Remains as a still local emphasis.' },
  { id: 'museum:relationships', role: 'evidence', medium: 'svg', driver: 'reviewed selected-project relationships', calmBehavior: 'Remains legible without animated drawing.' },
  { id: 'museum:signals', role: 'interactive', medium: 'dom', driver: 'pointer, focus, and selection', calmBehavior: 'Preserves immediate focus and selection feedback.' },
  { id: 'museum:utilities', role: 'utility', medium: 'dom', driver: 'navigation and recovery', calmBehavior: 'Unaffected.' },
] as const satisfies readonly MuseumSceneLayer[];

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}

export function normalizeMuseumScenePoint(point: MuseumScenePoint): MuseumScenePoint {
  return { x: clamp(point.x), y: clamp(point.y) };
}

export function getMuseumSceneFrame({
  pointer,
  activeSlug,
  selectedSlug,
  stimulation,
  reducedMotion,
  visible = true,
}: {
  pointer: MuseumScenePoint;
  activeSlug?: string;
  selectedSlug?: string;
  stimulation: number;
  reducedMotion: boolean;
  visible?: boolean;
}): MuseumSceneFrame {
  const normalizedPointer = normalizeMuseumScenePoint(pointer);
  const activePosition = activeSlug
    ? getMuseumSignalPosition(activeSlug, 0)
    : undefined;
  const aperture = activePosition
    ? { x: activePosition.x / 100, y: activePosition.y / 100 }
    : normalizedPointer;
  const requestedEnergy = clamp(stimulation);
  const energy = reducedMotion || !visible ? 0 : 0.18 + requestedEnergy * 0.82;

  return {
    pointer: reducedMotion ? aperture : normalizedPointer,
    aperture,
    energy,
    drift: {
      x: (normalizedPointer.x - 0.5) * 22 * energy,
      y: (normalizedPointer.y - 0.5) * 16 * energy,
    },
    apertureStrength: activeSlug ? 0.34 + energy * 0.54 : 0,
    filamentStrength: selectedSlug ? 0.36 + energy * 0.5 : 0.08,
    particleCount: reducedMotion || !visible ? 0 : Math.round(12 + energy * 36),
    settled: reducedMotion || !visible,
  };
}

export function getMuseumSignalProximity(
  pointer: MuseumScenePoint,
  slug: string,
  index: number,
) {
  const position = getMuseumSignalPosition(slug, index);
  const dx = pointer.x - position.x / 100;
  const dy = pointer.y - position.y / 100;
  return clamp(1 - Math.hypot(dx, dy) / 0.34);
}

const FILAMENT_TARGETS = [
  { x: 0.94, y: 0.12 },
  { x: 0.9, y: 0.52 },
  { x: 0.82, y: 0.9 },
] as const;

export function getMuseumFilamentPath(slug: string, index: number) {
  const source = getMuseumSignalPosition(slug, 0);
  const target = FILAMENT_TARGETS[index % FILAMENT_TARGETS.length];
  const x1 = source.x * 12;
  const y1 = source.y * 8.2;
  const x2 = target.x * 1200;
  const y2 = target.y * 820;
  const bend = index % 2 === 0 ? -110 : 110;
  const c1x = x1 + (x2 - x1) * 0.38;
  const c2x = x1 + (x2 - x1) * 0.72;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} C${c1x.toFixed(1)} ${(y1 + bend).toFixed(1)} ${c2x.toFixed(1)} ${(y2 - bend * 0.45).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
