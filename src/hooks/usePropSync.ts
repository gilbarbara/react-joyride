import { type RefObject, useEffect, useRef } from 'react';
import isEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import type { MergedProps } from '~/hooks/useTourEngine';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { treeChanges } from '~/modules/changes';
import { validateSteps } from '~/modules/step';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

import type { Actions, Controls, EventHandler, Status, StepMerged } from '~/types';

interface UsePropSyncParams {
  controls: Controls;
  onEvent: EventHandler | undefined;
  props: MergedProps;
  state: StoreState;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function usePropSync({
  controls,
  onEvent,
  props,
  state,
  store,
}: UsePropSyncParams): void {
  const { debug, initialStepIndex, run, stepIndex, steps } = props;

  const previousPropsRef = useRef<MergedProps | undefined>(undefined);
  const stateRef = useRef(state);
  const controlsRef = useRef(controls);
  const onEventRef = useRef(onEvent);

  stateRef.current = state;
  controlsRef.current = controls;
  onEventRef.current = onEvent;

  useEffect(() => {
    const previousProps = previousPropsRef.current;

    previousPropsRef.current = props;

    if (!previousProps || props === previousProps) {
      return;
    }

    const { hasChanged } = treeChanges(props, previousProps);

    if (!isEqual(previousProps.steps, steps)) {
      if (validateSteps(steps, debug)) {
        store.current.setSteps(steps);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Steps are not valid', steps);
        onEventRef.current?.({
          ...store.current.getEventState(),
          error: new Error('Steps are not valid'),
          scroll: null,
          step: (steps[0] ?? { target: '', content: '' }) as StepMerged,
          type: EVENTS.ERROR,
        });
      }
    }

    if (hasChanged('run')) {
      if (run) {
        if (store.current.getState().size) {
          controlsRef.current.start(stepIndex ?? initialStepIndex);
        }
      } else {
        controlsRef.current.stop();
      }
    } else if (is.number(stepIndex) && hasChanged('stepIndex')) {
      const nextAction: Actions =
        is.number(previousProps.stepIndex) && previousProps.stepIndex < stepIndex
          ? ACTIONS.NEXT
          : ACTIONS.PREV;

      if (!([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(stateRef.current.status)) {
        store.current.updateState(
          { action: nextAction, index: stepIndex, lifecycle: LIFECYCLE.INIT },
          true,
        );
      }
    }
  }, [debug, initialStepIndex, props, run, stepIndex, steps, store]);
}
