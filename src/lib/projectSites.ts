export interface ProjectSite {
  subdomain: string;
  projectSlug: string;
  eyebrow: string;
  ctaLabel?: string;
}

export const PROJECT_SITES: ProjectSite[] = [
  {
    subdomain: 'lifeinbox',
    projectSlug: 'life-app',
    eyebrow: 'AI life design workspace',
    ctaLabel: 'Ask about Life Inbox',
  },
  {
    subdomain: 'sudokutogether',
    projectSlug: 'discord-sudoku-activity',
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
