import type { MouseEventHandler, ReactElement, RefCallback } from 'react';

import type { Lifecycle, Locale, Styles } from './common';
import type { BaseProps, BeaconRenderProps } from './components';
import type { EventHandler } from './events';
import type { PositionData } from './floating';
import type { Controls, State, StoreState } from './state';
import type { SelectorOrElement, Step, StepMerged, StepOptions } from './step';
import type { Simplify } from './utilities';

/** Internal props for the Beacon component. */
export type BeaconProps = Simplify<
  Pick<Props, 'beaconComponent' | 'nonce'> &
    BeaconRenderProps & {
      /** Tooltip button labels. */
      locale: Locale;
      /** Handler for beacon click or hover interaction. */
      onClickOrHover: MouseEventHandler<HTMLElement>;
      /** Whether the beacon should receive focus. */
      shouldFocus: boolean;
      /** Resolved styles for the beacon. */
      styles: Styles;
    }
>;

/** Internal props for the Overlay component. */
export type OverlayProps = Simplify<
  StepMerged & {
    /** Whether the tour is in continuous mode. */
    continuous: boolean;
    /** Whether debug logging is enabled. */
    debug: boolean;
    /** The step's rendering phase. */
    lifecycle: Lifecycle;
    /** Handler for overlay click. */
    onClickOverlay: () => void;
    /** Whether the tour is scrolling to a target. */
    scrolling: boolean;
    /** Whether the tour is waiting for a `before` hook or target. */
    waiting: boolean;
  }
>;

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
     * @default true
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

/** Internal props for the Step component. */
export type StepProps = Simplify<
  StoreState & {
    /** Whether the tour is in continuous mode. */
    continuous: boolean;
    /** Tour control methods. */
    controls: Controls;
    /** Whether debug logging is enabled. */
    debug: boolean;
    /** CSP nonce for inline styles. */
    nonce?: string;
    /** The resolved portal DOM element. */
    portalElement: HTMLElement | null;
    /** Callback to update beacon or tooltip position. */
    setPositionData: (name: 'beacon' | 'tooltip', data: PositionData) => void;
    /** Whether the step should scroll to the target. */
    shouldScroll: boolean;
    /** The current merged step. */
    step: StepMerged;
    /** Callback to update internal store state. */
    updateState: (state: Partial<StoreState>) => void;
  }
>;

/** Internal props for the Tooltip component. */
export type TooltipProps = {
  /** Whether the tour is in continuous mode. */
  continuous: boolean;
  /** Tour control methods. */
  controls: Controls;
  /** The current step index. */
  index: number;
  /** Whether this is the last step. */
  isLastStep: boolean;
  /** Ref callback for the tooltip DOM element. */
  setTooltipRef: RefCallback<HTMLElement>;
  /** The total number of steps. */
  size: number;
  /** The current merged step. */
  step: StepMerged;
};

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
