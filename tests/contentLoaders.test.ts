import { describe, expect, it } from 'vitest';
import { loadContentRecords } from '@/lib/content/loaders';
import { getProjects } from '@/lib/projects';
import { getSiteBlogPosts } from '@/lib/siteBlogs';
import { getTimelineEntries } from '@/lib/timeline';

describe('shared content loaders', () => {
  it('recursively loads the complete managed corpus with canonical identities', async () => {
    const records = await loadContentRecords();
    expect(records).toHaveLength(40);
    expect(records.filter(record => record.nodeId)).toHaveLength(40);
    expect(records.find(record => record.relativePath === 'projects/dreamlife.mdx')).toMatchObject({
      kind: 'project',
      nodeId: 'project:dreamlife',
      identifierSource: 'slug',
    });
    expect(records.find(record => record.relativePath.includes('building-a-life-design-loop'))).toMatchObject({
      kind: 'blog',
      site: 'dreamlife',
      nodeId: 'post:dreamlife:building-a-life-design-loop',
    });
  });

  it('preserves the existing project API shape, ordering, and normalization', async () => {
    const projects = await getProjects();
    expect(projects).toHaveLength(9);
    expect(projects.map(project => project.slug).sort()).toEqual([
      'discord-bot',
      'discord-sudoku-activity',
      'discord-sync-messaging',
      'dreamlife',
      'game-mod',
      'group-finder',
      'kitsune-karuta',
      'lifeinbox',
      'story-app',
    ]);
    expect(projects.map(project => Number(project.year))).toEqual(
      [...projects].map(project => Number(project.year)).sort((left, right) => right - left),
    );
    expect(projects.find(project => project.slug === 'dreamlife')).toMatchObject({
      name: 'Dreamlife',
      year: '2025',
      tech: expect.arrayContaining(['React Native + Expo', 'OpenAI']),
      repoUrl: 'https://github.com/dreamlife-app/dreamlife-mobile',
    });
  });

  it('preserves chronological timeline output and nested blog output', async () => {
    const timeline = await getTimelineEntries();
    expect(timeline).toHaveLength(20);
    expect(timeline[0].id).toBe('birth');
    expect(timeline.at(-1)?.id).toBe('dreamlife');

    const posts = await getSiteBlogPosts('dreamlife');
    expect(posts).toEqual([expect.objectContaining({
      site: 'dreamlife',
      slug: 'building-a-life-design-loop',
      title: 'Building a Life Design Loop',
    })]);
    expect(await getSiteBlogPosts('missing-site')).toEqual([]);
  });
});
