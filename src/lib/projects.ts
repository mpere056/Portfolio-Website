import { loadContentRecords } from './content/loaders';
import { isContentNodeId } from './contentIds';
import {
  isExperienceId,
  isNodeId,
  type ExperienceId,
  type NodeId,
} from './portfolioContracts';

export type ProjectNodeId = `project:${string}`;

export interface Project {
  nodeId: ProjectNodeId;
  slug: string;
  name: string;
  year: string;
  headline: string;
  summary: string;
  moreInfo: string[];
  tech: string[];
  media: {
    type: 'gif' | 'video' | 'image' | 'iframe';
    src: string;
    poster?: string;
  }[];
  repoUrl?: string;
  liveUrl?: string;
  heroModel?: string;
  cameraPosition?: [number, number, number];
  modelRotation?: [number, number, number];
  cardCameraPosition?: [number, number, number];
  modelOffset?: [number, number, number];
  cardModelOffset?: [number, number, number];
  experienceId?: ExperienceId;
  capabilityIds: NodeId[];
  relatedTimelineIds: NodeId[];
  relatedPostIds: NodeId[];
  body: string;
}

function readNodeIds(value: unknown, field: string, projectSlug: string): NodeId[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !isNodeId(item))) {
    throw new Error(`Project ${projectSlug} has invalid ${field}`);
  }
  return [...new Set(value as NodeId[])];
}

export async function getProjects(): Promise<Project[]> {
  const records = await loadContentRecords({ patterns: 'projects/*.mdx' });
  const projects = records.map((record) => {
    // Normalize frontmatter keys and provide safe defaults
    const frontmatter = record.frontmatter;
    const slug = String(frontmatter.slug ?? '');
    const expectedNodeId = `project:${slug}`;
    if (!record.nodeId || !isContentNodeId(record.nodeId) || record.nodeId !== expectedNodeId) {
      throw new Error(`Project ${slug || record.relativePath} has no canonical project node ID`);
    }

    const experienceId = frontmatter.experienceId;
    if (experienceId !== undefined && (typeof experienceId !== 'string' || !isExperienceId(experienceId))) {
      throw new Error(`Project ${slug} has an invalid experienceId`);
    }

    const normalized: Project = {
      nodeId: record.nodeId as ProjectNodeId,
      slug,
      name: String(frontmatter.name ?? ''),
      year: String(frontmatter.year ?? ''),
      headline: String(frontmatter.headline ?? ''),
      summary: String(frontmatter.summary ?? ''),
      moreInfo: (frontmatter.moreInfo as string[] | undefined)
        ?? (frontmatter['more-info'] as string[] | undefined)
        ?? [],
      tech: (frontmatter.tech as string[] | undefined) ?? [],
      media: (frontmatter.media as {
        type: 'gif' | 'video' | 'image' | 'iframe';
        src: string;
        poster?: string;
      }[] | undefined) ?? [],
      repoUrl: frontmatter.repoUrl ? String(frontmatter.repoUrl) : undefined,
      liveUrl: frontmatter.liveUrl ? String(frontmatter.liveUrl) : undefined,
      heroModel: frontmatter.heroModel ? String(frontmatter.heroModel) : undefined,
      cameraPosition: (frontmatter.cameraPosition as [number, number, number] | undefined),
      modelRotation: (frontmatter.modelRotation as [number, number, number] | undefined),
      cardCameraPosition: (frontmatter.cardCameraPosition as [number, number, number] | undefined),
      modelOffset: (frontmatter.modelOffset as [number, number, number] | undefined),
      cardModelOffset: (frontmatter.cardModelOffset as [number, number, number] | undefined),
      experienceId: experienceId as ExperienceId | undefined,
      capabilityIds: readNodeIds(frontmatter.capabilityIds, 'capabilityIds', slug),
      relatedTimelineIds: readNodeIds(frontmatter.relatedTimelineIds, 'relatedTimelineIds', slug),
      relatedPostIds: readNodeIds(frontmatter.relatedPostIds, 'relatedPostIds', slug),
      body: record.body,
    };

    return normalized;
  });

  return projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
}
