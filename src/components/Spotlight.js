import React from 'react';
import PropTypes from 'prop-types';

const JoyrideSpotlight = ({ styles, onClick }) => (
  <div
    key="JoyrideSpotlight"
    className="react-joyride__spotlight"
    style={styles}
    onClick={onClick}
  />
);

JoyrideSpotlight.propTypes = {
  onClick: PropTypes.func,
  styles: PropTypes.object.isRequired,
};

export default JoyrideSpotlight;
