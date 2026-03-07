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
        className={cn('flex items-center gap-2 hover:underline', {
          'font-bold': isSelected,
        })}
        onClick={onToggle}
        type="button"
      >
        {title}
        <ChevronDownIcon size={16} />
      </button>
      <Collapse
        className="absolute top-full left-0 bg-content1 translate-y-1.5 shadow-lg"
        isOpen={isOpen}
      >
        <div ref={ref}>{children}</div>
      </Collapse>
    </div>
  );
}
