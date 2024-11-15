import * as React from 'react';

import { getReactNodeText, replaceLocaleContent } from '~/modules/helpers';

import { TooltipProps } from '~/types';

import Container from './Container';

export default class JoyrideTooltip extends React.Component<TooltipProps> {
  handleClickBack = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { helpers } = this.props;

    helpers.prev();
  };

  handleClickClose = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { helpers } = this.props;

    helpers.close('button_close');
  };

  handleClickPrimary = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { continuous, helpers } = this.props;

    if (!continuous) {
      helpers.close('button_primary');

      return;
    }

    helpers.next();
  };

  handleClickSkip = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { helpers } = this.props;

    helpers.skip();
  };

  getElementsProps = () => {
    const { continuous, index, isLastStep, setTooltipRef, size, step } = this.props;
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
        onClick: this.handleClickBack,
        role: 'button',
        title: backText,
      },
      closeProps: {
        'aria-label': closeText,
        children: close,
        'data-action': 'close',
        onClick: this.handleClickClose,
        role: 'button',
        title: closeText,
      },
      primaryProps: {
        'aria-label': primaryText,
        children: primary,
        'data-action': 'primary',
        onClick: this.handleClickPrimary,
        role: 'button',
        title: primaryText,
      },
      skipProps: {
        'aria-label': skipText,
        children: skip,
        'data-action': 'skip',
        onClick: this.handleClickSkip,
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

  render() {
    const { continuous, index, isLastStep, setTooltipRef, size, step } = this.props;
    const { beaconComponent, tooltipComponent, ...cleanStep } = step;
    let component;

    if (tooltipComponent) {
      const renderProps = {
        ...this.getElementsProps(),
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
          {...this.getElementsProps()}
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
}
