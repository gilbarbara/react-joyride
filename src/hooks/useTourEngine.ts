import { RefObject, useMemo, useRef, useSyncExternalStore } from 'react';
import { useMemoDeepCompare, useMount, usePrevious, useUpdateEffect } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import { defaultProps } from '~/defaults';
import useControls from '~/hooks/useControls';
import useLifecycleEffect from '~/hooks/useLifecycleEffect';
import usePropSync from '~/hooks/usePropSync';
import useScrollEffect from '~/hooks/useScrollEffect';
import { STATUS } from '~/literals';
import { mergeProps } from '~/modules/helpers';
import { getMergedStep, validateSteps } from '~/modules/step';
import createStore from '~/modules/store';

import { Controls, Props, StepMerged, StoreState } from '~/types';

export type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

export interface UseTourEngineReturn {
  controls: Controls;
  mergedProps: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useTourEngine(props: Props): UseTourEngineReturn {
  const mergedProps = useMemoDeepCompare(() => mergeProps(defaultProps, props), [props]);
  const { debug, run, steps } = mergedProps;

  const store = useRef(createStore(mergedProps));
  const state = useSyncExternalStore<StoreState>(
    store.current.subscribe,
    store.current.getSnapshot,
    store.current.getServerSnapshot,
  );

  const controls = useControls(store, debug);

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
      controls.start();
    }
  });

  useUpdateEffect(() => {
    if (run && size && status === STATUS.IDLE) {
      store.current.updateState({ status: STATUS.READY });
    }
  }, [run, size, status]);

  usePropSync({
    changedProps,
    controls,
    previousProps,
    props: mergedProps,
    state,
    store,
  });

  useLifecycleEffect({
    changedState,
    changedStateFrom,
    controls,
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

  return { controls, mergedProps, state, step, store };
}
