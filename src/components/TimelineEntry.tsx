'use client';

import { motion } from 'framer-motion';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useTimelineStore } from '@/lib/store';

interface TimelineEntryProps {
  entry: TimelineEntryType;
  index: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function TimelineEntry({ entry, index }: TimelineEntryProps) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const setActiveSection = useTimelineStore((state) => state.setActiveSection);

  useEffect(() => {
    if (inView) {
      setActiveSection(index);
    }
  }, [inView, index, setActiveSection]);

  return (
    <section ref={ref} className="h-screen w-full flex flex-col justify-center items-center snap-start font-sans">
      <motion.div
        className="w-11/12 md:w-3/5 lg:w-2/5 text-center text-white"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.p variants={itemVariants} className="text-base text-gray-400 mb-4 tracking-widest uppercase">
          {entry.from}
        </motion.p>
        <motion.h3 variants={itemVariants} className="font-serif text-5xl md:text-7xl font-medium mb-6">
          {entry.headline}
        </motion.h3>
        <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 leading-relaxed">
          {entry.summary}
        </motion.p>
        <motion.div variants={itemVariants} className="prose prose-invert prose-lg mx-auto text-gray-400">
          {entry.body}
        </motion.div>
        {entry.media && (
          <motion.div variants={itemVariants} className="mt-8">
            {entry.media.type === 'image' && (
              <motion.img
                src={entry.media.src}
                alt={entry.headline}
                className="w-full h-auto rounded-lg shadow-2xl"
                whileHover={{ scale: 1.02 }}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
