import type { ReactNode } from 'react';
import { cn } from '@heroui/react';

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('relative w-full flex flex-col flex-1 max-w-7xl mx-auto px-8', className)}>
      {children}
    </div>
  );
}
