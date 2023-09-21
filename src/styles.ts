import deepmerge from 'deepmerge';
import { PartialDeep } from 'type-fest';

import { hexToRGB } from './modules/helpers';
import { Styles, StylesOptions } from './types';

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
  WebkitAppearance: 'none' as const,
};

const spotlight = {
  borderRadius: 4,
  position: 'absolute' as const,
};

export default function getStyles(
  propsStyles?: PartialDeep<Styles>,
  stepStyles?: PartialDeep<Styles>,
) {
  const mergedStyles = deepmerge(propsStyles ?? {}, stepStyles ?? {});
  const options = deepmerge(defaultOptions, mergedStyles.options || {}) satisfies StylesOptions;
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
    position: 'absolute' as const,
    right: 0,
    top: 0,
    zIndex: options.zIndex,
  };

  const defaultStyles = {
    beacon: {
      ...buttonBase,
      display: 'inline-block',
      height: options.beaconSize,
      position: 'relative' as const,
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
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
    },
    beaconOuter: {
      animation: 'joyride-beacon-outer 1.2s infinite ease-in-out',
      backgroundColor: `rgba(${hexToRGB(options.primaryColor).join(',')}, 0.2)`,
      border: `2px solid ${options.primaryColor}`,
      borderRadius: '50%',
      boxSizing: 'border-box' as const,
      display: 'block',
      height: '100%',
      left: 0,
      opacity: 0.9,
      position: 'absolute' as const,
      top: 0,
      transformOrigin: 'center',
      width: '100%',
    },
    tooltip: {
      backgroundColor: options.backgroundColor,
      borderRadius: 5,
      boxSizing: 'border-box' as const,
      color: options.textColor,
      fontSize: 16,
      maxWidth: '100%',
      padding: 15,
      position: 'relative' as const,
      width,
    },
    tooltipContainer: {
      lineHeight: 1.4,
      textAlign: 'center' as const,
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
      position: 'absolute' as const,
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
      mixBlendMode: 'hard-light' as const,
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
        color: options.arrowColor,
      },
      options: {
        zIndex: options.zIndex + 100,
      },
    },
    options,
  };

  return deepmerge(defaultStyles, mergedStyles);
}
