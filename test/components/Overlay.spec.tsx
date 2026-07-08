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

function fakeRect(el: Element, rect: Partial<DOMRect>) {
  const full = {
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    ...rect,
  } as DOMRect;

  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ ...full, toJSON: () => full }),
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

    it('should offset the spotlight by the SVG origin with a positioned portal', () => {
      // Target at viewport (250,130,120x30); the spotlight SVG (top:0/left:0) is rendered inside a
      // positioned portal whose padding box sits at (50,100). The cutout is expressed relative to
      // that SVG origin: targetRect - origin - padding.
      fakeRect(targetDiv, { top: 130, left: 250, width: 120, height: 30, right: 370, bottom: 160 });

      const props = createProps({
        lifecycle: LIFECYCLE.READY,
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      fakeRect(screen.getByTestId('spotlight'), { top: 100, left: 50 });

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

      const d = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d') ?? '';

      // x = 250 - 10(pad) - 50(origin) = 190 ; y = 130 - 10 - 100 = 20
      // width 120+20=140, height 30+20=50 ; path starts at x+r (190+4=194)
      expect(d).toContain('M194 20H326');
      expect(d).toContain('V66');
    });

    it('should cancel page scroll from the vertical origin (targetRect.top is document-space)', () => {
      // With the document scrolled, targetRect.top carries the scrollTop (document-space) while the
      // SVG's getBoundingClientRect().top stays viewport-space. originTop adds scrollTop back so the
      // two cancel — the cutout must land at the same place as the unscrolled case (y = 20).
      Object.defineProperty(document.documentElement, 'scrollTop', {
        configurable: true,
        value: 200,
      });

      try {
        fakeRect(targetDiv, {
          top: 130,
          left: 250,
          width: 120,
          height: 30,
          right: 370,
          bottom: 160,
        });

        const props = createProps({
          lifecycle: LIFECYCLE.READY,
          portalElement: portalDiv,
          target: '.target',
        });

        const { rerender } = render(<Overlay {...props} />);

        // SVG box stays viewport-space (top:100), unaffected by the 200px page scroll.
        fakeRect(screen.getByTestId('spotlight'), { top: 100, left: 50 });

        rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

        const d = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d') ?? '';

        // targetRect.top = 130 + 200(scroll) - 10(pad) = 320 ; originTop = 100 + 200 = 300 → y = 20
        expect(d).toContain('M194 20H326');
        expect(d).toContain('V66');
      } finally {
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          value: 0,
        });
      }
    });

    it('should use targetRect directly for a body-level portal (SVG origin 0)', () => {
      // A body-level portal: the SVG sits at the document origin (0,0), so origin is 0 and the
      // cutout equals targetRect — identical to the non-portal path.
      fakeRect(targetDiv, { top: 130, left: 250, width: 120, height: 30, right: 370, bottom: 160 });

      const props = createProps({
        lifecycle: LIFECYCLE.READY,
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      fakeRect(screen.getByTestId('spotlight'), { top: 0, left: 0 });

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

      const d = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d') ?? '';

      // origin 0 → x = 240, y = 120 ; width 140 → H 240+140-4=376 ; path starts at 240+4=244
      expect(d).toContain('M244 120H376');
    });

    it('should skip the origin offset for a fixed target', () => {
      // Fixed targets render a position:fixed SVG anchored to the viewport, which targetRect
      // already matches — so a nonzero SVG box must be ignored.
      fakeRect(targetDiv, { top: 130, left: 250, width: 120, height: 30, right: 370, bottom: 160 });
      targetDiv.style.position = 'fixed';

      const props = createProps({
        lifecycle: LIFECYCLE.READY,
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      fakeRect(screen.getByTestId('spotlight'), { top: 100, left: 50 });

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);

      const d = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d') ?? '';

      // isFixed → origin ignored → x = 240, y = 120 (not 190/20)
      expect(d).toContain('M244 120H376');
    });

    it('should not move the cutout on re-render (guards #1209 render-order flip)', () => {
      fakeRect(targetDiv, { top: 130, left: 250, width: 120, height: 30, right: 370, bottom: 160 });

      const props = createProps({
        lifecycle: LIFECYCLE.READY,
        portalElement: portalDiv,
        target: '.target',
      });

      const { rerender } = render(<Overlay {...props} />);

      fakeRect(screen.getByTestId('spotlight'), { top: 100, left: 50 });

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);
      const first = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d');

      rerender(<Overlay {...{ ...props, lifecycle: LIFECYCLE.TOOLTIP }} />);
      const second = screen.getByTestId('spotlight').querySelector('path')?.getAttribute('d');

      expect(second).toBe(first);
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
