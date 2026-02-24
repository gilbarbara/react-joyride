import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { useIsMounted, useSetState, useWindowSize } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight } from '~/modules/dom';
import { getBrowser, sortObjectKeys } from '~/modules/helpers';

import { Lifecycle, OverlayProps } from '~/types';

import Spotlight from './Spotlight';

const hiddenLifecycles: Lifecycle[] = [
  LIFECYCLE.INIT,
  LIFECYCLE.BEACON,
  LIFECYCLE.COMPLETE,
  LIFECYCLE.ERROR,
];

const isSafari = getBrowser() === 'safari';

interface SpotlightStyles extends CSSProperties {
  height: number;
  left: number;
  top: number;
  width: number;
}

export default function JoyrideOverlay(props: OverlayProps) {
  const {
    continuous,
    disableOverlay,
    disableOverlayClose,
    lifecycle,
    onClickOverlay,
    placement,
    scrolling,
    spotlightClicks,
    spotlightPadding = 0,
    styles,
    target,
    waiting,
  } = props;
  const isMounted = useIsMounted();
  const windowSize = useWindowSize();

  const { changed } = useTreeChanges(props);

  const [{ showSpotlight }, setState] = useSetState({
    showSpotlight: true,
  });

  const targetRect = useTargetPosition(target, spotlightPadding);

  const overlayStyles = useMemo(() => {
    return {
      cursor: disableOverlayClose || spotlightClicks ? 'default' : 'pointer',
      height: getDocumentHeight() || windowSize.height,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      ...styles.overlay,
    } as CSSProperties;
  }, [disableOverlayClose, spotlightClicks, styles.overlay, windowSize]);

  const spotlightStyles = useMemo(() => {
    return sortObjectKeys({
      ...styles.spotlight,
      height: targetRect.height,
      left: targetRect.left,
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      position: targetRect.isFixed ? 'fixed' : 'absolute',
      top: targetRect.top,
      transition: 'opacity 0.2s',
      width: targetRect.width,
    } satisfies SpotlightStyles);
  }, [showSpotlight, spotlightClicks, styles.spotlight, targetRect]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      timerRef.current = setTimeout(() => {
        if (isMounted() && !scrolling) {
          setState({ showSpotlight: true });
        }
      }, 100);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [changed, isMounted, scrolling, setState]);

  if (
    disableOverlay ||
    (waiting
      ? false
      : continuous
        ? hiddenLifecycles.includes(lifecycle)
        : lifecycle !== LIFECYCLE.TOOLTIP)
  ) {
    return null;
  }

  let spotlight = placement !== 'center' && showSpotlight && !scrolling && (
    <Spotlight styles={spotlightStyles} />
  );
  let finalOverlayStyles = { ...overlayStyles };

  // Hack for Safari bug with mix-blend-mode with z-index
  if (isSafari) {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { mixBlendMode, zIndex, ...safariOverlay } = overlayStyles;
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { backgroundColor, ...overlayWithoutBg } = overlayStyles;

    spotlight = <div style={{ ...safariOverlay }}>{spotlight}</div>;
    finalOverlayStyles = overlayWithoutBg as CSSProperties;
  }

  return (
    <div
      aria-hidden="true"
      className="react-joyride__overlay"
      data-test-id="overlay"
      onClick={onClickOverlay}
      role="presentation"
      style={finalOverlayStyles}
    >
      {spotlight}
    </div>
  );
}
