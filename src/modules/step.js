// @flow
import deepmerge from 'deepmerge';
import is from 'is-lite';

import { getElement, hasCustomScrollParent } from './dom';
import { log } from './helpers';
import getStyles from '../styles';

import DEFAULTS from '../config/defaults';

import type { StepProps, JoyrideProps } from '../config/types';

/**
 * Validate if a step is valid
 *
 * @param {Object} step - A step object
 * @param {boolean} debug
 *
 * @returns {boolean} - True if the step is valid, false otherwise
 */
export function validateStep(step: StepProps, debug: boolean = false): boolean {
  if (!is.plainObject(step)) {
    log({
      title: 'validateStep',
      data: 'step must be an object',
      warn: true,
      debug,
    });
    return false;
  }

  if (!step.target) {
    log({
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
 * Validate if steps is valid
 *
 * @param {Array} steps - A steps array
 * @param {boolean} debug
 *
 * @returns {boolean} - True if the steps are valid, false otherwise
 */
export function validateSteps(steps: Array<Object>, debug: boolean = false): boolean {
  if (!is.array(steps)) {
    log({
      title: 'validateSteps',
      data: 'steps must be an array',
      warn: true,
      debug,
    });

    return false;
  }

  return steps.every(d => validateStep(d, debug));
}

function getTourProps(props: JoyrideProps): JoyrideProps {
  const sharedTourProps = [
    'beaconComponent',
    'disableCloseOnEsc',
    'disableOverlay',
    'disableOverlayClose',
    'disableScrolling',
    'hideBackButton',
    'locale',
    'showProgress',
    'showSkipButton',
    'spotlightClicks',
    'spotlightPadding',
    'styles',
    'tooltipComponent',
    'tooltipOptions',
  ];

  return Object.keys(props)
    .filter(d => sharedTourProps.includes(d))
    .reduce((acc, i) => {
      acc[i] = props[i];

      return acc;
    }, {});
}

export function getMergedStep(step: StepProps, props: JoyrideProps): StepProps {
  if (!step) return undefined;

  const mergedStep = deepmerge.all([getTourProps(props), DEFAULTS.step, step]);
  const mergedStyles = getStyles(deepmerge(props.styles || {}, step.styles || {}));
  const tooltipOptions = deepmerge(DEFAULTS.tooltipOptions, step.tooltipOptions || {});
  const scrollParent = hasCustomScrollParent(getElement(step.target));

  tooltipOptions.offset = mergedStep.offset || 0;
  tooltipOptions.styles.arrow = mergedStyles.arrow;

  if (!mergedStep.disableScrolling) {
    tooltipOptions.offset += props.spotlightPadding || step.spotlightPadding || 0;
  }

  if (step.placementBeacon) {
    tooltipOptions.wrapperOptions.placement = step.placementBeacon;
  }

  if (scrollParent) {
    tooltipOptions.options.preventOverflow.boundariesElement = 'window';
  }

  return {
    ...mergedStep,
    locale: deepmerge(DEFAULTS.locale, props.locale || {}),
    tooltipOptions,
    styles: mergedStyles,
  };
}
