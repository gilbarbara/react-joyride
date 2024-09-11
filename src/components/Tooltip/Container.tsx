import * as React from 'react';

import { getText } from '~/modules/helpers';

import { TooltipRenderProps } from '~/types';

import CloseButton from './CloseButton';

function JoyrideTooltipContainer(props: TooltipRenderProps) {
  const { backProps, closeProps, index, isLastStep, primaryProps, skipProps, step, tooltipProps } =
    props;
  const { content, hideBackButton, hideCloseButton, hideFooter, showSkipButton, styles, title } =
    step;
  const output: Record<string, React.ReactNode> = {
    primary: primaryProps.title,
  };

  if (output.primary) {
    output.primary = (
      <button
        data-test-id="button-primary"
        style={styles.buttonNext}
        type="button"
        {...primaryProps}
      >
        {output.primary}
      </button>
    );
  }

  if (showSkipButton && !isLastStep) {
    output.skip = (
      <button
        aria-live="off"
        data-test-id="button-skip"
        style={styles.buttonSkip}
        type="button"
        {...skipProps}
      >
        {skipProps.title}
      </button>
    );
  }

  if (!hideBackButton && index > 0) {
    output.back = (
      <button data-test-id="button-back" style={styles.buttonBack} type="button" {...backProps}>
        {backProps.title}
      </button>
    );
  }

  output.close = !hideCloseButton && (
    <CloseButton data-test-id="button-close" styles={styles.buttonClose} {...closeProps} />
  );

  return (
    <div
      key="JoyrideTooltip"
      aria-label={getText(title) || getText(content)}
      className="react-joyride__tooltip"
      style={styles.tooltip}
      {...tooltipProps}
    >
      <div style={styles.tooltipContainer}>
        {title && (
          <h1 aria-label={getText(title)} style={styles.tooltipTitle}>
            {title}
          </h1>
        )}
        <div style={styles.tooltipContent}>{content}</div>
      </div>
      {!hideFooter && (
        <div style={styles.tooltipFooter}>
          <div style={styles.tooltipFooterSpacer}>{output.skip}</div>
          {output.back}
          {output.primary}
        </div>
      )}
      {output.close}
    </div>
  );
}

export default JoyrideTooltipContainer;
