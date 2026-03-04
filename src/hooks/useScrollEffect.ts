import { RefObject, useEffect, useRef } from 'react';

import { defaultProps } from '~/defaults';
import { EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { treeChanges } from '~/modules/changes';
import {
  getElement,
  getScrollParent,
  getScrollTargetToCenter,
  getScrollTo,
  hasCustomScrollParent,
  hasPosition,
  scrollDocument,
  scrollTo,
} from '~/modules/dom';
import { logDebug, mergeProps } from '~/modules/helpers';
import createStore from '~/modules/store';

import { EventHandler, Lifecycle, PositionData, Props, StepMerged, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

interface UseScrollEffectParams {
  onEvent: EventHandler | undefined;
  previousState: StoreState | undefined;
  props: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

function adjustForPlacement(
  scrollY: number,
  options: {
    beaconPosition: PositionData | null;
    lifecycle: Lifecycle;
    scrollOffset: number;
    step: StepMerged;
  },
): number {
  const { beaconPosition, lifecycle, scrollOffset, step } = options;
  let adjustedY = scrollY - step.spotlightPadding.top;

  if (lifecycle === LIFECYCLE.BEACON_BEFORE && beaconPosition?.placement) {
    const y = getMainAxisOffset(beaconPosition);

    if (!['bottom'].includes(beaconPosition.placement)) {
      adjustedY += Math.floor(y - scrollOffset);
    }
  } else if (lifecycle === LIFECYCLE.TOOLTIP_BEFORE) {
    const { placement } = step;

    if (placement === 'top') {
      const floaterElement = document.querySelector('.react-joyride__floater');
      const floaterHeight = floaterElement?.getBoundingClientRect().height ?? 0;
      const arrowSize = step.floatingOptions?.hideArrow ? 0 : step.styles.arrow.size;
      const gap = step.offset + step.spotlightPadding.top + arrowSize;

      adjustedY -= floaterHeight + gap;
    } else if (placement === 'left' || placement === 'right') {
      const floaterElement = document.querySelector('.react-joyride__floater');
      const floaterHeight = floaterElement?.getBoundingClientRect().height ?? 0;
      const targetEl = getElement(step.target);
      const targetHeight = targetEl?.getBoundingClientRect().height ?? 0;

      // After base scroll, the target center sits at this distance from viewport top
      const targetCenterY = scrollOffset + step.spotlightPadding.top + targetHeight / 2;
      // The floater is centered on the target, so its top edge would be here
      const floaterTopY = targetCenterY - floaterHeight / 2;

      if (floaterTopY < scrollOffset) {
        adjustedY -= scrollOffset - floaterTopY;
      }
    }
  }

  return Math.max(0, adjustedY);
}

function getMainAxisOffset(data: PositionData): number {
  const offsetData = data.middlewareData?.offset as { x: number; y: number } | undefined;

  if (!offsetData) {
    return 0;
  }

  return ['left', 'right'].some(p => data.placement.startsWith(p)) ? offsetData.x : offsetData.y;
}

export default function useScrollEffect({
  onEvent,
  previousState,
  props,
  state,
  step,
  store,
}: UseScrollEffectParams): void {
  const { index, lifecycle, positioned, scrolling, status } = state;
  const cancelScrollRef = useRef<(() => void) | null>(null);
  const stateRef = useRef(state);
  const previousStateRef = useRef(previousState);
  const propsRef = useRef(props);
  const stepRef = useRef(step);
  const onEventRef = useRef(onEvent);

  stateRef.current = state;
  previousStateRef.current = previousState;
  propsRef.current = props;
  stepRef.current = step;
  onEventRef.current = onEvent;

  useEffect(() => {
    return () => {
      cancelScrollRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (!previousStateRef.current || !stepRef.current) {
      return;
    }

    const { changedTo } = treeChanges(stateRef.current, previousStateRef.current);
    const currentStep = stepRef.current;
    const { debug, scrollDuration } = propsRef.current;

    const isBeforePhase =
      lifecycle === LIFECYCLE.BEACON_BEFORE || lifecycle === LIFECYCLE.TOOLTIP_BEFORE;

    if (status === STATUS.RUNNING && isBeforePhase && scrolling && changedTo('positioned', true)) {
      const target = getElement(currentStep.target);
      const beaconPosition = store.current.getPositionData('beacon');
      const hasCustomScroll = hasCustomScrollParent(target);
      const scrollParent = getScrollParent(target);

      logDebug({
        title: 'scrollToStep',
        data: [
          { key: 'index', value: index },
          { key: 'lifecycle', value: lifecycle },
          { key: 'status', value: status },
        ],
        debug,
      });

      cancelScrollRef.current?.();

      const fireScrollEvent = (
        type: typeof EVENTS.SCROLL_START | typeof EVENTS.SCROLL_END,
        scrollData: { duration: number; element: Element; initial: number; target: number },
      ) => {
        onEventRef.current?.({
          ...store.current.getEventState(),
          error: null,
          scroll: scrollData,
          step: currentStep,
          type,
        });
      };

      const handleScroll = async () => {
        if (hasCustomScroll && !hasPosition(scrollParent as HTMLElement)) {
          const pageElement = scrollDocument();
          const pageScrollY = getScrollTargetToCenter(scrollParent as Element);
          const pageScrollData = {
            initial: pageElement.scrollTop,
            target: pageScrollY,
            element: pageElement,
            duration: scrollDuration,
          };

          fireScrollEvent(EVENTS.SCROLL_START, pageScrollData);

          const { cancel: cancelPage, promise: pagePromise } = scrollTo(pageScrollY, {
            element: pageElement,
            duration: scrollDuration,
          });

          cancelScrollRef.current = cancelPage;
          await pagePromise;

          fireScrollEvent(EVENTS.SCROLL_END, pageScrollData);
        }

        const baseScrollY = Math.floor(getScrollTo(target, currentStep.scrollOffset)) || 0;
        const scrollY = hasCustomScroll
          ? baseScrollY
          : adjustForPlacement(baseScrollY, {
              beaconPosition,
              lifecycle,
              scrollOffset: currentStep.scrollOffset,
              step: currentStep,
            });

        const scrollElement = scrollParent as Element;
        const scrollData = {
          initial: scrollElement.scrollTop,
          target: scrollY,
          element: scrollElement,
          duration: scrollDuration,
        };

        fireScrollEvent(EVENTS.SCROLL_START, scrollData);

        const { cancel, promise } = scrollTo(scrollY, {
          element: scrollElement,
          duration: scrollDuration,
        });

        cancelScrollRef.current = cancel;
        await promise;

        fireScrollEvent(EVENTS.SCROLL_END, scrollData);
        store.current.updateState({ scrolling: false });
      };

      handleScroll().catch(() => {
        store.current.updateState({ scrolling: false });
      });
    }
  }, [index, lifecycle, positioned, scrolling, status, store]);
}
