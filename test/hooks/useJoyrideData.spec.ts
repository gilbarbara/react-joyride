import useJoyrideData from '~/hooks/useJoyrideData';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, getScrollTo, isElementVisible, scrollTo } from '~/modules/dom';
import { act, callbackResponseFactory, fromPartial, renderHook, waitFor } from '~/test-utils';

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

const mockPopper = fromPartial({ state: { placement: 'bottom' as const } });

describe('useJoyrideData', () => {
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

  describe('Tour Lifecycle', () => {
    it('should start the tour and fire TOUR_START, STEP_BEFORE, TOOLTIP', async () => {
      renderHook(() => useJoyrideData(createProps()));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(3);
      });

      expect(mockCallback).toHaveBeenNthCalledWith(
        1,
        getCallbackResponse({
          action: ACTIONS.START,
          index: 0,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TOUR_START,
        }),
      );

      expect(mockCallback).toHaveBeenNthCalledWith(
        2,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );

      expect(mockCallback).toHaveBeenNthCalledWith(
        3,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.TOOLTIP,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should advance to the next step with next() + setPopper', async () => {
      const { result } = renderHook(() => useJoyrideData(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // next() sets lifecycle=COMPLETE → fires STEP_AFTER
      act(() => {
        result.current.store.current.next();
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

      mockCallback.mockClear();

      // Simulate Step mount → COMPLETE→INIT→READY→TOOLTIP
      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(2);
      });

      expect(mockCallback).toHaveBeenNthCalledWith(
        1,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );

      expect(mockCallback).toHaveBeenNthCalledWith(
        2,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 1,
          lifecycle: LIFECYCLE.TOOLTIP,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should show beacon in non-continuous mode', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1' }];

      renderHook(() => useJoyrideData(createProps({ steps, continuous: false })));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(3);
      });

      expect(mockCallback).toHaveBeenNthCalledWith(
        3,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.BEACON,
          size: 1,
          type: EVENTS.BEACON,
        }),
      );
    });

    it('should hide beacon in continuous mode for NEXT action', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2' }, // beacon enabled
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.next();
      });
      await waitFor(() =>
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER }),
        ),
      );
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP }),
        );
      });

      // Should be TOOLTIP, not BEACON (continuous + NEXT hides beacon)
      const beaconCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.BEACON,
      );

      expect(beaconCalls).toHaveLength(0);
    });

    it('should finish the tour when the last step completes', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.UPDATE,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            size: 1,
            status: STATUS.FINISHED,
            type: EVENTS.TOUR_END,
          }),
        );
      });
    });

    it('should skip the tour and fire TOUR_END', async () => {
      const { result } = renderHook(() => useJoyrideData(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.skip();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.SKIP,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            status: STATUS.SKIPPED,
            type: EVENTS.TOUR_END,
          }),
        );
      });
    });

    it('should stop and resume the tour', async () => {
      const { result } = renderHook(() => useJoyrideData(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.stop();
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

      mockCallback.mockClear();

      act(() => {
        result.current.store.current.start();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });
  });

  describe('Target Handling', () => {
    it('should fire TARGET_NOT_FOUND and auto-advance when target is missing (uncontrolled)', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      // Make step 1 target not found
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.store.current.next();
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

      // Simulate Step mount for step 2 (auto-advanced)
      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 2 }),
        );
      });
    });

    it('should fire TARGET_NOT_FOUND when target is not visible', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(isElementVisible).mockReturnValue(false);

      act(() => {
        result.current.store.current.next();
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
        { target: '.missing', content: 'Missing', disableBeacon: true },
      ];

      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
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

      // No STEP_BEFORE for index 2 (controlled mode doesn't auto-advance)
      const stepBeforeCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.STEP_BEFORE,
      );

      expect(stepBeforeCalls).toHaveLength(0);
    });
  });

  describe('Target Wait/Retry', () => {
    it('should resolve target mid-poll and fire STEP_BEFORE', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, targetWaitTimeout: 1000 },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      mockCallback.mockClear();

      // Make step-2 target missing AFTER STEP_AFTER fires but BEFORE setPopper
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.step-2') return null;

        return mockElement;
      });

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      // No STEP_BEFORE yet — target missing, polling in INIT
      const stepBeforeCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.STEP_BEFORE && call[0]?.index === 1,
      );

      expect(stepBeforeCalls).toHaveLength(0);

      // Target appears — next poll tick resolves it
      vi.mocked(getElement).mockReturnValue(mockElement);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 1 }),
        );
      });
    });

    it('should fire TARGET_NOT_FOUND after polling timeout (uncontrolled)', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 200 },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();
      consoleWarnSpy.mockClear();

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      mockCallback.mockClear();

      // Make .missing target permanently missing AFTER STEP_AFTER
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      // Wait for polling to time out and fire TARGET_NOT_FOUND
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      const notFoundCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.TARGET_NOT_FOUND,
      );

      expect(notFoundCalls).toHaveLength(1);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Target not mounted',
        expect.objectContaining({ target: '.missing' }),
      );
    });

    it('should skip polling with targetWaitTimeout: 0', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 0 },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      mockCallback.mockClear();

      // Make target missing AFTER STEP_AFTER
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      // TARGET_NOT_FOUND should fire immediately without polling delay
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });
    });

    it('should fire TARGET_NOT_FOUND exactly once in controlled mode', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 300 },
      ];

      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      rerender(createProps({ steps, stepIndex: 1 }));

      await act(async () => {
        vi.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
        );
      });

      const notFoundCalls = mockCallback.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.TARGET_NOT_FOUND,
      );

      expect(notFoundCalls).toHaveLength(1);

      vi.useRealTimers();
    });

    it('should set waiting flag after loaderDelay', async () => {
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

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      // Make .slow target missing AFTER STEP_AFTER
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.slow') return null;

        return mockElement;
      });

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      // Before loaderDelay: waiting should be false
      expect(result.current.state.waiting).toBe(false);

      // After loaderDelay (200ms): waiting becomes true
      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      // Target appears — waiting clears
      vi.mocked(getElement).mockReturnValue(mockElement);

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(false);
      });
    });
  });

  describe('Controlled Mode', () => {
    it('should fire NEXT action when stepIndex increases', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { rerender, result } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      expect(result.current.state.controlled).toBe(true);
      mockCallback.mockClear();

      rerender(createProps({ steps, stepIndex: 1 }));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.NEXT,
            controlled: true,
            index: 1,
            lifecycle: LIFECYCLE.READY,
            size: 2,
            type: EVENTS.STEP_BEFORE,
          }),
        );
      });
    });

    it('should fire PREV action when stepIndex decreases', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ steps, stepIndex: 1 }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      rerender(createProps({ steps, stepIndex: 0 }));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.PREV,
            controlled: true,
            index: 0,
            lifecycle: LIFECYCLE.READY,
            size: 2,
            type: EVENTS.STEP_BEFORE,
          }),
        );
      });
    });

    it('should ignore stepIndex changes when tour is finished', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { rerender, result } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ steps, stepIndex: 1 }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // skip() at index > 0 so previousStep exists and TOUR_END fires
      act(() => {
        result.current.store.current.skip();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });

      mockCallback.mockClear();

      rerender(createProps({ steps, stepIndex: 2 }));

      // Give time for any async effects to settle
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 50);
        });
      });

      const navCallbacks = mockCallback.mock.calls.filter(
        (call: any[]) => call[0] && [EVENTS.STEP_BEFORE, EVENTS.TOUR_START].includes(call[0].type),
      );

      expect(navCallbacks).toHaveLength(0);
    });
  });

  describe('Prop Changes', () => {
    it('should start the tour when run changes from false to true', async () => {
      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ run: false }),
      });

      expect(mockCallback).not.toHaveBeenCalled();

      rerender(createProps({ run: true }));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });

    it('should stop the tour when run changes from true to false', async () => {
      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ run: true }),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      rerender(createProps({ run: false }));

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

    it('should return stable mergedProps reference when props are deeply equal', async () => {
      const initialProps: Props = {
        steps: testSteps,
        callback: mockCallback,
        continuous: true,
        run: true,
      };

      const { rerender, result } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps,
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      const firstRef = result.current.mergedProps;

      // Re-render with a new object that is deeply equal
      rerender({ ...initialProps });

      expect(result.current.mergedProps).toBe(firstRef);
    });

    it('should update store size when steps change', async () => {
      const initialSteps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { rerender, result } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ steps: initialSteps, run: false }),
      });

      expect(result.current.state.size).toBe(1);

      rerender(createProps({ steps: testSteps, run: false }));

      await waitFor(() => {
        expect(result.current.state.size).toBe(3);
      });
    });
  });

  describe('Scroll', () => {
    it('should call scrollTo when scrollToFirstStep is true', async () => {
      renderHook(() => useJoyrideData(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      expect(scrollTo).toHaveBeenCalled();
    });

    it('should NOT call scrollTo when disableScrolling is true on the step', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true, disableScrolling: true },
      ];

      renderHook(() => useJoyrideData(createProps({ steps, scrollToFirstStep: true })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('should cancel previous scroll before starting new scroll', async () => {
      const cancelMock = vi.fn();

      vi.mocked(scrollTo).mockReturnValue({
        cancel: cancelMock,
        promise: Promise.resolve(),
      });

      const { result } = renderHook(() => useJoyrideData(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER }),
        );
      });

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(cancelMock).toHaveBeenCalled();
    });

    it('should clamp negative scrollY to 0', async () => {
      vi.mocked(getScrollTo).mockReturnValue(-100);

      renderHook(() => useJoyrideData(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Object));
    });
  });

  describe('Edge Cases', () => {
    it('should not fire callbacks when run=false', async () => {
      const { result } = renderHook(() => useJoyrideData(createProps({ run: false })));

      // Give time for any async effects
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 50);
        });
      });

      expect(mockCallback).not.toHaveBeenCalled();
      expect(result.current.state.status).toBe(STATUS.READY);
    });

    it('should not crash with empty steps', () => {
      expect(() => {
        renderHook(() => useJoyrideData(createProps({ steps: [] })));
      }).not.toThrowError();
    });

    it('should deliver helpers via getHelpers prop', async () => {
      const mockGetHelpers = vi.fn();

      renderHook(() => useJoyrideData(createProps({ getHelpers: mockGetHelpers })));

      expect(mockGetHelpers).toHaveBeenCalledWith(
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

    it('should use TOOLTIP for center placement (beacon hidden)', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', placement: 'center' }];

      renderHook(() => useJoyrideData(createProps({ steps, continuous: false })));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(3);
      });

      expect(mockCallback).toHaveBeenNthCalledWith(
        3,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.TOOLTIP,
          size: 1,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should track lastAction for STEP_BEFORE callback after NEXT', async () => {
      const { result } = renderHook(() => useJoyrideData(createProps()));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.next();
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER }),
        );
      });
      mockCallback.mockClear();

      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          getCallbackResponse({
            action: ACTIONS.NEXT,
            index: 1,
            lifecycle: LIFECYCLE.READY,
            type: EVENTS.STEP_BEFORE,
          }),
        );
      });
    });

    it('should reset center placement from COMPLETE to INIT', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', placement: 'center', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 0 }),
        );
      });
      mockCallback.mockClear();

      // Manually set lifecycle to COMPLETE on the center step
      act(() => {
        result.current.store.current.updateState({ lifecycle: LIFECYCLE.COMPLETE });
      });

      // The center check should reset COMPLETE→INIT, then advance INIT→READY→TOOLTIP
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 0 }),
        );
      });
    });

    it('should auto-advance backward when PREV target is missing', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useJoyrideData(createProps({ steps })));

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));

      // Advance to step 2
      mockCallback.mockClear();
      act(() => {
        result.current.store.current.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      mockCallback.mockClear();
      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      mockCallback.mockClear();
      act(() => {
        result.current.store.current.next();
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 1 }),
        );
      });

      mockCallback.mockClear();
      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 2 }),
        );
      });

      // Now at step 2 (index 2). Make step 1 target missing.
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      mockCallback.mockClear();

      act(() => {
        result.current.store.current.prev();
      });

      // Should fire TARGET_NOT_FOUND for step 1 (index 1)
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      // Should auto-advance backward to step 0, not forward
      act(() => {
        result.current.store.current.setPopper(mockPopper as any, 'wrapper');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 0 }),
        );
      });
    });

    it('should warn when steps become invalid', async () => {
      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps(),
      });

      await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(3));
      consoleWarnSpy.mockClear();

      // Steps without target are invalid
      const invalidSteps = [{ content: 'No target' }] as unknown as Step[];

      rerender(createProps({ steps: invalidSteps }));

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith('Steps are not valid', invalidSteps);
      });
    });

    it('should transition IDLE to READY when steps load before run', async () => {
      const { rerender } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ run: false, steps: [] }),
      });

      // Add steps while run is still false (size becomes >0, status stays IDLE)
      rerender(createProps({ run: false }));

      await waitFor(() => {
        // Wait for size update to propagate
      });

      // Now set run=true: useUpdateEffect fires with run=true, size=3, status=IDLE → sets READY
      rerender(createProps({ run: true }));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });

    it('should transition WAITING to RUNNING when steps arrive after start', async () => {
      const { rerender, result } = renderHook((props: Props) => useJoyrideData(props), {
        initialProps: createProps({ run: false, steps: [] }),
      });

      // Calling start() with size=0 sets status=WAITING
      act(() => {
        result.current.store.current.start();
      });

      expect(result.current.state.status).toBe(STATUS.WAITING);

      // Adding steps while WAITING triggers applyTransitions → RUNNING
      rerender(createProps({ run: false }));

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });
    });
  });
});
