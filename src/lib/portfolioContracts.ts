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

function isScopedId(value: string, namespace: string) {
  const [actualNamespace, ...segments] = value.split(':');
  return actualNamespace === namespace
    && segments.length > 0
    && segments.every(segment => NODE_ID_SEGMENT.test(segment));
}

export function isDestinationId(value: string): value is DestinationId {
  return isScopedId(value, 'destination');
}

export function isExperienceId(value: string): value is ExperienceId {
  return isScopedId(value, 'experience');
}

export function isDiscoveryId(value: string): value is DiscoveryId {
  return isScopedId(value, 'discovery');
}

export function isRelationshipId(value: string): value is RelationshipId {
  return isScopedId(value, 'relationship');
}

export function isContentVersion(value: string): value is ContentVersion {
  const [version, ...scope] = value.split(':');
  return /^\d+-\d+-\d+$/.test(version)
    && scope.length > 0
    && scope.every(segment => NODE_ID_SEGMENT.test(segment));
}

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

export function isDepthStage(value: string): value is DepthStage {
  return DEPTH_STAGES.includes(value as DepthStage);
}

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

export function isDiscoveryEventType(value: string): value is DiscoveryEventType {
  return DISCOVERY_EVENT_TYPES.includes(value as DiscoveryEventType);
}

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

export const EXPERIENCE_STATE_SCHEMA_VERSION = 1 as const;
export const TOUR_ROLES = ['recruiter', 'client', 'builder', 'explorer'] as const;
export type TourRole = (typeof TOUR_ROLES)[number];
export type HomeExperienceId = `home:${string}`;
export type SemanticExperienceId =
  | NodeId
  | DestinationId
  | DiscoveryId
  | ExperienceId
  | HomeExperienceId;

export function isSemanticExperienceId(value: string): value is SemanticExperienceId {
  return isNodeId(value)
    || isDestinationId(value)
    || isDiscoveryId(value)
    || isExperienceId(value)
    || isScopedId(value, 'home');
}

export interface ExperienceCheckpoint {
  destinationId: DestinationId;
  stage: DepthStage;
  selectedPartId?: string;
  safeState?: SafeState;
}

export interface PersistedDiscoverySlice {
  firstNoteCompleted: boolean;
  discoveredIds: readonly SemanticExperienceId[];
  handledIds: readonly SemanticExperienceId[];
  enteredIds: readonly SemanticExperienceId[];
  understoodIds: readonly SemanticExperienceId[];
  alteredObjects: Readonly<Record<string, SafeState>>;
  lastCheckpoint?: ExperienceCheckpoint;
  seenContentVersions: Readonly<Record<string, ContentVersion>>;
}

export interface PersistedTourSlice {
  enabled: boolean;
  role?: TourRole;
  suggestedDestinationIds: readonly DestinationId[];
  visitedSuggestedIds: readonly DestinationId[];
  dismissedHintIds: readonly SemanticExperienceId[];
}

export interface PersistedStimulationSlice {
  soundEnabled: boolean;
  normalizedValue: number;
  reducedMotionRequested: boolean;
}

export interface PersistedExperienceState {
  schemaVersion: typeof EXPERIENCE_STATE_SCHEMA_VERSION;
  discovery: PersistedDiscoverySlice;
  tour: PersistedTourSlice;
  stimulation: PersistedStimulationSlice;
}
