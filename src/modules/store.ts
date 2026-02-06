import { Props as FloaterProps } from 'react-floater';
import deepEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { getMergedStep } from '~/modules/step';

import { Origin, Props, State, Status, Step, StepMerged, StoreHelpers } from '~/types';

type Listener = (state: State) => void;
type PopperData = Parameters<NonNullable<FloaterProps['getPopper']>>[0];

class Store {
  private beaconPopper: PopperData | null = null;
  private readonly listeners: Set<Listener> = new Set();
  private readonly props: Props;
  private snapshot: State;
  private state: State;
  private steps: Array<Step>;
  private tooltipPopper: PopperData | null = null;

  constructor(options?: Props) {
    const { stepIndex, steps = [] } = options ?? {};

    this.props = options ?? { steps: [] };
    this.steps = steps;
    this.state = {
      action: ACTIONS.INIT,
      controlled: is.number(stepIndex),
      index: is.number(stepIndex) ? stepIndex : 0,
      lifecycle: LIFECYCLE.INIT,
      origin: null,
      size: steps.length,
      status: steps.length ? STATUS.READY : STATUS.IDLE,
    };
    this.snapshot = Object.freeze({ ...this.state });
  }

  private applyTransitions(draft: State): State {
    if (draft.status === STATUS.WAITING && draft.size > 0) {
      return { ...draft, status: STATUS.RUNNING };
    }

    return draft;
  }

  private getStep(nextIndex?: number): StepMerged | null {
    return getMergedStep(this.props, this.steps[nextIndex ?? this.state.index]);
  }

  private getUpdatedIndex(nextIndex: number): number {
    return Math.min(Math.max(nextIndex, 0), this.state.size);
  }

  public cleanupPoppers = () => {
    this.beaconPopper = null;
    this.tooltipPopper = null;
  };

  public close = (origin: Origin | null = null) => {
    const { index, status } = this.state;

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

  public getPopper = (name: 'beacon' | 'tooltip'): PopperData | null => {
    if (name === 'beacon') {
      return this.beaconPopper;
    }

    return this.tooltipPopper;
  };

  public getServerSnapshot = (): State => this.snapshot;

  public getSnapshot = (): State => this.snapshot;

  public getState = (): State => this.snapshot;

  public go = (nextIndex: number) => {
    const { controlled, status } = this.state;

    if (controlled || status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.GO,
      index: nextIndex,
      lifecycle: LIFECYCLE.COMPLETE,
      status: nextIndex < this.steps.length ? status : STATUS.FINISHED,
    });
  };

  public info = (): State => this.snapshot;

  public next = () => {
    const { index, status } = this.state;

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
    const { status } = this.state;

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP });
  };

  public prev = () => {
    const { index, status } = this.state;

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
    const { controlled } = this.state;

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

  public setPopper: NonNullable<FloaterProps['getPopper']> = (popper, type) => {
    if (type === 'wrapper') {
      this.beaconPopper = popper;
    } else {
      this.tooltipPopper = popper;
    }

    if (popper && this.state.lifecycle === LIFECYCLE.COMPLETE) {
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

  public setSteps = (steps: Array<Step>) => {
    this.steps = steps;

    this.updateState({ size: steps.length });
  };

  public skip = () => {
    const { status } = this.state;

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
    const { index, size } = this.state;

    this.updateState(
      {
        action: ACTIONS.START,
        index: is.number(nextIndex) ? nextIndex : index,
        lifecycle: LIFECYCLE.INIT,
        status: size ? STATUS.RUNNING : STATUS.WAITING,
      },
      true,
    );
  };

  public stop = (advance = false) => {
    const { index, status } = this.state;

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

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  public updateState = (patch: Partial<State>, forceIndex = false) => {
    const { controlled, index } = this.state;
    const previousSnapshot = this.snapshot;

    const resolvedIndex =
      controlled && !forceIndex && patch.index !== undefined ? index : (patch.index ?? index);

    const merged: State = {
      action: patch.action ?? this.state.action,
      controlled,
      index: resolvedIndex,
      lifecycle: patch.lifecycle ?? this.state.lifecycle,
      origin: patch.origin ?? null,
      size: patch.size ?? this.state.size,
      status: patch.status ?? this.state.status,
    };

    const final = this.applyTransitions(merged);

    this.state = final;
    this.snapshot = Object.freeze({ ...final });

    if (!deepEqual(previousSnapshot, this.snapshot)) {
      for (const listener of this.listeners) {
        listener(this.snapshot);
      }
    }
  };
}

export default function createStore(options?: Props) {
  return new Store(options);
}
