import * as React from 'react';

import { getText } from '~/modules/helpers';

import { TooltipRenderProps } from '~/types';

import CloseButton from './CloseButton';

function JoyrideTooltipContainer(props: TooltipRenderProps) {
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
  } = props;
  const {
    content,
    hideBackButton,
    hideCloseButton,
    hideFooter,
    locale,
    showProgress,
    showSkipButton,
    styles,
    title,
  } = step;
  const { back, close, last, next, skip } = locale;
  const output: Record<string, React.ReactNode> = {
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
        {skip}
      </button>
    );
  }

  if (!hideBackButton && index > 0) {
    output.back = (
      <button data-test-id="button-back" style={styles.buttonBack} type="button" {...backProps}>
        {back}
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
