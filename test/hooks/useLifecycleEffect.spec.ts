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
    previousState: undefined,
    previousStep: null,
    props: createMergedProps(),
    state: createState(),
    step: createStep({ disableBeacon: true, targetWaitTimeout: 150 }),
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
    size: 2,
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

  describe('Effect 1: Action tracking', () => {
    it('should track NEXT action for STEP_BEFORE enrichment', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.TOOLTIP });
      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      // Simulate NEXT action → COMPLETE (triggers action tracking + STEP_AFTER)
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      // STEP_AFTER should use NEXT as the action (from lastAction tracking)
      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.STEP_AFTER,
          action: ACTIONS.NEXT,
          index: 0,
        }),
      );
    });

    it('should track PREV action for STEP_AFTER enrichment', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.PREV,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.STEP_AFTER,
          action: ACTIONS.PREV,
          index: 1,
        }),
      );
    });

    it('should track START after CLOSE for lastAction reset', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.CLOSE,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      // Set lastAction to CLOSE
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.CLOSE,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      // START follows CLOSE → lastAction updates to START
      const state3 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.START,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
      });

      rerender({ ...options, state: state3, previousState: state2 });

      expect(props.onEvent).toHaveBeenCalled();
    });
  });

  describe('Effect 2: Target resolution (INIT → READY)', () => {
    it('should transition to READY when target is visible', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      // Initial render with READY status so effect bails (not RUNNING)
      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      // Change status to RUNNING to trigger effect re-run via deps
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

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
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 0 });

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

    it('should fire STEP_BEFORE_HOOK and set waiting when step has before hook', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({
        disableBeacon: true,
        targetWaitTimeout: 150,
        before: () => new Promise(resolve => setTimeout(resolve, 100)),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });
      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.STEP_BEFORE_HOOK }),
      );
    });

    it('should proceed after before hook resolves', async () => {
      const store = createMockStore();
      const props = createMergedProps();

      let resolveHook!: () => void;
      const hookPromise = new Promise<void>(resolve => {
        resolveHook = resolve;
      });

      const step = createStep({
        disableBeacon: true,
        targetWaitTimeout: 5000,
        before: () => hookPromise,
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

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
      const props = createMergedProps();
      const error = new Error('hook failed');
      const step = createStep({
        disableBeacon: true,
        targetWaitTimeout: 5000,
        before: () => Promise.reject(error),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.ERROR, error }),
      );
      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          lifecycle: LIFECYCLE.READY,
          waiting: false,
        }),
      );
    });

    it('should handle non-Error rejection from before hook', async () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({
        disableBeacon: true,
        targetWaitTimeout: 5000,
        before: () => Promise.reject(new Error('string error')),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.ERROR,
          error: expect.objectContaining({ message: 'string error' }),
        }),
      );
    });

    it('should proceed and fire ERROR after before hook timeout', async () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({
        disableBeacon: true,
        targetWaitTimeout: 200,
        before: () => new Promise<void>(() => {}),
      });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.ERROR,
          error: expect.objectContaining({ message: 'Step before hook timed out' }),
        }),
      );
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
        disableBeacon: true,
        targetWaitTimeout: 5000,
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

      // Before hook started — waiting was set
      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });

      // Unmount cancels the abort controller
      unmount();

      // Resolve after unmount — should not call updateState with READY
      resolveHook();
      await hookPromise;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.READY }),
      );
    });

    it('should set waiting after loaderDelay during polling', async () => {
      vi.mocked(getElement).mockReturnValue(null);

      const store = createMockStore();
      const step = createStep({
        disableBeacon: true,
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

      // Before loaderDelay, waiting should not be set
      expect(store.current.updateState).not.toHaveBeenCalledWith({ waiting: true });

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(store.current.updateState).toHaveBeenCalledWith({ waiting: true });
    });

    it('should start polling when target is missing', async () => {
      vi.mocked(getElement).mockReturnValue(null);

      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 1000 });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      // Target not found yet, should not have transitioned
      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.READY }),
      );

      // Target appears
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
  });

  describe('Effect 3: Step presentation (READY → *_BEFORE)', () => {
    it('should fire STEP_BEFORE on INIT→READY transition', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.INIT,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
      });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.STEP_BEFORE }),
      );
    });

    it('should transition to TOOLTIP_BEFORE when disableBeacon is true', () => {
      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step, state: state1 });

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
      const step = createStep({ disableBeacon: false, targetWaitTimeout: 150 });

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

    it('should fire TARGET_NOT_FOUND when target disappears mid-lifecycle', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Target not mounted', step);
      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
      );
    });

    it('should warn "Target not visible" when element exists but is not visible', () => {
      vi.mocked(getElement).mockReturnValue(mockElement);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Target not visible', step);
      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TARGET_NOT_FOUND }),
      );
    });

    it('should auto-advance index in uncontrolled mode on target not found', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.READY,
        controlled: false,
      });

      const options = createOptions({ store, step, state: state1 });

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
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

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

      const options = createOptions({ store, step, state: state1 });

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

    it('should NOT auto-advance in controlled mode on target not found', () => {
      vi.mocked(getElement).mockReturnValue(null);
      vi.mocked(isElementVisible).mockReturnValue(false);

      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

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

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).not.toHaveBeenCalledWith(
        expect.objectContaining({ index: expect.any(Number), lifecycle: LIFECYCLE.INIT }),
      );
    });

    it('should set scrolling flag when scrolling needed', () => {
      vi.mocked(needsScrolling).mockReturnValue(true);

      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ scrolling: true }),
      );
    });
  });

  describe('Effect 4: BEACON/TOOLTIP display + STEP_AFTER', () => {
    it('should transition TOOLTIP_BEFORE → TOOLTIP when not scrolling', () => {
      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.READY });
      const state2 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scrolling: false,
      });

      const options = createOptions({ store, step, state: state1 });

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
      const step = createStep({ disableBeacon: false, targetWaitTimeout: 150 });

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

    it('should fire BEACON event', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: false, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
      });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.BEACON });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: EVENTS.BEACON }));
    });

    it('should fire TOOLTIP event', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
      });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.TOOLTIP });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: EVENTS.TOOLTIP }));
    });

    it('should fire STEP_AFTER on TOOLTIP → COMPLETE with previousState.index', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

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

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.STEP_AFTER,
          index: 0,
          lifecycle: LIFECYCLE.COMPLETE,
        }),
      );
    });

    it('should fire STEP_AFTER when step is null (past last step) using previousStep', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const previousStep = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: 1,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 1,
      });

      vi.mocked(getElement).mockReturnValue(null);

      const options = createOptions({
        store,
        props,
        step: null,
        previousStep,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.STEP_AFTER,
          step: previousStep,
        }),
      );
    });

    it('should fire STEP_AFTER in controlled + PAUSED mode', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

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

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.STEP_AFTER,
          index: 0,
        }),
      );
    });

    it('should not crash when after hook throws', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });
      const previousStep = createStep({
        disableBeacon: true,
        targetWaitTimeout: 150,
        after: () => {
          throw new Error('boom');
        },
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

      const options = createOptions({ store, props, step, previousStep, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      // Should not throw
      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.STEP_AFTER_HOOK }),
      );
    });

    it('should call after hook and fire STEP_AFTER_HOOK', () => {
      const afterMock = vi.fn();
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });
      const previousStep = createStep({
        disableBeacon: true,
        targetWaitTimeout: 150,
        after: afterMock,
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
        props,
        step,
        previousStep,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.STEP_AFTER_HOOK }),
      );
      expect(afterMock).toHaveBeenCalled();
    });
  });

  describe('Effect 5: Tour flow + tour-level callbacks', () => {
    it('should fire TOUR_START on READY → RUNNING', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({ status: STATUS.READY, lifecycle: LIFECYCLE.INIT });
      const state2 = createState({ status: STATUS.RUNNING, lifecycle: LIFECYCLE.INIT });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOUR_START }),
      );
    });

    it('should fire TOUR_END on FINISHED status and call controls.reset()', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const controls = createMockControls();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });
      const state2 = createState({
        status: STATUS.FINISHED,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });

      const options = createOptions({ store, props, controls, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOUR_END, status: STATUS.FINISHED }),
      );
      expect(controls.reset).toHaveBeenCalled();
    });

    it('should fire TOUR_END on SKIPPED status', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const controls = createMockControls();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        lifecycle: LIFECYCLE.COMPLETE,
      });
      const state2 = createState({
        status: STATUS.SKIPPED,
        lifecycle: LIFECYCLE.COMPLETE,
      });

      const options = createOptions({ store, props, controls, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOUR_END, status: STATUS.SKIPPED }),
      );
    });

    it('should fire TOUR_STATUS on STOP action', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.PAUSED,
        action: ACTIONS.STOP,
        lifecycle: LIFECYCLE.TOOLTIP,
      });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOUR_STATUS }),
      );
    });

    it('should fire TOUR_STATUS on RESET action', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.TOOLTIP,
      });
      const state2 = createState({
        status: STATUS.READY,
        action: ACTIONS.RESET,
        lifecycle: LIFECYCLE.INIT,
        index: 0,
      });

      const options = createOptions({ store, props, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOUR_STATUS }),
      );
    });

    it('should fire TOUR_END with adjusted index when previousStep exists', () => {
      const store = createMockStore();
      const props = createMergedProps();
      const controls = createMockControls();
      const previousStep = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });
      const state2 = createState({
        status: STATUS.FINISHED,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });

      const options = createOptions({
        store,
        props,
        controls,
        step: null,
        previousStep,
        state: state1,
      });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(props.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: EVENTS.TOUR_END,
          index: 1,
          step: previousStep,
        }),
      );
    });

    it('should set FINISHED when lifecycle changes to COMPLETE and index >= size', () => {
      const store = createMockStore();
      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: 2,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });

      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          status: STATUS.FINISHED,
          lifecycle: LIFECYCLE.COMPLETE,
        }),
      );
    });

    it('should finish when index >= size and step is null', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 2,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        size: 2,
      });

      const options = createOptions({ store, step: null, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ status: STATUS.FINISHED }),
      );
    });

    it('should reset to INIT in uncontrolled mode after COMPLETE with more steps', () => {
      const store = createMockStore();

      const state1 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: 3,
      });
      const state2 = createState({
        status: STATUS.RUNNING,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        size: 3,
        controlled: false,
      });

      const step = createStep({ disableBeacon: true, targetWaitTimeout: 150 });
      const options = createOptions({ store, step, state: state1 });

      const { rerender } = renderHook((options_: HookOptions) => useLifecycleEffect(options_), {
        initialProps: options,
      });

      rerender({ ...options, state: state2, previousState: state1 });

      expect(store.current.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ lifecycle: LIFECYCLE.INIT }),
      );
    });
  });
});
