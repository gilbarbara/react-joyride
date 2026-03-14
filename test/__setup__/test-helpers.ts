import { fromPartial } from '@total-typescript/shoehorn';

import { defaultLocale, defaultOptions } from '~/defaults';
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
    dismissKeyAction: 'close',
    disableTargetInteraction: false,
    disableOverlay: false,
    overlayClickAction: 'close',
    disableScroll: false,
    closeButtonAction: 'close',
    buttons: ['back', 'close', 'primary'],
    scrollOffset: 20,
    showProgress: false,
    spotlightPadding: { top: 10, right: 10, bottom: 10, left: 10 },
    ...overrides,
  });

  const merged = { ...defaultOptions, ...base };
  const styles = getStyles(fromPartial<Props>({}), merged);

  return { ...merged, styles: overrides.styles ? { ...styles, ...overrides.styles } : styles };
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

export function expectControls() {
  return expect.objectContaining({
    close: expect.any(Function),
    go: expect.any(Function),
    info: expect.any(Function),
    next: expect.any(Function),
    open: expect.any(Function),
    prev: expect.any(Function),
    reset: expect.any(Function),
    skip: expect.any(Function),
    start: expect.any(Function),
    stop: expect.any(Function),
  });
}
