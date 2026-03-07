import { cn, Code as HeroCode, type CodeProps as HeroCodeProps } from '@heroui/react';

interface CodeProps extends HeroCodeProps {
  bold?: boolean;
}

export default function Code(props: CodeProps) {
  const { bold = false, children, className, color = 'default' } = props;

  return (
    <HeroCode
      className={cn('px-1 py-0.5 rounded-sm', className, {
        'dark:bg-default': color === 'default',
        'font-bold': bold,
      })}
      color={color}
    >
      {children}
    </HeroCode>
  );
}
