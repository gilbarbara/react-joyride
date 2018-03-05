import React from 'react';
import PropTypes from 'prop-types';

const JoyrideBeacon = ({ beaconComponent, onClickOrHover, styles }) => {
  const props = {
    'aria-label': 'Open',
    onClick: onClickOrHover,
    onMouseEnter: onClickOrHover,
    title: 'Open',
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
        {...props}
      >
        <span style={styles.beaconInner} />
        <span style={styles.beaconOuter} />
      </button>
    );
  }

  return component;
};

JoyrideBeacon.propTypes = {
  beaconComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  onClickOrHover: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default JoyrideBeacon;
