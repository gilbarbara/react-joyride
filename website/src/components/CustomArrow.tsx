import type { ArrowRenderProps } from 'react-joyride';

export default function CustomArrow({ base, placement, size }: ArrowRenderProps) {
  const [side] = placement.split('-');

  const rotation: Record<string, number> = {
    bottom: 0,
    top: 180,
    left: 90,
    right: -90,
  };

  return (
    <svg
      height={size}
      preserveAspectRatio="none"
      style={{ transform: `rotate(${rotation[side] || 0}deg)` }}
      viewBox="0 0 64 16"
      width={base}
    >
      <path d="M0,16 L64,16 C44.5,15 39.75,0 32,0 C24.25,0 19.5,15 0,16 Z" fill="currentColor" />
    </svg>
  );
}
