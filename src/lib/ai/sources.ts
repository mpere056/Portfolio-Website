import type { JSONValue } from 'ai';
import { getDestinationDefinition } from '../destinations';
import { isNodeId } from '../portfolioContracts';
import type { PublicSourceDescriptor } from '../content/queries';

interface SourcePayload {
  type: 'portfolio-sources';
  sources: PublicSourceDescriptor[];
}

function parseSource(value: unknown): PublicSourceDescriptor | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (
    typeof input.nodeId !== 'string'
    || !isNodeId(input.nodeId)
    || typeof input.nodeType !== 'string'
    || typeof input.title !== 'string'
    || typeof input.summary !== 'string'
  ) return undefined;

  let destination: PublicSourceDescriptor['destination'];
  if (input.destination !== undefined) {
    if (!input.destination || typeof input.destination !== 'object' || Array.isArray(input.destination)) {
      return undefined;
    }
    const candidate = input.destination as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || typeof candidate.href !== 'string') return undefined;
    const registered = getDestinationDefinition(candidate.id);
    if (
      !registered
      || registered.status !== 'canonical'
      || registered.nodeId !== input.nodeId
      || registered.href !== candidate.href
      || registered.targetOrigin !== candidate.targetOrigin
    ) return undefined;
    destination = {
      id: registered.id,
      href: registered.href,
      targetOrigin: registered.targetOrigin,
    };
  }

  return {
    nodeId: input.nodeId,
    nodeType: input.nodeType,
    title: input.title.trim(),
    summary: input.summary.trim(),
    ...(destination ? { destination } : {}),
  };
}

export function createSourcePayload(sources: readonly PublicSourceDescriptor[]): SourcePayload {
  return { type: 'portfolio-sources', sources: sources.slice(0, 4) };
}

export function parseLatestSourcePayload(data: readonly JSONValue[] | undefined) {
  if (!data) return [];
  for (let index = data.length - 1; index >= 0; index -= 1) {
    const value = data[index];
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const payload = value as Record<string, unknown>;
    if (payload.type !== 'portfolio-sources' || !Array.isArray(payload.sources)) continue;
    return payload.sources
      .map(parseSource)
      .filter((source): source is PublicSourceDescriptor => Boolean(source))
      .slice(0, 4);
  }
  return [];
}
