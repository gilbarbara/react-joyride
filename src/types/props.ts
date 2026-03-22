import type { ElementType, ReactElement } from 'react';

import type {
  ArrowRenderProps,
  BeaconRenderProps,
  LoaderRenderProps,
  TooltipRenderProps,
} from '~/types/components';
import type { FloatingOptions } from '~/types/floating';

import type { Events, FailureReason, Locale, Options, Styles } from './common';
import type { EventHandler } from './events';
import type { Controls, State } from './state';
import type { SelectorOrElement, Step, StepMerged } from './step';
import type { PartialDeep, Simplify } from './utilities';

export type Props = Simplify<
  SharedProps & {
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
     * Default options for all steps.
     */
    options?: Partial<Options>;
    /**
     * Render all Joyride components inside a specific element.
     */
    portalElement?: SelectorOrElement;
    /**
     * Run/stop the tour.
     * @default false
     */
    run?: boolean;
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
     * The tour's steps.
     */
    steps: Array<Step>;
  }
>;
/** Shared configuration inherited by both `Props` and `Step`. */
export type SharedProps = {
  /**
   * Custom Arrow component.
   */
  arrowComponent?: ElementType<ArrowRenderProps>;
  /**
   * Custom Beacon component.
   */
  beaconComponent?: ElementType<BeaconRenderProps>;
  /**
   * Options for the floating tooltip positioning.
   */
  floatingOptions?: Partial<FloatingOptions>;
  /**
   * Custom Loader component. Set to `null` to disable.
   */
  loaderComponent?: ElementType<LoaderRenderProps> | null;
  /**
   * The strings used in the tooltip.
   */
  locale?: Locale;
  /**
   * Override the styling of the Tooltip.
   */
  styles?: PartialDeep<Styles>;
  /**
   * Custom Tooltip component.
   */
  tooltipComponent?: ElementType<TooltipRenderProps>;
};

/** Return value of the `useJoyride` hook. */
export type UseJoyrideReturn = {
  /** Methods to programmatically control the tour. */
  controls: Controls;
  /** Steps that failed during the current tour run (target not found, before hook errors). Clears on start/reset. */
  failures: StepFailure[];
  /** Subscribe to a specific event type. Returns an unsubscribe function. */
  on: (eventType: Events, handler: EventHandler) => () => void;
  /** The current tour state. */
  state: State;
  /** The current merged step, or null if no step is active. */
  step: StepMerged | null;
  /** The tour React element to render. */
  Tour: ReactElement | null;
};

/** A step that failed during the tour. */
export interface StepFailure {
  reason: FailureReason;
  step: StepMerged;
}
