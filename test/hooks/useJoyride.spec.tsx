import useJoyride from '~/hooks/useJoyride';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, isElementVisible, scrollTo } from '~/modules/dom';
import { act, eventResponseFactory, expectControls, renderHook, waitFor } from '~/test-utils';

import type { Step } from '~/types';

const mockElement = document.createElement('div');

vi.mock('~/modules/dom', async () => {
  const actual = await vi.importActual('~/modules/dom');

  return {
    ...actual,
    getElement: vi.fn(() => mockElement),
    isElementVisible: vi.fn(() => true),
    getScrollParent: vi.fn(() => document.documentElement),
    getScrollTo: vi.fn(() => 0),
    hasCustomScrollParent: vi.fn(() => false),
    scrollTo: vi.fn(() => ({ cancel: vi.fn(), promise: Promise.resolve() })),
  };
});

vi.mock('~/modules/helpers', async () => {
  const actual = await vi.importActual('~/modules/helpers');

  return {
    ...actual,
    needsScrolling: vi.fn(() => false),
  };
});

describe('useJoyride', () => {
  const mockOnEvent = vi.fn();
  const getEventResponse = eventResponseFactory({ size: 3 });

  const testSteps: Step[] = [
    { target: '.step-1', content: 'Step 1', disableBeacon: true },
    { target: '.step-2', content: 'Step 2', disableBeacon: true },
    { target: '.step-3', content: 'Step 3', disableBeacon: true },
  ];

  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    mockOnEvent.mockClear();
    consoleWarnSpy.mockClear();
    vi.mocked(getElement).mockClear();
    vi.mocked(getElement).mockReturnValue(mockElement);
    vi.mocked(isElementVisible).mockClear();
    vi.mocked(isElementVisible).mockReturnValue(true);
    vi.mocked(scrollTo).mockClear();
    vi.mocked(scrollTo).mockReturnValue({
      cancel: vi.fn(),
      promise: Promise.resolve(),
    });
  });

  describe('Return Shape', () => {
    it('should return controls, state, step, and Tour', () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, onEvent: mockOnEvent, run: true, continuous: true }),
      );

      expect(result.current).toHaveProperty('controls');
      expect(result.current).toHaveProperty('state');
      expect(result.current).toHaveProperty('step');
      expect(result.current).toHaveProperty('Tour');
    });

    it('should return controls with all store methods', () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      expect(result.current.controls).toEqual(
        expect.objectContaining({
          close: expect.any(Function),
          go: expect.any(Function),
          info: expect.any(Function),
          next: expect.any(Function),
          open: expect.any(Function),
          prev: expect.any(Function),
          reset: expect.any(Function),
          skip: expect.any(Function),
        }),
      );
    });

    it('should return public state without internal fields', () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      const { state } = result.current;

      expect(state).toHaveProperty('action');
      expect(state).toHaveProperty('controlled');
      expect(state).toHaveProperty('index');
      expect(state).toHaveProperty('lifecycle');
      expect(state).toHaveProperty('origin');
      expect(state).toHaveProperty('size');
      expect(state).toHaveProperty('status');

      expect(state).not.toHaveProperty('positioned');
    });

    it('should return step as null when no steps', () => {
      const { result } = renderHook(() => useJoyride({ steps: [] }));

      expect(result.current.step).toBeNull();
    });

    it('should return the current merged step', async () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      await waitFor(() => {
        expect(result.current.step).not.toBeNull();
      });

      expect(result.current.step?.content).toBe('Step 1');
      expect(result.current.step?.target).toBe('.step-1');
    });

    it('should return Tour as a ReactNode when DOM is available', () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      expect(result.current.Tour).not.toBeNull();
    });
  });

  describe('Controls Stability', () => {
    it('should return referentially stable controls across re-renders', () => {
      const { rerender, result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      const firstControls = result.current.controls;

      rerender();
      const secondControls = result.current.controls;

      expect(firstControls).toBe(secondControls);
    });
  });

  describe('Imperative Control', () => {
    it('should advance state with controls.next()', async () => {
      const { result } = renderHook(() =>
        useJoyride({
          steps: testSteps,
          onEvent: mockOnEvent,
          run: true,
          continuous: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(result.current.state.index).toBe(1);
      });
    });

    it('should go back with controls.prev()', async () => {
      const { result } = renderHook(() =>
        useJoyride({
          steps: testSteps,
          onEvent: mockOnEvent,
          run: true,
          continuous: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(result.current.state.index).toBe(1);
      });

      act(() => {
        result.current.controls.prev();
      });

      await waitFor(() => {
        expect(result.current.state.index).toBe(0);
      });
    });

    it('should skip the tour with controls.skip()', async () => {
      const { result } = renderHook(() =>
        useJoyride({
          steps: testSteps,
          onEvent: mockOnEvent,
          run: true,
          continuous: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });

      act(() => {
        result.current.controls.skip('button_skip');
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
      });

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTIONS.SKIP,
          status: STATUS.SKIPPED,
          type: EVENTS.TOUR_END,
        }),
        expectControls(),
      );
    });

    it('should return state info via controls.info()', async () => {
      const { result } = renderHook(() =>
        useJoyride({ steps: testSteps, run: true, continuous: true }),
      );

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });

      const info = result.current.controls.info();

      expect(info).toHaveProperty('action');
      expect(info).toHaveProperty('index');
      expect(info).toHaveProperty('status');
      expect(info).not.toHaveProperty('positioned');
    });
  });

  describe('Controlled Mode', () => {
    it('should set controlled to true when stepIndex is provided', () => {
      const { result } = renderHook(() =>
        useJoyride({
          steps: testSteps,
          run: true,
          continuous: true,
          stepIndex: 0,
        }),
      );

      expect(result.current.state.controlled).toBe(true);
    });

    it('should reflect stepIndex changes', async () => {
      const { rerender, result } = renderHook(props => useJoyride(props), {
        initialProps: {
          steps: testSteps,
          run: true,
          continuous: true,
          stepIndex: 0,
          onEvent: mockOnEvent,
        },
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });

      rerender({
        steps: testSteps,
        run: true,
        continuous: true,
        stepIndex: 1,
        onEvent: mockOnEvent,
      });

      await waitFor(() => {
        expect(result.current.state.index).toBe(1);
      });
    });
  });

  describe('Callbacks', () => {
    it('should fire tour lifecycle callbacks', async () => {
      renderHook(() =>
        useJoyride({
          steps: testSteps,
          onEvent: mockOnEvent,
          run: true,
          continuous: true,
        }),
      );

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        1,
        getEventResponse({
          action: ACTIONS.START,
          index: 0,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TOUR_START,
        }),
        expect.any(Object),
      );
    });
  });
});
