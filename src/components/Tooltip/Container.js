import React from 'react';
import PropTypes from 'prop-types';

import CloseBtn from './CloseBtn';

const JoyrideTooltipContainer = ({
  continuous,
  handleClickBack,
  handleClickClose,
  handleClickPrimary,
  handleClickSkip,
  index,
  isLastStep,
  step,
}) => {
  const { content, hideBackButton, locale, showSkipButton, title, styles } = step;
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
  }

  if (showSkipButton && !isLastStep) {
    output.skip = (<button style={styles.buttonSkip} onClick={handleClickSkip}>{skip}</button>);
  }

  if (!hideBackButton && index > 0) {
    output.back = (<button style={styles.buttonBack} onClick={handleClickBack}>{back}</button>);
  }

  output.close = (<CloseBtn handleClick={handleClickClose} styles={styles.buttonClose} />);

  return (
    <div
      key="JoyrideTooltip"
      style={styles.tooltip}
    >
      <div style={styles.tooltipContainer}>
        {output.close}
        {title && (<h4 style={styles.tooltipTitle}>{title}</h4>)}
        {content && (
          <div style={styles.tooltipContent}>
            {content}
          </div>
        )}
      </div>
      <div style={styles.tooltipFooter}>
        {output.skip}
        {output.back}
        <button style={styles.buttonNext} onClick={handleClickPrimary}>{output.primary}</button>
      </div>
    </div>
  );
};


JoyrideTooltipContainer.propTypes = {
  continuous: PropTypes.bool.isRequired,
  handleClickBack: PropTypes.func.isRequired,
  handleClickClose: PropTypes.func.isRequired,
  handleClickPrimary: PropTypes.func.isRequired,
  handleClickSkip: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  step: PropTypes.object.isRequired,
};

export default JoyrideTooltipContainer;
