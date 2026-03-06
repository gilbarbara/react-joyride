import type { ElementType, MouseEventHandler } from 'react';

import type { Locale, Placement, Styles } from './common';
import type { FloatingOptions } from './floating';
import type { StepMerged } from './step';
import type { PartialDeep, Simplify } from './utilities';

/** Props passed to a custom arrow component. */
export type ArrowRenderProps = {
  /** Width of the arrow base in pixels. */
  base: number;
  /** The computed placement of the tooltip. */
  placement: Placement;
  /** Height of the arrow in pixels. */
  size: number;
};

/** Shared configuration inherited by both `Props` and `Step`. */
export type BaseProps = {
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
   * The scroll distance from the element scrollTop value.
   * @default 20
   */
  scrollOffset?: number;
  /**
   * Override the styling of the Tooltip.
   */
  styles?: PartialDeep<Styles>;
  /**
   * Custom Tooltip component.
   */
  tooltipComponent?: ElementType<TooltipRenderProps>;
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
  /** CSP nonce for inline styles. */
  nonce?: string;
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
      'aria-describedby': string;
      'aria-modal': boolean;
      role: string;
    };
  }
>;
