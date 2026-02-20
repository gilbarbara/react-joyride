import { fromPartial } from '@total-typescript/shoehorn';

import createStore from '~/modules/store';

import { LIFECYCLE, STATUS } from '~/literals';

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

    it('should handle "next" again but there\'s no change to the store', () => {
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

    it('should handle listeners', () => {
      store.addListener(mockSyncStore);

      updateState({ status: STATUS.FINISHED });
      updateState({ status: STATUS.FINISHED });
      expect(mockSyncStore).toHaveBeenCalledTimes(1);

      updateState({ status: STATUS.IDLE });
      updateState({ status: STATUS.READY });

      expect(mockSyncStore).toHaveBeenCalledTimes(3);
    });
  });

  describe('with popper', () => {
    const store = createStore();
    const popperData = { state: { placement: 'top' } } as const;

    it('should set/get both poppers', () => {
      store.setPopper(fromPartial(popperData), 'wrapper');
      expect(store.getPopper('beacon')).toEqual(popperData);

      store.setPopper(fromPartial(popperData), 'floater');
      expect(store.getPopper('tooltip')).toEqual(popperData);
    });

    it('should clear both poppers', () => {
      expect(store.getPopper('beacon')).toEqual(popperData);
      expect(store.getPopper('tooltip')).toEqual(popperData);

      store.cleanupPoppers();
      expect(store.getPopper('beacon')).toBeNull();
      expect(store.getPopper('tooltip')).toBeNull();
    });
  });
});
