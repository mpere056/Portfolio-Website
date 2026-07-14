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
    expect(manifest.dependencies?.next).toBe('14.2.35');
    expect(manifest.devDependencies?.['eslint-config-next']).toBe('14.2.35');
  });
});
