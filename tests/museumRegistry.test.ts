import { describe, expect, it, vi } from 'vitest';
import { getProjects } from '@/lib/projects';
import {
  createExhibitRegistry,
  resolveExhibitEntry,
  validateExhibitDefinitions,
} from '@/lib/museum/registry';
import { createExperienceLoaderRegistry } from '@/lib/museum/experienceLoaders';

describe('museum exhibit registry', () => {
  it('covers every authored project with a canonical direct entry', async () => {
    const projects = await getProjects();
    const registry = createExhibitRegistry(projects);

    expect(registry.issues).toEqual([]);
    expect(registry.exhibits).toHaveLength(projects.length);
    for (const project of projects) {
      const exhibit = registry.byProjectId.get(project.nodeId);
      expect(exhibit).toMatchObject({
        projectId: project.nodeId,
        slug: project.slug,
        supportedStages: project.nodeId === 'project:lifeinbox'
          ? ['signal', 'approach', 'handle', 'enter', 'understand']
          : ['signal', 'approach'],
      });
      expect(resolveExhibitEntry(registry, project.slug)).toMatchObject({
        href: `/projects#${project.slug}`,
        usedFallback: false,
      });
    }
  });

  it('connects only the three authored flagship experience IDs', async () => {
    const registry = createExhibitRegistry(await getProjects());
    expect(registry.exhibits
      .filter(exhibit => exhibit.experienceId)
      .map(exhibit => exhibit.experienceId)
      .sort()).toEqual([
      'experience:dreamlife',
      'experience:lifeinbox',
      'experience:sudoku-together',
    ]);
  });

  it('falls back safely for unknown exhibits and unsupported depth', async () => {
    const registry = createExhibitRegistry(await getProjects());
    expect(resolveExhibitEntry(registry, 'unknown', 'enter')).toMatchObject({
      destinationId: 'destination:projects',
      href: '/projects',
      stage: 'signal',
      usedFallback: true,
      usedStageFallback: true,
    });
    expect(resolveExhibitEntry(registry, 'lifeinbox', 'enter')).toMatchObject({
      href: '/projects#lifeinbox',
      stage: 'enter',
      usedFallback: false,
      usedStageFallback: false,
    });
    expect(resolveExhibitEntry(registry, 'dreamlife', 'enter')).toMatchObject({
      href: '/projects#dreamlife',
      stage: 'signal',
      usedFallback: false,
      usedStageFallback: true,
    });
  });

  it('reports malformed anchors and stage sequences', async () => {
    const registry = createExhibitRegistry(await getProjects());
    const source = registry.exhibits[0];
    const malformed = {
      ...source,
      supportedStages: ['approach', 'signal'] as typeof source.supportedStages,
      slug: 'wrong-anchor',
    };
    expect(validateExhibitDefinitions([malformed]).map(issue => issue.code)).toEqual(expect.arrayContaining([
      'invalid-stage-sequence',
      'destination-anchor-mismatch',
    ]));
  });
});

describe('museum experience loaders', () => {
  it('does not invoke a project module until its exhibit is requested', async () => {
    const registry = createExhibitRegistry(await getProjects());
    const dreamlife = registry.bySlug.get('dreamlife')!;
    const loader = vi.fn(async () => ({
      manifest: {
        id: 'experience:dreamlife' as const,
        projectId: 'project:dreamlife' as const,
        supportedStages: ['signal', 'approach'] as const,
        evidenceNodeIds: ['post:dreamlife:building-a-life-design-loop' as const],
      },
    }));
    const loaders = createExperienceLoaderRegistry({ 'experience:dreamlife': loader });

    expect(loader).not.toHaveBeenCalled();
    await expect(loaders.load(dreamlife)).resolves.toMatchObject({ status: 'available' });
    expect(loader).toHaveBeenCalledOnce();
  });

  it('loads each real flagship manifest and fails closed for absent modules', async () => {
    const registry = createExhibitRegistry(await getProjects());
    const loaders = createExperienceLoaderRegistry();
    for (const exhibit of registry.exhibits.filter(item => item.experienceId)) {
      await expect(loaders.load(exhibit)).resolves.toMatchObject({ status: 'available' });
    }
    await expect(loaders.load(registry.bySlug.get('story-app')!)).resolves.toEqual({ status: 'missing' });
  });

  it('fails closed when a loader rejects or returns another project manifest', async () => {
    const registry = createExhibitRegistry(await getProjects());
    const dreamlife = registry.bySlug.get('dreamlife')!;
    const failed = createExperienceLoaderRegistry({
      'experience:dreamlife': async () => { throw new Error('private loader detail'); },
    });
    const invalid = createExperienceLoaderRegistry({
      'experience:dreamlife': async () => ({
        manifest: {
          id: 'experience:dreamlife',
          projectId: 'project:lifeinbox',
          supportedStages: ['signal'],
          evidenceNodeIds: [],
        },
      }),
    });

    await expect(failed.load(dreamlife)).resolves.toEqual({ status: 'failed' });
    await expect(invalid.load(dreamlife)).resolves.toEqual({ status: 'invalid' });
  });

  it('rejects manifests that claim unimplemented depth', async () => {
    const registry = createExhibitRegistry(await getProjects());
    const dreamlife = registry.bySlug.get('dreamlife')!;
    const loaders = createExperienceLoaderRegistry({
      'experience:dreamlife': async () => ({
        manifest: {
          id: 'experience:dreamlife',
          projectId: 'project:dreamlife',
          supportedStages: ['signal', 'approach', 'handle'],
          evidenceNodeIds: [],
        },
      }),
    });

    await expect(loaders.load(dreamlife)).resolves.toEqual({ status: 'invalid' });
  });
});
