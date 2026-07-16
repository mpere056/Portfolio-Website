import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  DEPTH_STAGES,
  DISCOVERY_EVENT_TYPES,
  type ArchiveCard,
  type DepthState,
  type DestinationId,
  type DiscoveryEvent,
  type ExperienceDestination,
  type PortfolioAIContext,
  type ProjectExperienceManifest,
} from '@/lib/portfolioContracts';

const dreamlifeDestination = {
  id: 'destination:project-dreamlife-understand',
  href: '/projects/dreamlife',
  nodeId: 'project:dreamlife',
  experienceId: 'experience:dreamlife-future-paths',
  requestedDepth: 'understand',
  safeState: { scenario: 'wild-card', comparison: 2, expanded: true },
} as const satisfies ExperienceDestination;

describe('portfolio contracts', () => {
  it('shares one ordered depth and discovery vocabulary', () => {
    expect(DEPTH_STAGES).toEqual(['signal', 'approach', 'handle', 'enter', 'understand']);
    expect(DISCOVERY_EVENT_TYPES).toContain('meaningful_update_seen');
  });

  it('types a destination across depth, discovery, AI, cards, and project experiences', () => {
    const depth = {
      destinationId: dreamlifeDestination.id,
      stage: dreamlifeDestination.requestedDepth,
      safeState: dreamlifeDestination.safeState,
    } satisfies DepthState;
    const discovery = {
      id: 'dreamlife-path-understood-1',
      type: 'understood',
      discoveryId: 'discovery:dreamlife-path-understood',
      destinationId: dreamlifeDestination.id,
      occurredAt: '2026-07-16T00:00:00.000Z',
      contentVersion: '1-0-0:dreamlife',
    } satisfies DiscoveryEvent;
    const aiContext = {
      route: dreamlifeDestination.href,
      destinationId: dreamlifeDestination.id,
      nodeId: dreamlifeDestination.nodeId,
      experienceId: dreamlifeDestination.experienceId,
      depthStage: depth.stage,
    } satisfies PortfolioAIContext;
    const card = {
      id: 'card:dreamlife-future-paths',
      type: 'experience',
      title: 'Compare possible futures',
      summary: 'Inspect the product loop through one authored scenario.',
      sourceNodeIds: ['project:dreamlife'],
      destinationId: dreamlifeDestination.id,
    } as const satisfies ArchiveCard;
    const manifest = {
      id: dreamlifeDestination.experienceId,
      projectId: 'project:dreamlife',
      supportedStages: ['handle', 'enter', 'understand'],
      evidenceNodeIds: ['project:dreamlife', 'timeline:dreamlife'],
    } as const satisfies ProjectExperienceManifest;

    expectTypeOf(dreamlifeDestination.id).toMatchTypeOf<DestinationId>();
    expect(discovery.destinationId).toBe(aiContext.destinationId);
    expect(card.destinationId).toBe(dreamlifeDestination.id);
    expect(manifest.id).toBe(aiContext.experienceId);
  });
});
