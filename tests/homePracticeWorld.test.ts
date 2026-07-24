import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  HOME_TERRITORY_ANCHORS,
  territoryForPractice,
} from '@/lib/experience/homePracticeWorld';

const root = process.cwd();

describe('neutral Home practice world', () => {
  it('defines five stable, bounded, non-overlapping semantic anchors', () => {
    expect(HOME_TERRITORY_ANCHORS.map(anchor => anchor.id)).toEqual([
      'about',
      'music',
      'play',
      'ai-futures',
      'life-systems',
    ]);
    expect(new Set(HOME_TERRITORY_ANCHORS.map(anchor => (
      `${anchor.position.x}:${anchor.position.y}`
    ))).size).toBe(5);
    expect(HOME_TERRITORY_ANCHORS.every(anchor => (
      anchor.position.x >= 8
      && anchor.position.x <= 92
      && anchor.position.y >= 8
      && anchor.position.y <= 92
    ))).toBe(true);
    expect(territoryForPractice('music-performance')?.id).toBe('music');
    expect(HOME_TERRITORY_ANCHORS.find(anchor => anchor.id === 'about')?.destinationHref)
      .toBe('/about');
  });

  it('uses one shared piano renderer and lightweight semantic territory instruments', async () => {
    const [component, hero] = await Promise.all([
      readFile(
        path.join(root, 'src/components/home/HomePracticeWorldNeutral.tsx'),
        'utf8',
      ),
      readFile(path.join(root, 'src/components/HeroCube.tsx'), 'utf8'),
    ]);

    expect(component).toContain('<HeroCube variant="practice-neutral" />');
    expect(component).toContain('HOME_TERRITORY_ANCHORS.map');
    expect(component).toContain("type: 'sample-proximity'");
    expect(component).toContain("type: 'focus'");
    expect(component).toContain("type: 'select'");
    expect(component).not.toMatch(/ambient-proof|observatory-proof|archive-core-proof/);
    expect(hero).toContain("'practice-neutral'");
    expect(hero).toContain('musicProof || practiceNeutral ? <PianoGhost /> : null');
  });

  it('keeps the proof additive, private, and separate from the canonical Home route', async () => {
    const [proofPage, homePage] = await Promise.all([
      readFile(path.join(root, 'src/app/home-world-proof/page.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/page.tsx'), 'utf8'),
    ]);

    expect(proofPage).toContain('robots: { index: false, follow: false }');
    expect(proofPage).toContain('<HomePracticeWorldNeutral />');
    expect(homePage).not.toContain('HomePracticeWorldNeutral');
  });
});
