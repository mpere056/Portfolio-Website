'use client';

import { motion } from 'framer-motion';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useTimelineStore } from '@/lib/store';
import clsx from 'clsx';
import AddonRenderer from '@/components/about-addons/AddonRenderer';

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

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
  };
  
  const proseAlignmentClasses = {
    left: '',
    center: 'mx-auto',
  };

  const hasAddon = Boolean(entry.addon);
  const hasMedia = Boolean(entry.media);
  const useSideLayout = (hasAddon || hasMedia) && (entry.position !== 'center');

  return (
    <section ref={ref} className={clsx("min-h-screen w-full flex flex-col justify-center snap-center md:snap-start font-sans p-8 md:p-12", alignmentClasses[entry.position || 'left'])}>
      <div
        className={clsx(
          "flex gap-8 md:gap-12",
          useSideLayout ? 'flex-col md:flex-row md:items-start md:justify-between' : 'flex-col'
        )}
      >
        <motion.div
          className={clsx(
            "text-white",
            useSideLayout ? 'w-full max-w-5xl flex-1 min-w-0' : 'w-full max-w-5xl mx-auto'
          )}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.p variants={itemVariants} className="text-sm md:text-base text-gray-400 mb-4 tracking-widest uppercase">
            {entry.from}
          </motion.p>
          <motion.h3 variants={itemVariants} className="font-serif text-4xl md:text-7xl font-medium mb-6">
            {entry.headline}
          </motion.h3>
          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
            {entry.summary}
          </motion.p>
          <motion.div variants={itemVariants} className={clsx("prose prose-invert md:prose-lg text-gray-400", proseAlignmentClasses[entry.position || 'left'])}>
            {entry.body}
          </motion.div>
          {entry.media && !useSideLayout && (
            <motion.div variants={itemVariants} className="mt-8">
              {entry.media.type === 'image' && (
                <motion.img
                  src={entry.media.src}
                  alt={entry.headline}
                  className="w-full max-w-md h-auto rounded-lg shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                />
              )}
            </motion.div>
          )}
        </motion.div>

        {inView && (entry.addon || (entry.media && useSideLayout)) && (
          <div className={clsx(
            'w-full',
            useSideLayout
              ? 'md:self-start md:shrink-0 md:w-[400px] lg:w-[640px]'
              : 'max-w-[640px] mx-auto'
          )}>
            {entry.addon && <AddonRenderer addonKey={entry.addon} entry={entry} />}
            {entry.media && useSideLayout && (
              <motion.div variants={itemVariants} className="mt-8 md:mt-0">
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
          </div>
        )}
      </div>
    </section>
  );
}
