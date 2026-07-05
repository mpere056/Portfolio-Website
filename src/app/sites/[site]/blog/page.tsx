import { notFound } from 'next/navigation';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';
import { getSiteBlogPosts } from '@/lib/siteBlogs';

interface BlogIndexPageProps {
  params: {
    site: string;
  };
}

const portfolioOrigin = 'https://marknperera.ca';

export async function generateStaticParams() {
  return PROJECT_SITES.map((site) => ({ site: site.subdomain }));
}

export async function generateMetadata({ params }: BlogIndexPageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  if (!site) return { title: "Blog | Mark Perera" };

  const title = site.subdomain === 'lifeinbox' ? 'Life Inbox Blog' : 'Sudoku Together Blog';
  return {
    title: `${title} | Mark Perera`,
    description: `Notes and build logs for ${title.replace(' Blog', '')}.`,
  };
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  if (!site) notFound();

  const posts = await getSiteBlogPosts(site.subdomain);
  const isLifeInbox = site.subdomain === 'lifeinbox';
  const title = isLifeInbox ? 'Life Inbox Notes' : 'Sudoku Together Notes';
  const intro = isLifeInbox
    ? 'Build logs on life design, AI reflection loops, and turning a prototype into a useful personal system.'
    : 'Technical notes on Discord Activities, collaborative puzzle state, and making Sudoku feel shared.';

  return (
    <main className={isLifeInbox ? 'min-h-screen bg-[#f4f0e7] text-[#17211c]' : 'min-h-screen bg-[#081018] text-white'}>
      <BlogNav site={site.subdomain} isLifeInbox={isLifeInbox} />
      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
        <p className={isLifeInbox ? 'text-sm font-semibold uppercase tracking-[0.2em] text-[#47685a]' : 'text-sm font-semibold uppercase tracking-[0.2em] text-[#86efac]'}>
          Blog
        </p>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{title}</h1>
        <p className={isLifeInbox ? 'mt-5 max-w-2xl text-lg leading-8 text-[#52665d]' : 'mt-5 max-w-2xl text-lg leading-8 text-white/70'}>
          {intro}
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-5 pb-20 sm:px-8">
        {posts.length === 0 ? (
          <div className={isLifeInbox ? 'rounded-lg border border-[#17211c]/10 bg-white/60 p-6' : 'rounded-lg border border-white/10 bg-white/[0.045] p-6'}>
            <p className={isLifeInbox ? 'text-[#52665d]' : 'text-white/70'}>Posts are coming soon.</p>
          </div>
        ) : (
          posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={isLifeInbox ? 'rounded-lg border border-[#17211c]/10 bg-white/60 p-6 transition hover:border-[#17211c]/25' : 'rounded-lg border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#86efac]/35'}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
                <span>{formatDate(post.date)}</span>
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h2 className="mt-4 font-serif text-3xl">{post.title}</h2>
              <p className={isLifeInbox ? 'mt-3 leading-7 text-[#52665d]' : 'mt-3 leading-7 text-white/70'}>{post.description}</p>
            </a>
          ))
        )}
      </section>
    </main>
  );
}

function BlogNav({ site, isLifeInbox }: { site: string; isLifeInbox: boolean }) {
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="/" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
        {site === 'lifeinbox' ? 'Life Inbox' : 'Sudoku Together'}
      </a>
      <div className="flex items-center gap-3 text-sm">
        <a
          href={portfolioOrigin}
          className={isLifeInbox ? 'rounded-md border border-[#17211c]/20 px-3 py-2 opacity-75 transition hover:opacity-100' : 'rounded-md border border-white/20 px-3 py-2 opacity-75 transition hover:opacity-100'}
        >
          Mark
        </a>
        <a
          href="/blog"
          className={isLifeInbox ? 'rounded-md border border-[#17211c]/20 px-3 py-2 opacity-75 transition hover:opacity-100' : 'rounded-md border border-white/20 px-3 py-2 opacity-75 transition hover:opacity-100'}
        >
          Blog
        </a>
      </div>
    </nav>
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
