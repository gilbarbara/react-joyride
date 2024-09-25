import { Props as FloaterProps } from 'react-floater';
import deepEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import { getMergedStep } from '~/modules/step';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';

import { Origin, Props, State, Status, Step, StoreHelpers } from '~/types';

type StateWithContinuous = State & { continuous: boolean };
type Listener = (state: State) => void;
type PopperData = Parameters<NonNullable<FloaterProps['getPopper']>>[0];

const defaultState: State = {
  action: 'init',
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  origin: null,
  size: 0,
  status: STATUS.IDLE,
};

class Store {
  private beaconPopper: PopperData | null;
  private tooltipPopper: PopperData | null;
  private readonly data: Map<string, any> = new Map();
  private listener: Listener | null;
  private readonly props: Props;
  private readonly store: Map<string, any> = new Map();

  constructor(options?: Props) {
    const { continuous = false, stepIndex, steps = [] } = options ?? {};

    this.setState(
      {
        action: ACTIONS.INIT,
        controlled: is.number(stepIndex),
        continuous,
        index: is.number(stepIndex) ? stepIndex : 0,
        lifecycle: LIFECYCLE.INIT,
        origin: null,
        status: steps.length ? STATUS.READY : STATUS.IDLE,
      },
      true,
    );

    this.setSteps(steps);
    this.beaconPopper = null;
    this.tooltipPopper = null;
    this.listener = null;
    this.props = options ?? { steps: [] };
  }

  private getStep(nextIndex?: number): Step | null {
    const steps = this.data.get('steps');
    const { index } = this.getState();

    return getMergedStep(this.props, steps[nextIndex ?? index]);
  }

  private getUpdatedIndex(nextIndex: number): number {
    const { size } = this.getState();

    return Math.min(Math.max(nextIndex, 0), size);
  }

  private hasUpdatedState(oldState: State): boolean {
    return !deepEqual(oldState, this.getState());
  }

  private prepareState(patch: Partial<State>, forceIndex: boolean = false): State {
    const { action, controlled, index, size, status } = this.getState();
    const newIndex = patch.index ?? index;

    return {
      action: patch.action ?? action,
      controlled,
      index: controlled && !forceIndex ? index : newIndex,
      lifecycle: patch.lifecycle ?? LIFECYCLE.INIT,
      origin: patch.origin ?? null,
      size: patch.size ?? size,
      status: patch.status ?? status,
    };
  }

  private setState(patch: Partial<StateWithContinuous>, initial: boolean = false) {
    const state = this.getState();

    const {
      action,
      index,
      lifecycle,
      origin = null,
      size,
      status,
    } = {
      ...state,
      ...patch,
    };

    this.store.set('action', action);
    this.store.set('index', index);
    this.store.set('lifecycle', lifecycle);
    this.store.set('origin', origin);
    this.store.set('size', size);
    this.store.set('status', status);

    if (initial) {
      this.store.set('controlled', patch.controlled);
      this.store.set('continuous', patch.continuous);
    }

    if (this.listener && this.hasUpdatedState(state)) {
      this.listener(this.getState());
    }
  }

  public updateState = (patch: Partial<State>, forceIndex = false) => {
    this.setState({
      ...this.getState(),
      ...this.prepareState(patch, forceIndex),
    });
  };

  public cleanupPoppers = () => {
    this.beaconPopper = null;
    this.tooltipPopper = null;
  };

  public getPopper = (name: 'beacon' | 'tooltip'): PopperData | null => {
    if (name === 'beacon') {
      return this.beaconPopper;
    }

    return this.tooltipPopper;
  };

  public setPopper: NonNullable<FloaterProps['getPopper']> = (popper, type) => {
    if (type === 'wrapper') {
      this.beaconPopper = popper;
    } else {
      this.tooltipPopper = popper;
    }

    if (popper && this.store.get('lifecycle') === LIFECYCLE.COMPLETE) {
      this.updateState({
        action: ACTIONS.UPDATE,
        lifecycle: LIFECYCLE.INIT,
      });
    }

    const getPopper = this.getStep()?.floaterProps?.getPopper;

    if (getPopper) {
      getPopper(popper, type);
    }
  };

  public addListener = (listener: Listener) => {
    this.listener = listener;
  };

  public getState(): State {
    if (!this?.store?.size) {
      return { ...defaultState };
    }

    return {
      action: this.store.get('action') || '',
      controlled: this.store.get('controlled') || false,
      index: parseInt(this.store.get('index'), 10),
      lifecycle: this.store.get('lifecycle') || '',
      origin: this.store.get('origin') || null,
      size: this.store.get('size') || 0,
      status: (this.store.get('status') as Status) || '',
    };
  }

  public setSteps = (steps: Array<Step>) => {
    const { size, status } = this.getState();
    const state = {
      size: steps.length,
      status,
    };

    this.data.set('steps', steps);

    if (status === STATUS.WAITING && !size && steps.length) {
      state.status = STATUS.RUNNING;
    }

    this.updateState(state);
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

  public close = (origin: Origin | null = null) => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.CLOSE,
      index: index + 1,
      origin,
      lifecycle: LIFECYCLE.COMPLETE,
    });
  };

  public go = (nextIndex: number) => {
    const { controlled, status } = this.getState();

    if (controlled || status !== STATUS.RUNNING) {
      return;
    }

    const step = this.getStep(nextIndex);

    this.updateState({
      action: ACTIONS.GO,
      index: nextIndex,
      lifecycle: LIFECYCLE.COMPLETE,
      status: step ? status : STATUS.FINISHED,
    });
  };

  public info = (): State => this.getState();

  public next = () => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.NEXT,
      index: this.getUpdatedIndex(index + 1),
      lifecycle: LIFECYCLE.COMPLETE,
    });
  };

  public open = () => {
    const { status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP });
  };

  public prev = () => {
    const { index, status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.PREV,
      index: this.getUpdatedIndex(index - 1),
      lifecycle: LIFECYCLE.COMPLETE,
    });
  };

  public reset = (restart = false) => {
    const { controlled } = this.getState();

    if (controlled) {
      return;
    }

    this.updateState({
      action: ACTIONS.RESET,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      status: restart ? STATUS.RUNNING : STATUS.READY,
    });
  };

  public skip = () => {
    const { status } = this.getState();

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.SKIP,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.SKIPPED,
    });
  };

  public start = (nextIndex?: number) => {
    const { index, size } = this.getState();

    this.updateState(
      {
        action: ACTIONS.START,
        index: is.number(nextIndex) ? nextIndex : index,
        status: size ? STATUS.RUNNING : STATUS.WAITING,
      },
      true,
    );
  };

  public stop = (advance = false) => {
    const { index, status } = this.getState();

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      return;
    }

    this.updateState({
      action: ACTIONS.STOP,
      index: index + (advance ? 1 : 0),
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.PAUSED,
    });
  };
}

export type StoreInstance = ReturnType<typeof createStore>;

export default function createStore(options?: Props) {
  return new Store(options);
}
