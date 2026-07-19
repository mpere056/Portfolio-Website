import { notFound } from 'next/navigation';
import ProjectReadingArtwork from '@/components/sites/ProjectReadingArtwork';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';
import { getSiteBlogPost, getSiteBlogPosts, renderSimpleMarkdown } from '@/lib/siteBlogs';

interface BlogPostPageProps {
  params: Promise<{
    site: string;
    slug: string;
  }>;
}

const portfolioOrigin = 'https://marknperera.ca';

const SITE_THEMES = {
  dreamlife: 'warm',
  lifeinbox: 'green',
  sudokutogether: 'dark',
} as const;

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
  const { site: siteParam, slug } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  const post = site ? await getSiteBlogPost(site.subdomain, slug) : undefined;

  if (!site || !post) {
    return { title: 'Post Not Found | Mark Perera' };
  }

  return {
    title: `${post.title} | Mark Perera`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { site: siteParam, slug } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  if (!site) notFound();

  const post = await getSiteBlogPost(site.subdomain, slug);
  if (!post) notFound();

  const theme = SITE_THEMES[site.subdomain as keyof typeof SITE_THEMES];
  const classes = getThemeClasses(theme);
  const blocks = renderSimpleMarkdown(post.body);

  return (
    <main className={`relative isolate min-h-screen overflow-hidden ${classes.page}`}>
      <ProjectReadingArtwork site={site.subdomain as keyof typeof SITE_THEMES} />
      <nav className="relative z-[1] mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/blog" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
          Back to Blog
        </a>
        <a href={portfolioOrigin} className={`rounded-md border px-3 py-2 text-sm opacity-75 transition hover:opacity-100 ${classes.navBorder}`}>
          Mark
        </a>
      </nav>

      <header className={`relative z-[1] border-y ${classes.hero}`}>
        <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
            <span>{formatDate(post.date)}</span>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{post.title}</h1>
          <p className={`mt-6 text-lg leading-8 ${classes.bodyText}`}>{post.description}</p>
        </div>
      </header>

      <article className="relative z-[1] mx-auto grid w-full max-w-4xl gap-10 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[160px_1fr]">
        <aside className={`border-t pt-5 text-sm leading-6 ${classes.aside}`}>
          <p className="font-semibold uppercase tracking-[0.16em] opacity-70">Filed under</p>
          <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </aside>
        <div className={`space-y-7 text-lg leading-8 ${classes.article}`}>
          {blocks.map((block) => (
            <p key={block}>{block}</p>
          ))}
        </div>
      </article>
    </main>
  );
}

function getThemeClasses(theme: 'warm' | 'green' | 'dark') {
  if (theme === 'dark') {
    return {
      page: 'bg-[#03090b] text-white',
      hero: 'border-white/10 bg-black/20 backdrop-blur-[2px]',
      navBorder: 'border-white/20',
      bodyText: 'text-white/70',
      aside: 'border-white/10 text-white/55',
      article: 'text-white/72',
    };
  }

  if (theme === 'warm') {
    return {
      page: 'bg-[#070710] text-[#f8f3ff]',
      hero: 'border-white/10 bg-black/15 backdrop-blur-[2px]',
      navBorder: 'border-white/20',
      bodyText: 'text-white/65',
      aside: 'border-white/10 text-white/50',
      article: 'text-white/72',
    };
  }

  return {
    page: 'bg-[#040807] text-[#edf8f3]',
    hero: 'border-white/10 bg-black/20 backdrop-blur-[2px]',
    navBorder: 'border-white/20',
    bodyText: 'text-white/64',
    aside: 'border-white/10 text-white/48',
    article: 'text-white/72',
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
