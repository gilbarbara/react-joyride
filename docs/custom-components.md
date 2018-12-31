# Custom components

When you set custom components to have complete control of the UI.  
They will receive data through props.

> If you are looking to customize the default UI, check the [styling](styling.md) docs.

## beaconComponent

#### Props

**aria-label** {string}: from the `locale.open` prop

**onClick** {function}: internal method to call when clicking

**onMouseEnter** {function}: internal method to call when hovering

**title** {string}: from the `locale.open` prop



#### Example with styled-components

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

#### Props

**continuous** {boolean}: If the tour is continuous or not

**index** {number}: The current step's index.

**isLastStep** {boolean}: The name says it all

**setTooltipRef** {function}: Set the ref for your component

**size** {number}: The number of steps in the tour.

**step** {object}: The current step data.

**backProps** {object}: The back button's props

**closeProps** {object}: The close button's props

**primaryProps** {object}: The primary button's props (Close or Next if the tour is continuous)

**skipProps** {object}: The skip button's props



#### Example with styled-components

```jsx
const Tooltip = ({
  continuous,
  backProps,
  closeProps,
  index,
  primaryProps,
  setTooltipRef,
  step,
}) => (
  <TooltipBody ref={setTooltipRef}>
    {step.title && <TooltipTitle>{step.title}</TooltipTitle>}
    {step.content && <TooltipContent>{step.content}</TooltipContent>}
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

