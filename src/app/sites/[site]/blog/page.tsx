import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectReadingArtwork from '@/components/sites/ProjectReadingArtwork';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';
import { getSiteBlogPosts } from '@/lib/siteBlogs';

interface BlogIndexPageProps {
  params: Promise<{
    site: string;
  }>;
}

const portfolioOrigin = 'https://marknperera.ca';

const SITE_COPY = {
  dreamlife: {
    label: 'Dreamlife',
    title: 'Dreamlife Build Notes',
    intro: 'Notes on life design, AI-guided reflection, scenario planning, and the product thinking behind the six-figure prototype.',
    theme: 'warm',
  },
  lifeinbox: {
    label: 'LifeInbox',
    title: 'LifeInbox Field Notes',
    intro: 'Implementation notes on local-first capture, sync, reminders, AI enrichment, and turning a personal Android organizer into trusted daily infrastructure.',
    theme: 'green',
  },
  sudokutogether: {
    label: 'Sudoku Together',
    title: 'Sudoku Together Dev Log',
    intro: 'Technical notes on Discord Activities, collaborative puzzle state, progression systems, and making Sudoku feel shared.',
    theme: 'dark',
  },
} as const;

export async function generateStaticParams() {
  return PROJECT_SITES.map((site) => ({ site: site.subdomain }));
}

export async function generateMetadata({ params }: BlogIndexPageProps) {
  const { site: siteParam } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  const copy = site ? SITE_COPY[site.subdomain as keyof typeof SITE_COPY] : undefined;

  if (!site || !copy) {
    return { title: 'Blog | Mark Perera' };
  }

  return {
    title: `${copy.title} | Mark Perera`,
    description: copy.intro,
  };
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const { site: siteParam } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  const copy = site ? SITE_COPY[site.subdomain as keyof typeof SITE_COPY] : undefined;
  if (!site || !copy) notFound();

  const posts = await getSiteBlogPosts(site.subdomain);
  const classes = getThemeClasses(copy.theme);

  return (
    <main className={`relative isolate min-h-screen overflow-hidden ${classes.page}`}>
      <ProjectReadingArtwork site={site.subdomain as keyof typeof SITE_COPY} />
      <BlogNav site={site.subdomain} label={copy.label} classes={classes} />
      <section className={`relative z-[1] border-y ${classes.hero}`}>
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${classes.accentText}`}>Blog</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">{copy.title}</h1>
          </div>
          <div className="lg:pt-10">
            <p className={`max-w-2xl text-lg leading-8 ${classes.bodyText}`}>{copy.intro}</p>
          </div>
        </div>
      </section>

      <section className="relative z-[1] mx-auto grid w-full max-w-6xl gap-4 px-5 py-16 sm:px-8">
        {posts.length === 0 ? (
          <div className={`rounded-lg border p-6 ${classes.card}`}>
            <p className={classes.bodyText}>Posts are coming soon.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className={`grid gap-5 rounded-lg border p-6 transition md:grid-cols-[120px_1fr] ${classes.card}`}>
              <div>
                <p className={`font-serif text-5xl ${classes.accentText}`}>{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">{formatDate(post.date)}</p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{post.title}</h2>
                <p className={`mt-3 leading-7 ${classes.bodyText}`}>{post.description}</p>
              </div>
            </a>
          ))
        )}
      </section>
    </main>
  );
}

function BlogNav({ site, label, classes }: { site: string; label: string; classes: ReturnType<typeof getThemeClasses> }) {
  return (
    <nav className="relative z-[1] mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
        {label}
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <a href={portfolioOrigin} className={`rounded-md border px-3 py-2 opacity-75 transition hover:opacity-100 ${classes.navBorder}`}>
          Mark
        </a>
        <a href={`https://${site}.marknperera.ca`} className={`rounded-md border px-3 py-2 opacity-75 transition hover:opacity-100 ${classes.navBorder}`}>
          Home
        </a>
      </div>
    </nav>
  );
}

function getThemeClasses(theme: 'warm' | 'green' | 'dark') {
  if (theme === 'dark') {
    return {
      page: 'bg-[#03090b] text-white',
      hero: 'border-white/10 bg-black/20 backdrop-blur-[2px]',
      card: 'border-white/10 bg-white/[0.045] hover:border-[#86efac]/35',
      navBorder: 'border-white/20',
      accentText: 'text-[#86efac]',
      bodyText: 'text-white/70',
    };
  }

  if (theme === 'warm') {
    return {
      page: 'bg-[#070710] text-[#f8f3ff]',
      hero: 'border-white/10 bg-black/15 backdrop-blur-[2px]',
      card: 'border-white/10 bg-white/[0.045] hover:border-[#d6b9ff]/30',
      navBorder: 'border-white/20',
      accentText: 'text-[#e8b3dc]',
      bodyText: 'text-white/65',
    };
  }

  return {
    page: 'bg-[#040807] text-[#edf8f3]',
    hero: 'border-white/10 bg-black/20 backdrop-blur-[2px]',
    card: 'border-white/10 bg-white/[0.04] hover:border-[#f2bd73]/30',
    navBorder: 'border-white/20',
    accentText: 'text-[#f2bd73]',
    bodyText: 'text-white/64',
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
