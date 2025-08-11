'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard } from '@/lib/clipboard';

const contactDetails = [
  { label: 'Email', value: 'marknperera@hotmail.com' },
  { label: 'Discord', value: 'nipun' },
  { label: 'X / Twitter', value: '@nipun056' },
];

export default function HireMeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (label: string, value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedStates((prev) => ({ ...Object.fromEntries(Object.keys(prev).map(k => [k, false])), [label]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [label]: false }));
      }, 2000);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg border border-white/20"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        Contact Me
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-end"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="w-full bg-gray-900 text-white p-8 rounded-t-3xl border-t border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-serif text-3xl font-medium mb-2">Contact Me</h2>
              <p className="text-gray-400 mb-8">Get in touch via email or social media.</p>
              <div className="space-y-4">
                {contactDetails.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-300">{label}</p>
                      <p className="text-gray-400">{value}</p>
                    </div>
                    <motion.button
                      onClick={() => handleCopy(label, value)}
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedStates[label] ? (
                        <div className="flex items-center space-x-2">
                          <span>✔</span>
                          <span>Copied</span>
                        </div>
                      ) : (
                        'Copy'
                      )}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
