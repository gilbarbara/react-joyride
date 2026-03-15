import type { RefObject } from 'react';

import { defaultProps } from '~/defaults';
import useLifecycleEffect from '~/hooks/useLifecycleEffect';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { getElement, isElementVisible } from '~/modules/dom';
import { mergeProps, needsScrolling } from '~/modules/helpers';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';
import { createStep, fromPartial, renderHook } from '~/test-utils';

import type { Controls, Props } from '~/types';

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

type HookOptions = Parameters<typeof useLifecycleEffect>[0];

// Distinct steps to verify the correct step is reported in events
const stepA = createStep({
  target: '#step-a',
  content: 'Step A',
  skipBeacon: true,
  targetWaitTimeout: 150,
});
const stepB = createStep({
  target: '#step-b',
  content: 'Step B',
  skipBeacon: true,
  targetWaitTimeout: 150,
});
const stepC = createStep({
  target: '#step-c',
  content: 'Step C',
  skipBeacon: true,
  targetWaitTimeout: 150,
});

function createMergedProps(overrides: Partial<Props> = {}) {
  return mergeProps(defaultProps, {
    steps: [],
    onEvent: vi.fn(),
    ...overrides,
  } as Props);
}

function createMockControls(): Controls {
  return fromPartial<Controls>({
    close: vi.fn(),
    go: vi.fn(),
    info: vi.fn(),
    next: vi.fn(),
    open: vi.fn(),
    prev: vi.fn(),
    reset: vi.fn(),
    skip: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
}

function createMockStore() {
  const state = createState();

  return {
    current: {
      cleanupPositionData: vi.fn(),
      getPositionData: vi.fn(),
      getServerSnapshot: vi.fn(() => state),
      getSnapshot: vi.fn(() => state),
      getState: vi.fn(() => {
        const { positioned: _, ...rest } = state;

        return rest;
      }),
      getEventState: vi.fn(() => {
        const { positioned: _, ...rest } = state;

        return rest;
      }),
      setPositionData: vi.fn(),
      setSteps: vi.fn(),
      subscribe: vi.fn(),
      updateState: vi.fn(),
    },
  } as unknown as RefObject<ReturnType<typeof createStore>>;
}

function createOptions(overrides: Partial<HookOptions> = {}): HookOptions {
  return {
    controls: createMockControls(),
    emitEvent: vi.fn(),
    previousState: undefined,
    props: createMergedProps(),
    state: createState(),
    step: stepA,
    store: createMockStore(),
    ...overrides,
  };
}

function createState(overrides: Partial<StoreState> = {}): StoreState {
  return {
    action: ACTIONS.INIT,
    controlled: false,
    index: 0,
    lifecycle: LIFECYCLE.INIT,
    origin: null,
    positioned: false,
    scrolling: false,
    size: 3,
    status: STATUS.IDLE,
    waiting: false,
    ...overrides,
  };
}

describe('useLifecycleEffect', () => {
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    consoleWarnSpy.mockClear();
    vi.mocked(getElement).mockClear().mockReturnValue(mockElement);
    vi.mocked(isElementVisible).mockClear().mockReturnValue(true);
    vi.mocked(needsScrolling).mockClear().mockReturnValue(false);
  });

  describe('Target resolution', () => {
    it('should transition to READY when target is visible', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.cleanupPositionData).toHaveBeenCalled();
      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should not run when status is not RUNNING', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.IDLE, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.PAUSED, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.READY }),
      );
    });

    it('should transition to READY immediately with targetWaitTimeout: 0 even if target missing', () => {
      vi.mocked(getElement).mockReturnValue(null);

      const store = createMockStore();
      const step = createStep({ skipBeacon: true, targetWaitTimeout: 0 });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should start polling when target is missing', async () => {
      vi.mocked(getElement).mockReturnValue(null);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.READY }),
      );

      vi.mocked(getElement).mockReturnValue(mockElement);
      vi.mocked(isElementVisible).mockReturnValue(true);

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should set waiting immediately during polling', async () => {
      vi.mocked(getElement).mockReturnValue(null);

      const store = createMockStore();
      const step = createStep({
        skipBeacon: true,
        targetWaitTimeout: 2000,
        loaderDelay: 100,
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });
    });

    it('should fire STEP_BEFORE_HOOK and set waiting when step has before hook', () => {
      const store = createMockStore();
      const step = createStep({
        skipBeacon: true,
        loaderDelay: 0,
        targetWaitTimeout: 150,
        before: () => new Promise(resolve => setTimeout(resolve, 100)),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });
      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.STEP_BEFORE_HOOK, step, {
        action: ACTIONS.INIT,
      });
    });

    it('should proceed after before hook resolves', async () => {
      const store = createMockStore();

      let resolveHook!: () => void;
      const hookPromise = new Promise<void>(resolve => {
        resolveHook = resolve;
      });

      const step = createStep({
        skipBeacon: true,
        beforeTimeout: 5000,
        before: () => hookPromise,
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      resolveHook();
      await hookPromise;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should proceed and fire ERROR after before hook rejects', async () => {
      const store = createMockStore();
      const error = new Error('hook failed');
      const step = createStep({
        skipBeacon: true,
        beforeTimeout: 5000,
        before: () => Promise.reject(error),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.ERROR, step, { error });
      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should handle non-Error rejection from before hook', async () => {
      const store = createMockStore();
      const step = createStep({
        skipBeacon: true,
        beforeTimeout: 5000,
        before: () => Promise.reject(new Error('string error')),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.ERROR, step, {
        error: expect.objectContaining({ message: 'string error' }),
      });
    });

    it('should proceed and fire ERROR after before hook timeout', async () => {
      const store = createMockStore();
      const step = createStep({
        skipBeacon: true,
        beforeTimeout: 200,
        before: () => new Promise<void>(() => {}),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.ERROR, step, {
        error: expect.objectContaining({ message: 'Step before hook timed out' }),
      });
      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should cancel before hook on unmount', async () => {
      const store = createMockStore();

      let resolveHook!: () => void;
      const hookPromise = new Promise<void>(resolve => {
        resolveHook = resolve;
      });

      const step = createStep({
        skipBeacon: true,
        beforeTimeout: 5000,
        before: () => hookPromise,
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender, unmount } = renderHook(
        (options_: HookOptions) => useLifecycleEffect(options_),
        { initialProps: options },
      );

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });

      unmount();

      resolveHook();
      await hookPromise;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.READY }),
      );
    });
  });

  describe('Step presentation', () => {
    it('should fire STEP_BEFORE on INIT→READY transition', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.STEP_BEFORE, stepA, {
        action: ACTIONS.INIT,
      });
    });

    it('should transition to TOOLTIP_BEFORE when skipBeacon is true', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.TOOLTIP_BEFORE }),
      );
    });

    it('should transition to BEACON_BEFORE when beacon is enabled', () => {
      const store = createMockStore();
      const props = createMergedProps({ continuous: false });
      const step = createStep({ skipBeacon: false, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.INIT,
        action: ACTIONS.INIT,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
        action: ACTIONS.INIT,
      });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.BEACON_BEFORE }),
      );
    });

    it('should set scrolling flag when scroll needed', () => {
      vi.mocked(needsScrolling).mockReturnValue(true);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ scrolling: true }),
      );
    });

    it('should fire TARGET_NOT_FOUND when target disappears mid-lifecycle', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Target not mounted', stepA);
      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TARGET_NOT_FOUND, stepA);
    });

    it('should warn "Target not visible" when element exists but is not visible', () => {
      vi.mocked(getElement).mockReturnValue(mockElement);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step: stepA, state: state1 });
      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Target not visible', stepA);
      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TARGET_NOT_FOUND, stepA);
    });

    it('should auto-advance forward in uncontrolled mode on TARGET_NOT_FOUND', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
        controlled: false,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 1,
          lifecycle: LIFECYCLE.INIT,
        }),
      );
    });

    it('should auto-advance backward on PREV when target not found', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.INIT,
        index: 1,
        action: ACTIONS.PREV,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
        index: 1,
        action: ACTIONS.PREV,
        controlled: false,
      });

      const options = createOptions({ store, step: stepB, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 0,
          lifecycle: LIFECYCLE.INIT,
        }),
      );
    });

    it('should NOT auto-advance in controlled mode on TARGET_NOT_FOUND', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.INIT,
        controlled: true,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
        controlled: true,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ index: expect.any(Number), lifecycle: LIFECYCLE.INIT }),
      );
    });
  });

  describe('Lifecycle transitions', () => {
    it('should transition TOOLTIP_BEFORE → TOOLTIP when not scrolling', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scrolling: false,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.TOOLTIP }),
      );
    });

    it('should transition BEACON_BEFORE → BEACON when not scrolling', () => {
      const store = createMockStore();
      const step = createStep({ skipBeacon: false, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
        scrolling: false,
      });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.BEACON }),
      );
    });

    it('should check scroll need on BEACON → TOOLTIP_BEFORE', () => {
      vi.mocked(needsScrolling).mockReturnValue(true);

      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.BEACON });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({
        scrolling: true,
        positioned: false,
      });
    });

    it('should fire BEACON event', () => {
      const store = createMockStore();
      const step = createStep({ skipBeacon: false, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.BEACON_BEFORE });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.BEACON });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.BEACON, step);
    });

    it('should fire TOOLTIP event', () => {
      const store = createMockStore();

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.TOOLTIP_BEFORE });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.TOOLTIP });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOOLTIP, stepA);
    });
  });

  describe('Step completion (STEP_AFTER)', () => {
    it('should fire STEP_AFTER with the completed step on next()', () => {
      // Scenario: viewing stepA at index 0, click next → index becomes 1
      // previousStep (usePrevious semantic) = stepA (what was showing)
      // step = stepB (the new current step)
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.STEP_AFTER, stepA, {
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
      });
    });

    it('should fire STEP_AFTER with the completed step on prev()', () => {
      // Scenario: viewing stepC at index 2, click prev → index becomes 1
      // usePrevious(step) = stepC (what was showing)
      // step = stepB (the new current step)
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepC,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.STEP_AFTER, stepC, {
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
      });
    });

    it('should fire STEP_AFTER with the completed step on close()', () => {
      // Scenario: viewing stepA at index 0, click close → index becomes 1
      // usePrevious(step) = stepA (what was showing)
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.CLOSE,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.STEP_AFTER, stepA, {
        action: ACTIONS.CLOSE,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
      });
    });

    it('should fire STEP_AFTER when past last step (step=null)', () => {
      // Scenario: viewing stepC at index 2, click next → index becomes 3 (past end)
      // usePrevious(step) = stepC, step = null
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: 3,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
      });

      vi.mocked(getElement).mockReturnValue(null);

      const options = createOptions({
        store,
        step: stepC,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: null, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        stepC,
        expect.objectContaining({ action: ACTIONS.NEXT }),
      );
    });

    it('should fire STEP_AFTER when next target is not in DOM (multi-route)', () => {
      // Scenario: multi-route tour, stepA tooltip showing, click next
      // stepB target (#step-b) doesn't exist in DOM yet (different route)
      // STEP_AFTER should still fire so onEvent handler can navigate
      const store = createMockStore();

      // stepB target not in DOM
      vi.mocked(getElement).mockImplementation(target => {
        if (target === '#step-b') return null;

        return mockElement;
      });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        stepA,
        expect.objectContaining({ action: ACTIONS.NEXT }),
      );
    });

    it('should fire STEP_AFTER in controlled + PAUSED mode', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.PAUSED,
        controlled: true,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.PAUSED,
        controlled: true,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        stepA,
        expect.objectContaining({ index: 0 }),
      );
    });

    it('should call after hook on the completed step', () => {
      const afterFn = vi.fn();
      const stepWithAfter = createStep({
        target: '#step-a',
        content: 'Step A',
        skipBeacon: true,
        targetWaitTimeout: 150,
        after: afterFn,
      });

      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepWithAfter,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(afterFn).toHaveBeenCalledWith(
        expect.objectContaining({
          step: stepWithAfter,
        }),
      );
    });

    it('should fire STEP_AFTER_HOOK when after hook exists', () => {
      const stepWithAfter = createStep({
        target: '#step-a',
        content: 'Step A',
        skipBeacon: true,
        targetWaitTimeout: 150,
        after: vi.fn(),
      });

      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepWithAfter,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.STEP_AFTER_HOOK,
        stepWithAfter,
        expect.objectContaining({ action: ACTIONS.NEXT }),
      );
    });

    it('should not crash when after hook throws', () => {
      const stepWithAfter = createStep({
        target: '#step-a',
        content: 'Step A',
        skipBeacon: true,
        targetWaitTimeout: 150,
        after: () => {
          throw new Error('boom');
        },
      });

      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepWithAfter,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      expect(() => {
        rerender({ ...options, step: stepB, state: state2, previousState: state1 });
      }).not.toThrowError();

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        stepWithAfter,
        expect.objectContaining({ action: ACTIONS.NEXT }),
      );
    });

    it('should NOT fire STEP_AFTER on skip (status → SKIPPED)', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.SKIPPED,
        action: ACTIONS.SKIP,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).not.toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should NOT fire STEP_AFTER on stop in uncontrolled mode', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.PAUSED,
        action: ACTIONS.STOP,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepB,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).not.toHaveBeenCalledWith(
        EVENTS.STEP_AFTER,
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe('Tour flow', () => {
    it('should fire TOUR_START on IDLE→RUNNING', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.IDLE,
        lifecycle: LIFECYCLE.INIT,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.START,
        lifecycle: LIFECYCLE.INIT,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_START, stepA);
    });

    it('should fire TOUR_START on PAUSED→RUNNING', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.PAUSED,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.START,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
      });

      const options = createOptions({ store, step: stepB, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_START, stepB);
    });

    it('should fire TOUR_END on FINISHED with correct step and index', () => {
      // Scenario: on last step (index 2), click next → index 3, FINISHED
      // TOUR_END should report the step that was showing (stepC) and its index (2)
      const store = createMockStore();
      const controls = createMockControls();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
      });
      const state2 = createState({
        status: STATUS.FINISHED,
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
      });

      const options = createOptions({
        store,
        controls,
        step: stepC,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: null, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_END, stepC, { index: 2 });
      expect(controls.reset).toHaveBeenCalled();
    });

    it('should fire TOUR_END on SKIPPED', () => {
      const store = createMockStore();
      const controls = createMockControls();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.SKIPPED,
        action: ACTIONS.SKIP,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        controls,
        step: stepB,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(
        EVENTS.TOUR_END,
        stepB,
        expect.objectContaining({ index: 1 }),
      );
      expect(controls.reset).toHaveBeenCalled();
    });

    it('should fire TOUR_STATUS on STOP action', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.PAUSED,
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_STATUS, stepA);
    });

    it('should fire TOUR_STATUS on RESET action', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
      });

      const options = createOptions({ store, step: stepA, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_STATUS, stepA);
    });

    it('should auto-advance COMPLETE→INIT when more steps (uncontrolled)', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.INIT,
      });
    });

    it('should NOT auto-advance in controlled mode', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        controlled: true,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        controlled: true,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        step: stepA,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: stepB, state: state2, previousState: state1 });

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.INIT }),
      );
    });

    it('should set FINISHED when index >= size', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: 3,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
      });

      const options = createOptions({
        store,
        step: stepC,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: null, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          status: STATUS.FINISHED,
          lifecycle: LIFECYCLE.COMPLETE,
        }),
      );
    });

    it('should set FINISHED when no step at INIT (size > 0 but step is null)', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        index: 3,
        lifecycle: LIFECYCLE.INIT,
        size: 3,
      });

      const options = createOptions({
        store,
        step: stepC,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, step: null, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          status: STATUS.FINISHED,
          lifecycle: LIFECYCLE.COMPLETE,
        }),
      );
    });

    it('should report correct index in TOUR_END after skip (index unchanged)', () => {
      // Skip on step 1 — index stays 1, usePrevious(step) = stepB
      // TOUR_END should report index 1 (the step being skipped from)
      const store = createMockStore();
      const controls = createMockControls();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.SKIPPED,
        action: ACTIONS.SKIP,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({
        store,
        controls,
        step: stepB,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(options.emitEvent).toHaveBeenCalledWith(EVENTS.TOUR_END, stepB, { index: 1 });
    });
  });
});
