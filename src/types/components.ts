import { ElementType, MouseEventHandler, ReactNode, RefCallback } from 'react';
import { Props as FloaterProps } from 'react-floater';
import { PartialDeep, SetRequired, Simplify } from 'type-fest';

import type { StoreInstance } from '~/modules/store';

import { Actions, Events, Lifecycle, Locale, Origin, Placement, Status, Styles } from './common';

export type BaseProps = {
  /**
   * A React component to use instead the default Beacon.
   */
  beaconComponent?: ElementType<BeaconRenderProps>;
  /**
   * Disable closing the tooltip on ESC.
   * @default false
   */
  disableCloseOnEsc?: boolean;
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
   * Disable the fix to handle "unused" overflow parents.
   * @default false
   */
  disableScrollParentFix?: boolean;
  /**
   * @default false
   */
  disableScrolling?: boolean;
  /**
   * Options to be passed to react-floater
   */
  floaterProps?: Partial<FloaterProps>;
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
   * The strings used in the tooltip.
   */
  locale?: Locale;
  /**
   * @default false
   */
  showProgress?: boolean;
  /**
   * @default false
   */
  showSkipButton?: boolean;
  /**
   * @default false
   */
  spotlightClicks?: boolean;
  /**
   * The padding of the spotlight.
   * @default 10
   */
  spotlightPadding?: number;
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

export type OverlayProps = Simplify<
  StepMerged & {
    continuous: boolean;
    debug: boolean;
    lifecycle: Lifecycle;
    onClickOverlay: () => void;
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
    getHelpers?: (helpers: StoreHelpers) => any;
    /**
     * A nonce value for inline styles (Content Security Policy - CSP)
     */
    nonce?: string;
    /**
     * Run/stop the tour.
     * @default true
     */
    run: boolean;
    /**
     * The duration for scroll to element.
     * @default 300
     */
    scrollDuration?: number;
    /**
     * The scroll distance from the element scrollTop value.
     * @default 20
     */
    scrollOffset?: number;
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
     * The tour's steps.
     */
    steps: Array<Step>;
  }
>;

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
  BaseProps & {
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
     * Options to be passed to react-floater
     */
    floaterProps?: FloaterProps;
    /**
     * Hide the tooltip's footer.
     * @default false
     */
    hideFooter?: boolean;
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
     * It can be a CSS selector or an HTMLElement ref.
     */
    target: string | HTMLElement;
    /**
     * The tooltip's title.
     */
    title?: ReactNode;
  }
>;

export type StepMerged = Simplify<
  SetRequired<
    Step,
    | 'disableBeacon'
    | 'disableCloseOnEsc'
    | 'disableOverlay'
    | 'disableOverlayClose'
    | 'disableScrollParentFix'
    | 'disableScrolling'
    | 'event'
    | 'hideBackButton'
    | 'hideCloseButton'
    | 'hideFooter'
    | 'isFixed'
    | 'locale'
    | 'offset'
    | 'placement'
    | 'showProgress'
    | 'showSkipButton'
    | 'spotlightClicks'
    | 'spotlightPadding'
  > & {
    styles: Styles;
  }
>;

export type StepProps = Simplify<
  State & {
    callback: Callback;
    continuous: boolean;
    debug: boolean;
    helpers: StoreHelpers;
    nonce?: string;
    shouldScroll: boolean;
    step: StepMerged;
    store: StoreInstance;
  }
>;

export type StoreHelpers = {
  close: (origin?: Origin | null) => void;
  go: (nextIndex: number) => void;
  info: () => State;
  next: () => void;
  open: () => void;
  prev: () => void;
  reset: (restart: boolean) => void;
  skip: () => void;
};

export type StoreOptions = Simplify<
  Props & {
    controlled: boolean;
  }
>;

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
      'aria-modal': boolean;
      ref: RefCallback<HTMLElement>;
      role: string;
    };
  }
>;
