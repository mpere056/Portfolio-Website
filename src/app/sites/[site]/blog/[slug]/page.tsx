import { notFound } from 'next/navigation';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';
import { getSiteBlogPost, getSiteBlogPosts, renderSimpleMarkdown } from '@/lib/siteBlogs';

interface BlogPostPageProps {
  params: {
    site: string;
    slug: string;
  };
}

const portfolioOrigin = 'https://marknperera.ca';

export async function generateStaticParams() {
  const params = await Promise.all(
    PROJECT_SITES.map(async (site) => {
      const posts = await getSiteBlogPosts(site.subdomain);
      return posts.map((post) => ({ site: site.subdomain, slug: post.slug }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  const post = site ? await getSiteBlogPost(site.subdomain, params.slug) : undefined;

  if (!site || !post) {
    return { title: "Post Not Found | Mark Perera" };
  }

  return {
    title: `${post.title} | Mark Perera`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  if (!site) notFound();

  const post = await getSiteBlogPost(site.subdomain, params.slug);
  if (!post) notFound();

  const isLifeInbox = site.subdomain === 'lifeinbox';
  const blocks = renderSimpleMarkdown(post.body);

  return (
    <main className={isLifeInbox ? 'min-h-screen bg-[#f4f0e7] text-[#17211c]' : 'min-h-screen bg-[#081018] text-white'}>
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/blog" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
          Back to Blog
        </a>
        <a
          href={portfolioOrigin}
          className={isLifeInbox ? 'rounded-md border border-[#17211c]/20 px-3 py-2 text-sm opacity-75 transition hover:opacity-100' : 'rounded-md border border-white/20 px-3 py-2 text-sm opacity-75 transition hover:opacity-100'}
        >
          Mark
        </a>
      </nav>

      <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
          <span>{formatDate(post.date)}</span>
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{post.title}</h1>
        <p className={isLifeInbox ? 'mt-6 text-lg leading-8 text-[#52665d]' : 'mt-6 text-lg leading-8 text-white/70'}>
          {post.description}
        </p>

        <div className={isLifeInbox ? 'mt-12 space-y-7 border-t border-[#17211c]/10 pt-10 text-lg leading-8 text-[#32433a]' : 'mt-12 space-y-7 border-t border-white/10 pt-10 text-lg leading-8 text-white/72'}>
          {blocks.map((block) => (
            <p key={block}>{block}</p>
          ))}
        </div>
      </article>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
