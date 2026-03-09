import { createRef } from 'react';

import { cleanup, createStep, render, screen } from '~/test-utils';

import Arrow from '~/components/Arrow';

import CustomArrow from '../__fixtures__/components/CustomArrow';

const step = createStep();

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    arrowRef: createRef<HTMLElement>(),
    base: step.arrowBase,
    placement: 'bottom' as const,
    position: { x: 10, y: 20 } as { x?: number; y?: number } | undefined,
    size: step.arrowSize,
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

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should render with top placement', () => {
    const props = createProps({ placement: 'top' });

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should render with left placement', () => {
    const props = createProps({ placement: 'left' });

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should render with right placement', () => {
    const props = createProps({ placement: 'right' });

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should render hidden when position is undefined', () => {
    const props = createProps({ position: undefined });

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should not have visibility hidden when position is defined', () => {
    const props = createProps();

    render(<Arrow {...props} />);

    expect(screen.getByTestId('arrow')).toMatchSnapshot();
  });

  it('should return null for "center" placement', () => {
    const props = createProps({ placement: 'center' });

    const { container } = render(<Arrow {...props} />);

    expect(container.firstChild).toBeNull();
  });

  it('should attach ref to span', () => {
    const ref = createRef<HTMLSpanElement>();
    const props = createProps({ arrowRef: ref });

    render(<Arrow {...props} />);

    expect(ref.current).toBe(screen.getByTestId('arrow'));
  });

  describe('arrowComponent', () => {
    it('should render custom arrow', () => {
      const props = createProps({ arrowComponent: CustomArrow });

      render(<Arrow {...props} />);

      expect(screen.getByTestId('arrow')).toMatchSnapshot();
    });

    it('should render with left placement', () => {
      const props = createProps({ arrowComponent: CustomArrow, placement: 'left' });

      render(<Arrow {...props} />);

      expect(screen.getByTestId('arrow')).toMatchSnapshot();
    });

    it('should pass correct props to the custom component', () => {
      const arrowComponent = vi.fn(() => null);
      const props = createProps({ arrowComponent, placement: 'right-start' });

      render(<Arrow {...props} />);

      expect(arrowComponent).toHaveBeenCalledWith(
        { base: 32, placement: 'right-start', size: 16 },
        undefined,
      );
    });

    it('should return null for "center" placement', () => {
      const props = createProps({ arrowComponent: CustomArrow, placement: 'center' });

      const { container } = render(<Arrow {...props} />);

      expect(container.firstChild).toBeNull();
    });

    it('should keep wrapper span hidden when position is undefined', () => {
      const props = createProps({ arrowComponent: CustomArrow, position: undefined });

      render(<Arrow {...props} />);

      expect(screen.getByTestId('arrow')).toHaveStyle({ visibility: 'hidden' });
    });
  });
});
