import React from 'react';
import PropTypes from 'prop-types';

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
      style.appendChild(document.createTextNode(css));

      head.appendChild(style);
    }
  }

  static propTypes = {
    beaconComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]),
    locale: PropTypes.object.isRequired,
    onClickOrHover: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    const style = document.getElementById('joyride-beacon-animation');

    if (style) {
      style.parentNode.removeChild(style);
    }
  }

  render() {
    const { beaconComponent, locale, onClickOrHover, styles } = this.props;
    const props = {
      'aria-label': locale.open,
      onClick: onClickOrHover,
      onMouseEnter: onClickOrHover,
      title: locale.open,
    };
    let component;

    if (beaconComponent) {
      if (React.isValidElement(beaconComponent)) {
        component = React.cloneElement(beaconComponent, props);
      }
      else {
        component = beaconComponent(props);
      }
    }
    else {
      component = (
        <button
          key="JoyrideBeacon"
          className="joyride-beacon"
          style={styles.beacon}
          type="button"
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
