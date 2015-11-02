var React          = require('react'),
    ReactDOM       = require('react-dom'),
    ReactDOMServer = require('react-dom/server'),
    scroll         = require('scroll'),
    Beacon         = require('./Beacon'),
    Tooltip        = require('./Tooltip');

var defaultState = {
        initialized: false,
        index: 0,
        play: false,
        showTooltip: false,
        xPos: -1000,
        yPos: -1000,
        skipped: false
    },
    listeners    = {};

var Component = React.createClass({
    propTypes: {
        completeCallback: React.PropTypes.func,
        debug: React.PropTypes.bool,
        keyboardNavigation: React.PropTypes.bool,
        locale: React.PropTypes.object,
        overridePosition: React.PropTypes.bool,
        resizeDebounce: React.PropTypes.bool,
        resizeDebounceDelay: React.PropTypes.number,
        scrollOffset: React.PropTypes.number,
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

    getDefaultProps: function () {
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
            overridePosition: false,
            resizeDebounce: false,
            resizeDebounceDelay: 200,
            scrollToSteps: true,
            scrollOffset: 20,
            showBackButton: true,
            showOverlay: true,
            showSkipButton: false,
            showStepsProgress: false,
            steps: [],
            tooltipOffset: 15,
            type: 'guided',
            completeCallback: undefined,
            stepCallback: undefined
        };
    },

    getInitialState: function () {
        return defaultState;
    },

    componentDidMount: function () {
        var state = this.state,
            props = this.props;

        this._log(['joyride:initialized']);

        if (props.resizeDebounce) {
            listeners.resize = (function () {
                var timeoutId;
                return function () {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        timeoutId = null;
                        this._calcPlacement.call(this);
                    }.bind(this), props.resizeDebounceDelay);
                };
            }());
        }
        else {
            listeners.resize = this._calcPlacement;
        }
        window.addEventListener('resize', listeners.resize);

        if (props.keyboardNavigation) {
            listeners.keyboard = this._keyboardNavigation;
            document.body.addEventListener('keydown', listeners.keyboard);
        }
    },

    componentWillUnmount: function () {
        window.removeEventListener('resize', listeners.resize);
        if (this.props.keyboardNavigation) {
            document.body.removeEventListener('keydown', listeners.keyboard);
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (this.state.play && this.state.xPos < 0) {
            this._calcPlacement();
        }
    },

    /**
     * Starts the tour
     * @param {boolean} [autorun]- Starts with the first tooltip opened
     */
    start: function (autorun) {
        autorun = autorun === true;

        this._log(['joyride:start', 'autorun:', autorun]);

        this.setState({
            showTooltip: autorun,
            play: true
        });
    },

    /**
     * Reset Tour
     * @param {boolean} [restart] - Starts the new tour right away
     */
    reset: function (restart) {
        restart = restart === true;

        var newState = JSON.parse(JSON.stringify(defaultState));
        newState.initialized = true;
        newState.play = restart;

        this._log(['joyride:reset', 'restart:', restart]);

        // Force a re-render if necessary
        if (restart && this.state.play === restart && this.state.index === 0) {
            this._renderLayer();
        }

        this.setState(newState);
    },

    /**
     * Retrieve the current progress of your tour
     * @returns {{index: (number|*), percentageComplete: number, step: (object|null)}}
     */
    getProgress: function () {
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
    parseSteps: function (steps) {
        var tmpSteps = [],
            newSteps = [],
            el;

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
                s.selector = '[data-reactid="' + s.selector.dataset.reactid + '"]';
            }
            el = document.querySelector(s.selector);
            s.position = s.position || 'top';

            if (el && el.offsetParent) {
                newSteps.push(s);
            }
            else {
                this._log(['joyride:parseSteps', 'Element not rendered on the DOM. Skipped..', s], true);
            }
        }.bind(this));

        return newSteps;
    },

    /**
     *
     * @param {Boolean} update
     * @returns {*}
     * @private
     */
    _createComponent: function (update) {
        var state       = this.state,
            props       = this.props,
            component,
            currentStep = props.steps[state.index],
            buttons     = {
                primary: props.locale.close
            },
            target      = currentStep && currentStep.selector ? document.querySelector(currentStep.selector) : null,
            cssPosition = target ? target.style.position : null;

        this._log([
            'joyride:' + (update ? 'createComponent' : 'updateComponent'),
            'component:',
            state.showTooltip ? 'Tooltip' : 'Beacon',
            'target:',
            target
        ]);

        if (target) {
            if (state.showTooltip) {
                if (props.type === 'guided') {
                    buttons.primary = props.locale.last;

                    if (Boolean(props.steps[state.index + 1])) {
                        buttons.primary = props.locale.next;

                        if (props.showStepsProgress) {
                            buttons.primary += ' ' + (state.index + 1) + '/' + props.steps.length;
                        }
                    }

                    if (props.showBackButton && state.index > 0) {
                        buttons.secondary = props.locale.back;
                    }
                }

                if (props.showSkipButton) {
                    buttons.skip = props.locale.skip;
                }

                component = React.createElement(Tooltip, {
                    animate: state.xPos > -1,
                    browser: this._getBrowser(),
                    buttons: buttons,
                    cssPosition: cssPosition,
                    options: props,
                    step: currentStep,
                    xPos: state.xPos,
                    yPos: state.yPos,
                    onClick: this._onClickTooltip
                });
            }
            else {
                component = React.createElement(Beacon, {
                    cssPosition: cssPosition,
                    xPos: state.xPos,
                    yPos: state.yPos,
                    onClick: this._onClickBeacon
                });
            }
        }

        return component;
    },

    /**
     * Returns the current browser
     * @private
     * @returns {String}
     */
    _getBrowser: function () {
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
     * @param {String|DOMElement} el - Element node or selector
     * @returns {{height: number, width: number}}
     */
    _getElementDimensions: function (el) {
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
    _getScrollTop: function () {
        var state     = this.state,
            props     = this.props,
            step      = props.steps[state.index],
            position  = props.overridePosition || step.position,
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
    _keyboardNavigation: function (e) {
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
                this._toggleTooltip(hasSteps, state.index + 1);
            }
        }
    },

    /**
     * Beacon click event listener
     * @param {Event} e - Keyboard event
     */
    _onClickBeacon: function (e) {
        e.preventDefault();
        this._toggleTooltip(true, this.state.index);
    },

    /**
     * Tooltip click event listener
     * @param {Event} e - Keyboard event
     */
    _onClickTooltip: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var state    = this.state,
            props    = this.props,
            el       = e.target,
            type     = el.dataset.type,
            newIndex = state.index + (type === 'back' ? -1 : 1);

        if (type === 'skip') {
            this.setState({
                skipped: true
            });
            newIndex = props.steps.length + 1;
        }

        if (type) {
            this._toggleTooltip(
                props.type === 'guided'
                && ['close', 'skip'].indexOf(type) === -1
                && Boolean(props.steps[newIndex])
                , newIndex);
        }
    },

    /**
     * Position absolute elements next to its target based on
     * the step position and window size
     */
    _calcPlacement: function () {
        var state     = this.state,
            props     = this.props,
            step      = props.steps[state.index],
            component = document.querySelector((state.showTooltip ? '.joyride-tooltip' : '.joyride-beacon')),
            position,
            body,
            target,
            placement = {
                x: -1000,
                y: -1000
            };

        if (step) {
            position = step.position;
            body = document.body.getBoundingClientRect();
            target = document.querySelector(step.selector).getBoundingClientRect();
            component = this._getElementDimensions((state.showTooltip ? '.joyride-tooltip' : '.joyride-beacon'));

            // Change the step position in the tooltip won't fit in the window
            if (/^left/.test(position) && target.left - (component.width + props.tooltipOffset) < 0) {
                position = 'top';
            }
            else if (/^right/.test(position) && target.left + target.width + (component.width + props.tooltipOffset) > body.width) {
                position = 'bottom';
            }

            // Calculate x position
            if (/^left/.test(position)) {
                placement.x = target.left - (state.showTooltip ? component.width + props.tooltipOffset : component.width / 2);
            }
            else if (/^right/.test(position)) {
                placement.x = target.left + target.width - (state.showTooltip ? -props.tooltipOffset : component.width / 2);
            }
            else {
                placement.x = target.left + target.width / 2 - component.width / 2;
            }

            // Calculate y position
            if (/^top/.test(position)) {
                placement.y = (target.top - body.top) - (state.showTooltip ? component.height + props.tooltipOffset : component.height / 2);
            }
            else if (/^bottom/.test(position)) {
                placement.y = (target.top - body.top) + target.height - (state.showTooltip ? -props.tooltipOffset : component.height / 2);
            }
            else {
                placement.y = (target.top - body.top) + target.height / 2 - component.height / 2 + (state.showTooltip ? props.tooltipOffset : 0);
            }

            if (/^bottom|^top/.test(position)) {
                if (/left/.test(position)) {
                    placement.x = target.left - (state.showTooltip ? props.tooltipOffset : component.width / 2);
                }
                else if (/right/.test(position)) {
                    placement.x = target.left + target.width - (state.showTooltip ? component.width - props.tooltipOffset : component.width / 2);
                }
            }

            this.setState({
                xPos: this._preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
                yPos: this._preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height)
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
    _preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth  = window.innerWidth,
            docHeight = document.body.offsetHeight,
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
     * Toggle Tooltip's visibility
     * @param {Boolean} show - Render the tooltip directly or the beacon
     * @param {Number} index - The tour's new index
     */
    _toggleTooltip: function (show, index) {
        index = index || 0;

        var props = this.props;

        this.setState({
            showTooltip: show,
            index: index,
            xPos: -1000,
            yPos: -1000
        }, function () {
            if (typeof props.stepCallback === 'function' && props.steps[this.state.index]) {
                props.stepCallback(props.steps[this.state.index]);
            }
        });
    },

    _log: function (msg, warn) {
        var logger = warn ? console.warn || console.error : console.log; //eslint-disable-line no-console

        if (this.props.debug) {
            logger.apply(console, msg); //eslint-disable-line no-console
        }
    },

    render: function () {
        var state   = this.state,
            props   = this.props,
            hasStep = Boolean(props.steps[state.index]),
            component;

        if (state.xPos < 0) {
            this._log(['joyride:renderLayer', 'step:', props.steps[state.index]]);
        }

        if (state.play) {
            if (hasStep) {
                component = this._createComponent(state.xPos < 0);

                if (props.scrollToSteps) {
                    scroll.top(this._getBrowser() === 'firefox' ? document.documentElement : document.body, this._getScrollTop());
                }
            }
            else if (props.steps.length && !hasStep) {
                if (typeof props.completeCallback === 'function') {
                    props.completeCallback(props.steps, state.skipped);
                }
            }
        }

        return (
            <div className="joyride">{component}</div>
        );
    }
});

module.exports = Component;
