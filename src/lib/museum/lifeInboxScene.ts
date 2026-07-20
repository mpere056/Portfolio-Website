import type { DepthStage } from '../portfolioContracts';
import type { LifeInboxSpikeStage } from './spikes/lifeInboxSpike';

export interface LifeInboxScenePoint {
  x: number;
  y: number;
}

export interface LifeInboxSceneFrame {
  pointer: LifeInboxScenePoint;
  target: LifeInboxScenePoint;
  energy: number;
  ingressStrength: number;
  settlementStrength: number;
  membraneStrength: number;
  explosionStrength: number;
  evidenceStrength: number;
  returnStrength: number;
  particleCount: number;
  settled: boolean;
}

export interface LifeInboxSceneLayer {
  id: string;
  medium: 'raster' | 'css' | 'canvas' | 'svg' | 'dom';
  driver: string;
  meaning: string;
  calmBehavior: string;
}

export const LIFEINBOX_SCENE_LAYERS = [
  { id: 'lifeinbox:matte', medium: 'raster', driver: 'none', meaning: 'The approved receiving-vessel still remains the visual checksum.', calmBehavior: 'Always visible.' },
  { id: 'lifeinbox:ingress', medium: 'css', driver: 'pointer and editable capture', meaning: 'Unstored thought material remains diffuse and outside the trusted core.', calmBehavior: 'Freezes as a soft directional veil.' },
  { id: 'lifeinbox:material', medium: 'canvas', driver: 'capture stage, selected boundary, and stimulation', meaning: 'Particles condense locally, gather around the inspected promise, and return as a reminder trace.', calmBehavior: 'Stops completely while the state remains represented by CSS and SVG.' },
  { id: 'lifeinbox:local-core', medium: 'dom', driver: 'captured state', meaning: 'The locally stored row becomes a compact dependable specimen.', calmBehavior: 'Remains a still specimen.' },
  { id: 'lifeinbox:outer-membrane', medium: 'css', driver: 'organized state', meaning: 'Illustrative organization stays outside the stored local core.', calmBehavior: 'Remains open without rotation.' },
  { id: 'lifeinbox:boundaries', medium: 'svg', driver: 'depth and selected system layer', meaning: 'Trust promises separate spatially without losing their shared original.', calmBehavior: 'Keeps the exploded geometry without animated drawing.' },
  { id: 'lifeinbox:return', medium: 'svg', driver: 'resurface layer', meaning: 'A useful reminder visibly returns toward the person rather than disappearing into organization.', calmBehavior: 'Remains a single highlighted return path.' },
  { id: 'lifeinbox:evidence', medium: 'dom', driver: 'Understand depth', meaning: 'Repository and field-note evidence become part of the instrument.', calmBehavior: 'Always readable and navigable.' },
] as const satisfies readonly LifeInboxSceneLayer[];

const LAYER_TARGETS: Record<string, LifeInboxScenePoint> = {
  capture: { x: 0.5, y: 0.5 },
  sync: { x: 0.36, y: 0.34 },
  enrich: { x: 0.68, y: 0.62 },
  resurface: { x: 0.78, y: 0.24 },
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function normalizeLifeInboxPoint(point: LifeInboxScenePoint) {
  return { x: clamp(point.x), y: clamp(point.y) };
}

export function getLifeInboxSceneFrame({
  captureStage,
  depthStage,
  selectedLayer,
  pointer,
  stimulation,
  reducedMotion,
  visible = true,
}: {
  captureStage: LifeInboxSpikeStage;
  depthStage: DepthStage;
  selectedLayer: string;
  pointer: LifeInboxScenePoint;
  stimulation: number;
  reducedMotion: boolean;
  visible?: boolean;
}): LifeInboxSceneFrame {
  const normalizedPointer = normalizeLifeInboxPoint(pointer);
  const energy = reducedMotion || !visible ? 0 : 0.16 + clamp(stimulation) * 0.84;
  const captured = captureStage !== 'empty';
  const organized = captureStage === 'organized';
  const target = depthStage === 'handle'
    ? captured ? { x: 0.5, y: 0.52 } : normalizedPointer
    : LAYER_TARGETS[selectedLayer] ?? LAYER_TARGETS.capture;
  const explosionStrength = depthStage === 'understand' ? 1 : depthStage === 'enter' ? 0.58 : 0;
  const returnStrength = selectedLayer === 'resurface'
    ? (organized || depthStage !== 'handle' ? 0.72 + energy * 0.28 : 0)
    : 0;

  return {
    pointer: reducedMotion ? target : normalizedPointer,
    target,
    energy,
    ingressStrength: captured ? 0.08 : 0.42 + energy * 0.38,
    settlementStrength: captured ? 0.68 + energy * 0.32 : 0,
    membraneStrength: organized || depthStage !== 'handle' ? 0.62 + energy * 0.3 : 0.08,
    explosionStrength,
    evidenceStrength: depthStage === 'understand' ? 1 : depthStage === 'enter' ? 0.32 : 0,
    returnStrength,
    particleCount: reducedMotion || !visible ? 0 : Math.round((captured ? 28 : 18) + energy * (organized ? 30 : 20)),
    settled: reducedMotion || !visible,
  };
}

const BOUNDARY_ENDPOINTS = [
  { x: 276, y: 186 },
  { x: 346, y: 92 },
  { x: 716, y: 446 },
  { x: 804, y: 144 },
] as const;

export function getLifeInboxBoundaryPath(index: number, explosionStrength: number) {
  const origin = { x: 520, y: 310 };
  const endpoint = BOUNDARY_ENDPOINTS[index % BOUNDARY_ENDPOINTS.length];
  const expansion = 0.36 + clamp(explosionStrength) * 0.64;
  const x = origin.x + (endpoint.x - origin.x) * expansion;
  const y = origin.y + (endpoint.y - origin.y) * expansion;
  const bend = index % 2 === 0 ? -54 : 54;
  return `M${origin.x} ${origin.y} C${(origin.x + (x - origin.x) * 0.34).toFixed(1)} ${(origin.y + bend).toFixed(1)} ${(origin.x + (x - origin.x) * 0.72).toFixed(1)} ${(y - bend * 0.42).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
}
