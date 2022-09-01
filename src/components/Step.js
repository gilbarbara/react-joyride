import React from 'react';
import PropTypes from 'prop-types';
import Floater from 'react-floater';
import treeChanges from 'tree-changes';
import is from 'is-lite';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '../constants';

import { getElement, isElementVisible, hasPosition } from '../modules/dom';
import { log, hideBeacon } from '../modules/helpers';
import { componentTypeWithRefs } from '../modules/propTypes';
import Scope from '../modules/scope';
import { validateStep } from '../modules/step';

import Beacon from './Beacon';
import Overlay from './Overlay';
import Tooltip from './Tooltip/index';
import Portal from './Portal';

export default class JoyrideStep extends React.Component {
  scope = { removeScope: () => {} };

  static propTypes = {
    action: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    continuous: PropTypes.bool.isRequired,
    controlled: PropTypes.bool.isRequired,
    debug: PropTypes.bool.isRequired,
    helpers: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lifecycle: PropTypes.string.isRequired,
    nonce: PropTypes.string,
    setPopper: PropTypes.func.isRequired,
    shouldScroll: PropTypes.bool.isRequired,
    size: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    step: PropTypes.shape({
      beaconComponent: componentTypeWithRefs,
      content: PropTypes.node.isRequired,
      disableBeacon: PropTypes.bool,
      disableOverlay: PropTypes.bool,
      disableOverlayClose: PropTypes.bool,
      disableScrolling: PropTypes.bool,
      disableScrollParentFix: PropTypes.bool,
      event: PropTypes.string,
      floaterProps: PropTypes.shape({
        options: PropTypes.object,
        styles: PropTypes.object,
        wrapperOptions: PropTypes.object,
      }),
      hideBackButton: PropTypes.bool,
      hideCloseButton: PropTypes.bool,
      hideFooter: PropTypes.bool,
      isFixed: PropTypes.bool,
      locale: PropTypes.object,
      offset: PropTypes.number.isRequired,
      placement: PropTypes.oneOf([
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
        'auto',
        'center',
      ]),
      spotlightClicks: PropTypes.bool,
      spotlightPadding: PropTypes.number,
      styles: PropTypes.object,
      target: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
      title: PropTypes.node,
      tooltipComponent: componentTypeWithRefs,
    }).isRequired,
    update: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { debug, index } = this.props;

    log({
      title: `step:${index}`,
      data: [{ key: 'props', value: this.props }],
      debug,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      action,
      callback,
      continuous,
      controlled,
      debug,
      index,
      lifecycle,
      size,
      status,
      step,
      update,
    } = this.props;
    const { changed, changedFrom } = treeChanges(prevProps, this.props);
    const state = { action, controlled, index, lifecycle, size, status };

    const skipBeacon =
      continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);
    const hasStoreChanged =
      changed('action') || changed('index') || changed('lifecycle') || changed('status');
    const hasStarted = changedFrom(
      'lifecycle',
      [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT],
      LIFECYCLE.INIT,
    );
    const isAfterAction = changed('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction && (hasStarted || controlled)) {
      callback({
        ...state,
        index: prevProps.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: prevProps.step,
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
      update({ lifecycle: LIFECYCLE.READY });
    }

    // There's a step to use, but there's no target in the DOM
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
        console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step); //eslint-disable-line no-console
        callback({
          ...state,
          type: EVENTS.TARGET_NOT_FOUND,
          step,
        });

        if (!controlled) {
          update({ index: index + ([ACTIONS.PREV].includes(action) ? -1 : 1) });
        }
      }
    }

    if (changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
      update({ lifecycle: hideBeacon(step) || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON });
    }

    if (changed('index')) {
      log({
        title: `step:${lifecycle}`,
        data: [{ key: 'props', value: this.props }],
        debug,
      });
    }

    /* istanbul ignore else */
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

      this.scope = new Scope(this.tooltip, { selector: '[data-action=primary]' });
      this.scope.setFocus();
    }

    if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
      this.scope.removeScope();
      delete this.beaconPopper;
      delete this.tooltipPopper;
    }
  }

  componentWillUnmount() {
    this.scope.removeScope();
  }

  /**
   * Beacon click/hover event listener
   *
   * @param {Event} e
   */
  handleClickHoverBeacon = e => {
    const { step, update } = this.props;

    if (e.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    update({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  handleClickOverlay = () => {
    const { helpers, step } = this.props;

    if (!step.disableOverlayClose) {
      helpers.close();
    }
  };

  setTooltipRef = c => {
    this.tooltip = c;
  };

  setPopper = (popper, type) => {
    const { action, setPopper, update } = this.props;

    if (type === 'wrapper') {
      this.beaconPopper = popper;
    } else {
      this.tooltipPopper = popper;
    }

    setPopper(popper, type);

    if (this.beaconPopper && this.tooltipPopper) {
      update({
        action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : action,
        lifecycle: LIFECYCLE.READY,
      });
    }
  };

  get open() {
    const { step, lifecycle } = this.props;

    return !!(hideBeacon(step) || lifecycle === LIFECYCLE.TOOLTIP);
  }

  render() {
    const { continuous, debug, helpers, index, lifecycle, nonce, shouldScroll, size, step } =
      this.props;
    const target = getElement(step.target);

    if (!validateStep(step) || !is.domElement(target)) {
      return null;
    }

    return (
      <div key={`JoyrideStep-${index}`} className="react-joyride__step">
        <Portal id="react-joyride-portal">
          <Overlay
            {...step}
            debug={debug}
            lifecycle={lifecycle}
            onClickOverlay={this.handleClickOverlay}
          />
        </Portal>
        <Floater
          component={
            <Tooltip
              continuous={continuous}
              helpers={helpers}
              index={index}
              isLastStep={index + 1 === size}
              setTooltipRef={this.setTooltipRef}
              size={size}
              step={step}
            />
          }
          debug={debug}
          getPopper={this.setPopper}
          id={`react-joyride-step-${index}`}
          isPositioned={step.isFixed || hasPosition(target)}
          open={this.open}
          placement={step.placement}
          target={step.target}
          {...step.floaterProps}
        >
          <Beacon
            beaconComponent={step.beaconComponent}
            locale={step.locale}
            nonce={nonce}
            onClickOrHover={this.handleClickHoverBeacon}
            shouldFocus={shouldScroll}
            styles={step.styles}
          />
        </Floater>
      </div>
    );
  }
}
