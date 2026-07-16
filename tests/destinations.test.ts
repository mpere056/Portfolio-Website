import { describe, expect, it } from 'vitest';
import {
  DESTINATION_REGISTRY,
  getSuggestibleDestinations,
  resolveDestination,
  validateDestinationRegistry,
} from '@/lib/destinations';
import { PROJECT_SITES } from '@/lib/projectSites';

const currentProjectDestinations = [
  'destination:project-discord-bot',
  'destination:project-sudokutogether',
  'destination:project-discord-sync-messaging',
  'destination:project-dreamlife',
  'destination:project-game-mod',
  'destination:project-group-finder',
  'destination:project-kitsune-karuta',
  'destination:project-lifeinbox',
  'destination:project-story-app',
];

describe('destination registry', () => {
  it('validates every entry, fallback, node ID, and target origin', () => {
    expect(validateDestinationRegistry()).toEqual([]);
  });

  it('covers every current project and project subdomain', () => {
    for (const destinationId of currentProjectDestinations) {
      expect(DESTINATION_REGISTRY).toHaveProperty(destinationId);
    }

    for (const site of PROJECT_SITES) {
      expect(DESTINATION_REGISTRY).toHaveProperty(`destination:project-${site.subdomain}`);
      expect(DESTINATION_REGISTRY).toHaveProperty(`destination:project-${site.subdomain}-blog`);
    }
  });

  it('resolves canonical main and cross-subdomain destinations', () => {
    expect(resolveDestination('destination:home')).toMatchObject({
      href: '/',
      navigationMode: 'same-origin',
      usedFallback: false,
    });
    expect(resolveDestination('destination:project-dreamlife')).toMatchObject({
      href: 'https://dreamlife.marknperera.ca/',
      navigationMode: 'full-document',
      usedFallback: false,
    });
    expect(resolveDestination('destination:project-dreamlife-blog', {
      currentOrigin: 'dreamlife',
    })).toMatchObject({
      navigationMode: 'same-origin',
      usedFallback: false,
    });
  });

  it('serializes allowlisted primitive state deterministically', () => {
    expect(resolveDestination('destination:about', {
      safeState: { event: 'discord-server-growth' },
    })).toMatchObject({
      href: '/about?event=discord-server-growth',
      safeState: { event: 'discord-server-growth' },
      usedFallback: false,
    });
    expect(resolveDestination('destination:projects', {
      safeState: { project: 'dreamlife' },
    }).href).toBe('/projects?project=dreamlife');
  });

  it('falls back safely for unknown, unavailable, or unsafe requests', () => {
    expect(resolveDestination('destination:unknown')).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'unknown-destination',
    });
    expect(resolveDestination('destination:archive')).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'unavailable-destination',
    });
    expect(resolveDestination('destination:about', {
      safeState: { project: 'dreamlife' },
    })).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'unsupported-safe-state',
    });
    expect(resolveDestination('destination:about', {
      safeState: { event: ['not', 'primitive'] },
    })).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'invalid-safe-state',
    });
    expect(resolveDestination('destination:about', {
      safeState: { event: Number.NaN },
    })).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'invalid-safe-state',
    });
  });

  it('preserves legacy compatibility without suggesting legacy or unavailable routes', () => {
    expect(resolveDestination('destination:chat-legacy', {
      safeState: { prompt: 'Tell me about Dreamlife' },
    })).toMatchObject({
      href: '/chat?prompt=Tell+me+about+Dreamlife',
      usedFallback: false,
    });
    expect(resolveDestination('destination:chat-legacy', { allowLegacy: false })).toMatchObject({
      href: '/',
      usedFallback: true,
      reason: 'unavailable-destination',
    });

    const suggestions = getSuggestibleDestinations();
    const suggestionIds: string[] = suggestions.map(destination => destination.id);
    expect(suggestions.every(destination => destination.status === 'canonical')).toBe(true);
    expect(suggestionIds).not.toContain('destination:chat-legacy');
    expect(suggestionIds).not.toContain('destination:archive');
    expect(suggestionIds).not.toContain('destination:templates-internal');
  });
});
