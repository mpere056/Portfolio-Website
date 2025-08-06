import { create } from 'zustand';

interface TimelineState {
  activeSection: number;
  setActiveSection: (index: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  activeSection: 0,
  setActiveSection: (index) => set({ activeSection: index }),
}));
