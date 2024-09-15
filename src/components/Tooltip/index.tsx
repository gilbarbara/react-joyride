import { MouseEvent } from 'react';

import { getReactNodeText, replaceLocaleContent } from '~/modules/helpers';

import { TooltipProps } from '~/types';

import Container from './Container';

export default function Tooltip(props: TooltipProps) {
  const { continuous, helpers, index, isLastStep, setTooltipRef, size, step } = props;

  const handleClickBack = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    helpers.prev();
  };

  const handleClickClose = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    helpers.close('button_close');
  };

  const handleClickPrimary = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!continuous) {
      helpers.close('button_primary');

      return;
    }

    helpers.next();
  };

  const handleClickSkip = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    helpers.skip();
  };

  const getElementsProps = () => {
    const { back, close, last, next, nextLabelWithProgress, skip } = step.locale;

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
        const labelWithProgress = getReactNodeText(nextLabelWithProgress, {
          step: index + 1,
          steps: size,
        });

        primary = replaceLocaleContent(nextLabelWithProgress, index + 1, size);
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
        ref: setTooltipRef,
        role: 'alertdialog',
      },
    };
  };

  const { beaconComponent, tooltipComponent, ...cleanStep } = step;
  let component;

  if (tooltipComponent) {
    const renderProps = {
      ...getElementsProps(),
      continuous,
      index,
      isLastStep,
      size,
      step: cleanStep,
      setTooltipRef,
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
