import React from 'react';
import PropTypes from 'prop-types';

function JoyrideSpotlight({ styles }) {
  return <div key="JoyrideSpotlight" className="react-joyride__spotlight" style={styles} />;
}

JoyrideSpotlight.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default JoyrideSpotlight;
