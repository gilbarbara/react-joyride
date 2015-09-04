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

/*    componentDidMount () {
        React.findDOMNode(this.refs.tooltipBtn).focus();
    },*/

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
                <header>
                    <h4>{props.step.title}</h4>
                    <a href="#" data-type="close" onClick={props.onClick}>&times;</a>
                </header>
            );
        }

        if (props.showBackdrop) {
            opts.backdrop = (
                <div className="joyride-backdrop" data-type="close" onClick={props.onClick}>
                    <div style={opts.holeStyles}></div>
                </div>
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
            <div>
                {opts.backdrop}
                <div className={'joyride-tooltip' + (props.animate ? ' animate' : '')} style={opts.tooltipStyles}>
                    <div className={'triangle triangle-' + opts.positionClass}/>
                    {opts.header}
                    <main>{props.step.text || ''}</main>
                    <footer>
                        <a href="#" data-type="button" ref="tooltipBtn" onClick={props.onClick}>{props.buttonText}</a>
                    </footer>
                </div>
            </div>
        );
    }
});

module.exports = Tooltip;
