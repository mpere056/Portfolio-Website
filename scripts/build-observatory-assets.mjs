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
];

const layerLayout = [
  { file: 'portal.webp', scale: 0.72, anchor: { x: 0.235, y: 0.41 }, offset: { x: -0.06, y: -0.08 } },
  { file: 'observatory.webp', scale: 0.79, anchor: { x: 0.66, y: 0.49 }, offset: { x: 0.035, y: 0.07 } },
  { file: 'city.webp', scale: 0.74, anchor: { x: 0.73, y: 0.35 }, offset: { x: 0.095, y: -0.075 } },
];

await mkdir(runtime, { recursive: true });
await mkdir(diagnostics, { recursive: true });

for (const derivative of derivatives) {
  await sharp(derivative.source)
    .resize(width, height, { fit: 'fill' })
    .webp({ quality: derivative.alpha ? 91 : 88, alphaQuality: 100, effort: 6 })
    .toFile(path.join(runtime, derivative.target));
}

const transparentLayers = await Promise.all(layerLayout.map(async layer => {
  const layerWidth = Math.round(width * layer.scale);
  const layerHeight = Math.round(height * layer.scale);
  return {
    input: await sharp(path.join(runtime, layer.file))
      .resize(layerWidth, layerHeight, { fit: 'fill' })
      .png()
      .toBuffer(),
    left: Math.round((1 - layer.scale) * layer.anchor.x * width + layer.offset.x * width),
    top: Math.round((1 - layer.scale) * (1 - layer.anchor.y) * height - layer.offset.y * height),
  };
}));

await sharp(path.join(runtime, 'field.webp'))
  .composite(transparentLayers)
  .webp({ quality: 88, effort: 6 })
  .toFile(path.join(runtime, 'fallback.webp'));

await sharp(path.join(runtime, 'field.webp'))
  .composite(transparentLayers)
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
  .composite(transparentLayers)
  .png()
  .toFile(path.join(diagnostics, 'alpha-checker.png'));

console.log(`Built ${derivatives.length + 1} Observatory derivatives and 2 diagnostics.`);
