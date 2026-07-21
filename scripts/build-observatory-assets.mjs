import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const packet = path.join(root, 'documentation', 'art-direction', '2026-07-21-museum-observatory-proof');
const sources = path.join(packet, 'sources');
const masters = path.join(packet, 'masters');
const diagnostics = path.join(packet, 'diagnostics');
const runtime = path.join(root, 'public', 'images', 'art-direction', 'museum-observatory-proof');
const width = 852;
const height = 790;

const derivatives = [
  { source: path.join(sources, 'empty-field-source.png'), target: 'field.webp', alpha: false },
  { source: path.join(masters, 'observatory-alpha.png'), target: 'observatory.webp', alpha: true },
  { source: path.join(masters, 'city-alpha.png'), target: 'city.webp', alpha: true },
  { source: path.join(masters, 'portal-alpha.png'), target: 'portal.webp', alpha: true },
  { source: path.join(sources, 'composite-reference-source.png'), target: 'fallback.webp', alpha: false },
];

await mkdir(runtime, { recursive: true });
await mkdir(diagnostics, { recursive: true });

for (const derivative of derivatives) {
  await sharp(derivative.source)
    .resize(width, height, { fit: 'fill' })
    .webp({ quality: derivative.alpha ? 91 : 88, alphaQuality: 100, effort: 6 })
    .toFile(path.join(runtime, derivative.target));
}

const transparentLayers = await Promise.all(
  ['observatory.webp', 'portal.webp', 'city.webp'].map(file => sharp(path.join(runtime, file)).png().toBuffer()),
);

await sharp(path.join(runtime, 'field.webp'))
  .composite(transparentLayers.map(input => ({ input })))
  .png()
  .toFile(path.join(diagnostics, 'stacked.png'));

const checker = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="checker" width="32" height="32" patternUnits="userSpaceOnUse">
        <rect width="32" height="32" fill="#24282b"/>
        <rect width="16" height="16" fill="#cfd3d4"/>
        <rect x="16" y="16" width="16" height="16" fill="#cfd3d4"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#checker)"/>
  </svg>
`);

await sharp(checker)
  .composite(transparentLayers.map(input => ({ input })))
  .png()
  .toFile(path.join(diagnostics, 'alpha-checker.png'));

console.log(`Built ${derivatives.length} Observatory derivatives and 2 diagnostics.`);
