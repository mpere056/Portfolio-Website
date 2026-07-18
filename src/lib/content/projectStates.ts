import { loadContentRecords } from './loaders';
import {
  validateProjectState,
  type ProjectStateInput,
} from './lifecycle';

export interface ProjectStateEvidenceLink {
  label: string;
  href: string;
}

export interface ReviewedProjectState extends ProjectStateInput {
  summary: string;
  correctionNote: string;
  evidence: readonly ProjectStateEvidenceLink[];
}

function requiredString(value: unknown, field: string, record: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${record} has invalid ${field}`);
  }
  return value.trim();
}

function evidenceLinks(value: unknown, record: string): ProjectStateEvidenceLink[] {
  if (!Array.isArray(value)) throw new Error(`${record} has invalid evidence`);
  return value.map((item, index) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`${record} has invalid evidence.${index}`);
    }
    const link = item as Record<string, unknown>;
    const href = requiredString(link.href, `evidence.${index}.href`, record);
    if (!href.startsWith('https://') && !href.startsWith('/')) {
      throw new Error(`${record} has unsafe evidence.${index}.href`);
    }
    return {
      label: requiredString(link.label, `evidence.${index}.label`, record),
      href,
    };
  });
}

export async function loadProjectStates(): Promise<ReviewedProjectState[]> {
  const records = await loadContentRecords({ patterns: 'misc/*-current-state.mdx' });
  const states = records.map(record => {
    const frontmatter = record.frontmatter;
    const input: ProjectStateInput = {
      projectId: requiredString(frontmatter.projectId, 'projectId', record.relativePath) as `project:${string}`,
      lifecycle: requiredString(frontmatter.lifecycle, 'lifecycle', record.relativePath) as ProjectStateInput['lifecycle'],
      contentVersion: requiredString(frontmatter.contentVersion, 'contentVersion', record.relativePath),
      updatedAt: requiredString(frontmatter.updatedAt, 'updatedAt', record.relativePath),
      sections: typeof frontmatter.sections === 'object' && frontmatter.sections !== null && !Array.isArray(frontmatter.sections)
        ? frontmatter.sections as Record<string, string | undefined>
        : {},
    };
    const issues = validateProjectState(input);
    if (issues.length > 0) {
      throw new Error(`${record.relativePath} project state is invalid: ${issues.map(issue => issue.path).join(', ')}`);
    }
    return {
      ...input,
      summary: requiredString(frontmatter.summary, 'summary', record.relativePath),
      correctionNote: requiredString(frontmatter.correctionNote, 'correctionNote', record.relativePath),
      evidence: evidenceLinks(frontmatter.evidence, record.relativePath),
    } satisfies ReviewedProjectState;
  });

  const projectIds = new Set<string>();
  for (const state of states) {
    if (projectIds.has(state.projectId)) throw new Error(`Duplicate project state: ${state.projectId}`);
    projectIds.add(state.projectId);
  }
  return states;
}

export async function getProjectState(projectId: string) {
  return (await loadProjectStates()).find(state => state.projectId === projectId);
}

