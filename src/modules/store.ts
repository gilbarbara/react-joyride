import deepEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { logDebug, omit } from '~/modules/helpers';
import { getMergedStep } from '~/modules/step';

import {
  Origin,
  PositionData,
  Props,
  State,
  Status,
  Step,
  StepMerged,
  StoreHelpers,
  StoreState,
} from '~/types';

type Listener = (state: StoreState) => void;

class Store {
  private beaconPosition: PositionData | null = null;
  private readonly listeners: Set<Listener> = new Set();
  private readonly props: Props;
  private snapshot: StoreState;
  private state: StoreState;
  private steps: Array<Step>;
  private tooltipPosition: PositionData | null = null;

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
      scrolling: false,
      size: steps.length,
      status: steps.length ? STATUS.READY : STATUS.IDLE,
      waiting: false,
    };
    this.snapshot = Object.freeze({ ...this.state });
  }

  private applyTransitions(draft: StoreState): StoreState {
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

  public cleanupPositionData = () => {
    this.beaconPosition = null;
    this.tooltipPosition = null;
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
      scrolling: false,
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

  public getPositionData = (name: 'beacon' | 'tooltip'): PositionData | null => {
    if (name === 'beacon') {
      return this.beaconPosition;
    }

    return this.tooltipPosition;
  };

  public getServerSnapshot = (): StoreState => this.snapshot;

  public getSnapshot = (): StoreState => this.snapshot;

  public getState = (): State => omit(this.snapshot, 'scrolling', 'waiting');

  public go = (nextIndex: number) => {
    const { controlled, status } = this.state;

    if (controlled) {
      logDebug({
        title: 'go() is not supported in controlled mode',
        debug: this.props.debug,
        warn: true,
      });

      return;
    }

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.GO,
      index: nextIndex,
      lifecycle: LIFECYCLE.COMPLETE,
      scrolling: false,
      status: nextIndex < this.steps.length ? status : STATUS.FINISHED,
    });
  };

  public info = (): State => omit(this.snapshot, 'scrolling', 'waiting');

  public next = () => {
    const { index, status } = this.state;

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.NEXT,
      index: this.getUpdatedIndex(index + 1),
      lifecycle: LIFECYCLE.COMPLETE,
      scrolling: false,
    });
  };

  public open = () => {
    const { status } = this.state;

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({ action: ACTIONS.UPDATE, lifecycle: LIFECYCLE.TOOLTIP, scrolling: false });
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
      scrolling: false,
    });
  };

  public reset = (restart = false) => {
    const { controlled } = this.state;

    if (controlled) {
      logDebug({
        title: 'reset() is not supported in controlled mode',
        debug: this.props.debug,
        warn: true,
      });

      return;
    }

    this.updateState({
      action: ACTIONS.RESET,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      scrolling: false,
      status: restart ? STATUS.RUNNING : STATUS.READY,
    });
  };

  public setPositionData = (name: 'beacon' | 'tooltip', data: PositionData) => {
    if (name === 'beacon') {
      this.beaconPosition = data;
    } else {
      this.tooltipPosition = data;
    }

    const onPosition = this.getStep()?.floatingOptions?.onPosition;

    if (onPosition) {
      onPosition(data);
    }
  };

  public setSteps = (steps: Array<Step>) => {
    this.steps = steps;

    this.updateState({ size: steps.length });
  };

  public skip = (origin: Extract<Origin, 'button_close' | 'button_skip'> = 'button_skip') => {
    const { status } = this.state;

    if (status !== STATUS.RUNNING) {
      return;
    }

    this.updateState({
      action: ACTIONS.SKIP,
      lifecycle: LIFECYCLE.COMPLETE,
      origin,
      scrolling: false,
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
        scrolling: false,
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
      scrolling: false,
      status: STATUS.PAUSED,
    });
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  public updateState = (patch: Partial<StoreState>, forceIndex = false) => {
    const { controlled, index } = this.state;
    const previousSnapshot = this.snapshot;

    const resolvedIndex =
      controlled && !forceIndex && patch.index !== undefined ? index : (patch.index ?? index);

    const merged: StoreState = {
      action: patch.action ?? this.state.action,
      controlled,
      index: resolvedIndex,
      lifecycle: patch.lifecycle ?? this.state.lifecycle,
      origin: patch.origin ?? null,
      scrolling: patch.scrolling ?? this.state.scrolling,
      size: patch.size ?? this.state.size,
      status: patch.status ?? this.state.status,
      waiting: patch.waiting ?? this.state.waiting,
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
