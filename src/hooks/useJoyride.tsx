import { useMemo } from 'react';
import { useOnce } from '@gilbarbara/hooks';

import useTourEngine from '~/hooks/useTourEngine';
import { canUseDOM } from '~/modules/dom';
import { logDebug, omit } from '~/modules/helpers';

import TourRenderer from '~/components/TourRenderer';

import { Props, UseJoyrideReturn } from '~/types';

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

  const publicState = useMemo(() => omit(state, 'positioned', 'scrolling', 'waiting'), [state]);

  const Tour = canUseDOM() ? (
    <TourRenderer
      controls={controls}
      mergedProps={mergedProps}
      state={state}
      step={step}
      store={store}
    />
  ) : null;

  return { controls, state: publicState, step, Tour };
}
