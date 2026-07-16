import { createStore, type StoreApi } from 'zustand/vanilla';
import {
  isDepthStage,
  isDestinationId,
  isExperienceId,
  isNodeId,
  isRelationshipId,
  type PortfolioAIContext,
} from '../portfolioContracts';

export type PortfolioAIContextInput = Partial<PortfolioAIContext> & { route?: string };

export interface PortfolioAIContextEntry {
  sourceId: string;
  context: PortfolioAIContextInput;
}

export interface PortfolioAIContextState {
  baseContext: PortfolioAIContext;
  entries: readonly PortfolioAIContextEntry[];
  activeContext: PortfolioAIContext;
  setRoute(route: string): void;
  pushContext(sourceId: string, context: PortfolioAIContextInput): void;
  popContext(sourceId: string): void;
  clearContexts(): void;
}

const SOURCE_ID = /^[a-z0-9]+(?:[.:/-][a-z0-9]+)*$/;

function isRoute(value: string) {
  if (value.startsWith('/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && (url.hostname === 'marknperera.ca' || url.hostname.endsWith('.marknperera.ca'));
  } catch {
    return false;
  }
}

function sanitizeContext(input: PortfolioAIContextInput): PortfolioAIContextInput {
  const context: PortfolioAIContextInput = {};
  if (input.route !== undefined) {
    if (!isRoute(input.route)) throw new TypeError('AI context route is invalid');
    context.route = input.route;
  }
  if (input.destinationId !== undefined) {
    if (!isDestinationId(input.destinationId)) throw new TypeError('AI context destination is invalid');
    context.destinationId = input.destinationId;
  }
  if (input.nodeId !== undefined) {
    if (!isNodeId(input.nodeId)) throw new TypeError('AI context node is invalid');
    context.nodeId = input.nodeId;
  }
  if (input.experienceId !== undefined) {
    if (!isExperienceId(input.experienceId)) throw new TypeError('AI context experience is invalid');
    context.experienceId = input.experienceId;
  }
  if (input.depthStage !== undefined) {
    if (!isDepthStage(input.depthStage)) throw new TypeError('AI context depth is invalid');
    context.depthStage = input.depthStage;
  }
  if (input.selectedRelationshipId !== undefined) {
    if (!isRelationshipId(input.selectedRelationshipId)) {
      throw new TypeError('AI context relationship is invalid');
    }
    context.selectedRelationshipId = input.selectedRelationshipId;
  }
  return context;
}

function resolveActiveContext(
  baseContext: PortfolioAIContext,
  entries: readonly PortfolioAIContextEntry[],
): PortfolioAIContext {
  return entries.reduce<PortfolioAIContext>(
    (context, entry) => ({ ...context, ...entry.context }),
    { ...baseContext },
  );
}

export function createPortfolioAIContextStore(
  initialContext: PortfolioAIContext = { route: '/' },
): StoreApi<PortfolioAIContextState> {
  const sanitized = sanitizeContext(initialContext);
  const baseContext = { route: sanitized.route ?? '/', ...sanitized };

  return createStore<PortfolioAIContextState>((set) => ({
    baseContext,
    entries: [],
    activeContext: baseContext,

    setRoute(route) {
      const sanitizedRoute = sanitizeContext({ route }).route ?? '/';
      set(state => {
        const nextBase = { ...state.baseContext, route: sanitizedRoute };
        return {
          baseContext: nextBase,
          activeContext: resolveActiveContext(nextBase, state.entries),
        };
      });
    },

    pushContext(sourceId, context) {
      if (!SOURCE_ID.test(sourceId)) throw new TypeError('AI context source is invalid');
      const entry = { sourceId, context: sanitizeContext(context) };
      set(state => {
        const entries = [...state.entries.filter(item => item.sourceId !== sourceId), entry];
        return { entries, activeContext: resolveActiveContext(state.baseContext, entries) };
      });
    },

    popContext(sourceId) {
      set(state => {
        const entries = state.entries.filter(entry => entry.sourceId !== sourceId);
        return { entries, activeContext: resolveActiveContext(state.baseContext, entries) };
      });
    },

    clearContexts() {
      set(state => ({ entries: [], activeContext: { ...state.baseContext } }));
    },
  }));
}
