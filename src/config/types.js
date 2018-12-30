import type { ReactNode } from 'react';

export interface StoreHelpers {
  close: Function,
  go: Function,
  info: Function,
  next: Function,
  prev: Function,
  reset: Function,
  skip: Function,
  start: Function,
  stop: Function,
}

export interface StoreInstance extends StoreHelpers {
  update: Function,
}

export interface StoreState {
  action: string,
  controlled: boolean,
  index: number,
  lifecycle: string,
  size: number,
  status: string,
}

type placement = 'top' | 'top-start' | 'top-end' |
  'bottom' | 'bottom-start' | 'bottom-end' |
  'left' | 'left-start' | 'left-end' |
  'right' | 'right-start' | 'right-end' |
  'auto' | 'center';

type placementBeacon = 'top' | 'bottom' | 'left' | 'right';

export interface StepProps {
  beaconComponent?: ReactNode,
  content: ReactNode,
  disableBeacon?: boolean,
  disableCloseOnEsc?: boolean,
  disableOverlay?: boolean,
  disableOverlayClose?: boolean,
  disableScrolling?: boolean,
  disableScrollParentFix?: boolean,
  event?: string,
  floaterProps?: Object,
  hideBackButton?: boolean,
  isFixed?: boolean,
  locale?: Object,
  offset?: number,
  placement?: placement,
  placementBeacon?: placementBeacon,
  showProgress?: boolean,
  showSkipButton?: boolean,
  spotlightClicks?: boolean,
  spotlightPadding?: number,
  styles?: Object,
  target: string | HTMLElement,
  title?: ReactNode,
  tooltipComponent?: ReactNode,
}

export interface CallBackProps {
  action: string,
  controlled: boolean,
  index: number,
  lifecycle: string,
  size: number,
  status: string,
  step: StepProps,
  type: string,
}

export interface JoyrideProps {
  beaconComponent?: ReactNode,
  callback?: (data: CallBackProps) => void,
  continuous?: boolean,
  debug?: boolean,
  disableCloseOnEsc?: boolean,
  disableOverlay?: boolean,
  disableOverlayClose?: boolean,
  disableScrolling?: boolean,
  disableScrollParentFix?: boolean,
  floaterProps?: Object,
  hideBackButton?: boolean,
  hideCloseButton?: boolean;
  hideFooter?: boolean,
  locale?: Object,
  run: boolean,
  scrollOffset?: number,
  scrollToFirstStep?: boolean,
  showProgress?: boolean,
  showSkipButton?: boolean,
  spotlightClicks?: boolean,
  spotlightPadding?: boolean,
  stepIndex?: number,
  steps: Array<StepProps>,
  styles?: Object,
  tooltipComponent?: ReactNode,
}
