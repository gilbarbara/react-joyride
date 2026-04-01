import { type RefObject, useMemo, useRef } from 'react';
import is from 'is-lite';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { log, omit } from '~/modules/helpers';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

import type { Controls, Origin, Status } from '~/types';

function getUpdatedIndex(nextIndex: number, size: number): number {
  return Math.min(Math.max(nextIndex, 0), size);
}

export default function useControls(
  store: RefObject<ReturnType<typeof createStore>>,
  debug: boolean,
  clearFailures: () => void,
): Controls {
  const debugRef = useRef(debug);
  const clearFailuresRef = useRef(clearFailures);

  debugRef.current = debug;
  clearFailuresRef.current = clearFailures;

  return useMemo(() => {
    const getState = (): StoreState => store.current.getSnapshot();

    const close = (origin: Origin | null = null) => {
      const { index, status } = getState();

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.CLOSE,
        index: index + 1,
        origin,
        lifecycle: LIFECYCLE.COMPLETE,
        positioned: false,
        scrolling: false,
        waiting: false,
      });
    };

    const go = (nextIndex: number) => {
      const { controlled, size, status } = getState();

      if (controlled) {
        log(debugRef.current, 'tour', 'go() is not supported in controlled mode');

        return;
      }

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.GO,
        index: nextIndex,
        lifecycle: LIFECYCLE.COMPLETE,
        positioned: false,
        scrolling: false,
        status: nextIndex < size ? status : STATUS.FINISHED,
        waiting: false,
      });
    };

    const info = () => omit(store.current.getSnapshot(), 'positioned');

    const next = (origin?: Origin | null) => {
      const { index, size, status } = getState();

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.NEXT,
        index: getUpdatedIndex(index + 1, size),
        lifecycle: LIFECYCLE.COMPLETE,
        origin,
        positioned: false,
        scrolling: false,
        waiting: false,
      });
    };

    const open = () => {
      const { status } = getState();

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        positioned: false,
        scrolling: false,
        waiting: false,
      });
    };

    const previous = (origin?: Origin | null) => {
      const { index, size, status } = getState();

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.PREV,
        index: getUpdatedIndex(index - 1, size),
        lifecycle: LIFECYCLE.COMPLETE,
        origin,
        positioned: false,
        scrolling: false,
        waiting: false,
      });
    };

    const reset = (restart = false) => {
      const { controlled } = getState();

      if (controlled) {
        log(debugRef.current, 'tour', 'reset() is not supported in controlled mode');

        return;
      }

      clearFailuresRef.current();
      store.current.updateState({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        positioned: false,
        scrolling: false,
        status: restart ? STATUS.RUNNING : STATUS.READY,
        waiting: false,
      });
    };

    const skip = (origin?: Extract<Origin, 'button_close' | 'button_skip'> | null) => {
      const { status } = getState();

      if (status !== STATUS.RUNNING) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.SKIP,
        lifecycle: LIFECYCLE.COMPLETE,
        origin,
        positioned: false,
        scrolling: false,
        status: STATUS.SKIPPED,
        waiting: false,
      });
    };

    const start = (nextIndex?: number) => {
      const { index, size } = getState();

      clearFailuresRef.current();
      store.current.updateState(
        {
          action: ACTIONS.START,
          index: is.number(nextIndex) ? nextIndex : index,
          lifecycle: LIFECYCLE.INIT,
          positioned: false,
          scrolling: false,
          status: size ? STATUS.RUNNING : STATUS.WAITING,
          waiting: false,
        },
        true,
      );
    };

    const stop = (advance = false) => {
      const { index, status } = getState();

      if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
        return;
      }

      store.current.updateState({
        action: ACTIONS.STOP,
        index: index + (advance ? 1 : 0),
        lifecycle: LIFECYCLE.COMPLETE,
        positioned: false,
        scrolling: false,
        status: STATUS.PAUSED,
        waiting: false,
      });
    };

    return { close, go, info, next, open, prev: previous, reset, skip, start, stop };
  }, [store]);
}
