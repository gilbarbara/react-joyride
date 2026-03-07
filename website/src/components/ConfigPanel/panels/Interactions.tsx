import React from 'react';
import { Button, ButtonGroup, Switch } from '@heroui/react';

import type { ConfigContextValue } from '~/context/ConfigContext';

interface InterationsPanelProps extends Pick<
  ConfigContextValue,
  'initialConfig' | 'getConfigValue'
> {
  setOption: (key: string, value: unknown) => void;
}

export default function InterationsPanel(props: InterationsPanelProps) {
  const { getConfigValue, setOption } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Switch
          isSelected={getConfigValue<boolean>('blockTargetInteraction')}
          onValueChange={value => setOption('blockTargetInteraction', value)}
          size="sm"
        >
          blockTargetInteraction
        </Switch>
        <Switch
          isSelected={getConfigValue<boolean>('disableFocusTrap')}
          onValueChange={value => setOption('disableFocusTrap', value)}
          size="sm"
        >
          disableFocusTrap
        </Switch>
      </div>
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="text-small ">dismissKeyAction</label>
        <ButtonGroup className="justify-start" size="sm">
          {(['close', 'next', false] as const).map(value => {
            const current = getConfigValue<'close' | 'next' | false>('dismissKeyAction');

            return (
              <Button
                key={String(value)}
                color={current === value ? 'primary' : 'default'}
                onPress={() => setOption('dismissKeyAction', value)}
                variant={current === value ? 'solid' : 'bordered'}
              >
                {value === false ? 'none' : value}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="text-small ">overlayClickAction</label>
        <ButtonGroup className="justify-start" size="sm">
          {(['close', 'next', false] as const).map(value => {
            const current = getConfigValue<'close' | 'next' | false>('overlayClickAction');

            return (
              <Button
                key={String(value)}
                color={current === value ? 'primary' : 'default'}
                onPress={() => setOption('overlayClickAction', value)}
                variant={current === value ? 'solid' : 'bordered'}
              >
                {value === false ? 'none' : value}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="text-small ">closeButtonAction</label>
        <ButtonGroup className="justify-start" size="sm">
          {(['close', 'skip'] as const).map(value => {
            const current = getConfigValue<'close' | 'skip'>('closeButtonAction');

            return (
              <Button
                key={value}
                color={current === value ? 'primary' : 'default'}
                onPress={() => setOption('closeButtonAction', value)}
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
