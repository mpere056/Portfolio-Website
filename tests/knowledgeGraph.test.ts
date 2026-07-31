import { describe, expect, it } from 'vitest';
import {
  compileKnowledgeGraph,
  loadKnowledgeGraph,
  validateKnowledgeGraph,
  type GraphNode,
  type GraphRelationship,
} from '@/lib/content/graph';

describe('knowledge graph compiler', () => {
  it('compiles the current corpus and reviewed initial subgraph deterministically', async () => {
    const graph = await loadKnowledgeGraph();
    expect(graph.issues).toEqual([]);
    expect(graph.nodes).toHaveLength(61);
    expect(graph.relationships).toHaveLength(28);
    expect(graph.relationships.map(relationship => relationship.id)).toEqual(
      [...graph.relationships].map(relationship => relationship.id).sort(),
    );
    expect(graph.nodes.filter(node => node.type === 'skill')).toHaveLength(10);
    expect(graph.nodes.filter(node => node.type === 'practice').map(node => node.id).sort())
      .toEqual([
        'practice:life-systems-tools',
        'practice:music-performance',
        'practice:play-community',
      ]);
  });

  it('rejects broken references, duplicate IDs, unreviewed public edges, and private leaks', () => {
    const nodes: GraphNode[] = [
      { id: 'project:public', type: 'project', title: 'Public', summary: 'Public node', visibility: 'public', tags: [] },
      { id: 'skill:private', type: 'skill', title: 'Private', summary: 'Private node', visibility: 'private', tags: [] },
      { id: 'project:public', type: 'project', title: 'Duplicate', summary: 'Duplicate node', visibility: 'public', tags: [] },
    ];
    const relationships: GraphRelationship[] = [{
      id: 'relationship:broken',
      sourceId: 'project:public',
      type: 'demonstrates',
      targetId: 'skill:private',
      explanation: '',
      evidenceNodeIds: ['project:missing'],
      status: 'draft',
      visibility: 'public',
    }];

    expect(validateKnowledgeGraph(nodes, relationships)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'duplicate-node-id' }),
      expect.objectContaining({ code: 'broken-reference' }),
      expect.objectContaining({ code: 'unreviewed-public-relationship' }),
      expect.objectContaining({ code: 'missing-public-explanation' }),
      expect.objectContaining({ code: 'private-node-leak' }),
    ]));
  });

  it('includes content-schema failures in compiled graph validation', () => {
    const graph = compileKnowledgeGraph({
      contentRecords: [{
        kind: 'project',
        nodeId: 'project:broken',
        relativePath: 'projects/broken.mdx',
        absolutePath: 'projects/broken.mdx',
        frontmatter: { slug: 'broken' },
        body: '',
      }],
    });
    expect(graph.issues.some(issue => issue.code === 'content-missing-required-field')).toBe(true);
  });

  it('keeps empty legacy misc records valid without inventing a factual claim', () => {
    const graph = compileKnowledgeGraph({
      contentRecords: [{
        kind: 'misc',
        nodeId: 'misc:legacy-note',
        relativePath: 'misc/legacy-note.mdx',
        absolutePath: 'misc/legacy-note.mdx',
        frontmatter: {},
        body: '',
      }],
    });

    expect(graph.issues).toEqual([]);
    expect(graph.nodes[0]?.summary).toBe('Authored misc content record.');
  });
});
