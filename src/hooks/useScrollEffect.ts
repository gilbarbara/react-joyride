import { RefObject, useEffect, useRef } from 'react';
import { useEffectDeepCompare } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import { LIFECYCLE, STATUS } from '~/literals';
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
type Value = import('tree-changes-hook').Value;

interface UseScrollEffectParams {
  changedState: (key?: string, actual?: Value, previous?: Value) => boolean;
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
    tooltipPosition: PositionData | null;
  },
): number {
  const { beaconPosition, lifecycle, scrollOffset, step, tooltipPosition } = options;
  let adjustedY = scrollY;

  if (lifecycle === LIFECYCLE.BEACON && beaconPosition?.placement) {
    const y = getMainAxisOffset(beaconPosition);

    if (!['bottom'].includes(beaconPosition.placement)) {
      adjustedY += Math.floor(y - scrollOffset);
    }
  } else if (lifecycle === LIFECYCLE.TOOLTIP && tooltipPosition?.placement) {
    const y = getMainAxisOffset(tooltipPosition);
    const flipped = tooltipPosition.placement !== step.placement;

    if (['left', 'right', 'top'].includes(tooltipPosition.placement) && !flipped) {
      adjustedY += Math.floor(y - scrollOffset);
    } else {
      adjustedY -= step.spotlightPadding;
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
  changedState,
  previousState,
  props,
  state,
  step,
  store,
}: UseScrollEffectParams): void {
  const { debug, scrollDuration } = props;
  const { index, lifecycle, scrolling, status } = state;
  const cancelScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelScrollRef.current?.();
    };
  }, []);

  useEffectDeepCompare(() => {
    if (!previousState || !step) {
      return;
    }

    const target = getElement(step.target);
    const beaconPosition = store.current.getPositionData('beacon');
    const tooltipPosition = store.current.getPositionData('tooltip');

    if (status === STATUS.RUNNING && changedState('scrolling', true)) {
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

        const baseScrollY = Math.floor(getScrollTo(target, step.scrollOffset)) || 0;
        const scrollY = adjustForPlacement(baseScrollY, {
          beaconPosition,
          lifecycle,
          scrollOffset: step.scrollOffset,
          step,
          tooltipPosition,
        });

        const { cancel, promise } = scrollTo(scrollY, {
          element: scrollParent as Element,
          duration: scrollDuration,
        });

        cancelScrollRef.current = cancel;
        await promise;

        store.current.updateState({ scrolling: false });
      };

      handleScroll().catch(() => {
        store.current.updateState({ scrolling: false });
      });
    }
  }, [
    changedState,
    debug,
    index,
    lifecycle,
    previousState,
    scrollDuration,
    scrolling,
    status,
    step,
    store,
  ]);
}
