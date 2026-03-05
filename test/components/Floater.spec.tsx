import { LIFECYCLE } from '~/literals';
import { hasPosition } from '~/modules/dom';
import { cleanup, createStep, fireEvent, fromPartial, render, screen } from '~/test-utils';

import Floater from '~/components/Floater';

import type { Controls, Lifecycle } from '~/types';

import CustomArrow from '../__fixtures__/components/CustomArrow';

vi.mock('~/modules/dom', async importOriginal => {
  const actual = await importOriginal<typeof import('~/modules/dom')>();

  return {
    ...actual,
    hasCustomScrollParent: vi.fn(() => false),
    hasPosition: vi.fn(() => false),
    getScrollParent: vi.fn(),
  };
});

const mockUseFloating = vi.fn();

vi.mock('@floating-ui/react-dom', () => ({
  useFloating: (...arguments_: unknown[]) => mockUseFloating(...arguments_),
  autoUpdate: vi.fn(),
  offset: vi.fn(() => ({ name: 'offset', fn: vi.fn() })),
  flip: vi.fn(() => ({ name: 'flip', fn: vi.fn() })),
  shift: vi.fn(() => ({ name: 'shift', fn: vi.fn() })),
  arrow: vi.fn(() => ({ name: 'arrow', fn: vi.fn() })),
  autoPlacement: vi.fn(() => ({ name: 'autoPlacement', fn: vi.fn() })),
}));

function createFloatingReturn(overrides: Record<string, unknown> = {}) {
  return {
    floatingStyles: { position: 'absolute', left: 0, top: 0, transform: 'translate(100px, 200px)' },
    isPositioned: true,
    placement: 'bottom',
    x: 100,
    y: 200,
    middlewareData: {},
    refs: {
      setFloating: vi.fn(),
      setReference: vi.fn(),
      reference: { current: null },
      floating: { current: null },
    },
    ...overrides,
  };
}

let portalElement: HTMLElement;

beforeEach(() => {
  portalElement = document.createElement('div');
  portalElement.classList.add('react-joyride__portal');
  document.body.appendChild(portalElement);
});

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    continuous: true,
    controls: fromPartial<Controls>({
      close: vi.fn(),
      go: vi.fn(),
      info: vi.fn(),
      next: vi.fn(),
      open: vi.fn(),
      prev: vi.fn(),
      reset: vi.fn(),
      skip: vi.fn(),
    }),
    index: 0,
    lifecycle: LIFECYCLE.TOOLTIP as Lifecycle,
    open: true,
    portalElement,
    setPositionData: vi.fn(),
    setTooltipRef: vi.fn(),
    shouldScroll: false,
    size: 3,
    step: createStep(),
    target: document.createElement('div'),
    updateState: vi.fn(),
    ...overrides,
  };
}

describe('Floater', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('lifecycle branching', () => {
    it('should render tooltip when lifecycle is TOOLTIP', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps();

      render(<Floater {...props} />);

      expect(screen.getByTestId('floater')).toBeInTheDocument();
      expect(screen.queryByTestId('button-beacon')).not.toBeInTheDocument();
    });

    it('should render beacon when lifecycle is BEACON', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({ lifecycle: LIFECYCLE.BEACON });

      render(<Floater {...props} />);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });

    it('should render nothing when lifecycle is INIT', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({ lifecycle: LIFECYCLE.INIT });

      render(<Floater {...props} />);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('button-beacon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('floater')).not.toBeInTheDocument();
    });

    it('should render nothing when lifecycle is READY', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({ lifecycle: LIFECYCLE.READY });

      render(<Floater {...props} />);

      expect(screen.queryByTestId('floater')).not.toBeInTheDocument();
    });
  });

  describe('opacity gate', () => {
    it.each([
      { open: true, isPositioned: true, expected: '1' },
      { open: true, isPositioned: false, expected: '0' },
      { open: false, isPositioned: true, expected: '0' },
      { open: false, isPositioned: false, expected: '0' },
    ])(
      'should have opacity $expected when open=$open and isPositioned=$isPositioned',
      ({ expected, isPositioned, open }) => {
        mockUseFloating
          .mockReturnValueOnce(createFloatingReturn({ isPositioned }))
          .mockReturnValueOnce(createFloatingReturn());

        const props = createProps({ open });

        render(<Floater {...props} />);

        const floater = screen.getByTestId('floater');

        expect(floater).toBeInTheDocument();
        expect(floater).toHaveStyle({ opacity: expected });
      },
    );
  });

  describe('center placement', () => {
    it('should not render Arrow', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'center' }),
      });

      render(<Floater {...props} />);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
    });

    it('should use fixed strategy', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'center' }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];

      expect(tooltipCall.strategy).toBe('fixed');
    });

    it('should pass a virtual reference element', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'center' }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];

      expect(tooltipCall.elements.reference).toBeDefined();
      expect(tooltipCall.elements.reference.getBoundingClientRect).toBeTypeOf('function');
    });

    it('should use center middleware', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'center' }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];

      expect(tooltipCall.middleware).toHaveLength(1);
      expect(tooltipCall.middleware[0].name).toBe('center');
    });
  });

  describe('beacon interaction', () => {
    it('should call updateState on click', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const updateState = vi.fn();
      const props = createProps({ lifecycle: LIFECYCLE.BEACON, updateState });

      render(<Floater {...props} />);

      fireEvent.click(screen.getByTestId('button-beacon'));

      expect(updateState).toHaveBeenCalledWith({
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        positioned: false,
      });
    });

    it('should ignore mouseenter when step.event is not hover', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const updateState = vi.fn();
      const props = createProps({
        lifecycle: LIFECYCLE.BEACON,
        updateState,
        step: createStep({ event: 'click' }),
      });

      render(<Floater {...props} />);

      fireEvent.mouseEnter(screen.getByTestId('button-beacon'));

      expect(updateState).not.toHaveBeenCalled();
    });

    it('should call updateState on mouseenter when step.event is hover', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const updateState = vi.fn();
      const props = createProps({
        lifecycle: LIFECYCLE.BEACON,
        updateState,
        step: createStep({ event: 'hover' }),
      });

      render(<Floater {...props} />);

      fireEvent.mouseEnter(screen.getByTestId('button-beacon'));

      expect(updateState).toHaveBeenCalledWith({
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        positioned: false,
      });
    });
  });

  describe('position data sync', () => {
    it('should call setPositionData for tooltip when isPositioned is true', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn({ isPositioned: true, x: 50, y: 75 }))
        .mockReturnValueOnce(createFloatingReturn());

      const setPositionData = vi.fn();
      const props = createProps({ setPositionData });

      render(<Floater {...props} />);

      expect(setPositionData).toHaveBeenCalledWith('tooltip', {
        placement: 'bottom',
        x: 50,
        y: 75,
        middlewareData: {},
      });
    });

    it('should not call setPositionData for tooltip when isPositioned is false', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn({ isPositioned: false }))
        .mockReturnValueOnce(createFloatingReturn({ isPositioned: false }));

      const setPositionData = vi.fn();
      const props = createProps({ setPositionData });

      render(<Floater {...props} />);

      expect(setPositionData).not.toHaveBeenCalled();
    });

    it('should call setPositionData for beacon when isPositioned is true', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn({ isPositioned: false }))
        .mockReturnValueOnce(createFloatingReturn({ isPositioned: true, x: 30, y: 40 }));

      const setPositionData = vi.fn();
      const props = createProps({ lifecycle: LIFECYCLE.BEACON, setPositionData });

      render(<Floater {...props} />);

      expect(setPositionData).toHaveBeenCalledWith('beacon', {
        placement: 'bottom',
        x: 30,
        y: 40,
        middlewareData: {},
      });
    });
  });

  describe('hideArrow', () => {
    it('should not render Arrow when hideArrow is true', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ floatingOptions: { hideArrow: true } }),
      });

      render(<Floater {...props} />);

      expect(screen.getByTestId('floater')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
    });

    it('should not include arrow middleware when hideArrow is true', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ floatingOptions: { hideArrow: true } }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const middlewareNames = tooltipCall.middleware.map((m: { name: string }) => m.name);

      expect(middlewareNames).not.toContain('arrow');
    });

    it('should not add arrow size to offset when hideArrow is true', async () => {
      const { offset: offsetMock } = await import('@floating-ui/react-dom');

      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({
          floatingOptions: { hideArrow: true },
          offset: 10,
          spotlightPadding: { bottom: 5, left: 5, right: 5, top: 5 },
        }),
      });

      render(<Floater {...props} />);

      expect(offsetMock).toHaveBeenCalledWith(expect.any(Function));

      const offsetFn = (offsetMock as ReturnType<typeof vi.fn>).mock.calls[0][0] as (state: {
        placement: string;
      }) => number;

      // offset (10) + spotlightPadding (5) + arrow (0) = 15
      expect(offsetFn({ placement: 'bottom' })).toBe(15);
    });
  });

  describe('offset', () => {
    it('should use the matching side padding per placement', async () => {
      const { offset: offsetMock } = await import('@floating-ui/react-dom');

      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({
          floatingOptions: { hideArrow: true },
          offset: 10,
          spotlightPadding: { bottom: 20, left: 25, right: 15, top: 5 },
        }),
      });

      render(<Floater {...props} />);

      const offsetFn = (offsetMock as ReturnType<typeof vi.fn>).mock.calls[0][0] as (state: {
        placement: string;
      }) => number;

      expect(offsetFn({ placement: 'top' })).toBe(15); // 10 + top(5)
      expect(offsetFn({ placement: 'top-start' })).toBe(15); // 10 + top(5)
      expect(offsetFn({ placement: 'bottom' })).toBe(30); // 10 + bottom(20)
      expect(offsetFn({ placement: 'left' })).toBe(35); // 10 + left(25)
      expect(offsetFn({ placement: 'right' })).toBe(25); // 10 + right(15)
    });
  });

  describe('arrowComponent', () => {
    it('should render custom arrow component when provided', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ arrowComponent: CustomArrow }),
      });

      render(<Floater {...props} />);

      expect(screen.getByTestId('arrow')).toMatchSnapshot();
    });
  });

  describe('useFloating config', () => {
    it('should use autoPlacement for auto placement', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'auto' }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const middlewareNames = tooltipCall.middleware.map((m: { name: string }) => m.name);

      expect(middlewareNames).toContain('autoPlacement');
      expect(middlewareNames).not.toContain('flip');
    });

    it('should use flip for non-auto placement', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ placement: 'bottom' }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const middlewareNames = tooltipCall.middleware.map((m: { name: string }) => m.name);

      expect(middlewareNames).toContain('flip');
      expect(middlewareNames).not.toContain('autoPlacement');
    });

    it('should use fixed strategy when step.isFixed is true', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ isFixed: true }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];

      expect(tooltipCall.strategy).toBe('fixed');
    });

    it('should use absolute strategy by default', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps();

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];

      expect(tooltipCall.strategy).toBe('absolute');
    });

    it('should use fixed strategy when target has a fixed ancestor', () => {
      vi.mocked(hasPosition).mockReturnValue(true);

      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps();

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const beaconCall = mockUseFloating.mock.calls[1][0];

      expect(tooltipCall.strategy).toBe('fixed');
      expect(beaconCall.strategy).toBe('fixed');
    });

    it('should use floatingOptions.strategy override for both tooltip and beacon', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ floatingOptions: { strategy: 'fixed' } }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const beaconCall = mockUseFloating.mock.calls[1][0];

      expect(tooltipCall.strategy).toBe('fixed');
      expect(beaconCall.strategy).toBe('fixed');
    });

    it('should use the same strategy for beacon as tooltip', () => {
      mockUseFloating
        .mockReturnValueOnce(createFloatingReturn())
        .mockReturnValueOnce(createFloatingReturn());

      const props = createProps({
        step: createStep({ isFixed: true }),
      });

      render(<Floater {...props} />);

      const tooltipCall = mockUseFloating.mock.calls[0][0];
      const beaconCall = mockUseFloating.mock.calls[1][0];

      expect(tooltipCall.strategy).toBe('fixed');
      expect(beaconCall.strategy).toBe('fixed');
    });
  });
});
