import { CSSProperties, Ref } from 'react';

import { Placement, Styles } from '~/types';

interface ArrowProps {
  arrowRef: Ref<HTMLSpanElement>;
  placement: string;
  position: { x?: number; y?: number } | undefined;
  styles: Styles['arrow'];
}

function getPoints(placement: Placement, base: number, size: number) {
  const side = placement.split('-')[0];

  switch (side) {
    case 'top':
      return { points: `0,0 ${base / 2},${size} ${base},0`, width: base, height: size };
    case 'bottom':
      return { points: `${base},${size} ${base / 2},0 0,${size}`, width: base, height: size };
    case 'left':
      return { points: `0,0 ${size},${base / 2} 0,${base}`, width: size, height: base };
    case 'right':
      return { points: `${size},${base} ${size},0 0,${base / 2}`, width: size, height: base };
    default:
      return null;
  }
}

function getPositionStyle(
  placement: Placement,
  position: { x?: number; y?: number } | undefined,
  size: number,
): CSSProperties {
  if (!position) {
    return {};
  }

  const side = placement.split('-')[0];

  switch (side) {
    case 'top':
      return { bottom: -size, left: position.x ?? 0 };
    case 'bottom':
      return { top: -size, left: position.x ?? 0 };
    case 'left':
      return { right: -size, top: position.y ?? 0 };
    case 'right':
      return { left: -size, top: position.y ?? 0 };
    default:
      return {};
  }
}

export default function Arrow({ arrowRef, placement, position, styles }: ArrowProps) {
  const { base, color, size, ...restStyles } = styles;

  const svg = getPoints(placement as Placement, base, size);

  if (!svg) {
    return null;
  }

  return (
    <span
      ref={arrowRef}
      className="react-joyride__arrow"
      data-test-id="arrow"
      style={{
        ...restStyles,
        ...getPositionStyle(placement as Placement, position, size),
        ...(position ? {} : { visibility: 'hidden' }),
      }}
    >
      <svg height={svg.height} width={svg.width} xmlns="http://www.w3.org/2000/svg">
        <polygon fill={color} points={svg.points} />
      </svg>
    </span>
  );
}
