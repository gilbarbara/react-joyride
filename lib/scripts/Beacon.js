var React    = require('react'),
    hexToRGB = require('./utils.js').hexToRgb;

var Beacon = React.createClass({
    displayName: 'JoyrideBeacon',
    propTypes: {
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
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
            cssPosition: 'absolute',
            xPos: -1000,
            yPos: -1000
        };
    },

    render: function () {
        var props      = this.props,
            stepStyles = props.step.style || {},
            rgb,
            styles     = {
                beacon: {
                    left: props.xPos,
                    position: props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                    top: props.yPos
                },
                inner: {},
                outer: {}
            };

        if (stepStyles.beacon) {
            if (typeof stepStyles.beacon === 'string') {
                rgb = hexToRGB(stepStyles.beacon);

                styles.inner.backgroundColor = stepStyles.beacon;
                styles.outer = {
                    backgroundColor: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.2)',
                    borderColor: stepStyles.beacon
                };
            }
            else {
                if (stepStyles.beacon.inner) {
                    styles.inner.backgroundColor = stepStyles.beacon.inner;
                }

                if (stepStyles.beacon.outer) {
                    rgb = hexToRGB(stepStyles.beacon.outer);

                    styles.outer = {
                        backgroundColor: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.4)',
                        borderColor: stepStyles.beacon.outer
                    };
                }
            }
        }

        return (
            React.createElement('a', {
                    href: '#',
                    className: 'joyride-beacon',
                    style: styles.beacon,
                    onClick: props.onClick
                },
                React.createElement('span', {
                    className: 'inner',
                    style: styles.inner
                }),
                React.createElement('span', {
                    className: 'outer',
                    style: styles.outer
                })
            )
        );
    }

});

module.exports = Beacon;
