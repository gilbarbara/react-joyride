import { noop } from '~/modules/helpers';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';

import { FloaterProps, Locale, Props, State, Step } from '~/types';

export const defaultFloaterProps: Omit<FloaterProps, 'component'> = {
  modifiers: {
    preventOverflow: {
      options: {
        rootBoundary: 'viewport',
      },
    },
  },
  wrapperOptions: {
    offset: -18,
    position: true,
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
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrollParentFix: false,
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
} satisfies Omit<Step, 'content' | 'target'>;

export const defaultProps = {
  continuous: false,
  debug: false,
  disableCloseOnEsc: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrolling: false,
  disableScrollParentFix: false,
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
  steps: [],
} satisfies Props;

export const defaultState: State = {
  action: ACTIONS.INIT,
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  origin: null,
  size: 0,
  status: STATUS.IDLE,
};
