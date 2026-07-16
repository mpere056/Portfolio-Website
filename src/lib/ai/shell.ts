import type { PortfolioAIContext } from '../portfolioContracts';

export type AIShellActivity = 'dormant' | 'context' | 'listening' | 'responding' | 'error';

export interface AIShellState {
  open: boolean;
  contextAvailable: boolean;
  requestActive: boolean;
  error?: string;
  conversationVersion: number;
}

export type AIShellEvent =
  | { type: 'context.changed'; available: boolean }
  | { type: 'surface.opened' }
  | { type: 'surface.closed' }
  | { type: 'request.started' }
  | { type: 'request.completed' }
  | { type: 'request.failed'; message?: string }
  | { type: 'error.cleared' }
  | { type: 'conversation.cleared' };

export const INITIAL_AI_SHELL_STATE: AIShellState = {
  open: false,
  contextAvailable: false,
  requestActive: false,
  conversationVersion: 0,
};

export function transitionAIShell(state: AIShellState, event: AIShellEvent): AIShellState {
  switch (event.type) {
    case 'context.changed':
      return { ...state, contextAvailable: event.available };
    case 'surface.opened':
      return { ...state, open: true, error: undefined };
    case 'surface.closed':
      return { ...state, open: false, requestActive: false };
    case 'request.started':
      return state.open ? { ...state, requestActive: true, error: undefined } : state;
    case 'request.completed':
      return { ...state, requestActive: false };
    case 'request.failed':
      return state.open ? {
        ...state,
        requestActive: false,
        error: event.message?.trim() || 'The archive is temporarily unavailable.',
      } : state;
    case 'error.cleared':
      return { ...state, error: undefined };
    case 'conversation.cleared':
      return {
        ...state,
        requestActive: false,
        error: undefined,
        conversationVersion: state.conversationVersion + 1,
      };
  }
}

export function getAIShellActivity(state: AIShellState): AIShellActivity {
  if (state.error) return 'error';
  if (state.requestActive) return 'responding';
  if (state.open) return 'listening';
  if (state.contextAvailable) return 'context';
  return 'dormant';
}

function titleCase(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export function getAIContextLabel(context: PortfolioAIContext) {
  if (context.nodeId) {
    const [, ...parts] = context.nodeId.split(':');
    return titleCase(parts.at(-1) ?? 'this');
  }
  if (context.route === '/about') return 'this chapter';
  if (context.route === '/projects') return 'the project museum';
  if (context.route.includes('/blog/')) return 'this article';
  if (context.route.includes('/sites/')) return 'this project';
  return 'Mark\'s archive';
}

export function getAIShellPresentation(state: AIShellState, context: PortfolioAIContext) {
  const activity = getAIShellActivity(state);
  const contextLabel = getAIContextLabel(context);
  return {
    activity,
    contextLabel,
    presenceLabel: state.contextAvailable ? `Ask about ${contextLabel}` : 'Ask Mark\'s archive',
    statusLabel: activity === 'responding'
      ? 'Finding a grounded answer'
      : activity === 'error'
        ? 'Archive connection paused'
        : state.contextAvailable
          ? `Context: ${contextLabel}`
          : 'Quiet until you need it',
  } as const;
}
