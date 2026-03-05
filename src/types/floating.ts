import type {
  AutoUpdateOptions,
  Middleware,
  MiddlewareData,
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
