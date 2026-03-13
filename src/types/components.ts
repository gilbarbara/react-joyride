import type { MouseEventHandler } from 'react';

import type { Controls } from '~/types/state';

import type { Placement } from './common';
import type { StepMerged } from './step';
import type { Simplify } from './utilities';

/** Props passed to a custom arrow component. */
export type ArrowRenderProps = {
  /** Width of the arrow base in pixels. */
  base: number;
  /** The computed placement of the tooltip. */
  placement: Placement;
  /** Height of the arrow in pixels. */
  size: number;
};

/** Props passed to a custom beacon component.
 * Must render a span since it's placed inside a `<button>` wrapper.
 */
export type BeaconRenderProps = {
  /** Whether the tour is in continuous mode. */
  continuous: boolean;
  /** The current step index. */
  index: number;
  /** Whether this is the last step. */
  isLastStep: boolean;
  /** The total number of steps. */
  size: number;
  /** The current step data. */
  step: StepMerged;
};

/** Props passed to a custom loader component. */
export type LoaderRenderProps = {
  /** The current step data. */
  step: StepMerged;
};

/** Props passed to a custom tooltip component. */
export type TooltipRenderProps = Simplify<
  BeaconRenderProps & {
    /** Props to spread on the back button. */
    backProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    /** Props to spread on the close button. */
    closeProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    /** Methods to programmatically control the tour. */
    controls: Controls;
    /** Props to spread on the next/last button. */
    primaryProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    /** Props to spread on the skip button. */
    skipProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    /** Props to spread on the tooltip container. */
    tooltipProps: {
      'aria-modal': boolean;
      role: string;
    };
  }
>;
