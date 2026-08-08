import { type ReactNode, useEffect, useRef } from 'react';
import { useLatest } from '@gilbarbara/hooks';
import { cn } from '@heroui/react';
import { ChevronDownIcon } from 'lucide-react';

import Collapse from '~/components/Collapse';

interface DropdownProps {
  children: ReactNode;
  isOpen: boolean;
  isSelected?: boolean;
  onToggle: () => void;
  title: ReactNode;
}

export default function Dropdown(props: DropdownProps) {
  const { children, isOpen, isSelected, onToggle, title } = props;
  const ref = useRef<HTMLDivElement>(null);

  const callback = useLatest(onToggle);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        callback.current();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback, isOpen]);

  return (
    <div className="inline-flex relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-2 rounded-md px-1 py-0.5 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          {
            'font-bold': isSelected,
          },
        )}
        onClick={onToggle}
        type="button"
      >
        {title}
        <ChevronDownIcon
          aria-hidden
          className={cn('transition-transform duration-200', { 'rotate-180': isOpen })}
          size={16}
        />
      </button>
      <Collapse
        className="absolute top-full left-0 z-50 min-w-52 rounded-lg border border-default bg-content1 py-2 translate-y-1.5 shadow-md"
        isOpen={isOpen}
      >
        <div ref={ref}>{children}</div>
      </Collapse>
    </div>
  );
}
