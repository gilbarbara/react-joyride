import { type RefObject, useEffect, useRef } from 'react';
import isEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';

import { defaultProps } from '~/defaults';
import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';
import { treeChanges } from '~/modules/changes';
import { mergeProps } from '~/modules/helpers';
import { validateSteps } from '~/modules/step';
import createStore from '~/modules/store';

import type { Actions, Controls, EventHandler, Props, Status, StoreState } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

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
  const { debug, run, stepIndex, steps } = props;

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

    const { changed } = treeChanges(props, previousProps);

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
          step: steps[0] ?? { target: '', content: '' },
          type: EVENTS.ERROR,
        });
      }
    }

    if (changed('run')) {
      if (run) {
        if (store.current.getState().size) {
          controlsRef.current.start(stepIndex);
        }
      } else {
        controlsRef.current.stop();
      }
    } else if (is.number(stepIndex) && changed('stepIndex')) {
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
  }, [debug, props, run, stepIndex, steps, store]);
}
