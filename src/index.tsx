import { ReactNode, useEffect, useMemo } from 'react';
import { useSingleton } from '@gilbarbara/hooks';

import { canUseDOM } from '~/modules/dom';
import { log, mergeProps } from '~/modules/helpers';
import { getMergedStep } from '~/modules/step';
import useJoyrideData from '~/modules/useJoyrideData';
import { usePortalElement } from '~/modules/usePortalElement';

import { LIFECYCLE, STATUS } from '~/literals';

import Overlay from '~/components/Overlay';
import Portal from '~/components/Portal';
import Step from '~/components/Step';

import { defaultProps } from '~/defaults';
import { Props } from '~/types';

export function Joyride(props: Props) {
  const mergedProps = mergeProps(defaultProps, props);
  const { continuous, debug, disableCloseOnEsc, nonce, portalElement, scrollToFirstStep, steps } =
    mergedProps;
  const store = useJoyrideData(mergedProps);

  const element = usePortalElement(portalElement);

  useSingleton(() => {
    log({
      title: 'init',
      data: [
        { key: 'props', value: props },
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
  const step = useMemo(() => getMergedStep(props, steps[index]), [index, props, steps]);

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

export * from './literals';
export * from './types';
