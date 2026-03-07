import type { HTMLAttributes } from 'react';
import { cn } from '@heroui/react';

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  withHeader: boolean;
}

export default function Section({ className, withHeader, ...props }: SectionProps) {
  return (
    <div
      className={cn('flex items-center justify-center px-4 py-8 text-white', className, {
        'min-h-[calc(100dvh-4rem)]': withHeader,
        'min-h-dvh': !withHeader,
      })}
      {...props}
    />
  );
}
