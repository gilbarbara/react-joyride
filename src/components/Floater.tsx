import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  type Placement as FloatingPlacement,
  type MiddlewareData,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';

import { LIFECYCLE } from '~/literals';
import { getScrollParent, hasCustomScrollParent, hasPosition } from '~/modules/dom';
import { sortObjectKeys } from '~/modules/helpers';

import type { Controls, Lifecycle, Placement, PositionData, StepMerged, StoreState } from '~/types';

import Arrow from './Arrow';
import Beacon from './Beacon';
import Portal from './Portal';
import Tooltip from './Tooltip';

interface FloaterProps {
  continuous: boolean;
  controls: Controls;
  index: number;
  lifecycle: Lifecycle;
  nonce?: string;
  open: boolean;
  portalElement: HTMLElement | null;
  setPositionData: (name: 'beacon' | 'tooltip', data: PositionData) => void;
  setTooltipRef: RefCallback<HTMLElement>;
  shouldScroll: boolean;
  size: number;
  step: StepMerged;
  target: Element;
  updateState: (state: Partial<StoreState>) => void;
}

export default function JoyrideFloater(props: FloaterProps) {
  const {
    continuous,
    controls,
    index,
    lifecycle,
    nonce,
    open,
    portalElement,
    setPositionData,
    setTooltipRef,
    shouldScroll,
    size,
    step,
    target,
    updateState,
  } = props;
  const arrowRef = useRef<HTMLElement>(null);
  const beaconMiddlewareRef = useRef<MiddlewareData>({});
  const tooltipMiddlewareRef = useRef<MiddlewareData>({});

  const isCenter = step.placement === 'center';
  const isAuto = step.placement === 'auto';

  const centerReference = useMemo(
    () => ({
      getBoundingClientRect: () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        bottom: window.innerHeight / 2,
        right: window.innerWidth / 2,
        width: 0,
        height: 0,
      }),
    }),
    [],
  );

  const scrollParent = hasCustomScrollParent(target as HTMLElement)
    ? getScrollParent(target as HTMLElement)
    : undefined;
  const boundaryOptions = useMemo(
    () =>
      scrollParent ? { boundary: scrollParent as Element, rootBoundary: 'viewport' as const } : {},
    [scrollParent],
  );
  const arrowMiddleware = useMemo(
    () =>
      step.floatingOptions?.hideArrow
        ? []
        : [arrow({ element: arrowRef, padding: step.styles.options.arrowSpacing })],
    [step.floatingOptions?.hideArrow, step.styles.options.arrowSpacing],
  );

  const { arrow: arrowStyles, floater: floaterStyles } = step.styles;

  const tooltipPlacement = isCenter || isAuto ? 'bottom' : (step.placement as FloatingPlacement);

  const strategy = isCenter
    ? 'fixed'
    : (step.floatingOptions?.strategy ??
      (step.isFixed || hasPosition(target) ? 'fixed' : 'absolute'));

  const tooltipFloating = useFloating({
    ...(isCenter ? { elements: { reference: centerReference } } : {}),
    placement: tooltipPlacement,
    strategy,
    middleware: isCenter
      ? [
          {
            name: 'center',
            fn: ({ rects }) => ({
              x: (window.innerWidth - rects.floating.width) / 2,
              y: (window.innerHeight - rects.floating.height) / 2,
            }),
          },
        ]
      : [
          offset(({ placement: currentPlacement }) => {
            const side = currentPlacement.startsWith('top')
              ? 'top'
              : currentPlacement.startsWith('bottom')
                ? 'bottom'
                : currentPlacement.startsWith('left')
                  ? 'left'
                  : 'right';

            return (
              step.offset +
              step.spotlightPadding[side] +
              (step.floatingOptions?.hideArrow ? 0 : step.styles.options.arrowSize)
            );
          }),
          isAuto ? autoPlacement() : flip(),
          shift({ padding: 5, ...boundaryOptions }),
          ...arrowMiddleware,
          ...(step.floatingOptions?.middleware ?? []),
        ],
    whileElementsMounted: isCenter
      ? autoUpdate
      : (...arguments_) => autoUpdate(...arguments_, step.floatingOptions?.autoUpdate),
  });

  const beaconPlacement =
    step.placementBeacon ?? (isAuto || isCenter ? 'bottom' : (step.placement as FloatingPlacement));

  const beaconFloating = useFloating({
    strategy,
    placement: beaconPlacement,
    middleware: [offset(step.floatingOptions?.beaconOptions?.offset ?? -18)],
    whileElementsMounted: autoUpdate,
  });

  tooltipMiddlewareRef.current = tooltipFloating.middlewareData;
  beaconMiddlewareRef.current = beaconFloating.middlewareData;

  // Wire reference element to both floating instances
  useEffect(() => {
    if (!isCenter && target) {
      tooltipFloating.refs.setReference(target);
    }

    if (target) {
      beaconFloating.refs.setReference(target);
    }
  }, [beaconFloating.refs, isCenter, target, tooltipFloating.refs]);

  // Sync tooltip position data to store
  useEffect(() => {
    if (tooltipFloating.isPositioned) {
      setPositionData('tooltip', {
        placement: tooltipFloating.placement as Placement,
        x: tooltipFloating.x ?? 0,
        y: tooltipFloating.y ?? 0,
        middlewareData: tooltipMiddlewareRef.current,
      });
    }
  }, [
    setPositionData,
    tooltipFloating.isPositioned,
    tooltipFloating.placement,
    tooltipFloating.x,
    tooltipFloating.y,
  ]);

  // Sync beacon position data to store
  useEffect(() => {
    if (beaconFloating.isPositioned) {
      setPositionData('beacon', {
        placement: beaconFloating.placement as Placement,
        x: beaconFloating.x ?? 0,
        y: beaconFloating.y ?? 0,
        middlewareData: beaconMiddlewareRef.current,
      });
    }
  }, [
    setPositionData,
    beaconFloating.isPositioned,
    beaconFloating.placement,
    beaconFloating.x,
    beaconFloating.y,
  ]);

  const zIndex = step.styles.options.zIndex + 100;

  const handleBeaconClick = (event: MouseEvent<HTMLElement>) => {
    if (event.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    updateState({ lifecycle: LIFECYCLE.TOOLTIP_BEFORE, positioned: false });
  };

  let content: ReactNode = null;

  if (lifecycle === LIFECYCLE.TOOLTIP || lifecycle === LIFECYCLE.TOOLTIP_BEFORE) {
    const styles: CSSProperties = sortObjectKeys({
      ...floaterStyles,
      ...tooltipFloating.floatingStyles,
      zIndex,
      opacity: open && tooltipFloating.isPositioned ? 1 : 0,
      ...(!open && { transition: 'none' }),
    });

    content = (
      <div
        ref={node => {
          tooltipFloating.refs.setFloating(node);
          setTooltipRef(node);
        }}
        className="react-joyride__floater"
        data-testid="floater"
        id={`react-joyride-step-${index}`}
        style={styles}
      >
        <Tooltip
          continuous={continuous}
          controls={controls}
          index={index}
          isLastStep={index + 1 === size}
          size={size}
          step={step}
        />
        {!isCenter && !step.floatingOptions?.hideArrow && (
          <Arrow
            arrowComponent={step.arrowComponent}
            arrowRef={arrowRef}
            base={step.styles.options.arrowBase}
            placement={tooltipFloating.placement}
            position={tooltipFloating.middlewareData.arrow}
            size={step.styles.options.arrowSize}
            styles={arrowStyles}
          />
        )}
      </div>
    );
  } else if (lifecycle === LIFECYCLE.BEACON || lifecycle === LIFECYCLE.BEACON_BEFORE) {
    content = (
      <div
        ref={beaconFloating.refs.setFloating}
        className="react-joyride__floater"
        data-testid="floater-beacon"
        id={`react-joyride-step-${index}-beacon`}
        style={sortObjectKeys({
          ...beaconFloating.floatingStyles,
          zIndex,
        })}
      >
        <Beacon
          beaconComponent={step.beaconComponent}
          continuous={continuous}
          index={index}
          isLastStep={index + 1 === size}
          locale={step.locale}
          nonce={nonce}
          onClickOrHover={handleBeaconClick}
          shouldFocus={shouldScroll}
          size={size}
          step={step}
          styles={step.styles}
        />
      </div>
    );
  }

  return <Portal element={portalElement}>{content}</Portal>;
}
