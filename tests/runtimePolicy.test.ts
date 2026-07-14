import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type PackageManifest = {
  engines?: { node?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readPackageManifest(): PackageManifest {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf8')) as PackageManifest;
}

describe('supported runtime bridge policy', () => {
  it('pins the Vercel runtime and narrow framework security bridge', () => {
    const manifest = readPackageManifest();

    expect(manifest.engines?.node).toBe('24.x');
    expect(manifest.dependencies?.next).toBe('16.2.10');
    expect(manifest.dependencies?.react).toBe('19.2.7');
    expect(manifest.dependencies?.['react-dom']).toBe('19.2.7');
    expect(manifest.dependencies?.['@react-three/fiber']).toBe('9.6.1');
    expect(manifest.dependencies?.['@react-three/drei']).toBe('10.7.7');
    expect(manifest.dependencies?.['@react-three/postprocessing']).toBe('3.0.4');
    expect(manifest.devDependencies?.['eslint-config-next']).toBe('16.2.10');
  });
});
