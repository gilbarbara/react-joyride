/* eslint-disable react/no-array-index-key */
import { cn, type ThemeColors } from '@heroui/react';

interface InternalProps {
  className?: string;
  color: keyof ThemeColors;
  size: 'sm' | 'md' | 'lg';
}

export interface LoaderProps extends Partial<InternalProps> {
  text?: string;
  variant?:
    | 'bars'
    | 'circular'
    | 'classic'
    | 'dots'
    | 'loading-dots'
    | 'pulse'
    | 'pulse-dot'
    | 'terminal'
    | 'typing'
    | 'wave';
}

export function BarsLoader({ className, color, size = 'md' }: InternalProps) {
  const barWidths = {
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
  };

  const containerSizes = {
    sm: 'h-4 gap-1',
    md: 'h-5 gap-1.5',
    lg: 'h-6 gap-2',
  };

  return (
    <div className={cn('flex', containerSizes[size], className)}>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={cn(
            `bg-${color} h-full animate-[wave-bars_1.2s_ease-in-out_infinite]`,
            barWidths[size],
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function CircularLoader({ className, color, size = 'md' }: InternalProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  return (
    <div
      className={cn(
        `border-${color} animate-spin rounded-full border-2 border-t-transparent`,
        sizeClasses[size],
        className,
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function ClassicLoader({ className, color, size = 'md' }: InternalProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  const barSizes = {
    sm: { height: '6px', width: '1.5px' },
    md: { height: '8px', width: '2px' },
    lg: { height: '10px', width: '2.5px' },
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute h-full w-full">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className={`bg-${color} absolute animate-[spinner-fade_1.2s_linear_infinite] rounded-full`}
            style={{
              top: '0',
              left: '50%',
              marginLeft: size === 'sm' ? '-0.75px' : size === 'lg' ? '-1.25px' : '-1px',
              transformOrigin: `${size === 'sm' ? '0.75px' : size === 'lg' ? '1.25px' : '1px'} ${size === 'sm' ? '10px' : size === 'lg' ? '14px' : '12px'}`,
              transform: `rotate(${index * 30}deg)`,
              opacity: 0,
              animationDelay: `${index * 0.1}s`,
              height: barSizes[size].height,
              width: barSizes[size].width,
            }}
          />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function DotsLoader({ className, color, size = 'md' }: InternalProps) {
  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  const containerSizes = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  };

  return (
    <div className={cn('flex items-center space-x-1', containerSizes[size], className)}>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={cn(
            `bg-${color} animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full`,
            dotSizes[size],
          )}
          style={{
            animationDelay: `${index * 160}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default function Loader(props: LoaderProps) {
  const { className, color = 'primary', size = 'md', text, variant = 'circular' } = props;

  switch (variant) {
    case 'circular':
      return <CircularLoader className={className} color={color} size={size} />;
    case 'classic':
      return <ClassicLoader className={className} color={color} size={size} />;
    case 'pulse':
      return <PulseLoader className={className} color={color} size={size} />;
    case 'pulse-dot':
      return <PulseDotLoader className={className} color={color} size={size} />;
    case 'dots':
      return <DotsLoader className={className} color={color} size={size} />;
    case 'typing':
      return <TypingLoader className={className} color={color} size={size} />;
    case 'wave':
      return <WaveLoader className={className} color={color} size={size} />;
    case 'bars':
      return <BarsLoader className={className} color={color} size={size} />;
    case 'terminal':
      return <TerminalLoader className={className} color={color} size={size} />;
    case 'loading-dots':
      return <TextDotsLoader className={className} color={color} size={size} text={text} />;
    default:
      return <CircularLoader className={className} color={color} size={size} />;
  }
}

export function PulseDotLoader({ className, color, size = 'md' }: InternalProps) {
  const sizeClasses = {
    sm: 'size-1',
    md: 'size-2',
    lg: 'size-3',
  };

  return (
    <div
      className={cn(
        `bg-${color} animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full`,
        sizeClasses[size],
        className,
      )}
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function PulseLoader({ className, color, size = 'md' }: InternalProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div
        className={`border-${color} absolute inset-0 animate-[thin-pulse_1.5s_ease-in-out_infinite] rounded-full border-2`}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TerminalLoader({ className, color, size = 'md' }: InternalProps) {
  const cursorSizes = {
    sm: 'h-3 w-1.5',
    md: 'h-4 w-2',
    lg: 'h-5 w-2.5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const containerSizes = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  };

  return (
    <div className={cn('flex items-center space-x-1', containerSizes[size], className)}>
      <span className={cn(`text-${color} font-mono`, textSizes[size])}>{'>'}</span>
      <div className={cn(`bg-${color} animate-[blink_1s_step-end_infinite]`, cursorSizes[size])} />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextDotsLoader({
  className,
  color,
  size = 'md',
  text = 'Thinking',
}: InternalProps & { text?: string }) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center', className)}>
      <span className={cn(`text-${color} font-medium`, textSizes[size])}>{text}</span>
      <span className="inline-flex">
        <span className={`text-${color} animate-[loading-dots_1.4s_infinite_0.2s]`}>.</span>
        <span className={`text-${color} animate-[loading-dots_1.4s_infinite_0.4s]`}>.</span>
        <span className={`text-${color} animate-[loading-dots_1.4s_infinite_0.6s]`}>.</span>
      </span>
    </div>
  );
}

export function TypingLoader({ className, color, size = 'md' }: InternalProps) {
  const dotSizes = {
    sm: 'h-1 w-1',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
  };

  const containerSizes = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  };

  return (
    <div className={cn('flex items-center space-x-1', containerSizes[size], className)}>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className={cn(`bg-${color} animate-[typing_1s_infinite] rounded-full`, dotSizes[size])}
          style={{
            animationDelay: `${index * 250}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function WaveLoader({ className, color, size = 'md' }: InternalProps) {
  const barWidths = {
    sm: 'w-0.5',
    md: 'w-0.5',
    lg: 'w-1',
  };

  const containerSizes = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6',
  };

  const heights = {
    sm: ['6px', '9px', '12px', '9px', '6px'],
    md: ['8px', '12px', '16px', '12px', '8px'],
    lg: ['10px', '15px', '20px', '15px', '10px'],
  };

  return (
    <div className={cn('flex items-center gap-0.5', containerSizes[size], className)}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={cn(
            `bg-${color} animate-[wave_1s_ease-in-out_infinite] rounded-full`,
            barWidths[size],
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            height: heights[size][index],
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}
