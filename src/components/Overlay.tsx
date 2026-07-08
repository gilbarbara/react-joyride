import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '@gilbarbara/hooks';

import useTargetPosition from '~/hooks/useTargetPosition';
import { LIFECYCLE } from '~/literals';
import { getDocumentHeight, scrollDocument } from '~/modules/dom';
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const showSpotlight =
    (lifecycle === LIFECYCLE.TOOLTIP || lifecycle === LIFECYCLE.TOOLTIP_BEFORE) &&
    placement !== 'center';
  const [spotlightReady, setSpotlightReady] = useState(false);

  // Read live from the ref during render rather than via state: the overlay re-renders on every
  // lifecycle transition (store subscription), so a null ref self-corrects on the next render —
  // cheaper and safer than a setState round-trip that batches against the subscription (see 79a7ef0).
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

  let coverPath = '';

  if (showCutout) {
    // The spotlight SVG is position:absolute/fixed, so cutout coordinates are relative to its
    // own rendered box. Because the SVG is anchored at top:0/left:0, its getBoundingClientRect()
    // is that coordinate origin — exact through borders, padding, nested scroll containers, and
    // page scroll. Without a custom portal the SVG sits at the document origin, so origin is 0 and
    // targetRect is used as-is. A fixed SVG anchors to the viewport, which targetRect already
    // matches, so the offset is skipped there.
    let originTop = 0;
    let originLeft = 0;
    const svg = svgRef.current;

    if (portalElement && svg && !targetRect.isFixed) {
      const rect = svg.getBoundingClientRect();

      originTop = rect.top + scrollDocument().scrollTop; // targetRect.top is document-space
      originLeft = rect.left; // targetRect.left is viewport-space
    }

    coverPath = generateSpotlightPath(
      targetRect.left - originLeft,
      targetRect.top - originTop,
      targetRect.width,
      targetRect.height,
      spotlightRadius,
    );
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
        ref={svgRef}
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
        {coverPath && Object.keys(styles.spotlight).length > 0 && (
          <path d={coverPath} fill="none" style={{ pointerEvents: 'none' }} {...styles.spotlight} />
        )}
      </svg>
    </div>
  );
}
