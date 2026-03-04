import { CSSProperties, useEffect } from 'react';

import { noop } from '~/modules/helpers';

import { LoaderRenderProps } from '~/types';

const loaderStyles: Record<string, CSSProperties> = {
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 10001,
  },
  spinner: {
    animation: 'joyride-loader-spin 1s linear infinite',
    border: '5px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTopColor: '#555',
    height: 48,
    width: 48,
  },
};

export default function JoyrideLoader({ nonce, step }: LoaderRenderProps) {
  const { loaderComponent, styles } = step;

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

  if (loaderComponent) {
    const CustomLoader = loaderComponent;

    return <CustomLoader step={step} />;
  }

  return (
    <div className="react-joyride__loader" data-testid="loader" style={loaderStyles.wrapper}>
      <div style={{ ...loaderStyles.spinner, borderTopColor: styles.options.primaryColor }} />
    </div>
  );
}
