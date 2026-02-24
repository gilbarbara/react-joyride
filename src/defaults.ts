import { noop } from '~/modules/helpers';

import { FloatingOptions, Locale, Props, Step } from '~/types';

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
  nextLabelWithProgress: 'Next (Step {step} of {steps})',
  open: 'Open the dialog',
  skip: 'Skip',
};

export const defaultStep = {
  event: 'click',
  placement: 'bottom',
  offset: 10,
  disableBeacon: false,
  disableCloseOnEsc: false,
  disableFocusTrap: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrolling: false,
  hideBackButton: false,
  hideCloseButton: false,
  hideFooter: false,
  isFixed: false,
  locale: defaultLocale,
  showProgress: false,
  showSkipButton: false,
  spotlightClicks: false,
  spotlightPadding: 10,
  loaderDelay: 300,
  targetWaitTimeout: 150,
} satisfies Omit<Step, 'content' | 'target'>;

export const defaultProps = {
  continuous: false,
  debug: false,
  disableCloseOnEsc: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrolling: false,
  getHelpers: noop(),
  hideBackButton: false,
  run: true,
  scrollOffset: 20,
  scrollDuration: 300,
  scrollToFirstStep: false,
  showSkipButton: false,
  showProgress: false,
  spotlightClicks: false,
  spotlightPadding: 10,
  stepOptions: {
    disableFocusTrap: false,
    loaderDelay: 300,
    targetWaitTimeout: 150,
  },
  steps: [],
} satisfies Props;
