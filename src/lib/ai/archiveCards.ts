import type { JSONValue } from 'ai';
import { resolveDestination } from '../destinations';
import {
  isDepthStage,
  isDestinationId,
  isNodeId,
  type ArchiveCard,
  type DepthStage,
  type SafeState,
} from '../portfolioContracts';
import type { PublicSourceDescriptor } from '../content/queries';

interface ArchiveCardPayload extends Record<string, JSONValue> {
  type: 'portfolio-archive-cards';
  cards: Array<Record<string, JSONValue>>;
}

export interface ResolvedArchiveCard extends ArchiveCard {
  href: string;
}

const MAX_TITLE_LENGTH = 72;
const MAX_SUMMARY_LENGTH = 220;
const LIFEINBOX_SOURCE_ID = 'project:lifeinbox';

function serializeCard(card: ArchiveCard): Record<string, JSONValue> {
  return {
    id: card.id,
    type: card.type,
    title: card.title,
    summary: card.summary,
    sourceNodeIds: [...card.sourceNodeIds],
    destinationId: card.destinationId,
    requestedDepth: card.requestedDepth,
    safeState: card.safeState ? { ...card.safeState } : {},
    visualKey: card.visualKey ?? null,
  };
}

export function createArchiveCardPayload(
  sources: readonly PublicSourceDescriptor[],
): ArchiveCardPayload {
  const hasReviewedLifeInboxSource = sources.some(source => source.nodeId === LIFEINBOX_SOURCE_ID);
  if (!hasReviewedLifeInboxSource) return { type: 'portfolio-archive-cards', cards: [] };

  return {
    type: 'portfolio-archive-cards',
    cards: [serializeCard({
      id: 'archive-card:lifeinbox-capture-boundary',
      type: 'experience',
      title: 'Follow one thought through LifeInbox',
      summary: 'Open the local-first capture boundary, then reveal how the same thought becomes an illustrative reminder.',
      sourceNodeIds: [LIFEINBOX_SOURCE_ID],
      destinationId: 'destination:museum-project-lifeinbox',
      requestedDepth: 'handle',
      safeState: { stage: 'handle' },
      visualKey: 'lifeinbox-capture-boundary',
    })],
  };
}

function parseSafeState(value: unknown): SafeState | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.some(([, item]) => !(
    typeof item === 'string'
    || typeof item === 'boolean'
    || (typeof item === 'number' && Number.isFinite(item))
  ))) return undefined;
  return Object.fromEntries(entries) as SafeState;
}

function parseCard(value: unknown): ResolvedArchiveCard | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (
    typeof input.id !== 'string'
    || !/^archive-card:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.id)
    || input.type !== 'experience'
    || typeof input.title !== 'string'
    || input.title.length === 0
    || input.title.length > MAX_TITLE_LENGTH
    || typeof input.summary !== 'string'
    || input.summary.length === 0
    || input.summary.length > MAX_SUMMARY_LENGTH
    || !Array.isArray(input.sourceNodeIds)
    || input.sourceNodeIds.length === 0
    || input.sourceNodeIds.length > 4
    || input.sourceNodeIds.some(sourceId => typeof sourceId !== 'string' || !isNodeId(sourceId))
    || typeof input.destinationId !== 'string'
    || !isDestinationId(input.destinationId)
    || typeof input.requestedDepth !== 'string'
    || !isDepthStage(input.requestedDepth)
  ) return undefined;

  const safeState = parseSafeState(input.safeState);
  if (!safeState || safeState.stage !== input.requestedDepth) return undefined;

  const resolution = resolveDestination(input.destinationId, { safeState, currentOrigin: 'main' });
  if (
    resolution.usedFallback
    || resolution.destination.status !== 'canonical'
    || !resolution.destination.nodeId
    || !input.sourceNodeIds.includes(resolution.destination.nodeId)
  ) return undefined;

  return {
    id: input.id,
    type: input.type,
    title: input.title.trim(),
    summary: input.summary.trim(),
    sourceNodeIds: input.sourceNodeIds,
    destinationId: input.destinationId,
    requestedDepth: input.requestedDepth as DepthStage,
    safeState,
    ...(typeof input.visualKey === 'string' ? { visualKey: input.visualKey } : {}),
    href: resolution.href,
  };
}

export function parseLatestArchiveCardPayload(data: readonly JSONValue[] | undefined) {
  if (!data) return [];
  for (let index = data.length - 1; index >= 0; index -= 1) {
    const value = data[index];
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const payload = value as Record<string, unknown>;
    if (payload.type !== 'portfolio-archive-cards' || !Array.isArray(payload.cards)) continue;
    return payload.cards
      .map(parseCard)
      .filter((card): card is ResolvedArchiveCard => Boolean(card))
      .slice(0, 1);
  }
  return [];
}
