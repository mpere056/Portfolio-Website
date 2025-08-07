'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { ComponentType } from 'react';
import type { TimelineEntry } from '@/lib/timeline';
import { addonImportMap } from './registry';
import type { AddonCommonProps } from './types';

interface AddonRendererProps {
  addonKey?: string;
  entry: TimelineEntry;
}

// The map is defined in `registry.ts` so registering addons doesn't edit this file.

function FallbackAddon() { return null; }

export default function AddonRenderer({ addonKey, entry }: AddonRendererProps) {
  const LazyAddon = useMemo(() => {
    if (!addonKey) return null;
    const loader = addonImportMap[addonKey];
    if (!loader) return null;
    return dynamic(loader, { ssr: false, loading: FallbackAddon });
  }, [addonKey]);

  if (!LazyAddon) return null;

  return <LazyAddon entry={entry} />;
}


