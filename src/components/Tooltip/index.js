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

    if (step.tooltipComponent) {
      console.log(step.tooltipComponent);
      return null;
    }

    return (
      <Container
        continuous={continuous}
        handleClickBack={this.handleClickBack}
        handleClickClose={this.handleClickClose}
        handleClickPrimary={this.handleClickPrimary}
        handleClickSkip={this.handleClickSkip}
        index={index}
        isLastStep={isLastStep}
        step={step}
      />
    );
  }
}
