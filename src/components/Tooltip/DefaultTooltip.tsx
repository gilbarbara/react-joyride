import type { ReactNode } from 'react';

import { getReactNodeText } from '~/modules/helpers';

import type { TooltipRenderProps } from '~/types';

import CloseButton from './CloseButton';

export default function JoyrideDefaultTooltip(props: TooltipRenderProps) {
  const { backProps, closeProps, index, isLastStep, primaryProps, skipProps, step, tooltipProps } =
    props;
  const { buttons, content, styles, title } = step;
  const buttonElements: Record<string, ReactNode> = {};

  if (buttons.includes('primary')) {
    buttonElements.primary = (
      <button
        data-testid="button-primary"
        style={styles.buttonPrimary}
        type="button"
        {...primaryProps}
      />
    );
  }

  if (buttons.includes('skip') && !isLastStep) {
    buttonElements.skip = (
      <button
        aria-live="off"
        data-testid="button-skip"
        style={styles.buttonSkip}
        type="button"
        {...skipProps}
      />
    );
  }

  if (buttons.includes('back') && index > 0) {
    buttonElements.back = (
      <button data-testid="button-back" style={styles.buttonBack} type="button" {...backProps} />
    );
  }

  buttonElements.close = buttons.includes('close') && (
    <CloseButton data-testid="button-close" styles={styles.buttonClose} {...closeProps} />
  );

  const ariaProps = title
    ? { 'aria-labelledby': 'joyride-tooltip-title', 'aria-describedby': 'joyride-tooltip-content' }
    : { 'aria-label': getReactNodeText(content), 'aria-describedby': 'joyride-tooltip-content' };

  return (
    <div
      key="JoyrideTooltip"
      className="react-joyride__tooltip"
      data-joyride-step={index}
      {...(step.id && { 'data-joyride-id': step.id })}
      style={styles.tooltip}
      {...tooltipProps}
      {...ariaProps}
    >
      <div style={styles.tooltipContainer}>
        {title && (
          <h4 id="joyride-tooltip-title" style={styles.tooltipTitle}>
            {title}
          </h4>
        )}
        <div id="joyride-tooltip-content" style={styles.tooltipContent}>
          {content}
        </div>
      </div>
      {buttons.some(b => b === 'back' || b === 'primary' || b === 'skip') && (
        <div style={styles.tooltipFooter}>
          <div style={styles.tooltipFooterSpacer}>{buttonElements.skip}</div>
          {buttonElements.back}
          {buttonElements.primary}
        </div>
      )}
      {buttonElements.close}
    </div>
  );
}
