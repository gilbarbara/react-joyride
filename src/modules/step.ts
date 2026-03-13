import is from 'is-lite';

import { defaultFloatingOptions, defaultLocale, defaultOptions, defaultStep } from '~/defaults';
import getStyles from '~/styles';

import type {
  FloatingOptions,
  Locale,
  Options,
  Props,
  SpotlightPadding,
  Step,
  StepMerged,
} from '~/types';

import { deepMerge, logDebug, pick } from './helpers';

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
  'disableBeacon',
  'dismissKeyAction',
  'disableFocusTrap',
  'disableOverlay',
  'disableScroll',
  'disableTargetInteraction',
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
 * Validate if a step is valid
 */
export function validateStep(step: Step, debug: boolean = false): boolean {
  if (!is.plainObject(step)) {
    logDebug({
      title: 'validateStep',
      data: 'step must be an object',
      warn: true,
      debug,
    });

    return false;
  }

  if (!step.target) {
    logDebug({
      title: 'validateStep',
      data: 'target is missing from the step',
      warn: true,
      debug,
    });

    return false;
  }

  return true;
}

/**
 * Validate if steps are valid
 */
export function validateSteps(steps: Array<Step>, debug: boolean = false): boolean {
  if (!is.array(steps)) {
    logDebug({
      title: 'validateSteps',
      data: 'steps must be an array',
      warn: true,
      debug,
    });

    return false;
  }

  return steps.every(d => validateStep(d, debug));
}
