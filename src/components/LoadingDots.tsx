import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingDots() {
  const dotVariants = {
    initial: {
      y: '0%',
    },
    animate: {
      y: '100%',
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-blue-400"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ ...dotTransition, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
