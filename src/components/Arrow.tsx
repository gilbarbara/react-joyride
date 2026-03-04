import { CSSProperties, ElementType, Ref } from 'react';

import { ArrowRenderProps, Placement, Styles } from '~/types';

interface ArrowProps {
  arrowComponent?: ElementType<ArrowRenderProps>;
  arrowRef: Ref<HTMLElement>;
  placement: Placement;
  position: { x?: number; y?: number } | undefined;
  styles: Styles['arrow'];
}

function getDimensions(placement: Placement, base: number, size: number) {
  const [side] = placement.split('-');

  switch (side) {
    case 'top':
    case 'bottom':
      return { width: base, height: size };
    case 'left':
    case 'right':
      return { width: size, height: base };
    default:
      return null;
  }
}

function getPoints(placement: Placement, base: number, size: number) {
  const [side] = placement.split('-');

  switch (side) {
    case 'top':
      return {
        points: `0,0 ${base / 2},${size} ${base},0`,
        ...getDimensions(placement, base, size),
      };
    case 'bottom':
      return {
        points: `${base},${size} ${base / 2},0 0,${size}`,
        ...getDimensions(placement, base, size),
      };
    case 'left':
      return {
        points: `0,0 ${size},${base / 2} 0,${base}`,
        ...getDimensions(placement, base, size),
      };
    case 'right':
      return {
        points: `${size},${base} ${size},0 0,${base / 2}`,
        ...getDimensions(placement, base, size),
      };
    default:
      return null;
  }
}

function getPositionStyle(
  placement: Placement,
  position: { x?: number; y?: number } | undefined,
  size: number,
  base: number,
): CSSProperties {
  if (!position) {
    return {};
  }

  const [side] = placement.split('-');

  switch (side) {
    case 'top':
      return { bottom: -size, left: position.x ?? 0, ...getDimensions(placement, base, size) };
    case 'bottom':
      return { top: -size, left: position.x ?? 0, ...getDimensions(placement, base, size) };
    case 'left':
      return { right: -size, top: position.y ?? 0, ...getDimensions(placement, base, size) };
    case 'right':
      return { left: -size, top: position.y ?? 0, ...getDimensions(placement, base, size) };
    default:
      return {};
  }
}

export default function Arrow({
  arrowComponent,
  arrowRef,
  placement,
  position,
  styles,
}: ArrowProps) {
  const { base, size, ...restStyles } = styles;
  const ArrowComponent = arrowComponent;

  let content = null;

  if (ArrowComponent) {
    const dimensions = getDimensions(placement, base, size);

    if (!dimensions) {
      return null;
    }

    content = (
      <span style={{ flexShrink: 0 }}>
        <ArrowComponent base={base} placement={placement} size={size} />
      </span>
    );
  } else {
    const svg = getPoints(placement, base, size);

    if (!svg) {
      return null;
    }

    content = (
      <svg height={svg.height} width={svg.width} xmlns="http://www.w3.org/2000/svg">
        <polygon fill="currentColor" points={svg.points} />
      </svg>
    );
  }

  return (
    <span
      ref={arrowRef}
      className="react-joyride__arrow"
      data-testid="arrow"
      style={{
        ...restStyles,
        ...getPositionStyle(placement, position, size, base),
        ...(position ? {} : { visibility: 'hidden' }),
      }}
    >
      {content}
    </span>
  );
}
