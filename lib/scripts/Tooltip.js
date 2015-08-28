var React = require('react/addons');

var Tooltip = React.createClass({
    propTypes: {
        closeTooltip: React.PropTypes.func.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired,
        title: React.PropTypes.string,
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
            yPos: -1000,
            text: ''
        };
    },

    render: function () {
        var styles = {
            position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
            top: this.props.yPos,
            left: this.props.xPos
        };

        return (
            <div>
                <div className="joyride-backdrop" onClick={ this.props.closeTooltip}/>
                <div className="joyride-tooltip" style={ styles }>
                    <p>{ this.props.text || ''}</p>

                    <div className="joyride-btn close" onClick={ this.props.closeTooltip}>Close</div>
                </div>
            </div>);
    }
});

module.exports = Tooltip;
