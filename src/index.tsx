import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import isEqual from '@gilbarbara/deep-equal';
import { useMount, usePrevious, useSingleton, useUpdateEffect } from '@gilbarbara/hooks';
import is from 'is-lite';
import treeChanges from 'tree-changes';

import {
  canUseDOM,
  getElement,
  getScrollParent,
  getScrollTo,
  hasCustomScrollParent,
  scrollTo,
} from '~/modules/dom';
import { log, mergeProps, shouldScroll } from '~/modules/helpers';
import { getMergedStep, validateSteps } from '~/modules/step';
import createStore from '~/modules/store';
import { usePortalElement } from '~/modules/usePortalElement';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';

import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import { defaultProps } from '~/defaults';
import { Actions, Props, State, Status, StoreHelpers } from '~/types';

function getStore(props: Props) {
  const { run = true, stepIndex } = props;

  return createStore({
    ...props,
    controlled: run && is.number(stepIndex),
  });
}

export default function ReactJoyride(props: Props) {
  const {
    callback,
    continuous,
    debug,
    disableCloseOnEsc,
    disableScrollParentFix,
    getHelpers,
    nonce,
    portalElement,
    run,
    scrollDuration,
    scrollOffset = 20,
    scrollToFirstStep,
    stepIndex,
    steps,
  } = mergeProps(defaultProps, props);
  const store = useRef<ReturnType<typeof createStore>>(getStore(props));
  const helpers = useRef<StoreHelpers>(store.current.getHelpers());
  const [state, setState] = useState<State>(store.current.getState());
  const previousProps = usePrevious(props);
  const previousState = usePrevious(state);
  const element = usePortalElement(portalElement);

  const scrollToStep = useCallback(
    (lastState: State) => {
      const { index, lifecycle, status } = state;
      const step = getMergedStep(props, steps[index]);

      const target = getElement(step.target);
      const shouldScrollToStep = shouldScroll({
        isFirstStep: index === 0,
        lifecycle,
        previousLifecycle: lastState.lifecycle,
        scrollToFirstStep,
        step,
        target,
      });

      if (status === STATUS.RUNNING && shouldScrollToStep) {
        const hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
        const scrollParent = getScrollParent(target, disableScrollParentFix);
        let scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;

        log({
          title: 'scrollToStep',
          data: [
            { key: 'index', value: index },
            { key: 'lifecycle', value: lifecycle },
            { key: 'status', value: status },
          ],
          debug,
        });

        const beaconPopper = store.current.getPopper('beacon');
        const tooltipPopper = store.current.getPopper('tooltip');

        if (lifecycle === LIFECYCLE.BEACON && beaconPopper) {
          const { modifiersData, placement } = beaconPopper.state ?? {};
          const { offset } = modifiersData ?? {};
          const y = offset?.top?.y ?? 0;

          if (!['bottom'].includes(placement) && !hasCustomScroll) {
            scrollY = Math.floor(y - scrollOffset);
          }
        } else if (lifecycle === LIFECYCLE.TOOLTIP && tooltipPopper) {
          const { modifiersData, placement } = tooltipPopper.state ?? {};
          const { offset } = modifiersData ?? {};
          const y = offset?.top?.y ?? 0;
          const flipped = !!placement && placement !== step.placement;

          if (['top', 'right', 'left'].includes(placement) && !flipped && !hasCustomScroll) {
            scrollY = Math.floor(y - scrollOffset);
          } else {
            scrollY -= step.spotlightPadding;
          }
        }

        scrollY = scrollY >= 0 ? scrollY : 0;

        if (status === STATUS.RUNNING) {
          scrollTo(scrollY, { element: scrollParent as Element, duration: scrollDuration }).then(
            () => {
              setTimeout(() => {
                store.current.getPopper('tooltip')?.update();
              }, 10);
            },
          );
        }
      }
    },
    [
      debug,
      disableScrollParentFix,
      props,
      scrollDuration,
      scrollOffset,
      scrollToFirstStep,
      state,
      steps,
    ],
  );

  const syncState = (nextState: State) => {
    setState(nextState);
  };

  useSingleton(() => {
    log({
      title: 'init',
      data: [
        { key: 'props', value: props },
        { key: 'state', value: store.current.getState() },
      ],
      debug,
    });

    store.current.addListener(syncState);

    if (getHelpers) {
      getHelpers(helpers.current);
    }
  });

  useMount(() => {
    if (!canUseDOM()) {
      return;
    }

    if (steps.length && validateSteps(steps, debug) && run) {
      store.current.start();
    }
  });

  // Handle keyboard
  useEffect(() => {
    if (!canUseDOM()) {
      return () => {};
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      const { index, lifecycle } = state;
      const step = steps[index];

      if (lifecycle === LIFECYCLE.TOOLTIP) {
        if (event.code === 'Escape' && !step.disableCloseOnEsc) {
          store.current.close('keyboard');
        }
      }
    };

    if (!disableCloseOnEsc) {
      document.body.addEventListener('keydown', handleKeyboard, { passive: true });
    }

    return () => {
      if (!disableCloseOnEsc) {
        document.body.removeEventListener('keydown', handleKeyboard);
      }
    };
  }, [disableCloseOnEsc, state, steps]);

  useUpdateEffect(() => {
    if (!canUseDOM() || !previousProps || !previousState) {
      return;
    }

    const { action, controlled, index, status } = state;
    const { stepIndex: previousStepIndex, steps: previousSteps } = previousProps;
    const { reset, setSteps, start, stop, update } = store.current;
    const { changed: changedProps } = treeChanges(previousProps, props);
    const { changed, changedFrom } = treeChanges(previousState, state);
    const step = getMergedStep(props, steps[index]);

    const stepsChanged = !isEqual(previousSteps, steps);
    const stepIndexChanged = is.number(stepIndex) && changedProps('stepIndex');
    const target = getElement(step.target);

    if (stepsChanged) {
      if (validateSteps(steps, debug)) {
        setSteps(steps);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Steps are not valid', steps);
      }
    }

    if (changedProps('run')) {
      if (run) {
        start(stepIndex);
      } else {
        stop();
      }
    }

    if (stepIndexChanged) {
      let nextAction: Actions =
        is.number(previousStepIndex) && previousStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;

      if (action === ACTIONS.STOP) {
        nextAction = ACTIONS.START;
      }

      if (!([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
        update({
          action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
          index: stepIndex,
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }

    // Update the index if the first step is not found
    if (!controlled && status === STATUS.RUNNING && index === 0 && !target) {
      update({ index: index + 1 });
      callback?.({
        ...state,
        type: EVENTS.TARGET_NOT_FOUND,
        step,
      });
    }

    const callbackData = {
      ...state,
      index,
      step,
    };
    const isAfterAction = changed('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction && changed('status', STATUS.PAUSED)) {
      const previousStep = getMergedStep(props, steps[previousState.index]);

      callback?.({
        ...callbackData,
        index: previousState.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousStep,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (changed('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      const previousStep = getMergedStep(props, steps[previousState.index]);

      if (!controlled) {
        callback?.({
          ...callbackData,
          index: previousState.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: previousStep,
          type: EVENTS.STEP_AFTER,
        });
      }

      callback?.({
        ...callbackData,
        type: EVENTS.TOUR_END,
        // Return the last step when the tour is finished
        step: previousStep,
        index: previousState.index,
      });
      reset();
    } else if (changedFrom('status', [STATUS.IDLE, STATUS.READY], STATUS.RUNNING)) {
      callback?.({
        ...callbackData,
        type: EVENTS.TOUR_START,
      });
    } else if (changed('status') || changed('action', ACTIONS.RESET)) {
      callback?.({
        ...callbackData,
        type: EVENTS.TOUR_STATUS,
      });
    }

    scrollToStep(previousState);
  }, [
    callback,
    debug,
    previousProps,
    previousState,
    props,
    run,
    scrollToStep,
    state,
    stepIndex,
    steps,
  ]);

  if (!canUseDOM()) {
    return null;
  }

  const handleClickOverlay = () => {
    const { index } = state;

    const step = getMergedStep(props, steps[index]);

    if (!step.disableOverlayClose) {
      helpers.current.close('overlay');
    }
  };

  const { index, lifecycle, status } = state;
  const isRunning = status === STATUS.RUNNING;
  const content: Record<string, ReactNode> = {};

  if (isRunning && steps[index]) {
    const step = getMergedStep(props, steps[index]);

    content.step = (
      <Step
        {...state}
        callback={callback}
        continuous={continuous}
        debug={debug}
        helpers={helpers.current}
        nonce={nonce}
        shouldScroll={!step.disableScrolling && (index !== 0 || scrollToFirstStep)}
        step={step}
        store={store.current}
      />
    );

    content.overlay = (
      <Portal element={element}>
        <Overlay
          {...step}
          continuous={continuous}
          debug={debug}
          lifecycle={lifecycle}
          onClickOverlay={handleClickOverlay}
        />
      </Portal>
    );
  }

  return (
    <div className="react-joyride">
      {content.step}
      {content.overlay}
    </div>
  );
}

export * from './literals';
export * from './types';
