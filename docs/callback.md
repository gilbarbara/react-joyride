# Callback

You can get Joyride's state changes using the `callback` prop.  
It will receive an object with the current state.

## Example data

```javascript
{
  action: 'start',
  controlled: true,
  index: 0,
  lifecycle: 'init',
  origin: null,
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'tour:start',
}
```

```javascript
{
  action: 'update',
  controlled: true,
  index: 0,
  lifecycle: 'beacon',
  origin: null,
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'beacon',
}
```

```javascript
{
  action: 'next',
  controlled: true,
  index: 0,
  lifecycle: 'complete',
  origin: null,
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'step:after',
}
```

## Usage

```jsx
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS } from 'react-joyride';

export class App extends React.Component {
  state = {
    run: false,
      steps: [
      {
        target: '.my-first-step',
        content: 'This is my awesome feature!',
      },
    ],
    stepIndex: 0, // a controlled tour
  };

  handleJoyrideCallback = data => {
    const { action, index, origin, status, type } = data;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      // do something
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
    else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

  render () {
    const { run, stepIndex, steps } = this.state;

    return (
      <div className="app">
        <Joyride
          callback={this.handleJoyrideCallback}
          run={run}
          stepIndex={stepIndex}
          steps={steps}
          ...
        />
        ...
      </div>
    );
  }
}
```

You can read more about the constants [here](constants.md)
