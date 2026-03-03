import { fromPartial } from '@total-typescript/shoehorn';

import { defaultLocale } from '~/defaults';
import { STATUS } from '~/literals';
import getStyles from '~/styles';

import { CallBackProps, Props, StepMerged } from '~/types';

export function callbackResponseFactory(initial?: Partial<CallBackProps>) {
  const { controlled = false, size = 6, status = STATUS.RUNNING } = initial ?? {};

  return (input: Partial<CallBackProps>) => {
    return {
      controlled,
      origin: null,
      size,
      status,
      step: expect.any(Object),
      ...input,
    };
  };
}

export function createStep(overrides: Partial<StepMerged> = {}): StepMerged {
  const base = fromPartial<StepMerged>({
    content: 'Test content',
    target: '.target',
    locale: defaultLocale,
    placement: 'bottom',
    disableBeacon: false,
    disableCloseOnEsc: false,
    disableOverlay: false,
    disableOverlayClose: false,
    disableScrolling: false,
    dismissAction: 'close',
    hideBackButton: false,
    hideCloseButton: false,
    hideFooter: false,
    hidePrimaryButton: false,
    scrollOffset: 20,
    showProgress: false,
    showSkipButton: false,
    spotlightPadding: { top: 10, right: 10, bottom: 10, left: 10 },
    stepDelay: 0,
    ...overrides,
  });

  const styles = getStyles(fromPartial<Props>({}), base);

  return { ...base, styles: overrides.styles ? { ...styles, ...overrides.styles } : styles };
}
