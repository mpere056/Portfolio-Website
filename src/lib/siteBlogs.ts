import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const BLOG_ROOT = path.join(process.cwd(), 'src/content/sites');

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
  const blogPath = path.join(BLOG_ROOT, site, 'blog');

  if (!fs.existsSync(blogPath)) {
    return [];
  }

  const files = await glob('*.mdx', { cwd: blogPath });

  return files
    .map((file) => {
      const filePath = path.join(blogPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = data as Record<string, unknown>;

      return {
        site,
        slug: String(frontmatter.slug ?? file.replace(/\.mdx$/, '')),
        title: String(frontmatter.title ?? ''),
        description: String(frontmatter.description ?? ''),
        date: String(frontmatter.date ?? ''),
        tags: (frontmatter.tags as string[] | undefined) ?? [],
        body: content.trim(),
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
