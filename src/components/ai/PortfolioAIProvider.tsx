'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from 'zustand';
import {
  createPortfolioAIContextStore,
  type PortfolioAIContextInput,
  type PortfolioAIContextState,
} from '@/lib/ai/context';
import {
  getAIShellPresentation,
  INITIAL_AI_SHELL_STATE,
  transitionAIShell,
  type AIShellEvent,
  type AIShellState,
} from '@/lib/ai/shell';
import type { PortfolioAIContext } from '@/lib/portfolioContracts';

export interface PortfolioAIValue {
  enabled: boolean;
  initialPrompt?: string;
  context: PortfolioAIContext;
  shell: AIShellState;
  presentation: ReturnType<typeof getAIShellPresentation>;
  open(): void;
  close(): void;
  clearConversation(): void;
  reportRequestState(state: 'idle' | 'responding' | 'error', message?: string): void;
  pushContext(sourceId: string, context: PortfolioAIContextInput): void;
  popContext(sourceId: string): void;
}

const PortfolioAIContextValue = createContext<PortfolioAIValue | undefined>(undefined);
type PortfolioAIContextStore = ReturnType<typeof createPortfolioAIContextStore>;
const AIContextStoreContext = createContext<PortfolioAIContextStore | null>(null);

export function PortfolioAIProvider({
  children,
  enabled = false,
  initialContext,
}: {
  children: ReactNode;
  enabled?: boolean;
  initialContext?: PortfolioAIContext;
}) {
  const pathname = usePathname() || '/';
  const [contextStore] = useState(() => createPortfolioAIContextStore(
    initialContext ?? { route: pathname },
  ));
  const contextState = useSyncExternalStore(
    contextStore.subscribe,
    contextStore.getState,
    contextStore.getState,
  );
  const [shell, setShell] = useState(INITIAL_AI_SHELL_STATE);
  const [initialPrompt, setInitialPrompt] = useState<string>();

  const applyEvent = useCallback((event: AIShellEvent) => {
    setShell(current => transitionAIShell(current, event));
  }, []);

  useEffect(() => {
    contextStore.getState().setRoute(pathname);
  }, [contextStore, pathname]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get('prompt')?.trim();
    if (prompt) setInitialPrompt(prompt.slice(0, 500));
    if (prompt || params.get('archive') === 'open') {
      applyEvent({ type: 'surface.opened' });
    }
  }, [applyEvent, pathname]);

  const activeContext = contextState.activeContext;
  const contextAvailable = Boolean(
    activeContext.nodeId
    || activeContext.destinationId
    || activeContext.experienceId
    || activeContext.depthStage
    || (activeContext.route !== '/' && activeContext.route !== '/chat'),
  );
  useEffect(() => {
    applyEvent({ type: 'context.changed', available: contextAvailable });
  }, [applyEvent, contextAvailable]);

  const open = useCallback(() => applyEvent({ type: 'surface.opened' }), [applyEvent]);
  const close = useCallback(() => applyEvent({ type: 'surface.closed' }), [applyEvent]);
  const clearConversation = useCallback(
    () => applyEvent({ type: 'conversation.cleared' }),
    [applyEvent],
  );
  const reportRequestState = useCallback((state: 'idle' | 'responding' | 'error', message?: string) => {
    if (state === 'responding') applyEvent({ type: 'request.started' });
    else if (state === 'error') applyEvent({ type: 'request.failed', message });
    else applyEvent({ type: 'request.completed' });
  }, [applyEvent]);
  const pushContext = useCallback((sourceId: string, context: PortfolioAIContextInput) => {
    contextStore.getState().pushContext(sourceId, context);
  }, [contextStore]);
  const popContext = useCallback((sourceId: string) => {
    contextStore.getState().popContext(sourceId);
  }, [contextStore]);

  return (
    <AIContextStoreContext.Provider value={contextStore}>
      <PortfolioAIContextValue.Provider value={{
        enabled,
        initialPrompt,
        context: activeContext,
        shell,
        presentation: getAIShellPresentation(shell, activeContext),
        open,
        close,
        clearConversation,
        reportRequestState,
        pushContext,
        popContext,
      }}>
        {children}
      </PortfolioAIContextValue.Provider>
    </AIContextStoreContext.Provider>
  );
}

export function usePortfolioAI() {
  const value = useContext(PortfolioAIContextValue);
  if (!value) throw new Error('usePortfolioAI must be used inside PortfolioAIProvider');
  return value;
}

export function usePortfolioAIContext<T>(selector: (state: PortfolioAIContextState) => T) {
  const store = useContext(AIContextStoreContext);
  if (!store) throw new Error('usePortfolioAIContext must be used inside PortfolioAIProvider');
  return useStore(store, selector);
}
