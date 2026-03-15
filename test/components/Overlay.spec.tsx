import { LIFECYCLE } from '~/literals';
import { cleanup, createStep, fireEvent, fromPartial, render, screen } from '~/test-utils';

import Overlay from '~/components/Overlay';
import type { OverlayProps } from '~/components/Overlay';

function createProps(overrides: Partial<OverlayProps> = {}) {
  const step = createStep(overrides);

  return fromPartial<OverlayProps>({
    ...step,
    continuous: true,
    lifecycle: LIFECYCLE.TOOLTIP,
    onClickOverlay: vi.fn(),
    scrolling: false,
    waiting: false,
    ...overrides,
  });
}

describe('Overlay', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the overlay when lifecycle is TOOLTIP', () => {
    render(<Overlay {...createProps()} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });

  it('should return null for hidden lifecycles in continuous mode', () => {
    const { container } = render(<Overlay {...createProps({ lifecycle: LIFECYCLE.BEACON })} />);

    expect(container.firstChild).toBeNull();
  });

  it('should return null when hideOverlay is true', () => {
    const { container } = render(<Overlay {...createProps({ hideOverlay: true })} />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render Spotlight when scrolling is true', () => {
    render(<Overlay {...createProps({ scrolling: true })} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });

  it('should not render Spotlight when waiting is true', () => {
    render(<Overlay {...createProps({ waiting: true })} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });

  it('should render Spotlight when scrolling transitions to false', () => {
    const props = createProps({ lifecycle: LIFECYCLE.READY });

    const { rerender } = render(<Overlay {...props} />);

    // Transition to TOOLTIP to trigger showSpotlight=true
    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP, scrolling: true }} />);

    // While scrolling, path has no cutout (outer rect only)
    expect(screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d')).toBe(
      'M0 0H1024V50H0Z',
    );

    // Transition scrolling to false
    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP, scrolling: false }} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();

    // Transition to COMPLETE to hide spotlight
    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.COMPLETE }} />);

    // After COMPLETE, path has no cutout
    expect(screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d')).toBe(
      'M0 0H1024V50H0Z',
    );
  });

  it('should not render Spotlight for center placement', () => {
    render(<Overlay {...createProps({ placement: 'center' })} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });

  it('should call onClickOverlay on click', () => {
    const onClickOverlay = vi.fn();

    render(<Overlay {...createProps({ onClickOverlay })} />);

    const path = screen.getByTestId('spotlight').querySelector('path')!;

    fireEvent.click(path);

    expect(onClickOverlay).toHaveBeenCalledTimes(1);
  });

  it('should use spotlightTarget for the spotlight position when set', () => {
    const spotlightElement = document.createElement('div');

    document.body.appendChild(spotlightElement);

    const props = createProps({ lifecycle: LIFECYCLE.READY, spotlightTarget: spotlightElement });

    const { rerender } = render(<Overlay {...props} />);

    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();

    document.body.removeChild(spotlightElement);
  });

  it('should set cursor to default when overlayClickAction is false', () => {
    render(<Overlay {...createProps({ overlayClickAction: false })} />);

    const path = screen.getByTestId('spotlight').querySelector('path')! as SVGPathElement;

    expect(path.style.cursor).toBe('default');
  });
});
