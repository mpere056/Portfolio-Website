'use client';

import { useTimelineStore } from '@/lib/store';
import { motion } from '@/components/FramerMotion';
import clsx from 'clsx';

interface TimelineIndicatorProps {
  entries: { from: string, id: string }[];
  onYearClick: (index: number) => void;
}

export default function TimelineIndicator({ entries, onYearClick }: TimelineIndicatorProps) {
  const activeSection = useTimelineStore((state) => state.activeSection);

  return (
    <div className="absolute top-0 left-0 h-full w-48 flex justify-center">
      <div className="relative h-full w-full">
        {/* Line */}
        <div className="absolute left-6 h-full w-px bg-gray-700" />

        {/* Ball */}
        <motion.div
          className="absolute left-6 -translate-x-1/2 z-10"
          animate={{
            top: `calc(${10 + (activeSection / (entries.length - 1)) * 80}% + 18px)`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="w-3 h-3 bg-white rounded-full" />
        </motion.div>

        {/* Years */}
        <div className="absolute left-6 w-full z-20" style={{ height: '100%' }}>
          {entries.map((entry, index) => (
            <button
              key={entry.id}
              onClick={() => onYearClick(index)}
              className="absolute border-0 bg-transparent text-left font-serif group py-2 pl-5 pr-8 hover:bg-gray-800/20 transition-colors z-30"
              style={{
                top: `calc(${10 + (index / (entries.length - 1)) * 80}% + 20px)`,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                className={clsx(
                  'text-lg whitespace-nowrap transition-all duration-300 ease-in-out',
                  activeSection === index
                    ? 'text-white font-bold opacity-100'
                    : 'text-gray-400 group-hover:text-white opacity-80 group-hover:opacity-100'
                )}
              >
                {entry.from} - {entry.id}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
