# Callback

You can get Joyride's state changes using the `callback` prop.  
It will receive an object with the current state.

## Example data

```typescript
{
  action: 'start',
  controlled: true,
  index: 0,
  lifecycle: 'init',
  origin: null,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'tour:start'
}
```

```typescript
{
  action: 'update',
  controlled: true,
  index: 0,
  lifecycle: 'beacon',
  origin: null,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'beacon'
}
```

```typescript
{
  action: 'next',
  controlled: true,
  index: 0,
  lifecycle: 'complete',
  origin: null,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'step:after'
}
```

## Usage

```tsx
import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS, CallBackProps } from 'react-joyride';

const steps = [
  {
    target: '.my-first-step',
    content: 'This is my awesome feature!',
  },
];

export default function App() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, origin, status, type } = data;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      // do something
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

  const handleClickStart = () => {
    setRun(true);
  };

  return (
    <div>
      <Joyride callback={handleJoyrideCallback} run={run} stepIndex={stepIndex} steps={steps} />
      <button onClick={handleClickStart}>Start</button>
      // Your code here...
    </div>
  );
}
```

You can read more about the constants [here](constants.md)
