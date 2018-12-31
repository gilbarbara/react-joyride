import createStore from '../../src/modules/store';

import ACTIONS from '../../src/constants/actions';
import LIFECYCLE from '../../src/constants/lifecycle';
import STATUS from '../../src/constants/status';

import stepsData from '../__fixtures__/steps';

const mockSyncStore = jest.fn();

describe('store', () => {
  beforeEach(() => {
    mockSyncStore.mockClear();
  });

  describe('without initial values', () => {
    const store = createStore();

    const {
      go,
      info,
      next,
      prev,
      reset,
      setSteps,
      start,
      stop,
      update,
    } = store;

    it('should have initiated a new store', () => {
      expect(store.constructor.name).toBe('Store');

      expect(info()).toEqual({
        action: ACTIONS.INIT,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: 0,
        status: STATUS.IDLE,
      });
    });

    it('shouldn\'t be able to start without steps', () => {
      start();

      expect(info()).toEqual({
        action: ACTIONS.START,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: 0,
        status: STATUS.WAITING,
      });
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
      setSteps(stepsData);

      expect(info()).toEqual({
        action: ACTIONS.START,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call prev but no changes [1st step]', () => {
      prev();
      expect(info()).toEqual({
        action: ACTIONS.PREV,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it(`should be able to update lifecycle to ${LIFECYCLE.BEACON}`, () => {
      update({ lifecycle: LIFECYCLE.BEACON });

      expect(info()).toEqual({
        action: ACTIONS.UPDATE,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.BEACON,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it(`should be able to update lifecycle to ${LIFECYCLE.TOOLTIP}`, () => {
      update({ lifecycle: LIFECYCLE.TOOLTIP });

      expect(info()).toEqual({
        action: ACTIONS.UPDATE,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call next [2nd step]', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call prev [1st step]', () => {
      prev();
      expect(info()).toEqual({
        action: ACTIONS.PREV,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call stop', () => {
      stop();
      expect(info()).toEqual({
        action: ACTIONS.STOP,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.PAUSED,
      });
    });

    it('should be able to call start [1st step]', () => {
      start();
      expect(info()).toEqual({
        action: ACTIONS.START,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call stop again but with `advance`', () => {
      stop(true);
      expect(info()).toEqual({
        action: ACTIONS.STOP,
        controlled: false,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.PAUSED,
      });
    });


    it('should be able to call start [2nd step]', () => {
      start();
      expect(info()).toEqual({
        action: ACTIONS.START,
        controlled: false,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call next [3rd step]', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call next [4th step]', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 3,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call next [5th step]', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 4,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it(`should be able to update lifecycle to ${LIFECYCLE.BEACON}`, () => {
      update({ lifecycle: LIFECYCLE.BEACON });

      expect(info()).toEqual({
        action: ACTIONS.UPDATE,
        controlled: false,
        index: 4,
        lifecycle: LIFECYCLE.BEACON,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call next again but the tour has finished', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.FINISHED,
      });
    });

    it('should be able to call next again but there\'s no change to the store', () => {
      next();
      expect(info()).toEqual({
        action: ACTIONS.NEXT,
        controlled: false,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.FINISHED,
      });
    });

    it('should be able to call reset', () => {
      reset();

      expect(info()).toEqual({
        action: ACTIONS.RESET,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.READY,
      });
    });

    it('should be able to call reset to restart', () => {
      reset(true);

      expect(info()).toEqual({
        action: ACTIONS.RESET,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call start with custom index and lifecycle', () => {
      start(2);

      expect(info()).toEqual({
        action: ACTIONS.START,
        controlled: false,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call go [2nd step]', () => {
      go(2);

      expect(info()).toEqual({
        action: ACTIONS.GO,
        controlled: false,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call go [3rd step]', () => {
      go(1);

      expect(info()).toEqual({
        action: ACTIONS.GO,
        controlled: false,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.RUNNING,
      });
    });

    it('should be able to call go with a big number and finish the tour', () => {
      go(10);

      expect(info()).toEqual({
        action: ACTIONS.GO,
        controlled: false,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.FINISHED,
      });
    });
  });

  describe('with initial steps', () => {
    const store = createStore({ steps: stepsData });

    const {
      info,
      update,
    } = store;

    it('should have initiated a new store', () => {
      expect(store.constructor.name).toBe('Store');

      expect(info()).toEqual({
        action: ACTIONS.INIT,
        controlled: false,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        size: stepsData.length,
        status: STATUS.READY,
      });
    });

    it('should handle listeners', () => {
      store.addListener(mockSyncStore);

      update({ status: STATUS.READY });
      update({ status: STATUS.READY });
      expect(mockSyncStore).toHaveBeenCalledTimes(1);

      update({ status: STATUS.IDLE });
      update({ status: STATUS.READY });

      expect(mockSyncStore).toHaveBeenCalledTimes(3);
    });
  });

  describe('with controlled prop', () => {
    const store = createStore({ controlled: true });

    const {
      update,
    } = store;

    it('should throw an error if try to update the `controlled` prop', () => {
      expect(() => update({ controlled: false })).toThrow();
    });
  });
});
