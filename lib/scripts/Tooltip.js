var React = require('react/addons');

var Tooltip = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        animate: React.PropTypes.bool.isRequired,
        browser: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.object.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        options: React.PropTypes.object.isRequired,
        step: React.PropTypes.object.isRequired,
        xPos: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]).isRequired,
        yPos: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]).isRequired
    },

    getDefaultProps: function () {
        return {
            browser: 'chrome',
            buttons: {
                primary: 'Close'
            },
            cssPosition: 'absolute',
            step: {},
            xPos: -1000,
            yPos: -1000
        };
    },

    _getArrowPosition: function (position) {
        var arrowPosition;

        if (window.innerWidth < 480) {
            arrowPosition = (position < 8 ? 8 : (position > 92 ? 92 : position));
        }
        else if (window.innerWidth < 1024) {
            arrowPosition = (position < 6 ? 6 : (position > 94 ? 94 : position));
        }
        else {
            arrowPosition = (position < 5 ? 5 : (position > 95 ? 95 : position));
        }

        return arrowPosition;
    },

    render: function () {
        var props = this.props,
            opts  = {
                target: document.querySelector(props.step.selector).getBoundingClientRect(),
                positionClass: props.options.overridePosition || props.step.position,
                tooltipStyles: {
                    position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                    top: Math.round(this.props.yPos),
                    left: Math.round(this.props.xPos)
                }
            };

        opts.holeStyles = {
            top: Math.round((opts.target.top - document.body.getBoundingClientRect().top) - 5),
            left: Math.round(opts.target.left - 5),
            width: Math.round(opts.target.width + 10),
            height: Math.round(opts.target.height + 10)
        };

        if (props.step.title) {
            opts.header = (
                React.createElement('header', null,
                    React.createElement('h4', null, props.step.title),
                    React.createElement('a', { href: '#', 'data-type': 'close', onClick: props.onClick }, '×')
                )
            );
        }

        opts.tooltipElement = React.createElement('div', {
                className: 'joyride-tooltip ' + opts.positionClass + (props.animate ? ' animate' : ''),
                style: opts.tooltipStyles
            },
            React.createElement('div', {
                className: 'triangle triangle-' + opts.positionClass,
                style: opts.arrowPosition
            }),
            opts.header,
            React.createElement('main', { dangerouslySetInnerHTML: { __html: props.step.text || '' } }),
            React.createElement('footer', null,
                (props.buttons.skip ?
                    React.createElement('a', {
                        href: '#',
                        className: 'skip',
                        'data-type': 'skip',
                        onClick: props.onClick
                    }, props.buttons.skip)
                    : false),
                (props.buttons.secondary ?
                    React.createElement('a', {
                        href: '#',
                        className: 'secondary',
                        'data-type': 'back',
                        onClick: props.onClick
                    }, props.buttons.secondary)
                    : false),
                React.createElement('a', {
                    href: '#',
                    className: 'primary',
                    'data-type': 'next',
                    onClick: props.onClick
                }, props.buttons.primary)
            )
        );

        if (props.options.showOverlay) {
            opts.hole = React.createElement('div', {
                className: 'joyride-hole ' + props.browser,
                style: opts.holeStyles
            });
        }

        if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && props.xPos > -1) {
            opts.tooltip = document.querySelector('.joyride-tooltip').getBoundingClientRect();
            opts.targetMiddle = (opts.target.left + opts.target.width / 2);
            opts.arrowPosition = (((opts.targetMiddle - props.xPos) / opts.tooltip.width) * 100).toFixed(2);
            opts.arrowPosition = this._getArrowPosition(opts.arrowPosition) + '%';

            opts.arrowPosition = {
                left: opts.arrowPosition
            };
        }

        if (!props.options.showOverlay) {
            return opts.tooltipElement;
        }

        return React.createElement('div', {
                className: 'joyride-overlay',
                style: {
                    height: document.body.clientHeight
                },
                'data-type': 'close',
                onClick: props.onClick
            },
            opts.hole,
            opts.tooltipElement
        );
    }
});

module.exports = Tooltip;
