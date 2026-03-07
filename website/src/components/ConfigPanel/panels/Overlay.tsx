import { Input, Slider, Switch } from '@heroui/react';

import type { ConfigContextValue } from '~/context/ConfigContext';

interface OverlayPanelProps extends Pick<ConfigContextValue, 'initialConfig' | 'getConfigValue'> {
  setOption: (key: string, value: unknown) => void;
}

export default function OverlayPanel(props: OverlayPanelProps) {
  const { getConfigValue, setOption } = props;

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="overlayColor"
        onValueChange={value => setOption('overlayColor', value)}
        size="sm"
        value={getConfigValue<string>('overlayColor')}
      />
      <Switch
        isSelected={getConfigValue<boolean>('hideOverlay')}
        onValueChange={value => setOption('hideOverlay', value)}
        size="sm"
      >
        hideOverlay
      </Switch>
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
