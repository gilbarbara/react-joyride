import { RefObject, useEffect, useRef } from 'react';
import { useEffectDeepCompare } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import { LIFECYCLE, STATUS } from '~/literals';
import {
  getElement,
  getScrollParent,
  getScrollTo,
  hasCustomScrollParent,
  scrollTo,
} from '~/modules/dom';
import { logDebug, mergeProps, shouldScroll } from '~/modules/helpers';
import createStore from '~/modules/store';

import { Props, State, StepMerged } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

interface UseScrollEffectParams {
  previousState: State | undefined;
  props: MergedProps;
  state: State;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function useScrollEffect({
  previousState,
  props,
  state,
  step,
  store,
}: UseScrollEffectParams): void {
  const { debug, disableScrollParentFix, scrollDuration, scrollOffset, scrollToFirstStep } = props;
  const { index, lifecycle, status } = state;
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
    const shouldScrollToStep = shouldScroll({
      isFirstStep: index === 0,
      lifecycle,
      previousLifecycle: previousState.lifecycle,
      scrollToFirstStep,
      step,
      target,
    });
    const beaconPopper = store.current.getPopper('beacon');
    const tooltipPopper = store.current.getPopper('tooltip');

    if (status === STATUS.RUNNING && shouldScrollToStep) {
      const hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
      const scrollParent = getScrollParent(target, disableScrollParentFix);
      let scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;

      logDebug({
        title: 'scrollToStep',
        data: [
          { key: 'index', value: index },
          { key: 'lifecycle', value: lifecycle },
          { key: 'status', value: status },
        ],
        debug,
      });

      if (lifecycle === LIFECYCLE.BEACON && beaconPopper?.state?.placement) {
        const { modifiersData, placement } = beaconPopper.state;
        const y = modifiersData?.offset?.top?.y ?? 0;

        if (!['bottom'].includes(placement) && !hasCustomScroll) {
          scrollY = Math.floor(y - scrollOffset);
        }
      } else if (lifecycle === LIFECYCLE.TOOLTIP && tooltipPopper?.state?.placement) {
        const { modifiersData, placement } = tooltipPopper.state;
        const y = modifiersData?.offset?.top?.y ?? 0;
        const flipped = placement !== step.placement;

        if (['left', 'right', 'top'].includes(placement) && !flipped && !hasCustomScroll) {
          scrollY = Math.floor(y - scrollOffset);
        } else {
          scrollY -= step.spotlightPadding;
        }
      }

      scrollY = scrollY >= 0 ? scrollY : 0;

      cancelScrollRef.current?.();

      const { cancel, promise } = scrollTo(scrollY, {
        element: scrollParent as Element,
        duration: scrollDuration,
      });

      cancelScrollRef.current = cancel;

      promise
        .then(() => {
          setTimeout(() => {
            store.current.getPopper('tooltip')?.update();
          }, 10);
        })
        .catch(() => {
          // Scroll cancelled or element removed — safe to ignore
        });
    }
  }, [
    debug,
    disableScrollParentFix,
    index,
    lifecycle,
    previousState,
    scrollDuration,
    scrollOffset,
    scrollToFirstStep,
    status,
    step,
    store,
  ]);
}
