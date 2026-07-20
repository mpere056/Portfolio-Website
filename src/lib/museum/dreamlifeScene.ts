import type { DepthStage } from '../portfolioContracts';

export type DreamlifePath = 'current' | 'fallback' | 'wild';
export type DreamlifeReaction = 'resist' | 'curious' | 'pull';

export interface DreamlifeSceneFrame {
  energy: number;
  divergence: number;
  refraction: number;
  recombination: number;
  evidenceStrength: number;
  selectedAngle: number;
  selectedX: number;
  selectedY: number;
  settled: boolean;
}

export const DREAMLIFE_SCENE_LAYERS = [
  { id: 'dreamlife:matte', medium: 'raster', driver: 'none', meaning: 'Approved nacre future-field checksum.' },
  { id: 'dreamlife:current', medium: 'css', driver: 'Current path', meaning: 'The present trajectory remains closest to the origin.' },
  { id: 'dreamlife:fallback', medium: 'css', driver: 'Fallback path', meaning: 'A lower-risk future refracts along a cooler axis.' },
  { id: 'dreamlife:wild', medium: 'css', driver: 'Wild Card path', meaning: 'A surprising future diverges furthest and exposes hidden pull.' },
  { id: 'dreamlife:reaction', medium: 'svg', driver: 'resist, curious, or pull', meaning: 'Reaction changes field tension without becoming destiny.' },
  { id: 'dreamlife:loop', medium: 'svg', driver: 'Enter and Understand', meaning: 'Experiment and reflection recombine futures into a revisable loop.' },
  { id: 'dreamlife:evidence', medium: 'dom', driver: 'Understand', meaning: 'Repository, build note, and offer evidence become inspectable proof.' },
] as const;

const PATHS: Record<DreamlifePath, { angle: number; x: number; y: number; divergence: number }> = {
  current: { angle: -16, x: 0.3, y: 0.35, divergence: 0.34 },
  fallback: { angle: 12, x: 0.72, y: 0.3, divergence: 0.52 },
  wild: { angle: 34, x: 0.58, y: 0.76, divergence: 0.88 },
};

const REACTIONS: Record<DreamlifeReaction, number> = { resist: 0.22, curious: 0.56, pull: 1 };

function clamp(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function getDreamlifeSceneFrame({
  path,
  reaction,
  stage,
  stimulation,
  reducedMotion,
  visible = true,
}: {
  path: DreamlifePath;
  reaction: DreamlifeReaction;
  stage: DepthStage;
  stimulation: number;
  reducedMotion: boolean;
  visible?: boolean;
}): DreamlifeSceneFrame {
  const pathState = PATHS[path];
  const reactionStrength = REACTIONS[reaction];
  const energy = reducedMotion || !visible ? 0 : 0.14 + clamp(stimulation) * 0.86;
  const depth = stage === 'understand' ? 1 : stage === 'enter' ? 0.58 : 0;
  return {
    energy,
    divergence: pathState.divergence * (0.72 + reactionStrength * 0.28),
    refraction: 0.24 + reactionStrength * 0.5 + energy * 0.16,
    recombination: depth,
    evidenceStrength: stage === 'understand' ? 1 : 0,
    selectedAngle: pathState.angle,
    selectedX: pathState.x,
    selectedY: pathState.y,
    settled: reducedMotion || !visible,
  };
}

export function getDreamlifeLoopPath(index: number, recombination: number) {
  const endpoints = [{ x: 250, y: 170 }, { x: 770, y: 130 }, { x: 620, y: 480 }] as const;
  const end = endpoints[index % endpoints.length];
  const strength = 0.35 + clamp(recombination) * 0.65;
  const x = 510 + (end.x - 510) * strength;
  const y = 300 + (end.y - 300) * strength;
  return `M510 300 Q${(510 + x) / 2} ${(index === 1 ? 42 : 540) - recombination * 90} ${x.toFixed(1)} ${y.toFixed(1)}`;
}
