import React from 'react';
import PropTypes from 'prop-types';
import deep from 'deep-diff';
import treeChanges from 'tree-changes';
import is from '@sindresorhus/is';

import State from '../modules/state';
import { getElement, getElementScrollY, isFixed, scrollTo } from '../modules/dom';
import { log } from '../modules/helpers';
import { getMergedStep, validateSteps } from '../modules/step';

import ACTIONS from '../constants/actions';
import EVENTS from '../constants/events';
import LIFECYCLE from '../constants/lifecycle';
import STATUS from '../constants/status';

import Step from './Step';

let hasTouch = false;

class Joyride extends React.Component {
  constructor(props) {
    super(props);

    this.store = new State({
      ...props,
      controlled: props.run && is.number(props.stepIndex),
    });
    this.state = this.store.getState();
    this.helpers = this.store.getHelpers();
  }

  static propTypes = {
    allowClicksThruHole: PropTypes.bool,
    beaconComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]),
    callback: PropTypes.func,
    continuous: PropTypes.bool,
    debug: PropTypes.bool,
    disableBeacon: PropTypes.bool,
    disableCloseOnEsc: PropTypes.bool,
    disableOverlay: PropTypes.bool,
    disableOverlayClicks: PropTypes.bool,
    disableScrollToSteps: PropTypes.bool,
    hideBackButton: PropTypes.bool,
    holePadding: PropTypes.number,
    locale: PropTypes.object,
    offsetParent: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    run: PropTypes.bool,
    scrollOffset: PropTypes.number,
    scrollToFirstStep: PropTypes.bool,
    showProgress: PropTypes.bool,
    showSkipButton: PropTypes.bool,
    stepIndex: PropTypes.number,
    steps: PropTypes.array,
    tooltipComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]),
    tooltipOptions: PropTypes.shape({
      offset: PropTypes.number,
    }),
  };

  static defaultProps = {
    allowClicksThruHole: false,
    continuous: false,
    debug: false,
    disableBeacon: false,
    disableCloseOnEsc: false,
    disableOverlay: false,
    disableOverlayClicks: false,
    disableScrollToSteps: false,
    hideBackButton: false,
    holePadding: 10,
    offsetParent: 'body',
    run: false,
    scrollOffset: 20,
    scrollToFirstStep: false,
    showSkipButton: false,
    showProgress: false,
    steps: [],
  };

  componentDidMount() {
    const {
      debug,
      disableCloseOnEsc,
      run,
      steps,
    } = this.props;
    const { start } = this.store;

    log({
      title: 'init',
      data: [
        { key: 'props', value: this.props },
        { key: 'state', value: this.state },
      ],
      debug,
    });

    // Sync the store to this component state.
    this.store.addListener(this.syncState);

    if (validateSteps(steps, debug) && run) {
      start();
    }

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    window.addEventListener('touchstart', function setHasTouch() {
      hasTouch = true;
      // Remove event listener once fired, otherwise it'll kill scrolling
      // performance
      window.removeEventListener('touchstart', setHasTouch);
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    const { action, status } = this.state;
    const { steps, stepIndex } = this.props;
    const { debug, run, steps: nextSteps, stepIndex: nextStepIndex } = nextProps;
    const { setSteps, start, stop, update } = this.store;

    const { changed } = treeChanges(this.props, nextProps);
    const diffProps = deep.diff(this.props, nextProps);

    if (diffProps) {
      log({
        title: 'props',
        data: [
          { key: 'nextProps', value: nextProps },
          { key: 'changed', value: diffProps },
        ],
        debug,
      });

      const stepsChanged = deep.diff(nextSteps, steps);
      const stepIndexChanged = is.number(nextStepIndex) && changed('stepIndex');
      let shouldStart = false;

      /* istanbul ignore else */
      if (changed('run')) {
        if (run) {
          shouldStart = true;
        }
        else {
          stop();
        }
      }

      if (stepsChanged) {
        if (validateSteps(nextSteps, debug)) {
          setSteps(nextSteps);
        }
        else {
          console.warn('Steps are not valid', nextSteps); //eslint-disable-line no-console
        }
      }

      /* istanbul ignore else */
      if (stepIndexChanged) {
        const nextAction = stepIndex < nextStepIndex ? ACTIONS.NEXT : ACTIONS.PREV;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
          update({
            action: ACTIONS.START,
            index: nextStepIndex,
            lifecycle: LIFECYCLE.INIT,
            status: run && STATUS.RUNNING,
          });
        }
        else {
          update({
            action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
            index: nextStepIndex,
            lifecycle: LIFECYCLE.INIT,
          });
        }
      }

      if (shouldStart) {
        start();
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { index } = this.state;
    const { stepIndex, steps } = nextProps;
    const { changed, changedFrom } = treeChanges(this.state, nextState);
    const step = getMergedStep(steps[index], nextProps);

    const isControlled = is.number(stepIndex);
    const hasChangedIndex = changed('index') && changedFrom('lifecycle', LIFECYCLE.TOOLTIP, LIFECYCLE.INIT);
    const isAfterAction = changed('action') && [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ].includes(nextState.action);

    if ((isControlled && isAfterAction) || hasChangedIndex) {
      this.callback({
        ...nextState,
        lifecycle: LIFECYCLE.COMPLETE,
        step,
        type: EVENTS.STEP_AFTER,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { action, index } = this.state;
    const { steps, stepIndex } = this.props;
    const step = getMergedStep(steps[index], this.props);
    const { changed, changedFrom, changedTo } = treeChanges(prevState, this.state);
    const diffState = deep.diff(prevState, this.state);
    const isControlled = is.number(stepIndex);

    if (diffState) {
      log({
        title: 'state',
        data: [
          { key: 'state', value: this.state },
          { key: 'changed', value: diffState },
          { key: 'step', value: step },
        ],
        debug: this.props.debug,
      });

      if (changed('status')) {
        let type = EVENTS.TOUR_STATUS;

        if (changedTo('status', STATUS.FINISHED) || changedTo('status', STATUS.SKIPPED)) {
          type = EVENTS.TOUR_END;
        }
        else if (changedFrom('status', STATUS.READY, STATUS.RUNNING)) {
          type = EVENTS.TOUR_START;
        }

        this.callback({
          ...this.state,
          step,
          type,
        });
      }

      // There's a step to use, but there's no target in the DOM
      if (step) {
        const hasRenderedTarget = Boolean(getElement(step.target));

        if (hasRenderedTarget) {
          if (changedFrom('status', STATUS.READY, STATUS.RUNNING) || changed('index')) {
            this.callback({
              ...this.state,
              step,
              type: EVENTS.STEP_BEFORE,
            });
          }
        }
        else {
          console.warn('Target not mounted', step); //eslint-disable-line no-console
          this.callback({
            ...this.state,
            type: EVENTS.TARGET_NOT_FOUND,
            step,
          });

          if (!isControlled) {
            this.store.update({ index: index + ([ACTIONS.PREV].includes(action) ? -1 : 1) });
          }
        }
      }

      /* istanbul ignore else */
      if (changedTo('lifecycle', LIFECYCLE.BEACON)) {
        this.callback({
          ...this.state,
          step,
          type: EVENTS.BEACON,
        });
      }

      if (changedTo('lifecycle', LIFECYCLE.TOOLTIP)) {
        this.callback({
          ...this.state,
          step,
          type: EVENTS.TOOLTIP,
        });
      }

      if (changedTo('lifecycle', LIFECYCLE.INIT)) {
        delete this.beaconPopper;
        delete this.tooltipPopper;
      }
    }

    this.scrollToStep(prevState);
  }

  componentWillUnmount() {
    const { disableCloseOnEsc } = this.props;

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.removeEventListener('keydown', this.handleKeyboardNavigation);
    }
  }

  /**
   * Trigger the callback.
   *
   * @private
   * @param {Object} data
   */
  callback(data) {
    const { callback } = this.props;

    /* istanbul ignore else */
    if (is.function(callback)) {
      callback(data);
    }
  }

  scrollToStep(prevState) {
    const { index, lifecycle, status } = this.state;
    const { debug, disableScrollToSteps, scrollToFirstStep, scrollOffset, steps } = this.props;
    const step = getMergedStep(steps[index], this.props);

    if (step) {
      const target = getElement(step.target);

      const shouldScroll = step
        && !disableScrollToSteps
        && (!step.isFixed || !isFixed(target)) // fixed steps don't need to scroll
        && (prevState.lifecycle !== lifecycle && [LIFECYCLE.BEACON, LIFECYCLE.TOOLTIP].includes(lifecycle))
        && (scrollToFirstStep || prevState.index !== index);

      if (status === STATUS.RUNNING && shouldScroll) {
        let scrollY = 0;

        log({
          title: 'scrollToStep',
          data: [
            { key: 'index', value: index },
            { key: 'lifecycle', value: lifecycle },
            { key: 'status', value: status },
          ],
          debug,
        });

        scrollY = Math.floor(getElementScrollY(target, getElement(step.offsetParent)));

        if (lifecycle === LIFECYCLE.BEACON && this.beaconPopper) {
          const { placement, popper } = this.beaconPopper;
          if (placement === 'top') {
            scrollY = Math.floor(popper.top);
          }
        }
        else if (lifecycle === LIFECYCLE.TOOLTIP && this.tooltipPopper) {
          const { placement, popper } = this.tooltipPopper;

          if (['top', 'right'].includes(placement)) {
            scrollY = Math.floor(popper.top);
          }
        }

        if (status === STATUS.RUNNING && shouldScroll && scrollY >= 0) {
          scrollTo(scrollY - scrollOffset);
        }
      }
    }
  }

  /**
   * Keydown event listener
   *
   * @private
   * @param {Event} e - Keyboard event
   */
  handleKeyboardNavigation = (e) => {
    const { lifecycle } = this.state;
    const intKey = window.Event ? e.which : e.keyCode;

    if (lifecycle === LIFECYCLE.TOOLTIP) {
      if (intKey === 27) {
        this.store.close();
      }
    }
  };

  /**
   * Sync the store with the component's state
   *
   * @param {Object} state
   */
  syncState = (state) => {
    this.setState(state);
  };

  getPopper = (popper, type) => {
    if (type === 'wrapper') {
      this.beaconPopper = popper;
    }
    else {
      this.tooltipPopper = popper;
    }

    if (this.beaconPopper && this.tooltipPopper) {
      const { action } = this.state;

      this.store.update({
        action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : action,
        lifecycle: LIFECYCLE.READY,
      });
    }
  };

  render() {
    const { index, status } = this.state;
    const { continuous, debug, steps } = this.props;
    const step = getMergedStep(steps[index], this.props);
    let output;

    if (status === STATUS.RUNNING && step) {
      output = (
        <Step
          {...this.state}
          continuous={continuous}
          debug={debug}
          helpers={this.helpers}
          locale={this.locale}
          getPopper={this.getPopper}
          step={step}
          update={this.store.update}
        />
      );
    }

    return (
      <div className="joyride">
        {output}
      </div>
    );
  }
}

export default Joyride;
