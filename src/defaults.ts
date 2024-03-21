import { noop } from '~/modules/helpers';

export const defaultFloaterProps = {
  options: {
    preventOverflow: {
      boundariesElement: 'scrollParent',
    },
  },
  wrapperOptions: {
    offset: -18,
    position: true,
  },
};

export const defaultLocale = {
  back: 'Back',
  close: 'Close',
  last: 'Last',
  next: 'Next',
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
};

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
};
