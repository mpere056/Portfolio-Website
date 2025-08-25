import Link from 'next/link';

interface TemplateLink {
  id: string;
  name: string;
  emoji: string;
  description: string;
  href: string;
}

const TEMPLATE_LINKS: TemplateLink[] = [
  {
    id: 'agency-1',
    name: 'Agency & Portfolio',
    emoji: '💼',
    description: 'A slick portfolio & agency template with case studies, process, and contact capture.',
    href: '/templates/agency-1',
  },
  {
    id: 'gym-1',
    name: 'Fitness & Gym',
        emoji: '💪',
    description: 'A modern gym and fitness studio website template, designed to inspire and attract new members.',
    href: '/templates/gym-1',
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant & Café',
    emoji: '🍽️',
    description: 'A modern restaurant website template, designed to showcase your menu and encourage reservations.',
    href: '/templates/restaurant-1',
  },
  {
    id: 'saas-1',
    name: 'SaaS Startup',
    emoji: '🚀',
    description: 'A modern, animated SaaS landing page, designed for software and tech companies.',
    href: '/templates/saas-1',
  },
  {
    id: 'trades-1',
    name: 'Trades & Home Services',
    emoji: '🛠️',
    description: 'A robust and reliable website template for skilled trades and home services businesses.',
    href: '/templates/trades-1',
  },
];

export const metadata = {
  title: "Website Templates | Mark's Portfolio",
  description: 'Preview small-business website templates available for customization.'
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Website Templates</h1>
          <span className="block w-14 h-[3px] mx-auto bg-gradient-to-r from-sky-400 to-fuchsia-400 mt-3" />
          <p className="text-white/95 max-w-3xl mx-auto leading-relaxed mt-3">
            Need a clean, fast website? I design and build modern, responsive sites for businesses and creators.
          </p>
          <p className="text-white/90 mt-1">
            Here are some examples of styles and layouts I can customize to your brand and goals.
          </p>
          <p className="text-white/60 mt-3">Select a template to preview.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_LINKS.map((template) => (
            <TemplateItem key={template.id} {...template} />
          ))}
        </div>
      </main>
    </div>
  );
}

function TemplateItem({ name, emoji, description, href }: TemplateLink) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center p-6 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors duration-200"
    >
      <span className="text-5xl mb-4">{emoji}</span>
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-white/70 text-sm">{description}</p>
    </Link>
  );
}


