"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@/components/FramerMotion';
import { copyToClipboard } from '@/lib/clipboard';

const contactDetails = [
  { label: 'Email', value: 'marknperera@hotmail.com' },
  { label: 'Discord', value: 'nipun' },
  { label: 'X / Twitter', value: '@nipun056' },
];

export default function HireMeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Body scroll lock while open
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleCopy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    // reset all to false, then set the current one to true for 2s
    setCopiedStates({}); // fast reset
    setCopiedStates((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [label]: false }));
    }, 2000);
  };

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Escape all stacking contexts by being rendered under <body> and very high z
          className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            key="sheet"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="w-11/12 max-w-md bg-gray-900 text-white p-8 rounded-2xl border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Contact Me"
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="font-serif text-3xl font-medium">Contact Me</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-400 mb-6">Get in touch via email or social media.</p>
            <div className="space-y-4">
              {contactDetails.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-300">{label}</p>
                    <p className="text-gray-400 truncate">{value}</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => handleCopy(label, value)}
                    className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20"
                    whileTap={{ scale: 0.96 }}
                  >
                    {copiedStates[label] ? (
                      <span className="inline-flex items-center gap-2">✔ <span>Copied</span></span>
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
  );

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg border border-white/20 hover:bg-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Contact Me
      </motion.button>

      {/* Portal ensures we escape any parent stacking contexts */}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
