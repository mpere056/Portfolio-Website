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
    key: 'saas', name: 'SaaS Startup', emoji: '🚀', accent: 'violet',
    variants: [
      { key: 'landing', name: 'Landing' },
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
    key: 'trades', name: 'Trades & Home Services', emoji: '🛠️', accent: 'sky',
    variants: [
      { key: 'landing', name: 'Landing' },
      { key: 'services', name: 'Services (example)' },
      { key: 'booking', name: 'Booking' },
      { key: 'about', name: 'About' },
      { key: 'locations', name: 'Locations (Postal Lookup)' },
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
  const paramVariant = (searchParams?.get('v') as TemplateVariantKey | null) ?? null;
  const defaultVariant = activeTemplate.variants[0].key;
  const [variant, setVariant] = useState<TemplateVariantKey>(paramVariant && activeTemplate.variants.some(v => v.key === paramVariant) ? paramVariant : defaultVariant);

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

        {/* Secondary selector: variants for the current template */}
        <nav className="flex gap-2 overflow-x-auto py-1 pr-2 -ml-1">
          {activeTemplate.variants.map(v => {
            const isActive = v.key === variant;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setVariant(v.key)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 md:px-3.5 md:py-2
                           whitespace-nowrap backdrop-blur-sm shadow-sm transition-all duration-200
                           ${isActive ? 'bg-white/12 border-white/20' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/15'}`}
                aria-pressed={isActive}
              >
                <span className="text-xs md:text-sm font-medium">{v.name}</span>
              </button>
            );
          })}
        </nav>

        {getTemplateComponent(active, variant)}
      </main>
    </div>
  );
}


