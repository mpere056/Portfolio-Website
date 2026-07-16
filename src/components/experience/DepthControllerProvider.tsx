'use client';

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type {
  DepthController,
  DepthControllerSnapshot,
} from '@/lib/experience/controller';

const DepthControllerContext = createContext<DepthController | null>(null);

export function DepthControllerProvider({
  children,
  controller,
}: {
  children: ReactNode;
  controller: DepthController;
}) {
  useEffect(() => () => controller.dispose(), [controller]);
  return (
    <DepthControllerContext.Provider value={controller}>
      {children}
    </DepthControllerContext.Provider>
  );
}

export function useDepthController() {
  const controller = useContext(DepthControllerContext);
  if (!controller) throw new Error('useDepthController must be used inside DepthControllerProvider');
  return controller;
}

export function useDepthControllerSnapshot(): DepthControllerSnapshot {
  const controller = useDepthController();
  return useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
}
