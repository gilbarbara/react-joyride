/** Generic record type. */
export type AnyObject<T = any> = Record<string, T>;

/** Excludes arrays, functions, Map, and Set from a record type. */
export type NarrowPlainObject<T extends Record<string, any>> = Exclude<
  T,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Array<unknown> | Function | Map<unknown, unknown> | Set<unknown>
>;

/** Makes all properties optional, with one level of depth for nested objects. */
export type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

/** Generic record type with unknown values. */
export type PlainObject<T = unknown> = Record<string, T>;

/** Makes specific keys required while keeping others unchanged. */
export type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Flattens intersection types for better IDE display. */
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

/** Extracts a union of all values from an object type. */
export type ValueOf<T> = T[keyof T];
