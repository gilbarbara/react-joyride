// @flow
import deepmerge from 'deepmerge';
import is from 'is-lite';

import { getElement, hasCustomScrollParent } from './dom';
import { log } from './helpers';
import getStyles from '../styles';

import DEFAULTS from '../config/defaults';

function getTourProps(props: Object): Object {
  const sharedTourProps = [
    'beaconComponent',
    'disableCloseOnEsc',
    'disableOverlay',
    'disableOverlayClose',
    'disableScrolling',
    'disableScrollParentFix',
    'floaterProps',
    'hideBackButton',
    'hideCloseButton',
    'locale',
    'showProgress',
    'showSkipButton',
    'spotlightClicks',
    'spotlightPadding',
    'styles',
    'tooltipComponent',
  ];

  return Object.keys(props)
    .filter(d => sharedTourProps.includes(d))
    .reduce((acc, i) => {
      acc[i] = props[i]; //eslint-disable-line react/destructuring-assignment

      return acc;
    }, {});
}

export function getMergedStep(step: StepProps, props: JoyrideProps): ?StepProps {
  if (!step) return null;

  const mergedStep = deepmerge.all([getTourProps(props), DEFAULTS.step, step], {
    isMergeableObject: is.plainObject,
  });
  const mergedStyles = getStyles(deepmerge(props.styles || {}, step.styles || {}));
  const scrollParent = hasCustomScrollParent(
    getElement(step.target),
    mergedStep.disableScrollParentFix,
  );
  const floaterProps = deepmerge.all([
    props.floaterProps || {},
    DEFAULTS.floaterProps,
    mergedStep.floaterProps || {},
  ]);

  // Set react-floater props
  floaterProps.offset = mergedStep.offset;
  floaterProps.styles = deepmerge(floaterProps.styles || {}, mergedStyles.floaterStyles || {});

  delete mergedStyles.floaterStyles;

  floaterProps.offset += props.spotlightPadding || step.spotlightPadding || 0;

  if (step.placementBeacon) {
    floaterProps.wrapperOptions.placement = step.placementBeacon;
  }

  if (scrollParent) {
    floaterProps.options.preventOverflow.boundariesElement = 'window';
  }

  return {
    ...mergedStep,
    locale: deepmerge.all([DEFAULTS.locale, props.locale || {}, mergedStep.locale || {}]),
    floaterProps,
    styles: mergedStyles,
  };
}

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
