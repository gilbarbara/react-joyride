var React = require('react/addons');

var Beacon = React.createClass({
    propTypes: {
        cssPosition: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired,
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
        var styles = {
            left: this.props.xPos,
            position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
            top: this.props.yPos
        };

        return (
            React.createElement('a', { href: '#', className: 'joyride-beacon', style: styles, onClick: this.props.handleClick },
                React.createElement('span', { className: 'inner' }),
                React.createElement('span', { className: 'outer' })
            )
        );
    }

});

module.exports = Beacon;
