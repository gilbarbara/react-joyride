# Events

You can get Joyride's state changes using the `onEvent` prop.
It will receive an object with the current state.

## Example data

```typescript
{
  action: 'start',
  controlled: true,
  error: null,
  index: 0,
  lifecycle: 'init',
  origin: null,
  scroll: null,
  scrolling: false,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'tour:start',
  waiting: false,
}
```

```typescript
{
  action: 'update',
  controlled: true,
  error: null,
  index: 0,
  lifecycle: 'beacon',
  origin: null,
  scroll: null,
  scrolling: false,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'beacon',
  waiting: false,
}
```

```typescript
{
  action: 'next',
  controlled: true,
  error: null,
  index: 0,
  lifecycle: 'complete',
  origin: null,
  scroll: null,
  scrolling: false,
  size: 4,
  status: 'running',
  step: { /* the current step */ },
  type: 'step:after',
  waiting: false,
}
```

## Event Types

Events fire in this order during a tour:

```
tour:start → step:before_hook → step:before → scroll:start → scroll:end → beacon → tooltip → step:after → step:after_hook → ... → tour:end
```

| Constant | Value | Description |
|----------|-------|-------------|
| `EVENTS.TOUR_START` | `'tour:start'` | The tour started |
| `EVENTS.STEP_BEFORE_HOOK` | `'step:before_hook'` | A step's `beforeStep` hook is executing |
| `EVENTS.STEP_BEFORE` | `'step:before'` | A step is about to display |
| `EVENTS.SCROLL_START` | `'scroll:start'` | Scrolling to the step target started |
| `EVENTS.SCROLL_END` | `'scroll:end'` | Scrolling to the step target finished |
| `EVENTS.BEACON` | `'beacon'` | The beacon is displayed |
| `EVENTS.TOOLTIP` | `'tooltip'` | The tooltip is displayed |
| `EVENTS.STEP_AFTER` | `'step:after'` | A step has ended |
| `EVENTS.STEP_AFTER_HOOK` | `'step:after_hook'` | A step's `afterStep` hook is executing |
| `EVENTS.TOUR_END` | `'tour:end'` | The tour ended |
| `EVENTS.TOUR_STATUS` | `'tour:status'` | The tour status changed |
| `EVENTS.TARGET_NOT_FOUND` | `'error:target_not_found'` | The step target was not found |
| `EVENTS.ERROR` | `'error'` | An error occurred |

## EventData

The `onEvent` callback receives an `EventData` object with these fields:

| Field | Type | Description |
|-------|------|-------------|
| `action` | `string` | The action that updated the state |
| `controlled` | `boolean` | Whether the tour is controlled |
| `error` | `Error \| null` | The error that occurred (populated on ERROR events) |
| `index` | `number` | The current step index |
| `lifecycle` | `string` | The step's lifecycle |
| `origin` | `string \| null` | The origin of the CLOSE action |
| `scroll` | `ScrollData \| null` | Scroll data (populated on SCROLL_START/SCROLL_END events) |
| `scrolling` | `boolean` | Whether the tour is currently scrolling to a target |
| `size` | `number` | The number of steps |
| `status` | `string` | The tour's status |
| `step` | `Step` | The current step |
| `type` | `string` | The type of the event |
| `waiting` | `boolean` | Whether the tour is waiting for a before hook or target polling |

### ScrollData

Populated in `scroll` when the event type is `SCROLL_START` or `SCROLL_END`:

| Field | Type | Description |
|-------|------|-------------|
| `duration` | `number` | The scroll duration in milliseconds |
| `element` | `Element` | The element being scrolled |
| `initial` | `number` | The scroll position before scrolling |
| `target` | `number` | The computed scroll destination |

## Usage

```tsx
import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS, EventData } from 'react-joyride';

const steps = [
  {
    target: '.my-first-step',
    content: 'This is my awesome feature!',
  },
];

export default function App() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideEvent = (data: EventData) => {
    const { action, index, origin, status, type } = data;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      // do something
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // You need to set our running state to false, so we can restart if we click start again.
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
      <Joyride onEvent={handleJoyrideEvent} run={run} stepIndex={stepIndex} steps={steps} />
      <button onClick={handleClickStart}>Start</button>
      // Your code here...
    </div>
  );
}
```

You can read more about the constants [here](constants.md)
