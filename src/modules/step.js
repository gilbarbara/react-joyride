// @flow
import is from 'is-lite';
import deepmerge from 'deepmerge';

import { log } from './helpers';
import getMergedStyles from '../styles';
import DEFAULTS from '../config/defaults';

import type { StepObject, TourObject } from '../config/types';

const validTourKeys = [
  'allowClicksThruHole',
  'beaconComponent',
  'disableBeacon',
  'disableCloseOnEsc',
  'disableOverlay',
  'disableOverlayClicks',
  'hideBackButton',
  'holePadding',
  'isFixed',
  'locale',
  'offsetParent',
  'scrollParent',
  'showProgress',
  'showSkipButton',
  'styles',
  'tooltipComponent',
  'tooltipOptions',
];

/**
 * Validate if a step is valid
 *
 * @param {Object} step - A step object
 * @param {boolean} debug
 *
 * @returns {boolean} - True if the step is valid, false otherwise
 */
export function validateStep(step: StepObject, debug: boolean = false): boolean {
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

function getTourProps(props: TourObject): TourObject {
  return Object.keys(props)
    .filter(d => validTourKeys.includes(d))
    .reduce((acc, i) => {
      acc[i] = props[i];

      return acc;
    }, {});
}

export function getMergedStep(step: StepObject, props: TourObject): StepObject {
  if (!step) return undefined;

  const tooltipOptions = deepmerge.all([DEFAULTS.tooltipOptions, props.tooltipOptions || {}, step.tooltipOptions || {}]);
  const scrollParent = step.scrollParent || props.scrollParent;

  if (step.placementBeacon) {
    tooltipOptions.wrapperOptions.placement = step.placementBeacon;
  }

  if (scrollParent) {
    tooltipOptions.options.preventOverflow.boundariesElement = scrollParent;
  }

  return {
    ...deepmerge.all([getTourProps(props), DEFAULTS.step, step]),
    locale: deepmerge(DEFAULTS.locale, props.locale || {}),
    tooltipOptions,
    styles: getMergedStyles(step.styles),
  };
}
