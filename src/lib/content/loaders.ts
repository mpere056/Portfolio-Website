import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {
  classifyContentPath,
  deriveContentIdentity,
  type ContentIdentityKind,
  type ContentNodeId,
  type IdentifierSource,
} from '../contentIds';

export interface AuthoredContentRecord {
  kind: ContentIdentityKind | 'unclassified';
  site?: string;
  nodeId?: ContentNodeId;
  authoredId?: string;
  identifierSource?: IdentifierSource;
  relativePath: string;
  absolutePath: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface LoadContentRecordsOptions {
  contentRoot?: string;
  patterns?: string | readonly string[];
}

function normalizePath(value: string) {
  return value.replace(/\\/g, '/');
}

function patternExpression(pattern: string) {
  let expression = '^';
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === '*' && pattern[index + 1] === '*') {
      const followedBySlash = pattern[index + 2] === '/';
      expression += followedBySlash ? '(?:.*/)?' : '.*';
      index += followedBySlash ? 2 : 1;
    } else if (character === '*') {
      expression += '[^/]*';
    } else {
      expression += character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`${expression}$`);
}

async function listContentFiles(root: string, directory = ''): Promise<string[]> {
  const entries = await fs.readdir(
    path.join(/* turbopackIgnore: true */ root, directory),
    { withFileTypes: true },
  );
  const paths = await Promise.all(entries.map(async entry => {
    const relativePath = normalizePath(path.join(directory, entry.name));
    return entry.isDirectory()
      ? listContentFiles(root, relativePath)
      : [relativePath];
  }));
  return paths.flat();
}

export async function loadContentRecords(
  options: LoadContentRecordsOptions = {},
): Promise<AuthoredContentRecord[]> {
  const contentRoot = options.contentRoot
    ?? path.join(/* turbopackIgnore: true */ process.cwd(), 'src/content');
  const patterns = typeof options.patterns === 'string'
    ? [options.patterns]
    : options.patterns ?? ['**/*.md', '**/*.mdx'];
  const matchers = patterns.map(patternExpression);
  const files = (await listContentFiles(contentRoot))
    .filter(relativePath => matchers.some(matcher => matcher.test(relativePath)));

  return Promise.all(files
    .map(normalizePath)
    .sort((left, right) => left.localeCompare(right))
    .map(async relativePath => {
      const absolutePath = path.join(contentRoot, relativePath);
      const parsed = matter(await fs.readFile(
        /* turbopackIgnore: true */ absolutePath,
        'utf8',
      ));
      const frontmatter = parsed.data as Record<string, unknown>;
      const classification = classifyContentPath(relativePath);
      if (!classification) {
        return {
          kind: 'unclassified',
          relativePath,
          absolutePath,
          frontmatter,
          body: parsed.content,
        } satisfies AuthoredContentRecord;
      }

      const identity = deriveContentIdentity(classification, frontmatter, relativePath);
      return {
        kind: classification.kind,
        site: classification.site,
        nodeId: identity.nodeId,
        authoredId: identity.authoredId,
        identifierSource: identity.identifierSource,
        relativePath,
        absolutePath,
        frontmatter,
        body: parsed.content,
      } satisfies AuthoredContentRecord;
    }));
}
