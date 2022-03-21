// @flow
import is from 'is-lite';
import { ACTIONS, LIFECYCLE, STATUS } from '../constants';

import { hasValidKeys } from './helpers';

const defaultState: StoreState = {
  action: '',
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  size: 0,
  status: STATUS.IDLE,
};

const validKeys = ['action', 'index', 'lifecycle', 'status'];

export default function createStore(props: StoreState): StoreInstance {
  const store: Map<string, any> = new Map();
  const data: Map<string, any> = new Map();

  class Store {
    listener: Function;

    constructor({ continuous = false, stepIndex, steps = [] }: Object = {}) {
      this.setState(
        {
          action: ACTIONS.INIT,
          controlled: is.number(stepIndex),
          continuous,
          index: is.number(stepIndex) ? stepIndex : 0,
          lifecycle: LIFECYCLE.INIT,
          status: steps.length ? STATUS.READY : STATUS.IDLE,
        },
        true,
      );

      this.setSteps(steps);
    }

    setState(nextState: Object, initial: boolean = false) {
      const state = this.getState();

      const { action, index, lifecycle, size, status } = {
        ...state,
        ...nextState,
      };

      store.set('action', action);
      store.set('index', index);
      store.set('lifecycle', lifecycle);
      store.set('size', size);
      store.set('status', status);

      if (initial) {
        store.set('controlled', nextState.controlled);
        store.set('continuous', nextState.continuous);
      }

      /* istanbul ignore else */
      if (this.listener && this.hasUpdatedState(state)) {
        // console.log('▶ ▶ ▶ NEW STATE', this.getState());
        this.listener(this.getState());
      }
    }

    getState(): StoreState {
      if (!store.size) {
        return { ...defaultState };
      }

      return {
        action: store.get('action') || '',
        controlled: store.get('controlled') || false,
        index: parseInt(store.get('index'), 10),
        lifecycle: store.get('lifecycle') || '',
        size: store.get('size') || 0,
        status: store.get('status') || '',
      };
    }

    getNextState(state: Object, force: ?boolean = false): StoreState {
      const { action, controlled, index, size, status } = this.getState();
      const newIndex = is.number(state.index) ? state.index : index;
      const nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);

      return {
        action: state.action || action,
        controlled,
        index: nextIndex,
        lifecycle: state.lifecycle || LIFECYCLE.INIT,
        size: state.size || size,
        status: nextIndex === size ? STATUS.FINISHED : state.status || status,
      };
    }

    hasUpdatedState(oldState: StoreState): boolean {
      const before = JSON.stringify(oldState);
      const after = JSON.stringify(this.getState());

      return before !== after;
    }

    getSteps(): Array<Object> {
      const steps = data.get('steps');

      return Array.isArray(steps) ? steps : [];
    }

    getHelpers(): StoreHelpers {
      return {
        close: this.close,
        go: this.go,
        info: this.info,
        next: this.next,
        open: this.open,
        prev: this.prev,
        reset: this.reset,
        skip: this.skip,
      };
    }

    setSteps = (steps: Array<Object>) => {
      const { size, status } = this.getState();
      const state = {
        size: steps.length,
        status,
      };

      data.set('steps', steps);

      if (status === STATUS.WAITING && !size && steps.length) {
        state.status = STATUS.RUNNING;
      }

      this.setState(state);
    };

    addListener = (listener: Function) => {
      this.listener = listener;
    };

    update = (state: StoreState) => {
      if (!hasValidKeys(state, validKeys)) {
        throw new Error(`State is not valid. Valid keys: ${validKeys.join(', ')}`);
      }

      this.setState({
        ...this.getNextState(
          {
            ...this.getState(),
            ...state,
            action: state.action || ACTIONS.UPDATE,
          },
          true,
        ),
      });
    };

    start = (nextIndex: number) => {
      const { index, size } = this.getState();

      this.setState({
        ...this.getNextState(
          {
            action: ACTIONS.START,
            index: is.number(nextIndex) ? nextIndex : index,
          },
          true,
        ),
        status: size ? STATUS.RUNNING : STATUS.WAITING,
      });
    };

    stop = (advance = false) => {
      const { index, status } = this.getState();

      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.STOP, index: index + (advance ? 1 : 0) }),
        status: STATUS.PAUSED,
      });
    };

    close = () => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.CLOSE, index: index + 1 }),
      });
    };

    go = nextIndex => {
      const { controlled, status } = this.getState();
      if (controlled || status !== STATUS.RUNNING) return;

      const step = this.getSteps()[nextIndex];

      this.setState({
        ...this.getNextState({ action: ACTIONS.GO, index: nextIndex }),
        status: step ? status : STATUS.FINISHED,
      });
    };

    info = () => this.getState();

    next = () => {
      const { index, status } = this.getState();

      if (status !== STATUS.RUNNING) return;

      this.setState(this.getNextState({ action: ACTIONS.NEXT, index: index + 1 }));
    };

    open = () => {
      const { status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP }),
      });
    };

    prev = () => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.PREV, index: index - 1 }),
      });
    };

    reset = (restart = false) => {
      const { controlled } = this.getState();
      if (controlled) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.RESET, index: 0 }),
        status: restart ? STATUS.RUNNING : STATUS.READY,
      });
    };

    skip = () => {
      const { status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        action: ACTIONS.SKIP,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.SKIPPED,
      });
    };
  }

  return new Store(props);
}
