import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ArchiveCardDoor from '@/components/ai/ArchiveCardDoor';
import {
  createArchiveCardPayload,
  parseLatestArchiveCardPayload,
} from '@/lib/ai/archiveCards';

const lifeInboxSource = {
  nodeId: 'project:lifeinbox' as const,
  nodeType: 'project',
  title: 'LifeInbox',
  summary: 'A local-first capture system.',
  destination: {
    id: 'destination:museum-project-lifeinbox' as const,
    href: '/projects/lifeinbox',
    targetOrigin: 'main' as const,
  },
};

describe('validated portfolio archive cards', () => {
  it('creates and resolves the reviewed LifeInbox Handle door', () => {
    const cards = parseLatestArchiveCardPayload([createArchiveCardPayload([lifeInboxSource])]);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      destinationId: 'destination:museum-project-lifeinbox',
      requestedDepth: 'handle',
      safeState: { stage: 'handle' },
      href: '/projects/lifeinbox?stage=handle',
    });

    const html = renderToStaticMarkup(<ArchiveCardDoor card={cards[0]} />);
    expect(html).toContain('Archive door / Handle');
    expect(html).toContain('href="/projects/lifeinbox?stage=handle"');
    expect(html).not.toContain('javascript:');
  });

  it('does not create a card without the reviewed project source', () => {
    expect(createArchiveCardPayload([{
      ...lifeInboxSource,
      nodeId: 'project:dreamlife',
    }]).cards).toEqual([]);
  });

  it.each([
    ['unknown destination', { destinationId: 'destination:invented' }],
    ['mismatched source', { sourceNodeIds: ['project:dreamlife'] }],
    ['unsupported state', { safeState: { stage: 'handle', arbitrary: 'unsafe' } }],
    ['depth mismatch', { requestedDepth: 'understand' }],
    ['overlong copy', { summary: 'x'.repeat(221) }],
  ])('fails closed for %s', (_label, mutation) => {
    const payload = createArchiveCardPayload([lifeInboxSource]);
    const card = { ...payload.cards[0], ...mutation, href: 'https://evil.example' };
    expect(parseLatestArchiveCardPayload([{ ...payload, cards: [card] }])).toEqual([]);
  });
});
