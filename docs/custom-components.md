# Custom Components

You can use custom components to have complete control of the UI. They will receive data through props and need to be a React class or forwardRef since it needs to set `ref`

> If you are looking to customize the default UI, check the [styling](styling.md) docs.

## beaconComponent

### Props

**aria-label** {string}: the _open_ property in the `locale` object.

**onClick** {function}: internal method to call when clicking

**onMouseEnter** {function}: internal method to call when hovering

**title** {string}: the _open_ property in the `locale` object.

**ref** {function}: set the beacon ref

### Example with styled-components

```jsx
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

const BeaconComponent = props => <Beacon {...props} />;

export () => (
  <div>
    <ReactJoyride
      beaconComponent={BeaconComponent}
      ...
    />
  </div>
);
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

### Example with styled-components

```jsx
const Tooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}) => (
  <TooltipBody {...tooltipProps}>
    {step.title && <TooltipTitle>{step.title}</TooltipTitle>}
    <TooltipContent>{step.content}</TooltipContent>
    <TooltipFooter>
      {index > 0 && (
        <Button {...backProps}>
          <FormattedMessage id="back" />
        </Button>
      )}
      {continuous && (
        <Button {...primaryProps}>
          <FormattedMessage id="next" />
        </Button>
      )}
      {!continuous && (
        <Button {...closeProps}>
          <FormattedMessage id="close" />
        </Button>
      )}
    </TooltipFooter>
  </TooltipBody>
);

export () => (
  <div>
    <ReactJoyride
      tooltipComponent={Tooltip}
      ...
    />
  </div>
);
```

