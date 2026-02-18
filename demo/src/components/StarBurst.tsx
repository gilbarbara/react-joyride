import { type HTMLAttributes } from 'react';
import { cn } from '@heroui/react';

export default function StarBurst({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('star-burst', className)} {...rest}>
      <div />
      <span>{children}</span>
    </div>
  );
}
