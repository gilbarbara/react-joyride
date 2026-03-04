export type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

export type PlainObject<T = unknown> = Record<string, T>;

export type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type ValueOf<T> = T[keyof T];
