import React from 'react';
import { Button, ButtonGroup, Slider, Switch } from '@heroui/react';

import type { ConfigContextValue } from '~/context/ConfigContext';

interface BeaconPanelProps extends Pick<ConfigContextValue, 'initialConfig' | 'getConfigValue'> {
  setOption: (key: string, value: unknown) => void;
}

export default function BeaconPanel(props: BeaconPanelProps) {
  const { getConfigValue, setOption } = props;

  return (
    <div className="flex flex-col gap-4">
      <Switch
        isSelected={getConfigValue<boolean>('skipBeacon')}
        onValueChange={value => setOption('skipBeacon', value)}
        size="sm"
      >
        skipBeacon
      </Switch>
      <Slider
        label="beaconSize"
        maxValue={80}
        minValue={20}
        onChange={value => setOption('beaconSize', value)}
        size="sm"
        step={2}
        value={getConfigValue<number>('beaconSize')}
      />
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="text-small ">beaconTrigger</label>
        <ButtonGroup className="justify-start" size="sm">
          {(['click', 'hover'] as const).map(value => {
            const current = getConfigValue<'click' | 'hover'>('beaconTrigger');

            return (
              <Button
                key={value}
                color={current === value ? 'primary' : 'default'}
                onPress={() => setOption('beaconTrigger', value)}
                variant={current === value ? 'solid' : 'bordered'}
              >
                {value}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
    </div>
  );
}
