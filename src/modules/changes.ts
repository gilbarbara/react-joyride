import { StoreState } from '~/types';

export function treeChanges<T extends Record<string, any> = StoreState>(state: T, previous: T) {
  return {
    changed<K extends keyof T>(key: K): boolean {
      return state[key] !== previous[key];
    },
    changedTo<K extends keyof T>(key: K, value: T[K] | T[K][]): boolean {
      const current = state[key];
      const previousValue = previous[key];

      if (Array.isArray(value)) {
        return (value as T[K][]).includes(current) && !(value as T[K][]).includes(previousValue);
      }

      return current === value && previousValue !== value;
    },
    previous,
  };
}
