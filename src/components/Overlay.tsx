import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useIsMounted, useWindowSize } from '@gilbarbara/hooks';
import useTreeChanges from 'tree-changes-hook';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight } from '~/modules/dom';
import { generateOverlayPath, generateSpotlightPath } from '~/modules/svg';

import { Lifecycle, OverlayProps } from '~/types';

const hiddenLifecycles: Lifecycle[] = [LIFECYCLE.BEACON, LIFECYCLE.ERROR];

export default function JoyrideOverlay(props: OverlayProps) {
  const {
    continuous,
    disableOverlay,
    disableOverlayClose,
    lifecycle,
    onClickOverlay,
    placement,
    scrolling,
    spotlightPadding,
    styles,
    target,
    waiting,
  } = props;
  const isMounted = useIsMounted();
  const windowSize = useWindowSize();
  const { changed } = useTreeChanges(props);
  const targetRect = useTargetPosition(target, spotlightPadding, scrolling || waiting);

  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightReady, setSpotlightReady] = useState(false);

  const overlayHeight = useMemo(() => getDocumentHeight() || windowSize.height, [windowSize]);

  const overlayColor = (styles.overlay?.backgroundColor ?? 'rgba(0, 0, 0, 0.5)') as string;
  const spotlightRadius = styles.options?.spotlightRadius ?? 4;

  const overlayStyles = useMemo(() => {
    const { backgroundColor: _bg, mixBlendMode: _mbm, ...rest } = styles.overlay;

    return {
      height: overlayHeight,
      pointerEvents: 'none',
      ...rest,
    } as CSSProperties;
  }, [overlayHeight, styles.overlay]);

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
      data-test-id="overlay"
      style={overlayStyles}
    >
      <svg
        className="react-joyride__spotlight"
        data-test-id="spotlight"
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
            cursor: disableOverlayClose ? 'default' : 'pointer',
            pointerEvents: 'auto',
          }}
        />
        {coverPath && (
          <path
            d={coverPath}
            fill={overlayColor}
            style={{
              opacity: spotlightReady ? 0 : 1,
              pointerEvents: 'none',
              transition: 'opacity 0.2s',
            }}
          />
        )}
      </svg>
    </div>
  );
}
