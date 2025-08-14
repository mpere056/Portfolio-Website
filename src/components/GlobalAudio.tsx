'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAudioStore } from '@/lib/store';

function getTrackForPath(pathname: string): { src: string | null; label: string } {
  if (pathname === '/' || pathname === '') return { src: '/audio/home_page.mp3', label: 'Home page music' };
  if (pathname.startsWith('/projects')) return { src: '/audio/projects.mp3', label: 'Projects page music' };
  if (pathname.startsWith('/about')) return { src: '/audio/about_me.mp3', label: 'About page music' };
  return { src: null, label: 'Page music' };
}

export default function GlobalAudio() {
  const pathname = usePathname() || '/';
  const { src, label } = useMemo(() => getTrackForPath(pathname), [pathname]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUserUnmute, setNeedsUserUnmute] = useState(false);
  const hasAttemptedRef = useRef(false);
  const setAudioEl = useAudioStore(s => s.setAudioEl);

  // Load persisted preference
  useEffect(() => {
    try {
      const persistedMuted = localStorage.getItem('siteAudioMuted');
      if (persistedMuted != null) setIsMuted(persistedMuted === 'true');
    } catch {}
  }, []);

  // Update source on route changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!src) {
      audio.pause();
      return;
    }
    if (audio.src.endsWith(src)) return;
    audio.src = src;
    audio.load();
    // Keep current mute preference across routes
    audio.muted = isMuted;
    hasAttemptedRef.current = false;
    attemptPlay(audio);
  }, [src]);

  // Initial mount: attempt autoplay unmuted; if blocked, wait for user gesture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    audio.muted = isMuted;
    attemptPlay(audio);

    const onUserInteract = () => {
      if (!audio) return;
      if (audio.paused) {
        audio.muted = false;
        setIsMuted(false);
        audio.play().then(() => {
          setNeedsUserUnmute(false);
          try { localStorage.setItem('siteAudioConsent', 'true'); } catch {}
        }).catch(() => {});
      }
    };

    // Retry when the user interacts
    document.addEventListener('pointerdown', onUserInteract);
    document.addEventListener('keydown', onUserInteract);
    document.addEventListener('touchstart', onUserInteract);
    document.addEventListener('click', onUserInteract);

    // Try again when tab becomes visible
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && audio) attemptPlay(audio);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('pointerdown', onUserInteract);
      document.removeEventListener('keydown', onUserInteract);
      document.removeEventListener('touchstart', onUserInteract);
      document.removeEventListener('click', onUserInteract);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  function attemptPlay(audio: HTMLAudioElement) {
    if (hasAttemptedRef.current) return;
    hasAttemptedRef.current = true;
    const persistedMuted = (() => { try { return localStorage.getItem('siteAudioMuted') === 'true'; } catch { return false; } })();
    const persistedConsent = (() => { try { return localStorage.getItem('siteAudioConsent') === 'true'; } catch { return false; } })();

    // Honor persisted mute preference
    audio.muted = persistedMuted ? true : false;
    setIsMuted(persistedMuted);

    const start = () => audio.play().then(() => {
      setNeedsUserUnmute(false);
      if (!audio.muted) { try { localStorage.setItem('siteAudioConsent', 'true'); } catch {} }
    }).catch(() => {
      // Do not auto-mute; keep unmuted preference and wait for user gesture
      setNeedsUserUnmute(true);
      hasAttemptedRef.current = false; // allow retries on visibility/user
    });

    if (audio.readyState >= 2) start();
    else {
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay);
        start();
      };
      audio.addEventListener('canplay', onCanPlay, { once: true });
      audio.load();
    }
  }

  function handleToggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    setIsMuted(next);
    audio.muted = next;
    if (!next && audio.paused) audio.play().catch(() => {});
    try { localStorage.setItem('siteAudioMuted', String(next)); } catch {}
  }

  if (!src) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-black/50 text-white backdrop-blur px-3 py-2 shadow-lg" onClick={() => {
      const el = audioRef.current; if (!el) return; if (el.paused) el.play().catch(() => {});
    }}>
      <audio ref={(el) => { audioRef.current = el; setAudioEl(el ?? null); }} loop preload="auto" playsInline />
      <button
        type="button"
        onClick={handleToggleMute}
        className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 px-3 py-1.5 text-sm"
        aria-label={isMuted ? `Unmute ${label}` : `Mute ${label}`}
      >
        <span aria-hidden>{isMuted ? '🔇' : '🔊'}</span>
        <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>
      {needsUserUnmute && (
        <span className="text-xs opacity-80 hidden sm:inline">Tap to enable sound</span>
      )}
    </div>
  );
}


