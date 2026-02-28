import { deepMerge, hexToRGB } from './modules/helpers';
import { Props, StepMerged, Styles, StylesOptions } from './types';

const defaultOptions: StylesOptions = {
  arrowColor: '#fff',
  arrowSpacing: 5,
  backgroundColor: '#fff',
  beaconSize: 36,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  primaryColor: '#f04',
  textColor: '#333',
  width: 380,
  zIndex: 100,
};

const buttonBase = {
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: 0,
  color: '#555',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 8,
  WebkitAppearance: 'none',
};

const spotlight = {
  borderRadius: 4,
  position: 'absolute',
};

export default function getStyles(props: Props, step: StepMerged) {
  const { styles } = props;
  const mergedStyles = deepMerge<Styles>(styles ?? {}, step.styles ?? {});
  const options = deepMerge<StylesOptions>(defaultOptions, mergedStyles.options || {});
  const hideBeacon = step.placement === 'center' || step.disableBeacon;
  let { width } = options;

  if ('width' in options) {
    width =
      typeof options.width === 'number' && window.innerWidth < options.width
        ? window.innerWidth - 30
        : options.width;
  }

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
    arrow: {
      base: 32,
      size: 16,
      alignItems: 'center',
      color: options.arrowColor,
      display: 'inline-flex',
      justifyContent: 'center',
      position: 'absolute',
    },
    beacon: {
      ...buttonBase,
      display: hideBeacon ? 'none' : 'inline-block',
      height: options.beaconSize,
      borderRadius: '50%',
      position: 'relative',
      width: options.beaconSize,
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
    buttonNext: {
      ...buttonBase,
      backgroundColor: options.primaryColor,
      borderRadius: 4,
      color: '#fff',
    },
    buttonBack: {
      ...buttonBase,
      color: options.primaryColor,
      marginLeft: 'auto',
      marginRight: 5,
    },
    buttonClose: {
      ...buttonBase,
      color: options.textColor,
      height: 14,
      padding: 15,
      position: 'absolute',
      right: 0,
      top: 0,
      width: 14,
    },
    buttonSkip: {
      ...buttonBase,
      color: options.textColor,
      fontSize: 14,
    },
    floater: {
      display: 'inline-block',
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
      maxWidth: '100%',
      transition: 'opacity 0.3s',
    },
    overlay: {
      ...overlay,
      backgroundColor: options.overlayColor,
      mixBlendMode: 'hard-light',
    },
    spotlight: {
      ...spotlight,
      backgroundColor: 'gray',
    },
    tooltip: {
      backgroundColor: options.backgroundColor,
      borderRadius: 5,
      boxSizing: 'border-box',
      color: options.textColor,
      fontSize: 16,
      maxWidth: '100%',
      padding: 15,
      position: 'relative',
      width,
    },
    tooltipContainer: {
      lineHeight: 1.4,
      textAlign: 'center',
    },
    tooltipTitle: {
      fontSize: 18,
      margin: 0,
    },
    tooltipContent: {
      padding: '20px 10px',
    },
    tooltipFooter: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 15,
    },
    tooltipFooterSpacer: {
      flex: 1,
    },
    options,
  };

  return deepMerge<Styles>(defaultStyles, mergedStyles);
}
