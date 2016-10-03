import React from 'react';
import { browser } from './utils';

export default class JoyrideTooltip extends React.Component {
  static propTypes = {
    animate: React.PropTypes.bool.isRequired,
    buttons: React.PropTypes.object.isRequired,
    cssPosition: React.PropTypes.string.isRequired,
    disableOverlay: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
    onRender: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.bool.isRequired,
    standalone: React.PropTypes.bool,
    step: React.PropTypes.object.isRequired,
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
    cssPosition: 'absolute',
    step: {},
    xPos: -1000,
    yPos: -1000
  };

  componentDidMount() {
    this.forceUpdate(this.props.onRender);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.step.selector !== this.props.step.selector) {
      this.forceUpdate(this.props.onRender);
    }
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
    else {
      if (position < 5) {
        arrowPosition = 5;
      }
      else if (position > 95) {
        arrowPosition = 95;
      }
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

  setStyles(stepStyles, opts) {
    const position = this.props.cssPosition || 'absolute';
    const styles = {
      arrow: {
        left: opts.arrowPosition
      },
      buttons: {},
      header: {},
      hole: {},
      tooltip: {
        position,
        top: Math.round(this.props.yPos),
        left: Math.round(this.props.xPos)
      }
    };

    styles.hole = {
      position,
      top: Math.round((opts.rect.top - document.body.getBoundingClientRect().top) - 5),
      left: Math.round(opts.rect.left - 5),
      width: Math.round(opts.rect.width + 10),
      height: Math.round(opts.rect.height + 10)
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

      if (stepStyles.back) {
        styles.buttons.back = Object.assign({}, styles.buttons.back, stepStyles.back);
      }

      if (stepStyles.button) {
        styles.buttons.primary = Object.assign({}, styles.buttons.primary, stepStyles.button);
      }

      if (stepStyles.close) {
        styles.buttons.close = Object.assign({}, styles.buttons.close, stepStyles.close);
      }

      if (stepStyles.skip) {
        styles.buttons.skip = Object.assign({}, styles.buttons.skip, stepStyles.skip);
      }

      if (stepStyles.hole) {
        styles.hole = Object.assign({}, stepStyles.hole, styles.hole);
      }
    }

    return styles;
  }

  setOpts() {
    const props = this.props;
    const step = props.step;
    const target = document.querySelector(step.selector);
    const tooltip = document.querySelector('.joyride-tooltip');

    const opts = {
      classes: ['joyride-tooltip'],
      rect: target.getBoundingClientRect(),
      positionClass: step.position
    };

    opts.positonBaseClass = opts.positionClass.match(/-/) ? opts.positionClass.split('-')[0] : opts.positionClass;

    if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && props.xPos > -1) {
      opts.tooltip = { width: 450 };

      if (tooltip) {
        opts.tooltip = tooltip.getBoundingClientRect();
      }

      opts.targetMiddle = (opts.rect.left + (opts.rect.width / 2));
      opts.arrowPosition = (((opts.targetMiddle - props.xPos) / opts.tooltip.width) * 100).toFixed(2);
      opts.arrowPosition = `${this.getArrowPosition(opts.arrowPosition)}%`;
    }

    if (props.standalone) {
      opts.classes.push('joyride-tooltip--standalone');
    }

    if (opts.positonBaseClass !== opts.positionClass) {
      opts.classes.push(opts.positonBaseClass);
    }

    opts.classes.push(opts.positionClass);

    if (props.animate) {
      opts.classes.push('joyride-tooltip--animate');
    }

    return opts;
  }

  render() {
    const props = this.props;
    const step = props.step;
    const target = document.querySelector(step.selector);

    if (!target) {
      return undefined;
    }

    const opts = this.setOpts();
    const styles = this.setStyles(step.style, opts);
    const output = {};

    if (step.title) {
      output.header = (
        <div className="joyride-tooltip__header" style={styles.header}>
          {step.title}</div>
      );
    }

    if (props.buttons.skip) {
      output.skip = (<a
        href="#"
        className="joyride-tooltip__button joyride-tooltip__button--skip"
        style={styles.buttons.skip}
        data-type="skip"
        onClick={props.onClick}>
        {props.buttons.skip}
      </a>);
    }
    if (!step.text || typeof step.text === 'string') {
      output.main = (<div className="joyride-tooltip__main" dangerouslySetInnerHTML={{ __html: step.text || '' }} />);
    }
    else {
      output.main = (<div className="joyride-tooltip__main">{step.text}</div>);
    }

    if (props.buttons.secondary) {
      output.secondary = (<a
        href="#"
        className="joyride-tooltip__button joyride-tooltip__button--secondary"
        style={styles.buttons.back}
        data-type="back"
        onClick={props.onClick}>
        {props.buttons.secondary}
      </a>);
    }

    if (step.event === 'hover') {
      styles.buttons.close.opacity = 0;
    }

    output.tooltipComponent = (
      <div className={opts.classes.join(' ')} style={styles.tooltip} data-target={step.selector}>
        <div
          className={`joyride-tooltip__triangle joyride-tooltip__triangle-${opts.positionClass}`}
          style={styles.arrow} />
        <a
          href="#"
          className={`joyride-tooltip__close${(output.header ? ' joyride-tooltip__close--header' : '')}`}
          style={styles.buttons.close}
          data-type="close"
          onClick={props.onClick}>×</a>
        {output.header}
        {output.main}
        <div className="joyride-tooltip__footer">
          {output.skip}
          {output.secondary}
          <a
            href="#"
            className="joyride-tooltip__button joyride-tooltip__button--primary"
            style={styles.buttons.primary}
            data-type={['single', 'casual'].indexOf(props.type) > -1 ? 'close' : 'next'}
            onClick={props.onClick}>
            {props.buttons.primary}
          </a>
        </div>
      </div>
    );

    if (props.showOverlay) {
      output.hole = (
        <div className={`joyride-hole ${browser}`} style={styles.hole} />
      );
    }

    if (!props.showOverlay) {
      return output.tooltipComponent;
    }

    return (
      <div
        className="joyride-overlay"
        style={{
          cursor: props.disableOverlay ? 'default' : 'pointer',
          height: document.body.clientHeight
        }}
        data-type="close"
        onClick={!props.disableOverlay ? props.onClick : undefined}>
        {output.hole}
        {output.tooltipComponent}
      </div>
    );
  }
}
