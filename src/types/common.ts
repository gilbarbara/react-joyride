import type { CSSProperties, ReactNode } from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from '~/literals';

import type { TourData } from './events';
import type { ValueOf } from './utilities';

/** The action that triggered the state update. */
export type Actions = ValueOf<typeof ACTIONS>;

/** A hook that runs after a step completes. Fire-and-forget. */
export type AfterHook = (data: TourData) => void;

/** A hook that runs before a step is shown. The tour waits for the promise to resolve. */
export type BeforeHook = (data: TourData) => Promise<void>;

/** The buttons to show in the tooltip. */
export type ButtonType = 'back' | 'close' | 'primary' | 'skip';

/** The event type passed to the `onEvent` callback. */
export type Events = ValueOf<typeof EVENTS>;

/** The rendering phase of the current step. */
export type Lifecycle = ValueOf<typeof LIFECYCLE>;

/** The UI element that triggered the action. */
export type Origin = ValueOf<typeof ORIGIN>;

/** Tooltip and beacon placement positions. */
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** The current state of the tour. */
export type Status = ValueOf<typeof STATUS>;

/** Tooltip button and navigation labels. */
export interface Locale {
  /**
   * Label for the back button.
   * @default 'Back'
   */
  back?: ReactNode;
  /**
   * Label for the close button.
   * @default 'Close'
   */
  close?: ReactNode;
  /**
   * Label for the last button.
   * @default 'Last'
   */
  last?: ReactNode;
  /**
   * Label for the next button.
   * @default 'Next'
   */
  next?: ReactNode;
  /**
   * Label for the next button with `showProgress`.
   * Use the `{current}` and `{total}` placeholders to display the current step and the total steps.
   * @default 'Next ({current} of {total})'
   */
  nextWithProgress?: ReactNode;
  /**
   * Label for the open button.
   * @default 'Open the dialog'
   */
  open?: ReactNode;
  /**
   * Label for the skip button.
   * @default 'Skip'
   */
  skip?: ReactNode;
}

/** Step options for behavior, theming, and layout. Shared between Props and Step. */
export interface Options {
  /**
   * A hook that runs after the step completes (user clicked next, prev, close, or skip).
   * Fire-and-forget — does not block the tour.
   */
  after?: AfterHook;
  /**
   * Width of the arrow base edge in pixels.
   * @default 32
   */
  arrowBase: number;
  /**
   * Arrow fill color.
   * @default '#ffffff'
   */
  arrowColor: string;
  /**
   * Height/depth of the arrow (tip to base edge) in pixels.
   * @default 16
   */
  arrowSize: number;
  /**
   * The distance between the arrow and the edge of the tooltip.
   * @default 12
   */
  arrowSpacing: number;
  /**
   * Tooltip background color.
   * @default '#ffffff'
   */
  backgroundColor: string;
  /**
   * Beacon diameter in pixels.
   * @default 36
   */
  beaconSize: number;
  /**
   * The interaction that triggers the beacon to show the tooltip.
   * @default 'click'
   */
  beaconTrigger: 'click' | 'hover';
  /**
   * A hook that runs before the step is shown.
   * The tour waits for the returned promise to resolve and shows the loader while waiting (after `loaderDelay`).
   * Max duration capped by `beforeTimeout`.
   */
  before?: BeforeHook;
  /**
   * Max time (ms) to wait for a `before` hook to resolve. 0 = no timeout.
   * @default 5000
   */
  beforeTimeout: number;
  /**
   * Block pointer events on the highlighted element through the spotlight cutout.
   * @default false
   */
  blockTargetInteraction: boolean;
  /**
   * The buttons to show in the tooltip.
   * @default ['back', 'close', 'primary']
   */
  buttons: ButtonType[];
  /**
   * The action to take when the close button is clicked.
   * - `'close'`: Advances to the next step (default behavior).
   * - `'skip'`: Ends the tour entirely.
   * @default 'close'
   */
  closeButtonAction: 'close' | 'skip';
  /**
   * Disable the focus trap for the tooltip.
   * @default false
   */
  disableFocusTrap: boolean;
  /**
   * The action to take when the ESC key is pressed.
   * - `'close'`: Closes the step (shows beacon on next step in continuous mode).
   * - `'next'`: Advances to the next step (skips beacon in continuous mode).
   * - `false`: Disables ESC key.
   * @default 'close'
   */
  dismissKeyAction: 'close' | 'next' | false;
  /**
   * Don't show the overlay.
   * @default false
   */
  hideOverlay: boolean;
  /**
   * Delay (ms) before showing the loader while the tour is waiting.
   * @default 300
   */
  loaderDelay: number;
  /**
   * The distance in pixels between the tooltip and the spotlight.
   * @default 10
   */
  offset: number;
  /**
   * The action to take when the overlay is clicked.
   * - `'close'`: Closes the step (fires a CLOSE action).
   * - `'next'`: Advances to the next step (ends the tour on the last step).
   * - `false`: Disables overlay click.
   * @default 'close'
   */
  overlayClickAction: 'close' | 'next' | false;
  /**
   * Overlay backdrop color.
   * @default '#00000080'
   */
  overlayColor: string;
  /**
   * Primary button and beacon color.
   * @default '#000000'
   */
  primaryColor: string;
  /**
   * The scroll animation duration in milliseconds.
   * @default 300
   */
  scrollDuration: number;
  /**
   * The scroll distance from the element scrollTop value.
   * @default 20
   */
  scrollOffset: number;
  /**
   * Show the progress (1 of 5) in the tooltip.
   * @default false
   */
  showProgress: boolean;
  /**
   * Don't show the Beacon before the tooltip.
   * @default false
   */
  skipBeacon: boolean;
  /**
   * Skip scrolling to the target.
   * @default false
   */
  skipScroll: boolean;
  /**
   * The padding of the spotlight.
   * Accepts a number for equal padding on all sides, or an object with `top`, `right`, `bottom`, `left`.
   * @default 10
   */
  spotlightPadding: number | SpotlightPadding;
  /**
   * The border radius of the spotlight cutout in pixels.
   * @default 4
   */
  spotlightRadius: number;
  /**
   * Max time (ms) to wait for the target to appear. 0 = no waiting.
   * @default 1000
   */
  targetWaitTimeout: number;
  /**
   * Tooltip text color.
   * @default '#000000'
   */
  textColor: string;
  /**
   * Tooltip width in pixels or CSS string.
   * @default 380
   */
  width?: string | number;
  /**
   * z-index for the overlay and tooltip.
   * @default 100
   */
  zIndex: number;
}

/** Padding around the spotlight cutout in pixels. */
export interface SpotlightPadding {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}

/** CSS styles for all Joyride UI elements. */
export interface Styles {
  /** Arrow element styles. */
  arrow: CSSProperties;
  /** Beacon visual styles (size, border-radius). Applied to the default beacon content. */
  beacon: CSSProperties;
  /** Beacon inner pulse element styles. */
  beaconInner: CSSProperties;
  /** Beacon outer ring element styles. */
  beaconOuter: CSSProperties;
  /** Beacon wrapper button styles (interaction, layout). */
  beaconWrapper: CSSProperties;
  /** Back button styles. */
  buttonBack: CSSProperties;
  /** Close button styles. */
  buttonClose: CSSProperties;
  /** Next/Last button styles. */
  buttonPrimary: CSSProperties;
  /** Skip button styles. */
  buttonSkip: CSSProperties;
  /** Floating container styles. */
  floater: CSSProperties;
  /** Loader wrapper styles. */
  loader: CSSProperties;
  /** Overlay backdrop styles. */
  overlay: CSSProperties;
  /** Tooltip wrapper styles. */
  tooltip: CSSProperties;
  /** Tooltip inner container styles. */
  tooltipContainer: CSSProperties;
  /** Tooltip body content styles. */
  tooltipContent: CSSProperties;
  /** Tooltip footer styles. */
  tooltipFooter: CSSProperties;
  /** Tooltip footer spacer styles. */
  tooltipFooterSpacer: CSSProperties;
  /** Tooltip title styles. */
  tooltipTitle: CSSProperties;
}
