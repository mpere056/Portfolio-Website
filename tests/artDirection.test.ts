import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ART_DIRECTION_ASSETS,
  MUSEUM_SIGNAL_POSITIONS,
  getMuseumSignalPosition,
} from '@/lib/artDirection';

describe('art direction registry', () => {
  it('keeps every production artwork addressable and present', () => {
    for (const asset of Object.values(ART_DIRECTION_ASSETS)) {
      expect(asset.src).toMatch(/^\/images\/art-direction\/.+\.webp$/);
      expect(asset.alt.length).toBeGreaterThan(24);
      expect(existsSync(join(process.cwd(), 'public', asset.src))).toBe(true);
    }
  });

  it('gives all nine Museum signals stable coordinates inside the visual field', () => {
    expect(Object.keys(MUSEUM_SIGNAL_POSITIONS)).toHaveLength(9);
    for (const position of Object.values(MUSEUM_SIGNAL_POSITIONS)) {
      expect(position.x).toBeGreaterThanOrEqual(5);
      expect(position.x).toBeLessThanOrEqual(95);
      expect(position.y).toBeGreaterThanOrEqual(5);
      expect(position.y).toBeLessThanOrEqual(90);
    }
  });

  it('provides a bounded fallback for future project signals', () => {
    expect(getMuseumSignalPosition('future-project', 12)).toEqual({ x: 80, y: 34, align: 'right' });
  });
});
