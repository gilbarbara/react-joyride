import { RefObject } from 'react';
import isEqual from '@gilbarbara/deep-equal';
import { useEffectDeepCompare } from '@gilbarbara/hooks';
import is from 'is-lite';

import { defaultProps } from '~/defaults';
import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { mergeProps } from '~/modules/helpers';
import { validateSteps } from '~/modules/step';
import createStore from '~/modules/store';

import { Actions, Props, State, Status } from '~/types';

type MergedProps = ReturnType<typeof mergeProps<typeof defaultProps, Props>>;

interface UsePropSyncParams {
  changedProps: (key?: string) => boolean;
  previousProps: MergedProps | undefined;
  props: MergedProps;
  state: State;
  store: RefObject<ReturnType<typeof createStore>>;
}

export default function usePropSync({
  changedProps,
  previousProps,
  props,
  state,
  store,
}: UsePropSyncParams): void {
  const { debug, run, stepIndex, steps } = props;
  const { status } = state;

  useEffectDeepCompare(() => {
    if (!previousProps) {
      return;
    }

    if (changedProps()) {
      const { stepIndex: previousStepIndex, steps: previousSteps } = previousProps;

      if (!isEqual(previousSteps, steps)) {
        if (validateSteps(steps, debug)) {
          store.current.setSteps(steps);
        } else {
          // eslint-disable-next-line no-console
          console.warn('Steps are not valid', steps);
        }
      }

      if (changedProps('run')) {
        if (run) {
          if (store.current.getState().size) {
            store.current.start(stepIndex);
          }
        } else {
          store.current.stop();
        }
      } else if (is.number(stepIndex) && changedProps('stepIndex')) {
        const nextAction: Actions =
          is.number(previousStepIndex) && previousStepIndex < stepIndex
            ? ACTIONS.NEXT
            : ACTIONS.PREV;

        if (!([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
          store.current.updateState(
            { action: nextAction, index: stepIndex, lifecycle: LIFECYCLE.INIT },
            true,
          );
        }
      }
    }
  }, [changedProps, debug, previousProps, run, status, stepIndex, steps, store]);
}
