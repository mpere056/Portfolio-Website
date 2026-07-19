import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProjectPreview from '@/components/ProjectPreview';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { getProjects, type Project } from '@/lib/projects';
import { getProjectSiteBySubdomain, PROJECT_SITES } from '@/lib/projectSites';
import worldStyles from './ProjectWorlds.module.css';

interface ProjectSitePageProps {
  params: Promise<{
    site: string;
  }>;
}

const portfolioOrigin = 'https://marknperera.ca';

export async function generateStaticParams() {
  return PROJECT_SITES.map((site) => ({ site: site.subdomain }));
}

export async function generateMetadata({ params }: ProjectSitePageProps) {
  const { site: siteParam } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === site?.projectSlug);

  if (!site || !project) {
    return {
      title: "Project Not Found | Mark's Portfolio",
    };
  }

  return {
    title: `${site.name} | Mark Perera`,
    description: project.headline || project.summary,
  };
}

export default async function ProjectSitePage({ params }: ProjectSitePageProps) {
  const { site: siteParam } = await params;
  const site = getProjectSiteBySubdomain(siteParam);
  if (!site) notFound();

  const projects = await getProjects();
  const project = projects.find((item) => item.slug === site.projectSlug);
  if (!project) notFound();

  if (site.subdomain === 'dreamlife') {
    return <DreamlifeSite project={project} />;
  }

  if (site.subdomain === 'lifeinbox') {
    return <LifeInboxSite project={project} />;
  }

  if (site.subdomain === 'sudokutogether') {
    return <SudokuTogetherSite project={project} />;
  }

  notFound();
}

function DreamlifeSite({ project }: { project: Project }) {
  const loop = [
    ['Vision', 'Generate three parallel futures: Current, Fallback, and Wild Card.'],
    ['Explore', 'Capture daily entries, tomorrow plans, day reviews, and prompt responses.'],
    ['Refine', 'Classify ideas and issues, then prototype changes with a conversational AI agent.'],
  ];

  const outcomes = [
    ['6-figure', 'Build offer created from the product prototype'],
    ['3 paths', 'Life scenarios designed to make tradeoffs visible'],
    ['4 tabs', 'Dashboard, Vision, Explore, and Refine mobile architecture'],
  ];

  return (
    <main className={`${worldStyles.world} ${worldStyles.dreamlife} min-h-screen bg-[#080710] text-[#f7f4ff]`}>
      <WorldArtwork world="dreamlife" src={ART_DIRECTION_ASSETS.dreamlife.src} />
      <section className="relative overflow-hidden border-b border-[#22170d]/10 bg-[#ffdca8]">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,126,79,0.35),transparent_24%),linear-gradient(rgba(34,23,13,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,23,13,0.08)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,44px_44px,44px_44px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fff3dc] to-transparent" />
        <SiteNav site="dreamlife" brand="Dreamlife" textColor="text-white" accentColor="border-white/20" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#8a4324]">
              AI life design mobile app
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
              Prototype the futures you keep daydreaming about.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c4230]">
              Dreamlife helps people explore possible lives through AI-generated story paths, daily reflection, highlight tagging, and conversational prototyping. This is the app that led to a six-figure build offer.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={`${portfolioOrigin}/?archive=open&prompt=Tell%20me%20about%20Dreamlife`} className="rounded-full bg-[#22170d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2716]">
                Ask Mark&apos;s AI
              </a>
              <a href="/blog" className="rounded-full border border-[#22170d]/20 px-5 py-3 text-sm font-semibold transition hover:border-[#22170d]/40">
                Read Build Notes
              </a>
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute inset-x-12 bottom-0 top-14 rounded-[44px] border border-white/10 bg-[#b9b4ff]/10 backdrop-blur-sm" />
            <div className="absolute inset-0 overflow-hidden rounded-[32px] border border-white/10 bg-[#080b15]/55 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-sm">
              <ProjectPreview
                modelName={project.heroModel}
                cameraPosition={project.cardCameraPosition || project.cameraPosition}
                modelOffset={project.cardModelOffset || project.modelOffset}
                className="absolute inset-0"
              />
            </div>
            <div className="absolute bottom-8 right-6 z-10 max-w-[260px] rounded-3xl border border-white/10 bg-black/45 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4324]">Prototype prompt</p>
              <p className="mt-2 text-sm leading-6 text-[#5c4230]">What would change this week if the Wild Card path became slightly more real?</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-3">
        {outcomes.map(([value, label]) => (
          <div key={value} className="rounded-[28px] border border-[#22170d]/10 bg-white/55 p-6">
            <p className="font-serif text-5xl text-[#8a4324]">{value}</p>
            <p className="mt-3 text-sm leading-6 text-[#5c4230]">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.72fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4324]">Product Loop</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            A design-thinking engine for life choices.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#5c4230]">
            Dreamlife is not just a journal. It gives raw reflection somewhere to go: into scenarios, tagged reactions, active ideas, and concrete experiments.
          </p>
        </div>
        <div className="grid gap-4">
          {loop.map(([title, body], index) => (
            <article key={title} className="grid gap-4 rounded-[28px] border border-[#22170d]/10 bg-white/60 p-5 sm:grid-cols-[76px_1fr]">
              <p className="font-serif text-4xl text-[#8a4324]">{String(index + 1).padStart(2, '0')}</p>
              <div>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5c4230]">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProjectFooter project={project} tone="warm" prompt="Tell me about Dreamlife" />
    </main>
  );
}

function LifeInboxSite({ project }: { project: Project }) {
  const pipeline = [
    ['Capture', 'Fast Android input for tasks, reminders, shopping items, journal notes, people, projects, and life areas.'],
    ['Sync', 'SQLite dirty-flag sync moves changes through a private Fastify/PostgreSQL server.'],
    ['Enrich', 'OpenRouter-backed analysis organizes raw entries while preserving privacy and reminder semantics.'],
    ['Resurface', 'Today, reminders, lists, and suggestion actions make entries usable again.'],
  ];

  const checks = [
    'App TypeScript and Jest suites passing in the source repo',
    'Server TypeScript and Jest suites passing in the source repo',
    'Android debug and release builds verified in the current workspace docs',
    'Live VPS health and sync paths documented for iterative personal testing',
  ];

  return (
    <main className={`${worldStyles.world} ${worldStyles.lifeinbox} min-h-screen bg-[#050909] text-[#edf8f3]`}>
      <WorldArtwork world="lifeinbox" src={ART_DIRECTION_ASSETS.lifeinbox.src} />
      <section className="relative overflow-hidden border-b border-[#0e1c18]/10 bg-[#dcebe4]">
        <div className="absolute inset-0 [background-image:linear-gradient(120deg,rgba(14,28,24,0.08),transparent_34%),linear-gradient(rgba(14,28,24,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(14,28,24,0.07)_1px,transparent_1px)] [background-size:100%_100%,32px_32px,32px_32px]" />
        <SiteNav site="lifeinbox" brand="LifeInbox" textColor="text-white" accentColor="border-white/20" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#356b5d]">
              Local-first Android organizer
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
              A trusted inbox for the messy stuff life throws at you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#40534d]">
              LifeInbox is a practical capture and organization system: local SQLite on Android, private sync, background AI enrichment, and reminder behavior tuned for actual daily use.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={project.repoUrl || `${portfolioOrigin}/projects/${project.slug}`} className="rounded-md bg-[#0e1c18] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3c33]">
                View Repository
              </a>
              <a href="/blog" className="rounded-md border border-[#0e1c18]/20 px-5 py-3 text-sm font-semibold transition hover:border-[#0e1c18]/40">
                Read Field Notes
              </a>
              <a href={`${portfolioOrigin}/projects/lifeinbox?stage=understand`} className="rounded-md border border-[#0e1c18]/20 px-5 py-3 text-sm font-semibold transition hover:border-[#0e1c18]/40">
                Return to Museum Exhibit
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-[#0e1c18]/10 bg-[#07110e] p-4 shadow-[0_32px_90px_rgba(14,28,24,0.28)]">
              <div className="rounded-2xl border border-white/10 bg-[#101d19] p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 text-white">
                  <span className="text-sm font-semibold">Inbox Sync</span>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-200">healthy</span>
                </div>
                <div className="grid gap-3 py-5">
                  {['Reminder captured', 'AI enrichment merged', 'Projects pulled', 'Due reminders polled'].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/78">
                      <span>{item}</span>
                      <span className="font-mono text-xs text-emerald-200">0{index + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <ProjectPreview
                    modelName={project.heroModel}
                    cameraPosition={project.cardCameraPosition || project.cameraPosition}
                    modelOffset={project.cardModelOffset || project.modelOffset}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.75fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#356b5d]">System Shape</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Built around data trust, not just capture speed.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#40534d]">
            The source repo shows a project that has moved past prototype theatre into the hard parts: sync semantics, AI quality, timestamp safety, privacy handling, and reminder recovery.
          </p>
        </div>
        <div className="grid gap-4">
          {pipeline.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[#0e1c18]/10 bg-white/65 p-5">
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#40534d]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0e1c18] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Verification Snapshot</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">The useful kind of boring.</h2>
          </div>
          <div className="grid gap-3">
            {checks.map((check) => (
              <div key={check} className="rounded-xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/72">
                {check}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectFooter project={project} tone="green" prompt="Tell me about LifeInbox" />
    </main>
  );
}

function SudokuTogetherSite({ project }: { project: Project }) {
  const cells = ['8', '', '', '4', '', '', '', '7', '', '', '2', '', '', '9', '', '', '', '5', '', '', '7', '', '', '3', '1', '', '', '4', '', '', '', '6', '', '', '', '', '', '9', '', '1', '', '5', '', '3', '', '', '', '', '', '2', '', '', '', '6', '', '', '1', '7', '', '', '9', '', '', '', '6', '', '', '', '4', '', '', '8', '', '3', '', '', '', '2', '', '', '1'];

  const architecture = [
    ['Discord SDK', 'OAuth and activity state live inside the Embedded App SDK context.'],
    ['Vercel API', 'The client talks to CSP-safe /.proxy/api routes instead of reaching the database directly.'],
    ['Supabase', 'Game sessions, progression, coins, streaks, and shared board state persist in Postgres.'],
    ['Polling Sync', 'Adaptive polling and version checks keep multiplayer play stable inside iframe limits.'],
  ];

  return (
    <main className={`${worldStyles.world} ${worldStyles.sudoku} min-h-screen bg-[#030a0d] text-white`}>
      <WorldArtwork world="sudoku" src={ART_DIRECTION_ASSETS.sudoku.src} />
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0d1720]">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(8,16,24,0.97),rgba(23,47,57,0.78)_45%,rgba(8,16,24,0.98))]" />
        <SiteNav site="sudokutogether" brand="Sudoku Together" textColor="text-white" accentColor="border-white/20" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(380px,0.9fr)]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#86efac]">
              Discord Activity + shared puzzle room
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              The Sudoku board finally belongs to everyone in the call.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Sudoku Together is a React and Vite Discord Activity with solo and co-op play, daily puzzles, streaks, XP, coins, cosmetics, Supabase persistence, and multiplayer synchronization through a Vercel proxy.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={project.repoUrl || `${portfolioOrigin}/projects/${project.slug}`} className="rounded-md bg-[#86efac] px-5 py-3 text-sm font-semibold text-[#081018] transition hover:bg-[#bbf7d0]">
                View Code
              </a>
              <a href="/blog" className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
                Read Dev Log
              </a>
            </div>
          </div>

          <div className="relative">
            <div className={`${worldStyles.sudokuPanel} rounded-lg border p-3`}>
              <div className={`${worldStyles.sudokuGrid} grid aspect-square grid-cols-9 overflow-hidden rounded-md border-2`}>
                {cells.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className={`${worldStyles.sudokuCell} grid place-items-center text-lg font-semibold ${(index + 1) % 3 === 0 && (index + 1) % 9 !== 0 ? 'border-r-2' : 'border-r'} ${
                      (index >= 18 && index < 27) || (index >= 45 && index < 54) ? 'border-b-2' : 'border-b'
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {['Discord', 'Vercel', 'Supabase'].map((label, index) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">Layer {index + 1}</p>
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
            Discord iframes make persistence a little spicy.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/70">
            The Activity runs inside Discord constraints, so multiplayer state is routed through CSP-safe proxy endpoints. Serverless handlers own Supabase access, while the client focuses on board state, presence, progression, and game feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="rounded-md border border-[#86efac]/20 bg-[#86efac]/10 px-3 py-2 text-xs font-semibold text-[#bbf7d0]">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1720] px-5 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86efac]">Session Architecture</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
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

      <ProjectFooter project={project} tone="dark" prompt="Tell me about Sudoku Together" />
    </main>
  );
}

function ProjectFooter({ project, tone, prompt }: { project: Project; tone: 'warm' | 'green' | 'dark'; prompt: string }) {
  const isDark = tone === 'dark';
  const isWarm = tone === 'warm';
  const shell = isDark ? 'border-white/10 bg-[#081018] text-white' : isWarm ? 'border-[#22170d]/10 bg-[#22170d] text-white' : 'border-[#0e1c18]/10 bg-[#eef3ef] text-[#0e1c18]';
  const muted = isDark ? 'text-white/70' : isWarm ? 'text-white/72' : 'text-[#40534d]';
  const pill = isDark ? 'border-white/10 bg-white/10 text-white/80' : isWarm ? 'border-white/10 bg-white/10 text-white/80' : 'border-[#0e1c18]/10 bg-white/70 text-[#40534d]';
  const button = isDark ? 'bg-white text-[#081018] hover:bg-[#bbf7d0]' : isWarm ? 'bg-white text-[#22170d] hover:bg-[#fff3dc]' : 'bg-[#0e1c18] text-white hover:bg-[#1d3c33]';

  return (
    <section className={`border-t px-5 py-16 sm:px-8 ${shell}`}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-60">Build Notes</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{project.headline}</h2>
        </div>
        <div className="space-y-6">
          <p className={`text-lg leading-8 ${muted}`}>{project.summary}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className={`rounded-md border px-3 py-2 text-xs font-semibold ${pill}`}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`${portfolioOrigin}/projects/${project.slug}`} className={`rounded-md px-5 py-3 text-sm font-semibold transition ${button}`}>
              Portfolio Details
            </a>
            <a href={`${portfolioOrigin}/?archive=open&prompt=${encodeURIComponent(prompt)}`} className={`rounded-md border px-5 py-3 text-sm font-semibold transition ${pill}`}>
              Ask Mark&apos;s AI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorldArtwork({ world, src }: { world: 'dreamlife' | 'lifeinbox' | 'sudoku'; src: string }) {
  return (
    <div className={worldStyles.worldArtwork} data-world={world} aria-hidden="true">
      <Image src={src} alt="" fill priority sizes="100vw" />
      <span />
    </div>
  );
}

function SiteNav({ site, brand, textColor, accentColor }: { site: string; brand: string; textColor: string; accentColor: string }) {
  return (
    <nav className={`relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 ${textColor}`}>
      <Link href="/" className="text-sm font-semibold opacity-80 transition hover:opacity-100">
        {brand}
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <a href={`https://${site}.marknperera.ca/blog`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Blog
        </a>
        <a href={`${portfolioOrigin}/projects`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Projects
        </a>
        <a href={`${portfolioOrigin}/?archive=open`} className={`rounded-md border ${accentColor} px-3 py-2 opacity-75 transition hover:opacity-100`}>
          Ask AI
        </a>
      </div>
    </nav>
  );
}
