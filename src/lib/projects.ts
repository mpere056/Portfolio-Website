import { loadContentRecords } from './content/loaders';

export interface Project {
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
  body: string;
}

export async function getProjects(): Promise<Project[]> {
  const records = await loadContentRecords({ patterns: 'projects/*.mdx' });
  const projects = records.map((record) => {
    // Normalize frontmatter keys and provide safe defaults
    const frontmatter = record.frontmatter;

    const normalized: Project = {
      slug: String(frontmatter.slug ?? ''),
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
      body: record.body,
    };

    return normalized;
  });

  return projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
}
