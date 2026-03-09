import type { LoaderRenderProps } from '~/types';

function LoaderComponent({ step }: LoaderRenderProps) {
  return (
    <div
      className="react-joyride__loader"
      data-testid="custom-loader"
      style={{
        alignItems: 'center',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 10001,
      }}
    >
      <span style={{ color: step.primaryColor }}>Loading...</span>
    </div>
  );
}

export default LoaderComponent;
