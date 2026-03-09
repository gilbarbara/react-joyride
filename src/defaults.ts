import type { FloatingOptions, Locale, Options, Props, Step } from '~/types';

export const defaultOptions: Required<Omit<Options, 'after' | 'before'>> = {
  arrowBase: 32,
  arrowColor: '#ffffff',
  arrowSize: 16,
  arrowSpacing: 12,
  backgroundColor: '#ffffff',
  beaconSize: 36,
  beaconTrigger: 'click',
  buttons: ['back', 'close', 'primary'],
  closeAction: 'close',
  disableBeacon: false,
  disableCloseOnEsc: false,
  disableFocusTrap: false,
  disableOverlay: false,
  disableScroll: false,
  disableTargetInteraction: false,
  loaderDelay: 300,
  offset: 10,
  overlayClickBehavior: 'close',
  overlayColor: '#00000080',
  primaryColor: '#ff0044',
  scrollDuration: 300,
  scrollOffset: 20,
  showProgress: false,
  spotlightPadding: 10,
  spotlightRadius: 4,
  targetWaitTimeout: 1000,
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

export const defaultStep = {
  isFixed: false,
  locale: defaultLocale,
  placement: 'bottom',
} satisfies Omit<Step, 'content' | 'target'>;

export const defaultProps = {
  continuous: false,
  debug: false,
  run: false,
  scrollToFirstStep: false,
  steps: [],
} satisfies Props;
