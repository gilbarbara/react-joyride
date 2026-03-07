import { createContext, useContext } from 'react';
import type { Options, Props, SharedProps } from 'react-joyride';

import { type LocaleKey } from '~/modules/messages';

export interface ConfigContextValue {
  defaults: ConfigDefaults;
  getConfigValue: <T>(key: string) => T;
  initialConfig: ConfigOverrides;
  isModified: boolean;
  joyrideProps: ConfigOverrides;
  localeKey: LocaleKey;
  registerConfig: (config: ConfigOverrides) => void;
  resetSettings: () => void;
  setLocaleKey: (key: LocaleKey) => void;
  settings: SerializableSettings;
  updateSettings: (updates: Partial<SerializableSettings>) => void;
}

export interface ConfigDefaults extends Required<Omit<SerializableSettings, 'options'>> {
  options: Required<Omit<Options, 'after' | 'before'>>;
}

export interface ConfigOverrides
  extends
    Pick<Props, 'continuous' | 'debug' | 'initialStepIndex' | 'options' | 'scrollToFirstStep'>,
    Omit<SharedProps, 'floatingOptions' | 'styles'> {}

export interface SerializableSettings {
  continuous?: boolean;
  debug?: boolean;
  initialStepIndex?: number;
  loaderVariant?: string | null | false;
  localeKey?: LocaleKey;
  options?: Partial<Options>;
  scrollToFirstStep?: boolean;
  useCustomArrow?: boolean;
  useCustomBeacon?: boolean;
  useCustomTooltip?: boolean;
}

export const ConfigContext = createContext<ConfigContextValue | null>(null);

export function useConfig() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }

  return context;
}
