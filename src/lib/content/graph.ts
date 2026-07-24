import fs from 'fs/promises';
import path from 'path';
import {
  isNodeId,
  isRelationshipId,
  type NodeId,
  type RelationshipId,
} from '../portfolioContracts';
import { loadContentRecords, type AuthoredContentRecord } from './loaders';
import { validateContentRecords, type ContentSchemaIssue } from './schemas';
import { isPracticeId, practiceNodeId, type PracticeId } from '../practices';

export const GRAPH_RELATIONSHIP_TYPES = [
  'inspired',
  'led_to',
  'demonstrates',
  'learned_from',
  'solved_in',
  'continued_in',
  'contrasts_with',
  'depends_on',
  'documented_in',
  'evidenced_by',
  'currently_exploring',
] as const;

export type GraphRelationshipType = (typeof GRAPH_RELATIONSHIP_TYPES)[number];
export type GraphVisibility = 'public' | 'private' | 'draft';

export interface GraphNode {
  id: NodeId;
  type: string;
  title: string;
  summary: string;
  sourcePath?: string;
  visibility: GraphVisibility;
  tags: readonly string[];
  primaryPracticeId?: PracticeId;
}

export interface GraphRelationship {
  id: RelationshipId;
  sourceId: NodeId;
  type: GraphRelationshipType;
  targetId: NodeId;
  explanation: string;
  evidenceNodeIds: readonly NodeId[];
  status: 'draft' | 'reviewed';
  visibility: 'public' | 'hidden-discovery' | 'internal';
}

export interface GraphValidationIssue {
  code: string;
  subjectId: string;
  message: string;
}

export interface CompiledKnowledgeGraph {
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
  issues: readonly GraphValidationIssue[];
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function contentNode(record: AuthoredContentRecord): GraphNode | undefined {
  if (!record.nodeId || record.kind === 'unclassified') return undefined;
  const fields = record.frontmatter;
  const title = ['name', 'headline', 'title', 'slug', 'id']
    .map(key => stringValue(fields[key]))
    .find(Boolean) ?? record.nodeId;
  const summary = ['summary', 'description']
    .map(key => stringValue(fields[key]))
    .find(Boolean)
    ?? stringValue(record.body.trim().slice(0, 240))
    ?? `Authored ${record.kind} content record.`;
  const visibility = ['public', 'private', 'draft'].includes(String(fields.visibility))
    ? fields.visibility as GraphVisibility
    : 'public';
  return {
    id: record.nodeId,
    type: record.kind === 'about' ? 'timeline' : record.kind,
    title,
    summary,
    sourcePath: record.relativePath,
    visibility,
    tags: [...new Set([...stringList(fields.tags), ...stringList(fields.tech)])],
    ...(record.kind === 'project' && typeof fields.primaryPracticeId === 'string'
      && isPracticeId(fields.primaryPracticeId)
      ? { primaryPracticeId: fields.primaryPracticeId }
      : {}),
  };
}

function schemaIssue(issue: ContentSchemaIssue): GraphValidationIssue {
  return {
    code: `content-${issue.code}`,
    subjectId: issue.nodeId ?? issue.path,
    message: issue.message,
  };
}

export function validateKnowledgeGraph(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
): GraphValidationIssue[] {
  const issues: GraphValidationIssue[] = [];
  const nodeMap = new Map<string, GraphNode>();
  for (const node of nodes) {
    if (!isNodeId(node.id)) issues.push({ code: 'invalid-node-id', subjectId: node.id, message: 'Node ID is invalid' });
    if (nodeMap.has(node.id)) issues.push({ code: 'duplicate-node-id', subjectId: node.id, message: 'Node ID is duplicated' });
    if (!node.title.trim() || !node.summary.trim()) {
      issues.push({ code: 'missing-node-copy', subjectId: node.id, message: 'Node title and summary are required' });
    }
    nodeMap.set(node.id, node);
  }
  for (const node of nodes) {
    if (node.type !== 'project') continue;
    if (!node.primaryPracticeId) {
      issues.push({
        code: 'missing-project-practice',
        subjectId: node.id,
        message: 'Project nodes require one primary practice',
      });
      continue;
    }
    const practiceNode = nodeMap.get(practiceNodeId(node.primaryPracticeId));
    if (!practiceNode || practiceNode.type !== 'practice') {
      issues.push({
        code: 'missing-practice-node',
        subjectId: node.id,
        message: `Missing practice graph node: ${practiceNodeId(node.primaryPracticeId)}`,
      });
    }
  }

  const relationshipIds = new Set<string>();
  for (const relationship of relationships) {
    if (!isRelationshipId(relationship.id)) {
      issues.push({ code: 'invalid-relationship-id', subjectId: relationship.id, message: 'Relationship ID is invalid' });
    }
    if (relationshipIds.has(relationship.id)) {
      issues.push({ code: 'duplicate-relationship-id', subjectId: relationship.id, message: 'Relationship ID is duplicated' });
    }
    relationshipIds.add(relationship.id);
    if (!GRAPH_RELATIONSHIP_TYPES.includes(relationship.type)) {
      issues.push({ code: 'invalid-relationship-type', subjectId: relationship.id, message: 'Relationship type is invalid' });
    }
    const referencedIds = [relationship.sourceId, relationship.targetId, ...relationship.evidenceNodeIds];
    for (const referencedId of referencedIds) {
      if (!nodeMap.has(referencedId)) {
        issues.push({ code: 'broken-reference', subjectId: relationship.id, message: `Missing graph node: ${referencedId}` });
      }
    }
    if (relationship.visibility === 'public') {
      if (relationship.status !== 'reviewed') {
        issues.push({ code: 'unreviewed-public-relationship', subjectId: relationship.id, message: 'Public relationships must be reviewed' });
      }
      if (!relationship.explanation.trim()) {
        issues.push({ code: 'missing-public-explanation', subjectId: relationship.id, message: 'Public relationships require an explanation' });
      }
      for (const referencedId of referencedIds) {
        const node = nodeMap.get(referencedId);
        if (node && node.visibility !== 'public') {
          issues.push({ code: 'private-node-leak', subjectId: relationship.id, message: `Public relationship exposes ${referencedId}` });
        }
      }
    }
  }
  return issues;
}

export function compileKnowledgeGraph(input: {
  contentRecords: readonly AuthoredContentRecord[];
  authoredNodes?: readonly GraphNode[];
  relationships?: readonly GraphRelationship[];
}): CompiledKnowledgeGraph {
  const contentNodes = input.contentRecords.map(contentNode).filter((node): node is GraphNode => Boolean(node));
  const nodes = [...contentNodes, ...(input.authoredNodes ?? [])]
    .sort((left, right) => left.id.localeCompare(right.id));
  const relationships = [...(input.relationships ?? [])]
    .sort((left, right) => left.id.localeCompare(right.id));
  const issues = [
    ...validateContentRecords(input.contentRecords).map(schemaIssue),
    ...validateKnowledgeGraph(nodes, relationships),
  ].sort((left, right) => left.code.localeCompare(right.code) || left.subjectId.localeCompare(right.subjectId));
  return { nodes, relationships, issues };
}

export async function loadKnowledgeGraph(): Promise<CompiledKnowledgeGraph> {
  const graphRoot = path.join(process.cwd(), 'src/content/graph');
  const [contentRecords, nodeText, relationshipText] = await Promise.all([
    loadContentRecords(),
    fs.readFile(path.join(graphRoot, 'nodes.json'), 'utf8'),
    fs.readFile(path.join(graphRoot, 'relationships.json'), 'utf8'),
  ]);
  return compileKnowledgeGraph({
    contentRecords,
    authoredNodes: JSON.parse(nodeText) as GraphNode[],
    relationships: JSON.parse(relationshipText) as GraphRelationship[],
  });
}
