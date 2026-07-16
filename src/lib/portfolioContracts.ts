import { isContentNodeId, type ContentNodeId } from './contentIds';

export const GRAPH_ONLY_NODE_NAMESPACES = [
  'project-state',
  'feature',
  'decision',
  'constraint',
  'lesson',
  'skill',
  'community',
  'media',
  'repository',
  'offering',
] as const;

export type GraphOnlyNodeNamespace = (typeof GRAPH_ONLY_NODE_NAMESPACES)[number];
export type GraphOnlyNodeId = `${GraphOnlyNodeNamespace}:${string}`;
export type NodeId = ContentNodeId | GraphOnlyNodeId;
export type DestinationId = `destination:${string}`;
export type ExperienceId = `experience:${string}`;
export type DiscoveryId = `discovery:${string}`;
export type RelationshipId = `relationship:${string}`;
export type ContentVersion = `${number}-${number}-${number}:${string}`;

const NODE_ID_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isGraphOnlyNodeId(value: string): value is GraphOnlyNodeId {
  const [namespace, ...segments] = value.split(':');
  return GRAPH_ONLY_NODE_NAMESPACES.includes(namespace as GraphOnlyNodeNamespace)
    && segments.length > 0
    && segments.every(segment => NODE_ID_SEGMENT.test(segment));
}

export function isNodeId(value: string): value is NodeId {
  return isContentNodeId(value) || isGraphOnlyNodeId(value);
}

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
  'easter_egg_found',
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
