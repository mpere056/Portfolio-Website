import type { MuseumExhibitView } from './types';
import { isDepthStage, type DepthStage } from '../portfolioContracts';

export function resolveMuseumHash(
  hash: string,
  exhibits: readonly MuseumExhibitView[],
) {
  const slug = decodeURIComponent(hash.replace(/^#/, '')).trim();
  if (!slug || slug === 'museum-lobby') return undefined;
  return exhibits.some(exhibit => exhibit.slug === slug) ? slug : undefined;
}

export function resolveMuseumStage(
  search: string,
  exhibit: MuseumExhibitView | undefined,
): DepthStage {
  if (!exhibit) return 'signal';
  const requested = new URLSearchParams(search).get('stage');
  return requested
    && isDepthStage(requested)
    && exhibit.supportedStages.includes(requested)
    ? requested
    : 'approach';
}
