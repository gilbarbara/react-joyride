// @flow
import is from 'is-lite';
import STATUS from '../constants/status';
import ACTIONS from '../constants/actions';
import LIFECYCLE from '../constants/lifecycle';

import { hasValidKeys } from './helpers';

import type { StateHelpers, StateInstance, StateObject } from '../config/types';

const defaultState: StateObject = {
  action: '',
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  size: 0,
  status: STATUS.IDLE,
};

const validKeys = ['action', 'index', 'lifecycle', 'status'];

export default function createStore(props: StateObject): StateInstance {
  const store: Map<string, any> = new Map();
  const data: Map<string, any> = new Map();

  class Store {
    listener: Function;

    constructor({ continuous = false, stepIndex, steps = [] }: Object = {}) {
      this.setState({
        action: ACTIONS.INIT,
        controlled: is.number(stepIndex),
        continuous,
        index: is.number(stepIndex) ? stepIndex : 0,
        lifecycle: LIFECYCLE.INIT,
        status: steps.length ? STATUS.READY : STATUS.IDLE,
      }, true);

      this.setSteps(steps);
    }

    addListener(listener: Function) {
      this.listener = listener;
    }

    setState(nextState: Object, initial: boolean = false) {
      const state = this.getState();

      const { action, index, lifecycle, status } = {
        ...state,
        ...nextState,
      };

      store.set('action', action);
      store.set('index', index);
      store.set('lifecycle', lifecycle);
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

    getState(): Object {
      if (!store.size) {
        return { ...defaultState };
      }

      const index = parseInt(store.get('index'), 10);
      const steps = this.getSteps();
      const size = steps.length;

      return {
        action: store.get('action'),
        controlled: store.get('controlled'),
        index,
        lifecycle: store.get('lifecycle'),
        size,
        status: store.get('status'),
      };
    }

    getNextState(state: StateObject, force: ?boolean = false): Object {
      const { action, controlled, index, size, status } = this.getState();
      const newIndex = is.number(state.index) ? state.index : index;
      const nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);

      return {
        action: state.action || action,
        index: nextIndex,
        lifecycle: state.lifecycle || LIFECYCLE.INIT,
        status: nextIndex === size ? STATUS.FINISHED : (state.status || status),
      };
    }

    hasUpdatedState(oldState: StateObject): boolean {
      const before = JSON.stringify(oldState);
      const after = JSON.stringify(this.getState());

      return before !== after;
    }

    setSteps = (steps: Array<Object>) => {
      const { size, status } = this.getState();
      data.set('steps', steps);

      if (status === STATUS.WAITING && !size && steps.length) {
        this.setState({ status: STATUS.RUNNING });
      }
    };

    getSteps(): Array<Object> {
      const steps = data.get('steps');

      return Array.isArray(steps) ? steps : [];
    }

    getHelpers(): StateHelpers {
      return {
        start: this.start,
        stop: this.stop,
        restart: this.restart,
        reset: this.reset,
        prev: this.prev,
        next: this.next,
        go: this.go,
        index: this.index,
        close: this.close,
        skip: this.skip,
        info: this.info,
      };
    }

    update = (state: StateObject) => {
      if (!hasValidKeys(state, validKeys)) {
        throw new Error('state is not valid');
      }

      this.setState({
        ...this.getNextState({
          ...this.getState(),
          ...state,
          action: state.action || ACTIONS.UPDATE,
        }, true),
      });
    };

    steps = (nextSteps) => {
      if (!is.array(nextSteps)) return;

      this.setSteps(nextSteps);
    };

    start = (nextIndex: number) => {
      const { index, size } = this.getState();

      this.setState({
        ...this.getNextState({
          action: ACTIONS.START,
          index: is.number(nextIndex) ? nextIndex : index,
        }, true),
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

    restart = () => {
      const { controlled } = this.getState();
      if (controlled) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.RESTART, index: 0 }),
        status: STATUS.RUNNING,
      });
    };

    reset = () => {
      const { controlled } = this.getState();
      if (controlled) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.RESET, index: 0 }),
        status: STATUS.READY,
      });
    };

    prev = () => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.PREV, index: index - 1 }),
      });
    };

    next = () => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState(this.getNextState({ action: ACTIONS.NEXT, index: index + 1 }));
    };

    go = (number) => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.GO, index: index + number }),
      });
    };

    index = (nextIndex) => {
      const { status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      const step = this.getSteps()[nextIndex];

      this.setState({
        ...this.getNextState({ action: ACTIONS.INDEX, index: nextIndex }),
        status: step ? status : STATUS.FINISHED,
      });
    };

    close = () => {
      const { index, status } = this.getState();
      if (status !== STATUS.RUNNING) return;

      this.setState({
        ...this.getNextState({ action: ACTIONS.CLOSE, index: index + 1 }),
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

    info = (): Object => this.getState()
  }

  return new Store(props);
}
