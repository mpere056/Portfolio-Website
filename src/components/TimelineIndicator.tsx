'use client';

import { useTimelineStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface TimelineIndicatorProps {
  entries: { from: string }[];
}

export default function TimelineIndicator({ entries }: TimelineIndicatorProps) {
  const activeSection = useTimelineStore((state) => state.activeSection);
  const activeYear = entries[activeSection]?.from || '';

  return (
    <div className="absolute top-0 left-0 h-full w-24 flex justify-center">
      <div className="relative h-full w-px bg-gray-700">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex items-center"
          style={{ top: '10%' }}
          animate={{
            top: `${10 + (activeSection / (entries.length - 1)) * 80}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="w-3 h-3 bg-white rounded-full" />
          <motion.div
            key={activeYear}
            className="absolute left-6 text-white font-serif text-xl whitespace-nowrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {activeYear}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
