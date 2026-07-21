import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const proofDir = path.join(
  process.cwd(),
  'documentation',
  'art-direction',
  '2026-07-20-museum-ambient-proof',
);

type ProofManifest = {
  proof: string;
  stage: string;
  sourceCrop: { runtimeUse: string };
  outputs: Array<{ name: string; width: number; height: number; alpha: boolean }>;
};

describe('Museum ambient material proof', () => {
  it('keeps the source crop reference-only and inventories the generated outputs', async () => {
    const manifest = JSON.parse(
      await readFile(path.join(proofDir, 'asset-manifest.json'), 'utf8'),
    ) as ProofManifest;

    expect(manifest.proof).toBe('museum-west-lower-ecology');
    expect(manifest.stage).toBe('ART-12D');
    expect(manifest.sourceCrop.runtimeUse).toBe('reference-only');
    expect(manifest.outputs).toHaveLength(17);

    for (const output of manifest.outputs) {
      const metadata = await sharp(path.join(proofDir, output.name)).metadata();
      expect(metadata.width).toBe(output.width);
      expect(metadata.height).toBe(output.height);
      expect(metadata.hasAlpha).toBe(output.alpha);
    }
  });

  it('retains transparent edges on every moving color plate', async () => {
    const movingPlates = [
      'coral-groups-trimmed.png',
      'organism-body-alpha.png',
      'organism-rings-alpha.png',
      'directional-current-trimmed.png',
      'vapor-background-alpha.png',
      'vapor-vertical-alpha.png',
      'vapor-basin-alpha.png',
      'occluder-spores-alpha.png',
      'occluder-shadow-a-alpha.png',
      'occluder-shadow-b-alpha.png',
    ];

    for (const name of movingPlates) {
      const { data, info } = await sharp(path.join(proofDir, name))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const cornerAlpha = [
        data[3],
        data[(info.width - 1) * 4 + 3],
        data[(info.width * (info.height - 1)) * 4 + 3],
        data[(info.width * info.height - 1) * 4 + 3],
      ];

      // Soft mattes may retain a near-transparent antialiased edge at a trimmed corner.
      expect(Math.max(...cornerAlpha), name).toBeLessThanOrEqual(16);
    }
  });
});
