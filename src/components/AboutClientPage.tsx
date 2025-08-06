'use client';

import HireMeDrawer from '@/components/HireMeDrawer';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import TimelineEntry from '@/components/TimelineEntry';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Background from '@/components/Background';

const colors = [
  '#2E0219', '#220126', '#140028', '#010023', '#02192E', '#012622', '#002814', '#232301',
  '#2E1902', '#261101', '#280000', '#230114', '#19022E', '#110126', '#000028', '#012323'
];

interface AboutClientPageProps {
  entries: TimelineEntryType[];
}

export default function AboutClientPage({ entries }: AboutClientPageProps) {
  return (
    <div className="h-screen w-screen relative">
      <Suspense fallback={null}>
        <Canvas>
          <Background colors={colors} />
        </Canvas>
      </Suspense>
      <div className="absolute inset-0 h-screen overflow-y-scroll snap-y snap-mandatory">
        <h1 className="text-4xl font-bold mb-8 text-center pt-8 text-white">About Me</h1>
        <div className="relative container mx-auto p-8">
          <div className="border-l-2 border-gray-200 absolute h-full top-0 left-1/2 -translate-x-1/2"></div>
          {entries.map((entry: TimelineEntryType, index) => (
            <TimelineEntry key={entry.id} entry={entry} index={index} />
          ))}
        </div>
        <HireMeDrawer />
      </div>
    </div>
  );
}
