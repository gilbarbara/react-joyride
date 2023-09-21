import is from 'is-lite';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';

import { AnyObject, State, Status, Step, StoreHelpers, StoreOptions } from '~/types';

import { hasValidKeys } from './helpers';

const defaultState: State = {
  action: 'init',
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  size: 0,
  status: STATUS.IDLE,
};

type StateWithContinuous = State & { continuous: boolean };

const validKeys = ['action', 'index', 'lifecycle', 'status'];

type Listener = (state: State) => void;

class Store {
  private data: Map<string, any> = new Map();
  private listener: Listener | null;
  private store: Map<string, any> = new Map();

  constructor(options?: StoreOptions) {
    const { continuous = false, stepIndex, steps = [] } = options ?? {};

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

    this.listener = null;
    this.setSteps(steps);
  }

  public getState(): State {
    if (!this.store.size) {
      return { ...defaultState };
    }

    return {
      action: this.store.get('action') || '',
      controlled: this.store.get('controlled') || false,
      index: parseInt(this.store.get('index'), 10),
      lifecycle: this.store.get('lifecycle') || '',
      size: this.store.get('size') || 0,
      status: (this.store.get('status') as Status) || '',
    };
  }

  private getNextState(state: Partial<State>, force: boolean = false): State {
    const { action, controlled, index, size, status } = this.getState();
    const newIndex = is.number(state.index) ? state.index : index;
    const nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);

    return {
      action: state.action ?? action,
      controlled,
      index: nextIndex,
      lifecycle: state.lifecycle ?? LIFECYCLE.INIT,
      size: state.size ?? size,
      status: nextIndex === size ? STATUS.FINISHED : state.status ?? status,
    };
  }

  private getSteps(): Array<Step> {
    const steps = this.data.get('steps');

    return Array.isArray(steps) ? steps : [];
  }

  private hasUpdatedState(oldState: State): boolean {
    const before = JSON.stringify(oldState);
    const after = JSON.stringify(this.getState());

    return before !== after;
  }

  private setState(nextState: Partial<StateWithContinuous>, initial: boolean = false) {
    const state = this.getState();

    const { action, index, lifecycle, size, status } = {
      ...state,
      ...nextState,
    };

    this.store.set('action', action);
    this.store.set('index', index);
    this.store.set('lifecycle', lifecycle);
    this.store.set('size', size);
    this.store.set('status', status);

    if (initial) {
      this.store.set('controlled', nextState.controlled);
      this.store.set('continuous', nextState.continuous);
    }

    /* istanbul ignore else */
    if (this.listener && this.hasUpdatedState(state)) {
      this.listener(this.getState());
    }
  }

  public addListener = (listener: Listener) => {
    this.listener = listener;
  };

  public setSteps = (steps: Array<AnyObject>) => {
    const { size, status } = this.getState();
    const state = {
      size: steps.length,
      status,
    };

    this.data.set('steps', steps);

    if (status === STATUS.WAITING && !size && steps.length) {
      state.status = STATUS.RUNNING;
    }

    this.setState(state);
  };

  public getHelpers(): StoreHelpers {
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

  public close = () => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.setState({
      ...this.getNextState({ action: ACTIONS.CLOSE, index: index + 1 }),
    });
  };

  public go = (nextIndex: number) => {
    const { controlled, status } = this.getState();

    if (controlled || status !== STATUS.RUNNING) {
      return;
    }

    const step = this.getSteps()[nextIndex];

    this.setState({
      ...this.getNextState({ action: ACTIONS.GO, index: nextIndex }),
      status: step ? status : STATUS.FINISHED,
    });
  };

  public info = (): AnyObject => this.getState();

  public next = () => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.setState(this.getNextState({ action: ACTIONS.NEXT, index: index + 1 }));
  };

  public open = () => {
    const { status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.setState({
      ...this.getNextState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP }),
    });
  };

  public prev = () => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.setState({
      ...this.getNextState({ action: ACTIONS.PREV, index: index - 1 }),
    });
  };

  public reset = (restart = false) => {
    const { controlled } = this.getState();

    if (controlled) {
      return;
    }

    this.setState({
      ...this.getNextState({ action: ACTIONS.RESET, index: 0 }),
      status: restart ? STATUS.RUNNING : STATUS.READY,
    });
  };

  public skip = () => {
    const { status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.setState({
      action: ACTIONS.SKIP,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.SKIPPED,
    });
  };

  public start = (nextIndex?: number) => {
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

  public stop = (advance = false) => {
    const { index, status } = this.getState();

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      return;
    }

    this.setState({
      ...this.getNextState({ action: ACTIONS.STOP, index: index + (advance ? 1 : 0) }),
      status: STATUS.PAUSED,
    });
  };

  public update = (state: Partial<State>) => {
    if (!hasValidKeys(state, validKeys)) {
      throw new Error(`State is not valid. Valid keys: ${validKeys.join(', ')}`);
    }

    this.setState({
      ...this.getNextState(
        {
          ...this.getState(),
          ...state,
          action: state.action ?? ACTIONS.UPDATE,
        },
        true,
      ),
    });
  };
}

export default function createStore(options?: StoreOptions) {
  return new Store(options);
}
