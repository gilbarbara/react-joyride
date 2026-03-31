'use client';

import { defaultOptions } from 'react-joyride';

import type { ConfigDefaults, SerializableSettings } from '~/context/ConfigContext';

export const topLevelDefaults: Required<Omit<SerializableSettings, 'options' | 'styles'>> = {
  continuous: false,
  debug: false,
  initialStepIndex: 0,
  scrollToFirstStep: false,
  loaderVariant: null,
  localeKey: 'en',
  useCustomTooltip: false,
  useCustomArrow: false,
  useCustomBeacon: false,
};

export const defaults: ConfigDefaults = {
  ...topLevelDefaults,
  options: defaultOptions,
};

export { defaultOptions } from 'react-joyride';
