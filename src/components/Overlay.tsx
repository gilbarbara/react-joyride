import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useIsMounted, useWindowSize } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight } from '~/modules/dom';
import { getBrowser, sortObjectKeys } from '~/modules/helpers';

import { Lifecycle, OverlayProps } from '~/types';

import Spotlight from './Spotlight';

const hiddenLifecycles: Lifecycle[] = [LIFECYCLE.BEACON, LIFECYCLE.ERROR];

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
  const targetRect = useTargetPosition(target, spotlightPadding, scrolling || waiting);

  const [showSpotlight, setShowSpotlight] = useState(false);

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

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    if (changed('lifecycle', LIFECYCLE.TOOLTIP) && placement !== 'center') {
      setShowSpotlight(true);
    } else if (changed('lifecycle', LIFECYCLE.COMPLETE)) {
      setShowSpotlight(false);
    }
  }, [changed, isMounted, placement]);

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

  let finalOverlayStyles = { ...overlayStyles };
  let spotlight = null;

  if (showSpotlight && !scrolling && !waiting) {
    spotlight = <Spotlight styles={spotlightStyles} />;

    // Hack for Safari bug with mix-blend-mode with z-index
    if (isSafari) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { mixBlendMode, zIndex, ...safariOverlay } = overlayStyles;
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { backgroundColor, ...overlayWithoutBg } = overlayStyles;

      spotlight = <div style={{ ...safariOverlay }}>{spotlight}</div>;
      finalOverlayStyles = overlayWithoutBg as CSSProperties;
    }
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
