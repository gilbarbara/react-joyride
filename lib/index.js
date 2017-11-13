'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _scroll = require('scroll');

var _scroll2 = _interopRequireDefault(_scroll);

var _nestedProperty = require('nested-property');

var _nestedProperty2 = _interopRequireDefault(_nestedProperty);

var _utils = require('./utils');

var _Beacon = require('./Beacon');

var _Beacon2 = _interopRequireDefault(_Beacon);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultState = {
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

var callbackTypes = {
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

var DEFAULTS = {
  position: 'top',
  minWidth: 290
};

var hasTouch = false;

var Joyride = function (_React$Component) {
  _inherits(Joyride, _React$Component);

  function Joyride(props) {
    _classCallCheck(this, Joyride);

    var _this = _possibleConstructorReturn(this, (Joyride.__proto__ || Object.getPrototypeOf(Joyride)).call(this, props));

    _this.handleKeyboardNavigation = function (e) {
      var _this$state = _this.state,
          index = _this$state.index,
          shouldRenderTooltip = _this$state.shouldRenderTooltip;
      var steps = _this.props.steps;

      var intKey = window.Event ? e.which : e.keyCode;
      var hasSteps = void 0;

      if (shouldRenderTooltip) {
        if ([32, 38, 40].indexOf(intKey) > -1) {
          e.preventDefault();
        }

        if (intKey === 27) {
          _this.toggleTooltip({ show: false, index: index + 1, action: 'esc' });
        } else if ([13, 32].indexOf(intKey) > -1) {
          hasSteps = Boolean(steps[index + 1]);
          _this.toggleTooltip({ show: hasSteps, index: index + 1, action: 'next' });
        }
      }
    };

    _this.handleClickStandaloneTrigger = function (e) {
      e.preventDefault();
      var _this$state2 = _this.state,
          isRunning = _this$state2.isRunning,
          standaloneData = _this$state2.standaloneData;

      var tooltipData = e.currentTarget.dataset.tooltip;

      if (['mouseenter', 'mouseleave'].includes(e.type) && hasTouch) {
        return;
      }

      /* istanbul ignore else */
      if (tooltipData) {
        tooltipData = JSON.parse(tooltipData);

        if (!standaloneData || standaloneData.selector !== tooltipData.selector) {
          _this.setState({
            isRunning: false,
            shouldRenderTooltip: false,
            shouldRun: isRunning,
            standaloneData: tooltipData,
            xPos: -1000,
            yPos: -1000
          });
        } else {
          document.querySelector('.joyride-tooltip__close').click();
        }
      }
    };

    _this.handleClickBeacon = function (e) {
      e.preventDefault();
      var index = _this.state.index;
      var steps = _this.props.steps;


      _this.triggerCallback({
        action: e.type,
        index: index,
        type: callbackTypes.BEACON_TRIGGER,
        step: steps[index]
      });

      _this.toggleTooltip({ show: true, index: index, action: 'beacon:' + e.type });
    };

    _this.handleClickTooltip = function (e) {
      var _this$state3 = _this.state,
          index = _this$state3.index,
          shouldRun = _this$state3.shouldRun;
      var _this$props = _this.props,
          steps = _this$props.steps,
          type = _this$props.type;

      var el = e.currentTarget.className.includes('joyride-') && ['A', 'BUTTON'].includes(e.currentTarget.tagName) ? e.currentTarget : e.target;
      var dataType = el.dataset.type;

      /* istanbul ignore else */
      if (el.className.indexOf('joyride-') === 0) {
        e.preventDefault();
        e.stopPropagation();
        var tooltip = document.querySelector('.joyride-tooltip');
        var newIndex = index + (dataType === 'back' ? -1 : 1);

        if (dataType === 'skip') {
          _this.setState({
            isTourSkipped: true
          });
          newIndex = steps.length + 1;
        }

        /* istanbul ignore else */
        if (tooltip.classList.contains('joyride-tooltip--standalone')) {
          _this.setState({
            isRunning: shouldRun,
            shouldRedraw: true,
            shouldRun: false,
            standaloneData: false
          });
        } else if (dataType) {
          var shouldDisplay = ['continuous', 'guided'].indexOf(type) > -1 && ['close', 'skip'].indexOf(dataType) === -1 && Boolean(steps[newIndex]);

          _this.toggleTooltip({ show: shouldDisplay, index: newIndex, action: dataType });
        }

        if (e.target.className === 'joyride-overlay') {
          _this.triggerCallback({
            action: 'click',
            type: callbackTypes.OVERLAY,
            step: steps[index]
          });
        }

        if (e.target.classList.contains('joyride-hole')) {
          _this.triggerCallback({
            action: 'click',
            type: callbackTypes.HOLE,
            step: steps[index]
          });
        }
      }
    };

    _this.handleRenderTooltip = function () {
      _this.calcPlacement();
    };

    _this.state = _extends({}, defaultState);

    _this.listeners = {
      tooltips: {}
    };
    return _this;
  }

  _createClass(Joyride, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          autoStart = _props.autoStart,
          keyboardNavigation = _props.keyboardNavigation,
          resizeDebounce = _props.resizeDebounce,
          resizeDebounceDelay = _props.resizeDebounceDelay,
          run = _props.run,
          steps = _props.steps,
          type = _props.type;


      (0, _utils.logger)({
        type: 'joyride:initialized',
        msg: [this.props],
        debug: this.props.debug
      });

      var stepsAreValid = this.checkStepsValidity(steps);
      if (steps && stepsAreValid && run) {
        this.start(autoStart);
      }

      if (resizeDebounce) {
        var timeoutId = void 0;

        this.listeners.resize = function () {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            timeoutId = null;
            _this2.calcPlacement();
          }, resizeDebounceDelay);
        };
      } else {
        this.listeners.resize = function () {
          _this2.calcPlacement();
        };
      }
      window.addEventListener('resize', this.listeners.resize);

      /* istanbul ignore else */
      if (keyboardNavigation && type === 'continuous') {
        this.listeners.keyboard = this.handleKeyboardNavigation;
        document.body.addEventListener('keydown', this.listeners.keyboard);
      }

      window.addEventListener('touchstart', function setHasTouch() {
        hasTouch = true;
        // Remove event listener once fired, otherwise it'll kill scrolling
        // performance
        window.removeEventListener('touchstart', setHasTouch);
      }, false);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _utils.logger)({
        type: 'joyride:willReceiveProps',
        msg: [nextProps],
        debug: nextProps.debug
      });

      var _state = this.state,
          isRunning = _state.isRunning,
          shouldRun = _state.shouldRun,
          standaloneData = _state.standaloneData;
      var _props2 = this.props,
          keyboardNavigation = _props2.keyboardNavigation,
          run = _props2.run,
          steps = _props2.steps,
          stepIndex = _props2.stepIndex;

      var stepsChanged = nextProps.steps !== steps;
      var stepIndexChanged = nextProps.stepIndex !== stepIndex && nextProps.stepIndex !== this.state.index;
      var runChanged = nextProps.run !== run;
      var shouldStart = false;
      var didStop = false;

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

      /* istanbul ignore else */
      if (runChanged) {
        // run prop was changed to off, so stop the joyride
        if (run && !nextProps.run) {
          this.stop();
          didStop = true;
        }
        // run prop was changed to on, so start the joyride
        else if (!run && nextProps.run) {
            shouldStart = true;
          }
          // Was not playing, but should, and isn't a standaloneData
          else if (!isRunning && shouldRun && !standaloneData) {
              shouldStart = true;
            }
      }

      /* istanbul ignore else */
      if (stepIndexChanged) {
        var hasStep = nextProps.steps[nextProps.stepIndex];
        var shouldDisplay = hasStep && nextProps.autoStart;
        if (runChanged && shouldStart) {
          this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
        }
        // Next prop is set to run, and the index has changed, but for some reason joyride is not running
        // (maybe this is because of a target not mounted, and the app wants to skip to another step)
        else if (nextProps.run && !isRunning) {
            this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
          } else if (!didStop) {
            this.toggleTooltip({ show: shouldDisplay, index: nextProps.stepIndex, steps: nextProps.steps, action: 'jump' });
          }
      }
      // Did not change the index, but need to start up the joyride
      else if (shouldStart) {
          this.start(nextProps.autoStart, nextProps.steps);
        }

      // Update keyboard listeners if necessary
      /* istanbul ignore else */
      if (!this.listeners.keyboard && (!keyboardNavigation && nextProps.keyboardNavigation || keyboardNavigation) && nextProps.type === 'continuous') {
        this.listeners.keyboard = this.handleKeyboardNavigation;
        document.body.addEventListener('keydown', this.listeners.keyboard);
      } else if (this.listeners.keyboard && keyboardNavigation && (!nextProps.keyboardNavigation || nextProps.type !== 'continuous')) {
        document.body.removeEventListener('keydown', this.listeners.keyboard);
        delete this.listeners.keyboard;
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _state2 = this.state,
          index = _state2.index,
          isRunning = _state2.isRunning,
          shouldRenderTooltip = _state2.shouldRenderTooltip,
          standaloneData = _state2.standaloneData;
      var steps = this.props.steps;
      var nextSteps = nextProps.steps;

      var step = steps[index];
      var nextStep = nextSteps[nextState.index];
      var hasRenderedTarget = Boolean(this.getStepTargetElement(nextStep));

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
            step: nextStep
          });
        }
      }

      // Started running from the beginning (the current index is 0)
      if (!isRunning && nextState.isRunning && nextState.index === 0) {
        this.triggerCallback({
          action: 'start',
          index: nextState.index,
          type: callbackTypes.STEP_BEFORE,
          step: nextStep
        });

        // Not showing a tooltip yet, so we're going to show a beacon instead
        /* istanbul ignore else */
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
          index: index,
          type: callbackTypes.STEP_AFTER,
          step: step
        });

        // Attempted to advance to a step with a target that cannot be found
        /* istanbul ignore else */
        if (nextStep && !hasRenderedTarget) {
          console.warn('Target not mounted', nextStep, nextState.action); //eslint-disable-line no-console
          this.triggerCallback({
            action: nextState.action,
            index: nextState.index,
            type: callbackTypes.TARGET_NOT_FOUND,
            step: nextStep
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
      if (!nextState.isRunning && nextSteps.length && index !== nextState.index && !nextStep) {
        this.triggerCallback({
          action: nextState.action,
          type: callbackTypes.FINISHED,
          steps: nextSteps,
          isTourSkipped: nextState.isTourSkipped
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _state3 = this.state,
          index = _state3.index,
          shouldRedraw = _state3.shouldRedraw,
          isRunning = _state3.isRunning,
          shouldRun = _state3.shouldRun,
          standaloneData = _state3.standaloneData;
      var _props3 = this.props,
          scrollToFirstStep = _props3.scrollToFirstStep,
          scrollToSteps = _props3.scrollToSteps,
          steps = _props3.steps;

      var step = steps[index];
      var scrollTop = this.getScrollTop();
      var shouldScroll = (scrollToFirstStep || index > 0 || prevState.index > index) && step && !step.isFixed; // fixed steps don't need to scroll

      if (shouldRedraw && step) {
        this.calcPlacement();
      }

      if (isRunning && scrollToSteps && shouldScroll && scrollTop >= 0) {
        _scroll2.default.top((0, _utils.getRootEl)(), this.getScrollTop());
      }

      if (steps.length && !isRunning && shouldRun && !standaloneData) {
        this.start();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      window.removeEventListener('resize', this.listeners.resize);

      /* istanbul ignore else */
      if (this.listeners.keyboard) {
        document.body.removeEventListener('keydown', this.listeners.keyboard);
      }

      /* istanbul ignore else */
      if (Object.keys(this.listeners.tooltips).length) {
        Object.keys(this.listeners.tooltips).map(function (key) {
          return {
            el: document.querySelector(key),
            event: _this3.listeners.tooltips[key].event,
            cb: _this3.listeners.tooltips[key].cb,
            key: key
          };
        }).filter(function (_ref) {
          var el = _ref.el;
          return !!el;
        }).forEach(function (_ref2) {
          var el = _ref2.el,
              event = _ref2.event,
              cb = _ref2.cb,
              key = _ref2.key;

          el.removeEventListener(event, cb);
          delete _this3.listeners.tooltips[key];
        });
      }
    }

    /**
     * Starts the tour
     *
     * @private
     *
     * @param {boolean} [autorun] - Starts with the first tooltip opened
     * @param {Array} [steps] - Array of steps, defaults to this.props.steps
     * @param {number} [startIndex] - Optional step index to start joyride at
     */

  }, {
    key: 'start',
    value: function start(autorun) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.steps;
      var startIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.index;

      var hasMountedTarget = Boolean(this.getStepTargetElement(steps[startIndex]));
      var shouldRenderTooltip = autorun === true && hasMountedTarget;

      (0, _utils.logger)({
        type: 'joyride:start',
        msg: ['autorun:', autorun === true],
        debug: this.props.debug
      });

      this.setState({
        action: 'start',
        index: startIndex,
        isRunning: Boolean(steps.length) && hasMountedTarget,
        shouldRenderTooltip: shouldRenderTooltip,
        shouldRun: !steps.length
      });
    }

    /**
     * Stop the tour
     *
     * @private
     */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _utils.logger)({
        type: 'joyride:stop',
        debug: this.props.debug
      });

      this.setState({
        isRunning: false,
        shouldRenderTooltip: false
      });
    }

    /**
     * Move to the next step, if there is one.  If there is no next step, hide the tooltip.
     */

  }, {
    key: 'next',
    value: function next() {
      var _state4 = this.state,
          index = _state4.index,
          shouldRenderTooltip = _state4.shouldRenderTooltip;
      var steps = this.props.steps;

      var nextIndex = index + 1;

      var shouldDisplay = Boolean(steps[nextIndex]) && shouldRenderTooltip;

      (0, _utils.logger)({
        type: 'joyride:next',
        msg: ['new index:', nextIndex],
        debug: this.props.debug
      });
      this.toggleTooltip({ show: shouldDisplay, index: nextIndex, action: 'next' });
    }

    /**
     * Move to the previous step, if there is one.  If there is no previous step, hide the tooltip.
     */

  }, {
    key: 'back',
    value: function back() {
      var _state5 = this.state,
          index = _state5.index,
          shouldRenderTooltip = _state5.shouldRenderTooltip;
      var steps = this.props.steps;

      var previousIndex = index - 1;

      var shouldDisplay = Boolean(steps[previousIndex]) && shouldRenderTooltip;

      (0, _utils.logger)({
        type: 'joyride:back',
        msg: ['new index:', previousIndex],
        debug: this.props.debug
      });
      this.toggleTooltip({ show: shouldDisplay, index: previousIndex, action: 'next' });
    }

    /**
     * Reset Tour
     *
     * @param {boolean} [restart] - Starts the new tour right away
     */

  }, {
    key: 'reset',
    value: function reset(restart) {
      var _state6 = this.state,
          index = _state6.index,
          isRunning = _state6.isRunning;

      var shouldRestart = restart === true;

      var newState = _extends({}, defaultState, {
        isRunning: shouldRestart,
        shouldRenderTooltip: this.props.autoStart
      });

      (0, _utils.logger)({
        type: 'joyride:reset',
        msg: ['restart:', shouldRestart],
        debug: this.props.debug
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

  }, {
    key: 'getProgress',
    value: function getProgress() {
      var index = this.state.index;
      var steps = this.props.steps;


      (0, _utils.logger)({
        type: 'joyride:getProgress',
        msg: ['steps:', steps],
        debug: this.props.debug
      });

      return {
        index: index,
        percentageComplete: parseFloat((index / steps.length * 100).toFixed(2).replace('.00', '')),
        step: steps[index]
      };
    }

    /**
     * Add standalone tooltip events
     *
     * @param {Object} data - Similar shape to a 'step', but for a single tooltip
     */

  }, {
    key: 'addTooltip',
    value: function addTooltip(data) {
      if (!this.checkStepValidity(data)) {
        (0, _utils.logger)({
          type: 'joyride:addTooltip:FAIL',
          msg: ['data:', data],
          debug: this.props.debug
        });

        return;
      }

      (0, _utils.logger)({
        type: 'joyride:addTooltip',
        msg: ['data:', data],
        debug: this.props.debug
      });

      var key = data.trigger || (0, _utils.sanitizeSelector)(data.selector);
      var el = document.querySelector(key);

      if (!el) {
        return;
      }

      el.setAttribute('data-tooltip', JSON.stringify(data));
      var eventType = data.event || 'click';

      /* istanbul ignore else */
      if (eventType === 'hover') {
        this.listeners.tooltips[key + 'mouseenter'] = { event: 'mouseenter', cb: this.handleClickStandaloneTrigger };
        this.listeners.tooltips[key + 'mouseleave'] = { event: 'mouseleave', cb: this.handleClickStandaloneTrigger };

        el.addEventListener('mouseenter', this.listeners.tooltips[key + 'mouseenter'].cb);
        el.addEventListener('mouseleave', this.listeners.tooltips[key + 'mouseleave'].cb);
      }

      this.listeners.tooltips[key + 'click'] = { event: 'click', cb: this.handleClickStandaloneTrigger };
      el.addEventListener('click', this.listeners.tooltips[key + 'click'].cb);
    }

    /**
     * Parse the incoming steps
     *
     * @deprecated
     *
     * @param {Array|Object} steps
     * @returns {Array}
     */

  }, {
    key: 'parseSteps',
    value: function parseSteps(steps) {
      console.warn('joyride.parseSteps() is deprecated.  It is no longer necessary to parse steps before providing them to Joyride'); //eslint-disable-line no-console

      return steps;
    }

    /**
     * Verify that a step is valid
     *
     * @param {Object} step - A step object
     * @returns {boolean} - True if the step is valid, false otherwise
     */

  }, {
    key: 'checkStepValidity',
    value: function checkStepValidity(step) {
      var _this4 = this;

      // Check that the step is the proper type
      if (!step || (typeof step === 'undefined' ? 'undefined' : _typeof(step)) !== 'object' || Array.isArray(step)) {
        (0, _utils.logger)({
          type: 'joyride:checkStepValidity',
          msg: 'Did not provide a step object.',
          warn: true,
          debug: this.props.debug
        });

        return false;
      }

      // Check that all required step fields are present
      var requiredFields = ['selector'];
      var hasRequiredField = function hasRequiredField(requiredField) {
        var hasField = Boolean(step[requiredField]);

        if (!hasField) {
          (0, _utils.logger)({
            type: 'joyride:checkStepValidity',
            msg: ['Provided a step without the required ' + requiredField + ' property.', 'Step:', step],
            warn: true,
            debug: _this4.props.debug
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

  }, {
    key: 'checkStepsValidity',
    value: function checkStepsValidity(steps) {
      /* istanbul ignore else */
      if (!Array.isArray(steps) && (typeof steps === 'undefined' ? 'undefined' : _typeof(steps)) === 'object') {
        return this.checkStepValidity(steps);
      } else if (steps.length > 0) {
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

  }, {
    key: 'getStepTargetElement',
    value: function getStepTargetElement(step) {
      var isValidStep = this.checkStepValidity(step);
      if (!isValidStep) {
        return null;
      }

      var el = document.querySelector((0, _utils.sanitizeSelector)(step.selector));

      if (!el) {
        (0, _utils.logger)({
          type: 'joyride:getStepTargetElement',
          msg: 'Target not rendered. For best results only add steps after they are mounted.',
          warn: true,
          debug: this.props.debug
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

  }, {
    key: 'getElementDimensions',
    value: function getElementDimensions() {
      var _state7 = this.state,
          shouldRenderTooltip = _state7.shouldRenderTooltip,
          standaloneData = _state7.standaloneData;

      var displayTooltip = standaloneData ? true : shouldRenderTooltip;
      var el = document.querySelector(displayTooltip ? '.joyride-tooltip' : '.joyride-beacon');

      var height = 0;
      var width = 0;

      if (el) {
        var styles = window.getComputedStyle(el);
        height = el.clientHeight + parseInt(styles.marginTop || 0, 10) + parseInt(styles.marginBottom || 0, 10);
        width = el.clientWidth + parseInt(styles.marginLeft || 0, 10) + parseInt(styles.marginRight || 0, 10);
      }

      return {
        height: height,
        width: width
      };
    }

    /**
     * Get the scrollTop position
     *
     * @private
     * @returns {number}
     */

  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      var _state8 = this.state,
          index = _state8.index,
          yPos = _state8.yPos;
      var _props4 = this.props,
          offsetParentSelector = _props4.offsetParentSelector,
          scrollOffset = _props4.scrollOffset,
          steps = _props4.steps;

      var step = steps[index];
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));

      if (!target) {
        return 0;
      }

      var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);
      var targetTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop);
      var position = this.calcPosition(step);
      var scrollTo = 0;

      /* istanbul ignore else */
      if (/^top/.test(position)) {
        scrollTo = Math.floor(yPos - scrollOffset);
      } else if (/^bottom|^left|^right/.test(position)) {
        scrollTo = Math.floor(targetTop - scrollOffset);
      }

      return scrollTo;
    }

    /**
     * Trigger the callback.
     *
     * @private
     * @param {Object} options
     */

  }, {
    key: 'triggerCallback',
    value: function triggerCallback(options) {
      var callback = this.props.callback;

      /* istanbul ignore else */

      if (typeof callback === 'function') {
        (0, _utils.logger)({
          type: 'joyride:triggerCallback',
          msg: [options],
          debug: this.props.debug
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


    /**
     * Tooltip event listener
     *
     * @private
     * @param {Event} e - Click event
     */


    /**
     * Beacon click event listener
     *
     * @private
     * @param {Event} e - Click event
     */


    /**
     * Tooltip click event listener
     *
     * @private
     * @param {Event} e - Click event
     */

  }, {
    key: 'toggleTooltip',


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
    value: function toggleTooltip(_ref3) {
      var show = _ref3.show,
          _ref3$index = _ref3.index,
          index = _ref3$index === undefined ? this.state.index : _ref3$index,
          action = _ref3.action,
          _ref3$steps = _ref3.steps,
          steps = _ref3$steps === undefined ? this.props.steps : _ref3$steps;

      var nextStep = steps[index];
      var hasMountedTarget = Boolean(this.getStepTargetElement(nextStep));

      this.setState({
        action: action,
        index: index,
        // Stop playing if there is no next step or can't find the target
        isRunning: nextStep && hasMountedTarget ? this.state.isRunning : false,
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
     */

  }, {
    key: 'calcPlacement',
    value: function calcPlacement() {
      var _state9 = this.state,
          index = _state9.index,
          isRunning = _state9.isRunning,
          standaloneData = _state9.standaloneData,
          shouldRenderTooltip = _state9.shouldRenderTooltip;
      var _props5 = this.props,
          offsetParentSelector = _props5.offsetParentSelector,
          steps = _props5.steps,
          tooltipOffset = _props5.tooltipOffset;

      var step = standaloneData || steps[index] || {};
      var displayTooltip = standaloneData ? true : shouldRenderTooltip;
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));

      (0, _utils.logger)({
        type: 'joyride:calcPlacement' + this.getRenderStage(),
        msg: ['step:', step],
        debug: this.props.debug
      });

      /* istanbul ignore else */
      if (!target) {
        return;
      }

      var placement = {
        x: -1000,
        y: -1000
      };

      /* istanbul ignore else */
      if (step && (standaloneData || isRunning && steps[index])) {
        var offsetX = _nestedProperty2.default.get(step, 'style.beacon.offsetX') || 0;
        var offsetY = _nestedProperty2.default.get(step, 'style.beacon.offsetY') || 0;
        var position = this.calcPosition(step);
        var scrollingElement = (0, _utils.getRootEl)().getBoundingClientRect();
        var scrollTop = step.isFixed === true ? 0 : scrollingElement.top;
        var component = this.getElementDimensions();
        var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);

        // Calculate x position
        if (/^left/.test(position)) {
          placement.x = rect.left - (displayTooltip ? component.width + tooltipOffset : component.width / 2 + offsetX);
        } else if (/^right/.test(position)) {
          placement.x = rect.left + rect.width - (displayTooltip ? -tooltipOffset : component.width / 2 - offsetX);
        } else {
          placement.x = rect.left + (rect.width / 2 - component.width / 2);
        }

        // Calculate y position
        if (/^top/.test(position)) {
          placement.y = rect.top - scrollTop - (displayTooltip ? component.height + tooltipOffset : component.height / 2 + offsetY);
        } else if (/^bottom/.test(position)) {
          placement.y = rect.top - scrollTop + (rect.height - (displayTooltip ? -tooltipOffset : component.height / 2 - offsetY));
        } else {
          placement.y = rect.top - scrollTop;
        }

        /* istanbul ignore else */
        if (/^bottom|^top/.test(position)) {
          if (/left/.test(position)) {
            placement.x = rect.left - (displayTooltip ? tooltipOffset : component.width / 2);
          } else if (/right/.test(position)) {
            placement.x = rect.left + (rect.width - (displayTooltip ? component.width - tooltipOffset : component.width / 2));
          }
        }

        this.setState({
          shouldRedraw: false,
          xPos: this.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
          yPos: this.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height)
        });
      }
    }

    /**
     * Update position for overflowing elements.
     *
     * @private
     * @param {Object} step
     *
     * @returns {string}
     */

  }, {
    key: 'calcPosition',
    value: function calcPosition(step) {
      var _props6 = this.props,
          offsetParentSelector = _props6.offsetParentSelector,
          tooltipOffset = _props6.tooltipOffset;

      var scrollingElement = (0, _utils.getRootEl)();
      var scrollingElementRect = scrollingElement.getBoundingClientRect();
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));
      var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);

      var _getElementDimensions = this.getElementDimensions(),
          height = _getElementDimensions.height,
          _getElementDimensions2 = _getElementDimensions.width,
          width = _getElementDimensions2 === undefined ? DEFAULTS.minWidth : _getElementDimensions2;

      var position = step.position || DEFAULTS.position;

      if (/^left/.test(position) && rect.left - (width + tooltipOffset) < 0) {
        position = 'top';
      } else if (/^right/.test(position) && rect.left + rect.width + (width + tooltipOffset) > scrollingElementRect.width) {
        position = 'bottom';
      }

      if (/^top/.test(position) && (rect.top + scrollingElement.scrollTop - (height + tooltipOffset) < 0 || step.isFixed && rect.top - height < 0)) {
        position = 'bottom';
      } else if (/^bottom/.test(position) && (rect.top + scrollingElement.scrollTop + (height + tooltipOffset) > (0, _utils.getDocHeight)() || step.isFixed && rect.top + rect.height + height > scrollingElementRect.height)) {
        position = 'top';
      }

      return position;
    }

    /**
     * Get the render stage.
     *
     * @private
     * @returns {string}
     */

  }, {
    key: 'getRenderStage',
    value: function getRenderStage() {
      var _state10 = this.state,
          shouldRedraw = _state10.shouldRedraw,
          xPos = _state10.xPos;


      if (shouldRedraw) {
        return ':redraw';
      } else if (xPos < 0) {
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

  }, {
    key: 'preventWindowOverflow',
    value: function preventWindowOverflow(value, axis, elWidth, elHeight) {
      var winWidth = window.innerWidth;
      var docHeight = (0, _utils.getDocHeight)();
      var newValue = value;

      /* istanbul ignore else */
      if (axis === 'x') {
        if (value + elWidth >= winWidth) {
          newValue = winWidth - elWidth - 15;
        } else if (value < 15) {
          newValue = 15;
        }
      } else if (axis === 'y') {
        if (value + elHeight >= docHeight) {
          newValue = docHeight - elHeight - 15;
        } else if (value < 15) {
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

  }, {
    key: 'createComponent',
    value: function createComponent() {
      var _state11 = this.state,
          index = _state11.index,
          shouldRedraw = _state11.shouldRedraw,
          shouldRenderTooltip = _state11.shouldRenderTooltip,
          standaloneData = _state11.standaloneData,
          xPos = _state11.xPos,
          yPos = _state11.yPos;
      var _props7 = this.props,
          disableOverlay = _props7.disableOverlay,
          holePadding = _props7.holePadding,
          locale = _props7.locale,
          offsetParentSelector = _props7.offsetParentSelector,
          showBackButton = _props7.showBackButton,
          showOverlay = _props7.showOverlay,
          showSkipButton = _props7.showSkipButton,
          showStepsProgress = _props7.showStepsProgress,
          steps = _props7.steps,
          type = _props7.type;

      var currentStep = standaloneData || steps[index];
      var step = _extends({}, currentStep);

      var target = this.getStepTargetElement(step);
      var component = void 0;

      var allowClicksThruHole = step && step.allowClicksThruHole || this.props.allowClicksThruHole;
      var shouldShowOverlay = standaloneData ? false : showOverlay;
      var buttons = {
        primary: locale.close
      };

      (0, _utils.logger)({
        type: 'joyride:createComponent' + this.getRenderStage(),
        msg: ['component:', shouldRenderTooltip || standaloneData ? 'Tooltip' : 'Beacon', 'animate:', xPos > -1 && !shouldRedraw, 'step:', step],
        debug: this.props.debug,
        warn: !target
      });

      if (!target) {
        return false;
      }

      if (shouldRenderTooltip || standaloneData) {
        var position = this.calcPosition(step);

        /* istanbul ignore else */
        if (!standaloneData) {
          /* istanbul ignore else */
          if (['continuous', 'guided'].indexOf(type) > -1) {
            buttons.primary = locale.last;

            /* istanbul ignore else */
            if (steps[index + 1]) {
              if (showStepsProgress) {
                var next = locale.next;


                if (typeof locale.next === 'string') {
                  next = _react2.default.createElement(
                    'span',
                    null,
                    locale.next
                  );
                }

                buttons.primary = _react2.default.createElement(
                  'span',
                  null,
                  next,
                  ' ',
                  _react2.default.createElement(
                    'span',
                    null,
                    index + 1 + '/' + steps.length
                  )
                );
              } else {
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

        component = _react2.default.createElement(_Tooltip2.default, {
          allowClicksThruHole: allowClicksThruHole,
          animate: xPos > -1 && !shouldRedraw,
          buttons: buttons,
          disableOverlay: disableOverlay,
          holePadding: holePadding,
          offsetParentSelector: offsetParentSelector,
          position: position,
          selector: (0, _utils.sanitizeSelector)(step.selector),
          showOverlay: shouldShowOverlay,
          step: step,
          standalone: Boolean(standaloneData),
          target: target,
          type: type,
          xPos: xPos,
          yPos: yPos,
          onClick: this.handleClickTooltip,
          onRender: this.handleRenderTooltip
        });
      } else {
        component = _react2.default.createElement(_Beacon2.default, {
          step: step,
          xPos: xPos,
          yPos: yPos,
          onTrigger: this.handleClickBeacon,
          eventType: step.type || 'click'
        });
      }

      return component;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state12 = this.state,
          index = _state12.index,
          isRunning = _state12.isRunning,
          standaloneData = _state12.standaloneData;
      var steps = this.props.steps;

      var hasStep = Boolean(steps[index]);
      var component = void 0;
      var standaloneComponent = void 0;

      if (isRunning && hasStep) {
        (0, _utils.logger)({
          type: 'joyride:render' + this.getRenderStage(),
          msg: ['step:', steps[index]],
          debug: this.props.debug
        });
      } else if (!isRunning && standaloneData) {
        (0, _utils.logger)({
          type: 'joyride:render',
          msg: ['tooltip:', standaloneData],
          debug: this.props.debug
        });
      }

      if (standaloneData) {
        standaloneComponent = this.createComponent();
      } else if (isRunning && hasStep) {
        component = this.createComponent();
      }

      return _react2.default.createElement(
        'div',
        { className: 'joyride' },
        component,
        standaloneComponent
      );
    }
  }]);

  return Joyride;
}(_react2.default.Component);

Joyride.propTypes = {
  allowClicksThruHole: _propTypes2.default.bool,
  autoStart: _propTypes2.default.bool,
  callback: _propTypes2.default.func,
  debug: _propTypes2.default.bool,
  disableOverlay: _propTypes2.default.bool,
  holePadding: _propTypes2.default.number,
  keyboardNavigation: _propTypes2.default.bool,
  locale: _propTypes2.default.object,
  offsetParentSelector: _propTypes2.default.string,
  resizeDebounce: _propTypes2.default.bool,
  resizeDebounceDelay: _propTypes2.default.number,
  run: _propTypes2.default.bool,
  scrollOffset: _propTypes2.default.number,
  scrollToFirstStep: _propTypes2.default.bool,
  scrollToSteps: _propTypes2.default.bool,
  showBackButton: _propTypes2.default.bool,
  showOverlay: _propTypes2.default.bool,
  showSkipButton: _propTypes2.default.bool,
  showStepsProgress: _propTypes2.default.bool,
  stepIndex: _propTypes2.default.number,
  steps: _propTypes2.default.array,
  tooltipOffset: _propTypes2.default.number,
  type: _propTypes2.default.string
};
Joyride.defaultProps = {
  allowClicksThruHole: false,
  autoStart: false,
  debug: false,
  disableOverlay: false,
  holePadding: 5,
  keyboardNavigation: true,
  locale: {
    back: 'Back',
    close: 'Close',
    last: 'Last',
    next: 'Next',
    skip: 'Skip'
  },
  offsetParentSelector: 'body',
  resizeDebounce: false,
  resizeDebounceDelay: 200,
  run: false,
  scrollOffset: 20,
  scrollToFirstStep: false,
  scrollToSteps: true,
  showBackButton: true,
  showOverlay: true,
  showSkipButton: false,
  showStepsProgress: false,
  stepIndex: 0,
  steps: [],
  tooltipOffset: 15,
  type: 'single'
};
exports.default = Joyride;