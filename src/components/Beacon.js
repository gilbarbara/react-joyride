import React from 'react';
import PropTypes from 'prop-types';

const JoyrideBeacon = ({ onClickOrHover, styles }) => (
  <button
    key="JoyrideBeacon"
    className="joyride-beacon"
    style={styles.beacon}
    onClick={onClickOrHover}
    onMouseEnter={onClickOrHover}
  >
    <span style={styles.beaconInner} />
    <span style={styles.beaconOuter} />
  </button>
);

JoyrideBeacon.propTypes = {
  onClickOrHover: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default JoyrideBeacon;
