import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  classifyContentPath,
  createContentNodeId,
  deriveContentIdentity,
  type IdentifierSource,
} from '@/lib/contentIds';

export const CONTENT_KINDS = ['project', 'about', 'misc', 'blog', 'unclassified'] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];
export type InventoryIssueSeverity = 'error' | 'warning' | 'info';

export interface ContentInventoryNode {
  kind: ContentKind;
  relativePath: string;
  site?: string;
  authoredId?: string;
  candidateId: string;
  candidateKey: string;
  identifierSource: IdentifierSource;
  runtimeIdentifier?: string;
  currentAiIngestionIdentifier?: string;
  title: string;
  frontmatterKeys: string[];
  bodyWordCount: number;
  runtimeConsumers: string[];
  includedInCurrentAiIngestion: boolean;
  routes: string[];
}

export interface ContentInventoryIssue {
  severity: InventoryIssueSeverity;
  code: string;
  relativePath?: string;
  message: string;
}

export interface ContentInventorySummary {
  totalNodes: number;
  byKind: Record<ContentKind, number>;
  withAuthoredIdentifiers: number;
  withFilenameFallbacks: number;
  includedInCurrentAiIngestion: number;
  aiIdentifierDivergences: number;
  withRuntimeConsumers: number;
  uniqueRoutes: number;
  issues: Record<InventoryIssueSeverity, number>;
}

export interface ContentInventory {
  contentRoot: string;
  nodes: ContentInventoryNode[];
  routes: string[];
  issues: ContentInventoryIssue[];
  summary: ContentInventorySummary;
}

interface Classification {
  kind: ContentKind;
  site?: string;
}

const REQUIRED_FIELDS: Partial<Record<ContentKind, string[]>> = {
  project: ['slug', 'name', 'year', 'headline', 'summary'],
  about: ['id', 'from', 'headline', 'summary'],
  blog: ['title', 'description', 'date'],
};

const SEVERITY_ORDER: Record<InventoryIssueSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

function normalizePath(filePath: string) {
  return filePath.split(path.sep).join('/');
}

function walkContentFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walkContentFiles(absolutePath);
      }

      return entry.isFile() && /\.mdx?$/i.test(entry.name) ? [absolutePath] : [];
    })
    .sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)));
}

function classify(relativePath: string): Classification {
  return classifyContentPath(relativePath) ?? { kind: 'unclassified' };
}

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized || undefined;
}

function resolveIdentifier(
  kind: ContentKind,
  frontmatter: Record<string, unknown>,
  relativePath: string,
) {
  if (kind === 'unclassified') {
    return {
      authoredId: undefined,
      candidateId: path.basename(relativePath).replace(/\.mdx?$/i, ''),
      identifierSource: 'filename-fallback' as const,
    };
  }

  const { nodeId: _nodeId, ...identity } = deriveContentIdentity(
    { kind, ...(kind === 'blog' ? { site: classify(relativePath).site } : {}) },
    frontmatter,
    relativePath,
  );
  return identity;
}

function namespaceFor(kind: ContentKind, site?: string) {
  if (kind === 'about') return 'timeline';
  if (kind === 'blog') return `post:${site ?? 'unknown-site'}`;
  return kind;
}

function canonicalCandidateKey(kind: ContentKind, candidateId: string, site?: string) {
  if (kind === 'unclassified') return `unclassified:${candidateId}`;
  if (kind === 'blog') {
    return createContentNodeId({ kind, authoredId: candidateId, site: site ?? 'unknown-site' });
  }

  return createContentNodeId({ kind, authoredId: candidateId });
}

function titleFor(kind: ContentKind, frontmatter: Record<string, unknown>, candidateId: string) {
  const fields = kind === 'blog' ? ['title', 'headline', 'name'] : ['name', 'headline', 'title'];
  return fields.map((field) => nonEmptyString(frontmatter[field])).find(Boolean) ?? candidateId;
}

function consumersFor(kind: ContentKind) {
  switch (kind) {
    case 'project': return ['src/lib/projects.ts'];
    case 'about': return ['src/lib/timeline.ts'];
    case 'blog': return ['src/lib/siteBlogs.ts'];
    default: return [];
  }
}

function filenameIdentifier(relativePath: string) {
  return path.basename(relativePath).replace(/\.mdx?$/i, '');
}

function runtimeIdentifierFor(
  kind: ContentKind,
  frontmatter: Record<string, unknown>,
  relativePath: string,
) {
  switch (kind) {
    case 'project': return nonEmptyString(frontmatter.slug);
    case 'about': return nonEmptyString(frontmatter.id);
    case 'blog': return nonEmptyString(frontmatter.slug) ?? filenameIdentifier(relativePath);
    default: return undefined;
  }
}

function routesFor(kind: ContentKind, runtimeIdentifier?: string, site?: string) {
  switch (kind) {
    case 'project':
      return runtimeIdentifier ? [`/projects#${runtimeIdentifier}`] : ['/projects'];
    case 'about':
      return ['/about'];
    case 'blog':
      return site && runtimeIdentifier
        ? [`/sites/${site}/blog/${runtimeIdentifier}`, `https://${site}.marknperera.ca/blog/${runtimeIdentifier}`]
        : [];
    default:
      return [];
  }
}

function isIncludedInCurrentAiIngestion(relativePath: string) {
  return relativePath.split('/').length <= 2;
}

function hasRequiredValue(frontmatter: Record<string, unknown>, field: string) {
  const value = frontmatter[field];
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null;
}

function issueSort(a: ContentInventoryIssue, b: ContentInventoryIssue) {
  return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    || a.code.localeCompare(b.code)
    || (a.relativePath ?? '').localeCompare(b.relativePath ?? '')
    || a.message.localeCompare(b.message);
}

function validateNodes(nodes: ContentInventoryNode[], metadata: Map<string, Record<string, unknown>>) {
  const issues: ContentInventoryIssue[] = [];

  for (const node of nodes) {
    const frontmatter = metadata.get(node.relativePath) ?? {};

    if (node.identifierSource === 'filename-fallback') {
      issues.push({
        severity: 'warning',
        code: 'missing-authored-identifier',
        relativePath: node.relativePath,
        message: `No authored id or slug; current candidate uses filename fallback "${node.candidateId}".`,
      });
    }

    for (const field of REQUIRED_FIELDS[node.kind] ?? []) {
      if (!hasRequiredValue(frontmatter, field)) {
        issues.push({
          severity: 'error',
          code: 'missing-required-field',
          relativePath: node.relativePath,
          message: `${node.kind} content is missing required frontmatter field "${field}".`,
        });
      }
    }

    if (node.kind === 'blog' && !node.includedInCurrentAiIngestion) {
      issues.push({
        severity: 'warning',
        code: 'ai-ingestion-coverage-gap',
        relativePath: node.relativePath,
        message: 'Nested blog content is loaded by the site but skipped by the current one-level AI ingestion traversal.',
      });
    }

    if (
      node.currentAiIngestionIdentifier
      && node.currentAiIngestionIdentifier !== node.candidateKey
    ) {
      issues.push({
        severity: 'warning',
        code: 'ai-identifier-divergence',
        relativePath: node.relativePath,
        message: `Canonical candidate "${node.candidateKey}" is ingested under "${node.currentAiIngestionIdentifier}".`,
      });
    }

    if (node.kind === 'misc' && node.runtimeConsumers.length === 0) {
      issues.push({
        severity: 'info',
        code: 'ai-corpus-only',
        relativePath: node.relativePath,
        message: 'Content is currently consumed by AI ingestion but has no direct runtime page loader.',
      });
    }

    if (node.kind === 'unclassified') {
      issues.push({
        severity: 'warning',
        code: 'unclassified-content-path',
        relativePath: node.relativePath,
        message: 'Content path does not match a currently recognized content category.',
      });
    }
  }

  const byCandidateKey = new Map<string, ContentInventoryNode[]>();
  const byAuthoredId = new Map<string, ContentInventoryNode[]>();
  for (const node of nodes) {
    byCandidateKey.set(node.candidateKey, [...(byCandidateKey.get(node.candidateKey) ?? []), node]);
    if (node.authoredId) {
      byAuthoredId.set(node.authoredId, [...(byAuthoredId.get(node.authoredId) ?? []), node]);
    }
  }

  for (const [candidateKey, duplicates] of byCandidateKey) {
    if (duplicates.length < 2) continue;
    issues.push({
      severity: 'error',
      code: 'duplicate-candidate-key',
      message: `Candidate key "${candidateKey}" is shared by ${duplicates.map((node) => node.relativePath).join(', ')}.`,
    });
  }

  for (const [authoredId, matches] of byAuthoredId) {
    const namespaces = new Set(matches.map((node) => namespaceFor(node.kind, node.site)));
    if (matches.length < 2 || namespaces.size < 2) continue;
    issues.push({
      severity: 'info',
      code: 'cross-namespace-identifier-collision',
      message: `Authored identifier "${authoredId}" appears in ${matches.map((node) => node.candidateKey).join(', ')}; ARC-01 must preserve namespaces.`,
    });
  }

  return issues.sort(issueSort);
}

function emptyKindCounts(): Record<ContentKind, number> {
  return { project: 0, about: 0, misc: 0, blog: 0, unclassified: 0 };
}

export function scanContentInventory(contentRoot = path.join(process.cwd(), 'src', 'content')): ContentInventory {
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Content root does not exist: ${contentRoot}`);
  }

  const metadata = new Map<string, Record<string, unknown>>();
  const parseIssues: ContentInventoryIssue[] = [];
  const nodes = walkContentFiles(contentRoot).map((absolutePath) => {
    const relativePath = normalizePath(path.relative(contentRoot, absolutePath));
    const classification = classify(relativePath);
    let frontmatter: Record<string, unknown> = {};
    let body = '';

    try {
      const parsed = matter(fs.readFileSync(absolutePath, 'utf8'));
      frontmatter = parsed.data as Record<string, unknown>;
      body = parsed.content;
    } catch (error) {
      parseIssues.push({
        severity: 'error',
        code: 'frontmatter-parse-failed',
        relativePath,
        message: error instanceof Error ? error.message : 'Unknown frontmatter parsing failure.',
      });
    }

    metadata.set(relativePath, frontmatter);
    const identifier = resolveIdentifier(classification.kind, frontmatter, relativePath);
    const candidateKey = canonicalCandidateKey(classification.kind, identifier.candidateId, classification.site);
    const runtimeIdentifier = runtimeIdentifierFor(classification.kind, frontmatter, relativePath);
    const includedInCurrentAiIngestion = isIncludedInCurrentAiIngestion(relativePath);
    const currentAiIngestionIdentifier = includedInCurrentAiIngestion
      ? candidateKey
      : undefined;
    const routes = routesFor(classification.kind, runtimeIdentifier, classification.site);

    return {
      kind: classification.kind,
      relativePath,
      site: classification.site,
      ...identifier,
      candidateKey,
      runtimeIdentifier,
      currentAiIngestionIdentifier,
      title: titleFor(classification.kind, frontmatter, identifier.candidateId),
      frontmatterKeys: Object.keys(frontmatter).sort((a, b) => a.localeCompare(b)),
      bodyWordCount: body.trim() ? body.trim().split(/\s+/).length : 0,
      runtimeConsumers: consumersFor(classification.kind),
      includedInCurrentAiIngestion,
      routes,
    } satisfies ContentInventoryNode;
  });

  const issues = [...parseIssues, ...validateNodes(nodes, metadata)].sort(issueSort);
  const byKind = nodes.reduce((counts, node) => {
    counts[node.kind] += 1;
    return counts;
  }, emptyKindCounts());
  const routes = [...new Set(nodes.flatMap((node) => node.routes))].sort((a, b) => a.localeCompare(b));
  const issueCounts = issues.reduce<Record<InventoryIssueSeverity, number>>((counts, issue) => {
    counts[issue.severity] += 1;
    return counts;
  }, { error: 0, warning: 0, info: 0 });

  return {
    contentRoot: path.resolve(contentRoot),
    nodes,
    routes,
    issues,
    summary: {
      totalNodes: nodes.length,
      byKind,
      withAuthoredIdentifiers: nodes.filter((node) => node.authoredId).length,
      withFilenameFallbacks: nodes.filter((node) => !node.authoredId).length,
      includedInCurrentAiIngestion: nodes.filter((node) => node.includedInCurrentAiIngestion).length,
      aiIdentifierDivergences: nodes.filter((node) => (
        node.currentAiIngestionIdentifier
        && node.currentAiIngestionIdentifier !== node.candidateKey
      )).length,
      withRuntimeConsumers: nodes.filter((node) => node.runtimeConsumers.length > 0).length,
      uniqueRoutes: routes.length,
      issues: issueCounts,
    },
  };
}

function escapeTableCell(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

export function formatContentInventoryReport(inventory: ContentInventory) {
  const { summary } = inventory;
  const lines = [
    '# Content Inventory',
    '',
    `Content root: \`${normalizePath(inventory.contentRoot)}\``,
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '| --- | ---: |',
    `| Total nodes | ${summary.totalNodes} |`,
    ...CONTENT_KINDS.map((kind) => `| ${kind} nodes | ${summary.byKind[kind]} |`),
    `| Authored identifiers | ${summary.withAuthoredIdentifiers} |`,
    `| Filename fallbacks | ${summary.withFilenameFallbacks} |`,
    `| Current AI-ingestion coverage | ${summary.includedInCurrentAiIngestion} |`,
    `| Runtime / AI identifier divergences | ${summary.aiIdentifierDivergences} |`,
    `| Runtime-loader coverage | ${summary.withRuntimeConsumers} |`,
    `| Unique content destinations | ${summary.uniqueRoutes} |`,
    `| Errors / warnings / info | ${summary.issues.error} / ${summary.issues.warning} / ${summary.issues.info} |`,
    '',
    '## Nodes',
    '',
    '| Candidate key | Source | Runtime ID | AI ID | Runtime loader | Routes | Path |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...inventory.nodes.map((node) => [
      `\`${node.candidateKey}\``,
      node.identifierSource,
      node.runtimeIdentifier ?? 'none',
      node.currentAiIngestionIdentifier ?? 'not ingested',
      node.runtimeConsumers.length ? node.runtimeConsumers.join(', ') : 'none',
      node.routes.length ? node.routes.join(', ') : 'none',
      `\`${node.relativePath}\``,
    ].map(escapeTableCell).join(' | ')).map((row) => `| ${row} |`),
    '',
    '## Issues',
    '',
    '| Severity | Code | Path | Finding |',
    '| --- | --- | --- | --- |',
    ...(inventory.issues.length
      ? inventory.issues.map((issue) => `| ${issue.severity} | \`${issue.code}\` | ${issue.relativePath ? `\`${issue.relativePath}\`` : '-'} | ${escapeTableCell(issue.message)} |`)
      : ['| - | - | - | No issues found |']),
    '',
  ];

  return lines.join('\n');
}
