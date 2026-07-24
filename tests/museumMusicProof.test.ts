import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getMusicCurrentEnergy,
  getMusicRegisterAttention,
  MUSEUM_MUSIC_PROOF_PERFORMANCE,
  MUSEUM_MUSIC_PROOF_SYSTEMS,
} from '../src/lib/museum/musicProof';

const root = process.cwd();

describe('Museum music chamber proof', () => {
  it('gives every bounded visual system a temporal job', () => {
    expect(MUSEUM_MUSIC_PROOF_SYSTEMS).toHaveLength(6);
    expect(MUSEUM_MUSIC_PROOF_SYSTEMS.every(system => system.temporalJob.length > 30)).toBe(true);
    expect(MUSEUM_MUSIC_PROOF_SYSTEMS.find(system => system.id === 'music:fallback')?.medium)
      .toBe('stable-fallback');
  });

  it('keeps the procedural chamber inside its first-pass rendering budget', () => {
    expect(MUSEUM_MUSIC_PROOF_PERFORMANCE.dpr).toBeLessThanOrEqual(0.9);
    expect(MUSEUM_MUSIC_PROOF_PERFORMANCE.pianoPointCount).toBeLessThanOrEqual(7000);
    expect(MUSEUM_MUSIC_PROOF_PERFORMANCE.atmospherePointCount).toBeLessThanOrEqual(240);
    expect(MUSEUM_MUSIC_PROOF_PERFORMANCE.currentCount).toBe(5);
    expect(MUSEUM_MUSIC_PROOF_PERFORMANCE.currentSegments).toBeLessThanOrEqual(72);
  });

  it('limits register response to the nearby horizontal attention region', () => {
    expect(getMusicRegisterAttention(-0.56, -0.56, 0.5, true)).toBe(1);
    expect(getMusicRegisterAttention(0.56, -0.56, 0.5, true)).toBe(0);
    expect(getMusicRegisterAttention(-0.56, -0.56, 0.5, false)).toBe(0);
    expect(getMusicCurrentEnergy(0.5, 1)).toBeCloseTo(0.86);
  });

  it('reuses the real piano geometry while making its atmosphere code-first', async () => {
    const source = await readFile(
      path.join(root, 'src/components/museum/MuseumMusicProof.tsx'),
      'utf8',
    );
    expect(source).toContain("const PIANO_MODEL = '/models/grand_piano/grand_piano_(GLB).gltf'");
    expect(source).toContain('Animated grand piano resonance chamber');
    expect(source).toContain('function LivingPiano');
    expect(source).toContain('function HarmonicCurrent');
    expect(source).toContain('function RegisterResonator');
    expect(source).toContain('function ChamberMotes');
    expect(source).toContain('getMusicRegisterAttention');
    expect(source).toContain("frameloop={visible ? 'always' : 'never'}");
    expect(source).not.toContain('<Image');
  });

  it('exposes a private bounded route', async () => {
    const page = await readFile(
      path.join(root, 'src/app/projects/music-proof/page.tsx'),
      'utf8',
    );
    expect(page).toContain("title: 'Museum Music Chamber Proof | Mark Perera'");
    expect(page).toContain('robots: { index: false, follow: false }');
  });
});
