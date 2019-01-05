import React from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../modules/helpers';
import Container from './Container';

export default class JoyrideTooltip extends React.Component {
  static propTypes = {
    continuous: PropTypes.bool.isRequired,
    helpers: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isLastStep: PropTypes.bool.isRequired,
    setTooltipRef: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    step: PropTypes.object.isRequired,
  };

  handleClickBack = (e) => {
    e.preventDefault();
    const { helpers } = this.props;

    helpers.prev();
  };

  handleClickClose = (e) => {
    e.preventDefault();
    const { helpers } = this.props;

    helpers.close();
  };

  handleClickPrimary = (e) => {
    e.preventDefault();
    const { continuous, helpers } = this.props;

    if (!continuous) {
      helpers.close();
      return;
    }

    helpers.next();
  };

  handleClickSkip = (e) => {
    e.preventDefault();
    const { helpers } = this.props;

    helpers.skip();
  };

  getElementsProps = () => {
    const { continuous, isLastStep, setTooltipRef, step } = this.props;
    const { back, close, last, next, skip } = step.locale;

    let primaryText = getText(continuous ? next : close);

    if (isLastStep) {
      primaryText = getText(last);
    }

    return {
      backProps: {
        'aria-label': getText(back),
        'data-action': 'back',
        onClick: this.handleClickBack,
        role: 'button',
        title: back,
      },
      closeProps: {
        'aria-label': getText(close),
        'data-action': 'close',
        onClick: this.handleClickClose,
        role: 'button',
        title: close,
      },
      primaryProps: {
        'aria-label': getText(primaryText),
        'data-action': 'primary',
        onClick: this.handleClickPrimary,
        role: 'button',
        title: primaryText,
      },
      skipProps: {
        'aria-label': getText(skip),
        'data-action': 'skip',
        onClick: this.handleClickSkip,
        role: 'button',
        title: skip,
      },
      tooltipProps: {
        role: 'alertdialog',
        'aria-modal': true,
        ref: setTooltipRef,
      },
    };
  };

  render() {
    const { continuous, index, isLastStep, size, step } = this.props;
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
      };

      const TooltipComponent = tooltipComponent;
      component = <TooltipComponent {...renderProps} />;
    }
    else {
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
