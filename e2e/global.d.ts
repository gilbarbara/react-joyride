declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      toBeAround(expected: T, precision?: number): R;
    }
  }
}

export {};
