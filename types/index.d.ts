import * as React from 'react';

export type placement = 'top' | 'top-start' | 'top-end' |
  'bottom' | 'bottom-start' | 'bottom-end' |
  'left' | 'left-start' | 'left-end' |
  'right' | 'right-start' | 'right-end' |
  'auto' | 'center';

export type placementBeacon = 'top' | 'bottom' | 'left' | 'right';

export interface Locale {
  back?: string;
  close?: string;
  last?: string;
  next?: string;
  skip?: string;
}

export interface CallBackProps {
  action: string;
  controlled: boolean;
  index: number;
  lifecycle: string;
  size: number;
  status: string;
  step: Step;
  type: string;
}

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
  go: () => void;
  info: () => StoreState;
  next: () => void;
  prev: () => void;
  reset: () => void;
  skip: () => void;
}

export interface Step {
  beaconComponent?: (renderProps: BeaconRenderProps) => React.ReactNode;
  content: React.ReactNode;
  disableBeacon?: boolean;
  disableCloseOnEsc?: boolean;
  disableOverlay?: boolean;
  disableOverlayClose?: boolean;
  disableScrolling?: boolean;
  event?: string;
  floaterProps?: object;
  hideBackButton?: boolean;
  isFixed?: boolean;
  locale?: object;
  offset?: number;
  placement?: placement;
  placementBeacon?: placementBeacon;
  showProgress?: boolean;
  showSkipButton?: boolean;
  spotlightPadding?: number;
  spotlightClicks?: boolean;
  styles?: object;
  target: string | HTMLElement;
  title?: React.ReactNode;
  tooltipComponent?: (renderProps: TooltipRenderProps) => React.ReactNode;
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
  backProps: { 'aria-label': string, onClick: string, role: string, title: React.ReactNode };
  closeProps: { 'aria-label': string, onClick: string, role: string, title: React.ReactNode };
  primaryProps: { 'aria-label': string, onClick: string, role: string, title: React.ReactNode };
  skipProps: { 'aria-label': string, onClick: string, role: string, title: React.ReactNode };
}

export interface Props {
  beaconComponent?: (renderProps: BeaconRenderProps) => React.ReactNode;
  callback?: (data: CallBackProps) => void;
  continuous?: boolean;
  debug?: boolean;
  disableCloseOnEsc?: boolean;
  disableOverlay?: boolean;
  disableOverlayClose?: boolean;
  disableScrolling?: boolean;
  floaterProps?: object;
  getHelpers?: () => StoreHelpers;
  hideBackButton?: boolean;
  locale?: object;
  run: boolean;
  scrollOffset?: number;
  scrollToFirstStep?: boolean;
  showProgress?: boolean;
  showSkipButton?: boolean;
  spotlightPadding?: boolean;
  spotlightClicks?: boolean;
  stepIndex?: number;
  steps: Array<Step>;
  styles?: object;
  tooltipComponent?: (renderProps: TooltipRenderProps) => React.ReactNode;
}

export default class ReactJoyride extends React.Component<Props, StoreState> {
}

export interface actions {
  INIT: string;
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
