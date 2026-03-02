import { useState } from 'react';
import { useMount } from '@gilbarbara/hooks';
import is from 'is-lite';

import useFocusTrap from '~/hooks/useFocusTrap';
import { LIFECYCLE } from '~/literals';
import { getElement } from '~/modules/dom';
import { logDebug } from '~/modules/helpers';
import { validateStep } from '~/modules/step';

import { StepProps } from '~/types';

import Floater from './Floater';

export default function JoyrideStep(props: StepProps) {
  const {
    continuous,
    controls,
    debug,
    index,
    lifecycle,
    nonce,
    portalElement,
    scrolling,
    setPositionData,
    shouldScroll,
    size,
    step,
    updateState,
  } = props;
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);

  useFocusTrap(step.disableFocusTrap ? null : tooltipElement, '[data-action=primary]');

  useMount(() => {
    logDebug({
      title: `step:${index}`,
      data: [{ key: 'props', value: props }],
      debug,
    });
  });

  const target = getElement(step.target);
  const open = lifecycle === LIFECYCLE.TOOLTIP && !scrolling;

  if (!validateStep(step) || !is.domElement(target)) {
    return null;
  }

  return (
    <div className="react-joyride__step">
      <Floater
        key={`JoyrideStep-${index}`}
        continuous={continuous}
        controls={controls}
        index={index}
        lifecycle={lifecycle}
        nonce={nonce}
        open={open}
        portalElement={portalElement}
        setPositionData={setPositionData}
        setTooltipRef={setTooltipElement}
        shouldScroll={shouldScroll}
        size={size}
        step={step}
        target={target}
        updateState={updateState}
      />
    </div>
  );
}
