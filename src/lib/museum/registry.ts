import {
  DEPTH_STAGES,
  isDepthStage,
  isDiscoveryId,
  isExperienceId,
  isNodeId,
  type DepthStage,
  type DestinationId,
} from '../portfolioContracts';
import {
  DESTINATION_REGISTRY,
  type DestinationDefinition,
} from '../destinations';
import { getProjectSiteBySlug } from '../projectSites';
import type { Project, ProjectNodeId } from '../projects';
import type {
  DestinationLookup,
  ExhibitEntryResolution,
  ExhibitRegistryIssue,
  MuseumExhibitDefinition,
  MuseumExhibitRegistry,
} from './types';

export const INITIAL_EXHIBIT_STAGES = ['signal', 'approach'] as const satisfies readonly DepthStage[];
const LIFEINBOX_STAGES = ['signal', 'approach', 'handle', 'enter', 'understand'] as const satisfies readonly DepthStage[];
const LAYER_ID = /^layer:[a-z0-9]+(?:-[a-z0-9]+)*$/;

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function destinationValues(destinations: DestinationLookup) {
  return Object.values(destinations) as DestinationDefinition[];
}

function findMuseumDestination(
  project: Project,
  destinations: DestinationLookup,
) {
  return destinationValues(destinations).find(destination => (
    destination.status === 'canonical'
    && destination.targetOrigin === 'main'
    && destination.nodeId === project.nodeId
    && destination.href === `/projects#${project.slug}`
    && (destination.kind === 'museum-exhibit' || destination.kind === 'project')
  ));
}

function findProjectDestination(
  project: Project,
  museumDestination: DestinationDefinition,
  destinations: DestinationLookup,
) {
  const site = getProjectSiteBySlug(project.slug);
  if (!site) return museumDestination;
  return destinations[`destination:project-${site.subdomain}`];
}

function toExhibitDefinition(
  project: Project,
  destinations: DestinationLookup,
): MuseumExhibitDefinition | undefined {
  const destination = findMuseumDestination(project, destinations);
  if (!destination) return undefined;
  const projectDestination = findProjectDestination(project, destination, destinations);
  if (!projectDestination) return undefined;
  const firstMedia = project.media[0];

  return {
    projectId: project.nodeId,
    slug: project.slug,
    destinationId: destination.id,
    projectDestinationId: projectDestination.id,
    visual: {
      key: project.heroModel ?? firstMedia?.src ?? project.nodeId,
      ...(project.heroModel ? { heroModel: project.heroModel } : {}),
      ...(firstMedia ? { posterSrc: firstMedia.poster ?? firstMedia.src } : {}),
    },
    supportedStages: project.nodeId === 'project:lifeinbox' ? LIFEINBOX_STAGES : INITIAL_EXHIBIT_STAGES,
    ...(project.experienceId ? { experienceId: project.experienceId } : {}),
    layerIds: project.nodeId === 'project:lifeinbox' ? ['layer:lifeinbox-local-trust'] : [],
    evidenceNodeIds: unique(project.relatedPostIds),
    relatedNodeIds: unique([...project.capabilityIds, ...project.relatedTimelineIds]),
    hiddenDiscoveryIds: [],
  };
}

function duplicateIssues(
  definitions: readonly MuseumExhibitDefinition[],
  key: 'projectId' | 'slug' | 'destinationId',
  code: ExhibitRegistryIssue['code'],
) {
  const seen = new Set<string>();
  const duplicate = new Set<string>();
  for (const definition of definitions) {
    const value = definition[key];
    if (seen.has(value)) duplicate.add(value);
    seen.add(value);
  }
  return [...duplicate].map(detail => ({ code, detail } satisfies ExhibitRegistryIssue));
}

function hasValidStageSequence(stages: readonly DepthStage[]) {
  if (stages.length === 0 || stages[0] !== 'signal') return false;
  if (new Set(stages).size !== stages.length) return false;
  return stages.every((stage, index) => (
    isDepthStage(stage)
    && (index === 0 || DEPTH_STAGES.indexOf(stage) > DEPTH_STAGES.indexOf(stages[index - 1]))
  ));
}

export function validateExhibitDefinitions(
  definitions: readonly MuseumExhibitDefinition[],
  destinations: DestinationLookup = DESTINATION_REGISTRY,
): ExhibitRegistryIssue[] {
  const issues: ExhibitRegistryIssue[] = [
    ...duplicateIssues(definitions, 'projectId', 'duplicate-project-id'),
    ...duplicateIssues(definitions, 'slug', 'duplicate-slug'),
    ...duplicateIssues(definitions, 'destinationId', 'duplicate-destination-id'),
  ];

  for (const definition of definitions) {
    const context = { projectId: definition.projectId, slug: definition.slug };
    if (!isNodeId(definition.projectId) || !definition.projectId.startsWith('project:')) {
      issues.push({ ...context, code: 'invalid-project-id' });
    }
    if (definition.experienceId && !isExperienceId(definition.experienceId)) {
      issues.push({ ...context, code: 'invalid-experience-id' });
    }
    if (!definition.visual.key.trim()) issues.push({ ...context, code: 'invalid-visual-key' });
    if (!hasValidStageSequence(definition.supportedStages)) {
      issues.push({ ...context, code: 'invalid-stage-sequence' });
    }
    if (definition.layerIds.some(id => !LAYER_ID.test(id))) {
      issues.push({ ...context, code: 'invalid-layer-id' });
    }
    if ([...definition.evidenceNodeIds, ...definition.relatedNodeIds].some(id => !isNodeId(id))) {
      issues.push({ ...context, code: 'invalid-node-id' });
    }
    if (definition.hiddenDiscoveryIds.some(id => !isDiscoveryId(id))) {
      issues.push({ ...context, code: 'invalid-discovery-id' });
    }

    const destination = destinations[definition.destinationId];
    if (!destination) issues.push({ ...context, code: 'missing-destination' });
    else {
      if (destination.status !== 'canonical') issues.push({ ...context, code: 'noncanonical-destination' });
      if (destination.kind !== 'museum-exhibit' && destination.kind !== 'project') {
        issues.push({ ...context, code: 'invalid-destination-kind' });
      }
      if (destination.targetOrigin !== 'main') issues.push({ ...context, code: 'invalid-destination-origin' });
      if (destination.nodeId !== definition.projectId) issues.push({ ...context, code: 'destination-node-mismatch' });
      if (destination.href !== `/projects#${definition.slug}`) {
        issues.push({ ...context, code: 'destination-anchor-mismatch' });
      }
    }

    const projectDestination = destinations[definition.projectDestinationId];
    if (!projectDestination || projectDestination.status !== 'canonical') {
      issues.push({ ...context, code: 'missing-project-destination' });
    } else if (projectDestination.nodeId !== definition.projectId) {
      issues.push({ ...context, code: 'project-destination-node-mismatch' });
    }
  }

  return issues;
}

export function createExhibitRegistry(
  projects: readonly Project[],
  destinations: DestinationLookup = DESTINATION_REGISTRY,
): MuseumExhibitRegistry {
  const definitions: MuseumExhibitDefinition[] = [];
  const constructionIssues: ExhibitRegistryIssue[] = [];

  for (const project of projects) {
    const definition = toExhibitDefinition(project, destinations);
    if (definition) definitions.push(definition);
    else constructionIssues.push({
      code: 'missing-destination',
      projectId: project.nodeId,
      slug: project.slug,
    });
  }

  return {
    exhibits: definitions,
    byProjectId: new Map(definitions.map(definition => [definition.projectId, definition])),
    bySlug: new Map(definitions.map(definition => [definition.slug, definition])),
    issues: [...constructionIssues, ...validateExhibitDefinitions(definitions, destinations)],
  };
}

export function resolveExhibitEntry(
  registry: MuseumExhibitRegistry,
  reference: string,
  requestedStage: DepthStage = 'signal',
  destinations: DestinationLookup = DESTINATION_REGISTRY,
): ExhibitEntryResolution {
  const exhibit = reference.startsWith('project:')
    ? registry.byProjectId.get(reference as ProjectNodeId)
    : registry.bySlug.get(reference);
  const fallback = destinations['destination:projects'];

  if (!exhibit) {
    return {
      destinationId: fallback.id,
      href: fallback.href,
      stage: 'signal',
      usedFallback: true,
      usedStageFallback: requestedStage !== 'signal',
    };
  }

  const destination = destinations[exhibit.destinationId];
  const validDestination = destination
    && destination.status === 'canonical'
    && destination.nodeId === exhibit.projectId;
  const supportedStage = exhibit.supportedStages.includes(requestedStage)
    ? requestedStage
    : exhibit.supportedStages[0] ?? 'signal';

  return {
    destinationId: validDestination ? exhibit.destinationId : fallback.id,
    href: validDestination ? destination.href : fallback.href,
    stage: supportedStage,
    exhibit,
    usedFallback: !validDestination,
    usedStageFallback: supportedStage !== requestedStage,
  };
}
