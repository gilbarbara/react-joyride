import { CSSProperties, ReactNode } from 'react';
import { Styles as FloaterStyles } from 'react-floater';
import { PartialDeep, ValueOf } from '@gilbarbara/types';

import { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from '~/literals';

export type Actions = ValueOf<typeof ACTIONS>;
export type AnyObject<T = any> = Record<string, T>;
export type Events = ValueOf<typeof EVENTS>;
export type Lifecycle = ValueOf<typeof LIFECYCLE>;
export type NarrowPlainObject<T extends Record<string, any>> = Exclude<
  T,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Array<unknown> | Function | Map<unknown, unknown> | Set<unknown>
>;

export type Origin = ValueOf<typeof ORIGIN>;

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

export type SpotlightCSSProperties = Omit<
  CSSProperties,
  'height' | 'width' | 'bottom' | 'left' | 'right' | 'top'
>;

export type Status = ValueOf<typeof STATUS>;

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
   * Use the `{step}` and `{steps}` placeholders to display the current step and the total steps.
   * @default 'Next (Step {step} of {steps})'
   */
  nextLabelWithProgress?: ReactNode;
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

export interface Styles {
  beacon: CSSProperties;
  beaconInner: CSSProperties;
  beaconOuter: CSSProperties;
  buttonBack: CSSProperties;
  buttonClose: CSSProperties;
  buttonNext: CSSProperties;
  buttonSkip: CSSProperties;
  options: Partial<StylesOptions>;
  overlay: CSSProperties;
  overlayLegacy: CSSProperties;
  overlayLegacyCenter: CSSProperties;
  spotlight: SpotlightCSSProperties;
  spotlightLegacy: SpotlightCSSProperties;
  tooltip: CSSProperties;
  tooltipContainer: CSSProperties;
  tooltipContent: CSSProperties;
  tooltipFooter: CSSProperties;
  tooltipFooterSpacer: CSSProperties;
  tooltipTitle: CSSProperties;
}

export interface StylesOptions {
  arrowColor: string;
  backgroundColor: string;
  beaconSize: number;
  overlayColor: string;
  primaryColor: string;
  spotlightShadow: string;
  textColor: string;
  width?: string | number;
  zIndex: number;
}

export interface StylesWithFloaterStyles extends Styles {
  floaterStyles: PartialDeep<FloaterStyles>;
}
