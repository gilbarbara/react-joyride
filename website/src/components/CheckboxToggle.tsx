import { type CheckboxProps, Chip, tv, useCheckbox, VisuallyHidden } from '@heroui/react';
import { CheckIcon, XIcon } from 'lucide-react';

export default function CheckboxToggle(props: CheckboxProps) {
  const checkbox = tv({
    slots: {
      base: 'border-default hover:bg-default-200',
      content: 'text-default-500',
    },
    variants: {
      isSelected: {
        true: {
          base: 'border-primary bg-primary hover:bg-primary-500 hover:border-primary-500',
          content: 'text-primary-foreground pl-1',
        },
      },
      isFocusVisible: {
        true: {
          base: 'outline-solid outline-transparent ring-2 ring-focus ring-offset-2 ring-offset-background',
        },
      },
    },
  });

  const { children, getBaseProps, getInputProps, getLabelProps, isFocusVisible, isSelected } =
    useCheckbox({
      ...props,
    });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        startContent={
          isSelected ? (
            <CheckIcon className="text-white" size={14} />
          ) : (
            <XIcon className="text-primary-foreground" size={14} />
          )
        }
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? 'Enabled' : 'Disabled'}
      </Chip>
    </label>
  );
}
