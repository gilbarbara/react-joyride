import is from 'is-lite';

import { defaultFloatingOptions, defaultLocale, defaultOptions, defaultStep } from '~/defaults';
import { ACTIONS } from '~/literals';
import getStyles from '~/styles';

import type {
  Actions,
  FloatingOptions,
  Locale,
  Options,
  Props,
  SpotlightPadding,
  State,
  Step,
  StepMerged,
} from '~/types';

import { deepMerge, log, pick } from './helpers';

const optionFieldNames = [
  'after',
  'arrowBase',
  'arrowColor',
  'arrowSize',
  'arrowSpacing',
  'backgroundColor',
  'beaconSize',
  'beaconTrigger',
  'before',
  'beforeTimeout',
  'buttons',
  'closeButtonAction',
  'skipBeacon',
  'dismissKeyAction',
  'disableFocusTrap',
  'hideOverlay',
  'skipScroll',
  'blockTargetInteraction',
  'loaderDelay',
  'offset',
  'overlayClickAction',
  'overlayColor',
  'primaryColor',
  'scrollDuration',
  'scrollOffset',
  'showProgress',
  'spotlightPadding',
  'spotlightRadius',
  'targetWaitTimeout',
  'textColor',
  'width',
  'zIndex',
] as const satisfies ReadonlyArray<keyof Options>;

export function getMergedStep(props: Props, currentStep?: Step): StepMerged | null {
  if (!currentStep) {
    return null;
  }

  const mergedStep = deepMerge<StepMerged>(
    defaultStep,
    pick(
      props,
      'arrowComponent',
      'beaconComponent',
      'floatingOptions',
      'loaderComponent',
      'locale',
      'styles',
      'tooltipComponent',
    ),
    currentStep,
  );

  const mergedOptions = deepMerge<Options>(
    defaultOptions,
    props.options ?? {},
    pick(currentStep, ...optionFieldNames),
  );

  const mergedStyles = getStyles(props, { ...mergedStep, ...mergedOptions } as StepMerged);

  const floatingOptions = deepMerge<FloatingOptions>(
    defaultFloatingOptions,
    props.floatingOptions ?? {},
    mergedStep.floatingOptions ?? {},
  );

  return {
    ...mergedStep,
    ...mergedOptions,
    locale: deepMerge<Locale>(defaultLocale, props.locale ?? {}, mergedStep.locale || {}),
    floatingOptions,
    spotlightPadding: normalizeSpotlightPadding(mergedOptions.spotlightPadding),
    styles: mergedStyles,
  };
}

export function normalizeSpotlightPadding(
  value: number | SpotlightPadding | undefined,
): Required<SpotlightPadding> {
  if (typeof value === 'number') {
    return { top: value, right: value, bottom: value, left: value };
  }

  return {
    top: value?.top ?? 0,
    right: value?.right ?? 0,
    bottom: value?.bottom ?? 0,
    left: value?.left ?? 0,
  };
}

/**
 * Decide if the step shouldn't skip the beacon
 */
export function shouldHideBeacon(step: Step, state: State, continuous: boolean): boolean {
  const { action } = state;

  const withContinuous = continuous && ([ACTIONS.PREV, ACTIONS.NEXT] as Actions[]).includes(action);

  return step.skipBeacon || step.placement === 'center' || withContinuous;
}

/**
 * Validate if a step is valid
 */
export function validateStep(step: Step, debug: boolean = false): boolean {
  if (!is.plainObject(step)) {
    log(debug, 'tour', 'step must be an object');

    return false;
  }

  if (!step.target) {
    log(debug, 'tour', 'target is missing from the step');

    return false;
  }

  return true;
}

/**
 * Validate if steps are valid
 */
export function validateSteps(steps: Array<Step>, debug: boolean = false): boolean {
  if (!is.array(steps)) {
    log(debug, 'tour', 'steps must be an array');

    return false;
  }

  return steps.every(d => validateStep(d, debug));
}
