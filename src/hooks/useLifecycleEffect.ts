import { RefObject, useEffect, useRef } from 'react';

import { defaultProps } from '~/defaults';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { treeChanges } from '~/modules/changes';
import { getElement, isElementVisible } from '~/modules/dom';
import { hideBeacon, logDebug, mergeProps, needsScrolling, omit } from '~/modules/helpers';
import createStore from '~/modules/store';

import { Actions, Controls, Props, StepMerged, StepTarget, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

interface UseLifecycleEffectOptions {
  controls: Controls;
  previousState: StoreState | undefined;
  previousStep: StepMerged | null;
  props: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useLifecycleEffect(options: UseLifecycleEffectOptions): void {
  const { controls, previousState, previousStep, props, state, step, store } = options;
  const { action, index, lifecycle, size, status } = state;

  const lastAction = useRef<Actions | null>(null);
  const propsRef = useRef(props);
  const stateRef = useRef(state);
  const previousStateRef = useRef(previousState);
  const stepRef = useRef(step);
  const previousStepRef = useRef(previousStep);
  const controlsRef = useRef(controls);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingTargetRef = useRef<StepTarget | null>(null);
  const loaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const beforeRef = useRef<{ cancel: () => void } | null>(null);

  propsRef.current = props;
  stateRef.current = state;
  previousStateRef.current = previousState;
  stepRef.current = step;
  previousStepRef.current = previousStep;
  controlsRef.current = controls;

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

    if (beforeRef.current) {
      beforeRef.current.cancel();
      beforeRef.current = null;
    }
  };

  // Effect 1: Action tracking
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { changedTo } = treeChanges(stateRef.current, previousStateRef.current);

    const isAfterAction = changedTo('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction || (lastAction.current === ACTIONS.CLOSE && action === ACTIONS.START)) {
      lastAction.current = action;
    }
  }, [action]);

  // Effect 2: Target resolution (INIT → READY)
  useEffect(() => {
    if (!previousStateRef.current) {
      return () => {
        cleanup();
      };
    }

    const { changed } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;

    if (changed('index')) {
      cleanup();

      logDebug({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: propsRef.current }],
        debug: propsRef.current.debug,
      });
    }

    if (status !== STATUS.RUNNING || !currentStep || lifecycle !== LIFECYCLE.INIT) {
      return () => {
        cleanup();
      };
    }

    store.current.cleanupPositionData();

    if (currentStep.before && !beforeRef.current) {
      store.current.updateState({ waiting: true });

      const proceed = () => {
        beforeRef.current = null;
        store.current.updateState({
          action: lastAction.current ?? stateRef.current.action,
          waiting: false,
          lifecycle: LIFECYCLE.READY,
        });
      };

      const abortController = new AbortController();
      const timeout = currentStep.targetWaitTimeout;

      beforeRef.current = { cancel: () => abortController.abort() };

      const timeoutId = timeout
        ? setTimeout(() => {
            if (!abortController.signal.aborted) {
              abortController.abort();
              proceed();
            }
          }, timeout)
        : null;

      currentStep
        .before({ ...callbackState(), step: currentStep })
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
    } else if (!beforeRef.current) {
      if (pollingRef.current && pollingTargetRef.current !== currentStep.target) {
        cleanup();
      }

      const element = getElement(currentStep.target);
      const targetAvailable = element && isElementVisible(element);

      if (targetAvailable) {
        cleanup();
        store.current.updateState({
          action: lastAction.current ?? ACTIONS.UPDATE,
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        });
      } else if (currentStep.targetWaitTimeout === 0) {
        store.current.updateState({
          action: lastAction.current ?? ACTIONS.UPDATE,
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        });
      } else if (!pollingRef.current) {
        const timeout = currentStep.targetWaitTimeout ?? 150;
        const loaderDelay = currentStep.loaderDelay ?? 300;
        const startTime = Date.now();

        pollingTargetRef.current = currentStep.target;

        if (timeout > loaderDelay) {
          loaderTimeoutRef.current = setTimeout(() => {
            if (pollingRef.current && stateRef.current.lifecycle === LIFECYCLE.INIT) {
              store.current.updateState({ waiting: true });
            }
          }, loaderDelay);
        }

        pollingRef.current = setInterval(() => {
          const el = getElement(currentStep.target);
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

    return () => {
      cleanup();
    };
  }, [index, lifecycle, status, store]);

  // Effect 3: Step presentation (READY → BEACON/TOOLTIP) + target not found
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { changed, changedTo, previous } = treeChanges(
      stateRef.current,
      previousStateRef.current,
    );
    const currentStep = stepRef.current;

    if (!currentStep) {
      return;
    }

    const element = getElement(currentStep.target);
    const elementExists = !!element;

    // STEP_BEFORE callback + READY → BEACON/TOOLTIP transition
    if (elementExists && isElementVisible(element)) {
      if (changedTo('lifecycle', LIFECYCLE.READY) && previous.lifecycle === LIFECYCLE.INIT) {
        propsRef.current.callback?.({
          ...callbackState(),
          action: lastAction.current ?? stateRef.current.action,
          step: currentStep,
          type: EVENTS.STEP_BEFORE,
        });
      }

      if (changedTo('lifecycle', LIFECYCLE.READY)) {
        const currentState = stateRef.current;
        const targetLifecycle = hideBeacon(currentStep, currentState, propsRef.current.continuous)
          ? LIFECYCLE.TOOLTIP
          : LIFECYCLE.BEACON;

        const target = getElement(currentStep.target);
        const willScroll = needsScrolling({
          isFirstStep: currentState.index === 0,
          scrollToFirstStep: propsRef.current.scrollToFirstStep,
          step: currentStep,
          target,
          targetLifecycle,
        });

        store.current.updateState({
          action: ACTIONS.UPDATE,
          lifecycle: targetLifecycle,
          scrolling: willScroll,
        });
      }
    } else if (
      stateRef.current.status === STATUS.RUNNING &&
      lifecycle !== LIFECYCLE.INIT &&
      lifecycle !== LIFECYCLE.COMPLETE &&
      changed('lifecycle')
    ) {
      // TARGET_NOT_FOUND callback stays here because auto-advance is conditional on it
      // eslint-disable-next-line no-console
      console.warn(elementExists ? 'Target not visible' : 'Target not mounted', currentStep);

      propsRef.current.callback?.({
        ...callbackState(),
        type: EVENTS.TARGET_NOT_FOUND,
        step: currentStep,
      });

      const currentState = stateRef.current;

      if (!currentState.controlled) {
        store.current.updateState({
          action: ACTIONS.UPDATE,
          index: currentState.index + (currentState.action === ACTIONS.PREV ? -1 : 1),
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }
  }, [lifecycle, store]);

  // Effect 4: Lifecycle callbacks (BEACON, TOOLTIP, STEP_AFTER)
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { changedTo, previous } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;
    const previousStepValue = previousStepRef.current;

    if (currentStep && changedTo('lifecycle', LIFECYCLE.BEACON)) {
      propsRef.current.callback?.({
        ...callbackState(),
        step: currentStep,
        type: EVENTS.BEACON,
      });
    }

    if (currentStep && changedTo('lifecycle', LIFECYCLE.TOOLTIP)) {
      propsRef.current.callback?.({
        ...callbackState(),
        step: currentStep,
        type: EVENTS.TOOLTIP,
      });
    }

    const currentState = stateRef.current;
    const element = getElement(currentStep?.target);
    const elementExists = !!element;
    const isRunningOrPausedWithStep =
      currentState.status === STATUS.RUNNING ||
      (currentState.controlled && currentState.status === STATUS.PAUSED && !!currentStep);
    const callbackStep = currentStep ?? previousStepValue;
    const shouldSendCallback =
      isRunningOrPausedWithStep &&
      callbackStep &&
      changedTo('lifecycle', LIFECYCLE.COMPLETE) &&
      previous.lifecycle === LIFECYCLE.TOOLTIP &&
      (elementExists || !currentStep);

    if (shouldSendCallback) {
      propsRef.current.callback?.({
        ...callbackState(),
        action: lastAction.current ?? ACTIONS.UPDATE,
        index: previous.index ?? currentState.index,
        lifecycle: currentState.lifecycle,
        step: callbackStep,
        type: EVENTS.STEP_AFTER,
      });

      try {
        previousStepValue?.after?.({
          ...callbackState(),
          action: lastAction.current ?? ACTIONS.UPDATE,
          index: previous.index ?? currentState.index,
          lifecycle: currentState.lifecycle,
          step: previousStepValue,
        });
      } catch {
        // fire-and-forget: don't let user code break the tour
      }
    }
  }, [lifecycle]);

  // Effect 5: Tour flow + tour-level callbacks
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { changedTo, previous } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;
    const previousStepValue = previousStepRef.current;

    if (size && !currentStep && lifecycle === LIFECYCLE.INIT) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    if (
      !stateRef.current.controlled &&
      status === STATUS.RUNNING &&
      changedTo('lifecycle', LIFECYCLE.COMPLETE) &&
      index < size
    ) {
      store.current.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.INIT });
    }

    if (changedTo('lifecycle', LIFECYCLE.COMPLETE) && index >= size) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    const tourEndStep = previousStepValue ?? currentStep;

    if (tourEndStep && changedTo('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      propsRef.current.callback?.({
        ...callbackState(),
        index: previousStepValue ? index - 1 : index,
        step: tourEndStep,
        type: EVENTS.TOUR_END,
      });
      controlsRef.current.reset();
      lastAction.current = null;
    }

    if (
      currentStep &&
      changedTo('status', STATUS.RUNNING) &&
      ([STATUS.IDLE, STATUS.READY, STATUS.PAUSED] as string[]).includes(previous.status)
    ) {
      propsRef.current.callback?.({
        ...callbackState(),
        step: currentStep,
        type: EVENTS.TOUR_START,
      });
    }

    if (currentStep && changedTo('action', ACTIONS.STOP)) {
      lastAction.current = null;
      propsRef.current.callback?.({
        ...callbackState(),
        step: currentStep,
        type: EVENTS.TOUR_STATUS,
      });
    }

    if (currentStep && changedTo('action', ACTIONS.RESET)) {
      propsRef.current.callback?.({
        ...callbackState(),
        step: currentStep,
        type: EVENTS.TOUR_STATUS,
      });
      lastAction.current = null;
    }
  }, [action, index, lifecycle, size, status, store]);
}
