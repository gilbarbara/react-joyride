import { CheckboxGroup, type CheckboxGroupProps } from '@heroui/react';

import CheckboxToggle from './CheckboxToggle';

interface ButtonsToggleProps extends CheckboxGroupProps {
  onChange?: (value: string[]) => void;
  value: string[];
}

const buttonOrder = ['back', 'close', 'primary', 'skip'];

export default function ButtonsToggle(props: ButtonsToggleProps) {
  const { onChange, value } = props;

  const handleChange = (next: string[]) => {
    onChange?.(buttonOrder.filter(b => next.includes(b)));
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <CheckboxGroup
        className="gap-1"
        classNames={{
          label: 'text-small font-bold text-foreground',
        }}
        label="Buttons"
        onChange={handleChange}
        orientation="horizontal"
        value={value}
      >
        <CheckboxToggle size="sm" value="back">
          back
        </CheckboxToggle>
        <CheckboxToggle size="sm" value="close">
          close
        </CheckboxToggle>
        <CheckboxToggle size="sm" value="primary">
          primary
        </CheckboxToggle>
        <CheckboxToggle size="sm" value="skip">
          skip
        </CheckboxToggle>
      </CheckboxGroup>
    </div>
  );
}
