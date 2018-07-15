import React from 'react';
import PropTypes from 'prop-types';

import CloseBtn from './CloseBtn';

const JoyrideTooltipContainer = ({
  continuous,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  index,
  isLastStep,
  setTooltipRef,
  size,
  step,
}) => {
  const { content, hideBackButton, locale, showProgress, showSkipButton, title, styles } = step;
  const { back, close, last, next, skip } = locale;
  const output = {
    primary: close,
  };

  if (continuous) {
    if (isLastStep) {
      output.primary = last;
    }
    else {
      output.primary = next;
    }

    if (showProgress) {
      output.primary += ` (${index + 1}/${size})`;
    }
  }

  if (showSkipButton && !isLastStep) {
    output.skip = (
      <button
        style={styles.buttonSkip}
        type="button"
        {...skipProps}
      >
        {skip}
      </button>
    );
  }

  if (!hideBackButton && index > 0) {
    output.back = (
      <button
        style={styles.buttonBack}
        type="button"
        {...backProps}
      >
        {back}
      </button>
    );
  }

  output.close = (<CloseBtn {...closeProps} styles={styles.buttonClose} />);

  return (
    <div
      key="JoyrideTooltip"
      ref={setTooltipRef}
      style={styles.tooltip}
    >
      <div style={styles.tooltipContainer}>
        {output.close}
        {title && (<h4 style={styles.tooltipTitle}>{title}</h4>)}
        {!!content && (
          <div style={styles.tooltipContent}>
            {content}
          </div>
        )}
      </div>
      <div style={styles.tooltipFooter}>
        {output.skip}
        {output.back}
        <button
          style={styles.buttonNext}
          type="button"
          {...primaryProps}
        >
          {output.primary}
        </button>
      </div>
    </div>
  );
};

JoyrideTooltipContainer.propTypes = {
  backProps: PropTypes.object.isRequired,
  closeProps: PropTypes.object.isRequired,
  continuous: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  primaryProps: PropTypes.object.isRequired,
  setTooltipRef: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  skipProps: PropTypes.object.isRequired,
  step: PropTypes.object.isRequired,
};

export default JoyrideTooltipContainer;
