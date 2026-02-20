import { MouseEvent, useEffect, useState } from 'react';
import Floater, { CustomComponentProps } from 'react-floater';
import { useMount } from '@gilbarbara/hooks';
import is from 'is-lite';
import useTreeChanges from 'tree-changes-hook';

import useFocusTrap from '~/hooks/useFocusTrap';
import { LIFECYCLE } from '~/literals';
import { getElement } from '~/modules/dom';
import { logDebug } from '~/modules/helpers';
import { validateStep } from '~/modules/step';

import { StepProps } from '~/types';

import Beacon from './Beacon';
import Tooltip from './Tooltip';

export default function JoyrideStep(props: StepProps) {
  const {
    cleanupPoppers,
    continuous,
    debug,
    helpers,
    index,
    lifecycle,
    nonce,
    portalElement,
    scrolling,
    setPopper,
    shouldScroll,
    size,
    step,
    updateState,
  } = props;
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null);
  const { changedFrom } = useTreeChanges(props);

  const open = lifecycle === LIFECYCLE.TOOLTIP && !scrolling;

  useFocusTrap(step.disableFocusTrap ? null : tooltipElement, '[data-action=primary]');

  useMount(() => {
    logDebug({
      title: `step:${index}`,
      data: [{ key: 'props', value: props }],
      debug,
    });
  });

  useEffect(() => {
    if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      cleanupPoppers();
    }
  }, [changedFrom, cleanupPoppers]);

  const handleClickHoverBeacon = (event: MouseEvent<HTMLElement>) => {
    if (event.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    updateState({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  const target = getElement(step.target);

  if (!validateStep(step) || !is.domElement(target)) {
    return null;
  }

  const tooltip = (renderProps: CustomComponentProps) => {
    return (
      <Tooltip
        continuous={continuous}
        helpers={helpers}
        index={index}
        isLastStep={index + 1 === size}
        setTooltipRef={setTooltipElement}
        size={size}
        step={step}
        {...renderProps}
      />
    );
  };

  return (
    <div className="react-joyride__step">
      <Floater
        key={`JoyrideStep-${index}`}
        {...step.floaterProps}
        component={tooltip}
        debug={debug}
        getPopper={setPopper}
        id={`react-joyride-step-${index}`}
        open={open}
        placement={step.placement}
        portalElement={portalElement}
        target={target}
      >
        {lifecycle !== LIFECYCLE.TOOLTIP && (
          <Beacon
            beaconComponent={step.beaconComponent}
            continuous={continuous}
            index={index}
            isLastStep={index + 1 === size}
            locale={step.locale}
            nonce={nonce}
            onClickOrHover={handleClickHoverBeacon}
            shouldFocus={shouldScroll}
            size={size}
            step={step}
            styles={step.styles}
          />
        )}
      </Floater>
    </div>
  );
}
