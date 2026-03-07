import { type MouseEventHandler, useEffect, useRef } from 'react';
import is from 'is-lite';

import { getReactNodeText, noop } from '~/modules/helpers';

import type { BeaconRenderProps, Locale, Props, Simplify, Styles } from '~/types';

type BeaconProps = Simplify<
  Pick<Props, 'beaconComponent' | 'nonce'> &
    BeaconRenderProps & {
      locale: Locale;
      onInteract: MouseEventHandler<HTMLElement>;
      shouldFocus: boolean;
      styles: Styles;
    }
>;

export default function JoyrideBeacon(props: BeaconProps) {
  const {
    beaconComponent,
    continuous,
    index,
    isLastStep,
    locale,
    nonce,
    onInteract,
    shouldFocus,
    size,
    step,
    styles,
  } = props;
  const beaconRef = useRef<HTMLButtonElement | null>(null);

  const hasBeaconComponent = Boolean(beaconComponent);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!is.domElement(beaconRef.current)) {
        console.warn('beacon is not a valid DOM element'); // eslint-disable-line no-console
      }
    }

    if (hasBeaconComponent) {
      return noop;
    }

    if (document.getElementById('joyride-beacon-animation')) {
      return noop;
    }

    const style = document.createElement('style');

    style.id = 'joyride-beacon-animation';

    if (nonce) {
      style.setAttribute('nonce', nonce);
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

    document.head.appendChild(style);

    const focusTimer = setTimeout(() => {
      if (is.domElement(beaconRef.current) && shouldFocus) {
        beaconRef.current.focus();
      }
    }, 0);

    return () => {
      clearTimeout(focusTimer);

      const insertedStyle = document.getElementById('joyride-beacon-animation');

      if (insertedStyle?.parentNode) {
        insertedStyle.parentNode.removeChild(insertedStyle);
      }
    };
  }, [hasBeaconComponent, nonce, shouldFocus]);

  const title = getReactNodeText(locale.open);
  let content;

  if (beaconComponent) {
    const BeaconComponent = beaconComponent;

    content = (
      <BeaconComponent
        continuous={continuous}
        index={index}
        isLastStep={isLastStep}
        size={size}
        step={step}
      />
    );
  } else {
    content = (
      <span style={styles.beacon}>
        <span style={styles.beaconOuter} />
        <span style={styles.beaconInner} />
      </span>
    );
  }

  return (
    <button
      ref={beaconRef}
      aria-label={title}
      className="react-joyride__beacon"
      data-testid="button-beacon"
      onClick={onInteract}
      onMouseEnter={onInteract}
      style={styles.beaconWrapper}
      title={title}
      type="button"
    >
      {content}
    </button>
  );
}
