import { type RefObject, useEffect, useRef } from 'react';
import { usePrevious } from '@gilbarbara/hooks';

import type { EmitEvent } from '~/hooks/useEventEmitter';
import type { MergedProps } from '~/hooks/useTourEngine';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { treeChanges } from '~/modules/changes';
import { getElement, isElementVisible } from '~/modules/dom';
import { log, needsScrolling, shouldHideBeacon } from '~/modules/helpers';
import { getMergedStep } from '~/modules/step';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

import type { Actions, Controls, StepMerged, StepTarget } from '~/types';

interface UseLifecycleEffectOptions {
  controls: Controls;
  emitEvent: EmitEvent;
  previousState: StoreState | undefined;
  props: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useLifecycleEffect(options: UseLifecycleEffectOptions): void {
  const { controls, emitEvent, previousState, props, state, step, store } = options;
  const { action, index, lifecycle, positioned, scrolling, size, status } = state;

  const previousStep = usePrevious(step) ?? null;

  const lastAction = useRef<Actions | null>(null);
  const propsRef = useRef(props);
  const stateRef = useRef(state);
  const previousStateRef = useRef(previousState);
  const stepRef = useRef(step);
  const previousStepRef = useRef(previousStep);
  const controlsRef = useRef(controls);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingTargetRef = useRef<StepTarget | null>(null);
  const beforeRef = useRef<{ cancel: () => void } | null>(null);

  propsRef.current = props;
  stateRef.current = state;
  previousStateRef.current = previousState;
  stepRef.current = step;
  previousStepRef.current = previousStep;
  controlsRef.current = controls;

  const cleanup = () => {
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

    const { hasChangedTo } = treeChanges(stateRef.current, previousStateRef.current);

    const isAfterAction = hasChangedTo('action', [
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

    const { hasChanged } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;

    if (hasChanged('index')) {
      cleanup();
    }

    if (status !== STATUS.RUNNING || !currentStep || lifecycle !== LIFECYCLE.INIT) {
      return () => {
        cleanup();
      };
    }

    // Fire tour:start before any step processing when status just changed to RUNNING
    const { hasChangedTo: hasStatusChangedTo } = treeChanges(
      stateRef.current,
      previousStateRef.current,
    );

    if (
      hasStatusChangedTo('status', STATUS.RUNNING) &&
      ([STATUS.IDLE, STATUS.READY, STATUS.PAUSED] as string[]).includes(
        previousStateRef.current.status,
      )
    ) {
      emitEvent(EVENTS.TOUR_START, currentStep);
    }

    store.current.cleanupPositionData();

    const { debug } = propsRef.current;

    if (currentStep.before && !beforeRef.current) {
      log(debug, `step:${index}`, 'before()', currentStep);
      beforeRef.current = { cancel: () => {} };

      store.current.updateState({ waiting: true });

      emitEvent(EVENTS.STEP_BEFORE_HOOK, currentStep, {
        action: lastAction.current ?? stateRef.current.action,
      });

      const proceed = () => {
        beforeRef.current = null;
        store.current.updateState({
          action: lastAction.current ?? stateRef.current.action,
          waiting: false,
          lifecycle: LIFECYCLE.READY,
        });
      };

      const abortController = new AbortController();
      const timeout = currentStep.beforeTimeout;

      beforeRef.current = { cancel: () => abortController.abort() };

      const timeoutId = timeout
        ? setTimeout(() => {
            if (!abortController.signal.aborted) {
              log(debug, `step:${index}`, 'before()', 'timed out', `${timeout}ms`);
              abortController.abort();
              emitEvent(EVENTS.ERROR, currentStep, {
                error: new Error('Step before hook timed out'),
              });
              proceed();
            }
          }, timeout)
        : null;

      currentStep
        .before({
          ...store.current.getState(),
          action: lastAction.current ?? store.current.getState().action,
          step: currentStep,
        })
        .then(() => {
          if (!abortController.signal.aborted) {
            if (timeoutId) clearTimeout(timeoutId);
            proceed();
          }
        })
        .catch((error: unknown) => {
          if (!abortController.signal.aborted) {
            if (timeoutId) clearTimeout(timeoutId);
            emitEvent(EVENTS.ERROR, currentStep, {
              error: error instanceof Error ? error : new Error(String(error)),
            });
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
        const { targetWaitTimeout } = currentStep;

        const startTime = Date.now();

        pollingTargetRef.current = currentStep.target;
        log(debug, `step:${index}`, 'polling', 'started', `${targetWaitTimeout}ms`);

        store.current.updateState({ waiting: true });

        pollingRef.current = setInterval(() => {
          const el = getElement(currentStep.target);
          const elapsed = Date.now() - startTime;
          const timedOut = elapsed >= targetWaitTimeout;

          if ((el && isElementVisible(el)) || timedOut) {
            log(
              debug,
              `step:${index}`,
              'polling',
              el && isElementVisible(el) ? 'found' : 'timed out',
              `${elapsed}ms`,
            );
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
  }, [emitEvent, index, lifecycle, status, store]);

  // Effect 3: Step presentation (READY → *_BEFORE → BEACON/TOOLTIP) + target not found
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { hasChanged, hasChangedTo, previous } = treeChanges(
      stateRef.current,
      previousStateRef.current,
    );
    const currentStep = stepRef.current;

    if (!currentStep) {
      return;
    }

    const element = getElement(currentStep.target);
    const elementExists = !!element;

    if (elementExists && isElementVisible(element)) {
      if (hasChangedTo('lifecycle', LIFECYCLE.READY) && previous.lifecycle === LIFECYCLE.INIT) {
        emitEvent(EVENTS.STEP_BEFORE, currentStep, {
          action: lastAction.current ?? stateRef.current.action,
        });
      }

      if (hasChangedTo('lifecycle', LIFECYCLE.READY)) {
        const currentState = stateRef.current;
        const finalLifecycle = shouldHideBeacon(
          currentStep,
          currentState,
          propsRef.current.continuous,
        )
          ? LIFECYCLE.TOOLTIP
          : LIFECYCLE.BEACON;

        const target = getElement(
          currentStep.scrollTarget ?? currentStep.spotlightTarget ?? currentStep.target,
        );
        const willScroll = needsScrolling({
          isFirstStep: currentState.index === 0,
          scrollToFirstStep: propsRef.current.scrollToFirstStep,
          step: currentStep,
          target,
          targetLifecycle: finalLifecycle,
        });

        const beforeLifecycle =
          finalLifecycle === LIFECYCLE.TOOLTIP ? LIFECYCLE.TOOLTIP_BEFORE : LIFECYCLE.BEACON_BEFORE;

        log(propsRef.current.debug, `step:${index}`, 'scroll', willScroll ? 'needed' : 'skipped');

        store.current.updateState({
          action: ACTIONS.UPDATE,
          lifecycle: beforeLifecycle,
          scrolling: willScroll,
        });
      }
    } else if (
      stateRef.current.status === STATUS.RUNNING &&
      lifecycle !== LIFECYCLE.INIT &&
      lifecycle !== LIFECYCLE.COMPLETE &&
      hasChanged('lifecycle')
    ) {
      log(
        propsRef.current.debug,
        `step:${index}`,
        elementExists ? 'Target not visible' : 'Target not mounted',
        currentStep,
      );

      emitEvent(EVENTS.TARGET_NOT_FOUND, currentStep);

      const currentState = stateRef.current;

      if (!currentState.controlled) {
        store.current.updateState({
          action: ACTIONS.UPDATE,
          index: currentState.index + (currentState.action === ACTIONS.PREV ? -1 : 1),
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }
  }, [emitEvent, index, lifecycle, store]);

  // Effect 4: *_BEFORE → BEACON/TOOLTIP transition + lifecycle callbacks
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { hasChangedTo, previous } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;
    const previousStepValue = previousStepRef.current;

    // BEACON → TOOLTIP_BEFORE: check if scroll adjustment is needed
    if (
      currentStep &&
      hasChangedTo('lifecycle', LIFECYCLE.TOOLTIP_BEFORE) &&
      previous.lifecycle === LIFECYCLE.BEACON
    ) {
      const target = getElement(
        currentStep.scrollTarget ?? currentStep.spotlightTarget ?? currentStep.target,
      );
      const willScroll = needsScrolling({
        isFirstStep: stateRef.current.index === 0,
        scrollToFirstStep: propsRef.current.scrollToFirstStep,
        step: currentStep,
        target,
        targetLifecycle: LIFECYCLE.TOOLTIP,
      });

      if (willScroll) {
        store.current.updateState({ scrolling: true, positioned: false });

        return;
      }
    }

    // *_BEFORE → BEACON/TOOLTIP when scroll is done
    const isBeforePhase =
      lifecycle === LIFECYCLE.BEACON_BEFORE || lifecycle === LIFECYCLE.TOOLTIP_BEFORE;

    if (currentStep && isBeforePhase && !scrolling) {
      const finalLifecycle =
        lifecycle === LIFECYCLE.TOOLTIP_BEFORE ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON;

      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: finalLifecycle,
      });
    }

    if (currentStep && hasChangedTo('lifecycle', LIFECYCLE.BEACON)) {
      emitEvent(EVENTS.BEACON, currentStep);
    }

    if (currentStep && hasChangedTo('lifecycle', LIFECYCLE.TOOLTIP)) {
      emitEvent(EVENTS.TOOLTIP, currentStep);
    }

    const currentState = stateRef.current;
    const isRunningOrPausedWithStep =
      currentState.status === STATUS.RUNNING ||
      (currentState.controlled && currentState.status === STATUS.PAUSED && !!currentStep);
    const shouldFireStepAfter =
      isRunningOrPausedWithStep &&
      previousStepValue &&
      hasChangedTo('lifecycle', LIFECYCLE.COMPLETE) &&
      previous.lifecycle === LIFECYCLE.TOOLTIP;

    if (shouldFireStepAfter) {
      emitEvent(EVENTS.STEP_AFTER, previousStepValue, {
        action: lastAction.current ?? ACTIONS.UPDATE,
        index: previous.index ?? currentState.index,
        lifecycle: currentState.lifecycle,
      });

      if (previousStepValue.after) {
        emitEvent(EVENTS.STEP_AFTER_HOOK, previousStepValue, {
          action: lastAction.current ?? ACTIONS.UPDATE,
          index: previous.index ?? currentState.index,
          lifecycle: currentState.lifecycle,
        });

        try {
          previousStepValue.after({
            ...store.current.getState(),
            action: lastAction.current ?? ACTIONS.UPDATE,
            index: previous.index ?? currentState.index,
            lifecycle: currentState.lifecycle,
            step: previousStepValue,
          });
        } catch {
          // fire-and-forget: don't let user code break the tour
        }
      }
    }
  }, [emitEvent, lifecycle, positioned, scrolling, store]);

  // Effect 5: Tour flow + tour-level callbacks
  useEffect(() => {
    if (!previousStateRef.current) {
      return;
    }

    const { hasChangedTo, previous } = treeChanges(stateRef.current, previousStateRef.current);
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
      hasChangedTo('lifecycle', LIFECYCLE.COMPLETE) &&
      index < size
    ) {
      store.current.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.INIT });
    }

    if (hasChangedTo('lifecycle', LIFECYCLE.COMPLETE) && index >= size) {
      store.current.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
      });
    }

    const tourEndStep =
      currentStep ??
      previousStepValue ??
      getMergedStep(propsRef.current, propsRef.current.steps[index - 1]);

    if (tourEndStep && hasChangedTo('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      const tourEndIndex = currentStep
        ? index
        : previousStepValue
          ? (previous.index ?? index)
          : index - 1;

      emitEvent(EVENTS.TOUR_END, tourEndStep, { index: tourEndIndex });

      if (!stateRef.current.controlled) {
        controlsRef.current.reset();
      }

      lastAction.current = null;
    }

    // tour:start is emitted in Effect 2 (before step processing) to ensure correct event order

    if (currentStep && hasChangedTo('action', ACTIONS.STOP)) {
      lastAction.current = null;
      emitEvent(EVENTS.TOUR_STATUS, currentStep);
    }

    if (currentStep && hasChangedTo('action', ACTIONS.RESET)) {
      emitEvent(EVENTS.TOUR_STATUS, currentStep);
      lastAction.current = null;
    }
  }, [action, emitEvent, index, lifecycle, size, status, store]);
}
