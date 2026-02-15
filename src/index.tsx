import { ReactNode, useEffect } from 'react';
import { useOnce } from '@gilbarbara/hooks';

import useJoyrideData from '~/hooks/useJoyrideData';
import { usePortalElement } from '~/hooks/usePortalElement';
import { LIFECYCLE, STATUS } from '~/literals';
import { canUseDOM } from '~/modules/dom';
import { logDebug } from '~/modules/helpers';

import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import { Props } from '~/types';

export function Joyride(props: Props) {
  const { mergedProps, state, step, store } = useJoyrideData(props);
  const { continuous, debug, disableCloseOnEsc, nonce, portalElement, scrollToFirstStep, steps } =
    mergedProps;

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

  // Handle keyboard
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const currentStep = steps[state.index];

      if (state.lifecycle === LIFECYCLE.TOOLTIP) {
        if (event.code === 'Escape' && !currentStep.disableCloseOnEsc) {
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
  }, [disableCloseOnEsc, state.index, state.lifecycle, steps, store]);

  const { index, lifecycle, status } = state;
  const isRunning = status === STATUS.RUNNING;
  const content: Record<string, ReactNode> = {};

  const handleClickOverlay = () => {
    if (!step?.disableOverlayClose) {
      store.current.close('overlay');
    }
  };

  if (!step || !isRunning) {
    return null;
  }

  if (isRunning) {
    content.step = (
      <Step
        {...state}
        cleanupPoppers={store.current.cleanupPoppers}
        continuous={continuous}
        debug={debug}
        helpers={store.current.getHelpers()}
        nonce={nonce}
        portalElement={element}
        setPopper={store.current.setPopper}
        shouldScroll={!step.disableScrolling && (index !== 0 || scrollToFirstStep)}
        step={step}
        updateState={store.current.updateState}
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
          scrolling={state.scrolling}
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
