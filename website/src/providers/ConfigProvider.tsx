import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import deepEqual from '@gilbarbara/deep-equal';
import { omit } from '@gilbarbara/helpers';

import { defaultOptions, defaults, topLevelDefaults } from '~/config/defaults';
import {
  ConfigContext,
  type ConfigOverrides,
  type SerializableSettings,
} from '~/context/ConfigContext';
import { type LocaleKey, localeMessages } from '~/modules/messages';

import CustomArrow from '~/components/CustomArrow';
import CustomBeacon from '~/components/CustomBeacon';
import CustomLoader, { type LoaderProps } from '~/components/CustomLoader';
import CustomTooltip from '~/components/CustomTooltip';

interface ConfigProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'react-joyride-config';

const customComponents = {
  Arrow: CustomArrow,
  Beacon: CustomBeacon,
  Tooltip: CustomTooltip,
};

function loadFromStorage(): SerializableSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveToStorage(settings: SerializableSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export default function ConfigProvider({ children }: ConfigProviderProps) {
  const [initialConfig, setRouteDefaults] = useState<ConfigOverrides>({});
  const [settings, setSettings] = useState<SerializableSettings>({});

  useEffect(() => {
    setSettings(loadFromStorage());
  }, []);

  const localeKey = settings.localeKey ?? 'en';

  const loaderComponent = useMemo(() => {
    if (typeof settings.loaderVariant === 'string') {
      const variant = settings.loaderVariant as LoaderProps['variant'];

      return function ConfigLoader() {
        return <CustomLoader variant={variant} />;
      };
    }

    return undefined;
  }, [settings.loaderVariant]);

  const joyrideProps: ConfigOverrides = useMemo(
    () => ({
      ...(settings.continuous !== undefined && { continuous: settings.continuous }),
      ...(settings.debug !== undefined && { debug: settings.debug }),
      ...(settings.initialStepIndex !== undefined && {
        initialStepIndex: settings.initialStepIndex,
      }),
      ...(settings.scrollToFirstStep !== undefined && {
        scrollToFirstStep: settings.scrollToFirstStep,
      }),
      ...(settings.options && {
        options: settings.useCustomTooltip
          ? {
              ...omit(
                settings.options,
                'arrowColor',
                'backgroundColor',
                'primaryColor',
                'textColor',
              ),
              arrowColor: '#000000',
            }
          : settings.options,
      }),
      ...(settings.localeKey && { locale: localeMessages[settings.localeKey] }),
      ...(settings.useCustomArrow !== undefined && {
        arrowComponent: settings.useCustomArrow ? customComponents.Arrow : undefined,
      }),
      ...(settings.useCustomBeacon !== undefined && {
        beaconComponent: settings.useCustomBeacon ? customComponents.Beacon : undefined,
      }),
      ...(settings.useCustomTooltip !== undefined && {
        tooltipComponent: settings.useCustomTooltip ? customComponents.Tooltip : undefined,
      }),
      ...(settings.loaderVariant !== undefined &&
        (settings.loaderVariant === null
          ? { loaderComponent: null }
          : loaderComponent
            ? { loaderComponent }
            : {})),
    }),
    [
      loaderComponent,
      settings.debug,
      settings.initialStepIndex,
      settings.continuous,
      settings.loaderVariant,
      settings.localeKey,
      settings.scrollToFirstStep,
      settings.options,
      settings.useCustomArrow,
      settings.useCustomBeacon,
      settings.useCustomTooltip,
    ],
  );

  const isModified = useMemo(() => {
    return Object.entries(settings).some(([key, value]) => {
      if (value === undefined) return false;

      if (key === 'options') {
        const effectiveOptions = { ...defaultOptions, ...initialConfig.options };

        return Object.entries(value as Record<string, unknown>).some(
          ([optKey, optValue]) =>
            !deepEqual(optValue, effectiveOptions[optKey as keyof typeof effectiveOptions]),
        );
      }

      const effectiveDefault =
        (initialConfig as Record<string, unknown>)[key] ?? defaults[key as keyof typeof defaults];

      return !deepEqual(value, effectiveDefault);
    });
  }, [initialConfig, settings]);

  const registerConfig = useCallback((config: ConfigOverrides) => {
    setRouteDefaults(config);
  }, []);

  const updateSettings = useCallback((updates: Partial<SerializableSettings>) => {
    setSettings(previous => {
      const next = {
        ...previous,
        ...updates,
        ...(updates.options && {
          options: { ...previous.options, ...updates.options },
        }),
      };

      saveToStorage(next);

      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({});
    saveToStorage({});
  }, []);

  const setLocaleKey = useCallback(
    (key: LocaleKey) => {
      updateSettings({ localeKey: key });
    },
    [updateSettings],
  );

  const componentKeyMap = useMemo<Record<string, keyof ConfigOverrides>>(
    () => ({
      useCustomArrow: 'arrowComponent',
      useCustomBeacon: 'beaconComponent',
      useCustomTooltip: 'tooltipComponent',
    }),
    [],
  );

  const getConfigValue = useCallback(
    <T,>(key: string): T => {
      if (key in componentKeyMap) {
        const settingsValue = settings[key as keyof SerializableSettings];

        if (settingsValue !== undefined) {
          return settingsValue as T;
        }

        return (initialConfig[componentKeyMap[key]] !== undefined) as T;
      }

      if (key in topLevelDefaults) {
        const topKey = key as keyof typeof topLevelDefaults;
        const settingsValue = settings[topKey];

        if (settingsValue !== undefined) {
          return settingsValue as T;
        }

        if (topKey in initialConfig) {
          const routeValue = (initialConfig as Record<string, unknown>)[topKey];

          if (routeValue !== undefined) {
            return routeValue as T;
          }
        }

        return topLevelDefaults[topKey] as T;
      }

      const optionKey = key as keyof typeof defaultOptions;

      return (settings.options?.[optionKey] ??
        initialConfig.options?.[optionKey] ??
        defaultOptions[optionKey]) as T;
    },
    [componentKeyMap, initialConfig, settings],
  );

  const value = useMemo(
    () => ({
      defaults,
      getConfigValue,
      isModified,
      joyrideProps,
      localeKey,
      initialConfig,
      settings,
      registerConfig,
      resetSettings,
      setLocaleKey,
      updateSettings,
    }),
    [
      getConfigValue,
      isModified,
      joyrideProps,
      localeKey,
      registerConfig,
      resetSettings,
      initialConfig,
      settings,
      setLocaleKey,
      updateSettings,
    ],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
