import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  PORTFOLIO_ACTION_TYPES,
  assertNeverAction,
  portfolioActions,
  type PortfolioAction,
  type PortfolioActionType,
  type ProjectNodeId,
} from '@/lib/portfolioActions';
import {
  resolveDestination,
  type DestinationResolution,
} from '@/lib/destinations';
import type {
  ContentVersion,
  DepthState,
  DiscoveryEvent,
  PortfolioAIContext,
  RelationshipId,
} from '@/lib/portfolioContracts';

type ExperienceFailure = Extract<PortfolioAction, { type: 'experience.failed' }>['payload'];

interface IntegrationState {
  context: PortfolioAIContext;
  depth?: DepthState;
  destination?: DestinationResolution;
  relationshipId?: RelationshipId;
  projectVersions: Partial<Record<ProjectNodeId, ContentVersion>>;
  discoveries: DiscoveryEvent[];
  stimulation: number;
  failures: ExperienceFailure[];
}

function applyAction(state: IntegrationState, action: PortfolioAction): IntegrationState {
  switch (action.type) {
    case 'depth.changed':
      return {
        ...state,
        depth: action.payload,
        context: {
          ...state.context,
          destinationId: action.payload.destinationId,
          depthStage: action.payload.stage,
        },
      };
    case 'destination.requested': {
      const destination = resolveDestination(action.payload.destinationId, {
        safeState: action.payload.safeState,
      });
      return {
        ...state,
        destination,
        context: {
          ...state.context,
          route: destination.href,
          destinationId: destination.destination.id,
          nodeId: destination.destination.nodeId,
          experienceId: destination.destination.experienceId,
        },
      };
    }
    case 'relationship.selected':
      return {
        ...state,
        relationshipId: action.payload.relationshipId,
        context: {
          ...state.context,
          selectedRelationshipId: action.payload.relationshipId,
        },
      };
    case 'project_state.updated':
      return {
        ...state,
        projectVersions: {
          ...state.projectVersions,
          [action.payload.projectId]: action.payload.contentVersion,
        },
      };
    case 'discovery.recorded':
      return { ...state, discoveries: [...state.discoveries, action.payload] };
    case 'stimulation.changed':
      return { ...state, stimulation: action.payload.normalizedValue };
    case 'experience.failed':
      return { ...state, failures: [...state.failures, action.payload] };
    default:
      return assertNeverAction(action);
  }
}

const initialState: IntegrationState = {
  context: { route: '/' },
  projectVersions: {},
  discoveries: [],
  stimulation: 0.5,
  failures: [],
};

describe('portfolio actions', () => {
  it('defines the complete approved action vocabulary as plain typed data', () => {
    expect(PORTFOLIO_ACTION_TYPES).toEqual([
      'depth.changed',
      'destination.requested',
      'relationship.selected',
      'project_state.updated',
      'discovery.recorded',
      'stimulation.changed',
      'experience.failed',
    ]);

    const request = portfolioActions.destinationRequested('destination:about', {
      event: 'discord-server-growth',
    });
    expect(request).toEqual({
      type: 'destination.requested',
      payload: {
        destinationId: 'destination:about',
        safeState: { event: 'discord-server-growth' },
      },
    });
    expect('href' in request.payload).toBe(false);
    expectTypeOf(request).toMatchTypeOf<PortfolioAction>();
    expectTypeOf<PortfolioAction['type']>().toEqualTypeOf<PortfolioActionType>();
  });

  it('normalizes trusted local stimulation values at the creator boundary', () => {
    expect(portfolioActions.stimulationChanged(-0.4).payload.normalizedValue).toBe(0);
    expect(portfolioActions.stimulationChanged(0.65).payload.normalizedValue).toBe(0.65);
    expect(portfolioActions.stimulationChanged(1.4).payload.normalizedValue).toBe(1);
    expect(() => portfolioActions.stimulationChanged(Number.NaN)).toThrow(TypeError);
  });

  it('exhaustively integrates depth, AI context, and validated destinations', () => {
    const discovery = {
      id: 'about-growth-understood-1',
      type: 'understood',
      discoveryId: 'discovery:about-growth-understood',
      destinationId: 'destination:about',
      occurredAt: '2026-07-16T00:00:00.000Z',
    } as const satisfies DiscoveryEvent;

    const actions: PortfolioAction[] = [
      portfolioActions.depthChanged({
        destinationId: 'destination:about',
        stage: 'handle',
        selectedPartId: 'discord-server-growth',
      }),
      portfolioActions.relationshipSelected('relationship:about-growth-to-ai-systems'),
      portfolioActions.destinationRequested('destination:about', {
        event: 'discord-server-growth',
      }),
      portfolioActions.projectStateUpdated('project:dreamlife', '1-0-0:dreamlife'),
      portfolioActions.discoveryRecorded(discovery),
      portfolioActions.stimulationChanged(0.35),
      portfolioActions.experienceFailed('experience:dreamlife-future-paths', 'asset-load-failed'),
    ];

    const state = actions.reduce(applyAction, initialState);

    expect(state.depth).toMatchObject({
      destinationId: 'destination:about',
      stage: 'handle',
    });
    expect(state.destination).toMatchObject({
      href: '/about?event=discord-server-growth',
      usedFallback: false,
    });
    expect(state.context).toMatchObject({
      route: '/about?event=discord-server-growth',
      destinationId: 'destination:about',
      depthStage: 'handle',
      selectedRelationshipId: 'relationship:about-growth-to-ai-systems',
    });
    expect(state.projectVersions['project:dreamlife']).toBe('1-0-0:dreamlife');
    expect(state.discoveries).toEqual([discovery]);
    expect(state.stimulation).toBe(0.35);
    expect(state.failures).toEqual([{
      experienceId: 'experience:dreamlife-future-paths',
      code: 'asset-load-failed',
    }]);
  });
});
