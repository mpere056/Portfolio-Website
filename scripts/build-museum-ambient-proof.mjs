import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proofDir = path.join(root, 'documentation', 'art-direction', '2026-07-20-museum-ambient-proof');

const file = name => path.join(proofDir, name);

async function alphaTrim(input, output) {
  await sharp(file(input))
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file(output));
}

async function extractAlpha(input, output, region) {
  const extracted = await sharp(file(input)).extract(region).png().toBuffer();
  await sharp(extracted).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(file(output));
}

async function resizeInside(input, width, height) {
  return sharp(file(input))
    .resize({ width, height, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
}

async function setOpacity(input, opacity) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let index = 3; index < data.length; index += 4) data[index] = Math.round(data[index] * opacity);
  return sharp(data, { raw: info }).png().toBuffer();
}

async function place(input, width, height, left, top, options = {}) {
  const resized = await resizeInside(input, width, height);
  return {
    input: options.opacity ? await setOpacity(resized, options.opacity) : resized,
    left,
    top,
    blend: options.blend ?? 'over',
  };
}

function checkerSvg(width, height, size = 24) {
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="c" width="${size * 2}" height="${size * 2}" patternUnits="userSpaceOnUse">
      <rect width="${size * 2}" height="${size * 2}" fill="#101417"/>
      <rect width="${size}" height="${size}" fill="#242b2f"/>
      <rect x="${size}" y="${size}" width="${size}" height="${size}" fill="#242b2f"/>
    </pattern></defs><rect width="100%" height="100%" fill="url(#c)"/>
  </svg>`);
}

function labelSvg(width, text, subtitle = '') {
  const safeText = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  const safeSubtitle = subtitle.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  return Buffer.from(`<svg width="${width}" height="64" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="64" fill="#05090b"/>
    <text x="20" y="28" fill="#f1eee6" font-family="Georgia, serif" font-size="20">${safeText}</text>
    <text x="20" y="49" fill="#78939a" font-family="monospace" font-size="10" letter-spacing="1.2">${safeSubtitle}</text>
  </svg>`);
}

async function buildPanel({ title, subtitle, input, width = 540, height = 390 }) {
  const visualHeight = height - 64;
  const backdrop = checkerSvg(width, visualHeight);
  const artwork = await sharp(file(input))
    .resize({ width: width - 32, height: visualHeight - 28, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width, height, channels: 4, background: '#05090b' } })
    .composite([
      { input: labelSvg(width, title, subtitle), left: 0, top: 0 },
      { input: backdrop, left: 0, top: 64 },
      { input: artwork, left: 16, top: 78 },
    ])
    .png()
    .toBuffer();
}

async function buildCoralWeights() {
  const input = await sharp(file('coral-groups-alpha.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(input.data.length);
  for (let y = 0; y < input.info.height; y += 1) {
    const vertical = 1 - y / Math.max(1, input.info.height - 1);
    const root = Math.max(0, Math.min(1, (0.28 - vertical) / 0.28));
    const tip = Math.max(0, Math.min(1, (vertical - 0.2) / 0.8));
    const body = Math.max(0, 1 - Math.abs(vertical - 0.45) / 0.45);
    for (let x = 0; x < input.info.width; x += 1) {
      const index = (y * input.info.width + x) * 4;
      const alpha = input.data[index + 3] / 255;
      output[index] = Math.round(255 * tip * alpha);
      output[index + 1] = Math.round(255 * body * alpha);
      output[index + 2] = Math.round(255 * root * alpha);
      output[index + 3] = 255;
    }
  }
  await sharp(output, { raw: input.info }).png().toFile(file('map-coral-deformation-rgb.png'));
}

async function buildFlowMap() {
  const input = await sharp(file('directional-current-alpha.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(input.data.length);
  for (let index = 0; index < input.data.length; index += 4) {
    const alpha = input.data[index + 3];
    output[index] = 238;
    output[index + 1] = 128;
    output[index + 2] = Math.max(input.data[index], input.data[index + 1], input.data[index + 2]);
    output[index + 3] = alpha;
  }
  await sharp(output, { raw: input.info }).png().toFile(file('map-current-flow-rgba.png'));
}

async function buildDepthMap() {
  const width = 1402;
  const height = 1122;
  const svg = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#202020"/><stop offset="1" stop-color="#606060"/></linearGradient>
      <radialGradient id="coral"><stop offset="0" stop-color="#d6d6d6"/><stop offset="1" stop-color="#8f8f8f"/></radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#121212"/>
    <path d="M0 520 C330 390 540 500 760 610 S1180 670 1402 520 V1122 H0 Z" fill="url(#ground)"/>
    <ellipse cx="300" cy="610" rx="330" ry="500" fill="url(#coral)" opacity=".88"/>
    <ellipse cx="560" cy="650" rx="185" ry="380" fill="#b8b8b8" opacity=".92"/>
    <path d="M520 620 C780 430 970 680 1402 300" fill="none" stroke="#787878" stroke-width="130" opacity=".72"/>
    <path d="M0 930 C380 800 870 900 1402 760 V1122 H0 Z" fill="#ededed" opacity=".35"/>
  </svg>`);
  await sharp(svg).png().toFile(file('map-scene-depth.png'));
}

async function buildIlluminationMap() {
  const width = 1402;
  const height = 1122;
  const layers = [
    await place('organism-body-alpha.png', 500, 890, 260, 150, { blend: 'screen' }),
    await place('directional-current-trimmed.png', 900, 580, 520, 270, { blend: 'screen' }),
    await place('coral-groups-trimmed.png', 820, 1020, 0, 40, { blend: 'screen' }),
  ];
  await sharp({ create: { width, height, channels: 3, background: '#000000' } })
    .composite(layers)
    .grayscale()
    .blur(16)
    .normalize()
    .png()
    .toFile(file('map-illumination-caustic.png'));
}

async function buildProofComposite() {
  const width = 1402;
  const height = 1122;
  const background = await sharp(file('working-clean-field-source.png')).resize(width, height, { fit: 'fill' }).toBuffer();
  const layers = [
    await place('vapor-background-alpha.png', 690, 510, 30, 80, { opacity: 0.44, blend: 'screen' }),
    await place('vapor-vertical-alpha.png', 430, 650, 600, 5, { opacity: 0.34, blend: 'screen' }),
    await place('directional-current-trimmed.png', 920, 600, 500, 280, { opacity: 0.86, blend: 'screen' }),
    await place('coral-groups-trimmed.png', 820, 1030, 0, 45),
    await place('organism-body-alpha.png', 500, 900, 245, 150),
    await place('organism-rings-alpha.png', 210, 340, 690, 345, { blend: 'screen' }),
    await place('vapor-basin-alpha.png', 1050, 315, 250, 780, { opacity: 0.32, blend: 'screen' }),
    await place('occluder-shadow-b-alpha.png', 650, 250, 720, 850, { opacity: 0.5 }),
    await place('occluder-spores-alpha.png', 250, 210, 1040, 110, { opacity: 0.72, blend: 'screen' }),
  ];
  await sharp(background).composite(layers).png().toFile(file('proof-composite-still.png'));
}

async function buildContactSheet() {
  const panels = await Promise.all([
    buildPanel({ title: 'Source checksum crop', subtitle: 'REFERENCE ONLY - NEVER A MOVING RECTANGLE', input: 'source-lower-left-crop.png' }),
    buildPanel({ title: 'Clean field and basin', subtitle: 'BACKGROUND REPAIR / FIXED ANCHOR', input: 'working-clean-field-source.png' }),
    buildPanel({ title: 'Intended stable stack', subtitle: 'LAYERED COMPOSITE CHECKSUM', input: 'proof-composite-still.png' }),
    buildPanel({ title: 'Rooted coral groups', subtitle: 'ORGANIC TIDE / ROOT-BODY-TIP', input: 'coral-groups-trimmed.png' }),
    buildPanel({ title: 'Organism and ring set', subtitle: 'MEMBRANE / LIGHT / PIVOT', input: 'organism-instrument-alpha.png' }),
    buildPanel({ title: 'Directional current', subtitle: 'FLOW / WIDTH / EMISSION', input: 'directional-current-trimmed.png' }),
    buildPanel({ title: 'Atmosphere volumes', subtitle: 'FAR / INTERSTITIAL / BASIN', input: 'vapor-volumes-alpha.png' }),
    buildPanel({ title: 'Near occluders', subtitle: 'SPARSE FOREGROUND PASSAGE', input: 'near-occluders-alpha.png' }),
    buildPanel({ title: 'Control maps', subtitle: 'DEFORMATION / DEPTH / FLOW / LIGHT', input: 'maps-contact.png' }),
  ]);
  const width = 1620;
  const height = 1170;
  const composites = panels.map((input, index) => ({
    input,
    left: (index % 3) * 540,
    top: Math.floor(index / 3) * 390,
  }));
  await sharp({ create: { width, height, channels: 4, background: '#030608' } })
    .composite(composites)
    .png()
    .toFile(file('contact-sheet.png'));
}

async function buildMapsContact() {
  const names = [
    'map-coral-deformation-rgb.png',
    'map-scene-depth.png',
    'map-current-flow-rgba.png',
    'map-illumination-caustic.png',
  ];
  const cells = await Promise.all(names.map(name => sharp(file(name)).resize({ width: 250, height: 150, fit: 'contain', background: '#05090b' }).png().toBuffer()));
  await sharp({ create: { width: 500, height: 300, channels: 4, background: '#05090b' } })
    .composite(cells.map((input, index) => ({ input, left: (index % 2) * 250, top: Math.floor(index / 2) * 150 })))
    .png()
    .toFile(file('maps-contact.png'));
}

async function buildAlphaDiagnostics() {
  const assets = [
    ['coral-groups-trimmed.png', 'CORAL'],
    ['organism-body-alpha.png', 'ORGANISM'],
    ['directional-current-trimmed.png', 'CURRENT'],
    ['vapor-volumes-alpha.png', 'VAPOR'],
    ['near-occluders-alpha.png', 'OCCLUDERS'],
  ];
  const cellWidth = 360;
  const cellHeight = 250;
  const rowHeight = 300;
  const composites = [];
  const backgrounds = ['#000000', '#ffffff', checkerSvg(cellWidth, cellHeight, 18)];
  for (let row = 0; row < assets.length; row += 1) {
    const [name, title] = assets[row];
    const artwork = await sharp(file(name)).resize({ width: cellWidth - 30, height: cellHeight - 30, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    composites.push({ input: labelSvg(cellWidth * 3, `${title} alpha diagnostics`, 'BLACK / WHITE / CHECKERBOARD'), left: 0, top: row * rowHeight });
    for (let column = 0; column < 3; column += 1) {
      const background = typeof backgrounds[column] === 'string'
        ? await sharp({ create: { width: cellWidth, height: cellHeight, channels: 4, background: backgrounds[column] } }).png().toBuffer()
        : backgrounds[column];
      composites.push({ input: background, left: column * cellWidth, top: row * rowHeight + 50 });
      composites.push({ input: artwork, left: column * cellWidth + 15, top: row * rowHeight + 65 });
    }
  }
  await sharp({ create: { width: cellWidth * 3, height: rowHeight * assets.length, channels: 4, background: '#05090b' } })
    .composite(composites)
    .png()
    .toFile(file('alpha-edge-diagnostics.png'));
}

await alphaTrim('coral-groups-alpha.png', 'coral-groups-trimmed.png');
await alphaTrim('directional-current-alpha.png', 'directional-current-trimmed.png');
await extractAlpha('organism-instrument-alpha.png', 'organism-body-alpha.png', { left: 0, top: 0, width: 850, height: 1370 });
await extractAlpha('organism-instrument-alpha.png', 'organism-rings-alpha.png', { left: 825, top: 360, width: 322, height: 590 });
await extractAlpha('vapor-volumes-alpha.png', 'vapor-background-alpha.png', { left: 0, top: 0, width: 820, height: 680 });
await extractAlpha('vapor-volumes-alpha.png', 'vapor-vertical-alpha.png', { left: 850, top: 0, width: 686, height: 680 });
await extractAlpha('vapor-volumes-alpha.png', 'vapor-basin-alpha.png', { left: 280, top: 600, width: 1050, height: 423 });
await extractAlpha('near-occluders-alpha.png', 'occluder-spores-alpha.png', { left: 0, top: 0, width: 1254, height: 560 });
await extractAlpha('near-occluders-alpha.png', 'occluder-shadow-a-alpha.png', { left: 0, top: 920, width: 620, height: 333 });
await extractAlpha('near-occluders-alpha.png', 'occluder-shadow-b-alpha.png', { left: 620, top: 920, width: 633, height: 333 });

await buildCoralWeights();
await buildFlowMap();
await buildDepthMap();
await buildIlluminationMap();
await buildProofComposite();
await buildMapsContact();
await buildContactSheet();
await buildAlphaDiagnostics();

const outputs = [
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
  'map-coral-deformation-rgb.png',
  'map-current-flow-rgba.png',
  'map-scene-depth.png',
  'map-illumination-caustic.png',
  'proof-composite-still.png',
  'contact-sheet.png',
  'alpha-edge-diagnostics.png',
];

const report = [];
for (const name of outputs) {
  const metadata = await sharp(file(name)).metadata();
  report.push({ name, width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha });
}
await writeFile(
  file('asset-manifest.json'),
  `${JSON.stringify({
    proof: 'museum-west-lower-ecology',
    stage: 'ART-12D',
    sourceCrop: { left: 0, top: 367, width: 719, height: 574, runtimeUse: 'reference-only' },
    creativeDecisions: { world: '1A-layered', firstProof: '2A-west-lower-ecology', motion: '3A-quiet-pervasive' },
    generatedBy: 'scripts/build-museum-ambient-proof.mjs',
    outputs: report,
  }, null, 2)}\n`,
  'utf8',
);
console.table(report);
