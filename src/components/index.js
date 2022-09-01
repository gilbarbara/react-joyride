import React from 'react';
import PropTypes from 'prop-types';
import treeChanges from 'tree-changes';
import is from 'is-lite';

import Store from '../modules/store';
import {
  getElement,
  getScrollParent,
  getScrollTo,
  hasCustomScrollParent,
  hasPosition,
  scrollTo,
} from '../modules/dom';
import { canUseDOM, isEqual, log } from '../modules/helpers';
import { componentTypeWithRefs } from '../modules/propTypes';
import { getMergedStep, validateSteps } from '../modules/step';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '../constants';

import Step from './Step';

class Joyride extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initStore();
  }

  static propTypes = {
    beaconComponent: componentTypeWithRefs,
    callback: PropTypes.func,
    continuous: PropTypes.bool,
    debug: PropTypes.bool,
    disableCloseOnEsc: PropTypes.bool,
    disableOverlay: PropTypes.bool,
    disableOverlayClose: PropTypes.bool,
    disableScrolling: PropTypes.bool,
    disableScrollParentFix: PropTypes.bool,
    floaterProps: PropTypes.shape({
      options: PropTypes.object,
      styles: PropTypes.object,
      wrapperOptions: PropTypes.object,
    }),
    getHelpers: PropTypes.func,
    hideBackButton: PropTypes.bool,
    locale: PropTypes.object,
    nonce: PropTypes.string,
    run: PropTypes.bool,
    scrollDuration: PropTypes.number,
    scrollOffset: PropTypes.number,
    scrollToFirstStep: PropTypes.bool,
    showProgress: PropTypes.bool,
    showSkipButton: PropTypes.bool,
    spotlightClicks: PropTypes.bool,
    spotlightPadding: PropTypes.number,
    stepIndex: PropTypes.number,
    steps: PropTypes.array,
    styles: PropTypes.object,
    tooltipComponent: componentTypeWithRefs,
  };

  static defaultProps = {
    continuous: false,
    debug: false,
    disableCloseOnEsc: false,
    disableOverlay: false,
    disableOverlayClose: false,
    disableScrolling: false,
    disableScrollParentFix: false,
    getHelpers: () => {},
    hideBackButton: false,
    run: true,
    scrollOffset: 20,
    scrollDuration: 300,
    scrollToFirstStep: false,
    showSkipButton: false,
    showProgress: false,
    spotlightClicks: false,
    spotlightPadding: 10,
    steps: [],
  };

  componentDidMount() {
    if (!canUseDOM) return;

    const { disableCloseOnEsc, debug, run, steps } = this.props;
    const { start } = this.store;

    if (validateSteps(steps, debug) && run) {
      start();
    }

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.addEventListener('keydown', this.handleKeyboard, { passive: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!canUseDOM) return;

    const { action, controlled, index, lifecycle, status } = this.state;
    const { debug, run, stepIndex, steps } = this.props;
    const { steps: prevSteps, stepIndex: prevStepIndex } = prevProps;
    const { reset, setSteps, start, stop, update } = this.store;
    const { changed: changedProps } = treeChanges(prevProps, this.props);
    const { changed, changedFrom } = treeChanges(prevState, this.state);
    const step = getMergedStep(steps[index], this.props);

    const stepsChanged = !isEqual(prevSteps, steps);
    const stepIndexChanged = is.number(stepIndex) && changedProps('stepIndex');
    const target = getElement(step?.target);

    if (stepsChanged) {
      if (validateSteps(steps, debug)) {
        setSteps(steps);
      } else {
        console.warn('Steps are not valid', steps); //eslint-disable-line no-console
      }
    }

    /* istanbul ignore else */
    if (changedProps('run')) {
      if (run) {
        start(stepIndex);
      } else {
        stop();
      }
    }

    /* istanbul ignore else */
    if (stepIndexChanged) {
      let nextAction = prevStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;

      if (action === ACTIONS.STOP) {
        nextAction = ACTIONS.START;
      }

      if (![STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        update({
          action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
          index: stepIndex,
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }

    // Update the index if the first step is not found
    if (!controlled && status === STATUS.RUNNING && index === 0 && !target) {
      update({ index: index + 1 });
      this.callback({
        ...this.state,
        type: EVENTS.TARGET_NOT_FOUND,
        step,
      });
    }

    const callbackData = {
      ...this.state,
      index,
      step,
    };
    const isAfterAction = changed('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction && changed('status', STATUS.PAUSED)) {
      const prevStep = getMergedStep(steps[prevState.index], this.props);

      this.callback({
        ...callbackData,
        index: prevState.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: prevStep,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (changed('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      const prevStep = getMergedStep(steps[prevState.index], this.props);

      if (!controlled) {
        this.callback({
          ...callbackData,
          index: prevState.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: prevStep,
          type: EVENTS.STEP_AFTER,
        });
      }
      this.callback({
        ...callbackData,
        index: prevState.index,
        // Return the last step when the tour is finished
        step: prevStep,
        type: EVENTS.TOUR_END,
      });
      reset();
    } else if (changedFrom('status', [STATUS.IDLE, STATUS.READY], STATUS.RUNNING)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_START,
      });
    } else if (changed('status')) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_STATUS,
      });
    } else if (changed('action', ACTIONS.RESET)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_STATUS,
      });
    }

    if (step) {
      this.scrollToStep(prevState);

      if (
        step.placement === 'center' &&
        status === STATUS.RUNNING &&
        action === ACTIONS.START &&
        lifecycle === LIFECYCLE.INIT
      ) {
        update({ lifecycle: LIFECYCLE.READY });
      }
    }
  }

  componentWillUnmount() {
    const { disableCloseOnEsc } = this.props;

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.removeEventListener('keydown', this.handleKeyboard);
    }
  }

  initStore = () => {
    const { debug, getHelpers, run, stepIndex } = this.props;

    this.store = new Store({
      ...this.props,
      controlled: run && is.number(stepIndex),
    });
    this.helpers = this.store.getHelpers();

    const { addListener } = this.store;

    log({
      title: 'init',
      data: [
        { key: 'props', value: this.props },
        { key: 'state', value: this.state },
      ],
      debug,
    });

    // Sync the store to this component's state.
    addListener(this.syncState);

    getHelpers(this.helpers);

    return this.store.getState();
  };

  scrollToStep(prevState) {
    const { index, lifecycle, status } = this.state;
    const {
      debug,
      disableScrolling,
      disableScrollParentFix,
      scrollToFirstStep,
      scrollOffset,
      scrollDuration,
      steps,
    } = this.props;
    const step = getMergedStep(steps[index], this.props);

    /* istanbul ignore else */
    if (step) {
      const target = getElement(step.target);
      const shouldScroll = this.shouldScroll(
        disableScrolling,
        index,
        scrollToFirstStep,
        lifecycle,
        step,
        target,
        prevState,
      );

      if (status === STATUS.RUNNING && shouldScroll) {
        const hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
        const scrollParent = getScrollParent(target, disableScrollParentFix);
        let scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;

        log({
          title: 'scrollToStep',
          data: [
            { key: 'index', value: index },
            { key: 'lifecycle', value: lifecycle },
            { key: 'status', value: status },
          ],
          debug,
        });

        /* istanbul ignore else */
        if (lifecycle === LIFECYCLE.BEACON && this.beaconPopper) {
          const { placement, popper } = this.beaconPopper;

          /* istanbul ignore else */
          if (!['bottom'].includes(placement) && !hasCustomScroll) {
            scrollY = Math.floor(popper.top - scrollOffset);
          }
        } else if (lifecycle === LIFECYCLE.TOOLTIP && this.tooltipPopper) {
          const { flipped, placement, popper } = this.tooltipPopper;

          if (['top', 'right', 'left'].includes(placement) && !flipped && !hasCustomScroll) {
            scrollY = Math.floor(popper.top - scrollOffset);
          } else {
            scrollY -= step.spotlightPadding;
          }
        }

        scrollY = scrollY >= 0 ? scrollY : 0;

        /* istanbul ignore else */
        if (status === STATUS.RUNNING) {
          scrollTo(scrollY, scrollParent, scrollDuration);
        }
      }
    }
  }

  /**
   * Trigger the callback.
   *
   * @private
   * @param {Object} data
   */
  callback = data => {
    const { callback } = this.props;

    /* istanbul ignore else */
    if (is.function(callback)) {
      callback(data);
    }
  };

  /**
   * Keydown event listener
   *
   * @private
   * @param {Event} e - Keyboard event
   */
  handleKeyboard = e => {
    const { index, lifecycle } = this.state;
    const { steps } = this.props;
    const step = steps[index];
    const intKey = window.Event ? e.which : e.keyCode;

    if (lifecycle === LIFECYCLE.TOOLTIP) {
      if (intKey === 27 && step && !step.disableCloseOnEsc) {
        this.store.close();
      }
    }
  };

  /**
   * Sync the store with the component's state
   *
   * @param {Object} state
   */
  syncState = state => {
    this.setState(state);
  };

  setPopper = (popper, type) => {
    if (type === 'wrapper') {
      this.beaconPopper = popper;
    } else {
      this.tooltipPopper = popper;
    }
  };

  shouldScroll = (disableScrolling, index, scrollToFirstStep, lifecycle, step, target, prevState) =>
    !disableScrolling &&
    (index !== 0 || scrollToFirstStep || lifecycle === LIFECYCLE.TOOLTIP) &&
    step.placement !== 'center' &&
    (!step.isFixed || !hasPosition(target)) && // fixed steps don't need to scroll
    prevState.lifecycle !== lifecycle &&
    [LIFECYCLE.BEACON, LIFECYCLE.TOOLTIP].includes(lifecycle);

  render() {
    if (!canUseDOM) return null;

    const { index, status } = this.state;
    const { continuous, debug, nonce, scrollToFirstStep, steps } = this.props;
    const step = getMergedStep(steps[index], this.props);
    let output;

    if (status === STATUS.RUNNING && step) {
      output = (
        <Step
          {...this.state}
          callback={this.callback}
          continuous={continuous}
          debug={debug}
          setPopper={this.setPopper}
          helpers={this.helpers}
          nonce={nonce}
          shouldScroll={!step.disableScrolling && (index !== 0 || scrollToFirstStep)}
          step={step}
          update={this.store.update}
        />
      );
    }

    return <div className="react-joyride">{output}</div>;
  }
}

export default Joyride;
