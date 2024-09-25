import { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';
import { useIsMounted, useMount, useSetState, useUnmount } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import {
  getClientRect,
  getDocumentHeight,
  getElement,
  getElementPosition,
  getScrollParent,
  hasCustomScrollParent,
  hasPosition,
} from '~/modules/dom';
import { getBrowser, isLegacy, log } from '~/modules/helpers';

import { LIFECYCLE } from '~/literals';

import { Lifecycle, OverlayProps } from '~/types';

import Spotlight from './Spotlight';

interface State {
  isScrolling: boolean;
  mouseOverSpotlight: boolean;
  resizedAt: number;
  showSpotlight: boolean;
}

interface SpotlightStyles extends CSSProperties {
  height: number;
  left: number;
  top: number;
  width: number;
}

export default function JoyrideOverlay(props: OverlayProps) {
  const {
    continuous,
    debug,
    disableOverlay,
    disableOverlayClose,
    disableScrolling,
    disableScrollParentFix = false,
    lifecycle,
    onClickOverlay,
    placement,
    spotlightClicks,
    spotlightPadding = 0,
    styles,
    target,
  } = props;
  const isMounted = useIsMounted();

  const { changed } = useTreeChanges(props);
  const resizeTimeoutRef = useRef<number>();
  const scrollTimeoutRef = useRef<number>();
  const scrollParentRef = useRef<Element | Document | null>(null);

  const [{ isScrolling, mouseOverSpotlight, showSpotlight }, setState] = useSetState<State>({
    isScrolling: false,
    mouseOverSpotlight: false,
    resizedAt: 0,
    showSpotlight: true,
  });

  const updateState = useCallback(
    (state: Partial<State>) => {
      if (!isMounted) {
        return;
      }

      setState(state);
    },
    [isMounted, setState],
  );

  const overlayStyles = useMemo(() => {
    let baseStyles = styles.overlay;

    if (isLegacy()) {
      baseStyles = placement === 'center' ? styles.overlayLegacyCenter : styles.overlayLegacy;
    }

    return {
      cursor: disableOverlayClose ? 'default' : 'pointer',
      height: getDocumentHeight(),
      pointerEvents: mouseOverSpotlight ? 'none' : 'auto',
      ...baseStyles,
    } as CSSProperties;
  }, [
    disableOverlayClose,
    mouseOverSpotlight,
    placement,
    styles.overlay,
    styles.overlayLegacy,
    styles.overlayLegacyCenter,
  ]);

  const spotlightStyles = useMemo(() => {
    const element = getElement(target);
    const elementRect = getClientRect(element);
    const isFixedTarget = hasPosition(element);
    const top = getElementPosition(element, spotlightPadding, disableScrollParentFix);

    return {
      height: Math.round((elementRect?.height ?? 0) + spotlightPadding * 2),
      left: Math.round((elementRect?.left ?? 0) - spotlightPadding),
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      position: isFixedTarget ? 'fixed' : 'absolute',
      top,
      transition: 'opacity 0.2s',
      width: Math.round((elementRect?.width ?? 0) + spotlightPadding * 2),
      ...(isLegacy() ? styles.spotlightLegacy : styles.spotlight),
    } satisfies SpotlightStyles;
  }, [
    disableScrollParentFix,
    showSpotlight,
    spotlightClicks,
    spotlightPadding,
    styles.spotlight,
    styles.spotlightLegacy,
    target,
  ]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const { height, left, position, top, width } = spotlightStyles;

      const offsetY = position === 'fixed' ? event.clientY : event.pageY;
      const offsetX = position === 'fixed' ? event.clientX : event.pageX;
      const inSpotlightHeight = offsetY >= top && offsetY <= top + height;
      const inSpotlightWidth = offsetX >= left && offsetX <= left + width;
      const inSpotlight = inSpotlightWidth && inSpotlightHeight;

      if (inSpotlight !== mouseOverSpotlight) {
        updateState({ mouseOverSpotlight: inSpotlight });
      }
    },
    [spotlightStyles, mouseOverSpotlight, updateState],
  );

  const handleResize = useCallback(() => {
    clearTimeout(resizeTimeoutRef.current);

    resizeTimeoutRef.current = window.setTimeout(() => {
      if (!isMounted) {
        return;
      }

      setState({ resizedAt: Date.now() });
    }, 100);
  }, [isMounted, setState]);

  const handleScroll = useCallback(() => {
    const element = getElement(target);

    if (scrollParentRef.current !== document) {
      if (!isScrolling) {
        updateState({ isScrolling: true, showSpotlight: false });
      }

      clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = window.setTimeout(() => {
        updateState({ isScrolling: false, showSpotlight: true });
      }, 50);
    } else if (hasPosition(element, 'sticky')) {
      updateState({});
    }
  }, [isScrolling, target, updateState]);

  useMount(() => {
    const element = getElement(target);

    scrollParentRef.current = getScrollParent(
      element ?? document.body,
      disableScrollParentFix,
      true,
    );

    if (process.env.NODE_ENV !== 'production') {
      if (!disableScrolling && hasCustomScrollParent(element, true)) {
        log({
          title: 'step has a custom scroll parent and can cause trouble with scrolling',
          data: [{ key: 'parent', value: scrollParentRef }],
          debug,
        });
      }
    }

    window.addEventListener('resize', handleResize);
  });

  useUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);

    clearTimeout(resizeTimeoutRef.current);
    clearTimeout(scrollTimeoutRef.current);

    scrollParentRef?.current?.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      scrollParentRef?.current?.addEventListener('scroll', handleScroll, { passive: true });

      setTimeout(() => {
        if (!isScrolling) {
          updateState({ showSpotlight: true });
        }
      }, 100);
    }
  }, [changed, handleScroll, isScrolling, updateState]);

  useEffect(() => {
    if (changed('spotlightClicks') || changed('disableOverlay') || changed('lifecycle')) {
      if (spotlightClicks && lifecycle === LIFECYCLE.TOOLTIP) {
        window.addEventListener('mousemove', handleMouseMove, false);
      } else if (lifecycle !== LIFECYCLE.TOOLTIP) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, [changed, handleMouseMove, lifecycle, spotlightClicks]);

  useEffect(() => {
    if (changed('target') || changed('disableScrollParentFix')) {
      const element = getElement(target);

      scrollParentRef.current = getScrollParent(
        element ?? document.body,
        disableScrollParentFix,
        true,
      );
    }
  }, [changed, disableScrollParentFix, target]);

  const hiddenLifecycles = [
    LIFECYCLE.INIT,
    LIFECYCLE.BEACON,
    LIFECYCLE.COMPLETE,
    LIFECYCLE.ERROR,
  ] as Lifecycle[];

  if (
    disableOverlay ||
    (continuous ? hiddenLifecycles.includes(lifecycle) : lifecycle !== LIFECYCLE.TOOLTIP)
  ) {
    return null;
  }

  let spotlight = placement !== 'center' && showSpotlight && <Spotlight styles={spotlightStyles} />;
  const actualOverlayStyles = { ...overlayStyles };

  // Hack for Safari bug with mix-blend-mode with z-index
  if (getBrowser() === 'safari') {
    const { mixBlendMode, zIndex, ...safariOverlay } = overlayStyles;

    spotlight = <div style={{ ...safariOverlay }}>{spotlight}</div>;
    delete actualOverlayStyles.backgroundColor;
  }

  return (
    <div
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
