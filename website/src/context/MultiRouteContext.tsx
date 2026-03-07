'use client';

import { createContext, useContext } from 'react';

export interface MultiRouteContextValue {
  hasNewStep: boolean;
  onNewStep: () => void;
  onStart: () => void;
  run: boolean;
}

const MultiRouteContext = createContext<MultiRouteContextValue | null>(null);

export function useMultiRouteContext(): MultiRouteContextValue {
  const context = useContext(MultiRouteContext);

  if (!context) {
    throw new Error('useMultiRouteContext must be used within MultiRoute layout');
  }

  return context;
}

export default MultiRouteContext;
