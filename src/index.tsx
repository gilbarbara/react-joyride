import { useCallback, useEffect } from 'react';
import { useOnce } from '@gilbarbara/hooks';

import useJoyrideData from '~/hooks/useJoyrideData';
import { usePortalElement } from '~/hooks/usePortalElement';
import { LIFECYCLE, STATUS } from '~/literals';
import { canUseDOM } from '~/modules/dom';
import { logDebug } from '~/modules/helpers';

import Loader from '~/components/Loader';
import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import { Props } from '~/types';

function Joyride(props: Props) {
  const { mergedProps, state, step, store } = useJoyrideData(props);
  const { continuous, debug, nonce, portalElement, scrollToFirstStep } = mergedProps;

  const element = usePortalElement(portalElement);

  useOnce(() => {
    logDebug({
      title: 'init',
      data: [
        { key: 'props', value: mergedProps },
        { key: 'state', value: store.current.getState() },
      ],
      debug,
    });
  });

  const { index, lifecycle, status } = state;
  const isRunning = status === STATUS.RUNNING;

  // Handle keyboard
  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (!step || lifecycle !== LIFECYCLE.TOOLTIP) {
        return;
      }

      if (event.key === 'Escape' && !step.disableCloseOnEsc) {
        store.current.close('keyboard');
      }
    };

    document.body.addEventListener('keydown', handleKeyboard, { passive: true });

    return () => {
      document.body.removeEventListener('keydown', handleKeyboard);
    };
  }, [isRunning, lifecycle, step, store]);

  const handleClickOverlay = useCallback(() => {
    if (!step?.disableOverlayClose) {
      store.current.close('overlay');
    }
  }, [step?.disableOverlayClose, store]);

  if (!step || !isRunning) {
    return null;
  }

  return (
    <div className="react-joyride">
      {!state.waiting && (
        <Step
          {...state}
          continuous={continuous}
          debug={debug}
          helpers={store.current.getHelpers()}
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

export default function ReactJoyride(props: Props) {
  if (!canUseDOM()) {
    return null;
  }

  return <Joyride {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export * from './literals';
// eslint-disable-next-line react-refresh/only-export-components
export * from './types';
