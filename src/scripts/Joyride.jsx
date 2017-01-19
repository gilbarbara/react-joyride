import React from 'react';
import scroll from 'scroll';
import autobind from 'react-autobind';
import nested from 'nested-property';
import { logger, sanitizeSelector, getScrollContainer } from './utils';

import Beacon from './Beacon';
import Tooltip from './Tooltip';

const defaultState = {
  action: '',
  index: 0,
  isRunning: false,
  isTourSkipped: false,
  shouldRedraw: true,
  shouldRenderTooltip: false,
  shouldRun: false,
  standaloneData: false, // The standalone tooltip data
  xPos: -1000,
  yPos: -1000
};

const callbackTypes = {
  STEP_BEFORE: 'step:before',
  BEACON_BEFORE: 'beacon:before',
  BEACON_TRIGGER: 'beacon:trigger',
  TOOLTIP_BEFORE: 'tooltip:before',
  STEP_AFTER: 'step:after',
  STANDALONE_BEFORE: 'standalone:before',
  STANDALONE_AFTER: 'standalone:after',
  OVERLAY: 'overlay:click',
  HOLE: 'hole:click',
  FINISHED: 'finished',
  TARGET_NOT_FOUND: 'error:target_not_found'
};

const listeners = {
  tooltips: {}
};

const DEFAULTS = {
  position: 'top',
  minWidth: 290
};

let hasTouch = false;

class Joyride extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { ...defaultState };
  }

  static propTypes = {
    allowClicksThruHole: React.PropTypes.bool,
    autoStart: React.PropTypes.bool,
    callback: React.PropTypes.func,
    debug: React.PropTypes.bool,
    disableOverlay: React.PropTypes.bool,
    holePadding: React.PropTypes.number,
    keyboardNavigation: React.PropTypes.bool,
    locale: React.PropTypes.object,
    resizeDebounce: React.PropTypes.bool,
    resizeDebounceDelay: React.PropTypes.number,
    run: React.PropTypes.bool,
    scrollOffset: React.PropTypes.number,
    scrollToFirstStep: React.PropTypes.bool,
    scrollToSteps: React.PropTypes.bool,
    showBackButton: React.PropTypes.bool,
    showOverlay: React.PropTypes.bool,
    showSkipButton: React.PropTypes.bool,
    showStepsProgress: React.PropTypes.bool,
    stepIndex: React.PropTypes.number,
    steps: React.PropTypes.array,
    tooltipOffset: React.PropTypes.number,
    type: React.PropTypes.string
  };

  static defaultProps = {
    allowClicksThruHole: false,
    autoStart: false,
    debug: false,
    holePadding: 5,
    keyboardNavigation: true,
    locale: {
      back: 'Back',
      close: 'Close',
      last: 'Last',
      next: 'Next',
      skip: 'Skip'
    },
    resizeDebounce: false,
    resizeDebounceDelay: 200,
    run: false,
    scrollToSteps: true,
    scrollOffset: 20,
    scrollToFirstStep: false,
    showBackButton: true,
    showOverlay: true,
    showSkipButton: false,
    showStepsProgress: false,
    steps: [],
    tooltipOffset: 15,
    type: 'single'
  };

  componentDidMount() {
    const {
      autoStart,
      keyboardNavigation,
      resizeDebounce,
      resizeDebounceDelay,
      run,
      steps,
      type
    } = this.props;

    logger({
      type: 'joyride:initialized',
      msg: [this.props],
      debug: this.props.debug,
    });

    const stepsAreValid = this.checkStepsValidity(steps);
    if (steps && stepsAreValid && run) {
      this.start(autoStart);
    }

    if (resizeDebounce) {
      let timeoutId;

      listeners.resize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          timeoutId = null;
          this.calcPlacement();
        }, resizeDebounceDelay);
      };
    }
    else {
      listeners.resize = () => {
        this.calcPlacement();
      };
    }
    window.addEventListener('resize', listeners.resize);

    if (keyboardNavigation && type === 'continuous') {
      listeners.keyboard = this.onKeyboardNavigation;
      document.body.addEventListener('keydown', listeners.keyboard);
    }

    window.addEventListener('touchstart', function setHasTouch() {
      hasTouch = true;
      // Remove event listener once fired, otherwise it'll kill scrolling
      // performance
      window.removeEventListener('touchstart', setHasTouch);
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    logger({
      type: 'joyride:willReceiveProps',
      msg: [nextProps],
      debug: nextProps.debug,
    });
    const { isRunning, shouldRun, standaloneData } = this.state;
    const { keyboardNavigation, run, steps, stepIndex } = this.props;
    const stepsChanged = (nextProps.steps !== steps);
    const stepIndexChanged = (nextProps.stepIndex !== stepIndex && nextProps.stepIndex !== this.state.index);
    const runChanged = (nextProps.run !== run);
    let shouldStart = false;
    let didStop = false;

    if (stepsChanged && this.checkStepsValidity(nextProps.steps)) {
      // Removed all steps, so reset
      if (!nextProps.steps || !nextProps.steps.length) {
        this.reset();
      }
      // Start the joyride if steps were added for the first time, and run prop is true
      else if (!steps.length && nextProps.run) {
        shouldStart = true;
      }
    }

    if (runChanged) {
      // run prop was changed to off, so stop the joyride
      if (run && nextProps.run === false) {
        this.stop();
        didStop = true;
      }
      // run prop was changed to on, so start the joyride
      else if (!run && nextProps.run) {
        shouldStart = true;
      }
      // Was not playing, but should, and isn't a standaloneData
      else if (!isRunning && (shouldRun && !standaloneData)) {
        shouldStart = true;
      }
    }

    if (stepIndexChanged) {
      const hasStep = nextProps.steps[nextProps.stepIndex];
      const shouldDisplay = hasStep && nextProps.autoStart;
      if (runChanged && shouldStart) {
        this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
      }
      // Next prop is set to run, and the index has changed, but for some reason joyride is not running
      // (maybe this is because of a target not mounted, and the app wants to skip to another step)
      else if (nextProps.run && !isRunning) {
        this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
      }
      else if (!didStop) {
        this.toggleTooltip({ show: shouldDisplay, index: nextProps.stepIndex, steps: nextProps.steps, action: 'jump' });
      }
    }

    // Did not change the index, but need to start up the joyride
    else if (shouldStart) {
      this.start(nextProps.autoStart, nextProps.steps);
    }

    // Update keyboard listeners if necessary
    if (
      !listeners.keyboard &&
      ((!keyboardNavigation && nextProps.keyboardNavigation) || keyboardNavigation)
      && nextProps.type === 'continuous'
    ) {
      listeners.keyboard = this.onKeyboardNavigation;
      document.body.addEventListener('keydown', listeners.keyboard);
    }
    else if (
      listeners.keyboard && keyboardNavigation &&
      (!nextProps.keyboardNavigation || nextProps.type !== 'continuous')
    ) {
      document.body.removeEventListener('keydown', listeners.keyboard);
      delete listeners.keyboard;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { index, isRunning, shouldRenderTooltip, standaloneData } = this.state;
    const { steps, scrollToSteps } = this.props;
    const { steps: nextSteps } = nextProps;
    const step = steps[index];
    const nextStep = nextSteps[nextState.index];
    const hasRenderedTarget = Boolean(this.getStepTargetElement(nextStep));
    const stepChanged = (nextState.index !== 0 && index !== nextState.index);
    const isRunningChanged = isRunning !== nextState.isRunning;
    const shouldScroll = (nextState.index === 0 && nextProps.scrollToFirstStep) || stepChanged || isRunningChanged;
    const useScrollContainer = !!nextStep && nextStep.scrollContainerSelector;

    // Scroll the step scroll container before going to the next step
    if (nextState.isRunning && scrollToSteps && shouldScroll && useScrollContainer) {
      // Watch scroll event to the container
      const scrollElement = this.getScrollContainer(useScrollContainer);
      scrollElement.removeEventListener('scroll', this.calcPlacement);
      scrollElement.addEventListener('scroll', this.calcPlacement);

      this.scrollToTarget(useScrollContainer);
    }

    // Standalone tooltip is being turned on
    if (!standaloneData && nextState.standaloneData) {
      this.triggerCallback({
        type: callbackTypes.STANDALONE_BEFORE,
        step: nextState.standaloneData
      });
    }
    // Standalone tooltip is being turned off
    else if (standaloneData && !nextState.standaloneData) {
      this.triggerCallback({
        type: callbackTypes.STANDALONE_AFTER,
        step: standaloneData
      });
    }

    // Tried to start, but something went wrong and we're not actually running
    if (nextState.action === 'start' && !nextState.isRunning) {
      // There's a step to use, but there's no target in the DOM
      if (nextStep && !hasRenderedTarget) {
        console.warn('Target not mounted', nextStep, nextState.action); //eslint-disable-line no-console
        this.triggerCallback({
          action: 'start',
          index: nextState.index,
          type: callbackTypes.TARGET_NOT_FOUND,
          step: nextStep,
        });
      }
    }

    // Started running from the beginning (the current index is 0)
    if ((!isRunning && nextState.isRunning) && nextState.index === 0) {
      this.triggerCallback({
        action: 'start',
        index: nextState.index,
        type: callbackTypes.STEP_BEFORE,
        step: nextStep
      });

      // Not showing a tooltip yet, so we're going to show a beacon instead
      if (!nextState.shouldRenderTooltip) {
        this.triggerCallback({
          action: 'start',
          index: nextState.index,
          type: callbackTypes.BEACON_BEFORE,
          step: nextStep
        });
      }
    }

    // Joyride was running (it might still be), and the index has been changed
    if (isRunning && nextState.index !== index) {
      this.triggerCallback({
        action: nextState.action,
        index,
        type: callbackTypes.STEP_AFTER,
        step
      });

      // Attempted to advance to a step with a target that cannot be found
      if (nextStep && !hasRenderedTarget) {
        console.warn('Target not mounted', nextStep, nextState.action); //eslint-disable-line no-console
        this.triggerCallback({
          action: nextState.action,
          index: nextState.index,
          type: callbackTypes.TARGET_NOT_FOUND,
          step: nextStep,
        });
      }

      // There's a next step and the index is > 0
      // (which means STEP_BEFORE wasn't sent as part of the start handler above)
      else if (nextStep && nextState.index) {
        this.triggerCallback({
          action: nextState.action,
          index: nextState.index,
          type: callbackTypes.STEP_BEFORE,
          step: nextStep
        });
      }
    }

    // Running, and a tooltip is being turned on/off or the index is changing
    if (nextState.isRunning && (shouldRenderTooltip !== nextState.shouldRenderTooltip || nextState.index !== index)) {
      // Going to show a tooltip
      if (nextState.shouldRenderTooltip) {
        this.triggerCallback({
          action: nextState.action || (nextState.index === 0 ? 'autostart' : ''),
          index: nextState.index,
          type: callbackTypes.TOOLTIP_BEFORE,
          step: nextStep
        });
      }
      // Going to show a beacon
      else {
        this.triggerCallback({
          action: nextState.action,
          index: nextState.index,
          type: callbackTypes.BEACON_BEFORE,
          step: nextStep
        });
      }
    }

    // Joyride was changed to a step index which doesn't exist (hit the end)
    if (nextProps.run && nextSteps.length && index !== nextState.index && !nextStep) {
      this.triggerCallback({
        action: nextState.action,
        type: callbackTypes.FINISHED,
        steps: nextSteps,
        isTourSkipped: nextState.isTourSkipped
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { index, shouldRedraw, isRunning, shouldRun, standaloneData, isScrolling } = this.state;
    const { scrollToFirstStep, scrollToSteps, steps } = this.props;
    const step = steps[index];

    const stepChanged = (index !== 0 && prevState.index !== index);
    const isRunningChanged = isRunning !== prevState.isRunning;
    const shouldScroll = (
      (index === 0 && scrollToFirstStep) || stepChanged || isRunningChanged)
      && (step && !step.isFixed); // fixed steps don't need to scroll

    if (isScrolling !== prevState.isScrolling) {
      return;
    }

    if (shouldRedraw && step) {
      this.calcPlacement();
    }

    if (isRunning && scrollToSteps && shouldScroll) {
      this.scrollToTarget();
    }

    if (steps.length && (!isRunning && shouldRun && !standaloneData)) {
      this.start();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', listeners.resize);

    if (listeners.keyboard) {
      document.body.removeEventListener('keydown', listeners.keyboard);
    }

    if (Object.keys(listeners.tooltips).length) {
      Object.keys(listeners.tooltips).forEach((key) => {
        document.querySelector(key)
          .removeEventListener(listeners.tooltips[key].event, listeners.tooltips[key].cb);
        delete listeners.tooltips[key];
      });
    }
  }

  /**
   *  Scrolls the step scroll selector or the body to the target
   *
   * @param  {string} useScrollContainer - The selector to scroll.
   * If none is provided, will scroll body
   */
  scrollToTarget(useScrollContainer) {
    this.setState({ isScrolling: true }, () => {
      if (useScrollContainer && this.getScrollContainer(useScrollContainer)) {
        // Scroll specified parent element
        this.scrollContainerElement(useScrollContainer);
      }
      else {
        // Scroll body element
        this.scrollBodyElement();
      }
    });
  }

  /**
   * Scrolls the body element to correct top and left position
   *
   * @param {Boolean} [forceRedraw] - If redraw should be force executed
   */
  scrollBodyElement(forceRedraw) {
    clearTimeout(this.bodyScrollTimeout);
    this.bodyScrollTimeout = setTimeout(() => {
      this.bodyScrollTimeout = null;

      if (forceRedraw || this.state.redraw) {
        this.calcPlacement();
      }

      scroll.top(this.getScrollContainer(), this.getScrollValue(false, 'y'), () => {
        scroll.left(this.getScrollContainer(), this.getScrollValue(false, 'x'), () => {
          this.setState({ isScrolling: false });
        });
      });
    }, 10);
  }

  /**
   * Scrolls the scrollContainerSelector element to correct top and left position
   *
   * @param {String} [useScrollContainer] - The step or app-level scroll container selector
   */
  scrollContainerElement(useScrollContainer) {
    const state = this.state;
    const { steps } = this.props;
    const step = steps[state.index];
    const target = document.querySelector(step.selector);

    if (!target || !useScrollContainer) {
      return;
    }

    const scrollContainerElem = this.getScrollContainer(useScrollContainer);
    const newYScroll = this.getScrollValue(true, 'y');
    const newXScroll = this.getScrollValue(true, 'x');

    scroll.top(scrollContainerElem, newYScroll, { duration: 1 }, () => {
      scroll.left(scrollContainerElem, newXScroll, { duration: 1 }, () => {
        // Adjust body scroll after scroll container has been scrolled and position is recalculated
        this.calcPlacement(this.scrollBodyElement.bind(null, true));
      });
    });
  }

  /**
   * Starts the tour
   *
   * @param {boolean} [autorun] - Starts with the first tooltip opened
   * @param {Array} [steps] - Array of steps, defaults to this.props.steps
   * @param {number} [startIndex] - Optional step index to start joyride at
   */
  start(autorun, steps = this.props.steps, startIndex = this.state.index) {
    const hasMountedTarget = Boolean(this.getStepTargetElement(steps[startIndex]));
    const shouldRenderTooltip = (autorun === true) && hasMountedTarget;

    logger({
      type: 'joyride:start',
      msg: ['autorun:', autorun === true],
      debug: this.props.debug,
    });

    this.setState({
      action: 'start',
      index: startIndex,
      isRunning: Boolean(steps.length) && hasMountedTarget,
      shouldRenderTooltip,
      shouldRun: !steps.length,
    });
  }

  /**
   * Stop the tour
   */
  stop() {
    logger({
      type: 'joyride:stop',
      debug: this.props.debug,
    });
    this.setState({
      isRunning: false,
      shouldRenderTooltip: false
    });
  }

  /**
   * Move to the next step, if there is one.  If there is no next step, hide the tooltip.
   */
  next() {
    const { index, shouldRenderTooltip } = this.state;
    const { steps } = this.props;
    const nextIndex = index + 1;

    const shouldDisplay = Boolean(steps[nextIndex]) && shouldRenderTooltip;

    logger({
      type: 'joyride:next',
      msg: ['new index:', nextIndex],
      debug: this.props.debug,
    });
    this.toggleTooltip({ show: shouldDisplay, index: nextIndex, action: 'next' });
  }

  /**
   * Move to the previous step, if there is one.  If there is no previous step, hide the tooltip.
   */
  back() {
    const { index, shouldRenderTooltip } = this.state;
    const { steps } = this.props;
    const previousIndex = index - 1;

    const shouldDisplay = Boolean(steps[previousIndex]) && shouldRenderTooltip;

    logger({
      type: 'joyride:back',
      msg: ['new index:', previousIndex],
      debug: this.props.debug,
    });
    this.toggleTooltip({ show: shouldDisplay, index: previousIndex, action: 'next' });
  }

  /**
   * Reset Tour
   *
   * @param {boolean} [restart] - Starts the new tour right away
   */
  reset(restart) {
    const { index, isRunning } = this.state;
    const shouldRestart = restart === true;

    const newState = {
      ...defaultState,
      isRunning: shouldRestart,
      shouldRenderTooltip: this.props.autoStart,
    };

    logger({
      type: 'joyride:reset',
      msg: ['restart:', shouldRestart],
      debug: this.props.debug,
    });
    // Force a re-render if necessary
    if (shouldRestart && isRunning === shouldRestart && index === 0) {
      this.forceUpdate();
    }

    this.setState(newState);
  }

  /**
   * Retrieve the current progress of your tour
   *
   * @returns {{index: number, percentageComplete: number, step: (object|null)}}
   */
  getProgress() {
    const { index } = this.state;
    const { steps } = this.props;

    logger({
      type: 'joyride:getProgress',
      msg: ['steps:', steps],
      debug: this.props.debug,
    });

    return {
      index,
      percentageComplete: parseFloat(((index / steps.length) * 100).toFixed(2).replace('.00', '')),
      step: steps[index]
    };
  }

  /**
   * Add standalone tooltip events
   *
   * @param {Object} data - Similar shape to a 'step', but for a single tooltip
   */
  addTooltip(data) {
    if (!this.checkStepValidity(data)) {
      logger({
        type: 'joyride:addTooltip:FAIL',
        msg: ['data:', data],
        debug: this.props.debug,
      });

      return;
    }

    logger({
      type: 'joyride:addTooltip',
      msg: ['data:', data],
      debug: this.props.debug,
    });

    const key = data.trigger || sanitizeSelector(data.selector);
    const el = document.querySelector(key);
    if (!el) {
      return;
    }
    el.setAttribute('data-tooltip', JSON.stringify(data));
    const eventType = data.event || 'click';

    if (eventType === 'hover') {
      listeners.tooltips[`${key}mouseenter`] = { event: 'mouseenter', cb: this.onClickStandaloneTrigger };
      listeners.tooltips[`${key}mouseleave`] = { event: 'mouseleave', cb: this.onClickStandaloneTrigger };

      el.addEventListener('mouseenter', listeners.tooltips[`${key}mouseenter`].cb);
      el.addEventListener('mouseleave', listeners.tooltips[`${key}mouseleave`].cb);
    }

    listeners.tooltips[`${key}click`] = { event: 'click', cb: this.onClickStandaloneTrigger };
    el.addEventListener('click', listeners.tooltips[`${key}click`].cb);
  }

  /**
   * Parse the incoming steps
   *
   * @deprecated
   *
   * @param {Array|Object} steps
   * @returns {Array}
   */
  parseSteps(steps) {
    logger({
      type: 'joyride:parseSteps',
      msg: 'joyride.parseSteps() is deprecated.  It is no longer necessary to parse steps before providing them to Joyride.',
      warn: true,
      debug: this.props.debug,
    });
    return steps;
  }

  /**
   * Verify that a step is valid
   *
   * @param {Object} step - A step object
   * @returns {boolean} - True if the step is valid, false otherwise
   */
  checkStepValidity(step) {
    // Check that the step is the proper type
    if (!step || typeof step !== 'object' || Array.isArray(step)) {
      logger({
        type: 'joyride:checkStepValidity',
        msg: 'Did not provide a step object.',
        warn: true,
        debug: this.props.debug,
      });
      return false;
    }

    // Check that all required step fields are present
    const requiredFields = ['selector'];
    const hasRequiredField = (requiredField) => {
      const hasField = Boolean(step[requiredField]);
      if (!hasField) {
        logger({
          type: 'joyride:checkStepValidity',
          msg: [`Provided a step without the required ${requiredField} property.`, 'Step:', step],
          warn: true,
          debug: this.props.debug,
        });
      }
      return hasField;
    };
    return requiredFields.every(hasRequiredField);
  }

  /**
   * Check one or more steps are valid
   *
   * @param {Object|Array} steps - A step object or array of step objects
   * @returns {boolean} - True if one or more stpes, and all steps are valid, false otherwise
   */
  checkStepsValidity(steps) {
    if (!Array.isArray(steps) && typeof steps === 'object') {
      return this.checkStepValidity(steps);
    }
    else if (steps.length > 0) {
      return steps.every(this.checkStepValidity);
    }
    return false;
  }

  /**
   * Find and return the targeted DOM element based on a step's 'selector'.
   *
   * @private
   * @param {Object} step - A step object
   * @returns {Element} - A DOM element (if found)
   */
  getStepTargetElement(step) {
    const isValidStep = this.checkStepValidity(step);
    if (!isValidStep) {
      return null;
    }

    const el = document.querySelector(sanitizeSelector(step.selector));
    if (!el) {
      logger({
        type: 'joyride:getStepTargetElement',
        msg: 'Target not rendered. For best results only add steps after they are mounted.',
        warn: true,
        debug: this.props.debug,
      });
      return null;
    }
    return el;
  }

  /**
   * Get an element actual dimensions with margin
   *
   * @private
   * @returns {{height: number, width: number}}
   */
  getElementDimensions() {
    const { shouldRenderTooltip, standaloneData } = this.state;
    const displayTooltip = standaloneData ? true : shouldRenderTooltip;
    const el = document.querySelector(displayTooltip ? '.joyride-tooltip' : '.joyride-beacon');

    let height = 0;
    let width = 0;

    if (el) {
      const styles = window.getComputedStyle(el);
      height = el.clientHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
      width = el.clientWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
    }

    return {
      height,
      width
    };
  }

  /**
   * Get the scroll container
   *
   * @param {String} scrollContainer - The scrollable parent container selector
   * @returns {Element} Element node
   */
  getScrollContainer(scrollContainer) {
    return getScrollContainer(scrollContainer);
  }

  /**
   * Get the scrollTop position
   *
   * @private
   * @param {Boolean} getContainerScroll - If obtaining the scrollContainerSelector scroll position (as opposed to the body scroll position)
   * @param {String} axis - The axis to get the scroll value, 'y' or 'x'
   * @returns {number}
   */
  getScrollValue(getContainerScroll, axis) {
    const { index, yPos } = this.state;
    const { scrollOffset, steps } = this.props;
    const step = steps[index];
    const target = this.getStepTargetElement(step);

    if (!target) {
      return 0;
    }

    const useScrollContainer = !!step && step.scrollContainerSelector;
    const scrollPosFields = this.getScrollPosFields(axis);
    const rect = target.getBoundingClientRect();
    const offsetPos = (window[scrollPosFields.pageOffset] || document.documentElement[scrollPosFields.scrollField]);

    if (getContainerScroll) {
      if (!useScrollContainer) {
        return 0;
      }

      return this.getScrollForParentContainer(axis);
    }

    // Add the target offset
    let scrollTo = offsetPos + rect[scrollPosFields.start];

    // Only add viewport offset if scrolling vertically for parent or body
    if (axis === 'y' && (!getContainerScroll || !useScrollContainer)) {
      const position = this.calcPosition(step);

      if (/^top/.test(position)) {
        scrollTo = yPos - scrollOffset;
      }
      else if (/^bottom|^left|^right/.test(position)) {
        scrollTo -= scrollOffset;
      }
    }

    return Math.floor(scrollTo);
  }

  /**
   * Obtains the correct field values needed to calculate the scroll value for the axis
   *
   * @param  {string} axis - The axis (y|x) to get fields
   * @returns {object} - The various field values
   */
  getScrollPosFields(axis) {
    return {
      start: axis === 'y' ? 'top' : 'left',
      end: axis === 'y' ? 'bottom' : 'right',
      size: axis === 'y' ? 'height' : 'width',
      scrollField: `scroll${axis === 'y' ? 'Top' : 'Left'}`,
      pageOffset: `page${axis === 'y' ? 'Y' : 'X'}Offset`,
      paddingStart: `padding${axis === 'y' ? 'Top' : 'Left'}`,
      paddingEnd: `padding${axis === 'y' ? 'Bottom' : 'Right'}`
    };
  }

  /**
   * Gets the scroll value for step scrollContainerSelector element
   *
   * @param  {string} axis - The axis (y|x) to calculate the value for
   * @returns {number} - The amount the axis should be scrolled
   */
  getScrollForParentContainer(axis) {
    const { index } = this.state;
    const { steps } = this.props;
    const step = steps[index];
    const target = document.querySelector(step.selector);
    const rect = target.getBoundingClientRect();
    const scrollContainerElem = this.getScrollContainer(step.scrollContainerSelector);
    const scrollPosFields = this.getScrollPosFields(axis);
    const containerOffset = scrollContainerElem[scrollPosFields.scrollField];
    const containerRect = scrollContainerElem.getBoundingClientRect();
    const computedStyle = getComputedStyle(scrollContainerElem);
    const containerPaddingOffset = parseFloat(computedStyle[scrollPosFields.paddingStart]);
    const scrollbarWidth = scrollContainerElem.offsetWidth - scrollContainerElem.clientWidth;

    // Target is out of view, scroll container so it's fully visible
    if (rect[scrollPosFields.end] > containerRect[scrollPosFields.end]) {
      return Math.floor((rect[scrollPosFields.end] - containerRect[scrollPosFields.end]) + containerPaddingOffset + scrollbarWidth + containerOffset);
    }
    else if (rect[scrollPosFields.start] < containerRect[scrollPosFields.start]) {
      return Math.floor(containerOffset - ((containerRect[scrollPosFields.start] - Math.abs(rect[scrollPosFields.start])) + rect[scrollPosFields.size]) - scrollbarWidth);
    }

    return containerOffset;
  }

  /**
   * Trigger the callback.
   *
   * @private
   * @param {Object} options
   */
  triggerCallback(options) {
    const { callback } = this.props;

    if (typeof callback === 'function') {
      logger({
        type: 'joyride:triggerCallback',
        msg: [options],
        debug: this.props.debug,
      });

      callback(options);
    }
  }

  /**
   * Keydown event listener
   *
   * @private
   * @param {Event} e - Keyboard event
   */
  onKeyboardNavigation(e) {
    const { index, shouldRenderTooltip } = this.state;
    const { steps } = this.props;
    const intKey = (window.Event) ? e.which : e.keyCode;
    let hasSteps;

    if (shouldRenderTooltip) {
      if ([32, 38, 40].indexOf(intKey) > -1) {
        e.preventDefault();
      }

      if (intKey === 27) {
        this.toggleTooltip({ show: false, index: index + 1, action: 'esc' });
      }
      else if ([13, 32].indexOf(intKey) > -1) {
        hasSteps = Boolean(steps[index + 1]);
        this.toggleTooltip({ show: hasSteps, index: index + 1, action: 'next' });
      }
    }
  }

  /**
   * Tooltip event listener
   *
   * @private
   * @param {Event} e - Click event
   */
  onClickStandaloneTrigger(e) {
    e.preventDefault();
    const { isRunning, standaloneData } = this.state;
    let tooltipData = e.currentTarget.dataset.tooltip;

    if (['mouseenter', 'mouseleave'].includes(e.type) && hasTouch) {
      return;
    }

    if (tooltipData) {
      tooltipData = JSON.parse(tooltipData);

      if (!standaloneData || (standaloneData.selector !== tooltipData.selector)) {
        this.setState({
          isRunning: false,
          shouldRenderTooltip: false,
          shouldRun: isRunning,
          standaloneData: tooltipData,
          xPos: -1000,
          yPos: -1000
        });
      }
      else {
        document.querySelector('.joyride-tooltip__close').click();
      }
    }
  }

  /**
   * Beacon click event listener
   *
   * @private
   * @param {Event} e - Click event
   */
  onClickBeacon(e) {
    e.preventDefault();
    const { index } = this.state;
    const { steps } = this.props;
    const eventType = e.type;
    const scrollContainerElem = this.getScrollContainer(steps[index].scrollContainerSelector);
    const scrollToStepSelector = !!steps[index].scrollContainerSelector;

    this.triggerCallback({
      action: e.type,
      index,
      type: callbackTypes.BEACON_TRIGGER,
      step: steps[index]
    });

    // Scroll element to ensure tooltip shows on correct position
    scroll.top(scrollContainerElem, this.getScrollValue(scrollToStepSelector, 'y'), { duration: 1 }, () => {
      scroll.left(scrollContainerElem, this.getScrollValue(scrollToStepSelector, 'x'), { duration: 1 }, () => {
        this.toggleTooltip({ show: true, index, action: `beacon:${eventType}` });
      });
    });
  }

  /**
   * Tooltip click event listener
   *
   * @private
   * @param {Event} e - Click event
   */
  onClickTooltip(e) {
    const { index, shouldRun } = this.state;
    const { steps, type } = this.props;
    const el = e.currentTarget.className.indexOf('joyride-') === 0 && e.currentTarget.tagName === 'A' ? e.currentTarget : e.target;
    const dataType = el.dataset.type;

    if (el.className.indexOf('joyride-') === 0) {
      e.preventDefault();
      e.stopPropagation();
      const tooltip = document.querySelector('.joyride-tooltip');
      let newIndex = index + (dataType === 'back' ? -1 : 1);

      if (dataType === 'skip') {
        this.setState({
          isTourSkipped: true
        });
        newIndex = steps.length + 1;
      }

      if (tooltip.classList.contains('joyride-tooltip--standalone')) {
        this.setState({
          isRunning: shouldRun,
          shouldRedraw: true,
          shouldRun: false,
          standaloneData: false
        });
      }
      else if (dataType) {
        const shouldDisplay = ['continuous', 'guided'].indexOf(type) > -1
          && ['close', 'skip'].indexOf(dataType) === -1
          && Boolean(steps[newIndex]);

        this.toggleTooltip({ show: shouldDisplay, index: newIndex, action: dataType });
      }

      if (e.target.className === 'joyride-overlay') {
        this.triggerCallback({
          action: 'click',
          type: callbackTypes.OVERLAY,
          step: steps[index]
        });
      }

      if (e.target.classList.contains('joyride-hole')) {
        this.triggerCallback({
          action: 'click',
          type: callbackTypes.HOLE,
          step: steps[index]
        });
      }
    }
  }

  onRenderTooltip() {
    this.calcPlacement();
  }

  /**
   * Toggle Tooltip's visibility
   *
   * @private
   * @param {Object} options - Immediately destructured argument object
   * @param {Boolean} options.show - Render the tooltip or the beacon
   * @param {Number} options.index - The tour's new index
   * @param {string} [options.action] - The action being undertaken.
   * @param {Array} [options.steps] - The array of step objects that is going to be rendered
   */
  toggleTooltip({ show, index = this.state.index, action, steps = this.props.steps }) {
    const nextStep = steps[index];
    const hasMountedTarget = Boolean(this.getStepTargetElement(nextStep));

    this.setState({
      action,
      index,
      // Stop playing if there is no next step or can't find the target
      isRunning: (nextStep && hasMountedTarget) ? this.state.isRunning : false,
      // If we are not showing now, or there is no target, we'll need to redraw eventually
      shouldRedraw: !show || !hasMountedTarget,
      shouldRenderTooltip: show && hasMountedTarget,
      xPos: -1000,
      yPos: -1000
    });
  }

  /**
   * Position absolute elements next to its target
   *
   * @private
   * @param {Function} callback - Method to call after placement is set in state
   */
  calcPlacement(callback) {
    const { index, isRunning, standaloneData, shouldRenderTooltip } = this.state;
    const { steps, tooltipOffset } = this.props;
    const step = standaloneData || (steps[index] || {});
    const displayTooltip = standaloneData ? true : shouldRenderTooltip;
    const target = this.getStepTargetElement(step);

    logger({
      type: `joyride:calcPlacement${this.getRenderStage()}`,
      msg: ['step:', step],
      debug: this.props.debug,
    });

    if (!target) {
      return;
    }

    const placement = {
      x: -1000,
      y: -1000
    };

    if (step && (standaloneData || (isRunning && steps[index]))) {
      const offsetX = nested.get(step, 'style.beacon.offsetX') || 0;
      const offsetY = nested.get(step, 'style.beacon.offsetY') || 0;
      const position = this.calcPosition(step);
      const body = this.getScrollContainer().getBoundingClientRect();
      const scrollTop = step.isFixed === true ? 0 : body.top;
      const component = this.getElementDimensions();
      const rect = target.getBoundingClientRect();

      // Calculate x position
      if (/^left/.test(position)) {
        placement.x = rect.left - (displayTooltip ? component.width + tooltipOffset : (component.width / 2) + offsetX);
      }
      else if (/^right/.test(position)) {
        placement.x = (rect.left + rect.width) - (displayTooltip ? -tooltipOffset : (component.width / 2) - offsetX);
      }
      else {
        placement.x = rect.left + ((rect.width / 2) - (component.width / 2));
      }

      // Calculate y position
      if (/^top/.test(position)) {
        placement.y = (rect.top - scrollTop) - (displayTooltip ? component.height + tooltipOffset : (component.height / 2) + offsetY);
      }
      else if (/^bottom/.test(position)) {
        placement.y = (rect.top - scrollTop) + (rect.height - (displayTooltip ? -tooltipOffset : (component.height / 2) - offsetY));
      }
      else {
        placement.y = (rect.top - scrollTop);
      }

      if (/^bottom|^top/.test(position)) {
        if (/left/.test(position)) {
          placement.x = rect.left - (displayTooltip ? tooltipOffset : component.width / 2);
        }
        else if (/right/.test(position)) {
          placement.x = rect.left + (rect.width - (displayTooltip ? component.width - tooltipOffset : component.width / 2));
        }
      }

      this.setState({
        shouldRedraw: false,
        xPos: this.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
        yPos: this.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height),
        redraw: false
      }, () => {
        if (typeof callback === 'function') {
          // Execute callback after the scrolling transition is finished
          setTimeout(() => { callback(); }, 50);
        }
      });
    }
  }

  /**
   * Update position for small screens.
   *
   * @private
   * @param {Object} step
   *
   * @returns {string}
   */
  calcPosition(step) {
    const { tooltipOffset } = this.props;
    const body = this.getScrollContainer().getBoundingClientRect();
    const target = this.getStepTargetElement(step);
    const width = this.getElementDimensions().width || DEFAULTS.minWidth;
    const rect = target.getBoundingClientRect();
    let position = step.position || DEFAULTS.position;

    if (/^left/.test(position) && rect.left - (width + tooltipOffset) < 0) {
      position = 'top';
    }
    else if (/^right/.test(position) && (rect.left + rect.width + (width + tooltipOffset)) > body.width) {
      position = 'bottom';
    }

    return position;
  }

  /**
   * Get the render stage.
   *
   * @private
   * @returns {string}
   */
  getRenderStage() {
    const { shouldRedraw, xPos } = this.state;

    if (shouldRedraw) {
      return ':redraw';
    }
    else if (xPos < 0) {
      return ':pre-render';
    }

    return '';
  }

  /**
   * Prevent tooltip to render outside the window
   *
   * @private
   * @param {Number} value - The axis position
   * @param {String} axis - The Axis X or Y
   * @param {Number} elWidth - The target element width
   * @param {Number} elHeight - The target element height
   * @returns {Number}
   */
  preventWindowOverflow(value, axis, elWidth, elHeight) {
    const winWidth = window.innerWidth;
    const body = this.getScrollContainer();
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    let newValue = value;

    if (axis === 'x') {
      if (value + elWidth >= winWidth) {
        newValue = winWidth - elWidth - 15;
      }
      else if (value < 15) {
        newValue = 15;
      }
    }
    else if (axis === 'y') {
      if (value + elHeight >= docHeight) {
        newValue = docHeight - elHeight - 15;
      }
      else if (value < 15) {
        newValue = 15;
      }
    }

    return newValue;
  }

  /**
   * Create a React Element
   *
   * @private
   * @returns {boolean|ReactComponent}
   */
  createComponent() {
    const { index, shouldRedraw, shouldRenderTooltip, standaloneData, xPos, yPos } = this.state;
    const {
      disableOverlay,
      holePadding,
      locale,
      showBackButton,
      showOverlay,
      showSkipButton,
      showStepsProgress,
      steps,
      type
    } = this.props;
    const currentStep = standaloneData || steps[index];
    const step = { ...currentStep };

    const target = this.getStepTargetElement(step);
    let component;

    const allowClicksThruHole = (step && step.allowClicksThruHole) || this.props.allowClicksThruHole;
    const shouldShowOverlay = standaloneData ? false : showOverlay;
    const useYPos = (yPos + (step.offsetY || 0));
    const useXPos = (xPos + (step.offsetX || 0));
    const buttons = {
      primary: locale.close
    };

    logger({
      type: `joyride:createComponent${this.getRenderStage()}`,
      msg: [
        'component:', shouldRenderTooltip || standaloneData ? 'Tooltip' : 'Beacon',
        'animate:', xPos > -1 && !shouldRedraw,
        'step:', step
      ],
      debug: this.props.debug,
      warn: !target,
    });

    if (!target) {
      return false;
    }

    if (shouldRenderTooltip || standaloneData) {
      const position = this.calcPosition(step);

      if (!standaloneData) {
        if (['continuous', 'guided'].indexOf(type) > -1) {
          buttons.primary = locale.last;

          if (steps[index + 1]) {
            if (showStepsProgress) {
              let next = locale.next;
              if (typeof locale.next === 'string') {
                next = (<span>{locale.next}</span>);
              }
              buttons.primary = (<span>{next} <span>{`${(index + 1)}/${steps.length}`}</span></span>);
            }
            else {
              buttons.primary = locale.next;
            }
          }

          if (showBackButton && index > 0) {
            buttons.secondary = locale.back;
          }
        }

        if (showSkipButton) {
          buttons.skip = locale.skip;
        }
      }

      component = React.createElement(Tooltip, {
        allowClicksThruHole,
        animate: xPos > -1 && !shouldRedraw,
        buttons,
        disableOverlay,
        holePadding,
        position,
        selector: sanitizeSelector(step.selector),
        showOverlay: shouldShowOverlay,
        step,
        standalone: Boolean(standaloneData),
        target,
        type,
        xPos: useXPos,
        yPos: useYPos,
        onClick: this.onClickTooltip,
        onRender: this.onRenderTooltip
      });
    }
    else {
      if (step && step.scrollContainerSelector) {
        const scrollElement = this.getScrollContainer(step.scrollContainerSelector);
        const containerRect = scrollElement.getBoundingClientRect();
        const offsetY = (window.pageYOffset || document.documentElement.pageYOffset) || 0;
        const offsetX = (window.pageXOffset || document.documentElement.pageXOffset) || 0;
        const outOfYView = Math.abs(useYPos - offsetY) < containerRect.top || Math.abs(useYPos - offsetY) > containerRect.bottom;
        const outOfXView = Math.abs(useXPos - offsetX) < containerRect.left || Math.abs(useXPos - offsetX) > containerRect.right;

        // Don't show the beacon if it's out of view in the scroll container
        if (outOfYView || outOfXView) {
          return false;
        }
      }

      component = React.createElement(Beacon, {
        step,
        xPos: useXPos,
        yPos: useYPos,
        onTrigger: this.onClickBeacon,
        eventType: step.type || 'click'
      });
    }

    return component;
  }

  render() {
    const { index, isRunning, standaloneData } = this.state;
    const { steps } = this.props;
    const hasStep = Boolean(steps[index]);
    let component;
    let standaloneComponent;

    if (isRunning && hasStep) {
      logger({
        type: `joyride:render${this.getRenderStage()}`,
        msg: ['step:', steps[index]],
        debug: this.props.debug,
      });
    }
    else if (!isRunning && standaloneData) {
      logger({
        type: 'joyride:render',
        msg: ['tooltip:', standaloneData],
        debug: this.props.debug,
      });
    }

    if (standaloneData) {
      standaloneComponent = this.createComponent();
    }
    else if (isRunning && hasStep) {
      component = this.createComponent();
    }

    return (
      <div className="joyride">
        {component}
        {standaloneComponent}
      </div>
    );
  }
}

export default Joyride;
