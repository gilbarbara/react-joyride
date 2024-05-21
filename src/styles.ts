import deepmerge from 'deepmerge';

import { hexToRGB } from './modules/helpers';
import { Props, StepMerged, StylesOptions, StylesWithFloaterStyles } from './types';

const defaultOptions = {
  arrowColor: '#fff',
  backgroundColor: '#fff',
  beaconSize: 36,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  primaryColor: '#f04',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  textColor: '#333',
  width: 380,
  zIndex: 100,
} satisfies StylesOptions;

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
  const { floaterProps, styles } = props;
  const mergedFloaterProps = deepmerge(step.floaterProps ?? {}, floaterProps ?? {});
  const mergedStyles = deepmerge(styles ?? {}, step.styles ?? {});
  const options = deepmerge(defaultOptions, mergedStyles.options || {}) satisfies StylesOptions;
  const hideBeacon = step.placement === 'center' || step.disableBeacon;
  let { width } = options;

  if (window.innerWidth > 480) {
    width = 380;
  }

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
    beacon: {
      ...buttonBase,
      display: hideBeacon ? 'none' : 'inline-block',
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
    overlay: {
      ...overlay,
      backgroundColor: options.overlayColor,
      mixBlendMode: 'hard-light',
    },
    overlayLegacy: {
      ...overlay,
    },
    overlayLegacyCenter: {
      ...overlay,
      backgroundColor: options.overlayColor,
    },
    spotlight: {
      ...spotlight,
      backgroundColor: 'gray',
    },
    spotlightLegacy: {
      ...spotlight,
      boxShadow: `0 0 0 9999px ${options.overlayColor}, ${options.spotlightShadow}`,
    },
    floaterStyles: {
      arrow: {
        color: mergedFloaterProps?.styles?.arrow?.color ?? options.arrowColor,
      },
      options: {
        zIndex: options.zIndex + 100,
      },
    },
    options,
  };

  return deepmerge(defaultStyles, mergedStyles) as StylesWithFloaterStyles;
}
