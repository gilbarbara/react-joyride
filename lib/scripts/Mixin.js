var React   = require('react/addons'),
    scroll  = require('scroll'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var joyride = {
    browser: undefined,
    initialized: false,
    mixin: false,
    steps: [],

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

    getScrollTop: function (state) {
        var step      = joyride.steps[state.joyrideCurrentIndex],
            position  = state.joyrideOverridePosition || step.position,
            target    = document.querySelector(step.selector),
            targetTop = target.getBoundingClientRect().top + document.body.scrollTop,
            scrollTop = 0;

        if (/^top/.test(position)) {
            scrollTop = Math.floor(state.joyrideYPos - state.joyrideScrollOffset);
        }
        else if (/^bottom|^left|^right/.test(position)) {
            scrollTop = Math.floor(targetTop - state.joyrideScrollOffset);
        }

        return scrollTop;
    },

    keyboardNavigation: function (e) {
        var intKey = (window.Event) ? e.which : e.keyCode,
            hasSteps;

        if (this.state.joyrideShowTooltip) {
            if ([32, 38, 40].indexOf(intKey) > -1) {
                e.preventDefault();
            }

            if (intKey === 27) {
                joyride.toggleTooltip(false, this.state.joyrideCurrentIndex + 1);
            }
            else if ([13, 32].indexOf(intKey) > -1) {
                hasSteps = Boolean(joyride.steps[this.state.joyrideCurrentIndex + 1]);
                joyride.toggleTooltip(hasSteps, this.state.joyrideCurrentIndex + 1);
            }
        }
    },

    onClickBeacon: function (e) {
        e.preventDefault();
        joyride.toggleTooltip(true, this.state.joyrideCurrentIndex);
    },

    onClickTooltip: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var state    = this.state,
            type     = e.currentTarget.getAttribute('data-type'),
            newIndex = state.joyrideCurrentIndex + (type === 'back' ? -1 : 1);

        if (e.target === e.currentTarget) {
            joyride.toggleTooltip(state.joyrideType === 'guided' && type !== 'close' && Boolean(joyride.steps[newIndex]), newIndex);
        }
    },

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

    toggleTooltip: function (show, index) {
        this.mixin.setState({
            joyrideShowTooltip: show,
            joyrideCurrentIndex: index,
            joyrideXPos: -1000,
            joyrideYPos: -1000
        });
    }
};

var Mixin = {
    getInitialState: function () {
        return {
            joyrideCurrentIndex: 0,
            joyrideKeyboardNavigation: true,
            joyrideLocale: {
                back: 'Back',
                close: 'Close',
                last: 'Last',
                next: 'Next'
            },
            joyrideOverridePosition: false,
            joyridePlay: false,
            joyrideScrollToSteps: true,
            joyrideScrollOffset: 20,
            joyrideShowBackButton: true,
            joyrideShowOverlay: true,
            joyrideShowStepsProgress: false,
            joyrideShowTooltip: false,
            joyrideTooltipOffset: 15,
            joyrideType: 'guided',
            joyrideCompleteCallback: undefined,
            joyrideStepCallback: undefined,
            joyrideXPos: -1000,
            joyrideYPos: -1000
        };
    },

    componentDidMount: function () {
        var state = this.state;

        this._target = document.createElement('div');
        this._target.className = 'joyride';
        document.body.appendChild(this._target);

        if (state.joyridePlay && joyride.steps[state.joyrideCurrentIndex]) {
            this.joyrideRenderLayer();
        }

        joyride.mixin = this;
        window.addEventListener('resize', this.joyrideCalcPlacement);

        if (this.state.joyrideKeyboardNavigation) {
            document.body.addEventListener('keydown', joyride.keyboardNavigation.bind(this));
        }
    },

    componentWillUnmount: function () {
        this.joyrideUnrenderLayer();
        document.body.removeChild(this._target);

        window.removeEventListener('resize', this.joyrideCalcPlacement);
        if (this.state.joyrideKeyboardNavigation) {
            document.body.removeEventListener('keydown', joyride.keyboardNavigation.bind(this));
        }
    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state,
            opt   = {
                shouldRun: state.joyridePlay && (state.joyridePlay !== prevState.joyridePlay || state.joyrideCurrentIndex !== prevState.joyrideCurrentIndex),
                hasStep: Boolean(joyride.steps[state.joyrideCurrentIndex]),
                hasSteps: joyride.steps.length > 0,
                newX: state.joyrideXPos !== prevState.joyrideXPos,
                newY: state.joyrideYPos !== prevState.joyrideYPos,
                toggleTooltip: state.joyrideShowTooltip !== prevState.joyrideShowTooltip
            };

        if ((opt.shouldRun || opt.toggleTooltip || opt.newX || opt.newY) && opt.hasStep) {
            this.joyrideRenderLayer();
        }
        else if (opt.shouldRun && opt.hasSteps && !opt.hasStep) {
            if (typeof state.joyrideCompleteCallback === 'function') {
                state.joyrideCompleteCallback(joyride.steps);
            }
            this.joyrideUnrenderLayer();
        }
    },

    /**
     * Starts the tour
     * @param {boolean} [autorun]- Starts with the first tooltip opened
     */
    joyrideStart: function (autorun) {
        autorun = autorun || false;

        this.setState({
            joyrideShowTooltip: autorun,
            joyridePlay: true
        });
    },

    /**
     * Add Steps
     * @param {object|array} steps - Steps to add to the tour
     * @param {boolean} [start] - Starts the tour right away
     */
    joyrideAddSteps: function (steps, start) {
        var tmpSteps = [],
            el;

        start = start || this.state.joyridePlay;

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
            el = document.querySelector(s.selector);
            s.position = s.position || 'top';

            if (el && el.offsetParent) {
                joyride.steps.push(s);
            }
        });

        this.setState(
            React.addons.update(this.state, {
                joyridePlay: { $set: start }
            })
        );
    },

    /**
     * Retrieve the current progress of your tour
     * @returns {{index: (number|*), percentageComplete: number, step: (object|null)}}
     */
    joyrideGetProgress: function () {
        return {
            index: this.state.joyrideCurrentIndex,
            percentageComplete: parseFloat(((this.state.joyrideCurrentIndex / joyride.steps.length) * 100).toFixed(2).replace('.00', '')),
            step: joyride.steps[this.state.joyrideCurrentIndex]
        };
    },

    joyrideCalcPlacement: function () {
        var state     = this.state,
            step      = joyride.steps[state.joyrideCurrentIndex],
            component = document.querySelector((state.joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon')),
            position,
            body,
            target,
            placement = {
                x: -1000,
                y: -1000
            };

        if (step && (!/animate/.test(component.className) || state.joyrideXPos < 0)) {
            position = step.position;
            body = document.body.getBoundingClientRect();
            target = document.querySelector(step.selector).getBoundingClientRect();
            component = joyride.getElementDimensions((state.joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon'));

            // Change the step position in the tooltip won't fit in the window
            if (/^left/.test(position) && target.left - (component.width + state.joyrideTooltipOffset) < 0) {
                position = 'top';
            }
            else if (/^right/.test(position) && target.left + target.width + (component.width + state.joyrideTooltipOffset) > body.width) {
                position = 'bottom';
            }

            // Calculate x position
            if (/^left/.test(position)) {
                placement.x = target.left - (state.joyrideShowTooltip ? component.width + state.joyrideTooltipOffset : component.width / 2);
            }
            else if (/^right/.test(position)) {
                placement.x = target.left + target.width - (state.joyrideShowTooltip ? -state.joyrideTooltipOffset : component.width / 2);
            }
            else {
                placement.x = target.left + target.width / 2 - component.width / 2;
            }

            // Calculate y position
            if (/^top/.test(position)) {
                placement.y = (target.top - body.top) - (state.joyrideShowTooltip ? component.height + state.joyrideTooltipOffset : component.height / 2);
            }
            else if (/^bottom/.test(position)) {
                placement.y = (target.top - body.top) + target.height - (state.joyrideShowTooltip ? -state.joyrideTooltipOffset : component.height / 2);
            }
            else {
                placement.y = (target.top - body.top) + target.height / 2 - component.height / 2 + (state.joyrideShowTooltip ? state.joyrideTooltipOffset : 0);
            }

            if (/^bottom|^top/.test(position)) {
                if (/left/.test(position)) {
                    placement.x = target.left - (state.joyrideShowTooltip ? state.joyrideTooltipOffset : component.width / 2);
                }
                else if (/right/.test(position)) {
                    placement.x = target.left + target.width - (state.joyrideShowTooltip ? component.width - state.joyrideTooltipOffset : component.width / 2);
                }
            }

            this.setState({
                joyrideXPos: joyride.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
                joyrideYPos: joyride.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height),
                joyrideOverridePosition: step.position !== position ? position : false
            });
        }
    },

    joyrideRenderLayer: function () {
        var component = this.joyrideRenderStep();
        if (!joyride.initialized) {
            joyride.initialized = true;
            React.renderToString(component);
        }

        React.render(component, this._target, function () {
            this.joyrideCalcPlacement();
            if (joyride.steps[this.state.joyrideCurrentIndex] && this.state.joyrideScrollToSteps) {
                scroll.top(document.body, joyride.getScrollTop(this.state));
            }
        }.bind(this));
    },

    joyrideUnrenderLayer: function () {
        React.unmountComponentAtNode(this._target);
    },

    joyrideRenderStep: function () {
        var state       = this.state,
            component,
            currentStep = joyride.steps[state.joyrideCurrentIndex],
            buttons     = {
                primary: state.joyrideLocale.close
            },
            target      = currentStep && currentStep.selector ? document.querySelector(currentStep.selector) : null,
            cssPosition = target ? target.style.position : null;

        if (target) {
            if (state.joyrideShowTooltip) {
                if (state.joyrideType === 'guided') {
                    buttons.primary = state.joyrideLocale.last;

                    if (Boolean(joyride.steps[state.joyrideCurrentIndex + 1])) {
                        buttons.primary = state.joyrideLocale.next;

                        if (state.joyrideShowStepsProgress) {
                            buttons.primary += ' ' + (state.joyrideCurrentIndex + 1) + '/' + joyride.steps.length;
                        }
                    }

                    if (state.joyrideShowBackButton && state.joyrideCurrentIndex > 0) {
                        buttons.secondary = state.joyrideLocale.back;
                    }
                }

                component = React.createElement(Tooltip, {
                    animate: state.joyrideXPos > -1,
                    browser: joyride.getBrowser(),
                    buttons: buttons,
                    cssPosition: cssPosition,
                    overridePosition: state.joyrideOverridePosition,
                    showOverlay: state.joyrideShowOverlay,
                    step: currentStep,
                    xPos: state.joyrideXPos,
                    yPos: state.joyrideYPos,
                    onClick: joyride.onClickTooltip.bind(this)
                });
            }
            else {
                component = React.createElement(Beacon, {
                    cssPosition: cssPosition,
                    xPos: state.joyrideXPos,
                    yPos: state.joyrideYPos,
                    onClick: joyride.onClickBeacon.bind(this)
                });
            }
        }

        return component;
    }
};

module.exports = Mixin;
