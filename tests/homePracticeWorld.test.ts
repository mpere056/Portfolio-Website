import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  HOME_TERRITORY_ANCHORS,
  sampleHomeWorldProximities,
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

  it('samples overlapping proximity continuously instead of requiring a click', () => {
    const atPlay = sampleHomeWorldProximities({ x: 0.12, y: 0.48 });
    const betweenPlayAndMusic = sampleHomeWorldProximities({ x: 0.31, y: 0.515 });

    expect(atPlay.play).toBe(1);
    expect(atPlay.play).toBeGreaterThan(atPlay.music);
    expect(betweenPlayAndMusic.play).toBeGreaterThan(0);
    expect(betweenPlayAndMusic.music).toBeGreaterThan(0);
    expect(betweenPlayAndMusic.play).toBeCloseTo(
      betweenPlayAndMusic.music,
      1,
    );
  });

  it('melds the accepted proof runtimes behind fixed landmark instruments', async () => {
    const [component, hero] = await Promise.all([
      readFile(
        path.join(root, 'src/components/home/HomePracticeWorldNeutral.tsx'),
        'utf8',
      ),
      readFile(path.join(root, 'src/components/HeroCube.tsx'), 'utf8'),
    ]);

    expect(component).toContain('<HeroCube variant="practice-neutral" />');
    expect(component).toContain('MUSEUM_AMBIENT_PROOF_ASSETS.coral');
    expect(component).toContain('MUSEUM_AMBIENT_PROOF_ASSETS.organism');
    expect(component).toContain('MUSEUM_OBSERVATORY_PROOF_ASSETS.observatory');
    expect(component).toContain('MUSEUM_OBSERVATORY_PROOF_ASSETS.city');
    expect(component).toContain('data-territory-visual="archive-book"');
    expect(component).toContain("'piano-resonance'");
    expect(component).toContain('HOME_TERRITORY_ANCHORS.map');
    expect(component).toContain('sampleHomeWorldProximities');
    expect(component).toContain('<AmbientProof embedded active={active} />');
    expect(component).toContain('<ObservatoryProof embedded active={active} />');
    expect(component).toContain('<ArchiveProof embedded active={active} />');
    expect(component).toContain('--proof-strength');
    expect(component).toContain('proofLayers.map');
    expect(component).toContain("type: 'sample-proximity'");
    expect(component).toContain("type: 'focus'");
    expect(component).toContain("type: 'select'");
    expect(hero).toContain("'practice-neutral'");
    expect(hero).toContain('musicProof || practiceNeutral ? <PianoGhost /> : null');
    expect(hero).toContain('{!practiceNeutral ? (');
    expect(hero).toContain('{!practiceNeutral ? <CursorLight /> : null}');
  });

  it('retains the rejected compositor source as evidence without routing to it', async () => {
    const proofPage = await readFile(
      path.join(root, 'src/app/home-world-proof/page.tsx'),
      'utf8',
    );

    expect(proofPage).not.toContain('<HomePracticeWorldNeutral />');
    expect(proofPage).toContain('<PianoClearingProof />');
  });
});
