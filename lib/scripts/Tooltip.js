var React = require('react/addons');

var Tooltip = React.createClass({
    propTypes: {
        buttonText: React.PropTypes.string.isRequired,
        cssPosition: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        step: React.PropTypes.object.isRequired,
        showBackdrop: React.PropTypes.bool.isRequired,
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
        var props  = this.props,
            styles = {
                position: this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
                top: this.props.yPos,
                left: this.props.xPos
            },
            output = {},
            el;

        if (props.step.title) {
            output.header = (
                <header>
                    <h4>{props.step.title}</h4>
                    <a href="#" data-type="close" onClick={props.onClick}>&times;</a>
                </header>
            );
        }

        if (props.showBackdrop) {
            el = document.querySelector(props.step.selector).getBoundingClientRect();

            output.backdrop = (
                <div className="joyride-backdrop" data-type="close" onClick={props.onClick}>
                    <div style={{ top: el.top - 5, left: el.left - 5, width: el.width + 10, height: el.height + 10 }}></div>
                </div>
            );
        }

        return (
            <div>
                {output.backdrop}
                <div className="joyride-tooltip" style={styles}>
                    <div className={'triangle triangle-' + props.step.position}/>
                    {output.header}
                    <main>{props.step.text || ''}</main>
                    <footer>
                        <a href="#" data-type="button" onClick={props.onClick}>{props.buttonText}</a>
                    </footer>
                </div>
            </div>
        );
    }
});

module.exports = Tooltip;
