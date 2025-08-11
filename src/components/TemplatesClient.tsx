'use client';

import { useMemo, useState, useTransition, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NavHomeIcon from './NavHomeIcon';
import TemplateSaaS from './templates/TemplateSaaS';
import TemplateRestaurant from './templates/TemplateRestaurant';
import TemplateGym from './templates/TemplateGym';
import TemplateAgency from './templates/TemplateAgency';

export interface TemplateDefinition {
  key: TemplateKey;
  name: string;
  emoji: string;
  accent: string; // tailwind color class name fragment like 'violet'
}

export type TemplateKey = 'saas' | 'restaurant' | 'gym' | 'agency';

const ALL_TEMPLATES: TemplateDefinition[] = [
  { key: 'saas', name: 'SaaS Startup', emoji: '🚀', accent: 'violet' },
  { key: 'restaurant', name: 'Restaurant & Café', emoji: '🍽️', accent: 'rose' },
  { key: 'gym', name: 'Fitness & Gym', emoji: '💪', accent: 'emerald' },
  { key: 'agency', name: 'Creative Agency', emoji: '🎨', accent: 'sky' },
];

function getTemplateComponent(key: TemplateKey) {
  switch (key) {
    case 'saas': return <TemplateSaaS />;
    case 'restaurant': return <TemplateRestaurant />;
    case 'gym': return <TemplateGym />;
    case 'agency': return <TemplateAgency />;
    default: return null;
  }
}

export default function TemplatesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const paramKey = (searchParams?.get('t') as TemplateKey | null) ?? null;
  const initialKey: TemplateKey = useMemo(() => paramKey && ALL_TEMPLATES.some(t => t.key === paramKey) ? paramKey : 'saas', [paramKey]);
  const [active, setActive] = useState<TemplateKey>(initialKey);

  // keep URL in sync
  useEffect(() => {
    if (paramKey !== active) {
      const sp = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);
      sp.set('t', active);
      startTransition(() => router.replace(`${pathname}?${sp.toString()}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      <NavHomeIcon />

      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Website Templates</h1>
          <p className="text-white/70 max-w-2xl">Preview polished, mobile-first landing pages tailored for small to medium businesses. Pick a template below to preview.</p>
        </header>

        <nav className="flex gap-2 overflow-x-auto py-2 pr-2 -ml-1">
          {ALL_TEMPLATES.map(t => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 md:px-4 md:py-2.5
                           whitespace-nowrap backdrop-blur-sm shadow-sm transition-all duration-200
                           ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/15'}`}
                aria-pressed={isActive}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="text-sm md:text-base font-medium">{t.name}</span>
              </button>
            );
          })}
        </nav>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] projects-bg overflow-hidden">
          {getTemplateComponent(active)}
        </section>
      </main>
    </div>
  );
}


