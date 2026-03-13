import { type CSSProperties, useEffect } from 'react';

import { noop } from '~/modules/helpers';

import type { LoaderRenderProps, Props, Simplify } from '~/types';

type LoaderProps = Simplify<Pick<Props, 'nonce'> & LoaderRenderProps>;

const spinnerStyles: CSSProperties = {
  animation: 'joyride-loader-spin 1s linear infinite',
  border: '5px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '50%',
  borderTopColor: '#555',
};

export default function JoyrideLoader({ nonce, step }: LoaderProps) {
  const { loaderComponent } = step;

  const hasLoaderComponent = Boolean(loaderComponent);

  useEffect(() => {
    if (hasLoaderComponent) {
      return noop;
    }

    if (document.getElementById('joyride-loader-animation')) {
      return noop;
    }

    const style = document.createElement('style');

    style.id = 'joyride-loader-animation';

    if (nonce) {
      style.setAttribute('nonce', nonce);
    }

    style.appendChild(
      document.createTextNode(`
        @keyframes joyride-loader-spin {
          to { transform: rotate(360deg); }
        }
      `),
    );

    document.head.appendChild(style);

    return () => {
      const insertedStyle = document.getElementById('joyride-loader-animation');

      if (insertedStyle?.parentNode) {
        insertedStyle.parentNode.removeChild(insertedStyle);
      }
    };
  }, [hasLoaderComponent, nonce]);

  if (loaderComponent === null) {
    return null;
  }

  const { height, width, ...loaderStyle } = step.styles.loader;

  let content;

  if (loaderComponent) {
    const CustomLoader = loaderComponent;

    content = <CustomLoader step={step} />;
  } else {
    content = (
      <div style={{ ...spinnerStyles, height, width, borderTopColor: step.primaryColor }} />
    );
  }

  return (
    <div className="react-joyride__loader" data-testid="loader" style={loaderStyle}>
      {content}
    </div>
  );
}
