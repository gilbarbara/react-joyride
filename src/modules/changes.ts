import type { StoreState } from '~/modules/store';

export function treeChanges<T extends Record<string, any> = StoreState>(state: T, previous: T) {
  return {
    hasChanged<K extends keyof T>(key: K): boolean {
      return state[key] !== previous[key];
    },
    hasChangedTo<K extends keyof T>(key: K, value: T[K] | T[K][]): boolean {
      const current = state[key];
      const previousValue = previous[key];

      if (Array.isArray(value)) {
        return value.includes(current) && !value.includes(previousValue);
      }

      return current === value && previousValue !== value;
    },
    previous,
  };
}
