import React from 'react';
import { hexToRGB } from './utils';

let isTouch = false;

/* istanbul ignore else */
if (typeof window !== 'undefined') {
  isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

export default class JoyrideBeacon extends React.Component {
  static propTypes = {
    eventType: React.PropTypes.string.isRequired,
    onTrigger: React.PropTypes.func.isRequired,
    step: React.PropTypes.object.isRequired,
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
    xPos: -1000,
    yPos: -1000
  };

  render() {
    const { eventType, onTrigger, step, xPos, yPos } = this.props;
    const styles = {
      beacon: {
        left: xPos,
        position: step.isFixed === true ? 'fixed' : 'absolute',
        top: yPos
      },
      inner: {},
      outer: {}
    };
    const stepStyles = step.style || {};
    let rgb;

    /* istanbul ignore else */
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
      <button
        className="joyride-beacon"
        style={styles.beacon}
        onClick={eventType === 'click' || isTouch ? onTrigger : null}
        onMouseEnter={eventType === 'hover' && !isTouch ? onTrigger : null}>
        <span className="joyride-beacon__inner" style={styles.inner} />
        <span className="joyride-beacon__outer" style={styles.outer} />
      </button>
    );
  }
}
