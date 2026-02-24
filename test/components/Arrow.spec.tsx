import { createRef } from 'react';

import { cleanup, createStep, render, screen } from '~/test-utils';

import Arrow from '../../src/components/Arrow';

const step = createStep();

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    arrowRef: createRef<HTMLSpanElement>(),
    placement: 'bottom',
    position: { x: 10, y: 20 } as { x?: number; y?: number } | undefined,
    styles: step.styles.arrow,
    ...overrides,
  };
}

describe('Arrow', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render with bottom placement', () => {
    const props = createProps();

    render(<Arrow {...props} />);

    const arrow = screen.getByTestId('arrow');

    expect(arrow).toHaveStyle({ top: '-16px', left: '10px' });

    const svg = arrow.querySelector('svg')!;

    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '16');

    const polygon = svg.querySelector('polygon')!;

    expect(polygon).toHaveAttribute('points', '32,16 16,0 0,16');
    expect(polygon).toHaveAttribute('fill', '#fff');
  });

  it('should render with top placement', () => {
    const props = createProps({ placement: 'top' });

    render(<Arrow {...props} />);

    const arrow = screen.getByTestId('arrow');

    expect(arrow).toHaveStyle({ bottom: '-16px', left: '10px' });

    const svg = arrow.querySelector('svg')!;

    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg.querySelector('polygon')).toHaveAttribute('points', '0,0 16,16 32,0');
  });

  it('should render with left placement', () => {
    const props = createProps({ placement: 'left' });

    render(<Arrow {...props} />);

    const arrow = screen.getByTestId('arrow');

    expect(arrow).toHaveStyle({ right: '-16px', top: '20px' });

    const svg = arrow.querySelector('svg')!;

    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg.querySelector('polygon')).toHaveAttribute('points', '0,0 16,16 0,32');
  });

  it('should render with right placement', () => {
    const props = createProps({ placement: 'right' });

    render(<Arrow {...props} />);

    const arrow = screen.getByTestId('arrow');

    expect(arrow).toHaveStyle({ left: '-16px', top: '20px' });

    const svg = arrow.querySelector('svg')!;

    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg.querySelector('polygon')).toHaveAttribute('points', '16,32 16,0 0,16');
  });

  it('should render hidden when position is undefined', () => {
    const props = createProps({ position: undefined });

    render(<Arrow {...props} />);

    const arrow = screen.getByTestId('arrow');

    expect(arrow).toHaveStyle({ visibility: 'hidden' });
    expect(arrow.querySelector('svg')).toBeInTheDocument();
  });

  it('should not have visibility hidden when position is defined', () => {
    const props = createProps();

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).not.toHaveStyle({ visibility: 'hidden' });
  });

  it('should return null for invalid placement', () => {
    const props = createProps({ placement: 'center' });

    const { container } = render(<Arrow {...props} />);

    expect(container.innerHTML).toBe('');
  });

  it('should attach ref to span', () => {
    const ref = createRef<HTMLSpanElement>();
    const props = createProps({ arrowRef: ref });

    render(<Arrow {...props} />);

    expect(ref.current).toBe(screen.getByTestId('arrow'));
  });
});
