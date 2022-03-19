import * as React from 'react';
import { Props as FloaterType } from 'react-floater';

export type valueof<T> = T[keyof T];

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

export interface StoreState {
  action: string;
  controlled: boolean;
  index: number;
  lifecycle: string;
  size: number;
  status: string;
}

export interface StoreHelpers {
  close: () => void;
  go: (nextIndex: number) => void;
  info: () => StoreState;
  next: () => void;
  open: () => void;
  prev: () => void;
  reset: (restart: boolean) => void;
  skip: () => void;
}

export interface Locale {
  back?: React.ReactNode;
  close?: React.ReactNode;
  last?: React.ReactNode;
  next?: React.ReactNode;
  open?: React.ReactNode;
  skip?: React.ReactNode;
}

export interface CallBackProps {
  action: string;
  controlled: boolean;
  index: number;
  lifecycle: string;
  size: number;
  status: valueof<status>;
  step: Step;
  type: string;
}

export interface Styles {
  beacon?: React.CSSProperties;
  beaconInner?: React.CSSProperties;
  beaconOuter?: React.CSSProperties;
  buttonBack?: React.CSSProperties;
  buttonClose?: React.CSSProperties;
  buttonNext?: React.CSSProperties;
  buttonSkip?: React.CSSProperties;
  options?: {
    arrowColor?: string;
    backgroundColor?: string;
    beaconSize?: number;
    overlayColor?: string;
    primaryColor?: string;
    spotlightShadow?: string;
    textColor?: string;
    width?: string | number;
    zIndex?: number;
  };
  overlay?: React.CSSProperties;
  overlayLegacy?: React.CSSProperties;
  overlayLegacyCenter?: React.CSSProperties;
  spotlight?: React.CSSProperties;
  spotlightLegacy?: React.CSSProperties;
  tooltip?: React.CSSProperties;
  tooltipContainer?: React.CSSProperties;
  tooltipContent?: React.CSSProperties;
  tooltipFooter?: React.CSSProperties;
  tooltipFooterSpacer?: React.CSSProperties;
  tooltipTitle?: React.CSSProperties;
}

export interface CommonProps {
  beaconComponent?: React.ElementType<BeaconRenderProps>;
  disableCloseOnEsc?: boolean;
  disableOverlay?: boolean;
  disableOverlayClose?: boolean;
  disableScrolling?: boolean;
  disableScrollParentFix?: boolean;
  floaterProps?: FloaterType;
  hideBackButton?: boolean;
  hideCloseButton?: boolean;
  locale?: Locale;
  nonce?: string;
  showProgress?: boolean;
  showSkipButton?: boolean;
  spotlightClicks?: boolean;
  spotlightPadding?: number;
  styles?: Styles;
  tooltipComponent?: React.ElementType<TooltipRenderProps>;
}

export interface BeaconRenderProps {
  continuous: boolean;
  index: number;
  isLastStep: boolean;
  setTooltipRef: () => void;
  size: number;
  step: Step;
}

export interface TooltipRenderProps extends BeaconRenderProps {
  backProps: {
    'aria-label': string;
    'data-action': string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    role: string;
    title: string;
  };
  closeProps: {
    'aria-label': string;
    'data-action': string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    role: string;
    title: string;
  };
  primaryProps: {
    'aria-label': string;
    'data-action': string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    role: string;
    title: string;
  };
  skipProps: {
    'aria-label': string;
    'data-action': string;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    role: string;
    title: string;
  };
  tooltipProps: {
    'aria-modal': boolean;
    ref: React.RefCallback<HTMLElement>;
    role: string;
  };
}

export interface Step extends CommonProps {
  content: React.ReactNode;
  disableBeacon?: boolean;
  event?: string;
  floaterProps?: FloaterType;
  hideFooter?: boolean;
  isFixed?: boolean;
  offset?: number;
  placement?: Placement | 'auto' | 'center';
  placementBeacon?: Placement;
  target: string | HTMLElement;
  title?: React.ReactNode;
}

export interface Props extends CommonProps {
  callback?: (data: CallBackProps) => void;
  continuous?: boolean;
  debug?: boolean;
  getHelpers?: (helpers: StoreHelpers) => any;
  run?: boolean;
  scrollDuration?: number;
  scrollOffset?: number;
  scrollToFirstStep?: boolean;
  stepIndex?: number;
  steps: Array<Step>;
}

export default class ReactJoyride extends React.Component<Props, StoreState> {}

export interface actions {
  INIT: 'init';
  START: 'start';
  STOP: 'stop';
  RESET: 'reset';
  RESTART: 'restart';
  PREV: 'prev';
  NEXT: 'next';
  GO: 'go';
  INDEX: 'index';
  CLOSE: 'close';
  SKIP: 'skip';
  UPDATE: 'update';
}

export interface events {
  TOUR_START: 'tour:start';
  STEP_BEFORE: 'step:before';
  BEACON: 'beacon';
  TOOLTIP: 'tooltip';
  TOOLTIP_CLOSE: 'close';
  STEP_AFTER: 'step:after';
  TOUR_END: 'tour:end';
  TOUR_STATUS: 'tour:status';
  TARGET_NOT_FOUND: 'error:target_not_found';
  ERROR: 'error';
}

export interface lifecycle {
  INIT: 'init';
  READY: 'ready';
  BEACON: 'beacon';
  TOOLTIP: 'tooltip';
  COMPLETE: 'complete';
  ERROR: 'error';
}

export interface status {
  IDLE: 'idle';
  READY: 'ready';
  WAITING: 'waiting';
  RUNNING: 'running';
  PAUSED: 'paused';
  SKIPPED: 'skipped';
  FINISHED: 'finished';
  ERROR: 'error';
}

export const ACTIONS: actions;
export const EVENTS: events;
export const LIFECYCLE: lifecycle;
export const STATUS: status;

export type FloaterProps = FloaterType;
