import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('Museum music chamber proof', () => {
  it('reuses the homepage renderer rather than maintaining a second visual language', async () => {
    const page = await readFile(
      path.join(root, 'src/app/projects/music-proof/page.tsx'),
      'utf8',
    );
    const source = await readFile(
      path.join(root, 'src/components/HeroCube.tsx'),
      'utf8',
    );
    expect(page).toContain("import HeroCube from '@/components/HeroCube'");
    expect(page).toContain('<HeroCube variant="music-proof" />');
    expect(source).toContain("useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')");
    expect(source).toContain("export type HeroCubeVariant = 'home' | 'music-proof'");
    expect(source).toContain('data-home-variant={variant}');
    expect(source).toContain('function PianoResonanceField');
    expect(source).toContain('function PianoGhost');
    expect(source).toContain('musicProof ? <PianoGhost /> : null');
    expect(source).toContain('opacity={0.05}');
    expect(source).not.toContain('color="#9ea8d4"');
    expect(source).toContain('<Particles count={10000}');
  });

  it('exposes a private bounded route', async () => {
    const page = await readFile(
      path.join(root, 'src/app/projects/music-proof/page.tsx'),
      'utf8',
    );
    expect(page).toContain("title: 'Home Music Proof | Mark Perera'");
    expect(page).toContain('robots: { index: false, follow: false }');
  });
});
