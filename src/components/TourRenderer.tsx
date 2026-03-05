import { type RefObject, useCallback, useEffect } from 'react';

import { usePortalElement } from '~/hooks/usePortalElement';
import type { MergedProps } from '~/hooks/useTourEngine';
import { LIFECYCLE, STATUS } from '~/literals';
import createStore from '~/modules/store';

import Loader from '~/components/Loader';
import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import type { Controls, StepMerged, StoreState } from '~/types';

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

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (!step || lifecycle !== LIFECYCLE.TOOLTIP) {
        return;
      }

      if (event.key === 'Escape' && !step.disableCloseOnEsc) {
        controls.close('keyboard');
      }
    };

    document.body.addEventListener('keydown', handleKeyboard, { passive: true });

    return () => {
      document.body.removeEventListener('keydown', handleKeyboard);
    };
  }, [controls, isRunning, lifecycle, step]);

  const handleClickOverlay = useCallback(() => {
    if (!step?.disableOverlayClose) {
      controls.close('overlay');
    }
  }, [controls, step?.disableOverlayClose]);

  if (!step || !isRunning) {
    return null;
  }

  return (
    <div className="react-joyride">
      {!state.waiting && (
        <Step
          {...state}
          continuous={continuous}
          controls={controls}
          debug={debug}
          nonce={nonce}
          portalElement={element}
          setPositionData={store.current.setPositionData}
          shouldScroll={!step.disableScrolling && (index !== 0 || scrollToFirstStep)}
          step={step}
          updateState={store.current.updateState}
        />
      )}
      <Portal element={element}>
        <>
          {state.waiting && <Loader nonce={nonce} step={step} />}
          <Overlay
            {...step}
            continuous={continuous}
            debug={debug}
            lifecycle={lifecycle}
            onClickOverlay={handleClickOverlay}
            scrolling={state.scrolling}
            waiting={state.waiting}
          />
        </>
      </Portal>
    </div>
  );
}
