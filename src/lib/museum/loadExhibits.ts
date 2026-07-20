import { DESTINATION_REGISTRY } from '../destinations';
import { loadKnowledgeGraphQueries } from '../content/queries';
import { getProjects, type Project } from '../projects';
import { loadProjectStates } from '../content/projectStates';
import { createExhibitRegistry, resolveExhibitEntry } from './registry';
import type {
  ExhibitRegistryIssue,
  MuseumExhibitDefinition,
  MuseumExhibitLoadResult,
  MuseumExhibitView,
  MuseumSemanticConnection,
} from './types';

function projectHref(project: Project, definition?: MuseumExhibitDefinition) {
  const destination = definition
    ? DESTINATION_REGISTRY[definition.projectDestinationId as keyof typeof DESTINATION_REGISTRY]
    : undefined;
  return destination?.href || project.liveUrl || project.repoUrl || `/projects/${project.slug}`;
}

export async function loadMuseumExhibits(): Promise<MuseumExhibitLoadResult> {
  const projects = await getProjects();
  let projectStates = new Map<string, Awaited<ReturnType<typeof loadProjectStates>>[number]>();
  try {
    projectStates = new Map((await loadProjectStates()).map(state => [state.projectId, state]));
  } catch {
    // Authored exhibit identity remains available if living-state content is invalid.
  }
  const registry = createExhibitRegistry(projects);
  const issues: ExhibitRegistryIssue[] = [...registry.issues];
  let publicProjectIds = new Set<string>();
  let graphQueries: Awaited<ReturnType<typeof loadKnowledgeGraphQueries>> | undefined;

  try {
    graphQueries = await loadKnowledgeGraphQueries();
    publicProjectIds = new Set(projects
      .filter(project => Boolean(graphQueries?.getPublicSourceDescriptor(project.nodeId)))
      .map(project => project.nodeId));
  } catch {
    // The museum remains navigable with authored project copy if graph loading fails.
  }

  const exhibits: MuseumExhibitView[] = projects.map(project => {
    const definition = registry.byProjectId.get(project.nodeId);
    const projectIssues = issues.filter(issue => issue.projectId === project.nodeId);
    const hasPublicGraphNode = publicProjectIds.has(project.nodeId);
    if (!hasPublicGraphNode) {
      projectIssues.push({
        code: 'missing-public-graph-node',
        projectId: project.nodeId,
        slug: project.slug,
        detail: 'missing-public-graph-node',
      });
    }
    const valid = Boolean(definition) && projectIssues.length === 0;
    const entry = definition ? resolveExhibitEntry(registry, project.nodeId) : undefined;
    const semanticConnections: MuseumSemanticConnection[] = (graphQueries
      ?.getRelatedContent(project.nodeId, { limit: 3 }) ?? [])
      .map((connection, index) => ({
        relationshipId: connection.relationshipId,
        nodeId: connection.nodeId,
        title: connection.title,
        explanation: connection.explanation,
        href: connection.destination.href,
        strength: index === 0 ? 'primary' : 'secondary',
      }));

    return {
      projectId: project.nodeId,
      slug: project.slug,
      name: project.name,
      year: project.year,
      headline: project.headline,
      summary: project.summary,
      tech: project.tech,
      destinationId: valid && entry ? entry.destinationId : 'destination:projects',
      href: valid && entry ? entry.href : `/projects/${project.slug}`,
      projectHref: projectHref(project, definition),
      visual: definition?.visual ?? { key: project.nodeId },
      supportedStages: definition?.supportedStages ?? ['signal'],
      ...(definition?.experienceId ? { experienceId: definition.experienceId } : {}),
      evidenceNodeIds: definition?.evidenceNodeIds ?? [],
      relatedNodeIds: definition?.relatedNodeIds ?? [],
      semanticConnections,
      ...(projectStates.get(project.nodeId) ? { projectState: projectStates.get(project.nodeId) } : {}),
      status: valid ? 'registered' : 'fallback',
      ...(!valid ? { fallbackReason: 'This exhibit is using its resilient content view.' } : {}),
    };
  });

  const graphIssues = exhibits
    .filter(exhibit => exhibit.status === 'fallback' && !issues.some(issue => issue.projectId === exhibit.projectId))
    .map(exhibit => ({
      code: 'missing-public-graph-node' as const,
      projectId: exhibit.projectId,
      slug: exhibit.slug,
      detail: 'missing-public-graph-node',
    }));

  return { exhibits, registry, issues: [...issues, ...graphIssues] };
}
