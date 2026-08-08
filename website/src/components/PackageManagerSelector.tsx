'use client';

import { useId, useState } from 'react';
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
  const tablistId = useId();

  return (
    <div className={cn('bg-default-100 rounded-lg w-full max-w-82', className)}>
      <div
        aria-label="Package manager"
        className={cn('flex items-center gap-1 border-b border-default', {
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
        })}
        role="tablist"
      >
        {objectKeys(commands).map(key => {
          const selected = manager === key;

          return (
            <button
              key={key}
              aria-controls={`${tablistId}-${key}`}
              aria-selected={selected}
              className={cn(
                'py-1.5 px-3 sm:px-4 text-sm rounded-t-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                {
                  'border-b-2 border-foreground font-medium': selected,
                  'text-default-500 hover:text-foreground': !selected,
                },
              )}
              id={`${tablistId}-tab-${key}`}
              onClick={() => setManager(key)}
              role="tab"
              type="button"
            >
              {key}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={`${tablistId}-tab-${manager}`}
        className="p-3 sm:p-4"
        id={`${tablistId}-${manager}`}
        role="tabpanel"
      >
        <Snippet className="w-full" color="primary">
          {commands[manager]}
        </Snippet>
      </div>
    </div>
  );
}

export default PackageManagerSelector;
