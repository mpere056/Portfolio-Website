import {
  isDestinationId,
  isDiscoveryId,
  isExperienceId,
  isNodeId,
} from '../portfolioContracts';
import type { AuthoredContentRecord } from './loaders';

export interface ContentSchemaIssue {
  nodeId?: string;
  path: string;
  code: string;
  message: string;
}

const REQUIRED_FIELDS: Record<AuthoredContentRecord['kind'], readonly string[]> = {
  project: ['slug', 'name', 'year', 'headline', 'summary'],
  about: ['id', 'from', 'headline', 'summary'],
  blog: ['slug', 'title', 'description', 'date'],
  misc: [],
  unclassified: [],
};

function isNonEmpty(value: unknown) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;
}

function validateIdArray(
  record: AuthoredContentRecord,
  field: string,
  predicate: (value: string) => boolean,
) {
  const value = record.frontmatter[field];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !predicate(item))) {
    return [{
      nodeId: record.nodeId,
      path: field,
      code: 'invalid-id-list',
      message: `${field} must contain only valid namespaced IDs`,
    }] satisfies ContentSchemaIssue[];
  }
  return [];
}

function namespace(namespace: string) {
  return (value: string) => isNodeId(value) && value.startsWith(`${namespace}:`);
}

export function validateContentRecord(record: AuthoredContentRecord): ContentSchemaIssue[] {
  const issues: ContentSchemaIssue[] = [];
  if (!record.nodeId) {
    issues.push({
      path: 'nodeId',
      code: 'unclassified-content',
      message: `Unsupported content path: ${record.relativePath}`,
    });
    return issues;
  }

  for (const field of REQUIRED_FIELDS[record.kind]) {
    if (!isNonEmpty(record.frontmatter[field])) {
      issues.push({
        nodeId: record.nodeId,
        path: field,
        code: 'missing-required-field',
        message: `Missing required ${record.kind} field: ${field}`,
      });
    }
  }

  const visibility = record.frontmatter.visibility;
  if (visibility !== undefined && !['public', 'private', 'draft'].includes(String(visibility))) {
    issues.push({
      nodeId: record.nodeId,
      path: 'visibility',
      code: 'invalid-visibility',
      message: 'Visibility must be public, private, or draft',
    });
  }

  if (record.kind === 'project') {
    issues.push(
      ...validateIdArray(record, 'capabilityIds', namespace('skill')),
      ...validateIdArray(record, 'problemIds', namespace('constraint')),
      ...validateIdArray(record, 'decisionIds', namespace('decision')),
      ...validateIdArray(record, 'lessonIds', namespace('lesson')),
      ...validateIdArray(record, 'relatedTimelineIds', namespace('timeline')),
      ...validateIdArray(record, 'relatedPostIds', namespace('post')),
      ...validateIdArray(record, 'evidenceNodeIds', isNodeId),
      ...validateIdArray(record, 'hiddenDiscoveryIds', isDiscoveryId),
    );
    if (record.frontmatter.experienceId !== undefined
      && (typeof record.frontmatter.experienceId !== 'string'
        || !isExperienceId(record.frontmatter.experienceId))) {
      issues.push({
        nodeId: record.nodeId,
        path: 'experienceId',
        code: 'invalid-experience-id',
        message: 'experienceId must be a valid experience ID',
      });
    }
  }

  if (record.kind === 'about') {
    issues.push(
      ...validateIdArray(record, 'developedCapabilityIds', namespace('skill')),
      ...validateIdArray(record, 'influencedProjectIds', namespace('project')),
      ...validateIdArray(record, 'changedBeliefIds', namespace('lesson')),
      ...validateIdArray(record, 'artifactIds', namespace('media')),
      ...validateIdArray(record, 'hiddenDiscoveryIds', isDiscoveryId),
    );
  }

  if (record.kind === 'blog') {
    if (record.frontmatter.nodeId !== undefined && record.frontmatter.nodeId !== record.nodeId) {
      issues.push({
        nodeId: record.nodeId,
        path: 'nodeId',
        code: 'node-id-mismatch',
        message: 'Authored blog nodeId does not match its canonical path identity',
      });
    }
    issues.push(
      ...validateIdArray(record, 'decisionIds', namespace('decision')),
      ...validateIdArray(record, 'lessonIds', namespace('lesson')),
    );
    if (record.frontmatter.projectId !== undefined
      && (typeof record.frontmatter.projectId !== 'string'
        || !namespace('project')(record.frontmatter.projectId))) {
      issues.push({
        nodeId: record.nodeId,
        path: 'projectId',
        code: 'invalid-project-id',
        message: 'projectId must be a valid project ID',
      });
    }
  }

  const destinationId = record.frontmatter.destinationId;
  if (destinationId !== undefined
    && (typeof destinationId !== 'string' || !isDestinationId(destinationId))) {
    issues.push({
      nodeId: record.nodeId,
      path: 'destinationId',
      code: 'invalid-destination-id',
      message: 'destinationId must be a valid destination ID',
    });
  }

  return issues;
}

export function validateContentRecords(records: readonly AuthoredContentRecord[]) {
  const issues = records.flatMap(validateContentRecord);
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.nodeId) continue;
    if (seen.has(record.nodeId)) {
      issues.push({
        nodeId: record.nodeId,
        path: 'nodeId',
        code: 'duplicate-node-id',
        message: `Duplicate content node ID: ${record.nodeId}`,
      });
    }
    seen.add(record.nodeId);
  }
  return issues;
}
