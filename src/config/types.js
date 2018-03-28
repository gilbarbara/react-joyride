import type { Node } from 'react';

export type StateHelpers = {
  close: Function,
  go: Function,
  index: Function,
  info: Function,
  next: Function,
  prev: Function,
  reset: Function,
  restart: Function,
  skip: Function,
  start: Function,
  stop: Function,
};

export type StateInstance = {
  ...StateHelpers,
  update: Function,
};

export type StateObject = {
  action: string,
  controlled: boolean,
  index: number,
  lifecycle: string,
  size: number,
  status: string,
};

type placement = 'top' | 'top-start' | 'top-end' |
  'bottom' | 'bottom-start' | 'bottom-end' |
  'left' | 'left-start' | 'left-end' |
  'right' | 'right-start' | 'right-end' |
  'auto' | 'center';

export type StepObject = {
  allowClicksThruHole: boolean,
  beaconComponent: ?Node,
  content: Node | string,
  disableBeacon: boolean,
  disableOverlay: boolean,
  disableOverlayClicks: boolean,
  disableScrolling: boolean,
  event: string,
  hideBackButton: ?boolean,
  holePadding: number,
  isFixed: ?boolean,
  offset: number,
  placement: placement,
  showProgress: ?boolean,
  showSkipButton: ?boolean,
  styles: ?Object,
  target: string | HTMLElement,
  title: ?Node,
  tooltipComponent: ?Node,
  tooltipOptions: ?Object,
}

export type TourObject = {
  allowClicksThruHole: boolean,
  beaconComponent: ?Node,
  callback: ?Function,
  debug: boolean,
  disableBeacon: boolean,
  disableCloseOnEsc: boolean,
  disableOverlay: boolean,
  disableOverlayClicks: boolean,
  disableScrolling: boolean,
  hideBackButton: boolean,
  holePadding: boolean,
  locale: ?Object,
  run: boolean,
  scrollOffset: number,
  scrollToFirstStep: boolean,
  showProgress: boolean,
  showSkipButton: boolean,
  stepIndex: ?number,
  steps: Array<StepObject>,
  tooltipComponent: ?Node,
  tooltipOptions: ?Object,
}
