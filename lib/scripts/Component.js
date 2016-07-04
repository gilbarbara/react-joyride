var React   = require('react'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var defaultState = {
      index: 0,
      play: false,
      showTooltip: false,
      xPos: -1000,
      yPos: -1000,
      skipped: false
    },
    isTouch      = false;

if (typeof window !== 'undefined') {
  isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

var Component = React.createClass({
  displayName: 'Joyride',

  propTypes: {
    callback: React.PropTypes.func,
    completeCallback: React.PropTypes.func,
    debug: React.PropTypes.bool,
    disableOverlay: React.PropTypes.bool,
    keyboardNavigation: React.PropTypes.bool,
    locale: React.PropTypes.object,
    resizeDebounce: React.PropTypes.bool,
    resizeDebounceDelay: React.PropTypes.number,
    scrollOffset: React.PropTypes.number,
    scrollToFirstStep: React.PropTypes.bool,
    scrollToSteps: React.PropTypes.bool,
    showBackButton: React.PropTypes.bool,
    showOverlay: React.PropTypes.bool,
    showSkipButton: React.PropTypes.bool,
    showStepsProgress: React.PropTypes.bool,
    stepCallback: React.PropTypes.func,
    steps: React.PropTypes.array,
    tooltipOffset: React.PropTypes.number,
    type: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      debug: false,
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
  },

  getInitialState: function() {
    return defaultState;
  },

  componentWillMount: function() {
    this.listeners = {
      tooltips: {}
    };
  },

  componentDidMount: function() {
    var props = this.props;

    this._log(['joyride:initialized', props]);

    if (props.resizeDebounce) {
      var self = this,
          timeoutId;

      this.listeners.resize = (function() {
        return function() {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function() {
            timeoutId = null;
            self._calcPlacement();
          }, props.resizeDebounceDelay);
        };
      }());
    }
    else {
      this.listeners.resize = this._calcPlacement;
    }
    window.addEventListener('resize', this.listeners.resize);

    if (props.keyboardNavigation) {
      this.listeners.keyboard = this._keyboardNavigation;
      document.body.addEventListener('keydown', this.listeners.keyboard);
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.listeners.resize);

    if (this.props.keyboardNavigation) {
      document.body.removeEventListener('keydown', this.listeners.keyboard);
    }

    if (Object.keys(this.listeners.tooltips).length) {
      Object.keys(this.listeners.tooltips).forEach(function(key) {
        document.querySelector(key)
          .removeEventListener(this.listeners.tooltips[key].event, this.listeners.tooltips[key].cb);
        delete this.listeners.tooltips[key];
      });
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    var props = this.props,
        state = this.state;

    this._calcPlacement();

    if (prevProps.steps.length !== props.steps.length) {
      this._log(['joyride:changedSteps', this.props.steps]);

      if (!props.steps.length) {
        this.reset();
      }
    }

    if (state.play && props.scrollToSteps && (props.scrollToFirstStep || (state.index > 0 || prevState.index > state.index))) {
      var scroll = require('scroll');
      scroll.top(this._getBrowser() === 'firefox' ? document.documentElement : document.body, this._getScrollTop());
    }
  },

  /**
   * Starts the tour
   * @param {boolean} [autorun]- Starts with the first tooltip opened
   */
  start: function(autorun) {
    autorun = autorun === true;

    this._log(['joyride:start', 'autorun:', autorun]);

    this.setState({
      play: true
    }, function() {
      if (autorun) {
        this._toggleTooltip(true);
      }
    });
  },

  /**
   * Stop the tour
   */
  stop: function() {
    this._log(['joyride:stop']);

    this.setState({
      showTooltip: false,
      play: false
    });
  },

  /**
   * Reset Tour
   * @param {boolean} [restart] - Starts the new tour right away
   */
  reset: function(restart) {
    restart = restart === true;

    var newState = JSON.parse(JSON.stringify(defaultState));
    newState.play = restart;

    this._log(['joyride:reset', 'restart:', restart]);

    // Force a re-render if necessary
    if (restart && this.state.play === restart && this.state.index === 0) {
      this.forceUpdate();
    }

    this.setState(newState);
  },

  /**
   * Retrieve the current progress of your tour
   * @returns {{index: (number|*), percentageComplete: number, step: (object|null)}}
   */
  getProgress: function() {
    var state = this.state,
        props = this.props;

    this._log(['joyride:getProgress', 'steps:', props.steps]);

    return {
      index: state.index,
      percentageComplete: parseFloat(((state.index / props.steps.length) * 100).toFixed(2).replace('.00', '')),
      step: props.steps[state.index]
    };
  },

  /**
   * Parse the incoming steps
   * @param {Array|Object} steps
   * @returns {Array}
   */
  parseSteps: function(steps) {
    var tmpSteps = [],
        newSteps = [],
        el;

    if (Array.isArray(steps)) {
      steps.forEach(function(s) {
        if (s instanceof Object) {
          tmpSteps.push(s);
        }
      });
    }
    else {
      tmpSteps = [steps];
    }

    tmpSteps.forEach(function(s) {
      if (s.selector.dataset && s.selector.dataset.reactid) {
        s.selector = '[data-reactid="' + s.selector.dataset.reactid + '"]';
        console.warn('Deprecation warning: React 15.0 removed reactid. Update your code.'); //eslint-disable-line no-console
      }
      else if (s.selector.dataset) {
        console.error('Unsupported error: React 15.0+ don\'t write reactid to the DOM anymore, please use a plain class in your step.', s); //eslint-disable-line no-console
        if (s.selector.className) {
          s.selector = '.' + s.selector.className.replace(' ', '.');
        }
      }

      el = document.querySelector(s.selector);
      s.position = s.position || 'top';

      if (el && el.offsetParent) {
        newSteps.push(s);
      }
      else {
        this._log(['joyride:parseSteps', 'Element not rendered in the DOM. Skipped..', s], true);
      }
    }.bind(this));

    return newSteps;
  },

  addTooltip: function(data) {
    var parseData = this.parseSteps(data),
        el,
        eventType,
        key;

    this._log(['joyride:addTooltip', 'data:', data]);

    if (parseData.length) {
      data = parseData[0];
      key = data.trigger || data.selector;
      el = document.querySelector(key);
      eventType = data.event || 'click';
    }

    el.dataset.tooltip = JSON.stringify(data);

    if (eventType === 'hover' && !isTouch) {
      this.listeners.tooltips[key] = { event: 'mouseenter', cb: this._onTooltipTrigger };
      this.listeners.tooltips[key + 'mouseleave'] = { event: 'mouseleave', cb: this._onTooltipTrigger };
      this.listeners.tooltips[key + 'click'] = {
        event: 'click', cb: function(e) {
          e.preventDefault();
        }
      };

      el.addEventListener('mouseenter', this.listeners.tooltips[key].cb);
      el.addEventListener('mouseleave', this.listeners.tooltips[key + 'mouseleave'].cb);
      el.addEventListener('click', this.listeners.tooltips[key + 'click'].cb);
    }
    else {
      this.listeners.tooltips[key] = { event: 'click', cb: this._onTooltipTrigger };
      el.addEventListener('click', this.listeners.tooltips[key].cb);
    }
  },

  _log: function(msg, warn) {
    var logger = warn ? console.warn || console.error : console.log; //eslint-disable-line no-console

    if (this.props.debug) {
      logger.apply(console, msg); //eslint-disable-line no-console
    }
  },

  /**
   * Returns the current browser
   * @private
   * @returns {String}
   */
  _getBrowser: function() {
    // Return cached result if avalible, else get result then cache it.
    if (this._browser) {
      return this._browser;
    }

    var isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = Boolean(window.chrome) && !isOpera;// Chrome 1+
    var isIE = /*@cc_on!@*/ Boolean(document.documentMode); // At least IE6

    return (this._browser =
      isOpera ? 'opera' :
      isFirefox ? 'firefox' :
      isSafari ? 'safari' :
      isChrome ? 'chrome' :
      isIE ? 'ie' :
      '');
  },

  /**
   * Get an element actual dimensions with margin
   * @param {String|Element} el - Element node or selector
   * @returns {{height: number, width: number}}
   */
  _getElementDimensions: function(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    var styles = window.getComputedStyle(el),
        height = el.clientHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10),
        width  = el.clientWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);

    return {
      height: height,
      width: width
    };
  },

  /**
   * Get the scrollTop position
   * @returns {number}
   */
  _getScrollTop: function() {
    var state     = this.state,
        props     = this.props,
        step      = props.steps[state.index],
        position  = step.position,
        target    = document.querySelector(step.selector),
        targetTop = target.getBoundingClientRect().top + document.body.scrollTop,
        scrollTop = 0;

    if (/^top/.test(position)) {
      scrollTop = Math.floor(state.yPos - props.scrollOffset);
    }
    else if (/^bottom|^left|^right/.test(position)) {
      scrollTop = Math.floor(targetTop - props.scrollOffset);
    }

    return scrollTop;
  },

  /**
   * Keydown event listener
   * @param {Event} e - Keyboard event
   */
  _keyboardNavigation: function(e) {
    var state  = this.state,
        props  = this.props,
        intKey = (window.Event) ? e.which : e.keyCode,
        hasSteps;

    if (state.showTooltip) {
      if ([32, 38, 40].indexOf(intKey) > -1) {
        e.preventDefault();
      }

      if (intKey === 27) {
        this._toggleTooltip(false, state.index + 1);
      }
      else if ([13, 32].indexOf(intKey) > -1) {
        hasSteps = Boolean(props.steps[state.index + 1]);
        this._toggleTooltip(hasSteps, state.index + 1, 'next');
      }
    }
  },

  /**
   * Tooltip event listener
   * @param {Event} e - Click event
   */
  _onTooltipTrigger: function(e) {
    e.preventDefault();
    var tooltip = e.currentTarget.dataset.tooltip;

    if (tooltip) {
      tooltip = JSON.parse(tooltip);

      if (!this.state.tooltip || (this.state.tooltip.selector !== tooltip.selector)) {
        this.setState({
          previousPlay: this.state.previousPlay !== undefined ? this.state.previousPlay : this.state.play,
          play: false,
          showTooltip: false,
          tooltip: tooltip,
          xPos: -1000,
          yPos: -1000
        });
      }
      else {
        document.querySelector('.joyride-tooltip__close').click();
      }
    }
  },

  /**
   * Beacon click event listener
   * @param {Event} e - Click event
   */
  _onBeaconTrigger: function(e) {
    e.preventDefault();
    var props = this.props;
    var state = this.state;

    if (typeof props.callback === 'function') {
      props.callback({
        type: 'step:before',
        step: props.steps[state.index]
      });
    }
    this._toggleTooltip(true, state.index);
  },

  /**
   * Tooltip click event listener
   * @param {Event} e - Click event
   */
  _onClickTooltip: function(e) {
    var el       = e.currentTarget.className.indexOf('joyride-') === 0 && e.currentTarget.tagName === 'A' ? e.currentTarget : e.target,
        type     = el.dataset.type;
    if (el.className.indexOf('joyride-') === 0) {
      e.preventDefault();
      e.stopPropagation();

      var state    = this.state,
          props    = this.props,
          tooltip  = document.querySelector('.joyride-tooltip'),
          newIndex = state.index + (type === 'back' ? -1 : 1);

      if (type === 'skip') {
        this.setState({
          skipped: true
        });
        newIndex = props.steps.length + 1;
      }

      if (tooltip.classList.contains('joyride-tooltip--standalone')) {
        this.setState({
          play: this.state.previousPlay,
          previousPlay: undefined,
          tooltip: undefined,
          xPos: -1000,
          yPos: -1000
        });
      }
      else if (type) {
        this._toggleTooltip(
          (props.type === 'continuous' || props.type === 'guided')
          && ['close', 'skip'].indexOf(type) === -1
          && Boolean(props.steps[newIndex])
          , newIndex
          , type);
      }

      if (e.target.className === 'joyride-overlay') {
        if (typeof props.callback === 'function') {
          props.callback({
            type: 'overlay',
            step: props.steps[state.index]
          });
        }
      }
    }
  },

  /**
   * Toggle Tooltip's visibility
   * @param {Boolean} show - Render the tooltip directly or the beacon
   * @param {Number} [index] - The tour's new index
   * @param {string} [action]
   */
  _toggleTooltip: function(show, index, action) {
    index = (index !== undefined ? index : this.state.index);
    var props = this.props;

    this.setState({
      play: props.steps[index] ? this.state.play : false,
      showTooltip: show,
      index: index,
      xPos: -1000,
      yPos: -1000
    }, function() {
      var lastIndex = action === 'back' ? index + 1 : index - 1;

      if (action && props.steps[lastIndex]) {
        if (typeof props.stepCallback === 'function') { // Deprecated
          props.stepCallback(props.steps[lastIndex]);
        }

        if (typeof props.callback === 'function') {
          props.callback({
            type: 'step:after',
            step: props.steps[lastIndex]
          });
        }
      }

      if (props.steps.length && !props.steps[index]) {
        if (typeof props.completeCallback === 'function') { // Deprecated
          props.completeCallback(props.steps, this.state.skipped);
        }

        if (typeof props.callback === 'function') {
          props.callback({
            type: 'finished',
            steps: props.steps,
            skipped: this.state.skipped
          });
        }
      }
    });
  },

  /**
   * Position absolute elements next to its target
   */
  _calcPlacement: function() {
    var state       = this.state,
        props       = this.props,
        step        = state.tooltip ? state.tooltip : props.steps[state.index],
        showTooltip = state.tooltip ? true : state.showTooltip,
        component,
        position,
        body,
        target,
        placement   = {
          x: -1000,
          y: -1000
        };

    if (step && ((state.tooltip || (state.play && props.steps[state.index])) && state.xPos < 0)) {
      position = step.position;
      body = document.body.getBoundingClientRect();
      target = document.querySelector(step.selector).getBoundingClientRect();
      component = this._getElementDimensions((showTooltip ? '.joyride-tooltip' : '.joyride-beacon'));

      // Change the step position in the tooltip won't fit in the window
      if (/^left/.test(position) && target.left - (component.width + props.tooltipOffset) < 0) {
        position = 'top';
      }
      else if (/^right/.test(position) && target.left + target.width + (component.width + props.tooltipOffset) > body.width) {
        position = 'bottom';
      }

      // Calculate x position
      if (/^left/.test(position)) {
        placement.x = target.left - (showTooltip ? component.width + props.tooltipOffset : component.width / 2);
      }
      else if (/^right/.test(position)) {
        placement.x = target.left + target.width - (showTooltip ? -props.tooltipOffset : component.width / 2);
      }
      else {
        placement.x = target.left + target.width / 2 - component.width / 2;
      }

      // Calculate y position
      if (/^top/.test(position)) {
        placement.y = (target.top - body.top) - (showTooltip ? component.height + props.tooltipOffset : component.height / 2);
      }
      else if (/^bottom/.test(position)) {
        placement.y = (target.top - body.top) + target.height - (showTooltip ? -props.tooltipOffset : component.height / 2);
      }
      else {
        placement.y = (target.top - body.top) + target.height / 2 - component.height / 2 + (showTooltip ? props.tooltipOffset : 0);
      }

      if (/^bottom|^top/.test(position)) {
        if (/left/.test(position)) {
          placement.x = target.left - (showTooltip ? props.tooltipOffset : component.width / 2);
        }
        else if (/right/.test(position)) {
          placement.x = target.left + target.width - (showTooltip ? component.width - props.tooltipOffset : component.width / 2);
        }
      }

      this.setState({
        xPos: this._preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
        yPos: this._preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height),
        position: position
      });
    }
  },

  /**
   * Prevent tooltip to render outside the window
   * @param {Number} value - The axis position
   * @param {String} axis - The Axis X or Y
   * @param {Number} elWidth - The target element width
   * @param {Number} elHeight - The target element height
   * @returns {Number}
   */
  _preventWindowOverflow: function(value, axis, elWidth, elHeight) {
    var winWidth  = window.innerWidth,
        body      = document.body,
        html      = document.documentElement,
        docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
        newValue  = value;

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
  },

  /**
   *
   * @param {Boolean} [update]
   * @returns {*}
   * @private
   */
  _createComponent: function(update) {
    var state       = this.state,
        props       = this.props,
        currentStep = Object.assign({}, state.tooltip || props.steps[state.index]),
        buttons     = {
          primary: props.locale.close
        },
        target      = currentStep && currentStep.selector ? document.querySelector(currentStep.selector) : null,
        cssPosition = target ? target.style.position : null,
        showOverlay = state.tooltip ? false : props.showOverlay,
        component;

    this._log([
      'joyride:' + (update ? 'updateComponent' : 'createComponent'),
      'component:', state.showTooltip || state.tooltip ? 'Tooltip' : 'Beacon',
      'target:', target
    ]);

    if (target) {
      if (state.showTooltip || state.tooltip) {
        currentStep.position = state.position || currentStep.position;

        if (!state.tooltip) {
          if (props.type === 'continuous' || props.type === 'guided') {
            buttons.primary = props.locale.last;

            if (props.steps[state.index + 1]) {


              if (props.showStepsProgress) {
                var next = props.locale.next;
                if (typeof props.locale.next === 'string') {
                  next = React.createElement('span', {}, props.locale.next);
                }
                buttons.primary = React.createElement('span', {},
                  next,
                  React.createElement('span', {}, ' ' + (state.index + 1) + '/' + props.steps.length)
                );
              }
              else {
                buttons.primary = props.locale.next;
              }
            }

            if (props.showBackButton && state.index > 0) {
              buttons.secondary = props.locale.back;
            }
          }

          if (props.showSkipButton) {
            buttons.skip = props.locale.skip;
          }
        }

        component = React.createElement(Tooltip, {
          animate: state.xPos > -1,
          browser: this._getBrowser(),
          buttons: buttons,
          cssPosition: cssPosition,
          disableOverlay: props.disableOverlay,
          showOverlay: showOverlay,
          step: currentStep,
          standalone: Boolean(state.tooltip),
          type: props.type,
          xPos: state.xPos,
          yPos: state.yPos,
          onClick: this._onClickTooltip
        });
      }
      else {
        component = React.createElement(Beacon, {
          cssPosition: cssPosition,
          step: currentStep,
          xPos: state.xPos,
          yPos: state.yPos,
          onTrigger: this._onBeaconTrigger,
          eventType: currentStep.type || 'click'
        });
      }
    }

    return component;
  },

  render: function() {
    var state   = this.state,
        props   = this.props,
        hasStep = Boolean(props.steps[state.index]),
        component,
        standaloneTooltip;

    if (state.play && state.xPos < 0 && hasStep) {
      this._log(['joyride:render', 'step:', props.steps[state.index]]);
    }
    else if (!state.play && state.tooltip) {
      this._log(['joyride:render', 'tooltip:', state.tooltip]);
    }

    if (state.tooltip) {
      standaloneTooltip = this._createComponent();
    }
    else if (state.play && hasStep) {
      component = this._createComponent(state.xPos < 0);
    }

    return React.createElement('div', {
        className: 'joyride'
      },
      component,
      standaloneTooltip
    );
  }
});

module.exports = Component;
