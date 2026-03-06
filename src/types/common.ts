import type { CSSProperties, ReactNode } from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from '~/literals';

import type { ValueOf } from './utilities';

/** The action that triggered the state update. */
export type Actions = ValueOf<typeof ACTIONS>;

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
  arrow: CSSProperties & {
    /** Width of the arrow base. @default 32 */
    base: number;
    /** Height/depth of the arrow (tip to edge). @default 16 */
    size: number;
  };
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
  buttonNext: CSSProperties;
  /** Skip button styles. */
  buttonSkip: CSSProperties;
  /** Floating container styles. */
  floater: CSSProperties;
  /** Themeable style options. */
  options: StylesOptions;
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

/** Themeable style options (colors, sizes, spacing). */
export interface StylesOptions {
  /**
   * Arrow fill color.
   * @default '#fff'
   */
  arrowColor: string;
  /**
   * The distance between the arrow and the edge of the tooltip.
   * @default 5
   */
  arrowSpacing: number;
  /**
   * Tooltip background color.
   * @default '#fff'
   */
  backgroundColor: string;
  /**
   * Beacon diameter in pixels.
   * @default 36
   */
  beaconSize: number;
  /**
   * Overlay backdrop color.
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  overlayColor: string;
  /**
   * Primary button and beacon color.
   * @default '#f04'
   */
  primaryColor: string;
  /**
   * The border radius of the spotlight cutout in pixels.
   * @default 4
   */
  spotlightRadius: number;
  /**
   * Tooltip text color.
   * @default '#333'
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
