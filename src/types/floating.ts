import type {
  AutoUpdateOptions,
  FlipOptions,
  Middleware,
  MiddlewareData,
  ShiftOptions,
  Strategy,
} from '@floating-ui/react-dom';

import type { Placement } from './common';

/** Tooltip and beacon positioning configuration using Floating UI. */
export interface FloatingOptions {
  /**
   * Options passed to autoUpdate (ancestorScroll, elementResize, animationFrame, etc).
   */
  autoUpdate?: Partial<AutoUpdateOptions>;
  /**
   * Beacon positioning config.
   */
  beaconOptions?: { offset?: number };
  /**
   * Options for the flip middleware, or `false` to disable flipping.
   * Defaults: crossAxis false, padding 20, smart fallbackPlacements for left/right.
   */
  flipOptions?: Partial<FlipOptions> | false;
  /**
   * Hide the arrow element.
   * Centered placement already hides the arrow.
   *
   * @default false
   */
  hideArrow?: boolean;
  /**
   * Additional Floating UI middleware appended to defaults (offset, flip/autoPlacement, shift, arrow).
   */
  middleware?: Array<Middleware>;
  /**
   * Called after each position calculation.
   */
  onPosition?: (data: PositionData) => void;
  /**
   * Options for the shift middleware.
   * Default: padding 10.
   */
  shiftOptions?: Partial<ShiftOptions>;
  /**
   * Positioning strategy.
   * Defaults to 'fixed' when step.isFixed is true, 'absolute' otherwise.
   */
  strategy?: Strategy;
}

/** Computed position data returned by Floating UI after each calculation. */
export interface PositionData {
  middlewareData: MiddlewareData;
  placement: Placement;
  x: number;
  y: number;
}
