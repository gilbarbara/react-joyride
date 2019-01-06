import React from 'react';
import PropTypes from 'prop-types';

import CloseBtn from './CloseBtn';

export default class JoyrideTooltipContainer extends React.Component {
  static propTypes = {
    backProps: PropTypes.object.isRequired,
    closeProps: PropTypes.object.isRequired,
    continuous: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    isLastStep: PropTypes.bool.isRequired,
    primaryProps: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired,
    skipProps: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    tooltipProps: PropTypes.object.isRequired,
  };

  render() {
    const {
      backProps,
      closeProps,
      continuous,
      index,
      isLastStep,
      primaryProps,
      size,
      skipProps,
      step,
      tooltipProps,
    } = this.props;
    const {
      content,
      hideBackButton,
      hideCloseButton,
      hideFooter,
      showProgress,
      showSkipButton,
      title,
      styles,
    } = step;
    const { back, close, last, next, skip } = step.locale;
    const output = {
      primary: close,
    };

    if (continuous) {
      output.primary = isLastStep ? last : next;

      if (showProgress) {
        output.primary = (
          <span>
            {output.primary} ({index + 1}/{size})
          </span>
        );
      }
    }

    if (showSkipButton && !isLastStep) {
      output.skip = (
        <button
          style={styles.buttonSkip}
          type="button"
          data-test-id="button-skip"
          aria-live="off"
          {...skipProps}
        >
          {skip}
        </button>
      );
    }

    if (!hideBackButton && index > 0) {
      output.back = (
        <button style={styles.buttonBack} type="button" data-test-id="button-back" {...backProps}>
          {back}
        </button>
      );
    }

    output.close = !hideCloseButton && (
      <CloseBtn styles={styles.buttonClose} data-test-id="button-close" {...closeProps} />
    );

    return (
      <div
        key="JoyrideTooltip"
        className="react-joyride__tooltip"
        style={styles.tooltip}
        {...tooltipProps}
      >
        <div style={styles.tooltipContainer}>
          {title && (
            <h4 style={styles.tooltipTitle} aria-label={title}>
              {title}
            </h4>
          )}
          <div style={styles.tooltipContent}>{content}</div>
        </div>
        {!hideFooter && (
          <div style={styles.tooltipFooter}>
            <div style={styles.tooltipFooterSpacer}>{output.skip}</div>
            {output.back}
            <button
              style={styles.buttonNext}
              type="button"
              data-test-id="button-primary"
              {...primaryProps}
            >
              {output.primary}
            </button>
          </div>
        )}
        {output.close}
      </div>
    );
  }
}
