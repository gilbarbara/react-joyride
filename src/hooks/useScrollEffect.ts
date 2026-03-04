import { RefObject, useEffect, useRef } from 'react';

import { defaultProps } from '~/defaults';
import { LIFECYCLE, STATUS } from '~/literals';
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

import { Lifecycle, PositionData, Props, StepMerged, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

interface UseScrollEffectParams {
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

  if (lifecycle === LIFECYCLE.BEACON && beaconPosition?.placement) {
    const y = getMainAxisOffset(beaconPosition);

    if (!['bottom'].includes(beaconPosition.placement)) {
      adjustedY += Math.floor(y - scrollOffset);
    }
  } else if (lifecycle === LIFECYCLE.TOOLTIP) {
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

  stateRef.current = state;
  previousStateRef.current = previousState;
  propsRef.current = props;
  stepRef.current = step;

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

    if (status === STATUS.RUNNING && scrolling && changedTo('positioned', true)) {
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

      const handleScroll = async () => {
        if (hasCustomScroll && !hasPosition(scrollParent as HTMLElement)) {
          const pageScrollY = getScrollTargetToCenter(scrollParent as Element);

          const { cancel: cancelPage, promise: pagePromise } = scrollTo(pageScrollY, {
            element: scrollDocument(),
            duration: scrollDuration,
          });

          cancelScrollRef.current = cancelPage;
          await pagePromise;
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

        const { cancel, promise } = scrollTo(scrollY, {
          element: scrollParent as Element,
          duration: scrollDuration,
        });

        cancelScrollRef.current = cancel;
        await promise;

        store.current.updateState({ positioned: false, scrolling: false });
      };

      handleScroll().catch(() => {
        store.current.updateState({ positioned: false, scrolling: false });
      });
    }
  }, [index, lifecycle, positioned, scrolling, status, store]);
}
