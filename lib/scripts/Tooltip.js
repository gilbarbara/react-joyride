var React = require('react/addons');

var Tooltip = React.createClass({
    propTypes: {
        animate: React.PropTypes.bool.isRequired,
        buttonText: React.PropTypes.string.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        showBackdrop: React.PropTypes.bool.isRequired,
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
            buttonText: 'Close',
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
                tooltipStyles: {
                    position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                    top: Math.round(this.props.yPos),
                    left: Math.round(this.props.xPos)
                },
                positionClass: props.step.position || 'top'
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

        if (props.showBackdrop) {
            opts.backdrop = (
                React.createElement('div', {
                        className: 'joyride-backdrop',
                        'data-type': 'close',
                        onClick: props.onClick
                    },
                    React.createElement('div', { style: opts.holeStyles })
                )
            );
        }

        if (window.innerWidth < 768) {
            if (/^left/.test(opts.positionClass)) {
                opts.positionClass = 'top';
            }
            else if (/^right/.test(opts.positionClass)) {
                opts.positionClass = 'bottom';
            }
        }

        return (
            React.createElement('div', null,
                opts.backdrop,
                React.createElement('div', {
                        className: 'joyride-tooltip' + (props.animate ? ' animate' : ''),
                        style: opts.tooltipStyles
                    },
                    React.createElement('div', { className: 'triangle triangle-' + opts.positionClass }),
                    opts.header,
                    React.createElement('main', null, props.step.text || ''),
                    React.createElement('footer', null,
                        React.createElement('a', {
                            href: '#',
                            'data-type': 'button',
                            ref: 'tooltipBtn',
                            onClick: props.onClick
                        }, props.buttonText)
                    )
                )
            )
        );
    }
});

module.exports = Tooltip;
