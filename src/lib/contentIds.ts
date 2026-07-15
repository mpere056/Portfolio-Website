export const CONTENT_NODE_NAMESPACES = ['project', 'timeline', 'misc', 'post'] as const;

export type ContentNodeNamespace = (typeof CONTENT_NODE_NAMESPACES)[number];
export type ContentNodeId =
  | `project:${string}`
  | `timeline:${string}`
  | `misc:${string}`
  | `post:${string}:${string}`;

export type ContentIdentityInput =
  | { kind: 'project'; authoredId: string }
  | { kind: 'about'; authoredId: string }
  | { kind: 'misc'; authoredId: string }
  | { kind: 'blog'; authoredId: string; site: string };

export type ContentIdAliases = Readonly<Record<string, ContentNodeId>>;
export type ContentIdentityKind = ContentIdentityInput['kind'];
export type IdentifierSource = 'id' | 'slug' | 'filename-fallback';

export interface ContentPathClassification {
  kind: ContentIdentityKind;
  site?: string;
}

export interface DerivedContentIdentity {
  authoredId?: string;
  candidateId: string;
  identifierSource: IdentifierSource;
  nodeId: ContentNodeId;
}

const ID_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertSegment(value: string, label: string) {
  if (!ID_SEGMENT.test(value)) {
    throw new Error(`${label} must be lowercase ASCII kebab-case: ${value}`);
  }
}

function nonEmptyString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized || undefined;
}

function filenameIdentifier(relativePath: string) {
  return relativePath.replace(/\\/g, '/').split('/').at(-1)?.replace(/\.mdx?$/i, '') ?? '';
}

export function classifyContentPath(relativePath: string): ContentPathClassification | undefined {
  const parts = relativePath.replace(/\\/g, '/').split('/');
  if (parts.length === 2 && parts[0] === 'projects') return { kind: 'project' };
  if (parts.length === 2 && parts[0] === 'about') return { kind: 'about' };
  if (parts.length === 2 && parts[0] === 'misc') return { kind: 'misc' };
  if (parts.length === 4 && parts[0] === 'sites' && parts[2] === 'blog') {
    return { kind: 'blog', site: parts[1] };
  }

  return undefined;
}

export function deriveContentIdentity(
  classification: ContentPathClassification,
  frontmatter: Readonly<Record<string, unknown>>,
  relativePath: string,
): DerivedContentIdentity {
  const preferred = classification.kind === 'about'
    ? [['id', nonEmptyString(frontmatter.id)], ['slug', nonEmptyString(frontmatter.slug)]] as const
    : [['slug', nonEmptyString(frontmatter.slug)], ['id', nonEmptyString(frontmatter.id)]] as const;
  const authored = preferred.find(([, value]) => value);
  const candidateId = authored?.[1] ?? filenameIdentifier(relativePath);
  const identifierSource = authored?.[0] ?? 'filename-fallback';
  const input = classification.kind === 'blog'
    ? { kind: classification.kind, authoredId: candidateId, site: classification.site ?? '' } as const
    : { kind: classification.kind, authoredId: candidateId } as const;

  return {
    authoredId: authored?.[1],
    candidateId,
    identifierSource,
    nodeId: createContentNodeId(input),
  };
}

export function createContentNodeId(input: ContentIdentityInput): ContentNodeId {
  assertSegment(input.authoredId, 'Content identifier');

  switch (input.kind) {
    case 'project':
      return `project:${input.authoredId}`;
    case 'about':
      return `timeline:${input.authoredId}`;
    case 'misc':
      return `misc:${input.authoredId}`;
    case 'blog':
      assertSegment(input.site, 'Blog site identifier');
      return `post:${input.site}:${input.authoredId}`;
  }
}

export function isContentNodeId(value: string): value is ContentNodeId {
  const parts = value.split(':');
  if (parts[0] === 'post') {
    return parts.length === 3 && ID_SEGMENT.test(parts[1]) && ID_SEGMENT.test(parts[2]);
  }

  return parts.length === 2
    && (parts[0] === 'project' || parts[0] === 'timeline' || parts[0] === 'misc')
    && ID_SEGMENT.test(parts[1]);
}

export function resolveContentNodeId(value: string, aliases: ContentIdAliases = {}) {
  if (isContentNodeId(value)) return value;

  const canonical = aliases[value];
  if (!canonical) return undefined;
  if (!isContentNodeId(canonical)) {
    throw new Error(`Alias target is not a canonical content ID: ${canonical}`);
  }

  return canonical;
}
