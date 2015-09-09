var React        = require('react/addons'),
    scroll       = require('scroll'),
    Beacon       = require('./Beacon'),
    Tooltip      = require('./Tooltip');

var settings = {
    currentIndex: 0,
    initialIndex: 0,
    showTooltip: false,
    steps: [],
    xPos: -1000,
    yPos: -1000
};

var Mixin = {
    getInitialState: function () {
        return {
            joyrideCurrentIndex: 0,
            joyrideLocale: {
                close: 'Close',
                last: 'Last',
                next: 'Next'
            },
            joyrideTooltipOffset: 30,
            joyrideScrollToSteps: true,
            joyrideShowTooltip: false,
            joyrideShowBackdrop: true,
            joyridePlay: false,
            joyrideSteps: [],
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
        document.body.appendChild(this._target);

        if (state.joyridePlay && state.joyrideSteps[state.joyrideCurrentIndex]) {
            this._renderLayer();
        }
        window.addEventListener('resize', this._calculatePlacement);
    },

    componentWillUnmount: function () {
        this._unrenderLayer();
        document.body.removeChild(this._target);
        window.removeEventListener('resize', this._calculatePlacement);
    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state,
            opt   = {
                shouldRun: state.joyridePlay && (state.joyridePlay !== prevState.joyridePlay || state.joyrideCurrentIndex !== prevState.joyrideCurrentIndex || state.joyrideSteps !== prevState.joyrideSteps),
                hasStep: Boolean(state.joyrideSteps[state.joyrideCurrentIndex]),
                hasSteps: state.joyrideSteps.length > 0,
                newX: state.joyrideXPos !== prevState.joyrideXPos,
                newY: state.joyrideYPos !== prevState.joyrideYPos,
                toggleTooltip: state.joyrideShowTooltip !== prevState.joyrideShowTooltip
            };

        if ((opt.shouldRun || opt.toggleTooltip || opt.newX || opt.newY) && opt.hasStep) {
            this._renderLayer();
        }
        else if (opt.shouldRun && opt.hasSteps && !opt.hasStep) {
            if (typeof state.joyrideCompleteCallback === 'function') {
                state.joyrideCompleteCallback(state.joyrideSteps);
            }
            this._unrenderLayer();
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
        var tmpSteps  = [],
            realSteps = [],
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

            if (el && el.offsetParent) {
                realSteps.push(s);
            }
        });

        if (realSteps.length) {
            this.setState(
                React.addons.update(this.state, {
                    joyridePlay: { $set: start },
                    joyrideSteps: { $push: realSteps }
                })
            );
        }
    },

    /**
     * Retrieve the current progress of your tour
     * @returns {{index: (number|*), percentageComplete: number, step: *}}
     */
    joyrideGetProgress: function () {
        return {
            index: this.state.joyrideCurrentIndex,
            percentageComplete: parseFloat(((this.state.joyrideCurrentIndex / this.state.joyrideSteps.length) * 100).toFixed(2).replace('.00', '')),
            step: this.state.joyrideSteps[this.state.joyrideCurrentIndex]
        };
    },

    _onClickBeacon: function (e) {
        e.preventDefault();

        this.setState({
            joyrideShowTooltip: true,
            joyrideXPos: -1000,
            joyrideYPos: -1000
        });
    },

    _onClickTooltip: function (e) {
        e.preventDefault();

        var state = this.state,
            type  = e.currentTarget.dataset.type;

        if (typeof state.joyrideStepCallback === 'function') {
            state.joyrideStepCallback(state.joyrideSteps[state.joyrideCurrentIndex]);
        }

        this.setState({
            joyrideShowTooltip: type === 'button' && state.joyrideType === 'guided' && Boolean(state.joyrideSteps[state.joyrideCurrentIndex + 1]),
            joyrideCurrentIndex: state.joyrideCurrentIndex + 1,
            joyrideXPos: -1000,
            joyrideYPos: -1000
        }, function () {
            this._scrollToNextStep();
        }.bind(this));
    },

    _calculatePlacement: function () {
        var state     = this.state,
            step      = state.joyrideSteps[state.joyrideCurrentIndex],
            position,
            body,
            target,
            component = document.querySelector((state.joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon')),
            placement = {
                x: -1000,
                y: -1000
            };

        if (step && (!component.classList.contains('animate') || state.joyrideXPos < 0)) {
            position = step.position ? step.position.toLowerCase() : 'top';
            body = document.body.getBoundingClientRect();
            target = document.querySelector(step.selector).getBoundingClientRect();
            component = component.getBoundingClientRect();

            if (window.innerWidth < 768) {
                if (/^left/.test(position)) {
                    position = 'top';
                }
                else if (/^right/.test(position)) {
                    position = 'bottom';
                }
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
                joyrideXPos: this._preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
                joyrideYPos: this._preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height)
            });
        }
    },

    _preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth = window.innerWidth;
        var docHeight = document.body.offsetHeight;

        if (axis.toLowerCase() === 'x') {
            if (value + elWidth > winWidth) {
                value = winWidth - elWidth - 10;
            }
            else if (value < 0) {
                value = 10;
            }
        }
        else if (axis.toLowerCase() === 'y') {
            if (value + elHeight > docHeight) {
                value = docHeight - elHeight - 10;
            }
            else if (value < 0) {
                value = 10;
            }
        }

        return value;
    },

    _scrollToNextStep: function (cb) {
        if (this.state.joyrideSteps[this.state.joyrideCurrentIndex] && this.state.joyrideScrollToSteps) {
            scroll.top(document.body, this.state.joyrideYPos - window.innerHeight / 2, cb);
        }
    },

    _renderLayer: function () {
        React.render(this._renderCurrentStep(), this._target);
        this._calculatePlacement();
    },

    _unrenderLayer: function () {
        React.unmountComponentAtNode(this._target);
    },

    _renderCurrentStep: function () {
        var state       = this.state,
            component,
            currentStep = state.joyrideSteps[state.joyrideCurrentIndex],
            hasNextStep = Boolean(state.joyrideSteps[state.joyrideCurrentIndex + 1]),
            buttonText  = state.joyrideType === 'guided' ? (hasNextStep ? (state.joyrideLocale.next + ' ' + (state.joyrideCurrentIndex + 1) + '/' + state.joyrideSteps.length) : state.joyrideLocale.last) : state.joyrideLocale.close,
            target      = currentStep && currentStep.selector ? document.querySelector(currentStep.selector) : null,
            cssPosition = target ? target.style.position : null;

        if (target) {
            if (state.joyrideShowTooltip) {
                component = React.createElement(Tooltip, {
                    animate: state.joyrideXPos > -1,
                    cssPosition: cssPosition,
                    xPos: state.joyrideXPos,
                    yPos: state.joyrideYPos,
                    step: currentStep,
                    buttonText: buttonText,
                    showBackdrop: state.joyrideShowBackdrop,
                    onClick: this._onClickTooltip
                });
            }
            else {
                component = React.createElement(Beacon, {
                    cssPosition: cssPosition,
                    xPos: state.joyrideXPos,
                    yPos: state.joyrideYPos,
                    handleClick: this._onClickBeacon
                });
            }
        }

        return component;
    }
};

module.exports = Mixin;
