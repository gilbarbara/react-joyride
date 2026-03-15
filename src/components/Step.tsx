import { useState } from 'react';
import is from 'is-lite';

import useFocusTrap from '~/hooks/useFocusTrap';
import { LIFECYCLE } from '~/literals';
import { getElement } from '~/modules/dom';
import { validateStep } from '~/modules/step';
import type { StoreState } from '~/modules/store';

import type { Controls, PositionData, Simplify, StepMerged } from '~/types';

import Floater from './Floater';

type StepProps = Simplify<
  StoreState & {
    continuous: boolean;
    controls: Controls;
    debug: boolean;
    nonce?: string;
    portalElement: HTMLElement | null;
    setPositionData: (name: 'beacon' | 'tooltip', data: PositionData) => void;
    shouldScroll: boolean;
    step: StepMerged;
    updateState: (state: Partial<StoreState>) => void;
  }
>;

export default function JoyrideStep(props: StepProps) {
  const {
    continuous,
    controls,
    index,
    lifecycle,
    nonce,
    portalElement,
    setPositionData,
    shouldScroll,
    size,
    step,
    updateState,
  } = props;
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);

  useFocusTrap(step.disableFocusTrap ? null : tooltipElement, '[data-action=primary]');

  const target = getElement(step.target);
  const open = lifecycle === LIFECYCLE.TOOLTIP;

  if (!validateStep(step) || !is.domElement(target)) {
    return null;
  }

  return (
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
  );
}
