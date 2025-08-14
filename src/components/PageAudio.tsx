'use client';

import { useEffect, useRef, useState } from 'react';

interface PageAudioProps {
  src: string;
  label?: string;
  startMuted?: boolean;
}

export default function PageAudio({ src, label = 'Page music', startMuted = false }: PageAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(startMuted);
  const hasTriedAutoplayRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasTriedAutoplayRef.current) return;
    hasTriedAutoplayRef.current = true;

    function attemptPlay() {
      const el = audioRef.current;
      if (!el) return;
      const play = () => el.play().catch(() => {});
      if (el.readyState >= 2) play();
      else {
        const onCanPlay = () => {
          el.removeEventListener('canplay', onCanPlay);
          play();
        };
        el.addEventListener('canplay', onCanPlay, { once: true });
        el.load();
      }
    }

    attemptPlay();

    // If blocked by autoplay policy, start on common user gestures
    const onUserInteract = () => attemptPlay();
    document.addEventListener('pointerdown', onUserInteract, { once: true });
    document.addEventListener('click', onUserInteract, { once: true });
    document.addEventListener('touchstart', onUserInteract, { once: true });
    document.addEventListener('keydown', onUserInteract, { once: true });

    // Try again when tab becomes visible
    const onVisibility = () => {
      if (document.visibilityState === 'visible') attemptPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('pointerdown', onUserInteract);
      document.removeEventListener('click', onUserInteract);
      document.removeEventListener('touchstart', onUserInteract);
      document.removeEventListener('keydown', onUserInteract);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  function handleToggleMute() {
    setIsMuted(prev => !prev);
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-black/50 text-white backdrop-blur px-3 py-2 shadow-lg">
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />
      <button
        type="button"
        onClick={handleToggleMute}
        className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 px-3 py-1.5 text-sm"
        aria-label={isMuted ? `Unmute ${label}` : `Mute ${label}`}
      >
        <span aria-hidden>{isMuted ? '🔇' : '🔊'}</span>
        <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>
    </div>
  );
}


