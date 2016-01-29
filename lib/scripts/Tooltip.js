var React  = require('react'),
    assign = require('object-assign');

var Tooltip = React.createClass({
    displayName: 'JoyrideTooltip',

    propTypes: {
        animate: React.PropTypes.bool.isRequired,
        browser: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.object.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        showOverlay: React.PropTypes.bool.isRequired,
        standalone: React.PropTypes.bool,
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

    _generateArrow: function (opts) {
        var width,
            height,
            rotate;

        opts = opts || {};
        opts.location = opts.location || 'top';
        opts.color = opts.color || '#f04';
        opts.color = opts.color.replace('#', '%23');

        opts.width = opts.width || 36;
        opts.height = opts.width / 2;
        opts.scale = opts.width / 16;
        opts.rotate = '0';

        height = opts.height;
        rotate = opts.rotate;
        width = opts.width;

        if (opts.location === 'bottom') {
            rotate = '180 8 4';
        }
        else if (opts.location === 'left') {
            height = opts.width;
            width = opts.height;
            rotate = '270 8 8';
        }
        else if (opts.location === 'right') {
            height = opts.width;
            width = opts.height;
            rotate = '90 4 4';
        }

        return 'data:image/svg+xml,%3Csvg%20width%3D%22' + width + '%22%20height%3D%22' + height + '%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpolygon%20points%3D%220%2C%200%208%2C%208%2016%2C0%22%20fill%3D%22' + opts.color + '%22%20transform%3D%22scale%28' + opts.scale + '%29%20rotate%28' + rotate + '%29%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E';
    },

    _setStyles: function (opts, styles, stepStyles) {
        styles.hole = {
            top: Math.round((opts.target.top - document.body.getBoundingClientRect().top) - 5),
            left: Math.round(opts.target.left - 5),
            width: Math.round(opts.target.width + 10),
            height: Math.round(opts.target.height + 10)
        };

        styles.buttons = {
            back: {},
            close: {},
            primary: {},
            skip: {}
        };

        /* Styling */
        if (stepStyles) {
            if (stepStyles.backgroundColor) {
                styles.arrow.backgroundImage = 'url("' + this._generateArrow({
                        location: opts.positonBaseClass,
                        color: stepStyles.backgroundColor
                    }) + '")';
                styles.tooltip.backgroundColor = stepStyles.backgroundColor;
            }

            if (stepStyles.borderRadius) {
                styles.tooltip.borderRadius = stepStyles.borderRadius;
            }

            if (stepStyles.color) {
                styles.buttons.primary.color = stepStyles.color;
                styles.buttons.close.color = stepStyles.color;
                styles.buttons.skip.color = stepStyles.color;
                styles.header.color = stepStyles.color;
                styles.tooltip.color = stepStyles.color;

                if (stepStyles.mainColor && stepStyles.mainColor === stepStyles.color) {
                    styles.buttons.primary.color = stepStyles.backgroundColor;
                }
            }

            if (stepStyles.mainColor) {
                styles.buttons.primary.backgroundColor = stepStyles.mainColor;
                styles.buttons.back.color = stepStyles.mainColor;
                styles.header.borderColor = stepStyles.mainColor;
            }

            if (stepStyles.textAlign) {
                styles.tooltip.textAlign = stepStyles.textAlign;
            }

            if (stepStyles.width) {
                styles.tooltip.width = stepStyles.width;
            }

            if (stepStyles.back) {
                styles.buttons.back = assign(styles.buttons.back, stepStyles.back);
            }

            if (stepStyles.button) {
                styles.buttons.primary = assign(styles.buttons.primary, stepStyles.button);
            }

            if (stepStyles.close) {
                styles.buttons.close = assign(styles.buttons.close, stepStyles.close);
            }

            if (stepStyles.skip) {
                styles.buttons.skip = assign(styles.buttons.skip, stepStyles.skip);
            }
        }

        return styles;
    },

    render: function () {
        var props  = this.props,
            step   = props.step,
            opts   = {
                classes: ['joyride-tooltip'],
                target: document.querySelector(step.selector).getBoundingClientRect(),
                positionClass: step.position
            },
            styles = {
                arrow: {},
                buttons: {},
                header: {},
                hole: {},
                tooltip: {
                    position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                    top: Math.round(this.props.yPos),
                    left: Math.round(this.props.xPos)
                }
            };

        opts.positonBaseClass = opts.positionClass.match(/-/) ? opts.positionClass.split('-')[0] : opts.positionClass;

        if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && props.xPos > -1) {
            opts.tooltip = document.querySelector('.joyride-tooltip').getBoundingClientRect();
            opts.targetMiddle = (opts.target.left + opts.target.width / 2);
            opts.arrowPosition = (((opts.targetMiddle - props.xPos) / opts.tooltip.width) * 100).toFixed(2);
            opts.arrowPosition = this._getArrowPosition(opts.arrowPosition) + '%';

            styles.arrow.left = opts.arrowPosition;
        }

        styles = this._setStyles(opts, styles, step.style)

        if (props.standalone) {
            opts.classes.push('joyride-tooltip--standalone');
        }
        if (opts.positonBaseClass) {
            opts.classes.push(opts.positonBaseClass);
        }
        opts.classes.push(opts.positionClass);
        if (props.animate) {
            opts.classes.push('joyride-tooltip--animate');
        }

        if (step.title) {
            opts.header = (
                React.createElement('div', {
                    className: 'joyride-tooltip__header',
                    style: styles.header
                }, step.title)
            );
        }

        opts.tooltipElement = React.createElement('div', {
                className: opts.classes.join(' '),
                style: styles.tooltip,
                'data-target': step.selector
            },
            React.createElement('div', {
                className: 'triangle triangle-' + opts.positionClass,
                style: styles.arrow
            }),
            React.createElement('a', {
                href: '#',
                className: 'joyride-tooltip__close' + (opts.header ? ' joyride-tooltip__close--header' : ''),
                style: styles.buttons.close,
                'data-type': 'close',
                onClick: props.onClick
            }, '×'),
            opts.header,
            React.createElement('div', {
                className: 'joyride-tooltip__main',
                dangerouslySetInnerHTML: { __html: step.text || '' }
            }),
            React.createElement('div', {
                    className: 'joyride-tooltip__footer'
                },
                (props.buttons.skip ?
                    React.createElement('a', {
                        href: '#',
                        className: 'joyride-tooltip__button joyride-tooltip__button--skip',
                        style: styles.buttons.skip,
                        'data-type': 'skip',
                        onClick: props.onClick
                    }, props.buttons.skip)
                    : false),
                (props.buttons.secondary ?
                    React.createElement('a', {
                        href: '#',
                        className: 'joyride-tooltip__button joyride-tooltip__button--secondary',
                        style: styles.buttons.back,
                        'data-type': 'back',
                        onClick: props.onClick
                    }, props.buttons.secondary)
                    : false),
                React.createElement('a', {
                    href: '#',
                    className: 'joyride-tooltip__button joyride-tooltip__button--primary',
                    style: styles.buttons.primary,
                    'data-type': 'next',
                    onClick: props.onClick
                }, props.buttons.primary)
            )
        );

        if (props.showOverlay) {
            opts.hole = React.createElement('div', {
                className: 'joyride-hole ' + props.browser,
                style: styles.hole
            });
        }

        if (!props.showOverlay) {
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
