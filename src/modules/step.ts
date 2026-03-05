import is from 'is-lite';

import { defaultFloatingOptions, defaultLocale, defaultStep, defaultStepOptions } from '~/defaults';
import getStyles from '~/styles';

import type { FloatingOptions, Locale, Props, SpotlightPadding, Step, StepMerged } from '~/types';

import { deepMerge, logDebug, pick } from './helpers';

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
      'scrollOffset',
      'styles',
      'tooltipComponent',
    ),
    defaultStepOptions,
    props.stepOptions ?? {},
    currentStep,
  );

  const mergedStyles = getStyles(props, mergedStep);
  const floatingOptions = deepMerge<FloatingOptions>(
    defaultFloatingOptions,
    props.floatingOptions ?? {},
    mergedStep.floatingOptions ?? {},
  );

  return {
    ...mergedStep,
    locale: deepMerge<Locale>(defaultLocale, props.locale ?? {}, mergedStep.locale || {}),
    floatingOptions,
    spotlightPadding: normalizeSpotlightPadding(mergedStep.spotlightPadding),
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
