import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getArchiveLocalAttention,
  MUSEUM_ARCHIVE_PROOF_PERFORMANCE,
  MUSEUM_ARCHIVE_PROOF_SYSTEMS,
} from '../src/lib/museum/archiveProof';

const root = process.cwd();

describe('Museum archive core proof', () => {
  it('assigns a temporal job to every bounded system', () => {
    expect(MUSEUM_ARCHIVE_PROOF_SYSTEMS).toHaveLength(8);
    expect(MUSEUM_ARCHIVE_PROOF_SYSTEMS.every(system => system.temporalJob.length > 24)).toBe(true);
    expect(MUSEUM_ARCHIVE_PROOF_SYSTEMS.find(system => system.id === 'archive:fallback')?.medium)
      .toBe('stable-fallback');
  });

  it('keeps the initial rendering budget bounded', () => {
    expect(MUSEUM_ARCHIVE_PROOF_PERFORMANCE.dpr).toBeLessThanOrEqual(0.9);
    expect(MUSEUM_ARCHIVE_PROOF_PERFORMANCE.particleCount).toBeLessThanOrEqual(500);
    expect(MUSEUM_ARCHIVE_PROOF_PERFORMANCE.currentSegments).toBeLessThanOrEqual(96);
    expect(MUSEUM_ARCHIVE_PROOF_PERFORMANCE.towerCount).toBeLessThanOrEqual(20);
  });

  it('limits object attention to the nearby authored region', () => {
    expect(getArchiveLocalAttention([0.42, 0.32], [0.42, 0.32], 0.2, true)).toBe(1);
    expect(getArchiveLocalAttention([0.8, 0.8], [0.42, 0.32], 0.2, true)).toBe(0);
    expect(getArchiveLocalAttention([0.42, 0.32], [0.42, 0.32], 0.2, false)).toBe(0);
  });

  it('mounts a code-first scene with calm and Museum attention paths', async () => {
    const source = await readFile(
      path.join(root, 'src/components/museum/MuseumArchiveCoreProof.tsx'),
      'utf8',
    );
    expect(source).toContain('Animated central Museum archive compositor');
    expect(source).toContain('function OrbitalCore');
    expect(source).toContain('function LivingBook');
    expect(source).toContain('function ArchiveCurrent');
    expect(source).toContain('function ArchiveParticles');
    expect(source).toContain('getMuseumSceneFrame');
    expect(source).toContain('MuseumParticleField');
    expect(source).toContain("frameloop={visible ? 'always' : 'never'}");
    expect(source).toContain('reducedMotion ? null');
  });

  it('exposes a private bounded route', async () => {
    const page = await readFile(
      path.join(root, 'src/app/projects/archive-core-proof/page.tsx'),
      'utf8',
    );
    expect(page).toContain("title: 'Museum Archive Core Proof | Mark Perera'");
    expect(page).toContain('robots: { index: false, follow: false }');
  });
});
