import { useCallback, useMemo } from 'react';

import useTourEngine from '~/hooks/useTourEngine';
import { canUseDOM } from '~/modules/dom';
import { omit } from '~/modules/helpers';

import TourRenderer from '~/components/TourRenderer';

import type { EventHandler, Events, Props, UseJoyrideReturn } from '~/types';

export function useJoyride(props: Props): UseJoyrideReturn {
  const { controls, failures, mergedProps, state, step, store } = useTourEngine(props);

  const on = useCallback(
    (eventType: Events, handler: EventHandler) => store.current.on(eventType, handler),
    [store],
  );

  const publicState = useMemo(() => omit(state, 'positioned'), [state]);

  const Tour = canUseDOM() ? (
    <TourRenderer
      controls={controls}
      mergedProps={mergedProps}
      state={state}
      step={step}
      store={store}
    />
  ) : null;

  return { controls, failures, on, state: publicState, step, Tour };
}
