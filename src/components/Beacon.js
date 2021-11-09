import React from 'react';
import PropTypes from 'prop-types';
import is from 'is-lite';
import { componentTypeWithRefs } from '../modules/propTypes';

export default class JoyrideBeacon extends React.Component {
  constructor(props) {
    super(props);

    if (!props.beaconComponent) {
      const head = document.head || document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      const css = `
        @keyframes joyride-beacon-inner {
          20% {
            opacity: 0.9;
          }
        
          90% {
            opacity: 0.7;
          }
        }
        
        @keyframes joyride-beacon-outer {
          0% {
            transform: scale(1);
          }
        
          45% {
            opacity: 0.7;
            transform: scale(0.75);
          }
        
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
      `;

      style.type = 'text/css';
      style.id = 'joyride-beacon-animation';

      if (props.nonce !== undefined) {
        style.setAttribute('nonce', props.nonce);
      }

      style.appendChild(document.createTextNode(css));

      head.appendChild(style);
    }
  }

  static propTypes = {
    beaconComponent: componentTypeWithRefs,
    locale: PropTypes.object.isRequired,
    nonce: PropTypes.string,
    onClickOrHover: PropTypes.func.isRequired,
    shouldFocus: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { shouldFocus } = this.props;
    if (process.env.NODE_ENV !== 'production') {
      if (!is.domElement(this.beacon)) {
        console.warn('beacon is not a valid DOM element'); //eslint-disable-line no-console
      }
    }

    setTimeout(() => {
      if (is.domElement(this.beacon) && shouldFocus) {
        this.beacon.focus();
      }
    }, 0);
  }

  componentWillUnmount() {
    const style = document.getElementById('joyride-beacon-animation');

    if (style) {
      style.parentNode.removeChild(style);
    }
  }

  setBeaconRef = c => {
    this.beacon = c;
  };

  render() {
    const { beaconComponent, locale, onClickOrHover, styles } = this.props;
    const props = {
      'aria-label': locale.open,
      onClick: onClickOrHover,
      onMouseEnter: onClickOrHover,
      ref: this.setBeaconRef,
      title: locale.open,
    };
    let component;

    if (beaconComponent) {
      const BeaconComponent = beaconComponent;
      component = <BeaconComponent {...props} />;
    } else {
      component = (
        <button
          key="JoyrideBeacon"
          className="react-joyride__beacon"
          style={styles.beacon}
          type="button"
          data-test-id="button-beacon"
          {...props}
        >
          <span style={styles.beaconInner} />
          <span style={styles.beaconOuter} />
        </button>
      );
    }

    return component;
  }
}
