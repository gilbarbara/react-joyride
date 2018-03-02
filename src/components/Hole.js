import React from 'react';
import PropTypes from 'prop-types';

const JoyrideHole = ({ styles }) => (
  <div
    key="JoyrideHole"
    className="joyride-hole"
    style={styles}
  />
);

JoyrideHole.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default JoyrideHole;
