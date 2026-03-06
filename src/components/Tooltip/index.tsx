import type { MouseEvent } from 'react';

import { getReactNodeText, replaceLocaleContent } from '~/modules/helpers';

import type { TooltipProps } from '~/types';

import Container from './Container';

export default function Tooltip(props: TooltipProps) {
  const { continuous, controls, index, isLastStep, size, step } = props;

  const handleClickBack = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    controls.prev();
  };

  const handleClickClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (step.dismissAction === 'skip') {
      controls.skip('button_close');
    } else {
      controls.close('button_close');
    }
  };

  const handleClickPrimary = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!continuous) {
      controls.close('button_primary');

      return;
    }

    controls.next();
  };

  const handleClickSkip = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    controls.skip('button_skip');
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
        'aria-describedby': 'joyride-tooltip-content',
        'aria-modal': true,
        role: 'alertdialog',
      },
    };
  };

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { arrowComponent, beaconComponent, tooltipComponent, ...cleanStep } = step;
  let component;

  if (tooltipComponent) {
    const renderProps = {
      ...getElementsProps(),
      continuous,
      index,
      isLastStep,
      size,
      step: cleanStep,
    };

    const TooltipComponent = tooltipComponent;

    component = <TooltipComponent {...renderProps} />;
  } else {
    component = (
      <Container
        {...getElementsProps()}
        continuous={continuous}
        index={index}
        isLastStep={isLastStep}
        size={size}
        step={step}
      />
    );
  }

  return component;
}
