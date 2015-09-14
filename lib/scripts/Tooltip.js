var React = require('react/addons');

var Tooltip = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        animate: React.PropTypes.bool.isRequired,
        browser: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.object.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        showOverlay: React.PropTypes.bool.isRequired,
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

    render: function () {
        var props = this.props,
            opts  = {
                el: document.querySelector(props.step.selector).getBoundingClientRect(),
                positionClass: props.step.position,
                tooltipStyles: {
                    position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                    top: Math.round(this.props.yPos),
                    left: Math.round(this.props.xPos)
                }
            };

        opts.holeStyles = {
            top: Math.round((opts.el.top - document.body.getBoundingClientRect().top) - 5),
            left: Math.round(opts.el.left - 5),
            width: Math.round(opts.el.width + 10),
            height: Math.round(opts.el.height + 10)
        };

        if (props.step.title) {
            opts.header = (
                React.createElement('header', null,
                    React.createElement('h4', null, props.step.title),
                    React.createElement('a', { href: '#', 'data-type': 'close', onClick: props.onClick }, '×')
                )
            );
        }

        if (props.showOverlay) {
            opts.hole = React.createElement('div', {
                className: 'joyride-hole ' + props.browser,
                style: opts.holeStyles
            });
        }

        if (window.innerWidth < 768) {
            if (/^left/.test(opts.positionClass)) {
                opts.positionClass = 'top';
            }
            else if (/^right/.test(opts.positionClass)) {
                opts.positionClass = 'bottom';
            }
        }

        if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && props.xPos > -1) {
            opts.tooltip = document.querySelector('.joyride-tooltip').getBoundingClientRect();
            opts.targetMiddle = (opts.el.left + opts.el.width / 2);
            opts.arrowPosition = (((opts.targetMiddle - props.xPos) / opts.tooltip.width) * 100).toFixed(2);
            opts.arrowPosition = (opts.arrowPosition < 5 ? 5 : (opts.arrowPosition > 95 ? 95 : opts.arrowPosition)) + '%';

            opts.arrowPosition = {
                left: opts.arrowPosition
            };
        }

        return (
            React.createElement('div', {
                    className: 'joyride-overlay',
                    style: {
                        height: document.body.clientHeight
                    },
                    'data-type': 'close',
                    onClick: props.onClick
                },
                opts.hole,
                React.createElement('div', {
                        className: 'joyride-tooltip' + (props.animate ? ' animate' : ''),
                        style: opts.tooltipStyles
                    },
                    React.createElement('div', {
                        className: 'triangle triangle-' + opts.positionClass,
                        style: opts.arrowPosition
                    }),
                    opts.header,
                    React.createElement('main', { dangerouslySetInnerHTML: { __html: props.step.text || '' } }),
                    React.createElement('footer', null,
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
                )
            )
        );
    }
});

module.exports = Tooltip;
