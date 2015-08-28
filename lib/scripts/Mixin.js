var React   = require('react/addons'),
    $       = require('jquery'),
    Beacon  = require('./Beacon'),
    Tooltip = require('./Tooltip');

var Mixin = React.createClass({

    getInitialState: function () {
        return {
            joyrideCallback: function () {
            },
            joyrideCurrentIndex: this.settings.startIndex,
            joyrideScrollToSteps: true,
            joyrideShowTooltip: false,
            joyrideStartIndex: 0,
            joyrideSteps: [],
            xPos: -1000,
            yPos: -1000
        };
    },

    componentDidMount: function () {
        this._target = document.createElement('div');
        document.body.appendChild(this._target);

        if (this.settings.steps[this.state.currentIndex]) {
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
        var hasNewIndex = this.state.currentIndex !== prevState.currentIndex;
        var hasNewStep = Boolean(this.settings.steps[this.state.currentIndex]);
        var hasSteps = this.settings.steps.length > 0;
        var hasNewX = this.state.xPos !== prevState.xPos;
        var hasNewY = this.state.yPos !== prevState.yPos;
        var didToggleTooltip = this.state.showTooltip && this.state.showTooltip !== prevState.showTooltip;

        if ((hasNewIndex && hasNewStep) || didToggleTooltip || hasNewX || hasNewY) {
            this._renderLayer();
        }
        else if (hasSteps && hasNewIndex && !hasNewStep) {
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

    _addSteps: function (steps, cb) {
        if (!(steps instanceof Array)) {
            return false;
        }
        cb = cb || function () {
            };
        this.settings.steps = steps;

        this.setState({
            currentIndex: this.state.currentIndex < 0 ? 0 : this.state.currentIndex,
            setTourSteps: steps.length
        }, function () {
            cb();
        });
    },

    _getProgress: function () {
        return {
            index: this.state.currentIndex,
            percentageComplete: (this.state.currentIndex / this.settings.steps.length) * 100,
            step: this.settings.steps[this.state.currentIndex]
        };
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
        var step = this.settings.steps[this.state.currentIndex];
        var $target = $(step.element);
        var offset = $target.offset();
        var targetWidth = $target.outerWidth();
        var targetHeight = $target.outerHeight();
        var position = step.position.toLowerCase();
        var topRegex = new RegExp('top', 'gi');
        var bottomRegex = new RegExp('bottom', 'gi');
        var leftRegex = new RegExp('left', 'gi');
        var rightRegex = new RegExp('right', 'gi');
        var $element = this.state.showTooltip ? $('.joyride-tooltip') : $('.joyride-beacon');
        var elWidth = $element.outerWidth();
        var elHeight = $element.outerHeight();
        var placement = {
            x: -1000,
            y: -1000
        };

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

    _handleIndicatorClick: function (evt) {
        evt.preventDefault();

        this.setState({ showTooltip: true });
    },

    _closeTooltip: function (evt) {
        evt.preventDefault();

        this.setState({
            showTooltip: false,
            currentIndex: this.state.currentIndex + 1
        }, this._scrollToNextStep);
    },

    _scrollToNextStep: function () {
        var $nextIndicator = $('.joyride-beacon');

        if ($nextIndicator && $nextIndicator.length && this.settings.scrollToSteps) {
            $('html, body').animate({
                scrollTop: $nextIndicator.offset().top - $(window).height() / 2
            }, 500);
        }
    },

    _renderCurrentStep: function () {
        var element = null;
        var currentStep = this.settings.steps[this.state.currentIndex];
        var $target = currentStep && currentStep.element ? $(currentStep.element) : null;
        var cssPosition = $target ? $target.css('position') : null;

        if ($target && $target.length) {
            if (this.state.showTooltip) {
                element = (
                    <Tooltip cssPosition={cssPosition}
                             xPos={this.state.xPos}
                             yPos={this.state.yPos}
                             text={currentStep.text}
                             closeTooltip={this._closeTooltip}/>
                );
            }
            else {
                element = (
                    <Beacon cssPosition={cssPosition}
                               xPos={this.state.xPos}
                               yPos={this.state.yPos}
                               handleIndicatorClick={this._handleIndicatorClick}/>
                );
            }
        }

        return element;
    }
});

module.exports = Mixin;
