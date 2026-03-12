import useTourEngine from '~/hooks/useTourEngine';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, getScrollTo, isElementVisible, scrollTo } from '~/modules/dom';
import { needsScrolling } from '~/modules/helpers';
import { act, eventResponseFactory, renderHook, waitFor } from '~/test-utils';

import type { Props, Step } from '~/types';

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

describe('useTourEngine', () => {
  const mockOnEvent = vi.fn();
  const getEventResponse = eventResponseFactory({ size: 3 });

  const testSteps: Step[] = [
    { target: '.step-1', content: 'Step 1', disableBeacon: true },
    { target: '.step-2', content: 'Step 2', disableBeacon: true },
    { target: '.step-3', content: 'Step 3', disableBeacon: true },
  ];

  function createProps(overrides: Partial<Props> = {}): Props {
    return {
      steps: testSteps,
      onEvent: mockOnEvent,
      continuous: true,
      run: true,
      ...overrides,
    };
  }

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

  describe('Tour Lifecycle', () => {
    it('should start the tour and fire TOUR_START, STEP_BEFORE, TOOLTIP', async () => {
      renderHook(() => useTourEngine(createProps()));

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
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        2,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        3,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.TOOLTIP,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should advance to the next step with next()', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      // next() sets lifecycle=COMPLETE → STEP_AFTER → COMPLETE→INIT → STEP_BEFORE → TOOLTIP
      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        1,
        getEventResponse({
          action: ACTIONS.NEXT,
          index: 0,
          lifecycle: LIFECYCLE.COMPLETE,
          type: EVENTS.STEP_AFTER,
        }),
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        2,
        getEventResponse({
          action: ACTIONS.NEXT,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        3,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 1,
          lifecycle: LIFECYCLE.TOOLTIP,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should show beacon in non-continuous mode', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1' }];

      renderHook(() => useTourEngine(createProps({ steps, continuous: false })));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        3,
        getEventResponse({
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

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(expect.objectContaining({ type: EVENTS.TOOLTIP }));
      });

      // Should be TOOLTIP, not BEACON (continuous + NEXT hides beacon)
      const beaconCalls = mockOnEvent.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.BEACON,
      );

      expect(beaconCalls).toHaveLength(0);
    });

    it('should finish the tour when the last step completes', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
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
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.skip('button_skip');
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
            action: ACTIONS.SKIP,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            origin: 'button_skip',
            status: STATUS.SKIPPED,
            type: EVENTS.TOUR_END,
          }),
        );
      });
    });

    it('should stop and resume the tour', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.stop();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
            action: ACTIONS.STOP,
            index: 0,
            lifecycle: LIFECYCLE.COMPLETE,
            status: STATUS.PAUSED,
            type: EVENTS.TOUR_STATUS,
          }),
        );
      });

      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.start();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });
  });

  describe('Target Handling', () => {
    it('should fire TARGET_NOT_FOUND and auto-advance when target is missing (uncontrolled)', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 150 },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      // Make .missing target not found before advancing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // STEP_AFTER fires, then COMPLETE→INIT, INIT polls, TARGET_NOT_FOUND, auto-advance to step 3
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Target not mounted',
        expect.objectContaining({ target: '.missing' }),
      );

      // Auto-advance sets lifecycle=INIT → step 3 shows
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
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

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      vi.mocked(isElementVisible).mockReturnValue(false);

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
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

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      vi.mocked(getElement).mockReturnValue(null);

      rerender(createProps({ steps, stepIndex: 1 }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
        );
      });

      // No STEP_BEFORE for index 2 (controlled mode doesn't auto-advance)
      const stepBeforeCalls = mockOnEvent.mock.calls.filter(
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

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      // Make step-2 target missing before advancing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.step-2') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // COMPLETE→INIT starts polling (target missing)
      // No STEP_BEFORE yet — target missing, polling in INIT
      const stepBeforeCalls = mockOnEvent.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.STEP_BEFORE && call[0]?.index === 1,
      );

      expect(stepBeforeCalls).toHaveLength(0);

      // Target appears — next poll tick resolves it
      vi.mocked(getElement).mockReturnValue(mockElement);

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
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

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();
      consoleWarnSpy.mockClear();

      // Make .missing target permanently missing before advancing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // STEP_AFTER fires, then COMPLETE→INIT starts polling for 200ms
      // Wait for polling to time out and fire TARGET_NOT_FOUND
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      const notFoundCalls = mockOnEvent.mock.calls.filter(
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

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      // Make target missing before advancing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // TARGET_NOT_FOUND should fire immediately without polling delay
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
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

      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      rerender(createProps({ steps, stepIndex: 1 }));

      await act(async () => {
        vi.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
        );
      });

      const notFoundCalls = mockOnEvent.mock.calls.filter(
        (call: any[]) => call[0]?.type === EVENTS.TARGET_NOT_FOUND,
      );

      expect(notFoundCalls).toHaveLength(1);

      vi.useRealTimers();
    });

    it('should set waiting flag immediately during polling', async () => {
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

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      // Make .slow target missing before advancing
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.slow') return null;

        return mockElement;
      });

      act(() => {
        result.current.controls.next();
      });

      // COMPLETE→INIT starts polling — waiting is set immediately
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

      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      expect(result.current.state.controlled).toBe(true);
      mockOnEvent.mockClear();

      rerender(createProps({ steps, stepIndex: 1 }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
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

      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 1 }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      rerender(createProps({ steps, stepIndex: 0 }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
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

      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 1 }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      // skip() at index > 0 so previousStep exists and TOUR_END fires
      act(() => {
        result.current.controls.skip();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_END }),
        );
      });

      mockOnEvent.mockClear();

      rerender(createProps({ steps, stepIndex: 2 }));

      // Give time for any async effects to settle
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 50);
        });
      });

      const navCallbacks = mockOnEvent.mock.calls.filter(
        (call: any[]) => call[0] && [EVENTS.STEP_BEFORE, EVENTS.TOUR_START].includes(call[0].type),
      );

      expect(navCallbacks).toHaveLength(0);
    });
  });

  describe('Prop Changes', () => {
    it('should start the tour when run changes from false to true', async () => {
      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ run: false }),
      });

      expect(mockOnEvent).not.toHaveBeenCalled();

      rerender(createProps({ run: true }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });

    it('should stop the tour when run changes from true to false', async () => {
      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ run: true }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      rerender(createProps({ run: false }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
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
        onEvent: mockOnEvent,
        continuous: true,
        run: true,
      };

      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
        initialProps,
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      const firstRef = result.current.mergedProps;

      // Re-render with a new object that is deeply equal
      rerender({ ...initialProps });

      expect(result.current.mergedProps).toBe(firstRef);
    });

    it('should update store size when steps change', async () => {
      const initialSteps: Step[] = [{ target: '.step-1', content: 'Step 1', disableBeacon: true }];

      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
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
    beforeEach(() => {
      vi.mocked(needsScrolling).mockReturnValue(true);
    });

    afterEach(() => {
      vi.mocked(needsScrolling).mockReturnValue(false);
    });

    const mockPositionData = {
      placement: 'bottom' as const,
      x: 0,
      y: 0,
      middlewareData: { offset: { x: 0, y: 20, placement: 'bottom' as const } },
    };

    it('should call scrollTo when scrollToFirstStep is true', async () => {
      const { result } = renderHook(() => useTourEngine(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(2));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      await waitFor(() => expect(scrollTo).toHaveBeenCalled());
    });

    it('should NOT call scrollTo when disableScroll is true on the step', async () => {
      vi.mocked(needsScrolling).mockReturnValue(false);
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true, disableScroll: true },
      ];

      const { result } = renderHook(() =>
        useTourEngine(createProps({ steps, scrollToFirstStep: true })),
      );

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('should cancel previous scroll before starting new scroll', async () => {
      const cancelMock = vi.fn();

      vi.mocked(scrollTo).mockReturnValue({
        cancel: cancelMock,
        promise: Promise.resolve(),
      });

      const { result } = renderHook(() => useTourEngine(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(2));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      await waitFor(() => expect(scrollTo).toHaveBeenCalled());

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(7));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      await waitFor(() => expect(cancelMock).toHaveBeenCalled());
    });

    it('should clamp negative scrollY to 0', async () => {
      vi.mocked(getScrollTo).mockReturnValue(-100);

      const { result } = renderHook(() => useTourEngine(createProps({ scrollToFirstStep: true })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(2));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Object)));
    });

    it('should use scrollTarget for scroll calculations when set', async () => {
      const scrollTargetElement = document.createElement('div');

      vi.mocked(needsScrolling).mockReturnValue(true);
      vi.mocked(getElement).mockImplementation(selector => {
        if (selector === '.scroll-target') return scrollTargetElement;

        return mockElement;
      });

      const steps: Step[] = [
        {
          target: '.step-1',
          content: 'Step 1',
          disableBeacon: true,
          scrollTarget: '.scroll-target',
        },
      ];

      const { result } = renderHook(() =>
        useTourEngine(createProps({ steps, scrollToFirstStep: true })),
      );

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(2));

      act(() => {
        result.current.store.current.setPositionData('tooltip', mockPositionData);
      });

      await waitFor(() => expect(scrollTo).toHaveBeenCalled());
      expect(getElement).toHaveBeenCalledWith('.scroll-target');
    });
  });

  describe('Edge Cases', () => {
    it('should not fire callbacks when run=false', async () => {
      const { result } = renderHook(() => useTourEngine(createProps({ run: false })));

      // Give time for any async effects
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 50);
        });
      });

      expect(mockOnEvent).not.toHaveBeenCalled();
      expect(result.current.state.status).toBe(STATUS.READY);
    });

    it('should not crash with empty steps', () => {
      expect(() => {
        renderHook(() => useTourEngine(createProps({ steps: [] })));
      }).not.toThrowError();
    });

    it('should use TOOLTIP for center placement (beacon hidden)', async () => {
      const steps: Step[] = [{ target: '.step-1', content: 'Step 1', placement: 'center' }];

      renderHook(() => useTourEngine(createProps({ steps, continuous: false })));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        3,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 0,
          lifecycle: LIFECYCLE.TOOLTIP,
          size: 1,
          type: EVENTS.TOOLTIP,
        }),
      );
    });

    it('should track lastAction for STEP_BEFORE callback after NEXT', async () => {
      const { result } = renderHook(() => useTourEngine(createProps()));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      // next() triggers STEP_AFTER → STEP_BEFORE with NEXT action preserved
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          getEventResponse({
            action: ACTIONS.NEXT,
            index: 1,
            lifecycle: LIFECYCLE.READY,
            type: EVENTS.STEP_BEFORE,
          }),
        );
      });
    });

    it('should reset any placement from COMPLETE to INIT', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', placement: 'center', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 0 }),
        );
      });
      mockOnEvent.mockClear();

      // Manually set lifecycle to COMPLETE — should reset COMPLETE→INIT→READY→TOOLTIP
      act(() => {
        result.current.store.current.updateState({ lifecycle: LIFECYCLE.COMPLETE });
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 0 }),
        );
      });
    });

    it('should auto-advance backward when PREV target is missing', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.missing', content: 'Missing', disableBeacon: true, targetWaitTimeout: 150 },
        { target: '.step-3', content: 'Step 3', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      // Advance to step 2
      mockOnEvent.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      // Advance to step 3
      mockOnEvent.mockClear();
      act(() => {
        result.current.controls.next();
      });
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 2 }),
        );
      });

      // Now at step 3 (index 2). Make step 2 target missing.
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '.missing') return null;

        return mockElement;
      });

      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.prev();
      });

      // STEP_AFTER for step 3, then TARGET_NOT_FOUND for step 2 (index 1)
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND, index: 1 }),
        );
      });

      // Auto-advance backward to step 1 (index 0)
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_BEFORE, index: 0 }),
        );
      });
    });

    it('should warn when steps become invalid', async () => {
      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps(),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      consoleWarnSpy.mockClear();

      // Steps without target are invalid
      const invalidSteps = [{ content: 'No target' }] as unknown as Step[];

      rerender(createProps({ steps: invalidSteps }));

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith('Steps are not valid', invalidSteps);
      });
    });

    it('should transition IDLE to READY when steps load before run', async () => {
      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
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
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOUR_START }),
        );
      });
    });

    it('should transition WAITING to RUNNING when steps arrive after start', async () => {
      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ run: false, steps: [] }),
      });

      // Calling start() with size=0 sets status=WAITING
      act(() => {
        result.current.controls.start();
      });

      expect(result.current.state.status).toBe(STATUS.WAITING);

      // Adding steps while WAITING triggers applyTransitions → RUNNING
      rerender(createProps({ run: false }));

      await waitFor(() => {
        expect(result.current.state.status).toBe(STATUS.RUNNING);
      });
    });
  });

  describe('initialStepIndex', () => {
    it('should start at the specified step index', async () => {
      renderHook(() => useTourEngine(createProps({ initialStepIndex: 1 })));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        1,
        getEventResponse({
          action: ACTIONS.START,
          index: 1,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TOUR_START,
        }),
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        2,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    it('should be ignored in controlled mode', async () => {
      renderHook(() => useTourEngine(createProps({ initialStepIndex: 1, stepIndex: 0 })));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        1,
        getEventResponse({
          action: ACTIONS.START,
          controlled: true,
          index: 0,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TOUR_START,
        }),
      );
    });

    it('should start at the specified step index when run changes to true', async () => {
      const { rerender } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ run: false }),
      });

      expect(mockOnEvent).not.toHaveBeenCalled();

      rerender(createProps({ run: true, initialStepIndex: 1 }));

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledTimes(3);
      });

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        1,
        getEventResponse({
          action: ACTIONS.START,
          index: 1,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TOUR_START,
        }),
      );

      expect(mockOnEvent).toHaveBeenNthCalledWith(
        2,
        getEventResponse({
          action: ACTIONS.UPDATE,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });
  });

  describe('before hook', () => {
    it('should delay step transition with before hook', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          loaderDelay: 0,
          before: () => new Promise(resolve => setTimeout(resolve, 200)),
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      // STEP_AFTER fires immediately
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      // waiting should be true during the delay
      expect(result.current.state.waiting).toBe(true);

      // After real 200ms, STEP_BEFORE and TOOLTIP fire
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should delay step transition with before in controlled mode', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          before: () => new Promise(resolve => setTimeout(resolve, 500)),
        },
      ];

      const { rerender, result } = renderHook((props: Props) => useTourEngine(props), {
        initialProps: createProps({ steps, stepIndex: 0 }),
      });

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      rerender(createProps({ steps, stepIndex: 1 }));

      // waiting should be true during the delay
      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      // After real 200ms, TOOLTIP fires
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should delay step transition with async before', async () => {
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
          before: () => delayPromise,
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      // Resolve the async delay
      await act(async () => {
        resolveDelay!();
        await delayPromise;
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should pass callback data to async before', async () => {
      const beforeFn = vi.fn(() => Promise.resolve());

      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        { target: '.step-2', content: 'Step 2', disableBeacon: true, before: beforeFn },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(beforeFn).toHaveBeenCalledWith(
          expect.objectContaining({
            action: expect.any(String),
            index: expect.any(Number),
            status: STATUS.RUNNING,
            step: expect.objectContaining({ target: '.step-2' }),
          }),
        );
      });
    });

    it('should proceed if async before rejects', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          before: () => Promise.reject(new Error('fail')),
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      // Should still proceed to TOOLTIP despite rejection
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });

    it('should proceed after beforeTimeout if async before never resolves', async () => {
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true },
        {
          target: '.step-2',
          content: 'Step 2',
          disableBeacon: true,
          before: () => new Promise<void>(() => {}),
          loaderDelay: 100,
          beforeTimeout: 500,
        },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.STEP_AFTER, index: 0 }),
        );
      });

      await waitFor(() => {
        expect(result.current.state.waiting).toBe(true);
      });

      // After beforeTimeout (500ms), should proceed
      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(result.current.state.waiting).toBe(false);
    });
  });

  describe('after hook', () => {
    it('should call after with correct data when step completes', async () => {
      const afterFn = vi.fn();
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true, after: afterFn },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(afterFn).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTIONS.NEXT,
            index: 0,
            step: expect.objectContaining({ target: '.step-1' }),
          }),
        );
      });
    });

    it('should not break the tour if after throws', async () => {
      const afterFn = vi.fn(() => {
        throw new Error('user error');
      });
      const steps: Step[] = [
        { target: '.step-1', content: 'Step 1', disableBeacon: true, after: afterFn },
        { target: '.step-2', content: 'Step 2', disableBeacon: true },
      ];

      const { result } = renderHook(() => useTourEngine(createProps({ steps })));

      await waitFor(() => expect(mockOnEvent).toHaveBeenCalledTimes(3));
      mockOnEvent.mockClear();

      act(() => {
        result.current.controls.next();
      });

      await waitFor(() => {
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({ type: EVENTS.TOOLTIP, index: 1 }),
        );
      });

      expect(afterFn).toHaveBeenCalled();
    });
  });
});
