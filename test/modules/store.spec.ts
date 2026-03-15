import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import createStore from '~/modules/store';

import type { Controls, EventData } from '~/types';

import { standardSteps } from '../__fixtures__/steps';

const mockSyncStore = vi.fn();

function createEventData(overrides: Partial<EventData> = {}): EventData {
  return {
    action: ACTIONS.UPDATE,
    controlled: false,
    error: null,
    index: 0,
    lifecycle: LIFECYCLE.TOOLTIP,
    origin: null,
    scroll: null,
    scrolling: false,
    size: 3,
    status: STATUS.RUNNING,
    step: {} as EventData['step'],
    type: EVENTS.TOOLTIP,
    waiting: false,
    ...overrides,
  };
}

const mockControls = {} as Controls;

describe('store', () => {
  beforeEach(() => {
    mockSyncStore.mockClear();
  });

  describe('constructor', () => {
    it('should create a store without steps', () => {
      const store = createStore();

      expect(store.getState()).toEqual({
        action: ACTIONS.INIT,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        origin: null,
        scrolling: false,
        size: 0,
        status: STATUS.IDLE,
        waiting: false,
      });
    });

    it('should create a store with steps', () => {
      const store = createStore({ steps: standardSteps });

      expect(store.getState()).toEqual(
        expect.objectContaining({
          size: standardSteps.length,
          status: STATUS.READY,
        }),
      );
    });

    it('should create a controlled store with stepIndex', () => {
      const store = createStore({ steps: standardSteps, stepIndex: 0 });

      expect(store.getState()).toEqual(
        expect.objectContaining({
          controlled: true,
          index: 0,
        }),
      );
    });
  });

  describe('setSteps', () => {
    it('should update steps and size', () => {
      const store = createStore();

      store.setSteps(standardSteps);

      expect(store.getState().size).toBe(standardSteps.length);
    });
  });

  describe('updateState', () => {
    it('should update state and notify listeners', () => {
      const store = createStore({ steps: standardSteps });

      store.subscribe(mockSyncStore);
      store.updateState({ status: STATUS.RUNNING });

      expect(store.getState().status).toBe(STATUS.RUNNING);
      expect(mockSyncStore).toHaveBeenCalledTimes(1);
    });

    it('should not notify when state has not changed', () => {
      const store = createStore({ steps: standardSteps });

      store.subscribe(mockSyncStore);
      store.updateState({ status: STATUS.READY });

      expect(mockSyncStore).toHaveBeenCalledTimes(0);
    });

    it('should apply WAITING→RUNNING transition when size > 0', () => {
      const store = createStore({ steps: standardSteps });

      store.updateState({ status: STATUS.WAITING });

      expect(store.getState().status).toBe(STATUS.RUNNING);
    });

    it('should respect forceIndex in controlled mode', () => {
      const store = createStore({ steps: standardSteps, stepIndex: 0 });

      store.updateState({ index: 3 }, true);
      expect(store.getState().index).toBe(3);
    });

    it('should ignore index changes in controlled mode without forceIndex', () => {
      const store = createStore({ steps: standardSteps, stepIndex: 0 });

      store.updateState({ index: 3 });
      expect(store.getState().index).toBe(0);
    });
  });

  describe('subscribe', () => {
    it('should handle subscribe and unsubscribe', () => {
      const store = createStore({ steps: standardSteps });

      const unsubscribe = store.subscribe(mockSyncStore);

      store.updateState({ status: STATUS.FINISHED });
      expect(mockSyncStore).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.updateState({ status: STATUS.IDLE });
      expect(mockSyncStore).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSnapshot', () => {
    it('should return stable snapshot reference when state has not changed', () => {
      const store = createStore({ steps: standardSteps });

      const snapshot1 = store.getSnapshot();
      const snapshot2 = store.getSnapshot();

      expect(snapshot1).toBe(snapshot2);

      store.updateState({ status: STATUS.FINISHED });

      const snapshot3 = store.getSnapshot();

      expect(snapshot3).not.toBe(snapshot1);
    });

    it('should return frozen snapshots', () => {
      const store = createStore({ steps: standardSteps });

      const snapshot = store.getSnapshot();

      expect(Object.isFrozen(snapshot)).toBe(true);
    });
  });

  describe('initialStepIndex', () => {
    it('should start at the specified index', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 2 });
      const state = store.getState();

      expect(state.index).toBe(2);
      expect(state.controlled).toBe(false);
    });

    it('should fall back to 0 when out of bounds', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const store = createStore({ debug: true, steps: standardSteps, initialStepIndex: 99 });

      expect(store.getState().index).toBe(0);
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %cinitialStepIndex is out of bounds%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
      );

      logSpy.mockRestore();
    });

    it('should fall back to 0 when negative', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const store = createStore({ debug: true, steps: standardSteps, initialStepIndex: -1 });

      expect(store.getState().index).toBe(0);
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %cinitialStepIndex is out of bounds%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
      );

      logSpy.mockRestore();
    });

    it('should treat 0 the same as omitting it', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 0 });

      expect(store.getState().index).toBe(0);
    });

    it('should be ignored in controlled mode', () => {
      const store = createStore({
        debug: true,
        steps: standardSteps,
        stepIndex: 0,
        initialStepIndex: 2,
      });

      expect(store.getState().index).toBe(0);
      expect(store.getState().controlled).toBe(true);
    });
  });

  describe('on / dispatch', () => {
    it('should fire handler for matching event type', () => {
      const store = createStore({ steps: standardSteps });
      const handler = vi.fn();

      store.on(EVENTS.TOOLTIP, handler);
      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ type: EVENTS.TOOLTIP }),
        mockControls,
      );
    });

    it('should not fire handler for non-matching event type', () => {
      const store = createStore({ steps: standardSteps });
      const handler = vi.fn();

      store.on(EVENTS.TOOLTIP, handler);
      store.dispatch(createEventData({ type: EVENTS.BEACON }), mockControls);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should unsubscribe when calling the returned function', () => {
      const store = createStore({ steps: standardSteps });
      const handler = vi.fn();

      const unsubscribe = store.on(EVENTS.TOOLTIP, handler);

      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple handlers for the same event type', () => {
      const store = createStore({ steps: standardSteps });
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      store.on(EVENTS.TOOLTIP, handler1);
      store.on(EVENTS.TOOLTIP, handler2);
      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should be a no-op when dispatching with no listeners', () => {
      const store = createStore({ steps: standardSteps });

      expect(() => {
        store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);
      }).not.toThrowError();
    });

    it('should isolate errors between handlers', () => {
      const store = createStore({ steps: standardSteps });
      const handler1 = vi.fn(() => {
        throw new Error('boom');
      });
      const handler2 = vi.fn();

      store.on(EVENTS.TOOLTIP, handler1);
      store.on(EVENTS.TOOLTIP, handler2);
      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should handle unsubscribe inside a handler', () => {
      const store = createStore({ steps: standardSteps });
      const handler2 = vi.fn();
      let unsubscribe1: () => void;

      const handler1 = vi.fn(() => {
        unsubscribe1();
      });

      unsubscribe1 = store.on(EVENTS.TOOLTIP, handler1);
      store.on(EVENTS.TOOLTIP, handler2);

      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      store.dispatch(createEventData({ type: EVENTS.TOOLTIP }), mockControls);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(2);
    });
  });

  describe('position data', () => {
    const store = createStore();
    const positionData = { placement: 'top' as const, x: 0, y: -10, middlewareData: {} };

    it('should set/get both positions', () => {
      store.setPositionData('beacon', positionData);
      expect(store.getPositionData('beacon')).toEqual(positionData);

      store.setPositionData('tooltip', positionData);
      expect(store.getPositionData('tooltip')).toEqual(positionData);
    });

    it('should clear both positions', () => {
      expect(store.getPositionData('beacon')).toEqual(positionData);
      expect(store.getPositionData('tooltip')).toEqual(positionData);

      store.cleanupPositionData();
      expect(store.getPositionData('beacon')).toBeNull();
      expect(store.getPositionData('tooltip')).toBeNull();
    });
  });
});
