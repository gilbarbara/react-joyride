import type { ReactElement } from 'react';

import type { BaseProps } from './components';
import type { EventHandler } from './events';
import type { Controls, State } from './state';
import type { SelectorOrElement, Step, StepMerged, StepOptions } from './step';
import type { Simplify } from './utilities';

/** Props for the Joyride component. */
export type Props = Simplify<
  BaseProps & {
    /**
     * The tour is played sequentially with the Next button.
     * @default false
     */
    continuous?: boolean;
    /**
     * Log Joyride's actions to the console.
     * @default false
     */
    debug?: boolean;
    /**
     * The initial step index for uncontrolled tours.
     * Ignored when stepIndex is set (controlled mode).
     * @default 0
     */
    initialStepIndex?: number;
    /**
     * A nonce value for inline styles (Content Security Policy).
     */
    nonce?: string;
    /**
     * A function called when Joyride fires an event.
     */
    onEvent?: EventHandler;
    /**
     * The element to render the tooltip into. Accepts a CSS selector or HTMLElement.
     */
    portalElement?: SelectorOrElement;
    /**
     * Run/stop the tour.
     * @default false
     */
    run?: boolean;
    /**
     * The scroll animation duration in milliseconds.
     * @default 300
     */
    scrollDuration?: number;
    /**
     * Scroll the page for the first step.
     * @default false
     */
    scrollToFirstStep?: boolean;
    /**
     * Setting a number here will turn Joyride into `controlled` mode.
     * You'll have to keep an internal state by yourself and update it with the events in `onEvent`.
     */
    stepIndex?: number;
    /**
     * Default options for all steps.
     */
    stepOptions?: StepOptions;
    /**
     * The tour's steps.
     */
    steps: Array<Step>;
  }
>;

/** Return value of the `useJoyride` hook. */
export type UseJoyrideReturn = {
  /** Methods to programmatically control the tour. */
  controls: Controls;
  /** The current tour state. */
  state: State;
  /** The current merged step, or null if no step is active. */
  step: StepMerged | null;
  /** The tour React element to render. */
  Tour: ReactElement | null;
};
