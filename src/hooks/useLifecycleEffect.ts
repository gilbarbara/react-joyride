import { RefObject, useRef } from 'react';
import { useEffectDeepCompare } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, isElementVisible } from '~/modules/dom';
import { hideBeacon, logDebug, mergeProps } from '~/modules/helpers';
import createStore from '~/modules/store';

import { Actions, Props, State, StepMerged } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;
type Value = import('tree-changes-hook').Value;

interface UseLifecycleEffectParams {
  changedState: (key?: string, actual?: Value, previous?: Value) => boolean;
  changedStateFrom: (key: string, previous: Value, actual?: Value) => boolean;
  previousState: State | undefined;
  previousStep: StepMerged | null;
  props: MergedProps;
  state: State;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useLifecycleEffect({
  changedState,
  changedStateFrom,
  previousState,
  previousStep,
  props,
  state,
  step,
  store,
}: UseLifecycleEffectParams): void {
  const { callback, continuous, debug } = props;
  const { action, controlled, index, lifecycle, size, status } = state;
  const lastAction = useRef<Actions | null>(null);

  const propsRef = useRef(props);
  const stateRef = useRef(state);

  propsRef.current = props;
  stateRef.current = state;

  useEffectDeepCompare(() => {
    if (!previousState) {
      return;
    }

    const isAfterAction = changedState('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction || (lastAction.current === ACTIONS.CLOSE && action === ACTIONS.START)) {
      lastAction.current = action;
    }

    if (status === STATUS.RUNNING && step && lifecycle === LIFECYCLE.INIT) {
      store.current.updateState({
        action: lastAction.current ?? ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.READY,
      });
    }

    if (size && !step && lifecycle === LIFECYCLE.INIT) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    if (
      status === STATUS.RUNNING &&
      step?.placement === 'center' &&
      changedState('lifecycle', LIFECYCLE.COMPLETE) &&
      index < size
    ) {
      store.current.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.INIT });
    }

    const element = getElement(step?.target);
    const elementExists = !!element;

    if (step && elementExists && isElementVisible(element)) {
      if (changedStateFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
        callback?.({
          ...stateRef.current,
          action: lastAction.current ?? action,
          step,
          type: EVENTS.STEP_BEFORE,
        });
      }
    } else if (step && status === STATUS.RUNNING) {
      // eslint-disable-next-line no-console
      console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step);

      callback?.({
        ...stateRef.current,
        type: EVENTS.TARGET_NOT_FOUND,
        step,
      });

      if (!controlled) {
        store.current.updateState({
          action: ACTIONS.UPDATE,
          index: index + (action === ACTIONS.PREV ? -1 : 1),
        });
      }
    }

    if (step && changedState('lifecycle', LIFECYCLE.READY)) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: hideBeacon(step, stateRef.current, continuous)
          ? LIFECYCLE.TOOLTIP
          : LIFECYCLE.BEACON,
      });
    }

    if (step && changedState('lifecycle', LIFECYCLE.BEACON)) {
      callback?.({
        ...stateRef.current,
        step,
        type: EVENTS.BEACON,
      });
    }

    if (step && changedState('lifecycle', LIFECYCLE.TOOLTIP)) {
      callback?.({
        ...stateRef.current,
        step,
        type: EVENTS.TOOLTIP,
      });
    }

    const isRunningOrPausedWithStep =
      status === STATUS.RUNNING || (controlled && status === STATUS.PAUSED && !!step);
    const callbackStep = step ?? previousStep;
    const shouldSendCallback =
      isRunningOrPausedWithStep &&
      callbackStep &&
      changedState('lifecycle', LIFECYCLE.COMPLETE, LIFECYCLE.TOOLTIP) &&
      (elementExists || !step);

    if (shouldSendCallback) {
      callback?.({
        ...stateRef.current,
        action: lastAction.current ?? ACTIONS.UPDATE,
        index: previousState.index ?? index,
        lifecycle,
        step: callbackStep,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (changedState('index')) {
      logDebug({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: propsRef.current }],
        debug,
      });
    }

    if (changedState('lifecycle', LIFECYCLE.COMPLETE) && index >= size) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    if (previousStep && changedState('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      callback?.({
        ...stateRef.current,
        index: index - 1,
        step: previousStep,
        type: EVENTS.TOUR_END,
      });
      store.current.reset();
      lastAction.current = null;
    }

    if (
      step &&
      changedStateFrom('status', [STATUS.IDLE, STATUS.READY, STATUS.PAUSED], STATUS.RUNNING)
    ) {
      callback?.({
        ...stateRef.current,
        step,
        type: EVENTS.TOUR_START,
      });
    }

    if (step && changedState('action', ACTIONS.STOP)) {
      lastAction.current = null;
      callback?.({
        ...stateRef.current,
        step,
        type: EVENTS.TOUR_STATUS,
      });
    }

    if (step && changedState('action', ACTIONS.RESET)) {
      callback?.({
        ...stateRef.current,
        step,
        type: EVENTS.TOUR_STATUS,
      });
      lastAction.current = null;
    }
  }, [
    action,
    callback,
    changedState,
    changedStateFrom,
    continuous,
    controlled,
    debug,
    index,
    lifecycle,
    previousState,
    previousStep,
    size,
    status,
    step,
    store,
  ]);
}
