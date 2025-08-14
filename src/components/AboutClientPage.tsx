'use client';

import HireMeDrawer from '@/components/HireMeDrawer';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import TimelineEntry from '@/components/TimelineEntry';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import Background from '@/components/Background';
import TimelineIndicator from './TimelineIndicator';
import SmoothSnapScroll from './SmoothSnapScroll';

interface AboutClientPageProps {
  entries: TimelineEntryType[];
}

export default function AboutClientPage({ entries }: AboutClientPageProps) {
  const colors = useMemo(() => entries.map(entry => entry.color as string | undefined), [entries]);
  const textures = useMemo(() => entries.map(entry => entry.texture as string | undefined), [entries]);
  const opacities = useMemo(() => entries.map(entry => entry.textureOpacity as number | undefined), [entries]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="h-screen w-screen relative">
      <Suspense fallback={null}>
        <Canvas>
          <Background colors={colors} textures={textures} opacities={opacities} />
        </Canvas>
      </Suspense>

      <div className="hidden md:block">
        <TimelineIndicator entries={entries} />
      </div>
      
      <div ref={scrollRef} className="absolute inset-0 md:left-[6rem] md:w-[calc(100%-6rem)] h-screen overflow-y-scroll snap-y snap-proximity md:snap-mandatory">
        {entries.map((entry: TimelineEntryType, index) => (
          <TimelineEntry key={entry.id} entry={entry} index={index} />
        ))}
      </div>
      <SmoothSnapScroll containerRef={scrollRef as any} durationMs={1500} desktopMinWidth={1024} />
      
      <div className="absolute bottom-8 left-1/2 z-20">
        <HireMeDrawer />
      </div>
    </div>
  );
}
