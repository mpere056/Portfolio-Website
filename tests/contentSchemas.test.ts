import { describe, expect, it } from 'vitest';
import { loadContentRecords, type AuthoredContentRecord } from '@/lib/content/loaders';
import { validateContentRecord, validateContentRecords } from '@/lib/content/schemas';

describe('content schemas', () => {
  it('accepts the current extended corpus', async () => {
    expect(validateContentRecords(await loadContentRecords())).toEqual([]);
  });

  it('rejects invalid required fields and extended namespaces', () => {
    const record = {
      kind: 'project',
      nodeId: 'project:broken',
      relativePath: 'projects/broken.mdx',
      absolutePath: 'projects/broken.mdx',
      frontmatter: {
        slug: 'broken',
        name: '',
        year: '2026',
        headline: 'Broken',
        summary: 'Broken fixture',
        capabilityIds: ['project:not-a-skill'],
        relatedTimelineIds: ['timeline:valid'],
        experienceId: 'raw-id',
      },
      body: '',
    } satisfies AuthoredContentRecord;

    expect(validateContentRecord(record)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'missing-required-field', path: 'name' }),
      expect.objectContaining({ code: 'invalid-id-list', path: 'capabilityIds' }),
      expect.objectContaining({ code: 'invalid-experience-id', path: 'experienceId' }),
    ]));
  });
});
