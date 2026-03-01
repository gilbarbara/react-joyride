import { LIFECYCLE, STATUS } from '~/literals';
import createStore from '~/modules/store';

import { standardSteps } from '../__fixtures__/steps';

const mockSyncStore = vi.fn();

describe('store', () => {
  beforeEach(() => {
    mockSyncStore.mockClear();
  });

  describe('without initial values', () => {
    const store = createStore();

    const { close, go, info, next, open, prev, reset, setSteps, start, stop, updateState } = store;

    it('should have initiated a new store', () => {
      expect(store.constructor.name).toBe('Store');

      expect(info()).toMatchSnapshot();
    });

    it("shouldn't be able to start without steps", () => {
      start();

      expect(info()).toMatchSnapshot();
    });

    it('should ignore all back/forward methods', () => {
      const initialStore = info();

      next();
      expect(info()).toEqual(initialStore);

      prev();
      expect(info()).toEqual(initialStore);

      go(2);
      expect(info()).toEqual(initialStore);
    });

    it('should be able to add steps', () => {
      setSteps(standardSteps);

      expect(info()).toMatchSnapshot();
    });

    it('should handle "prev" but no changes [1st step]', () => {
      prev();

      expect(info()).toMatchSnapshot();
    });

    it(`should handle "update" the lifecycle to ${LIFECYCLE.BEACON}`, () => {
      updateState({ lifecycle: LIFECYCLE.BEACON });

      expect(info()).toMatchSnapshot();
    });

    it(`should handle "update" the lifecycle to ${LIFECYCLE.TOOLTIP}`, () => {
      updateState({ lifecycle: LIFECYCLE.TOOLTIP });

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" [2nd step]', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "prev" [1st step]', () => {
      prev();

      expect(info()).toMatchSnapshot();
    });

    it('should handle `stop`', () => {
      stop();

      expect(info()).toMatchSnapshot();
    });

    it('should handle `start` [1st step]', () => {
      start();

      expect(info()).toMatchSnapshot();
    });

    it('should handle `stop` again but with `advance`', () => {
      stop(true);

      expect(info()).toMatchSnapshot();
    });

    it('should handle `start` [2nd step]', () => {
      start();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" [3rd step]', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" [4th step]', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" [5th step]', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it(`should handle "update" the lifecycle to ${LIFECYCLE.BEACON}`, () => {
      updateState({ lifecycle: LIFECYCLE.BEACON });

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" again but the tour has finished', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "next" past the last step', () => {
      next();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "reset"', () => {
      reset();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "reset" to restart', () => {
      reset(true);

      expect(info()).toMatchSnapshot();
    });

    it('should handle "start" with custom index and lifecycle', () => {
      start(2);

      expect(info()).toMatchSnapshot();
    });

    it('should handle "go" [2nd step]', () => {
      go(2);

      expect(info()).toMatchSnapshot();
    });

    it('should handle "go" [3rd step]', () => {
      go(1);

      expect(info()).toMatchSnapshot();
    });

    it('should handle "close"', () => {
      close();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "close" with origin "overlay"', () => {
      close('overlay');

      expect(info()).toMatchSnapshot();
    });

    it('should handle "close" with origin "keyboard', () => {
      close('keyboard');

      expect(info()).toMatchSnapshot();
    });

    it('should handle "open"', () => {
      open();

      expect(info()).toMatchSnapshot();
    });

    it('should handle "go" with a number higher that the steps length and finish the tour', () => {
      go(10);

      expect(info()).toMatchSnapshot();
    });
  });

  describe('with initial steps', () => {
    const store = createStore({ run: false, steps: standardSteps });

    const { info, updateState } = store;

    it('should have initiated a new store', () => {
      expect(store.constructor.name).toBe('Store');

      expect(info()).toMatchSnapshot();
    });

    it('should handle subscribe and notify on changes', () => {
      const unsubscribe = store.subscribe(mockSyncStore);

      updateState({ status: STATUS.FINISHED });
      updateState({ status: STATUS.FINISHED });
      expect(mockSyncStore).toHaveBeenCalledTimes(1);

      updateState({ status: STATUS.IDLE });
      updateState({ status: STATUS.READY });

      expect(mockSyncStore).toHaveBeenCalledTimes(3);

      unsubscribe();
      updateState({ status: STATUS.IDLE });
      expect(mockSyncStore).toHaveBeenCalledTimes(3);
    });

    it('should return stable snapshot reference when state has not changed', () => {
      const snapshot1 = store.getSnapshot();
      const snapshot2 = store.getSnapshot();

      expect(snapshot1).toBe(snapshot2);

      updateState({ status: STATUS.FINISHED });

      const snapshot3 = store.getSnapshot();

      expect(snapshot3).not.toBe(snapshot1);
    });
  });

  describe('with initialStepIndex', () => {
    it('should start at the specified index', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 2 });
      const state = store.info();

      expect(state.index).toBe(2);
      expect(state.controlled).toBe(false);
    });

    it('should keep the index after start()', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 2 });

      store.start();

      expect(store.info().index).toBe(2);
    });

    it('should reset to 0', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 2 });

      store.start();
      store.reset();

      expect(store.info().index).toBe(0);
    });

    it('should fall back to 0 when out of bounds', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const store = createStore({ steps: standardSteps, initialStepIndex: 99 });

      expect(store.info().index).toBe(0);
      expect(warnSpy).toHaveBeenCalledWith('react-joyride: initialStepIndex is out of bounds');

      warnSpy.mockRestore();
    });

    it('should fall back to 0 when negative', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const store = createStore({ steps: standardSteps, initialStepIndex: -1 });

      expect(store.info().index).toBe(0);
      expect(warnSpy).toHaveBeenCalledWith('react-joyride: initialStepIndex is out of bounds');

      warnSpy.mockRestore();
    });

    it('should treat 0 the same as omitting it', () => {
      const store = createStore({ steps: standardSteps, initialStepIndex: 0 });

      expect(store.info().index).toBe(0);
    });

    it('should be ignored in controlled mode', () => {
      const store = createStore({
        debug: true,
        steps: standardSteps,
        stepIndex: 0,
        initialStepIndex: 2,
      });

      expect(store.info().index).toBe(0);
      expect(store.info().controlled).toBe(true);
    });
  });

  describe('with position data', () => {
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
