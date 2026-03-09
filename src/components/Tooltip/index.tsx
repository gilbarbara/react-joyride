import type { MouseEvent } from 'react';

import { ORIGIN } from '~/literals';
import { getReactNodeText, replaceLocaleContent } from '~/modules/helpers';

import type { Controls, StepMerged } from '~/types';

import DefaultTooltip from './DefaultTooltip';

interface TooltipProps {
  continuous: boolean;
  controls: Controls;
  index: number;
  isLastStep: boolean;
  size: number;
  step: StepMerged;
}

export default function Tooltip(props: TooltipProps) {
  const { continuous, controls, index, isLastStep, size, step } = props;

  const handleClickBack = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    controls.prev();
  };

  const handleClickClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (step.closeAction === 'skip') {
      controls.skip(ORIGIN.BUTTON_CLOSE);
    } else {
      controls.close(ORIGIN.BUTTON_CLOSE);
    }
  };

  const handleClickPrimary = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!continuous) {
      controls.close(ORIGIN.BUTTON_PRIMARY);

      return;
    }

    controls.next();
  };

  const handleClickSkip = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    controls.skip(ORIGIN.BUTTON_SKIP);
  };

  const getElementsProps = () => {
    const { back, close, last, next, nextWithProgress, skip } = step.locale;

    const backText = getReactNodeText(back);
    const closeText = getReactNodeText(close);
    const lastText = getReactNodeText(last);
    const nextText = getReactNodeText(next);
    const skipText = getReactNodeText(skip);

    let primary = close;
    let primaryText = closeText;

    if (continuous) {
      primary = next;
      primaryText = nextText;

      if (step.showProgress && !isLastStep) {
        const labelWithProgress = getReactNodeText(nextWithProgress, {
          step: index + 1,
          steps: size,
        });

        primary = replaceLocaleContent(nextWithProgress, index + 1, size);
        primaryText = labelWithProgress;
      }

      if (isLastStep) {
        primary = last;
        primaryText = lastText;
      }
    }

    return {
      backProps: {
        'aria-label': backText,
        children: back,
        'data-action': 'back',
        onClick: handleClickBack,
        role: 'button',
        title: backText,
      },
      closeProps: {
        'aria-label': closeText,
        children: close,
        'data-action': 'close',
        onClick: handleClickClose,
        role: 'button',
        title: closeText,
      },
      primaryProps: {
        'aria-label': primaryText,
        children: primary,
        'data-action': 'primary',
        onClick: handleClickPrimary,
        role: 'button',
        title: primaryText,
      },
      skipProps: {
        'aria-label': skipText,
        children: skip,
        'data-action': 'skip',
        onClick: handleClickSkip,
        role: 'button',
        title: skipText,
      },
      tooltipProps: {
        'aria-modal': true,
        role: 'alertdialog',
      },
    };
  };

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { arrowComponent, beaconComponent, tooltipComponent, ...stepProps } = step;
  let component;

  if (tooltipComponent) {
    const TooltipComponent = tooltipComponent;

    component = (
      <TooltipComponent
        {...getElementsProps()}
        continuous={continuous}
        controls={controls}
        index={index}
        isLastStep={isLastStep}
        size={size}
        step={stepProps}
      />
    );
  } else {
    component = (
      <DefaultTooltip
        {...getElementsProps()}
        continuous={continuous}
        controls={controls}
        index={index}
        isLastStep={isLastStep}
        size={size}
        step={stepProps}
      />
    );
  }

  return component;
}
