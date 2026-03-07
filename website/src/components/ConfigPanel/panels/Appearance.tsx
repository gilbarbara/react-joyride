import React from 'react';
import { objectEntries, pick } from '@gilbarbara/helpers';
import { Checkbox, Slider, Switch } from '@heroui/react';
import { CircleXIcon } from 'lucide-react';

import { defaultOptions } from '~/config/defaults';
import type { ConfigContextValue } from '~/context/ConfigContext';

import ButtonsToggle from '~/components/ButtonsToggle';
import ColorPicker from '~/components/ColorPicker';

interface AppearancePanelProps extends Pick<
  ConfigContextValue,
  'initialConfig' | 'getConfigValue'
> {
  setOption: (key: string, value: unknown) => void;
}

export default function AppearancePanel(props: AppearancePanelProps) {
  const { getConfigValue, initialConfig, setOption } = props;
  const [syncColors, setSyncColors] = React.useState(true);

  const initialOptions = initialConfig.options ?? {};

  const hasCustomTooltip = getConfigValue<boolean>('useCustomTooltip');

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {objectEntries(
          pick(defaultOptions, 'arrowColor', 'backgroundColor', 'primaryColor', 'textColor'),
        ).map(([key, fallback]) => {
          const currentValue = getConfigValue<string>(key);
          const isCustomized = initialOptions[key] && initialOptions[key] !== currentValue;
          let resetButton = null;

          if (isCustomized) {
            resetButton = (
              <button
                aria-label="Reset color"
                className="p-1"
                onClick={() => {
                  setOption(key, initialOptions[key]);

                  if (syncColors) {
                    switch (key) {
                      case 'backgroundColor': {
                        setOption('arrowColor', initialOptions.backgroundColor);

                        break;
                      }
                      case 'primaryColor': {
                        setOption('textColor', initialOptions.primaryColor);

                        break;
                      }
                      case 'arrowColor': {
                        setOption('backgroundColor', initialOptions.arrowColor);

                        break;
                      }
                      case 'textColor': {
                        setOption('primaryColor', initialOptions.textColor);

                        break;
                      }
                      // No default
                    }
                  }
                }}
                title="Reset Color"
                type="button"
              >
                <CircleXIcon className="size-5" />
              </button>
            );
          }

          return (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-small">{key}</span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  color={currentValue || fallback}
                  isDisabled={hasCustomTooltip}
                  onChange={event => {
                    const { value } = event.target;

                    setOption(key, value);

                    if (syncColors) {
                      switch (key) {
                        case 'backgroundColor': {
                          setOption('arrowColor', value);

                          break;
                        }
                        case 'arrowColor': {
                          setOption('backgroundColor', value);

                          break;
                        }
                        case 'primaryColor': {
                          setOption('textColor', value);

                          break;
                        }
                        case 'textColor': {
                          setOption('primaryColor', value);

                          break;
                        }
                        // No default
                      }
                    }
                  }}
                  size="sm"
                />
                {resetButton}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <Checkbox
          isDisabled={hasCustomTooltip}
          isSelected={syncColors}
          onValueChange={isChecked => {
            setSyncColors(isChecked);

            if (isChecked) {
              setOption('arrowColor', getConfigValue<string>('backgroundColor'));
              setOption('textColor', getConfigValue<string>('primaryColor'));
            }
          }}
          size="sm"
          value="syncArrowColor"
        >
          Sync colors
        </Checkbox>
        {hasCustomTooltip && (
          <span className="text-small text-foreground-500">Disabled with a custom tooltip</span>
        )}
      </div>
      <ButtonsToggle
        onChange={value => setOption('buttons', value)}
        value={getConfigValue<string[]>('buttons')}
      />
      <Switch
        isSelected={getConfigValue<boolean>('showProgress')}
        onValueChange={value => setOption('showProgress', value)}
        size="sm"
      >
        showProgress
      </Switch>

      <Slider
        label="offset"
        maxValue={50}
        minValue={0}
        onChange={value => setOption('offset', value)}
        size="sm"
        step={1}
        value={getConfigValue<number>('offset')}
      />
      <Slider
        label="width"
        maxValue={600}
        minValue={200}
        onChange={value => setOption('width', value)}
        size="sm"
        step={10}
        value={getConfigValue<number>('width')}
      />
    </div>
  );
}
