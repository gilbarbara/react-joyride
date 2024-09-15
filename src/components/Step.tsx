import { MouseEvent, useEffect, useRef } from 'react';
import Floater, { CustomComponentProps } from 'react-floater';
import { useMount, usePrevious, useUnmount, useUpdateEffect } from '@gilbarbara/hooks';
import is from 'is-lite';
import treeChanges from 'tree-changes';

import { getElement, isElementVisible } from '~/modules/dom';
import { hideBeacon, log } from '~/modules/helpers';
import Scope from '~/modules/scope';
import { validateStep } from '~/modules/step';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';

import { FloaterProps, StepProps } from '~/types';

import Beacon from './Beacon';
import Tooltip from './Tooltip/index';

export default function JoyrideStep(props: StepProps) {
  const {
    action,
    callback,
    continuous,
    controlled,
    debug,
    helpers,
    index,
    lifecycle,
    nonce,
    shouldScroll,
    size,
    status,
    step,
    store,
  } = props;
  const scopeRef = useRef<Scope | null>(null);
  const tooltipRef = useRef<HTMLElement | null>(null);
  const previousProps = usePrevious(props);
  const { changed, changedFrom } = treeChanges(previousProps ?? {}, props);

  const { placement } = step;

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

  /**
   * Handle placement "center"
   */
  useEffect(() => {
    if (placement === 'center' && status === STATUS.RUNNING && lifecycle === LIFECYCLE.INIT) {
      store.update({
        action,
        lifecycle: LIFECYCLE.READY,
      });
    }
  }, [action, lifecycle, placement, status, store]);

  useUpdateEffect(() => {
    if (!previousProps) {
      return;
    }

    const state = helpers.info();

    const hasStoreChanged =
      changed('action') || changed('index') || changed('lifecycle') || changed('status');
    const isInitial = changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT);
    const isAfterAction = changed('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);
    const isControlled = controlled && index === previousProps.index;

    if (isAfterAction && (isInitial || isControlled)) {
      callback?.({
        ...state,
        index: previousProps.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousProps.step,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (hasStoreChanged) {
      const element = getElement(step.target);
      const elementExists = !!element;
      const hasRenderedTarget = elementExists && isElementVisible(element);

      if (hasRenderedTarget) {
        if (
          changedFrom('status', STATUS.READY, STATUS.RUNNING) ||
          changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)
        ) {
          callback?.({
            ...state,
            step,
            type: EVENTS.STEP_BEFORE,
          });
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step);
        callback?.({
          ...state,
          type: EVENTS.TARGET_NOT_FOUND,
          step,
        });

        if (!controlled) {
          store.update({ index: index + (action === ACTIONS.PREV ? -1 : 1) });
        }
      }
    }

    if (changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
      store.update({
        lifecycle: hideBeacon(step, state, continuous) ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON,
      });
    }

    if (changed('index')) {
      log({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: props }],
        debug,
      });
    }

    if (changed('lifecycle', LIFECYCLE.BEACON)) {
      callback?.({
        ...state,
        step,
        type: EVENTS.BEACON,
      });
    }

    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      callback?.({
        ...state,
        step,
        type: EVENTS.TOOLTIP,
      });

      if (shouldScroll && tooltipRef.current) {
        scopeRef.current = new Scope(tooltipRef.current, { selector: '[data-action=primary]' });
        scopeRef.current.setFocus();
      }
    }

    if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      scopeRef.current?.removeScope();
      store.cleanupPoppers();
    }
  }, [
    action,
    callback,
    changed,
    changedFrom,
    continuous,
    controlled,
    debug,
    helpers,
    index,
    lifecycle,
    previousProps,
    props,
    shouldScroll,
    step,
    store,
  ]);

  const handleClickHoverBeacon = (event: MouseEvent<HTMLElement>) => {
    if (event.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    store.update({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  const setPopper: FloaterProps['getPopper'] = (popper, type) => {
    if (type === 'wrapper') {
      store.setPopper('beacon', popper);
    } else {
      store.setPopper('tooltip', popper);
    }

    if ((store.getPopper('beacon') || store.getPopper('tooltip')) && lifecycle === LIFECYCLE.INIT) {
      store.update({
        action,
        lifecycle: LIFECYCLE.READY,
      });
    }

    if (step.floaterProps?.getPopper) {
      step.floaterProps.getPopper(popper, type);
    }
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
    <div key={`JoyrideStep-${index}`} className="react-joyride__step">
      <Floater
        {...step.floaterProps}
        component={tooltip}
        debug={debug}
        getPopper={setPopper}
        id={`react-joyride-step-${index}`}
        open={lifecycle === LIFECYCLE.TOOLTIP}
        placement={step.placement}
        portalElement="#react-joyride-portal"
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
