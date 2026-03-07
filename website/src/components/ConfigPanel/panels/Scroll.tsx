import { Slider, Switch } from '@heroui/react';

import type { ConfigContextValue } from '~/context/ConfigContext';

interface ScrollPanelProps extends Pick<
  ConfigContextValue,
  'initialConfig' | 'updateSettings' | 'getConfigValue'
> {
  setOption: (key: string, value: unknown) => void;
}

export default function ScrollPanel(props: ScrollPanelProps) {
  const { getConfigValue, setOption, updateSettings } = props;

  return (
    <div className="flex flex-col gap-4">
      <Switch
        isSelected={getConfigValue<boolean>('scrollToFirstStep')}
        onValueChange={value => updateSettings({ scrollToFirstStep: value })}
        size="sm"
      >
        scrollToFirstStep
      </Switch>
      <Switch
        isSelected={getConfigValue<boolean>('skipScroll')}
        onValueChange={value => setOption('skipScroll', value)}
        size="sm"
      >
        skipScroll
      </Switch>
      <Slider
        label="scrollDuration"
        maxValue={1000}
        minValue={0}
        onChange={value => setOption('scrollDuration', value)}
        size="sm"
        step={10}
        value={getConfigValue<number>('scrollDuration')}
      />
      <Slider
        label="scrollOffset"
        maxValue={100}
        minValue={0}
        onChange={value => setOption('scrollOffset', value)}
        size="sm"
        step={1}
        value={getConfigValue<number>('scrollOffset')}
      />
    </div>
  );
}
