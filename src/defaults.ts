import type { FloatingOptions, Locale, Options, Props, Step, StepOptions } from '~/types';

export const defaultOptions: Options = {
  arrowBase: 32,
  arrowColor: '#ffffff',
  arrowSize: 16,
  arrowSpacing: 5,
  backgroundColor: '#ffffff',
  beaconSize: 36,
  overlayColor: '#00000080',
  primaryColor: '#ff0044',
  spotlightRadius: 4,
  textColor: '#333333',
  width: 380,
  zIndex: 100,
};

export const defaultFloatingOptions: FloatingOptions = {
  beaconOptions: {
    offset: -18,
  },
};

export const defaultLocale: Locale = {
  back: 'Back',
  close: 'Close',
  last: 'Last',
  next: 'Next',
  nextWithProgress: 'Next ({current} of {total})',
  open: 'Open the dialog',
  skip: 'Skip',
};

export const defaultStepOptions: Required<Omit<StepOptions, 'after' | 'before'>> = {
  buttons: ['back', 'close', 'primary'],
  disableBeacon: false,
  disableCloseOnEsc: false,
  disableFocusTrap: false,
  disableOverlay: false,
  disableScrolling: false,
  disableTargetInteraction: false,
  dismissAction: 'close',
  event: 'click',
  loaderDelay: 300,
  offset: 10,
  overlayClickBehavior: 'close',
  showProgress: false,
  spotlightPadding: 10,
  targetWaitTimeout: 1000,
};

export const defaultStep = {
  isFixed: false,
  locale: defaultLocale,
  placement: 'bottom',
  scrollOffset: 20,
  ...defaultStepOptions,
} satisfies Omit<Step, 'content' | 'target'>;

export const defaultProps = {
  continuous: false,
  debug: false,
  run: true,
  scrollOffset: 20,
  scrollDuration: 300,
  scrollToFirstStep: false,
  stepOptions: defaultStepOptions,
  steps: [],
} satisfies Props;
