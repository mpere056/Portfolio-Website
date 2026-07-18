import type { MuseumExhibitView } from './types';

export function resolveMuseumHash(
  hash: string,
  exhibits: readonly MuseumExhibitView[],
) {
  const slug = decodeURIComponent(hash.replace(/^#/, '')).trim();
  if (!slug || slug === 'museum-lobby') return undefined;
  return exhibits.some(exhibit => exhibit.slug === slug) ? slug : undefined;
}

