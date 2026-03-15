import { useCallback, useMemo } from 'react';
import { useOnce } from '@gilbarbara/hooks';

import useTourEngine from '~/hooks/useTourEngine';
import { canUseDOM } from '~/modules/dom';
import { logDebug, omit } from '~/modules/helpers';

import TourRenderer from '~/components/TourRenderer';

import type { EventHandler, Events, Props, UseJoyrideReturn } from '~/types';

export default function useJoyride(props: Props): UseJoyrideReturn {
  const { controls, mergedProps, state, step, store } = useTourEngine(props);
  const { debug } = mergedProps;

  useOnce(() => {
    logDebug({
      title: 'init',
      data: [
        { key: 'props', value: mergedProps },
        { key: 'state', value: store.current.getState() },
      ],
      debug,
    });
  });

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

  return { controls, on, state: publicState, step, Tour };
}
