import { useMemo } from 'react';
import { Button, cn, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@heroui/react';
import { ColorPicker as ColorPickerComponent } from '@transience/color-picker';

export interface ColorPickerProps {
  className?: string;
  color: string;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  showAlpha?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ColorPicker(props: ColorPickerProps) {
  const { className, color, isDisabled, onChange, showAlpha = false, size = 'sm', ...rest } = props;
  const { isOpen, onOpenChange } = useDisclosure();

  const currentColor = useMemo(() => {
    return color === 'transparent' ? '#00000000' : color;
  }, [color]);

  return (
    <div className="relative flex items-center">
      <Popover
        backdrop="transparent"
        classNames={{
          trigger: 'aria-expanded:opacity-100 aria-expanded:scale-[1]',
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-start"
      >
        <PopoverTrigger>
          <Button
            aria-label="Color picker"
            className={cn(
              'shrink-0 text-foreground/10 disabled:text-foreground-200/10 rounded-full border-2 border-default disabled:cursor-not-allowed',
              className,
            )}
            data-color={color}
            isDisabled={isDisabled}
            isIconOnly
            size={size}
            style={{ backgroundImage: `url(/images/transparent-bg.gif)` }}
            {...rest}
          >
            <span className="size-full" style={{ backgroundColor: color }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 min-w-xs">
          <ColorPickerComponent
            color={currentColor}
            defaultMode="hsl"
            onChange={colorResult => {
              onChange(colorResult);
            }}
            outputFormat="hex"
            showAlpha={showAlpha}
            showGlobalHue
            showInputs={false}
            showModeSelector={false}
            showSliders={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
