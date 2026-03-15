import { type RefObject, useCallback, useRef } from 'react';

import createStore from '~/modules/store';

import type {
  Actions,
  Controls,
  EventData,
  EventHandler,
  Events,
  Lifecycle,
  ScrollData,
  StepMerged,
} from '~/types';

export type EmitEvent = (
  type: Events,
  step: StepMerged,
  overrides?: {
    action?: Actions;
    error?: Error | null;
    index?: number;
    lifecycle?: Lifecycle;
    scroll?: ScrollData | null;
  },
) => void;

export default function useEventEmitter(
  onEvent: EventHandler | undefined,
  controls: Controls,
  store: RefObject<ReturnType<typeof createStore>>,
): EmitEvent {
  const onEventRef = useRef(onEvent);
  const controlsRef = useRef(controls);

  onEventRef.current = onEvent;
  controlsRef.current = controls;

  return useCallback(
    (type, step, overrides) => {
      const data: EventData = {
        ...store.current.getEventState(),
        error: null,
        scroll: null,
        step,
        type,
        ...overrides,
      };

      onEventRef.current?.(data, controlsRef.current);
      store.current.dispatch(data, controlsRef.current);
    },
    [store],
  );
}
