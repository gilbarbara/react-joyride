import { type RefObject, useMemo, useRef, useSyncExternalStore } from 'react';
import { useMemoDeepCompare, useMount, usePrevious, useUpdateEffect } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import useControls from '~/hooks/useControls';
import useDebugLogger from '~/hooks/useDebugLogger';
import useEventEmitter from '~/hooks/useEventEmitter';
import useLifecycleEffect from '~/hooks/useLifecycleEffect';
import usePropSync from '~/hooks/usePropSync';
import useScrollEffect from '~/hooks/useScrollEffect';
import { STATUS } from '~/literals';
import { mergeProps } from '~/modules/helpers';
import { getMergedStep, validateSteps } from '~/modules/step';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

import type { Controls, Props, StepMerged } from '~/types';

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
  const { debug, initialStepIndex, onEvent, run, stepIndex, steps } = mergedProps;

  const store = useRef(createStore(mergedProps));
  const state = useSyncExternalStore<StoreState>(
    store.current.subscribe,
    store.current.getSnapshot,
    store.current.getServerSnapshot,
  );

  useDebugLogger(store, debug);

  const controls = useControls(store, debug);
  const emitEvent = useEventEmitter(onEvent, controls, store);

  const { index, size, status } = state;

  const previousState = usePrevious(state);

  const step = useMemo(() => getMergedStep(mergedProps, steps[index]), [index, mergedProps, steps]);

  useMount(() => {
    if (run && size && validateSteps(steps, debug)) {
      controls.start(stepIndex ?? initialStepIndex);
    }
  });

  useUpdateEffect(() => {
    if (run && size && status === STATUS.IDLE) {
      store.current.updateState({ status: STATUS.READY });
    }
  }, [run, size, status]);

  usePropSync({
    controls,
    emitEvent,
    props: mergedProps,
    state,
    store,
  });

  useLifecycleEffect({
    controls,
    emitEvent,
    previousState,
    props: mergedProps,
    state,
    step,
    store,
  });

  useScrollEffect({
    emitEvent,
    previousState,
    props: mergedProps,
    state,
    step,
    store,
  });

  return { controls, mergedProps, state, step, store };
}
