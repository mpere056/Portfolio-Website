import { describe, expect, it } from 'vitest';
import {
  classifyContentPath,
  createContentNodeId,
  deriveContentIdentity,
  isContentNodeId,
  resolveContentNodeId,
} from '@/lib/contentIds';

describe('content node IDs', () => {
  it('creates canonical IDs for every current content category', () => {
    expect(createContentNodeId({ kind: 'project', authoredId: 'dreamlife' })).toBe('project:dreamlife');
    expect(createContentNodeId({ kind: 'about', authoredId: 'piano-start' })).toBe('timeline:piano-start');
    expect(createContentNodeId({ kind: 'misc', authoredId: 'music-info' })).toBe('misc:music-info');
    expect(createContentNodeId({
      kind: 'blog',
      site: 'lifeinbox',
      authoredId: 'local-first-capture-needs-trust',
    })).toBe('post:lifeinbox:local-first-capture-needs-trust');
  });

  it('rejects unstable or ambiguous identifier shapes', () => {
    expect(() => createContentNodeId({ kind: 'project', authoredId: 'DreamLife' })).toThrow(/lowercase ASCII kebab-case/);
    expect(() => createContentNodeId({ kind: 'about', authoredId: '2025/life-app' })).toThrow(/lowercase ASCII kebab-case/);
    expect(() => createContentNodeId({ kind: 'blog', site: 'LifeInbox', authoredId: 'release-note' })).toThrow(/lowercase ASCII kebab-case/);
    expect(isContentNodeId('project:dreamlife')).toBe(true);
    expect(isContentNodeId('post:lifeinbox:release-note')).toBe(true);
    expect(isContentNodeId('about:dreamlife')).toBe(false);
    expect(isContentNodeId('post:release-note')).toBe(false);
  });

  it('resolves legacy aliases only to canonical IDs', () => {
    expect(resolveContentNodeId('life-app', { 'life-app': 'project:dreamlife' })).toBe('project:dreamlife');
    expect(resolveContentNodeId('project:dreamlife', { 'life-app': 'project:dreamlife' })).toBe('project:dreamlife');
    expect(resolveContentNodeId('unknown', { 'life-app': 'project:dreamlife' })).toBeUndefined();
  });

  it('derives one canonical identity for inventory and ingestion consumers', () => {
    const timeline = classifyContentPath('about/2025-life-app.mdx');
    const project = classifyContentPath('projects/dreamlife.mdx');
    const post = classifyContentPath('sites/lifeinbox/blog/release-note.mdx');

    expect(timeline && deriveContentIdentity(timeline, { id: 'dreamlife' }, 'about/2025-life-app.mdx')).toMatchObject({
      nodeId: 'timeline:dreamlife',
      identifierSource: 'id',
    });
    expect(project && deriveContentIdentity(project, { slug: 'dreamlife' }, 'projects/dreamlife.mdx')).toMatchObject({
      nodeId: 'project:dreamlife',
      identifierSource: 'slug',
    });
    expect(post && deriveContentIdentity(post, {}, 'sites/lifeinbox/blog/release-note.mdx')).toMatchObject({
      nodeId: 'post:lifeinbox:release-note',
      identifierSource: 'filename-fallback',
    });
    expect(classifyContentPath('notes/unknown.mdx')).toBeUndefined();
  });
});
