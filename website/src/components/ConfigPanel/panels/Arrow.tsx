import React from 'react';
import { Slider } from '@heroui/react';

import type { ConfigContextValue } from '~/context/ConfigContext';

interface ArrowPanelProps extends Pick<ConfigContextValue, 'initialConfig' | 'getConfigValue'> {
  setOption: (key: string, value: unknown) => void;
}

export default function ArrowPanel(props: ArrowPanelProps) {
  const { getConfigValue, setOption } = props;

  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="arrowBase"
        maxValue={128}
        minValue={4}
        onChange={value => setOption('arrowBase', value)}
        size="sm"
        step={2}
        value={getConfigValue<number>('arrowBase')}
      />
      <Slider
        label="arrowSize"
        maxValue={128}
        minValue={4}
        onChange={value => setOption('arrowSize', value)}
        size="sm"
        step={2}
        value={getConfigValue<number>('arrowSize')}
      />
      <Slider
        label="arrowSpacing"
        maxValue={20}
        minValue={0}
        onChange={value => setOption('arrowSpacing', value)}
        size="sm"
        step={1}
        value={getConfigValue<number>('arrowSpacing')}
      />
    </div>
  );
}
