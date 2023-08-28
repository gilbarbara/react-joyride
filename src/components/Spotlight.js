import React from 'react';
import PropTypes from 'prop-types';

function JoyrideSpotlight({ styles, onClick }) {
  return <div onClick={onClick} key='JoyrideSpotlight' className='react-joyride__spotlight' style={styles} />;
}

JoyrideSpotlight.propTypes = {
  styles: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default JoyrideSpotlight;
