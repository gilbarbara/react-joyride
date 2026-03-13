import type { ReactNode, RefObject } from 'react';

import type { SharedProps } from '~/types/props';

import type { Options, Placement, SpotlightPadding, Styles } from './common';
import type { SetRequired, Simplify } from './utilities';

/** A CSS selector string, an HTMLElement, or null. */
export type SelectorOrElement = string | null | HTMLElement;

/** A single step in the tour, provided by the user. */
export type Step = Simplify<
  SharedProps &
    Partial<Options> & {
      /**
       * The placement of the beacon. It will use the `placement` if nothing is passed.
       */
      beaconPlacement?: Placement;
      /**
       * The tooltip's body.
       */
      content: ReactNode;
      /**
       * Additional data you can add to the step.
       */
      data?: any;
      /**
       * A unique identifier for the step.
       */
      id?: string;
      /**
       * Force the step to be fixed.
       * @default false
       */
      isFixed?: boolean;
      /**
       * The placement of the beacon and tooltip. It will re-position itself if there's no space available.
       * @default bottom
       */
      placement?: Placement | 'auto' | 'center';
      /**
       * An optional element to scroll to instead of the target.
       * The spotlight and tooltip will still use `target`.
       */
      scrollTarget?: StepTarget;
      /**
       * An optional element to highlight instead of the target.
       * The tooltip will still anchor to `target`.
       */
      spotlightTarget?: StepTarget;
      /**
       * The target for the step.
       * It can be a CSS selector, an HTMLElement, a React ref, or a function that returns an element.
       */
      target: StepTarget;
      /**
       * The tooltip's title.
       */
      title?: ReactNode;
    }
>;

/** A normalized step with all defaults applied. */
export type StepMerged = Simplify<
  SetRequired<
    Step,
    | 'arrowBase'
    | 'arrowColor'
    | 'arrowSize'
    | 'arrowSpacing'
    | 'backgroundColor'
    | 'beaconSize'
    | 'beaconTrigger'
    | 'beforeTimeout'
    | 'buttons'
    | 'closeButtonAction'
    | 'disableBeacon'
    | 'dismissKeyAction'
    | 'disableFocusTrap'
    | 'disableOverlay'
    | 'disableScroll'
    | 'disableTargetInteraction'
    | 'isFixed'
    | 'loaderDelay'
    | 'locale'
    | 'offset'
    | 'overlayClickAction'
    | 'overlayColor'
    | 'placement'
    | 'primaryColor'
    | 'scrollDuration'
    | 'scrollOffset'
    | 'showProgress'
    | 'spotlightRadius'
    | 'targetWaitTimeout'
    | 'textColor'
    | 'zIndex'
  > & {
    spotlightPadding: Required<SpotlightPadding>;
    styles: Styles;
  }
>;

export type StepTarget =
  | string
  | HTMLElement
  | RefObject<HTMLElement | null>
  | (() => HTMLElement | null);
