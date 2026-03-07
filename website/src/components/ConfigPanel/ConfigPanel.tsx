import { type Key, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  NumberInput,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import { CircleXIcon, RotateCcw } from 'lucide-react';

import { useConfig } from '~/context/ConfigContext';
import { languageOptions, type LocaleKey } from '~/modules/messages';

import Appearance from '~/components/ConfigPanel/panels/Appearance';
import ArrowPanel from '~/components/ConfigPanel/panels/Arrow';
import BeaconPanel from '~/components/ConfigPanel/panels/Beacon';
import InterationsPanel from '~/components/ConfigPanel/panels/Interactions';
import OverlayPanel from '~/components/ConfigPanel/panels/Overlay';
import ScrollPanel from '~/components/ConfigPanel/panels/Scroll';

interface ConfigPanelProps {
  onClose?: () => void;
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const { onClose } = props;

  const {
    getConfigValue,
    initialConfig,
    isModified,
    localeKey,
    resetSettings,
    setLocaleKey,
    settings,
    updateSettings,
  } = useConfig();

  const setOption = (key: string, value: unknown) => {
    updateSettings({ options: { [key]: value } });
  };

  const ACCORDION_STORAGE_KEY = 'react-joyride-accordion';

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['tour']));

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCORDION_STORAGE_KEY);

      if (stored) {
        setExpandedKeys(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectionChange = (keys: 'all' | Set<Key>) => {
    const next =
      keys === 'all'
        ? new Set(['appearance', 'components', 'locale', 'options', 'tour'])
        : new Set([...keys].map(String));

    setExpandedKeys(next);

    try {
      localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  };

  const accordionItemClassNames = {
    base: 'px-4',
    content: 'pb-4',
    title: 'font-bold',
  };

  return (
    <div className="flex-1 h-full relative z-200">
      <div className="h-[calc(100%-3rem)] overflow-y-auto">
        <Accordion
          className="p-0"
          isCompact
          onSelectionChange={handleSelectionChange}
          selectedKeys={expandedKeys}
          selectionMode="multiple"
          variant="light"
        >
          <AccordionItem
            key="tour"
            className="bg-slate-50 dark:bg-slate-950/50"
            classNames={accordionItemClassNames}
            title="Tour Options"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Switch
                  isSelected={getConfigValue<boolean>('continuous')}
                  onValueChange={value => updateSettings({ continuous: value })}
                  size="sm"
                >
                  continuous
                </Switch>
                <Switch
                  isSelected={getConfigValue<boolean>('debug')}
                  onValueChange={value => updateSettings({ debug: value })}
                  size="sm"
                >
                  debug
                </Switch>
              </div>
              <NumberInput
                label="zIndex"
                maxValue={999999}
                minValue={1}
                onValueChange={value => setOption('zIndex', value)}
                size="sm"
                step={100}
                value={getConfigValue<number>('zIndex')}
              />
            </div>
          </AccordionItem>
          <AccordionItem
            key="appearance"
            className="bg-red-50 dark:bg-red-950/50"
            classNames={accordionItemClassNames}
            title="Appearance"
          >
            <Appearance
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
            />
          </AccordionItem>
          <AccordionItem
            key="arrow"
            className="bg-amber-50 dark:bg-amber-950/50"
            classNames={accordionItemClassNames}
            title="Arrow"
          >
            <ArrowPanel
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
            />
          </AccordionItem>
          <AccordionItem
            key="beacon"
            className="bg-lime-50 dark:bg-lime-950/50"
            classNames={accordionItemClassNames}
            title="Beacon"
          >
            <BeaconPanel
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
            />
          </AccordionItem>
          <AccordionItem
            key="overlay"
            className="bg-emerald-50 dark:bg-emerald-950/50"
            classNames={accordionItemClassNames}
            title="Overlay & Spotlight"
          >
            <OverlayPanel
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
            />
          </AccordionItem>
          <AccordionItem
            key="scroll"
            className="bg-cyan-50 dark:bg-cyan-950/50"
            classNames={accordionItemClassNames}
            title="Scroll Behavior"
          >
            <ScrollPanel
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
              updateSettings={updateSettings}
            />
          </AccordionItem>
          <AccordionItem
            key="interactions"
            className="bg-blue-50 dark:bg-blue-950/50"
            classNames={accordionItemClassNames}
            title="Interactions"
          >
            <InterationsPanel
              getConfigValue={getConfigValue}
              initialConfig={initialConfig}
              setOption={setOption}
            />
          </AccordionItem>
          <AccordionItem
            key="components"
            className="bg-violet-50 dark:bg-violet-950/50"
            classNames={accordionItemClassNames}
            title="Custom Components"
          >
            <div className="flex flex-col gap-3">
              <Switch
                isSelected={getConfigValue<boolean>('useCustomArrow')}
                onValueChange={value => updateSettings({ useCustomArrow: value })}
                size="sm"
              >
                Custom Arrow
              </Switch>
              <Switch
                isSelected={getConfigValue<boolean>('useCustomBeacon')}
                onValueChange={value => updateSettings({ useCustomBeacon: value })}
                size="sm"
              >
                Custom Beacon
              </Switch>
              <Switch
                isSelected={getConfigValue<boolean>('useCustomTooltip')}
                onValueChange={value => updateSettings({ useCustomTooltip: value })}
                size="sm"
              >
                Custom Tooltip
              </Switch>
              <Select
                label="Loader"
                onChange={event => {
                  const { value } = event.target;

                  updateSettings({
                    loaderVariant: value === 'default' ? false : value === 'none' ? null : value,
                  });
                }}
                selectedKeys={[
                  settings.loaderVariant === null ? 'none' : settings.loaderVariant || 'default',
                ]}
                size="sm"
              >
                <SelectItem key="default">Default</SelectItem>
                <SelectItem key="none">None</SelectItem>
                <SelectItem key="bars">Bars</SelectItem>
                <SelectItem key="circular">Circular</SelectItem>
                <SelectItem key="classic">Classic</SelectItem>
                <SelectItem key="dots">Dots</SelectItem>
                <SelectItem key="loading-dots">Loading Dots</SelectItem>
                <SelectItem key="pulse">Pulse</SelectItem>
                <SelectItem key="pulse-dot">Pulse Dot</SelectItem>
                <SelectItem key="terminal">Terminal</SelectItem>
                <SelectItem key="typing">Typing</SelectItem>
                <SelectItem key="wave">Wave</SelectItem>
              </Select>
            </div>
          </AccordionItem>
          <AccordionItem
            key="locale"
            className="bg-fuchsia-50 dark:bg-fuchsia-950/50"
            classNames={accordionItemClassNames}
            title="Locale"
          >
            <div>
              <Select
                label="Language"
                onChange={event => setLocaleKey(event.target.value as LocaleKey)}
                selectedKeys={[localeKey]}
                size="sm"
              >
                {languageOptions.map(option => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-default py-2 px-4 h-12">
        {onClose && (
          <Button
            color="default"
            onPress={onClose}
            size="sm"
            startContent={<CircleXIcon size={14} />}
            variant="flat"
          >
            close
          </Button>
        )}
        <Button
          color="default"
          isDisabled={!isModified}
          onPress={() => {
            resetSettings();
          }}
          size="sm"
          startContent={<RotateCcw size={14} />}
          variant="flat"
        >
          reset
        </Button>
      </div>
    </div>
  );
}
