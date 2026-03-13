import type { Actions, Lifecycle, Origin, Status } from './common';

/** Methods to programmatically control the tour. */
export type Controls = {
  /** Close the current step and advance to the next one. */
  close: (origin?: Origin | null) => void;
  /** Jump to a specific step by index. */
  go: (nextIndex: number) => void;
  /** Get the current tour state. */
  info: () => State;
  /** Advance to the next step. */
  next: () => void;
  /** Open the tooltip for the current step. */
  open: () => void;
  /** Go back to the previous step. */
  prev: () => void;
  /** Reset the tour. Optionally restart from the beginning. */
  reset: (restart?: boolean) => void;
  /** Skip the tour entirely. */
  skip: (origin?: Extract<Origin, 'button_close' | 'button_skip'> | null) => void;
  /** Start the tour at an optional step index. */
  start: (nextIndex?: number) => void;
  /** Stop the tour. Optionally advance to the next step before stopping. */
  stop: (advance?: boolean) => void;
};

/** The internal tour state. */
export type State = {
  /** The action that triggered the state update. */
  action: Actions;
  /** Whether the tour is in controlled mode (using `stepIndex`). */
  controlled: boolean;
  /** The current step index. */
  index: number;
  /** The step's rendering phase. */
  lifecycle: Lifecycle;
  /** The UI element that triggered the last action. */
  origin: Origin | null;
  /** Whether the tour is scrolling to a target. */
  scrolling: boolean;
  /** The total number of steps. */
  size: number;
  /** The tour's current status. */
  status: Status;
  /** Whether the tour is blocked waiting for a `before` hook or target to appear. */
  waiting: boolean;
};
