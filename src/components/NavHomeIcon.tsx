"use client";
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface LinkItem { href: string; label: string }

export default function NavHomeIcon() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const links: LinkItem[] = useMemo(() => ([
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Me' },
    { href: '/projects', label: 'Projects' },
    { href: '/templates', label: 'Website Templates' },
    { href: '/chat', label: 'Ask Me Anything [AI]' },
  ]), []);

  // Prefetch likely destinations for snappier navigation
  useEffect(() => {
    try { links.forEach(l => (router as any).prefetch?.(l.href)); } catch {}
  }, [links, router]);

  // Close on route change, outside click, or Esc
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-5 left-5 z-50 flex flex-col items-start">
      <motion.button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="rounded-md shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        whileTap={{ scale: 0.95 }}
        animate={open ? { rotate: 6 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      >
        <Image
          src="/images/me_logo.png"
          alt="Navigation"
          width={55}
          height={55}
          className="rounded-md hover:opacity-90 transition-opacity"
          priority
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 10 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="mt-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-xl overflow-hidden"
            role="menu"
            aria-label="Primary navigation"
          >
            <nav className="flex flex-col min-w-[220px]">
              {links.map((l, idx) => (
                <motion.button
                  key={l.href}
                  type="button"
                  onClick={() => router.push(l.href)}
                  onMouseEnter={() => { try { (router as any).prefetch?.(l.href); } catch {} }}
                  role="menuitem"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 * idx }}
                  className={`text-left px-4 py-3 text-sm md:text-base hover:bg-white/10 transition-colors
                             ${pathname === l.href ? 'bg-white/10 text-white' : 'text-white/90'}`}
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


