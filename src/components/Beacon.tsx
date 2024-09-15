import { useRef } from 'react';
import { useMount, useSingleton, useUnmount } from '@gilbarbara/hooks';
import is from 'is-lite';

import { getReactNodeText } from '~/modules/helpers';

import { BeaconProps } from '~/types';

export default function JoyrideBeacon(props: BeaconProps) {
  const {
    beaconComponent,
    continuous,
    index,
    isLastStep,
    locale,
    onClickOrHover,
    shouldFocus,
    size,
    step,
    styles,
  } = props;
  const beaconRef = useRef<HTMLElement | null>(null);

  useSingleton(() => {
    if (beaconComponent) {
      return;
    }

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.id = 'joyride-beacon-animation';

    if (props.nonce) {
      style.setAttribute('nonce', props.nonce);
    }

    const css = `
        @keyframes joyride-beacon-inner {
          20% {
            opacity: 0.9;
          }
        
          90% {
            opacity: 0.7;
          }
        }
        
        @keyframes joyride-beacon-outer {
          0% {
            transform: scale(1);
          }
        
          45% {
            opacity: 0.7;
            transform: scale(0.75);
          }
        
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
      `;

    style.appendChild(document.createTextNode(css));

    head.appendChild(style);
  });

  useMount(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!is.domElement(beaconRef.current)) {
        console.warn('beacon is not a valid DOM element'); // eslint-disable-line no-console
      }
    }

    setTimeout(() => {
      if (is.domElement(beaconRef.current) && shouldFocus) {
        beaconRef.current.focus();
      }
    }, 0);
  });

  useUnmount(() => {
    const style = document.getElementById('joyride-beacon-animation');

    if (style?.parentNode) {
      style.parentNode.removeChild(style);
    }
  });

  const setBeaconRef = (el: HTMLElement | null) => {
    beaconRef.current = el;
  };

  const title = getReactNodeText(locale.open);
  const sharedProps = {
    'aria-label': title,
    onClick: onClickOrHover,
    onMouseEnter: onClickOrHover,
    ref: setBeaconRef,
    title,
  };
  let component;

  if (beaconComponent) {
    const BeaconComponent = beaconComponent;

    component = (
      <BeaconComponent
        continuous={continuous}
        index={index}
        isLastStep={isLastStep}
        size={size}
        step={step}
        {...sharedProps}
      />
    );
  } else {
    component = (
      <button
        key="JoyrideBeacon"
        className="react-joyride__beacon"
        data-test-id="button-beacon"
        style={styles.beacon}
        type="button"
        {...sharedProps}
      >
        <span style={styles.beaconInner} />
        <span style={styles.beaconOuter} />
      </button>
    );
  }

  return component;
}
