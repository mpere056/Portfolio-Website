'use client';

import { useMemo, useState, useTransition, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NavHomeIcon from './NavHomeIcon';
import TemplateSaaS from './templates/TemplateSaaS';
import TemplateRestaurant from './templates/TemplateRestaurant';
import TemplateGym from './templates/TemplateGym';
import TemplateTrades from './templates/TemplateTrades';

export interface TemplateDefinition {
  key: TemplateKey;
  name: string;
  emoji: string;
  accent: string; // tailwind color class name fragment like 'violet'
  variants: { key: TemplateVariantKey; name: string }[];
}

export type TemplateKey = 'saas' | 'restaurant' | 'gym' | 'trades';
export type VariantByTemplate = {
  saas: 'landing';
  restaurant: 'home' | 'menu' | 'reservations' | 'ordering' | 'gallery';
  gym: 'home' | 'pricing' | 'schedule' | 'trainers' | 'stories';
  trades: 'landing' | 'services' | 'booking' | 'about' | 'locations';
}
export type TemplateVariantKey = VariantByTemplate[keyof VariantByTemplate];

const ALL_TEMPLATES: TemplateDefinition[] = [
  {
    key: 'trades', name: 'Trades & Home Services', emoji: '🛠️', accent: 'sky',
    variants: [
      { key: 'landing', name: 'Landing' },
      { key: 'services', name: 'Services (example)' },
      { key: 'booking', name: 'Booking' },
      { key: 'about', name: 'About' },
      { key: 'locations', name: 'Locations (Postal Lookup)' },
    ],
  },
  {
    key: 'restaurant', name: 'Restaurant & Café', emoji: '🍽️', accent: 'rose',
    variants: [
      { key: 'home', name: 'Home' },
      { key: 'menu', name: 'Menu' },
      { key: 'reservations', name: 'Reservations' },
      { key: 'ordering', name: 'Online Ordering' },
      { key: 'gallery', name: 'Galleries' },
    ],
  },
  {
    key: 'gym', name: 'Fitness & Gym', emoji: '💪', accent: 'emerald',
    variants: [
      { key: 'home', name: 'Home' },
      { key: 'pricing', name: 'Memberships / Pricing' },
      { key: 'schedule', name: 'Schedule + Booking' },
      { key: 'trainers', name: 'Trainers / Coaches' },
      { key: 'stories', name: 'Success Stories' },
    ],
  },
  {
    key: 'saas', name: 'SaaS Startup', emoji: '🚀', accent: 'violet',
    variants: [
      { key: 'landing', name: 'Landing' },
    ],
  },
];

function getTemplateComponent(key: TemplateKey, variant: TemplateVariantKey) {
  switch (key) {
    case 'saas': return <TemplateSaaS variant={variant as VariantByTemplate['saas']} />;
    case 'restaurant': return <TemplateRestaurant variant={variant as VariantByTemplate['restaurant']} />;
    case 'gym': return <TemplateGym variant={variant as VariantByTemplate['gym']} />;
    case 'trades': return <TemplateTrades variant={variant as VariantByTemplate['trades']} />;
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

  const activeTemplate = useMemo(() => ALL_TEMPLATES.find(t => t.key === active)!, [active]);
  const defaultVariant = activeTemplate.variants[0].key;
  const [variant, setVariant] = useState<TemplateVariantKey>(defaultVariant);

  // Keep URL in sync for template
  useEffect(() => {
    if (paramKey !== active) {
      const sp = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);
      sp.set('t', active);
      // reset variant when template changes if incompatible
      const nextTemplate = ALL_TEMPLATES.find(t => t.key === active)!;
      const nextDefault = nextTemplate.variants[0].key;
      if (!sp.get('v') || !nextTemplate.variants.some(v => v.key === (sp.get('v') as TemplateVariantKey))) {
        sp.set('v', nextDefault);
        setVariant(nextDefault);
      }
      startTransition(() => router.replace(`${pathname}?${sp.toString()}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Keep URL in sync for variant
  useEffect(() => {
    const sp = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);
    if (variant !== sp.get('v')) {
      sp.set('t', active);
      sp.set('v', variant);
      startTransition(() => router.replace(`${pathname}?${sp.toString()}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      <NavHomeIcon />

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

        <nav className="flex flex-wrap justify-center gap-2 overflow-x-auto py-2 pr-2 -ml-1">
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

        {/* Variant selector removed for now; default view shows the primary home/landing for each template. */}

        {getTemplateComponent(active, variant)}
      </main>
    </div>
  );
}


