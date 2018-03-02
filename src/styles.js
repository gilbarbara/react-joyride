import deepmerge from 'deepmerge';

const color = '#f04';
const colorRGB = [255, 0, 68];
const overlayColor = 'rgba(0, 0, 0, 0.5)';
const holeShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
const beaconSize = 36;
const zIndex = 100;

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

const hole = {
  borderRadius: 4,
  position: 'absolute',
};

const overlay = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex,
};

export default function getMergedStyles(styles) {
  const defaultStyles = {
    beacon: {
      ...buttonReset,
      display: 'inline-block',
      height: beaconSize,
      position: 'relative',
      width: beaconSize,
      zIndex,
    },
    beaconInner: {
      animation: 'joyride-beacon-inner 1.2s infinite ease-in-out',
      backgroundColor: color,
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
      backgroundColor: `rgba(${colorRGB.join(',')}, 0.2)`,
      border: `2px solid ${color}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      display: 'block',
      height: '100%',
      left: 0,
      opacity: 0.9,
      position: 'absolute',
      top: 0,
      // transform: 'translateY(-50%)',
      transformOrigin: 'center',
      width: '100%',
    },
    tooltip: {
      borderRadius: 5,
      fontSize: 16,
      backgroundColor: '#fff',
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
      backgroundColor: color,
      borderRadius: 4,
      color: '#fff',
    },
    buttonBack: {
      ...buttonReset,
      color,
      marginLeft: 'auto',
      marginRight: 5,
    },
    buttonClose: {
      ...buttonReset,
      height: 14,
      padding: 15,
      position: 'absolute',
      right: 0,
      top: 0,
      width: 14,
    },
    buttonSkip: {
      ...buttonReset,
      fontSize: 14,
    },
    overlay: {
      ...overlay,
      backgroundColor: overlayColor,
      mixBlendMode: 'hard-light',
    },
    overlayLegacy: {
      ...overlay,
    },
    hole: {
      ...hole,
      backgroundColor: 'gray',
    },
    holeLegacy: {
      ...hole,
      boxShadow: `0 0 0 9999px ${overlayColor}, ${holeShadow}`,
    },
  };

  return deepmerge(defaultStyles, styles || {});
}
