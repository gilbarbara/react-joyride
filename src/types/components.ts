import { ElementType, MouseEventHandler, ReactNode, RefCallback, RefObject } from 'react';
import { AutoUpdateOptions, Middleware, MiddlewareData, Strategy } from '@floating-ui/react-dom';
import { PartialDeep, SetRequired, Simplify } from '@gilbarbara/types';

import {
  Actions,
  Events,
  Lifecycle,
  Locale,
  Origin,
  Placement,
  SpotlightPadding,
  Status,
  Styles,
} from './common';

export type ArrowRenderProps = {
  base: number;
  placement: Placement;
  size: number;
};

export type BaseProps = {
  /**
   * A React component to use instead the default Arrow.
   */
  arrowComponent?: ElementType<ArrowRenderProps>;
  /**
   * A React component to use instead the default Beacon.
   */
  beaconComponent?: ElementType<BeaconRenderProps>;
  /**
   * Options for the floating tooltip positioning.
   */
  floatingOptions?: Partial<FloatingOptions>;
  /**
   * A React component to use instead the default Loader.
   */
  loaderComponent?: ElementType<LoaderRenderProps> | null;
  /**
   * The strings used in the tooltip.
   */
  locale?: Locale;
  /**
   * The scroll distance from the element scrollTop value.
   * @default 20
   */
  scrollOffset?: number;
  /**
   * Override the styling of the Tooltip
   */
  styles?: PartialDeep<Styles>;
  /**
   * A React component to use instead the default Tooltip.
   */
  tooltipComponent?: ElementType<TooltipRenderProps>;
};

export type BeaconProps = Simplify<
  Pick<Props, 'beaconComponent' | 'nonce'> &
    BeaconRenderProps & {
      locale: Locale;
      onClickOrHover: MouseEventHandler<HTMLElement>;
      shouldFocus: boolean;
      styles: Styles;
    }
>;

export type BeaconRenderProps = {
  continuous: boolean;
  index: number;
  isLastStep: boolean;
  size: number;
  step: StepMerged;
};

export type Callback = (data: CallBackProps) => void;

export type CallBackProps = {
  /**
   * The action that updated the state.
   */
  action: Actions;
  /**
   * It the tour is in `controlled` mode.
   * (using the `stepIndex` prop)
   */
  controlled: boolean;
  /**
   * The current step's index
   */
  index: number;
  /**
   *  The step's lifecycle.
   */
  lifecycle: Lifecycle;
  /**
   * The element that triggered the action (if available).
   */
  origin: Origin | null;
  /**
   * The number of steps
   */
  size: number;
  /**
   * The tour's status.
   */
  status: Status;
  /**
   * The current step's data.
   */
  step: Step;
  /**
   * The type of the event.
   */
  type: Events;
};

export type LoaderRenderProps = {
  nonce?: string;
  step: StepMerged;
};

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

export type Props = Simplify<
  BaseProps & {
    /**
     * A function to be called when Joyride's state changes.
     * It returns a single parameter with the state.
     */
    callback?: Callback;
    /**
     * The tour is played sequentially with the Next button.
     * @default false
     */
    continuous?: boolean;
    /**
     * Log Joyride's actions to the console.
     * @default false
     */
    debug?: boolean;
    /**
     * Get the store methods to control the tour programmatically. `prev, next, go, close, skip, reset, info`
     */
    getHelpers?: (helpers: StoreHelpers) => void;
    /**
     * A nonce value for inline styles (Content Security Policy - CSP)
     */
    nonce?: string;
    /**
     *  A custom element to render the tooltip.
     *  It can be a string (CSS selector) or an HTMLElement.
     */
    portalElement?: SelectorOrElement;
    /**
     * Run/stop the tour.
     * @default true
     */
    run?: boolean;
    /**
     * The duration for scroll to element.
     * @default 300
     */
    scrollDuration?: number;
    /**
     * Scroll the page for the first step.
     * @default false
     */
    scrollToFirstStep?: boolean;
    /**
     * Setting a number here will turn Joyride into `controlled` mode.
     * You'll have to keep an internal state by yourself and update it with the events in the `callback`.
     */
    stepIndex?: number;
    /**
     * Default options for all steps.
     */
    stepOptions?: StepOptions;
    /**
     * The tour's steps.
     */
    steps: Array<Step>;
  }
>;

export type SelectorOrElement = string | null | HTMLElement;

export type State = {
  action: Actions;
  controlled: boolean;
  index: number;
  lifecycle: Lifecycle;
  origin: Origin | null;
  size: number;
  status: Status;
};

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
       * @default 10
       */
      offset?: number;
      /**
       * The placement of the beacon and tooltip. It will re-position itself if there's no space available.
       * @default bottom
       */
      placement?: Placement | 'auto' | 'center';
      /**
       * The placement of the beacon. It will use the `placement` if nothing is passed
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

export type StepDelayData = Omit<CallBackProps, 'type'>;

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
    | 'spotlightClicks'
    | 'stepDelay'
    | 'targetWaitTimeout'
  > & {
    spotlightPadding: Required<SpotlightPadding>;
    styles: Styles;
  }
>;

export type StepOptions = {
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
   * Allow mouse and touch events within the spotlight.
   * @default false
   */
  spotlightClicks?: boolean;
  /**
   * The padding of the spotlight.
   * Accepts a number for equal padding on all sides, or an object with `top`, `right`, `bottom`, `left`.
   * @default 10
   */
  spotlightPadding?: number | SpotlightPadding;
  /**
   * Delay before transitioning to the next step.
   * Shows the loader during the delay.
   *
   * - `number`: Fixed delay in milliseconds.
   * - `function`: Async function that resolves when the step is ready.
   *   Receives `{ action, index, step }`. Capped by `targetWaitTimeout`.
   *
   * @default 0
   */
  stepDelay?: number | ((data: StepDelayData) => Promise<void>);
  /**
   * Max time (ms) to wait for the target to appear. 0 = no waiting.
   * @default 1000
   */
  targetWaitTimeout?: number;
};

export type StepProps = Simplify<
  StoreState & {
    continuous: boolean;
    debug: boolean;
    helpers: StoreHelpers;
    nonce?: string;
    portalElement: HTMLElement | null;
    setPositionData: (name: 'beacon' | 'tooltip', data: PositionData) => void;
    shouldScroll: boolean;
    step: StepMerged;
    updateState: (state: Partial<StoreState>) => void;
  }
>;

export type StepTarget =
  | string
  | HTMLElement
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null);

export type StoreHelpers = {
  close: (origin?: Origin | null) => void;
  go: (nextIndex: number) => void;
  info: () => State;
  next: () => void;
  open: () => void;
  prev: () => void;
  reset: (restart: boolean) => void;
  skip: (origin: Extract<Origin, 'button_close' | 'button_skip'>) => void;
};

export type StoreState = State & { positioned: boolean; scrolling: boolean; waiting: boolean };

export type TooltipProps = {
  continuous: boolean;
  helpers: StoreHelpers;
  index: number;
  isLastStep: boolean;
  setTooltipRef: RefCallback<HTMLElement>;
  size: number;
  step: StepMerged;
};

export type TooltipRenderProps = Simplify<
  BeaconRenderProps & {
    backProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    closeProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    primaryProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    skipProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    tooltipProps: {
      'aria-describedby': string;
      'aria-modal': boolean;
      ref: RefCallback<HTMLElement>;
      role: string;
    };
  }
>;

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

export interface PositionData {
  middlewareData: MiddlewareData;
  placement: Placement;
  x: number;
  y: number;
}
