import { type ChangeEventHandler, useRef } from 'react';
import { Button, cn } from '@heroui/react';

interface ColorPickerProps {
  className?: string;
  color: string;
  isDisabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  size?: 'sm' | 'md' | 'lg';
}

export default function ColorPicker(props: ColorPickerProps) {
  const { className, color, isDisabled, onChange, size = 'md', ...rest } = props;
  const colorInputRef = useRef<HTMLInputElement>(null);

  const left = {
    sm: 'left-8',
    md: 'left-10',
    lg: 'left-12',
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={colorInputRef}
        aria-hidden="true"
        className={cn('sr-only absolute top-1/2', left[size])}
        onChange={onChange}
        tabIndex={-1}
        type="color"
        value={color}
      />
      <Button
        aria-label="Color picker"
        className={cn(
          'shrink-0 text-foreground/10 disabled:text-foreground-200/10 rounded-full border-2 border-default disabled:cursor-not-allowed',
          className,
        )}
        data-color={color}
        isDisabled={isDisabled}
        isIconOnly
        onPress={() => colorInputRef.current?.click()}
        size={size}
        style={{ backgroundColor: color }}
        {...rest}
      />
    </div>
  );
}
