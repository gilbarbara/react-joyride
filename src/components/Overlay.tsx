import { CSSProperties, useEffect, useMemo } from 'react';
import { useIsMounted, useSetState } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight } from '~/modules/dom';
import { getBrowser, isLegacy, sortObjectKeys } from '~/modules/helpers';

import { Lifecycle, OverlayProps } from '~/types';

import Spotlight from './Spotlight';

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

  const { changed } = useTreeChanges(props);

  const [{ showSpotlight }, setState] = useSetState({
    showSpotlight: true,
  });

  const targetRect = useTargetPosition(target, spotlightPadding);

  const overlayStyles = useMemo(() => {
    let baseStyles = styles.overlay;

    if (isLegacy()) {
      baseStyles = placement === 'center' ? styles.overlayLegacyCenter : styles.overlayLegacy;
    }

    return {
      cursor: disableOverlayClose || spotlightClicks ? 'default' : 'pointer',
      height: getDocumentHeight(),
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      ...baseStyles,
    } as CSSProperties;
  }, [
    disableOverlayClose,
    placement,
    spotlightClicks,
    styles.overlay,
    styles.overlayLegacy,
    styles.overlayLegacyCenter,
  ]);

  const spotlightStyles = useMemo(() => {
    return sortObjectKeys({
      ...(isLegacy() ? styles.spotlightLegacy : styles.spotlight),
      height: targetRect.height,
      left: targetRect.left,
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      position: targetRect.isFixed ? 'fixed' : 'absolute',
      top: targetRect.top,
      transition: 'opacity 0.2s',
      width: targetRect.width,
    } satisfies SpotlightStyles);
  }, [showSpotlight, spotlightClicks, styles.spotlight, styles.spotlightLegacy, targetRect]);

  useEffect(() => {
    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      setTimeout(() => {
        if (isMounted() && !scrolling) {
          setState({ showSpotlight: true });
        }
      }, 100);
    }
  }, [changed, isMounted, scrolling, setState]);

  const hiddenLifecycles = [
    LIFECYCLE.INIT,
    LIFECYCLE.BEACON,
    LIFECYCLE.COMPLETE,
    LIFECYCLE.ERROR,
  ] as Lifecycle[];

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
  const actualOverlayStyles = { ...overlayStyles };

  // Hack for Safari bug with mix-blend-mode with z-index
  if (getBrowser() === 'safari') {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { mixBlendMode, zIndex, ...safariOverlay } = overlayStyles;

    spotlight = <div style={{ ...safariOverlay }}>{spotlight}</div>;
    delete actualOverlayStyles.backgroundColor;
  }

  return (
    <div
      aria-hidden="true"
      className="react-joyride__overlay"
      data-test-id="overlay"
      onClick={onClickOverlay}
      role="presentation"
      style={actualOverlayStyles}
    >
      {spotlight}
    </div>
  );
}
