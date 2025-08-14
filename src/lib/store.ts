import { create } from 'zustand';

interface TimelineState {
  activeSection: number;
  setActiveSection: (index: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  activeSection: 0,
  setActiveSection: (index) => set({ activeSection: index }),
}));

// Shared audio element (from GlobalAudio) for visualizers
interface AudioState {
  audioEl: HTMLAudioElement | null;
  setAudioEl: (el: HTMLAudioElement | null) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  audioEl: null,
  setAudioEl: (el) => set({ audioEl: el }),
}));