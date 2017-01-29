import React from 'react';
import { browser } from './utils';

export default class JoyrideTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    allowClicksThruHole: React.PropTypes.bool.isRequired,
    animate: React.PropTypes.bool.isRequired,
    buttons: React.PropTypes.object.isRequired,
    disableOverlay: React.PropTypes.bool,
    holePadding: React.PropTypes.number,
    onClick: React.PropTypes.func.isRequired,
    onRender: React.PropTypes.func.isRequired,
    // position of tooltip with respect to target
    position: React.PropTypes.oneOf([
      'top', 'top-left', 'top-right',
      'bottom', 'bottom-left', 'bottom-right',
      'right', 'left',
    ]).isRequired,
    // sanitized selector string
    selector: React.PropTypes.string.isRequired,
    showOverlay: React.PropTypes.bool.isRequired,
    standalone: React.PropTypes.bool,
    step: React.PropTypes.object.isRequired,
    // DOM element to target
    target: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired
  };

  static defaultProps = {
    buttons: {
      primary: 'Close'
    },
    step: {},
    xPos: -1000,
    yPos: -1000
  };

  componentWillMount() {
    const opts = this.setOpts(this.props);
    const styles = this.setStyles(this.props.step.style, opts, this.props);
    this.setState({ styles, opts });
  }

  componentDidMount() {
    const { onRender } = this.props;

    this.forceUpdate();
    onRender();

    if (this.props.showOverlay && this.props.allowClicksThruHole) {
      document.addEventListener('mousemove', this.handleMouseMove, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      allowClicksThruHole: nextAllowClicksThruHole,
      animate: nextAnimate,
      standalone: nextStandalone,
      step: nextStep,
      holePadding: nextHolePadding,
      position: nextPosition,
      xPos: nextXPos,
      yPos: nextYPos,
      showOverlay: nextShowOverlay,
    } = nextProps;
    const {
      allowClicksThruHole,
      animate,
      standalone,
      step,
      holePadding,
      position,
      xPos,
      yPos,
      showOverlay,
    } = this.props;

    /* istanbul ignore else */
    if (
      nextAnimate !== animate ||
      nextStandalone !== standalone ||
      nextStep !== step ||
      nextHolePadding !== holePadding ||
      nextPosition !== position ||
      nextXPos !== xPos ||
      nextYPos !== yPos
    ) {
      const opts = this.setOpts(nextProps);
      const styles = this.setStyles(nextProps.step.style, opts, nextProps);
      this.setState({ styles, opts });
    }

    // If showOverlay changed, we might need to allow clicks in the overlay hole
    if (nextShowOverlay !== showOverlay) {
      if (nextShowOverlay && nextAllowClicksThruHole) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else {
        document.removeEventListener('mousemove', this.handleMouseMove, false);
      }
    }

    // If allowClickInHole changed, we need to enable or disable clicking in the overlay hole
    if (nextAllowClicksThruHole !== allowClicksThruHole) {
      if (nextAllowClicksThruHole) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else {
        document.removeEventListener('mousemove', this.handleMouseMove, false);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { onRender, selector } = this.props;

    if (prevProps.selector !== selector) {
      this.forceUpdate();
      onRender();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove, false);
  }

  getArrowPosition(position) {
    let arrowPosition = position;

    if (window.innerWidth < 480) {
      if (position < 8) {
        arrowPosition = 8;
      }
      else if (position > 92) {
        arrowPosition = 92;
      }
    }
    else if (window.innerWidth < 1024) {
      if (position < 6) {
        arrowPosition = 6;
      }
      else if (position > 94) {
        arrowPosition = 94;
      }
    }
    else if (position < 5) {
      arrowPosition = 5;
    }
    else if (position > 95) {
      arrowPosition = 95;
    }

    return arrowPosition;
  }

  generateArrow(opts = {}) {
    let width;
    let height;
    let rotate;

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

    return `data:image/svg+xml,%3Csvg%20width%3D%22${width}%22%20height%3D%22${height}%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpolygon%20points%3D%220%2C%200%208%2C%208%2016%2C0%22%20fill%3D%22${opts.color}%22%20transform%3D%22scale%28${opts.scale}%29%20rotate%28${rotate}%29%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E`;
  }

  /**
   * Calculate styles based on those passed in with the step, or calculated opts, or props
   *
   * @param {Object} stepStyles              Style object provided with step
   * @param {Object} opts                    Options object calculated from this.setOpts
   * @param {string} opts.arrowPosition      Used for left/right positioing of arrow when on bottom or top
   * @param {Object} opts.rect               BoundingClientRect of target element
   * @param {string} opts.positonBaseClass   Base position of tooltip (top, bottom, left, right)
   * @param {Object} props                   Positioning properties: cssPosition, xPos, and yPos
   * @returns {Object}                       Calculated styles for arrow, buttons, header, main, footer, hole, and tooltip
   */
  setStyles(stepStyles, opts, props) {
    const { holePadding, step, xPos, yPos } = props;
    const isFixed = step.isFixed === true;

    const styles = {
      arrow: {
        left: opts.arrowPosition
      },
      buttons: {},
      header: {},
      main: {},
      footer: {},
      hole: {},
      tooltip: {
        position: isFixed ? 'fixed' : 'absolute',
        top: Math.round(yPos),
        left: Math.round(xPos)
      }
    };

    styles.hole = {
      top: Math.round((opts.rect.top - (isFixed ? 0 : document.body.getBoundingClientRect().top)) - holePadding),
      left: Math.round(opts.rect.left - holePadding),
      width: Math.round(opts.rect.width + (holePadding * 2)),
      height: Math.round(opts.rect.height + (holePadding * 2))
    };
    if (isFixed) {
      styles.hole.position = 'fixed';
    }

    styles.buttons = {
      back: {},
      close: {},
      primary: {},
      skip: {}
    };

    /* Styling */
    /* istanbul ignore else */
    if (stepStyles) {
      if (stepStyles.backgroundColor) {
        styles.arrow.backgroundImage = `url("${this.generateArrow({
          location: opts.positonBaseClass,
          color: stepStyles.backgroundColor
        })}")`;
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

      if (stepStyles.header) {
        styles.header = {
          ...styles.header,
          ...stepStyles.header
        };
      }

      if (stepStyles.main) {
        styles.main = {
          ...styles.main,
          ...stepStyles.main
        };
      }

      if (stepStyles.footer) {
        styles.footer = {
          ...styles.footer,
          ...stepStyles.footer
        };
      }

      if (stepStyles.back) {
        styles.buttons.back = {
          ...styles.buttons.back,
          ...stepStyles.back
        };
      }

      if (stepStyles.arrow) {
        styles.arrow = {
          ...styles.arrow,
          ...stepStyles.arrow
        };
      }

      if (stepStyles.button) {
        styles.buttons.primary = {
          ...styles.buttons.primary,
          ...stepStyles.button
        };
      }

      if (stepStyles.close) {
        styles.buttons.close = {
          ...styles.buttons.close,
          ...stepStyles.close
        };
      }

      if (stepStyles.skip) {
        styles.buttons.skip = {
          ...styles.buttons.skip,
          ...stepStyles.skip
        };
      }

      if (stepStyles.hole) {
        styles.hole = {
          ...stepStyles.hole,
          ...styles.hole
        };
      }
    }

    return styles;
  }

  setOpts(props) {
    const { animate, position, standalone, target, xPos } = props;

    const tooltip = document.querySelector('.joyride-tooltip');

    const opts = {
      classes: ['joyride-tooltip'],
      rect: target.getBoundingClientRect(),
      positionClass: position,
    };

    opts.positonBaseClass = opts.positionClass.match(/-/) ? opts.positionClass.split('-')[0] : opts.positionClass;

    if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && xPos > -1) {
      opts.tooltip = { width: 450 };

      /* istanbul ignore else */
      if (tooltip) {
        opts.tooltip = tooltip.getBoundingClientRect();
      }

      opts.targetMiddle = (opts.rect.left + (opts.rect.width / 2));
      opts.arrowPosition = (((opts.targetMiddle - xPos) / opts.tooltip.width) * 100).toFixed(2);
      opts.arrowPosition = `${this.getArrowPosition(opts.arrowPosition)}%`;
    }

    if (standalone) {
      opts.classes.push('joyride-tooltip--standalone');
    }

    if (opts.positonBaseClass !== opts.positionClass) {
      opts.classes.push(opts.positonBaseClass);
    }

    opts.classes.push(opts.positionClass);

    if (animate) {
      opts.classes.push('joyride-tooltip--animate');
    }

    return opts;
  }

  handleMouseMove = (e) => {
    const event = e || window.e;
    const hole = this.state.styles.hole;
    const offsetY = hole.position === 'fixed' ? event.clientY : event.pageY;
    const offsetX = hole.position === 'fixed' ? event.clientX : event.pageX;
    const inHoleHeight = (offsetY >= hole.top && offsetY <= hole.top + hole.height);
    const inHoleWidth = (offsetX >= hole.left && offsetX <= hole.left + hole.width);
    const inHole = inHoleWidth && inHoleHeight;
    if (inHole && !this.state.mouseOverHole) {
      this.setState({ mouseOverHole: true });
    }
    if (!inHole && this.state.mouseOverHole) {
      this.setState({ mouseOverHole: false });
    }
  };

  render() {
    const { buttons, disableOverlay, onClick, selector, showOverlay, step, target, type } = this.props;

    if (!target) {
      return undefined;
    }

    const opts = this.state.opts;
    const styles = this.state.styles;
    const output = {};

    if (step.title) {
      output.header = (
        <div className="joyride-tooltip__header" style={styles.header}>
          {step.title}</div>
      );
    }

    if (buttons.skip) {
      output.skip = (<button
        className="joyride-tooltip__button joyride-tooltip__button--skip"
        style={styles.buttons.skip}
        data-type="skip"
        onClick={onClick}>
        {buttons.skip}
      </button>);
    }

    // Why is this here?
    if (!step.text || typeof step.text === 'string') {
      output.main = (
        <div
          className="joyride-tooltip__main"
          style={styles.main}
          dangerouslySetInnerHTML={{ __html: step.text || '' }}
        />);
    }
    else {
      output.main = (<div className="joyride-tooltip__main" style={styles.main}>{step.text}</div>);
    }

    if (buttons.secondary) {
      output.secondary = (<button
        className="joyride-tooltip__button joyride-tooltip__button--secondary"
        style={styles.buttons.back}
        data-type="back"
        onClick={onClick}>
        {buttons.secondary}
      </button>);
    }

    if (step.event === 'hover') {
      styles.buttons.close.opacity = 0;
    }

    output.tooltipComponent = (
      <div className={opts.classes.join(' ')} style={styles.tooltip} data-target={selector}>
        <div
          className={`joyride-tooltip__triangle joyride-tooltip__triangle-${opts.positionClass}`}
          style={styles.arrow} />
        <button
          className={`joyride-tooltip__close${(output.header ? ' joyride-tooltip__close--header' : '')}`}
          style={styles.buttons.close}
          data-type="close"
          onClick={onClick} />
        {output.header}
        {output.main}
        <div className="joyride-tooltip__footer" style={styles.footer}>
          {output.skip}
          {output.secondary}
          <button
            className="joyride-tooltip__button joyride-tooltip__button--primary"
            style={styles.buttons.primary}
            data-type={['single', 'casual'].indexOf(type) > -1 ? 'close' : 'next'}
            onClick={onClick}>
            {buttons.primary}
          </button>
        </div>
      </div>
    );

    if (showOverlay) {
      output.hole = (
        <div className={`joyride-hole ${browser}`} style={styles.hole} />
      );
    }

    if (!showOverlay) {
      return output.tooltipComponent;
    }

    const overlayStyles = {
      cursor: disableOverlay ? 'default' : 'pointer',
      height: document.body.clientHeight,
      pointerEvents: this.state.mouseOverHole ? 'none' : 'auto',
    };

    return (
      <div
        className="joyride-overlay"
        style={overlayStyles}
        data-type="close"
        onClick={!disableOverlay ? onClick : undefined}>
        {output.hole}
        {output.tooltipComponent}
      </div>
    );
  }
}
