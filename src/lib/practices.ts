import type { NodeId } from './portfolioContracts';

export const PRACTICE_IDS = [
  'music-performance',
  'ai-possible-futures',
  'life-systems-tools',
  'play-community',
] as const;

export type PracticeId = (typeof PRACTICE_IDS)[number];
export type PracticeNodeId = `practice:${PracticeId}`;

export interface PracticeDefinition {
  id: PracticeId;
  nodeId: PracticeNodeId;
  territoryId: 'music' | 'ai-futures' | 'life-systems' | 'play';
  title: string;
  summary: string;
}

export const PRACTICE_DEFINITIONS: Readonly<Record<PracticeId, PracticeDefinition>> = {
  'music-performance': {
    id: 'music-performance',
    nodeId: 'practice:music-performance',
    territoryId: 'music',
    title: 'Music & Performance',
    summary: 'Arrangements, performances, teaching, sound, and musical tools.',
  },
  'ai-possible-futures': {
    id: 'ai-possible-futures',
    nodeId: 'practice:ai-possible-futures',
    territoryId: 'ai-futures',
    title: 'AI & Possible Futures',
    summary: 'AI products and experiments that help people imagine, interpret, and shape what comes next.',
  },
  'life-systems-tools': {
    id: 'life-systems-tools',
    nodeId: 'practice:life-systems-tools',
    territoryId: 'life-systems',
    title: 'Life Systems & Tools',
    summary: 'Practical systems for capture, organization, reasoning, and dependable everyday work.',
  },
  'play-community': {
    id: 'play-community',
    nodeId: 'practice:play-community',
    territoryId: 'play',
    title: 'Play & Community',
    summary: 'Games, social experiments, Discord projects, and playful systems built with and for communities.',
  },
};

export function isPracticeId(value: string): value is PracticeId {
  return PRACTICE_IDS.includes(value as PracticeId);
}

export function practiceNodeId(id: PracticeId): PracticeNodeId {
  return `practice:${id}`;
}

export function practiceIdFromNodeId(nodeId: NodeId): PracticeId | undefined {
  if (!nodeId.startsWith('practice:')) return undefined;
  const id = nodeId.slice('practice:'.length);
  return isPracticeId(id) ? id : undefined;
}
