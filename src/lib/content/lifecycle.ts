import { isContentVersion } from '../portfolioContracts';

export const PROJECT_LIFECYCLES = ['evolving', 'maintained', 'complete', 'archived'] as const;
export type ProjectLifecycle = (typeof PROJECT_LIFECYCLES)[number];

export interface ProjectStateInput {
  projectId: `project:${string}`;
  lifecycle: ProjectLifecycle;
  contentVersion: string;
  updatedAt: string;
  sections: Readonly<Record<string, string | undefined>>;
}

export interface ProjectStateIssue {
  path: string;
  code: string;
  message: string;
}

const REQUIRED_SECTIONS: Record<ProjectLifecycle, readonly string[]> = {
  evolving: ['stableFoundation', 'currentQuestion', 'latestMeaningfulChange', 'nextExperiment'],
  maintained: ['stableRole', 'latestMeaningfulMaintenanceChange'],
  complete: ['finalOutcome', 'finalMeaningfulState', 'mainLesson', 'laterWorkInfluenced'],
  archived: ['archiveReason', 'historicalImportance', 'lastVerifiedState'],
};

const EVOLVING_ONLY = ['currentQuestion', 'nextExperiment'] as const;

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
}

export function validateProjectState(input: unknown): ProjectStateIssue[] {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return [{ path: '', code: 'invalid-state', message: 'Project state must be an object' }];
  }
  const value = input as Partial<ProjectStateInput>;
  const issues: ProjectStateIssue[] = [];
  if (typeof value.projectId !== 'string' || !/^project:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.projectId)) {
    issues.push({ path: 'projectId', code: 'invalid-project-id', message: 'Project ID is invalid' });
  }
  if (typeof value.lifecycle !== 'string'
    || !PROJECT_LIFECYCLES.includes(value.lifecycle as ProjectLifecycle)) {
    issues.push({ path: 'lifecycle', code: 'invalid-lifecycle', message: 'Lifecycle is invalid' });
    return issues;
  }
  if (typeof value.contentVersion !== 'string' || !isContentVersion(value.contentVersion)) {
    issues.push({ path: 'contentVersion', code: 'invalid-content-version', message: 'Content version is invalid' });
  }
  if (typeof value.updatedAt !== 'string' || !isDateOnly(value.updatedAt)) {
    issues.push({ path: 'updatedAt', code: 'invalid-date', message: 'Updated date is invalid' });
  }
  if (typeof value.sections !== 'object' || value.sections === null || Array.isArray(value.sections)) {
    issues.push({ path: 'sections', code: 'invalid-sections', message: 'Sections must be an object' });
    return issues;
  }

  for (const section of REQUIRED_SECTIONS[value.lifecycle]) {
    const content = value.sections[section];
    if (typeof content !== 'string' || !content.trim()) {
      issues.push({
        path: `sections.${section}`,
        code: 'missing-lifecycle-section',
        message: `${value.lifecycle} projects require ${section}`,
      });
    }
  }
  if (value.lifecycle !== 'evolving') {
    for (const section of EVOLVING_ONLY) {
      if (value.sections[section]?.trim()) {
        issues.push({
          path: `sections.${section}`,
          code: 'section-not-allowed',
          message: `${section} is only valid for evolving projects`,
        });
      }
    }
  }
  return issues;
}
