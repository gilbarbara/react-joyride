import { Slider, Switch } from '@heroui/react';

import { defaultOptions } from '~/config/defaults';
import type { ConfigContextValue } from '~/context/ConfigContext';

import ColorSelector from '~/components/ColorSelector';

interface OverlayPanelProps extends Pick<
  ConfigContextValue,
  'initialConfig' | 'getConfigValue' | 'updateSettings'
> {
  setOption: (key: string, value: unknown) => void;
}

export default function OverlayPanel(props: OverlayPanelProps) {
  const { getConfigValue, initialConfig, setOption, updateSettings } = props;
  const initialOptions = initialConfig.options ?? {};
  const initialSpotlight = initialConfig.styles?.spotlight;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ColorSelector
          className="w-1/2"
          color={getConfigValue<string>('overlayColor')}
          fallback={defaultOptions.overlayColor}
          initialColor={initialOptions.overlayColor}
          label="overlayColor"
          onChange={value => setOption('overlayColor', value)}
          showAlpha
        />
        <Switch
          className="mt-6"
          isSelected={getConfigValue<boolean>('hideOverlay')}
          onValueChange={value => setOption('hideOverlay', value)}
          size="sm"
        >
          hideOverlay
        </Switch>
      </div>
      <Slider
        label="spotlightPadding"
        maxValue={50}
        minValue={0}
        onChange={value => setOption('spotlightPadding', value)}
        size="sm"
        step={1}
        value={getConfigValue<number>('spotlightPadding')}
      />
      <Slider
        label="spotlightRadius"
        maxValue={64}
        minValue={0}
        onChange={value => setOption('spotlightRadius', value)}
        size="sm"
        step={1}
        value={getConfigValue<number>('spotlightRadius')}
      />
      <ColorSelector
        color={getConfigValue<string>('spotlight.stroke') ?? 'transparent'}
        fallback="transparent"
        initialColor={(initialSpotlight?.stroke as string) ?? 'transparent'}
        label="spotlight.stroke"
        onChange={value => updateSettings({ styles: { spotlight: { stroke: value } } })}
        showAlpha
      />
      <Slider
        label="spotlight.strokeWidth"
        maxValue={20}
        minValue={0}
        onChange={value =>
          updateSettings({
            styles: { spotlight: { strokeWidth: `${value}px` } },
          })
        }
        size="sm"
        step={1}
        value={parseInt(getConfigValue<string>('spotlight.strokeWidth') || '0', 10)}
      />
      <Slider
        label="spotlight.strokeDasharray"
        maxValue={20}
        minValue={0}
        onChange={value =>
          updateSettings({
            styles: { spotlight: { strokeDasharray: `${value}px` } },
          })
        }
        size="sm"
        step={1}
        value={parseInt(getConfigValue<string>('spotlight.strokeDasharray') || '0', 10)}
      />
      <Slider
        label="spotlight.blur"
        maxValue={20}
        minValue={0}
        onChange={value =>
          updateSettings({
            styles: { spotlight: { filter: `blur(${value}px)` } },
          })
        }
        size="sm"
        step={1}
        value={parseInt(getConfigValue<string>('spotlight.filter')?.match(/\d+/)?.[0] || '0', 10)}
      />
    </div>
  );
}
