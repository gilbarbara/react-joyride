import type { ReactNode } from 'react';
import { cn } from '@heroui/react';
import { CirclePlayIcon, InfoIcon, LightbulbIcon, TriangleAlertIcon } from 'lucide-react';

interface CalloutProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  type?: 'demo' | 'info' | 'tip' | 'warning';
}

const styles = {
  demo: 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/50',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/50',
  tip: 'border-green-500 bg-green-50 dark:bg-green-950/50',
  warning: 'border-amber-500 bg-amber-50 dark:bg-amber-950/50',
};

const labelColors = {
  demo: 'text-fuchsia-600 dark:text-fuchsia-500',
  info: 'text-blue-600 dark:text-blue-500',
  tip: 'text-green-600',
  warning: 'text-amber-600',
};

const textColors = {
  demo: 'text-fuchsia-900 dark:text-fuchsia-300',
  info: 'text-blue-900 dark:text-blue-300',
  tip: 'text-green-900 dark:text-green-300',
  warning: 'text-amber-900 dark:text-amber-300',
};

const icons = {
  demo: <CirclePlayIcon className="size-5 text-fuchsia-600 shrink-0" />,
  info: <InfoIcon className="size-5 text-blue-600 shrink-0" />,
  tip: <LightbulbIcon className="size-5 text-green-600 shrink-0" />,
  warning: <TriangleAlertIcon className="size-5 text-amber-600 shrink-0" />,
};

export default function Callout(props: CalloutProps) {
  const { children, className, title, type = 'info' } = props;

  return (
    <div className={cn('rounded-lg border-l-4 p-4 my-4', styles[type], className)}>
      <div className="flex items-center gap-2 mb-2">
        {icons[type]}
        <span className={cn('text-small font-bold uppercase', labelColors[type])}>
          {title ?? type}
        </span>
      </div>
      <div className={cn('text-base', textColors[type])}>{children}</div>
    </div>
  );
}
