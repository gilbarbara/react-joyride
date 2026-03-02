import useControls from '~/hooks/useControls';
import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import createStore from '~/modules/store';
import { renderHook } from '~/test-utils';

import { Step, StoreState } from '~/types';

const steps: Step[] = [
  { target: '.step-1', content: 'Step 1' },
  { target: '.step-2', content: 'Step 2' },
  { target: '.step-3', content: 'Step 3' },
];

function setup(overrides?: Partial<StoreState>) {
  const store = createStore({ steps, run: true });

  // Default to RUNNING so controls are usable
  store.updateState({ status: STATUS.RUNNING, ...overrides });

  const storeRef = { current: store };
  const { result } = renderHook(() => useControls(storeRef, false));

  return { result, store };
}

describe('useControls', () => {
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });

  describe('close', () => {
    it('should set CLOSE action with origin and increment index', () => {
      const { result, store } = setup({ index: 1 });

      result.current.close('keyboard');

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.CLOSE);
      expect(state.index).toBe(2);
      expect(state.origin).toBe('keyboard');
      expect(state.lifecycle).toBe(LIFECYCLE.COMPLETE);
    });

    it('should default origin to null', () => {
      const { result, store } = setup();

      result.current.close();

      expect(store.getSnapshot().origin).toBeNull();
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.close('overlay');

      expect(store.getSnapshot().action).not.toBe(ACTIONS.CLOSE);
    });
  });

  describe('go', () => {
    it('should set GO action with the given index', () => {
      const { result, store } = setup();

      result.current.go(2);

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.GO);
      expect(state.index).toBe(2);
      expect(state.status).toBe(STATUS.RUNNING);
    });

    it('should set FINISHED when index >= size', () => {
      const { result, store } = setup();

      result.current.go(5);

      expect(store.getSnapshot().status).toBe(STATUS.FINISHED);
    });

    it('should warn and return in controlled mode', () => {
      const store = createStore({ steps, run: true, stepIndex: 0 });

      store.updateState({ status: STATUS.RUNNING });

      const storeRef = { current: store };
      const { result } = renderHook(() => useControls(storeRef, true));

      result.current.go(1);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '%creact-joyride: go() is not supported in controlled mode',
        expect.any(String),
      );
      expect(store.getSnapshot().action).not.toBe(ACTIONS.GO);
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.go(1);

      expect(store.getSnapshot().action).not.toBe(ACTIONS.GO);
    });
  });

  describe('next', () => {
    it('should increment index with NEXT action', () => {
      const { result, store } = setup({ index: 0 });

      result.current.next();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.NEXT);
      expect(state.index).toBe(1);
    });

    it('should clamp index to size', () => {
      const { result, store } = setup({ index: 2 });

      result.current.next();

      expect(store.getSnapshot().index).toBe(3);
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.next();

      expect(store.getSnapshot().action).not.toBe(ACTIONS.NEXT);
    });
  });

  describe('open', () => {
    it('should set TOOLTIP lifecycle', () => {
      const { result, store } = setup();

      result.current.open();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.UPDATE);
      expect(state.lifecycle).toBe(LIFECYCLE.TOOLTIP);
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.open();

      expect(store.getSnapshot().lifecycle).not.toBe(LIFECYCLE.TOOLTIP);
    });
  });

  describe('prev', () => {
    it('should decrement index with PREV action', () => {
      const { result, store } = setup({ index: 2 });

      result.current.prev();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.PREV);
      expect(state.index).toBe(1);
    });

    it('should clamp index to 0', () => {
      const { result, store } = setup({ index: 0 });

      result.current.prev();

      expect(store.getSnapshot().index).toBe(0);
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.prev();

      expect(store.getSnapshot().action).not.toBe(ACTIONS.PREV);
    });
  });

  describe('reset', () => {
    it('should reset to index 0 with READY status', () => {
      const { result, store } = setup({ index: 2 });

      result.current.reset();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.RESET);
      expect(state.index).toBe(0);
      expect(state.status).toBe(STATUS.READY);
    });

    it('should set RUNNING status when restart is true', () => {
      const { result, store } = setup({ index: 1 });

      result.current.reset(true);

      expect(store.getSnapshot().status).toBe(STATUS.RUNNING);
    });

    it('should warn and return in controlled mode', () => {
      const store = createStore({ steps, run: true, stepIndex: 1 });

      store.updateState({ status: STATUS.RUNNING });

      const storeRef = { current: store };
      const { result } = renderHook(() => useControls(storeRef, true));

      result.current.reset();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '%creact-joyride: reset() is not supported in controlled mode',
        expect.any(String),
      );
      expect(store.getSnapshot().action).not.toBe(ACTIONS.RESET);
    });
  });

  describe('skip', () => {
    it('should set SKIPPED status with default origin', () => {
      const { result, store } = setup();

      result.current.skip();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.SKIP);
      expect(state.status).toBe(STATUS.SKIPPED);
      expect(state.origin).toBe('button_skip');
    });

    it('should accept custom origin', () => {
      const { result, store } = setup();

      result.current.skip('button_close');

      expect(store.getSnapshot().origin).toBe('button_close');
    });

    it('should not update state when not RUNNING', () => {
      const { result, store } = setup({ status: STATUS.PAUSED });

      result.current.skip();

      expect(store.getSnapshot().action).not.toBe(ACTIONS.SKIP);
    });
  });

  describe('start', () => {
    it('should set RUNNING status with INIT lifecycle', () => {
      const { result, store } = setup({ status: STATUS.READY });

      result.current.start();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.START);
      expect(state.lifecycle).toBe(LIFECYCLE.INIT);
      expect(state.status).toBe(STATUS.RUNNING);
    });

    it('should use nextIndex when provided', () => {
      const { result, store } = setup({ status: STATUS.READY });

      result.current.start(2);

      expect(store.getSnapshot().index).toBe(2);
    });

    it('should set WAITING when size is 0', () => {
      const emptyStore = createStore({ steps: [], run: true });
      const storeRef = { current: emptyStore };
      const { result } = renderHook(() => useControls(storeRef, false));

      result.current.start();

      expect(emptyStore.getSnapshot().status).toBe(STATUS.WAITING);
    });
  });

  describe('stop', () => {
    it('should set PAUSED status', () => {
      const { result, store } = setup();

      result.current.stop();

      const state = store.getSnapshot();

      expect(state.action).toBe(ACTIONS.STOP);
      expect(state.status).toBe(STATUS.PAUSED);
    });

    it('should advance index when advance is true', () => {
      const { result, store } = setup({ index: 1 });

      result.current.stop(true);

      expect(store.getSnapshot().index).toBe(2);
    });

    it('should not advance index when advance is false', () => {
      const { result, store } = setup({ index: 1 });

      result.current.stop();

      expect(store.getSnapshot().index).toBe(1);
    });

    it('should not update state when FINISHED', () => {
      const { result, store } = setup({ status: STATUS.FINISHED });

      result.current.stop();

      expect(store.getSnapshot().action).not.toBe(ACTIONS.STOP);
    });

    it('should not update state when SKIPPED', () => {
      const { result, store } = setup({ status: STATUS.SKIPPED });

      result.current.stop();

      expect(store.getSnapshot().action).not.toBe(ACTIONS.STOP);
    });
  });

  describe('info', () => {
    it('should return state without positioned, scrolling, and waiting', () => {
      const { result } = setup({ index: 1 });

      const info = result.current.info();

      expect(info).not.toHaveProperty('positioned');
      expect(info).not.toHaveProperty('scrolling');
      expect(info).not.toHaveProperty('waiting');
      expect(info).toHaveProperty('index', 1);
      expect(info).toHaveProperty('status', STATUS.RUNNING);
    });
  });
});
