import type { ReactNode } from 'react';
import { cn } from '@heroui/react';
import { LightbulbIcon } from 'lucide-react';

interface TipProps {
  children: ReactNode;
  className?: string;
  iconSize?: number;
}

export default function Tip(props: TipProps) {
  const { children, className, iconSize = 14 } = props;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-start gap-1 mt-4 p-2 bg-gray-200/75 dark:bg-gray-800/75 text-foreground text-sm text-start rounded-small',
        className,
      )}
    >
      <LightbulbIcon className="inline-flex shrink-0" size={iconSize} />
      <span>{children}</span>
    </div>
  );
}
