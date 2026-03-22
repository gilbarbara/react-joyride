import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '@gilbarbara/hooks';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getAbsoluteOffset, getDocumentHeight, getElement } from '~/modules/dom';
import { generateOverlayPath, generateSpotlightPath } from '~/modules/svg';

import type { Lifecycle, Simplify, StepMerged } from '~/types';

export type OverlayProps = Simplify<
  StepMerged & {
    continuous: boolean;
    lifecycle: Lifecycle;
    onClickOverlay: () => void;
    portalElement?: HTMLElement | null;
    scrolling: boolean;
    waiting: boolean;
  }
>;

const hiddenLifecycles: Lifecycle[] = [LIFECYCLE.BEACON_BEFORE, LIFECYCLE.BEACON];

export default function JoyrideOverlay(props: OverlayProps) {
  const {
    blockTargetInteraction,
    continuous,
    hideOverlay,
    lifecycle,
    onClickOverlay,
    overlayClickAction,
    placement,
    portalElement,
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
  const overlayRef = useRef<HTMLDivElement>(null);

  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightReady, setSpotlightReady] = useState(false);

  const container = portalElement ? (overlayRef.current?.offsetParent as HTMLElement | null) : null;
  const overlayWidth = container?.clientWidth ?? windowSize.width;
  const overlayHeight = container?.clientHeight ?? getDocumentHeight() ?? windowSize.height;

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

  const isHiddenInContinuous = continuous && hiddenLifecycles.includes(lifecycle);
  const isHiddenInNonContinuous = !continuous && lifecycle !== LIFECYCLE.TOOLTIP;

  if (hideOverlay || (!waiting && (isHiddenInContinuous || isHiddenInNonContinuous))) {
    return null;
  }

  // When using a custom portal, compute spotlight in layout space (offsetTop/offsetLeft/offsetWidth/offsetHeight)
  // because targetRect uses getBoundingClientRect() which is viewport-relative and doesn't match the SVG's layout space.
  let coverPath = '';

  if (showCutout) {
    if (portalElement && container) {
      const targetEl = getElement(spotlightTarget ?? target);

      if (targetEl) {
        const targetOffset = getAbsoluteOffset(targetEl);
        const containerOffset = getAbsoluteOffset(container);

        coverPath = generateSpotlightPath(
          targetOffset.left - containerOffset.left - spotlightPadding.left,
          targetOffset.top - containerOffset.top - spotlightPadding.top,
          targetEl.offsetWidth + spotlightPadding.left + spotlightPadding.right,
          targetEl.offsetHeight + spotlightPadding.top + spotlightPadding.bottom,
          spotlightRadius,
        );
      }
    } else {
      coverPath = generateSpotlightPath(
        targetRect.left,
        targetRect.top,
        targetRect.width,
        targetRect.height,
        spotlightRadius,
      );
    }
  }

  const path = generateOverlayPath(overlayWidth, overlayHeight, coverPath);

  return (
    <div
      ref={overlayRef}
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
          width: overlayWidth,
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
              pointerEvents: blockTargetInteraction ? 'auto' : 'none',
              transition: 'opacity 0.2s',
            }}
          />
        )}
      </svg>
    </div>
  );
}
