import React from 'react';
import { hexToRGB } from './utils';

let isTouch = false;

if (typeof window !== 'undefined') {
  isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

export default class Beacon extends React.Component {
  constructor(props) {
    super(props);

    this.displayName = 'JoyrideBeacon';
  }

  static propTypes = {
    cssPosition: React.PropTypes.string.isRequired,
    eventType: React.PropTypes.string.isRequired,
    onTrigger: React.PropTypes.func.isRequired,
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
    cssPosition: 'absolute',
    xPos: -1000,
    yPos: -1000
  };

  render() {
    const props = this.props;
    const styles = {
      beacon: {
        left: props.xPos,
        position: props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
        top: props.yPos
      },
      inner: {},
      outer: {}
    };
    const stepStyles = props.step.style || {};
    let rgb;

    if (stepStyles.beacon) {
      if (typeof stepStyles.beacon === 'string') {
        rgb = hexToRGB(stepStyles.beacon);

        styles.inner.backgroundColor = stepStyles.beacon;
        styles.outer = {
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
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
            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
            borderColor: stepStyles.beacon.outer
          };
        }
      }
    }

    return (
      <a
        href="#"
        className="joyride-beacon"
        style={styles.beacon}
        onClick={props.eventType === 'click' || isTouch ? props.onTrigger : null}
        onMouseEnter={props.eventType === 'hover' && !isTouch ? props.onTrigger : null}>
        <span className="joyride-beacon__inner" style={styles.inner} />
        <span className="joyride-beacon__outer" style={styles.outer} />
      </a>
    );
  }
}
