import * as React from 'react';
import innerText from 'react-innertext';
import is from 'is-lite';

import { BeaconProps } from '~/types';

export default class JoyrideBeacon extends React.Component<BeaconProps> {
  private beacon: HTMLElement | null = null;

  constructor(props: BeaconProps) {
    super(props);

    if (props.beaconComponent) {
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
  }

  componentDidMount() {
    const { shouldFocus } = this.props;

    if (process.env.NODE_ENV !== 'production') {
      if (!is.domElement(this.beacon)) {
        console.warn('beacon is not a valid DOM element'); // eslint-disable-line no-console
      }
    }

    setTimeout(() => {
      if (is.domElement(this.beacon) && shouldFocus) {
        this.beacon.focus();
      }
    }, 0);
  }

  componentWillUnmount() {
    const style = document.getElementById('joyride-beacon-animation');

    if (style?.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  setBeaconRef = (c: HTMLElement | null) => {
    this.beacon = c;
  };

  render() {
    const {
      beaconComponent,
      continuous,
      index,
      isLastStep,
      locale,
      onClickOrHover,
      size,
      step,
      styles,
    } = this.props;
    const title = is.string(locale.open) ? locale.open : innerText(locale.open);
    const sharedProps = {
      'aria-label': title,
      onClick: onClickOrHover,
      onMouseEnter: onClickOrHover,
      ref: this.setBeaconRef,
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
}
