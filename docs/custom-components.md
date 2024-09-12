# Custom Components

You can use custom components to have complete control of the UI. They will receive data through props and need to be a React class or forwardRef since it needs to set `ref.`

{% hint style="info" %}
If you want to customize the default UI, check the [styling](styling.md) docs.
{% endhint %}

## beaconComponent

### Props

**aria-label** {string}: the _open_ property in the `locale` object.

**onClick** {function}: internal method to call when clicking

**onMouseEnter** {function}: internal method to call when hovering

**title** {string}: the _open_ property in the `locale` object.

**ref** {function}: set the beacon ref

### Example with styled-components

```tsx
import { forwardRef } from 'react';
import Joyride, { BeaconRenderProps } from 'react-joyride';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  55% {
    background-color: rgba(255, 100, 100, 0.9);
    transform: scale(1.6);
  }
`;

const Beacon = styled.span`
  animation: ${pulse} 1s ease-in-out infinite;
  background-color: rgba(255, 27, 14, 0.6);
  border-radius: 50%;
  display: inline-block;
  height: 3rem;
  width: 3rem;
`;

const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>((props, ref) => {
  return <Beacon ref={ref} {...props} />;
});

export function App() {
  return (
    <div>
      <Joyride
        beaconComponent={BeaconComponent}
        // ...
      />
    </div>
  );
}
```

## tooltipComponent

### Props

**continuous** {boolean}: If the tour is continuous or not

**index** {number}: The current step's index

**isLastStep** {boolean}: The name says it all

**size** {number}: The number of steps in the tour

**step** {object}: The current step data

**backProps** {object}: The back button's props

**closeProps** {object}: The close button's props

**primaryProps** {object}: The primary button's props \(Close or Next if the tour is continuous\)

**skipProps** {object}: The skip button's props

**tooltipProps** {object}: The root element props \(including `ref`\)

### Example with css classes

```tsx
import Joyride, { TooltipRenderProps } from 'react-joyride';

function CustomTooltip(props: TooltipRenderProps) {
  const { backProps, closeProps, continuous, index, primaryProps, skipProps, step, tooltipProps } =
    props;

  return (
    <div className="tooltip__body" {...tooltipProps}>
      <button className="tooltip__close" {...closeProps}>
        &times;
      </button>
      {step.title && <h4 className="tooltip__title">{step.title}</h4>}
      <div className="tooltip__content">{step.content}</div>
      <div className="tooltip__footer">
        <button className="tooltip__button" {...skipProps}>
          {skipProps.title}
        </button>
        <div className="tooltip__spacer">
          {index > 0 && (
            <button className="tooltip__button" {...backProps}>
              {backProps.title}
            </button>
          )}
          {continuous && (
            <button className="tooltip__button tooltip__button--primary" {...primaryProps}>
              {primaryProps.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div>
      <Joyride
        tooltipComponent={CustomTooltip}
        // ...
      />
    </div>
  );
}
```
