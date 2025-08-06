'use client';

import HireMeDrawer from '@/components/HireMeDrawer';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import TimelineEntry from '@/components/TimelineEntry';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import Background from '@/components/Background';
import TimelineIndicator from './TimelineIndicator';

interface AboutClientPageProps {
  entries: TimelineEntryType[];
}

export default function AboutClientPage({ entries }: AboutClientPageProps) {
  const colors = useMemo(() => entries.map(entry => entry.color!), [entries]);

  return (
    <div className="h-screen w-screen relative">
      <Suspense fallback={null}>
        <Canvas>
          <Background colors={colors} />
        </Canvas>
      </Suspense>

      <TimelineIndicator entries={entries} />

      <div className="absolute top-0 right-0 h-screen w-[calc(100%-6rem)] overflow-y-scroll snap-y snap-mandatory">
        {entries.map((entry: TimelineEntryType, index) => (
          <TimelineEntry key={entry.id} entry={entry} index={index} />
        ))}
      </div>
      
      <div className="absolute bottom-8 right-8 z-20">
        <HireMeDrawer />
      </div>
    </div>
  );
}
