import { describe, expect, it } from 'vitest';
import {
  getAIContextLabel,
  getAIShellActivity,
  getAIShellPresentation,
  INITIAL_AI_SHELL_STATE,
  transitionAIShell,
} from '../src/lib/ai/shell';

describe('quiet global AI shell', () => {
  it('stays dormant until context exists or the visitor opens it', () => {
    expect(getAIShellActivity(INITIAL_AI_SHELL_STATE)).toBe('dormant');
    const contextual = transitionAIShell(INITIAL_AI_SHELL_STATE, {
      type: 'context.changed',
      available: true,
    });
    expect(getAIShellActivity(contextual)).toBe('context');
    expect(getAIShellActivity(transitionAIShell(contextual, { type: 'surface.opened' })))
      .toBe('listening');
  });

  it('tracks responding, error, retry, and close without losing context', () => {
    let state = transitionAIShell(INITIAL_AI_SHELL_STATE, { type: 'context.changed', available: true });
    state = transitionAIShell(state, { type: 'surface.opened' });
    state = transitionAIShell(state, { type: 'request.started' });
    expect(state.open).toBe(true);
    expect(getAIShellActivity(state)).toBe('responding');
    state = transitionAIShell(state, { type: 'request.failed', message: 'Offline' });
    expect(getAIShellActivity(state)).toBe('error');
    state = transitionAIShell(state, { type: 'error.cleared' });
    expect(getAIShellActivity(state)).toBe('listening');
    state = transitionAIShell(state, { type: 'surface.closed' });
    expect(getAIShellActivity(state)).toBe('context');
  });

  it('ignores late request activity after the visitor closes the surface', () => {
    let state = transitionAIShell(INITIAL_AI_SHELL_STATE, { type: 'surface.opened' });
    state = transitionAIShell(state, { type: 'surface.closed' });
    expect(transitionAIShell(state, { type: 'request.started' })).toEqual(state);
    expect(transitionAIShell(state, { type: 'request.failed', message: 'late error' })).toEqual(state);
  });

  it('clears conversation state through a monotonic reset signal', () => {
    const first = transitionAIShell(INITIAL_AI_SHELL_STATE, { type: 'conversation.cleared' });
    const second = transitionAIShell(first, { type: 'conversation.cleared' });
    expect(second.conversationVersion).toBe(2);
    expect(second.error).toBeUndefined();
    expect(second.requestActive).toBe(false);
  });

  it('creates quiet contextual copy from semantic IDs and routes', () => {
    expect(getAIContextLabel({ route: '/projects', nodeId: 'project:dreamlife' })).toBe('Dreamlife');
    expect(getAIContextLabel({ route: '/about' })).toBe('this chapter');
    const presentation = getAIShellPresentation(
      { ...INITIAL_AI_SHELL_STATE, contextAvailable: true },
      { route: '/projects', nodeId: 'project:lifeinbox' },
    );
    expect(presentation.presenceLabel).toBe('Ask about Lifeinbox');
    expect(presentation.statusLabel).toBe('Context: Lifeinbox');
  });
});
