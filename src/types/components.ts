import { ElementType, MouseEventHandler, ReactNode, RefCallback } from 'react';
import { Props as FloaterProps } from 'react-floater';
import { PartialDeep, SetRequired, Simplify, ValueOf } from 'type-fest';

import { Actions, Events, Lifecycle, Locale, Placement, Status, Styles } from './common';

export type BaseProps = {
  beaconComponent?: ElementType<BeaconRenderProps>;
  disableCloseOnEsc?: boolean;
  disableOverlay?: boolean;
  disableOverlayClose?: boolean;
  disableScrollParentFix?: boolean;
  disableScrolling?: boolean;
  floaterProps?: Partial<FloaterProps>;
  hideBackButton?: boolean;
  hideCloseButton?: boolean;
  locale?: Locale;
  nonce?: string;
  showProgress?: boolean;
  showSkipButton?: boolean;
  spotlightClicks?: boolean;
  spotlightPadding?: number;
  styles?: PartialDeep<Styles>;
  tooltipComponent?: ElementType<TooltipRenderProps>;
};

export type BeaconProps = Simplify<
  Pick<Props, 'beaconComponent' | 'nonce'> &
    BeaconRenderProps & {
      locale: Locale;
      onClickOrHover: MouseEventHandler<HTMLElement>;
      shouldFocus: boolean;
      styles: Styles;
    }
>;

export type BeaconRenderProps = {
  continuous: boolean;
  index: number;
  isLastStep: boolean;
  size: number;
  step: StepMerged;
};

export type Callback = (data: CallBackProps) => void;

export type CallBackProps = {
  action: Actions;
  controlled: boolean;
  index: number;
  lifecycle: Lifecycle;
  size: number;
  status: Status;
  step: Step;
  type: Events;
};

export type OverlayProps = Simplify<
  StepMerged & {
    debug: boolean;
    lifecycle: ValueOf<Lifecycle>;
    onClickOverlay: () => void;
  }
>;

export type Props = Simplify<
  BaseProps & {
    callback?: Callback;
    continuous?: boolean;
    debug?: boolean;
    getHelpers?: (helpers: StoreHelpers) => any;
    run: boolean;
    scrollDuration?: number;
    scrollOffset?: number;
    scrollToFirstStep?: boolean;
    stepIndex?: number;
    steps: Array<Step>;
  }
>;

export type State = {
  action: Actions;
  controlled: boolean;
  index: number;
  lifecycle: Lifecycle;
  size: number;
  status: Status;
};

export type Step = Simplify<
  BaseProps & {
    content: ReactNode;
    disableBeacon?: boolean;
    event?: string;
    floaterProps?: FloaterProps;
    hideFooter?: boolean;
    isFixed?: boolean;
    offset?: number;
    placement?: Placement | 'auto' | 'center';
    placementBeacon?: Placement;
    target: string | HTMLElement;
    title?: ReactNode;
  }
>;

export type StepMerged = Simplify<
  SetRequired<
    Step,
    | 'disableBeacon'
    | 'disableCloseOnEsc'
    | 'disableOverlay'
    | 'disableOverlayClose'
    | 'disableScrollParentFix'
    | 'disableScrolling'
    | 'event'
    | 'hideBackButton'
    | 'hideCloseButton'
    | 'hideFooter'
    | 'isFixed'
    | 'locale'
    | 'offset'
    | 'placement'
    | 'showProgress'
    | 'showSkipButton'
    | 'spotlightClicks'
    | 'spotlightPadding'
  > & {
    styles: Styles;
  }
>;

export type StepProps = Simplify<
  State & {
    callback: Callback;
    continuous: boolean;
    debug: boolean;
    helpers: StoreHelpers;
    nonce?: string;
    setPopper: FloaterProps['getPopper'];
    shouldScroll: boolean;
    step: StepMerged;
    update: (state: Partial<State>) => void;
  }
>;

export type StoreHelpers = {
  close: () => void;
  go: (nextIndex: number) => void;
  info: (state: State) => void;
  next: () => void;
  open: () => void;
  prev: () => void;
  reset: (restart: boolean) => void;
  skip: () => void;
};

export type StoreOptions = Simplify<
  Props & {
    controlled: boolean;
  }
>;

export type TooltipProps = {
  continuous: boolean;
  helpers: StoreHelpers;
  index: number;
  isLastStep: boolean;
  setTooltipRef: RefCallback<HTMLElement>;
  size: number;
  step: StepMerged;
};

export type TooltipRenderProps = Simplify<
  BeaconRenderProps & {
    backProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    closeProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    primaryProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    skipProps: {
      'aria-label': string;
      'data-action': string;
      onClick: MouseEventHandler<HTMLElement>;
      role: string;
      title: string;
    };
    tooltipProps: {
      'aria-modal': boolean;
      ref: RefCallback<HTMLElement>;
      role: string;
    };
  }
>;
