import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { usePortalElement } from '~/hooks/usePortalElement';
import type { MergedProps } from '~/hooks/useTourEngine';
import { ACTIONS, LIFECYCLE, ORIGIN, STATUS } from '~/literals';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

import Loader from '~/components/Loader';
import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import type { Controls, StepMerged } from '~/types';

interface TourRendererProps {
  controls: Controls;
  mergedProps: MergedProps;
  state: StoreState;
  step: StepMerged | null;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function TourRenderer({
  controls,
  mergedProps,
  state,
  step,
  store,
}: TourRendererProps) {
  const { continuous, debug, nonce, portalElement, scrollToFirstStep } = mergedProps;

  const element = usePortalElement(portalElement);

  const { index, lifecycle, status } = state;
  const isRunning = status === STATUS.RUNNING;

  const [showLoader, setShowLoader] = useState(false);
  const loaderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaderDelay = step?.loaderDelay ?? 0;

  useEffect(() => {
    if (state.waiting) {
      if (loaderDelay === 0) {
        setShowLoader(true);
      } else {
        loaderTimerRef.current = setTimeout(() => {
          setShowLoader(true);
        }, loaderDelay);
      }
    } else {
      setShowLoader(false);
    }

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [loaderDelay, state.waiting]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (!step || lifecycle !== LIFECYCLE.TOOLTIP) {
        return;
      }

      if (event.key === 'Escape' && step.dismissKeyAction) {
        if (step.dismissKeyAction === 'next') {
          controls.next();
        } else {
          controls.close(ORIGIN.KEYBOARD);
        }
      }
    };

    document.body.addEventListener('keydown', handleKeyboard, { passive: true });

    return () => {
      document.body.removeEventListener('keydown', handleKeyboard);
    };
  }, [controls, isRunning, lifecycle, step]);

  const handleClickOverlay = useCallback(() => {
    if (step?.overlayClickAction === 'close') {
      controls.close(ORIGIN.OVERLAY);
    } else if (step?.overlayClickAction === 'next') {
      controls.next();
    }
  }, [controls, step?.overlayClickAction]);

  if (!step || !isRunning) {
    return null;
  }

  /*
  Hide the overlay when the tour starts, and a beacon will be shown.
  Prevent the overlay from flashing before the beacon is rendered.
   */
  const hideOverlay =
    state.action === ACTIONS.START && !step.skipBeacon && step.placement !== 'center';

  return (
    <>
      {lifecycle !== LIFECYCLE.INIT && (
        <Step
          {...state}
          continuous={continuous}
          controls={controls}
          debug={debug}
          nonce={nonce}
          portalElement={element}
          setPositionData={store.current.setPositionData}
          shouldScroll={!step.skipScroll && (index !== 0 || scrollToFirstStep)}
          step={step}
          updateState={store.current.updateState}
        />
      )}
      <Portal element={element}>
        <>
          {showLoader && <Loader nonce={nonce} step={step} />}
          {!hideOverlay && (
            <Overlay
              {...step}
              continuous={continuous}
              lifecycle={lifecycle}
              onClickOverlay={handleClickOverlay}
              portalElement={portalElement ? element : null}
              scrolling={state.scrolling}
              waiting={state.waiting}
            />
          )}
        </>
      </Portal>
    </>
  );
}
