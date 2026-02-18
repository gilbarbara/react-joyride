/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react';
import { useSetState } from '@gilbarbara/hooks';

import type { AppState } from './types';

const appState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
};

export const AppContext = createContext({
  state: appState,
  setState: () => undefined,
});
AppContext.displayName = 'AppContext';

export function AppProvider(props: any) {
  const [state, setState] = useSetState(appState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [setState, state],
  );

  return <AppContext.Provider value={value} {...props} />;
}

export function useAppContext(): {
  setState: (patch: Partial<AppState> | ((previousState: AppState) => Partial<AppState>)) => void;
  state: AppState;
} {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }

  return context;
}
