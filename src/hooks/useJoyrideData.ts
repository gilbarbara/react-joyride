import { RefObject, useMemo, useRef, useSyncExternalStore } from 'react';
import { useMount, usePrevious, useUpdateEffect } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import { defaultProps } from '~/defaults';
import useLifecycleEffect from '~/hooks/useLifecycleEffect';
import usePropSync from '~/hooks/usePropSync';
import useScrollEffect from '~/hooks/useScrollEffect';
import { STATUS } from '~/literals';
import { mergeProps } from '~/modules/helpers';
import { getMergedStep, validateSteps } from '~/modules/step';
import createStore from '~/modules/store';

import { Props, StepMerged, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

export interface UseJoyrideDataReturn {
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useJoyrideData(props: MergedProps): UseJoyrideDataReturn {
  const { debug, getHelpers, run, steps } = props;

  const store = useRef(createStore(props));
  const state = useSyncExternalStore<StoreState>(
    store.current.subscribe,
    store.current.getSnapshot,
    store.current.getServerSnapshot,
  );

  const { index, size, status } = state;

  const previousProps = usePrevious(props);
  const previousState = usePrevious(state);
  const { changed: changedProps } = useTreeChanges(props);
  const { changed: changedState, changedFrom: changedStateFrom } = useTreeChanges(state);

  const step = useMemo(() => getMergedStep(props, steps[index]), [index, props, steps]);
  const previousStep = useMemo(() => getMergedStep(props, steps[index - 1]), [index, props, steps]);

  useMount(() => {
    if (run && size && validateSteps(steps, debug)) {
      store.current.start();
    }

    if (getHelpers) {
      getHelpers(store.current.getHelpers());
    }
  });

  useUpdateEffect(() => {
    if (run && size && status === STATUS.IDLE) {
      store.current.updateState({ status: STATUS.READY });
    }

    if (getHelpers) {
      getHelpers(store.current.getHelpers());
    }
  }, [getHelpers, run, size, status]);

  usePropSync({
    changedProps,
    previousProps,
    props,
    state,
    store,
  });

  useLifecycleEffect({
    changedState,
    changedStateFrom,
    previousState,
    previousStep,
    props,
    state,
    step,
    store,
  });

  useScrollEffect({
    changedState,
    previousState,
    props,
    state,
    step,
    store,
  });

  return { state, step, store };
}
