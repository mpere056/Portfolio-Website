import { getDestinationDefinition } from '../destinations';
import type { CompiledKnowledgeGraph } from '../content/graph';
import {
  isNodeId,
  isSemanticExperienceId,
  type DestinationId,
  type NodeId,
  type PersistedDiscoverySlice,
  type SemanticExperienceId,
} from '../portfolioContracts';

export const DISCOVERY_KINDS = [
  'personal-artifact',
  'technical-lesson',
  'relational-connection',
] as const;

export type DiscoveryKind = (typeof DISCOVERY_KINDS)[number];
export type DiscoveryTrigger = 'hold' | 'residue' | 'cross-insight';
export type DiscoveryAvailability = 'concealed' | 'available' | 'discovered';

export interface DiscoveryLink {
  label: string;
  destinationId: DestinationId;
}

export interface MeaningfulDiscoveryDefinition {
  id: SemanticExperienceId;
  kind: DiscoveryKind;
  locationDestinationId: DestinationId;
  trigger: DiscoveryTrigger;
  requiredDiscoveryIds: readonly SemanticExperienceId[];
  requiredUnderstoodIds: readonly SemanticExperienceId[];
  knowledgeNodeIds: readonly NodeId[];
  tourEligible: false;
  safetyStatus: 'reviewed-public';
  signal: string;
  reveal: {
    eyebrow: string;
    title: string;
    body: string;
    links: readonly DiscoveryLink[];
  };
}

export const PERSONAL_ARTIFACT_ID = 'discovery:music-after-the-diploma';
export const TECHNICAL_LESSON_ID = 'discovery:trust-is-product-behavior';
export const RELATIONAL_CONNECTION_ID = 'discovery:listening-before-automation';
export const RELATIONSHIP_INSTRUMENT_ID = 'experience:relationship-instrument';

export const MEANINGFUL_DISCOVERIES: readonly MeaningfulDiscoveryDefinition[] = [
  {
    id: PERSONAL_ARTIFACT_ID,
    kind: 'personal-artifact',
    locationDestinationId: 'destination:about',
    trigger: 'hold',
    requiredDiscoveryIds: [],
    requiredUnderstoodIds: [],
    knowledgeNodeIds: ['misc:music-info'],
    tourEligible: false,
    safetyStatus: 'reviewed-public',
    signal: 'An almost-silent key',
    reveal: {
      eyebrow: 'Personal artifact',
      title: 'After the diploma, listening began',
      body: 'Classical training made practiced performance precise. The harder chapter came afterward: learning to play by ear, compose, and make the piano express something felt rather than merely reproduced.',
      links: [],
    },
  },
  {
    id: TECHNICAL_LESSON_ID,
    kind: 'technical-lesson',
    locationDestinationId: 'destination:projects',
    trigger: 'residue',
    requiredDiscoveryIds: [],
    requiredUnderstoodIds: [RELATIONSHIP_INSTRUMENT_ID],
    knowledgeNodeIds: [
      'post:dreamlife:building-a-life-design-loop',
      'post:lifeinbox:local-first-capture-needs-trust',
    ],
    tourEligible: false,
    safetyStatus: 'reviewed-public',
    signal: 'The light left a residue',
    reveal: {
      eyebrow: 'Technical lesson',
      title: 'Trust is product behavior',
      body: 'AI can suggest, classify, and reshape personal information, but usefulness depends on a loop people can understand and a system they can trust not to lose or distort what matters.',
      links: [
        {
          label: 'Read the local-first lesson',
          destinationId: 'destination:post-lifeinbox-local-first-capture-needs-trust',
        },
      ],
    },
  },
  {
    id: RELATIONAL_CONNECTION_ID,
    kind: 'relational-connection',
    locationDestinationId: 'destination:home',
    trigger: 'cross-insight',
    requiredDiscoveryIds: [PERSONAL_ARTIFACT_ID, TECHNICAL_LESSON_ID],
    requiredUnderstoodIds: [],
    knowledgeNodeIds: ['misc:music-info', 'project:dreamlife', 'project:lifeinbox'],
    tourEligible: false,
    safetyStatus: 'reviewed-public',
    signal: 'Two distant things are answering each other',
    reveal: {
      eyebrow: 'Relational connection',
      title: 'Listen before you automate',
      body: 'The musical and technical work share a discipline: do not confuse accurate reproduction with understanding. Listen for the person, preserve their agency, then let the system respond.',
      links: [
        { label: 'Enter Dreamlife', destinationId: 'destination:museum-project-dreamlife' },
        { label: 'Enter LifeInbox', destinationId: 'destination:museum-project-lifeinbox' },
      ],
    },
  },
];

function routeForDestination(destinationId: DestinationId) {
  const destination = getDestinationDefinition(destinationId);
  if (!destination || !destination.href.startsWith('/')) return undefined;
  return destination.href.split(/[?#]/)[0] || '/';
}

export function validateMeaningfulDiscoveryRegistry(
  registry: readonly MeaningfulDiscoveryDefinition[] = MEANINGFUL_DISCOVERIES,
) {
  if (registry.length !== DISCOVERY_KINDS.length) return false;
  const ids = new Set<string>();
  const kinds = new Set<DiscoveryKind>();
  return registry.every(definition => {
    const location = getDestinationDefinition(definition.locationDestinationId);
    const linksAreCanonical = definition.reveal.links.every(link => {
      const destination = getDestinationDefinition(link.destinationId);
      return Boolean(link.label.trim() && destination?.status === 'canonical');
    });
    const valid = isSemanticExperienceId(definition.id)
      && definition.id.startsWith('discovery:')
      && !ids.has(definition.id)
      && DISCOVERY_KINDS.includes(definition.kind)
      && !kinds.has(definition.kind)
      && location?.status === 'canonical'
      && Boolean(routeForDestination(definition.locationDestinationId))
      && definition.tourEligible === false
      && definition.safetyStatus === 'reviewed-public'
      && Boolean(definition.signal.trim())
      && Boolean(definition.reveal.title.trim() && definition.reveal.body.trim())
      && definition.knowledgeNodeIds.length > 0
      && definition.knowledgeNodeIds.every(isNodeId)
      && definition.requiredDiscoveryIds.every(isSemanticExperienceId)
      && definition.requiredUnderstoodIds.every(isSemanticExperienceId)
      && linksAreCanonical;
    ids.add(definition.id);
    kinds.add(definition.kind);
    return valid;
  });
}

export function validateDiscoveryKnowledgeNodes(
  graph: CompiledKnowledgeGraph,
  registry: readonly MeaningfulDiscoveryDefinition[] = MEANINGFUL_DISCOVERIES,
) {
  const publicNodes = new Set(
    graph.nodes.filter(node => node.visibility === 'public').map(node => node.id),
  );
  return registry.every(definition => (
    definition.knowledgeNodeIds.every(nodeId => publicNodes.has(nodeId))
  ));
}

export function getDiscoveryAvailability(
  definition: MeaningfulDiscoveryDefinition,
  discovery: PersistedDiscoverySlice,
  pathname: string,
): DiscoveryAvailability {
  if (discovery.discoveredIds.includes(definition.id)) return 'discovered';
  if (routeForDestination(definition.locationDestinationId) !== pathname) return 'concealed';
  if (!definition.requiredDiscoveryIds.every(id => discovery.discoveredIds.includes(id))) {
    return 'concealed';
  }
  if (!definition.requiredUnderstoodIds.every(id => discovery.understoodIds.includes(id))) {
    return 'concealed';
  }
  return 'available';
}

export function getAvailableMeaningfulDiscoveries(
  discovery: PersistedDiscoverySlice,
  pathname: string,
) {
  return MEANINGFUL_DISCOVERIES.filter(definition => (
    getDiscoveryAvailability(definition, discovery, pathname) === 'available'
  ));
}

