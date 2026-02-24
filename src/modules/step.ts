import is from 'is-lite';

import { defaultFloatingOptions, defaultLocale, defaultStep } from '~/defaults';
import getStyles from '~/styles';

import { FloatingOptions, Locale, Props, Step, StepMerged } from '~/types';

import { deepMerge, logDebug, pick } from './helpers';

function getTourProps(props: Props) {
  return {
    ...pick(
      props,
      'beaconComponent',
      'disableCloseOnEsc',
      'disableOverlay',
      'disableOverlayClose',
      'disableScrolling',
      'floatingOptions',
      'hideBackButton',
      'hideCloseButton',
      'loaderComponent',
      'locale',
      'showProgress',
      'showSkipButton',
      'spotlightClicks',
      'spotlightPadding',
      'styles',
      'tooltipComponent',
    ),
    ...props.stepOptions,
  };
}

export function getMergedStep(props: Props, currentStep?: Step): StepMerged | null {
  if (!currentStep) {
    return null;
  }

  const step = currentStep ?? {};
  const mergedStep = deepMerge<StepMerged>(defaultStep, getTourProps(props), step);

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
    styles: mergedStyles,
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
