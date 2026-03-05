import type { FloatingOptions, Locale, Props, Step, StepOptions } from '~/types';

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

export const defaultStepOptions: Required<Omit<StepOptions, 'after' | 'before'>> = {
  disableCloseOnEsc: false,
  disableTargetInteraction: false,
  disableFocusTrap: false,
  disableOverlay: false,
  disableScrolling: false,
  dismissAction: 'close',
  hideBackButton: false,
  hideCloseButton: false,
  hidePrimaryButton: false,
  loaderDelay: 300,
  overlayClickBehavior: 'close',
  showProgress: false,
  showSkipButton: false,
  spotlightPadding: 10,
  targetWaitTimeout: 1000,
};

export const defaultStep = {
  event: 'click',
  placement: 'bottom',
  offset: 10,
  disableBeacon: false,
  hideFooter: false,
  isFixed: false,
  locale: defaultLocale,
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
