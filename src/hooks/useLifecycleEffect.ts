import { RefObject, useRef } from 'react';
import { useEffectDeepCompare } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, isElementVisible } from '~/modules/dom';
import { hideBeacon, logDebug, mergeProps, needsScrolling, omit } from '~/modules/helpers';
import createStore from '~/modules/store';

import { Actions, Controls, Props, StepMerged, StepTarget, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;
type Value = import('tree-changes-hook').Value;

interface UseLifecycleEffectOptions {
  changedState: (key?: string, actual?: Value, previous?: Value) => boolean;
  changedStateFrom: (key: string, previous: Value, actual?: Value) => boolean;
  controls: Controls;
  previousState: StoreState | undefined;
  previousStep: StepMerged | null;
  props: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useLifecycleEffect(options: UseLifecycleEffectOptions): void {
  const {
    changedState,
    changedStateFrom,
    controls,
    previousState,
    previousStep,
    props,
    state,
    step,
    store,
  } = options;
  const { callback, continuous, debug, scrollToFirstStep } = props;
  const { action, controlled, index, lifecycle, size, status } = state;
  const lastAction = useRef<Actions | null>(null);

  const propsRef = useRef(props);
  const stateRef = useRef(state);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingTargetRef = useRef<StepTarget | null>(null);
  const loaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepDelayRef = useRef<{ cancel: () => void } | null>(null);

  propsRef.current = props;
  stateRef.current = state;

  const callbackState = () => omit(stateRef.current, 'positioned', 'scrolling', 'waiting');

  const cleanup = () => {
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    pollingTargetRef.current = null;

    if (stepDelayRef.current) {
      stepDelayRef.current.cancel();
      stepDelayRef.current = null;
    }
  };

  useEffectDeepCompare(() => {
    if (!previousState) {
      return () => {
        cleanup();
      };
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

    // Clear polling from previous step before starting new polling
    if (changedState('index')) {
      cleanup();

      logDebug({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: propsRef.current }],
        debug,
      });
    }

    if (status === STATUS.RUNNING && step && lifecycle === LIFECYCLE.INIT) {
      store.current.cleanupPositionData();

      // Step delay: pause before processing the new step
      const hasStepDelay = typeof step.stepDelay === 'function' || step.stepDelay > 0;

      if (hasStepDelay && !stepDelayRef.current) {
        store.current.updateState({ waiting: true });

        const proceed = () => {
          stepDelayRef.current = null;
          store.current.updateState({
            action: lastAction.current ?? action,
            waiting: false,
            lifecycle: LIFECYCLE.READY,
          });
        };

        if (typeof step.stepDelay === 'function') {
          const abortController = new AbortController();
          const timeout = step.targetWaitTimeout;

          stepDelayRef.current = { cancel: () => abortController.abort() };

          const timeoutId = timeout
            ? setTimeout(() => {
                if (!abortController.signal.aborted) {
                  abortController.abort();
                  proceed();
                }
              }, timeout)
            : null;

          step
            .stepDelay({ ...callbackState(), step })
            .then(() => {
              if (!abortController.signal.aborted) {
                if (timeoutId) clearTimeout(timeoutId);
                proceed();
              }
            })
            .catch(() => {
              if (!abortController.signal.aborted) {
                if (timeoutId) clearTimeout(timeoutId);
                proceed();
              }
            });
        } else {
          const timeoutId = setTimeout(proceed, step.stepDelay);

          stepDelayRef.current = { cancel: () => clearTimeout(timeoutId) };
        }
      } else if (!stepDelayRef.current) {
        // If polling for a different target (step changed), restart
        if (pollingRef.current && pollingTargetRef.current !== step.target) {
          cleanup();
        }

        const element = getElement(step.target);
        const targetAvailable = element && isElementVisible(element);

        if (targetAvailable) {
          cleanup();
          store.current.updateState({
            action: lastAction.current ?? ACTIONS.UPDATE,
            lifecycle: LIFECYCLE.READY,
            waiting: false,
          });
        } else if (step.targetWaitTimeout === 0) {
          store.current.updateState({
            action: lastAction.current ?? ACTIONS.UPDATE,
            lifecycle: LIFECYCLE.READY,
            waiting: false,
          });
        } else if (!pollingRef.current) {
          const timeout = step.targetWaitTimeout ?? 150;
          const loaderDelay = step.loaderDelay ?? 300;
          const startTime = Date.now();

          pollingTargetRef.current = step.target;

          if (timeout > loaderDelay) {
            loaderTimeoutRef.current = setTimeout(() => {
              if (pollingRef.current && stateRef.current.lifecycle === LIFECYCLE.INIT) {
                store.current.updateState({ waiting: true });
              }
            }, loaderDelay);
          }

          pollingRef.current = setInterval(() => {
            const el = getElement(step.target);
            const elapsed = Date.now() - startTime;
            const timedOut = elapsed >= timeout;

            if ((el && isElementVisible(el)) || timedOut) {
              cleanup();
              store.current.updateState({
                action: lastAction.current ?? ACTIONS.UPDATE,
                lifecycle: LIFECYCLE.READY,
                waiting: false,
              });
            }
          }, 100);
        }
      }
    }

    if (size && !step && lifecycle === LIFECYCLE.INIT) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    if (
      !controlled &&
      status === STATUS.RUNNING &&
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
          ...callbackState(),
          action: lastAction.current ?? action,
          step,
          type: EVENTS.STEP_BEFORE,
        });
      }
    } else if (
      step &&
      status === STATUS.RUNNING &&
      lifecycle !== LIFECYCLE.INIT &&
      lifecycle !== LIFECYCLE.COMPLETE &&
      changedState('lifecycle')
    ) {
      // eslint-disable-next-line no-console
      console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step);

      callback?.({
        ...callbackState(),
        type: EVENTS.TARGET_NOT_FOUND,
        step,
      });

      if (!controlled) {
        store.current.updateState({
          action: ACTIONS.UPDATE,
          index: index + (action === ACTIONS.PREV ? -1 : 1),
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }

    if (step && elementExists && changedState('lifecycle', LIFECYCLE.READY)) {
      const targetLifecycle = hideBeacon(step, stateRef.current, continuous)
        ? LIFECYCLE.TOOLTIP
        : LIFECYCLE.BEACON;

      const target = getElement(step.target);
      const willScroll = needsScrolling({
        isFirstStep: index === 0,
        scrollToFirstStep,
        step,
        target,
        targetLifecycle,
      });

      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: targetLifecycle,
        scrolling: willScroll,
      });
    }

    if (step && changedState('lifecycle', LIFECYCLE.BEACON)) {
      callback?.({
        ...callbackState(),
        step,
        type: EVENTS.BEACON,
      });
    }

    if (step && changedState('lifecycle', LIFECYCLE.TOOLTIP)) {
      callback?.({
        ...callbackState(),
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
        ...callbackState(),
        action: lastAction.current ?? ACTIONS.UPDATE,
        index: previousState.index ?? index,
        lifecycle,
        step: callbackStep,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (changedState('lifecycle', LIFECYCLE.COMPLETE) && index >= size) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    const tourEndStep = previousStep ?? step;

    if (tourEndStep && changedState('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      callback?.({
        ...callbackState(),
        index: previousStep ? index - 1 : index,
        step: tourEndStep,
        type: EVENTS.TOUR_END,
      });
      controls.reset();
      lastAction.current = null;
    }

    if (
      step &&
      changedStateFrom('status', [STATUS.IDLE, STATUS.READY, STATUS.PAUSED], STATUS.RUNNING)
    ) {
      callback?.({
        ...callbackState(),
        step,
        type: EVENTS.TOUR_START,
      });
    }

    if (step && changedState('action', ACTIONS.STOP)) {
      lastAction.current = null;
      callback?.({
        ...callbackState(),
        step,
        type: EVENTS.TOUR_STATUS,
      });
    }

    if (step && changedState('action', ACTIONS.RESET)) {
      callback?.({
        ...callbackState(),
        step,
        type: EVENTS.TOUR_STATUS,
      });
      lastAction.current = null;
    }

    return () => {
      cleanup();
    };
  }, [
    action,
    callback,
    changedState,
    changedStateFrom,
    continuous,
    controlled,
    controls,
    debug,
    index,
    lifecycle,
    previousState,
    previousStep,
    scrollToFirstStep,
    size,
    status,
    step,
    store,
  ]);
}
