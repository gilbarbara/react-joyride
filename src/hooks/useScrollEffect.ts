import { RefObject, useEffect, useRef } from 'react';
import { Props as FloaterProps } from 'react-floater';
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

import { Lifecycle, Props, StepMerged, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;
type PopperData = Parameters<NonNullable<FloaterProps['getPopper']>>[0];
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
    beaconPopper: PopperData | null;
    lifecycle: Lifecycle;
    scrollOffset: number;
    step: StepMerged;
    tooltipPopper: PopperData | null;
  },
): number {
  const { beaconPopper, lifecycle, scrollOffset, step, tooltipPopper } = options;
  let adjustedY = scrollY;

  if (lifecycle === LIFECYCLE.BEACON && beaconPopper?.state?.placement) {
    const { modifiersData, placement } = beaconPopper.state;
    const y = modifiersData?.offset?.top?.y ?? 0;

    if (!['bottom'].includes(placement)) {
      adjustedY += Math.floor(y - scrollOffset);
    }
  } else if (lifecycle === LIFECYCLE.TOOLTIP && tooltipPopper?.state?.placement) {
    const { modifiersData, placement } = tooltipPopper.state;
    const y = modifiersData?.offset?.top?.y ?? 0;
    const flipped = placement !== step.placement;

    if (['left', 'right', 'top'].includes(placement) && !flipped) {
      adjustedY += Math.floor(y - scrollOffset);
    } else {
      adjustedY -= step.spotlightPadding;
    }
  }

  return Math.max(0, adjustedY);
}

export default function useScrollEffect({
  changedState,
  previousState,
  props,
  state,
  step,
  store,
}: UseScrollEffectParams): void {
  const { debug, scrollDuration, scrollOffset } = props;
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
    const beaconPopper = store.current.getPopper('beacon');
    const tooltipPopper = store.current.getPopper('tooltip');

    if (status === STATUS.RUNNING && scrolling && changedState('scrolling', true)) {
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

        const baseScrollY = Math.floor(getScrollTo(target, scrollOffset)) || 0;
        const scrollY = adjustForPlacement(baseScrollY, {
          beaconPopper,
          lifecycle,
          scrollOffset,
          step,
          tooltipPopper,
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
    scrollOffset,
    scrolling,
    status,
    step,
    store,
  ]);
}
