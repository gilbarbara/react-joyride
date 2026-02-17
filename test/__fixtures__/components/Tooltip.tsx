import { TooltipRenderProps } from '~/types';

function TooltipComponent({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        maxWidth: 400,
        minWidth: 290,
        padding: 18,
        position: 'relative',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <button
        {...closeProps}
        data-test-id="button-close"
        style={{
          backgroundColor: 'transparent',
          borderRadius: 0,
          color: '#000',
          display: 'inline-flex',
          fontSize: 24,
          padding: 8,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        type="button"
      >
        <svg
          height="24px"
          version="1.1"
          viewBox="0 0 24 24"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>close</title>
          <g>
            <path
              d="M20.5559921,3.44400795 C20.9855688,3.87358467 20.9855688,4.57006615 20.5559921,4.99964287 L13.5548254,11.9998254 L20.5559921,19.0003571 C20.9855688,19.4299339 20.9855688,20.1264153 20.5559921,20.5559921 C20.1264153,20.9855688 19.4299339,20.9855688 19.0003571,20.5559921 L11.9998254,13.5548254 L4.99964287,20.5559921 C4.57006615,20.9855688 3.87358467,20.9855688 3.44400795,20.5559921 C3.01443123,20.1264153 3.01443123,19.4299339 3.44400795,19.0003571 L10.4438254,11.9998254 L3.44400795,4.99964287 C3.01443123,4.57006615 3.01443123,3.87358467 3.44400795,3.44400795 C3.87358467,3.01443123 4.57006615,3.01443123 4.99964287,3.44400795 L11.9998254,10.4438254 L19.0003571,3.44400795 C19.4299339,3.01443123 20.1264153,3.01443123 20.5559921,3.44400795 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </button>
      <main style={{ padding: 12 }}>
        {step.title && <h3 style={{ marginTop: 0 }}>{step.title}</h3>}
        {step.content && <div>{step.content}</div>}
      </main>
      <footer
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 12,
        }}
      >
        {!isLastStep && (
          <div style={{ display: 'flex', flex: 1 }}>
            <button
              {...skipProps}
              data-test-id="button-skip"
              style={{ backgroundColor: 'transparent', color: '#555', padding: 0 }}
              type="button"
            >
              {skipProps.title}
            </button>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          {index > 0 && (
            <button {...backProps} data-test-id="button-back" type="button">
              {backProps.title}
            </button>
          )}
          <button {...primaryProps} data-test-id="button-primary" type="button">
            {primaryProps.title}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default TooltipComponent;
