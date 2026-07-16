import { describe, expect, it } from 'vitest';
import { parseChatRequest, serializeChatRequestContext } from '../src/lib/ai/request';

const messages = [{ role: 'user', content: 'Tell me about Dreamlife' }];

describe('AI chat request context', () => {
  it('accepts bounded semantic identifiers and discards client copy', () => {
    const result = parseChatRequest({
      messages,
      context: {
        nodeId: 'project:dreamlife',
        destinationId: 'destination:museum-project-dreamlife',
        depthStage: 'approach',
        title: 'Untrusted title',
      },
    });
    expect(result).toEqual(expect.objectContaining({
      ok: true,
      value: expect.objectContaining({
        contextStatus: 'accepted',
        context: {
          nodeId: 'project:dreamlife',
          destinationId: 'destination:museum-project-dreamlife',
          depthStage: 'approach',
        },
      }),
    }));
  });

  it('degrades malformed context to context-free chat while rejecting malformed messages', () => {
    expect(parseChatRequest({ messages, context: { nodeId: 'not-a-node' } }))
      .toEqual(expect.objectContaining({
        ok: true,
        value: expect.objectContaining({ contextStatus: 'rejected' }),
      }));
    expect(parseChatRequest({ messages, context: { nodeId: 'not-a-node' } }).value)
      .not.toHaveProperty('context');
    expect(parseChatRequest({ messages: [{ role: 'user', content: 42 }] }).ok).toBe(false);
  });

  it('serializes identifiers only and never sends route or local history', () => {
    expect(serializeChatRequestContext({
      route: '/projects',
      nodeId: 'project:lifeinbox',
      depthStage: 'handle',
    })).toEqual({ nodeId: 'project:lifeinbox', depthStage: 'handle' });
  });
});
