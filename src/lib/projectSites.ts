export interface ProjectSite {
  subdomain: string;
  projectSlug: string;
  name: string;
  eyebrow: string;
  ctaLabel?: string;
}

export const PROJECT_SITES: ProjectSite[] = [
  {
    subdomain: 'dreamlife',
    projectSlug: 'dreamlife',
    name: 'Dreamlife',
    eyebrow: 'AI life design mobile app',
    ctaLabel: 'Ask about Dreamlife',
  },
  {
    subdomain: 'lifeinbox',
    projectSlug: 'lifeinbox',
    name: 'LifeInbox',
    eyebrow: 'Local-first Android organizer',
    ctaLabel: 'Ask about LifeInbox',
  },
  {
    subdomain: 'sudokutogether',
    projectSlug: 'discord-sudoku-activity',
    name: 'Sudoku Together',
    eyebrow: 'Real-time collaborative puzzle room',
    ctaLabel: 'See Sudoku Together',
  },
];

export function getProjectSiteBySubdomain(subdomain: string) {
  return PROJECT_SITES.find((site) => site.subdomain === subdomain.toLowerCase());
}

export function getProjectSiteBySlug(slug: string) {
  return PROJECT_SITES.find((site) => site.projectSlug === slug);
}
