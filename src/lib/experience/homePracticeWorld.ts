import {
  PRACTICE_DEFINITIONS,
  type PracticeId,
} from '../practices';
import type { HomeTerritoryId } from './homeAttention';

export interface HomeTerritoryAnchor {
  id: HomeTerritoryId;
  label: string;
  signal: string;
  position: Readonly<{ x: number; y: number }>;
  practiceId?: PracticeId;
  destinationHref?: string;
}

export const HOME_TERRITORY_ANCHORS: readonly HomeTerritoryAnchor[] = [
  {
    id: 'about',
    label: 'About Mark',
    signal: 'Memory aperture',
    position: { x: 50, y: 12 },
    destinationHref: '/about',
  },
  {
    id: 'music',
    label: PRACTICE_DEFINITIONS['music-performance'].title,
    signal: 'Resonant instrument',
    position: { x: 50, y: 55 },
    practiceId: 'music-performance',
  },
  {
    id: 'play',
    label: PRACTICE_DEFINITIONS['play-community'].title,
    signal: 'Living play ecology',
    position: { x: 12, y: 48 },
    practiceId: 'play-community',
  },
  {
    id: 'life-systems',
    label: PRACTICE_DEFINITIONS['life-systems-tools'].title,
    signal: 'Living systems archive',
    position: { x: 50, y: 88 },
    practiceId: 'life-systems-tools',
  },
] as const;

export function homeTerritoryAnchor(id: HomeTerritoryId) {
  return HOME_TERRITORY_ANCHORS.find(anchor => anchor.id === id);
}

export function territoryForPractice(practiceId: PracticeId) {
  return HOME_TERRITORY_ANCHORS.find(anchor => anchor.practiceId === practiceId);
}

function smoothstep(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

export function sampleHomeWorldProximities(
  pointer: Readonly<{ x: number; y: number }>,
): Record<HomeTerritoryId, number> {
  return Object.fromEntries(HOME_TERRITORY_ANCHORS.map((anchor) => {
    const dx = (pointer.x * 100 - anchor.position.x) / 48;
    const dy = (pointer.y * 100 - anchor.position.y) / 44;
    const distance = Math.hypot(dx, dy);
    return [anchor.id, smoothstep(1 - distance)];
  })) as Record<HomeTerritoryId, number>;
}
