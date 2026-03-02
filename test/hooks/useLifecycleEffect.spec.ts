import useTourEngine from '~/hooks/useTourEngine';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, isElementVisible, scrollTo } from '~/modules/dom';
import { act, callbackResponseFactory, renderHook, waitFor } from '~/test-utils';

import { Props, Step } from '~/types';

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

describe('useLifecycleEffect', () => {
  const mockCallback = vi.fn();
  const getCallbackResponse = callbackResponseFactory({ size: 3 });

  const testSteps: Step[] = [
    { target: '.step-1', content: 'Step 1', disableBeacon: true },
    { target: '.step-2', content: 'Step 2', disableBeacon: true },
    { target: '.step-3', content: 'Step 3', disableBeacon: true },
  ];

  function createProps(overrides: Partial<Props> = {}): Props {
    return {
      steps: testSteps,
      callback: mockCallback,
      continuous: true,
      run: true,
      ...overrides,
    };
  }

  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    mockCallback.mockClear();
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

  describe('Restart after tour completion', () => {
    it('should restart with beacon after FINISHED (reset(true))', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps, continuous: true })));

      // Tour starts: TOUR_START, STEP_BEFORE, TOOLTIP
      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // Complete the tour by advancing past the last step
      act(() => {
        result.current.controls.next();
      });

      // STEP_AFTER → FINISHED → TOUR_END → auto-reset
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END, status: STATUS.FINISHED }),
        );
      });

      // After TOUR_END, lifecycle auto-resets: status=READY, lifecycle=COMPLETE
      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
      });

      mockCallback.mockClear();

      // User calls reset(true) to restart the tour
      act(() => {
        result.current.controls.reset(true);
      });

      // Should fire TOUR_STATUS(RESET) then restart: TOUR_START, STEP_BEFORE, TOOLTIP
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.TOOLTIP,
            index: 0,
            lifecycle: LIFECYCLE.TOOLTIP,
            status: STATUS.RUNNING,
          }),
        );
      });

      // Verify state is correct
      expect(result.current.state.status).toBe(STATUS.RUNNING);
      expect(result.current.state.lifecycle).toBe(LIFECYCLE.TOOLTIP);
      expect(result.current.state.index).toBe(0);
    });

    it('should restart with beacon after SKIPPED (reset(true))', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.skip();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END, status: STATUS.SKIPPED }),
        );
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
      });

      mockCallback.mockClear();

      act(() => {
        result.current.controls.reset(true);
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.TOOLTIP,
            index: 0,
            status: STATUS.RUNNING,
          }),
        );
      });
    });

    it('should restart with non-continuous beacon after FINISHED', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1' }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps, continuous: false })));

      // Non-continuous: TOUR_START, STEP_BEFORE, BEACON
      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Open tooltip
      act(() => {
        result.current.controls.open();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP }),
        );
      });

      mockCallback.mockClear();

      // Complete the tour
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
      });

      mockCallback.mockClear();

      // Restart
      act(() => {
        result.current.controls.reset(true);
      });

      // Non-continuous should show BEACON
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.BEACON,
            index: 0,
            status: STATUS.RUNNING,
          }),
        );
      });
    });
  });

  describe('STEP_AFTER callback', () => {
    it('should use previousState.index in STEP_AFTER', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER }),
        );
      });

      // STEP_AFTER should report index 0 (the step that just completed), not index 1
      const stepAfterCall = mockCallback.mock.calls.find(
        (call: any[]) => call[0]?.type === EVENTS.STEP_AFTER,
      );

      expect(stepAfterCall![0].index).toBe(0);
    });

    it('should use lastAction in STEP_AFTER after NEXT', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.NEXT,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            type: EVENTS.STEP_AFTER,
          }),
        );
      });
    });

    it('should use lastAction in STEP_AFTER after PREV', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Advance to step 2
      mockCallback.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      mockCallback.mockClear();

      act(() => {
        result.current.controls.prev();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.PREV,
            index: 1,
            lifecycle: LIFECYCLE.COMPLETE,
            type: EVENTS.STEP_AFTER,
          }),
        );
      });
    });

    it('should fire STEP_AFTER with origin after close()', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.close('keyboard');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.CLOSE,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            origin: 'keyboard',
            type: EVENTS.STEP_AFTER,
          }),
        );
      });
    });
  });

  describe('TOUR_END callback', () => {
    it('should fire TOUR_END with previousStep for mid-tour finish', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Advance to step 2
      mockCallback.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      mockCallback.mockClear();

      // Finish tour from step 2
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.TOUR_END,
            status: STATUS.FINISHED,
            step: expect.objectContaining({ target: '.step-2' }),
          }),
        );
      });
    });

    it('should auto-reset after TOUR_END', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });

      // After TOUR_END, controls.reset() is called → status=READY, index=0
      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
        expect(result.current.state.index).toBe(0);
      });
    });
  });

  describe('TOUR_STATUS callbacks', () => {
    it('should fire TOUR_STATUS on RESET action', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.reset();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.RESET,
            index: 0,
            lifecycle: LIFECYCLE.INIT,
            status: STATUS.READY,
            type: EVENTS.TOUR_STATUS,
          }),
        );
      });
    });

    it('should fire TOUR_STATUS on STOP action', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.stop();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.STOP,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            status: STATUS.PAUSED,
            type: EVENTS.TOUR_STATUS,
          }),
        );
      });
    });
  });

  describe('lastAction tracking', () => {
    it('should track CLOSE action through CLOSE→START sequence', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // Close at step 0 → advances to step 1
      act(() => {
        result.current.controls.close('overlay');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.CLOSE,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            origin: 'overlay',
            type: EVENTS.STEP_AFTER,
          }),
        );
      });

      // CLOSE→INIT transition: STEP_BEFORE should have CLOSE as the action
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.CLOSE,
            index: 1,
            lifecycle: LIFECYCLE.READY,
            type: EVENTS.STEP_BEFORE,
          }),
        );
      });
    });
  });

  describe('Full tour sequences', () => {
    it('should complete full tour → finish → TOUR_END → auto-reset sequence', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      // Initial: TOUR_START, STEP_BEFORE(0), TOOLTIP(0)
      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // Step 1 → Step 2
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      mockCallback.mockClear();

      // Step 2 → finish
      act(() => {
        result.current.controls.next();
      });

      // Should fire: STEP_AFTER(1) → TOUR_END(FINISHED) → TOUR_STATUS(RESET)
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });

      // Verify STEP_AFTER fired before TOUR_END
      const calls = mockCallback.mock.calls.map((c: any[]) => c[0]?.type);
      const stepAfterIndex = calls.indexOf(EVENTS.STEP_AFTER);
      const tourEndIndex = calls.indexOf(EVENTS.TOUR_END);

      expect(stepAfterIndex).toBeLessThan(tourEndIndex);

      // Auto-reset restores to READY
      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
        expect(result.current.state.index).toBe(0);
      });
    });

    it('should complete skip → TOUR_END → auto-reset sequence', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.skip('button_skip');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END, status: STATUS.SKIPPED }),
        );
      });

      // Auto-reset after TOUR_END
      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
        expect(result.current.state.index).toBe(0);
      });
    });

    it('should fire STEP_AFTER when step is null (past last step)', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // next() at last step: index becomes 1 (past size), step is null
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.STEP_AFTER,
            action: ACTIONS.NEXT,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
          }),
        );
      });
    });

    it('should handle multi-step restart: complete all steps → restart → walk through again', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      // Complete first run
      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });
      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.READY);
      });

      mockCallback.mockClear();

      // Restart
      act(() => {
        result.current.controls.reset(true);
      });

      // Second run should produce TOUR_START, STEP_BEFORE(0), TOOLTIP(0)
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 0 }),
        );
      });

      mockCallback.mockClear();

      // Continue to step 2
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });
    });
  });

  describe('Target handling', () => {
    it('should fire TARGET_NOT_FOUND when target is missing and auto-advance forward', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 150 },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Target not mounted',
        expect.objectContaining({ target: '.missing' }),
      );

      // Auto-advances to step 3
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 2 }),
        );
      });
    });

    it('should fire TARGET_NOT_FOUND when target is not visible', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, targetWaitTimeout: 150 },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(isElementVisible).mockReturnValue(false);

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Target not visible',
        expect.objectContaining({ target: '.step-2' }),
      );
    });

    it('should NOT auto-advance in controlled mode when target is missing', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 150 },
      ];

      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(getElement).mockReturnValue(null);

      rerender(createProps({ steps, stepIndex: 1 }));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
        );
      });

      const stepBeforeCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.STEP_BEFORE,
      );

      expect(stepBeforeCalls).toHaveLength(0);
    });
  });

  describe('Step delay', () => {
    it('should delay step transition with numeric stepDelay', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, stepDelay: 200 },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      expect(result.current.state.waiting).toBe(true);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should delay step transition with async stepDelay', async () => {
      let resolveDelay: () => void;
      const delayPromise = new Promise<void>(resolve => {
        resolveDelay = resolve;
      });

      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          stepDelay: () => delayPromise,
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      await act(async () => {
        resolveDelay!();
        await delayPromise;
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should proceed if async stepDelay rejects', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          stepDelay: () => Promise.reject(new Error('fail')),
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should proceed after targetWaitTimeout if async stepDelay never resolves', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          stepDelay: () => new Promise<void>(() => {}),
          targetWaitTimeout: 200,
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      expect(result.current.state.waiting).toBe(true);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });
  });

  describe('Target polling', () => {
    it('should poll for missing target and resolve when found', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, targetWaitTimeout: 1000 },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.step-2') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // Target appears
      vi.mocked(getElement).mockReturnValue(mockElement);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 1 }),
        );
      });
    });

    it('should skip polling with targetWaitTimeout: 0', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 0 },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // Should fire TARGET_NOT_FOUND immediately without polling
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });
    });

    it('should set waiting after loaderDelay during polling', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.slow',
          content: 'Slow',
          disableBeacon: true,
          targetWaitTimeout: 2000,
          loaderDelay: 200,
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.slow') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      expect(result.current.state.waiting).toBe(false);

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      // Target appears
      vi.mocked(getElement).mockReturnValue(mockElement);

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(false);
      });
    });
  });

  describe('Edge cases', () => {
    it('should finish when index >= size and step is null', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            type: EVENTS.TOUR_END,
            status: STATUS.FINISHED,
          }),
        );
      });
    });

    it('should auto-advance backward on PREV when target is missing', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 150 },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Advance to step 2
      mockCallback.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      // Advance to step 3
      mockCallback.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 2 }),
        );
      });

      // Make step 2 missing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      mockCallback.mockClear();

      act(() => {
        result.current.controls.prev();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      // Auto-advance backward to step 1
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 0 }),
        );
      });
    });

    it('should clean up timers on unmount', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, targetWaitTimeout: 5000 },
      ];

      const { result, unmount } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Start polling for missing target
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.step-2') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // Unmount while polling — should not throw or leak
      unmount();
    });
  });
});
