import { loadContentRecords } from './content/loaders';

export interface SiteBlogPost {
  site: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
}

export async function getSiteBlogPosts(site: string): Promise<SiteBlogPost[]> {
  const records = await loadContentRecords({ patterns: `sites/${site}/blog/*.mdx` });
  return records
    .map(record => {
      const frontmatter = record.frontmatter;

      return {
        site,
        slug: String(frontmatter.slug ?? record.relativePath.split('/').at(-1)?.replace(/\.mdx$/, '') ?? ''),
        title: String(frontmatter.title ?? ''),
        description: String(frontmatter.description ?? ''),
        date: String(frontmatter.date ?? ''),
        tags: (frontmatter.tags as string[] | undefined) ?? [],
        body: record.body.trim(),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSiteBlogPost(site: string, slug: string) {
  const posts = await getSiteBlogPosts(site);
  return posts.find((post) => post.slug === slug);
}

export function renderSimpleMarkdown(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}
