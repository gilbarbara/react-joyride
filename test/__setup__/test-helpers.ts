import { fromPartial } from '@total-typescript/shoehorn';

import { defaultLocale } from '~/defaults';
import { STATUS } from '~/literals';
import getStyles from '~/styles';

import type { EventData, Props, StepMerged } from '~/types';

export function createStep(overrides: Partial<StepMerged> = {}): StepMerged {
  const base = fromPartial<StepMerged>({
    content: 'Test content',
    target: '.target',
    locale: defaultLocale,
    placement: 'bottom',
    disableBeacon: false,
    disableCloseOnEsc: false,
    disableTargetInteraction: false,
    disableOverlay: false,
    overlayClickBehavior: 'close',
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
    ...overrides,
  });

  const styles = getStyles(fromPartial<Props>({}), base);

  return { ...base, styles: overrides.styles ? { ...styles, ...overrides.styles } : styles };
}

export function eventResponseFactory(initial?: Partial<EventData>) {
  const { controlled = false, size = 6, status = STATUS.RUNNING } = initial ?? {};

  return (input: Partial<EventData>) => {
    return {
      controlled,
      error: null,
      origin: null,
      scroll: null,
      scrolling: false,
      size,
      status,
      step: expect.any(Object),
      waiting: false,
      ...input,
    };
  };
}
