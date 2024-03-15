import * as React from 'react';
import Floater, { Props as FloaterProps, RenderProps } from 'react-floater';
import is from 'is-lite';
import treeChanges from 'tree-changes';

import { getElement, isElementVisible } from '~/modules/dom';
import { hideBeacon, log } from '~/modules/helpers';
import Scope from '~/modules/scope';
import { validateStep } from '~/modules/step';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';

import { StepProps } from '~/types';

import Beacon from './Beacon';
import Tooltip from './Tooltip/index';

export default class JoyrideStep extends React.Component<StepProps> {
  scope: Scope | null = null;
  tooltip: HTMLElement | null = null;

  componentDidMount() {
    const { debug, index } = this.props;

    log({
      title: `step:${index}`,
      data: [{ key: 'props', value: this.props }],
      debug,
    });
  }

  componentDidUpdate(previousProps: StepProps) {
    const {
      action,
      callback,
      continuous,
      controlled,
      debug,
      helpers,
      index,
      lifecycle,
      status,
      step,
      store,
    } = this.props;
    const { changed, changedFrom } = treeChanges(previousProps, this.props);
    const state = helpers.info();

    const skipBeacon =
      continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);
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
      callback({
        ...state,
        index: previousProps.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousProps.step,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (
      step.placement === 'center' &&
      status === STATUS.RUNNING &&
      changed('index') &&
      action !== ACTIONS.START &&
      lifecycle === LIFECYCLE.INIT
    ) {
      store.update({ lifecycle: LIFECYCLE.READY });
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
          callback({
            ...state,
            step,
            type: EVENTS.STEP_BEFORE,
          });
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step);
        callback({
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
        lifecycle: hideBeacon(step) || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON,
      });
    }

    if (changed('index')) {
      log({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: this.props }],
        debug,
      });
    }

    if (changed('lifecycle', LIFECYCLE.BEACON)) {
      callback({
        ...state,
        step,
        type: EVENTS.BEACON,
      });
    }

    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      callback({
        ...state,
        step,
        type: EVENTS.TOOLTIP,
      });

      if (this.tooltip) {
        this.scope = new Scope(this.tooltip, { selector: '[data-action=primary]' });
        this.scope.setFocus();
      }
    }

    if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      this.scope?.removeScope();
      store.cleanupPoppers();
    }
  }

  componentWillUnmount() {
    this.scope?.removeScope();
  }

  /**
   * Beacon click/hover event listener
   */
  handleClickHoverBeacon = (event: React.MouseEvent<HTMLElement>) => {
    const { step, store } = this.props;

    if (event.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    store.update({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  setTooltipRef = (element: HTMLElement) => {
    this.tooltip = element;
  };

  setPopper: FloaterProps['getPopper'] = (popper, type) => {
    const { action, lifecycle, step, store } = this.props;

    if (type === 'wrapper') {
      store.setPopper('beacon', popper);
    } else {
      store.setPopper('tooltip', popper);
    }

    if (store.getPopper('beacon') && store.getPopper('tooltip') && lifecycle === LIFECYCLE.INIT) {
      store.update({
        action,
        lifecycle: LIFECYCLE.READY,
      });
    }

    if (step.floaterProps?.getPopper) {
      step.floaterProps.getPopper(popper, type);
    }
  };

  get open() {
    const { lifecycle, step } = this.props;

    return hideBeacon(step) || lifecycle === LIFECYCLE.TOOLTIP;
  }

  renderTooltip = (renderProps: RenderProps) => {
    const { continuous, helpers, index, size, step } = this.props;

    return (
      <Tooltip
        continuous={continuous}
        helpers={helpers}
        index={index}
        isLastStep={index + 1 === size}
        setTooltipRef={this.setTooltipRef}
        size={size}
        step={step}
        {...renderProps}
      />
    );
  };

  render() {
    const { continuous, debug, index, nonce, shouldScroll, size, step } = this.props;
    const target = getElement(step.target);

    if (!validateStep(step) || !is.domElement(target)) {
      return null;
    }

    return (
      <div key={`JoyrideStep-${index}`} className="react-joyride__step">
        <Floater
          {...step.floaterProps}
          component={this.renderTooltip}
          debug={debug}
          getPopper={this.setPopper}
          id={`react-joyride-step-${index}`}
          open={this.open}
          placement={step.placement}
          target={step.target}
        >
          <Beacon
            beaconComponent={step.beaconComponent}
            continuous={continuous}
            index={index}
            isLastStep={index + 1 === size}
            locale={step.locale}
            nonce={nonce}
            onClickOrHover={this.handleClickHoverBeacon}
            shouldFocus={shouldScroll}
            size={size}
            step={step}
            styles={step.styles}
          />
        </Floater>
      </div>
    );
  }
}
