import { type RefObject, useEffect, useRef } from 'react';

import { log } from '~/modules/helpers';
import type createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';

const skipFields = new Set(['origin', 'positioned']);

export default function useDebugLogger(
  store: RefObject<ReturnType<typeof createStore>>,
  debug: boolean,
): void {
  const previousRef = useRef<StoreState | null>(null);

  useEffect(() => {
    if (!debug) {
      return undefined;
    }

    const current = store.current.getSnapshot();

    log(true, 'tour', 'init', current);
    previousRef.current = current;

    return store.current.subscribe(state => {
      const previous = previousRef.current;

      previousRef.current = state;

      if (!previous) {
        return;
      }

      const changes: Record<string, { from: unknown; to: unknown }> = {};
      let isTourLevel = false;

      for (const key of Object.keys(state) as Array<keyof StoreState>) {
        if (state[key] !== previous[key] && !skipFields.has(key)) {
          changes[key] = { from: previous[key], to: state[key] };

          if (key === 'status' || key === 'size') {
            isTourLevel = true;
          }
        }
      }

      if (Object.keys(changes).length) {
        const outOfBounds = !isTourLevel && state.index >= state.size;

        if (!outOfBounds) {
          const scope = isTourLevel ? 'tour' : `step:${state.index}`;

          log(true, scope, 'state', changes);
        }
      }
    });
  }, [debug, store]);
}
