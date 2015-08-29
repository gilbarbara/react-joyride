var React        = require('react/addons'),
    $            = require('jquery'),
    triggerEvent = require('trigger-event'),
    Beacon       = require('./Beacon'),
    Tooltip      = require('./Tooltip');

var settings = {
    currentIndex: 0,
    startIndex: 0,
    showTooltip: false,
    steps: []
};

var Mixin = {

    getInitialState: function () {
        return {
            joyrideAutoplay: false,
            joyrideCurrentIndex: 0,
            joyrideScrollToSteps: true,
            joyrideShowTooltip: false,
            joyrideStartIndex: 0,
            joyrideSteps: [],
            joyrideLocale: {
                close: 'Close',
                last: 'Last',
                next: 'Next'
            },
            joyrideType: 'tour',
            joyrideCompleteCallback: function () {
            },
            joyrideStepCallback: undefined,
            xPos: -1000,
            yPos: -1000
        };
    },

    componentDidMount: function () {
        var state = this.state;

        this._target = document.createElement('div');
        document.body.appendChild(this._target);

        if (state.joyrideAutoplay && state.joyrideSteps[state.joyrideCurrentIndex]) {
            this._renderLayer();
        }
        $(window).on('resize', this._calculatePlacement);
    },

    componentWillUnmount: function () {
        this._unrenderLayer();
        document.body.removeChild(this._target);
        $(window).off('resize', this._calculatePlacement);
    },

    componentDidUpdate: function (prevProps, prevState) {
        var opt = {
            shouldRun: this.state.joyrideAutoplay && (this.state.joyrideCurrentIndex !== prevState.joyrideCurrentIndex || this.state.joyrideAutoplay !== prevState.joyrideAutoplay),
            hasStep: Boolean(this.state.joyrideSteps[this.state.joyrideCurrentIndex]),
            hasSteps: this.state.joyrideSteps.length > 0,
            newX: this.state.xPos !== prevState.xPos,
            newY: this.state.yPos !== prevState.yPos,
            toggleTooltip: this.state.joyrideShowTooltip && this.state.joyrideShowTooltip !== prevState.joyrideShowTooltip
        };

        /*        console.log(
         Object.assign({
         shouldRender: (opt.hasStep && opt.shouldRun) || opt.toggleTooltip || opt.newX || opt.newY,
         steps: this.state.joyrideSteps.length
         }, opt));*/

        if ((opt.shouldRun && opt.hasStep) || opt.toggleTooltip || opt.newX || opt.newY) {
            this._renderLayer();
        }
        else if (opt.shouldRun && opt.hasSteps && !opt.hasStep) {
            this.state.joyrideCompleteCallback();
            this._unrenderLayer();
        }
    },

    _renderLayer: function () {
        console.log('_renderLayer', this.state.xPos, this.state.yPos);
        this.setState({ xPos: -1000, yPos: -1000 });
        React.render(this._renderCurrentStep(), this._target);
        this._calculatePlacement();
    },

    _unrenderLayer: function () {
        React.unmountComponentAtNode(this._target);
    },

    _addSteps: function (step) {
//        console.log('_addSteps', step, this.state.joyrideSteps);
        if (!(step instanceof Object)) {
            return false;
        }

        this.setState(
            React.addons.update(this.state, {
                joyrideCurrentIndex: { $set: this.state.joyrideCurrentIndex < 0 ? 0 : this.state.joyrideCurrentIndex },
                joyrideSteps: { $push: [step] }
            })
        );
    },

    _getProgress: function () {
        return {
            index: this.state.joyrideCurrentIndex,
            percentageComplete: (this.state.joyrideCurrentIndex / this.state.joyrideSteps.length) * 100,
            step: this.state.joyrideSteps[this.state.joyrideCurrentIndex]
        };
    },

    _onClickBeacon: function (e) {
        e.preventDefault();

        this.setState({ joyrideShowTooltip: true });
    },

    _onClickTooltip: function (e) {
        e.preventDefault();

        var state = this.state,
            type  = e.currentTarget.dataset.type;

        if (typeof state.joyrideStepCallback === 'function') {
            state.joyrideStepCallback(state.joyrideSteps[state.joyrideCurrentIndex]);
        }

        this.setState({
            joyrideShowTooltip: false,
            joyrideCurrentIndex: state.joyrideCurrentIndex + 1
        }, function () {
            if (type === 'button' && this.state.joyrideType === 'tour' && Boolean(this.state.joyrideSteps[this.state.joyrideCurrentIndex])) {
                triggerEvent(document.querySelector('.joyride-beacon'), 'click');
            }
            this._scrollToNextStep();
        }.bind(this));
    },

    _preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth = parseInt($(window).width(), 10);
        var docHeight = parseInt($(document).height(), 10);

        if (axis.toLowerCase() === 'x') {
            if (value + elWidth > winWidth) {
                //console.log('right overflow. value:', value, 'elWidth:', elWidth);
                value = winWidth - elWidth - 15;
            }
            else if (value < 0) {
                //console.log('left overflow. value:', value, 'elWidth:', elWidth);
                value = 15;
            }
        }
        else if (axis.toLowerCase() === 'y') {
            if (value + elHeight > docHeight) {
                //console.log('bottom overflow. value:', value, 'elHeight:', elHeight);
                value = docHeight - elHeight - 15;
            }
            else if (value < 0) {
                //console.log('top overflow. value:', value, 'elHeight:', elHeight);
                value = 15;
            }
        }

        return value;
    },

    _calculatePlacement: function () {
        var step   = this.state.joyrideSteps[this.state.joyrideCurrentIndex],
            position = step.position.toLowerCase(),
            target = document.querySelector(step.selector).getBoundingClientRect(),
            component = document.querySelector(this.state.joyrideShowTooltip ? '.joyride-tooltip' : '.joyride-beacon').getBoundingClientRect();

        var placement = {
            x: -1000,
            y: -1000
        };

        // Calculate x position
        if (/left/.test(position)) {
            placement.x = target.left - component.width / 2;
        }
        else if (/right/.test(position)) {
            placement.x = target.left + target.width - component.width / 2;
        }
        else {
            placement.x = target.left + target.width / 2 - component.width / 2;
        }

        // Calculate y position
        if (/top/.test(position)) {
            placement.y = target.top - component.height / 2;
        }
        else if (/left/.test(position)) {
            placement.y = target.top + target.height - component.height / 2;
        }
        else {
            placement.y = target.top + target.height / 2 - component.height / 2;
        }

        this.setState({
            xPos: this._preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
            yPos: this._preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height)
        });
    },

    _scrollToNextStep: function () {
        var $nextIndicator = $('.joyride-beacon');

        if ($nextIndicator && $nextIndicator.length && this.state.joyrideScrollToSteps) {
            $('html, body').animate({
                scrollTop: $nextIndicator.offset().top - $(window).height() / 2
            }, 500);
        }
    },

    _renderCurrentStep: function () {
        var state       = this.state,
            component,
            currentStep = state.joyrideSteps[state.joyrideCurrentIndex],
            hasNextStep = Boolean(state.joyrideSteps[state.joyrideCurrentIndex + 1]),
            buttonText  = state.joyrideType === 'tour' ? (hasNextStep ? (state.joyrideLocale.next + ' ' + (state.joyrideCurrentIndex + 1) + '/' + state.joyrideSteps.length) : state.joyrideLocale.last) : state.joyrideLocale.close,
            $target     = currentStep && currentStep.selector ? $(currentStep.selector) : null,
            cssPosition = $target ? $target.css('position') : null;

        if ($target && $target.length) {
            if (state.joyrideShowTooltip) {
                component = (
                    <Tooltip cssPosition={cssPosition}
                             xPos={state.xPos}
                             yPos={state.yPos}
                             step={currentStep}
                             buttonText={buttonText}
                             onClick={this._onClickTooltip}/>
                );
            }
            else {
                component = (
                    <Beacon cssPosition={cssPosition}
                            xPos={state.xPos}
                            yPos={state.yPos}
                            handleClick={this._onClickBeacon}/>
                );
            }
        }

        return component;
    }
};

module.exports = Mixin;
