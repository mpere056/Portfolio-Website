'use client';

import { motion } from 'framer-motion';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';

interface TimelineEntryProps {
  entry: TimelineEntryType;
}

export default function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <motion.section
      className="h-screen w-full flex flex-col justify-center items-center snap-start"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-11/12 md:w-1/2 text-center">
        <p className="text-sm">{entry.from}</p>
        <h3 className="text-2xl md:text-4xl font-bold">{entry.headline}</h3>
        <p className="text-gray-400 mt-2">{entry.summary}</p>
        <div className="prose prose-invert mt-4 mx-auto">{entry.body}</div>
        {entry.media && (
          <div className="mt-4">
            {entry.media.type === 'image' && (
              <motion.img
                src={entry.media.src}
                alt={entry.headline}
                className="w-full h-auto rounded-lg"
                whileHover={{ scale: 1.05 }}
              />
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
