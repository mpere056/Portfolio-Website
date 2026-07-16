import type { ContentNodeId } from './contentIds';

export type NodeId = ContentNodeId;
export type DestinationId = `destination:${string}`;
export type ExperienceId = `experience:${string}`;
export type DiscoveryId = `discovery:${string}`;
export type RelationshipId = `relationship:${string}`;
export type ContentVersion = `${number}-${number}-${number}:${string}`;

export const DEPTH_STAGES = ['signal', 'approach', 'handle', 'enter', 'understand'] as const;
export type DepthStage = (typeof DEPTH_STAGES)[number];

export type SafeStateValue = string | number | boolean;
export type SafeState = Readonly<Record<string, SafeStateValue>>;

export interface DepthState {
  destinationId: DestinationId;
  stage: DepthStage;
  selectedPartId?: string;
  safeState?: SafeState;
}

export interface ExperienceDestination {
  id: DestinationId;
  href: string;
  nodeId?: NodeId;
  areaId?: string;
  experienceId?: ExperienceId;
  requestedDepth?: DepthStage;
  safeState?: SafeState;
}

export const DISCOVERY_EVENT_TYPES = [
  'signaled',
  'approached',
  'handled',
  'entered',
  'understood',
  'meaningful_update_seen',
] as const;
export type DiscoveryEventType = (typeof DISCOVERY_EVENT_TYPES)[number];

export interface DiscoveryEvent {
  id: string;
  type: DiscoveryEventType;
  discoveryId: DiscoveryId;
  destinationId: DestinationId;
  occurredAt: string;
  contentVersion?: ContentVersion;
}

export interface PortfolioAIContext {
  route: string;
  destinationId?: DestinationId;
  nodeId?: NodeId;
  experienceId?: ExperienceId;
  depthStage?: DepthStage;
  selectedRelationshipId?: RelationshipId;
}

export type ArchiveCardType =
  | 'project'
  | 'timeline'
  | 'post'
  | 'architecture'
  | 'experience'
  | 'skill'
  | 'offering';

export interface ArchiveCard {
  id: string;
  type: ArchiveCardType;
  title: string;
  summary: string;
  sourceNodeIds: readonly NodeId[];
  destinationId: DestinationId;
  visualKey?: string;
}

export interface ProjectExperienceManifest {
  id: ExperienceId;
  projectId: ContentNodeId;
  supportedStages: readonly DepthStage[];
  evidenceNodeIds: readonly NodeId[];
}
