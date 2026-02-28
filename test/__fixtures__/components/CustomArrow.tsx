import { ArrowRenderProps } from '~/types';

export default function CustomArrow(props: ArrowRenderProps) {
  const { base, placement, size } = props;
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
      transform={`rotate(${rotation[side] || 0})`}
      viewBox="0 0 50 40"
      width={base}
    >
      <path d="M25,0 C25,32 10,38 0,40 L50,40 C40,38 25,32 25,0 Z" fill="currentColor" />
    </svg>
  );
}
