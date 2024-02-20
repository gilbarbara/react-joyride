import * as React from 'react';

import { getText } from '~/modules/helpers';

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
    const { continuous, isLastStep, setTooltipRef, step } = this.props;

    const back = getText(step.locale.back);
    const close = getText(step.locale.close);
    const last = getText(step.locale.last);
    const next = getText(step.locale.next);
    const skip = getText(step.locale.skip);

    let primaryText = continuous ? next : close;

    if (isLastStep) {
      primaryText = last;
    }

    return {
      backProps: {
        'aria-label': back,
        'data-action': 'back',
        onClick: this.handleClickBack,
        role: 'button',
        title: back,
      },
      closeProps: {
        'aria-label': close,
        'data-action': 'close',
        onClick: this.handleClickClose,
        role: 'button',
        title: close,
      },
      primaryProps: {
        'aria-label': primaryText,
        'data-action': 'primary',
        onClick: this.handleClickPrimary,
        role: 'button',
        title: primaryText,
      },
      skipProps: {
        'aria-label': skip,
        'data-action': 'skip',
        onClick: this.handleClickSkip,
        role: 'button',
        title: skip,
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
