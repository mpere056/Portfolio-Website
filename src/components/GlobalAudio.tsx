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
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
  const hasAttemptedRef = useRef(false);
  const routeChangeTimeRef = useRef(Date.now());
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
      setShowPlayPrompt(false);
      return;
    }
    if (audio.src.endsWith(src)) return;
    
    console.log('Route changed, updating audio source to:', src);
    routeChangeTimeRef.current = Date.now(); // Track when route changed
    audio.src = src;
    audio.load();
    // Keep current mute preference across routes
    audio.muted = isMuted;
    hasAttemptedRef.current = false;
    
    // Don't attempt play here - let the monitoring effect handle it
  }, [src]);

  // Check if audio is playing and show prompt if needed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) {
      setShowPlayPrompt(false);
      return;
    }

    console.log('Monitoring effect running for src:', src);
    audio.muted = isMuted;
    
    // Only attempt play if we haven't tried yet for this source
    if (!hasAttemptedRef.current) {
      console.log('Attempting initial play for:', src);
      attemptPlay(audio);
    }

    // Monitor audio state with debugging
    const checkPlayState = () => {
      const state = {
        paused: audio.paused,
        currentTime: audio.currentTime,
        readyState: audio.readyState,
        networkState: audio.networkState,
        muted: audio.muted,
        volume: audio.volume,
        src: audio.src
      };
      console.log('Audio state check:', state);
      
      const timeSinceRouteChange = Date.now() - routeChangeTimeRef.current;
      const shouldShowPrompt = timeSinceRouteChange >= 2000; // Wait at least 2 seconds
      
      if (!shouldShowPrompt) {
        console.log(`Waiting ${2000 - timeSinceRouteChange}ms more before checking if prompt needed`);
        setShowPlayPrompt(false);
        return;
      }
      
      if (audio.paused) {
        console.log('Audio is paused after 2s grace period, showing play prompt');
        setShowPlayPrompt(true);
      } else if (audio.currentTime === 0) {
        console.log('Audio claims to be playing but currentTime is 0 after 2s grace period - likely stuck.');
        // Add an additional 1-second check before showing the prompt for stuck audio
        setTimeout(() => {
          if (audio.currentTime === 0 && !audio.paused) {
            console.log('Audio still stuck at currentTime 0 after 1-second recheck, showing prompt');
            setShowPlayPrompt(true);
          } else if (audio.currentTime > 0) {
            console.log('Audio started progressing during 1-second recheck, hiding prompt');
            setShowPlayPrompt(false);
            setNeedsUserUnmute(false);
          }
        }, 1000); // 1-second additional delay
      } else {
        console.log('Audio is playing properly, hiding play prompt');
        setShowPlayPrompt(false);
        setNeedsUserUnmute(false);
      }
    };

    const onPlay = () => {
      console.log('Audio play event fired');
      checkPlayState();
    };
    const onPause = (e: Event) => {
      console.log('Audio pause event fired', e);
      // If audio was paused without user interaction, it's likely an autoplay restriction
      const wasAutoplayBlocked = !document.hasFocus() || performance.now() < 5000; // within 5s of page load
      if (wasAutoplayBlocked) {
        console.log('Audio pause detected - likely autoplay restriction, showing prompt');
        setShowPlayPrompt(true);
      }
      checkPlayState();
    };
    const onEnded = () => {
      console.log('Audio ended event fired');
      checkPlayState();
    };
    const onLoadedData = () => {
      console.log('Audio loaded data event fired');
      checkPlayState();
    };
    const onCanPlay = () => {
      console.log('Audio can play event fired');
      checkPlayState();
    };
    const onError = (e: Event) => {
      console.log('Audio error event fired:', e);
      checkPlayState();
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    // Initial check with delay to ensure audio element is ready
    setTimeout(checkPlayState, 100);
    
    // Set up a timer to check after the 2-second grace period
    const graceTimer = setTimeout(() => {
      console.log('2-second grace period ended, checking audio state');
      checkPlayState();
    }, 2000);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      clearTimeout(graceTimer);
    };
  }, [src, isMuted]);

  function handlePlayPromptClick() {
    const audio = audioRef.current;
    if (!audio) return;
    
    console.log('Play prompt clicked, attempting to play audio');
    audio.muted = false;
    setIsMuted(false);
    
    // If audio claims to be playing but isn't progressing, force a reload
    if (!audio.paused && audio.currentTime === 0) {
      console.log('Audio appears stuck, forcing reload before play');
      audio.load();
    }
    
    audio.play().then(() => {
      console.log('Audio play promise resolved successfully');
      setNeedsUserUnmute(false);
      try { localStorage.setItem('siteAudioConsent', 'true'); } catch {}
      
      // Check if it actually starts progressing
      setTimeout(() => {
        if (!audio.paused && audio.currentTime > 0) {
          console.log('Audio confirmed playing and progressing');
          setShowPlayPrompt(false);
        } else if (!audio.paused && audio.currentTime === 0) {
          console.log('Audio still stuck after manual play attempt');
          setShowPlayPrompt(true);
        }
      }, 300);
    }).catch((error) => {
      console.log('Audio play promise rejected:', error);
      setShowPlayPrompt(true);
    });
  }

  function attemptPlay(audio: HTMLAudioElement) {
    if (hasAttemptedRef.current) {
      console.log('Skipping attemptPlay - already attempted for this source');
      return;
    }
    hasAttemptedRef.current = true;
    console.log('attemptPlay called for audio element');
    
    const persistedMuted = (() => { try { return localStorage.getItem('siteAudioMuted') === 'true'; } catch { return false; } })();
    const persistedConsent = (() => { try { return localStorage.getItem('siteAudioConsent') === 'true'; } catch { return false; } })();

    // Honor persisted mute preference
    audio.muted = persistedMuted ? true : false;
    setIsMuted(persistedMuted);

    const start = () => {
      console.log('Attempting to start audio playback');
      audio.play().then(() => {
        console.log('Audio play succeeded in attemptPlay');
        setNeedsUserUnmute(false);
        if (!audio.muted) { try { localStorage.setItem('siteAudioConsent', 'true'); } catch {} }
        
        // Check if audio is actually progressing after delays, but respect 2s grace period
        setTimeout(() => {
          const timeSinceRouteChange = Date.now() - routeChangeTimeRef.current;
          if (timeSinceRouteChange < 2000) return; // Respect 2s grace period
          
          if (audio.paused) {
            console.log('Audio was paused shortly after play() succeeded - likely autoplay restriction');
            setShowPlayPrompt(true);
          } else if (audio.currentTime === 0) {
            console.log('Audio claims to be playing but currentTime is still 0 after grace period - likely resource restriction');
            setShowPlayPrompt(true);
          }
        }, Math.max(800, 2000 - (Date.now() - routeChangeTimeRef.current)));
        
        // Final check after even longer delay
        setTimeout(() => {
          const timeSinceRouteChange = Date.now() - routeChangeTimeRef.current;
          if (timeSinceRouteChange < 2000) return; // Respect 2s grace period
          
          if (!audio.paused && audio.currentTime === 0) {
            console.log('Audio still not progressing after grace period - definitely stuck, showing prompt');
            setShowPlayPrompt(true);
          }
        }, Math.max(1500, 2000 - (Date.now() - routeChangeTimeRef.current)));
      }).catch((error) => {
        console.log('Audio play failed in attemptPlay:', error);
        // Do not auto-mute; keep unmuted preference and wait for user gesture
        setNeedsUserUnmute(true);
        // Don't show prompt immediately - wait for grace period
        const timeSinceRouteChange = Date.now() - routeChangeTimeRef.current;
        if (timeSinceRouteChange >= 2000) {
          setShowPlayPrompt(true);
        }
      });
    };

    if (audio.readyState >= 2) {
      console.log('Audio ready, starting immediately');
      start();
    } else {
      console.log('Audio not ready, waiting for canplay event');
      const onCanPlay = () => {
        console.log('canplay event in attemptPlay, starting now');
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
    <>
      {showPlayPrompt && (
        <div 
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          onClick={handlePlayPromptClick}
        >
          <div className="bg-black/70 text-white px-8 py-6 rounded-2xl backdrop-blur-xl border border-white/10 text-center shadow-2xl">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-medium mb-2">Enable Audio</h3>
            <p className="text-white/70 mb-4">Tap anywhere to start the music</p>
            <div className="text-sm text-white/50">Playing: {label}</div>
          </div>
        </div>
      )}
      
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
      </div>
    </>
  );
}


