import { LIFECYCLE } from '~/literals';
import { cleanup, createStep, fireEvent, fromPartial, render, screen } from '~/test-utils';

import Overlay from '~/components/Overlay';

import { OverlayProps } from '~/types';

function createProps(overrides: Partial<OverlayProps> = {}) {
  const step = createStep(overrides);

  return fromPartial<OverlayProps>({
    ...step,
    continuous: true,
    debug: false,
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

  it('should return null when disableOverlay is true', () => {
    const { container } = render(<Overlay {...createProps({ disableOverlay: true })} />);

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

    expect(screen.queryByTestId('spotlight')).not.toBeInTheDocument();

    // Transition scrolling to false
    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP, scrolling: false }} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();

    // Transition scrolling to false
    rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.COMPLETE }} />);

    expect(screen.queryByTestId('spotlight')).not.toBeInTheDocument();
  });

  it('should not render Spotlight for center placement', () => {
    render(<Overlay {...createProps({ placement: 'center' })} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });

  it('should call onClickOverlay on click', () => {
    const onClickOverlay = vi.fn();

    render(<Overlay {...createProps({ onClickOverlay })} />);

    fireEvent.click(screen.getByTestId('overlay'));

    expect(onClickOverlay).toHaveBeenCalledTimes(1);
  });

  it('should set cursor to default when disableOverlayClose is true', () => {
    render(<Overlay {...createProps({ disableOverlayClose: true })} />);

    const overlay = screen.getByTestId('overlay');

    expect(overlay.style.cursor).toBe('default');
  });

  it('should set cursor to default when spotlightClicks is true', () => {
    render(<Overlay {...createProps({ spotlightClicks: true })} />);

    const overlay = screen.getByTestId('overlay');

    expect(overlay.style.cursor).toBe('default');
  });
});

describe('Overlay (Safari)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should wrap Spotlight for Safari mix-blend-mode hack', async () => {
    vi.resetModules();
    vi.doMock('~/modules/helpers', async importOriginal => {
      const actual = await importOriginal<typeof import('~/modules/helpers')>();

      return { ...actual, getBrowser: () => 'safari' };
    });

    const { default: SafariOverlay } = await import('~/components/Overlay');

    const props = createProps({ lifecycle: LIFECYCLE.READY });

    const { rerender } = render(<SafariOverlay {...props} />);

    rerender(<SafariOverlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP, scrolling: true }} />);
    rerender(<SafariOverlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP, scrolling: false }} />);

    expect(screen.getByTestId('overlay')).toMatchSnapshot();
  });
});
