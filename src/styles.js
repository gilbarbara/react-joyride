import deepmerge from 'deepmerge';
import { hexToRGB } from './modules/helpers';

const defaultOptions = {
  arrowColor: '#fff',
  backgroundColor: '#fff',
  primaryColor: '#f04',
  textColor: '#333',
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  beaconSize: 36,
  zIndex: 100,
};

const buttonReset = {
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: 0,
  color: '#555',
  outline: 'none',
  lineHeight: 1,
  padding: 8,
  WebkitAppearance: 'none',
};

let width = 290;

if (window.innerWidth > 480) {
  width = 380;
}
else if (window.innerWidth > 768) {
  width = 490;
}

const spotlight = {
  borderRadius: 4,
  position: 'absolute',
};

export default function getStyles(stepStyles) {
  const options = deepmerge(defaultOptions, stepStyles.options || {});

  const overlay = {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: options.zIndex,
  };

  const defaultStyles = {
    beacon: {
      ...buttonReset,
      display: 'inline-block',
      height: options.beaconSize,
      position: 'relative',
      width: options.beaconSize,
      zIndex: options.zIndex,
    },
    beaconInner: {
      animation: 'joyride-beacon-inner 1.2s infinite ease-in-out',
      backgroundColor: options.primaryColor,
      borderRadius: '50%',
      display: 'block',
      height: '50%',
      left: '50%',
      opacity: 0.7,
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
    },
    beaconOuter: {
      animation: 'joyride-beacon-outer 1.2s infinite ease-in-out',
      backgroundColor: `rgba(${hexToRGB(options.primaryColor).join(',')}, 0.2)`,
      border: `2px solid ${options.primaryColor}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      display: 'block',
      height: '100%',
      left: 0,
      opacity: 0.9,
      position: 'absolute',
      top: 0,
      transformOrigin: 'center',
      width: '100%',
    },
    tooltip: {
      backgroundColor: options.backgroundColor,
      borderRadius: 5,
      boxSizing: 'border-box',
      color: options.textColor,
      fontSize: 16,
      padding: 15,
      position: 'relative',
      width,
    },
    tooltipContainer: {
      textAlign: 'center',
    },
    tooltipTitle: {
      fontSize: 18,
      margin: '0 0 10px 0',
    },
    tooltipContent: {
      padding: '20px 10px',
    },
    tooltipFooter: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    buttonNext: {
      ...buttonReset,
      backgroundColor: options.primaryColor,
      borderRadius: 4,
      color: '#fff',
    },
    buttonBack: {
      ...buttonReset,
      color: options.primaryColor,
      marginLeft: 'auto',
      marginRight: 5,
    },
    buttonClose: {
      ...buttonReset,
      color: options.textColor,
      height: 14,
      padding: 15,
      position: 'absolute',
      right: 0,
      top: 0,
      width: 14,
    },
    buttonSkip: {
      ...buttonReset,
      color: options.textColor,
      fontSize: 14,
    },
    overlay: {
      ...overlay,
      backgroundColor: options.overlayColor,
      mixBlendMode: 'hard-light',
    },
    overlayLegacy: {
      ...overlay,
    },
    spotlight: {
      ...spotlight,
      backgroundColor: 'gray',
    },
    spotlightLegacy: {
      ...spotlight,
      boxShadow: `0 0 0 9999px ${options.overlayColor}, ${options.spotlightShadow}`,
    },
    floater: {
      arrow: {
        color: options.arrowColor,
      },
      tooltip: {
        zIndex: options.zIndex,
      },
    },
  };

  return deepmerge(defaultStyles, stepStyles || {});
}
