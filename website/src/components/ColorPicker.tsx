import { Button, cn, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@heroui/react';
import Chrome, { ChromeInputType } from '@uiw/react-color-chrome';

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
            style={{ backgroundColor: color }}
            {...rest}
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 ">
          <Chrome
            color={color}
            inputType={ChromeInputType.HEXA}
            onChange={colorResult => {
              onChange(showAlpha ? colorResult.hexa : colorResult.hex);
            }}
            showAlpha={showAlpha}
            showTriangle={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
