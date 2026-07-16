import type { ContentNodeId } from './contentIds';
import type {
  ContentVersion,
  DepthState,
  DestinationId,
  DiscoveryEvent,
  ExperienceId,
  RelationshipId,
  SafeState,
} from './portfolioContracts';

export const PORTFOLIO_ACTION_TYPES = [
  'depth.changed',
  'destination.requested',
  'relationship.selected',
  'project_state.updated',
  'discovery.recorded',
  'stimulation.changed',
  'experience.failed',
] as const;

export type PortfolioActionType = (typeof PORTFOLIO_ACTION_TYPES)[number];
export type ProjectNodeId = Extract<ContentNodeId, `project:${string}`>;

export interface DepthChangedAction {
  readonly type: 'depth.changed';
  readonly payload: DepthState;
}

export interface DestinationRequestedAction {
  readonly type: 'destination.requested';
  readonly payload: {
    readonly destinationId: DestinationId;
    readonly safeState?: SafeState;
  };
}

export interface RelationshipSelectedAction {
  readonly type: 'relationship.selected';
  readonly payload: {
    readonly relationshipId: RelationshipId;
  };
}

export interface ProjectStateUpdatedAction {
  readonly type: 'project_state.updated';
  readonly payload: {
    readonly projectId: ProjectNodeId;
    readonly contentVersion: ContentVersion;
  };
}

export interface DiscoveryRecordedAction {
  readonly type: 'discovery.recorded';
  readonly payload: DiscoveryEvent;
}

export interface StimulationChangedAction {
  readonly type: 'stimulation.changed';
  readonly payload: {
    readonly normalizedValue: number;
  };
}

export interface ExperienceFailedAction {
  readonly type: 'experience.failed';
  readonly payload: {
    readonly experienceId: ExperienceId;
    readonly code: string;
  };
}

export type PortfolioAction =
  | DepthChangedAction
  | DestinationRequestedAction
  | RelationshipSelectedAction
  | ProjectStateUpdatedAction
  | DiscoveryRecordedAction
  | StimulationChangedAction
  | ExperienceFailedAction;

function normalizedStimulation(value: number) {
  if (!Number.isFinite(value)) {
    throw new TypeError('Stimulation must be a finite number');
  }

  return Math.min(1, Math.max(0, value));
}

export const portfolioActions = {
  depthChanged(payload: DepthState): DepthChangedAction {
    return { type: 'depth.changed', payload };
  },

  destinationRequested(
    destinationId: DestinationId,
    safeState?: SafeState,
  ): DestinationRequestedAction {
    return {
      type: 'destination.requested',
      payload: { destinationId, safeState },
    };
  },

  relationshipSelected(relationshipId: RelationshipId): RelationshipSelectedAction {
    return { type: 'relationship.selected', payload: { relationshipId } };
  },

  projectStateUpdated(
    projectId: ProjectNodeId,
    contentVersion: ContentVersion,
  ): ProjectStateUpdatedAction {
    return { type: 'project_state.updated', payload: { projectId, contentVersion } };
  },

  discoveryRecorded(payload: DiscoveryEvent): DiscoveryRecordedAction {
    return { type: 'discovery.recorded', payload };
  },

  stimulationChanged(value: number): StimulationChangedAction {
    return {
      type: 'stimulation.changed',
      payload: { normalizedValue: normalizedStimulation(value) },
    };
  },

  experienceFailed(experienceId: ExperienceId, code: string): ExperienceFailedAction {
    return { type: 'experience.failed', payload: { experienceId, code } };
  },
} as const;

export function assertNeverAction(action: never): never {
  throw new Error(`Unhandled portfolio action: ${JSON.stringify(action)}`);
}
