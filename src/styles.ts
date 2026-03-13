import { deepMerge, hexToRGB } from '~/modules/helpers';

import type { Props, StepMerged, Styles } from '~/types';

const buttonReset = {
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: 0,
  color: '#555555',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
  WebkitAppearance: 'none',
};

const buttonBase = {
  ...buttonReset,
  borderRadius: 4,
  padding: 8,
};

export default function getStyles(props: Props, step: StepMerged) {
  const { styles } = props;
  const mergedStyles = deepMerge<Styles>(styles ?? {}, step.styles ?? {});
  let { width } = step;

  if (width !== undefined) {
    width = typeof width === 'number' && window.innerWidth < width ? window.innerWidth - 30 : width;
  }

  const overlay = {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: step.zIndex,
  };

  const defaultStyles = {
    arrow: {
      alignItems: 'center',
      color: step.arrowColor,
      display: 'inline-flex',
      justifyContent: 'center',
      position: 'absolute',
    },
    beaconWrapper: {
      ...buttonReset,
      display: 'inline-flex',
      borderRadius: '50%',
      position: 'relative',
    },
    beacon: {
      height: step.beaconSize,
      width: step.beaconSize,
    },
    beaconInner: {
      animation: 'joyride-beacon-inner 1.2s infinite ease-in-out',
      backgroundColor: step.primaryColor,
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
      backgroundColor: `rgba(${hexToRGB(step.primaryColor).join(',')}, 0.2)`,
      border: `2px solid ${step.primaryColor}`,
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
    buttonBack: {
      ...buttonBase,
      color: step.primaryColor,
      marginLeft: 'auto',
      marginRight: 5,
    },
    buttonClose: {
      ...buttonBase,
      color: step.textColor,
      height: 12,
      padding: 8,
      position: 'absolute',
      right: 0,
      top: 0,
      width: 12,
    },
    buttonPrimary: {
      ...buttonBase,
      backgroundColor: step.primaryColor,
      color: step.backgroundColor,
    },
    buttonSkip: {
      ...buttonBase,
      color: step.textColor,
      fontSize: 14,
    },
    floater: {
      display: 'inline-block',
      filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
      maxWidth: '100%',
      transition: 'opacity 0.3s',
    },
    loader: {
      alignItems: 'center',
      display: 'flex',
      height: 48,
      inset: 0,
      justifyContent: 'center',
      pointerEvents: 'none',
      position: 'fixed',
      width: 48,
      zIndex: step.zIndex + 1,
    },
    overlay: {
      ...overlay,
      backgroundColor: step.overlayColor,
    },
    tooltip: {
      backgroundColor: step.backgroundColor,
      borderRadius: 5,
      boxSizing: 'border-box',
      color: step.textColor,
      fontSize: 16,
      maxWidth: '100%',
      padding: 12,
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
      paddingBottom: 12,
      paddingTop: 12,
    },
    tooltipFooter: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    tooltipFooterSpacer: {
      flex: 1,
    },
  };

  return deepMerge<Styles>(defaultStyles, mergedStyles);
}
