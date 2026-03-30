import { cn } from '@heroui/react';
import { CircleXIcon } from 'lucide-react';

import ColorPicker, { type ColorPickerProps } from '~/components/ColorPicker';

interface ColorSelectorProps extends ColorPickerProps {
  fallback: string;
  initialColor?: string;
  label: string;
}

export default function ColorSelector(props: ColorSelectorProps) {
  const { className, color, fallback, initialColor, label, onChange, ...rest } = props;

  const isCustomized = initialColor && initialColor !== color;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-small">{label}</span>
      <div className="flex items-center gap-2">
        <ColorPicker color={color || fallback} onChange={onChange} {...rest} />
        {isCustomized && (
          <button
            aria-label="Reset color"
            className="p-1"
            onClick={() => onChange(initialColor)}
            title="Reset Color"
            type="button"
          >
            <CircleXIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
