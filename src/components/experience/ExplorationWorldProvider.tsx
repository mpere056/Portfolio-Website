'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';
import {
  browserExplorationStorage,
  createExplorationStore,
  type ExplorationStoreState,
} from '@/lib/experience/store';

type ExplorationStore = ReturnType<typeof createExplorationStore>;

export interface ExplorationWorldValue {
  store: ExplorationStore;
  state: ExplorationStoreState;
  ready: boolean;
}

const ExplorationWorldContext = createContext<ExplorationStore | null>(null);

export function ExplorationWorldProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createExplorationStore({
    storage: browserExplorationStorage,
    origin: 'marknperera.ca',
  }));
  useEffect(() => {
    void store.getState().hydrate();
  }, [store]);
  return (
    <ExplorationWorldContext.Provider value={store}>
      {children}
    </ExplorationWorldContext.Provider>
  );
}

export function useExplorationWorld(): ExplorationWorldValue {
  const store = useContext(ExplorationWorldContext);
  if (!store) throw new Error('useExplorationWorld must be used inside ExplorationWorldProvider');
  const state = useStore(store);
  return { store, state, ready: state.hydration.status !== 'idle' };
}
