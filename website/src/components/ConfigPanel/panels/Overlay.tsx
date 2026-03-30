import { Slider, Switch } from '@heroui/react';

import { defaultOptions } from '~/config/defaults';
import type { ConfigContextValue } from '~/context/ConfigContext';

import ColorSelector from '~/components/ColorSelector';

interface OverlayPanelProps extends Pick<ConfigContextValue, 'initialConfig' | 'getConfigValue'> {
  setOption: (key: string, value: unknown) => void;
}

export default function OverlayPanel(props: OverlayPanelProps) {
  const { getConfigValue, initialConfig, setOption } = props;
  const initialOptions = initialConfig.options ?? {};

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
    </div>
  );
}
