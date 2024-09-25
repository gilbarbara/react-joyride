import { MouseEvent, useEffect, useRef } from 'react';
import Floater, { CustomComponentProps } from 'react-floater';
import { useMount, useUnmount } from '@gilbarbara/hooks';
import is from 'is-lite';
import useTreeChanges from 'tree-changes-hook';

import { getElement } from '~/modules/dom';
import { log } from '~/modules/helpers';
import Scope from '~/modules/scope';
import { validateStep } from '~/modules/step';

import { LIFECYCLE, PORTAL_ELEMENT_ID } from '~/literals';

import { StepProps } from '~/types';

import Beacon from './Beacon';
import Tooltip from './Tooltip/index';

export default function JoyrideStep(props: StepProps) {
  const {
    cleanupPoppers,
    continuous,
    debug,
    helpers,
    index,
    lifecycle,
    nonce,
    setPopper,
    shouldScroll,
    size,
    step,
    updateState,
  } = props;
  const scopeRef = useRef<Scope | null>(null);
  const tooltipRef = useRef<HTMLElement | null>(null);
  const { changed, changedFrom } = useTreeChanges(props);

  useMount(() => {
    log({
      title: `step:${index}`,
      data: [{ key: 'props', value: props }],
      debug,
    });
  });

  useUnmount(() => {
    scopeRef.current?.removeScope();
  });

  useEffect(() => {
    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      if (shouldScroll && tooltipRef.current) {
        scopeRef.current = new Scope(tooltipRef.current, { selector: '[data-action=primary]' });
        scopeRef.current.setFocus();
      }
    }

    if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      scopeRef.current?.removeScope();
      cleanupPoppers();
    }
  }, [changed, changedFrom, cleanupPoppers, shouldScroll]);

  const handleClickHoverBeacon = (event: MouseEvent<HTMLElement>) => {
    if (event.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    updateState({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  const setTooltipRef = (element: HTMLElement) => {
    tooltipRef.current = element;
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
        setTooltipRef={setTooltipRef}
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
        open={lifecycle === LIFECYCLE.TOOLTIP}
        placement={step.placement}
        portalElement={`#${PORTAL_ELEMENT_ID}`}
        target={step.target}
      >
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
      </Floater>
    </div>
  );
}
