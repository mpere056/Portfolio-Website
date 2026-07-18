import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatContentInventoryReport, scanContentInventory } from '@/lib/contentInventory';

const temporaryRoots: string[] = [];

function createContentRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-content-inventory-'));
  temporaryRoots.push(root);
  return root;
}

function writeContent(root: string, relativePath: string, frontmatter: string, body = 'Fixture body') {
  const absolutePath = path.join(root, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  const prefix = frontmatter ? `---\n${frontmatter}\n---\n\n` : '';
  fs.writeFileSync(absolutePath, `${prefix}${body}\n`, 'utf8');
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('scanContentInventory', () => {
  it('classifies nested content and exposes current loader, identity, ingestion, and route coverage', () => {
    const root = createContentRoot();
    writeContent(root, 'projects/example.mdx', 'slug: example\nname: Example\nyear: "2026"\nheadline: Example project\nsummary: Summary');
    writeContent(root, 'about/2026-example.mdx', 'id: example-event\nfrom: "2026"\nheadline: Example event\nsummary: Summary');
    writeContent(root, 'misc/private-note.mdx', '');
    writeContent(root, 'sites/example/blog/first-post.mdx', 'slug: first-post\ntitle: First post\ndescription: Description\ndate: "2026-07-14"');

    const inventory = scanContentInventory(root);

    expect(inventory.nodes.map((node) => node.relativePath)).toEqual([
      'about/2026-example.mdx',
      'misc/private-note.mdx',
      'projects/example.mdx',
      'sites/example/blog/first-post.mdx',
    ]);
    expect(inventory.summary.byKind).toEqual({ project: 1, about: 1, misc: 1, blog: 1, unclassified: 0 });
    expect(inventory.summary.withAuthoredIdentifiers).toBe(3);
    expect(inventory.summary.withFilenameFallbacks).toBe(1);
    expect(inventory.summary.aiIdentifierDivergences).toBe(0);

    const about = inventory.nodes.find((node) => node.kind === 'about');
    expect(about).toMatchObject({
      candidateKey: 'timeline:example-event',
      candidateId: 'example-event',
      runtimeIdentifier: 'example-event',
      currentAiIngestionIdentifier: 'timeline:example-event',
    });

    const blog = inventory.nodes.find((node) => node.kind === 'blog');
    expect(blog).toMatchObject({
      candidateKey: 'post:example:first-post',
      identifierSource: 'slug',
      includedInCurrentAiIngestion: true,
      runtimeConsumers: ['src/lib/siteBlogs.ts'],
    });
    expect(blog?.routes).toContain('https://example.marknperera.ca/blog/first-post');
    expect(inventory.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'missing-authored-identifier', relativePath: 'misc/private-note.mdx' }),
    ]));
    expect(inventory.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'ai-ingestion-coverage-gap' }),
    ]));
    expect(formatContentInventoryReport(inventory)).toContain('| Total nodes | 4 |');
  });

  it('reports required metadata, duplicate scoped keys, unclassified paths, and cross-namespace IDs', () => {
    const root = createContentRoot();
    writeContent(root, 'projects/first.mdx', 'slug: shared\nname: First\nyear: "2026"\nheadline: First\nsummary: Summary');
    writeContent(root, 'projects/second.mdx', 'slug: shared\nyear: "2025"\nheadline: Second\nsummary: Summary');
    writeContent(root, 'about/shared.mdx', 'id: shared\nfrom: "2026"\nheadline: Shared\nsummary: Summary');
    writeContent(root, 'notes/unclassified.mdx', 'slug: note');

    const inventory = scanContentInventory(root);
    const issueCodes = inventory.issues.map((issue) => issue.code);

    expect(issueCodes).toContain('duplicate-candidate-key');
    expect(issueCodes).toContain('cross-namespace-identifier-collision');
    expect(issueCodes).toContain('missing-required-field');
    expect(issueCodes).toContain('unclassified-content-path');
    expect(inventory.summary.issues.error).toBe(2);
  });

  it('keeps the current repository corpus fully discoverable and free of structural errors', () => {
    const inventory = scanContentInventory(path.join(process.cwd(), 'src', 'content'));

    expect(inventory.summary.byKind).toEqual({ project: 9, about: 20, misc: 8, blog: 3, unclassified: 0 });
    expect(inventory.summary.totalNodes).toBe(40);
    expect(inventory.summary.issues.error).toBe(0);
    expect(inventory.nodes.filter((node) => node.identifierSource === 'filename-fallback')).toHaveLength(1);
    expect(inventory.nodes.filter((node) => node.kind === 'blog' && !node.includedInCurrentAiIngestion)).toHaveLength(0);
    expect(inventory.summary.aiIdentifierDivergences).toBe(0);
  });
});
