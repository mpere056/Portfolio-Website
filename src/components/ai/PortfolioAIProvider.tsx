'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';
import {
  createPortfolioAIContextStore,
  type PortfolioAIContextState,
} from '@/lib/ai/context';
import type { PortfolioAIContext } from '@/lib/portfolioContracts';

type PortfolioAIContextStore = ReturnType<typeof createPortfolioAIContextStore>;

const AIContextStoreContext = createContext<PortfolioAIContextStore | null>(null);

export function PortfolioAIProvider({
  children,
  initialContext = { route: '/' },
}: {
  children: ReactNode;
  initialContext?: PortfolioAIContext;
}) {
  const [store] = useState(() => createPortfolioAIContextStore(initialContext));
  return (
    <AIContextStoreContext.Provider value={store}>
      {children}
    </AIContextStoreContext.Provider>
  );
}

export function usePortfolioAIContext<T>(selector: (state: PortfolioAIContextState) => T) {
  const store = useContext(AIContextStoreContext);
  if (!store) throw new Error('usePortfolioAIContext must be used inside PortfolioAIProvider');
  return useStore(store, selector);
}
