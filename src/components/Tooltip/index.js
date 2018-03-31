import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

export default class JoyrideTooltip extends React.Component {
  static propTypes = {
    continuous: PropTypes.bool.isRequired,
    helpers: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isLastStep: PropTypes.bool.isRequired,
    step: PropTypes.object.isRequired,
  };

  handleClickBack = (e) => {
    e.preventDefault();

    this.props.helpers.prev();
  };

  handleClickClose = (e) => {
    e.preventDefault();

    this.props.helpers.close();
  };

  handleClickPrimary = (e) => {
    e.preventDefault();
    const { continuous } = this.props;

    if (!continuous) {
      this.props.helpers.close();
      return;
    }

    this.props.helpers.next();
  };

  handleClickSkip = (e) => {
    e.preventDefault();

    this.props.helpers.skip();
  };

  render() {
    const { continuous, index, isLastStep, step } = this.props;
    const { content, locale, title, tooltipComponent } = step;
    const { back, close, last, next, skip } = locale;
    let primaryText = continuous ? next : close;

    if (isLastStep) {
      primaryText = last;
    }

    let component;
    const props = {
      backProps: { 'aria-label': back, onClick: this.handleClickBack, role: 'button', title: back },
      closeProps: { 'aria-label': close, onClick: this.handleClickClose, role: 'button', title: close },
      primaryProps: { 'aria-label': primaryText, onClick: this.handleClickPrimary, role: 'button', title: primaryText },
      skipProps: { 'aria-label': skip, onClick: this.handleClickSkip, role: 'button', title: skip },
    };

    if (tooltipComponent) {
      const renderProps = {
        ...props,
        content,
        continuous,
        index,
        isLastStep,
        locale,
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
          step={step}
          {...props}
        />
      );
    }

    return component;
  }
}
