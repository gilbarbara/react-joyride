import { RefObject, useMemo, useRef, useSyncExternalStore } from 'react';
import { useMemoDeepCompare, useMount, usePrevious, useUpdateEffect } from '@gilbarbara/hooks';
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

export type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

export interface UseJoyrideDataReturn {
  mergedProps: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useJoyrideData(props: Props): UseJoyrideDataReturn {
  const mergedProps = useMemoDeepCompare(() => mergeProps(defaultProps, props), [props]);
  const { debug, getHelpers, run, steps } = mergedProps;

  const store = useRef(createStore(mergedProps));
  const state = useSyncExternalStore<StoreState>(
    store.current.subscribe,
    store.current.getSnapshot,
    store.current.getServerSnapshot,
  );

  const { index, size, status } = state;

  const previousProps = usePrevious(mergedProps);
  const previousState = usePrevious(state);
  const { changed: changedProps } = useTreeChanges(mergedProps);
  const { changed: changedState, changedFrom: changedStateFrom } = useTreeChanges(state);

  const step = useMemo(() => getMergedStep(mergedProps, steps[index]), [index, mergedProps, steps]);
  const previousStep = useMemo(
    () => getMergedStep(mergedProps, steps[index - 1]),
    [index, mergedProps, steps],
  );

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
    props: mergedProps,
    state,
    store,
  });

  useLifecycleEffect({
    changedState,
    changedStateFrom,
    previousState,
    previousStep,
    props: mergedProps,
    state,
    step,
    store,
  });

  useScrollEffect({
    changedState,
    previousState,
    props: mergedProps,
    state,
    step,
    store,
  });

  return { mergedProps, state, step, store };
}
