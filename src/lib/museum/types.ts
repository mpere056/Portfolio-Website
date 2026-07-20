import type { DestinationDefinition } from '../destinations';
import type { ProjectNodeId } from '../projects';
import type {
  DepthStage,
  DestinationId,
  DiscoveryId,
  ExperienceId,
  NodeId,
  RelationshipId,
} from '../portfolioContracts';
import type { ReviewedProjectState } from '../content/projectStates';

export interface ExhibitVisualDescriptor {
  key: string;
  heroModel?: string;
  posterSrc?: string;
}

export interface MuseumExhibitDefinition {
  projectId: ProjectNodeId;
  slug: string;
  destinationId: DestinationId;
  projectDestinationId: DestinationId;
  visual: ExhibitVisualDescriptor;
  supportedStages: readonly DepthStage[];
  experienceId?: ExperienceId;
  layerIds: readonly string[];
  evidenceNodeIds: readonly NodeId[];
  relatedNodeIds: readonly NodeId[];
  hiddenDiscoveryIds: readonly DiscoveryId[];
}

export type ExhibitRegistryIssueCode =
  | 'duplicate-project-id'
  | 'duplicate-slug'
  | 'duplicate-destination-id'
  | 'invalid-project-id'
  | 'invalid-experience-id'
  | 'invalid-node-id'
  | 'invalid-discovery-id'
  | 'invalid-layer-id'
  | 'invalid-visual-key'
  | 'missing-destination'
  | 'noncanonical-destination'
  | 'invalid-destination-kind'
  | 'invalid-destination-origin'
  | 'destination-node-mismatch'
  | 'destination-anchor-mismatch'
  | 'missing-project-destination'
  | 'project-destination-node-mismatch'
  | 'invalid-stage-sequence'
  | 'missing-public-graph-node';

export interface ExhibitRegistryIssue {
  code: ExhibitRegistryIssueCode;
  projectId?: string;
  slug?: string;
  detail?: string;
}

export interface MuseumExhibitRegistry {
  exhibits: readonly MuseumExhibitDefinition[];
  byProjectId: ReadonlyMap<ProjectNodeId, MuseumExhibitDefinition>;
  bySlug: ReadonlyMap<string, MuseumExhibitDefinition>;
  issues: readonly ExhibitRegistryIssue[];
}

export interface ExhibitEntryResolution {
  destinationId: DestinationId;
  href: string;
  stage: DepthStage;
  exhibit?: MuseumExhibitDefinition;
  usedFallback: boolean;
  usedStageFallback: boolean;
}

export type MuseumExhibitStatus = 'registered' | 'fallback';

export interface MuseumSemanticConnection {
  relationshipId: RelationshipId;
  nodeId: NodeId;
  title: string;
  explanation: string;
  href: string;
  strength: 'primary' | 'secondary';
}

export interface MuseumExhibitView {
  projectId: ProjectNodeId;
  slug: string;
  name: string;
  year: string;
  headline: string;
  summary: string;
  tech: readonly string[];
  destinationId: DestinationId;
  href: string;
  projectHref: string;
  visual: ExhibitVisualDescriptor;
  supportedStages: readonly DepthStage[];
  experienceId?: ExperienceId;
  evidenceNodeIds: readonly NodeId[];
  relatedNodeIds: readonly NodeId[];
  semanticConnections: readonly MuseumSemanticConnection[];
  projectState?: ReviewedProjectState;
  status: MuseumExhibitStatus;
  fallbackReason?: string;
}

export interface MuseumExhibitLoadResult {
  exhibits: readonly MuseumExhibitView[];
  registry: MuseumExhibitRegistry;
  issues: readonly ExhibitRegistryIssue[];
}

export interface CaseStudyLayer {
  id: string;
  question: string;
  title: string;
  summary: string;
  graphNodeIds: readonly NodeId[];
  visualKey: string;
  evidenceNodeIds: readonly NodeId[];
  revealAfter?: readonly string[];
}

export type DestinationLookup = Readonly<Record<string, DestinationDefinition>>;
