var React   = require('react/addons'),
    $       = require('jquery'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var Mixin = {

    getInitialState: function () {
        return {
            joyrideCallback: function () {
            },
            joyrideCurrentIndex: -1,
            joyrideAutoplay: false,
            joyrideScrollToSteps: true,
            joyrideShowTooltip: false,
            joyrideStartIndex: 0,
            joyrideSteps: [],
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

        if ((opt.hasStep && opt.shouldRun) || opt.toggleTooltip || opt.newX || opt.newY) {
            this._renderLayer();
        }
        else if (opt.shouldRun && opt.hasSteps && !opt.hasStep) {
            this.state.joyrideCallback();
            this._unrenderLayer();
        }
    },

    _renderLayer: function () {
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

    _onClickCloseTooltip: function (e) {
        e.preventDefault();

        this.setState({
            joyrideShowTooltip: false,
            joyrideCurrentIndex: this.state.joyrideCurrentIndex + 1
        }, this._scrollToNextStep);
    },

    _preventWindowOverflow: function (value, axis, elWidth, elHeight) {
        var winWidth = parseInt($(window).width(), 10);
        var docHeight = parseInt($(document).height(), 10);

        if (axis.toLowerCase() === 'x') {
            if (value + elWidth > winWidth) {
                console.log('right overflow. value:', value, 'elWidth:', elWidth);
                value = winWidth - elWidth;
            }
            else if (value < 0) {
                console.log('left overflow. value:', value, 'elWidth:', elWidth);
                value = 0;
            }
        }
        else if (axis.toLowerCase() === 'y') {
            if (value + elHeight > docHeight) {
                console.log('bottom overflow. value:', value, 'elHeight:', elHeight);
                value = docHeight - elHeight;
            }
            else if (value < 0) {
                console.log('top overflow. value:', value, 'elHeight:', elHeight);
                value = 0;
            }
        }

        return value;
    },

    _calculatePlacement: function () {
        var step = this.state.joyrideSteps[this.state.joyrideCurrentIndex];
        var $target = $(step.element);
        var offset = $target.offset();
        var targetWidth = $target.outerWidth();
        var targetHeight = $target.outerHeight();
        var position = step.position.toLowerCase();
        var topRegex = new RegExp('top', 'gi');
        var bottomRegex = new RegExp('bottom', 'gi');
        var leftRegex = new RegExp('left', 'gi');
        var rightRegex = new RegExp('right', 'gi');
        var $element = this.state.joyrideShowTooltip ? $('.joyride-tooltip') : $('.joyride-beacon');
        var elWidth = $element.outerWidth();
        var elHeight = $element.outerHeight();
        var placement = {
            x: -1000,
            y: -1000
        };
        console.log(
            step.element,
            document.querySelector(step.element).getBoundingClientRect(),
            offset,
            targetWidth,
            targetHeight
        );
        // Calculate x position
        if (leftRegex.test(position)) {
            placement.x = offset.left - elWidth / 2;
        }
        else if (rightRegex.test(position)) {
            placement.x = offset.left + targetWidth - elWidth / 2;
        }
        else {
            placement.x = offset.left + targetWidth / 2 - elWidth / 2;
        }

        // Calculate y position
        if (topRegex.test(position)) {
            placement.y = offset.top - elHeight / 2;
        }
        else if (bottomRegex.test(position)) {
            placement.y = offset.top + targetHeight - elHeight / 2;
        }
        else {
            placement.y = offset.top + targetHeight / 2 - elHeight / 2;
        }

        this.setState({
            xPos: this._preventWindowOverflow(placement.x, 'x', elWidth, elHeight),
            yPos: this._preventWindowOverflow(placement.y, 'y', elWidth, elHeight)
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
        var element = null;
        var currentStep = this.state.joyrideSteps[this.state.joyrideCurrentIndex];
        var $target = currentStep && currentStep.element ? $(currentStep.element) : null;
        var cssPosition = $target ? $target.css('position') : null;

        if ($target && $target.length) {
            if (this.state.joyrideShowTooltip) {
                element = (
                    <Tooltip cssPosition={cssPosition}
                             xPos={this.state.xPos}
                             yPos={this.state.yPos}
                             text={currentStep.text}
                             onClickClose={this._onClickCloseTooltip}/>
                );
            }
            else {
                element = (
                    <Beacon cssPosition={cssPosition}
                            xPos={this.state.xPos}
                            yPos={this.state.yPos}
                            handleClick={this._onClickBeacon}/>
                );
            }
        }

        return element;
    }
};

module.exports = Mixin;
