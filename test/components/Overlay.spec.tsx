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

function setElementLayout(
  el: HTMLElement,
  layout: {
    clientHeight?: number;
    clientWidth?: number;
    offsetHeight?: number;
    offsetLeft?: number;
    offsetParent?: Element | null;
    offsetTop?: number;
    offsetWidth?: number;
  },
) {
  for (const [key, value] of Object.entries(layout)) {
    Object.defineProperty(el, key, { configurable: true, value });
  }
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

  it('should show spotlight immediately on mount with lifecycle=TOOLTIP', () => {
    const targetEl = document.createElement('div');

    targetEl.className = 'target';
    targetEl.getBoundingClientRect = () =>
      ({
        x: 100,
        y: 200,
        width: 120,
        height: 30,
        top: 200,
        left: 100,
        right: 220,
        bottom: 230,
      }) as DOMRect;
    document.body.appendChild(targetEl);

    render(<Overlay {...createProps()} />);

    const paths = screen.getByTestId('spotlight').querySelectorAll('path');

    // With spotlight visible, there should be a cutout path (more than just the overlay rect)
    expect(paths.length).toBeGreaterThan(1);

    document.body.removeChild(targetEl);
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

  describe('with portalElement', () => {
    let containerDiv: HTMLDivElement;
    let portalDiv: HTMLDivElement;
    let targetDiv: HTMLDivElement;

    beforeEach(() => {
      containerDiv = document.createElement('div');
      containerDiv.style.position = 'relative';

      portalDiv = document.createElement('div');
      portalDiv.id = 'portal';

      targetDiv = document.createElement('div');
      targetDiv.className = 'target';

      containerDiv.appendChild(targetDiv);
      containerDiv.appendChild(portalDiv);
      document.body.appendChild(containerDiv);

      setElementLayout(containerDiv, {
        clientWidth: 800,
        clientHeight: 600,
        offsetTop: 100,
        offsetLeft: 50,
        offsetParent: document.body,
      });

      setElementLayout(targetDiv, {
        offsetTop: 40,
        offsetLeft: 200,
        offsetWidth: 120,
        offsetHeight: 30,
        offsetParent: containerDiv,
      });
    });

    afterEach(() => {
      document.body.removeChild(containerDiv);
    });

    it('should use container dimensions when portalElement is set', () => {
      const props = createProps({
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      setElementLayout(screen.getByTestId('overlay'), { offsetParent: containerDiv });

      rerender(<Overlay {...props} />);

      expect(screen.getByTestId('spotlight').getAttribute('style')).toContain('width: 800px');
      expect(screen.getByTestId('spotlight').getAttribute('style')).toContain('height: 600px');
    });

    it('should compute spotlight position in layout space with portalElement', () => {
      const props = createProps({
        lifecycle: LIFECYCLE.READY,
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      setElementLayout(screen.getByTestId('overlay'), { offsetParent: containerDiv });

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

      const d = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d') ?? '';

      // targetOffset (200+50, 40+100) - containerOffset (50, 100) - padding (10, 10) = (190, 30)
      // width: 120 + 10 + 10 = 140, height: 30 + 10 + 10 = 50
      // Path starts at x+r (190+4=194) due to spotlightRadius
      expect(d).toContain('M194 30H326');
      expect(d).toContain('V76');
    });

    it('should fall back to window dimensions when portalElement has no positioned ancestor', () => {
      const props = createProps({
        portalElement: portalDiv,
        target: '.target',
      });

      render(<Overlay {...props} />);

      // offsetParent is null in jsdom by default — falls back to window dimensions
      expect(screen.getByTestId('spotlight').getAttribute('style')).toContain('width: 1024px');
      expect(screen.getByTestId('spotlight').getAttribute('style')).toContain('height: 50px');
    });
  });
});
