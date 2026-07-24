import { describe, expect, it } from 'vitest';
import { loadKnowledgeGraphQueries } from '@/lib/content/queries';
import { getProjects } from '@/lib/projects';
import { PRACTICE_IDS } from '@/lib/practices';

describe('portfolio practice taxonomy', () => {
  it('classifies every current project into exactly one controlled practice', async () => {
    const projects = await getProjects();

    expect(projects).toHaveLength(9);
    expect(projects.every(project => PRACTICE_IDS.includes(project.primaryPracticeId))).toBe(true);
    expect(new Set(projects.map(project => project.nodeId)).size).toBe(projects.length);
  });

  it('exposes bounded deterministic project membership through the graph', async () => {
    const queries = await loadKnowledgeGraphQueries();

    expect(queries.projectsForPractice('ai-possible-futures').map(node => node.id)).toEqual([
      'project:dreamlife',
      'project:story-app',
    ]);
    expect(queries.projectsForPractice('life-systems-tools').map(node => node.id)).toEqual([
      'project:group-finder',
      'project:lifeinbox',
    ]);
    expect(queries.projectsForPractice('play-community', { limit: 2 })).toHaveLength(2);
    expect(queries.projectsForPractice('music-performance')).toEqual([]);
  });

  it('resolves a project back to its public practice node', async () => {
    const queries = await loadKnowledgeGraphQueries();

    expect(queries.practiceForProject('project:dreamlife')?.id)
      .toBe('practice:ai-possible-futures');
    expect(queries.getPractice('music-performance')?.title)
      .toBe('Music & Performance');
  });
});
