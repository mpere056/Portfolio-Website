import { notFound } from 'next/navigation';
import ProjectPreview from '@/components/ProjectPreview';
import { getProjects, type Project } from '@/lib/projects';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';

interface ProjectSitePageProps {
  params: {
    site: string;
  };
}

const portfolioOrigin = 'https://marknperera.ca';

export async function generateStaticParams() {
  return PROJECT_SITES.map((site) => ({ site: site.subdomain }));
}

export async function generateMetadata({ params }: ProjectSitePageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === site?.projectSlug);

  if (!site || !project) {
    return {
      title: "Project Not Found | Mark's Portfolio",
    };
  }

  const title = site.subdomain === 'lifeinbox' ? 'Life Inbox' : 'Sudoku Together';

  return {
    title: `${title} | Mark Perera`,
    description: project.headline || project.summary,
  };
}

export default async function ProjectSitePage({ params }: ProjectSitePageProps) {
  const site = getProjectSiteBySubdomain(params.site);
  if (!site) notFound();

  const projects = await getProjects();
  const project = projects.find((item) => item.slug === site.projectSlug);
  if (!project) notFound();

  if (site.subdomain === 'lifeinbox') {
    return <LifeInboxSite project={project} />;
  }

  if (site.subdomain === 'sudokutogether') {
    return <SudokuTogetherSite project={project} />;
  }

  notFound();
}

function LifeInboxSite({ project }: { project: Project }) {
  const loop = [
    ['01', 'Capture', 'Drop a raw thought, ambition, worry, or plan into a space built for low-friction input.'],
    ['02', 'Clarify', 'AI extracts the useful signal, asks better questions, and turns loose reflection into structure.'],
    ['03', 'Commit', 'The output becomes a smaller next step, a calendar item, or a sharper vision to revisit later.'],
  ];

  const moments = [
    ['Morning Review', 'A short prompt turns yesterday, today, and long-range goals into one grounded direction.'],
    ['Vision Pass', 'Big-picture writing becomes themes, tensions, and experiments instead of a forgotten note.'],
    ['Decision Trace', 'The app keeps the reasoning visible so future plans can be adjusted instead of restarted.'],
  ];

  const metrics = [
    ['4-tab', 'Vision, Explore, Refine, and daily action loop'],
    ['$100k', 'Build offer generated from the prototype'],
    ['AI-first', 'Extraction and helper pipeline built into the product'],
  ];

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#17211c]">
      <section className="relative overflow-hidden border-b border-[#17211c]/10 bg-[#e6eadf]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(23,33,28,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(23,33,28,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f4f0e7] to-transparent" />
        <SiteNav site="lifeinbox" brand="Life Inbox" textColor="text-[#17211c]" accentColor="border-[#17211c]/20" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(420px,1.12fr)]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#47685a]">
              AI life design workspace
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-[#17211c] sm:text-6xl lg:text-7xl">
              A calmer inbox for the life you are building.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#32433a]">
              Life Inbox turns reflection, visioning, and AI-assisted planning into a practical loop: capture what matters, clarify the signal, and leave with a next step.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`${portfolioOrigin}/chat?prompt=Tell%20me%20about%20Life%20Inbox`}
                className="rounded-md bg-[#17211c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#294236]"
              >
                Ask Mark&apos;s AI
              </a>
              <a
                href="/blog"
                className="rounded-md border border-[#17211c]/20 px-5 py-3 text-sm font-semibold text-[#17211c] transition hover:border-[#17211c]/40"
              >
                Read Build Notes
              </a>
            </div>
          </div>

          <div className="relative min-h-[500px]">
            <div className="absolute inset-x-8 bottom-2 top-12 rounded-[40px] bg-[#d5dfd2]" />
            <div className="absolute inset-0 overflow-hidden rounded-lg border border-[#17211c]/10 bg-[#f8f5ef]/80 shadow-[0_30px_90px_rgba(23,33,28,0.18)]">
              <div className="absolute left-5 top-5 z-10 rounded-md bg-[#17211c] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f0e7]">
                Prototype
              </div>
              <ProjectPreview
                modelName={project.heroModel}
                cameraPosition={project.cardCameraPosition || project.cameraPosition}
                modelOffset={project.cardModelOffset || project.modelOffset}
                className="absolute inset-0"
              />
            </div>
            <div className="absolute bottom-6 right-6 z-10 max-w-[240px] rounded-lg border border-[#17211c]/10 bg-[#fffaf2]/90 p-4 shadow-[0_18px_40px_rgba(23,33,28,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a7d73]">Today&apos;s Signal</p>
              <p className="mt-2 text-sm leading-6 text-[#32433a]">Turn the vague goal into a 20-minute experiment before lunch.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-3">
        {metrics.map(([value, label]) => (
          <div key={value} className="border-t border-[#17211c]/20 pt-5">
            <p className="font-serif text-5xl text-[#17211c]">{value}</p>
            <p className="mt-2 text-sm leading-6 text-[#52665d]">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a7d73]">Product Loop</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#17211c] sm:text-5xl">
            It behaves more like a thinking partner than a task list.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#52665d]">
            The app is structured around repeated passes through the same question: what deserves attention now?
          </p>
        </div>
        <div className="grid gap-4">
          {loop.map(([step, title, body]) => (
            <article key={step} className="grid gap-4 rounded-lg border border-[#17211c]/10 bg-white/60 p-5 sm:grid-cols-[76px_1fr]">
              <p className="font-serif text-4xl text-[#47685a]">{step}</p>
              <div>
                <h3 className="font-serif text-2xl text-[#17211c]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#52665d]">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf2] px-5 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a7d73]">Use Cases</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {moments.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-[#17211c]/10 bg-[#f4f0e7] p-6">
                <h3 className="font-serif text-3xl text-[#17211c]">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#52665d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#17211c]/10 bg-[#17211c] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b9d6c6]">Build Notes</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{project.headline}</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-8 text-white/70">{project.summary}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white/80">
                  {tech}
                </span>
              ))}
            </div>
            <a href={`${portfolioOrigin}/projects#${project.slug}`} className="inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#17211c] transition hover:bg-[#e6eadf]">
              Portfolio Details
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SudokuTogetherSite({ project }: { project: Project }) {
  const cells = ['8', '', '', '4', '', '', '', '7', '', '', '2', '', '', '9', '', '', '', '5', '', '', '7', '', '', '3', '1', '', '', '4', '', '', '', '6', '', '', '', '', '', '9', '', '1', '', '5', '', '3', '', '', '', '', '', '2', '', '', '', '6', '', '', '1', '7', '', '', '9', '', '', '', '6', '', '', '', '4', '', '', '8', '', '3', '', '', '', '2', '', '', '1'];

  const architecture = [
    ['Discord Activity', 'Players open the puzzle directly inside a voice-channel activity.'],
    ['Vercel Proxy', 'Every state read and write moves through a serverless layer that fits iframe constraints.'],
    ['Supabase State', 'Shared sessions keep the same board synchronized across players.'],
  ];

  const features = [
    'Shared puzzle state for multiple Discord users',
    'Vercel proxy layer for secure persistence',
    'Supabase-backed game sessions',
    'React interface built for Discord Activities',
  ];

  return (
    <main className="min-h-screen bg-[#081018] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0d1720]">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(8,16,24,0.97),rgba(23,47,57,0.78)_45%,rgba(8,16,24,0.98))]" />
        <SiteNav site="sudokutogether" brand="Sudoku Together" textColor="text-white" accentColor="border-white/20" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(380px,0.9fr)]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#86efac]">
              Multiplayer Discord Activity
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Solve the same Sudoku board with friends in Discord.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Sudoku Together turns the Discord Activity iframe into a real shared puzzle room with synchronized board state, secure persistence, and a UI that feels native to a call with friends.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={project.repoUrl || `${portfolioOrigin}/projects#${project.slug}`}
                className="rounded-md bg-[#86efac] px-5 py-3 text-sm font-semibold text-[#081018] transition hover:bg-[#bbf7d0]"
              >
                View Code
              </a>
              <a
                href="/blog"
                className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Read Build Notes
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-white/10 bg-[#f8fafc] p-3 shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
              <div className="grid aspect-square grid-cols-9 overflow-hidden rounded-md border-2 border-[#101820] bg-white">
                {cells.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className={`grid place-items-center border-[#101820]/25 text-lg font-semibold text-[#101820] ${
                      value ? 'bg-[#eef6ff]' : 'bg-white'
                    } ${(index + 1) % 3 === 0 && (index + 1) % 9 !== 0 ? 'border-r-2' : 'border-r'} ${
                      index >= 18 && index < 27 || index >= 45 && index < 54 ? 'border-b-2' : 'border-b'
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {['Mark', 'Friend', 'Proxy'].map((label, index) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">Node {index + 1}</p>
                  <p className="mt-1 font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1fr]">
        <div className="min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
          <ProjectPreview
            modelName={project.heroModel}
            cameraPosition={project.cardCameraPosition || project.cameraPosition}
            modelOffset={project.cardModelOffset || project.modelOffset}
            className="h-full min-h-[420px]"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86efac]">Technical Problem</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl">
            Discord iframes block the easy path.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/70">
            {project.moreInfo[3] || project.summary}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm leading-6 text-white/70">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1720] px-5 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86efac]">Session Architecture</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {architecture.map(([title, body], index) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
                <p className="font-serif text-5xl text-[#86efac]">{index + 1}</p>
                <h3 className="mt-5 font-serif text-3xl text-white">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/70">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Stack</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded-md border border-[#86efac]/20 bg-[#86efac]/10 px-3 py-2 text-xs font-semibold text-[#bbf7d0]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <a
            href={`${portfolioOrigin}/chat?prompt=Tell%20me%20about%20Sudoku%20Together`}
            className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#86efac]/50 hover:text-[#bbf7d0]"
          >
            Ask Mark&apos;s AI about it
          </a>
        </div>
      </section>
    </main>
  );
}

function SiteNav({ site, brand, textColor, accentColor }: { site: string; brand: string; textColor: string; accentColor: string }) {
  return (
    <nav className={`relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 ${textColor}`}>
      <a href="/" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
        {brand}
      </a>
      <div className="flex items-center gap-3 text-sm">
        <a href={`https://${site}.marknperera.ca/blog`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Blog
        </a>
        <a href={`${portfolioOrigin}/projects`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Projects
        </a>
        <a href={`${portfolioOrigin}/chat`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Ask AI
        </a>
      </div>
    </nav>
  );
}
