'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { AddonCommonProps } from '../types';

type PianoKey = {
  label: string;
  midi: number;
  isSharp: boolean;
};

// One octave: C4 to C5 (inclusive)
const PIANO_KEYS: PianoKey[] = [
  { label: 'C4', midi: 60, isSharp: false },
  { label: 'C#4', midi: 61, isSharp: true },
  { label: 'D4', midi: 62, isSharp: false },
  { label: 'D#4', midi: 63, isSharp: true },
  { label: 'E4', midi: 64, isSharp: false },
  { label: 'F4', midi: 65, isSharp: false },
  { label: 'F#4', midi: 66, isSharp: true },
  { label: 'G4', midi: 67, isSharp: false },
  { label: 'G#4', midi: 68, isSharp: true },
  { label: 'A4', midi: 69, isSharp: false },
  { label: 'A#4', midi: 70, isSharp: true },
  { label: 'B4', midi: 71, isSharp: false },
  { label: 'C5', midi: 72, isSharp: false },
];

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

type ActiveVoice = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

function createVoice(context: AudioContext, frequency: number): ActiveVoice {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  // Simple piano-ish tone: use triangle wave with a short envelope and gentle low-pass
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3000;

  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.0001; // start near-silent

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  return { oscillator, gain };
}

export default function KeyboardAddon({ entry }: AddonCommonProps) {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  const contextRef = useRef<AudioContext | null>(null);
  const voicesRef = useRef<Map<number, ActiveVoice>>(new Map());

  function getContext(): AudioContext {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return contextRef.current;
  }

  const whiteKeys = useMemo(() => PIANO_KEYS.filter(k => !k.isSharp), []);
  const blackKeys = useMemo(() => {
    // Positions relative to white key index where the black key sits between i and i+1
    const items: Array<PianoKey & { gapIndex: number }> = [];
    // gaps where black keys exist: C#, D#, F#, G#, A#
    const gapOrder = [0, 1, 3, 4, 5]; // between C-D, D-E, F-G, G-A, A-B
    let gapPtr = 0;
    for (const key of PIANO_KEYS) {
      if (key.isSharp) {
        items.push({ ...key, gapIndex: gapOrder[gapPtr++] });
      }
    }
    return items;
  }, []);

  const handleStart = useCallback(async (midi: number) => {
    const context = getContext();
    if (context.state !== 'running') await context.resume();

    if (voicesRef.current.has(midi)) return; // already active

    const now = context.currentTime;
    const voice = createVoice(context, midiToFrequency(midi));

    // ADSR envelope
    const attack = 0.01;
    const decay = 0.15;
    const sustain = 0.7;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(0.0001, now);
    voice.gain.gain.exponentialRampToValueAtTime(1.0, now + attack);
    voice.gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    voice.oscillator.start();
    voicesRef.current.set(midi, voice);
    setActiveKeys(prev => new Set(prev).add(midi));
  }, []);

  const handleStop = useCallback((midi: number) => {
    const context = contextRef.current;
    const voice = voicesRef.current.get(midi);
    if (!context || !voice) return;

    const now = context.currentTime;
    const release = 0.2;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0.0001, now, release / 3);
    voice.oscillator.stop(now + release);
    setTimeout(() => {
      voice.oscillator.disconnect();
      voice.gain.disconnect();
      voicesRef.current.delete(midi);
    }, release * 1000 + 20);

    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  function isActive(midi: number) {
    return activeKeys.has(midi);
  }

  // Visual constants
  const whiteCount = whiteKeys.length; // 8
  const whiteWidth = `calc(100% / ${whiteCount})`;
  const blackWidth = `calc((100% / ${whiteCount}) * 0.6)`; // ~60% of a white key

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="relative select-none rounded-xl border border-white/10 bg-black/10 p-3 shadow-xl backdrop-blur">
        {/* White keys */}
        <div className="relative flex h-44 w-full">
          {whiteKeys.map((key) => (
            <button
              key={key.midi}
              aria-label={key.label}
              className={`relative h-full border-r last:border-r-0 active:brightness-95 transition-[filter] ${
                isActive(key.midi) ? 'brightness-95' : ''
              }`}
              style={{ width: whiteWidth, background: '#fafafa', borderColor: 'rgba(0,0,0,0.15)' }}
              onMouseDown={() => handleStart(key.midi)}
              onMouseUp={() => handleStop(key.midi)}
              onMouseLeave={() => isActive(key.midi) && handleStop(key.midi)}
              onTouchStart={(e) => { e.preventDefault(); handleStart(key.midi); }}
              onTouchEnd={(e) => { e.preventDefault(); handleStop(key.midi); }}
            />
          ))}

          {/* Black keys overlay */}
          {blackKeys.map((key) => (
            <button
              key={key.midi}
              aria-label={key.label}
              className={`absolute top-0 h-[60%] -translate-x-1/2 rounded-b-md shadow-md active:brightness-110 ${
                isActive(key.midi) ? 'brightness-110' : ''
              }`}
              style={{
                width: blackWidth,
                left: `calc((100% / ${whiteCount}) * ${key.gapIndex + 1} - ((100% / ${whiteCount}) * 0.3))`,
                background: '#222',
              }}
              onMouseDown={() => handleStart(key.midi)}
              onMouseUp={() => handleStop(key.midi)}
              onMouseLeave={() => isActive(key.midi) && handleStop(key.midi)}
              onTouchStart={(e) => { e.preventDefault(); handleStart(key.midi); }}
              onTouchEnd={(e) => { e.preventDefault(); handleStop(key.midi); }}
            />
          ))}

          {/* Note labels aligned to white keys */}
          <div className="pointer-events-none absolute inset-x-0 bottom-1 z-10 grid grid-cols-8">
            {whiteKeys.map((key) => (
              <div key={key.midi} className="text-center text-[10px] text-gray-600">
                {key.label.replace(/[0-9]/g, '')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


