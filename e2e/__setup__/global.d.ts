declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      toBeAround(expected: T, precision?: number): R;
    }
  }
}

export {};
