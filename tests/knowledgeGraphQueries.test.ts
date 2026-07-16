import { describe, expect, it } from 'vitest';
import type { NodeId } from '../src/lib/portfolioContracts';
import type {
  CompiledKnowledgeGraph,
  GraphNode,
  GraphRelationship,
} from '../src/lib/content/graph';
import {
  createKnowledgeGraphQueries,
  loadKnowledgeGraphQueries,
} from '../src/lib/content/queries';

const nodes: GraphNode[] = [
  { id: 'project:dreamlife', type: 'project', title: 'Dreamlife', summary: 'Dreamlife summary', visibility: 'public', tags: [] },
  { id: 'project:lifeinbox', type: 'project', title: 'LifeInbox', summary: 'LifeInbox summary', visibility: 'public', tags: [] },
  { id: 'post:dreamlife:building-a-life-design-loop', type: 'post', title: 'Life design loop', summary: 'Post summary', visibility: 'public', tags: [] },
  { id: 'skill:product-strategy', type: 'skill', title: 'Product Strategy', summary: 'Skill summary', visibility: 'public', tags: [] },
  { id: 'timeline:dreamlife', type: 'timeline', title: 'Dreamlife began', summary: 'Timeline summary', visibility: 'public', tags: [] },
  { id: 'misc:private-note', type: 'misc', title: 'Private note', summary: 'Private', visibility: 'private', tags: [] },
];

const relationships: GraphRelationship[] = [
  {
    id: 'relationship:dreamlife-documented',
    sourceId: 'project:dreamlife',
    type: 'documented_in',
    targetId: 'post:dreamlife:building-a-life-design-loop',
    explanation: 'The post documents the product reasoning.',
    evidenceNodeIds: ['post:dreamlife:building-a-life-design-loop'],
    status: 'reviewed',
    visibility: 'public',
  },
  {
    id: 'relationship:dreamlife-demonstrates-strategy',
    sourceId: 'project:dreamlife',
    type: 'demonstrates',
    targetId: 'skill:product-strategy',
    explanation: 'Dreamlife demonstrates product strategy.',
    evidenceNodeIds: ['project:dreamlife'],
    status: 'reviewed',
    visibility: 'public',
  },
  {
    id: 'relationship:strategy-evidenced-by-lifeinbox',
    sourceId: 'skill:product-strategy',
    type: 'evidenced_by',
    targetId: 'project:lifeinbox',
    explanation: 'LifeInbox also evidences product strategy.',
    evidenceNodeIds: ['project:lifeinbox'],
    status: 'reviewed',
    visibility: 'public',
  },
  {
    id: 'relationship:timeline-led-to-dreamlife',
    sourceId: 'timeline:dreamlife',
    type: 'led_to',
    targetId: 'project:dreamlife',
    explanation: 'The timeline event led to the product.',
    evidenceNodeIds: ['timeline:dreamlife'],
    status: 'reviewed',
    visibility: 'public',
  },
  {
    id: 'relationship:hidden-project-connection',
    sourceId: 'project:dreamlife',
    type: 'contrasts_with',
    targetId: 'project:lifeinbox',
    explanation: 'A hidden reviewed contrast.',
    evidenceNodeIds: ['project:dreamlife', 'project:lifeinbox'],
    status: 'reviewed',
    visibility: 'hidden-discovery',
  },
  {
    id: 'relationship:private-leak',
    sourceId: 'project:dreamlife',
    type: 'documented_in',
    targetId: 'misc:private-note',
    explanation: 'Must never appear.',
    evidenceNodeIds: ['misc:private-note'],
    status: 'reviewed',
    visibility: 'public',
  },
  {
    id: 'relationship:draft-public-edge',
    sourceId: 'project:dreamlife',
    type: 'depends_on',
    targetId: 'project:lifeinbox',
    explanation: 'Must not appear before review.',
    evidenceNodeIds: [],
    status: 'draft',
    visibility: 'public',
  },
];

const fixture: CompiledKnowledgeGraph = { nodes, relationships, issues: [] };

describe('bounded knowledge graph queries', () => {
  it('filters unsafe relationships, orders deterministically, and clamps limits', () => {
    const queries = createKnowledgeGraphQueries(fixture);
    const result = queries.getPublicRelationships('project:dreamlife', { limit: 999 });
    expect(result.map(item => item.relationship.id)).toEqual([
      'relationship:timeline-led-to-dreamlife',
      'relationship:dreamlife-demonstrates-strategy',
      'relationship:dreamlife-documented',
    ]);
    expect(queries.getPublicRelationships('project:dreamlife', { limit: 0 })).toHaveLength(1);
  });

  it('queries consequences, project connections, and evidence without duplicates', () => {
    const queries = createKnowledgeGraphQueries(fixture);
    expect(queries.getConsequencesForTimelineEvent('timeline:dreamlife').map(item => item.target.id))
      .toEqual(['project:dreamlife']);
    expect(queries.getRelatedProjects('skill:product-strategy').map(item => item.node.id))
      .toEqual(['project:dreamlife', 'project:lifeinbox']);
    expect(queries.getEvidenceForSkill('skill:product-strategy').map(node => node.id))
      .toEqual(['project:dreamlife', 'project:lifeinbox']);
  });

  it('requires an explicit unlock for reviewed hidden discoveries', () => {
    const queries = createKnowledgeGraphQueries(fixture);
    expect(queries.getHiddenDiscoveries('project:dreamlife', new Set())).toEqual([]);
    expect(queries.getHiddenDiscoveries(
      'project:dreamlife',
      new Set(['relationship:hidden-project-connection']),
    ).map(item => item.relationship.id)).toEqual(['relationship:hidden-project-connection']);
  });

  it('returns destination-safe related, tour, and semantic render adapters', () => {
    const queries = createKnowledgeGraphQueries(fixture);
    const related = queries.getRelatedContent('project:dreamlife');
    expect(related.map(item => [item.nodeId, item.destination.id])).toEqual([
      ['post:dreamlife:building-a-life-design-loop', 'destination:post-dreamlife-building-a-life-design-loop'],
    ]);
    expect(queries.getTourDestinationCandidates('recruiter', { limit: 2 }))
      .toHaveLength(2);
    expect(queries.getSemanticLightingEdges('project:dreamlife')).toEqual([
      expect.objectContaining({
        relationshipId: 'relationship:dreamlife-documented',
        sourceDestinationId: 'destination:museum-project-dreamlife',
        targetDestinationId: 'destination:post-dreamlife-building-a-life-design-loop',
        strength: 'primary',
      }),
    ]);
  });

  it('expands AI context cycle-safely with hard node and relationship bounds', () => {
    const queries = createKnowledgeGraphQueries(fixture);
    const context = queries.getAIContextSubgraph('project:dreamlife', {
      maxDepth: 99,
      nodeLimit: 3,
      relationshipLimit: 2,
    });
    expect(context.centerNode?.id).toBe('project:dreamlife');
    expect(context.nodes).toHaveLength(3);
    expect(context.relationships).toHaveLength(2);
    expect(new Set(context.nodes.map(node => node.id)).size).toBe(context.nodes.length);
    expect(queries.getAIContextSubgraph('misc:private-note' as NodeId).nodes).toEqual([]);
  });

  it('queries the current compiled corpus without exposing raw unsafe data', async () => {
    const queries = await loadKnowledgeGraphQueries();
    expect(queries.getEvidenceForSkill('skill:discord-platform-development'))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'project:discord-bot' }),
        expect.objectContaining({ id: 'project:discord-sudoku-activity' }),
      ]));
    expect(queries.getRelatedContent('project:dreamlife'))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ nodeId: 'post:dreamlife:building-a-life-design-loop' }),
      ]));
  });
});
