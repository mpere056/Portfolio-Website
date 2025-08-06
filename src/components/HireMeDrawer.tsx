'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard } from '@/lib/clipboard';

const contactDetails = [
  { label: 'Email', value: 'marknperera@hotmail.com' },
  { label: 'Discord', value: 'mark#1234' },
  { label: 'X / Twitter', value: '@marknperera' },
];

export default function HireMeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState('');

  const handleCopy = async (label: string, value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(''), 2000); // Reset after 2 seconds
    }
  };

  return (
    <>
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg"
        >
          Hire Me
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-end"
          >
            <div className="w-full bg-white text-gray-800 p-8 rounded-t-2xl">
              <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
              <div className="space-y-4">
                {contactDetails.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{label}</p>
                      <p>{value}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(label, value)}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      {copiedLabel === label ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 w-full py-3 bg-red-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
