import React from 'react';
import PropTypes from 'prop-types';

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

  render() {
    const { continuous, index, isLastStep, setTooltipRef, size, step } = this.props;
    const { content, locale, title, tooltipComponent } = step;
    const { back, close, last, next, skip } = locale;
    let primaryText = continuous ? next : close;

    if (isLastStep) {
      primaryText = last;
    }

    let component;
    const buttonProps = {
      backProps: { 'aria-label': back, onClick: this.handleClickBack, role: 'button', title: back },
      closeProps: { 'aria-label': close, onClick: this.handleClickClose, role: 'button', title: close },
      primaryProps: { 'aria-label': primaryText, onClick: this.handleClickPrimary, role: 'button', title: primaryText },
      skipProps: { 'aria-label': skip, onClick: this.handleClickSkip, role: 'button', title: skip },
    };

    if (tooltipComponent) {
      const renderProps = {
        ...buttonProps,
        content,
        continuous,
        index,
        isLastStep,
        locale,
        setTooltipRef,
        size,
        title,
      };

      if (React.isValidElement(tooltipComponent)) {
        component = React.cloneElement(tooltipComponent, renderProps);
      }
      else {
        component = tooltipComponent(renderProps);
      }
    }
    else {
      component = (
        <Container
          continuous={continuous}
          index={index}
          isLastStep={isLastStep}
          setTooltipRef={setTooltipRef}
          size={size}
          step={step}
          {...buttonProps}
        />
      );
    }

    return component;
  }
}
