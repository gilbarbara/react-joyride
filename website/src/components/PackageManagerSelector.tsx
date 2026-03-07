'use client';

import { useState } from 'react';
import { objectKeys } from '@gilbarbara/helpers';
import { cn, Snippet } from '@heroui/react';

interface PackageManagerSelectorProps {
  className?: string;
  justify?: 'start' | 'center' | 'end';
}

const commands = {
  npm: 'npm install react-joyride',
  pnpm: 'pnpm add react-joyride',
  yarn: 'yarn add react-joyride',
  bun: 'bun add react-joyride',
} as const;

function PackageManagerSelector(props: PackageManagerSelectorProps) {
  const { className, justify = 'start' } = props;
  const [manager, setManager] = useState<keyof typeof commands>('npm');

  return (
    <div className={cn('bg-default-100 rounded-lg w-82', className)}>
      <div
        className={cn('flex items-center gap-1 border-b border-default', {
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
        })}
      >
        {objectKeys(commands).map(key => (
          <button
            key={key}
            className={cn('py-1 px-4', {
              'border-b border-foreground': manager === key,
            })}
            onClick={() => setManager(key)}
            type="button"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="p-4">
        <Snippet className="w-full" color="primary">
          {commands[manager]}
        </Snippet>
      </div>
    </div>
  );
}

export default PackageManagerSelector;
