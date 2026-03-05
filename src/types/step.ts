import type { ReactNode, RefObject } from 'react';

import type { Placement, SpotlightPadding, Styles } from './common';
import type { BaseProps } from './components';
import type { TourData } from './events';
import type { FloatingOptions } from './floating';
import type { SetRequired, Simplify } from './utilities';

/** A CSS selector string, an HTMLElement, or null. */
export type SelectorOrElement = string | null | HTMLElement;

/** A single step in the tour, provided by the user. */
export type Step = Simplify<
  BaseProps &
    StepOptions & {
      /**
       * The tooltip's body.
       */
      content: ReactNode;
      /**
       * Additional data you can add to the step.
       */
      data?: any;
      /**
       * Don't show the Beacon before the tooltip.
       * @default false
       */
      disableBeacon?: boolean;
      /**
       * The event to trigger the beacon.
       * @default click
       */
      event?: 'click' | 'hover';
      /**
       * Options for the floating positioning.
       */
      floatingOptions?: Partial<FloatingOptions>;
      /**
       * Hide the tooltip's footer.
       * @default false
       */
      hideFooter?: boolean;
      /**
       * A unique identifier for the step.
       */
      id?: string;
      /**
       * Force the step to be fixed.
       * @default false
       */
      isFixed?: boolean;
      /**
       * The distance in pixels between the tooltip and the target.
       * @default 10
       */
      offset?: number;
      /**
       * The placement of the beacon and tooltip. It will re-position itself if there's no space available.
       * @default bottom
       */
      placement?: Placement | 'auto' | 'center';
      /**
       * The placement of the beacon. It will use the `placement` if nothing is passed.
       */
      placementBeacon?: Placement;
      /**
       * The target for the step.
       * It can be a CSS selector, an HTMLElement, a React ref, or a function that returns an element.
       */
      target: StepTarget;
      /**
       * The tooltip's title.
       */
      title?: ReactNode;
    }
>;

/** A normalized step with all defaults applied. */
export type StepMerged = Simplify<
  SetRequired<
    Step,
    | 'disableBeacon'
    | 'disableCloseOnEsc'
    | 'disableFocusTrap'
    | 'disableOverlay'
    | 'disableOverlayClose'
    | 'disableScrolling'
    | 'dismissAction'
    | 'event'
    | 'hideBackButton'
    | 'hideCloseButton'
    | 'hideFooter'
    | 'hidePrimaryButton'
    | 'isFixed'
    | 'loaderDelay'
    | 'locale'
    | 'offset'
    | 'placement'
    | 'scrollOffset'
    | 'showProgress'
    | 'showSkipButton'
    | 'targetWaitTimeout'
  > & {
    spotlightPadding: Required<SpotlightPadding>;
    styles: Styles;
  }
>;

/** Per-step behavior options. Can also be set globally via `Props.stepOptions`. */
export type StepOptions = {
  /**
   * A hook that runs after the step completes (user clicked next, prev, close, or skip).
   * Fire-and-forget — does not block the tour.
   */
  after?: (data: TourData) => void;
  /**
   * A hook that runs before the step is shown.
   * The tour waits for the returned promise to resolve and shows the loader while waiting (after loaderDelay).
   * Capped by `targetWaitTimeout`.
   */
  before?: (data: TourData) => Promise<void>;
  /**
   * Disable closing the tooltip on ESC.
   * @default false
   */
  disableCloseOnEsc?: boolean;
  /**
   * Disable the focus trap for the tooltip.
   * @default false
   */
  disableFocusTrap?: boolean;
  /**
   * Don't show the overlay.
   * @default false
   */
  disableOverlay?: boolean;
  /**
   * Don't close the tooltip when clicking the overlay.
   * @default false
   */
  disableOverlayClose?: boolean;
  /**
   * Disable scrolling to the target.
   * @default false
   */
  disableScrolling?: boolean;
  /**
   * The action to take when the close button is clicked.
   * - `'close'`: Advances to the next step (default behavior).
   * - `'skip'`: Ends the tour entirely.
   * @default 'close'
   */
  dismissAction?: 'close' | 'skip';
  /**
   * Hide the Back button.
   * @default false
   */
  hideBackButton?: boolean;
  /**
   * Hide the Close button.
   * @default false
   */
  hideCloseButton?: boolean;
  /**
   * Hide the Next (or Last) button.
   * @default false
   */
  hidePrimaryButton?: boolean;
  /**
   * Delay (ms) before showing the loader while waiting for a target.
   * @default 300
   */
  loaderDelay?: number;
  /**
   * Show the progress (e.g. 1 of 5) in the tooltip.
   * @default false
   */
  showProgress?: boolean;
  /**
   * Show the skip button in the tooltip.
   * @default false
   */
  showSkipButton?: boolean;
  /**
   * The padding of the spotlight.
   * Accepts a number for equal padding on all sides, or an object with `top`, `right`, `bottom`, `left`.
   * @default 10
   */
  spotlightPadding?: number | SpotlightPadding;
  /**
   * Max time (ms) to wait for the target to appear. 0 = no waiting.
   * @default 1000
   */
  targetWaitTimeout?: number;
};

/** The element to highlight. Accepts a CSS selector, HTMLElement, React ref, or function. */
export type StepTarget =
  | string
  | HTMLElement
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null);
