import deepEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { logDebug, omit } from '~/modules/helpers';
import { getMergedStep } from '~/modules/step';

import type { PositionData, Props, State, Step, StepMerged, StoreState } from '~/types';

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
    const { initialStepIndex, stepIndex, steps = [] } = options ?? {};
    const isControlled = is.number(stepIndex);

    let startIndex = 0;

    if (isControlled) {
      startIndex = stepIndex;

      if (is.number(initialStepIndex)) {
        logDebug({
          title: 'initialStepIndex is ignored in controlled mode',
          debug: options?.debug,
          warn: true,
        });
      }
    } else if (is.number(initialStepIndex)) {
      if (initialStepIndex >= 0 && initialStepIndex < steps.length) {
        startIndex = initialStepIndex;
      } else if (steps.length > 0) {
        // eslint-disable-next-line no-console
        console.warn('react-joyride: initialStepIndex is out of bounds');
      }
    }

    this.props = options ?? { steps: [] };
    this.steps = steps;
    this.state = {
      action: ACTIONS.INIT,
      controlled: isControlled,
      index: startIndex,
      lifecycle: LIFECYCLE.INIT,
      origin: null,
      positioned: false,
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

  public cleanupPositionData = () => {
    this.beaconPosition = null;
    this.tooltipPosition = null;
  };

  public getPositionData = (name: 'beacon' | 'tooltip'): PositionData | null => {
    if (name === 'beacon') {
      return this.beaconPosition;
    }

    return this.tooltipPosition;
  };

  public getServerSnapshot = (): StoreState => this.snapshot;

  public getSnapshot = (): StoreState => this.snapshot;

  public getEventState = (): Omit<StoreState, 'positioned'> => omit(this.snapshot, 'positioned');

  public getState = (): State => omit(this.snapshot, 'positioned');

  public setPositionData = (name: 'beacon' | 'tooltip', data: PositionData) => {
    if (name === 'beacon') {
      this.beaconPosition = data;
    } else {
      this.tooltipPosition = data;
    }

    const isBeforePhase =
      this.state.lifecycle === LIFECYCLE.BEACON_BEFORE ||
      this.state.lifecycle === LIFECYCLE.TOOLTIP_BEFORE;

    if (isBeforePhase && !this.state.positioned) {
      this.updateState({ positioned: true });
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
      positioned: patch.positioned ?? this.state.positioned,
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
