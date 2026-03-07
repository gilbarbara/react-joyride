import type { ReactNode, RefObject } from 'react';

import type { Options, Placement, SpotlightPadding, Styles } from './common';
import type { BaseProps } from './components';
import type { TourData } from './events';
import type { SetRequired, Simplify } from './utilities';

/** A hook that runs after a step completes. Fire-and-forget. */
export type AfterHook = (data: TourData) => void;

/** A hook that runs before a step is shown. The tour waits for the promise to resolve. */
export type BeforeHook = (data: TourData) => Promise<void>;

/** The buttons to show in the tooltip. */
export type ButtonType = 'back' | 'close' | 'primary' | 'skip';

/** A CSS selector string, an HTMLElement, or null. */
export type SelectorOrElement = string | null | HTMLElement;

/** A single step in the tour, provided by the user. */
export type Step = Simplify<
  BaseProps &
    StepOptions & {
      /**
       * The placement of the beacon. It will use the `placement` if nothing is passed.
       */
      beaconPlacement?: Placement;
      /**
       * The tooltip's body.
       */
      content: ReactNode;
      /**
       * Additional data you can add to the step.
       */
      data?: any;
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
       * The placement of the beacon and tooltip. It will re-position itself if there's no space available.
       * @default bottom
       */
      placement?: Placement | 'auto' | 'center';
      /**
       * An optional element to scroll to instead of the target.
       * The spotlight and tooltip will still use `target`.
       */
      scrollTarget?: StepTarget;
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
    | 'buttons'
    | 'disableBeacon'
    | 'disableCloseOnEsc'
    | 'disableTargetInteraction'
    | 'disableFocusTrap'
    | 'disableOverlay'
    | 'overlayClickBehavior'
    | 'disableScroll'
    | 'closeAction'
    | 'beaconTrigger'
    | 'isFixed'
    | 'loaderDelay'
    | 'locale'
    | 'offset'
    | 'placement'
    | 'scrollOffset'
    | 'showProgress'
    | 'targetWaitTimeout'
  > & {
    options: Options;
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
  after?: AfterHook;
  /**
   * The interaction that triggers the beacon to show the tooltip.
   * @default 'click'
   */
  beaconTrigger?: 'click' | 'hover';
  /**
   * A hook that runs before the step is shown.
   * The tour waits for the returned promise to resolve and shows the loader while waiting (after loaderDelay).
   * Capped by `targetWaitTimeout`.
   */
  before?: BeforeHook;
  /**
   * The buttons to show in the tooltip.
   * @default ['back', 'close', 'primary']
   */
  buttons?: ButtonType[];
  /**
   * The action to take when the close button is clicked.
   * - `'close'`: Advances to the next step (default behavior).
   * - `'skip'`: Ends the tour entirely.
   * @default 'close'
   */
  closeAction?: 'close' | 'skip';
  /**
   * Don't show the Beacon before the tooltip.
   * @default false
   */
  disableBeacon?: boolean;
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
   * Disable scrolling to the target.
   * @default false
   */
  disableScroll?: boolean;
  /**
   * Block pointer events on the highlighted element through the spotlight cutout.
   * @default false
   */
  disableTargetInteraction?: boolean;
  /**
   * Delay (ms) before showing the loader while waiting for a target.
   * @default 300
   */
  loaderDelay?: number;
  /**
   * The distance in pixels between the tooltip and the target.
   * @default 10
   */
  offset?: number;
  /**
   * The action to take when the overlay is clicked.
   * - `'close'`: Closes the step (fires a CLOSE action).
   * - `'next'`: Advances to the next step (ends the tour on the last step).
   * - `false`: Disables overlay click.
   * @default 'close'
   */
  overlayClickBehavior?: 'close' | 'next' | false;
  /**
   * Show the progress (1 of 5) in the tooltip.
   * @default false
   */
  showProgress?: boolean;
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
