import React from 'react';
import PropTypes from 'prop-types';

const JoyrideSpotlight = ({ styles }) => (
  <div key="JoyrideSpotlight" className="react-joyride__spotlight" style={styles} />
);

JoyrideSpotlight.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default JoyrideSpotlight;
