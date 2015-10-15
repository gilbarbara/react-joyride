var React   = require('react/addons'),
    scroll  = require('scroll'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var joyride = {
    browser: undefined,
    initialized: false,
    listeners: {},
    mixin: false,
    options: {
        keyboardNavigation: true,
        locale: {
            back: 'Back',
            close: 'Close',
            last: 'Last',
            next: 'Next',
            skip: 'Skip'
        },
        overridePosition: false,
        scrollToSteps: true,
        scrollOffset: 20,
        showBackButton: true,
        showOverlay: true,
        showSkipButton: false,
        showStepsProgress: false,
        tooltipOffset: 15,
        type: 'guided',
        completeCallback: undefined,
        stepCallback: undefined
    },
    steps: [],

    /**
     * Returns the current browser
     * @returns {String}
     */
    getBrowser: function () {
        // Return cached result if avalible, else get result then cache it.
        if (this.browser) {
            return this.browser;
        }

        var isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = Boolean(window.chrome) && !isOpera;// Chrome 1+
        var isIE = /*@cc_on!@*/false || Boolean(document.documentMode); // At least IE6

        return (this.browser =
            isOpera ? 'opera' :
                isFirefox ? 'firefox' :
                    isSafari ? 'safari' :
                        isChrome ? 'chrome' :
                            isIE ? 'ie' :
                                '');
    },

    /**
     * Get an element actual dimensions with margin
     * @param {String|DOMElement} el - Element node or selector
     * @returns {{height: number, width: number}}
     */
    getElementDimensions: function (el) {
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
    getScrollTop: function () {
        var state     = this.mixin.state,
            step      = joyride.steps[state._joyrideCurrentIndex],
            position  = joyride.options.overridePosition || step.position,
            target    = document.querySelector(step.selector),
            targetTop = target.getBoundingClientRect().top + document.body.scrollTop,
            scrollTop = 0;

        if (/^top/.test(position)) {
            scrollTop = Math.floor(state._joyrideYPos - joyride.options.scrollOffset);
        }
        else if (/^bottom|^left|^right/.test(position)) {
            scrollTop = Math.floor(targetTop - joyride.options.scrollOffset);
        }

        return scrollTop;
    },

    /**
     * Keydown event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    keyboardNavigation: function (e) {
        var intKey = (window.Event) ? e.which : e.keyCode,
            hasSteps;

        if (this.state._joyrideShowTooltip) {
            if ([32, 38, 40].indexOf(intKey) > -1) {
                e.preventDefault();
            }

            if (intKey === 27) {
                joyride.toggleTooltip(false, this.state._joyrideCurrentIndex + 1);
            }
            else if ([13, 32].indexOf(intKey) > -1) {
                hasSteps = Boolean(joyride.steps[this.state._joyrideCurrentIndex + 1]);
                joyride.toggleTooltip(hasSteps, this.state._joyrideCurrentIndex + 1);
            }
        }
    },

    /**
     * Beacon click event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    onClickBeacon: function (e) {
        e.preventDefault();
        joyride.toggleTooltip(true, this.state._joyrideCurrentIndex);
    },

    /**
     * Tooltip click event listener
     * @this Mixin
     * @param {Event} e - Keyboard event
     */
    onClickTooltip: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var state    = this.state,
            type     = e.currentTarget.getAttribute('data-type'),
            newIndex = state._joyrideCurrentIndex + (type === 'back' ? -1 : 1);

        if (type === 'skip') {
            newIndex = joyride.steps.length + 1;
        }

        if (typeof joyride.options.stepCallback === 'function') {
            joyride.options.stepCallback(joyride.steps[state._joyrideCurrentIndex]);
        }

        joyride.toggleTooltip(
            joyride.options.type === 'guided'
            && ['close', 'skip'].indexOf(type) === -1
            && Boolean(joyride.steps[newIndex])
            , newIndex);
    },

    /**
     * Position absolute elements next to its target based on
     * the step position and window size
     * @this this
     * @this Mixin
     */
    calcPlacement: function () {
        var mixin     = this.mixin || this,
            state     = mixin.state,
            step      = joyride.steps[state._joyrideCurrentIndex],
            component = document.querySelector((state._joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon')),
            position,
            body,
            target,
            placement = {
                x: -1000,
                y: -1000
            };

        if (step && (!/animate/.test(component.className) || state._joyrideXPos < 0)) {
            position = step.position;
            body = document.body.getBoundingClientRect();
            target = document.querySelector(step.selector).getBoundingClientRect();
            component = joyride.getElementDimensions((state._joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon'));

            // Change the step position in the tooltip won't fit in the window
            if (/^left/.test(position) && target.left - (component.width + joyride.options.tooltipOffset) < 0) {
                position = 'top';
            }
            else if (/^right/.test(position) && target.left + target.width + (component.width + joyride.options.tooltipOffset) > body.width) {
                position = 'bottom';
            }

            // Calculate x position
            if (/^left/.test(position)) {
                placement.x = target.left - (state._joyrideShowTooltip ? component.width + joyride.options.tooltipOffset : component.width / 2);
            }
            else if (/^right/.test(position)) {
                placement.x = target.left + target.width - (state._joyrideShowTooltip ? -joyride.options.tooltipOffset : component.width / 2);
            }
            else {
                placement.x = target.left + target.width / 2 - component.width / 2;
            }

            // Calculate y position
            if (/^top/.test(position)) {
                placement.y = (target.top - body.top) - (state._joyrideShowTooltip ? component.height + joyride.options.tooltipOffset : component.height / 2);
            }
            else if (/^bottom/.test(position)) {
                placement.y = (target.top - body.top) + target.height - (state._joyrideShowTooltip ? -joyride.options.tooltipOffset : component.height / 2);
            }
            else {
                placement.y = (target.top - body.top) + target.height / 2 - component.height / 2 + (state._joyrideShowTooltip ? joyride.options.tooltipOffset : 0);
            }

            if (/^bottom|^top/.test(position)) {
                if (/left/.test(position)) {
                    placement.x = target.left - (state._joyrideShowTooltip ? joyride.options.tooltipOffset : component.width / 2);
                }
                else if (/right/.test(position)) {
                    placement.x = target.left + target.width - (state._joyrideShowTooltip ? component.width - joyride.options.tooltipOffset : component.width / 2);
                }
            }

            mixin.setState({
                _joyrideXPos: joyride.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
                _joyrideYPos: joyride.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height),
                joyrideOverridePosition: step.position !== position ? position : false
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
    preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth  = window.innerWidth,
            docHeight = document.body.offsetHeight,
            newValue  = value;

        if (axis === 'x') {
            if (value + elWidth >= winWidth) {
                newValue = winWidth - elWidth - 15;
            }
            else if (value < 0) {
                newValue = 15;
            }
        }
        else if (axis === 'y') {
            if (value + elHeight >= docHeight) {
                newValue = docHeight - elHeight - 15;
            }
            else if (value < 0) {
                newValue = 15;
            }
        }

        return newValue;
    },

    /**
     * Toggle Tooltip's visibility
     * @param {Boolean} show Render the tooltip directly or the beacon
     * @param {Number} index The tour's new index
     */
    toggleTooltip: function (show, index) {
        this.mixin.setState({
            _joyrideShowTooltip: show,
            _joyrideCurrentIndex: index,
            _joyrideXPos: -1000,
            _joyrideYPos: -1000
        });
    }
};

/**
 * @constructor
 */
var Mixin = {
    getInitialState: function () {
        return {
            _joyrideCurrentIndex: 0,
            _joyridePlay: false,
            _joyrideShowTooltip: false,
            _joyrideXPos: -1000,
            _joyrideYPos: -1000
        };
    },

    componentDidMount: function () {
        var state = this.state;

        this._target = document.createElement('div');
        this._target.className = 'joyride';
        document.body.appendChild(this._target);

        if (state._joyridePlay && joyride.steps[state._joyrideCurrentIndex]) {
            this._joyrideRenderLayer();
        }

        joyride.mixin = this;
        joyride.listeners.resize = joyride.calcPlacement.bind(this);
        window.addEventListener('resize', joyride.listeners.resize);

        if (joyride.options.keyboardNavigation) {
            joyride.listeners.keyboard = joyride.keyboardNavigation.bind(this);
            document.body.addEventListener('keydown', joyride.listeners.keyboard);
        }
    },

    componentWillUnmount: function () {
        this._joyrideUnrenderLayer();
        document.body.removeChild(this._target);

        window.removeEventListener('resize', joyride.listeners.resize);
        if (joyride.options.keyboardNavigation) {
            document.body.removeEventListener('keydown', joyride.listeners.keyboard);
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state,
            opt   = {
                shouldRun: state._joyridePlay && (state._joyridePlay !== prevState._joyridePlay || state._joyrideCurrentIndex !== prevState._joyrideCurrentIndex),
                hasStep: Boolean(joyride.steps[state._joyrideCurrentIndex]),
                hasSteps: joyride.steps.length > 0,
                newX: state._joyrideXPos !== prevState._joyrideXPos,
                newY: state._joyrideYPos !== prevState._joyrideYPos,
                toggleTooltip: state._joyrideShowTooltip !== prevState._joyrideShowTooltip
            };

        if ((opt.shouldRun || opt.toggleTooltip || opt.newX || opt.newY) && opt.hasStep) {
            this._joyrideRenderLayer();
        }
        else if (opt.shouldRun && opt.hasSteps && !opt.hasStep) {
            if (typeof joyride.options.completeCallback === 'function') {
                joyride.options.completeCallback(joyride.steps);
            }
            this._joyrideUnrenderLayer();
        }
    },

    /**
     * Starts the tour
     * @param {boolean} [autorun]- Starts with the first tooltip opened
     */
    joyrideStart: function (autorun) {
        autorun = autorun || false;

        this.setState({
            _joyrideShowTooltip: autorun,
            _joyridePlay: true
        });
    },

    /**
     * Add Steps
     * @param {array|object} steps - Steps to add to the tour
     * @param {boolean} [start] - Starts the tour right away
     */
    joyrideAddSteps: function (steps, start) {
        var tmpSteps = [],
            el;

        start = start || this.state._joyridePlay;

        if (Array.isArray(steps)) {
            steps.forEach(function (s) {
                if (s instanceof Object) {
                    tmpSteps.push(s);
                }
            });
        }
        else {
            tmpSteps = [steps];
        }

        tmpSteps.forEach(function (s) {
            if (s.selector.dataset && s.selector.dataset.reactid) {
                var reactSelector = '[data-reactid="' + s.selector.dataset.reactid + '"]';
                s.selector = reactSelector;
            }
            el = document.querySelector(s.selector);
            s.position = s.position || 'top';

            if (el && el.offsetParent) {
                joyride.steps.push(s);
            }
        });

        this.setState(
            React.addons.update(this.state, {
                _joyridePlay: { $set: start }
            })
        );
    },

    /**
     * Retrieve the current progress of your tour
     * @returns {{index: (number|*), percentageComplete: number, step: (object|null)}}
     */
    joyrideGetProgress: function () {
        return {
            index: this.state._joyrideCurrentIndex,
            percentageComplete: parseFloat(((this.state._joyrideCurrentIndex / joyride.steps.length) * 100).toFixed(2).replace('.00', '')),
            step: joyride.steps[this.state._joyrideCurrentIndex]
        };
    },

    /**
     * Change the default options
     * @private
     */
    joyrideSetOptions: function (opts) {
        Object.keys(joyride.options).forEach(function (o) {
            if (opts[o] !== undefined) {
                joyride.options[o] = opts[o];
            }
        })
    },

    _joyrideRenderLayer: function () {
        var component = this._joyrideRenderStep();
        if (!joyride.initialized) {
            joyride.initialized = true;
            React.renderToString(component);
        }

        React.render(component, this._target, function () {
            joyride.calcPlacement();
            if (joyride.steps[this.state._joyrideCurrentIndex] && joyride.options.scrollToSteps) {
                scroll.top(document.body, joyride.getScrollTop());
            }
        }.bind(this));
    },

    _joyrideUnrenderLayer: function () {
        React.unmountComponentAtNode(this._target);
    },

    _joyrideRenderStep: function () {
        var state       = this.state,
            component,
            currentStep = joyride.steps[state._joyrideCurrentIndex],
            buttons     = {
                primary: joyride.options.locale.close
            },
            target      = currentStep && currentStep.selector ? document.querySelector(currentStep.selector) : null,
            cssPosition = target ? target.style.position : null;

        if (target) {
            if (state._joyrideShowTooltip) {
                if (joyride.options.type === 'guided') {
                    buttons.primary = joyride.options.locale.last;

                    if (Boolean(joyride.steps[state._joyrideCurrentIndex + 1])) {
                        buttons.primary = joyride.options.locale.next;

                        if (joyride.options.showStepsProgress) {
                            buttons.primary += ' ' + (state._joyrideCurrentIndex + 1) + '/' + joyride.steps.length;
                        }
                    }

                    if (joyride.options.showBackButton && state._joyrideCurrentIndex > 0) {
                        buttons.secondary = joyride.options.locale.back;
                    }
                }

                if (joyride.options.showSkipButton) {
                    buttons.skip = joyride.options.locale.skip;
                }

                component = React.createElement(Tooltip, {
                    animate: state._joyrideXPos > -1,
                    browser: joyride.getBrowser(),
                    buttons: buttons,
                    cssPosition: cssPosition,
                    overridePosition: joyride.options.overridePosition,
                    showOverlay: joyride.options.showOverlay,
                    showSkipButton: joyride.options.showSkipButton,
                    step: currentStep,
                    xPos: state._joyrideXPos,
                    yPos: state._joyrideYPos,
                    onClick: joyride.onClickTooltip.bind(this)
                });
            }
            else {
                component = React.createElement(Beacon, {
                    cssPosition: cssPosition,
                    xPos: state._joyrideXPos,
                    yPos: state._joyrideYPos,
                    onClick: joyride.onClickBeacon.bind(this)
                });
            }
        }

        return component;
    }
};

module.exports = Mixin;
