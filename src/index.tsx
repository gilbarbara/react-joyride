import { ReactNode, useEffect, useMemo } from 'react';
import { useOnce } from '@gilbarbara/hooks';

import { defaultProps } from '~/defaults';
import useJoyrideData from '~/hooks/useJoyrideData';
import { usePortalElement } from '~/hooks/usePortalElement';
import { LIFECYCLE, STATUS } from '~/literals';
import { canUseDOM } from '~/modules/dom';
import { logDebug, mergeProps } from '~/modules/helpers';
import { getMergedStep } from '~/modules/step';

import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import { Props } from '~/types';

export function Joyride(props: Props) {
  const mergedProps = mergeProps(defaultProps, props);
  const { continuous, debug, disableCloseOnEsc, nonce, portalElement, scrollToFirstStep, steps } =
    mergedProps;
  const store = useJoyrideData(mergedProps);

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
      const { index, lifecycle } = store.current.getState();
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
  }, [disableCloseOnEsc, steps, store]);

  const { index, lifecycle, status } = store.current.getState();
  const isRunning = status === STATUS.RUNNING;
  const content: Record<string, ReactNode> = {};
  const step = useMemo(() => getMergedStep(mergedProps, steps[index]), [index, mergedProps, steps]);

  const handleClickOverlay = () => {
    if (!step?.disableOverlayClose) {
      store.current.close('overlay');
    }
  };

  if (!step) {
    return null;
  }

  if (isRunning) {
    content.step = (
      <Step
        {...store.current.getState()}
        cleanupPoppers={store.current.cleanupPoppers}
        continuous={continuous}
        debug={debug}
        helpers={store.current.getHelpers()}
        nonce={nonce}
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
