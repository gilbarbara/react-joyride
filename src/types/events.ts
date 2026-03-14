import type { Actions, Events, Lifecycle, Origin, Status } from './common';
import type { Controls } from './state';
import type { StepMerged } from './step';
import type { Simplify } from './utilities';

/** The payload passed to the `onEvent` callback. Extends `TourData` with event-specific fields. */
export type EventData = Simplify<
  TourData & {
    /**
     * The error that occurred (only populated for ERROR events).
     */
    error: Error | null;
    /**
     * Scroll data (only populated for SCROLL_START/SCROLL_END events).
     */
    scroll: ScrollData | null;
    /**
     * Whether the tour is currently scrolling to a target.
     */
    scrolling: boolean;
    /**
     * The type of the event.
     */
    type: Events;
    /**
     * Whether the tour is blocked waiting for a before hook or target to appear.
     */
    waiting: boolean;
  }
>;

/** Callback signature for the `onEvent` prop. */
export type EventHandler = (data: EventData, controls: Controls) => void;

/** Scroll position details for `scroll:start` and `scroll:end` events. */
export type ScrollData = {
  /**
   * The scroll duration in milliseconds.
   */
  duration: number;
  /**
   * The element being scrolled.
   */
  element: Element;
  /**
   * The scroll position before scrolling.
   */
  initial: number;
  /**
   * The computed scroll destination.
   */
  target: number;
};

/** Base event payload with tour state at the time of the event. */
export interface TourData {
  /**
   * The action that triggered the state update.
   */
  action: Actions;
  /**
   * Whether the tour is in `controlled` mode (using the `stepIndex` prop).
   */
  controlled: boolean;
  /**
   * The current step's index.
   */
  index: number;
  /**
   * The step's rendering phase.
   */
  lifecycle: Lifecycle;
  /**
   * The UI element that triggered the action (if available).
   */
  origin: Origin | null;
  /**
   * The total number of steps.
   */
  size: number;
  /**
   * The tour's current status.
   */
  status: Status;
  /**
   * The current step's data.
   */
  step: StepMerged;
}
