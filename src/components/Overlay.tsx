import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '@gilbarbara/hooks';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight } from '~/modules/dom';
import { generateOverlayPath, generateSpotlightPath } from '~/modules/svg';

import type { Lifecycle, Simplify, StepMerged } from '~/types';

export type OverlayProps = Simplify<
  StepMerged & {
    continuous: boolean;
    debug: boolean;
    lifecycle: Lifecycle;
    onClickOverlay: () => void;
    scrolling: boolean;
    waiting: boolean;
  }
>;

const hiddenLifecycles: Lifecycle[] = [LIFECYCLE.BEACON_BEFORE, LIFECYCLE.BEACON];

export default function JoyrideOverlay(props: OverlayProps) {
  const {
    continuous,
    disableOverlay,
    disableTargetInteraction,
    lifecycle,
    onClickOverlay,
    overlayClickAction,
    placement,
    scrolling,
    spotlightPadding,
    spotlightRadius,
    spotlightTarget,
    styles,
    target,
    waiting,
  } = props;
  const windowSize = useWindowSize();
  const targetRect = useTargetPosition(
    spotlightTarget ?? target,
    spotlightPadding,
    scrolling || waiting,
  );
  const previousLifecycleRef = useRef(lifecycle);

  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightReady, setSpotlightReady] = useState(false);

  const overlayHeight = useMemo(() => getDocumentHeight() || windowSize.height, [windowSize]);

  const overlayColor = (styles.overlay?.backgroundColor ?? 'rgba(0, 0, 0, 0.5)') as string;

  const overlayStyles = useMemo(() => {
    const { backgroundColor: _bg, mixBlendMode: _mbm, ...rest } = styles.overlay;

    return {
      height: overlayHeight,
      pointerEvents: 'none',
      ...rest,
    } as CSSProperties;
  }, [overlayHeight, styles.overlay]);

  useEffect(() => {
    const previousLifecycle = previousLifecycleRef.current;

    previousLifecycleRef.current = lifecycle;

    if (
      (lifecycle === LIFECYCLE.TOOLTIP || lifecycle === LIFECYCLE.TOOLTIP_BEFORE) &&
      previousLifecycle !== LIFECYCLE.TOOLTIP &&
      previousLifecycle !== LIFECYCLE.TOOLTIP_BEFORE &&
      placement !== 'center'
    ) {
      setShowSpotlight(true);
    } else if (lifecycle === LIFECYCLE.COMPLETE && previousLifecycle !== LIFECYCLE.COMPLETE) {
      setShowSpotlight(false);
    }
  }, [lifecycle, placement]);

  const showCutout = showSpotlight && !scrolling && !waiting;

  useEffect(() => {
    if (showCutout) {
      requestAnimationFrame(() => setSpotlightReady(true));
    } else {
      setSpotlightReady(false);
    }
  }, [showCutout]);

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

  const coverPath = showCutout
    ? generateSpotlightPath(
        targetRect.left,
        targetRect.top,
        targetRect.width,
        targetRect.height,
        spotlightRadius,
      )
    : '';
  const path = generateOverlayPath(windowSize.width, overlayHeight, coverPath);

  return (
    <div
      aria-hidden="true"
      className="react-joyride__overlay"
      data-testid="overlay"
      style={overlayStyles}
    >
      <svg
        className="react-joyride__spotlight"
        data-testid="spotlight"
        style={{
          height: overlayHeight,
          left: 0,
          position: targetRect.isFixed ? 'fixed' : 'absolute',
          top: 0,
          width: windowSize.width,
        }}
      >
        <path
          d={path}
          fill={overlayColor}
          fillRule="evenodd"
          onClick={onClickOverlay}
          style={{
            cursor: overlayClickAction ? 'pointer' : 'default',
            pointerEvents: 'auto',
          }}
        />
        {coverPath && (
          <path
            d={coverPath}
            fill={overlayColor}
            style={{
              opacity: spotlightReady ? 0 : 1,
              pointerEvents: disableTargetInteraction ? 'auto' : 'none',
              transition: 'opacity 0.2s',
            }}
          />
        )}
      </svg>
    </div>
  );
}
