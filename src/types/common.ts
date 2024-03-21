import { CSSProperties, ReactNode } from 'react';
import { Styles as FloaterStyles } from 'react-floater';
import { ValueOf } from 'type-fest';

import { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from '~/literals';

export type Actions = ValueOf<typeof ACTIONS>;
export type Events = ValueOf<typeof EVENTS>;
export type Lifecycle = ValueOf<typeof LIFECYCLE>;
export type Origin = ValueOf<typeof ORIGIN>;
export type Status = ValueOf<typeof STATUS>;

export type AnyObject<T = any> = Record<string, T>;

export type NarrowPlainObject<T extends Record<string, any>> = Exclude<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Array<unknown> | Function | Map<unknown, unknown> | Set<unknown>
>;

export interface Locale {
  back?: ReactNode;
  close?: ReactNode;
  last?: ReactNode;
  next?: ReactNode;
  open?: ReactNode;
  skip?: ReactNode;
}

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
  spotlight: CSSProperties;
  spotlightLegacy: CSSProperties;
  tooltip: CSSProperties;
  tooltipContainer: CSSProperties;
  tooltipContent: CSSProperties;
  tooltipFooter: CSSProperties;
  tooltipFooterSpacer: CSSProperties;
  tooltipTitle: CSSProperties;
}

export interface StylesWithFloaterStyles extends Styles {
  floaterStyles: FloaterStyles;
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
