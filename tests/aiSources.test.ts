import { describe, expect, it } from 'vitest';
import { createSourcePayload, parseLatestSourcePayload } from '../src/lib/ai/sources';

const validSource = {
  nodeId: 'project:dreamlife' as const,
  nodeType: 'project',
  title: 'Dreamlife',
  summary: 'A life-design product.',
  destination: {
    id: 'destination:museum-project-dreamlife' as const,
    href: '/projects/dreamlife',
    targetOrigin: 'main' as const,
  },
};

describe('structured portfolio AI sources', () => {
  it('round-trips canonical source descriptors and limits display count', () => {
    const payload = createSourcePayload(Array.from({ length: 6 }, (_, index) => ({
      ...validSource,
      nodeId: `project:source-${index}` as const,
      title: `Source ${index}`,
    })));
    expect(payload.sources).toHaveLength(4);
    expect(parseLatestSourcePayload([createSourcePayload([validSource])])).toEqual([validSource]);
  });

  it('drops unknown destinations, mismatched hrefs, and malformed source copy', () => {
    expect(parseLatestSourcePayload([{
      type: 'portfolio-sources',
      sources: [
        { ...validSource, destination: { ...validSource.destination, href: 'https://evil.example' } },
        { ...validSource, destination: { ...validSource.destination, id: 'destination:unknown' } },
        { ...validSource, nodeId: 'project:lifeinbox' },
        { ...validSource, title: 42 },
      ],
    }])).toEqual([]);
  });
});
