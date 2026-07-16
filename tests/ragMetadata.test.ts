import { describe, expect, it } from 'vitest';
import { loadKnowledgeGraph, type CompiledKnowledgeGraph } from '../src/lib/content/graph';
import { createRagGraphMetadataIndex } from '../src/lib/content/ragMetadata';

describe('graph-aware RAG metadata', () => {
  it('derives bounded public metadata and canonical source descriptors from the current graph', async () => {
    const index = createRagGraphMetadataIndex(await loadKnowledgeGraph());
    expect(index.get('project:dreamlife')).toEqual(expect.objectContaining({
      nodeId: 'project:dreamlife',
      nodeType: 'project',
      projectId: 'project:dreamlife',
      visibility: 'public',
      source: expect.objectContaining({
        nodeId: 'project:dreamlife',
        destination: expect.objectContaining({ id: 'destination:museum-project-dreamlife' }),
      }),
    }));
    expect(index.get('post:dreamlife:building-a-life-design-loop')).toEqual(expect.objectContaining({
      projectId: 'project:dreamlife',
    }));
    expect(index.get('project:dreamlife')?.relatedNodeIds.length).toBeLessThanOrEqual(7);
  });

  it('excludes private and draft nodes from ingestion metadata', () => {
    const graph: CompiledKnowledgeGraph = {
      nodes: [
        { id: 'project:public', type: 'project', title: 'Public', summary: 'Public', visibility: 'public', tags: [] },
        { id: 'project:private', type: 'project', title: 'Private', summary: 'Private', visibility: 'private', tags: [] },
        { id: 'project:draft', type: 'project', title: 'Draft', summary: 'Draft', visibility: 'draft', tags: [] },
      ],
      relationships: [],
      issues: [],
    };
    const index = createRagGraphMetadataIndex(graph);
    expect([...index.keys()]).toEqual(['project:public']);
  });
});
